'use client';

import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  selectNodeType,
  selectNodeData,
  selectInteractionStage,
} from '@/lib/redux/slices/node-slice';
import { NodeColors, NodeType } from '@/lib/types/map-types';
import { Button } from '@/components/ui/button';

interface NodeHeaderProps {
  onClose: () => void;
}

export function NodeHeader({ onClose }: NodeHeaderProps) {
  const nodeType = useAppSelector(selectNodeType) as NodeType;
  const nodeData = useAppSelector(selectNodeData);
  const currentStage = useAppSelector(selectInteractionStage);
  
  // Get node colors based on type
  const colors = nodeType ? NodeColors[nodeType] : NodeColors.clinical;
  
  // Node type to emoji/icon
  const nodeIcons: Record<NodeType, string> = {
    clinical: '👨‍⚕️',
    qa: '🔍',
    educational: '📚',
    storage: '📦',
    vendor: '🛒',
    boss: '⚠️',
    start: '🚪'
  };
  
  // Get a readable name for the node type
  const getNodeTypeName = (type: NodeType): string => {
    switch (type) {
      case 'clinical':
        return 'Clinical Scenario';
      case 'qa':
        return 'Quality Assurance';
      case 'educational':
        return 'Educational Activity';
      case 'storage':
        return 'Storage Closet';
      case 'vendor':
        return 'Vendor Showcase';
      case 'boss':
        return 'Boss Challenge';
      case 'start':
        return 'Starting Point';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <div 
      className="p-4 border-b-2 border-black flex justify-between items-center"
      style={{ 
        backgroundColor: colors.primary,
        color: colors.text,
        borderColor: colors.secondary
      }}
    >
      <div className="flex items-center">
        <div className="text-2xl mr-2">{nodeType && nodeIcons[nodeType]}</div>
        <div>
          <h2 className="font-bold text-lg">{nodeData?.title || getNodeTypeName(nodeType)}</h2>
          <div className="text-sm opacity-80">
            Stage: {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
          </div>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        onClick={onClose}
        className="text-white hover:bg-black/20"
      >
        ✕
      </Button>
    </div>
  );
}