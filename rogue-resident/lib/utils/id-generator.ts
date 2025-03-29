/**
 * Simple ID generator with optional prefix and random component
 * 
 * @param prefix Optional string prefix for the ID
 * @param length Length of the random part (defaults to 8)
 * @returns Generated ID string
 */
export function generateId(prefix?: string, length: number = 8): string {
    // Create random component
    const randomPart = Math.random().toString(36).substring(2, 2 + length);
    
    // Create timestamp component (first 6 chars of timestamp in base 36)
    const timestampPart = Date.now().toString(36).substring(0, 6);
    
    // Combine parts
    return prefix 
      ? `${prefix}_${timestampPart}${randomPart}` 
      : `${timestampPart}${randomPart}`;
  }
  
  /**
   * Generate a deterministic ID based on input string
   * Useful for creating consistent IDs for the same entity
   * 
   * @param input String to generate ID from
   * @param prefix Optional prefix for the ID
   * @returns Deterministic ID string
   */
  export function generateDeterministicId(input: string, prefix?: string): string {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Convert hash to positive base 36 string
    const hashString = Math.abs(hash).toString(36);
    
    return prefix ? `${prefix}_${hashString}` : hashString;
  }
  
  /**
   * Generate a sequential ID with optional prefix
   * 
   * @param prefix Prefix for the ID
   * @param sequence Sequential number
   * @param padLength Length to pad the sequence number to
   * @returns Sequential ID string
   */
  export function generateSequentialId(
    prefix: string, 
    sequence: number, 
    padLength: number = 3
  ): string {
    // Pad sequence number with leading zeros
    const paddedSequence = sequence.toString().padStart(padLength, '0');
    
    return `${prefix}_${paddedSequence}`;
  }
  
  /**
   * Generate a UUID v4
   * 
   * @returns UUID string
   */
  export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * Generate a short ID (for user-facing IDs)
   * 
   * @param length Length of the ID (defaults to 6)
   * @returns Short ID string
   */
  export function generateShortId(length: number = 6): string {
    // Use only alphanumeric characters that are unambiguous
    // (no 0/O, 1/I/l, etc.)
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    
    return result;
  }