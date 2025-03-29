'use client';

import { useState, useEffect } from 'react';
import { tryCatch, ErrorCode } from '@/lib/utils/error-handlers';

/**
 * Hook to detect if a media query matches
 * 
 * @param query - Media query string to evaluate
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with false to avoid server/client mismatch
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check for browser environment
    if (typeof window === 'undefined') return;
    
    const mediaQueryHandler = (): void => {
      tryCatch(() => {
        // Create media query list
        const media = window.matchMedia(query);
        
        // Set initial value
        setMatches(media.matches);
      }, undefined, ErrorCode.MEDIA_QUERY_ERROR);
    };
    
    // Initial check
    mediaQueryHandler();
    
    // Create listener for changes
    const handleChange = (e: MediaQueryListEvent): void => {
      tryCatch(() => {
        setMatches(e.matches);
      }, undefined, ErrorCode.MEDIA_QUERY_ERROR);
    };
    
    // Get the media query list
    const media = window.matchMedia(query);
    
    // Add listener
    media.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Type for breakpoint names
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'largeDesktop';

/**
 * Return type for the useBreakpoints hook
 */
export interface BreakpointState {
  /** Whether the viewport is mobile-sized (< 640px) */
  isMobile: boolean;
  /** Whether the viewport is tablet-sized (640px - 1023px) */
  isTablet: boolean;
  /** Whether the viewport is desktop-sized (>= 1024px) */
  isDesktop: boolean;
  /** Whether the viewport is large desktop-sized (>= 1280px) */
  isLargeDesktop: boolean;
  /** The current breakpoint name */
  current: Breakpoint;
}

/**
 * Hook for responsive design breakpoints
 * 
 * @returns Object containing boolean values for each breakpoint and current breakpoint name
 */
export function useBreakpoints(): BreakpointState {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  // Determine current breakpoint name
  const current: Breakpoint = isMobile 
    ? 'mobile' 
    : isTablet 
      ? 'tablet' 
      : isLargeDesktop 
        ? 'largeDesktop' 
        : 'desktop';
        
  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    current
  };
}