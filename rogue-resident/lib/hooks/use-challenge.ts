'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, createSelector } from '@/lib/redux/hooks';
import {
  startChallenge,
  advanceStage,
  recordResponse,
  setOverallGrade,
  completeChallenge,
  failChallenge,
  resetChallenge,
  decrementTimer
} from '@/lib/redux/slices/challenge-slice';
import type { 
  ChallengeType, 
  ChallengeStage, 
  ChallengeGrade,
  ChallengeDifficulty 
} from '@/lib/types/challenge-types';
import { calculateGrade } from '@/lib/utils/game-utils';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

// Create memoized selectors
const selectChallengeState = createSelector(
  [(state) => state.challenge],
  (challenge) => ({
    challengeId: challenge.currentChallengeId,
    challengeType: challenge.challengeType,
    currentStage: challenge.currentStage,
    isCompleted: challenge.isCompleted,
    grade: challenge.overallGrade,
    insightReward: challenge.insightReward,
    itemReward: challenge.itemReward,
    timeRemaining: challenge.timeRemaining,
    challengeState: challenge.challengeState
  })
);

const selectChallengeDetails = createSelector(
  [(state) => state.challenge],
  (challenge) => ({
    title: challenge.title,
    description: challenge.description,
    difficulty: challenge.difficulty,
    stages: challenge.stages
  })
);

/**
 * Interface for challenge start parameters
 */
interface ChallengeStartParams {
  id: string;
  type: ChallengeType;
  totalStages: number;
  title?: string;
  description?: string;
  difficulty?: ChallengeDifficulty;
  timeLimit?: number;
}

/**
 * Interface for challenge completion parameters
 */
interface ChallengeCompleteParams {
  grade: ChallengeGrade;
  rewards: any[];
}

/**
 * Interface defining the return value of the useChallenge hook
 */
interface UseChallengeReturn {
  // State
  challengeId: string | null;
  challengeType: ChallengeType | null;
  currentStage: ChallengeStage | null;
  isCompleted: boolean;
  grade: ChallengeGrade | null;
  insightReward: number;
  itemReward: string | null;
  timeRemaining: number;
  challengeState: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty | null;
  stages: any[];
  
  // Actions
  startChallenge: (params: ChallengeStartParams) => void;
  goToStage: (stage: ChallengeStage) => void;
  submitResponse: (stage: ChallengeStage, response: any) => void;
  setGrade: (grade: ChallengeGrade) => void;
  completeChallenge: (params: ChallengeCompleteParams) => void;
  failChallenge: () => void;
  resetChallenge: () => void;
  decrementTimer: () => void;
  
  // Utility
  calculateGrade: (score: number, maxScore: number) => ChallengeGrade;
  isStageCompleted: (stageId: string) => boolean;
  getStageById: (stageId: string) => any;
  isActive: () => boolean;
}

/**
 * Hook for managing challenge interactions
 * 
 * Provides functionality to start, navigate, and complete challenges,
 * as well as track challenge state and progress.
 * 
 * @returns Object containing challenge state and interaction methods
 */
