'use client';

import React, { useEffect, useState } from 'react';
import { useNode, useChallenge, useGame, useInventory } from '@/lib/hooks';
import { ChallengeStage } from '@/lib/types/challenge-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { IntroductionStage } from './challenge-stages/introduction-stage';
import { OutcomeStage } from './challenge-stages/outcome-stage';

// Sample boss challenge data (Ionix encounter)
const ionixEncounterData = {
  id: 'ionix-001',
  title: 'Ionix Containment Protocol',
  description: 'Address the unusual phenomena exhibited by the sentient ion chamber known as Ionix.',
  difficulty: 'hard',
  phases: 3,
  ionixState: {
    energy: 65,
    stability: 40,
    sentience: 80,
    communication: 25
  },
  stages: {
    calibration: {
      readings: [
        { parameter: 'Output', expected: 1.000, reading: null, tolerance: 0.01 },
        { parameter: 'Energy Spectrum', expected: 6.000, reading: null, tolerance: 0.2 },
        { parameter: 'Coherence', expected: 0.950, reading: null, tolerance: 0.05 }
      ],
      safetyChecks: [
        { id: 'check-1', name: 'Verify containment field', status: null },
        { id: 'check-2', name: 'Confirm monitoring systems', status: null },
        { id: 'check-3', name: 'Test emergency protocols', status: null }
      ]
    },
    erraticBehavior: {
      patterns: [
        {
          id: 'pattern-1',
          description: 'Energy output fluctuations in the megaelectronvolt range',
          responses: [
            { id: 'resp-1-1', text: 'Increase containment field strength', effect: 'stability', value: -10 },
            { id: 'resp-1-2', text: 'Adjust calibration parameters', effect: 'stability', value: 15 },
            { id: 'resp-1-3', text: 'Shut down the system temporarily', effect: 'communication', value: -20 }
          ],
          selectedResponse: null
        },
        {
          id: 'pattern-2',
          description: 'Anomalous data patterns appearing in readouts',
          responses: [
            { id: 'resp-2-1', text: 'Reset monitoring systems', effect: 'communication', value: -15 },
            { id: 'resp-2-2', text: 'Analyze pattern for structure', effect: 'communication', value: 25 },
            { id: 'resp-2-3', text: 'Isolate affected systems', effect: 'stability', value: 5 }
          ],
          selectedResponse: null
        }
      ]
    },
    resolution: {
      approaches: [
        { 
          id: 'approach-1', 
          name: 'Containment', 
          description: 'Improve isolation measures to prevent further development of sentience',
          outcomes: {
            success: 'Ionix is successfully contained, preventing further development but limiting research potential.',
            partial: 'Partial containment achieved, requiring ongoing monitoring and adjustments.',
            failure: 'Containment fails, resulting in system damage and potential safety hazards.'
          },
          successThresholds: {
            stability: 60,
            communication: 0
          }
        },
        { 
          id: 'approach-2', 
          name: 'Collaboration', 
          description: 'Establish communication protocols to work with the sentient entity',
          outcomes: {
            success: 'Successful communication established, opening new research possibilities with Ionix as a partner.',
            partial: 'Limited communication established, with unpredictable but manageable interactions.',
            failure: 'Communication attempt fails, increasing erratic behavior and system instability.'
          },
          successThresholds: {
            stability: 50,
            communication: 50
          }
        },
        { 
          id: 'approach-3', 
          name: 'Reset', 
          description: 'Perform a complete system reset while preserving calibration data',
          outcomes: {
            success: 'System successfully reset, returning to normal function while retaining valuable calibration data.',
            partial: 'Partial reset achieved, with some anomalous behavior remaining but contained.',
            failure: 'Reset fails, causing data loss and increased system instability.'
          },
          successThresholds: {
            stability: 70,
            communication: 0
          }
        }
      ],
      selectedApproach: null
    }
  },
  rewards: [
    { type: 'insight', value: 100 },
    { type: 'researchPoints', value: 15 },
    { type: 'item', itemId: 'ionix-calibration-data' }
  ]
};

