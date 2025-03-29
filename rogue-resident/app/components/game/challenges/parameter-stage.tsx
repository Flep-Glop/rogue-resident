'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip } from '@/components/ui/tooltip';

interface ParameterOption {
  value: string;
  label: string;
  description?: string;
}

interface ParameterStageData {
  options: {
    energy: string[];
    technique: string[];
    modality: string[];
  };
  correctAnswers: {
    energy: string;
    technique: string;
    modality: string;
  };
  userAnswers?: {
    energy?: string;
    technique?: string;
    modality?: string;
  };
  explanations?: {
    energy?: Record<string, string>;
    technique?: Record<string, string>;
    modality?: Record<string, string>;
  };
}

interface ParameterStageProps {
  data: ParameterStageData;
  onBack: () => void;
  onContinue: (answers: Record<string, string>) => void;
}

export function ParameterStage({ data, onBack, onContinue }: ParameterStageProps) {
  // Initialize state from existing user answers or empty
  const [answers, setAnswers] = useState<Record<string, string>>({
    energy: data.userAnswers?.energy || '',
    technique: data.userAnswers?.technique || '',
    modality: data.userAnswers?.modality || '',
  });
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null);
  
  // Format options for display
  const formatOptions = (
    paramType: 'energy' | 'technique' | 'modality', 
    options: string[]
  ): ParameterOption[] => {
    return options.map(option => ({
      value: option,
      label: option,
      description: data.explanations?.[paramType]?.[option] || ''
    }));
  };

  // Update an answer
  const updateAnswer = (parameter: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [parameter]: value
    }));
  };

  // Check if all parameters have been selected
  const areAllParametersSelected = () => {
    return answers.energy && answers.technique && answers.modality;
  };

  // Submit answers for evaluation
  const handleSubmit = () => {
    setShowFeedback(true);
  };

  // Continue to next stage
  const handleContinue = () => {
    onContinue(answers);
  };

  // Check if a specific answer is correct
  const isAnswerCorrect = (parameter: string) => {
    if (!showFeedback) return undefined;
    return answers[parameter] === data.correctAnswers[parameter as keyof typeof data.correctAnswers];
  };

  // Get score based on number of correct answers
  const getScore = () => {
    if (!showFeedback) return 0;
    
    let correct = 0;
    if (answers.energy === data.correctAnswers.energy) correct++;
    if (answers.technique === data.correctAnswers.technique) correct++;
    if (answers.modality === data.correctAnswers.modality) correct++;
    
    return (correct / 3) * 100;
  };

  // Helper for explanation text
  const getExplanationForParameter = (parameter: string, option: string) => {
    if (!data.explanations) return '';
    const paramExplanations = data.explanations[parameter as keyof typeof data.explanations];
    return paramExplanations?.[option] || '';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Treatment Parameter Selection</h2>
        <p className="text-gray-600">
          Select the appropriate parameters for this treatment plan based on the patient case.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Parameter selection cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Energy Selection</span>
              {showFeedback && (
                <Badge variant={isAnswerCorrect('energy') ? 'success' : 'danger'}>
                  {isAnswerCorrect('energy') ? 'Correct' : 'Incorrect'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers.energy}
              onValueChange={(value) => updateAnswer('energy', value)}
              disabled={showFeedback}
            >
              <div className="space-y-3">
                {formatOptions('energy', data.options.energy).map((option) => (
                  <div
                    key={option.value}
                    className={`
                      flex items-center space-x-2 rounded-md border p-3
                      ${answers.energy === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      ${showFeedback && answers.energy === option.value && isAnswerCorrect('energy') ? 'bg-green-50 border-green-500' : ''}
                      ${showFeedback && answers.energy === option.value && !isAnswerCorrect('energy') ? 'bg-red-50 border-red-500' : ''}
                      ${showFeedback && option.value === data.correctAnswers.energy && !isAnswerCorrect('energy') ? 'border-green-500 border-dashed' : ''}
                    `}
                  >
                    <RadioGroupItem value={option.value} id={`energy-${option.value}`} />
                    <Label htmlFor={`energy-${option.value}`} className="flex-grow cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {showFeedback && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                <p className="font-medium">Explanation:</p>
                <p>{getExplanationForParameter('energy', data.correctAnswers.energy) || 
                  `${data.correctAnswers.energy} is the appropriate energy for this treatment case.`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Technique Selection</span>
              {showFeedback && (
                <Badge variant={isAnswerCorrect('technique') ? 'success' : 'danger'}>
                  {isAnswerCorrect('technique') ? 'Correct' : 'Incorrect'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers.technique}
              onValueChange={(value) => updateAnswer('technique', value)}
              disabled={showFeedback}
            >
              <div className="space-y-3">
                {formatOptions('technique', data.options.technique).map((option) => (
                  <div
                    key={option.value}
                    className={`
                      flex items-center space-x-2 rounded-md border p-3
                      ${answers.technique === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      ${showFeedback && answers.technique === option.value && isAnswerCorrect('technique') ? 'bg-green-50 border-green-500' : ''}
                      ${showFeedback && answers.technique === option.value && !isAnswerCorrect('technique') ? 'bg-red-50 border-red-500' : ''}
                      ${showFeedback && option.value === data.correctAnswers.technique && !isAnswerCorrect('technique') ? 'border-green-500 border-dashed' : ''}
                    `}
                  >
                    <RadioGroupItem value={option.value} id={`technique-${option.value}`} />
                    <Label htmlFor={`technique-${option.value}`} className="flex-grow cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {showFeedback && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                <p className="font-medium">Explanation:</p>
                <p>{getExplanationForParameter('technique', data.correctAnswers.technique) || 
                  `${data.correctAnswers.technique} is the appropriate technique for this treatment case.`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Modality Selection</span>
              {showFeedback && (
                <Badge variant={isAnswerCorrect('modality') ? 'success' : 'danger'}>
                  {isAnswerCorrect('modality') ? 'Correct' : 'Incorrect'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers.modality}
              onValueChange={(value) => updateAnswer('modality', value)}
              disabled={showFeedback}
            >
              <div className="space-y-3">
                {formatOptions('modality', data.options.modality).map((option) => (
                  <div
                    key={option.value}
                    className={`
                      flex items-center space-x-2 rounded-md border p-3
                      ${answers.modality === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      ${showFeedback && answers.modality === option.value && isAnswerCorrect('modality') ? 'bg-green-50 border-green-500' : ''}
                      ${showFeedback && answers.modality === option.value && !isAnswerCorrect('modality') ? 'bg-red-50 border-red-500' : ''}
                      ${showFeedback && option.value === data.correctAnswers.modality && !isAnswerCorrect('modality') ? 'border-green-500 border-dashed' : ''}
                    `}
                  >
                    <RadioGroupItem value={option.value} id={`modality-${option.value}`} />
                    <Label htmlFor={`modality-${option.value}`} className="flex-grow cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            {showFeedback && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-700">
                <p className="font-medium">Explanation:</p>
                <p>{getExplanationForParameter('modality', data.correctAnswers.modality) || 
                  `${data.correctAnswers.modality} is the appropriate modality for this treatment case.`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback section */}
        {showFeedback && (
          <Card>
            <CardHeader>
              <CardTitle>Overall Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">Score</span>
                    <span className="text-sm font-medium">{getScore().toFixed(0)}%</span>
                  </div>
                  <Progress value={getScore()} variant="clinical" />
                </div>

                <div className="p-4 rounded-md bg-gray-50">
                  {getScore() === 100 ? (
                    <p className="text-green-700">
                      Excellent work! You've selected the optimal parameters for this treatment plan.
                    </p>
                  ) : getScore() >= 66 ? (
                    <p className="text-yellow-700">
                      Good work. Your selections are mostly appropriate, but there's room for improvement.
                    </p>
                  ) : getScore() >= 33 ? (
                    <p className="text-orange-700">
                      Some of your selections are appropriate, but reconsider the others based on the case details.
                    </p>
                  ) : (
                    <p className="text-red-700">
                      Your parameter selections need significant revision. Review the patient case carefully.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        
        {showFeedback ? (
          <Button onClick={handleContinue}>
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={!areAllParametersSelected()}
            variant="primary"
          >
            Submit Selections
          </Button>
        )}
      </div>
    </div>
  );
}