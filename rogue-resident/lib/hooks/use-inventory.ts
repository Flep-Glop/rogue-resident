'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, createSelector } from '@/lib/redux/hooks';
import { 
  addItem, 
  removeItem, 
  useItem,
  activateItem, 
  deactivateItem, 
  selectItem,
  clearInventory,
  increaseCapacity,
  decrementEffectDurations,
  purchaseItem
} from '@/lib/redux/slices/inventory-slice';
import type { Item, ItemEffect, ItemType, EffectType } from '@/lib/types/item-types';
import type { RootState } from '@/lib/types/redux-types';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

/**
 * Calculates the total effect value for a specific target and modifier type
 * 
 * @param items - The items to calculate effects from
 * @param targetType - The target type to calculate for
 * @param modifierType - The modifier type to calculate for
 * @returns The total effect value
 */
function calculateTotalItemEffect(items: Item[], targetType: string, modifierType: string): number {
  return items.reduce((total, item) => {
    if (!item.effects) return total;
    
    const matchingEffects = item.effects.filter(effect => 
      effect.target === targetType && effect.type === modifierType && effect.isActive !== false
    );
    
    return total + matchingEffects.reduce((sum, effect) => sum + (typeof effect.value === 'number' ? effect.value : 0), 0);
  }, 0);
}

/**
 * Checks if there are any effects for a specific target and modifier type
 * 
 * @param items - The items to check effects from
 * @param targetType - The target type to check for
 * @param modifierType - The modifier type to check for
 * @returns Whether any effects exist for the specified types
 */
function hasItemEffect(items: Item[], targetType: string, modifierType: string): boolean {
  return items.some(item => 
    item.effects?.some(effect => 
      effect.target === targetType && 
      effect.type === modifierType && 
      effect.isActive !== false
    )
  );
}

// Create memoized selectors
const selectInventoryItems = createSelector(
  [(state: RootState) => state.inventory.items],
  (items) => items
);

const selectActiveItemIds = createSelector(
  [(state: RootState) => state.inventory.activeItems],
  (activeItems) => activeItems
);

const selectActiveEffects = createSelector(
  [(state: RootState) => state.inventory.activeEffects],
  (activeEffects) => activeEffects
);

const selectInventoryStatus = createSelector(
  [(state: RootState) => state.inventory],
  (inventory) => ({
    selectedItemId: inventory.selectedItemId,
    capacity: inventory.capacity,
    isFull: inventory.items.length >= inventory.capacity
  })
);

// Group items by type
const selectItemsByType = createSelector(
  [(state: RootState) => state.inventory.items],
  (items) => {
    const byType: Record<ItemType, Item[]> = {} as Record<ItemType, Item[]>;
    const itemTypes: ItemType[] = ['knowledge', 'technical', 'teaching', 'personal', 'special'];
    
    // Initialize all item types with empty arrays
    itemTypes.forEach(type => {
      byType[type] = [];
    });
    
    // Add items to their respective type arrays
    items.forEach((item) => {
      if (item.type && byType[item.type]) {
        byType[item.type].push(item);
      }
    });
    
    return byType;
  }
);

/**
 * Interface defining the return value of the useInventory hook
 */
interface UseInventoryReturn {
  // State
  items: Item[];
  activeItemIds: string[];
  activeEffects: ItemEffect[];
  selectedItemId: string | null;
  capacity: number;
  isFull: boolean;
  itemsByType: Record<ItemType, Item[]>;
  
  // Actions
  addItem: (item: Item) => boolean;
  removeItem: (itemId: string) => void;
  useItem: (itemId: string) => void;
  activateItem: (itemId: string) => void;
  deactivateItem: (itemId: string) => void;
  selectItem: (itemId: string | null) => void;
  purchaseItem: (itemId: string) => void;
  clearInventory: () => void;
  increaseCapacity: (amount: number) => void;
  decrementEffectDurations: () => void;
  
  // Helpers
  getItemById: (itemId: string) => Item | undefined;
  getItemsByType: (type: ItemType) => Item[];
  isItemActive: (itemId: string) => boolean;
  getActiveItems: () => Item[];
  getEffectValue: (targetType: string, modifierType: string) => number;
  hasEffect: (targetType: string, modifierType: string) => boolean;
  getEffectsByType: (effectType: EffectType) => ItemEffect[];
}

/**
 * Hook for managing inventory and items
 * 
 * Provides functionality to manage the player's inventory, activate and use items,
 * and calculate item effects.
 * 
 * @returns Object containing inventory state and interaction methods
 */
