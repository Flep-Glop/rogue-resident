// lib/utils/error-handlers.ts
'use client';

/**
 * Error types for categorizing errors
 */
export enum ErrorType {
  UNKNOWN = 'unknown',
  GAME = 'game',
  MAP = 'map',
  NODE = 'node',
  CHALLENGE = 'challenge',
  INVENTORY = 'inventory',
  SAVE_LOAD = 'save_load',
  TIMER = 'timer',
  UI = 'ui'
}

/**
 * Custom error class with additional context
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly type: ErrorType = ErrorType.UNKNOWN,
    public readonly code?: string,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    
    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Error codes for specific error conditions
 */
export enum ErrorCode {
  // General errors
  GENERAL_ERROR = 'GENERAL_ERROR',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
  INVALID_PARAMETER = 'INVALID_PARAMETER',
  SELECTOR_ERROR = 'SELECTOR_ERROR',
  
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
  MAP_RESET_ERROR = 'MAP_RESET_ERROR',
  FLOOR_PROGRESSION_ERROR = 'FLOOR_PROGRESSION_ERROR',
  
  // Node errors
  NODE_ERROR = 'NODE_ERROR',
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',
  NODE_UNAVAILABLE = 'NODE_UNAVAILABLE',
  NODE_ALREADY_COMPLETED = 'NODE_ALREADY_COMPLETED',
  NODE_NAVIGATION_ERROR = 'NODE_NAVIGATION_ERROR',
  NODE_INTERACTION_ERROR = 'NODE_INTERACTION_ERROR',
  NODE_STATE_ERROR = 'NODE_STATE_ERROR',
  NODE_DATA_ERROR = 'NODE_DATA_ERROR',
  NODE_COMPLETION_ERROR = 'NODE_COMPLETION_ERROR',
  NODE_ACCESS_ERROR = 'NODE_ACCESS_ERROR',
  NODE_TYPE_CHECK_ERROR = 'NODE_TYPE_CHECK_ERROR',
  NODE_UNLOCK_ERROR = 'NODE_UNLOCK_ERROR',
  NODE_STATUS_ERROR = 'NODE_STATUS_ERROR',
  NODE_GENERATION_ERROR = 'NODE_GENERATION_ERROR',
  NODE_PATH_ERROR = 'NODE_PATH_ERROR',
  NODE_REWARD_CALCULATION_ERROR = 'NODE_REWARD_CALCULATION_ERROR',
  
  // Challenge errors
  CHALLENGE_ERROR = 'CHALLENGE_ERROR',
  CHALLENGE_NOT_FOUND = 'CHALLENGE_NOT_FOUND',
  CHALLENGE_ALREADY_ACTIVE = 'CHALLENGE_ALREADY_ACTIVE',
  CHALLENGE_NOT_ACTIVE = 'CHALLENGE_NOT_ACTIVE',
  CHALLENGE_START_ERROR = 'CHALLENGE_START_ERROR',
  CHALLENGE_NAVIGATION_ERROR = 'CHALLENGE_NAVIGATION_ERROR',
  CHALLENGE_RESPONSE_ERROR = 'CHALLENGE_RESPONSE_ERROR',
  CHALLENGE_GRADING_ERROR = 'CHALLENGE_GRADING_ERROR',
  CHALLENGE_COMPLETION_ERROR = 'CHALLENGE_COMPLETION_ERROR',
  CHALLENGE_FAILURE_ERROR = 'CHALLENGE_FAILURE_ERROR',
  CHALLENGE_RESET_ERROR = 'CHALLENGE_RESET_ERROR',
  CHALLENGE_TIMER_ERROR = 'CHALLENGE_TIMER_ERROR',
  CHALLENGE_STAGE_ERROR = 'CHALLENGE_STAGE_ERROR',
  CHALLENGE_STATE_ERROR = 'CHALLENGE_STATE_ERROR',
  INVALID_CHALLENGE_STATE = 'INVALID_CHALLENGE_STATE',
  CHALLENGE_REWARD_ERROR = 'CHALLENGE_REWARD_ERROR',
  CHALLENGE_SETUP_ERROR = 'CHALLENGE_SETUP_ERROR',
  
  // Inventory errors
  INVENTORY_ERROR = 'INVENTORY_ERROR',
  INVENTORY_FULL = 'INVENTORY_FULL',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  ITEM_ALREADY_ACTIVE = 'ITEM_ALREADY_ACTIVE',
  ITEM_ACTIVATION_ERROR = 'ITEM_ACTIVATION_ERROR',
  ITEM_DEACTIVATION_ERROR = 'ITEM_DEACTIVATION_ERROR',
  ITEM_USE_ERROR = 'ITEM_USE_ERROR',
  INSUFFICIENT_INSIGHT = 'INSUFFICIENT_INSIGHT',
  
