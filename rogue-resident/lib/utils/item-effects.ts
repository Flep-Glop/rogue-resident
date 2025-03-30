// lib/utils/item-effects.ts
'use client';

import { Item, ItemEffect, EffectType } from '../types/item-types';
import { tryCatch, ErrorCode } from './error-handlers';

/**
 * Apply an item's effects to a game state
 * 
 * @param effect The effect to apply
 * @param gameState The current game state
 * @returns A partial state update object
 */
export function applyItemEffect(
  effect: ItemEffect,
  gameState: any
): Record<string, any> {
  return tryCatch(() => {
    // Create an empty state update object
    const stateUpdate: Record<string, any> = {};
    
    // Handle different effect types
    switch (effect.type) {
      // Character stat effects
      case 'health':
        stateUpdate.playerHealth = Math.min(
          gameState.maxPlayerHealth,
          gameState.playerHealth + Number(effect.value)
        );
        break;
        
      case 'maxHealth':
        stateUpdate.maxPlayerHealth = gameState.maxPlayerHealth + Number(effect.value);
        // Optionally also increase current health
        if (Number(effect.value) > 0) {
          stateUpdate.playerHealth = gameState.playerHealth + Number(effect.value);
        }
        break;
        
      case 'insight':
        stateUpdate.playerInsight = gameState.playerInsight + Number(effect.value);
        break;
      
      // Challenge modifiers
      case 'clinicalBonus':
      case 'qaBonus':
      case 'educationalBonus':
        // These effects apply a percentage bonus to challenge performance
        // They're applied during challenge evaluation, not directly to state
        break;
        
      // Special abilities
      case 'revealAnswer':
      case 'rerollChallenge':
      case 'extraReward':
      case 'nodeUnlock':
      case 'dodgeFailure':
        // These are flags that grant special abilities
        // They don't directly modify state but are checked during relevant actions
        break;
        
      default:
        console.warn(`Unknown effect type: ${effect.type}`);
    }
    
    return stateUpdate;
  }, {}, ErrorCode.ITEM_EFFECT_APPLICATION_ERROR);
}

/**
 * Calculate the total value of a specific effect from multiple items
 * 
 * @param items Array of items with effects
 * @param effectType The type of effect to calculate
 * @param target Optional target filter
 * @returns Total effect value as a number
 */
export function calculateTotalEffect(
  items: Item[],
  effectType: EffectType,
  target?: string
): number {
  return tryCatch(() => {
    return items.reduce((total, item) => {
      // Find matching effects in this item
      const matchingEffects = item.effects.filter(
        effect => effect.type === effectType && (!target || effect.target === target)
      );
      
      // Sum up the effect values if they're numbers
      const effectSum = matchingEffects.reduce((sum, effect) => {
        if (typeof effect.value === 'number') {
          return sum + effect.value;
        }
        return sum;
      }, 0);
      
      return total + effectSum;
    }, 0);
  }, 0, ErrorCode.ITEM_EFFECT_CALCULATION_ERROR); // Return 0 if any error occurs
}

/**
 * Check if any items provide a specific boolean effect
 * 
 * @param items Array of items with effects
 * @param effectType The type of effect to check for
 * @param target Optional target filter
 * @returns True if any item has the effect
 */
export function hasEffect(
  items: Item[],
  effectType: EffectType,
  target?: string
): boolean {
  return tryCatch(() => {
    return items.some(item => 
      item.effects.some(
        effect => 
          effect.type === effectType && 
          (!target || effect.target === target) &&
          Boolean(effect.value)
      )
    );
  }, false, ErrorCode.ITEM_EFFECT_CHECK_ERROR); // Return false if any error occurs
}

/**
 * Get all active effects of a specific type from items
 * 
 * @param items Array of items with effects
 * @param effectType The type of effect to get
 * @param target Optional target filter
 * @returns Array of matching effects
 */
export function getEffectsOfType(
  items: Item[],
  effectType: EffectType,
  target?: string
): ItemEffect[] {
  return tryCatch(() => {
    const effects: ItemEffect[] = [];
    
    items.forEach(item => {
      item.effects.forEach(effect => {
        if (effect.type === effectType && (!target || effect.target === target)) {
          effects.push(effect);
        }
      });
    });
    
    return effects;
  }, [], ErrorCode.ITEM_EFFECT_RETRIEVAL_ERROR); // Return empty array if any error occurs
}

