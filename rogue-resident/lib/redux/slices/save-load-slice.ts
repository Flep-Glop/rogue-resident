import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { saveGameToStorage, loadGameFromStorage, getSavedGames } from '@/lib/utils/save-load';

export interface SaveSlot {
  id: string;
  name: string;
  timestamp: number;
  floorLevel: number;
  playerHealth: number;
  playerInsight: number;
  score: number;
}

export interface SaveLoadState {
  saves: SaveSlot[];
  isSaving: boolean;
  isLoading: boolean;
  currentSaveId: string | null;
  error: string | null;
  autoSaveEnabled: boolean;
}

const initialState: SaveLoadState = {
  saves: [],
  isSaving: false,
  isLoading: false,
  currentSaveId: null,
  error: null,
  autoSaveEnabled: true
};

export const saveLoadSlice = createSlice({
  name: 'saveLoad',
  initialState,
  reducers: {
    setSaves: (state, action: PayloadAction<SaveSlot[]>) => {
      state.saves = action.payload;
    },
    
    addSave: (state, action: PayloadAction<SaveSlot>) => {
      const newSave = action.payload;
      const existingSaveIndex = state.saves.findIndex(save => save.id === newSave.id);
      
      if (existingSaveIndex >= 0) {
        // Update existing save
        state.saves[existingSaveIndex] = newSave;
      } else {
        // Add new save
        state.saves.push(newSave);
      }
      
      state.currentSaveId = newSave.id;
    },
    
    removeSave: (state, action: PayloadAction<string>) => {
      const saveId = action.payload;
      state.saves = state.saves.filter(save => save.id !== saveId);
      
      if (state.currentSaveId === saveId) {
        state.currentSaveId = null;
      }
    },
    
    setSavingState: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },
    
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setCurrentSaveId: (state, action: PayloadAction<string | null>) => {
      state.currentSaveId = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    setAutoSaveEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoSaveEnabled = action.payload;
    },
    
    loadSaves: (state) => {
      try {
        // Load saved games from storage
        const saves = getSavedGames();
        state.saves = saves;
        state.error = null;
      } catch (error) {
        state.error = "Failed to load saved games";
      }
    }
  }
});

// Export actions
export const {
  setSaves,
  addSave,
  removeSave,
  setSavingState,
  setLoadingState,
  setCurrentSaveId,
  setError,
  setAutoSaveEnabled,
  loadSaves
} = saveLoadSlice.actions;

// Thunk for saving the game
export const saveGame = (saveName: string) => async (dispatch: any, getState: () => RootState) => {
  try {
    dispatch(setSavingState(true));
    
    const state = getState();
    const saveId = saveName.replace(/\s+/g, '_').toLowerCase() + '_' + Date.now();
    
    // Prepare save metadata
    const saveData = {
      id: saveId,
      name: saveName,
      timestamp: Date.now(),
      floorLevel: state.map.floorLevel,
      playerHealth: state.game.playerHealth,
      playerInsight: state.game.playerInsight,
      score: state.game.score
    };
    
    // Save game state to storage
    await saveGameToStorage(saveId, state);
    
    // Add save to list
    dispatch(addSave(saveData));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError("Failed to save game"));
  } finally {
    dispatch(setSavingState(false));
  }
};

// Thunk for loading the game
export const loadGame = (saveId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoadingState(true));
    
    // Load game state from storage
    const gameState = await loadGameFromStorage(saveId);
    
    if (gameState) {
      // Dispatch actions to restore state
      // Note: The actual implementation would depend on how you want to handle loading
      // This is a simplified approach
      dispatch({
        type: 'LOAD_GAME_STATE',
        payload: gameState
      });
      
      dispatch(setCurrentSaveId(saveId));
      dispatch(setError(null));
    } else {
      dispatch(setError("Failed to load game: Save not found"));
    }
  } catch (error) {
    dispatch(setError("Failed to load game"));
  } finally {
    dispatch(setLoadingState(false));
  }
};

// Export selectors
export const selectSaveLoadState = (state: RootState) => state.saveLoad;
export const selectSaves = (state: RootState) => state.saveLoad.saves;
export const selectIsSaving = (state: RootState) => state.saveLoad.isSaving;
export const selectIsLoading = (state: RootState) => state.saveLoad.isLoading;

export default saveLoadSlice.reducer;