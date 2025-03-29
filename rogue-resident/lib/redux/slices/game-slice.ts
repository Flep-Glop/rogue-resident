import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { Difficulty } from '@/lib/types/game-types';

export interface Character {
  id: string;
  name: string;
  description: string;
  startingHealth: number;
  startingInsight: number;
  specialAbilities: {
    name: string;
    description: string;
  }[];
  portrait: string;
}

export interface GameState {
  // Player state
  playerHealth: number;
  maxPlayerHealth: number;
  playerInsight: number; // Currency for purchases
  researchPoints: number; // Meta-progression currency
  
  // Game session state
  isGameStarted: boolean;
  isGameOver: boolean;
  isCharacterSelected: boolean;
  selectedCharacterId: string | null;
  difficulty: Difficulty;
  turn: number;
  score: number;
  
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
        name: 'Peer Review',
        description: 'Once per floor, see the correct answer to any challenge.'
      },
      {
        name: 'Quick Study',
        description: '+25% insight from first completion of each scenario type.'
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
  
  // Game session state
  isGameStarted: false,
  isGameOver: false,
  isCharacterSelected: false,
  selectedCharacterId: null,
  difficulty: 'normal',
  turn: 0,
  score: 0,
  
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
        researchPoints: state.researchPoints // Preserve meta-progression
      };
    },
    
    endGame: (state) => {
      state.isGameOver = true;
      // Add any additional end game logic here
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
    }
  }
});

// Export actions
export const {
  startGame,
  resetGame,
  endGame,
  selectCharacter,
  setDifficulty,
  incrementTurn,
  addScore,
  addInsight,
  spendInsight,
  addResearchPoints,
  takeDamage,
  heal,
  increaseMaxHealth
} = gameSlice.actions;

// Export selectors
export const selectGameState = (state: RootState) => state.game;
export const selectPlayerHealth = (state: RootState) => state.game.playerHealth;
export const selectPlayerInsight = (state: RootState) => state.game.playerInsight;
export const selectCharacters = (state: RootState) => state.game.characters;
export const selectSelectedCharacterId = (state: RootState) => state.game.selectedCharacterId;
export const selectIsGameStarted = (state: RootState) => state.game.isGameStarted;
export const selectIsGameOver = (state: RootState) => state.game.isGameOver;

export default gameSlice.reducer;