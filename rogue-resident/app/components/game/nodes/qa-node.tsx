'use client';

import React, { useEffect, useState } from 'react';
import { useNode, useChallenge, useGame } from '@/lib/hooks';
import { ChallengeStage } from '@/lib/types/challenge-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { IntroductionStage } from './challenge-stages/introduction-stage';
import { MeasurementSetupStage } from './challenge-stages/measurement-setup-stage';
import { DataCollectionStage } from './challenge-stages/data-collection-stage';
import { DataAnalysisStage } from './challenge-stages/data-analysis-stage';
import { OutcomeStage } from './challenge-stages/outcome-stage';

// Sample QA challenge data
const sampleQAChallenge = {
  id: 'qa-001',
  title: 'Linear Accelerator Output Calibration',
  description: 'Calibrate the output of a linear accelerator using an ion chamber',
  difficulty: 'normal',
  equipmentInfo: 'Varian TrueBeam Linear Accelerator, Farmer-type ion chamber, Solid water phantom',
  procedureInfo: 'TG-51 absolute dose calibration protocol for high-energy photon beams',
  stages: {
    setup: {
      options: [
        { id: 'setup-1', name: 'Standard setup with solid water phantom', isCorrect: true },
        { id: 'setup-2', name: 'Water tank with Farmer chamber', isCorrect: false },
        { id: 'setup-3', name: 'Scanning phantom with array detector', isCorrect: false }
      ],
      selectedOption: null,
      correctReason: 'The standard setup with solid water phantom is appropriate for routine output calibration according to TG-51 protocol.'
    },
    collection: {
      measurementFields: [
        { energy: '6 MV', fieldSize: '10×10 cm', depth: '10 cm', expectedReading: 0.765, userReading: null, tolerance: 0.01 },
        { energy: '10 MV', fieldSize: '10×10 cm', depth: '10 cm', expectedReading: 0.816, userReading: null, tolerance: 0.01 },
        { energy: '15 MV', fieldSize: '10×10 cm', depth: '10 cm', expectedReading: 0.842, userReading: null, tolerance: 0.01 }
      ]
    },
    analysis: {
      outputFactors: [
        { energy: '6 MV', expected: 1.000, measured: 0.998, withinTolerance: true },
        { energy: '10 MV', expected: 1.000, measured: 1.006, withinTolerance: true },
        { energy: '15 MV', expected: 1.000, measured: 0.985, withinTolerance: false }
      ],
      userAnalysis: null,
      correctAnalysis: 'The 15 MV beam output is outside of tolerance and requires adjustment.'
    }
  },
  rewards: [
    { type: 'insight', value: 50 },
    { type: 'researchPoints', value: 3 }
  ]
};

export function QANode() {
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
          challenge: sampleQAChallenge
        });
        
        // Start the challenge
        startChallenge({
          id: sampleQAChallenge.id,
          type: 'qa',
          totalStages: 5,
          title: sampleQAChallenge.title,
          description: sampleQAChallenge.description,
          difficulty: 'normal'
        });
      }
    } catch (err) {
      console.error('Error initializing QA challenge:', err);
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
          grade: 'B',
          rewards: nodeData.challenge.rewards
        });
        
        // Mark the node interaction as completed
        completeInteraction(true);
      } catch (err) {
        console.error('Error completing QA node:', err);
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
        if (stage === 'stage1' && updatedChallenge.stages.setup) {
          updatedChallenge.stages.setup.selectedOption = answer;
        } else if (stage === 'stage2' && updatedChallenge.stages.collection) {
          updatedChallenge.stages.collection.measurementFields = answer;
        } else if (stage === 'stage3' && updatedChallenge.stages.analysis) {
          updatedChallenge.stages.analysis.userAnalysis = answer;
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-qa"></div>
        <span className="ml-3 text-qa">Loading challenge...</span>
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
  
  // Calculate progress based on current stage
  const calculateProgress = () => {
    const stages = ['introduction', 'stage1', 'stage2', 'stage3', 'outcome'];
    const currentIndex = stages.indexOf(interactionStage);
    return ((currentIndex) / (stages.length - 1)) * 100;
  };
  
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
            equipmentInfo={challenge.equipmentInfo}
            procedureInfo={challenge.procedureInfo}
            onContinue={goToNextStage}
          />
        );
      
      case 'stage1': // Measurement Setup
        return (
          <MeasurementSetupStage
            data={challenge.stages.setup}
            onBack={goToPreviousStage}
            onContinue={(selectedOption) => {
              handleSubmitAnswer('stage1', selectedOption);
              goToNextStage();
            }}
          />
        );
      
      case 'stage2': // Data Collection
        return (
          <DataCollectionStage
            data={challenge.stages.collection}
            onBack={goToPreviousStage}
            onContinue={(measurements) => {
              handleSubmitAnswer('stage2', measurements);
              goToNextStage();
            }}
          />
        );
      
      case 'stage3': // Data Analysis
        return (
          <DataAnalysisStage
            data={challenge.stages.analysis}
            onBack={goToPreviousStage}
            onContinue={(analysis) => {
              handleSubmitAnswer('stage3', analysis);
              goToNextStage();
            }}
          />
        );
      
      case 'outcome':
        return (
          <OutcomeStage
            title="QA Challenge Complete"
            grade="B"
            feedback="Your calibration procedure was mostly correct. The 15 MV beam requires adjustment."
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
  
  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">
              {interactionStage === 'introduction' ? 'Introduction' : 
               interactionStage === 'stage1' ? 'Measurement Setup' :
               interactionStage === 'stage2' ? 'Data Collection' :
               interactionStage === 'stage3' ? 'Data Analysis' :
               interactionStage === 'outcome' ? 'Outcome' : 'Unknown Stage'}
            </span>
            <span className="text-sm text-slate-400">
              {calculateProgress().toFixed(0)}%
            </span>
          </div>
          <Progress value={calculateProgress()} variant="qa" />
        </div>
        
        {/* Stage content */}
        {renderStage()}
      </div>
    </ErrorBoundary>
  );
}

