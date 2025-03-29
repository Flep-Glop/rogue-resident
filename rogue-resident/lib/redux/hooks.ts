// lib/redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Typed version of useDispatch hook
 * Use this throughout the app instead of plain `useDispatch`
 */
export const useAppDispatch: () => AppDispatch = useDispatch;

/**
 * Typed version of useSelector hook
 * Use this throughout the app instead of plain `useSelector`
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Helper for creating memoized selectors with proper TypeScript types
 * Usage: const selectMyValue = createSelector(state => state.slice.value)
 */
export const createSelector = <T>(selector: (state: RootState) => T) => selector;