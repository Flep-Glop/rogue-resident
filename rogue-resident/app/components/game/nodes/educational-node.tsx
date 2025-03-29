'use client';

import React, { useEffect, useState } from 'react';
import { useNode, useChallenge, useGame } from '@/lib/hooks';
import { ChallengeStage } from '@/lib/types/challenge-types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { IntroductionStage } from './challenge-stages/introduction-stage';
import { ConceptExplanationStage } from './challenge-stages/concept-explanation-stage';
import { VisualAidStage } from './challenge-stages/visual-aid-stage';
import { QuestionHandlingStage } from './challenge-stages/question-handling-stage';
import { OutcomeStage } from './challenge-stages/outcome-stage';

// Sample educational challenge data
const sampleEducationalChallenge = {
  id: 'educational-001',
  title: 'Radiation Biology Basics Lecture',
  description: 'Prepare and deliver a lecture on radiation biology basics for first-year medical students.',
  difficulty: 'normal',
  audience: 'First-year medical students with minimal physics background',
  topic: 'Radiation Biology Basics',
  learningObjectives: [
    'Understand the basic mechanisms of radiation damage to DNA',
    'Differentiate between direct and indirect effects of radiation',
    'Recognize the time course of radiation effects',
    'Explain the concept of fractionation in radiation therapy'
  ],
  stages: {
    conceptExplanation: {
      approaches: [
        { id: 'approach-1', name: 'Technical: Begin with detailed physics of energy deposition', isCorrect: false },
        { id: 'approach-2', name: 'Visual: Use analogies and diagrams to illustrate concepts', isCorrect: true },
        { id: 'approach-3', name: 'Clinical: Connect concepts to patient outcomes and treatments', isCorrect: false }
      ],
      selectedApproach: null,
      correctReason: 'Visual approaches with analogies and diagrams are most effective for beginners learning complex physics concepts.'
    },
    visualAid: {
      options: [
        { id: 'visual-1', name: 'Complex mathematical formulas', isEffective: false },
        { id: 'visual-2', name: 'DNA damage illustration with radiation tracks', isEffective: true },
        { id: 'visual-3', name: 'Detailed radiobiological survival curves', isEffective: false },
        { id: 'visual-4', name: 'Interactive comparison of radiation types', isEffective: true }
      ],
      selectedOptions: [],
      correctMinimum: 2
    },
    questionHandling: {
      questions: [
        {
          id: 'q1',
          question: 'Why do we use fractionation in radiation therapy?',
          answers: [
            { id: 'a1', text: 'To reduce machine workload', isCorrect: false },
            { id: 'a2', text: 'To allow normal tissue recovery while tumor cells remain more vulnerable', isCorrect: true },
            { id: 'a3', text: 'To give patients breaks between treatments', isCorrect: false }
          ],
          selectedAnswer: null
        },
        {
          id: 'q2',
          question: 'What is the difference between direct and indirect DNA damage?',
          answers: [
            { id: 'a1', text: 'Direct damage occurs immediately, indirect damage occurs later', isCorrect: false },
            { id: 'a2', text: 'Direct damage affects DNA bases, indirect damage affects the backbone', isCorrect: false },
            { id: 'a3', text: 'Direct damage is from radiation hitting DNA directly, indirect damage is from free radicals', isCorrect: true }
          ],
          selectedAnswer: null
        }
      ]
    }
  },
  rewards: [
    { type: 'insight', value: 60 },
    { type: 'researchPoints', value: 4 }
  ]
};

