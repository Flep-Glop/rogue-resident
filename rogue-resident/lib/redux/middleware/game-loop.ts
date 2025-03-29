import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { incrementTurn } from '../slices/game-slice';
import { decrementEffectDurations } from '../slices/inventory-slice';
import { decrementTimer } from '../slices/challenge-slice';
import { AppError, ErrorType, reportError } from '@/lib/utils/error-handlers';

/**
 * Actions that represent a turn progression in the game
 */
const TURN_PROGRESSION_ACTIONS = [
  'map/completeNode',
  'map/setCurrentNode',
  'node/completeNode',
  'inventory/useItem'
];

/**
 * Actions that should trigger the challenge timer
 */
const CHALLENGE_TIMER_ACTIONS = [
  'challenge/startChallenge',
  'challenge/advanceStage',
  'challenge/recordResponse'
];

/**
 * Middleware that handles game loop logic
 */
export const gameLoopMiddleware: Middleware<{}, RootState> = store => next => action => {
  try {
    // Allow the action to update state first
    const result = next(action);
    
    // Get current state
    const state = store.getState();
    
    // Only process game loop if game is in progress
    if (state.game.isGameStarted && !state.game.isGameOver) {
      // Check if this action represents a turn progression
      if (TURN_PROGRESSION_ACTIONS.includes(action.type)) {
        // Increment the game turn
        store.dispatch(incrementTurn());
        
        // Process time-based effects (e.g., reduce duration counters)
        store.dispatch(decrementEffectDurations());
      }
      
      // Handle challenge timer if a challenge is active
      if (
        CHALLENGE_TIMER_ACTIONS.includes(action.type) &&
        state.challenge.timeRemaining !== null &&
        state.challenge.timeRemaining > 0 &&
        state.challenge.challengeState === 'active'
      ) {
        // Start a timer that dispatches decrementTimer
        // We use a callback instead of an interval to ensure timer accuracy
        const startTime = Date.now();
        const timeRemaining = state.challenge.timeRemaining;
        
        const scheduleTimerTick = () => {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          if (elapsed < timeRemaining) {
            // If time has passed but we're still in the challenge, decrement
            const currentState = store.getState();
            if (
              currentState.challenge.challengeState === 'active' &&
              currentState.challenge.timeRemaining !== null &&
              currentState.challenge.timeRemaining > 0
            ) {
              store.dispatch(decrementTimer());
              setTimeout(scheduleTimerTick, 1000);
            }
          }
        };
        
        // Schedule first tick
        setTimeout(scheduleTimerTick, 1000);
      }
      
      // Handle other game loop logic here as needed
      // E.g., check for end-of-floor, special events, etc.
    }
    
    return result;
  } catch (error) {
    // Handle any errors in the game loop
    const appError = error instanceof AppError
      ? error
      : new AppError(
          `Game loop error: ${error instanceof Error ? error.message : String(error)}`,
          ErrorType.GAME
        );
    
    reportError(appError, { actionType: action.type });
    
    // Allow the action to continue even if game loop had an error
    return next(action);
  }
};

/**
 * Middleware that handles auto-saving the game
 */
export const autoSaveMiddleware: Middleware<{}, RootState> = store => next => action => {
  // Process the action first
  const result = next(action);
  
  // Get updated state
  const state = store.getState();
  
  // List of actions that should trigger an auto-save
  const AUTO_SAVE_ACTIONS = [
    'map/completeNode',
    'map/completeCurrentNode',
    'challenge/completeChallenge',
    'inventory/addItem',
    'inventory/removeItem',
    'game/takeDamage',
    'game/heal'
  ];
  
  // Check if auto-save is enabled and this action should trigger a save
  if (
    state.saveLoad.autoSaveEnabled &&
    AUTO_SAVE_ACTIONS.includes(action.type) &&
    state.game.isGameStarted &&
    !state.game.isGameOver
  ) {
    // Dispatch action to auto-save the game
    // This is implemented in the saveLoad slice thunks
    store.dispatch({ type: 'saveLoad/autoSave' });
  }
  
  return result;
};

/**
 * Middleware that handles analytics and metrics
 */
export const analyticsMiddleware: Middleware<{}, RootState> = store => next => action => {
  // Process the action first
  const result = next(action);
  
  // Get updated state
  const state = store.getState();
  
  // Track various game metrics
  if (state.game.isGameStarted) {
    switch (action.type) {
      case 'challenge/completeChallenge':
        // Track challenge completion
        trackAnalytics('challenge_complete', {
          type: state.challenge.challengeType,
          difficulty: state.challenge.difficulty,
          grade: action.payload.grade,
          timeRemaining: state.challenge.timeRemaining
        });
        break;
        
      case 'inventory/addItem':
        // Track item acquisition
        trackAnalytics('item_acquired', {
          itemId: action.payload.id,
          itemType: action.payload.type,
          itemRarity: action.payload.rarity
        });
        break;
        
      case 'map/completeNode':
        // Track node completion
        const node = state.map.nodes.find(n => n.id === action.payload);
        if (node) {
          trackAnalytics('node_complete', {
            nodeType: node.type,
            nodeDifficulty: node.difficulty
          });
        }
        break;
        
      case 'game/endGame':
        // Track game completion
        trackAnalytics('game_complete', {
          completed: action.payload,
          score: state.game.score,
          turns: state.game.turn,
          floor: state.game.floor,
          character: state.game.selectedCharacterId
        });
        break;
    }
  }
  
  return result;
};

/**
 * Track analytics event
 * This is a placeholder function that would be implemented with an actual analytics service
 */
function trackAnalytics(eventName: string, data: any): void {
  // In development, just log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}:`, data);
  }
  
  // In production, would send to an analytics service
  // e.g., window.gtag('event', eventName, data);
}