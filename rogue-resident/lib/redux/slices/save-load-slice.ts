import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { SaveSlot, SaveGameData } from '@/lib/types/game-types';
import { 
  saveGameToStorage, 
  loadGameFromStorage, 
  getSavedGames 
} from '@/lib/utils/save-load';

export interface SaveLoadState {
  saves: SaveSlot[];
  isSaving: boolean;
  isLoading: boolean;
  currentSaveId: string | null;
  error: string | null;
  autoSaveEnabled: boolean;
  lastSaveTimestamp: number | null;
  showSaveMenu: boolean;
  hasSave: boolean;
}

const initialState: SaveLoadState = {
  saves: [],
  isSaving: false,
  isLoading: false,
  currentSaveId: null,
  error: null,
  autoSaveEnabled: true,
  lastSaveTimestamp: null,
  showSaveMenu: false,
  hasSave: false
};

export const saveLoadSlice = createSlice({
  name: 'saveLoad',
  initialState,
  reducers: {
    setSaves: (state, action: PayloadAction<SaveSlot[]>) => {
      state.saves = action.payload;
      state.hasSave = action.payload.length > 0;
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
      state.lastSaveTimestamp = newSave.timestamp;
      state.hasSave = true;
    },
    
    removeSave: (state, action: PayloadAction<string>) => {
      const saveId = action.payload;
      state.saves = state.saves.filter(save => save.id !== saveId);
      
      if (state.currentSaveId === saveId) {
        state.currentSaveId = null;
      }
      
      state.hasSave = state.saves.length > 0;
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
    
    setSaveMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.showSaveMenu = action.payload;
    },
    
    loadSaves: (state) => {
      try {
        // Load saved games from storage
        const saves = getSavedGames();
        state.saves = saves;
        state.hasSave = saves.length > 0;
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
  setSaveMenuOpen,
  loadSaves
} = saveLoadSlice.actions;

// Thunk for saving the game
export const saveGameThunk = () => async (dispatch: any, getState: () => RootState) => {
  try {
    dispatch(setSavingState(true));
    
    const state = getState();
    const saveId = `save_${Date.now()}`;
    
    // Prepare save metadata
    const saveData: SaveGameData = {
      id: saveId,
      name: `Save ${new Date().toLocaleString()}`,
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
    
    return saveData;
  } catch (error) {
    dispatch(setError("Failed to save game"));
    throw error;
  } finally {
    dispatch(setSavingState(false));
  }
};

// Thunk for loading the game
export const loadGameThunk = () => async (dispatch: any, getState: () => RootState) => {
  try {
    const state = getState();
    const saveId = state.saveLoad.currentSaveId;
    
    if (!saveId) {
      dispatch(setError("No save selected"));
      return;
    }
    
    dispatch(setLoadingState(true));
    
    // Load game state from storage
    const gameState = await loadGameFromStorage(saveId);
    
    if (gameState) {
      // Dispatch actions to restore state
      dispatch({
        type: 'LOAD_GAME_STATE',
        payload: gameState
      });
      
      dispatch(setError(null));
      return gameState;
    } else {
      dispatch(setError("Failed to load game: Save not found"));
      throw new Error("Save not found");
    }
  } catch (error) {
    dispatch(setError("Failed to load game"));
    throw error;
  } finally {
    dispatch(setLoadingState(false));
  }
};

// Thunk for deleting a save
export const deleteSaveThunk = () => async (dispatch: any, getState: () => RootState) => {
  try {
    const state = getState();
    const saveId = state.saveLoad.currentSaveId;
    
    if (!saveId) {
      dispatch(setError("No save selected"));
      return;
    }
    
    // Delete save from storage
    await import('@/lib/utils/save-load').then(({ deleteSavedGame }) => {
      deleteSavedGame(saveId);
    });
    
    // Remove save from state
    dispatch(removeSave(saveId));
    dispatch(setError(null));
  } catch (error) {
    dispatch(setError("Failed to delete save"));
    throw error;
  }
};

// Export selectors
export const selectSaveLoadState = (state: RootState) => state.saveLoad;
export const selectSaves = (state: RootState) => state.saveLoad.saves;
export const selectIsSaving = (state: RootState) => state.saveLoad.isSaving;
export const selectIsLoading = (state: RootState) => state.saveLoad.isLoading;
export const selectCurrentSaveId = (state: RootState) => state.saveLoad.currentSaveId;
export const selectAutoSaveEnabled = (state: RootState) => state.saveLoad.autoSaveEnabled;
export const selectShowSaveMenu = (state: RootState) => state.saveLoad.showSaveMenu;
export const selectHasSave = (state: RootState) => state.saveLoad.hasSave;

export default saveLoadSlice.reducer;