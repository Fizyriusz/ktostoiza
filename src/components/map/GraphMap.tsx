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

// ─── Layout ─────────────────────────────────────────────────────────────────

function generateMapLayout(showOEM: boolean): { initialNodes: Node[]; initialEdges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const holdings = dataset.nodes.filter(n => n.type === 'holding');
  const brands = dataset.nodes.filter(n => n.type === 'brand');

  const maxPerRow = 3;
  const hSpacingX = 1000;
  const hSpacingY = 900;

  holdings.forEach((holding, index) => {
    const col = index % maxPerRow;
    const row = Math.floor(index / maxPerRow);
    const hX = col * hSpacingX;
    const hY = row * hSpacingY;

    nodes.push({
      id: holding.id,
      type: 'holding',
      position: { x: hX, y: hY },
      data: { ...holding },
      zIndex: 10,
    });

    const childIds = childMap.get(holding.id) || [];
    const holdingBrands = brands.filter(b => childIds.includes(b.id));
    const uniqueBrands = Array.from(new Set(holdingBrands.map(b => b.id))).map(
      id => holdingBrands.find(b => b.id === id),
    );

    const radius = 330;
    uniqueBrands.forEach((brand, bIndex) => {
      if (!brand) return;
      const angle = (bIndex / uniqueBrands.length) * 2 * Math.PI - Math.PI / 2;
      const bX = hX + radius * Math.cos(angle);
      const bY = hY + radius * Math.sin(angle);

      if (!nodes.find(n => n.id === brand.id)) {
        nodes.push({
          id: brand.id,
          type: 'brand',
          position: { x: bX, y: bY },
          data: {
            ...brand,
            accentColor: brandAccentMap.get(brand.id) ?? '#64748b',
          },
          zIndex: 5,
        });
      }
    });
  });

  // Orphans
  const placedIds = new Set(nodes.map(n => n.id));
  const orphans = brands.filter(b => !placedIds.has(b.id));
  const orphanStartY = Math.ceil(holdings.length / maxPerRow) * hSpacingY + 120;

  // Siatka z "szumem" (pływająca konstelacja) i offsetami
  orphans.forEach((brand, index) => {
    const col = index % 6;
    const row = Math.floor(index / 6);
    // Niedoskonała siatka: dodajemy losowe przesunięcie od -15 do +15
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;
    nodes.push({
      id: brand.id,
      type: 'brand',
      position: { x: col * 220 + offsetX, y: orphanStartY + row * 220 + offsetY },
      data: { ...brand, accentColor: '#64748b' },
    });
  });

  // Węzły Producentów (Manufacturers)
  const manufacturers = dataset.nodes.filter(n => n.type === 'manufacturer');
  const mY = -400; // Położenie nad holdingami
  
  if (showOEM) {
    manufacturers.forEach((m, index) => {
      const col = index % maxPerRow;
      nodes.push({
        id: m.id,
        type: 'manufacturer',
        position: { x: (col + 0.5) * hSpacingX, y: mY },
        data: { ...m },
        zIndex: 15,
      });
    });
  }

  // Edges generacja
  dataset.edges.forEach(edge => {
    edges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      type: 'custom',
    });
  });

  // Generowanie dynamicznych krawędzi produkcyjnych w locie
  if (showOEM) {
    brands.forEach(b => {
      if ('producedBy' in b && b.producedBy && b.producedBy.length > 0) {
        b.producedBy.forEach(producerId => {
          edges.push({
            id: `p-${producerId}-${b.id}`,
            source: producerId,
            target: b.id,
            label: 'Zakład Produkcyjny',
            type: 'custom',
            animated: true,
            style: { stroke: '#d946ef', strokeWidth: 2, strokeDasharray: '5 5' },
          });
        });
      }
    });
  }

  return { initialNodes: nodes, initialEdges: edges };
}

// ─── LERP constant ──────────────────────────────────────────────────────────
const LERP = 0.15;

// ─── Component ──────────────────────────────────────────────────────────────

interface GraphMapProps {
  activeFilter?: FilterType;
  showOEM?: boolean;
  onNodeSelect?: (node: GraphNodeData, multi: boolean) => void;
}

export default function GraphMap({ activeFilter = 'all', showOEM = false, onNodeSelect }: GraphMapProps) {
  const { initialNodes, initialEdges } = useMemo(() => generateMapLayout(showOEM), [showOEM]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const childOffsetsRef = useRef<Map<string, { dx: number; dy: number }>>(new Map());
  const draggedHoldingId = useRef<string | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge({ ...params, type: 'custom' }, eds)),
    [setEdges],
  );

  // Update layout when OEM toggle changes
  useEffect(() => {
    const { initialNodes, initialEdges } = generateMapLayout(showOEM);
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [showOEM, setNodes, setEdges]);

  const handleNodeClick = useCallback((e: React.MouseEvent, node: Node) => {
    onNodeSelect?.(node.data as unknown as GraphNodeData, e.shiftKey);
  }, [onNodeSelect]);

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

    setNodes(current =>
      current.map(n => {
        const offset = offsets.get(n.id);
        if (!offset) return n;

        const targetX = hx + offset.dx;
        const targetY = hy + offset.dy;

        return {
          ...n,
          position: {
            x: n.position.x + (targetX - n.position.x) * LERP,
            y: n.position.y + (targetY - n.position.y) * LERP,
          },
        };
      }),
    );
  }, [setNodes]);

  // ── DragStop: snap to exact position ─────────────────────────────────────
  const handleNodeDragStop = useCallback((_e: React.MouseEvent, node: Node) => {
    if (node.type !== 'holding') { draggedHoldingId.current = null; return; }

    const offsets = childOffsetsRef.current;
    const hx = node.position.x;
    const hy = node.position.y;

    setNodes(current =>
      current.map(n => {
        const offset = offsets.get(n.id);
        if (!offset) return n;
        return { ...n, position: { x: hx + offset.dx, y: hy + offset.dy } };
      }),
    );

    draggedHoldingId.current = null;
    childOffsetsRef.current = new Map();
  }, [setNodes]);

  // Rysowanie pływającej konstelacji (Orphans LERP)
  React.useEffect(() => {
    let animationFrameId: number;
    let time = 0;

    const animateOrphans = () => {
      time += 0.015;
      setNodes(current => {
        let changed = false;
        const next = current.map(n => {
          // Aplikujemy pływający efekt do każdego node'a
          if (n.id === draggedHoldingId.current) return n;

          changed = true;
          let hash = 0;
          for (let i = 0; i < n.id.length; i++) hash += n.id.charCodeAt(i);

          return {
            ...n,
            position: {
              x: n.position.x + Math.sin(time + hash) * 0.08,
              y: n.position.y + Math.cos(time + hash) * 0.08,
            }
          };
        });
        return changed ? next : current;
      });
      animationFrameId = requestAnimationFrame(animateOrphans);
    };

    animationFrameId = requestAnimationFrame(animateOrphans);
    return () => cancelAnimationFrame(animationFrameId);
  }, [setNodes]);

  return (
      <div className="w-full h-full min-h-[90vh] relative bg-transparent">
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
