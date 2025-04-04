import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { generateMap } from '@/lib/utils/map-generator';
import { 
  MapNode, 
  MapEdge, 
  Difficulty, 
  MapGenerationOptions 
} from '@/lib/types/map-types';

export interface MapState {
  nodes: MapNode[];
  edges: MapEdge[];
  currentNodeId: string | null;
  startNodeId: string | null;
  bossNodeId: string | null;
  floorLevel: number;
  isMapGenerated: boolean;
  seed: number;
}

const initialState: MapState = {
  nodes: [],
  edges: [],
  currentNodeId: null,
  startNodeId: null,
  bossNodeId: null,
  floorLevel: 1,
  isMapGenerated: false,
  seed: Math.floor(Math.random() * 1000000)
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    generateNewMap: (state, action: PayloadAction<MapGenerationOptions>) => {
      const { difficulty, nodeCount } = action.payload;
      const { nodes, edges, startNodeId, bossNodeId } = generateMap(difficulty, nodeCount || 15);
      
      state.nodes = nodes;
      state.edges = edges;
      state.currentNodeId = startNodeId;
      state.startNodeId = startNodeId;
      state.bossNodeId = bossNodeId;
      state.isMapGenerated = true;
    },
    
    setCurrentNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const node = state.nodes.find(n => n.id === nodeId);
      
      if (node && (node.status === 'available' || node.status === 'current')) {
        // Update previous current node if it exists
        if (state.currentNodeId) {
          const prevNode = state.nodes.find(n => n.id === state.currentNodeId);
          if (prevNode && prevNode.status === 'current') {
            prevNode.status = 'completed';
          }
        }
        
        // Update new current node
        node.status = 'current';
        state.currentNodeId = nodeId;
        
        // Update connected nodes to be available
        node.connections.forEach(connId => {
          const connectedNode = state.nodes.find(n => n.id === connId);
          if (connectedNode && connectedNode.status === 'locked') {
            connectedNode.status = 'available';
          }
        });
      }
    },
    
    completeNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const node = state.nodes.find(n => n.id === nodeId);
      
      if (node) {
        node.status = 'completed';
        
        // Update connected nodes to be available
        node.connections.forEach(connId => {
          const connectedNode = state.nodes.find(n => n.id === connId);
          if (connectedNode && connectedNode.status === 'locked') {
            connectedNode.status = 'available';
          }
        });
      }
    },
    
    completeCurrentNode: (state) => {
      if (state.currentNodeId) {
        const currentNode = state.nodes.find(n => n.id === state.currentNodeId);
        if (currentNode) {
          currentNode.status = 'completed';
          
          // Update connected nodes to be available
          currentNode.connections.forEach(connId => {
            const connectedNode = state.nodes.find(n => n.id === connId);
            if (connectedNode && connectedNode.status === 'locked') {
              connectedNode.status = 'available';
            }
          });
        }
      }
    },
    
    incrementFloor: (state) => {
      state.floorLevel += 1;
    },
    
    resetMap: (state) => {
      return {
        ...initialState,
        seed: Math.floor(Math.random() * 1000000) // Generate a new seed
      };
    },
    
    // For debugging and testing
    unlockAllNodes: (state) => {
      state.nodes.forEach(node => {
        node.status = 'available';
      });
    }
  }
});

// Export actions
export const {
  generateNewMap,
  setCurrentNode,
  completeNode,
  completeCurrentNode,
  incrementFloor,
  resetMap,
  unlockAllNodes
} = mapSlice.actions;

// Export selectors
export const selectMapState = (state: RootState) => state.map;
export const selectNodes = (state: RootState) => state.map.nodes;
export const selectEdges = (state: RootState) => state.map.edges;
export const selectCurrentNodeId = (state: RootState) => state.map.currentNodeId;
export const selectBossNodeId = (state: RootState) => state.map.bossNodeId;
export const selectIsMapGenerated = (state: RootState) => state.map.isMapGenerated;
export const selectFloorLevel = (state: RootState) => state.map.floorLevel;

// Helper selector for current node
export const selectCurrentNode = (state: RootState) => 
  state.map.currentNodeId 
    ? state.map.nodes.find(node => node.id === state.map.currentNodeId) 
    : null;

// Helper selector for available nodes
export const selectAvailableNodes = (state: RootState) => 
  state.map.nodes.filter(node => node.status === 'available');

export default mapSlice.reducer;