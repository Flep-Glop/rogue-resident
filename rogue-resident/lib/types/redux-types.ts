// lib/types/redux-types.ts
import { NodeType, ChallengeType, ItemType, CharacterType, GameDifficulty } from './game-types';

// Root state type
export interface RootState {
  game: GameState;
  map: MapState;
  node: NodeState;
  challenge: ChallengeState;
  inventory: InventoryState;
  saveLoad: SaveLoadState;
}

// Game state
export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'complete' | 'game-over';
  difficulty: GameDifficulty;
  player: PlayerState;
  currentFloor: number;
  floorsCompleted: number;
  insight: number; // In-game currency
  researchPoints: number; // Meta currency
  timeElapsed: number; // In seconds
}

export interface PlayerState {
  characterType: CharacterType;
  lives: number;
  maxLives: number;
  abilities: Ability[];
  stats: {
    clinical: number;
    technical: number;
    educational: number;
  };
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  isAvailable: boolean;
}

// Map state
export interface MapState {
  nodes: MapNode[];
  edges: MapEdge[];
  currentNodeId: string | null;
  startNodeId: string | null;
  bossNodeId: string | null;
  isGenerated: boolean;
  seed: number;
}

export interface MapNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    title: string;
    description: string;
    status: 'locked' | 'available' | 'current' | 'completed';
    scenarioId?: string;
    difficulty?: 'easy' | 'normal' | 'hard';
    rewards?: Reward[];
  };
}

export interface MapEdge {
  id: string;
  source: string;
  target: string;
  data?: {
    type?: 'normal' | 'special';
  };
}

export interface Reward {
  type: 'insight' | 'item' | 'life' | 'research-point';
  amount?: number;
  itemId?: string;
}

// Node state
export interface NodeState {
  selectedNodeId: string | null;
  currentNodeType: NodeType | null;
  nodeHistory: string[];
  nodeInteraction: {
    isActive: boolean;
    currentStage: number;
    totalStages: number;
    completionStatus: 'none' | 'in-progress' | 'success' | 'failure';
  };
}

// Challenge state
export interface ChallengeState {
  currentChallenge: Challenge | null;
  challengeHistory: {
    nodeId: string;
    challengeId: string;
    grade: 'none' | 'C' | 'B' | 'A' | 'S';
  }[];
  userAnswers: Record<string, any>;
  grade: 'none' | 'C' | 'B' | 'A' | 'S';
  feedback: string;
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  difficulty: 'easy' | 'normal' | 'hard';
  stages: ChallengeStage[];
  rewards: Reward[];
}

export interface ChallengeStage {
  id: string;
  type: string;
  title: string;
  content: any; // This will vary based on stage type
  correctAnswers?: any; // This will vary based on stage type
}

// Inventory state
export interface InventoryState {
  items: InventoryItem[];
  activeItems: string[]; // IDs of equipped/active items
  selectedItemId: string | null;
}

export interface InventoryItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'unique';
  effects: ItemEffect[];
  isUsable: boolean;
  isEquippable: boolean;
  isEquipped: boolean;
}

export interface ItemEffect {
  type: string;
  target: string;
  value: number | string | boolean;
  duration?: number; // In turns/encounters
}

// Save/Load state
export interface SaveLoadState {
  saveSlots: SaveSlot[];
  currentSlot: number | null;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SaveSlot {
  id: number;
  name: string;
  timestamp: number;
  thumbnailUrl?: string;
  gameState?: GameState;
  playerProgress?: {
    currentFloor: number;
    insight: number;
    lives: number;
    itemCount: number;
  };
}