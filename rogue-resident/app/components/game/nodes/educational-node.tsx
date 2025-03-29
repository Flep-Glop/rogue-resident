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
// In a full implementation, Educational challenges would have their own specific stages and components

export default function EducationalNode() {
  const dispatch = useAppDispatch()
  const nodeState = useAppSelector(state => state.node)
  const challenge = useAppSelector(state => state.challenge)
  
  // Placeholder for a simple challenge - would be fetched from backend in real implementation
  const [educationalChallenge, setEducationalChallenge] = useState({
    id: 'edu-01',
    title: 'Radiation Biology Basics',
    description: 'Teach medical students about the fundamentals of radiation biology',
    stages: ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'],
    stageNames: {
      'introduction': 'Teaching Scenario Introduction',
      'stage1': 'Concept Explanation',
      'stage2': 'Visual Aid Creation',
      'stage3': 'Question Handling',
      'outcome': 'Knowledge Assessment & Feedback'
    }
  })
  
  // Initialize the challenge
  useEffect(() => {
    if (nodeState.isNodeActive && !challenge.currentChallengeId) {
      dispatch(startChallenge({
        id: educationalChallenge.id,
        type: 'educational',
        totalStages: educationalChallenge.stages.length
      }))
    }
  }, [nodeState.isNodeActive, challenge.currentChallengeId, dispatch, educationalChallenge.id])
  
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
      dispatch(setOverallGrade('S'))
    }
  }
  
  // Progress indicator
  const currentStageIndex = challenge.currentStage 
    ? educationalChallenge.stages.indexOf(challenge.currentStage) 
    : 0
  
  const progressPercentage = (currentStageIndex / (educationalChallenge.stages.length - 1)) * 100
  
  // Placeholder implementation
  return (
    <div className="max-w-4xl mx-auto">
      {/* Stage navigation and progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-slate-400">
            Stage: {challenge.currentStage && educationalChallenge.stageNames[challenge.currentStage]}
          </span>
          <span className="text-sm text-slate-400">
            {currentStageIndex + 1} of {educationalChallenge.stages.length}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
          <div 
            className="bg-educational h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Placeholder content */}
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden p-8">
        <h3 className="text-xl font-pixel text-educational mb-4">{educationalChallenge.title}</h3>
        <p className="text-slate-300 mb-6">{educationalChallenge.description}</p>
        
        {challenge.currentStage === 'introduction' && (
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <h4 className="text-educational-accent font-pixel mb-2">Teaching Scenario</h4>
              <p className="text-slate-300">
                A group of first-year medical students needs an introduction to radiation biology. 
                This is their first exposure to the topic, so you need to make complex concepts 
                accessible while maintaining scientific accuracy.
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg mt-4">
              <h4 className="text-educational-accent font-pixel mb-2">Learning Objectives</h4>
              <ul className="list-disc list-inside text-slate-300 space-y-2">
                <li>Understand the basic mechanisms of radiation damage to DNA</li>
                <li>Differentiate between direct and indirect effects of radiation</li>
                <li>Recognize the time course of radiation effects</li>
                <li>Explain the concept of fractionation in radiation therapy</li>
              </ul>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => handleAdvanceStage('stage1')}
                className="btn-pixel bg-educational border-educational-accent px-6 py-2 text-white font-pixel"
              >
                Begin Teaching
              </button>
            </div>
          </div>
        )}
        
        {challenge.currentStage === 'stage1' && (
          <div className="space-y-4">
            <p className="text-slate-300">
              Explain DNA damage mechanisms to the students.
            </p>
            {/* This would be a more interactive component in a real implementation */}
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-slate-300">Select your teaching approach:</p>
              <div className="mt-4 space-y-2">
                <div className="bg-slate-600 p-3 rounded cursor-pointer hover:bg-slate-500">
                  Technical: Begin with detailed physics of energy deposition
                </div>
                <div className="bg-slate-600 p-3 rounded cursor-pointer hover:bg-slate-500">
                  Visual: Use analogies and diagrams to illustrate concepts
                </div>
                <div className="bg-slate-600 p-3 rounded cursor-pointer hover:bg-slate-500">
                  Clinical: Connect concepts to patient outcomes and treatments
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => handleAdvanceStage('stage2', { approach: 'Visual' })}
                className="btn-pixel bg-educational border-educational-accent px-6 py-2 text-white font-pixel"
              >
                Continue to Visual Aids
              </button>
            </div>
          </div>
        )}
        
        {/* Placeholder for further stages */}
        {(challenge.currentStage === 'stage2' || challenge.currentStage === 'stage3') && (
          <div className="space-y-4">
            <p className="text-slate-300">
              This stage would contain education-specific challenge content.
            </p>
            <div className="mt-6">
              <button
                onClick={() => handleAdvanceStage(
                  challenge.currentStage === 'stage2' ? 'stage3' : 'outcome'
                )}
                className="btn-pixel bg-educational border-educational-accent px-6 py-2 text-white font-pixel"
              >
                {challenge.currentStage === 'stage2' ? 'Handle Student Questions' : 'Complete Teaching'}
              </button>
            </div>
          </div>
        )}
        
        {challenge.currentStage === 'outcome' && (
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="inline-block rounded-full bg-educational p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-pixel text-educational mt-4">Teaching Complete!</h3>
              <p className="text-slate-300 mt-2">
                The students have gained a solid understanding of radiation biology basics.
              </p>
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg text-center">
              <p className="text-xl font-pixel text-educational-accent">Grade: {challenge.overallGrade}</p>
              <p className="text-slate-300 mt-2">Insight Gained: {challenge.insightReward}</p>
              {challenge.itemReward && (
                <p className="text-slate-300 mt-2">Item Reward: Teaching Materials</p>
              )}
            </div>
            
            <div className="bg-slate-700 p-4 rounded-lg mt-4">
              <h4 className="text-educational-accent font-pixel mb-2">Student Feedback</h4>
              <p className="text-slate-300 italic">
                "This was the clearest explanation of radiation biology I've ever received! 
                The visual aids really helped me understand the complex mechanisms."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}