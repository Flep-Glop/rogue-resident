import { configureStore, combineReducers } from '@reduxjs/toolkit';
import gameReducer from './slices/game-slice';
import mapReducer from './slices/map-slice';
import nodeReducer from './slices/node-slice';
import challengeReducer from './slices/challenge-slice';
import inventoryReducer from './slices/inventory-slice';
import saveLoadReducer from './slices/save-load-slice';
import { saveGameToStorage } from '@/lib/utils/save-load';

// Combine all reducers
const rootReducer = combineReducers({
  game: gameReducer,
  map: mapReducer,
  node: nodeReducer,
  challenge: challengeReducer,
  inventory: inventoryReducer,
  saveLoad: saveLoadReducer
});

// Auto-save middleware
const autoSaveMiddleware = store => next => action => {
  const result = next(action);
  
  // Actions that should trigger an auto-save
  const autoSaveActions = [
    'map/completeCurrentNode',
    'game/takeDamage',
    'game/heal',
    'inventory/addItem',
    'inventory/removeItem',
    'challenge/completeChallenge'
  ];
  
  // Check if auto-save is enabled and the action should trigger a save
  if (
    store.getState().saveLoad.autoSaveEnabled && 
    autoSaveActions.includes(action.type) &&
    store.getState().game.isGameStarted &&
    !store.getState().game.isGameOver
  ) {
    const state = store.getState();
    const saveId = 'autosave';
    
    // Save game state to storage
    saveGameToStorage(saveId, state).then(saveData => {
      // Update auto-save metadata
      store.dispatch({
        type: 'saveLoad/addSave',
        payload: {
          id: saveId,
          name: 'Auto Save',
          timestamp: Date.now(),
          floorLevel: state.map.floorLevel,
          playerHealth: state.game.playerHealth,
          playerInsight: state.game.playerInsight,
          score: state.game.score
        }
      });
    });
  }
  
  return result;
};

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific paths
        ignoredActions: ['LOAD_GAME_STATE'],
        ignoredPaths: ['node.nodeData']
      }
    }).concat(autoSaveMiddleware)
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;