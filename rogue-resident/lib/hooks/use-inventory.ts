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
import { calculateTotalItemEffect, hasItemEffect } from '@/lib/utils/game-utils';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

// Create memoized selectors
const selectInventoryItems = createSelector(
  state => state.inventory.items,
  items => items
);

const selectActiveItemIds = createSelector(
  state => state.inventory.activeItems,
  activeItems => activeItems
);

const selectActiveEffects = createSelector(
  state => state.inventory.activeEffects,
  activeEffects => activeEffects
);

const selectInventoryStatus = createSelector(
  state => ({
    selectedItemId: state.inventory.selectedItemId,
    capacity: state.inventory.capacity,
    isFull: state.inventory.items.length >= state.inventory.capacity
  }),
  status => status
);

// Group items by type
const selectItemsByType = createSelector(
  state => state.inventory.items,
  items => {
    const byType = {} as Record<ItemType, Item[]>;
    items.forEach(item => {
      if (!byType[item.type]) {
        byType[item.type] = [];
      }
      byType[item.type].push(item);
    });
    return byType;
  }
);

/**
 * Hook for managing inventory and items
 * 
 * @returns Inventory state and methods for interacting with it
 */
export function useInventory() {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const items = useAppSelector(selectInventoryItems);
  const activeItemIds = useAppSelector(selectActiveItemIds);
  const activeEffects = useAppSelector(selectActiveEffects);
  const { selectedItemId, capacity, isFull } = useAppSelector(selectInventoryStatus);
  const itemsByType = useAppSelector(selectItemsByType);
  
  // Item management
  const addInventoryItem = useCallback((item: Item) => {
    return tryCatch(() => {
      if (items.length < capacity) {
        dispatch(addItem(item));
        return true;
      }
      return false;
    }, false, ErrorCode.INVENTORY_FULL);
  }, [dispatch, items.length, capacity]);
  
  const removeInventoryItem = useCallback((itemId: string) => {
    tryCatch(() => {
      dispatch(removeItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const useInventoryItem = useCallback((itemId: string) => {
    tryCatch(() => {
      dispatch(useItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const activateInventoryItem = useCallback((itemId: string) => {
    tryCatch(() => {
      dispatch(activateItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const deactivateInventoryItem = useCallback((itemId: string) => {
    tryCatch(() => {
      dispatch(deactivateItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const selectInventoryItem = useCallback((itemId: string | null) => {
    tryCatch(() => {
      dispatch(selectItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const purchaseInventoryItem = useCallback((itemId: string) => {
    tryCatch(() => {
      dispatch(purchaseItem(itemId));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const clearAllItems = useCallback(() => {
    tryCatch(() => {
      dispatch(clearInventory());
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const expandCapacity = useCallback((amount: number) => {
    tryCatch(() => {
      dispatch(increaseCapacity(amount));
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  const updateEffectDurations = useCallback(() => {
    tryCatch(() => {
      dispatch(decrementEffectDurations());
    }, undefined, ErrorCode.INVENTORY_ERROR);
  }, [dispatch]);
  
  // Helper methods
  const getItemById = useCallback((itemId: string): Item | undefined => {
    return tryCatch(() => {
      return items.find(item => item.id === itemId);
    }, undefined, ErrorCode.ITEM_NOT_FOUND);
  }, [items]);
  
  const getItemsByType = useCallback((type: ItemType): Item[] => {
    return tryCatch(() => {
      return itemsByType[type] || [];
    }, [], ErrorCode.INVENTORY_ERROR);
  }, [itemsByType]);
  
  const isItemActive = useCallback((itemId: string): boolean => {
    return tryCatch(() => {
      return activeItemIds.includes(itemId);
    }, false, ErrorCode.INVENTORY_ERROR);
  }, [activeItemIds]);
  
  const getActiveItems = useCallback((): Item[] => {
    return tryCatch(() => {
      return items.filter(item => activeItemIds.includes(item.id));
    }, [], ErrorCode.INVENTORY_ERROR);
  }, [items, activeItemIds]);
  
  // Effect calculations
  const getEffectValue = useCallback((targetType: string, modifierType: string): number => {
    return tryCatch(() => {
      const activeItems = getActiveItems();
      return calculateTotalItemEffect(activeItems, targetType, modifierType);
    }, 0, ErrorCode.INVENTORY_ERROR);
  }, [getActiveItems]);
  
  const hasEffect = useCallback((targetType: string, modifierType: string): boolean => {
    return tryCatch(() => {
      const activeItems = getActiveItems();
      return hasItemEffect(activeItems, targetType, modifierType);
    }, false, ErrorCode.INVENTORY_ERROR);
  }, [getActiveItems]);
  
  const getEffectsByType = useCallback((effectType: EffectType) => {
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