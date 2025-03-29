'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, createSelector } from '@/lib/redux/hooks';
import {
  selectNode,
  setNodeState,
  resetNodeInteraction,
  updateNodeData,
  completeNode
} from '@/lib/redux/slices/node-slice';
import type { NodeType } from '@/lib/types/map-types';

// Create memoized selectors
const selectNodeInteractionState = createSelector(state => ({
  isInteracting: state.node.isInteracting,
  selectedNodeId: state.node.selectedNodeId,
  interactionStage: state.node.interactionStage,
  nodeType: state.node.nodeType
}));
const selectNodeData = createSelector(state => state.node.nodeData);

/**
 * Hook for managing node interactions
 */
export function useNode() {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const { isInteracting, selectedNodeId, interactionStage, nodeType } = useAppSelector(selectNodeInteractionState);
  const nodeData = useAppSelector(selectNodeData);
  
  // Begin interaction with a node
  const interactWithNode = useCallback((nodeId: string, nodeType: NodeType, initialData?: any) => {
    dispatch(selectNode({
      nodeId,
      nodeType,
      nodeData: initialData
    }));
  }, [dispatch]);
  
  // Set the current stage of the node interaction
  const setStage = useCallback((stage: string) => {
    dispatch(setNodeState(stage));
  }, [dispatch]);
  
  // Cancel the current node interaction
  const cancelInteraction = useCallback(() => {
    dispatch(resetNodeInteraction());
  }, [dispatch]);
  
  // Update node data during interaction
  const updateData = useCallback((data: any) => {
    dispatch(updateNodeData(data));
  }, [dispatch]);
  
  // Complete the current node interaction
  const completeInteraction = useCallback((success: boolean) => {
    dispatch(completeNode({ success }));
  }, [dispatch]);
  
  // Navigation through stages
  const nextStage = useCallback(() => {
    // Define the standard stage progression
    const stages = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
    const currentIndex = stages.indexOf(interactionStage);
    
    if (currentIndex < stages.length - 1) {
      dispatch(setNodeState(stages[currentIndex + 1]));
      return true;
    }
    
    return false;
  }, [dispatch, interactionStage]);
  
  const previousStage = useCallback(() => {
    // Define the standard stage progression
    const stages = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
    const currentIndex = stages.indexOf(interactionStage);
    
    if (currentIndex > 0) {
      dispatch(setNodeState(stages[currentIndex - 1]));
      return true;
    }
    
    return false;
  }, [dispatch, interactionStage]);
  
  return {
    // State
    isInteracting,
    selectedNodeId,
    interactionStage,
    nodeType,
    nodeData,
    
    // Actions
    interactWithNode,
    setStage,
    cancelInteraction,
    updateData,
    completeInteraction,
    nextStage,
    previousStage
  };
}