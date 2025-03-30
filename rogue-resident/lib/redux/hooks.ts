// lib/redux/hooks.ts
'use client';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from './store';
import { createSelector } from '@reduxjs/toolkit';

/**
 * Custom hook to dispatch actions with proper typing
 * @returns Typed dispatch function
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Typed selector hook for accessing Redux state
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Re-export createSelector for consistent usage throughout the app
 */
export { createSelector };

/**
 * Creates a type-safe selector with proper type inference
 * @param selector The selector function
 * @returns The typed selector function
 */
export function createAppSelector<TResult>(
  selector: (state: RootState) => TResult
) {
  return selector;
}

/**
 * Utility type for creating selectors
 */
export type Selector<TSelected> = (state: RootState) => TSelected;

/**
 * Type for memoized selectors created with createSelector
 */
export type MemoizedSelector<TResult> = ReturnType<typeof createSelector<[(state: RootState) => any], TResult>>;