  // Item effect errors
  ITEM_EFFECT_APPLICATION_ERROR = 'ITEM_EFFECT_APPLICATION_ERROR',
  ITEM_EFFECT_CALCULATION_ERROR = 'ITEM_EFFECT_CALCULATION_ERROR',
  ITEM_EFFECT_CHECK_ERROR = 'ITEM_EFFECT_CHECK_ERROR',
  ITEM_EFFECT_RETRIEVAL_ERROR = 'ITEM_EFFECT_RETRIEVAL_ERROR',
  ITEM_EFFECT_DURATION_ERROR = 'ITEM_EFFECT_DURATION_ERROR',
  ITEM_GENERATION_ERROR = 'ITEM_GENERATION_ERROR',
  
  // Save/Load errors
  SAVE_ERROR = 'SAVE_ERROR',
  LOAD_ERROR = 'LOAD_ERROR',
  SAVE_NOT_FOUND = 'SAVE_NOT_FOUND',
  INVALID_SAVE_DATA = 'INVALID_SAVE_DATA',
  SAVE_LOAD_ERROR = 'SAVE_LOAD_ERROR',
  DELETE_SAVE_ERROR = 'DELETE_SAVE_ERROR',
  DATE_FORMAT_ERROR = 'DATE_FORMAT_ERROR',
  
  // Timer errors
  TIMER_ERROR = 'TIMER_ERROR',
  TIMER_START_ERROR = 'TIMER_START_ERROR',
  TIMER_PAUSE_ERROR = 'TIMER_PAUSE_ERROR',
  TIMER_RESET_ERROR = 'TIMER_RESET_ERROR',
  INVALID_TIMER_STATE = 'INVALID_TIMER_STATE',
  TIMER_ALREADY_RUNNING = 'TIMER_ALREADY_RUNNING',
  TIMER_NOT_RUNNING = 'TIMER_NOT_RUNNING',
  
  // UI errors
  KEY_PRESS_ERROR = 'KEY_PRESS_ERROR',
  KEYBOARD_SHORTCUT_ERROR = 'KEYBOARD_SHORTCUT_ERROR',
  MEDIA_QUERY_ERROR = 'MEDIA_QUERY_ERROR',
  UI_STYLE_ERROR = 'UI_STYLE_ERROR',
  UI_LABEL_ERROR = 'UI_LABEL_ERROR',
  UI_FORMATTING_ERROR = 'UI_FORMATTING_ERROR',
  UI_ICON_ERROR = 'UI_ICON_ERROR',
  
  // ID generation errors
  ID_GENERATION_ERROR = 'ID_GENERATION_ERROR',
  
  // Storage errors
  LOCAL_STORAGE_READ_ERROR = 'LOCAL_STORAGE_READ_ERROR',
  LOCAL_STORAGE_WRITE_ERROR = 'LOCAL_STORAGE_WRITE_ERROR',
  LOCAL_STORAGE_REMOVE_ERROR = 'LOCAL_STORAGE_REMOVE_ERROR'
}

/**
 * Map error codes to error types
 */
