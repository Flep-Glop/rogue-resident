import { configureStore, combineReducers, Middleware } from '@reduxjs/toolkit';
import gameReducer from './slices/game-slice';
import mapReducer from './slices/map-slice';
import nodeReducer from './slices/node-slice';
import challengeReducer from './slices/challenge-slice';
import inventoryReducer from './slices/inventory-slice';
import saveLoadReducer from './slices/save-load-slice';
import { gameLoopMiddleware, autoSaveMiddleware, analyticsMiddleware } from './middleware/game-loop';
import { AppError, ErrorType, reportError } from '@/lib/utils/error-handlers';

// Combine all reducers
const rootReducer = combineReducers({
  game: gameReducer,
  map: mapReducer,
  node: nodeReducer,
  challenge: challengeReducer,
  inventory: inventoryReducer,
  saveLoad: saveLoadReducer
});

// Error logging middleware
const errorLoggingMiddleware: Middleware = store => next => action => {
  try {
    return next(action);
  } catch (error) {
    // Create an AppError with appropriate type based on the action
    const errorType = getErrorTypeFromAction(action);
    
    const appError = error instanceof AppError
      ? error
      : new AppError(
          `Redux error: ${error instanceof Error ? error.message : String(error)}`,
          errorType,
          undefined,
          { action }
        );
    
    // Report error
    reportError(appError, { 
      actionType: action.type,
      state: store.getState()
    });
    
    // Re-throw the error to not swallow it
    throw error;
  }
};

// Helper to determine error type from action
function getErrorTypeFromAction(action: any): ErrorType {
  const type = action.type || '';
  
  if (type.startsWith('game/')) return ErrorType.GAME;
  if (type.startsWith('map/')) return ErrorType.MAP;
  if (type.startsWith('node/')) return ErrorType.NODE;
  if (type.startsWith('challenge/')) return ErrorType.CHALLENGE;
  if (type.startsWith('inventory/')) return ErrorType.INVENTORY;
  if (type.startsWith('saveLoad/')) return ErrorType.SAVE_LOAD;
  
  return ErrorType.UNKNOWN;
}

// Root reducer with error handling
const rootReducerWithErrorHandling = (state: any, action: any) => {
  try {
    return rootReducer(state, action);
  } catch (error) {
    // Log the error
    const errorType = getErrorTypeFromAction(action);
    
    const appError = error instanceof AppError
      ? error
      : new AppError(
          `Reducer error: ${error instanceof Error ? error.message : String(error)}`,
          errorType,
          undefined,
          { action, state }
        );
    
    reportError(appError, { 
      actionType: action.type,
      state: state
    });
    
    // Return previous state to prevent the app from crashing
    return state || rootReducer(undefined, { type: '@@INIT' });
  }
};

// Create store
export const store = configureStore({
  reducer: rootReducerWithErrorHandling,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific paths
        ignoredActions: ['LOAD_GAME_STATE'],
        ignoredPaths: ['node.nodeData']
      }
    }).concat([
      errorLoggingMiddleware,
      gameLoopMiddleware,
      autoSaveMiddleware,
      analyticsMiddleware
    ])
});

// Set up development tools
if (process.env.NODE_ENV === 'development') {
  // Expose store in development for debugging
  if (typeof window !== 'undefined') {
    (window as any).__REDUX_STORE__ = store;
  }
}

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;