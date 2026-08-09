'use client';

import React, { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import dataset from '@/data/dataset.json';
import { HoldingNode, BrandNode, ManufacturerNode } from './CustomNodes';
import CustomEdge from './CustomEdge';
import { GraphNodeData } from '@/data/types';
import { FilterContext, FilterType } from '@/contexts/FilterContext';

const nodeTypes = {
  holding: HoldingNode,
  brand: BrandNode,
  manufacturer: ManufacturerNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

// ─── Lookup tables (built once at module level) ─────────────────────────────

function buildChildMap(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  dataset.edges.forEach(e => {
    const list = map.get(e.source) || [];
    if (!list.includes(e.target)) list.push(e.target);
    map.set(e.source, list);
  });
  dataset.nodes.forEach(n => {
    if (n.type === 'brand' && 'parentId' in n && n.parentId) {
      const list = map.get(n.parentId) || [];
      if (!list.includes(n.id)) list.push(n.id);
      map.set(n.parentId, list);
    }
  });
  return map;
}

function buildBrandAccentMap(): Map<string, string> {
  const holdingAccents: Record<string, string> = {
    'h-beko':       '#0d9488',
    'h-bsh':        '#3b82f6',
    'h-haier':      '#ef4444',
    'h-electrolux': '#6366f1',
    'h-hisense':    '#22c55e',
    'h-amica':      '#16a34a',
    'h-vestel':     '#f59e0b',
    'h-samsung':    '#1d4ed8',
    'h-lg':         '#dc2626',
    'h-pl-ind':     '#b91c1c',
    'h-it-ind':     '#059669',
    'h-de-ind':     '#ca8a04',
    'h-jp-ind':     '#be123c',
    'h-cn-ind':     '#ea580c',
    'h-other-ind':  '#475569',
    'h-market':     '#64748b',
  };
  const map = new Map<string, string>();
  dataset.nodes.forEach(n => {
    if (n.type === 'brand' && 'parentId' in n && n.parentId) {
      map.set(n.id, holdingAccents[n.parentId] ?? '#64748b');
    }
  });
  return map;
}

const childMap = buildChildMap();
const brandAccentMap = buildBrandAccentMap();

// ─── Component ──────────────────────────────────────────────────────────────

interface GraphMapProps {
  activeFilter?: FilterType;
  showOEM?: boolean;
  selectedNodes?: GraphNodeData[];
  onNodeSelect?: (node: GraphNodeData, multi: boolean) => void;
}

export default function GraphMap({ activeFilter = 'all', showOEM = false, selectedNodes = [], onNodeSelect }: GraphMapProps) {
  const { fitView, getViewport, setViewport } = useReactFlow();
  const savedViewportRef = useRef<any>(null);
  const childOffsetsRef = useRef<Map<string, { dx: number; dy: number }>>(new Map());
  const draggedHoldingId = useRef<string | null>(null);
  const manualPositionsRef = useRef<Map<string, { x: number; y: number }>>(new Map());
  
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set());
  const [recentNews, setRecentNews] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => setRecentNews(data))
      .catch(console.error);
  }, []);

  // Listen to external selection (like searches and Quick Jump) to expand and zoom
  useEffect(() => {
    if (selectedNodes && selectedNodes.length > 0) {
      const target = selectedNodes[selectedNodes.length - 1]; // most recent
      // Auto-expand its parent if it's a brand
      if (target.type === 'brand' && 'parentId' in target && target.parentId) {
        setExpandedHoldings(prev => {
          if (prev.has(target.parentId as string)) return prev;
          const next = new Set(prev);
          savedViewportRef.current = getViewport();
          next.add(target.parentId as string);
          return next;
        });
        setTimeout(() => fitView({ nodes: [{ id: target.id }], duration: 800, padding: 0.8 }), 100);
      } else if (target.type === 'holding') {
        setExpandedHoldings(prev => {
          if (prev.has(target.id)) return prev;
          const next = new Set(prev);
          savedViewportRef.current = getViewport();
          next.add(target.id);
          return next;
        });
        setTimeout(() => fitView({ nodes: [{ id: target.id }], duration: 800, padding: 0.8 }), 100);
      }
    }
  }, [selectedNodes, fitView]);

  // Layout generation depends on expandedHoldings and showOEM
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const holdings = dataset.nodes.filter(n => n.type === 'holding');
    const brands = dataset.nodes.filter(n => n.type === 'brand');

    if (!showOEM) {
      // GALACTIC LAYOUT sorted by child count
      const holdingChildCount = new Map<string, number>();
      holdings.forEach(h => {
        const childIds = childMap.get(h.id) || [];
        holdingChildCount.set(h.id, childIds.length);
      });

      const sortedHoldings = [...holdings].sort((a, b) => {
        return (holdingChildCount.get(b.id) || 0) - (holdingChildCount.get(a.id) || 0);
      });

      const isAnyExpanded = expandedHoldings.size > 0;
      // "The Pusher": rozwinięty koncern potrzebuje miejsca na swoje marki,
      // ale gdy wszystko jest zwinięte, orbity były rozdmuchane do rozmiarów
      // z najgorszego przypadku — mapa zajmowała 7800 px zamiast ~4000, więc
      // na telefonie trzeba było odjechać tak daleko, że kafle stawały się
      // nieczytelnymi kropkami.
      const pusherMultiplier = isAnyExpanded ? 2.2 : 1.0;

      let currentOrbit = 0;
      let capacityInOrbit = 1;
      let placedInOrbit = 0;

      sortedHoldings.forEach((holding, index) => {
        if (placedInOrbit >= capacityInOrbit) {
          currentOrbit++;
          capacityInOrbit = currentOrbit === 0 ? 1 : currentOrbit * 6; // 1, 6, 12, 18
          placedInOrbit = 0;
        }

        let hX = 0;
        let hY = 0;
        const manualPos = manualPositionsRef.current.get(holding.id);

        if (manualPos) {
          hX = manualPos.x;
          hY = manualPos.y;
        } else if (currentOrbit === 0) {
          hX = 0;
          hY = 0;
        } else {
          const baseRadius = currentOrbit * 560 * pusherMultiplier;
          // Offset angle to avoid straight lines over the center
          const angleOffset = currentOrbit % 2 === 0 ? Math.PI / capacityInOrbit : 0;
          const angle = (placedInOrbit / capacityInOrbit) * 2 * Math.PI + angleOffset;
          hX = Math.cos(angle) * baseRadius;
          hY = Math.sin(angle) * baseRadius;
        }

        placedInOrbit++;

        const isExpanded = expandedHoldings.has(holding.id);
        
        nodes.push({
          id: holding.id,
          type: 'holding',
          position: { x: hX, y: hY },
          data: { 
            ...holding, 
            isExpanded,
            anyExpanded: isAnyExpanded 
          },
          zIndex: 10,
        });

        if (isExpanded) {
          const childIds = childMap.get(holding.id) || [];
          const holdingBrands = brands.filter(b => childIds.includes(b.id));

          if (holdingBrands.length > 10) {
            // COMPACT GRID layout for large groups
            const columns = 5;
            const cellW = 110;
            const cellH = 110;
            const gap = 15;
            const stepW = cellW + gap;
            const stepH = cellH + gap;
            
            const totalW = (Math.min(holdingBrands.length, columns) - 1) * stepW;
            const startX = hX - totalW / 2;
            const startY = hY + 160;

            holdingBrands.forEach((brand, bIndex) => {
              const bCol = bIndex % columns;
              const bRow = Math.floor(bIndex / columns);
              const bX = startX + bCol * stepW;
              const bY = startY + bRow * stepH;

              nodes.push({
                id: brand.id,
                type: 'brand',
                position: { x: bX, y: bY },
                data: {
                  ...brand,
                  accentColor: brandAccentMap.get(brand.id) ?? '#64748b',
                  isGrid: true, // No edges to group container
                  hasRecentNews: recentNews.some(news => news.relatedBrands?.includes(brand.id)),
                },
                zIndex: 5,
              });
            });
          } else {
            // RADIAL layout
            const radius = 330;
            holdingBrands.forEach((brand, bIndex) => {
              const angle = (bIndex / holdingBrands.length) * 2 * Math.PI - Math.PI / 2;
              const bX = hX + radius * Math.cos(angle);
              const bY = hY + radius * Math.sin(angle);

              nodes.push({
                id: brand.id,
                type: 'brand',
                position: { x: bX, y: bY },
                data: {
                  ...brand,
                  accentColor: brandAccentMap.get(brand.id) ?? '#64748b',
                  isGrid: false,
                  hasRecentNews: recentNews.some(news => news.relatedBrands?.includes(brand.id)),
                },
                zIndex: 5,
              });
               
              const storedEdge = dataset.edges.find(e => e.source === holding.id && e.target === brand.id);
              edges.push({
                id: `e-${holding.id}-${brand.id}`,
                source: holding.id,
                target: brand.id,
                label: storedEdge?.label || '',
                type: 'custom',
              });
            });
          }
        }
      });
      
    } else {
      // OEM MODE
      // Producentem bywa nie tylko węzeł 'manufacturer' — część marek wskazuje
      // w producedBy koncern oznaczony isOEM (np. h-beko, h-vestel).
      const producers = dataset.nodes.filter(
        n => n.type === 'manufacturer' || (n.type === 'holding' && 'isOEM' in n && n.isOEM)
      );

      const manufacturerChildren = new Map<string, typeof brands>();
      producers.forEach(m => manufacturerChildren.set(m.id, []));

      brands.forEach(b => {
        if ('producedBy' in b && Array.isArray(b.producedBy) && b.producedBy.length > 0) {
          b.producedBy.forEach(producerId => {
            if (manufacturerChildren.has(producerId)) {
              manufacturerChildren.get(producerId)?.push(b);
            }
          });
        }
      });

      // Najwięksi producenci najpierw — trafiają do środka.
      const sortedProducers = [...producers].sort(
        (a, b) => (manufacturerChildren.get(b.id)?.length || 0) - (manufacturerChildren.get(a.id)?.length || 0)
      );

      // 300 + marki*20 dawało 320 px promienia nawet dla jednej marki, a takich
      // klastrów jest 42 z 61 — stąd morze pustki. Skalujemy od realnej liczby
      // dzieci; przy 9 markach obwód i tak daje ~300 px na markę.
      const clusterRadius = (id: string) =>
        Math.min(560, 150 + (manufacturerChildren.get(id)?.length || 0) * 32);

      /** Średnica klastra wraz z szerokością samego kafla marki. */
      const clusterSpan = (id: string) => clusterRadius(id) * 2 + 120;

      // Sztywna siatka rezerwowała każdemu producentowi tyle samo miejsca,
      // a 42 z 61 klastrów ma tylko jedną markę — z czego robił się rzadki
      // kwadrat złożony głównie z pustki. Orbity pakują to ciaśniej i są
      // spójne z układem mapy głównej.
      const orbits: (typeof sortedProducers)[] = [];
      for (let i = 0, level = 0; i < sortedProducers.length; level++) {
        const capacity = level === 0 ? 1 : level * 6;
        orbits.push(sortedProducers.slice(i, i + capacity));
        i += capacity;
      }

      // Promień każdej orbity musi pomieścić obwodowo swoje klastry i nie
      // wejść w poprzedni pierścień.
      let prevRadius = 0;
      let prevSpan = 0;
      const orbitRadii = orbits.map((members, level) => {
        const maxSpan = Math.max(...members.map(m => clusterSpan(m.id)));
        if (level === 0) {
          prevSpan = maxSpan;
          return 0;
        }
        const byCircumference = (members.length * maxSpan * 1.1) / (2 * Math.PI);
        // Pierścienie są przesunięte o pół kroku, więc sąsiedzi z kolejnej
        // orbity zazębiają się kątowo — pełna suma promieni jest tu zbyt
        // ostrożna i rozdmuchiwała układ.
        const byPreviousRing = prevRadius + Math.max(maxSpan, prevSpan) * 0.82;
        const radius = Math.max(byCircumference, byPreviousRing);
        prevRadius = radius;
        prevSpan = maxSpan;
        return radius;
      });

      const placed = orbits.flatMap((members, level) =>
        members.map((m, slot) => {
          const radius = orbitRadii[level];
          // Co drugi pierścień obrócony o pół kroku, żeby klastry nie
          // układały się w promieniste korytarze.
          const offset = level % 2 === 0 ? Math.PI / Math.max(members.length, 1) : 0;
          const angle = (slot / Math.max(members.length, 1)) * 2 * Math.PI + offset;
          return {
            producer: m,
            x: level === 0 ? 0 : Math.cos(angle) * radius,
            y: level === 0 ? 0 : Math.sin(angle) * radius,
          };
        })
      );

      placed.forEach(({ producer: m, x: mX, y: mY }) => {

        nodes.push({
          id: m.id,
          type: 'manufacturer',
          position: { x: mX, y: mY },
          data: { ...m },
          zIndex: 15,
        });

        const kids = manufacturerChildren.get(m.id) || [];
        const radius = clusterRadius(m.id);

        kids.forEach((brand, bIndex) => {
          const angle = (bIndex / kids.length) * 2 * Math.PI;
          
          const uniqueBrandId = `oem-${m.id}-${brand.id}`;

          // initial position
          const bX = mX + radius * Math.cos(angle);
          const bY = mY + radius * Math.sin(angle);

          nodes.push({
            id: uniqueBrandId, 
            type: 'brand',
            position: { x: bX, y: bY },
            data: {
               ...brand,
               realId: brand.id, // id węzła jest tu prefiksowane, oryginał trzymamy obok
               accentColor: '#d946ef',
               isOEMMode: true
            },
            zIndex: 10,
          });

          edges.push({
            id: `e-${m.id}-${uniqueBrandId}`,
            source: m.id,
            target: uniqueBrandId,
            label: 'Zakład',
            type: 'custom',
            animated: true,
            style: { stroke: '#d946ef', strokeWidth: 2, strokeDasharray: '5 5' },
          });
        });
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
    // recentNews dociera asynchronicznie — bez niego w zależnościach znaczniki
    // "świeży news" liczyłyby się z pustej tablicy i nigdy nie zapalały.
  }, [showOEM, expandedHoldings, recentNews]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Layout updates
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  // Center on map change initially or when OEM toggled
  useEffect(() => {
    setTimeout(() => {
      fitView({ duration: 800, padding: 0.1 });
    }, 50);
  }, [showOEM, fitView]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge({ ...params, type: 'custom' }, eds)),
    [setEdges],
  );

  const handleNodeClick = useCallback((e: React.MouseEvent, node: Node) => {
    if (!showOEM && node.type === 'holding') {
      setExpandedHoldings(prev => {
        const next = new Set(prev);
        if (next.has(node.id)) {
          next.delete(node.id);
          if (savedViewportRef.current) {
            setTimeout(() => setViewport(savedViewportRef.current, { duration: 800 }), 50);
          } else {
            setTimeout(() => fitView({ duration: 800, padding: 0.8 }), 50);
          }
        }
        else {
          savedViewportRef.current = getViewport();
          next.add(node.id);
        }
        return next;
      });
    }
    
    // W trybie OEM id węzła jest prefiksowane (oem-<producent>-<marka>), więc
    // oryginalne id bierzemy z data — rozbijanie stringa po myślnikach gubiło je,
    // gdy id producenta miało więcej niż dwa człony.
    let realData = node.data;
    if (node.id.startsWith('oem-')) {
      const realId = node.data.realId as string | undefined;
      const found = dataset.nodes.find(n => n.id === realId);
      if (found) realData = found as any;
    }
    
    onNodeSelect?.(realData as unknown as GraphNodeData, e.shiftKey);
  }, [onNodeSelect, showOEM]);

  // ── DragStart ────────────────────────────────────────────────────────────
  const handleNodeDragStart = useCallback((_e: React.MouseEvent, node: Node) => {
    if (node.type !== 'holding') return;
    draggedHoldingId.current = node.id;

    const childIds = childMap.get(node.id) || [];
    const offsets = new Map<string, { dx: number; dy: number }>();

    setNodes(current => {
      const hPos = current.find(n => n.id === node.id)?.position;
      if (!hPos) return current;
      childIds.forEach(cid => {
        const child = current.find(n => n.id === cid);
        if (child) {
          offsets.set(cid, { dx: child.position.x - hPos.x, dy: child.position.y - hPos.y });
        }
      });
      childOffsetsRef.current = offsets;
      return current;
    });
  }, [setNodes]);

  // ── Drag: LERP brands each mousemove ─────────────────────────────────────
  const handleNodeDrag = useCallback((_e: React.MouseEvent, node: Node) => {
    if (node.type !== 'holding' || !draggedHoldingId.current) return;

    const offsets = childOffsetsRef.current;
    if (offsets.size === 0) return;

    const hx = node.position.x;
    const hy = node.position.y;
    const LERP = 0.15;

    setNodes(current =>
      current.map(n => {
        const offset = offsets.get(n.id);
        if (!offset) return n;

        const targetX = hx + offset.dx;
        const targetY = hy + offset.dy;

        // Apply smooth following
        return {
          ...n,
          position: {
            x: n.position.x + (targetX - n.position.x) * LERP,
            y: n.position.y + (targetY - n.position.y) * LERP,
          },
        };
      })
    );
  }, [setNodes]);

  // ── DragStop: snap to exact position ─────────────────────────────────────
  const handleNodeDragStop = useCallback((_e: React.MouseEvent, node: Node) => {
    manualPositionsRef.current.set(node.id, { x: node.position.x, y: node.position.y });
    
    if (node.type !== 'holding') { draggedHoldingId.current = null; return; }

    const offsets = childOffsetsRef.current;
    const hx = node.position.x;
    const hy = node.position.y;

    setNodes(current =>
      current.map(n => {
        const offset = offsets.get(n.id);
        if (!offset) return n;
        const newPos = { x: hx + offset.dx, y: hy + offset.dy };
        manualPositionsRef.current.set(n.id, newPos);
        return { ...n, position: newPos };
      }),
    );

    draggedHoldingId.current = null;
    childOffsetsRef.current = new Map();
  }, [setNodes]);

  // Unoszenie się marek robi teraz CSS (klasa .node-float w globals.css).
  // Wcześniej stała pętla requestAnimationFrame wołała setNodes 60 razy na
  // sekundę, budując nową tablicę wszystkich węzłów w każdej klatce — przy 200
  // węzłach to 12 000 obiektów i 12 000 rekoncyliacji Reacta na sekundę,
  // niezależnie od tego, czy ktokolwiek dotykał mapy.

  // Kontener miał min-h-[90vh], co rozpychało go ponad wysokość rodzica —
  // na mobilce wypychało stopkę i przyciski poza ekran. Rodzic ma już h-full.
  return (
      <div className="w-full h-full relative bg-transparent">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onNodeDragStart={handleNodeDragStart}
          onNodeDrag={handleNodeDrag}
          onNodeDragStop={handleNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          minZoom={0.04}
          maxZoom={5.0}
          className="border-none"
        >
          <Background variant={BackgroundVariant.Dots} gap={32} size={1} color="#e2e8f0" />
          <Controls className="bg-white border-slate-200 shadow-sm" />
        </ReactFlow>
      </div>
  );
}
