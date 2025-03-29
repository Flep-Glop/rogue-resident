'use client'

import { forwardRef, HTMLAttributes, ReactNode, useEffect } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

// Modal backdrop variants
const modalBackdropVariants = cva(
  "fixed inset-0 z-50 bg-black transition-all duration-200 flex items-center justify-center",
  {
    variants: {
      visible: {
        true: "bg-opacity-70",
        false: "bg-opacity-0 pointer-events-none"
      }
    },
    defaultVariants: {
      visible: false
    }
  }
)

// Modal container variants
const modalContainerVariants = cva(
  "relative bg-slate-800 border-2 rounded-lg shadow-xl transform transition-all max-h-[calc(100vh-2rem)] overflow-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-3xl",
        xl: "max-w-5xl",
        full: "max-w-full mx-4"
      },
      visible: {
        true: "scale-100 opacity-100",
        false: "scale-95 opacity-0"
      },
      variant: {
        default: "border-slate-700",
        clinical: "border-clinical",
        qa: "border-qa",
        educational: "border-educational",
        storage: "border-storage",
        vendor: "border-vendor",
        boss: "border-boss"
      }
    },
    defaultVariants: {
      size: "md",
      visible: false,
      variant: "default"
    }
  }
)

// Props for the main modal component
export interface ModalProps extends HTMLAttributes<HTMLDivElement>, 
  VariantProps<typeof modalContainerVariants> {
  isOpen: boolean
  onClose: () => void
  hideCloseButton?: boolean
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
  children: ReactNode
}

// Props for modal header
export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  closeButton?: boolean
  onClose?: () => void
}

// Props for modal content
export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {}

// Props for modal footer
export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

// Props for modal title
export interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

// Modal component
const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    isOpen, 
    onClose, 
    children, 
    className, 
    size, 
    variant, 
    hideCloseButton = false,
    closeOnEsc = true,
    closeOnOutsideClick = true,
    ...props 
  }, ref) => {
    // Handle escape key press
    useEffect(() => {
      if (!isOpen || !closeOnEsc) return
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose, closeOnEsc])
    
    // Handle outside click
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget && closeOnOutsideClick) {
        onClose()
      }
    }
    
    return (
      <div 
        className={modalBackdropVariants({ visible: isOpen })}
        onClick={handleBackdropClick}
      >
        <div
          ref={ref}
          className={cn(modalContainerVariants({ size, visible: isOpen, variant }), className)}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)
Modal.displayName = "Modal"

// Modal header component
const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, closeButton = true, onClose, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 bg-slate-900 flex justify-between items-center", className)}
        {...props}
      >
        <div className="flex-1">{children}</div>
        
        {closeButton && onClose && (
          <button 
            onClick={onClose}
            className="ml-4 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
ModalHeader.displayName = "ModalHeader"

// Modal content component
const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ModalContent.displayName = "ModalContent"

// Modal footer component
const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-6 py-4 bg-slate-900 bg-opacity-50 border-t border-slate-700 flex items-center justify-end space-x-3", className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ModalFooter.displayName = "ModalFooter"

// Modal title component
const ModalTitle = forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-xl font-pixel text-slate-200", className)}
        {...props}
      >
        {children}
      </h3>
    )
  }
)
ModalTitle.displayName = "ModalTitle"

export { Modal, ModalHeader, ModalContent, ModalFooter, ModalTitle }