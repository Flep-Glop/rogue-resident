// lib/hooks/use-redux-hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';

// Use these typed hooks throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Game selectors
export const useGameStatus = () => useAppSelector((state) => state.game.status);
export const usePlayerStats = () => useAppSelector((state) => state.game.player);
export const useGameInsight = () => useAppSelector((state) => state.game.insight);
export const usePlayerLives = () => useAppSelector((state) => state.game.player.lives);

// Map selectors
export const useMapNodes = () => useAppSelector((state) => state.map.nodes);
export const useMapEdges = () => useAppSelector((state) => state.map.edges);
export const useCurrentNodeId = () => useAppSelector((state) => state.map.currentNodeId);
export const useMapGenerated = () => useAppSelector((state) => state.map.isGenerated);

// Node selectors
export const useSelectedNode = () => useAppSelector((state) => state.node.selectedNodeId);
export const useNodeInteraction = () => useAppSelector((state) => state.node.nodeInteraction);
export const useCurrentNodeType = () => useAppSelector((state) => state.node.currentNodeType);

// Challenge selectors
export const useCurrentChallenge = () => useAppSelector((state) => state.challenge.currentChallenge);
export const useChallengeGrade = () => useAppSelector((state) => state.challenge.grade);
export const useChallengeFeedback = () => useAppSelector((state) => state.challenge.feedback);

// Inventory selectors
export const useInventoryItems = () => useAppSelector((state) => state.inventory.items);
export const useActiveItems = () => useAppSelector((state) => state.inventory.activeItems);
export const useSelectedItem = () => useAppSelector((state) => state.inventory.selectedItemId);

// Save/Load selectors
export const useSaveSlots = () => useAppSelector((state) => state.saveLoad.saveSlots);
export const useCurrentSaveSlot = () => useAppSelector((state) => state.saveLoad.currentSlot);
export const useSaveLoadStatus = () => useAppSelector((state) => ({
  isSaving: state.saveLoad.isSaving,
  isLoading: state.saveLoad.isLoading,
  error: state.saveLoad.error,
}));