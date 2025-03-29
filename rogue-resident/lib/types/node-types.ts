/**
 * Node types based on the game design document
 */
export type NodeType = 
  | 'clinical' 
  | 'qa' 
  | 'educational' 
  | 'storage' 
  | 'vendor' 
  | 'boss' 
  | 'start';

/**
 * Status of a node in the game map
 */
export type NodeStatus = 
  | 'locked' 
  | 'available' 
  | 'current' 
  | 'completed';

/**
 * Base node definition
 */
export interface MapNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  title: string;
  description: string;
  connections: string[]; // IDs of connected nodes
  status: NodeStatus;
  scenarioId?: string;
  difficulty?: 'easy' | 'normal' | 'hard';
  rewards?: Reward[];
}

/**
 * Connection between nodes
 */
export interface MapEdge {
  id: string;
  source: string;
  target: string;
}

/**
 * Reward structure for completing nodes
 */
export interface Reward {
  type: 'insight' | 'health' | 'item' | 'researchPoints';
  value: number;
  itemId?: string;
}

/**
 * Options for map generation
 */
export interface MapGenerationOptions {
  difficulty: 'easy' | 'normal' | 'hard';
  nodeCount: number;
  width?: number;
  height?: number;
  nodeTypeDistribution?: Record<NodeType, number>;
  seed?: number;
}

/**
 * Generated map data
 */
export interface GeneratedMap {
  nodes: MapNode[];
  edges: MapEdge[];
  startNodeId: string;
  bossNodeId: string;
}

/**
 * Path between nodes
 */
export interface Path {
  nodeIds: string[];
  length: number;
}

/**
 * Template for creating nodes
 */
export interface NodeTemplate {
  type: NodeType;
  title: string;
  description: string;
  scenarioPool?: string[];
}

/**
 * Position data for a node
 */
export interface NodePosition {
  id: string;
  x: number;
  y: number;
  layer: number;
}

/**
 * Theme colors for node types
 */
export const NodeColors: Record<NodeType, { primary: string, secondary: string, text: string }> = {
  clinical: {
    primary: '#4A90E2',
    secondary: '#F4D03F',
    text: 'white'
  },
  qa: {
    primary: '#5A6978',
    secondary: '#E53E3E',
    text: 'white'
  },
  educational: {
    primary: '#26A69A',
    secondary: '#F9E79F',
    text: 'white'
  },
  storage: {
    primary: '#D8CCA3',
    secondary: '#8B4513',
    text: 'black'
  },
  vendor: {
    primary: '#2C3E50',
    secondary: '#9B59B6',
    text: 'white'
  },
  boss: {
    primary: '#4FC3F7',
    secondary: '#FF5722',
    text: 'white'
  },
  start: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    text: 'white'
  }
};