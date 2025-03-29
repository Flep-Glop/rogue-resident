import gameReducer, {
    selectCharacter,
    setPlayerName,
    startGame,
    endGame,
    restartGame,
    adjustLives,
    adjustInsight,
    adjustResearchPoints,
    setDifficulty,
    advanceFloor
  } from '../game-slice'
  import { CharacterType } from '@/lib/types/game-types'
  
  describe('Game Slice', () => {
    // Initial state tests
    describe('initial state', () => {
      it('should return the initial state', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: null,
          lives: 4,
          insight: 100,
          researchPoints: 0,
          isGameStarted: false,
          isGameOver: false,
          difficulty: 'normal',
          floor: 1,
          completedRuns: 0
        }
        
        // @ts-ignore - Passing undefined is valid for initial state
        expect(gameReducer(undefined, { type: 'unknown' })).toEqual(initialState)
      })
    })
    
    // Action tests
    describe('game actions', () => {
      it('should handle selectCharacter', () => {
        const character: CharacterType = 'resident'
        const state = gameReducer(undefined, selectCharacter(character))
        
        expect(state.selectedCharacter).toEqual(character)
        expect(state.lives).toEqual(4) // Resident default lives
        expect(state.insight).toEqual(100) // Resident default insight
      })
      
      it('should handle setPlayerName', () => {
        const playerName = 'Test Player'
        const state = gameReducer(undefined, setPlayerName(playerName))
        
        expect(state.playerName).toEqual(playerName)
      })
      
      it('should handle startGame', () => {
        const state = gameReducer(undefined, startGame())
        
        expect(state.isGameStarted).toBe(true)
        expect(state.isGameOver).toBe(false)
      })
      
      it('should handle endGame when completed successfully', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: 'resident' as CharacterType,
          lives: 4,
          insight: 100,
          researchPoints: 0,
          isGameStarted: true,
          isGameOver: false,
          difficulty: 'normal' as const,
          floor: 1,
          completedRuns: 0
        }
        
        const state = gameReducer(initialState, endGame(true))
        
        expect(state.isGameOver).toBe(true)
        expect(state.completedRuns).toBe(1)
      })
      
      it('should handle endGame when failed', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: 'resident' as CharacterType,
          lives: 4,
          insight: 100,
          researchPoints: 0,
          isGameStarted: true,
          isGameOver: false,
          difficulty: 'normal' as const,
          floor: 1,
          completedRuns: 0
        }
        
        const state = gameReducer(initialState, endGame(false))
        
        expect(state.isGameOver).toBe(true)
        expect(state.completedRuns).toBe(0) // No increment when failed
      })
      
      it('should handle restartGame', () => {
        const initialState = {
          playerName: 'Test Player',
          selectedCharacter: 'resident' as CharacterType,
          lives: 0, // Player died
          insight: 50,
          researchPoints: 10,
          isGameStarted: true,
          isGameOver: true,
          difficulty: 'normal' as const,
          floor: 2,
          completedRuns: 1
        }
        
        const state = gameReducer(initialState, restartGame())
        
        // Reset in-run state
        expect(state.lives).toBe(4) // Reset to default
        expect(state.insight).toBe(100) // Reset to default
        expect(state.isGameStarted).toBe(false)
        expect(state.isGameOver).toBe(false)
        
        // Keep meta-progression
        expect(state.playerName).toBe('Test Player')
        expect(state.selectedCharacter).toBe('resident')
        expect(state.researchPoints).toBe(10)
        expect(state.completedRuns).toBe(1)
      })
    })
    
    // Resource actions tests
    describe('resource actions', () => {
      it('should handle adjustLives', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: null,
          lives: 4,
          insight: 100,
          researchPoints: 0,
          isGameStarted: false,
          isGameOver: false,
          difficulty: 'normal' as const,
          floor: 1,
          completedRuns: 0
        }
        
        // Decrease lives
        let state = gameReducer(initialState, adjustLives(-1))
        expect(state.lives).toBe(3)
        
        // Increase lives
        state = gameReducer(state, adjustLives(2))
        expect(state.lives).toBe(5)
        
        // Lives reduced to 0 should trigger game over
        state = gameReducer(state, adjustLives(-5))
        expect(state.lives).toBe(0)
        expect(state.isGameOver).toBe(true)
      })
      
      it('should handle adjustInsight', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: null,
          lives: 4,
          insight: 100,
          researchPoints: 0,
          isGameStarted: false,
          isGameOver: false,
          difficulty: 'normal' as const,
          floor: 1,
          completedRuns: 0
        }
        
        // Decrease insight
        let state = gameReducer(initialState, adjustInsight(-50))
        expect(state.insight).toBe(50)
        
        // Increase insight
        state = gameReducer(state, adjustInsight(75))
        expect(state.insight).toBe(125)
        
        // Insight should not go below 0
        state = gameReducer(state, adjustInsight(-200))
        expect(state.insight).toBe(0)
      })
      
      it('should handle adjustResearchPoints', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: null,
          lives: 4,
          insight: 100,
          researchPoints: 50,
          isGameStarted: false,
          isGameOver: false,
          difficulty: 'normal' as const,
          floor: 1,
          completedRuns: 0
        }
        
        // Decrease research points
        let state = gameReducer(initialState, adjustResearchPoints(-20))
        expect(state.researchPoints).toBe(30)
        
        // Increase research points
        state = gameReducer(state, adjustResearchPoints(15))
        expect(state.researchPoints).toBe(45)
        
        // Research points should not go below 0
        state = gameReducer(state, adjustResearchPoints(-100))
        expect(state.researchPoints).toBe(0)
      })
    })
    
    // Game settings tests
    describe('game settings actions', () => {
      it('should handle setDifficulty', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: null,
          lives: 4,
          insight: 100,
          researchPoints: 0,
          isGameStarted: false,
          isGameOver: false,
          difficulty: 'normal' as const,
          floor: 1,
          completedRuns: 0
        }
        
        // Change difficulty to easy
        let state = gameReducer(initialState, setDifficulty('easy'))
        expect(state.difficulty).toBe('easy')
        
        // Change difficulty to hard
        state = gameReducer(state, setDifficulty('hard'))
        expect(state.difficulty).toBe('hard')
      })
      
      it('should handle advanceFloor', () => {
        const initialState = {
          playerName: '',
          selectedCharacter: null,
          lives: 4,
          insight: 100,
          researchPoints: 0,
          isGameStarted: false,
          isGameOver: false,
          difficulty: 'normal' as const,
          floor: 1,
          completedRuns: 0
        }
        
        // Advance to next floor
        const state = gameReducer(initialState, advanceFloor())
        expect(state.floor).toBe(2)
      })
    })
  })