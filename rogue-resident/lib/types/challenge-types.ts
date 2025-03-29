// lib/types/challenge-types.ts
import type { Difficulty } from './game-types';
import type { Reward } from './map-types';

/**
 * High-level challenge categories
 */
export type ChallengeType = 
  | 'clinical' 
  | 'qa' 
  | 'educational' 
  | 'boss';

/**
 * Clinical challenge subtypes
 */
export type ClinicalChallengeType = 
  | 'imaging-review' 
  | 'parameter-selection' 
  | 'dose-calculation' 
  | 'plan-evaluation';

/**
 * QA challenge subtypes
 */
export type QAChallengeType = 
  | 'measurement-setup' 
  | 'data-collection' 
  | 'data-analysis' 
  | 'corrective-action';

/**
 * Educational challenge subtypes
 */
export type EducationalChallengeType = 
  | 'concept-explanation' 
  | 'visual-aid-creation' 
  | 'question-handling' 
  | 'knowledge-assessment';

/**
 * Boss challenge subtypes
 */
export type BossChallengeType = 
  | 'calibration' 
  | 'erratic-behavior' 
  | 'resolution';

/**
 * Challenge state in the game
 */
export type ChallengeState = 
  | 'inactive' 
  | 'active' 
  | 'completed' 
  | 'failed';

/**
 * Challenge progression stages
 */
export type ChallengeStage = 
  | 'introduction' 
  | 'stage1' 
  | 'stage2' 
  | 'stage3' 
  | 'outcome';

/**
 * Evaluation grades for challenges
 */
export type ChallengeGrade = 'S' | 'A' | 'B' | 'C' | 'F';

/**
 * Base challenge interface
 */
export interface Challenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  difficulty: Difficulty;
  stages: ChallengeStageInfo[];
  timeLimit?: number; // In seconds
  rewards: Reward[];
}

/**
 * Challenge stage information
 */
export interface ChallengeStageInfo {
  id: string;
  title: string;
  description: string;
  type: string;
  content: any; // This will be typed more specifically for each challenge type
  correctAnswer?: any; // The correct answer(s) for validation
  isCompleted?: boolean;
  grading: {
    criteria: any; // Specific grading criteria
    points: number; // Maximum points for this stage
  };
}

/**
 * Clinical challenge specifics
 */
export interface ClinicalChallenge extends Challenge {
  type: 'clinical';
  patientCase: {
    history: string;
    prescription: string;
    imagingAvailable: string[];
  };
  subType: ClinicalChallengeType;
}

/**
 * QA challenge specifics
 */
export interface QAChallenge extends Challenge {
  type: 'qa';
  equipment: {
    type: string;
    specifications: Record<string, any>;
  };
  subType: QAChallengeType;
}

/**
 * Educational challenge specifics
 */
export interface EducationalChallenge extends Challenge {
  type: 'educational';
  audience: 'students' | 'residents' | 'physicians' | 'staff';
  topic: string;
  subType: EducationalChallengeType;
}

/**
 * Boss challenge specifics
 */
export interface BossChallenge extends Challenge {
  type: 'boss';
  phase: number;
  subType: BossChallengeType;
  ionixState: {
    energy: number;
    stability: number;
    sentience: number;
  };
}

/**
 * User response to a challenge stage
 */
export interface ChallengeResponse {
  challengeId: string;
  stageId: string;
  response: any; // This will depend on the challenge type
  timeRemaining: number;
  grade?: ChallengeGrade;
}

/**
 * Challenge completion result
 */
export interface ChallengeResult {
  challengeId: string;
  completed: boolean;
  overallGrade: ChallengeGrade;
  stageGrades: Record<string, ChallengeGrade>;
  timeRemaining: number;
  insightEarned: number;
  itemsEarned: string[];
  feedback: string;
}