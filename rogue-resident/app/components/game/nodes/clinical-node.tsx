'use client';

import React, { useEffect, useState } from 'react';
import { useNode, useChallenge, useGame } from '@/lib/hooks';
import { ChallengeStage } from '@/lib/types/challenge-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { IntroductionStage } from './challenge-stages/introduction-stage';
import { ImagingStage } from './challenge-stages/imaging-stage';
import { ParameterStage } from './challenge-stages/parameter-stage';
import { DoseStage } from './challenge-stages/dose-stage';
import { PlanEvaluationStage } from './challenge-stages/plan-evaluation-stage';
import { OutcomeStage } from './challenge-stages/outcome-stage';

// Sample clinical challenge data
const sampleClinicalChallenge = {
  id: 'clinical-001',
  title: 'Breast Cancer Treatment Plan',
  description: 'Evaluate CT images and create an optimal treatment plan for this breast cancer case.',
  difficulty: 'normal',
  patientInfo: {
    age: 54,
    gender: 'female',
    diagnosis: 'Invasive ductal carcinoma',
    stage: 'Stage II',
    previousTreatments: ['Surgery (lumpectomy)']
  },
  stages: {
    imaging: {
      images: ['/images/ct-scan-1.png', '/images/ct-scan-2.png'],
      correctAnswers: ['tumor_volume', 'lymph_nodes'],
      userAnswers: []
    },
    parameters: {
      options: {
        energy: ['6 MV', '10 MV', '15 MV'],
        technique: ['3D Conformal', 'IMRT', 'VMAT'],
        modality: ['Photons', 'Electrons', 'Mixed']
      },
      correctAnswers: {
        energy: '6 MV',
        technique: 'IMRT',
        modality: 'Photons'
      }
    },
    dose: {
      prescription: '2 Gy x 25 fractions',
      correctAnswer: 50,
      tolerance: 2
    },
    plan: {
      dvhData: {},
      structures: ['PTV', 'Heart', 'Lungs', 'Spinal Cord'],
      constraints: [
        { structure: 'Heart', type: 'mean', dose: 26 },
        { structure: 'Lungs', type: 'max', dose: 20, volume: 20 },
        { structure: 'Spinal Cord', type: 'max', dose: 45 }
      ],
      correctAnswers: ['constraint_1', 'constraint_3']
    }
  },
  rewards: [
    { type: 'insight', value: 50 },
    { type: 'researchPoints', value: 5 }
  ]
};

