'use client';

import React from 'react';
import { Character } from '@/lib/redux/slices/game-slice';
import { cn } from '@/lib/utils/cn';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onClick: () => void;
}

export function CharacterCard({ character, isSelected, onClick }: CharacterCardProps) {
  const {
    name,
    description,
    startingHealth,
    startingInsight,
    specialAbilities,
    portrait,
  } = character;

  return (
    <Card
      className={cn(
        'w-[300px] transition-all duration-200 border-2 cursor-pointer hover:shadow-md',
        isSelected
          ? 'border-blue-500 shadow-lg transform scale-105'
          : 'border-gray-200 hover:border-blue-300'
      )}
      onClick={onClick}
      variant="pixelated"
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Character portrait */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden pixel-corners">
            {/* Placeholder for portrait */}
            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-4xl">
              👨‍⚕️
            </div>
          </div>
        </div>

        {/* Character stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-100 p-2 rounded-md pixel-corners">
            <div className="text-sm text-gray-500">Health</div>
            <div className="font-bold">{startingHealth}</div>
          </div>
          <div className="bg-gray-100 p-2 rounded-md pixel-corners">
            <div className="text-sm text-gray-500">Insight</div>
            <div className="font-bold">{startingInsight}</div>
          </div>
        </div>

        {/* Special abilities */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Special Abilities:</h4>
          <ul className="text-sm space-y-1">
            {specialAbilities.map((ability, index) => (
              <li key={index} className="flex items-start">
                <span className="font-medium mr-1">{ability.name}:</span>
                <span className="text-gray-600">{ability.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0 justify-center">
        <div
          className={cn(
            'text-center text-sm font-medium',
            isSelected ? 'text-blue-600' : 'text-gray-500'
          )}
        >
          {isSelected ? 'Selected' : 'Click to select'}
        </div>
      </CardFooter>
    </Card>
  );
}