const ERROR_CODE_TO_TYPE: Record<ErrorCode, ErrorType> = {
  // General errors
  [ErrorCode.GENERAL_ERROR]: ErrorType.UNKNOWN,
  [ErrorCode.NOT_INITIALIZED]: ErrorType.UNKNOWN,
  [ErrorCode.INVALID_PARAMETER]: ErrorType.UNKNOWN,
  [ErrorCode.SELECTOR_ERROR]: ErrorType.UNKNOWN,
  
  // Game state errors
  [ErrorCode.GAME_STATE_ERROR]: ErrorType.GAME,
  [ErrorCode.INVALID_STATE_TRANSITION]: ErrorType.GAME,
  [ErrorCode.GAME_ALREADY_STARTED]: ErrorType.GAME,
  [ErrorCode.GAME_NOT_STARTED]: ErrorType.GAME,
  [ErrorCode.INVALID_DIFFICULTY]: ErrorType.GAME,
  [ErrorCode.CHARACTER_NOT_SELECTED]: ErrorType.GAME,
  
  // Map errors
  [ErrorCode.MAP_ERROR]: ErrorType.MAP,
  [ErrorCode.MAP_GENERATION_ERROR]: ErrorType.MAP,
  [ErrorCode.MAP_NOT_GENERATED]: ErrorType.MAP,
  [ErrorCode.MAP_RESET_ERROR]: ErrorType.MAP,
  [ErrorCode.FLOOR_PROGRESSION_ERROR]: ErrorType.MAP,
  
  // Node errors
  [ErrorCode.NODE_ERROR]: ErrorType.NODE,
  [ErrorCode.NODE_NOT_FOUND]: ErrorType.NODE,
  [ErrorCode.NODE_UNAVAILABLE]: ErrorType.NODE,
  [ErrorCode.NODE_ALREADY_COMPLETED]: ErrorType.NODE,
  [ErrorCode.NODE_NAVIGATION_ERROR]: ErrorType.NODE,
  [ErrorCode.NODE_INTERACTION_ERROR]: ErrorType.NODE,
  [ErrorCode.NODE_STATE_ERROR]: ErrorType.NODE,
  [ErrorCode.NODE_DATA_ERROR]: ErrorType.NODE,
  [ErrorCode.NODE_COMPLETION_ERROR]: ErrorType.NODE,
  [ErrorCode.NODE_ACCESS_ERROR]: ErrorType.NODE,
  
  // Challenge errors
  [ErrorCode.CHALLENGE_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_NOT_FOUND]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_ALREADY_ACTIVE]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_NOT_ACTIVE]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_START_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_NAVIGATION_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_RESPONSE_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_GRADING_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_COMPLETION_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_FAILURE_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_RESET_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_TIMER_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_STAGE_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.CHALLENGE_STATE_ERROR]: ErrorType.CHALLENGE,
  [ErrorCode.INVALID_CHALLENGE_STATE]: ErrorType.CHALLENGE,
  
  // Inventory errors
  [ErrorCode.INVENTORY_ERROR]: ErrorType.INVENTORY,
  [ErrorCode.INVENTORY_FULL]: ErrorType.INVENTORY,
  [ErrorCode.ITEM_NOT_FOUND]: ErrorType.INVENTORY,
  [ErrorCode.ITEM_ALREADY_ACTIVE]: ErrorType.INVENTORY,
  [ErrorCode.ITEM_ACTIVATION_ERROR]: ErrorType.INVENTORY,
  [ErrorCode.ITEM_DEACTIVATION_ERROR]: ErrorType.INVENTORY,
  [ErrorCode.ITEM_USE_ERROR]: ErrorType.INVENTORY,
  [ErrorCode.INSUFFICIENT_INSIGHT]: ErrorType.INVENTORY,
  
  // Save/Load errors
  [ErrorCode.SAVE_ERROR]: ErrorType.SAVE_LOAD,
  [ErrorCode.LOAD_ERROR]: ErrorType.SAVE_LOAD,
  [ErrorCode.SAVE_NOT_FOUND]: ErrorType.SAVE_LOAD,
  [ErrorCode.INVALID_SAVE_DATA]: ErrorType.SAVE_LOAD,
  [ErrorCode.SAVE_LOAD_ERROR]: ErrorType.SAVE_LOAD,
  [ErrorCode.DELETE_SAVE_ERROR]: ErrorType.SAVE_LOAD,
  [ErrorCode.DATE_FORMAT_ERROR]: ErrorType.SAVE_LOAD,
  
  // Timer errors
  [ErrorCode.TIMER_ERROR]: ErrorType.TIMER,
  [ErrorCode.TIMER_START_ERROR]: ErrorType.TIMER,
  [ErrorCode.TIMER_PAUSE_ERROR]: ErrorType.TIMER,
  [ErrorCode.TIMER_RESET_ERROR]: ErrorType.TIMER,
  [ErrorCode.INVALID_TIMER_STATE]: ErrorType.TIMER,
  [ErrorCode.TIMER_ALREADY_RUNNING]: ErrorType.TIMER,
  [ErrorCode.TIMER_NOT_RUNNING]: ErrorType.TIMER,
  
  // UI errors
  [ErrorCode.KEY_PRESS_ERROR]: ErrorType.UI,
  [ErrorCode.KEYBOARD_SHORTCUT_ERROR]: ErrorType.UI,
  [ErrorCode.MEDIA_QUERY_ERROR]: ErrorType.UI,
  
  // Storage errors
  [ErrorCode.LOCAL_STORAGE_READ_ERROR]: ErrorType.SAVE_LOAD,
  [ErrorCode.LOCAL_STORAGE_WRITE_ERROR]: ErrorType.SAVE_LOAD,
  [ErrorCode.LOCAL_STORAGE_REMOVE_ERROR]: ErrorType.SAVE_LOAD
};

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

/**
 * Report an error to the error tracking system
 * @param error The error to report
 * @param context Additional context for the error
 */
export function reportError(error: AppError | Error, context?: Record<string, any>): void {
  // In a real app, this would send the error to an error tracking service
  // For now, just log to console
  console.error('[Rogue Resident] Error:', {
    name: error.name,
    message: error.message,
    type: error instanceof AppError ? error.type : ErrorType.UNKNOWN,
    code: error instanceof AppError ? error.code : undefined,
    context: {
      ...(error instanceof AppError ? error.context : {}),
      ...context
    },
    stack: error.stack
  });
}