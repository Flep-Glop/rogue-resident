// Challenge types based on the game design document
export type ChallengeType = 
  | 'clinical' 
  | 'qa' 
  | 'educational' 
  | 'boss'

// Challenge sub-types for different specific scenarios
export type ClinicalChallengeType = 
  | 'imaging-review' 
  | 'parameter-selection' 
  | 'dose-calculation' 
  | 'plan-evaluation'

export type QAChallengeType = 
  | 'measurement-setup' 
  | 'data-collection' 
  | 'data-analysis' 
  | 'corrective-action'

export type EducationalChallengeType = 
  | 'concept-explanation' 
  | 'visual-aid-creation' 
  | 'question-handling' 
  | 'knowledge-assessment'

export type BossChallengeType = 
  | 'calibration' 
  | 'erratic-behavior' 
  | 'resolution'

// Challenge state for tracking progress
export type ChallengeState = 
  | 'inactive' 
  | 'active' 
  | 'completed' 
  | 'failed'

// Challenge stages
export type ChallengeStage = 
  | 'introduction' 
  | 'stage1' 
  | 'stage2' 
  | 'stage3' 
  | 'outcome'

// Performance grades
export type ChallengeGrade = 'S' | 'A' | 'B' | 'C' | 'F'

// Base Challenge interface
export interface Challenge {
  id: string
  type: ChallengeType
  title: string
  description: string
  difficulty: 'easy' | 'normal' | 'hard'
  stages: ChallengeStageInfo[]
  timeLimit?: number
  rewards: {
    insight: number
    itemId?: string
  }
}

// Stage-specific information
export interface ChallengeStageInfo {
  id: string
  title: string
  description: string
  type: string
  content: any
  correctAnswer?: any
  grading: {
    criteria: any
    points: number
  }
}

// Clinical challenge specifics
export interface ClinicalChallenge extends Challenge {
  type: 'clinical'
  patientCase: {
    history: string
    prescription: string
    imagingAvailable: string[]
  }
  subType: ClinicalChallengeType
}

// QA challenge specifics
export interface QAChallenge extends Challenge {
  type: 'qa'
  equipment: {
    type: string
    specifications: Record<string, any>
  }
  subType: QAChallengeType
}

// Educational challenge specifics
export interface EducationalChallenge extends Challenge {
  type: 'educational'
  audience: 'students' | 'residents' | 'physicians' | 'staff'
  topic: string
  subType: EducationalChallengeType
}

// Boss challenge specifics
export interface BossChallenge extends Challenge {
  type: 'boss'
  phase: number
  subType: BossChallengeType
  ionixState: {
    energy: number
    stability: number
    sentience: number
  }
}

// Challenge response tracking
export interface ChallengeResponse {
  challengeId: string
  stageId: string
  response: any
  timeRemaining: number
  grade: ChallengeGrade
}

// Challenge result
export interface ChallengeResult {
  challengeId: string
  completed: boolean
  overallGrade: ChallengeGrade
  stageGrades: Record<string, ChallengeGrade>
  timeRemaining: number
  insightEarned: number
  itemsEarned: string[]
}