// Note: These component imports are placeholders. You'll need to implement or adjust these components.
// For now, I'll provide stub implementations for these components to be created

function MeasurementSetupStage({ data, onBack, onContinue }) {
  const [selectedOption, setSelectedOption] = useState(data.selectedOption);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Measurement Setup</h3>
        <p className="text-gray-600">
          Select the appropriate setup for calibrating the linear accelerator:
        </p>
        
        <div className="space-y-2">
          {data.options.map(option => (
            <div 
              key={option.id}
              className={`
                p-3 rounded-md cursor-pointer border 
                ${selectedOption === option.id 
                  ? 'border-qa bg-qa bg-opacity-10' 
                  : 'border-gray-200 hover:border-qa'
                }
              `}
              onClick={() => setSelectedOption(option.id)}
            >
              {option.name}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="qa" 
            onClick={() => onContinue(selectedOption)}
            disabled={!selectedOption}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DataCollectionStage({ data, onBack, onContinue }) {
  const [measurements, setMeasurements] = useState(data.measurementFields);
  
  const updateMeasurement = (index, value) => {
    const newMeasurements = [...measurements];
    newMeasurements[index].userReading = parseFloat(value);
    setMeasurements(newMeasurements);
  };
  
  const isComplete = measurements.every(m => m.userReading !== null);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Data Collection</h3>
        <p className="text-gray-600">
          Take measurements for each of the following beam configurations:
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Energy</th>
                <th className="p-2 border text-left">Field Size</th>
                <th className="p-2 border text-left">Depth</th>
                <th className="p-2 border text-left">Reading</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((field, index) => (
                <tr key={index}>
                  <td className="p-2 border">{field.energy}</td>
                  <td className="p-2 border">{field.fieldSize}</td>
                  <td className="p-2 border">{field.depth}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      step="0.001"
                      className="w-24 p-1 border rounded"
                      value={field.userReading !== null ? field.userReading : ''}
                      onChange={(e) => updateMeasurement(index, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="qa" 
            onClick={() => onContinue(measurements)}
            disabled={!isComplete}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DataAnalysisStage({ data, onBack, onContinue }) {
  const [analysis, setAnalysis] = useState(data.userAnalysis || '');
  const [selectedFactor, setSelectedFactor] = useState<number | null>(null);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Data Analysis</h3>
        <p className="text-gray-600">
          Analyze the output factors and identify any issues:
        </p>
        
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Energy</th>
                <th className="p-2 border text-left">Expected</th>
                <th className="p-2 border text-left">Measured</th>
                <th className="p-2 border text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.outputFactors.map((factor, index) => (
                <tr 
                  key={index}
                  className={`
                    cursor-pointer 
                    ${selectedFactor === index ? 'bg-qa bg-opacity-10' : ''}
                    ${!factor.withinTolerance ? 'text-red-600' : ''}
                  `}
                  onClick={() => setSelectedFactor(index)}
                >
                  <td className="p-2 border">{factor.energy}</td>
                  <td className="p-2 border">{factor.expected.toFixed(3)}</td>
                  <td className="p-2 border">{factor.measured.toFixed(3)}</td>
                  <td className="p-2 border">
                    {factor.withinTolerance 
                      ? <span className="text-green-600">Within Tolerance</span>
                      : <span className="text-red-600">Outside Tolerance</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div>
          <label className="block font-medium mb-2">
            Your Analysis:
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-24"
            placeholder="Describe any issues you've identified and what adjustments are needed..."
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="qa" 
            onClick={() => onContinue(analysis)}
            disabled={analysis.length < 10}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}