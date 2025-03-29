'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectIsGameStarted,
  selectIsCharacterSelected,
  selectIsGameOver,
  resetGame,
} from '@/lib/redux/slices/game-slice';
import { selectIsInteracting } from '@/lib/redux/slices/node-slice';
import { CharacterSelection } from './character/character-selection';
import { GameMap } from './map/game-map';
import { NodeInteraction } from './nodes/node-interaction';
import { GameHUD } from './ui/game-hud';
import { Button } from '@/components/ui/button';
import { SaveMenu } from './ui/save-menu';

export function GameDashboard() {
  const dispatch = useAppDispatch();
  
  // Game state selectors
  const isGameStarted = useAppSelector(selectIsGameStarted);
  const isCharacterSelected = useAppSelector(selectIsCharacterSelected);
  const isGameOver = useAppSelector(selectIsGameOver);
  const isInteractingWithNode = useAppSelector(selectIsInteracting);
  
  // UI state
  const [isSaveMenuOpen, setIsSaveMenuOpen] = useState(false);
  
  // Handle restart game
  const handleRestartGame = () => {
    dispatch(resetGame());
  };
  
  // Toggle save menu
  const toggleSaveMenu = () => {
    setIsSaveMenuOpen(!isSaveMenuOpen);
  };
  
  // If character not selected, show character selection
  if (!isCharacterSelected) {
    return <CharacterSelection />;
  }
  
  // Game over screen
  if (isGameOver) {
    return (
      <div className="container mx-auto p-4 h-screen flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 pixel-text">Game Over</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your medical physics residency journey has come to an end.
          </p>
          <Button 
            variant="pixel" 
            size="lg" 
            onClick={handleRestartGame}
            className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-black"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  // Main game dashboard
  return (
    <div className="container mx-auto p-4 flex flex-col h-screen max-h-screen">
      {/* Game HUD */}
      <div className="mb-4">
        <GameHUD onSaveClick={toggleSaveMenu} />
      </div>
      
      {/* Main game content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left side: Game map (or node interaction if active) */}
        <div className="flex-1 overflow-auto">
          {isInteractingWithNode ? <NodeInteraction /> : <GameMap />}
        </div>
      </div>
      
      {/* Save/Load menu modal */}
      {isSaveMenuOpen && (
        <SaveMenu onClose={() => setIsSaveMenuOpen(false)} />
      )}
    </div>
  );
}