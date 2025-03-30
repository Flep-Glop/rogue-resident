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
  selectNodes as setNodeSelected, // Using the correctly exported member name
  completeNode as completeMapNode,
  setCurrentNode as setCurrentMapNode
} from '@/lib/redux/slices/map-slice';
import {
  startChallenge,
  resetChallenge
} from '@/lib/redux/slices/challenge-slice';
import type { NodeType, NodeStatus, MapNode } from '@/lib/types/map-types';
import type { ChallengeType, ChallengeStage, ChallengeStatus } from '@/lib/types/challenge-types';
import type { Difficulty } from '@/lib/types/game-types';
import type { RootState } from '@/lib/types/redux-types';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

// Create memoized selectors using the array pattern
const selectNodeState = createSelector(
  [(state: RootState) => state.node],
  (node) => ({
    isInteracting: node.isInteracting,
    selectedNodeId: node.selectedNodeId,
    currentNodeId: node.currentNodeId,
    interactionStage: node.interactionStage,
    nodeType: node.nodeType,
    nodeData: node.nodeData,
    nodeStatus: node.nodeStatus,
    isNodeActive: node.isNodeActive
  })
);

const selectMapState = createSelector(
  [(state: RootState) => state.map],
  (map) => ({
    nodes: map.nodes,
    unlockedNodeIds: map.unlockedNodeIds
  })
);

const selectChallengeState = createSelector(
  [(state: RootState) => state.challenge],
  (challenge) => ({
    currentChallengeId: challenge.currentChallengeId,
    challengeStatus: challenge.challengeStatus // Using challengeStatus consistently
  })
);

/**
 * Interface for challenge data when starting a new challenge
 */
interface ChallengeStartData {
  id: string;
  type: ChallengeType;
  totalStages: number;
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  timeLimit?: number;
}

/**
 * Interface defining the return value of the useNode hook
 */
interface UseNodeReturn {
  // State
  isInteracting: boolean;
  selectedNodeId: string | null;
  currentNodeId: string | null;
  interactionStage: ChallengeStage | null;
  nodeType: NodeType | null;
  nodeData: any;
  fullNodeData: MapNode | null;
  nodeStatus: NodeStatus | null;
  isNodeActive: boolean;
  
  // Challenge-related state
  challengeId: string | null;
  challengeStatus: ChallengeStatus;
  
  // Node interaction methods
  interactWithNode: (nodeId: string, type: NodeType, initialData?: any) => void;
  setStage: (stage: ChallengeStage) => void;
  cancelInteraction: () => void;
  updateData: (data: any) => void;
  completeInteraction: (success: boolean) => void;
  startNodeChallenge: (challengeData: ChallengeStartData) => void;
  nextStage: () => boolean;
  previousStage: () => boolean;
  
  // Utility methods
  isNodeAccessible: (nodeId: string) => boolean;
  getNodeById: (nodeId: string) => MapNode | undefined;
}

/**
 * Hook for managing node interactions
 * 
 * Provides functionality to interact with map nodes, manage node state,
 * and handle node challenges.
 * 
 * @returns Object containing node state and interaction methods
 */
