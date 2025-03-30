'use client';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createSelector as createReduxSelector } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../redux/store';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

/**
 * Typed dispatch hook for use with Redux
 * 
 * @returns Redux dispatch function with proper TypeScript typing
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Typed selector hook for use with Redux
 * 
 * @template TSelected - The type of the selected state
 * @param selector - The selector function
 * @returns The selected state
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Re-export createSelector for consistent usage
 */
export const createSelector = createReduxSelector;

// Game selectors
/**
 * Get the current game status
 * 
 * @returns The current game status
 */
export const useGameStatus = (): string => 
  useAppSelector((state) => tryCatch(
    () => state.game.status,
    'idle',
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the player's stats
 * 
 * @returns The player's stats object
 */
export const usePlayerStats = () => 
  useAppSelector((state) => tryCatch(
    () => state.game.player,
    { health: 0, maxHealth: 0, insight: 0 },
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the player's current insight (currency)
 * 
 * @returns The player's insight amount
 */
export const useGameInsight = (): number => 
  useAppSelector((state) => tryCatch(
    () => state.game.insight,
    0,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the player's current health
 * 
 * @returns The player's remaining health
 */
export const usePlayerHealth = (): number => 
  useAppSelector((state) => tryCatch(
    () => state.game.player.health,
    0,
    ErrorCode.SELECTOR_ERROR
  ));

// Map selectors
/**
 * Get all map nodes
 * 
 * @returns Array of map nodes
 */
export const useMapNodes = () => 
  useAppSelector((state) => tryCatch(
    () => state.map.nodes,
    [],
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get all map edges
 * 
 * @returns Array of map edges
 */
export const useMapEdges = () => 
  useAppSelector((state) => tryCatch(
    () => state.map.edges,
    [],
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the current node ID
 * 
 * @returns The ID of the current node, or null if none
 */
export const useCurrentNodeId = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.map.currentNodeId,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Check if the map has been generated
 * 
 * @returns Whether the map is generated
 */
export const useMapGenerated = (): boolean => 
  useAppSelector((state) => tryCatch(
    () => state.map.isGenerated,
    false,
    ErrorCode.SELECTOR_ERROR
  ));

// Node selectors
/**
 * Get the selected node ID
 * 
 * @returns The ID of the selected node, or null if none
 */
export const useSelectedNode = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.node.selectedNodeId,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the current node interaction state
 * 
 * @returns The node interaction stage
 */
export const useNodeInteractionStage = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.node.interactionStage,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the current node type
 * 
 * @returns The type of the current node, or null if none
 */
export const useCurrentNodeType = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.node.nodeType,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

// Challenge selectors
/**
 * Get the current challenge ID
 * 
 * @returns The current challenge ID or null
 */
export const useCurrentChallengeId = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.challenge.currentChallengeId,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the challenge grade
 * 
 * @returns The grade for the current challenge
 */
export const useChallengeGrade = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.challenge.overallGrade,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the challenge state
 * 
 * @returns The current challenge state
 */
export const useChallengeState = (): string => 
  useAppSelector((state) => tryCatch(
    () => state.challenge.challengeState,
    'inactive',
    ErrorCode.SELECTOR_ERROR
  ));

// Inventory selectors
/**
 * Get all inventory items
 * 
 * @returns Array of inventory items
 */
export const useInventoryItems = () => 
  useAppSelector((state) => tryCatch(
    () => state.inventory.items,
    [],
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get active item IDs
 * 
 * @returns Array of active item IDs
 */
export const useActiveItems = (): string[] => 
  useAppSelector((state) => tryCatch(
    () => state.inventory.activeItems,
    [],
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the selected item ID
 * 
 * @returns The ID of the selected item, or null if none
 */
export const useSelectedItem = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.inventory.selectedItemId,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

// Save/Load selectors
/**
 * Get all save slots
 * 
 * @returns Array of save slots
 */
export const useSaveSlots = () => 
  useAppSelector((state) => tryCatch(
    () => state.saveLoad.saves,
    [],
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the current save ID
 * 
 * @returns The current save ID
 */
export const useCurrentSaveId = (): string | null => 
  useAppSelector((state) => tryCatch(
    () => state.saveLoad.currentSaveId,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the save/load status
 * 
 * @returns Object containing save/load status information
 */
export const useSaveLoadStatus = () => 
  useAppSelector((state) => tryCatch(
    () => ({
      isSaving: state.saveLoad.isSaving,
      isLoading: state.saveLoad.isLoading,
      error: state.saveLoad.error,
    }),
    {
      isSaving: false,
      isLoading: false,
      error: null,
    },
    ErrorCode.SELECTOR_ERROR
  ));