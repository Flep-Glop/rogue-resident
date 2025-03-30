'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, createSelector } from '@/lib/redux/hooks';
import {
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
} from '@/lib/redux/slices/save-load-slice';
import type { SaveSlot } from '@/lib/types/game-types';
import type { RootState } from '@/lib/types/redux-types';
import { tryCatch, tryCatchAsync, ErrorCode } from '@/lib/utils/error-handlers';

// Import the actual async thunks
import { 
  saveGame as saveGameThunk,
  loadGame as loadGameThunk, 
  deleteSave as deleteSaveThunk 
} from '@/lib/redux/thunks/save-load-thunks';

// Create memoized selectors using the array pattern
const selectSaveLoadStatus = createSelector(
  [(state: RootState) => state.saveLoad],
  (saveLoad) => ({
    isSaving: saveLoad.isSaving,
    isLoading: saveLoad.isLoading,
    error: saveLoad.error,
    autoSaveEnabled: saveLoad.autoSaveEnabled,
    showSaveMenu: saveLoad.showSaveMenu,
    hasSave: saveLoad.hasSave,
    lastSaveTimestamp: saveLoad.lastSaveTimestamp
  })
);

const selectSaveLoadData = createSelector(
  [(state: RootState) => state.saveLoad],
  (saveLoad) => ({
    saves: saveLoad.saves,
    currentSaveId: saveLoad.currentSaveId
  })
);

/**
 * Interface defining the return value of the useSaveLoad hook
 */
interface UseSaveLoadReturn {
  // State
  isSaving: boolean;
  isLoading: boolean;
  error: string | null;
  autoSaveEnabled: boolean;
  showSaveMenu: boolean;
  hasSave: boolean;
  lastSaveTimestamp: number | null;
  saves: SaveSlot[];
  currentSaveId: string | null;
  
