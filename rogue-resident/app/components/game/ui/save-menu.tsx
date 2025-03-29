'use client'

import { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setSaveMenuOpen, saveGameThunk, loadGameThunk, deleteSaveThunk } from '@/lib/redux/slices/save-load-slice'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from '@/lib/utils/date-utils'

export default function SaveMenu() {
  const dispatch = useAppDispatch()
  const saveLoadState = useAppSelector(state => state.saveLoad)
  const gameState = useAppSelector(state => state.game)
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  
  // Close modal with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }
    
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])
  
  // Close the menu
  const closeMenu = () => {
    dispatch(setSaveMenuOpen(false))
    setShowConfirmDelete(false)
  }
  
  // Save the game
  const handleSave = () => {
    dispatch(saveGameThunk())
      .unwrap()
      .then(() => {
        // Could show a success message here
      })
      .catch((error) => {
        console.error('Failed to save game:', error)
      })
  }
  
  // Load the game
  const handleLoad = () => {
    dispatch(loadGameThunk())
      .unwrap()
      .then(() => {
        closeMenu()
      })
      .catch((error) => {
        console.error('Failed to load game:', error)
      })
  }
  
  // Delete the save
  const handleDelete = () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true)
      return
    }
    
    dispatch(deleteSaveThunk())
      .unwrap()
      .then(() => {
        setShowConfirmDelete(false)
      })
      .catch((error) => {
        console.error('Failed to delete save:', error)
      })
  }
  
  // Format the last save time
  const getLastSaveTime = () => {
    if (!saveLoadState.lastSaveTimestamp) return 'Never'
    
    return formatDistanceToNow(new Date(saveLoadState.lastSaveTimestamp), { addSuffix: true })
  }
  
  if (!saveLoadState.showSaveMenu) {
    return null
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="w-full max-w-md bg-slate-800 border-2 border-slate-700 rounded-lg overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-pixel text-slate-200">Save & Load</h2>
          <button 
            onClick={closeMenu}
            className="text-slate-400 hover:text-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Current game info */}
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <h3 className="font-pixel text-slate-200 mb-2">Current Game</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-400">Character:</div>
              <div className="text-slate-200">{gameState.selectedCharacter || 'None'}</div>
              
              <div className="text-slate-400">Lives:</div>
              <div className="text-slate-200">{gameState.lives}</div>
              
              <div className="text-slate-400">Insight:</div>
              <div className="text-slate-200">{gameState.insight}</div>
              
              <div className="text-slate-400">Research Points:</div>
              <div className="text-slate-200">{gameState.researchPoints}</div>
              
              <div className="text-slate-400">Completed Runs:</div>
              <div className="text-slate-200">{gameState.completedRuns}</div>
            </div>
          </div>
          
          {/* Save file info */}
          <div className="bg-slate-700 rounded-lg p-4 mb-6">
            <h3 className="font-pixel text-slate-200 mb-2">Save File</h3>
            {saveLoadState.hasSave ? (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-400">Last Saved:</div>
                <div className="text-slate-200">{getLastSaveTime()}</div>
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No save file found.</p>
            )}
          </div>
          
          {/* Message area */}
          {saveLoadState.error && (
            <div className="bg-red-900 bg-opacity-30 border border-red-800 rounded-lg p-3 mb-6">
              <p className="text-red-300 text-sm">{saveLoadState.error}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleSave} 
              disabled={saveLoadState.isLoading}
              variant="default"
              size="lg"
              className="w-full"
            >
              Save Game
            </Button>
            
            <Button 
              onClick={handleLoad} 
              disabled={saveLoadState.isLoading || !saveLoadState.hasSave}
              variant={saveLoadState.hasSave ? 'success' : 'default'}
              size="lg"
              className="w-full"
            >
              Load Game
            </Button>
            
            <Button 
              onClick={handleDelete} 
              disabled={saveLoadState.isLoading || !saveLoadState.hasSave}
              variant={showConfirmDelete ? 'danger' : 'warning'}
              size="lg"
              className="w-full"
            >
              {showConfirmDelete ? 'Confirm Delete' : 'Delete Save'}
            </Button>
          </div>
          
          {/* Loading state */}
          {saveLoadState.isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-clinical"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}