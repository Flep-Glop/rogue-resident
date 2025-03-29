'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip } from '@/components/ui/tooltip';
import { useKeyPress } from '@/lib/hooks';

interface DoseStageProps {
  data: {
    prescription: string;
    parameters: Record<string, string | number>;
    correctAnswer: number;
    userAnswer?: number;
    tolerance: number; // percentage tolerance for correct answer
  };
  onBack: () => void;
  onContinue: (answer: number) => void;
}

export function DoseStage({ data, onBack, onContinue }: DoseStageProps) {
  const [answer, setAnswer] = useState<string>(
    data.userAnswer ? data.userAnswer.toString() : ''
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enter key handler for submission
  useKeyPress('Enter', {
    onKeyDown: () => {
      if (answer && !showFeedback) {
        handleSubmit();
      } else if (showFeedback) {
        handleContinue();
      }
    }
  });

  // Validate numeric input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAnswer(value);
      setError(null);
    }
  };

  // Submit answer
  const handleSubmit = () => {
    try {
      const numericAnswer = parseFloat(answer);
      
      if (isNaN(numericAnswer)) {
        setError('Please enter a valid number');
        return;
      }

      // Simulate calculation time
      setIsCalculating(true);
      setTimeout(() => {
        setIsCalculating(false);
        setShowFeedback(true);
      }, 800);
    } catch (err) {
      setError('Error processing your answer. Please try again.');
      console.error('Error in dose calculation:', err);
    }
  };

  // Continue to next stage
  const handleContinue = () => {
    try {
      const numericAnswer = parseFloat(answer);
      onContinue(numericAnswer);
    } catch (err) {
      setError('Error submitting your answer. Please try again.');
      console.error('Error continuing from dose stage:', err);
    }
  };

  // Check if answer is correct within tolerance
  const isAnswerCorrect = () => {
    if (!showFeedback) return undefined;
    
    const numericAnswer = parseFloat(answer);
    const lowerBound = data.correctAnswer * (1 - data.tolerance / 100);
    const upperBound = data.correctAnswer * (1 + data.tolerance / 100);
    
    return numericAnswer >= lowerBound && numericAnswer <= upperBound;
  };

  // Calculate percentage difference from correct answer
  const calculateDifference = () => {
    const numericAnswer = parseFloat(answer);
    return Math.abs((numericAnswer - data.correctAnswer) / data.correctAnswer * 100).toFixed(1);
  };

  // Format parameters for display
  const formatParameters = () => {
    return Object.entries(data.parameters).map(([key, value]) => (
      <div key={key} className="flex justify-between py-1 border-b border-gray-200">
        <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
        <span>{value}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Dose Calculation</h2>
        <p className="text-gray-600">
          Based on the provided prescription and parameters, calculate the total dose.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Prescription and parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Clinical Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-1">Prescription</h4>
              <div className="px-3 py-2 bg-blue-50 border border-blue-100 rounded-md">
                {data.prescription}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-1">Parameters</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                {formatParameters()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calculation input */}
        <Card>
          <CardHeader>
            <CardTitle>Your Calculation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Calculate the total dose based on the prescription and parameters.
            </p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Total Dose (Gy)
              </label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={answer}
                  onChange={handleChange}
                  placeholder="Enter dose in Gy"
                  disabled={showFeedback}
                  className={`text-lg ${
                    isAnswerCorrect() === true
                      ? 'border-green-500'
                      : isAnswerCorrect() === false
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                {!showFeedback && (
                  <Button
                    onClick={handleSubmit}
                    disabled={!answer || isCalculating}
                    className="whitespace-nowrap"
                  >
                    {isCalculating ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating
                      </span>
                    ) : (
                      'Calculate'
                    )}
                  </Button>
                )}
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            {showFeedback && (
              <div className={`p-4 rounded-md mt-4 ${
                isAnswerCorrect() 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-start">
                  <div className={`rounded-full p-1 mr-3 ${
                    isAnswerCorrect() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {isAnswerCorrect() ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  
                  <div>
                    <h4 className={`font-medium ${
                      isAnswerCorrect() ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isAnswerCorrect() ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className={`text-sm ${
                      isAnswerCorrect() ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {isAnswerCorrect() 
                        ? `Your answer is within the ${data.tolerance}% tolerance range.`
                        : `Your answer is off by ${calculateDifference()}%.`
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Correct answer: {data.correctAnswer} Gy
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
          <Tooltip 
            content="Submit your answer first"
            position="top"
          >
            <span>
              <Button 
                disabled={true}
                className="opacity-50 cursor-not-allowed"
              >
                Continue
              </Button>
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

// In a real implementation, you might want to add these helpers:
// 1. A calculator utility for common radiation therapy calculations
// 2. Visual aids for helping with dose calculations 
// 3. Formula references for educational purposes