'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if a media query matches
 * 
 * @param query Media query string to evaluate
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with the match status in client-side only
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Initial check
    const media = window.matchMedia(query);
    setMatches(media.matches);

    // Create listener for changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

/**
 * Hook for responsive design breakpoints
 * 
 * @returns Object containing boolean values for each breakpoint
 */
export function useBreakpoints() {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Helper to get current breakpoint name
    current: isMobile 
      ? 'mobile' 
      : isTablet 
        ? 'tablet' 
        : isLargeDesktop 
          ? 'largeDesktop' 
          : 'desktop'
  };
}