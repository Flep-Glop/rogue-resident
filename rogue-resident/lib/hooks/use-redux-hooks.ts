'use client';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createSelector as createReduxSelector } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '../redux/store';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';
import type { 
  ChallengeGrade, 
  ChallengeStatus, 
  ChallengeType,
  ChallengeStage
} from '@/lib/types/challenge-types';
import type { 
  MapNode, 
  NodeType, 
  NodeStatus, 
  MapEdge 
} from '@/lib/types/map-types';
import type { 
  Item, 
  ItemType,
  ItemEffect
} from '@/lib/types/item-types';
import type {
  GameStatus,
  Difficulty,
  PlayerState,
  SaveSlot
} from '@/lib/types/game-types';

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

//==============================================================================
// GAME SELECTORS
//==============================================================================

/**
 * Select basic game state
 */
export const selectGameState = createSelector(
  [(state: RootState) => state.game],
  (game) => ({
    status: game.status,
    difficulty: game.difficulty,
    isGameStarted: game.isGameStarted,
    isGameOver: game.isGameOver,
    selectedCharacterId: game.selectedCharacterId
  })
);

/**
 * Select player state
 */
export const selectPlayerState = createSelector(
  [(state: RootState) => state.game.player],
  (player) => player
);

/**
 * Select player resources
 */
export const selectPlayerResources = createSelector(
  [
    (state: RootState) => state.game.player.health,
    (state: RootState) => state.game.player.maxHealth,
    (state: RootState) => state.game.insight
  ],
  (health, maxHealth, insight) => ({
    health,
    maxHealth,
    insight
  })
);

/**
 * Select game progression
 */
export const selectGameProgression = createSelector(
  [
    (state: RootState) => state.game.currentFloor,
    (state: RootState) => state.game.floorsCompleted,
    (state: RootState) => state.game.score,
    (state: RootState) => state.game.researchPoints
  ],
  (currentFloor, floorsCompleted, score, researchPoints) => ({
    currentFloor,
    floorsCompleted,
    score,
    researchPoints
  })
);

/**
 * Select all characters
 */
export const selectCharacters = createSelector(
  [(state: RootState) => state.game.characters],
  (characters) => characters
);

/**
 * Get the current game status
 * 
 * @returns The current game status
 */
