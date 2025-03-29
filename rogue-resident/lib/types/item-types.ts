/**
 * Item category types
 */
export type ItemType = 
  | 'knowledge'
  | 'technical'
  | 'teaching'
  | 'personal'
  | 'special';

/**
 * Item rarity levels
 */
export type ItemRarity = 
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'unique';

/**
 * Item effect types
 */
export type EffectType =
  // Stat Effects
  | 'health'
  | 'maxHealth'
  | 'insight'
  
  // Challenge Bonuses
  | 'clinicalBonus'
  | 'qaBonus'
  | 'educationalBonus'
  
  // Special Effects
  | 'revealAnswer'
  | 'rerollChallenge'
  | 'extraReward'
  | 'nodeUnlock'
  | 'dodgeFailure';

/**
 * Base item interface
 */
export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  effects: ItemEffect[];
  isUsable: boolean;
  isPassive: boolean;
  cost: number;
  flavorText?: string;
  icon: string;
}

/**
 * Item effect definition
 */
export interface ItemEffect {
  type: EffectType;
  target: string;
  value: number | string | boolean;
  duration?: number; // in turns, -1 for permanent
  description: string;
}

/**
 * Knowledge tool specialization
 */
export interface KnowledgeItem extends Item {
  type: 'knowledge';
  subtype: 'textbook' | 'reference' | 'handbook' | 'journal';
  knowledgeDomain: string;
}

/**
 * Technical equipment specialization
 */
export interface TechnicalItem extends Item {
  type: 'technical';
  subtype: 'measurement' | 'software' | 'calibration' | 'analysis';
  technicalDomain: string;
}

/**
 * Teaching aid specialization
 */
export interface TeachingItem extends Item {
  type: 'teaching';
  subtype: 'presentation' | 'visual' | 'interactive' | 'assessment';
  teachingApproach: string;
}

/**
 * Personal development item specialization
 */
export interface PersonalItem extends Item {
  type: 'personal';
  subtype: 'timeManagement' | 'stressReduction' | 'focus' | 'networking';
  personalBenefit: string;
}

/**
 * Special item specialization
 */
export interface SpecialItem extends Item {
  type: 'special';
  subtype: 'experimental' | 'historical' | 'prototype' | 'legendary';
  uniqueEffect: string;
}