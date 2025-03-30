// lib/types/index.ts

// Re-export everything except ChallengeState to avoid conflict
import type { 
    ChallengeType, 
    ChallengeGrade, 
    Challenge, 
    ChallengeStage, 
    ChallengeStatus, 
    ClinicalChallenge,
    QAChallenge, 
    EducationalChallenge, 
    BossChallenge,
    ChallengeStageInfo, 
    ChallengeResponse, 
    ChallengeResult,
    // Note: ChallengeState is not re-exported to avoid conflicts
  } from './challenge-types';
  
  export type {
    ChallengeType, 
    ChallengeGrade, 
    Challenge,
    ChallengeStage, 
    ChallengeStatus, 
    ClinicalChallenge,
    QAChallenge, 
    EducationalChallenge, 
    BossChallenge,
    ChallengeStageInfo, 
    ChallengeResponse, 
    ChallengeResult
  };
  
  export * from './map-types';
  export * from './game-types';
  export * from './item-types';
  export * from './redux-types';
  
  // Create shorthand type combinations for common use cases
  import type { RootState } from './redux-types';
  import type { NodeType } from './map-types';
  
  // Node with challenge type mapping
  export type NodeChallengeMap = Record<NodeType, ChallengeType | null>;
  
  // Mapped types for grade calculations
  export type GradeThresholds = Record<ChallengeGrade, number>;
  
  // Selector type helper
  export type Selector<TSelected> = (state: RootState) => TSelected;