export function useChallenge(): UseChallengeReturn {
  const dispatch = useAppDispatch();
  
  // Get state from selectors
  const { 
    challengeId, 
    challengeType, 
    currentStage, 
    isCompleted, 
    grade, 
    insightReward, 
    itemReward,
    timeRemaining,
    challengeState
  } = useAppSelector(selectChallengeState);
  
  const { title, description, difficulty, stages } = useAppSelector(selectChallengeDetails);
  
  /**
   * Starts a new challenge
   * 
   * @param params - Parameters for the new challenge
   */
  const begin = useCallback((params: ChallengeStartParams): void => {
    tryCatch(() => {
      dispatch(startChallenge(params));
    }, undefined, ErrorCode.CHALLENGE_START_ERROR);
  }, [dispatch]);
  
  /**
   * Navigates to a specific stage in the challenge
   * 
   * @param stage - The stage to navigate to
   */
  const goToStage = useCallback((stage: ChallengeStage): void => {
    tryCatch(() => {
      dispatch(advanceStage(stage));
    }, undefined, ErrorCode.CHALLENGE_NAVIGATION_ERROR);
  }, [dispatch]);
  
  /**
   * Submits a response for the current challenge stage
   * 
   * @param stage - The stage to submit for
   * @param response - The user's response data
   */
  const submitResponse = useCallback((stage: ChallengeStage, response: any): void => {
    tryCatch(() => {
      dispatch(recordResponse({ stage, response }));
    }, undefined, ErrorCode.CHALLENGE_RESPONSE_ERROR);
  }, [dispatch]);
  
  /**
   * Sets the overall grade for the challenge
   * 
   * @param grade - The grade to set
   */
  const setGrade = useCallback((grade: ChallengeGrade): void => {
    tryCatch(() => {
      dispatch(setOverallGrade(grade));
    }, undefined, ErrorCode.CHALLENGE_GRADING_ERROR);
  }, [dispatch]);
  
  /**
   * Completes the challenge with a grade and rewards
   * 
   * @param params - Completion parameters with grade and rewards
   */
  const complete = useCallback((params: ChallengeCompleteParams): void => {
    tryCatch(() => {
      dispatch(completeChallenge(params));
    }, undefined, ErrorCode.CHALLENGE_COMPLETION_ERROR);
  }, [dispatch]);
  
  /**
   * Fails the current challenge
   */
  const fail = useCallback((): void => {
    tryCatch(() => {
      dispatch(failChallenge());
    }, undefined, ErrorCode.CHALLENGE_FAILURE_ERROR);
  }, [dispatch]);
  
  /**
   * Resets the challenge state
   */
  const reset = useCallback((): void => {
    tryCatch(() => {
      dispatch(resetChallenge());
    }, undefined, ErrorCode.CHALLENGE_RESET_ERROR);
  }, [dispatch]);
  
  /**
   * Updates the timer for timed challenges
   */
  const tickTimer = useCallback((): void => {
    tryCatch(() => {
      dispatch(decrementTimer());
    }, undefined, ErrorCode.CHALLENGE_TIMER_ERROR);
  }, [dispatch]);
  
  /**
   * Calculates a grade based on score
   * 
   * @param score - The achieved score
   * @param maxScore - The maximum possible score
   * @returns The calculated grade
   */
  const calculateChallengeGrade = useCallback((score: number, maxScore: number): ChallengeGrade => {
    return tryCatch(() => {
      return calculateGrade(score, maxScore);
    }, 'C' as ChallengeGrade, ErrorCode.CHALLENGE_GRADING_ERROR);
  }, []);
  
  /**
   * Checks if a stage is completed
   * 
   * @param stageId - The ID of the stage to check
   * @returns Whether the stage is completed
   */
  const isStageCompleted = useCallback((stageId: string): boolean => {
    return tryCatch(() => {
      return !!stages.find(s => s.id === stageId && s.isCompleted);
    }, false, ErrorCode.CHALLENGE_STAGE_ERROR);
  }, [stages]);
  
  /**
   * Gets stage data by ID
   * 
   * @param stageId - The ID of the stage to get
   * @returns The stage data or undefined if not found
   */
  const getStageById = useCallback((stageId: string): any => {
    return tryCatch(() => {
      return stages.find(s => s.id === stageId);
    }, undefined, ErrorCode.CHALLENGE_STAGE_ERROR);
  }, [stages]);
  
  /**
   * Checks if the challenge is active
   * 
   * @returns Whether the challenge state is 'active'
   */
  const isActive = useCallback((): boolean => {
    return tryCatch(() => {
      return challengeState === 'active';
    }, false, ErrorCode.CHALLENGE_STATE_ERROR);
  }, [challengeState]);
  
  return {
    // State
    challengeId,
    challengeType,
    currentStage,
    isCompleted,
    grade,
    insightReward,
    itemReward,
    timeRemaining,
    challengeState,
    title,
    description,
    difficulty,
    stages,
    
    // Actions
    startChallenge: begin,
    goToStage,
    submitResponse,
    setGrade,
    completeChallenge: complete,
    failChallenge: fail,
    resetChallenge: reset,
    decrementTimer: tickTimer,
    
    // Utility
    calculateGrade: calculateChallengeGrade,
    isStageCompleted,
    getStageById,
    isActive
  };
}