export function useNode(): UseNodeReturn {
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
  const { currentChallengeId, challengeStatus } = useAppSelector(selectChallengeState);
  
  /**
   * Gets the full node data from map state if available
   */
  const fullNodeData = useCallback((): MapNode | null => {
    return tryCatch(() => {
      if (!currentNodeId) return null;
      return nodes.find(node => node.id === currentNodeId) || null;
    }, null, ErrorCode.NODE_ERROR);
  }, [currentNodeId, nodes])();
  
  /**
   * Begins interaction with a node
   * 
   * @param nodeId - The ID of the node to interact with
   * @param type - The type of the node
   * @param initialData - Optional initial data for the interaction
   */
  const interactWithNode = useCallback((nodeId: string, type: NodeType, initialData?: any): void => {
    tryCatch(() => {
      // Check if node is unlocked
      if (!unlockedNodeIds.includes(nodeId)) {
        console.warn(`Attempted to interact with locked node: ${nodeId}`);
        return;
      }
      
      // First select the node in the map state
      dispatch(setNodeSelected(nodeId));
      
      // Then set as current node in map state
      dispatch(setCurrentMapNode(nodeId));
      
      // Then start node interaction in node state
      dispatch(selectNodeAction({
        nodeId,
        nodeType: type,
        nodeData: initialData
      }));
    }, undefined, ErrorCode.NODE_INTERACTION_ERROR);
  }, [dispatch, unlockedNodeIds]);
  
  /**
   * Sets the current stage of the node interaction
   * 
   * @param stage - The stage to set
   */
  const setStage = useCallback((stage: ChallengeStage): void => {
    tryCatch(() => {
      dispatch(setNodeState(stage));
    }, undefined, ErrorCode.NODE_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Cancels the current node interaction
   */
  const cancelInteraction = useCallback((): void => {
    tryCatch(() => {
      dispatch(resetNodeInteraction());
      dispatch(resetChallenge());
    }, undefined, ErrorCode.NODE_INTERACTION_ERROR);
  }, [dispatch]);
  
  /**
   * Updates node data during interaction
   * 
   * @param data - The new data to update
   */
  const updateData = useCallback((data: any): void => {
    tryCatch(() => {
      dispatch(updateNodeData(data));
    }, undefined, ErrorCode.NODE_DATA_ERROR);
  }, [dispatch]);
  
  /**
   * Completes the current node interaction
   * 
   * @param success - Whether the interaction was successful
   */
  const completeInteraction = useCallback((success: boolean): void => {
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
    }, undefined, ErrorCode.NODE_COMPLETION_ERROR);
  }, [dispatch, currentNodeId]);
  
  /**
   * Starts a challenge for the current node
   * 
   * @param challengeData - Data for the challenge to start
   */
  const startNodeChallenge = useCallback((challengeData: ChallengeStartData): void => {
    tryCatch(() => {
      dispatch(startChallenge(challengeData));
    }, undefined, ErrorCode.CHALLENGE_START_ERROR);
  }, [dispatch]);
  
  /**
   * Navigates to the next stage in the interaction
   * 
   * @returns Whether navigation was successful
   */
  const nextStage = useCallback((): boolean => {
    return tryCatch(() => {
      // Define the standard stage progression
      const stages: ChallengeStage[] = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
      const currentIndex = interactionStage ? stages.indexOf(interactionStage) : -1;
      
      if (currentIndex >= 0 && currentIndex < stages.length - 1) {
        dispatch(setNodeState(stages[currentIndex + 1]));
        return true;
      }
      
      return false;
    }, false, ErrorCode.NODE_NAVIGATION_ERROR);
  }, [dispatch, interactionStage]);
  
  /**
   * Navigates to the previous stage in the interaction
   * 
   * @returns Whether navigation was successful
   */
  const previousStage = useCallback((): boolean => {
    return tryCatch(() => {
      // Define the standard stage progression
      const stages: ChallengeStage[] = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
      const currentIndex = interactionStage ? stages.indexOf(interactionStage) : -1;
      
      if (currentIndex > 0) {
        dispatch(setNodeState(stages[currentIndex - 1]));
        return true;
      }
      
      return false;
    }, false, ErrorCode.NODE_NAVIGATION_ERROR);
  }, [dispatch, interactionStage]);
  
  /**
   * Checks if a given node is accessible
   * 
   * @param nodeId - The ID of the node to check
   * @returns Whether the node is unlocked
   */
  const isNodeAccessible = useCallback((nodeId: string): boolean => {
    return tryCatch(() => {
      return unlockedNodeIds.includes(nodeId);
    }, false, ErrorCode.NODE_ACCESS_ERROR);
  }, [unlockedNodeIds]);
  
  /**
   * Gets a node by ID
   * 
   * @param nodeId - The ID of the node to get
   * @returns The node with the given ID, or undefined if not found
   */
  const getNodeById = useCallback((nodeId: string): MapNode | undefined => {
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
    challengeStatus,
    
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