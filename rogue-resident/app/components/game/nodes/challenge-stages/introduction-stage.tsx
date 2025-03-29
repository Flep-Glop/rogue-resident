'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PatientInfo {
  age: number;
  gender: string;
  diagnosis: string;
  stage: string;
  previousTreatments: string[];
}

interface IntroductionStageProps {
  title: string;
  description: string;
  patientInfo?: PatientInfo;
  equipmentInfo?: string;
  procedureInfo?: string;
  audience?: string;
  onContinue: () => void;
}

export function IntroductionStage({
  title,
  description,
  patientInfo,
  equipmentInfo,
  procedureInfo,
  audience,
  onContinue,
}: IntroductionStageProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Display type-specific information */}
      {patientInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Review the patient details before proceeding.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd>{patientInfo.age}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Gender</dt>
                <dd className="capitalize">{patientInfo.gender}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">Diagnosis</dt>
                <dd>{patientInfo.diagnosis}</dd>
              </div>
              <div className="col-span-1">
                <dt className="text-sm font-medium text-gray-500">Stage</dt>
                <dd>{patientInfo.stage}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Previous Treatments
                </dt>
                <dd>
                  {patientInfo.previousTreatments.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {patientInfo.previousTreatments.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  ) : (
                    'None'
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {/* QA Equipment Info */}
      {equipmentInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Equipment Information</CardTitle>
            <CardDescription>
              Specifications for the equipment being tested.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{equipmentInfo}</p>
          </CardContent>
        </Card>
      )}

      {/* QA Procedure Info */}
      {procedureInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Procedure Information</CardTitle>
            <CardDescription>
              Testing procedure to be followed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>{procedureInfo}</p>
          </CardContent>
        </Card>
      )}

      {/* Educational Audience Info */}
      {audience && (
        <Card>
          <CardHeader>
            <CardTitle>Educational Context</CardTitle>
            <CardDescription>
              Information about your audience and learning objectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl>
              <dt className="text-sm font-medium text-gray-500">Audience</dt>
              <dd className="capitalize">{audience}</dd>
            </dl>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button variant="primary" onClick={onContinue}>
          Begin Challenge
        </Button>
      </div>
    </div>
  );
}