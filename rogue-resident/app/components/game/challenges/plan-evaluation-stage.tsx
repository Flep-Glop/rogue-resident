'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlanConstraint {
  structure: string;
  type: 'max' | 'mean' | 'volume';
  dose: number;
  volume?: number;
  id: string;
}

interface PlanIssue {
  id: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  image?: string;
}

interface PlanEvaluationData {
  dvhData: Record<string, any>; // DVH data for visualization
  structures: string[];
  constraints: PlanConstraint[];
  issues: PlanIssue[];
  correctIssues: string[];
  userSelectedIssues?: string[];
}

interface PlanEvaluationStageProps {
  data: PlanEvaluationData;
  onBack: () => void;
  onContinue: (selectedIssues: string[]) => void;
}

export function PlanEvaluationStage({ data, onBack, onContinue }: PlanEvaluationStageProps) {
  // Initialize selected issues from user data or empty array
  const [selectedIssues, setSelectedIssues] = useState<string[]>(
    data.userSelectedIssues || []
  );
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('constraints');
  const [selectedStructure, setSelectedStructure] = useState<string | null>(null);
  
  // Toggle an issue selection
  const toggleIssue = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  // Submit answers for evaluation
  const handleSubmit = () => {
    setShowFeedback(true);
  };

  // Continue to next stage
  const handleContinue = () => {
    onContinue(selectedIssues);
  };

  // Calculate score based on correct issue identification
  const calculateScore = () => {
    if (!showFeedback) return { percentage: 0, falsePositives: 0, falseNegatives: 0 };
    
    const correctIdentifications = selectedIssues.filter(id => 
      data.correctIssues.includes(id)
    ).length;
    
    const falsePositives = selectedIssues.filter(id => 
      !data.correctIssues.includes(id)
    ).length;
    
    const falseNegatives = data.correctIssues.filter(id => 
      !selectedIssues.includes(id)
    ).length;
    
    // Calculate percentage based on true positives minus penalties for false positives/negatives
    const maxScore = data.correctIssues.length;
    let score = correctIdentifications - (falsePositives * 0.5);
    score = Math.max(0, score); // Don't go below 0
    
    const percentage = (score / maxScore) * 100;
    
    return {
      percentage: Math.min(100, percentage), // Cap at 100%
      falsePositives,
      falseNegatives
    };
  };

  // Check if an issue was correctly identified
  const issueStatus = (issueId: string) => {
    if (!showFeedback) return null;
    
    const isSelected = selectedIssues.includes(issueId);
    const isCorrect = data.correctIssues.includes(issueId);
    
    if (isSelected && isCorrect) return 'correct';
    if (isSelected && !isCorrect) return 'false-positive';
    if (!isSelected && isCorrect) return 'missed';
    return 'correct-ignore'; // Correctly not selected
  };

  // Format constraint text
  const formatConstraint = (constraint: PlanConstraint) => {
    if (constraint.type === 'max') {
      return `${constraint.structure} maximum dose < ${constraint.dose} Gy`;
    } else if (constraint.type === 'mean') {
      return `${constraint.structure} mean dose < ${constraint.dose} Gy`;
    } else if (constraint.type === 'volume') {
      return `${constraint.structure} V${constraint.dose} < ${constraint.volume}%`;
    }
    return '';
  };

  // Get severity color
  const getSeverityColor = (severity: 'minor' | 'major' | 'critical') => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'major': return 'text-orange-600';
      case 'minor': return 'text-yellow-600';
      default: return '';
    }
  };

  // Render the DVH graph (placeholder)
  const renderDVHGraph = () => {
    // In a real implementation, this would use a graphing library
    return (
      <div className="h-64 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <p>DVH Graph would render here</p>
          <p className="text-sm">Dose-Volume Histogram</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Treatment Plan Evaluation</h2>
        <p className="text-gray-600">
          Evaluate the treatment plan against constraints and identify any issues.
        </p>
      </div>

      <Tabs defaultValue="constraints" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="constraints">Constraints</TabsTrigger>
          <TabsTrigger value="dvh">DVH</TabsTrigger>
          <TabsTrigger value="dose">Dose Display</TabsTrigger>
        </TabsList>
        
        <TabsContent value="constraints">
          <Card>
            <CardHeader>
              <CardTitle>Plan Constraints</CardTitle>
              <CardDescription>
                Evaluate whether the plan meets all required constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.constraints.map((constraint, index) => (
                  <div 
                    key={constraint.id} 
                    className="p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{formatConstraint(constraint)}</p>
                        <p className="text-sm text-gray-600">
                          {constraint.structure} constraint
                        </p>
                      </div>
                      <Badge>
                        {constraint.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dvh">
          <Card>
            <CardHeader>
              <CardTitle>Dose-Volume Histogram</CardTitle>
              <CardDescription>
                Analyze the DVH to evaluate plan quality
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap mb-2">
                  {data.structures.map(structure => (
                    <Badge
                      key={structure}
                      variant={selectedStructure === structure ? 'primary' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedStructure(structure)}
                    >
                      {structure}
                    </Badge>
                  ))}
                </div>
                
                {renderDVHGraph()}
                
                <p className="text-sm text-gray-600">
                  Select structures above to highlight them in the DVH.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dose">
          <Card>
            <CardHeader>
              <CardTitle>Dose Distribution</CardTitle>
              <CardDescription>
                Review the 3D dose distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md bg-gray-50 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>Axial View</p>
                    <p className="text-sm">Dose distribution</p>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-md bg-gray-50 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>Sagittal View</p>
                    <p className="text-sm">Dose distribution</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Plan Issues</CardTitle>
          <CardDescription>
            Identify any issues with the treatment plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.issues.map(issue => {
              const status = issueStatus(issue.id);
              return (
                <div
                  key={issue.id}
                  className={`
                    p-3 border rounded-md flex items-start gap-3
                    ${!showFeedback && selectedIssues.includes(issue.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${status === 'correct' ? 'bg-green-50 border-green-500' : ''}
                    ${status === 'false-positive' ? 'bg-red-50 border-red-500' : ''}
                    ${status === 'missed' ? 'bg-yellow-50 border-yellow-500' : ''}
                  `}
                >
                  <div className="pt-0.5">
                    <Checkbox
                      id={`issue-${issue.id}`}
                      checked={selectedIssues.includes(issue.id)}
                      onCheckedChange={() => !showFeedback && toggleIssue(issue.id)}
                      disabled={showFeedback}
                    />
                  </div>
                  <div className="flex-1">
                    <Label 
                      htmlFor={`issue-${issue.id}`} 
                      className={`font-medium ${getSeverityColor(issue.severity)} block cursor-pointer`}
                    >
                      {issue.description}
                    </Label>
                    <div className="flex justify-between items-center mt-1">
                      <Badge variant="outline">
                        {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                      </Badge>
                      
                      {showFeedback && (
                        <Badge variant={
                          status === 'correct' ? 'success' : 
                          status === 'false-positive' ? 'danger' : 
                          status === 'missed' ? 'warning' : 'outline'
                        }>
                          {status === 'correct' ? 'Correctly Identified' : 
                           status === 'false-positive' ? 'False Positive' : 
                           status === 'missed' ? 'Missed Issue' : 'Not an Issue'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feedback section */}
          {showFeedback && (
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Score</span>
                  <span className="text-sm font-medium">{calculateScore().percentage.toFixed(0)}%</span>
                </div>
                <Progress value={calculateScore().percentage} variant="clinical" />
              </div>

              <div className="p-4 rounded-md bg-gray-50">
                <h4 className="font-medium mb-2">Evaluation Summary</h4>
                
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-green-600 font-medium">
                      Correctly identified issues: {selectedIssues.filter(id => data.correctIssues.includes(id)).length}
                    </span> 
                    {" "}of {data.correctIssues.length} total issues
                  </p>
                  
                  {calculateScore().falsePositives > 0 && (
                    <p className="text-red-600">
                      False positives: {calculateScore().falsePositives} (identified as issues but are not)
                    </p>
                  )}
                  
                  {calculateScore().falseNegatives > 0 && (
                    <p className="text-yellow-600">
                      Missed issues: {calculateScore().falseNegatives} (real issues you didn't identify)
                    </p>
                  )}
                </div>
                
                <p className="mt-3">
                  {calculateScore().percentage >= 90 
                    ? "Excellent plan evaluation! You've correctly identified the important issues."
                    : calculateScore().percentage >= 70
                    ? "Good plan evaluation, but you missed some issues or identified false problems."
                    : calculateScore().percentage >= 50
                    ? "Your plan evaluation needs improvement. Review the constraints and DVH more carefully."
                    : "Your plan evaluation requires significant revision. Make sure to consider all constraints."
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
            variant="primary"
          >
            Submit Evaluation
          </Button>
        )}
      </div>
    </div>
  );
}