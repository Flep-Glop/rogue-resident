import { Item, ItemType, ItemRarity, ItemEffect } from '@/lib/types/item-types';
import { getItemById } from '@/lib/data/items';
import { applyItemEffect, calculateTotalEffect, hasEffect } from './item-effects';
import { tryCatch } from './error-handlers';
import { generateId } from './id-generator';

/**
 * Create a new inventory item
 * @param template Basic item details
 * @returns Complete item object
 */
export function createItem(template: {
  name: string;
  description: string;
  type: ItemType;
  rarity?: ItemRarity;
  effects?: Partial<ItemEffect>[];
  isUsable?: boolean;
  isPassive?: boolean;
  cost?: number;
  flavorText?: string;
}): Item {
  // Set defaults for optional properties
  const {
    name,
    description,
    type,
    rarity = 'common',
    effects = [],
    isUsable = false,
    isPassive = true,
    cost = 0,
    flavorText
  } = template;
  
  // Create item ID based on name and type
  const id = generateId(`${type}_${name.toLowerCase().replace(/\s+/g, '_')}`);
  
  // Create icon path based on type and name
  const icon = `/icons/items/${type}_${name.toLowerCase().replace(/\s+/g, '_')}.png`;
  
  // Complete the effects with required properties
  const completeEffects = effects.map(effect => ({
    type: effect.type,
    target: effect.target || 'player',
    value: effect.value || 0,
    duration: effect.duration,
    description: effect.description || `Effect of ${effect.type}`
  })) as ItemEffect[];
  
  // Create and return the complete item
  return {
    id,
    name,
    description,
    type,
    rarity,
    effects: completeEffects,
    isUsable,
    isPassive,
    cost,
    flavorText,
    icon
  };
}

/**
 * Filter items by various criteria
 * @param items Array of items to filter
 * @param filters Filter criteria
 * @returns Filtered array of items
 */
export function filterItems(
  items: Item[],
  filters: {
    type?: ItemType | ItemType[];
    rarity?: ItemRarity | ItemRarity[];
    isUsable?: boolean;
    isPassive?: boolean;
    effectType?: string;
    search?: string;
  }
): Item[] {
  return tryCatch(() => {
    return items.filter(item => {
      // Check type filter
      if (filters.type) {
        if (Array.isArray(filters.type)) {
          if (!filters.type.includes(item.type)) return false;
        } else if (item.type !== filters.type) {
          return false;
        }
      }
      
      // Check rarity filter
      if (filters.rarity) {
        if (Array.isArray(filters.rarity)) {
          if (!filters.rarity.includes(item.rarity)) return false;
        } else if (item.rarity !== filters.rarity) {
          return false;
        }
      }
      
      // Check usability filter
      if (filters.isUsable !== undefined && item.isUsable !== filters.isUsable) {
        return false;
      }
      
      // Check passive filter
      if (filters.isPassive !== undefined && item.isPassive !== filters.isPassive) {
        return false;
      }
      
      // Check effect type filter
      if (filters.effectType && !item.effects.some(effect => effect.type === filters.effectType)) {
        return false;
      }
      
      // Check search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(searchLower);
        const descMatch = item.description.toLowerCase().includes(searchLower);
        const flavorMatch = item.flavorText?.toLowerCase().includes(searchLower);
        
        if (!nameMatch && !descMatch && !flavorMatch) {
          return false;
        }
      }
      
      // Item passed all filters
      return true;
    });
  }, []);
}

/**
 * Sort items by various criteria
 * @param items Array of items to sort
 * @param sortBy Sort field and direction
 * @returns Sorted array of items
 */
export function sortItems(
  items: Item[],
  sortBy: {
    field: 'name' | 'rarity' | 'type' | 'cost';
    direction: 'asc' | 'desc';
  } = { field: 'rarity', direction: 'desc' }
): Item[] {
  return tryCatch(() => {
    const { field, direction } = sortBy;
    
    // Create a copy to avoid mutating the original array
    const sortedItems = [...items];
    
    // Define rarity ranking for sorting
    const rarityRank: Record<ItemRarity, number> = {
      common: 1,
      uncommon: 2,
      rare: 3,
      unique: 4,
      legendary: 5
    };
    
    // Define type ranking for sorting
    const typeRank: Record<ItemType, number> = {
      knowledge: 1,
      technical: 2,
      teaching: 3,
      personal: 4,
      special: 5
    };
    
    return sortedItems.sort((a, b) => {
      let comparison = 0;
      
      // Sort based on the specified field
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
          
        case 'rarity':
          comparison = rarityRank[a.rarity] - rarityRank[b.rarity];
          break;
          
        case 'type':
          comparison = typeRank[a.type] - typeRank[b.type];
          break;
          
        case 'cost':
          comparison = a.cost - b.cost;
          break;
          
        default:
          comparison = 0;
      }
      
      // Apply sort direction
      return direction === 'asc' ? comparison : -comparison;
    });
  }, items);
}

