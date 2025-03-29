'use client'

import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { 
  addItem, 
  removeItem, 
  activateItem, 
  deactivateItem, 
  selectItem 
} from '@/lib/redux/slices/inventory-slice'
import { Item, ItemCategory } from '@/lib/types/item-types'
import { calculateTotalItemEffect, hasItemEffect } from '@/lib/utils/game-utils'

interface UseInventoryReturn {
  // Inventory state
  items: Item[]
  activeItemIds: string[]
  selectedItemId: string | null
  capacity: number
  inventoryFull: boolean
  
  // Items by category
  itemsByCategory: Record<ItemCategory, Item[]>
  
  // Methods for managing items
  addItem: (item: Item) => void
  removeItem: (itemId: string) => void
  activateItem: (itemId: string) => void
  deactivateItem: (itemId: string) => void
  selectItem: (itemId: string | null) => void
  
  // Helper methods
  getItemById: (itemId: string) => Item | undefined
  isItemActive: (itemId: string) => boolean
  getActiveItems: () => Item[]
  
  // Effect calculations
  getEffectValue: (targetType: string, modifierType: string) => number
  hasEffect: (targetType: string, modifierType: string) => boolean
}

/**
 * Custom hook for managing inventory and items
 */
export function useInventory(): UseInventoryReturn {
  const dispatch = useAppDispatch()
  const inventoryState = useAppSelector(state => state.inventory)
  
  // Group items by category
  const itemsByCategory = inventoryState.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<ItemCategory, Item[]>)
  
  // Add an item to inventory
  const addItemHandler = useCallback((item: Item) => {
    if (inventoryState.items.length < inventoryState.capacity) {
      dispatch(addItem(item))
    }
  }, [dispatch, inventoryState.items.length, inventoryState.capacity])
  
  // Remove an item from inventory
  const removeItemHandler = useCallback((itemId: string) => {
    dispatch(removeItem(itemId))
  }, [dispatch])
  
  // Activate an item
  const activateItemHandler = useCallback((itemId: string) => {
    dispatch(activateItem(itemId))
  }, [dispatch])
  
  // Deactivate an item
  const deactivateItemHandler = useCallback((itemId: string) => {
    dispatch(deactivateItem(itemId))
  }, [dispatch])
  
  // Select an item
  const selectItemHandler = useCallback((itemId: string | null) => {
    dispatch(selectItem(itemId))
  }, [dispatch])
  
  // Get an item by ID
  const getItemById = useCallback((itemId: string) => {
    return inventoryState.items.find(item => item.id === itemId)
  }, [inventoryState.items])
  
  // Check if an item is active
  const isItemActive = useCallback((itemId: string) => {
    return inventoryState.activeItemIds.includes(itemId)
  }, [inventoryState.activeItemIds])
  
  // Get all active items
  const getActiveItems = useCallback(() => {
    return inventoryState.items.filter(item => 
      inventoryState.activeItemIds.includes(item.id)
    )
  }, [inventoryState.items, inventoryState.activeItemIds])
  
  // Calculate total effect value for a specific modifier
  const getEffectValue = useCallback((targetType: string, modifierType: string) => {
    const activeItems = getActiveItems()
    return calculateTotalItemEffect(activeItems, targetType, modifierType)
  }, [getActiveItems])
  
  // Check if player has a specific effect
  const hasEffect = useCallback((targetType: string, modifierType: string) => {
    const activeItems = getActiveItems()
    return hasItemEffect(activeItems, targetType, modifierType)
  }, [getActiveItems])
  
  return {
    // Inventory state
    items: inventoryState.items,
    activeItemIds: inventoryState.activeItemIds,
    selectedItemId: inventoryState.selectedItemId,
    capacity: inventoryState.capacity,
    inventoryFull: inventoryState.items.length >= inventoryState.capacity,
    
    // Items by category
    itemsByCategory,
    
    // Methods for managing items
    addItem: addItemHandler,
    removeItem: removeItemHandler,
    activateItem: activateItemHandler,
    deactivateItem: deactivateItemHandler,
    selectItem: selectItemHandler,
    
    // Helper methods
    getItemById,
    isItemActive,
    getActiveItems,
    
    // Effect calculations
    getEffectValue,
    hasEffect
  }
}
