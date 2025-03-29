'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectInteractionStage,
  setNodeState,
  selectNodeData,
  updateNodeData,
} from '@/lib/redux/slices/node-slice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ClinicalChallengeData } from '@/lib/types/game-types';
import { IntroductionStage } from './challenge-stages/introduction-stage';
import { ImagingStage } from './challenge-stages/imaging-stage';
import { ParameterStage } from './challenge-stages/parameter-stage';
import { DoseStage } from './challenge-stages/dose-stage';
import { EvaluationStage } from './challenge-stages/evaluation-stage';
import { OutcomeStage } from './challenge-stages/outcome-stage';
import { completeCurrentNode } from '@/lib/redux/slices/map-slice';
import { addInsight, addScore } from '@/lib/redux/slices/game-slice';
import { startChallenge, completeChallenge } from '@/lib/redux/slices/challenge-slice';

// Sample clinical challenge data
const sampleClinicalChallenge: ClinicalChallengeData = {
  id: 'clinical-001',
  title: 'Breast Cancer Treatment Plan',
  description: 'Evaluate CT images and create an optimal treatment plan for this breast cancer case.',
  difficulty: 'normal',
  type: 'clinical',
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
  const dispatch = useAppDispatch();
  const currentStage = useAppSelector(selectInteractionStage);
  const nodeData = useAppSelector(selectNodeData);
  
  // Initialize challenge data if not set
  useEffect(() => {
    if (!nodeData || !nodeData.challenge) {
      dispatch(updateNodeData({
        challenge: sampleClinicalChallenge
      }));
      
      // Start the challenge in the challenge slice
      dispatch(startChallenge({
        challengeType: 'clinical',
        difficulty: 'normal',
        title: sampleClinicalChallenge.title,
        description: sampleClinicalChallenge.description,
        stages: [
          { id: 'introduction', type: 'introduction', content: sampleClinicalChallenge, isCompleted: false },
          { id: 'imaging', type: 'imaging', content: sampleClinicalChallenge.stages.imaging, isCompleted: false },
          { id: 'parameters', type: 'parameters', content: sampleClinicalChallenge.stages.parameters, isCompleted: false },
          { id: 'dose', type: 'dose', content: sampleClinicalChallenge.stages.dose, isCompleted: false },
          { id: 'plan', type: 'plan', content: sampleClinicalChallenge.stages.plan, isCompleted: false },
          { id: 'outcome', type: 'outcome', content: sampleClinicalChallenge, isCompleted: false }
        ]
      }));
    }
  }, [dispatch, nodeData]);
  
  // Handle stage navigation
  const goToNextStage = () => {
    const stageOrder = ['introduction', 'imaging', 'parameters', 'dose', 'plan', 'outcome'];
    const currentIndex = stageOrder.indexOf(currentStage);
    
    if (currentIndex < stageOrder.length - 1) {
      dispatch(setNodeState(stageOrder[currentIndex + 1]));
    } else {
      // Last stage - complete the node
      completeNode();
    }
  };
  
  const goToPreviousStage = () => {
    const stageOrder = ['introduction', 'imaging', 'parameters', 'dose', 'plan', 'outcome'];
    const currentIndex = stageOrder.indexOf(currentStage);
    
    if (currentIndex > 0) {
      dispatch(setNodeState(stageOrder[currentIndex - 1]));
    }
  };
  
  // Complete the node and give rewards
  const completeNode = () => {
    if (nodeData?.challenge) {
      // Award rewards
      nodeData.challenge.rewards.forEach(reward => {
        if (reward.type === 'insight') {
          dispatch(addInsight(reward.value));
        } else if (reward.type === 'researchPoints') {
          dispatch(addScore(reward.value));
        }
      });
      
      // Mark challenge as complete with a grade (simplified for now)
      dispatch(completeChallenge({
        grade: 'A',
        rewards: nodeData.challenge.rewards
      }));
      
      // Mark the map node as completed
      dispatch(completeCurrentNode());
    }
  };
  
  // Render the current stage
  const renderStage = () => {
    if (!nodeData?.challenge) {
      return <div className="text-center py-8">Loading challenge data...</div>;
    }
    
    switch (currentStage) {
      case 'introduction':
        return (
          <IntroductionStage
            title={nodeData.challenge.title}
            description={nodeData.challenge.description}
            patientInfo={nodeData.challenge.patientInfo}
            onContinue={goToNextStage}
          />
        );
      case 'imaging':
        return (
          <ImagingStage
            data={nodeData.challenge.stages.imaging}
            onBack={goToPreviousStage}
            onContinue={goToNextStage}
          />
        );
      case 'parameters':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Parameter Selection</h3>
            <p className="text-gray-600">
              Select the appropriate treatment parameters for this patient.
            </p>
            
            {/* Parameter selection form - simplified for now */}
            <Card>
              <CardHeader>
                <CardTitle>Treatment Parameters</CardTitle>
                <CardDescription>
                  Choose the most appropriate parameters for this breast cancer case.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="font-medium">Energy:</label>
                  <div className="flex gap-2">
                    {nodeData.challenge.stages.parameters.options.energy.map(energy => (
                      <Button
                        key={energy}
                        variant={energy === '6 MV' ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        {energy}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium">Technique:</label>
                  <div className="flex gap-2">
                    {nodeData.challenge.stages.parameters.options.technique.map(technique => (
                      <Button
                        key={technique}
                        variant={technique === 'IMRT' ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        {technique}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="font-medium">Modality:</label>
                  <div className="flex gap-2">
                    {nodeData.challenge.stages.parameters.options.modality.map(modality => (
                      <Button
                        key={modality}
                        variant={modality === 'Photons' ? 'primary' : 'secondary'}
                        size="sm"
                      >
                        {modality}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={goToPreviousStage}>
                Back
              </Button>
              <Button variant="primary" onClick={goToNextStage}>
                Continue
              </Button>
            </div>
          </div>
        );
      case 'dose':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Dose Calculation</h3>
            <p className="text-gray-600">
              Calculate the total dose based on the prescription.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Dose Calculation</CardTitle>
                <CardDescription>
                  Prescription: {nodeData.challenge.stages.dose.prescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="font-medium">Calculate total dose (Gy):</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      className="border border-gray-300 rounded-md px-3 py-2"
                      defaultValue={50}
                    />
                    <span>Gy</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={goToPreviousStage}>
                Back
              </Button>
              <Button variant="primary" onClick={goToNextStage}>
                Continue
              </Button>
            </div>
          </div>
        );
      case 'plan':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Plan Evaluation</h3>
            <p className="text-gray-600">
              Evaluate the treatment plan against clinical constraints.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Plan Evaluation</CardTitle>
                <CardDescription>
                  Check if the plan meets all dose constraints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left">Structure</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Constraint</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Plan Value</th>
                        <th className="border border-gray-300 px-3 py-2 text-left">Meets Constraint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nodeData.challenge.stages.plan.constraints.map((constraint, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-3 py-2">{constraint.structure}</td>
                          <td className="border border-gray-300 px-3 py-2">
                            {constraint.type === 'mean' ? 'Mean' : constraint.type === 'max' ? 'Max' : 'Min'}{' '}
                            {constraint.dose} Gy
                            {constraint.volume && ` to ${constraint.volume}%`}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {(constraint.dose - (Math.random() * 4 - 2)).toFixed(1)} Gy
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            <input type="checkbox" defaultChecked={index !== 1} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={goToPreviousStage}>
                Back
              </Button>
              <Button variant="primary" onClick={goToNextStage}>
                Continue
              </Button>
            </div>
          </div>
        );
      case 'outcome':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Challenge Outcome</h3>
            <p className="text-gray-600">
              Your treatment plan has been evaluated.
            </p>
            
            <Card>
              <CardHeader>
                <CardTitle>Challenge Results</CardTitle>
                <CardDescription>
                  Here's how your treatment plan performed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-2">A</div>
                  <div className="text-lg font-medium">Excellent Work!</div>
                  <p className="text-gray-600 mt-2">
                    Your treatment plan provides excellent coverage while sparing critical structures.
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-medium mb-2">Rewards:</h4>
                  <ul className="space-y-1">
                    {nodeData.challenge.rewards.map((reward, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-600 mr-2">+</span>
                        <span>{reward.value} {reward.type}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-4">
              <Button variant="primary" onClick={completeNode}>
                Complete Challenge
              </Button>
            </div>
          </div>
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
  
  return <div className="space-y-4">{renderStage()}</div>;
}