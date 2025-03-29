'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

// Progress container variants
const progressContainerVariants = cva(
  "relative w-full overflow-hidden rounded-full h-2.5",
  {
    variants: {
      variant: {
        default: "bg-slate-700",
        clinical: "bg-slate-700",
        qa: "bg-slate-700",
        educational: "bg-slate-700",
        storage: "bg-slate-700",
        vendor: "bg-slate-700",
        boss: "bg-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Progress indicator variants
const progressIndicatorVariants = cva(
  "h-full w-full flex-1 transition-all rounded-full",
  {
    variants: {
      variant: {
        default: "bg-slate-500",
        clinical: "bg-clinical",
        qa: "bg-qa",
        educational: "bg-educational",
        storage: "bg-storage",
        vendor: "bg-vendor",
        boss: "bg-boss",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// Progress props
export interface ProgressProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressContainerVariants> {
  value?: number
  max?: number
  showValue?: boolean
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, variant, value = 0, max = 100, showValue = false, ...props }, ref) => {
    // Calculate percentage completion
    const percentage = Math.min(Math.max(0, (value / max) * 100), 100)
    
    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(progressContainerVariants({ variant }), className)}
          {...props}
        >
          <div 
            className={cn(progressIndicatorVariants({ variant }))} 
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {showValue && (
          <div className="flex justify-between mt-1 text-xs">
            <span className="text-slate-400">{value}</span>
            <span className="text-slate-400">{max}</span>
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }