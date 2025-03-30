// lib/utils/node-interaction.ts
'use client';

import { NodeType, NodeStatus, MapNode } from '../types/node-types';
import { ChallengeType, ChallengeGrade } from '../types/challenge-types';
import { tryCatch, ErrorCode } from './error-handlers';
import { calculateGrade, calculateInsightReward } from './game-utils';
import { getNodeClasses, getNodeTypeIcon } from './theme-utils';

/**
 * Map node types to their corresponding challenge types
 */
export const NODE_TO_CHALLENGE_TYPE: Record<NodeType, ChallengeType | null> = {
  clinical: 'clinical',
  qa: 'qa',
  educational: 'educational',
  boss: 'boss',
  storage: null,
  vendor: null,
  start: null
};

/**
 * Get information for a node interaction
 * @param node The node to interact with
 * @returns Node interaction information
 */
export function getNodeInteractionInfo(node: MapNode): {
  title: string;
  description: string;
  hasChallenges: boolean;
  challengeType: ChallengeType | null;
  availableStages: string[];
  customClasses: string;
  themeColors: { primary: string; secondary: string; text: string };
} {
  return tryCatch(() => {
    // Determine if this node type has challenges
    const challengeType = NODE_TO_CHALLENGE_TYPE[node.type];
    const hasChallenges = !!challengeType;
    
    // Get available stages for this node type
    const availableStages = getNodeStages(node.type);
    
    // Get custom classes for this node type
    const customClasses = getNodeClasses(node.type, node.status);
    
    // Get theme colors from CSS variables or fallback to defaults
    let themeColors = {
      primary: '#888',
      secondary: '#AAA',
      text: 'white'
    };
    
    if (typeof window !== 'undefined') {
      themeColors = {
        primary: getComputedStyle(document.documentElement)
          .getPropertyValue(`--${node.type}-primary`) || '#4A90E2',
        secondary: getComputedStyle(document.documentElement)
          .getPropertyValue(`--${node.type}-secondary`) || '#F4D03F',
        text: getComputedStyle(document.documentElement)
          .getPropertyValue(`--${node.type}-text`) || 'white'
      };
    }
    
    return {
      title: node.title,
      description: node.description,
      hasChallenges,
      challengeType,
      availableStages,
      customClasses,
      themeColors
    };
  }, {
    title: node.title || 'Unknown Node',
    description: node.description || 'No description available',
    hasChallenges: false,
    challengeType: null,
    availableStages: ['introduction', 'outcome'],
    customClasses: '',
    themeColors: { primary: '#888', secondary: '#AAA', text: 'white' }
  }, ErrorCode.NODE_INTERACTION_ERROR);
}

/**
 * Get stages for a specific node type
 * @param nodeType The node type
 * @returns Array of stage IDs
 */
export function getNodeStages(nodeType: NodeType): string[] {
  return tryCatch(() => {
    switch (nodeType) {
      case 'clinical':
      case 'qa':
      case 'educational':
      case 'boss':
        return ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
        
      case 'storage':
        return ['introduction', 'discovery', 'acquisition'];
        
      case 'vendor':
        return ['introduction', 'browsing', 'transaction'];
        
      case 'start':
        return ['introduction', 'preparation'];
        
      default:
        return ['introduction', 'outcome'];
    }
  }, ['introduction', 'outcome'], ErrorCode.NODE_STATE_ERROR);
}

/**
 * Calculate rewards for completing a node
 * @param node The completed node
 * @param grade The grade achieved (if applicable)
 * @returns Reward data
 */
export function calculateNodeRewards(node: MapNode, grade: ChallengeGrade | null = null) {
  return tryCatch(() => {
    // Start with base rewards from the node
    const baseRewards = node.rewards || [];
    
    // Default insight reward based on node type
    let insightReward = 50; // Default value
    
    switch (node.type) {
      case 'clinical':
      case 'qa':
      case 'educational':
        // Challenge nodes - reward based on grade
        if (grade) {
          insightReward = calculateInsightReward(grade, 50);
        }
        break;
        
      case 'storage':
        // Treasure nodes give smaller insight rewards but items
        insightReward = 25;
        break;
        
      case 'boss':
        // Boss nodes give big rewards
        insightReward = grade ? calculateInsightReward(grade, 100) : 100;
        break;
        
      case 'vendor':
        // Vendor nodes don't give insight rewards
        insightReward = 0;
        break;
        
      case 'start':
        // Start nodes give small rewards
        insightReward = 10;
        break;
    }
    
    // Compile rewards
    const rewards = [
      ...baseRewards,
      { type: 'insight', value: insightReward }
    ];
    
    return rewards;
  }, [{ type: 'insight', value: 10 }], ErrorCode.NODE_REWARD_CALCULATION_ERROR);
}

/**
 * Check if a node can be interacted with
 * @param node The node to check
 * @returns Whether the node can be interacted with
 */
export function canInteractWithNode(node: MapNode): boolean {
  return tryCatch(() => {
    return node.status === 'available' || node.status === 'current';
  }, false, ErrorCode.NODE_ACCESS_ERROR);
}

/**
 * Get the next stage in a node interaction
 * @param nodeType The node type
 * @param currentStage The current stage
 * @returns The next stage or null if at the end
 */
