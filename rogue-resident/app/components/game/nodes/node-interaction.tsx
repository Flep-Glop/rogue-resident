// app/components/game/nodes/node-interaction.tsx
'use client';

import { useEffect } from 'react';
import { useNode, useMap } from '@/lib/hooks';
import { NodeType } from '@/lib/types/node-types';
import ClinicalNode from './clinical-node';
import QANode from './qa-node';
import EducationalNode from './educational-node';
import StorageNode from './storage-node';
import VendorNode from './vendor-node';
import BossNode from './boss-node';
import NodeHeader from './node-header';
import { cn } from '@/lib/utils/cn';

interface NodeInteractionProps {
  nodeType: NodeType | null;
  nodeId: string | null;
}

export default function NodeInteraction({ nodeType, nodeId }: NodeInteractionProps) {
  const { 
    isInteracting, 
    selectedNodeId, 
    interactionStage, 
    nodeData, 
    cancelInteraction 
  } = useNode();
  
  const { getNodeById } = useMap();
  
  // Get node data from map if not provided through nodeData
  const currentNode = getNodeById(nodeId || selectedNodeId || '');
  
  // Handle ESC key to exit node
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelInteraction();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelInteraction]);
  
  if (!isInteracting || !selectedNodeId || !nodeType) {
    return null;
  }
  
  // Render the appropriate node component based on type
  const renderNodeContent = () => {
    switch (nodeType) {
      case 'clinical':
        return <ClinicalNode nodeId={selectedNodeId} stage={interactionStage} />;
      case 'qa':
        return <QANode nodeId={selectedNodeId} stage={interactionStage} />;
      case 'educational':
        return <EducationalNode nodeId={selectedNodeId} stage={interactionStage} />;
      case 'storage':
        return <StorageNode nodeId={selectedNodeId} stage={interactionStage} />;
      case 'vendor':
        return <VendorNode nodeId={selectedNodeId} stage={interactionStage} />;
      case 'boss':
        return <BossNode nodeId={selectedNodeId} stage={interactionStage} />;
      default:
        return (
          <div className="p-8 text-center">
            <p>Unknown node type: {nodeType}</p>
            <button 
              onClick={cancelInteraction}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Return to Map
            </button>
          </div>
        );
    }
  };
  
  // Get background color class based on node type
  const getBgClass = () => {
    switch (nodeType) {
      case 'clinical': return 'bg-clinical';
      case 'qa': return 'bg-qa';
      case 'educational': return 'bg-educational';
      case 'storage': return 'bg-storage';
      case 'vendor': return 'bg-vendor';
      case 'boss': return 'bg-boss';
      default: return 'bg-slate-700';
    }
  };
  
  return (
    <div className={cn(
      'flex flex-col h-full w-full rounded-lg overflow-hidden transition-all duration-300',
      getBgClass()
    )}>
      {currentNode && (
        <NodeHeader 
          title={currentNode.title} 
          type={nodeType} 
          onClose={cancelInteraction} 
        />
      )}
      
      <div className="flex-1 overflow-y-auto p-4">
        {renderNodeContent()}
      </div>
    </div>
  );
}