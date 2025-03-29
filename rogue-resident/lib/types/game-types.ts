// Game Difficulty Settings
export type Difficulty = 'easy' | 'normal' | 'hard';

// Challenge Types
export type ChallengeType = 
  'clinical' | 
  'qa' | 
  'educational' | 
  'boss';

// Challenge Stage Types
export type StageType = 
  'introduction' | 
  'imaging' | 
  'parameters' | 
  'dose' | 
  'plan' | 
  'outcome';

// Common challenge data interface
export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  type: ChallengeType;
  stages: ChallengeStage[];
  rewards: Reward[];
}

// Challenge stage interface
export interface ChallengeStage {
  id: string;
  type: StageType;
  content: any;
  isCompleted: boolean;
}

// Rewards
export interface Reward {
  type: 'insight' | 'health' | 'item' | 'researchPoints';
  value: number;
  itemId?: string;
}

// Clinical challenge specific data
export interface ClinicalChallengeData extends ChallengeData {
  patientInfo: {
    age: number;
    gender: string;
    diagnosis: string;
    stage: string;
    previousTreatments: string[];
  };
  stages: {
    imaging: {
      images: string[];
      correctAnswers: string[];
      userAnswers?: string[];
    };
    parameters: {
      options: {
        energy: string[];
        technique: string[];
        modality: string[];
      };
      correctAnswers: {
        energy: string;
        technique: string;
        modality: string;
      };
      userAnswers?: {
        energy: string;
        technique: string;
        modality: string;
      };
    };
    dose: {
      prescription: string;
      correctAnswer: number;
      userAnswer?: number;
      tolerance: number;
    };
    plan: {
      dvhData: any;
      structures: string[];
      constraints: {
        structure: string;
        type: 'max' | 'mean' | 'min';
        dose: number;
        volume?: number;
      }[];
      correctAnswers: string[];
      userAnswers?: string[];
    };
  };
}

// QA challenge specific data
export interface QAChallengeData extends ChallengeData {
  equipment: string;
  procedure: string;
  stages: {
    setup: {
      options: string[];
      correctAnswer: string;
      userAnswer?: string;
    };
    measurement: {
      expectedValues: number[];
      tolerances: number[];
      readings: number[];
      userValues?: number[];
    };
    analysis: {
      data: any;
      questions: {
        text: string;
        options: string[];
        correctAnswer: string;
        userAnswer?: string;
      }[];
    };
  };
}

// Educational challenge specific data
export interface EducationalChallengeData extends ChallengeData {
  topic: string;
  audience: 'students' | 'residents' | 'staff' | 'patients';
  stages: {
    preparation: {
      concepts: string[];
      correctApproach: string;
      userChoice?: string;
    };
    presentation: {
      slides: any;
      questions: {
        text: string;
        difficulty: Difficulty;
        correctAnswer: string;
        userAnswer?: string;
      }[];
    };
    assessment: {
      questions: {
        text: string;
        options: string[];
        correctAnswer: string;
        userAnswer?: string;
      }[];
    };
  };
}

// Boss challenge specific data
export interface BossChallengeData extends ChallengeData {
  bossName: string;
  phases: number;
  stages: {
    phase1: {
      challenges: any[];
      requiredSuccess: number;
      userSuccess?: number;
    };
    phase2: {
      challenges: any[];
      requiredSuccess: number;
      userSuccess?: number;
    };
    phase3?: {
      challenges: any[];
      requiredSuccess: number;
      userSuccess?: number;
    };
  };
}

// Game Session Stats
export interface GameSessionStats {
  timePlayedSeconds: number;
  nodesVisited: number;
  challengesCompleted: number;
  challengesPerfect: number;
  itemsCollected: number;
  itemsUsed: number;
  insightGained: number;
  insightSpent: number;
  healthLost: number;
  healthGained: number;
  runsCompleted: number;
}