import { 
    MapNode, 
    MapEdge, 
    GeneratedMap, 
    NodeType, 
    NodePosition,
    Difficulty
  } from '@/lib/types/map-types';
  
  // Node type distribution weights (normalized later)
  const defaultNodeDistribution: Record<NodeType, number> = {
    clinical: 30,
    qa: 25,
    educational: 20,
    storage: 10,
    vendor: 10,
    boss: 1,   // Always exactly 1 boss node
    start: 1   // Always exactly 1 start node
  };
  
  // Node templates for different types
  const nodeTemplates: Record<NodeType, { titles: string[], descriptions: string[] }> = {
    clinical: {
      titles: [
        'Patient Case: Breast Cancer',
        'Patient Case: Prostate IMRT',
        'Patient Case: Pediatric Brain',
        'Patient Case: Lung SBRT',
        'Patient Case: Head & Neck'
      ],
      descriptions: [
        'Evaluate CT images and design an optimal treatment plan.',
        'Assess target coverage while minimizing dose to critical structures.',
        'Create a treatment approach for this challenging case.',
        'Determine appropriate technique and parameters for treatment.',
        'Balance tumor coverage with organ-at-risk constraints.'
      ]
    },
    qa: {
      titles: [
        'Linac Output Calibration',
        'CT Scanner QA',
        'TLD Batch Verification',
        'MLC Calibration Check',
        'Imaging System QA'
      ],
      descriptions: [
        'Perform calibration procedures on the linear accelerator.',
        'Ensure CT scanner is performing within specifications.',
        'Verify the accuracy of thermoluminescent dosimeters.',
        'Check the calibration of the multi-leaf collimator system.',
        'Validate the performance of imaging systems.'
      ]
    },
    educational: {
      titles: [
        'Teaching: Radiation Biology',
        'Teaching: Brachytherapy Principles',
        'Teaching: Radiation Protection',
        'Teaching: Treatment Planning',
        'Teaching: Dosimetry Fundamentals'
      ],
      descriptions: [
        'Prepare and deliver a lecture on radiation biology concepts.',
        'Create an effective lesson on brachytherapy principles.',
        'Develop materials to teach radiation protection standards.',
        'Design an educational session on treatment planning.',
        'Prepare a comprehensive overview of dosimetry fundamentals.'
      ]
    },
    storage: {
      titles: [
        'Dusty Storage Closet',
        'Old Equipment Room',
        'Archive Room',
        'Supply Closet',
        'Forgotten Cabinet'
      ],
      descriptions: [
        'This closet hasn\'t been cleaned in years. Who knows what you might find?',
        'Outdated equipment that might still have some use.',
        'Historical records and old tools gather dust here.',
        'Various supplies that could prove helpful in your work.',
        'A cabinet that seems to have been forgotten by time.'
      ]
    },
    vendor: {
      titles: [
        'Vendor: Precision Instruments',
        'Vendor: Software Solutions',
        'Vendor: Educational Resources',
        'Vendor: Clinical Tools',
        'Vendor: Research Equipment'
      ],
      descriptions: [
        'High-quality measurement and calibration instruments.',
        'Cutting-edge software for medical physics applications.',
        'Resources and tools for effective teaching and learning.',
        'Specialized tools for clinical medical physics work.',
        'Advanced equipment for research and development.'
      ]
    },
    boss: {
      titles: [
        'Ionix Containment Chamber'
      ],
      descriptions: [
        'A high-security area where the sentient ion chamber known as Ionix is contained.'
      ]
    },
    start: {
      titles: [
        'Department Entrance'
      ],
      descriptions: [
        'The starting point of your journey through the medical physics department.'
      ]
    }
  };
  
  /**
   * Generates a complete game map with nodes and connections
   * @param difficulty The difficulty level to generate for
   * @param nodeCount Total number of nodes to generate
   * @returns Generated map with nodes, edges, and special node IDs
   */
  export function generateMap(difficulty: Difficulty, nodeCount: number = 15): GeneratedMap {
    // Adjust node count based on difficulty
    const adjustedNodeCount = difficulty === 'easy' 
      ? nodeCount - 2 
      : difficulty === 'hard' 
        ? nodeCount + 2 
        : nodeCount;
    
    // 1. Create node positions (layout)
    const positions = generateNodePositions(adjustedNodeCount);
    
    // 2. Assign node types
    const nodes = assignNodeTypes(positions, difficulty);
    
    // 3. Connect nodes
    const edges = connectNodes(nodes);
    
    // 4. Find special nodes
    const startNodeId = nodes.find(node => node.type === 'start')?.id || '';
    const bossNodeId = nodes.find(node => node.type === 'boss')?.id || '';
    
    // 5. Update node statuses
    nodes.forEach(node => {
      if (node.type === 'start') {
        node.status = 'current';
      } else if (node.id === bossNodeId) {
        node.status = 'locked';
      } else {
        // Determine if node is connected to start
        const isConnectedToStart = node.connections.includes(startNodeId) || 
                                  nodes.find(n => n.id === startNodeId)?.connections.includes(node.id);
        
        node.status = isConnectedToStart ? 'available' : 'locked';
      }
    });
    
    return {
      nodes,
      edges,
      startNodeId,
      bossNodeId
    };
  }
  
  /**
   * Generates positions for nodes in a layered layout
   * @param nodeCount Number of nodes to position
   * @returns Array of node positions
   */
  function generateNodePositions(nodeCount: number): NodePosition[] {
    const positions: NodePosition[] = [];
    
    // Parameters
    const width = 1000;
    const height = 600;
    const minLayerNodes = 2;
    const maxLayerNodes = 5;
    
    // Calculate number of layers based on node count
    const layerCount = Math.ceil(Math.sqrt(nodeCount));
    const nodesPerLayer = Math.ceil(nodeCount / layerCount);
    
    let nodeId = 1;
    
    // Generate nodes layer by layer
    for (let layer = 0; layer < layerCount; layer++) {
      // Last layer might have fewer nodes
      const layerNodeCount = layer === layerCount - 1 
        ? nodeCount - (layer * nodesPerLayer) 
        : Math.min(
            nodesPerLayer, 
            Math.floor(Math.random() * (maxLayerNodes - minLayerNodes + 1)) + minLayerNodes
          );
      
      // Position nodes in this layer
      for (let i = 0; i < layerNodeCount && nodeId <= nodeCount; i++) {
        // Calculate x and y positions
        // x: distribute horizontally within layer
        // y: position based on layer with some randomness
        const x = width * (i + 1) / (layerNodeCount + 1);
        const y = height * (layer + 0.5) / layerCount + (Math.random() * 50 - 25);
        
        positions.push({
          id: `node-${nodeId}`,
          x,
          y,
          layer
        });
        
        nodeId++;
      }
    }
    
    return positions;
  }
  
  /**
   * Assigns node types based on positions and desired distribution
   * @param positions Node positions
   * @param difficulty Game difficulty
   * @returns Complete map nodes
   */
  function assignNodeTypes(positions: NodePosition[], difficulty: Difficulty): MapNode[] {
    const nodes: MapNode[] = [];
    
    // Create a copy of the node distribution
    const distribution = { ...defaultNodeDistribution };
    
    // Adjust distribution based on difficulty
    if (difficulty === 'easy') {
      distribution.storage += 5;
      distribution.clinical -= 2;
      distribution.qa -= 2;
    } else if (difficulty === 'hard') {
      distribution.storage -= 5;
      distribution.clinical += 3;
      distribution.qa += 3;
      distribution.educational += 2;
    }
    
    // Constants
    const lastLayer = Math.max(...positions.map(p => p.layer));
    
    // First, assign special nodes
    // Start node is in the first layer
    const startNodePosition = positions.find(p => p.layer === 0);
    if (startNodePosition) {
      nodes.push(createNode(startNodePosition, 'start'));
      positions = positions.filter(p => p.id !== startNodePosition.id);
    }
    
    // Boss node is in the last layer
    const bossNodePosition = positions.find(p => p.layer === lastLayer);
    if (bossNodePosition) {
      nodes.push(createNode(bossNodePosition, 'boss'));
      positions = positions.filter(p => p.id !== bossNodePosition.id);
    }
    
    // Assign types to remaining nodes based on distribution
    for (const position of positions) {
      // For nodes in the last layer that aren't the boss,
      // assign a type with more challenge (clinical, qa, educational)
      if (position.layer === lastLayer) {
        const challengeTypes: NodeType[] = ['clinical', 'qa', 'educational'];
        const type = pickRandom(challengeTypes);
        nodes.push(createNode(position, type));
      } else {
        // For other nodes, use weighted random selection
        const type = selectWeightedNodeType(distribution);
        nodes.push(createNode(position, type));
      }
    }
    
    return nodes;
  }
  
  /**
   * Creates a new node with the given position and type
   * @param position Node position
   * @param type Node type
   * @returns Complete map node
   */
  function createNode(position: NodePosition, type: NodeType): MapNode {
    // Select random title and description from templates
    const templates = nodeTemplates[type];
    const title = pickRandom(templates.titles);
    const description = pickRandom(templates.descriptions);
    
    return {
      id: position.id,
      type,
      x: position.x,
      y: position.y,
      title,
      description,
      connections: [],
      status: 'locked'
    };
  }
  
  /**
   * Connects nodes to create a valid path through the map
   * @param nodes Map nodes
   * @returns Edges for the node connections
   */
  function connectNodes(nodes: MapNode[]): MapEdge[] {
    const edges: MapEdge[] = [];
    
    // Group nodes by layer
    const nodesByLayer: Record<number, MapNode[]> = {};
    nodes.forEach(node => {
      const layer = getLayerFromY(node.y);
      if (!nodesByLayer[layer]) {
        nodesByLayer[layer] = [];
      }
      nodesByLayer[layer].push(node);
    });
    
    // Sort layers
    const layers = Object.keys(nodesByLayer).map(Number).sort((a, b) => a - b);
    
    // Connect each layer to the next
    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayer = nodesByLayer[layers[i]];
      const nextLayer = nodesByLayer[layers[i + 1]];
      
      // Each node in current layer connects to 1-3 nodes in next layer
      currentLayer.forEach(sourceNode => {
        // Sort next layer nodes by proximity to this node
        const sortedTargets = nextLayer.slice().sort((a, b) => {
          const distA = Math.hypot(a.x - sourceNode.x, a.y - sourceNode.y);
          const distB = Math.hypot(b.x - sourceNode.x, b.y - sourceNode.y);
          return distA - distB;
        });
        
        // Connect to 1-3 closest nodes
        const connectionCount = Math.min(
          nextLayer.length,
          Math.floor(Math.random() * 3) + 1
        );
        
        for (let j = 0; j < connectionCount; j++) {
          const targetNode = sortedTargets[j];
          
          // Add connection
          sourceNode.connections.push(targetNode.id);
          
          // Create edge
          edges.push({
            id: `edge-${sourceNode.id}-${targetNode.id}`,
            source: sourceNode.id,
            target: targetNode.id
          });
        }
      });
    }
    
    // Verify every node (except start) has at least one incoming connection
    const startNode = nodes.find(node => node.type === 'start');
    if (startNode) {
      nodes.forEach(node => {
        if (node.id !== startNode.id && !hasIncomingConnection(node.id, nodes)) {
          // Find a suitable node to connect from
          const sameLayerNodes = nodesByLayer[getLayerFromY(node.y)] || [];
          const previousLayerNodes = nodesByLayer[getLayerFromY(node.y) - 1] || [];
          
          if (previousLayerNodes.length > 0) {
            const sourceNode = pickRandom(previousLayerNodes);
            sourceNode.connections.push(node.id);
            
            edges.push({
              id: `edge-${sourceNode.id}-${node.id}`,
              source: sourceNode.id,
              target: node.id
            });
          } else if (sameLayerNodes.length > 1) {
            // If no previous layer, connect from another node in same layer
            const otherNodes = sameLayerNodes.filter(n => n.id !== node.id);
            if (otherNodes.length > 0) {
              const sourceNode = pickRandom(otherNodes);
              sourceNode.connections.push(node.id);
              
              edges.push({
                id: `edge-${sourceNode.id}-${node.id}`,
                source: sourceNode.id,
                target: node.id
              });
            }
          }
        }
      });
    }
    
    return edges;
  }
  
  // Helper to estimate layer from y position
  function getLayerFromY(y: number): number {
    return Math.floor(y / 100);
  }
  
  // Check if a node has incoming connections
  function hasIncomingConnection(nodeId: string, nodes: MapNode[]): boolean {
    return nodes.some(node => node.connections.includes(nodeId));
  }
  
  // Select a random item from an array
  function pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // Select node type based on weighted distribution
  function selectWeightedNodeType(distribution: Record<NodeType, number>): NodeType {
    // Exclude special types
    const types: NodeType[] = ['clinical', 'qa', 'educational', 'storage', 'vendor'];
    
    // Calculate total weight
    const totalWeight = types.reduce((sum, type) => sum + distribution[type], 0);
    
    // Select random value
    let random = Math.random() * totalWeight;
    
    // Find corresponding type
    for (const type of types) {
      random -= distribution[type];
      if (random <= 0) {
        return type;
      }
    }
    
    // Fallback
    return 'clinical';
  }
  
  /**
   * Validates that a map is fully connected (each node can reach every other node)
   * @param nodes Map nodes
   * @returns True if map is fully connected
   */
  export function isFullyConnected(nodes: MapNode[]): boolean {
    if (nodes.length === 0) return true;
    
    // Use breadth-first search from the first node
    const visited = new Set<string>();
    const queue: string[] = [nodes[0].id];
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      visited.add(nodeId);
      
      // Find this node
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        // Add unvisited connections to queue
        node.connections.forEach(connId => {
          if (!visited.has(connId)) {
            queue.push(connId);
          }
        });
      }
    }
    
    // Map is fully connected if all nodes are visited
    return visited.size === nodes.length;
  }