'use client'

import { forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

// Badge variants
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-pixel font-medium",
  {
    variants: {
      variant: {
        default: "bg-slate-700 text-slate-300",
        clinical: "bg-clinical text-white",
        qa: "bg-qa text-white",
        educational: "bg-educational text-white", 
        storage: "bg-storage text-slate-800",
        vendor: "bg-vendor text-white",
        boss: "bg-boss text-white",
        
        // Status variants
        success: "bg-green-600 text-white",
        warning: "bg-yellow-600 text-white",
        danger: "bg-red-600 text-white",
        info: "bg-blue-600 text-white",
        
        // Item rarity variants
        common: "bg-slate-600 text-slate-300",
        uncommon: "bg-green-800 text-green-300",
        rare: "bg-blue-800 text-blue-300",
        legendary: "bg-purple-800 text-purple-300",
        
        // Outline variants
        outlineDefault: "bg-transparent border border-slate-700 text-slate-300",
        outlineClinical: "bg-transparent border border-clinical text-clinical",
        outlineQA: "bg-transparent border border-qa text-qa",
        outlineEducational: "bg-transparent border border-educational text-educational",
        outlineStorage: "bg-transparent border border-storage text-storage",
        outlineVendor: "bg-transparent border border-vendor text-vendor",
        outlineBoss: "bg-transparent border border-boss text-boss",
      },
      pixelated: {
        true: "pixel-corners",
        false: ""
      }
    },
    defaultVariants: {
      variant: "default",
      pixelated: false,
    },
  }
)

// Badge props
export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, pixelated, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, pixelated }), className)}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }