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
  const { fitView } = useReactFlow();
  
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set());

  // Listen to external selection (like searches) to expand the relevant holding
  useEffect(() => {
    if (selectedNodes && selectedNodes.length > 0) {
      const target = selectedNodes[selectedNodes.length - 1]; // most recent
      // Auto-expand its parent if it's a brand
      if (target.type === 'brand' && 'parentId' in target && target.parentId) {
        setExpandedHoldings(prev => {
          if (prev.has(target.parentId as string)) return prev;
          const next = new Set(prev);
          next.add(target.parentId as string);
          return next;
        });
      } else if (target.type === 'holding') {
        setExpandedHoldings(prev => {
          if (prev.has(target.id)) return prev;
          const next = new Set(prev);
          next.add(target.id);
          return next;
        });
      }
    }
  }, [selectedNodes]);

  // Layout generation depends on expandedHoldings and showOEM
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const holdings = dataset.nodes.filter(n => n.type === 'holding');
    const brands = dataset.nodes.filter(n => n.type === 'brand');

    if (!showOEM) {
      const maxPerRow = 3;
      const hSpacingX = 1200;
      const hSpacingY = 1200;

      holdings.forEach((holding, index) => {
        const col = index % maxPerRow;
        const row = Math.floor(index / maxPerRow);
        const hX = col * hSpacingX;
        const hY = row * hSpacingY;

        const isExpanded = expandedHoldings.has(holding.id);
        
        nodes.push({
          id: holding.id,
          type: 'holding',
          position: { x: hX, y: hY },
          data: { 
            ...holding, 
            isExpanded,
            anyExpanded: expandedHoldings.size > 0 
          },
          zIndex: 10,
        });

        if (isExpanded) {
          const childIds = childMap.get(holding.id) || [];
          const holdingBrands = brands.filter(b => childIds.includes(b.id));

          if (holdingBrands.length > 10) {
            // GRID layout for large groups
            const columns = 5;
            const cellW = 160;
            const cellH = 160;
            const totalW = (Math.min(holdingBrands.length, columns) - 1) * cellW;
            const startX = hX - totalW / 2;
            const startY = hY + 180;

            holdingBrands.forEach((brand, bIndex) => {
              const bCol = bIndex % columns;
              const bRow = Math.floor(bIndex / columns);
              const bX = startX + bCol * cellW;
              const bY = startY + bRow * cellH;

              nodes.push({
                id: brand.id,
                type: 'brand',
                position: { x: bX, y: bY },
                data: {
                  ...brand,
                  accentColor: brandAccentMap.get(brand.id) ?? '#64748b',
                  isGrid: true, // No edges to group container
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
                },
                zIndex: 5,
              });
               
              edges.push({
                id: `e-${holding.id}-${brand.id}`,
                source: holding.id,
                target: brand.id,
                label: '',
                type: 'custom',
              });
            });
          }
        }
      });
      
    } else {
      // OEM MODE
      const manufacturers = dataset.nodes.filter(n => n.type === 'manufacturer');
      const mMaxPerRow = 3;
      const mSpacingX = 1400;
      const mSpacingY = 1400;
      
      const manufacturerChildren = new Map<string, typeof brands>();
      manufacturers.forEach(m => manufacturerChildren.set(m.id, []));
      
      brands.forEach(b => {
        if ('producedBy' in b && Array.isArray(b.producedBy) && b.producedBy.length > 0) {
          b.producedBy.forEach(producerId => {
            if (manufacturerChildren.has(producerId)) {
              manufacturerChildren.get(producerId)?.push(b);
            }
          });
        }
      });

      manufacturers.forEach((m, index) => {
        const col = index % mMaxPerRow;
        const row = Math.floor(index / mMaxPerRow);
        const mX = col * mSpacingX;
        const mY = row * mSpacingY;
        
        nodes.push({
          id: m.id,
          type: 'manufacturer',
          position: { x: mX, y: mY },
          data: { ...m },
          zIndex: 15,
        });

        const kids = manufacturerChildren.get(m.id) || [];
        const radius = Math.min(600, 300 + kids.length * 20); // adaptive radius
        
        kids.forEach((brand, bIndex) => {
          const angle = (bIndex / kids.length) * 2 * Math.PI;
          
          const uniqueBrandId = `oem-${m.id}-${brand.id}`;

          // initial position before JS lerp takes over
          const bX = mX + radius * Math.cos(angle);
          const bY = mY + radius * Math.sin(angle);

          nodes.push({
            id: uniqueBrandId, 
            type: 'brand',
            position: { x: bX, y: bY },
            data: {
               ...brand,
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
  }, [showOEM, expandedHoldings]);

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
        if (next.has(node.id)) next.delete(node.id);
        else next.add(node.id);
        return next;
      });
    }
    
    // We send back the actual ID without the "oem-" prefix if it has it
    let realData = node.data;
    if (node.id.startsWith('oem-')) {
      const realId = node.id.split('-').slice(2).join('-');
      const found = dataset.nodes.find(n => n.id === realId);
      if (found) realData = found as any;
    }
    
    onNodeSelect?.(realData as unknown as GraphNodeData, e.shiftKey);
  }, [onNodeSelect, showOEM]);

  // Orbit / Floating physics for OEM Mode
  useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const animateOEMOrphans = () => {
      time += 0.015;
      setNodes(current => {
        let changed = false;
        const next = current.map(n => {
          if (n.type === 'brand' && n.data?.isOEMMode) {
            changed = true;
            let hash = 0;
            for (let i = 0; i < n.id.length; i++) hash += n.id.charCodeAt(i);

            // subtle circular orbit/floating
            return {
              ...n,
              position: {
                x: n.position.x + Math.sin(time + hash) * 0.2,
                y: n.position.y + Math.cos(time + hash) * 0.2,
              }
            };
          }
          return n;
        });
        return changed ? next : current;
      });
      animationFrameId = requestAnimationFrame(animateOEMOrphans);
    };

    if (showOEM) {
      animationFrameId = requestAnimationFrame(animateOEMOrphans);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [setNodes, showOEM]);

  // Clean-up drag handlers for holding since they don't apply anymore with expand/collapse grid mode (we don't drag standard nodes around manually now, but we can keep standard ReactFlow dragging active for holdings without sweeping children to avoid glitchy transitions).

  return (
      <div className="w-full h-full min-h-[90vh] relative bg-transparent">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          className="border-none"
        >
          <Background variant={BackgroundVariant.Dots} gap={32} size={1} color="#e2e8f0" />
          <Controls className="bg-white border-slate-200 shadow-sm" />
          <MiniMap
            zoomable
            pannable
            nodeColor={n => (n.type === 'holding' ? '#3b82f6' : '#e2e8f0')}
            className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden"
            maskColor="rgba(248, 250, 252, 0.7)"
          />
        </ReactFlow>
      </div>
  );
}
