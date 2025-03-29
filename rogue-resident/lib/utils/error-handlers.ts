// lib/utils/error-handlers.ts
'use client';

/**
 * Custom error class for game-related errors
 */
export class GameError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'GameError';
  }
}

/**
 * Error codes for different categories of errors
 */
export enum ErrorCode {
  // General errors
  GENERAL_ERROR = 'GENERAL_ERROR',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  
  // Game state errors
  GAME_STATE_ERROR = 'GAME_STATE_ERROR',
  INVALID_STATE_TRANSITION = 'INVALID_STATE_TRANSITION',
  GAME_ALREADY_STARTED = 'GAME_ALREADY_STARTED',
  GAME_NOT_STARTED = 'GAME_NOT_STARTED',
  INVALID_DIFFICULTY = 'INVALID_DIFFICULTY',
  CHARACTER_NOT_SELECTED = 'CHARACTER_NOT_SELECTED',
  
  // Map errors
  MAP_ERROR = 'MAP_ERROR',
  MAP_GENERATION_ERROR = 'MAP_GENERATION_ERROR',
  MAP_NOT_GENERATED = 'MAP_NOT_GENERATED',
  
  // Node errors
  NODE_ERROR = 'NODE_ERROR',
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',
  NODE_UNAVAILABLE = 'NODE_UNAVAILABLE',
  NODE_ALREADY_COMPLETED = 'NODE_ALREADY_COMPLETED',
  NODE_NAVIGATION_ERROR = 'NODE_NAVIGATION_ERROR',
  
  // Challenge errors
  CHALLENGE_ERROR = 'CHALLENGE_ERROR',
  CHALLENGE_NOT_FOUND = 'CHALLENGE_NOT_FOUND',
  CHALLENGE_ALREADY_ACTIVE = 'CHALLENGE_ALREADY_ACTIVE',
  CHALLENGE_NOT_ACTIVE = 'CHALLENGE_NOT_ACTIVE',
  CHALLENGE_START_ERROR = 'CHALLENGE_START_ERROR',
  INVALID_CHALLENGE_STATE = 'INVALID_CHALLENGE_STATE',
  
  // Inventory errors
  INVENTORY_ERROR = 'INVENTORY_ERROR',
  INVENTORY_FULL = 'INVENTORY_FULL',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  ITEM_ALREADY_ACTIVE = 'ITEM_ALREADY_ACTIVE',
  INSUFFICIENT_INSIGHT = 'INSUFFICIENT_INSIGHT',
  
  // Save/Load errors
  SAVE_ERROR = 'SAVE_ERROR',
  LOAD_ERROR = 'LOAD_ERROR',
  SAVE_NOT_FOUND = 'SAVE_NOT_FOUND',
  INVALID_SAVE_DATA = 'INVALID_SAVE_DATA',
  SAVE_LOAD_ERROR = 'SAVE_LOAD_ERROR',
  
  // Timer errors
  TIMER_ERROR = 'TIMER_ERROR',
  INVALID_TIMER_STATE = 'INVALID_TIMER_STATE',
  TIMER_ALREADY_RUNNING = 'TIMER_ALREADY_RUNNING',
  TIMER_NOT_RUNNING = 'TIMER_NOT_RUNNING'
}

/**
 * Utility function to safely execute a function and return a fallback value if it throws
 * @param fn Function to execute
 * @param fallback Fallback value to return if the function throws
 * @param errorCode Optional error code for logging
 * @returns Result of the function or fallback
 */
export function tryCatch<T>(fn: () => T, fallback: T, errorCode = ErrorCode.GENERAL_ERROR): T {
  try {
    return fn();
  } catch (error) {
    console.error(
      `[Rogue Resident] Error ${errorCode}:`, 
      error instanceof Error ? error.message : 'Unknown error',
      error
    );
    return fallback;
  }
}

/**
 * Utility function to safely execute an async function and return a fallback value if it throws
 * @param fn Async function to execute
 * @param fallback Fallback value to return if the function throws
 * @param errorCode Optional error code for logging
 * @returns Promise that resolves to the result of the function or fallback
 */
export async function tryCatchAsync<T>(
  fn: () => Promise<T>, 
  fallback: T, 
  errorCode = ErrorCode.GENERAL_ERROR
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(
      `[Rogue Resident] Error ${errorCode}:`, 
      error instanceof Error ? error.message : 'Unknown error',
      error
    );
    return fallback;
  }
}

/**
 * Utility function to log errors without affecting execution
 * @param fn Function to execute
 * @param errorCode Optional error code for logging
 * @returns Result of the function
 */
export function logErrors<T>(fn: () => T, errorCode = ErrorCode.GENERAL_ERROR): T {
  try {
    return fn();
  } catch (error) {
    console.error(
      `[Rogue Resident] Error ${errorCode}:`, 
      error instanceof Error ? error.message : 'Unknown error',
      error
    );
    throw error; // Re-throw the error after logging
  }
}