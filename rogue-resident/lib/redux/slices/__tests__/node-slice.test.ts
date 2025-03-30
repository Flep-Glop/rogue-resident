import nodeReducer, {
  selectNode,
  setNodeState,
  resetNodeInteraction,
  updateNodeData,
  completeNode
} from '../node-slice';
import { NodeType } from '@/lib/types/map-types';

describe('Node Slice', () => {
  // Initial state tests
  describe('initial state', () => {
    it('should return the initial state', () => {
      const initialState = {
        isInteracting: false,
        selectedNodeId: null,
        interactionStage: 'introduction',
        nodeType: null,
        nodeData: null
      };
      
      // @ts-ignore - Passing undefined action is valid for initial state
      expect(nodeReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  // Action tests
  describe('node actions', () => {
    it('should handle selectNode', () => {
      const nodeData = {
        nodeId: 'node-001',
        nodeType: 'clinical' as NodeType,
        nodeData: {
          title: 'Clinical Node',
          description: 'A clinical challenge node',
          difficulty: 'normal'
        }
      };
      
      const state = nodeReducer(undefined, selectNode(nodeData));
      
      expect(state.isInteracting).toBe(true);
      expect(state.selectedNodeId).toBe(nodeData.nodeId);
      expect(state.nodeType).toBe(nodeData.nodeType);
      expect(state.interactionStage).toBe('introduction');
      expect(state.nodeData).toEqual(nodeData.nodeData);
    });

    it('should handle setNodeState', () => {
      const initialState = {
        isInteracting: true,
        selectedNodeId: 'node-001',
        interactionStage: 'introduction',
        nodeType: 'clinical' as NodeType,
        nodeData: {
          title: 'Clinical Node',
          description: 'A clinical challenge node',
          difficulty: 'normal'
        }
      };
      
      const newStage = 'stage1';
      const state = nodeReducer(initialState, setNodeState(newStage));
      
      expect(state.interactionStage).toBe(newStage);
      expect(state.isInteracting).toBe(true); // Should remain true
    });

    it('should handle resetNodeInteraction', () => {
      const initialState = {
        isInteracting: true,
        selectedNodeId: 'node-001',
        interactionStage: 'stage2',
        nodeType: 'clinical' as NodeType,
        nodeData: {
          title: 'Clinical Node',
          description: 'A clinical challenge node',
          difficulty: 'normal'
        }
      };
      
      const state = nodeReducer(initialState, resetNodeInteraction());
      
      // Should reset to initial state
      expect(state.isInteracting).toBe(false);
      expect(state.selectedNodeId).toBeNull();
      expect(state.interactionStage).toBe('introduction');
      expect(state.nodeType).toBeNull();
      expect(state.nodeData).toBeNull();
    });

    it('should handle updateNodeData', () => {
      const initialState = {
        isInteracting: true,
        selectedNodeId: 'node-001',
        interactionStage: 'stage1',
        nodeType: 'clinical' as NodeType,
        nodeData: {
          title: 'Clinical Node',
          description: 'A clinical challenge node',
          difficulty: 'normal',
          currentStep: 1
        }
      };
      
      const newData = {
        currentStep: 2,
        challengeStarted: true
      };
      
      const state = nodeReducer(initialState, updateNodeData(newData));
      
      // Should merge data
      expect(state.nodeData).toEqual({
        title: 'Clinical Node',
        description: 'A clinical challenge node',
        difficulty: 'normal',
        currentStep: 2, // Updated
        challengeStarted: true // Added
      });
    });

    it('should handle completeNode with success', () => {
      const initialState = {
        isInteracting: true,
        selectedNodeId: 'node-001',
        interactionStage: 'outcome',
        nodeType: 'clinical' as NodeType,
        nodeData: {
          title: 'Clinical Node',
          description: 'A clinical challenge node',
          difficulty: 'normal'
        }
      };
      
      const state = nodeReducer(initialState, completeNode({ success: true }));
      
      // Should mark as not interacting but keep the node data for reference
      expect(state.isInteracting).toBe(false);
      expect(state.selectedNodeId).toBe('node-001'); // Should keep the ID
      expect(state.nodeType).toBe('clinical'); // Should keep the type
      expect(state.nodeData).toEqual(initialState.nodeData); // Should keep the data
    });

    it('should handle completeNode with failure', () => {
      const initialState = {
        isInteracting: true,
        selectedNodeId: 'node-001',
        interactionStage: 'outcome',
        nodeType: 'clinical' as NodeType,
        nodeData: {
          title: 'Clinical Node',
          description: 'A clinical challenge node',
          difficulty: 'normal'
        }
      };
      
      const state = nodeReducer(initialState, completeNode({ success: false }));
      
      // Should mark as not interacting but keep the node data for reference
      expect(state.isInteracting).toBe(false);
      expect(state.selectedNodeId).toBe('node-001'); // Should keep the ID
      expect(state.nodeType).toBe('clinical'); // Should keep the type
      expect(state.nodeData).toEqual(initialState.nodeData); // Should keep the data
    });
  });

  // Complex scenario tests
  describe('node interaction scenarios', () => {
    it('should handle a complete node interaction flow', () => {
      // Start with initial state
      let state = nodeReducer(undefined, { type: 'unknown' });
      
      // Select a node
      state = nodeReducer(state, selectNode({
        nodeId: 'node-001',
        nodeType: 'qa',
        nodeData: {
          title: 'QA Challenge',
          description: 'Calibrate the linear accelerator',
          difficulty: 'normal'
        }
      }));
      
      // Should be in introduction stage
      expect(state.isInteracting).toBe(true);
      expect(state.selectedNodeId).toBe('node-001');
      expect(state.nodeType).toBe('qa');
      expect(state.interactionStage).toBe('introduction');
      
      // Update with some interaction data
      state = nodeReducer(state, updateNodeData({
        stepsCompleted: 0,
        totalSteps: 4
      }));
      
      // Advance to stage 1
      state = nodeReducer(state, setNodeState('stage1'));
      expect(state.interactionStage).toBe('stage1');
      
      // Update completion progress
      state = nodeReducer(state, updateNodeData({
        stepsCompleted: 1,
        userChoices: ['option-a']
      }));
      
      // Advance to stage 2
      state = nodeReducer(state, setNodeState('stage2'));
      expect(state.interactionStage).toBe('stage2');
      
      // Update completion progress
      state = nodeReducer(state, updateNodeData({
        stepsCompleted: 2,
        userChoices: ['option-a', 'option-c']
      }));
      
      // Advance to stage 3
      state = nodeReducer(state, setNodeState('stage3'));
      expect(state.interactionStage).toBe('stage3');
      
      // Update completion progress
      state = nodeReducer(state, updateNodeData({
        stepsCompleted: 3,
        userChoices: ['option-a', 'option-c', 'option-b']
      }));
      
      // Advance to outcome
      state = nodeReducer(state, setNodeState('outcome'));
      expect(state.interactionStage).toBe('outcome');
      
      // Mark node as completed successfully
      state = nodeReducer(state, completeNode({ success: true }));
      
      // Verify final state
      expect(state.isInteracting).toBe(false); // No longer interacting
      expect(state.selectedNodeId).toBe('node-001'); // ID is preserved
      expect(state.nodeType).toBe('qa'); // Type is preserved
      
      // Data is preserved
      expect(state.nodeData).toEqual({
        title: 'QA Challenge',
        description: 'Calibrate the linear accelerator',
        difficulty: 'normal',
        stepsCompleted: 3,
        totalSteps: 4,
        userChoices: ['option-a', 'option-c', 'option-b']
      });
    });

    it('should allow canceling interaction mid-flow', () => {
      // Start a node interaction
      let state = nodeReducer(undefined, selectNode({
        nodeId: 'node-001',
        nodeType: 'educational',
        nodeData: {
          title: 'Educational Challenge',
          description: 'Teach radiation biology',
          difficulty: 'normal'
        }
      }));
      
      // Advance to stage 1
      state = nodeReducer(state, setNodeState('stage1'));
      expect(state.interactionStage).toBe('stage1');
      
      // Reset in the middle of interaction
      state = nodeReducer(state, resetNodeInteraction());
      
      // Verify reset state
      expect(state.isInteracting).toBe(false);
      expect(state.selectedNodeId).toBeNull();
      expect(state.nodeType).toBeNull();
      expect(state.interactionStage).toBe('introduction');
      expect(state.nodeData).toBeNull();
    });
  });
});