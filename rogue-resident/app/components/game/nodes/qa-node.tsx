'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { 
  startChallenge, 
  advanceStage, 
  recordResponse, 
  setOverallGrade 
} from '@/lib/redux/slices/challenge-slice'
import { ChallengeStage } from '@/lib/types/challenge-types'

// This is a placeholder component that would be structured similarly to ClinicalNode
// In a full implementation, QA challenges would have their own specific stages and components

export default function QANode() {
  const dispatch = useAppDispatch()
  const nodeState = useAppSelector(state => state.node)
  const challenge = useAppSelector(state => state.challenge)
  
  // Placeholder for a simple challenge - would be fetched from backend in real implementation
  const [qaChallenge, setQaChallenge] = useState({
    id: 'qa-01',
    title: 'Linear Accelerator Output Calibration',
    description: 'Calibrate the output of a linear accelerator using an ion chamber',
    stages: ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'],
    stageNames: {
      'introduction': 'QA Introduction',
      'stage1': 'Measurement Setup',
      'stage2': 'Data Collection',
      'stage3': 'Data Analysis',
      'outcome': 'Corrective Action & Results'
    }
  })
  
  // Initialize the challenge
  useEffect(() => {
    if (nodeState.isNodeActive && !challenge.currentChallengeId) {
      dispatch(startChallenge({
        id: qaChallenge.id,
        type: 'qa',
        totalStages: qaChallenge.stages.length
      }))
    }
  }, [nodeState.isNodeActive, challenge.currentChallengeId, dispatch, qaChallenge.id])
  
  // Handle stage advancement
  const handleAdvanceStage = (nextStage: ChallengeStage, response?: any) => {
    // Record response if provided
    if (response) {
      dispatch(recordResponse({
        stage: challenge.currentStage || 'introduction',
        response
      }))
    }
    
    // Move to next stage
    dispatch(advanceStage(nextStage))
    
    // If we're advancing to the outcome, calculate overall grade
    if (nextStage === 'outcome') {
      // This would normally be a more complex calculation based on all responses
      dispatch(setOverallGrade('B'))
    }
  }
  
  // Progress indicator
  const currentStageIndex = challenge.currentStage 
    ? qaChallenge.stages.indexOf(challenge.currentStage) 
    : 0
  
  const progressPercentage = (currentStageIndex / (qaChallenge.stages.length - 1)) * 100
  
  // Placeholder implementation
  return (
    <div className="max-w-4xl mx-auto">
      {/* Stage navigation and progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-400">
            Stage: {challenge.currentStage && qaChallenge.stageNames[challenge.currentStage]}
          </span>
          <span className="text-sm text-slate-400">
            {currentStageIndex + 1} of {qaChallenge.stages.length}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div 
            className="bg-qa h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Placeholder content */}
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden p-8">
        <h3 className="text-xl font-pixel text-qa mb-4">{qaChallenge.title}</h3>
        <p className="text-slate-300 mb-6">{qaChallenge.description}</p>
        
        {challenge.currentStage === 'introduction' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              In this QA challenge, you will calibrate a linear accelerator's output. You'll need to:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Set up the measurement equipment correctly</li>
              <li>Collect accurate data from multiple measurements</li>
              <li>Analyze the results against expected values</li>
              <li>Make appropriate adjustments to ensure proper calibration</li>
            </ul>
            <div className="mt-6">
              <button
                onClick={() => handleAdvanceStage('stage1')}
                className="btn-pixel bg-qa border-qa-accent px-6 py-2 text-white font-pixel"
              >
                Begin Challenge
              </button>
            </div>
          </div>
        )}
        
        {challenge.currentStage === 'stage1' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Set up the ion chamber and phantom for calibration measurements.
            </p>
            {/* This would be a more interactive component in a real implementation */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-slate-300">Measurement Setup Options:</p>
              <div className="mt-4 space-y-2">
                <div className="bg-slate-600 p-3 rounded cursor-pointer hover:bg-slate-500">
                  Option A: Standard setup with solid water phantom
                </div>
                <div className="bg-slate-600 p-3 rounded cursor-pointer hover:bg-slate-500">
                  Option B: Water tank with Farmer chamber
                </div>
                <div className="bg-slate-600 p-3 rounded cursor-pointer hover:bg-slate-500">
                  Option C: Scanning phantom with array detector
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleAdvanceStage('stage2', { setup: 'Option A' })}
                className="btn-pixel bg-qa border-qa-accent px-6 py-2 text-white font-pixel"
              >
                Continue to Data Collection
              </button>
            </div>
          </div>
        )}
        
        {/* Placeholder for further stages */}
        {(challenge.currentStage === 'stage2' || challenge.currentStage === 'stage3') && (
          <div className="space-y-4">
            <p className="text-slate-300">
              This stage would contain QA-specific challenge content.
            </p>
            <div className="mt-6">
              <button
                onClick={() => handleAdvanceStage(
                  challenge.currentStage === 'stage2' ? 'stage3' : 'outcome'
                )}
                className="btn-pixel bg-qa border-qa-accent px-6 py-2 text-white font-pixel"
              >
                {challenge.currentStage === 'stage2' ? 'Continue to Analysis' : 'Complete Challenge'}
              </button>
            </div>
          </div>
        )}
        
        {challenge.currentStage === 'outcome' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="inline-block rounded-full bg-qa p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-pixel text-qa mt-4">Challenge Completed!</h3>
              <p className="text-slate-300 mt-2">You've successfully calibrated the linear accelerator.</p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-xl font-pixel text-qa-accent">Grade: {challenge.overallGrade}</p>
              <p className="text-slate-300 mt-2">Insight Gained: {challenge.insightReward}</p>
              {challenge.itemReward && (
                <p className="text-slate-300 mt-2">Item Reward: QA Toolkit</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}