'use client'

import { useState, useEffect, forwardRef, HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'

// Notification variants
const notificationVariants = cva(
  "p-4 rounded-lg shadow-lg transform transition-all max-w-sm border-l-4 relative mb-2",
  {
    variants: {
      variant: {
        default: "bg-slate-800 border-slate-600",
        success: "bg-slate-800 border-green-500",
        error: "bg-slate-800 border-red-500",
        warning: "bg-slate-800 border-yellow-500",
        info: "bg-slate-800 border-blue-500",
        clinical: "bg-slate-800 border-clinical",
        qa: "bg-slate-800 border-qa",
        educational: "bg-slate-800 border-educational",
        storage: "bg-slate-800 border-storage",
        vendor: "bg-slate-800 border-vendor",
        boss: "bg-slate-800 border-boss",
      },
      visible: {
        true: "translate-y-0 opacity-100",
        false: "translate-y-[-16px] opacity-0 pointer-events-none"
      }
    },
    defaultVariants: {
      variant: "default",
      visible: true
    }
  }
)

// Progress bar variants
const progressVariants = cva(
  "h-1 absolute bottom-0 left-0 right-0 transition-all",
  {
    variants: {
      variant: {
        default: "bg-slate-600",
        success: "bg-green-500",
        error: "bg-red-500",
        warning: "bg-yellow-500",
        info: "bg-blue-500",
        clinical: "bg-clinical",
        qa: "bg-qa",
        educational: "bg-educational",
        storage: "bg-storage",
        vendor: "bg-vendor",
        boss: "bg-boss",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

// Notification props
export interface NotificationProps extends HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof notificationVariants> {
  title?: string
  message: string
  duration?: number
  onClose?: () => void
  hasProgress?: boolean
}

// Auto-incrementing ID for notifications
let notificationId = 0

// Notification component
const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({ 
    className, 
    variant, 
    visible = true,
    title, 
    message, 
    duration = 5000, 
    onClose,
    hasProgress = true,
    ...props 
  }, ref) => {
    const [progress, setProgress] = useState(100)
    const [isVisible, setIsVisible] = useState(visible)
    
    // Start the auto-close timer
    useEffect(() => {
      if (duration <= 0) return
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100))
          return Math.max(newProgress, 0)
        })
      }, 100)
      
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      
      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }, [duration])
    
    // Handle notification close
    const handleClose = () => {
      setIsVisible(false)
      
      // Call the onClose callback after animation
      setTimeout(() => {
        onClose?.()
      }, 300)
    }
    
    return (
      <div
        ref={ref}
        className={cn(notificationVariants({ variant, visible: isVisible }), className)}
        role="alert"
        {...props}
      >
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-1 right-1 text-slate-400 hover:text-slate-200 p-1"
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Content */}
        <div className="pr-6">
          {title && (
            <h4 className="font-pixel text-white mb-1">{title}</h4>
          )}
          <p className="text-slate-200 text-sm">{message}</p>
        </div>
        
        {/* Progress bar */}
        {hasProgress && duration > 0 && (
          <div 
            className={cn(progressVariants({ variant }))}
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    )
  }
)
Notification.displayName = "Notification"

// Root notification container for all notifications
function NotificationRoot({ children }: { children: React.ReactNode }) {
  const [portalElement, setPortalElement] = useState<Element | null>(null)
  
  useEffect(() => {
    // Create container if it doesn't exist
    let container = document.getElementById('notification-root')
    
    if (!container) {
      container = document.createElement('div')
      container.id = 'notification-root'
      container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2'
      document.body.appendChild(container)
    }
    
    setPortalElement(container)
    
    return () => {
      // Only remove if empty
      if (container?.childElementCount === 0) {
        container.remove()
      }
    }
  }, [])
  
  if (!portalElement) return null
  
  return createPortal(children, portalElement)
}

// Custom hook to create notifications
export function useNotification() {
  const [notifications, setNotifications] = useState<React.ReactElement[]>([])
  
  const showNotification = (props: NotificationProps) => {
    const id = notificationId++
    
    const removeNotification = () => {
      setNotifications(prev => prev.filter(notification => notification.key !== `notification-${id}`))
    }
    
    const newNotification = (
      <Notification
        key={`notification-${id}`}
        {...props}
        onClose={() => {
          props.onClose?.()
          removeNotification()
        }}
      />
    )
    
    setNotifications(prev => [...prev, newNotification])
    
    // Return a function to manually close the notification
    return removeNotification
  }
  
  // Helper methods for common notifications
  const success = (message: string, options?: Partial<NotificationProps>) => 
    showNotification({ variant: 'success', message, ...options })
  
  const error = (message: string, options?: Partial<NotificationProps>) => 
    showNotification({ variant: 'error', message, ...options })
  
  const warning = (message: string, options?: Partial<NotificationProps>) => 
    showNotification({ variant: 'warning', message, ...options })
  
  const info = (message: string, options?: Partial<NotificationProps>) => 
    showNotification({ variant: 'info', message, ...options })
  
  // Render the notification container and all active notifications
  const NotificationContainer = () => {
    if (notifications.length === 0) return null
    
    return <NotificationRoot>{notifications}</NotificationRoot>
  }
  
  return {
    showNotification,
    success,
    error,
    warning,
    info,
    NotificationContainer
  }
}

export { Notification, NotificationRoot }