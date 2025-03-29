'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
  selectItems,
  useItem,
  selectActiveEffects,
} from '@/lib/redux/slices/inventory-slice';
import { Button } from '@/components/ui/button';
import { ItemCard } from './item-card';
import { ItemType } from '@/lib/types/item-types';

interface InventoryPanelProps {
  onClose: () => void;
}

export function InventoryPanel({ onClose }: InventoryPanelProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectItems);
  const activeEffects = useAppSelector(selectActiveEffects);
  
  // Filter states
  const [activeTab, setActiveTab] = useState<'items' | 'effects'>('items');
  const [filter, setFilter] = useState<ItemType | 'all'>('all');
  
  // Handle using an item
  const handleUseItem = (itemId: string) => {
    dispatch(useItem(itemId));
  };
  
  // Filter items based on selected filter
  const filteredItems = items.filter(item => 
    filter === 'all' || item.type === filter
  );
  
  // Group items by type for better organization
  const groupedItems = filteredItems.reduce((groups, item) => {
    const type = item.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(item);
    return groups;
  }, {} as Record<string, typeof items>);
  
  // Format effect duration
  const formatDuration = (turnsRemaining: number) => {
    if (turnsRemaining === -1) return 'Permanent';
    return `${turnsRemaining} turn${turnsRemaining !== 1 ? 's' : ''}`;
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white border-2 border-black p-4 rounded-lg max-w-3xl w-full max-h-[80vh] flex flex-col pixel-corners">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-black">
          <h2 className="text-2xl font-bold">Inventory</h2>
          <Button variant="ghost" onClick={onClose} className="text-gray-500">
            ✕
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium border-b-2 ${
              activeTab === 'items'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('items')}
          >
            Items ({items.length})
          </button>
          <button
            className={`py-2 px-4 font-medium border-b-2 ${
              activeTab === 'effects'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('effects')}
          >
            Active Effects ({activeEffects.length})
          </button>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'items' ? (
          <>
            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Button
                variant={filter === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'knowledge' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('knowledge')}
              >
                Knowledge
              </Button>
              <Button
                variant={filter === 'technical' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('technical')}
              >
                Technical
              </Button>
              <Button
                variant={filter === 'teaching' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('teaching')}
              >
                Teaching
              </Button>
              <Button
                variant={filter === 'personal' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('personal')}
              >
                Personal
              </Button>
              <Button
                variant={filter === 'special' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setFilter('special')}
              >
                Special
              </Button>
            </div>
            
            {/* Items list */}
            <div className="overflow-y-auto flex-1">
              {Object.keys(groupedItems).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {filter === 'all'
                    ? 'Your inventory is empty'
                    : `No ${filter} items found`}
                </div>
              ) : (
                Object.entries(groupedItems).map(([type, typeItems]) => (
                  <div key={type} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 capitalize border-b border-gray-200 pb-1">
                      {type}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {typeItems.map(item => (
                        <ItemCard
                          key={item.id}
                          item={item}
                          onUse={handleUseItem}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          // Active Effects tab
          <div className="overflow-y-auto flex-1">
            {activeEffects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No active effects
              </div>
            ) : (
              <div className="space-y-4">
                {activeEffects.map(effect => (
                  <div
                    key={effect.effectId}
                    className="border border-gray-200 rounded-md p-3 pixel-corners"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium capitalize">
                          {effect.type.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {typeof effect.value === 'number' &&
                            effect.value > 0 &&
                            '+'}
                          {effect.value.toString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDuration(effect.turnsRemaining)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Source: {items.find(item => item.id === effect.sourceId)?.name || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}