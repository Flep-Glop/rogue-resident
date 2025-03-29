'use client';

import React from 'react';
import { InventoryItem } from '@/lib/redux/slices/inventory-slice';
import { cn } from '@/lib/utils/cn';

interface ItemCardProps {
  item: InventoryItem;
  onUse?: (itemId: string) => void;
}

export function ItemCard({ item, onUse }: ItemCardProps) {
  const { id, name, description, rarity, isUsable, isPassive, quantity, effects } = item;
  
  // Rarity colors
  const rarityStyles = {
    common: 'border-gray-400 bg-gray-50',
    uncommon: 'border-green-500 bg-green-50',
    rare: 'border-blue-500 bg-blue-50',
    unique: 'border-purple-500 bg-purple-50',
  };
  
  // Handle using the item
  const handleUse = () => {
    if (isUsable && onUse) {
      onUse(id);
    }
  };
  
  return (
    <div 
      className={cn(
        'border-2 rounded-md p-3 pixel-corners flex flex-col',
        rarityStyles[rarity],
        isUsable && 'cursor-pointer hover:shadow-md transition-shadow'
      )}
      onClick={isUsable ? handleUse : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-md mr-2 text-lg pixel-corners">
            📦
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <div className="flex items-center text-xs">
              <span className="capitalize text-gray-600 mr-2">{rarity}</span>
              {isPassive && (
                <span className="bg-blue-100 text-blue-800 px-1 rounded">Passive</span>
              )}
              {isUsable && (
                <span className="bg-green-100 text-green-800 px-1 rounded ml-1">Usable</span>
              )}
            </div>
          </div>
        </div>
        {quantity > 1 && (
          <div className="bg-gray-200 px-2 py-1 rounded-full text-xs font-medium">
            ×{quantity}
          </div>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3 flex-1">{description}</p>
      
      {/* Effects */}
      <div className="space-y-1">
        {effects.map((effect, index) => (
          <div key={index} className="text-xs flex items-baseline">
            <span className="font-medium capitalize mr-1 text-gray-700">
              {effect.type.replace(/([A-Z])/g, ' $1').toLowerCase()}:
            </span>
            <span className="text-gray-600">
              {typeof effect.value === 'number' && effect.value > 0 && '+'}
              {typeof effect.value === 'boolean' ? (
                effect.value ? 'Yes' : 'No'
              ) : (
                effect.value.toString()
              )}
              {typeof effect.value === 'number' && effect.type.includes('Bonus') && '%'}
              {effect.duration ? (
                effect.duration === -1 ? 
                ' (Permanent)' : 
                ` (${effect.duration} turns)`
              ) : null}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}