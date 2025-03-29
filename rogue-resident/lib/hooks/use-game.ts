'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, createSelector } from '@/lib/redux/hooks';
import {
  selectCharacter,
  setPlayerName,
  startGame,
  endGame,
  resetGame,
  takeDamage,
  heal,
  addInsight,
  spendInsight,
  addResearchPoints,
  setDifficulty,
  advanceFloor,
  addScore,
  increaseMaxHealth
} from '@/lib/redux/slices/game-slice';
import type { Character, CharacterType, Difficulty } from '@/lib/types/game-types';

// Create memoized selectors
const selectGameStatus = createSelector(state => state.game.isGameStarted);
const selectGameOver = createSelector(state => state.game.isGameOver);
const selectPlayerData = createSelector(state => ({
  health: state.game.playerHealth,
  maxHealth: state.game.maxPlayerHealth,
  insight: state.game.playerInsight,
  researchPoints: state.game.researchPoints,
  score: state.game.score
}));
const selectCurrentCharacter = createSelector(state => {
  const { selectedCharacterId, characters } = state.game;
  return selectedCharacterId 
    ? characters.find(c => c.id === selectedCharacterId) || null
    : null;
});
const selectCharactersList = createSelector(state => state.game.characters);
const selectGameProgress = createSelector(state => ({
  floor: state.game.floor,
  completedRuns: state.game.completedRuns,
  difficulty: state.game.difficulty
}));

/**
 * Hook for accessing and manipulating game state
 */
export function useGame() {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const isGameStarted = useAppSelector(selectGameStatus);
  const isGameOver = useAppSelector(selectGameOver);
  const { health, maxHealth, insight, researchPoints, score } = useAppSelector(selectPlayerData);
  const character = useAppSelector(selectCurrentCharacter);
  const characters = useAppSelector(selectCharactersList);
  const { floor, completedRuns, difficulty } = useAppSelector(selectGameProgress);
  
  // Character-related actions
  const selectGameCharacter = useCallback((characterId: string) => {
    dispatch(selectCharacter(characterId));
  }, [dispatch]);
  
  const setName = useCallback((name: string) => {
    dispatch(setPlayerName(name));
  }, [dispatch]);
  
  // Game flow actions
  const start = useCallback(() => {
    dispatch(startGame());
  }, [dispatch]);
  
  const end = useCallback((completed: boolean) => {
    dispatch(endGame(completed));
  }, [dispatch]);
  
  const restart = useCallback(() => {
    dispatch(resetGame());
  }, [dispatch]);
  
  const setGameDifficulty = useCallback((difficulty: Difficulty) => {
    dispatch(setDifficulty(difficulty));
  }, [dispatch]);
  
  // Resource actions
  const damage = useCallback((amount: number) => {
    dispatch(takeDamage(amount));
  }, [dispatch]);
  
  const healPlayer = useCallback((amount: number) => {
    dispatch(heal(amount));
  }, [dispatch]);
  
  const gainInsight = useCallback((amount: number) => {
    dispatch(addInsight(amount));
  }, [dispatch]);
  
  const useInsight = useCallback((amount: number) => {
    dispatch(spendInsight(amount));
  }, [dispatch]);
  
  const gainResearchPoints = useCallback((amount: number) => {
    dispatch(addResearchPoints(amount));
  }, [dispatch]);
  
  const increaseHealth = useCallback((amount: number) => {
    dispatch(increaseMaxHealth(amount));
  }, [dispatch]);
  
  const addToScore = useCallback((amount: number) => {
    dispatch(addScore(amount));
  }, [dispatch]);
  
  // Floor progression
  const proceedToNextFloor = useCallback(() => {
    dispatch(advanceFloor());
  }, [dispatch]);
  
  // Utility functions
  const isAlive = useCallback(() => health > 0, [health]);
  
  const canAfford = useCallback((cost: number) => insight >= cost, [insight]);
  
  const getCharacterById = useCallback((id: string): Character | undefined => {
    return characters.find(c => c.id === id);
  }, [characters]);
  
  return {
    // State
    isGameStarted,
    isGameOver,
    health,
    maxHealth,
    insight,
    researchPoints,
    score,
    character,
    characters,
    floor,
    completedRuns,
    difficulty,
    
    // Actions
    selectCharacter: selectGameCharacter,
    setPlayerName: setName,
    startGame: start,
    endGame: end,
    restartGame: restart,
    setDifficulty: setGameDifficulty,
    takeDamage: damage,
    heal: healPlayer,
    addInsight: gainInsight,
    spendInsight: useInsight,
    addResearchPoints: gainResearchPoints,
    increaseMaxHealth: increaseHealth,
    addScore: addToScore,
    advanceFloor: proceedToNextFloor,
    
    // Utility
    isAlive,
    canAfford,
    getCharacterById
  };
}