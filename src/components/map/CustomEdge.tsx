'use client';

import React from 'react';
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from '@xyflow/react';
import { useFilter } from '@/contexts/FilterContext';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,
  style,
  animated,
  source,
  target,
}: EdgeProps) {
  const { focusedOEMNodeId } = useFilter();

  // Use bezier for natural-looking curves
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isDimmed = focusedOEMNodeId && source !== focusedOEMNodeId && target !== focusedOEMNodeId;
  const edgeOpacity = isDimmed ? 0.05 : 1;

  return (
    <>
      {/* Soft glow underneath */}
      <BaseEdge
        path={edgePath}
        style={{ stroke: '#e2e8f0', strokeWidth: 6, strokeLinecap: 'round', opacity: edgeOpacity, transition: 'opacity 0.3s' }}
      />
      {/* Main line */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#94a3b8', strokeWidth: 2, strokeLinecap: 'round', ...style, opacity: edgeOpacity, transition: 'opacity 0.3s' }}
        className={animated ? 'react-flow__edge-path animate-dash' : ''}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 5,
              opacity: edgeOpacity,
              transition: 'opacity 0.3s',
            }}
            className="nodrag nopan"
          >
            <div className={`border text-[9px] uppercase tracking-[0.12em] font-bold px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap select-none ${id.startsWith('p-') ? 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600' : 'bg-white border-slate-200 text-slate-400'}`}>
              {label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