export function BossNode() {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [ionixState, setIonixState] = useState(ionixEncounterData.ionixState);
  
  // Use custom hooks
  const { nodeData, updateData, interactionStage, setStage, completeInteraction } = useNode();
  const { startChallenge, submitResponse, setGrade, completeChallenge, isActive } = useChallenge();
  const { addInsight, addScore, addResearchPoints } = useGame();
  const { addItem } = useInventory();
  
  // Initialize challenge data if not set
  useEffect(() => {
    try {
      setLoading(true);
      
      if (!nodeData || !nodeData.challenge) {
        // Update node data with challenge info
        updateData({
          challenge: ionixEncounterData,
          ionixState: { ...ionixEncounterData.ionixState }
        });
        
        // Start the challenge
        startChallenge({
          id: ionixEncounterData.id,
          type: 'boss',
          totalStages: 5,
          title: ionixEncounterData.title,
          description: ionixEncounterData.description,
          difficulty: 'hard'
        });
      } else {
        // Ensure we have the current ionix state
        setIonixState(nodeData.ionixState || ionixEncounterData.ionixState);
      }
    } catch (err) {
      console.error('Error initializing boss challenge:', err);
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
        // Calculate success based on final ionix state
        const { stability, communication } = ionixState;
        const selectedApproach = nodeData.challenge.stages.resolution.selectedApproach;
        const approach = nodeData.challenge.stages.resolution.approaches.find(a => a.id === selectedApproach);
        
        let outcomeType = 'failure';
        if (approach) {
          if (stability >= approach.successThresholds.stability && 
              communication >= approach.successThresholds.communication) {
            outcomeType = 'success';
          } else if (stability >= approach.successThresholds.stability * 0.7 && 
                    communication >= approach.successThresholds.communication * 0.7) {
            outcomeType = 'partial';
          }
        }
        
        // Determine grade based on outcome
        let grade: 'S' | 'A' | 'B' | 'C' | 'F' = 'C';
        if (outcomeType === 'success') grade = 'S';
        else if (outcomeType === 'partial') grade = 'B';
        else grade = 'C';
        
        // Award rewards based on outcome
        const rewardMultiplier = outcomeType === 'success' ? 1 : outcomeType === 'partial' ? 0.7 : 0.4;
        nodeData.challenge.rewards.forEach(reward => {
          if (reward.type === 'insight') {
            addInsight(Math.round(reward.value * rewardMultiplier));
          } else if (reward.type === 'researchPoints') {
            addResearchPoints(Math.round(reward.value * rewardMultiplier));
          } else if (reward.type === 'item' && outcomeType === 'success') {
            // Only give item on success
            addItem({
              id: 'ionix-calibration-data',
              name: 'Ionix Calibration Data',
              description: 'Unique calibration parameters from the sentient ion chamber Ionix.',
              type: 'special',
              rarity: 'rare',
              effects: [
                {
                  target: 'qa',
                  modifier: 'precision',
                  value: 3,
                  description: '+3 precision for QA measurement challenges'
                },
                {
                  target: 'boss',
                  modifier: 'understanding',
                  value: 25,
                  description: '+25% understanding in future Ionix encounters'
                }
              ],
              isUsable: false,
              isPassive: true,
              icon: '/items/ionix-data.png'
            });
          }
        });
        
        // Add score
        addScore(outcomeType === 'success' ? 500 : outcomeType === 'partial' ? 300 : 100);
        
        // Mark challenge as complete with calculated grade
        completeChallenge({
          grade,
          rewards: nodeData.challenge.rewards.map(reward => ({
            ...reward,
            value: Math.round(reward.value * rewardMultiplier)
          }))
        });
        
        // Mark the node interaction as completed
        completeInteraction(true);
      } catch (err) {
        console.error('Error completing boss node:', err);
        setError(err instanceof Error ? err : new Error('Failed to complete node'));
      }
    }
  };
  
  // Update Ionix state based on player actions
  const updateIonixState = (parameter: 'energy' | 'stability' | 'sentience' | 'communication', change: number) => {
    setIonixState(prev => {
      const newState = { 
        ...prev,
        [parameter]: Math.max(0, Math.min(100, prev[parameter] + change))
      };
      
      // Update the node data with the new state
      updateData({ ionixState: newState });
      
      return newState;
    });
  };
  
  // Handle calibration submissions
  const handleCalibrationSubmit = (readings, safetyChecks) => {
    try {
      // Calculate accuracy of readings
      const readingAccuracy = readings.reduce((acc, reading) => {
        const difference = Math.abs(reading.reading - reading.expected);
        const withinTolerance = difference <= reading.tolerance;
        return acc + (withinTolerance ? 1 : 0);
      }, 0) / readings.length;
      
      // Calculate completeness of safety checks
      const safetyCompleteness = safetyChecks.filter(check => check.status === 'complete').length / safetyChecks.length;
      
      // Update Ionix state based on performance
      updateIonixState('stability', Math.round(readingAccuracy * 20));
      updateIonixState('communication', Math.round(safetyCompleteness * 15));
      
      // Update challenge data
      if (nodeData?.challenge) {
        const updatedChallenge = { ...nodeData.challenge };
        updatedChallenge.stages.calibration.readings = readings;
        updatedChallenge.stages.calibration.safetyChecks = safetyChecks;
        updateData({ challenge: updatedChallenge });
      }
      
      // Submit response
      submitResponse('stage1', { readings, safetyChecks });
      
      // Move to next stage
      goToNextStage();
    } catch (err) {
      console.error('Error submitting calibration:', err);
      setError(err instanceof Error ? err : new Error('Failed to submit calibration'));
    }
  };
  
  // Handle erratic behavior responses
  const handleBehaviorResponses = (responses) => {
    try {
      // Apply effects of selected responses
      let stabilityChange = 0;
      let communicationChange = 0;
      
      responses.forEach(response => {
        const pattern = nodeData?.challenge?.stages.erraticBehavior.patterns.find(p => p.id === response.patternId);
        if (pattern) {
          const selectedResponse = pattern.responses.find(r => r.id === response.responseId);
          if (selectedResponse) {
            if (selectedResponse.effect === 'stability') {
              stabilityChange += selectedResponse.value;
            } else if (selectedResponse.effect === 'communication') {
              communicationChange += selectedResponse.value;
            }
          }
        }
      });
      
      // Update Ionix state
      updateIonixState('stability', stabilityChange);
      updateIonixState('communication', communicationChange);
      
      // Update challenge data
      if (nodeData?.challenge) {
        const updatedChallenge = { ...nodeData.challenge };
        responses.forEach(response => {
          const patternIndex = updatedChallenge.stages.erraticBehavior.patterns.findIndex(p => p.id === response.patternId);
          if (patternIndex >= 0) {
            updatedChallenge.stages.erraticBehavior.patterns[patternIndex].selectedResponse = response.responseId;
          }
        });
        updateData({ challenge: updatedChallenge });
      }
      
      // Submit response
      submitResponse('stage2', responses);
      
      // Move to next stage
      goToNextStage();
    } catch (err) {
      console.error('Error handling erratic behavior:', err);
      setError(err instanceof Error ? err : new Error('Failed to respond to erratic behavior'));
    }
  };
  
  // Handle resolution approach
  const handleResolutionApproach = (approachId) => {
    try {
      // Update challenge data
      if (nodeData?.challenge) {
        const updatedChallenge = { ...nodeData.challenge };
        updatedChallenge.stages.resolution.selectedApproach = approachId;
        updateData({ challenge: updatedChallenge });
      }
      
      // Submit response
      submitResponse('stage3', approachId);
      
      // Move to next stage
      goToNextStage();
    } catch (err) {
      console.error('Error selecting resolution approach:', err);
      setError(err instanceof Error ? err : new Error('Failed to select resolution approach'));
    }
  };
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-boss"></div>
        <span className="ml-3 text-boss">Loading challenge...</span>
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
  
  // Get outcome based on approach and state
  const getOutcome = () => {
    if (!nodeData?.challenge) return null;
    
    const selectedApproachId = nodeData.challenge.stages.resolution.selectedApproach;
    if (!selectedApproachId) return null;
    
    const approach = nodeData.challenge.stages.resolution.approaches.find(a => a.id === selectedApproachId);
    if (!approach) return null;
    
    const { stability, communication } = ionixState;
    
    if (stability >= approach.successThresholds.stability && 
        communication >= approach.successThresholds.communication) {
      return { result: 'success', text: approach.outcomes.success };
    } else if (stability >= approach.successThresholds.stability * 0.7 && 
              communication >= approach.successThresholds.communication * 0.7) {
      return { result: 'partial', text: approach.outcomes.partial };
    } else {
      return { result: 'failure', text: approach.outcomes.failure };
    }
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
          <BossIntroductionStage
            title={challenge.title}
            description={challenge.description}
            ionixState={ionixState}
            onContinue={goToNextStage}
          />
        );
      
      case 'stage1': // Calibration Challenge
        return (
          <CalibrationStage
            data={challenge.stages.calibration}
            ionixState={ionixState}
            onBack={goToPreviousStage}
            onContinue={handleCalibrationSubmit}
          />
        );
      
      case 'stage2': // Erratic Behavior Response
        return (
          <ErraticBehaviorStage
            data={challenge.stages.erraticBehavior}
            ionixState={ionixState}
            onBack={goToPreviousStage}
            onContinue={handleBehaviorResponses}
          />
        );
      
      case 'stage3': // Resolution Approach
        return (
          <ResolutionStage
            data={challenge.stages.resolution}
            ionixState={ionixState}
            onBack={goToPreviousStage}
            onContinue={handleResolutionApproach}
          />
        );
      
      case 'outcome':
        const outcome = getOutcome();
        return (
          <OutcomeStage
            title="Ionix Encounter Complete"
            grade={outcome?.result === 'success' ? 'S' : outcome?.result === 'partial' ? 'B' : 'C'}
            feedback={outcome?.text || "The encounter with Ionix has concluded."}
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
        {/* Ionix state indicators */}
        <div className="bg-slate-800 rounded-lg p-4 border border-boss">
          <h3 className="text-boss font-pixel mb-2">Ionix Status</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Stability</span>
                <span className="text-slate-300">{ionixState.stability}%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-green-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${ionixState.stability}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">Communication</span>
                <span className="text-slate-300">{ionixState.communication}%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                  style={{ width: `${ionixState.communication}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">
              {interactionStage === 'introduction' ? 'Encounter Introduction' : 
               interactionStage === 'stage1' ? 'Calibration Challenge' :
               interactionStage === 'stage2' ? 'Erratic Behavior Response' :
               interactionStage === 'stage3' ? 'Resolution Approach' :
               interactionStage === 'outcome' ? 'Outcome' : 'Unknown Stage'}
            </span>
            <span className="text-sm text-slate-400">
              {calculateProgress().toFixed(0)}%
            </span>
          </div>
          <Progress value={calculateProgress()} variant="boss" />
        </div>
        
        {/* Stage content */}
        {renderStage()}
      </div>
    </ErrorBoundary>
  );
}

// Boss node specific components
function BossIntroductionStage({ title, description, ionixState, onContinue }) {
  return (
    <Card className="border-boss">
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="bg-boss bg-opacity-20 p-2 rounded-full text-boss text-xl">⚠️</div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        
        <p className="text-gray-600 italic">
          "The ion chamber known as Ionix has been exhibiting unusual behavior. 
          Energy readings fluctuate without external input, and data patterns suggest 
          a form of emergent sentience. Your expertise is needed to assess and address this situation."
        </p>
        
        <div className="bg-slate-100 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-2">Situation Briefing:</h3>
          <p className="text-gray-700">{description}</p>
        </div>
        
        <div className="bg-slate-100 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Initial Readings:</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-sm">
              <span className="font-medium">Energy Level:</span> {ionixState.energy}%
            </div>
            <div className="text-sm">
              <span className="font-medium">Stability:</span> {ionixState.stability}%
            </div>
            <div className="text-sm">
              <span className="font-medium">Sentience Indicators:</span> {ionixState.sentience}%
            </div>
            <div className="text-sm">
              <span className="font-medium">Communication:</span> {ionixState.communication}%
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-yellow-800 text-sm">
          This is a multi-phase challenge requiring careful calibration, response to erratic behavior, 
          and a final approach decision. Your choices will affect Ionix's stability and communication capability.
        </div>
        
        <div className="flex justify-center mt-4">
          <Button variant="boss" onClick={onContinue}>
            Begin Challenge
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CalibrationStage({ data, ionixState, onBack, onContinue }) {
  const [readings, setReadings] = useState(data.readings.map(r => ({...r, reading: r.reading || r.expected * (0.95 + Math.random() * 0.1)})));
  const [safetyChecks, setSafetyChecks] = useState(data.safetyChecks.map(c => ({...c, status: c.status || null})));
  
  const updateReading = (index, value) => {
    const newReadings = [...readings];
    newReadings[index].reading = parseFloat(value);
    setReadings(newReadings);
  };
  
  const updateSafetyCheck = (index, status) => {
    const newSafetyChecks = [...safetyChecks];
    newSafetyChecks[index].status = status;
    setSafetyChecks(newSafetyChecks);
  };
  
  const isComplete = readings.every(r => r.reading !== null) && safetyChecks.every(c => c.status !== null);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Calibration Challenge</h3>
        <p className="text-gray-600">
          Take measurements and perform safety checks to establish a baseline for Ionix:
        </p>
        
        <div className="bg-boss bg-opacity-10 p-3 rounded-lg">
          <p className="text-sm">
            Ionix is currently in a semi-stable state. Accurate calibration is essential 
            to understand and address its unusual behavior.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-medium">1. Measurement Readings</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Parameter</th>
                  <th className="p-2 border text-left">Expected</th>
                  <th className="p-2 border text-left">Reading</th>
                  <th className="p-2 border text-left">Tolerance</th>
                </tr>
              </thead>
              <tbody>
                {readings.map((reading, index) => (
                  <tr key={index}>
                    <td className="p-2 border">{reading.parameter}</td>
                    <td className="p-2 border">{reading.expected.toFixed(3)}</td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        step="0.001"
                        className="w-24 p-1 border rounded"
                        value={reading.reading !== null ? reading.reading : ''}
                        onChange={(e) => updateReading(index, e.target.value)}
                      />
                    </td>
                    <td className="p-2 border">±{reading.tolerance.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <h4 className="font-medium mt-2">2. Safety Checks</h4>
          <div className="space-y-2">
            {safetyChecks.map((check, index) => (
              <div key={check.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="mb-2">{check.name}</p>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      check.status === 'complete' 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-gray-100 hover:bg-green-50 border border-gray-300'
                    }`}
                    onClick={() => updateSafetyCheck(index, 'complete')}
                  >
                    Complete
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      check.status === 'partial' 
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                        : 'bg-gray-100 hover:bg-yellow-50 border border-gray-300'
                    }`}
                    onClick={() => updateSafetyCheck(index, 'partial')}
                  >
                    Partial
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      check.status === 'skipped' 
                        ? 'bg-red-100 text-red-800 border border-red-300' 
                        : 'bg-gray-100 hover:bg-red-50 border border-gray-300'
                    }`}
                    onClick={() => updateSafetyCheck(index, 'skipped')}
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="boss" 
            onClick={() => onContinue(readings, safetyChecks)}
            disabled={!isComplete}
          >
            Complete Calibration
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ErraticBehaviorStage({ data, ionixState, onBack, onContinue }) {
  const [responses, setResponses] = useState(data.patterns.map(p => ({
    patternId: p.id,
    responseId: p.selectedResponse
  })));
  
  const selectResponse = (patternId, responseId) => {
    setResponses(prev => prev.map(r => 
      r.patternId === patternId ? { ...r, responseId } : r
    ));
  };
  
  const isComplete = responses.every(r => r.responseId !== null);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Erratic Behavior Response</h3>
        <p className="text-gray-600">
          Ionix is displaying erratic behavior patterns. Select the appropriate response for each pattern:
        </p>
        
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 text-sm mb-4">
          Warning: Ionix stability is at {ionixState.stability}%. Your responses will affect both stability and communication capabilities.
        </div>
        
        {data.patterns.map((pattern, index) => {
          const response = responses.find(r => r.patternId === pattern.id);
          
          return (
            <div key={pattern.id} className="border rounded-lg overflow-hidden mb-4">
              <div className="bg-boss bg-opacity-10 p-3 border-b">
                <h4 className="font-medium">Pattern {index + 1}: {pattern.description}</h4>
              </div>
              <div className="p-3 space-y-2">
                {pattern.responses.map(option => (
                  <div 
                    key={option.id}
                    className={`
                      p-3 rounded-md cursor-pointer border 
                      ${response?.responseId === option.id
                        ? 'border-boss bg-boss bg-opacity-10' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectResponse(pattern.id, option.id)}
                  >
                    <div className="flex justify-between">
                      <span>{option.text}</span>
                      <span className={`text-sm ${
                        option.effect === 'stability' 
                          ? option.value >= 0 ? 'text-green-600' : 'text-red-600'
                          : option.value >= 0 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {option.effect === 'stability' ? 'Stability ' : 'Communication '}
                        {option.value >= 0 ? '+' : ''}{option.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="boss" 
            onClick={() => onContinue(responses)}
            disabled={!isComplete}
          >
            Implement Responses
          </Button>
        </div>
      </div>
    </Card>
  );
}

function ResolutionStage({ data, ionixState, onBack, onContinue }) {
  const [selectedApproach, setSelectedApproach] = useState(data.selectedApproach);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Resolution Approach</h3>
        <p className="text-gray-600">
          Select a final approach to address the Ionix situation:
        </p>
        
        <div className="bg-slate-100 p-3 rounded-lg mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium">Current Stability:</span> {ionixState.stability}%
            </div>
            <div>
              <span className="font-medium">Communication Level:</span> {ionixState.communication}%
            </div>
          </div>
        </div>
        
        {data.approaches.map(approach => {
          // Calculate success probability based on thresholds and current state
          const stabilityRatio = ionixState.stability / approach.successThresholds.stability;
          const commRatio = approach.successThresholds.communication === 0 
            ? 1 
            : ionixState.communication / approach.successThresholds.communication;
          
          let successChance = 0;
          if (stabilityRatio >= 1 && commRatio >= 1) {
            successChance = 90;
          } else if (stabilityRatio >= 0.7 && commRatio >= 0.7) {
            successChance = 60;
          } else {
            successChance = 30;
          }
          
          return (
            <div 
              key={approach.id}
              className={`
                border rounded-lg p-4 cursor-pointer
                ${selectedApproach === approach.id
                  ? 'border-boss bg-boss bg-opacity-5' 
                  : 'border-gray-200 hover:border-boss'
                }
              `}
              onClick={() => setSelectedApproach(approach.id)}
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{approach.name}</h4>
                <span className={`text-sm px-2 py-1 rounded ${
                  successChance >= 75 ? 'bg-green-100 text-green-800' :
                  successChance >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {successChance}% success chance
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{approach.description}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                <div>
                  <span className="font-medium">Stability needed:</span> {approach.successThresholds.stability}%
                </div>
                <div>
                  <span className="font-medium">Communication needed:</span> {approach.successThresholds.communication}%
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-700">
                <div className="font-medium mb-1">Possible outcomes:</div>
                <div className="bg-green-50 p-2 rounded text-green-800 mb-1">
                  <span className="font-medium">Success:</span> {approach.outcomes.success}
                </div>
                <div className="bg-yellow-50 p-2 rounded text-yellow-800 mb-1">
                  <span className="font-medium">Partial:</span> {approach.outcomes.partial}
                </div>
                <div className="bg-red-50 p-2 rounded text-red-800">
                  <span className="font-medium">Failure:</span> {approach.outcomes.failure}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="boss" 
            onClick={() => onContinue(selectedApproach)}
            disabled={!selectedApproach}
          >
            Execute Approach
          </Button>
        </div>
      </div>
    </Card>
  );
}