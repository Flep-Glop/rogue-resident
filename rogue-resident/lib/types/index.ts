// lib/types/index.ts

// Export all types from their respective files
export * from './map-types';
export * from './game-types';
export * from './challenge-types';
export * from './item-types';
export * from './redux-types';

// Create shorthand type combinations for common use cases
import type { RootState } from './redux-types';
import type { ChallengeType, ChallengeGrade } from './challenge-types';
import type { NodeType } from './map-types';

// Node with challenge type mapping
export type NodeChallengeMap = Record<NodeType, ChallengeType | null>;

// Mapped types for grade calculations
export type GradeThresholds = Record<ChallengeGrade, number>;

// Selector type helper
export type Selector<TSelected> = (state: RootState) => TSelected;