/**
 * Process effects that have a duration, decrementing their turns remaining
 * 
 * @param effects Array of effects with duration
 * @returns Updated effects with decremented durations and expired effects removed
 */
export function processEffectDurations(
  effects: Array<{
    effectId: string;
    sourceId: string;
    type: EffectType;
    value: number | string | boolean;
    turnsRemaining: number;
  }>
): Array<{
  effectId: string;
  sourceId: string;
  type: EffectType;
  value: number | string | boolean;
  turnsRemaining: number;
}> {
  return tryCatch(() => {
    return effects.filter(effect => {
      // Skip permanent effects
      if (effect.turnsRemaining === -1) {
        return true;
      }
      
      // Decrement duration for temporary effects
      effect.turnsRemaining -= 1;
      
      // Keep effect if it still has turns remaining
      return effect.turnsRemaining > 0;
    });
  }, effects, ErrorCode.ITEM_EFFECT_DURATION_ERROR);
}

/**
 * Determine if an effect should be automatically applied when the item is acquired
 * 
 * @param effect The item effect to check
 * @returns Boolean indicating if effect should be auto-applied
 */
export function isAutoAppliedEffect(effect: ItemEffect): boolean {
  return tryCatch(() => {
    // Effects that are automatically applied when an item is acquired
    const autoAppliedTypes: EffectType[] = [
      'maxHealth',
      'nodeUnlock'
    ];
    
    return autoAppliedTypes.includes(effect.type);
  }, false, ErrorCode.ITEM_EFFECT_CHECK_ERROR);
}

/**
 * Get a descriptive label for an effect type
 * 
 * @param type The effect type
 * @returns Human-readable label
 */
export function getEffectTypeLabel(type: EffectType): string {
  return tryCatch(() => {
    const labels: Record<EffectType, string> = {
      health: 'Health',
      maxHealth: 'Maximum Health',
      insight: 'Insight',
      clinicalBonus: 'Clinical Challenge Bonus',
      qaBonus: 'QA Challenge Bonus',
      educationalBonus: 'Educational Challenge Bonus',
      revealAnswer: 'Reveal Answer',
      rerollChallenge: 'Reroll Challenge',
      extraReward: 'Extra Reward',
      nodeUnlock: 'Node Unlock',
      dodgeFailure: 'Avoid Failure'
    };
    
    return labels[type] || String(type);
  }, String(type), ErrorCode.UI_LABEL_ERROR);
}

/**
 * Format an effect value for display
 * 
 * @param effect The effect to format
 * @returns Formatted effect string
 */
export function formatEffectValue(effect: ItemEffect): string {
  return tryCatch(() => {
    const value = effect.value;
    
    // Handle different value types
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else if (typeof value === 'number') {
      // Check if it's a percentage effect
      const isPercentage = [
        'clinicalBonus',
        'qaBonus',
        'educationalBonus'
      ].includes(effect.type);
      
      return isPercentage ? `${value > 0 ? '+' : ''}${value}%` : `${value > 0 ? '+' : ''}${value}`;
    } else {
      return String(value);
    }
  }, String(effect.value), ErrorCode.UI_FORMATTING_ERROR);
}

/**
 * Get the CSS color class for an effect based on its type
 * 
 * @param effect The effect to get a color for
 * @returns Tailwind color class
 */
export function getEffectColorClass(effect: ItemEffect): string {
  return tryCatch(() => {
    // Health-related effects
    if (['health', 'maxHealth'].includes(effect.type)) {
      return 'text-red-400';
    }
    
    // Resource-related effects
    if (['insight'].includes(effect.type)) {
      return 'text-blue-400';
    }
    
    // Challenge bonus effects
    if (['clinicalBonus', 'qaBonus', 'educationalBonus'].includes(effect.type)) {
      return 'text-yellow-400';
    }
    
    // Special ability effects
    if (['revealAnswer', 'rerollChallenge', 'extraReward', 'nodeUnlock', 'dodgeFailure'].includes(effect.type)) {
      return 'text-purple-400';
    }
    
    // Default
    return 'text-slate-400';
  }, 'text-slate-400', ErrorCode.UI_STYLE_ERROR);
}