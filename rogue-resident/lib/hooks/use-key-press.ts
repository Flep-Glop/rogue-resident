'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect when a specific key is pressed
 * 
 * @param targetKey - The key to detect (e.g., 'Escape', 'Enter', 'a')
 * @param options - Additional options
 * @returns keyPressed - Whether the key is currently pressed
 */
export function useKeyPress(
  targetKey: string,
  options: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
    onKeyDown?: (e: KeyboardEvent) => void;
    onKeyUp?: (e: KeyboardEvent) => void;
  } = {}
) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Helper to check if modifiers match requirements
  const checkModifiers = useCallback(
    (e: KeyboardEvent) => {
      if (options.ctrl !== undefined && e.ctrlKey !== options.ctrl) return false;
      if (options.alt !== undefined && e.altKey !== options.alt) return false;
      if (options.shift !== undefined && e.shiftKey !== options.shift) return false;
      if (options.meta !== undefined && e.metaKey !== options.meta) return false;
      return true;
    },
    [options]
  );
  
  // Handle key down events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === targetKey && checkModifiers(e)) {
        setKeyPressed(true);
        options.onKeyDown?.(e);
      }
    },
    [targetKey, checkModifiers, options]
  );
  
  // Handle key up events
  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === targetKey && checkModifiers(e)) {
        setKeyPressed(false);
        options.onKeyUp?.(e);
      }
    },
    [targetKey, checkModifiers, options]
  );
  
  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]); // Only re-run if key handler functions change
  
  return keyPressed;
}

/**
 * Hook to detect keyboard shortcuts
 * 
 * @param shortcutMap - Map of keyboard shortcuts to handlers
 */
export function useKeyboardShortcuts(
  shortcutMap: Record<
    string,
    {
      handler: () => void;
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
      meta?: boolean;
      preventDefault?: boolean;
    }
  >
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      Object.entries(shortcutMap).forEach(([key, config]) => {
        const { handler, ctrl, alt, shift, meta, preventDefault } = config;
        
        // Check if modifiers match
        const modifiersMatch =
          (ctrl === undefined || e.ctrlKey === ctrl) &&
          (alt === undefined || e.altKey === alt) &&
          (shift === undefined || e.shiftKey === shift) &&
          (meta === undefined || e.metaKey === meta);
        
        // If key and modifiers match, execute handler
        if (e.key === key && modifiersMatch) {
          if (preventDefault) {
            e.preventDefault();
          }
          handler();
        }
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutMap]);
}