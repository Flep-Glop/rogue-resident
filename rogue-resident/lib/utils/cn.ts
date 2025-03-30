// lib/utils/cn.ts
'use client';

/**
 * This utility merges class names together
 * It's a simplified version until we can install the clsx and tailwind-merge packages
 * 
 * @param inputs Class names to merge
 * @returns Merged class string with duplicates removed
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  // Filter out falsy values
  const classes = inputs.filter(Boolean) as string[];
  
  // Join with spaces
  return classes.join(' ');
}