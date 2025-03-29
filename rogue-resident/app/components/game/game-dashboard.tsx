// app/components/game/game-dashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMap, useGame, useNode } from '@/lib/hooks';
import GameMap from './map/game-map';
import NodeInteraction from './nodes/node-interaction';
import GameHUD from './ui/game-hud';
import { MapGenerationOptions, NodeType } from '@/lib/types';

export default function GameDashboard() {
  const { generateMap, nodes, currentNodeId, isMapGenerated } = useMap();
  const { isGameStarted, difficulty, startGame } = useGame();
  const { isInteracting, nodeType } = useNode();
  
  // Generate map when game starts
  useEffect(() => {
    if (isGameStarted && !isMapGenerated) {
      const options: MapGenerationOptions = {
        difficulty: difficulty,
        nodeCount: difficulty === 'easy' ? 12 : difficulty === 'hard' ? 18 : 15
      };
      generateMap(options);
    }
  }, [isGameStarted, isMapGenerated, generateMap, difficulty]);

  // Render appropriate view based on game state
  return (
    <div className="w-full h-full flex flex-col">
      <GameHUD />
      
      {isInteracting ? (
        <NodeInteraction nodeType={nodeType} nodeId={currentNodeId} />
      ) : (
        <GameMap />
      )}
    </div>
  );
}