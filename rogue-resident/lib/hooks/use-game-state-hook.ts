'use client'

import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { 
  selectCharacter, 
  setPlayerName, 
  startGame, 
  endGame, 
  restartGame,
  adjustLives,
  adjustInsight,
  adjustResearchPoints
} from '@/lib/redux/slices/game-slice'
import { CharacterType } from '@/lib/types/game-types'

interface UseGameStateReturn {
  // Game state
  playerName: string
  selectedCharacter: CharacterType | null
  lives: number
  insight: number
  researchPoints: number
  isGameStarted: boolean
  isGameOver: boolean
  difficulty: 'easy' | 'normal' | 'hard'
  floor: number
  completedRuns: number
  
  // Game state methods
  selectCharacter: (character: CharacterType) => void
  setPlayerName: (name: string) => void
  startGame: () => void
  endGame: (completed: boolean) => void
  restartGame: () => void
  
  // Resource methods
  adjustLives: (amount: number) => void
  adjustInsight: (amount: number) => void
  adjustResearchPoints: (amount: number) => void
  
  // Helper methods
  isAlive: () => boolean
  canAfford: (cost: number) => boolean
}

/**
 * Custom hook for managing game state
 */
export function useGameState(): UseGameStateReturn {
  const dispatch = useAppDispatch()
  const gameState = useAppSelector(state => state.game)
  
  // Character selection
  const selectCharacterHandler = useCallback((character: CharacterType) => {
    dispatch(selectCharacter(character))
  }, [dispatch])
  
  // Set player name
  const setPlayerNameHandler = useCallback((name: string) => {
    dispatch(setPlayerName(name))
  }, [dispatch])
  
  // Start the game
  const startGameHandler = useCallback(() => {
    dispatch(startGame())
  }, [dispatch])
  
  // End the game
  const endGameHandler = useCallback((completed: boolean) => {
    dispatch(endGame(completed))
  }, [dispatch])
  
  // Restart the game
  const restartGameHandler = useCallback(() => {
    dispatch(restartGame())
  }, [dispatch])
  
  // Adjust lives
  const adjustLivesHandler = useCallback((amount: number) => {
    dispatch(adjustLives(amount))
  }, [dispatch])
  
  // Adjust insight
  const adjustInsightHandler = useCallback((amount: number) => {
    dispatch(adjustInsight(amount))
  }, [dispatch])
  
  // Adjust research points
  const adjustResearchPointsHandler = useCallback((amount: number) => {
    dispatch(adjustResearchPoints(amount))
  }, [dispatch])
  
  // Check if player is alive
  const isAlive = useCallback(() => {
    return gameState.lives > 0
  }, [gameState.lives])
  
  // Check if player can afford a cost
  const canAfford = useCallback((cost: number) => {
    return gameState.insight >= cost
  }, [gameState.insight])
  
  return {
    // Game state
    playerName: gameState.playerName,
    selectedCharacter: gameState.selectedCharacter,
    lives: gameState.lives,
    insight: gameState.insight,
    researchPoints: gameState.researchPoints,
    isGameStarted: gameState.isGameStarted,
    isGameOver: gameState.isGameOver,
    difficulty: gameState.difficulty,
    floor: gameState.floor,
    completedRuns: gameState.completedRuns,
    
    // Game state methods
    selectCharacter: selectCharacterHandler,
    setPlayerName: setPlayerNameHandler,
    startGame: startGameHandler,
    endGame: endGameHandler,
    restartGame: restartGameHandler,
    
    // Resource methods
    adjustLives: adjustLivesHandler,
    adjustInsight: adjustInsightHandler,
    adjustResearchPoints: adjustResearchPointsHandler,
    
    // Helper methods
    isAlive,
    canAfford
  }
}
