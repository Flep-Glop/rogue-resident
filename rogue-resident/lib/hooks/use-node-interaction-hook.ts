'use client'

import { useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { selectNode, completeNode } from '@/lib/redux/slices/map-slice'
import { setCurrentNode, activateNode, completeNode as completeNodeInteraction } from '@/lib/redux/slices/node-slice'
import { startChallenge, resetChallenge } from '@/lib/redux/slices/challenge-slice'
import { NodeType } from '@/lib/types/map-types'

interface UseNodeInteractionReturn {
  // Current node state
  currentNodeId: string | null
  currentNodeType: NodeType | null
  isNodeActive: boolean
  nodeStatus: 'inactive' | 'active' | 'complete' | 'failed'
  
  // Node data from map
  nodeData: any | null
  
  // Methods for interacting with nodes
  selectNode: (nodeId: string, nodeType: NodeType) => void
  activateNode: () => void
  completeNode: (success: boolean) => void
  cancelNodeInteraction: () => void
  
  // Challenge state
  challengeId: string | null
  challengeState: 'inactive' | 'active' | 'completed' | 'failed'
  
  // Methods for challenges
  startNodeChallenge: (challengeData: { id: string, type: string, totalStages: number }) => void
}

/**
 * Custom hook for managing node interactions
 */
export function useNodeInteraction(): UseNodeInteractionReturn {
  const dispatch = useAppDispatch()
  const nodeState = useAppSelector(state => state.node)
  const mapState = useAppSelector(state => state.map)
  const challengeState = useAppSelector(state => state.challenge)
  
  // Get node data from map state
  const nodeData = nodeState.currentNodeId 
    ? mapState.nodes.find(node => node.id === nodeState.currentNodeId)?.data || null
    : null
  
  // Select a node
  const selectNodeHandler = useCallback((nodeId: string, nodeType: NodeType) => {
    // Check if node is unlocked
    const isUnlocked = mapState.unlockedNodeIds.includes(nodeId)
    if (!isUnlocked) return
    
    dispatch(selectNode(nodeId))
    dispatch(setCurrentNode({ id: nodeId, type: nodeType }))
  }, [dispatch, mapState.unlockedNodeIds])
  
  // Activate the current node
  const activateNodeHandler = useCallback(() => {
    dispatch(activateNode())
  }, [dispatch])
  
  // Complete the current node
  const completeNodeHandler = useCallback((success: boolean) => {
    if (nodeState.currentNodeId) {
      if (success) {
        dispatch(completeNode(nodeState.currentNodeId))
      }
      
      dispatch(completeNodeInteraction({ success }))
      dispatch(resetChallenge())
    }
  }, [dispatch, nodeState.currentNodeId])
  
  // Cancel node interaction (go back to map)
  const cancelNodeInteraction = useCallback(() => {
    dispatch(completeNodeInteraction({ success: false }))
    dispatch(resetChallenge())
  }, [dispatch])
  
  // Start a challenge for the current node
  const startNodeChallenge = useCallback((challengeData: { id: string, type: string, totalStages: number }) => {
    dispatch(startChallenge(challengeData))
  }, [dispatch])
  
  return {
    // Current node state
    currentNodeId: nodeState.currentNodeId,
    currentNodeType: nodeState.currentNodeType,
    isNodeActive: nodeState.isNodeActive,
    nodeStatus: nodeState.nodeStatus,
    
    // Node data from map
    nodeData,
    
    // Methods for interacting with nodes
    selectNode: selectNodeHandler,
    activateNode: activateNodeHandler,
    completeNode: completeNodeHandler,
    cancelNodeInteraction,
    
    // Challenge state
    challengeId: challengeState.currentChallengeId,
    challengeState: challengeState.challengeState,
    
    // Methods for challenges
    startNodeChallenge
  }
}
