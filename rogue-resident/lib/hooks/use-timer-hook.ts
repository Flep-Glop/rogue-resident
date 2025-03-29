'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatTime } from '@/lib/utils/game-utils'

interface UseTimerProps {
  initialTime: number
  onFinish?: () => void
  autoStart?: boolean
  tickRate?: number
}

interface UseTimerReturn {
  time: number
  formattedTime: string
  isRunning: boolean
  start: () => void
  pause: () => void
  reset: () => void
  percentRemaining: number
}

/**
 * Custom hook for managing a countdown timer
 */
export function useTimer({
  initialTime,
  onFinish,
  autoStart = false,
  tickRate = 1000
}: UseTimerProps): UseTimerReturn {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(autoStart)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  
  // Calculate percentage of time remaining
  const percentRemaining = (time / initialTime) * 100
  
  // Format the time to a readable string
  const formattedTime = formatTime(time)
  
  // Start the timer
  const start = useCallback(() => {
    if (time <= 0) return
    
    setIsRunning(true)
  }, [time])
  
  // Pause the timer
  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])
  
  // Reset the timer
  const reset = useCallback(() => {
    setTime(initialTime)
    setIsRunning(false)
  }, [initialTime])
  
  // Manage the timer interval
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(id)
            setIsRunning(false)
            onFinish?.()
            return 0
          }
          return prevTime - 1
        })
      }, tickRate)
      
      setIntervalId(id)
    } else if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [isRunning, tickRate, onFinish, intervalId])
  
  return {
    time,
    formattedTime,
    isRunning,
    start,
    pause,
    reset,
    percentRemaining
  }
}
