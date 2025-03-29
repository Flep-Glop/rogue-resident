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
import type { MapNode, MapEdge, Difficulty, MapGenerationOptions } from '@/lib/types/map-types';

// Create memoized selectors
const selectMapNodes = createSelector(state => state.map.nodes);
const selectMapEdges = createSelector(state => state.map.edges);
const selectMapInfo = createSelector(state => ({
  currentNodeId: state.map.currentNodeId,
  startNodeId: state.map.startNodeId,
  bossNodeId: state.map.bossNodeId,
  floorLevel: state.map.floorLevel,
  isMapGenerated: state.map.isMapGenerated
}));
const selectCurrentMapNode = createSelector(state => {
  const { currentNodeId, nodes } = state.map;
  return currentNodeId ? nodes.find(node => node.id === currentNodeId) || null : null;
});
const selectAvailableNodes = createSelector(state => 
  state.map.nodes.filter(node => node.status === 'available')
);
const selectCompletedNodes = createSelector(state => 
  state.map.nodes.filter(node => node.status === 'completed')
);

/**
 * Hook for accessing and manipulating map state
 */
export function useMap() {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const nodes = useAppSelector(selectMapNodes);
  const edges = useAppSelector(selectMapEdges);
  const { currentNodeId, startNodeId, bossNodeId, floorLevel, isMapGenerated } = useAppSelector(selectMapInfo);
  const currentNode = useAppSelector(selectCurrentMapNode);
  const availableNodes = useAppSelector(selectAvailableNodes);
  const completedNodes = useAppSelector(selectCompletedNodes);
  
  // Map generation and reset
  const generateMap = useCallback((options: MapGenerationOptions) => {
    dispatch(generateNewMap(options));
  }, [dispatch]);
  
  const resetMapState = useCallback(() => {
    dispatch(resetMap());
  }, [dispatch]);
  
  // Node navigation
  const navigateToNode = useCallback((nodeId: string) => {
    dispatch(setCurrentNode(nodeId));
  }, [dispatch]);
  
  // Node completion
  const markNodeCompleted = useCallback((nodeId: string) => {
    dispatch(completeNode(nodeId));
  }, [dispatch]);
  
  const completeCurrentMapNode = useCallback(() => {
    dispatch(completeCurrentNode());
  }, [dispatch]);
  
  // Floor progression
  const goToNextFloor = useCallback(() => {
    dispatch(incrementFloor());
    // Generate a new map for the next floor
    dispatch(resetMap());
  }, [dispatch]);
  
  // Debug function
  const unlockAll = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      dispatch(unlockAllNodes());
    }
  }, [dispatch]);
  
  // Utility functions
  const isNodeAccessible = useCallback((nodeId: string): boolean => {
    const node = nodes.find(n => n.id === nodeId);
    return node?.status === 'available' || node?.status === 'current';
  }, [nodes]);
  
  const getNodeById = useCallback((nodeId: string): MapNode | undefined => {
    return nodes.find(node => node.id === nodeId);
  }, [nodes]);
  
  const getConnectedNodes = useCallback((nodeId: string): MapNode[] => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    return nodes.filter(n => node.connections.includes(n.id));
  }, [nodes]);
  
  const isFloorCompleted = useCallback((): boolean => {
    // Floor is completed when the boss node is completed
    return !!bossNodeId && !!nodes.find(n => n.id === bossNodeId && n.status === 'completed');
  }, [nodes, bossNodeId]);
  
  const getMapProgress = useCallback((): number => {
    if (nodes.length === 0) return 0;
    const completedCount = nodes.filter(n => n.status === 'completed').length;
    return Math.floor((completedCount / nodes.length) * 100);
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