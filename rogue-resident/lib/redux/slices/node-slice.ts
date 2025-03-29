import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { NodeType } from '@/lib/types/map-types';

export interface NodeInteractionState {
  isInteracting: boolean;
  selectedNodeId: string | null;
  interactionStage: string;
  nodeType: NodeType | null;
  nodeData: any; // Specific data for the current node interaction
}

const initialState: NodeInteractionState = {
  isInteracting: false,
  selectedNodeId: null,
  interactionStage: 'introduction', // Default first stage
  nodeType: null,
  nodeData: null
};

export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    // Start interacting with a node
    selectNode: (state, action: PayloadAction<{
      nodeId: string,
      nodeType: NodeType,
      nodeData?: any
    }>) => {
      const { nodeId, nodeType, nodeData } = action.payload;
      
      state.isInteracting = true;
      state.selectedNodeId = nodeId;
      state.nodeType = nodeType;
      state.interactionStage = 'introduction';
      state.nodeData = nodeData || null;
    },
    
    // Update the current interaction stage
    setNodeState: (state, action: PayloadAction<string>) => {
      state.interactionStage = action.payload;
    },
    
    // End interaction with the current node
    resetNodeInteraction: (state) => {
      return initialState;
    },
    
    // Update node data during interaction
    updateNodeData: (state, action: PayloadAction<any>) => {
      state.nodeData = {
        ...state.nodeData,
        ...action.payload
      };
    }
  }
});

// Export actions
export const {
  selectNode,
  setNodeState,
  resetNodeInteraction,
  updateNodeData
} = nodeSlice.actions;

// Export selectors
export const selectNodeState = (state: RootState) => state.node;
export const selectIsInteracting = (state: RootState) => state.node.isInteracting;
export const selectSelectedNodeId = (state: RootState) => state.node.selectedNodeId;
export const selectInteractionStage = (state: RootState) => state.node.interactionStage;
export const selectNodeType = (state: RootState) => state.node.nodeType;
export const selectNodeData = (state: RootState) => state.node.nodeData;

export default nodeSlice.reducer;