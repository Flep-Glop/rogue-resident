'use client';

import { useState, useEffect, useCallback } from 'react';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

/**
 * Options for the useKeyPress hook
 */
interface UseKeyPressOptions {
  /** Require Ctrl key to be pressed */
  ctrl?: boolean;
  /** Require Alt key to be pressed */
  alt?: boolean;
  /** Require Shift key to be pressed */
  shift?: boolean;
  /** Require Meta key (Command on Mac, Windows key on Windows) to be pressed */
  meta?: boolean;
  /** Callback to run when key is pressed down */
  onKeyDown?: (e: KeyboardEvent) => void;
  /** Callback to run when key is released */
  onKeyUp?: (e: KeyboardEvent) => void;
}

/**
 * Hook to detect when a specific key is pressed
 * 
 * Tracks key press state and handles modifiers like Ctrl, Alt, Shift, and Meta.
 * 
 * @param targetKey - The key to detect (e.g., 'Escape', 'Enter', 'a')
 * @param options - Additional options for modifiers and callbacks
 * @returns keyPressed - Whether the key is currently pressed
 */
export function useKeyPress(
  targetKey: string,
  options: UseKeyPressOptions = {}
): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);
  
  /**
   * Helper to check if modifiers match requirements
   */
  const checkModifiers = useCallback(
    (e: KeyboardEvent): boolean => {
      if (options.ctrl !== undefined && e.ctrlKey !== options.ctrl) return false;
      if (options.alt !== undefined && e.altKey !== options.alt) return false;
      if (options.shift !== undefined && e.shiftKey !== options.shift) return false;
      if (options.meta !== undefined && e.metaKey !== options.meta) return false;
      return true;
    },
    [options]
  );
  
  /**
   * Handle key down events
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      tryCatch(() => {
        if (e.key === targetKey && checkModifiers(e)) {
          setKeyPressed(true);
          options.onKeyDown?.(e);
        }
      }, undefined, ErrorCode.KEY_PRESS_ERROR);
    },
    [targetKey, checkModifiers, options]
  );
  
  /**
   * Handle key up events
   */
  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      tryCatch(() => {
        if (e.key === targetKey && checkModifiers(e)) {
          setKeyPressed(false);
          options.onKeyUp?.(e);
        }
      }, undefined, ErrorCode.KEY_PRESS_ERROR);
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
 * Configuration for a keyboard shortcut
 */
interface ShortcutConfig {
  /** Function to call when the shortcut is triggered */
  handler: () => void;
  /** Require Ctrl key */
  ctrl?: boolean;
  /** Require Alt key */
  alt?: boolean;
  /** Require Shift key */
  shift?: boolean;
  /** Require Meta key (Command on Mac, Windows key on Windows) */
  meta?: boolean;
  /** Whether to prevent default browser behavior */
  preventDefault?: boolean;
}

/**
 * Hook to detect keyboard shortcuts
 * 
 * @param shortcutMap - Map of keyboard shortcuts to handlers
 */
export function useKeyboardShortcuts(
  shortcutMap: Record<string, ShortcutConfig>
): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      tryCatch(() => {
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
      }, undefined, ErrorCode.KEYBOARD_SHORTCUT_ERROR);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcutMap]);
}