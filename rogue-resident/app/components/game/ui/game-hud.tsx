'use client';

import React from 'react';
import { useAppSelector } from '@/lib/redux/hooks';
import {
  selectPlayerHealth,
  selectMaxPlayerHealth,
  selectPlayerInsight,
  selectScore,
  selectSelectedCharacterId,
  selectCharacters,
} from '@/lib/redux/slices/game-slice';
import { selectFloorLevel } from '@/lib/redux/slices/map-slice';
import { Button } from '@/components/ui/button';
import { InventoryButton } from '../inventory/inventory-button';

interface GameHUDProps {
  onSaveClick: () => void;
}

export function GameHUD({ onSaveClick }: GameHUDProps) {
  // Player stats
  const playerHealth = useAppSelector(selectPlayerHealth);
  const maxPlayerHealth = useAppSelector(selectMaxPlayerHealth);
  const playerInsight = useAppSelector(selectPlayerInsight);
  const score = useAppSelector(selectScore);
  const floorLevel = useAppSelector(selectFloorLevel);
  
  // Character info
  const selectedCharacterId = useAppSelector(selectSelectedCharacterId);
  const characters = useAppSelector(selectCharacters);
  const character = characters.find(c => c.id === selectedCharacterId);
  
  // Health percentage for progress bar
  const healthPercentage = Math.max(0, Math.min(100, (playerHealth / maxPlayerHealth) * 100));
  
  return (
    <div className="bg-white border-2 border-black rounded-md p-3 pixel-corners flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Character info */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-600 rounded-md text-white flex items-center justify-center text-2xl pixel-corners">
          👨‍⚕️
        </div>
        <div>
          <div className="font-bold">{character?.name || 'Resident'}</div>
          <div className="text-sm text-gray-600">Floor {floorLevel}</div>
        </div>
      </div>
      
      {/* Health bar */}
      <div className="flex-1 max-w-md">
        <div className="text-sm font-medium flex justify-between mb-1">
          <span>Health</span>
          <span>{playerHealth} / {maxPlayerHealth}</span>
        </div>
        <div className="h-4 bg-gray-200 rounded-full pixel-corners overflow-hidden border border-gray-300">
          <div 
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex gap-4">
        <div className="bg-gray-100 p-2 rounded-md pixel-corners">
          <div className="text-xs text-gray-500">Insight</div>
          <div className="font-bold">{playerInsight}</div>
        </div>
        <div className="bg-gray-100 p-2 rounded-md pixel-corners">
          <div className="text-xs text-gray-500">Score</div>
          <div className="font-bold">{score}</div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center gap-2">
        <InventoryButton />
        <Button variant="pixel" size="sm" onClick={onSaveClick}>
          Save / Load
        </Button>
      </div>
    </div>
  );
}