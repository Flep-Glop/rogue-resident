// Item Category Types
export type ItemType = 
  'knowledge' |
  'technical' |
  'teaching' |
  'personal' |
  'special';

// Item Rarity
export type ItemRarity = 
  'common' |
  'uncommon' |
  'rare' |
  'unique';

// Item Effect Types
export type EffectType =
  // Stat Effects
  'health' |
  'maxHealth' |
  'insight' |
  
  // Challenge Bonuses
  'clinicalBonus' |
  'qaBonus' |
  'educationalBonus' |
  
  // Special Effects
  'revealAnswer' |
  'rerollChallenge' |
  'extraReward' |
  'nodeUnlock' |
  'dodgeFailure';

// Item Definition
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

// Item Effect
export interface ItemEffect {
  type: EffectType;
  value: number | string | boolean;
  duration?: number; // in turns, -1 for permanent
  description: string;
}

// Knowledge Tools (enhance specific knowledge domains)
export interface KnowledgeItem extends Item {
  type: 'knowledge';
  subtype: 'textbook' | 'reference' | 'handbook' | 'journal';
  knowledgeDomain: string;
}

// Technical Equipment (improve challenge performance)
export interface TechnicalItem extends Item {
  type: 'technical';
  subtype: 'measurement' | 'software' | 'calibration' | 'analysis';
  technicalDomain: string;
}

// Teaching Aids (enhance educational scenarios)
export interface TeachingItem extends Item {
  type: 'teaching';
  subtype: 'presentation' | 'visual' | 'interactive' | 'assessment';
  teachingApproach: string;
}

// Personal Development (general improvements)
export interface PersonalItem extends Item {
  type: 'personal';
  subtype: 'timeManagement' | 'stressReduction' | 'focus' | 'networking';
  personalBenefit: string;
}

// Special Items (unique effects)
export interface SpecialItem extends Item {
  type: 'special';
  subtype: 'experimental' | 'historical' | 'prototype' | 'legendary';
  uniqueEffect: string;
}

// Example item templates
export const ItemTemplates: Record<string, Item> = {
  // Knowledge Tools
  'vintage_dosimetry_handbook': {
    id: 'vintage_dosimetry_handbook',
    name: 'Vintage Dosimetry Handbook',
    description: 'An old but valuable reference for dose calculations.',
    type: 'knowledge',
    rarity: 'uncommon',
    effects: [
      {
        type: 'clinicalBonus',
        value: 25, // 25% bonus
        duration: -1, // permanent
        description: 'Improves dose calculation performance by 25%'
      }
    ],
    isUsable: false,
    isPassive: true,
    cost: 75,
    flavorText: 'Filled with handwritten notes from physicists of the past.',
    icon: 'items/handbook.png'
  },
  
  // Technical Equipment
  'precision_phantom_set': {
    id: 'precision_phantom_set',
    name: 'Calibration Phantom Set',
    description: 'A complete set of precision phantoms for QA procedures.',
    type: 'technical',
    rarity: 'rare',
    effects: [
      {
        type: 'qaBonus',
        value: 30, // 30% bonus
        duration: -1, // permanent
        description: 'Increases QA measurement accuracy by 30%'
      },
      {
        type: 'rerollChallenge',
        value: true,
        duration: -1,
        description: 'Allows one reroll per QA challenge'
      }
    ],
    isUsable: false,
    isPassive: true,
    cost: 120,
    icon: 'items/phantom.png'
  },
  
  // Teaching Aids
  'visual_learning_package': {
    id: 'visual_learning_package',
    name: 'Visual Learning Package',
    description: 'A collection of high-quality visual aids for teaching.',
    type: 'teaching',
    rarity: 'uncommon',
    effects: [
      {
        type: 'educationalBonus',
        value: 30, // 30% bonus
        duration: -1, // permanent
        description: 'Enhances educational visual presentations by 30%'
      }
    ],
    isUsable: false,
    isPassive: true,
    cost: 80,
    icon: 'items/visual_aids.png'
  },
  
  // Personal Development
  'stress_management_toolkit': {
    id: 'stress_management_toolkit',
    name: 'Stress Management Toolkit',
    description: 'Tools and techniques to manage workplace stress.',
    type: 'personal',
    rarity: 'common',
    effects: [
      {
        type: 'maxHealth',
        value: 1, // +1 max health
        duration: -1, // permanent
        description: 'Increases maximum health by 1'
      }
    ],
    isUsable: false,
    isPassive: true,
    cost: 60,
    icon: 'items/toolkit.png'
  },
  
  // Special Items
  'retired_physicist_notebook': {
    id: 'retired_physicist_notebook',
    name: 'Retired Physicist\'s Notebook',
    description: 'A notebook full of insights from a legendary physicist.',
    type: 'special',
    rarity: 'unique',
    effects: [
      {
        type: 'revealAnswer',
        value: true,
        duration: -1, // permanent
        description: 'Provides hints for difficult challenges'
      },
      {
        type: 'insight',
        value: 10, // +10% insight from all sources
        duration: -1,
        description: 'Increases insight gain by 10%'
      }
    ],
    isUsable: false,
    isPassive: true,
    cost: 200,
    flavorText: 'The margins are filled with elegant solutions to complex problems.',
    icon: 'items/notebook.png'
  },
  
  // Consumable Items
  'energy_drink': {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'A quick boost of energy when you need it most.',
    type: 'personal',
    rarity: 'common',
    effects: [
      {
        type: 'health',
        value: 1, // Restore 1 health
        description: 'Restores 1 health point'
      }
    ],
    isUsable: true,
    isPassive: false,
    cost: 30,
    icon: 'items/energy_drink.png'
  },
  
  'insight_crystal': {
    id: 'insight_crystal',
    name: 'Insight Crystal',
    description: 'A crystallized form of pure insight.',
    type: 'special',
    rarity: 'uncommon',
    effects: [
      {
        type: 'insight',
        value: 50, // +50 insight
        description: 'Grants 50 insight points'
      }
    ],
    isUsable: true,
    isPassive: false,
    cost: 70,
    icon: 'items/crystal.png'
  }
};