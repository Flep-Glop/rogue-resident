import gameReducer, {
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
  advanceFloor
} from '../game-slice';
import { CharacterType } from '@/lib/types/game-types';

describe('Game Slice', () => {
  // Initial state tests
  describe('initial state', () => {
    it('should return the initial state', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal',
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: expect.any(Array)
      };
      
      // @ts-ignore - Passing undefined is valid for initial state
      expect(gameReducer(undefined, { type: 'unknown' })).toMatchObject(initialState);
    });
  });
  
  // Action tests
  describe('game actions', () => {
    it('should handle selectCharacter', () => {
      const characterId = 'resident';
      const state = gameReducer(undefined, selectCharacter(characterId));
      
      expect(state.selectedCharacterId).toEqual(characterId);
      expect(state.playerHealth).toEqual(4); // Resident default health
      expect(state.playerInsight).toEqual(100); // Resident default insight
    });
    
    it('should handle setPlayerName', () => {
      const playerName = 'Test Player';
      const state = gameReducer(undefined, setPlayerName(playerName));
      
      expect(state.playerName).toEqual(playerName);
    });
    
    it('should handle startGame', () => {
      const state = gameReducer(undefined, startGame());
      
      expect(state.isGameStarted).toBe(true);
      expect(state.isGameOver).toBe(false);
    });
    
    it('should handle endGame when completed successfully', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: true,
        isGameOver: false,
        isCharacterSelected: true,
        selectedCharacterId: 'resident',
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      const state = gameReducer(initialState, endGame(true));
      
      expect(state.isGameOver).toBe(true);
      expect(state.completedRuns).toBe(1);
    });
    
    it('should handle endGame when failed', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: true,
        isGameOver: false,
        isCharacterSelected: true,
        selectedCharacterId: 'resident',
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      const state = gameReducer(initialState, endGame(false));
      
      expect(state.isGameOver).toBe(true);
      expect(state.completedRuns).toBe(0); // No increment when failed
    });
    
    it('should handle resetGame', () => {
      const initialState = {
        playerHealth: 0, // Player died
        maxPlayerHealth: 4,
        playerInsight: 50,
        researchPoints: 10,
        score: 500,
        playerName: 'Test Player',
        isGameStarted: true,
        isGameOver: true,
        isCharacterSelected: true,
        selectedCharacterId: 'resident',
        difficulty: 'normal' as const,
        floor: 2,
        turn: 10,
        completedRuns: 1,
        characters: []
      };
      
      const state = gameReducer(initialState, resetGame());
      
      // Reset in-run state
      expect(state.playerHealth).toBe(4); // Reset to default
      expect(state.playerInsight).toBe(100); // Reset to default
      expect(state.isGameStarted).toBe(false);
      expect(state.isGameOver).toBe(false);
      
      // Keep meta-progression
      expect(state.playerName).toBe('Test Player');
      expect(state.selectedCharacterId).toBe('resident');
      expect(state.researchPoints).toBe(10);
      expect(state.completedRuns).toBe(1);
    });
  });
  
  // Resource actions tests
  describe('resource actions', () => {
    it('should handle takeDamage', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      // Decrease health
      let state = gameReducer(initialState, takeDamage(1));
      expect(state.playerHealth).toBe(3);
      
      // Health reduced to 0 should trigger game over
      state = gameReducer(state, takeDamage(3));
      expect(state.playerHealth).toBe(0);
      expect(state.isGameOver).toBe(true);
    });
    
    it('should handle heal', () => {
      const initialState = {
        playerHealth: 2,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      // Heal within max health
      let state = gameReducer(initialState, heal(1));
      expect(state.playerHealth).toBe(3);
      
      // Heal above max health should cap at max
      state = gameReducer(state, heal(2));
      expect(state.playerHealth).toBe(4);
    });
    
    it('should handle addInsight', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      // Add insight
      const state = gameReducer(initialState, addInsight(50));
      expect(state.playerInsight).toBe(150);
    });
    
    it('should handle spendInsight', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      // Spend insight
      let state = gameReducer(initialState, spendInsight(30));
      expect(state.playerInsight).toBe(70);
      
      // Cannot spend more than available
      state = gameReducer(state, spendInsight(100));
      expect(state.playerInsight).toBe(0);
    });
    
    it('should handle addResearchPoints', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 50,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      // Add research points
      const state = gameReducer(initialState, addResearchPoints(25));
      expect(state.researchPoints).toBe(75);
    });
  });
  
  // Game settings tests
  describe('game settings actions', () => {
    it('should handle setDifficulty', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      // Change difficulty to easy
      let state = gameReducer(initialState, setDifficulty('easy'));
      expect(state.difficulty).toBe('easy');
      
      // Change difficulty to hard
      state = gameReducer(state, setDifficulty('hard'));
      expect(state.difficulty).toBe('hard');
    });
    
    it('should handle advanceFloor', () => {
      const initialState = {
        playerHealth: 4,
        maxPlayerHealth: 4,
        playerInsight: 100,
        researchPoints: 0,
        score: 0,
        playerName: '',
        isGameStarted: false,
        isGameOver: false,
        isCharacterSelected: false,
        selectedCharacterId: null,
        difficulty: 'normal' as const,
        floor: 1,
        turn: 0,
        completedRuns: 0,
        characters: []
      };
      
      // Advance to next floor
      const state = gameReducer(initialState, advanceFloor());
      expect(state.floor).toBe(2);
    });
  });
});