export const useGameStatus = (): GameStatus => 
  useAppSelector((state) => tryCatch(
    () => state.game.status,
    'idle' as GameStatus,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the player's stats
 * 
 * @returns The player's stats object
 */
export const usePlayerStats = (): PlayerState => 
  useAppSelector((state) => tryCatch(
    () => state.game.player,
    {} as PlayerState,
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

/**
 * Get the current difficulty level
 * 
 * @returns The game difficulty
 */
export const useGameDifficulty = (): Difficulty => 
  useAppSelector((state) => tryCatch(
    () => state.game.difficulty,
    'normal' as Difficulty,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the current floor level
 * 
 * @returns The current floor number
 */
export const useCurrentFloor = (): number => 
  useAppSelector((state) => tryCatch(
    () => state.game.currentFloor,
    1,
    ErrorCode.SELECTOR_ERROR
  ));

//==============================================================================
// MAP SELECTORS
//==============================================================================

/**
 * Select map data
 */
export const selectMapData = createSelector(
  [(state: RootState) => state.map],
  (map) => ({
    nodes: map.nodes,
    edges: map.edges,
    currentNodeId: map.currentNodeId,
    startNodeId: map.startNodeId,
    bossNodeId: map.bossNodeId,
    isGenerated: map.isGenerated,
    floorLevel: map.floorLevel
  })
);

/**
 * Select current node
 */
export const selectCurrentNode = createSelector(
  [
    (state: RootState) => state.map.nodes,
    (state: RootState) => state.map.currentNodeId
  ],
  (nodes: MapNode[], currentNodeId: string | null): MapNode | null => 
    currentNodeId ? nodes.find((node: MapNode): boolean => node.id === currentNodeId) || null : null
);

/**
 * Select nodes by status
 */
export const selectNodesByStatus = createSelector(
  [
    (state: RootState) => state.map.nodes,
    (state: RootState, status: NodeStatus) => status
  ],
  (nodes: MapNode[], status: NodeStatus): MapNode[] => {
    return nodes.filter((node: MapNode): boolean => node.status === status);
  }
);

/**
 * Select accessible nodes
 */
export const selectAccessibleNodes = createSelector(
  [(state: RootState) => state.map.unlockedNodeIds, (state: RootState) => state.map.nodes],
  (unlockedNodeIds: string[], nodes: MapNode[]): MapNode[] => 
    nodes.filter((node: MapNode): boolean => unlockedNodeIds.includes(node.id))
);

/**
 * Get all map nodes
 * 
 * @returns Array of map nodes
 */
export const useMapNodes = (): MapNode[] => 
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
export const useMapEdges = (): MapEdge[] => 
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

/**
 * Get unlocked node IDs
 * 
 * @returns Array of unlocked node IDs
 */
export const useUnlockedNodeIds = (): string[] =>
  useAppSelector((state) => tryCatch(
    () => state.map.unlockedNodeIds,
    [],
    ErrorCode.SELECTOR_ERROR
  ));

//==============================================================================
// NODE SELECTORS
//==============================================================================

/**
 * Select node interaction state
 */
export const selectNodeInteractionState = createSelector(
  [(state: RootState) => state.node],
  (node) => ({
    selectedNodeId: node.selectedNodeId,
    currentNodeId: node.currentNodeId,
    nodeType: node.nodeType,
    nodeStatus: node.nodeStatus,
    interactionStage: node.interactionStage,
    isInteracting: node.isInteracting,
    isNodeActive: node.isNodeActive
  })
);

/**
 * Select current node data
 */
export const selectNodeData = createSelector(
  [(state: RootState) => state.node.nodeData],
  (nodeData) => nodeData
);

/**
 * Select node history
 */
export const selectNodeHistory = createSelector(
  [(state: RootState) => state.node.nodeHistory],
  (nodeHistory) => nodeHistory
);

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
export const useCurrentNodeType = (): NodeType | null => 
  useAppSelector((state) => tryCatch(
    () => state.node.nodeType,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Check if currently interacting with a node
 * 
 * @returns Whether the player is interacting with a node
 */
export const useIsInteractingWithNode = (): boolean =>
  useAppSelector((state) => tryCatch(
    () => state.node.isInteracting,
    false,
    ErrorCode.SELECTOR_ERROR
  ));

//==============================================================================
// CHALLENGE SELECTORS
//==============================================================================

/**
 * Select challenge state
 */
export const selectChallengeState = createSelector(
  [(state: RootState) => state.challenge],
  (challenge) => ({
    currentChallengeId: challenge.currentChallengeId,
    challengeType: challenge.challengeType,
    currentStage: challenge.currentStage,
    isCompleted: challenge.isCompleted,
    overallGrade: challenge.overallGrade,
    challengeStatus: challenge.challengeStatus
  })
);

/**
 * Select challenge details
 */
export const selectChallengeDetails = createSelector(
  [(state: RootState) => state.challenge],
  (challenge) => ({
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    stages: challenge.stages,
    insightReward: challenge.insightReward,
    itemReward: challenge.itemReward
  })
);

/**
 * Select challenge timer info
 */
export const selectChallengeTimer = createSelector(
  [(state: RootState) => state.challenge.timeRemaining],
  (timeRemaining) => timeRemaining
);

/**
 * Select user responses to challenge
 */
export const selectChallengeResponses = createSelector(
  [(state: RootState) => state.challenge.userResponses],
  (userResponses) => userResponses
);

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
export const useChallengeGrade = (): ChallengeGrade | null => 
  useAppSelector((state) => tryCatch(
    () => state.challenge.overallGrade,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the challenge status
 * 
 * @returns The current challenge status
 */
export const useChallengeStatus = (): ChallengeStatus => 
  useAppSelector((state) => tryCatch(
    () => state.challenge.challengeStatus,
    'inactive' as ChallengeStatus,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get the challenge type
 * 
 * @returns The type of the current challenge
 */
export const useChallengeType = (): ChallengeType | null =>
  useAppSelector((state) => tryCatch(
    () => state.challenge.challengeType,
    null,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get challenge time remaining
 * 
 * @returns Seconds remaining for challenge timer
 */
export const useChallengeTimeRemaining = (): number =>
  useAppSelector((state) => tryCatch(
    () => state.challenge.timeRemaining,
    0,
    ErrorCode.SELECTOR_ERROR
  ));

//==============================================================================
// INVENTORY SELECTORS
//==============================================================================

/**
 * Select inventory items
 */
export const selectInventoryItems = createSelector(
  [(state: RootState) => state.inventory.items],
  (items) => items
);

/**
 * Select active items
 */
export const selectActiveItems = createSelector(
  [
    (state: RootState) => state.inventory.items,
    (state: RootState) => state.inventory.activeItems
  ],
  (items: Item[], activeItemIds: string[]): Item[] => 
    items.filter((item: Item): boolean => activeItemIds.includes(item.id))
);

/**
 * Select inventory status
 */
export const selectInventoryStatus = createSelector(
  [(state: RootState) => state.inventory],
  (inventory) => ({
    selectedItemId: inventory.selectedItemId,
    capacity: inventory.capacity,
    isFull: inventory.items.length >= inventory.capacity
  })
);

/**
 * Select items by type
 */
export const selectItemsByType = createSelector(
  [
    (state: RootState) => state.inventory.items,
    (state: RootState, itemType: ItemType) => itemType
  ],
  (items: Item[], itemType: ItemType): Item[] => 
    items.filter((item: Item): boolean => item.type === itemType)
);

/**
 * Select active effects
 */
export const selectActiveEffects = createSelector(
  [(state: RootState) => state.inventory.activeEffects],
  (activeEffects) => activeEffects
);

/**
 * Get all inventory items
 * 
 * @returns Array of inventory items
 */
export const useInventoryItems = (): Item[] => 
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

/**
 * Get inventory capacity
 * 
 * @returns Maximum number of items the inventory can hold
 */
export const useInventoryCapacity = (): number =>
  useAppSelector((state) => tryCatch(
    () => state.inventory.capacity,
    0,
    ErrorCode.SELECTOR_ERROR
  ));

/**
 * Get active effects
 * 
 * @returns Array of active item effects
 */
export const useActiveEffects = (): ItemEffect[] =>
  useAppSelector((state) => tryCatch(
    () => state.inventory.activeEffects,
    [],
    ErrorCode.SELECTOR_ERROR
  ));

//==============================================================================
// SAVE/LOAD SELECTORS
//==============================================================================

/**
 * Select save/load state
 */
export const selectSaveLoadState = createSelector(
  [(state: RootState) => state.saveLoad],
  (saveLoad) => ({
    isSaving: saveLoad.isSaving,
    isLoading: saveLoad.isLoading,
    error: saveLoad.error,
    autoSaveEnabled: saveLoad.autoSaveEnabled,
    hasSave: saveLoad.hasSave,
    lastSaveTimestamp: saveLoad.lastSaveTimestamp,
    showSaveMenu: saveLoad.showSaveMenu
  })
);

/**
 * Select saves data
 */
export const selectSavesData = createSelector(
  [(state: RootState) => state.saveLoad],
  (saveLoad) => ({
    saves: saveLoad.saves,
    currentSaveId: saveLoad.currentSaveId
  })
);

/**
 * Select save by ID
 */
export const selectSaveById = createSelector(
  [
    (state: RootState) => state.saveLoad.saves,
    (state: RootState, saveId: string) => saveId
  ],
  (saves: SaveSlot[], saveId: string): SaveSlot | null => 
    saves.find((save: SaveSlot): boolean => save.id === saveId) || null
);

/**
 * Get all save slots
 * 
 * @returns Array of save slots
 */
export const useSaveSlots = (): SaveSlot[] => 
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

/**
 * Check if auto-save is enabled
 * 
 * @returns Whether auto-save is enabled
 */
export const useAutoSaveEnabled = (): boolean =>
  useAppSelector((state) => tryCatch(
    () => state.saveLoad.autoSaveEnabled,
    false,
    ErrorCode.SELECTOR_ERROR
  ));

//==============================================================================
// COMBINED STATE SELECTORS
//==============================================================================

/**
 * Select complete player state
 */
export const selectCompletePlayerState = createSelector(
  [
    (state: RootState) => state.game.player,
    (state: RootState) => state.game.insight,
    (state: RootState) => state.game.researchPoints,
    (state: RootState) => state.inventory.items
  ],
  (player, insight, researchPoints, items) => ({
    ...player,
    insight,
    researchPoints,
    items
  })
);

/**
 * Select current node with interactions
 */
export const selectCurrentNodeWithInteraction = createSelector(
  [
    (state: RootState) => state.map.nodes,
    (state: RootState) => state.map.currentNodeId,
    (state: RootState) => state.node.isInteracting,
    (state: RootState) => state.node.interactionStage
  ],
  (nodes: MapNode[], currentNodeId: string | null, isInteracting: boolean, interactionStage: ChallengeStage | null) => {
    const currentNode = currentNodeId 
      ? nodes.find((node: MapNode): boolean => node.id === currentNodeId) || null 
      : null;
      
    return {
      node: currentNode,
      isInteracting,
      interactionStage
    };
  }
);

/**
 * Select full game state for saving
 */
export const selectGameStateForSaving = createSelector(
  [
    (state: RootState) => state.game,
    (state: RootState) => state.map,
    (state: RootState) => state.inventory
  ],
  (game, map, inventory) => ({
    game: {
      player: game.player,
      difficulty: game.difficulty,
      insight: game.insight,
      researchPoints: game.researchPoints,
      currentFloor: game.currentFloor,
      floorsCompleted: game.floorsCompleted,
      score: game.score,
      selectedCharacterId: game.selectedCharacterId
    },
    map: {
      nodes: map.nodes,
      edges: map.edges,
      currentNodeId: map.currentNodeId,
      startNodeId: map.startNodeId,
      bossNodeId: map.bossNodeId,
      floorLevel: map.floorLevel,
      unlockedNodeIds: map.unlockedNodeIds
    },
    inventory: {
      items: inventory.items,
      activeItems: inventory.activeItems,
      activeEffects: inventory.activeEffects,
      capacity: inventory.capacity
    }
  })
);