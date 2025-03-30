'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, createSelector } from '@/lib/redux/hooks';
import {
  generateNewMap,
  setCurrentNode,
  completeNode,
  completeCurrentNode,
  incrementFloor,
  resetMap,
  unlockAllNodes
} from '@/lib/redux/slices/map-slice';
import type { MapNode, MapEdge, MapGenerationOptions } from '@/lib/types/map-types';
import type { Difficulty } from '@/lib/types/game-types';
import type { RootState } from '@/lib/types/redux-types';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

// Create memoized selectors
const selectMapNodes = createSelector(
  [(state: RootState) => state.map.nodes],
  (nodes) => nodes
);

const selectMapEdges = createSelector(
  [(state: RootState) => state.map.edges],
  (edges) => edges
);

const selectMapInfo = createSelector(
  [(state: RootState) => state.map],
  (map) => ({
    currentNodeId: map.currentNodeId,
    startNodeId: map.startNodeId,
    bossNodeId: map.bossNodeId,
    floorLevel: map.floorLevel,
    isMapGenerated: map.isGenerated,
    unlockedNodeIds: map.unlockedNodeIds
  })
);

const selectCurrentMapNode = createSelector(
  [(state: RootState) => state.map.currentNodeId, (state: RootState) => state.map.nodes],
  (currentNodeId, nodes) => 
    currentNodeId ? nodes.find(node => node.id === currentNodeId) || null : null
);

const selectAvailableNodes = createSelector(
  [(state: RootState) => state.map.nodes],
  (nodes) => nodes.filter(node => node.status === 'available')
);

const selectCompletedNodes = createSelector(
  [(state: RootState) => state.map.nodes],
  (nodes) => nodes.filter(node => node.status === 'completed')
);

/**
 * Interface defining the return value of the useMap hook
 */
interface UseMapReturn {
  // State
  nodes: MapNode[];
  edges: MapEdge[];
  currentNodeId: string | null;
  startNodeId: string | null;
  bossNodeId: string | null;
  floorLevel: number;
  isMapGenerated: boolean;
  currentNode: MapNode | null;
  availableNodes: MapNode[];
  completedNodes: MapNode[];
  unlockedNodeIds: string[];
  
  // Actions
  generateMap: (options: MapGenerationOptions) => void;
  resetMap: () => void;
  navigateToNode: (nodeId: string) => void;
  markNodeCompleted: (nodeId: string) => void;
  completeCurrentNode: () => void;
  goToNextFloor: () => void;
  unlockAllNodes: () => void;
  
  // Utility
  isNodeAccessible: (nodeId: string) => boolean;
  getNodeById: (nodeId: string) => MapNode | undefined;
  getConnectedNodes: (nodeId: string) => MapNode[];
  isFloorCompleted: () => boolean;
  getMapProgress: () => number;
}

/**
 * Hook for accessing and manipulating map state
 * 
 * Provides access to the game map, nodes, and actions to navigate and modify the map.
 * 
 * @returns Object containing map state and actions
 */
