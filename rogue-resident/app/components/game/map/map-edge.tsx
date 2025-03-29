'use client';

import React, { memo } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

interface MapEdgeProps extends EdgeProps {
  animated?: boolean;
}

function MapEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  animated = false,
}: MapEdgeProps) {
  // Get the path for the edge
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <g>
      <path
        id={id}
        className={animated ? 'react-flow__edge-path-animated' : 'react-flow__edge-path'}
        d={edgePath}
        style={style}
      />
      {animated && (
        <path
          d={edgePath}
          style={{
            ...style,
            stroke: '#ffcc00',
            strokeWidth: 2,
            strokeDasharray: 5,
            animation: 'flow 1s linear infinite',
          }}
        />
      )}
    </g>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const MapEdge = memo(MapEdgeComponent);