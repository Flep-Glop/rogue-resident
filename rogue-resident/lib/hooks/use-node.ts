'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, createSelector } from '@/lib/redux/hooks';
import {
  selectNode as selectNodeAction,
  setNodeState,
  resetNodeInteraction,
  updateNodeData,
  completeNode as completeNodeAction
} from '@/lib/redux/slices/node-slice';
import {
  selectNode as selectMapNode,
  completeNode as completeMapNode,
  setCurrentNode as setCurrentMapNode
} from '@/lib/redux/slices/map-slice';
import {
  startChallenge,
  resetChallenge
} from '@/lib/redux/slices/challenge-slice';
import type { NodeType, NodeStatus } from '@/lib/types/map-types';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

// Memoized selectors for better performance
const selectNodeState = createSelector(
  (state) => ({
    isInteracting: state.node.isInteracting,
    selectedNodeId: state.node.selectedNodeId,
    currentNodeId: state.node.currentNodeId,
    interactionStage: state.node.interactionStage,
    nodeType: state.node.nodeType,
    nodeData: state.node.nodeData,
    nodeStatus: state.node.nodeStatus,
    isNodeActive: state.node.isNodeActive
  }),
  (state) => state
);

const selectMapState = createSelector(
  (state) => ({
    nodes: state.map.nodes,
    unlockedNodeIds: state.map.unlockedNodeIds
  }),
  (state) => state
);

const selectChallengeState = createSelector(
  (state) => ({
    currentChallengeId: state.challenge.currentChallengeId,
    challengeState: state.challenge.challengeState
  }),
  (state) => state
);

/**
 * Hook for managing node interactions
 * 
 * @returns Node state and methods for interacting with nodes
 */
export function useNode() {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const {
    isInteracting,
    selectedNodeId,
    currentNodeId,
    interactionStage,
    nodeType,
    nodeData,
    nodeStatus,
    isNodeActive
  } = useAppSelector(selectNodeState);
  
  const { nodes, unlockedNodeIds } = useAppSelector(selectMapState);
  const { currentChallengeId, challengeState } = useAppSelector(selectChallengeState);
  
  // Get full node data from map state if available
  const fullNodeData = useCallback(() => {
    return tryCatch(() => {
      if (!currentNodeId) return null;
      return nodes.find(node => node.id === currentNodeId)?.data || null;
    }, null, ErrorCode.NODE_ERROR);
  }, [currentNodeId, nodes])();
  
  // Begin interaction with a node
  const interactWithNode = useCallback((nodeId: string, type: NodeType, initialData?: any) => {
    tryCatch(() => {
      // Check if node is unlocked
      if (!unlockedNodeIds.includes(nodeId)) {
        console.warn(`Attempted to interact with locked node: ${nodeId}`);
        return;
      }
      
      // First select the node in the map state
      dispatch(selectMapNode(nodeId));
      
      // Then set as current node in map state
      dispatch(setCurrentMapNode(nodeId));
      
      // Then start node interaction in node state
      dispatch(selectNodeAction({
        nodeId,
        nodeType: type,
        nodeData: initialData
      }));
    }, undefined, ErrorCode.NODE_ERROR);
  }, [dispatch, unlockedNodeIds]);
  
  // Set the current stage of the node interaction
  const setStage = useCallback((stage: string) => {
    tryCatch(() => {
      dispatch(setNodeState(stage));
    }, undefined, ErrorCode.NODE_ERROR);
  }, [dispatch]);
  
  // Cancel the current node interaction
  const cancelInteraction = useCallback(() => {
    tryCatch(() => {
      dispatch(resetNodeInteraction());
      dispatch(resetChallenge());
    }, undefined, ErrorCode.NODE_ERROR);
  }, [dispatch]);
  
  // Update node data during interaction
  const updateData = useCallback((data: any) => {
    tryCatch(() => {
      dispatch(updateNodeData(data));
    }, undefined, ErrorCode.NODE_ERROR);
  }, [dispatch]);
  
  // Complete the current node interaction
  const completeInteraction = useCallback((success: boolean) => {
    tryCatch(() => {
      if (currentNodeId) {
        if (success) {
          // Mark node complete in map state
          dispatch(completeMapNode(currentNodeId));
        }
        
        // Complete node in node state
        dispatch(completeNodeAction({ success }));
        
        // Reset the challenge state
        dispatch(resetChallenge());
      }
    }, undefined, ErrorCode.NODE_ERROR);
  }, [dispatch, currentNodeId]);
  
  // Start a challenge for the current node
  const startNodeChallenge = useCallback((challengeData: { 
    id: string;
    type: string;
    totalStages: number;
    title?: string;
    description?: string;
    difficulty?: string;
    timeLimit?: number;
  }) => {
    tryCatch(() => {
      dispatch(startChallenge(challengeData));
    }, undefined, ErrorCode.NODE_ERROR);
  }, [dispatch]);
  
  // Navigation through stages
  const nextStage = useCallback(() => {
    return tryCatch(() => {
      // Define the standard stage progression
      const stages = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
      const currentIndex = stages.indexOf(interactionStage);
      
      if (currentIndex < stages.length - 1) {
        dispatch(setNodeState(stages[currentIndex + 1]));
        return true;
      }
      
      return false;
    }, false, ErrorCode.NODE_ERROR);
  }, [dispatch, interactionStage]);
  
  const previousStage = useCallback(() => {
    return tryCatch(() => {
      // Define the standard stage progression
      const stages = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
      const currentIndex = stages.indexOf(interactionStage);
      
      if (currentIndex > 0) {
        dispatch(setNodeState(stages[currentIndex - 1]));
        return true;
      }
      
      return false;
    }, false, ErrorCode.NODE_ERROR);
  }, [dispatch, interactionStage]);
  
  // Check if a given node is accessible
  const isNodeAccessible = useCallback((nodeId: string): boolean => {
    return tryCatch(() => {
      return unlockedNodeIds.includes(nodeId);
    }, false, ErrorCode.NODE_ERROR);
  }, [unlockedNodeIds]);
  
  // Get a node by ID
  const getNodeById = useCallback((nodeId: string) => {
    return tryCatch(() => {
      return nodes.find(node => node.id === nodeId);
    }, undefined, ErrorCode.NODE_ERROR);
  }, [nodes]);
  
  return {
    // State
    isInteracting,
    selectedNodeId,
    currentNodeId,
    interactionStage,
    nodeType,
    nodeData,
    fullNodeData,
    nodeStatus,
    isNodeActive,
    
    // Challenge-related state
    challengeId: currentChallengeId,
    challengeState,
    
    // Node interaction methods
    interactWithNode,
    setStage,
    cancelInteraction,
    updateData,
    completeInteraction,
    startNodeChallenge,
    nextStage,
    previousStage,
    
    // Utility methods
    isNodeAccessible,
    getNodeById
  };
}