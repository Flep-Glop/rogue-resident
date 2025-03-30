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
import type { Character, GameCharacter, Difficulty } from '@/lib/types/game-types';
import type { RootState } from '@/lib/types/redux-types';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

// Memoized selectors for better performance
const selectGameState = createSelector(
  [(state: RootState) => state.game],
  (game) => ({
    isGameStarted: game.isGameStarted,
    isGameOver: game.isGameOver,
    playerHealth: game.player.health,
    maxPlayerHealth: game.player.maxHealth,
    playerInsight: game.insight,
    researchPoints: game.researchPoints,
    score: game.score,
    selectedCharacterId: game.selectedCharacterId,
    playerName: game.player.name,
    characters: game.characters,
    floor: game.currentFloor,
    completedRuns: game.completedRuns,
    difficulty: game.difficulty
  })
);

// Helper function to convert GameCharacter to Character
const convertToCharacter = (gameChar: GameCharacter | undefined): Character | undefined => {
  if (!gameChar) return undefined;
  
  return {
    ...gameChar,
    startingHealth: 100, // Default values or retrieve from a constants file
    startingInsight: 50,
    specialAbilities: gameChar.abilities, // Might need more specific mapping
    portrait: `/characters/${gameChar.id}.png`, // Assumes a naming convention
    flavorText: `${gameChar.name} is ready for adventure!` // Default flavor text
  };
};

/**
 * Interface defining the return value of the useGame hook
 */
interface UseGameReturn {
  // State
  isGameStarted: boolean;
  isGameOver: boolean;
  health: number;
  maxHealth: number;
  insight: number;
  researchPoints: number;
  score: number;
  character: Character | null;
  characters: Character[];
  playerName: string;
  floor: number;
  completedRuns: number;
  difficulty: Difficulty;
  
  // Actions
  selectCharacter: (characterId: string) => void;
  setPlayerName: (name: string) => void;
  startGame: () => void;
  endGame: (completed: boolean) => void;
  restartGame: () => void;
  setDifficulty: (difficultyLevel: Difficulty) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  addInsight: (amount: number) => void;
  spendInsight: (amount: number) => boolean;
  addResearchPoints: (amount: number) => void;
  increaseMaxHealth: (amount: number) => void;
  addScore: (amount: number) => void;
  advanceFloor: () => void;
  
  // Utility
  isAlive: () => boolean;
  canAfford: (cost: number) => boolean;
  getCharacterById: (id: string) => Character | undefined;
}

/**
 * Hook for accessing and manipulating game state
 * 
 * Provides access to player stats, game progress, and actions to modify the game state.
 * 
 * @returns Object containing game state and actions
 */
export function useGame(): UseGameReturn {
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
    characters: gameCharacters,
    floor,
    completedRuns,
    difficulty
  } = useAppSelector(selectGameState);
  
  // Convert GameCharacters to Characters with required fields
  const characters = gameCharacters.map(gc => convertToCharacter(gc) as Character);
  
  /**
   * Gets the current character based on selectedCharacterId
   * 
   * @returns The selected character or null if none selected
   */
  const character = useCallback((): Character | null => {
    return tryCatch(() => {
      if (!selectedCharacterId) return null;
      const gameChar = gameCharacters.find(c => c.id === selectedCharacterId);
      return gameChar ? convertToCharacter(gameChar) as Character : null;
    }, null, ErrorCode.GAME_STATE_ERROR);
  }, [selectedCharacterId, gameCharacters])();
  
  /**
   * Selects a character for the game
   * 
   * @param characterId - The ID of the character to select
   */
  const selectGameCharacter = useCallback((characterId: string): void => {
    tryCatch(() => {
      dispatch(selectCharacter(characterId));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Sets the player's name
   * 
   * @param name - The name to set for the player
   */
  const setName = useCallback((name: string): void => {
    tryCatch(() => {
      dispatch(setPlayerName(name));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Starts a new game
   */
  const start = useCallback((): void => {
    tryCatch(() => {
      dispatch(startGame());
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Ends the current game
   * 
   * @param completed - Whether the game was completed successfully
   */
  const end = useCallback((completed: boolean): void => {
    tryCatch(() => {
      dispatch(endGame(completed));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Restarts the game
   */
  const restart = useCallback((): void => {
    tryCatch(() => {
      dispatch(resetGame());
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Sets the game difficulty
   * 
   * @param difficultyLevel - The difficulty level to set
   */
  const setGameDifficulty = useCallback((difficultyLevel: Difficulty): void => {
    tryCatch(() => {
      dispatch(setDifficulty(difficultyLevel));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Applies damage to the player
   * 
   * @param amount - The amount of damage to apply
   */
  const damage = useCallback((amount: number): void => {
    tryCatch(() => {
      dispatch(takeDamage(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Heals the player
   * 
   * @param amount - The amount of health to restore
   */
  const healPlayer = useCallback((amount: number): void => {
    tryCatch(() => {
      dispatch(heal(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Adds insight (in-game currency) to the player
   * 
   * @param amount - The amount of insight to add
   */
  const gainInsight = useCallback((amount: number): void => {
    tryCatch(() => {
      dispatch(addInsight(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Spends insight if the player has enough
   * 
   * @param amount - The amount of insight to spend
   * @returns Whether the transaction was successful
   */
  const useInsight = useCallback((amount: number): boolean => {
    return tryCatch(() => {
      if (insight >= amount) {
        dispatch(spendInsight(amount));
        return true;
      }
      return false;
    }, false, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch, insight]);
  
  /**
   * Adds research points (meta-currency) to the player
   * 
   * @param amount - The amount of research points to add
   */
  const gainResearchPoints = useCallback((amount: number): void => {
    tryCatch(() => {
      dispatch(addResearchPoints(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Increases the player's maximum health
   * 
   * @param amount - The amount to increase max health by
   */
  const increaseHealth = useCallback((amount: number): void => {
    tryCatch(() => {
      dispatch(increaseMaxHealth(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Adds to the player's score
   * 
   * @param amount - The amount to add to the score
   */
  const addToScore = useCallback((amount: number): void => {
    tryCatch(() => {
      dispatch(addScore(amount));
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Advances to the next floor
   */
  const proceedToNextFloor = useCallback((): void => {
    tryCatch(() => {
      dispatch(advanceFloor());
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [dispatch]);
  
  /**
   * Checks if the player is alive
   * 
   * @returns Whether the player's health is greater than 0
   */
  const isAlive = useCallback((): boolean => health > 0, [health]);
  
  /**
   * Checks if the player can afford a cost
   * 
   * @param cost - The cost to check
   * @returns Whether the player has enough insight
   */
  const canAfford = useCallback((cost: number): boolean => insight >= cost, [insight]);
  
  /**
   * Gets a character by ID
   * 
   * @param id - The character ID to find
   * @returns The character with the given ID, or undefined if not found
   */
  const getCharacterById = useCallback((id: string): Character | undefined => {
    return tryCatch(() => {
      const gameChar = gameCharacters.find(c => c.id === id);
      return gameChar ? convertToCharacter(gameChar) : undefined;
    }, undefined, ErrorCode.GAME_STATE_ERROR);
  }, [gameCharacters]);
  
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