/**
 * Group items by a specific property
 * @param items Array of items to group
 * @param groupBy Property to group by
 * @returns Record of grouped items
 */
export function groupItems(
  items: Item[],
  groupBy: 'type' | 'rarity'
): Record<string, Item[]> {
  return tryCatch(() => {
    return items.reduce((groups, item) => {
      const key = item[groupBy];
      if (!groups[key]) {
        groups[key] = [];
      }
      
      groups[key].push(item);
      return groups;
    }, {} as Record<string, Item[]>);
  }, { });
}

/**
 * Check if an item can be used currently
 * @param item Item to check
 * @param gameState Current game state
 * @returns Whether the item can be used
 */
export function canUseItem(item: Item, gameState: any): boolean {
  return tryCatch(() => {
    // Must be usable
    if (!item.isUsable) return false;
    
    // Check for context-specific restrictions
    // For example, some items might only be usable during specific challenges
    const currentNodeType = gameState.node.nodeType;
    const currentChallengeType = gameState.challenge.challengeType;
    
    // Check for effects with target restrictions
    const hasTargetRestrictions = item.effects.some(effect => {
      // If effect targets a specific node type that doesn't match current
      if (effect.target === 'clinical' && currentNodeType !== 'clinical') return true;
      if (effect.target === 'qa' && currentNodeType !== 'qa') return true;
      if (effect.target === 'educational' && currentNodeType !== 'educational') return true;
      
      return false;
    });
    
    if (hasTargetRestrictions) return false;
    
    // Can use
    return true;
  }, false);
}

/**
 * Get the description of what will happen when an item is used
 * @param item Item to describe
 * @returns User-friendly effect description
 */
export function getItemUseDescription(item: Item): string {
  return tryCatch(() => {
    if (!item.isUsable) {
      return "This item provides passive benefits.";
    }
    
    // Compile effect descriptions
    const effectDescriptions = item.effects
      .map(effect => effect.description)
      .join('\n');
    
    return effectDescriptions || "Using this item will activate its effects.";
  }, "Item effect information unavailable.");
}

/**
 * Get items that can be used in the current context
 * @param items Array of all inventory items
 * @param gameState Current game state
 * @returns Array of usable items
 */
export function getUsableItems(items: Item[], gameState: any): Item[] {
  return tryCatch(() => {
    return items.filter(item => canUseItem(item, gameState));
  }, []);
}

/**
 * Get items by IDs
 * @param itemIds Array of item IDs
 * @returns Array of item objects
 */
export function getItemsByIds(itemIds: string[]): Item[] {
  return tryCatch(() => {
    return itemIds
      .map(id => getItemById(id))
      .filter((item): item is Item => item !== undefined);
  }, []);
}

/**
 * Calculate the total effect of all active items
 * @param activeItems Array of active items
 * @param effectType Type of effect to calculate
 * @param target Optional target filter
 * @returns Total effect value
 */
export function calculateTotalItemEffect(
  activeItems: Item[],
  effectType: string,
  target?: string
): number {
  return calculateTotalEffect(activeItems, effectType as any, target);
}

/**
 * Check if any active items provide a specific effect
 * @param activeItems Array of active items
 * @param effectType Type of effect to check for
 * @param target Optional target filter
 * @returns Whether the effect is available
 */
export function hasItemEffect(
  activeItems: Item[],
  effectType: string,
  target?: string
): boolean {
  return hasEffect(activeItems, effectType as any, target);
}

/**
 * Format item rarity for display
 * @param rarity Item rarity
 * @returns Formatted rarity string
 */
export function formatRarity(rarity: ItemRarity): string {
  return rarity.charAt(0).toUpperCase() + rarity.slice(1);
}

/**
 * Format item type for display
 * @param type Item type
 * @returns Formatted type string
 */
export function formatItemType(type: ItemType): string {
  switch (type) {
    case 'knowledge':
      return 'Knowledge Tool';
    case 'technical':
      return 'Technical Equipment';
    case 'teaching':
      return 'Teaching Aid';
    case 'personal':
      return 'Personal Development';
    case 'special':
      return 'Special Item';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}