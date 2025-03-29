// lib/redux/hooks.ts
'use client';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from './store';
import { createSelector } from '@reduxjs/toolkit';

// Export typed versions of Redux hooks for use throughout the application
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Re-export createSelector for consistent usage pattern throughout the app
export { createSelector };

// Generic type-safe selector creator for better intellisense and type checking
export function createAppSelector<TResult>(
  selector: (state: RootState) => TResult
) {
  return selector;
}