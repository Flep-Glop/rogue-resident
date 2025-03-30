import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Character, CharacterType, Difficulty } from '@/lib/types/game-types';

export interface GameState {
  // Player state
  playerHealth: number;
  maxPlayerHealth: number;
  playerInsight: number; // Currency for purchases
  researchPoints: number; // Meta-progression currency
  score: number;
  
  // Game session state
  playerName: string;
  isGameStarted: boolean;
  isGameOver: boolean;
  isCharacterSelected: boolean;
  selectedCharacterId: string | null;
  difficulty: Difficulty;
  floor: number;
  turn: number;
  completedRuns: number;
  
  // Available characters
  characters: Character[];
}

const defaultCharacters: Character[] = [
  {
    id: 'resident',
    name: 'The Resident',
    description: 'First-year medical physics resident eager to learn and adaptable to different approaches.',
    startingHealth: 4,
    startingInsight: 100,
    specialAbilities: [
      {
        id: 'peer_review',
        name: 'Peer Review',
        description: 'Once per floor, see the correct answer to any challenge.',
        cooldown: 1,
        currentCooldown: 0,
        isAvailable: true,
        effect: {
          type: 'revealAnswer',
          value: true
        }
      },
      {
        id: 'quick_study',
        name: 'Quick Study',
        description: '+25% insight from first completion of each scenario type.',
        cooldown: 0,
        currentCooldown: 0,
        isAvailable: true,
        effect: {
          type: 'insightBonus',
          value: 25
        }
      }
    ],
    portrait: '/characters/resident.png'
  }
  // Other characters can be added here in the future
];

const initialState: GameState = {
  // Player state
  playerHealth: 4,
  maxPlayerHealth: 4,
  playerInsight: 100,
  researchPoints: 0,
  score: 0,
  
  // Game session state
  playerName: '',
  isGameStarted: false,
  isGameOver: false,
  isCharacterSelected: false,
  selectedCharacterId: null,
  difficulty: 'normal',
  floor: 1,
  turn: 0,
  completedRuns: 0,
  
  // Available characters
  characters: defaultCharacters
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state) => {
      state.isGameStarted = true;
      state.isGameOver = false;
      state.turn = 0;
      state.score = 0;
    },
    
    resetGame: (state) => {
      const selectedCharacter = state.selectedCharacterId 
        ? state.characters.find(c => c.id === state.selectedCharacterId)
        : null;
      
      return {
        ...initialState,
        isCharacterSelected: !!state.selectedCharacterId,
        selectedCharacterId: state.selectedCharacterId,
        playerHealth: selectedCharacter?.startingHealth || initialState.playerHealth,
        maxPlayerHealth: selectedCharacter?.startingHealth || initialState.maxPlayerHealth,
        playerInsight: selectedCharacter?.startingInsight || initialState.playerInsight,
        characters: state.characters, // Preserve characters data
        researchPoints: state.researchPoints, // Preserve meta-progression
        playerName: state.playerName, // Preserve player name
        completedRuns: state.completedRuns // Preserve run count
      };
    },
    
    endGame: (state, action: PayloadAction<boolean>) => {
      state.isGameOver = true;
      
      // If completed successfully, increment completed runs
      if (action.payload) {
        state.completedRuns += 1;
      }
    },
    
    selectCharacter: (state, action: PayloadAction<string>) => {
      const characterId = action.payload;
      const character = state.characters.find(c => c.id === characterId);
      
      if (character) {
        state.selectedCharacterId = characterId;
        state.isCharacterSelected = true;
        state.playerHealth = character.startingHealth;
        state.maxPlayerHealth = character.startingHealth;
        state.playerInsight = character.startingInsight;
      }
    },
    
    setPlayerName: (state, action: PayloadAction<string>) => {
      state.playerName = action.payload;
    },
    
    setDifficulty: (state, action: PayloadAction<Difficulty>) => {
      state.difficulty = action.payload;
    },
    
    incrementTurn: (state) => {
      state.turn += 1;
    },
    
    addScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    
    addInsight: (state, action: PayloadAction<number>) => {
      state.playerInsight += action.payload;
    },
    
    spendInsight: (state, action: PayloadAction<number>) => {
      state.playerInsight = Math.max(0, state.playerInsight - action.payload);
    },
    
    addResearchPoints: (state, action: PayloadAction<number>) => {
      state.researchPoints += action.payload;
    },
    
    takeDamage: (state, action: PayloadAction<number>) => {
      state.playerHealth = Math.max(0, state.playerHealth - action.payload);
      
      if (state.playerHealth <= 0) {
        state.isGameOver = true;
      }
    },
    
    heal: (state, action: PayloadAction<number>) => {
      state.playerHealth = Math.min(state.maxPlayerHealth, state.playerHealth + action.payload);
    },
    
    increaseMaxHealth: (state, action: PayloadAction<number>) => {
      state.maxPlayerHealth += action.payload;
      state.playerHealth += action.payload; // Also increase current health
    },
    
    advanceFloor: (state) => {
      state.floor += 1;
    }
  }
});

// Export actions
export const {
  startGame,
  resetGame,
  endGame,
  selectCharacter,
  setPlayerName,
  setDifficulty,
  incrementTurn,
  addScore,
  addInsight,
  spendInsight,
  addResearchPoints,
  takeDamage,
  heal,
  increaseMaxHealth,
  advanceFloor
} = gameSlice.actions;

// Export selectors
export const selectGameState = (state: RootState) => state.game;
export const selectPlayerHealth = (state: RootState) => state.game.playerHealth;
export const selectMaxPlayerHealth = (state: RootState) => state.game.maxPlayerHealth;
export const selectPlayerInsight = (state: RootState) => state.game.playerInsight;
export const selectScore = (state: RootState) => state.game.score;
export const selectCharacters = (state: RootState) => state.game.characters;
export const selectSelectedCharacterId = (state: RootState) => state.game.selectedCharacterId;
export const selectIsGameStarted = (state: RootState) => state.game.isGameStarted;
export const selectIsGameOver = (state: RootState) => state.game.isGameOver;
export const selectIsCharacterSelected = (state: RootState) => state.game.isCharacterSelected;
export const selectDifficulty = (state: RootState) => state.game.difficulty;
export const selectFloor = (state: RootState) => state.game.floor;

export default gameSlice.reducer;