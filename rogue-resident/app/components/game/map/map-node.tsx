'use client';

import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeStatus, NodeType } from '@/lib/types/map-types';
import { cn } from '@/lib/utils/cn';

// Node status to class mapping
const statusClasses: Record<NodeStatus, string> = {
  locked: 'opacity-50 cursor-not-allowed',
  available: 'cursor-pointer hover:ring-2 hover:ring-yellow-400',
  current: 'ring-2 ring-yellow-400 shadow-lg transform scale-110',
  completed: 'opacity-80'
};

// Node type to class mapping
const typeClasses: Record<NodeType, string> = {
  clinical: 'bg-blue-600 text-white',
  qa: 'bg-gray-700 text-white',
  educational: 'bg-green-700 text-white',
  storage: 'bg-amber-700 text-white',
  vendor: 'bg-indigo-700 text-white',
  boss: 'bg-red-700 text-white',
  start: 'bg-emerald-700 text-white'
};

// Node type to icon mapping
const typeIcons: Record<NodeType, string> = {
  clinical: '👨‍⚕️',
  qa: '🔍',
  educational: '📚',
  storage: '📦',
  vendor: '🛒',
  boss: '⚠️',
  start: '🚪'
};

interface MapNodeProps {
  data: {
    id: string;
    type: NodeType;
    title: string;
    description: string;
    status: NodeStatus;
    color: string;
    borderColor: string;
    textColor: string;
  };
  selected: boolean;
}

function MapNodeComponent({ data, selected }: MapNodeProps) {
  const { id, type, title, status, color, borderColor, textColor } = data;
  
  // Generate node classes based on type and status
  const nodeClass = cn(
    'px-2 py-1 rounded-md border-2 min-w-[100px] max-w-[150px] text-center flex flex-col items-center justify-center transition-all duration-200 pixel-corners',
    typeClasses[type],
    statusClasses[status],
    selected && 'ring-2 ring-white'
  );
  
  // Use inline style for custom colors
  const nodeStyle = {
    backgroundColor: color,
    borderColor: borderColor,
    color: textColor,
  };
  
  return (
    <>
      {/* Input handle (top) */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: borderColor }}
      />
      
      {/* Node content */}
      <div
        className={nodeClass}
        style={nodeStyle}
        data-testid={`node-${id}`}
      >
        <div className="text-xl mb-1">{typeIcons[type]}</div>
        <div className="font-bold text-sm">{title}</div>
      </div>
      
      {/* Output handle (bottom) */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: borderColor }}
      />
    </>
  );
}

// Memoize the component to prevent unnecessary re-renders
export const MapNode = memo(MapNodeComponent);