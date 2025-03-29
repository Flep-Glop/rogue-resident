'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { completeNode } from '@/lib/redux/slices/map-slice'
import { completeNode as completeNodeInteraction } from '@/lib/redux/slices/node-slice'
import { addItem } from '@/lib/redux/slices/inventory-slice'
import { Item } from '@/lib/types/item-types'

// Storage Node (Treasure Node) implementation
export default function StorageNode() {
  const dispatch = useAppDispatch()
  const nodeState = useAppSelector(state => state.node)
  const inventory = useAppSelector(state => state.inventory)
  
  // Local state for the interaction stages
  const [stage, setStage] = useState<'exploring' | 'discovery' | 'selection' | 'acquisition'>('exploring')
  
  // Items that can be found in this closet
  const [availableItems, setAvailableItems] = useState<Item[]>([
    {
      id: 'vintage-handbook',
      name: 'Vintage Dosimetry Handbook',
      description: 'An old but valuable reference for dose calculations. Contains historical context for many techniques.',
      category: 'knowledge',
      rarity: 'uncommon',
      iconPath: '/items/handbook.png',
      effects: [
        {
          target: 'clinical',
          modifier: 'performance',
          value: 25,
          description: '+25% performance in dose calculation challenges'
        }
      ]
    },
    {
      id: 'calibration-phantom',
      name: 'Old Calibration Phantom',
      description: 'A well-maintained calibration phantom from a previous generation of equipment.',
      category: 'technical',
      rarity: 'uncommon',
      iconPath: '/items/phantom.png',
      effects: [
        {
          target: 'qa',
          modifier: 'precision',
          value: 2,
          description: '+2 precision for QA measurement challenges'
        },
        {
          target: 'qa',
          modifier: 'reroll',
          value: true,
          description: 'Allows one reroll of measurement results per scenario'
        }
      ]
    },
    {
      id: 'teaching-slides',
      name: 'Teaching Slides Collection',
      description: 'A comprehensive set of educational slides covering various medical physics topics.',
      category: 'teaching',
      rarity: 'common',
      iconPath: '/items/slides.png',
      effects: [
        {
          target: 'educational',
          modifier: 'effectiveness',
          value: 30,
          description: '+30% effectiveness for visual aids in education scenarios'
        }
      ]
    }
  ])
  
  // Selected items to choose from
  const [discoveredItems, setDiscoveredItems] = useState<Item[]>([])
  
  // The final selected item
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  
  // Handle the exploration phase
  const handleExplore = () => {
    // Randomly select 2 items from available items
    const shuffled = [...availableItems].sort(() => 0.5 - Math.random())
    setDiscoveredItems(shuffled.slice(0, 2))
    setStage('discovery')
  }
  
  // Handle item selection
  const handleSelectItem = (item: Item) => {
    setSelectedItem(item)
    setStage('selection')
  }
  
  // Handle item acquisition and complete the node
  const handleAcquireItem = () => {
    if (selectedItem) {
      // Add item to inventory
      dispatch(addItem(selectedItem))
      
      // Mark node as completed
      if (nodeState.currentNodeId) {
        dispatch(completeNode(nodeState.currentNodeId))
      }
      
      // Update node interaction state
      dispatch(completeNodeInteraction({ success: true }))
      
      // Update local state
      setStage('acquisition')
    }
  }
  
  // Handle leaving without an item
  const handleLeaveWithoutItem = () => {
    // Mark node as completed
    if (nodeState.currentNodeId) {
      dispatch(completeNode(nodeState.currentNodeId))
    }
    
    // Update node interaction state
    dispatch(completeNodeInteraction({ success: true }))
  }
  
  // Render different stages
  const renderContent = () => {
    switch (stage) {
      case 'exploring':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-900 bg-opacity-20 p-4 rounded-lg">
              <p className="text-slate-300">
                You've found an old storage closet tucked away in the department. 
                It's filled with dusty equipment, old textbooks, and various supplies. 
                There might be something useful inside if you take the time to look.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleExplore}
                className="btn-pixel bg-storage border-yellow-800 text-slate-800 px-6 py-2 font-pixel"
              >
                Search the Closet
              </button>
            </div>
          </div>
        )
        
      case 'discovery':
        return (
          <div className="space-y-6">
            <p className="text-slate-300">
              After searching through shelves and cabinets, you've found a couple of potentially useful items:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discoveredItems.map(item => (
                <div 
                  key={item.id}
                  className="bg-slate-700 p-4 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                  onClick={() => handleSelectItem(item)}
                >
                  <h4 className={`
                    font-pixel text-lg mb-2
                    ${item.rarity === 'common' ? 'text-slate-300' : ''}
                    ${item.rarity === 'uncommon' ? 'text-green-400' : ''}
                    ${item.rarity === 'rare' ? 'text-blue-400' : ''}
                    ${item.rarity === 'legendary' ? 'text-purple-400' : ''}
                  `}>
                    {item.name}
                  </h4>
                  <p className="text-slate-400 mb-4">{item.description}</p>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-pixel text-storage">Effects:</p>
                    {item.effects.map((effect, index) => (
                      <p key={index} className="text-sm text-slate-300">
                        {effect.description}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleLeaveWithoutItem}
                className="btn-pixel bg-slate-700 border-slate-600 text-slate-300 px-6 py-2 font-pixel"
              >
                Leave Without Item
              </button>
            </div>
          </div>
        )
        
      case 'selection':
        return (
          <div className="space-y-6">
            <p className="text-slate-300">
              You've selected an item. Would you like to add it to your inventory?
            </p>
            
            {selectedItem && (
              <div className="bg-slate-700 p-6 rounded-lg">
                <h4 className={`
                  font-pixel text-xl mb-2
                  ${selectedItem.rarity === 'common' ? 'text-slate-300' : ''}
                  ${selectedItem.rarity === 'uncommon' ? 'text-green-400' : ''}
                  ${selectedItem.rarity === 'rare' ? 'text-blue-400' : ''}
                  ${selectedItem.rarity === 'legendary' ? 'text-purple-400' : ''}
                `}>
                  {selectedItem.name}
                </h4>
                <p className="text-slate-400 mb-4">{selectedItem.description}</p>
                
                <div className="space-y-1 mb-6">
                  <p className="text-xs font-pixel text-storage">Effects:</p>
                  {selectedItem.effects.map((effect, index) => (
                    <p key={index} className="text-sm text-slate-300">
                      {effect.description}
                    </p>
                  ))}
                </div>
                
                <div className="text-sm text-slate-400">
                  <span className="font-pixel">Inventory Space:</span> {inventory.items.length}/{inventory.capacity}
                </div>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStage('discovery')}
                className="btn-pixel bg-slate-700 border-slate-600 text-slate-300 px-6 py-2 font-pixel"
              >
                Back
              </button>
              
              <button
                onClick={handleAcquireItem}
                disabled={inventory.items.length >= inventory.capacity}
                className={`btn-pixel px-6 py-2 font-pixel ${
                  inventory.items.length >= inventory.capacity
                    ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed'
                    : 'bg-storage border-yellow-800 text-slate-800'
                }`}
              >
                {inventory.items.length >= inventory.capacity 
                  ? 'Inventory Full' 
                  : 'Add to Inventory'}
              </button>
            </div>
          </div>
        )
        
      case 'acquisition':
        return (
          <div className="space-y-6 text-center">
            <div className="inline-block rounded-full bg-storage p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-pixel text-storage">Item Acquired!</h3>
            
            {selectedItem && (
              <p className="text-slate-300">
                You've added {selectedItem.name} to your inventory.
              </p>
            )}
            
            <p className="text-slate-400 text-sm">
              This item can be used to help you in future challenges.
            </p>
          </div>
        )
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden p-8">
        <h3 className="text-xl font-pixel text-storage mb-4">Storage Closet Discovery</h3>
        
        {renderContent()}
      </div>
    </div>
  )
}