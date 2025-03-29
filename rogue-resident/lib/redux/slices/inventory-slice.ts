import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ItemType } from '@/lib/types/item-types';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: 'common' | 'uncommon' | 'rare' | 'unique';
  isUsable: boolean;
  isPassive: boolean;
  quantity: number;
  effects: ItemEffect[];
  icon?: string;
}

export interface ItemEffect {
  type: string;
  value: number | string | boolean;
  duration?: number; // In turns, -1 for permanent
  description: string;
}

export interface InventoryState {
  items: InventoryItem[];
  maxItems: number;
  activeEffects: {
    effectId: string;
    sourceId: string;
    type: string;
    value: number | string | boolean;
    turnsRemaining: number; // -1 for permanent
  }[];
}

const initialState: InventoryState = {
  items: [],
  maxItems: this.maxItems,
  activeEffects: []
};

export const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<InventoryItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      if (existingItem && existingItem.quantity < 99) {
        // Stackable item - increase quantity
        existingItem.quantity += 1;
      } else if (state.items.length < state.maxItems) {
        // New item that fits in inventory
        state.items.push({
          ...newItem,
          quantity: 1
        });
      }
      
      // Apply passive effects immediately
      if (newItem.isPassive) {
        newItem.effects.forEach(effect => {
          state.activeEffects.push({
            effectId: `${newItem.id}_${effect.type}`,
            sourceId: newItem.id,
            type: effect.type,
            value: effect.value,
            turnsRemaining: effect.duration || -1
          });
        });
      }
    },
    
    removeItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        
        if (existingItem.quantity > 1) {
          // Decrease quantity
          existingItem.quantity -= 1;
        } else {
          // Remove item
          state.items.splice(existingItemIndex, 1);
        }
        
        // Remove passive effects if item was completely removed
        if (existingItem.quantity <= 1 && existingItem.isPassive) {
          state.activeEffects = state.activeEffects.filter(
            effect => effect.sourceId !== itemId
          );
        }
      }
    },
    
    useItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const existingItem = state.items[existingItemIndex];
        
        if (existingItem.isUsable) {
          // Apply non-passive effects
          existingItem.effects.forEach(effect => {
            if (effect.duration && effect.duration > 0) {
              state.activeEffects.push({
                effectId: `${existingItem.id}_${effect.type}_${Date.now()}`,
                sourceId: existingItem.id,
                type: effect.type,
                value: effect.value,
                turnsRemaining: effect.duration
              });
            }
          });
          
          // Use up one item
          if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
          } else {
            state.items.splice(existingItemIndex, 1);
          }
        }
      }
    },
    
    decrementEffectDurations: (state) => {
      // Decrease turn count for temporary effects
      state.activeEffects = state.activeEffects.filter(effect => {
        if (effect.turnsRemaining === -1) {
          // Permanent effect
          return true;
        } else if (effect.turnsRemaining > 1) {
          // Decrease duration
          effect.turnsRemaining -= 1;
          return true;
        } else {
          // Effect has expired
          return false;
        }
      });
    },
    
    clearInventory: (state) => {
      state.items = [];
      state.activeEffects = [];
    }
  }
});

// Export actions
export const {
  addItem,
  removeItem,
  useItem,
  decrementEffectDurations,
  clearInventory
} = inventorySlice.actions;

// Export selectors
export const selectInventoryState = (state: RootState) => state.inventory;
export const selectItems = (state: RootState) => state.inventory.items;
export const selectMaxItems = (state: RootState) => state.inventory.maxItems;
export const selectActiveEffects = (state: RootState) => state.inventory.activeEffects;

// Helper selectors
export const selectItemById = (state: RootState, itemId: string) => 
  state.inventory.items.find(item => item.id === itemId);

export const selectEffectsByType = (state: RootState, effectType: string) =>
  state.inventory.activeEffects.filter(effect => effect.type === effectType);

export default inventorySlice.reducer;