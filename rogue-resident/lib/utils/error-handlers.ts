/**
 * Error types for different parts of the application
 */
export enum ErrorType {
    GAME = 'GAME',
    MAP = 'MAP',
    NODE = 'NODE',
    CHALLENGE = 'CHALLENGE',
    INVENTORY = 'INVENTORY',
    SAVE_LOAD = 'SAVE_LOAD',
    NETWORK = 'NETWORK',
    UNKNOWN = 'UNKNOWN'
  }
  
  /**
   * Custom error class for application errors
   */
  export class AppError extends Error {
    type: ErrorType;
    code?: string;
    data?: any;
    
    constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, code?: string, data?: any) {
      super(message);
      this.name = 'AppError';
      this.type = type;
      this.code = code;
      this.data = data;
      
      // Capture stack trace in modern environments
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, AppError);
      }
    }
  }
  
  /**
   * Handles errors in async functions and returns a consistent result
   * 
   * @param promise The promise to handle
   * @returns [data, error] tuple
   */
  export async function handleAsyncError<T>(
    promise: Promise<T>
  ): Promise<[T | null, AppError | null]> {
    try {
      const data = await promise;
      return [data, null];
    } catch (error) {
      if (error instanceof AppError) {
        return [null, error];
      }
      
      let appError: AppError;
      
      if (error instanceof Error) {
        appError = new AppError(error.message, ErrorType.UNKNOWN);
        appError.stack = error.stack;
      } else {
        appError = new AppError(String(error), ErrorType.UNKNOWN);
      }
      
      return [null, appError];
    }
  }
  
  /**
   * Safely runs a function that might throw and returns the result or null
   * 
   * @param fn The function to run
   * @param fallback Optional fallback value if the function throws
   * @returns The result of the function or the fallback value
   */
  export function tryCatch<T, F = null>(
    fn: () => T,
    fallback: F = null as unknown as F
  ): T | F {
    try {
      return fn();
    } catch (error) {
      console.error('Error caught in tryCatch:', error);
      return fallback;
    }
  }
  
  /**
   * Error reporter function - can be configured to send errors to a monitoring service
   * 
   * @param error The error to report
   * @param context Additional context about the error
   */
  export function reportError(error: Error | AppError, context: Record<string, any> = {}) {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.group('Application Error:');
      console.error(error);
      console.info('Context:', context);
      console.groupEnd();
      return;
    }
    
    // In production, this could send to an error monitoring service
    // Example: sendToErrorService(error, context);
    console.error('Application Error:', error, context);
  }
  
  /**
   * Create a version of a function that catches errors and reports them
   * 
   * @param fn The function to wrap
   * @param errorHandler Optional custom error handler
   * @returns The wrapped function
   */
  export function withErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    errorHandler?: (error: Error, ...args: Parameters<T>) => ReturnType<T>
  ): (...args: Parameters<T>) => ReturnType<T> {
    return (...args: Parameters<T>): ReturnType<T> => {
      try {
        return fn(...args);
      } catch (error) {
        if (errorHandler && error instanceof Error) {
          return errorHandler(error, ...args);
        }
        
        reportError(
          error instanceof Error ? error : new Error(String(error)),
          { functionName: fn.name, arguments: args }
        );
        
        throw error;
      }
    };
  }