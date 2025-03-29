// lib/utils/error-handlers.ts
'use client';

/**
 * Custom error class for game-related errors
 */
export class GameError extends Error {
  constructor(
    message: string,
    public readonly code: string,
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
  
  // Node errors
  NODE_ERROR = 'NODE_ERROR',
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',
  NODE_UNAVAILABLE = 'NODE_UNAVAILABLE',
  
  // Challenge errors
  CHALLENGE_ERROR = 'CHALLENGE_ERROR',
  CHALLENGE_NOT_FOUND = 'CHALLENGE_NOT_FOUND',
  INVALID_CHALLENGE_STATE = 'INVALID_CHALLENGE_STATE',
  
  // Inventory errors
  INVENTORY_ERROR = 'INVENTORY_ERROR',
  INVENTORY_FULL = 'INVENTORY_FULL',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  
  // Save/Load errors
  SAVE_ERROR = 'SAVE_ERROR',
  LOAD_ERROR = 'LOAD_ERROR',
  INVALID_SAVE_DATA = 'INVALID_SAVE_DATA',
  
  // Timer errors
  TIMER_ERROR = 'TIMER_ERROR',
  INVALID_TIMER_STATE = 'INVALID_TIMER_STATE'
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