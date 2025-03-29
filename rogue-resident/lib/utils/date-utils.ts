/**
 * Format a date as a relative time string
 * Similar to date-fns formatDistanceToNow but simplified
 */
export function formatDistanceToNow(date: Date, options: { addSuffix?: boolean } = {}): string {
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    // Time measurements in seconds
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365
    
    // Helper to format a time distance
    const formatDistance = (value: number, unit: string, isPast: boolean): string => {
      if (!options.addSuffix) {
        return `${value} ${unit}${value !== 1 ? 's' : ''}`
      }
      
      return isPast
        ? `${value} ${unit}${value !== 1 ? 's' : ''} ago`
        : `in ${value} ${unit}${value !== 1 ? 's' : ''}`
    }
    
    // Calculate the appropriate time unit
    const isPast = seconds > 0
    const absSeconds = Math.abs(seconds)
    
    if (absSeconds < minute) {
      return isPast ? 'just now' : 'in a moment'
    } else if (absSeconds < hour) {
      const value = Math.floor(absSeconds / minute)
      return formatDistance(value, 'minute', isPast)
    } else if (absSeconds < day) {
      const value = Math.floor(absSeconds / hour)
      return formatDistance(value, 'hour', isPast)
    } else if (absSeconds < week) {
      const value = Math.floor(absSeconds / day)
      return formatDistance(value, 'day', isPast)
    } else if (absSeconds < month) {
      const value = Math.floor(absSeconds / week)
      return formatDistance(value, 'week', isPast)
    } else if (absSeconds < year) {
      const value = Math.floor(absSeconds / month)
      return formatDistance(value, 'month', isPast)
    } else {
      const value = Math.floor(absSeconds / year)
      return formatDistance(value, 'year', isPast)
    }
  }
  
  /**
   * Format a date as a simple date string (e.g. "Jan 1, 2023")
   */
  export function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  /**
   * Format a date as a time string (e.g. "12:34 PM")
   */
  export function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }
  
  /**
   * Format a date as a date and time string (e.g. "Jan 1, 2023, 12:34 PM")
   */
  export function formatDateTime(date: Date): string {
    return `${formatDate(date)}, ${formatTime(date)}`
  }