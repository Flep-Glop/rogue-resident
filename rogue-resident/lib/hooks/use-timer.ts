'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

/**
 * Props for the useTimer hook
 */
export interface UseTimerProps {
  /** Initial time in seconds */
  initialTime: number;
  /** Optional callback to run when timer finishes */
  onFinish?: () => void;
  /** Whether to start the timer automatically */
  autoStart?: boolean;
  /** How often to update the timer in milliseconds */
  tickRate?: number;
}

/**
 * Return type for the useTimer hook
 */
export interface UseTimerReturn {
  /** Current time remaining in seconds */
  time: number;
  /** Formatted time string (MM:SS) */
  formattedTime: string;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset the timer to initialTime */
  reset: () => void;
  /** Percentage of time remaining (0-100) */
  percentRemaining: number;
}

/**
 * Formats time in seconds to MM:SS format
 * 
 * @param seconds - Time in seconds to format
 * @returns Formatted time string
 */
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Custom hook for managing a countdown timer
 * 
 * Provides a timer with start, pause, and reset functionality, formatted time output,
 * and automatic callback when the timer reaches zero.
 * 
 * @param props - Timer configuration props
 * @returns Timer state and control methods
 */
export function useTimer({
  initialTime,
  onFinish,
  autoStart = false,
  tickRate = 1000
}: UseTimerProps): UseTimerReturn {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const onFinishRef = useRef(onFinish);
  
  // Update the onFinish ref when the prop changes
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);
  
  /**
   * Calculate percentage of time remaining
   */
  const percentRemaining = tryCatch(
    () => Math.max(0, Math.min(100, (time / initialTime) * 100)),
    100,
    ErrorCode.TIMER_ERROR
  );
  
  /**
   * Format the time to a readable string
   */
  const formattedTime = tryCatch(
    () => formatTime(time),
    formatTime(initialTime),
    ErrorCode.TIMER_ERROR
  );
  
  /**
   * Start the timer if it's not already running and has time remaining
   */
  const start = useCallback((): void => {
    tryCatch(() => {
      if (time <= 0 || isRunning) return;
      setIsRunning(true);
    }, undefined, ErrorCode.TIMER_START_ERROR);
  }, [time, isRunning]);
  
  /**
   * Pause the timer
   */
  const pause = useCallback((): void => {
    tryCatch(() => {
      setIsRunning(false);
    }, undefined, ErrorCode.TIMER_PAUSE_ERROR);
  }, []);
  
  /**
   * Reset the timer to initialTime and stop it
   */
  const reset = useCallback((): void => {
    tryCatch(() => {
      setTime(initialTime);
      setIsRunning(false);
    }, undefined, ErrorCode.TIMER_RESET_ERROR);
  }, [initialTime]);
  
  // Manage the timer interval
  useEffect(() => {
    // Cleanup function to clear interval
    const cleanup = (): void => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    if (isRunning) {
      // Set up interval to decrement time
      intervalIdRef.current = setInterval(() => {
        setTime(prevTime => {
          // When time reaches zero or less, clean up and call onFinish
          if (prevTime <= 1) {
            cleanup();
            setIsRunning(false);
            if (onFinishRef.current) {
              onFinishRef.current();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, tickRate);
    } else {
      cleanup();
    }
    
    // Clean up on unmount or when dependencies change
    return cleanup;
  }, [isRunning, tickRate]);
  
  return {
    time,
    formattedTime,
    isRunning,
    start,
    pause,
    reset,
    percentRemaining
  };
}