  // Actions
  setSaves: (saves: SaveSlot[]) => void;
  addSave: (save: SaveSlot) => void;
  removeSave: (saveId: string) => void;
  setIsSaving: (saving: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentSaveId: (saveId: string | null) => void;
  setError: (error: string | null) => void;
  setAutoSaveEnabled: (enabled: boolean) => void;
  setSaveMenuOpen: (open: boolean) => void;
  loadSaves: () => void;
  
  // Thunk actions
  saveGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  deleteSave: () => Promise<void>;
  
  // Utility
  getSaveById: (saveId: string) => SaveSlot | undefined;
  getLatestSave: () => SaveSlot | undefined;
  formatSaveDate: (timestamp: number) => string;
}

/**
 * Hook for managing save/load functionality
 * 
 * Provides methods to save and load game state, manage save slots,
 * and handle related UI state.
 * 
 * @returns Object containing save/load state and methods
 */
export function useSaveLoad(): UseSaveLoadReturn {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const { 
    isSaving, 
    isLoading, 
    error, 
    autoSaveEnabled, 
    showSaveMenu, 
    hasSave,
    lastSaveTimestamp
  } = useAppSelector(selectSaveLoadStatus);
  const { saves, currentSaveId } = useAppSelector(selectSaveLoadData);
  
  /**
   * Sets the list of save slots
   * 
   * @param saves - Array of save slots to set
   */
  const setSavesList = useCallback((saves: SaveSlot[]): void => {
    tryCatch(() => {
      dispatch(setSaves(saves));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Adds a save slot to the list
   * 
   * @param save - Save slot to add
   */
  const addSaveToList = useCallback((save: SaveSlot): void => {
    tryCatch(() => {
      dispatch(addSave(save));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Removes a save slot from the list
   * 
   * @param saveId - ID of the save to remove
   */
  const removeSaveFromList = useCallback((saveId: string): void => {
    tryCatch(() => {
      dispatch(removeSave(saveId));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Sets the saving state
   * 
   * @param saving - Whether a save operation is in progress
   */
  const setIsSaving = useCallback((saving: boolean): void => {
    tryCatch(() => {
      dispatch(setSavingState(saving));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Sets the loading state
   * 
   * @param loading - Whether a load operation is in progress
   */
  const setIsLoading = useCallback((loading: boolean): void => {
    tryCatch(() => {
      dispatch(setLoadingState(loading));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Sets the current save ID
   * 
   * @param saveId - ID of the save to set as current, or null
   */
  const setCurrentSave = useCallback((saveId: string | null): void => {
    tryCatch(() => {
      dispatch(setCurrentSaveId(saveId));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Sets the error message
   * 
   * @param error - Error message to set, or null to clear
   */
  const setSaveError = useCallback((error: string | null): void => {
    tryCatch(() => {
      dispatch(setError(error));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Enables or disables auto-save
   * 
   * @param enabled - Whether auto-save should be enabled
   */
  const setAutoSave = useCallback((enabled: boolean): void => {
    tryCatch(() => {
      dispatch(setAutoSaveEnabled(enabled));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Opens or closes the save menu
   * 
   * @param open - Whether the save menu should be open
   */
  const toggleSaveMenu = useCallback((open: boolean): void => {
    tryCatch(() => {
      dispatch(setSaveMenuOpen(open));
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Loads the list of saves from storage
   */
  const loadSavesList = useCallback((): void => {
    tryCatch(() => {
      dispatch(loadSaves());
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [dispatch]);
  
  /**
   * Saves the current game state
   * 
   * @returns Promise that resolves when the save is complete
   */
  const saveGame = useCallback(async (): Promise<void> => {
    try {
      const resultAction = await dispatch(saveGameThunk());
      // Check if it's a rejected action
      if (saveGameThunk.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      console.error(
        `[Rogue Resident] Error ${ErrorCode.SAVE_ERROR}:`, 
        error instanceof Error ? error.message : 'Unknown error',
        error
      );
    }
  }, [dispatch]);
  
  /**
   * Loads a saved game state
   * 
   * @returns Promise that resolves when the load is complete
   */
  const loadGame = useCallback(async (): Promise<void> => {
    try {
      const resultAction = await dispatch(loadGameThunk());
      // Check if it's a rejected action
      if (loadGameThunk.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      console.error(
        `[Rogue Resident] Error ${ErrorCode.LOAD_ERROR}:`, 
        error instanceof Error ? error.message : 'Unknown error',
        error
      );
    }
  }, [dispatch]);
  
  /**
   * Deletes the current save
   * 
   * @returns Promise that resolves when the delete is complete
   */
  const deleteSave = useCallback(async (): Promise<void> => {
    try {
      const resultAction = await dispatch(deleteSaveThunk());
      // Check if it's a rejected action
      if (deleteSaveThunk.rejected.match(resultAction)) {
        throw new Error(resultAction.error.message);
      }
    } catch (error) {
      console.error(
        `[Rogue Resident] Error ${ErrorCode.DELETE_SAVE_ERROR}:`, 
        error instanceof Error ? error.message : 'Unknown error',
        error
      );
    }
  }, [dispatch]);
  
  /**
   * Gets a save by its ID
   * 
   * @param saveId - ID of the save to get
   * @returns The save slot, or undefined if not found
   */
  const getSaveById = useCallback((saveId: string): SaveSlot | undefined => {
    return tryCatch(() => {
      return saves.find(save => save.id === saveId);
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [saves]);
  
  /**
   * Gets the most recent save
   * 
   * @returns The most recent save slot, or undefined if none exist
   */
  const getLatestSave = useCallback((): SaveSlot | undefined => {
    return tryCatch(() => {
      if (saves.length === 0) return undefined;
      
      return saves.reduce((latest, save) => {
        return save.timestamp > latest.timestamp ? save : latest;
      }, saves[0]);
    }, undefined, ErrorCode.SAVE_LOAD_ERROR);
  }, [saves]);
  
  /**
   * Formats a timestamp as a readable date string
   * 
   * @param timestamp - Timestamp to format
   * @returns Formatted date string
   */
  const formatSaveDate = useCallback((timestamp: number): string => {
    return tryCatch(() => {
      return new Date(timestamp).toLocaleString();
    }, 'Unknown date', ErrorCode.DATE_FORMAT_ERROR);
  }, []);
  
  return {
    // State
    isSaving,
    isLoading,
    error,
    autoSaveEnabled,
    showSaveMenu,
    hasSave,
    lastSaveTimestamp,
    saves,
    currentSaveId,
    
    // Actions
    setSaves: setSavesList,
    addSave: addSaveToList,
    removeSave: removeSaveFromList,
    setIsSaving,
    setIsLoading,
    setCurrentSaveId: setCurrentSave,
    setError: setSaveError,
    setAutoSaveEnabled: setAutoSave,
    setSaveMenuOpen: toggleSaveMenu,
    loadSaves: loadSavesList,
    
    // Thunk actions
    saveGame,
    loadGame,
    deleteSave,
    
    // Utility
    getSaveById,
    getLatestSave,
    formatSaveDate
  };
}