'use client'

import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { completeNode } from '@/lib/redux/slices/map-slice'
import { completeNode as completeNodeInteraction } from '@/lib/redux/slices/node-slice'
import { purchaseItem } from '@/lib/redux/slices/inventory-slice'
import { adjustInsight } from '@/lib/redux/slices/game-slice'
import { Item } from '@/lib/types/item-types'

// Vendor Node (Shop Node) implementation
export default function VendorNode() {
  const dispatch = useAppDispatch()
  const nodeState = useAppSelector(state => state.node)
  const inventory = useAppSelector(state => state.inventory)
  const gameState = useAppSelector(state => state.game)
  
  // Local state for the interaction stages
  const [stage, setStage] = useState<'browsing' | 'inspection' | 'purchase' | 'completion'>('browsing')
  
  // Items available in the shop
  const [shopItems, setShopItems] = useState<(Item & { cost: number })[]>([
    {
      id: 'analytics-software',
      name: 'Analytics Software Suite',
      description: 'Advanced software for visualizing and analyzing complex data.',
      category: 'technical',
      rarity: 'rare',
      iconPath: '/items/software.png',
      cost: 75,
      effects: [
        {
          target: 'all',
          modifier: 'performance',
          value: 15,
          description: '+15% performance in challenges involving data analysis'
        }
      ]
    },
    {
      id: 'precision-kit',
      name: 'Precision Measurement Kit',
      description: 'A set of high-quality tools for precise measurements and calibrations.',
      category: 'technical',
      rarity: 'uncommon',
      iconPath: '/items/toolkit.png',
      cost: 50,
      effects: [
        {
          target: 'qa',
          modifier: 'precision',
          value: 3,
          description: '+3 precision in QA scenarios'
        }
      ]
    },
    {
      id: 'positioning-system',
      name: 'Patient Positioning System',
      description: 'Advanced system for ensuring accurate patient setup during treatment.',
      category: 'technical',
      rarity: 'rare',
      iconPath: '/items/positioning.png',
      cost: 100,
      effects: [
        {
          target: 'clinical',
          modifier: 'performance',
          value: 20,
          description: '+20% performance in clinical scenarios involving patient setup'
        }
      ]
    },
    {
      id: 'educational-package',
      name: 'Educational Simulation Package',
      description: 'Interactive tools for teaching complex medical physics concepts.',
      category: 'teaching',
      rarity: 'uncommon',
      iconPath: '/items/simulation.png',
      cost: 60,
      effects: [
        {
          target: 'educational',
          modifier: 'effectiveness',
          value: 25,
          description: '+25% effectiveness in educational scenarios'
        }
      ]
    }
  ])
  
  // Currently inspected item
  const [inspectedItem, setInspectedItem] = useState<(Item & { cost: number }) | null>(null)
  
  // Selected item for purchase
  const [purchasedItem, setPurchasedItem] = useState<(Item & { cost: number }) | null>(null)
  
  // Handle item inspection
  const handleInspectItem = (item: Item & { cost: number }) => {
    setInspectedItem(item)
    setStage('inspection')
  }
  
  // Handle purchase
  const handlePurchase = () => {
    if (inspectedItem) {
      // Check if player has enough insight
      if (gameState.insight >= inspectedItem.cost) {
        // Reduce insight
        dispatch(adjustInsight(-inspectedItem.cost))
        
        // Add item to inventory
        dispatch(purchaseItem(inspectedItem.id))
        
        // Save the purchased item for display
        setPurchasedItem(inspectedItem)
        
        // Update stage
        setStage('purchase')
      }
    }
  }
  
  // Handle leaving the shop
  const handleLeaveShop = () => {
    // Mark node as completed
    if (nodeState.currentNodeId) {
      dispatch(completeNode(nodeState.currentNodeId))
    }
    
    // Update node interaction state
    dispatch(completeNodeInteraction({ success: true }))
    
    // Update stage
    setStage('completion')
  }
  
  // Render different stages
  const renderContent = () => {
    switch (stage) {
      case 'browsing':
        return (
          <div className="space-y-6">
            <div className="bg-vendor bg-opacity-20 p-4 rounded-lg">
              <p className="text-slate-300">
                Welcome to the Vendor Showcase! Various medical physics equipment and software 
                vendors have set up booths to display their latest products.
              </p>
            </div>
            
            <div className="flex justify-between items-center bg-slate-700 p-3 rounded-lg">
              <span className="text-slate-300 font-pixel">Your Insight</span>
              <span className="text-yellow-500 font-pixel text-xl">{gameState.insight}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopItems.map(item => (
                <div 
                  key={item.id}
                  className={`
                    bg-slate-700 p-4 rounded-lg transition-colors
                    ${gameState.insight >= item.cost ? 'cursor-pointer hover:bg-slate-600' : 'opacity-60'}
                  `}
                  onClick={() => gameState.insight >= item.cost && handleInspectItem(item)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className={`
                      font-pixel text-lg mb-2
                      ${item.rarity === 'common' ? 'text-slate-300' : ''}
                      ${item.rarity === 'uncommon' ? 'text-green-400' : ''}
                      ${item.rarity === 'rare' ? 'text-blue-400' : ''}
                      ${item.rarity === 'legendary' ? 'text-purple-400' : ''}
                    `}>
                      {item.name}
                    </h4>
                    <span className="font-pixel text-yellow-500">{item.cost}</span>
                  </div>
                  
                  <p className="text-slate-400 mb-4">{item.description}</p>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-pixel text-vendor">Effects:</p>
                    {item.effects.map((effect, index) => (
                      <p key={index} className="text-sm text-slate-300">
                        {effect.description}
                      </p>
                    ))}
                  </div>
                  
                  {gameState.insight < item.cost && (
                    <p className="text-red-400 text-sm mt-2">
                      Not enough insight to purchase
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleLeaveShop}
                className="btn-pixel bg-slate-700 border-slate-600 text-slate-300 px-6 py-2 font-pixel"
              >
                Leave Shop
              </button>
            </div>
          </div>
        )
        
      case 'inspection':
        return (
          <div className="space-y-6">
            {inspectedItem && (
              <div className="bg-slate-700 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className={`
                    font-pixel text-xl mb-2
                    ${inspectedItem.rarity === 'common' ? 'text-slate-300' : ''}
                    ${inspectedItem.rarity === 'uncommon' ? 'text-green-400' : ''}
                    ${inspectedItem.rarity === 'rare' ? 'text-blue-400' : ''}
                    ${inspectedItem.rarity === 'legendary' ? 'text-purple-400' : ''}
                  `}>
                    {inspectedItem.name}
                  </h4>
                  <span className="font-pixel text-yellow-500 text-xl">{inspectedItem.cost}</span>
                </div>
                
                <p className="text-slate-400 mb-6">{inspectedItem.description}</p>
                
                <div className="space-y-2 mb-6">
                  <p className="text-sm font-pixel text-vendor">Effects:</p>
                  {inspectedItem.effects.map((effect, index) => (
                    <p key={index} className="text-md text-slate-300">
                      {effect.description}
                    </p>
                  ))}
                </div>
                
                <div className="flex justify-between items-center bg-slate-800 p-3 rounded-lg">
                  <span className="text-slate-300 font-pixel">Your Insight</span>
                  <span className="text-yellow-500 font-pixel text-xl">{gameState.insight}</span>
                </div>
                
                <div className="text-sm text-slate-400 mt-4">
                  <span className="font-pixel">Inventory Space:</span> {inventory.items.length}/{inventory.capacity}
                </div>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setStage('browsing')}
                className="btn-pixel bg-slate-700 border-slate-600 text-slate-300 px-6 py-2 font-pixel"
              >
                Back
              </button>
              
              <button
                onClick={handlePurchase}
                disabled={!inspectedItem || gameState.insight < (inspectedItem?.cost || 0) || inventory.items.length >= inventory.capacity}
                className={`btn-pixel px-6 py-2 font-pixel ${
                  !inspectedItem || gameState.insight < (inspectedItem?.cost || 0) || inventory.items.length >= inventory.capacity
                    ? 'bg-slate-700 border-slate-600 text-slate-500 cursor-not-allowed'
                    : 'bg-vendor border-blue-300 text-white'
                }`}
              >
                {inventory.items.length >= inventory.capacity 
                  ? 'Inventory Full' 
                  : `Purchase (${inspectedItem?.cost})`}
              </button>
            </div>
          </div>
        )
        
      case 'purchase':
        return (
          <div className="space-y-6 text-center">
            <div className="inline-block rounded-full bg-vendor p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-pixel text-vendor">Purchase Complete!</h3>
            
            {purchasedItem && (
              <p className="text-slate-300">
                You've purchased {purchasedItem.name} for {purchasedItem.cost} insight.
              </p>
            )}
            
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setStage('browsing')}
                className="btn-pixel bg-vendor border-blue-300 text-white px-6 py-2 font-pixel"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={handleLeaveShop}
                className="btn-pixel bg-slate-700 border-slate-600 text-slate-300 px-6 py-2 font-pixel"
              >
                Leave Shop
              </button>
            </div>
          </div>
        )
        
      case 'completion':
        return (
          <div className="space-y-6 text-center">
            <div className="inline-block rounded-full bg-vendor p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-pixel text-vendor">Thank You for Visiting!</h3>
            
            <p className="text-slate-300">
              The vendors thank you for your time and will see you at the next showcase.
            </p>
          </div>
        )
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden p-8">
        <h3 className="text-xl font-pixel text-vendor mb-4">Vendor Showcase</h3>
        
        {renderContent()}
      </div>
    </div>
  )
}