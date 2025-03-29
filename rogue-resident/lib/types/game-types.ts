import { ChallengeType, ChallengeGrade } from './challenge-types';
import { ItemType } from './item-types';

/**
 * Game difficulty settings
 */
export type Difficulty = 'easy' | 'normal' | 'hard';

/**
 * Character type options
 */
export type CharacterType = 'resident' | 'researcher' | 'specialist' | 'regulator';

/**
 * Character interface
 */
export interface Character {
  id: string;
  name: string;
  description: string;
  startingHealth: number;
  startingInsight: number;
  specialAbilities: {
    name: string;
    description: string;
  }[];
  portrait: string;
}

/**
 * Ability interface for character abilities
 */
export interface Ability {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  currentCooldown: number;
  isAvailable: boolean;
}

/**
 * Player state interface
 */
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

/**
 * Game session stats for tracking progress
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
}

/**
 * Save data structure
 */
export interface SaveGameData {
  id: string;
  name: string;
  timestamp: number;
  floorLevel: number;
  playerHealth: number;
  playerInsight: number;
  score: number;
}

/**
 * Save slot interface for UI display
 */
export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  floorLevel: number;
  playerHealth: number;
  playerInsight: number;
  score: number;
}