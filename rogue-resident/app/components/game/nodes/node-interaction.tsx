'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectNodeType,
  resetNodeInteraction,
} from '@/lib/redux/slices/node-slice';
import { Button } from '@/components/ui/button';
import { ClinicalNode } from './clinical-node';
import { QANode } from './qa-node';
import { EducationalNode } from './educational-node';
import { StorageNode } from './storage-node';
import { VendorNode } from './vendor-node';
import { BossNode } from './boss-node';
import { NodeHeader } from './node-header';

export function NodeInteraction() {
  const dispatch = useAppDispatch();
  const nodeType = useAppSelector(selectNodeType);
  
  // Close node interaction
  const handleClose = () => {
    dispatch(resetNodeInteraction());
  };
  
  // Render the appropriate node component based on node type
  const renderNodeContent = () => {
    switch (nodeType) {
      case 'clinical':
        return <ClinicalNode />;
      case 'qa':
        return <QANode />;
      case 'educational':
        return <EducationalNode />;
      case 'storage':
        return <StorageNode />;
      case 'vendor':
        return <VendorNode />;
      case 'boss':
        return <BossNode />;
      default:
        return (
          <div className="text-center p-8">
            <p className="text-lg text-gray-600 mb-4">
              Unknown node type or no node selected.
            </p>
            <Button variant="pixel" onClick={handleClose}>
              Return to Map
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div className="bg-white border-2 border-black rounded-lg overflow-hidden flex flex-col h-full pixel-corners">
      {/* Node header */}
      <NodeHeader onClose={handleClose} />
      
      {/* Node content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderNodeContent()}
      </div>
    </div>
  );
}