// lib/types/gameTypes.ts

// Node types
export enum NodeType {
    CLINICAL = 'clinical',
    QA = 'qa',
    EDUCATIONAL = 'educational',
    STORAGE = 'storage',
    VENDOR = 'vendor',
    BOSS = 'boss',
  }
  
  // Node status
  export enum NodeStatus {
    LOCKED = 'locked',
    AVAILABLE = 'available',
    ACTIVE = 'active',
    COMPLETED = 'completed',
  }
  
  // Node data interface
  export interface NodeData {
    id: string;
    type: NodeType;
    title: string;
    status: NodeStatus;
    connections: string[];
    position: {
      x: number;
      y: number;
    };
    scenarioId?: string;
    difficulty?: 'easy' | 'normal' | 'hard';
  }
  
  // Challenge types
  export enum ChallengeType {
    IMAGING_REVIEW = 'imaging_review',
    PARAMETER_SELECTION = 'parameter_selection',
    DOSE_CALCULATION = 'dose_calculation',
    PLAN_EVALUATION = 'plan_evaluation',
  }
  
  // Challenge stage
  export enum ChallengeStage {
    INTRODUCTION = 'introduction',
    CHALLENGE = 'challenge',
    OUTCOME = 'outcome',
  }
  
  // Challenge data interface
  export interface ChallengeData {
    id: string;
    nodeId: string;
    nodeType: NodeType;
    title: string;
    description: string;
    stages: ChallengeStage[];
    currentStage: ChallengeStage;
    difficulty: 'easy' | 'normal' | 'hard';
    completed: boolean;
    grade?: 'C' | 'B' | 'A' | 'S';
  }
  
  // Clinical challenge specific data
  export interface ClinicalChallengeData extends ChallengeData {
    patientInfo: {
      name: string;
      age: number;
      gender: string;
      diagnosis: string;
      prescription: string;
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
          energy?: string;
          technique?: string;
          modality?: string;
        };
      };
      dose: {
        prescription: string;
        parameters: Record<string, string | number>;
        correctAnswer: number;
        userAnswer?: number;
        tolerance: number; // percentage tolerance for correct answer
      };
      plan: {
        criticalStructures: string[];
        issues: string[];
        correctIssues: string[];
        userSelectedIssues?: string[];
      };
    };
  }
  
  // Character stats
  export interface CharacterStats {
    lives: number;
    insight: number;
    items: string[];
  }
  
  // Game state
  export interface GameState {
    character: string;
    currentNodeId: string | null;
    activeChallengeId: string | null;
    challengeStage: ChallengeStage | null;
    stats: CharacterStats;
    mapCompleted: boolean;
    bossDefeated: boolean;
  }
  
  // Map state
  export interface MapState {
    nodes: NodeData[];
    edges: Edge[];
    currentFloor: number;
  }
  
  // Edge for React Flow
  export interface Edge {
    id: string;
    source: string;
    target: string;
    animated?: boolean;
    style?: Record<string, any>;
  }