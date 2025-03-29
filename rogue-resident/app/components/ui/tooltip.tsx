'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils/cn'

interface TooltipProps {
  children: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
  contentClassName?: string
}

export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 300,
  className,
  contentClassName
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [portalElement, setPortalElement] = useState<Element | null>(null)
  const [style, setStyle] = useState({
    top: 0,
    left: 0
  })
  
  const childRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Set up the portal element
  useEffect(() => {
    setPortalElement(document.body)
  }, [])
  
  // Handle mouse events
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
      updatePosition()
    }, delay)
  }
  
  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 100)
  }
  
  // Update tooltip position
  const updatePosition = () => {
    if (!childRef.current || !tooltipRef.current) return
    
    const childRect = childRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft
    
    let top = 0
    let left = 0
    
    switch (position) {
      case 'top':
        top = childRect.top + scrollTop - tooltipRect.height - 8
        left = childRect.left + scrollLeft + (childRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'bottom':
        top = childRect.bottom + scrollTop + 8
        left = childRect.left + scrollLeft + (childRect.width / 2) - (tooltipRect.width / 2)
        break
      case 'left':
        top = childRect.top + scrollTop + (childRect.height / 2) - (tooltipRect.height / 2)
        left = childRect.left + scrollLeft - tooltipRect.width - 8
        break
      case 'right':
        top = childRect.top + scrollTop + (childRect.height / 2) - (tooltipRect.height / 2)
        left = childRect.right + scrollLeft + 8
        break
    }
    
    // Keep tooltip within viewport
    const padding = 8
    
    if (left < padding) {
      left = padding
    } else if (left + tooltipRect.width > window.innerWidth - padding) {
      left = window.innerWidth - tooltipRect.width - padding
    }
    
    if (top < padding) {
      top = padding
    } else if (top + tooltipRect.height > window.innerHeight - padding) {
      top = window.innerHeight - tooltipRect.height - padding
    }
    
    setStyle({ top, left })
  }
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])
  
  // Update position when the window is resized
  useEffect(() => {
    if (!isVisible) return
    
    const handleResize = () => {
      updatePosition()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible])
  
  // Get arrow direction class
  const getArrowClass = () => {
    switch (position) {
      case 'top': return 'before:bottom-[-4px] before:border-t-slate-900'
      case 'bottom': return 'before:top-[-4px] before:border-b-slate-900'
      case 'left': return 'before:right-[-4px] before:border-l-slate-900'
      case 'right': return 'before:left-[-4px] before:border-r-slate-900'
    }
  }
  
  return (
    <>
      <div
        ref={childRef}
        className={cn("inline-block", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      
      {isVisible && portalElement && createPortal(
        <div
          ref={tooltipRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "fixed z-50 bg-slate-900 text-white text-sm rounded py-1 px-2 pointer-events-none max-w-xs",
            "before:absolute before:w-0 before:h-0 before:border-4 before:border-transparent",
            getArrowClass(),
            contentClassName
          )}
          style={{
            top: `${style.top}px`,
            left: `${style.left}px`,
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.2s'
          }}
        >
          {content}
        </div>,
        portalElement
      )}
    </>
  )
}