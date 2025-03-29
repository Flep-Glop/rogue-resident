import { Difficulty } from './game-types';

// Node Types
export type NodeType = 
  'clinical' | 
  'qa' | 
  'educational' | 
  'storage' | // Treasure nodes
  'vendor' |   // Shop nodes
  'boss' |
  'start';

// Node Status
export type NodeStatus = 
  'locked' | 
  'available' | 
  'current' | 
  'completed';

// Map Node Definition
export interface MapNode {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  title: string;
  description: string;
  connections: string[]; // IDs of connected nodes
  status: NodeStatus;
  scenarioId?: string; // Reference to specific scenario data
  difficulty?: Difficulty;
  rewards?: Reward[];
}

// Map Edge Definition (for connections)
export interface MapEdge {
  id: string;
  source: string;
  target: string;
}

// Reward Structure
export interface Reward {
  type: 'insight' | 'health' | 'item' | 'researchPoints';
  value: number;
  itemId?: string;
}

// Map Generation Options
export interface MapGenerationOptions {
  difficulty: Difficulty;
  nodeCount: number;
  width?: number;
  height?: number;
  nodeTypeDistribution?: Record<NodeType, number>;
  seed?: number;
}

// Generated Map Result
export interface GeneratedMap {
  nodes: MapNode[];
  edges: MapEdge[];
  startNodeId: string;
  bossNodeId: string;
}

// Path Structure
export interface Path {
  nodeIds: string[];
  length: number;
}

// Map Node Template (for generation)
export interface NodeTemplate {
  type: NodeType;
  title: string;
  description: string;
  scenarioPool?: string[]; // IDs of potential scenarios to assign
}

// Node Position (for layout)
export interface NodePosition {
  id: string;
  x: number;
  y: number;
  layer: number;
}

// Node Type Color Themes
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