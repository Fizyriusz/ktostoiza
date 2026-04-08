'use client';

import React from 'react';
import { BaseEdge, EdgeLabelRenderer, SimpleBezierEdge, getStraightPath, EdgeProps, getBezierPath } from '@xyflow/react';

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
}: EdgeProps) {
  // Use bezier for natural-looking curves
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {/* Soft glow underneath */}
      <BaseEdge
        path={edgePath}
        style={{ stroke: '#e2e8f0', strokeWidth: 6, strokeLinecap: 'round' }}
      />
      {/* Main line */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#94a3b8', strokeWidth: 2, strokeLinecap: 'round' }}
      />

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 5,
            }}
            className="nodrag nopan"
          >
            <div className="bg-white border border-slate-200 text-[9px] text-slate-400 uppercase tracking-[0.12em] font-bold px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap select-none">
              {label}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