export function ClinicalNode() {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Use custom hooks
  const { nodeData, updateData, interactionStage, setStage, completeInteraction } = useNode();
  const { startChallenge, submitResponse, setGrade, completeChallenge, isActive } = useChallenge();
  const { addInsight, addScore } = useGame();
  
  // Initialize challenge data if not set
  useEffect(() => {
    try {
      setLoading(true);
      
      if (!nodeData || !nodeData.challenge) {
        // Update node data with challenge info
        updateData({
          challenge: sampleClinicalChallenge
        });
        
        // Start the challenge
        startChallenge({
          id: sampleClinicalChallenge.id,
          type: 'clinical',
          totalStages: 5,
          title: sampleClinicalChallenge.title,
          description: sampleClinicalChallenge.description,
          difficulty: 'normal'
        });
      }
    } catch (err) {
      console.error('Error initializing clinical challenge:', err);
      setError(err instanceof Error ? err : new Error('Failed to initialize challenge'));
    } finally {
      setLoading(false);
    }
  }, [nodeData, updateData, startChallenge]);
  
  // Handle stage navigation
  const goToNextStage = () => {
    const stageOrder: ChallengeStage[] = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
    const currentIndex = stageOrder.indexOf(interactionStage as ChallengeStage);
    
    if (currentIndex < stageOrder.length - 1) {
      setStage(stageOrder[currentIndex + 1]);
    } else {
      // Last stage - complete the node
      completeNode();
    }
  };
  
  const goToPreviousStage = () => {
    const stageOrder: ChallengeStage[] = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
    const currentIndex = stageOrder.indexOf(interactionStage as ChallengeStage);
    
    if (currentIndex > 0) {
      setStage(stageOrder[currentIndex - 1]);
    }
  };
  
  // Complete the node and give rewards
  const completeNode = () => {
    if (nodeData?.challenge) {
      try {
        // Award rewards
        nodeData.challenge.rewards.forEach(reward => {
          if (reward.type === 'insight') {
            addInsight(reward.value);
          } else if (reward.type === 'researchPoints') {
            addScore(reward.value);
          }
        });
        
        // Mark challenge as complete with a grade
        completeChallenge({
          grade: 'A',
          rewards: nodeData.challenge.rewards
        });
        
        // Mark the node interaction as completed
        completeInteraction(true);
      } catch (err) {
        console.error('Error completing clinical node:', err);
        setError(err instanceof Error ? err : new Error('Failed to complete node'));
      }
    }
  };
  
  // Handle answer submission
  const handleSubmitAnswer = (stage: string, answer: any) => {
    try {
      submitResponse(stage as ChallengeStage, answer);
      
      // Update node data with the answer
      if (nodeData?.challenge) {
        const updatedChallenge = { ...nodeData.challenge };
        if (stage === 'stage1' && updatedChallenge.stages.imaging) {
          updatedChallenge.stages.imaging.userAnswers = answer;
        } else if (stage === 'stage2' && updatedChallenge.stages.parameters) {
          updatedChallenge.stages.parameters.userAnswers = answer;
        } else if (stage === 'stage3' && updatedChallenge.stages.dose) {
          updatedChallenge.stages.dose.userAnswer = answer;
        }
        
        updateData({ challenge: updatedChallenge });
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      setError(err instanceof Error ? err : new Error('Failed to submit answer'));
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-clinical"></div>
        <span className="ml-3 text-clinical">Loading challenge...</span>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
        <h3 className="text-lg font-bold text-red-700 mb-2">Error</h3>
        <p className="text-red-600 mb-4">{error.message}</p>
        <Button variant="destructive" onClick={() => setError(null)}>
          Try Again
        </Button>
      </div>
    );
  }
  
  // If challenge isn't active yet, show a placeholder
  if (!isActive() || !nodeData?.challenge) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">
          Challenge not available. Please try again.
        </p>
      </div>
    );
  }
  
  // Render the current stage
  const renderStage = () => {
    if (!nodeData?.challenge) {
      return <div className="text-center py-8">Loading challenge data...</div>;
    }
    
    const challenge = nodeData.challenge;
    
    switch (interactionStage) {
      case 'introduction':
        return (
          <IntroductionStage
            title={challenge.title}
            description={challenge.description}
            patientInfo={challenge.patientInfo}
            onContinue={goToNextStage}
          />
        );
      
      case 'stage1': // Imaging Review
        return (
          <ImagingStage
            data={challenge.stages.imaging}
            onBack={goToPreviousStage}
            onContinue={() => {
              handleSubmitAnswer('stage1', challenge.stages.imaging.userAnswers);
              goToNextStage();
            }}
          />
        );
      
      case 'stage2': // Parameter Selection
        return (
          <ParameterStage
            data={challenge.stages.parameters}
            onBack={goToPreviousStage}
            onContinue={() => {
              handleSubmitAnswer('stage2', challenge.stages.parameters.userAnswers);
              goToNextStage();
            }}
          />
        );
      
      case 'stage3': // Dose Calculation
        return (
          <DoseStage
            data={challenge.stages.dose}
            onBack={goToPreviousStage}
            onContinue={() => {
              handleSubmitAnswer('stage3', challenge.stages.dose.userAnswer);
              goToNextStage();
            }}
          />
        );
      
      case 'outcome':
        return (
          <OutcomeStage
            title="Challenge Complete"
            grade="A"
            feedback="Your treatment plan provides excellent coverage while sparing critical structures."
            rewards={challenge.rewards}
            onComplete={completeNode}
          />
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 mb-4">
              Unknown stage or stage not implemented.
            </p>
            <Button variant="primary" onClick={goToNextStage}>
              Continue
            </Button>
          </div>
        );
    }
  };
  
  // Calculate progress based on current stage
  const calculateProgress = () => {
    const stages = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
    const currentIndex = stages.indexOf(interactionStage);
    return ((currentIndex) / (stages.length - 1)) * 100;
  };
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">
              {interactionStage === 'introduction' ? 'Introduction' : 
               interactionStage === 'stage1' ? 'Imaging Review' :
               interactionStage === 'stage2' ? 'Parameter Selection' :
               interactionStage === 'stage3' ? 'Dose Calculation' :
               interactionStage === 'outcome' ? 'Outcome' : 'Unknown Stage'}
            </span>
            <span className="text-sm text-slate-400">
              {calculateProgress().toFixed(0)}%
            </span>
          </div>
          <Progress value={calculateProgress()} variant="clinical" />
        </div>
        
        {/* Stage content */}
        {renderStage()}
      </div>
    </ErrorBoundary>
  );
}