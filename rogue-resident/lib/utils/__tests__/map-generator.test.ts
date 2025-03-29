import { generateMap, isFullyConnected } from '../map-generator';
import { Difficulty, NodeType, NodeStatus } from '@/lib/types/map-types';

// Mock Math.random for deterministic tests
const originalRandom = Math.random;
beforeEach(() => {
  // Using a fixed seed for deterministic results
  let seed = 0.5;
  Math.random = jest.fn(() => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  });
});

afterEach(() => {
  // Restore original Math.random
  Math.random = originalRandom;
});

describe('Map Generator', () => {
  // Test map generation
  describe('generateMap', () => {
    it('should generate a map with the specified number of nodes', () => {
      const nodeCount = 15;
      const { nodes } = generateMap('normal', nodeCount);
      expect(nodes.length).toBe(nodeCount);
    });

    it('should always include start and boss nodes', () => {
      const { nodes } = generateMap('normal', 10);
      
      const startNode = nodes.find(node => node.type === 'start');
      expect(startNode).toBeDefined();
      
      const bossNode = nodes.find(node => node.type === 'boss');
      expect(bossNode).toBeDefined();
    });

    it('should set the start node as current and boss node as locked', () => {
      const { nodes } = generateMap('normal', 10);
      
      const startNode = nodes.find(node => node.type === 'start');
      expect(startNode?.status).toBe('current');
      
      const bossNode = nodes.find(node => node.type === 'boss');
      expect(bossNode?.status).toBe('locked');
    });

    it('should create a connected graph with valid paths', () => {
      const { nodes, edges } = generateMap('normal', 15);
      
      // Verify that edges connect existing nodes
      edges.forEach(edge => {
        const sourceExists = nodes.some(node => node.id === edge.source);
        const targetExists = nodes.some(node => node.id === edge.target);
        
        expect(sourceExists).toBe(true);
        expect(targetExists).toBe(true);
      });
      
      // Verify connections in node data match edges
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          // Find an edge that connects this node to the connection
          const edgeExists = edges.some(
            edge => edge.source === node.id && edge.target === connId
          );
          
          expect(edgeExists).toBe(true);
        });
      });
    });

    it('should create nodes with valid types', () => {
      const { nodes } = generateMap('normal', 15);
      
      const validTypes: NodeType[] = [
        'clinical', 
        'qa', 
        'educational', 
        'storage', 
        'vendor', 
        'boss', 
        'start'
      ];
      
      nodes.forEach(node => {
        expect(validTypes).toContain(node.type);
      });
    });

    it('should adjust node count based on difficulty', () => {
      const baseNodeCount = 15;
      
      const { nodes: easyNodes } = generateMap('easy', baseNodeCount);
      const { nodes: normalNodes } = generateMap('normal', baseNodeCount);
      const { nodes: hardNodes } = generateMap('hard', baseNodeCount);
      
      // Easy should have fewer nodes
      expect(easyNodes.length).toBeLessThan(normalNodes.length);
      
      // Hard should have more nodes
      expect(hardNodes.length).toBeGreaterThan(normalNodes.length);
    });

    it('should adjust node type distribution based on difficulty', () => {
      // In easy mode, there should be more storage nodes (helpful items)
      const { nodes: easyNodes } = generateMap('easy', 20);
      const easyStorageCount = easyNodes.filter(n => n.type === 'storage').length;
      
      // In hard mode, there should be more challenge nodes (clinical, qa, educational)
      const { nodes: hardNodes } = generateMap('hard', 20);
      const hardStorageCount = hardNodes.filter(n => n.type === 'storage').length;
      
      // Easy should have more storage nodes than hard
      expect(easyStorageCount).toBeGreaterThan(hardStorageCount);
      
      // Hard should have more challenge nodes
      const hardChallengeCount = hardNodes.filter(
        n => n.type === 'clinical' || n.type === 'qa' || n.type === 'educational'
      ).length;
      
      const easyChallengeCount = easyNodes.filter(
        n => n.type === 'clinical' || n.type === 'qa' || n.type === 'educational'
      ).length;
      
      expect(hardChallengeCount).toBeGreaterThan(easyChallengeCount);
    });

    it('should mark nodes connected to start as available', () => {
      const { nodes } = generateMap('normal', 15);
      
      const startNode = nodes.find(node => node.type === 'start');
      expect(startNode).toBeDefined();
      
      // All nodes connected to start should be available
      if (startNode) {
        startNode.connections.forEach(connId => {
          const connectedNode = nodes.find(n => n.id === connId);
          expect(connectedNode?.status).toBe('available');
        });
      }
    });
  });

  // Test isFullyConnected helper function
  describe('isFullyConnected', () => {
    it('should return true for a fully connected graph', () => {
      const nodes = [
        { id: 'node1', connections: ['node2'], type: 'start' as NodeType, x: 0, y: 0, title: '', description: '', status: 'current' as NodeStatus },
        { id: 'node2', connections: ['node3'], type: 'clinical' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus },
        { id: 'node3', connections: ['node4'], type: 'qa' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus },
        { id: 'node4', connections: [], type: 'boss' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus }
      ];
      
      expect(isFullyConnected(nodes)).toBe(true);
    });

    it('should return false for a disconnected graph', () => {
      const nodes = [
        { id: 'node1', connections: ['node2'], type: 'start' as NodeType, x: 0, y: 0, title: '', description: '', status: 'current' as NodeStatus },
        { id: 'node2', connections: [], type: 'clinical' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus },
        // Disconnected nodes
        { id: 'node3', connections: ['node4'], type: 'qa' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus },
        { id: 'node4', connections: [], type: 'boss' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus }
      ];
      
      expect(isFullyConnected(nodes)).toBe(false);
    });

    it('should handle empty node arrays', () => {
      expect(isFullyConnected([])).toBe(true);
    });

    it('should handle a single node', () => {
      const nodes = [
        { id: 'node1', connections: [], type: 'start' as NodeType, x: 0, y: 0, title: '', description: '', status: 'current' as NodeStatus }
      ];
      
      expect(isFullyConnected(nodes)).toBe(true);
    });

    it('should handle circular connections', () => {
      const nodes = [
        { id: 'node1', connections: ['node2'], type: 'start' as NodeType, x: 0, y: 0, title: '', description: '', status: 'current' as NodeStatus },
        { id: 'node2', connections: ['node3'], type: 'clinical' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus },
        { id: 'node3', connections: ['node1'], type: 'qa' as NodeType, x: 0, y: 0, title: '', description: '', status: 'locked' as NodeStatus }
      ];
      
      expect(isFullyConnected(nodes)).toBe(true);
    });
  });

  // Test complete map generation with different parameters
  describe('map generation with different parameters', () => {
    it('should generate a valid map with minimum nodes', () => {
      const { nodes, edges, startNodeId, bossNodeId } = generateMap('normal', 5);
      
      expect(nodes.length).toBe(5);
      expect(edges.length).toBeGreaterThan(0);
      expect(startNodeId).toBeDefined();
      expect(bossNodeId).toBeDefined();
      
      // Map should be fully connected
      expect(isFullyConnected(nodes)).toBe(true);
    });

    it('should generate a valid map with many nodes', () => {
      const { nodes, edges, startNodeId, bossNodeId } = generateMap('normal', 30);
      
      expect(nodes.length).toBe(30);
      expect(edges.length).toBeGreaterThan(0);
      expect(startNodeId).toBeDefined();
      expect(bossNodeId).toBeDefined();
      
      // Map should be fully connected
      expect(isFullyConnected(nodes)).toBe(true);
    });

    // This test verifies that the map generation is deterministic with a fixed random seed
    it('should generate identical maps with the same random seed', () => {
      // Use a fixed seed function
      let seed = 12345;
      const mockRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      
      // Mock Math.random
      const originalRandom = Math.random;
      Math.random = jest.fn(mockRandom);
      
      // Generate first map
      const firstMap = generateMap('normal', 10);
      
      // Reset seed and generate second map
      seed = 12345;
      const secondMap = generateMap('normal', 10);
      
      // Restore original Math.random
      Math.random = originalRandom;
      
      // Maps should be identical
      expect(firstMap.nodes.length).toBe(secondMap.nodes.length);
      expect(firstMap.edges.length).toBe(secondMap.edges.length);
      
      // Compare node types and positions
      for (let i = 0; i < firstMap.nodes.length; i++) {
        expect(firstMap.nodes[i].type).toBe(secondMap.nodes[i].type);
        expect(firstMap.nodes[i].x).toBe(secondMap.nodes[i].x);
        expect(firstMap.nodes[i].y).toBe(secondMap.nodes[i].y);
      }
    });
  });
});