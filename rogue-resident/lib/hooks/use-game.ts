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
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

// Memoized selectors for better performance
const selectGameState = createSelector(
  (state) => ({
    isGameStarted: state.game.isGameStarted,
    isGameOver: state.game.isGameOver,
    playerHealth: state.game.playerHealth,
    maxPlayerHealth: state.game.maxPlayerHealth,
    playerInsight: state.game.playerInsight,
    researchPoints: state.game.researchPoints,
    score: state.game.score,
    selectedCharacterId: state.game.selectedCharacterId,
    playerName: state.game.playerName,
    characters: state.game.characters,
    floor: state.game.floor,
    completedRuns: state.game.completedRuns,
    difficulty: state.game.difficulty
  }),
  (state) => state
);

/**
 * Hook for accessing and manipulating game state
 * 
 * @returns Game state and methods for updating it
 */
export function useGame() {
  const dispatch = useAppDispatch();
  
  // Get combined game state from selector
  const {
    isGameStarted,
    isGameOver,
    playerHealth: health,
    maxPlayerHealth: maxHealth,
    playerInsight: insight,
    researchPoints,
    score,
    selectedCharacterId,
    playerName,
    characters,
    floor,
    completedRuns,
    difficulty
  } = useAppSelector(selectGameState);
  
  // Get the current character based on selectedCharacterId
  const character = useCallback(() => {
    return tryCatch(() => {
      return selectedCharacterId
        ? characters.find(c => c.id === selectedCharacterId) || null
        : null;
    }, null, ErrorCode.GAME_STATE_ERROR);
  }, [selectedCharacterId, characters])();
  
  // Character-related actions
  const selectGameCharacter = useCallback((characterId: string) => {
    tryCatch(() => {
      dispatch(selectCharacter(characterId));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const setName = useCallback((name: string) => {
    tryCatch(() => {
      dispatch(setPlayerName(name));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  // Game flow actions
  const start = useCallback(() => {
    tryCatch(() => {
      dispatch(startGame());
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const end = useCallback((completed: boolean) => {
    tryCatch(() => {
      dispatch(endGame(completed));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const restart = useCallback(() => {
    tryCatch(() => {
      dispatch(resetGame());
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const setGameDifficulty = useCallback((difficultyLevel: Difficulty) => {
    tryCatch(() => {
      dispatch(setDifficulty(difficultyLevel));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  // Resource actions
  const damage = useCallback((amount: number) => {
    tryCatch(() => {
      dispatch(takeDamage(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const healPlayer = useCallback((amount: number) => {
    tryCatch(() => {
      dispatch(heal(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const gainInsight = useCallback((amount: number) => {
    tryCatch(() => {
      dispatch(addInsight(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const useInsight = useCallback((amount: number) => {
    tryCatch(() => {
      if (insight >= amount) {
        dispatch(spendInsight(amount));
        return true;
      }
      return false;
    }, false, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch, insight]);
  
  const gainResearchPoints = useCallback((amount: number) => {
    tryCatch(() => {
      dispatch(addResearchPoints(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const increaseHealth = useCallback((amount: number) => {
    tryCatch(() => {
      dispatch(increaseMaxHealth(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  const addToScore = useCallback((amount: number) => {
    tryCatch(() => {
      dispatch(addScore(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  // Floor progression
  const proceedToNextFloor = useCallback(() => {
    tryCatch(() => {
      dispatch(advanceFloor());
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  // Utility functions
  const isAlive = useCallback(() => health > 0, [health]);
  
  const canAfford = useCallback((cost: number) => insight >= cost, [insight]);
  
  const getCharacterById = useCallback((id: string): Character | undefined => {
    return tryCatch(() => {
      return characters.find(c => c.id === id);
    }, undefined, ErrorCode.GAME_STATE_ERROR);
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
    playerName,
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