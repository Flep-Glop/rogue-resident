// lib/types/redux-types.ts
import type { 
  GameStatus, 
  Difficulty, 
  CharacterType, 
  PlayerState, 
  Ability, 
  SaveSlot 
} from './game-types';
import type { 
  MapNode, 
  MapEdge, 
  Reward, 
  NodeType 
} from './map-types';
import type { 
  Challenge, 
  ChallengeType, 
  ChallengeGrade, 
  ChallengeStage,
  ChallengeStatus,
  // Note: We're explicitly NOT importing ChallengeState here to avoid conflicts
} from './challenge-types';
import type { 
  Item, 
  ItemEffect 
} from './item-types';

/**
 * Root Redux state
 */
export interface RootState {
  game: GameState;
  map: MapState;
  node: NodeState;
  challenge: ChallengeState;
  inventory: InventoryState;
  saveLoad: SaveLoadState;
}

/**
 * Game slice state
 */
export interface GameState {
  status: GameStatus;
  difficulty: Difficulty;
  player: PlayerState;
  currentFloor: number;
  floorsCompleted: number;
  insight: number;
  researchPoints: number;
  timeElapsed: number; // In seconds
  score: number;
  selectedCharacterId: string | null;
  characters: {
    id: string;
    type: CharacterType;
    name: string;
    description: string;
    abilities: Ability[];
  }[];
  isGameStarted: boolean;
  isGameOver: boolean;
  completedRuns: number;
}

/**
 * Map slice state
 */
export interface MapState {
  nodes: MapNode[];
  edges: MapEdge[];
  currentNodeId: string | null;
  startNodeId: string | null;
  bossNodeId: string | null;
  isGenerated: boolean;
  seed: number;
  floorLevel: number;
  unlockedNodeIds: string[];
}

/**
 * Node slice state
 */
export interface NodeState {
  selectedNodeId: string | null;
  currentNodeId: string | null;
  nodeType: NodeType | null;
  nodeData: any | null;
  nodeStatus: 'locked' | 'available' | 'current' | 'completed' | null;
  nodeHistory: string[];
  isInteracting: boolean;
  isNodeActive: boolean;
  interactionStage: ChallengeStage | null;
}

/**
 * Challenge slice state (definition here to avoid circular imports)
 */
export interface ChallengeState {
  currentChallengeId: string | null;
  challengeType: ChallengeType | null;
  title: string;
  description: string;
  difficulty: Difficulty;
  currentStage: number;
  stages: {
    id: string;
    title: string;
    content: any;
    isCompleted: boolean;
  }[];
  userResponses: Record<string, any>;
  overallGrade: ChallengeGrade | null;
  insightReward: number;
  itemReward: string | null;
  timeRemaining: number;
  challengeStatus: ChallengeStatus;
  isCompleted: boolean;
  feedback: string;
  challengeHistory: {
    nodeId: string;
    challengeId: string;
    grade: ChallengeGrade | null;
  }[];
}

/**
 * Inventory slice state
 */
export interface InventoryState {
  items: Item[];
  activeItems: string[];
  activeEffects: ItemEffect[];
  selectedItemId: string | null;
  capacity: number;
}

/**
 * Save/Load slice state
 */
export interface SaveLoadState {
  saves: SaveSlot[];
  currentSaveId: string | null;
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  autoSaveEnabled: boolean;
  showSaveMenu: boolean;
  hasSave: boolean;
  lastSaveTimestamp: number | null;
}