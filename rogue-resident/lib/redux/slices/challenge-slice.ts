import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { ChallengeType, Difficulty } from '@/lib/types/game-types';

export type GradeType = 'S' | 'A' | 'B' | 'C' | 'F';

export interface ChallengeStage {
  id: string;
  type: string;
  content: any;
  isCompleted: boolean;
  userAnswer?: any;
  correctAnswer?: any;
}

export interface ChallengeSliceState {
  isActive: boolean;
  challengeType: ChallengeType | null;
  difficulty: Difficulty;
  title: string;
  description: string;
  currentStageIndex: number;
  stages: ChallengeStage[];
  isCompleted: boolean;
  grade: GradeType | null;
  rewards: any[] | null;
  timeRemaining: number | null; // For timed challenges
}

const initialState: ChallengeSliceState = {
  isActive: false,
  challengeType: null,
  difficulty: 'normal',
  title: '',
  description: '',
  currentStageIndex: 0,
  stages: [],
  isCompleted: false,
  grade: null,
  rewards: null,
  timeRemaining: null
};

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    startChallenge: (state, action: PayloadAction<{
      challengeType: ChallengeType;
      difficulty: Difficulty;
      title: string;
      description: string;
      stages: ChallengeStage[];
      timeLimit?: number; // Optional time limit in seconds
    }>) => {
      const { challengeType, difficulty, title, description, stages, timeLimit } = action.payload;
      
      state.isActive = true;
      state.challengeType = challengeType;
      state.difficulty = difficulty;
      state.title = title;
      state.description = description;
      state.stages = stages;
      state.currentStageIndex = 0;
      state.isCompleted = false;
      state.grade = null;
      state.rewards = null;
      state.timeRemaining = timeLimit || null;
    },
    
    nextStage: (state) => {
      if (state.currentStageIndex < state.stages.length - 1) {
        state.currentStageIndex += 1;
      } else {
        // All stages complete, calculate grade
        state.isCompleted = true;
      }
    },
    
    previousStage: (state) => {
      if (state.currentStageIndex > 0) {
        state.currentStageIndex -= 1;
      }
    },
    
    submitAnswer: (state, action: PayloadAction<any>) => {
      const answer = action.payload;
      const currentStage = state.stages[state.currentStageIndex];
      
      if (currentStage) {
        currentStage.userAnswer = answer;
        currentStage.isCompleted = true;
      }
    },
    
    setStageCompleted: (state, action: PayloadAction<boolean>) => {
      const completed = action.payload;
      const currentStage = state.stages[state.currentStageIndex];
      
      if (currentStage) {
        currentStage.isCompleted = completed;
      }
    },
    
    completeChallenge: (state, action: PayloadAction<{
      grade: GradeType;
      rewards: any[];
    }>) => {
      const { grade, rewards } = action.payload;
      
      state.isCompleted = true;
      state.grade = grade;
      state.rewards = rewards;
    },
    
    resetChallenge: (state) => {
      return initialState;
    },
    
    // For timed challenges
    decrementTimer: (state) => {
      if (state.timeRemaining !== null && state.timeRemaining > 0) {
        state.timeRemaining -= 1;
        
        // If time runs out, mark as failed
        if (state.timeRemaining === 0) {
          state.isCompleted = true;
          state.grade = 'F';
        }
      }
    }
  }
});

// Export actions
export const {
  startChallenge,
  nextStage,
  previousStage,
  submitAnswer,
  setStageCompleted,
  completeChallenge,
  resetChallenge,
  decrementTimer
} = challengeSlice.actions;

// Export selectors
export const selectChallengeState = (state: RootState) => state.challenge;
export const selectIsActiveChallenge = (state: RootState) => state.challenge.isActive;
export const selectCurrentStageIndex = (state: RootState) => state.challenge.currentStageIndex;
export const selectCurrentStage = (state: RootState) => 
  state.challenge.stages[state.challenge.currentStageIndex] || null;
export const selectChallengeTitle = (state: RootState) => state.challenge.title;
export const selectChallengeGrade = (state: RootState) => state.challenge.grade;
export const selectChallengeCompleted = (state: RootState) => state.challenge.isCompleted;

export default challengeSlice.reducer;