export function EducationalNode() {
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
          challenge: sampleEducationalChallenge
        });
        
        // Start the challenge
        startChallenge({
          id: sampleEducationalChallenge.id,
          type: 'educational',
          totalStages: 5,
          title: sampleEducationalChallenge.title,
          description: sampleEducationalChallenge.description,
          difficulty: 'normal'
        });
      }
    } catch (err) {
      console.error('Error initializing educational challenge:', err);
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
        
        // Calculate grade based on performance
        const performanceScore = calculatePerformanceScore();
        let grade: 'S' | 'A' | 'B' | 'C' | 'F' = 'C';
        
        if (performanceScore >= 90) grade = 'S';
        else if (performanceScore >= 80) grade = 'A';
        else if (performanceScore >= 70) grade = 'B';
        else if (performanceScore >= 50) grade = 'C';
        else grade = 'F';
        
        // Mark challenge as complete with calculated grade
        completeChallenge({
          grade,
          rewards: nodeData.challenge.rewards
        });
        
        // Mark the node interaction as completed
        completeInteraction(true);
      } catch (err) {
        console.error('Error completing educational node:', err);
        setError(err instanceof Error ? err : new Error('Failed to complete node'));
      }
    }
  };
  
  // Calculate performance score based on answers
  const calculatePerformanceScore = (): number => {
    if (!nodeData?.challenge) return 0;
    
    const challenge = nodeData.challenge;
    let score = 0;
    let totalPoints = 0;
    
    // Concept explanation scoring
    if (challenge.stages.conceptExplanation.selectedApproach) {
      totalPoints += 30;
      const approach = challenge.stages.conceptExplanation.approaches.find(
        a => a.id === challenge.stages.conceptExplanation.selectedApproach
      );
      if (approach?.isCorrect) score += 30;
    }
    
    // Visual aid scoring
    if (challenge.stages.visualAid.selectedOptions.length > 0) {
      totalPoints += 40;
      const correctOptionsCount = challenge.stages.visualAid.options
        .filter(o => challenge.stages.visualAid.selectedOptions.includes(o.id) && o.isEffective)
        .length;
      score += (correctOptionsCount / challenge.stages.visualAid.correctMinimum) * 40;
    }
    
    // Question handling scoring
    if (challenge.stages.questionHandling.questions.some(q => q.selectedAnswer)) {
      totalPoints += 30;
      const correctAnswersCount = challenge.stages.questionHandling.questions
        .filter(q => {
          if (!q.selectedAnswer) return false;
          const answer = q.answers.find(a => a.id === q.selectedAnswer);
          return answer?.isCorrect;
        })
        .length;
      score += (correctAnswersCount / challenge.stages.questionHandling.questions.length) * 30;
    }
    
    return totalPoints === 0 ? 0 : (score / totalPoints) * 100;
  };
  
  // Handle answer submission
  const handleSubmitAnswer = (stage: string, answer: any) => {
    try {
      submitResponse(stage as ChallengeStage, answer);
      
      // Update node data with the answer
      if (nodeData?.challenge) {
        const updatedChallenge = { ...nodeData.challenge };
        if (stage === 'stage1' && updatedChallenge.stages.conceptExplanation) {
          updatedChallenge.stages.conceptExplanation.selectedApproach = answer;
        } else if (stage === 'stage2' && updatedChallenge.stages.visualAid) {
          updatedChallenge.stages.visualAid.selectedOptions = answer;
        } else if (stage === 'stage3' && updatedChallenge.stages.questionHandling) {
          // For questions, we receive an object with questionId -> answerId mapping
          for (const questionId in answer) {
            const questionIndex = updatedChallenge.stages.questionHandling.questions.findIndex(q => q.id === questionId);
            if (questionIndex >= 0) {
              updatedChallenge.stages.questionHandling.questions[questionIndex].selectedAnswer = answer[questionId];
            }
          }
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-educational"></div>
        <span className="ml-3 text-educational">Loading challenge...</span>
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
            audience={challenge.audience}
            onContinue={goToNextStage}
          />
        );
      
      case 'stage1': // Concept Explanation
        return (
          <ConceptExplanationStage
            data={challenge.stages.conceptExplanation}
            learningObjectives={challenge.learningObjectives}
            onBack={goToPreviousStage}
            onContinue={(selectedApproach) => {
              handleSubmitAnswer('stage1', selectedApproach);
              goToNextStage();
            }}
          />
        );
      
      case 'stage2': // Visual Aid Creation
        return (
          <VisualAidStage
            data={challenge.stages.visualAid}
            onBack={goToPreviousStage}
            onContinue={(selectedOptions) => {
              handleSubmitAnswer('stage2', selectedOptions);
              goToNextStage();
            }}
          />
        );
      
      case 'stage3': // Question Handling
        return (
          <QuestionHandlingStage
            data={challenge.stages.questionHandling}
            onBack={goToPreviousStage}
            onContinue={(answers) => {
              handleSubmitAnswer('stage3', answers);
              goToNextStage();
            }}
          />
        );
      
      case 'outcome':
        return (
          <OutcomeStage
            title="Educational Challenge Complete"
            grade={calculatePerformanceScore() >= 80 ? 'A' : calculatePerformanceScore() >= 70 ? 'B' : 'C'}
            feedback="The students responded well to your teaching approach. Your visual aids were particularly effective."
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
               interactionStage === 'stage1' ? 'Concept Explanation' :
               interactionStage === 'stage2' ? 'Visual Aid Creation' :
               interactionStage === 'stage3' ? 'Question Handling' :
               interactionStage === 'outcome' ? 'Outcome' : 'Unknown Stage'}
            </span>
            <span className="text-sm text-slate-400">
              {calculateProgress().toFixed(0)}%
            </span>
          </div>
          <Progress value={calculateProgress()} variant="educational" />
        </div>
        
        {/* Stage content */}
        {renderStage()}
      </div>
    </ErrorBoundary>
  );
}

// Note: These component imports are placeholders. You'll need to implement these components.
// Here are stub implementations for these components:

function ConceptExplanationStage({ data, learningObjectives, onBack, onContinue }) {
  const [selectedApproach, setSelectedApproach] = useState(data.selectedApproach);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Concept Explanation</h3>
        <p className="text-gray-600">
          Choose the most effective approach to explain radiation biology concepts to first-year medical students:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h4 className="font-medium mb-2">Learning Objectives:</h4>
          <ul className="list-disc list-inside space-y-1">
            {learningObjectives.map((objective, index) => (
              <li key={index} className="text-gray-700">{objective}</li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-2">
          {data.approaches.map(approach => (
            <div 
              key={approach.id}
              className={`
                p-3 rounded-md cursor-pointer border 
                ${selectedApproach === approach.id 
                  ? 'border-educational bg-educational bg-opacity-10' 
                  : 'border-gray-200 hover:border-educational'
                }
              `}
              onClick={() => setSelectedApproach(approach.id)}
            >
              {approach.name}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="educational" 
            onClick={() => onContinue(selectedApproach)}
            disabled={!selectedApproach}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function VisualAidStage({ data, onBack, onContinue }) {
  const [selectedOptions, setSelectedOptions] = useState(data.selectedOptions || []);
  
  const toggleOption = (optionId) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Visual Aid Creation</h3>
        <p className="text-gray-600">
          Select the visual aids that would be most effective for teaching radiation biology to first-year medical students:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-2">
          <p className="text-sm text-gray-600">
            Choose at least {data.correctMinimum} visual aids to include in your presentation.
          </p>
        </div>
        
        <div className="space-y-2">
          {data.options.map(option => (
            <div 
              key={option.id}
              className={`
                p-3 rounded-md cursor-pointer border flex items-start
                ${selectedOptions.includes(option.id) 
                  ? 'border-educational bg-educational bg-opacity-10' 
                  : 'border-gray-200 hover:border-educational'
                }
              `}
              onClick={() => toggleOption(option.id)}
            >
              <input 
                type="checkbox" 
                checked={selectedOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
                className="mt-1 mr-3"
              />
              <span>{option.name}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="educational" 
            onClick={() => onContinue(selectedOptions)}
            disabled={selectedOptions.length < data.correctMinimum}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

function QuestionHandlingStage({ data, onBack, onContinue }) {
  const [answers, setAnswers] = useState({});
  
  const selectAnswer = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const allQuestionsAnswered = data.questions.every(q => answers[q.id]);
  
  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Question Handling</h3>
        <p className="text-gray-600">
          Students have asked the following questions. Select the best response for each:
        </p>
        
        <div className="space-y-6">
          {data.questions.map(question => (
            <div key={question.id} className="border rounded-md p-4">
              <h4 className="font-medium mb-3">{question.question}</h4>
              
              <div className="space-y-2">
                {question.answers.map(answer => (
                  <div 
                    key={answer.id}
                    className={`
                      p-3 rounded-md cursor-pointer border 
                      ${answers[question.id] === answer.id
                        ? 'border-educational bg-educational bg-opacity-10' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                    onClick={() => selectAnswer(question.id, answer.id)}
                  >
                    {answer.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="educational" 
            onClick={() => onContinue(answers)}
            disabled={!allQuestionsAnswered}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}