export function useMap(): UseMapReturn {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const nodes = useAppSelector(selectMapNodes);
  const edges = useAppSelector(selectMapEdges);
  const { 
    currentNodeId, 
    startNodeId, 
    bossNodeId, 
    floorLevel, 
    isMapGenerated,
    unlockedNodeIds
  } = useAppSelector(selectMapInfo);
  const currentNode = useAppSelector(selectCurrentMapNode);
  const availableNodes = useAppSelector(selectAvailableNodes);
  const completedNodes = useAppSelector(selectCompletedNodes);
  
  /**
   * Generates a new map with the given options
   * 
   * @param options - Configuration options for map generation
   */
  const generateMap = useCallback((options: MapGenerationOptions): void => {
    tryCatch(() => {
      dispatch(generateNewMap(options));
    }, undefined, ErrorCode.MAP_GENERATION_ERROR);
  }, [dispatch]);
  
  /**
   * Resets the map state to initial values
   */
  const resetMapState = useCallback((): void => {
    tryCatch(() => {
      dispatch(resetMap());
    }, undefined, ErrorCode.MAP_RESET_ERROR);
  }, [dispatch]);
  
  /**
   * Navigates to a specific node
   * 
   * @param nodeId - The ID of the node to navigate to
   */
  const navigateToNode = useCallback((nodeId: string): void => {
    tryCatch(() => {
      dispatch(setCurrentNode(nodeId));
    }, undefined, ErrorCode.NODE_NAVIGATION_ERROR);
  }, [dispatch]);
  
  /**
   * Marks a specific node as completed
   * 
   * @param nodeId - The ID of the node to mark as completed
   */
  const markNodeCompleted = useCallback((nodeId: string): void => {
    tryCatch(() => {
      dispatch(completeNode(nodeId));
    }, undefined, ErrorCode.NODE_COMPLETION_ERROR);
  }, [dispatch]);
  
  /**
   * Completes the current node
   */
  const completeCurrentMapNode = useCallback((): void => {
    tryCatch(() => {
      if (currentNodeId) {
        dispatch(completeCurrentNode());
      }
    }, undefined, ErrorCode.NODE_COMPLETION_ERROR);
  }, [dispatch, currentNodeId]);
  
  /**
   * Advances to the next floor and resets the map
   */
  const goToNextFloor = useCallback((): void => {
    tryCatch(() => {
      dispatch(incrementFloor());
      // Reset map for the next floor
      dispatch(resetMap());
    }, undefined, ErrorCode.FLOOR_PROGRESSION_ERROR);
  }, [dispatch]);
  
  /**
   * Unlocks all nodes on the map (debug function)
   */
  const unlockAll = useCallback((): void => {
    tryCatch(() => {
      if (process.env.NODE_ENV === 'development') {
        dispatch(unlockAllNodes());
      }
    }, undefined, ErrorCode.MAP_ERROR);
  }, [dispatch]);
  
  /**
   * Checks if a node is accessible for the player
   * 
   * @param nodeId - The ID of the node to check
   * @returns Whether the node is available or current
   */
  const isNodeAccessible = useCallback((nodeId: string): boolean => {
    return tryCatch(() => {
      return unlockedNodeIds.includes(nodeId);
    }, false, ErrorCode.NODE_ACCESS_ERROR);
  }, [unlockedNodeIds]);
  
  /**
   * Gets a node by its ID
   * 
   * @param nodeId - The ID of the node to get
   * @returns The node with the given ID, or undefined if not found
   */
  const getNodeById = useCallback((nodeId: string): MapNode | undefined => {
    return tryCatch(() => {
      return nodes.find(node => node.id === nodeId);
    }, undefined, ErrorCode.NODE_ERROR);
  }, [nodes]);
  
  /**
   * Gets all nodes connected to a specific node
   * 
   * @param nodeId - The ID of the node to get connections for
   * @returns Array of nodes connected to the specified node
   */
  const getConnectedNodes = useCallback((nodeId: string): MapNode[] => {
    return tryCatch(() => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return [];
      
      return nodes.filter(n => node.connections.includes(n.id));
    }, [], ErrorCode.NODE_ERROR);
  }, [nodes]);
  
  /**
   * Checks if the current floor is completed
   * 
   * @returns Whether the boss node is completed
   */
  const isFloorCompleted = useCallback((): boolean => {
    return tryCatch(() => {
      // Floor is completed when the boss node is completed
      return !!bossNodeId && !!nodes.find(n => n.id === bossNodeId && n.status === 'completed');
    }, false, ErrorCode.MAP_ERROR);
  }, [nodes, bossNodeId]);
  
  /**
   * Gets the map completion progress as a percentage
   * 
   * @returns Percentage of nodes completed (0-100)
   */
  const getMapProgress = useCallback((): number => {
    return tryCatch(() => {
      if (nodes.length === 0) return 0;
      const completedCount = nodes.filter(n => n.status === 'completed').length;
      return Math.floor((completedCount / nodes.length) * 100);
    }, 0, ErrorCode.MAP_ERROR);
  }, [nodes]);
  
  return {
    // State
    nodes,
    edges,
    currentNodeId,
    startNodeId,
    bossNodeId,
    floorLevel,
    isMapGenerated,
    currentNode,
    availableNodes,
    completedNodes,
    unlockedNodeIds,
    
    // Actions
    generateMap,
    resetMap: resetMapState,
    navigateToNode,
    markNodeCompleted,
    completeCurrentNode: completeCurrentMapNode,
    goToNextFloor,
    unlockAllNodes: unlockAll,
    
    // Utility
    isNodeAccessible,
    getNodeById,
    getConnectedNodes,
    isFloorCompleted,
    getMapProgress
  };
}