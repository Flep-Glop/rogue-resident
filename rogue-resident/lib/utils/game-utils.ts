// lib/utils/game-utils.ts
'use client';

import { ChallengeGrade } from '../types/challenge-types';
import { ItemEffect, ItemRarity } from '../types/item-types';
import { tryCatch, ErrorCode } from './error-handlers';
import { Difficulty } from '../types/game-types';

/**
 * Calculates grade based on a numeric score
 * @param score The achieved score 
 * @param maxScore The maximum possible score
 * @returns The letter grade
 */
export function calculateGrade(score: number, maxScore: number): ChallengeGrade {
  return tryCatch(() => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 95) return 'S';
    if (percentage >= 85) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
  }, 'F' as ChallengeGrade, ErrorCode.CHALLENGE_GRADING_ERROR);
}

/**
 * Calculates insight reward based on grade
 * @param grade The achieved grade
 * @param baseReward The base reward amount
 * @returns The calculated reward
 */
export function calculateInsightReward(grade: ChallengeGrade, baseReward: number = 50): number {
  return tryCatch(() => {
    const multipliers: Record<ChallengeGrade, number> = {
      'S': 2.0,
      'A': 1.5,
      'B': 1.0,
      'C': 0.5,
      'F': 0.1
    };
    
    return Math.round(baseReward * multipliers[grade]);
  }, Math.round(baseReward * 0.1), ErrorCode.CHALLENGE_REWARD_ERROR);
}

/**
 * Gets item rarity based on a random roll with configurable chances
 * @param chances Probability distribution for different rarities
 * @returns The selected rarity
 */
export function getRandomItemRarity(
  chances: { 
    common: number, 
    uncommon: number, 
    rare: number, 
    legendary: number 
  } = { 
    common: 0.6, 
    uncommon: 0.3, 
    rare: 0.08, 
    legendary: 0.02 
  }
): ItemRarity {
  return tryCatch(() => {
    const roll = Math.random();
    
    if (roll < chances.legendary) return 'legendary';
    if (roll < chances.legendary + chances.rare) return 'rare';
    if (roll < chances.legendary + chances.rare + chances.uncommon) return 'uncommon';
    return 'common';
  }, 'common' as ItemRarity, ErrorCode.ITEM_GENERATION_ERROR);
}

/**
 * Formats time in seconds to a readable format (MM:SS)
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  return tryCatch(() => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, '00:00', ErrorCode.DATE_FORMAT_ERROR);
}

/**
 * Calculates the total effect value for a specific modifier from multiple items
 * @param items Array of items with effects
 * @param targetType Type of target to calculate for
 * @param modifierType Type of modifier to calculate
 * @returns Total effect value
 */
export function calculateTotalItemEffect(
  items: { effects: ItemEffect[] }[],
  targetType: string,
  modifierType: string
): number {
  return tryCatch(() => {
    return items.reduce((total, item) => {
      // Find effects that match the target and modifier type
      const matchingEffects = item.effects.filter(
        effect => effect.target === targetType && effect.modifier === modifierType
      );
      
      // Sum up the effect values
      const effectSum = matchingEffects.reduce((sum, effect) => {
        if (typeof effect.value === 'number') {
          return sum + effect.value;
        }
        return sum;
      }, 0);
      
      return total + effectSum;
    }, 0);
  }, 0, ErrorCode.ITEM_EFFECT_CALCULATION_ERROR);
}

/**
 * Checks if the player has a specific effect from items
 * @param items Array of items with effects
 * @param targetType Type of target to check
 * @param modifierType Type of modifier to check
 * @returns Whether the effect exists
 */
export function hasItemEffect(
  items: { effects: ItemEffect[] }[],
  targetType: string,
  modifierType: string
): boolean {
  return tryCatch(() => {
    return items.some(item => 
      item.effects.some(effect => 
        effect.target === targetType && 
        effect.modifier === modifierType &&
        Boolean(effect.value)
      )
    );
  }, false, ErrorCode.ITEM_EFFECT_CHECK_ERROR);
}

/**
 * Gets color class based on difficulty level
 * @param difficulty The difficulty level
 * @returns Tailwind text color class
 */
export function getDifficultyColor(difficulty: string): string {
  return tryCatch(() => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-400';
      case 'normal':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  }, 'text-slate-400', ErrorCode.UI_STYLE_ERROR);
}

/**
 * Gets star representation for difficulty
 * @param difficulty The difficulty level
 * @returns Star representation string
 */
export function getDifficultyStars(difficulty: string): string {
  return tryCatch(() => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '★';
      case 'normal':
        return '★★';
      case 'hard':
        return '★★★';
      default:
        return '';
    }
  }, '', ErrorCode.UI_STYLE_ERROR);
}

/**
 * Gets challenge time limit based on difficulty
 * @param baseDuration Base duration in seconds
 * @param difficulty Difficulty level
 * @returns Adjusted time limit
 */
export function getChallengeTimeLimit(baseDuration: number, difficulty: Difficulty): number {
  return tryCatch(() => {
    const multipliers: Record<Difficulty, number> = {
      'easy': 1.5,
      'normal': 1.0,
      'hard': 0.7
    };
    
    return Math.round(baseDuration * multipliers[difficulty]);
  }, baseDuration, ErrorCode.CHALLENGE_SETUP_ERROR);
}

/**
 * Calculates health multiplier based on difficulty
 * @param difficulty Difficulty level
 * @returns Health multiplier
 */
export function getHealthMultiplier(difficulty: Difficulty): number {
  return tryCatch(() => {
    const multipliers: Record<Difficulty, number> = {
      'easy': 1.2,
      'normal': 1.0,
      'hard': 0.8
    };
    
    return multipliers[difficulty];
  }, 1.0, ErrorCode.GAME_STATE_ERROR);
}

/**
 * Calculates damage based on base amount and difficulty
 * @param baseDamage Base damage amount
 * @param difficulty Difficulty level
 * @returns Adjusted damage amount
 */
export function calculateDamage(baseDamage: number, difficulty: Difficulty): number {
  return tryCatch(() => {
    const multipliers: Record<Difficulty, number> = {
      'easy': 0.8,
      'normal': 1.0,
      'hard': 1.3
    };
    
    return Math.round(baseDamage * multipliers[difficulty]);
  }, baseDamage, ErrorCode.GAME_STATE_ERROR);
}

/**
 * Gets color class for grade display
 * @param grade The challenge grade
 * @returns Tailwind text color class
 */
export function getGradeColor(grade: ChallengeGrade | null): string {
  return tryCatch(() => {
    if (!grade) return 'text-slate-400';
    
    switch (grade) {
      case 'S':
        return 'text-purple-400';
      case 'A':
        return 'text-green-400';
      case 'B':
        return 'text-blue-400';
      case 'C':
        return 'text-yellow-400';
      case 'F':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  }, 'text-slate-400', ErrorCode.UI_STYLE_ERROR);
}

/**
 * Clamps a value between a minimum and maximum
 * @param value The value to clamp
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns Shuffled array (modifies original)
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Percentage chance check
 * @param percent Probability (0-100)
 * @returns True if random check passes
 */
export function percentChance(percent: number): boolean {
  return Math.random() * 100 < percent;
}