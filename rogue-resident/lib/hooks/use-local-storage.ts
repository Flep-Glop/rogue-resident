'use client';

import { useState, useEffect, useCallback } from 'react';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

/**
 * Hook for using localStorage with a synchronized state value
 * 
 * Provides a way to store and retrieve values from localStorage with
 * automatic serialization/deserialization and React state synchronization.
 * 
 * @param key - The key to store in localStorage
 * @param initialValue - The initial value if no value exists
 * @returns [storedValue, setValue, removeValue] - Tuple containing current value, setter, and removal function
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  /**
   * Helper function to safely get value from localStorage
   */
  const readValue = useCallback((): T => {
    // Prevent build errors on server
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    return tryCatch(() => {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    }, initialValue, ErrorCode.LOCAL_STORAGE_READ_ERROR);
  }, [initialValue, key]);
  
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  
  // Read initial value from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStoredValue(readValue());
    }
  }, [readValue]);
  
  /**
   * Return a wrapped version of useState's setter function that
   * persists the new value to localStorage
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)): void => {
      tryCatch(() => {
        // Allow value to be a function for same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }, undefined, ErrorCode.LOCAL_STORAGE_WRITE_ERROR);
    },
    [key, storedValue]
  );
  
  /**
   * Remove value from localStorage and reset state to initial value
   */
  const removeValue = useCallback((): void => {
    tryCatch(() => {
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      // Reset state to initial value
      setStoredValue(initialValue);
    }, undefined, ErrorCode.LOCAL_STORAGE_REMOVE_ERROR);
  }, [initialValue, key]);
  
  return [storedValue, setValue, removeValue];
}