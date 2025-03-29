'use client';

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch, createSelector } from '@/lib/redux/hooks';
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

// Create memoized selectors
const selectInventoryItems = createSelector(state => state.inventory.items);
const selectActiveItemIds = createSelector(state => state.inventory.activeItems);
const selectActiveEffects = createSelector(state => state.inventory.activeEffects);
const selectInventoryStatus = createSelector(state => ({
  selectedItemId: state.inventory.selectedItemId,
  capacity: state.inventory.capacity,
  isFull: state.inventory.items.length >= state.inventory.capacity
}));

// Group items by type
const selectItemsByType = createSelector(state => {
  const byType = {} as Record<ItemType, Item[]>;
  state.inventory.items.forEach(item => {
    if (!byType[item.type]) {
      byType[item.type] = [];
    }
    byType[item.type].push(item);
  });
  return byType;
});

/**
 * Hook for managing inventory and items
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
    if (items.length < capacity) {
      dispatch(addItem(item));
      return true;
    }
    return false;
  }, [dispatch, items.length, capacity]);
  
  const removeInventoryItem = useCallback((itemId: string) => {
    dispatch(removeItem(itemId));
  }, [dispatch]);
  
  const useInventoryItem = useCallback((itemId: string) => {
    dispatch(useItem(itemId));
  }, [dispatch]);
  
  const activateInventoryItem = useCallback((itemId: string) => {
    dispatch(activateItem(itemId));
  }, [dispatch]);
  
  const deactivateInventoryItem = useCallback((itemId: string) => {
    dispatch(deactivateItem(itemId));
  }, [dispatch]);
  
  const selectInventoryItem = useCallback((itemId: string | null) => {
    dispatch(selectItem(itemId));
  }, [dispatch]);
  
  const purchaseInventoryItem = useCallback((itemId: string) => {
    dispatch(purchaseItem(itemId));
  }, [dispatch]);
  
  const clearAllItems = useCallback(() => {
    dispatch(clearInventory());
  }, [dispatch]);
  
  const expandCapacity = useCallback((amount: number) => {
    dispatch(increaseCapacity(amount));
  }, [dispatch]);
  
  const updateEffectDurations = useCallback(() => {
    dispatch(decrementEffectDurations());
  }, [dispatch]);
  
  // Helper methods
  const getItemById = useCallback((itemId: string): Item | undefined => {
    return items.find(item => item.id === itemId);
  }, [items]);
  
  const getItemsByType = useCallback((type: ItemType): Item[] => {
    return itemsByType[type] || [];
  }, [itemsByType]);
  
  const isItemActive = useCallback((itemId: string): boolean => {
    return activeItemIds.includes(itemId);
  }, [activeItemIds]);
  
  const getActiveItems = useCallback((): Item[] => {
    return items.filter(item => activeItemIds.includes(item.id));
  }, [items, activeItemIds]);
  
  // Effect calculations
  const getEffectValue = useCallback((targetType: string, modifierType: string): number => {
    const activeItems = getActiveItems();
    return calculateTotalItemEffect(activeItems, targetType, modifierType);
  }, [getActiveItems]);
  
  const hasEffect = useCallback((targetType: string, modifierType: string): boolean => {
    const activeItems = getActiveItems();
    return hasItemEffect(activeItems, targetType, modifierType);
  }, [getActiveItems]);
  
  const getEffectsByType = useCallback((effectType: EffectType) => {
    return activeEffects.filter(effect => effect.type === effectType);
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