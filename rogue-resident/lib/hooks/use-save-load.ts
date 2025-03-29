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
  loadSaves,
  saveGameThunk,
  loadGameThunk,
  deleteSaveThunk
} from '@/lib/redux/slices/save-load-slice';
import type { SaveSlot } from '@/lib/types/game-types';

// Create memoized selectors
const selectSaveLoadStatus = createSelector(state => ({
  isSaving: state.saveLoad.isSaving,
  isLoading: state.saveLoad.isLoading,
  error: state.saveLoad.error,
  autoSaveEnabled: state.saveLoad.autoSaveEnabled,
  showSaveMenu: state.saveLoad.showSaveMenu,
  hasSave: state.saveLoad.hasSave,
  lastSaveTimestamp: state.saveLoad.lastSaveTimestamp
}));
const selectSaveLoadData = createSelector(state => ({
  saves: state.saveLoad.saves,
  currentSaveId: state.saveLoad.currentSaveId
}));

/**
 * Hook for managing save/load functionality
 */
export function useSaveLoad() {
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
  
  // Save/load actions
  const setSavesList = useCallback((saves: SaveSlot[]) => {
    dispatch(setSaves(saves));
  }, [dispatch]);
  
  const addSaveToList = useCallback((save: SaveSlot) => {
    dispatch(addSave(save));
  }, [dispatch]);
  
  const removeSaveFromList = useCallback((saveId: string) => {
    dispatch(removeSave(saveId));
  }, [dispatch]);
  
  const setIsSaving = useCallback((saving: boolean) => {
    dispatch(setSavingState(saving));
  }, [dispatch]);
  
  const setIsLoading = useCallback((loading: boolean) => {
    dispatch(setLoadingState(loading));
  }, [dispatch]);
  
  const setCurrentSave = useCallback((saveId: string | null) => {
    dispatch(setCurrentSaveId(saveId));
  }, [dispatch]);
  
  const setSaveError = useCallback((error: string | null) => {
    dispatch(setError(error));
  }, [dispatch]);
  
  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch(setAutoSaveEnabled(enabled));
  }, [dispatch]);
  
  const toggleSaveMenu = useCallback((open: boolean) => {
    dispatch(setSaveMenuOpen(open));
  }, [dispatch]);
  
  const loadSavesList = useCallback(() => {
    dispatch(loadSaves());
  }, [dispatch]);
  
  // Thunk actions
  const saveGame = useCallback(() => {
    return dispatch(saveGameThunk());
  }, [dispatch]);
  
  const loadGame = useCallback(() => {
    return dispatch(loadGameThunk());
  }, [dispatch]);
  
  const deleteSave = useCallback(() => {
    return dispatch(deleteSaveThunk());
  }, [dispatch]);
  
  // Utility functions
  const getSaveById = useCallback((saveId: string): SaveSlot | undefined => {
    return saves.find(save => save.id === saveId);
  }, [saves]);
  
  const getLatestSave = useCallback((): SaveSlot | undefined => {
    if (saves.length === 0) return undefined;
    
    return saves.reduce((latest, save) => {
      return save.timestamp > latest.timestamp ? save : latest;
    }, saves[0]);
  }, [saves]);
  
  const formatSaveDate = useCallback((timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
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