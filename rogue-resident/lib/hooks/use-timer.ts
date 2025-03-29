'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime } from '@/lib/utils/game-utils';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

/**
 * Props for the useTimer hook
 */
export interface UseTimerProps {
  initialTime: number;
  onFinish?: () => void;
  autoStart?: boolean;
  tickRate?: number;
}

/**
 * Return type for the useTimer hook
 */
export interface UseTimerReturn {
  time: number;
  formattedTime: string;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  percentRemaining: number;
}

/**
 * Custom hook for managing a countdown timer
 * 
 * @param initialTime Initial time in seconds
 * @param onFinish Optional callback to run when timer finishes
 * @param autoStart Whether to start the timer automatically
 * @param tickRate How often to update the timer in milliseconds
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
  
  // Calculate percentage of time remaining
  const percentRemaining = tryCatch(
    () => (time / initialTime) * 100,
    100,
    ErrorCode.TIMER_ERROR
  );
  
  // Format the time to a readable string
  const formattedTime = tryCatch(
    () => formatTime(time),
    formatTime(initialTime),
    ErrorCode.TIMER_ERROR
  );
  
  // Start the timer
  const start = useCallback(() => {
    tryCatch(() => {
      if (time <= 0) return;
      setIsRunning(true);
    }, undefined, ErrorCode.TIMER_ERROR);
  }, [time]);
  
  // Pause the timer
  const pause = useCallback(() => {
    tryCatch(() => {
      setIsRunning(false);
    }, undefined, ErrorCode.TIMER_ERROR);
  }, []);
  
  // Reset the timer
  const reset = useCallback(() => {
    tryCatch(() => {
      setTime(initialTime);
      setIsRunning(false);
    }, undefined, ErrorCode.TIMER_ERROR);
  }, [initialTime]);
  
  // Manage the timer interval
  useEffect(() => {
    const cleanup = () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    if (isRunning) {
      intervalIdRef.current = setInterval(() => {
        setTime(prevTime => {
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