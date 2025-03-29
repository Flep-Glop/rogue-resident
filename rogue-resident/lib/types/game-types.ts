// lib/types/game-types.ts

/**
 * Game difficulty settings
 */
export type Difficulty = 'easy' | 'normal' | 'hard';

/**
 * Game state
 */
export type GameStatus = 'idle' | 'playing' | 'paused' | 'complete' | 'game-over';

/**
 * Character type options
 */
export type CharacterType = 'resident' | 'researcher' | 'specialist' | 'regulator';

/**
 * Character definition
 */
export interface Character {
  id: string;
  type: CharacterType;
  name: string;
  description: string;
  startingHealth: number;
  startingInsight: number;
  specialAbilities: Ability[];
  portrait: string;
  flavorText?: string;
}

/**
 * Character ability
 */
export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number; // In turns/actions
  currentCooldown: number;
  isAvailable: boolean;
  effect: (state: any) => any; // Generic effect function, actual implementation will be more specific
}

/**
 * Player state
 */
export interface PlayerState {
  characterType: CharacterType;
  name: string;
  health: number;
  maxHealth: number;
  insight: number; // In-game currency
  abilities: Ability[];
  stats: {
    clinical: number;
    technical: number;
    educational: number;
  };
}

/**
 * Game session statistics
 */
export interface GameSessionStats {
  timePlayedSeconds: number;
  nodesVisited: number;
  challengesCompleted: number;
  challengesPerfect: number;
  itemsCollected: number;
  itemsUsed: number;
  insightGained: number;
  insightSpent: number;
  healthLost: number;
  healthGained: number;
  runsCompleted: number;
  score: number;
}

/**
 * Save game data structure
 */
export interface SaveGameData {
  id: string;
  name: string;
  timestamp: number;
  floorLevel: number;
  playerState: PlayerState;
  inventory: any; // Will be typed more specifically in actual implementation
  map: any; // Will be typed more specifically in actual implementation
  score: number;
  version: string; // For handling migrations between game versions
}

/**
 * Save slot for UI display
 */
export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  floorLevel: number;
  playerHealth: number;
  playerInsight: number;
  score: number;
  lastPlayed: string; // Formatted date/time
  thumbnail?: string; // URL to thumbnail image
}