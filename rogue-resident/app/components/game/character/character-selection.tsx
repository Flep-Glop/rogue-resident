'use client';

import React from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectCharacter,
  selectCharacters,
  selectSelectedCharacterId,
  startGame,
} from '@/lib/redux/slices/game-slice';
import { Button } from '@/components/ui/button';
import { CharacterCard } from './character-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CharacterSelection() {
  const dispatch = useAppDispatch();
  const characters = useAppSelector(selectCharacters);
  const selectedCharacterId = useAppSelector(selectSelectedCharacterId);

  const handleSelectCharacter = (characterId: string) => {
    dispatch(selectCharacter(characterId));
  };

  const handleStartGame = () => {
    if (selectedCharacterId) {
      dispatch(startGame());
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card variant="pixelated" className="border-2 border-black bg-white">
        <CardHeader className="text-center border-b-2 border-black pb-4">
          <CardTitle className="text-3xl pixel-text">
            Select Your Character
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Character selection */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isSelected={character.id === selectedCharacterId}
                onClick={() => handleSelectCharacter(character.id)}
              />
            ))}
          </div>

          {/* Start button */}
          <div className="flex justify-center">
            <Button
              variant="pixel"
              size="lg"
              onClick={handleStartGame}
              disabled={!selectedCharacterId}
              className={
                selectedCharacterId
                  ? 'bg-green-600 hover:bg-green-700 text-white border-2 border-black'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed border-2 border-black'
              }
            >
              Start Adventure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}