export function useInventory(): UseInventoryReturn {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const items = useAppSelector(selectInventoryItems);
  const activeItemIds = useAppSelector(selectActiveItemIds);
  const activeEffects = useAppSelector(selectActiveEffects);
  const { selectedItemId, capacity, isFull } = useAppSelector(selectInventoryStatus);
  const itemsByType = useAppSelector(selectItemsByType);
  
  /**
   * Adds an item to the inventory if there's capacity
   * 
   * @param item - The item to add
   * @returns Whether the item was successfully added
   */
  const addInventoryItem = useCallback((item: Item): boolean => {
    return tryCatch(() => {
      if (items.length < capacity) {
        dispatch(addItem(item));
        return true;
      }
      return false;
    }, false, ErrorCode.INVENTORY_FULL);
  }, [dispatch, items.length, capacity]);
  
  /**
   * Removes an item from the inventory
   * 
   * @param itemId - The ID of the item to remove
   */
  const removeInventoryItem = useCallback((itemId: string): void => {
    tryCatch(() => {
      dispatch(removeItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Uses an item from the inventory
   * 
   * @param itemId - The ID of the item to use
   */
  const useInventoryItem = useCallback((itemId: string): void => {
    tryCatch(() => {
      dispatch(useItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Activates an item to apply its effects
   * 
   * @param itemId - The ID of the item to activate
   */
  const activateInventoryItem = useCallback((itemId: string): void => {
    tryCatch(() => {
      dispatch(activateItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Deactivates an item, removing its effects
   * 
   * @param itemId - The ID of the item to deactivate
   */
  const deactivateInventoryItem = useCallback((itemId: string): void => {
    tryCatch(() => {
      dispatch(deactivateItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Selects an item as the current item
   * 
   * @param itemId - The ID of the item to select, or null to deselect
   */
  const selectInventoryItem = useCallback((itemId: string | null): void => {
    tryCatch(() => {
      dispatch(selectItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Purchases an item with insight
   * 
   * @param itemId - The ID of the item to purchase
   */
  const purchaseInventoryItem = useCallback((itemId: string): void => {
    tryCatch(() => {
      dispatch(purchaseItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Clears all items from the inventory
   */
  const clearAllItems = useCallback((): void => {
    tryCatch(() => {
      dispatch(clearInventory());
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Increases the inventory capacity
   * 
   * @param amount - The amount to increase capacity by
   */
  const expandCapacity = useCallback((amount: number): void => {
    tryCatch(() => {
      dispatch(increaseCapacity(amount));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Updates effect durations, decreasing them by 1
   */
  const updateEffectDurations = useCallback((): void => {
    tryCatch(() => {
      dispatch(decrementEffectDurations());
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  /**
   * Gets an item by its ID
   * 
   * @param itemId - The ID of the item to get
   * @returns The item with the given ID, or undefined if not found
   */
  const getItemById = useCallback((itemId: string): Item | undefined => {
    return tryCatch(() => {
      return items.find(item => item.id === itemId);
    }, undefined, ErrorCode.ITEM_NOT_FOUND);
  }, [items]);
  
  /**
   * Gets all items of a specific type
   * 
   * @param type - The type of items to get
   * @returns Array of items of the specified type
   */
  const getItemsByType = useCallback((type: ItemType): Item[] => {
    return tryCatch(() => {
      return itemsByType[type] || [];
    }, [], ErrorCode.INVENTORY_ERROR);
  }, [itemsByType]);
  
  /**
   * Checks if an item is currently active
   * 
   * @param itemId - The ID of the item to check
   * @returns Whether the item is active
   */
  const isItemActive = useCallback((itemId: string): boolean => {
    return tryCatch(() => {
      return activeItemIds.includes(itemId);
    }, false, ErrorCode.INVENTORY_ERROR);
  }, [activeItemIds]);
  
  /**
   * Gets all currently active items
   * 
   * @returns Array of active items
   */
  const getActiveItems = useCallback((): Item[] => {
    return tryCatch(() => {
      return items.filter(item => activeItemIds.includes(item.id));
    }, [], ErrorCode.INVENTORY_ERROR);
  }, [items, activeItemIds]);
  
  /**
   * Calculates the total effect value for a specific target and modifier type
   * 
   * @param targetType - The target type to check for (e.g., 'clinical', 'qa')
   * @param modifierType - The modifier type to check for (e.g., 'bonus', 'penalty')
   * @returns The total effect value
   */
  const getEffectValue = useCallback((targetType: string, modifierType: string): number => {
    return tryCatch(() => {
      const activeItems = getActiveItems();
      return calculateTotalItemEffect(activeItems, targetType, modifierType);
    }, 0, ErrorCode.INVENTORY_ERROR);
  }, [getActiveItems]);
  
  /**
   * Checks if there are any effects for a specific target and modifier type
   * 
   * @param targetType - The target type to check for (e.g., 'clinical', 'qa')
   * @param modifierType - The modifier type to check for (e.g., 'bonus', 'penalty')
   * @returns Whether any effects exist for the specified types
   */
  const hasEffect = useCallback((targetType: string, modifierType: string): boolean => {
    return tryCatch(() => {
      const activeItems = getActiveItems();
      return hasItemEffect(activeItems, targetType, modifierType);
    }, false, ErrorCode.INVENTORY_ERROR);
  }, [getActiveItems]);
  
  /**
   * Gets all active effects of a specific type
   * 
   * @param effectType - The type of effects to get
   * @returns Array of effects of the specified type
   */
  const getEffectsByType = useCallback((effectType: EffectType): ItemEffect[] => {
    return tryCatch(() => {
      return activeEffects.filter(effect => effect.type === effectType);
    }, [], ErrorCode.INVENTORY_ERROR);
  }, [activeEffects]);
  
  return {
    // State
    items,
    activeItemIds,
    activeEffects,
    selectedItemId,
    capacity,
    isFull,
    itemsByType,
    
    // Actions
    addItem: addInventoryItem,
    removeItem: removeInventoryItem,
    useItem: useInventoryItem,
    activateItem: activateInventoryItem,
    deactivateItem: deactivateInventoryItem,
    selectItem: selectInventoryItem,
    purchaseItem: purchaseInventoryItem,
    clearInventory: clearAllItems,
    increaseCapacity: expandCapacity,
    decrementEffectDurations: updateEffectDurations,
    
    // Helpers
    getItemById,
    getItemsByType,
    isItemActive,
    getActiveItems,
    getEffectValue,
    hasEffect,
    getEffectsByType
  };
}