export function getNextNodeStage(nodeType: NodeType, currentStage: string): string | null {
  return tryCatch(() => {
    const stages = getNodeStages(nodeType);
    const currentIndex = stages.indexOf(currentStage);
    
    if (currentIndex < 0 || currentIndex >= stages.length - 1) {
      return null;
    }
    
    return stages[currentIndex + 1];
  }, null, ErrorCode.NODE_NAVIGATION_ERROR);
}

/**
 * Get the previous stage in a node interaction
 * @param nodeType The node type
 * @param currentStage The current stage
 * @returns The previous stage or null if at the beginning
 */
export function getPreviousNodeStage(nodeType: NodeType, currentStage: string): string | null {
  return tryCatch(() => {
    const stages = getNodeStages(nodeType);
    const currentIndex = stages.indexOf(currentStage);
    
    if (currentIndex <= 0) {
      return null;
    }
    
    return stages[currentIndex - 1];
  }, null, ErrorCode.NODE_NAVIGATION_ERROR);
}

/**
 * Check if a node is the boss node
 * @param node The node to check
 * @returns Whether the node is the boss node
 */
export function isBossNode(node: MapNode): boolean {
  return tryCatch(() => {
    return node.type === 'boss';
  }, false, ErrorCode.NODE_TYPE_CHECK_ERROR);
}

/**
 * Get the list of nodes that should be unlocked when a node is completed
 * @param completedNodeId The ID of the completed node
 * @param nodes All nodes in the map
 * @returns Array of node IDs that should be unlocked
 */
export function getNodesThatShouldUnlock(completedNodeId: string, nodes: MapNode[]): string[] {
  return tryCatch(() => {
    // Find the completed node
    const completedNode = nodes.find(node => node.id === completedNodeId);
    
    if (!completedNode) {
      return [];
    }
    
    // Find all currently locked nodes that are connected to the completed node
    const lockedConnectedNodes = nodes.filter(node => 
      node.status === 'locked' && completedNode.connections.includes(node.id)
    );
    
    return lockedConnectedNodes.map(node => node.id);
  }, [], ErrorCode.NODE_UNLOCK_ERROR);
}

/**
 * Get a human-readable description of a node status
 * @param status The node status
 * @returns Human-readable status description
 */
export function getNodeStatusText(status: NodeStatus): string {
  return tryCatch(() => {
    switch (status) {
      case 'locked':
        return 'Locked';
      case 'available':
        return 'Available';
      case 'current':
        return 'Current';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  }, 'Unknown', ErrorCode.NODE_STATUS_ERROR);
}

/**
 * Get display properties for a node based on type and status
 * @param node The node to get display properties for
 * @returns Node display properties
 */
export function getNodeDisplayProperties(node: MapNode) {
  return tryCatch(() => {
    const iconName = getNodeTypeIcon(node.type);
    let statusClass = '';
    let borderWidth = 2;
    
    switch (node.status) {
      case 'locked':
        statusClass = 'opacity-50 grayscale cursor-not-allowed';
        break;
      case 'available':
        statusClass = 'hover:shadow-lg hover:scale-105 cursor-pointer';
        break;
      case 'current':
        statusClass = 'ring-4 ring-yellow-300 shadow-lg';
        borderWidth = 2;
        break;
      case 'completed':
        statusClass = 'opacity-75';
        break;
    }
    
    return {
      iconName,
      statusClass,
      borderWidth,
      classes: getNodeClasses(node.type, node.status),
    };
  }, {
    iconName: 'CircleIcon',
    statusClass: '',
    borderWidth: 2,
    classes: '',
  }, ErrorCode.UI_STYLE_ERROR);
}

/**
 * Get node difficulty based on floor level and position
 * @param floorLevel Current floor level
 * @param distanceFromStart Distance from start node (0-1)
 * @returns Node difficulty level
 */
export function getNodeDifficulty(floorLevel: number, distanceFromStart: number): 'easy' | 'normal' | 'hard' {
  return tryCatch(() => {
    // Higher floors increase overall difficulty
    const baseValue = (floorLevel - 1) * 0.2;
    
    // Nodes further from start tend to be more difficult
    const difficultyValue = baseValue + (distanceFromStart * 0.8);
    
    if (difficultyValue < 0.3) return 'easy';
    if (difficultyValue < 0.7) return 'normal';
    return 'hard';
  }, 'normal', ErrorCode.NODE_GENERATION_ERROR);
}

/**
 * Check if a path exists between two nodes
 * @param nodes All map nodes
 * @param startNodeId The starting node ID
 * @param endNodeId The target node ID
 * @returns Whether a path exists between the nodes
 */
export function hasPathBetween(nodes: MapNode[], startNodeId: string, endNodeId: string): boolean {
  return tryCatch(() => {
    // Use breadth-first search to find a path
    const visited = new Set<string>();
    const queue: string[] = [startNodeId];
    
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      
      // Check if this is the target node
      if (currentId === endNodeId) {
        return true;
      }
      
      // Mark as visited
      visited.add(currentId);
      
      // Find this node
      const currentNode = nodes.find(n => n.id === currentId);
      if (currentNode) {
        // Add unvisited connections to queue
        currentNode.connections.forEach(connId => {
          if (!visited.has(connId)) {
            queue.push(connId);
          }
        });
      }
    }
    
    // No path found
    return false;
  }, false, ErrorCode.NODE_PATH_ERROR);
}