// components/game/nodes/challenge-stages/introduction-stage.tsx
'use client';

import { Button } from '@/components/ui/button';

interface IntroductionStageProps {
  nodeType: string;
  title: string;
  onNext: () => void;
}

export default function IntroductionStage({ nodeType, title, onNext }: IntroductionStageProps) {
  // Different content based on node type
  const getContent = () => {
    switch (nodeType) {
      case 'clinical':
        return {
          icon: '👩‍⚕️',
          role: 'Dr. Kapoor - Chief Medical Physicist',
          description:
            'You have a 52-year-old female patient with Stage II breast cancer who has undergone lumpectomy. The oncologist has prescribed a standard fractionation regimen. You need to evaluate the CT images, select the appropriate treatment approach, and assess dose distribution.',
          challenge:
            'Create a treatment plan that provides adequate target coverage while minimizing dose to the heart and lungs.',
        };
      case 'qa':
        return {
          icon: '🧰',
          role: 'Technician Jesse - Equipment Specialist',
          description:
            'The monthly linear accelerator output calibration is due. You need to ensure the machine is delivering the prescribed dose accurately and that all parameters are within tolerance.',
          challenge:
            'Set up the appropriate measurement equipment, take accurate readings, and determine if any adjustments are needed.',
        };
      case 'educational':
        return {
          icon: '👨‍🏫',
          role: 'Dr. Garcia - Education Coordinator',
          description:
            'You need to prepare a lecture on radiation biology basics for first-year medical students who have minimal physics background.',
          challenge:
            'Create an engaging explanation of DNA damage mechanisms and differences between radiation types that is accessible to beginners.',
        };
      default:
        return {
          icon: '❓',
          role: 'Unknown',
          description: 'No description available.',
          challenge: 'No challenge details available.',
        };
    }
  };

  const content = getContent();

  return (
    <div className="space-y-4">
      <div className="flex items-start">
        <div className="text-4xl mr-4">{content.icon}</div>
        <div>
          <h3 className="font-bold text-lg">{content.role}</h3>
          <p className="text-gray-700">{content.description}</p>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
        <h4 className="font-bold">Your Challenge:</h4>
        <p>{content.challenge}</p>
      </div>

      <div className="flex justify-end mt-4">
        <Button variant="clinical" onClick={onNext}>
          I understand, let's begin
        </Button>
      </div>
    </div>
  );
}