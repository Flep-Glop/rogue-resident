import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { 
  ChallengeType, 
  ChallengeStage, 
  ChallengeGrade,
  ChallengeState,
  ChallengeStageData
} from '@/lib/types/challenge-types';
import { Difficulty } from '@/lib/types/game-types';

export interface ChallengeState {
  currentChallengeId: string | null;
  challengeType: ChallengeType | null;
  difficulty: Difficulty;
  title: string;
  description: string;
  currentStage: ChallengeStage | null;
  stages: ChallengeStageData[];
  isCompleted: boolean;
  overallGrade: ChallengeGrade | null;
  insightReward: number;
  itemReward: string | null;
  timeRemaining: number | null; // For timed challenges
  challengeState: ChallengeState;
}

const initialState: ChallengeState = {
  currentChallengeId: null,
  challengeType: null,
  difficulty: 'normal',
  title: '',
  description: '',
  currentStage: null,
  stages: [],
  isCompleted: false,
  overallGrade: null,
  insightReward: 0,
  itemReward: null,
  timeRemaining: null,
  challengeState: 'inactive'
};

export const challengeSlice = createSlice({
  name: 'challenge',
  initialState,
  reducers: {
    startChallenge: (state, action: PayloadAction<{
      id: string;
      type: ChallengeType;
      totalStages: number;
      title?: string;
      description?: string;
      difficulty?: Difficulty;
      timeLimit?: number;
    }>) => {
      const { id, type, totalStages, title, description, difficulty, timeLimit } = action.payload;
      
      state.currentChallengeId = id;
      state.challengeType = type;
      state.title = title || '';
      state.description = description || '';
      state.difficulty = difficulty || 'normal';
      state.currentStage = 'introduction';
      state.isCompleted = false;
      state.overallGrade = null;
      state.insightReward = 0;
      state.itemReward = null;
      state.timeRemaining = timeLimit || null;
      state.challengeState = 'active';
    },
    
    advanceStage: (state, action: PayloadAction<ChallengeStage>) => {
      state.currentStage = action.payload;
    },
    
    recordResponse: (state, action: PayloadAction<{
      stage: ChallengeStage;
      response: any;
    }>) => {
      const { stage, response } = action.payload;
      const stageIndex = state.stages.findIndex(s => s.id === stage);
      
      if (stageIndex >= 0) {
        state.stages[stageIndex].userAnswer = response;
        state.stages[stageIndex].isCompleted = true;
      }
    },
    
    setOverallGrade: (state, action: PayloadAction<ChallengeGrade>) => {
      state.overallGrade = action.payload;
      
      // Calculate insight reward based on grade
      switch (action.payload) {
        case 'S':
          state.insightReward = 100;
          break;
        case 'A':
          state.insightReward = 75;
          break;
        case 'B':
          state.insightReward = 50;
          break;
        case 'C':
          state.insightReward = 25;
          break;
        case 'F':
          state.insightReward = 0;
          break;
      }
    },
    
    completeChallenge: (state, action: PayloadAction<{
      grade: ChallengeGrade;
      rewards: any[];
    }>) => {
      const { grade, rewards } = action.payload;
      
      state.isCompleted = true;
      state.overallGrade = grade;
      state.challengeState = 'completed';
      
      // Calculate rewards
      state.insightReward = rewards.find(r => r.type === 'insight')?.value || 0;
      state.itemReward = rewards.find(r => r.type === 'item')?.itemId || null;
    },
    
    failChallenge: (state) => {
      state.isCompleted = true;
      state.overallGrade = 'F';
      state.challengeState = 'failed';
      state.insightReward = 0;
      state.itemReward = null;
    },
    
    resetChallenge: (state) => {
      return initialState;
    },
    
    decrementTimer: (state) => {
      if (state.timeRemaining !== null && state.timeRemaining > 0) {
        state.timeRemaining -= 1;
        
        // Time's up - fail the challenge
        if (state.timeRemaining === 0) {
          state.isCompleted = true;
          state.overallGrade = 'F';
          state.challengeState = 'failed';
        }
      }
    }
  }
});

// Export actions
export const {
  startChallenge,
  advanceStage,
  recordResponse,
  setOverallGrade,
  completeChallenge,
  failChallenge,
  resetChallenge,
  decrementTimer
} = challengeSlice.actions;

// Export selectors
export const selectChallengeState = (state: RootState) => state.challenge;
export const selectCurrentChallengeId = (state: RootState) => state.challenge.currentChallengeId;
export const selectChallengeType = (state: RootState) => state.challenge.challengeType;
export const selectCurrentStage = (state: RootState) => state.challenge.currentStage;
export const selectChallengeTitle = (state: RootState) => state.challenge.title;
export const selectChallengeCompleted = (state: RootState) => state.challenge.isCompleted;
export const selectChallengeGrade = (state: RootState) => state.challenge.overallGrade;
export const selectInsightReward = (state: RootState) => state.challenge.insightReward;
export const selectItemReward = (state: RootState) => state.challenge.itemReward;

export default challengeSlice.reducer;