'use client';

import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm',
  {
    variants: {
      // Different button styles
      variant: {
        // Primary button
        primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700',
        // Secondary button
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        // Destructive button for actions like delete
        destructive: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700',
        // Outline button
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-100',
        // Ghost button (transparent background)
        ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-100',
        // Link style button
        link: 'bg-transparent underline-offset-4 hover:underline text-blue-600 dark:text-blue-500 p-0 shadow-none',
        // 8-bit style buttons for game theme
        pixel: 'border-2 border-black bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 pixel-corners',
        // Node type specific buttons
        clinical: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
        qa: 'bg-gray-700 text-white hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700',
        educational: 'bg-green-700 text-white hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700',
        storage: 'bg-amber-700 text-white hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700',
        vendor: 'bg-indigo-700 text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700',
        boss: 'bg-red-700 text-white hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700',
      },
      // Different button sizes
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 rounded-md',
        lg: 'h-12 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

// Define props for the Button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Create the Button component
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };