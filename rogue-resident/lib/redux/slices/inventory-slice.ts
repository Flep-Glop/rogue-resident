import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Item, ItemEffect, EffectType } from '@/lib/types/item-types';

export interface InventoryState {
  items: Item[];
  activeItems: string[]; // IDs of equipped/active items
  activeEffects: {
    effectId: string;
    sourceId: string;
    type: EffectType;
    value: number | string | boolean;
    turnsRemaining: number; // -1 for permanent
  }[];
  selectedItemId: string | null;
  capacity: number;
}

const initialState: InventoryState = {
  items: [],
  activeItems: [],
  activeEffects: [],
  selectedItemId: null,
  capacity: 10 // Default inventory capacity
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        // Item already exists, update it (for stacking items)
        state.items[existingItemIndex] = newItem;
      } else if (state.items.length < state.capacity) {
        // Add new item if inventory has space
        state.items.push(newItem);
      }
      
      // If item is passive, apply its effects immediately
      if (newItem.isPassive) {
        newItem.effects.forEach(effect => {
          state.activeEffects.push({
            effectId: `${newItem.id}_${effect.type}`,
            sourceId: newItem.id,
            type: effect.type as EffectType,
            value: effect.value,
            turnsRemaining: effect.duration || -1
          });
        });
      }
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      
      // Remove from active items if active
      state.activeItems = state.activeItems.filter(id => id !== itemId);
      
      // Remove effects from this item
      state.activeEffects = state.activeEffects.filter(effect => effect.sourceId !== itemId);
      
      // Remove the item itself
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Clear selection if this was the selected item
      if (state.selectedItemId === itemId) {
        state.selectedItemId = null;
      }
    },
    
    useItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item && item.isUsable) {
        // Apply item effects
        item.effects.forEach(effect => {
          // Add temporary effects to active effects
          if (effect.duration && effect.duration > 0) {
            state.activeEffects.push({
              effectId: `${item.id}_${effect.type}_${Date.now()}`,
              sourceId: item.id,
              type: effect.type as EffectType,
              value: effect.value,
              turnsRemaining: effect.duration
            });
          }
          // Permanent effects are handled by the appropriate reducers
        });
        
        // Remove the item after use if consumable
        state.items = state.items.filter(i => i.id !== itemId);
      }
    },
    
    activateItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      
      if (!state.activeItems.includes(itemId)) {
        state.activeItems.push(itemId);
        
        // Apply passive effects from this item
        const item = state.items.find(item => item.id === itemId);
        if (item && item.isPassive) {
          item.effects.forEach(effect => {
            state.activeEffects.push({
              effectId: `${item.id}_${effect.type}`,
              sourceId: item.id,
              type: effect.type as EffectType,
              value: effect.value,
              turnsRemaining: effect.duration || -1
            });
          });
        }
      }
    },
    
    deactivateItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      
      // Remove from active items
      state.activeItems = state.activeItems.filter(id => id !== itemId);
      
      // Remove effects from this item
      state.activeEffects = state.activeEffects.filter(effect => effect.sourceId !== itemId);
    },
    
    selectItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItemId = action.payload;
    },
    
    decrementEffectDurations: (state) => {
      // Update effect durations, removing expired ones
      state.activeEffects = state.activeEffects.filter(effect => {
        if (effect.turnsRemaining === -1) {
          // Permanent effect
          return true;
        } else if (effect.turnsRemaining > 1) {
          // Decrement duration
          effect.turnsRemaining -= 1;
          return true;
        } else {
          // Effect expired
          return false;
        }
      });
    },
    
    purchaseItem: (state, action: PayloadAction<string>) => {
      // This would typically call addItem after payment
      // Logic handled by thunk
    },
    
    clearInventory: (state) => {
      state.items = [];
      state.activeItems = [];
      state.activeEffects = [];
      state.selectedItemId = null;
    },
    
    increaseCapacity: (state, action: PayloadAction<number>) => {
      state.capacity += action.payload;
    }
  }
});

// Export actions
export const {
  addItem,
  removeItem,
  useItem,
  activateItem,
  deactivateItem,
  selectItem,
  decrementEffectDurations,
  purchaseItem,
  clearInventory,
  increaseCapacity
} = inventorySlice.actions;

// Export selectors
export const selectInventoryState = (state: RootState) => state.inventory;
export const selectItems = (state: RootState) => state.inventory.items;
export const selectActiveItems = (state: RootState) => state.inventory.activeItems;
export const selectActiveEffects = (state: RootState) => state.inventory.activeEffects;
export const selectSelectedItemId = (state: RootState) => state.inventory.selectedItemId;
export const selectCapacity = (state: RootState) => state.inventory.capacity;

// Helper selectors
export const selectItemById = (state: RootState, itemId: string) => 
  state.inventory.items.find(item => item.id === itemId);

export const selectEffectsByType = (state: RootState, effectType: EffectType) =>
  state.inventory.activeEffects.filter(effect => effect.type === effectType);

export const selectInventoryFull = (state: RootState) =>
  state.inventory.items.length >= state.inventory.capacity;

export default inventorySlice.reducer;