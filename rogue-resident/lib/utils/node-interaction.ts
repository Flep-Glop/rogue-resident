import { NodeType, NodeStatus, MapNode } from '@/lib/types/node-types';
import { ChallengeType, ChallengeGrade } from '@/lib/types/challenge-types';
import { getRandomChallenge } from '@/lib/data/challenges';
import { tryCatch } from './error-handlers';
import { calculateGrade, calculateInsightReward } from './game-utils';
import { getNodeClasses } from './theme-utils';

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
    
    return {
      title: node.title,
      description: node.description,
      hasChallenges,
      challengeType,
      availableStages,
      customClasses,
      themeColors: {
        primary: getComputedStyle(document.documentElement)
          .getPropertyValue(`--${node.type}-primary`) || '#4A90E2',
        secondary: getComputedStyle(document.documentElement)
          .getPropertyValue(`--${node.type}-secondary`) || '#F4D03F',
        text: getComputedStyle(document.documentElement)
          .getPropertyValue(`--${node.type}-text`) || 'white'
      }
    };
  }, {
    title: node.title || 'Unknown Node',
    description: node.description || 'No description available',
    hasChallenges: false,
    challengeType: null,
    availableStages: ['introduction', 'outcome'],
    customClasses: '',
    themeColors: { primary: '#888', secondary: '#AAA', text: 'white' }
  });
}

/**
 * Get stages for a specific node type
 * @param nodeType The node type
 * @returns Array of stage IDs
 */
export function getNodeStages(nodeType: NodeType): string[] {
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
}

/**
 * Get a challenge for a specific node
 * @param node The node to get a challenge for
 * @returns Challenge data or null if not applicable
 */
export function getNodeChallenge(node: MapNode) {
  return tryCatch(() => {
    const challengeType = NODE_TO_CHALLENGE_TYPE[node.type];
    
    if (!challengeType) {
      return null;
    }
    
    // If the node has a specific scenario ID, use that
    if (node.scenarioId) {
      // TODO: Implement retrieving a specific scenario
      return { id: node.scenarioId, type: challengeType };
    }
    
    // Otherwise, get a random challenge of the appropriate type and difficulty
    const challenge = getRandomChallenge(challengeType, node.difficulty);
    
    if (!challenge) {
      console.warn(`No challenges found for type ${challengeType} and difficulty ${node.difficulty}`);
      return null;
    }
    
    return {
      id: challenge.id,
      type: challengeType,
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      totalStages: challenge.stages.length,
      timeLimit: challenge.timeLimit
    };
  }, null);
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
  }, [{ type: 'insight', value: 10 }]);
}

/**
 * Check if a node can be interacted with
 * @param node The node to check
 * @returns Whether the node can be interacted with
 */
export function canInteractWithNode(node: MapNode): boolean {
  return node.status === 'available' || node.status === 'current';
}

/**
 * Get the next stage in a node interaction
 * @param nodeType The node type
 * @param currentStage The current stage
 * @returns The next stage or null if at the end
 */
export function getNextNodeStage(nodeType: NodeType, currentStage: string): string | null {
  const stages = getNodeStages(nodeType);
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex < 0 || currentIndex >= stages.length - 1) {
    return null;
  }
  
  return stages[currentIndex + 1];
}

/**
 * Get the previous stage in a node interaction
 * @param nodeType The node type
 * @param currentStage The current stage
 * @returns The previous stage or null if at the beginning
 */
export function getPreviousNodeStage(nodeType: NodeType, currentStage: string): string | null {
  const stages = getNodeStages(nodeType);
  const currentIndex = stages.indexOf(currentStage);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return stages[currentIndex - 1];
}

/**
 * Check if a node is the boss node
 * @param node The node to check
 * @returns Whether the node is the boss node
 */
export function isBossNode(node: MapNode): boolean {
  return node.type === 'boss';
}

/**
 * Get the list of nodes that should be unlocked when a node is completed
 * @param completedNodeId The ID of the completed node
 * @param nodes All nodes in the map
 * @returns Array of node IDs that should be unlocked
 */
export function getNodesThatShouldUnlock(completedNodeId: string, nodes: MapNode[]): string[] {
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
}

/**
 * Get a human-readable description of a node status
 * @param status The node status
 * @returns Human-readable status description
 */
export function getNodeStatusText(status: NodeStatus): string {
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
}

/**
 * Get node icons for the map display
 * @param nodeType The node type
 * @returns Icon information
 */
export function getNodeIcon(nodeType: NodeType): { name: string; color: string } {
  switch (nodeType) {
    case 'clinical':
      return { name: 'medical-bag', color: '#4A90E2' };
    case 'qa':
      return { name: 'settings', color: '#5A6978' };
    case 'educational':
      return { name: 'school', color: '#26A69A' };
    case 'storage':
      return { name: 'package', color: '#D8CCA3' };
    case 'vendor':
      return { name: 'shopping-cart', color: '#2C3E50' };
    case 'boss':
      return { name: 'flash', color: '#4FC3F7' };
    case 'start':
      return { name: 'home', color: '#4CAF50' };
    default:
      return { name: 'help-circle', color: '#888888' };
  }
}