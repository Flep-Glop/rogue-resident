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
  ChallengeGrade 
} from '@/lib/types/challenge-types';
import type { Difficulty } from '@/lib/types/game-types';
import { calculateGrade } from '@/lib/utils/game-utils';

// Create memoized selectors
const selectChallengeState = createSelector(state => ({
  challengeId: state.challenge.currentChallengeId,
  challengeType: state.challenge.challengeType,
  currentStage: state.challenge.currentStage,
  isCompleted: state.challenge.isCompleted,
  grade: state.challenge.overallGrade,
  insightReward: state.challenge.insightReward,
  itemReward: state.challenge.itemReward,
  timeRemaining: state.challenge.timeRemaining,
  challengeState: state.challenge.challengeState
}));
const selectChallengeDetails = createSelector(state => ({
  title: state.challenge.title,
  description: state.challenge.description,
  difficulty: state.challenge.difficulty,
  stages: state.challenge.stages
}));

/**
 * Hook for managing challenge interactions
 */
export function useChallenge() {
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
  
  // Start a new challenge
  const begin = useCallback((params: {
    id: string;
    type: ChallengeType;
    totalStages: number;
    title?: string;
    description?: string;
    difficulty?: Difficulty;
    timeLimit?: number;
  }) => {
    dispatch(startChallenge(params));
  }, [dispatch]);
  
  // Navigate between challenge stages
  const goToStage = useCallback((stage: ChallengeStage) => {
    dispatch(advanceStage(stage));
  }, [dispatch]);
  
  // Submit a response for the current stage
  const submitResponse = useCallback((stage: ChallengeStage, response: any) => {
    dispatch(recordResponse({ stage, response }));
  }, [dispatch]);
  
  // Set the grade for the challenge
  const setGrade = useCallback((grade: ChallengeGrade) => {
    dispatch(setOverallGrade(grade));
  }, [dispatch]);
  
  // Complete the challenge with a grade and rewards
  const complete = useCallback((params: {
    grade: ChallengeGrade;
    rewards: any[];
  }) => {
    dispatch(completeChallenge(params));
  }, [dispatch]);
  
  // Fail the challenge
  const fail = useCallback(() => {
    dispatch(failChallenge());
  }, [dispatch]);
  
  // Reset the challenge state
  const reset = useCallback(() => {
    dispatch(resetChallenge());
  }, [dispatch]);
  
  // Update the timer for timed challenges
  const tickTimer = useCallback(() => {
    dispatch(decrementTimer());
  }, [dispatch]);
  
  // Calculate a grade based on score
  const calculateChallengeGrade = useCallback((score: number, maxScore: number): ChallengeGrade => {
    return calculateGrade(score, maxScore);
  }, []);
  
  // Check if a stage is completed
  const isStageCompleted = useCallback((stageId: string): boolean => {
    return !!stages.find(s => s.id === stageId && s.isCompleted);
  }, [stages]);
  
  // Get stage data by ID
  const getStageById = useCallback((stageId: string) => {
    return stages.find(s => s.id === stageId);
  }, [stages]);
  
  // Check if the challenge is active
  const isActive = useCallback((): boolean => {
    return challengeState === 'active';
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