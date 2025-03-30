// lib/utils/id-generator.ts
'use client';

import { tryCatch, ErrorCode } from './error-handlers';

/**
 * Simple ID generator with optional prefix and random component
 * 
 * @param prefix Optional string prefix for the ID
 * @param length Length of the random part (defaults to 8)
 * @returns Generated ID string
 */
export function generateId(prefix?: string, length: number = 8): string {
  return tryCatch(() => {
    // Create random component
    const randomPart = Math.random().toString(36).substring(2, 2 + length);
    
    // Create timestamp component (first 6 chars of timestamp in base 36)
    const timestampPart = Date.now().toString(36).substring(0, 6);
    
    // Combine parts
    return prefix 
      ? `${prefix}_${timestampPart}${randomPart}` 
      : `${timestampPart}${randomPart}`;
  }, `id_${Date.now()}`, ErrorCode.ID_GENERATION_ERROR);
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
  return tryCatch(() => {
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
  }, prefix ? `${prefix}_fallback` : 'fallback_id', ErrorCode.ID_GENERATION_ERROR);
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
  return tryCatch(() => {
    // Pad sequence number with leading zeros
    const paddedSequence = sequence.toString().padStart(padLength, '0');
    
    return `${prefix}_${paddedSequence}`;
  }, `${prefix}_${sequence}`, ErrorCode.ID_GENERATION_ERROR);
}

/**
 * Generate a UUID v4
 * 
 * @returns UUID string
 */
export function generateUUID(): string {
  return tryCatch(() => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }, `fallback-uuid-${Date.now()}`, ErrorCode.ID_GENERATION_ERROR);
}

/**
 * Generate a short ID (for user-facing IDs)
 * 
 * @param length Length of the ID (defaults to 6)
 * @returns Short ID string
 */
export function generateShortId(length: number = 6): string {
  return tryCatch(() => {
    // Use only alphanumeric characters that are unambiguous
    // (no 0/O, 1/I/l, etc.)
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    
    return result;
  }, `ID${Date.now().toString().substring(8)}`, ErrorCode.ID_GENERATION_ERROR);
}

/**
 * Generate a consistent node ID based on floor, position and type
 * 
 * @param floorLevel Floor level
 * @param position Position index on the floor
 * @param nodeType Type of the node
 * @returns Node ID
 */
export function generateNodeId(floorLevel: number, position: number, nodeType: string): string {
  return tryCatch(() => {
    const floorPart = `f${floorLevel}`;
    const posPart = `p${position.toString().padStart(2, '0')}`;
    const typePart = nodeType.substring(0, 3);
    
    return `${floorPart}_${posPart}_${typePart}`;
  }, `node_${floorLevel}_${position}`, ErrorCode.ID_GENERATION_ERROR);
}

/**
 * Generate a consistent challenge ID based on node ID and challenge type
 * 
 * @param nodeId ID of the node containing the challenge
 * @param challengeType Type of challenge
 * @returns Challenge ID
 */
export function generateChallengeId(nodeId: string, challengeType: string): string {
  return tryCatch(() => {
    return `${nodeId}_${challengeType}_${Date.now().toString(36).substring(4)}`;
  }, `challenge_${nodeId}`, ErrorCode.ID_GENERATION_ERROR);
}

/**
 * Generate a save ID for game saves
 * 
 * @param isAutosave Whether this is an autosave
 * @returns Save ID
 */
export function generateSaveId(isAutosave: boolean = false): string {
  return tryCatch(() => {
    const prefix = isAutosave ? 'auto' : 'save';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6);
    
    return `${prefix}_${timestamp}_${random}`;
  }, `save_${Date.now()}`, ErrorCode.ID_GENERATION_ERROR);
}