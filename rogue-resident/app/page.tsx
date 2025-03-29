'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6 pixel-text">ROGUE RESIDENT</h1>
        <h2 className="text-2xl font-medium mb-8 text-gray-700">Medical Physics Residency</h2>
        
        <p className="mb-8 text-lg text-gray-600">
          Navigate through procedurally generated challenges, collect specialized items, 
          and build your medical physics knowledge in this educational roguelike adventure.
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="/game" passHref>
            <Button variant="pixel" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-black">
              Start Game
            </Button>
          </Link>
          <Button variant="pixel" size="lg" className="border-2 border-black">
            How to Play
          </Button>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="font-medium mb-4">Game Features:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-black rounded-md bg-white pixel-corners">
              <div className="text-2xl mb-2">👨‍⚕️</div>
              <h4 className="font-medium mb-1">Clinical Scenarios</h4>
              <p className="text-sm text-gray-600">
                Master treatment planning, dose calculations, and patient care.
              </p>
            </div>
            <div className="p-4 border-2 border-black rounded-md bg-white pixel-corners">
              <div className="text-2xl mb-2">🔍</div>
              <h4 className="font-medium mb-1">QA Challenges</h4>
              <p className="text-sm text-gray-600">
                Calibrate equipment, analyze data, and ensure safety standards.
              </p>
            </div>
            <div className="p-4 border-2 border-black rounded-md bg-white pixel-corners">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-medium mb-1">Educational Activities</h4>
              <p className="text-sm text-gray-600">
                Teach complex concepts and communicate effectively.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-auto pt-8 pb-4 text-center text-gray-500 text-sm">
        <p>Rogue Resident: Medical Physics Residency &copy; 2025</p>
      </footer>
    </div>
  );
}