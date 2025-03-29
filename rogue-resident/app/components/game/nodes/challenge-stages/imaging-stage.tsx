'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { submitAnswer } from '@/lib/redux/slices/challenge-slice';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ImagingStageProps {
  data: {
    images: string[];
    correctAnswers: string[];
    userAnswers?: string[];
  };
  onBack: () => void;
  onContinue: () => void;
}

export function ImagingStage({ data, onBack, onContinue }: ImagingStageProps) {
  const dispatch = useAppDispatch();
  const [selectedStructures, setSelectedStructures] = useState<string[]>(
    data.userAnswers || []
  );
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Available structures to identify
  const availableStructures = [
    'tumor_volume',
    'lymph_nodes',
    'heart',
    'lungs',
    'spinal_cord',
    'liver'
  ];
  
  // Structure name mapping for display
  const structureNames: Record<string, string> = {
    tumor_volume: 'Tumor Volume',
    lymph_nodes: 'Lymph Nodes',
    heart: 'Heart',
    lungs: 'Lungs',
    spinal_cord: 'Spinal Cord',
    liver: 'Liver'
  };
  
  // Toggle structure selection
  const toggleStructure = (structureId: string) => {
    setSelectedStructures(prev => 
      prev.includes(structureId)
        ? prev.filter(id => id !== structureId)
        : [...prev, structureId]
    );
  };
  
  // Submit answer
  const handleSubmit = () => {
    dispatch(submitAnswer(selectedStructures));
    setShowFeedback(true);
  };
  
  // Continue to next stage
  const handleContinue = () => {
    if (!showFeedback) {
      handleSubmit();
    } else {
      onContinue();
    }
  };
  
  // Check if a structure was correctly identified
  const isCorrect = (structureId: string) => {
    if (!showFeedback) return undefined;
    
    const isSelected = selectedStructures.includes(structureId);
    const shouldBeSelected = data.correctAnswers.includes(structureId);
    
    if (isSelected === shouldBeSelected) {
      return true;
    } else {
      return false;
    }
  };
  
  // Calculate score
  const calculateScore = () => {
    if (!showFeedback) return 0;
    
    let correctCount = 0;
    
    // Count correctly identified structures
    availableStructures.forEach(structure => {
      const isSelected = selectedStructures.includes(structure);
      const shouldBeSelected = data.correctAnswers.includes(structure);
      
      if (isSelected === shouldBeSelected) {
        correctCount++;
      }
    });
    
    // Calculate percentage
    return Math.round((correctCount / availableStructures.length) * 100);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Imaging Review</h2>
        <p className="text-gray-600">
          Review the CT images and identify the relevant structures for treatment planning.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>CT Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.images.length > 0 ? (
              data.images.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                  {/* Placeholder for CT images */}
                  <div className="bg-gray-100 w-full h-48 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <div>CT Image {index + 1}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-8">
                No images available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Structure identification */}
        <Card>
          <CardHeader>
            <CardTitle>Structure Identification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Select all relevant structures that should be considered in the treatment plan:
            </p>
            <div className="space-y-2">
              {availableStructures.map(structure => {
                const correct = isCorrect(structure);
                
                return (
                  <div
                    key={structure}
                    className={`flex items-center p-2 border rounded-md cursor-pointer
                      ${selectedStructures.includes(structure) ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'}
                      ${correct === true ? 'bg-green-50 border-green-500' : ''}
                      ${correct === false ? 'bg-red-50 border-red-500' : ''}
                    `}
                    onClick={() => !showFeedback && toggleStructure(structure)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStructures.includes(structure)}
                      onChange={() => !showFeedback && toggleStructure(structure)}
                      disabled={showFeedback}
                      className="mr-2"
                    />
                    <span className="flex-1">{structureNames[structure]}</span>
                    {correct === true && <span className="text-green-600">✓</span>}
                    {correct === false && <span className="text-red-600">✗</span>}
                  </div>
                );
              })}
            </div>
          </CardContent>
          {showFeedback && (
            <CardFooter className="border-t border-gray-200 flex flex-col items-start pt-4">
              <div className="mb-2">
                <div className="font-medium">Your Score: {calculateScore()}%</div>
                <div className="text-sm text-gray-600">
                  {calculateScore() >= 80
                    ? 'Excellent work! You correctly identified most structures.'
                    : calculateScore() >= 60
                    ? 'Good job. Some structures were missed or incorrectly selected.'
                    : 'Review needed. Several structures were missed or incorrectly selected.'}
                </div>
              </div>
              <div className="text-sm">
                <div className="font-medium mb-1">Key Structures:</div>
                <ul className="list-disc pl-5">
                  {data.correctAnswers.map(answer => (
                    <li key={answer}>{structureNames[answer]}</li>
                  ))}
                </ul>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          {showFeedback ? 'Continue' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}