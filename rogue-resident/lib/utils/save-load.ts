import { RootState } from '@/lib/redux/store';

const STORAGE_PREFIX = 'rogue_resident_save_';

export interface SaveGameData {
  id: string;
  name: string;
  timestamp: number;
  floorLevel: number;
  playerHealth: number;
  playerInsight: number;
  score: number;
}

/**
 * Saves the current game state to storage
 * @param saveId Unique identifier for the save
 * @param state Current Redux state
 */
export const saveGameToStorage = async (saveId: string, state: RootState) => {
  try {
    // Create save metadata
    const saveData: SaveGameData = {
      id: saveId,
      name: saveId === 'autosave' ? 'Auto Save' : `Save ${new Date().toLocaleString()}`,
      timestamp: Date.now(),
      floorLevel: state.map.floorLevel,
      playerHealth: state.game.playerHealth,
      playerInsight: state.game.playerInsight,
      score: state.game.score
    };
    
    // Save metadata to list of saves
    saveSaveGameData(saveData);
    
    // Serialize and save full game state
    const serializedState = JSON.stringify(state);
    localStorage.setItem(`${STORAGE_PREFIX}${saveId}`, serializedState);
    
    return saveData;
  } catch (error) {
    console.error('Error saving game:', error);
    throw error;
  }
};

/**
 * Loads a game state from storage
 * @param saveId Unique identifier for the save
 * @returns The loaded game state, or null if not found
 */
export const loadGameFromStorage = async (saveId: string) => {
  try {
    const serializedState = localStorage.getItem(`${STORAGE_PREFIX}${saveId}`);
    
    if (serializedState) {
      return JSON.parse(serializedState);
    }
    
    return null;
  } catch (error) {
    console.error('Error loading game:', error);
    throw error;
  }
};

/**
 * Deletes a saved game from storage
 * @param saveId Unique identifier for the save
 */
export const deleteSavedGame = (saveId: string) => {
  try {
    // Remove from saves list
    const saves = getSavedGames();
    const updatedSaves = saves.filter(save => save.id !== saveId);
    localStorage.setItem(`${STORAGE_PREFIX}saves`, JSON.stringify(updatedSaves));
    
    // Remove save data
    localStorage.removeItem(`${STORAGE_PREFIX}${saveId}`);
  } catch (error) {
    console.error('Error deleting saved game:', error);
    throw error;
  }
};

/**
 * Gets a list of all saved games
 * @returns Array of save metadata
 */
export const getSavedGames = (): SaveGameData[] => {
  try {
    const savedGamesJson = localStorage.getItem(`${STORAGE_PREFIX}saves`);
    return savedGamesJson ? JSON.parse(savedGamesJson) : [];
  } catch (error) {
    console.error('Error getting saved games:', error);
    return [];
  }
};

/**
 * Adds or updates save metadata in the list of saves
 * @param saveData Save metadata
 */
const saveSaveGameData = (saveData: SaveGameData) => {
  try {
    const saves = getSavedGames();
    const existingIndex = saves.findIndex(save => save.id === saveData.id);
    
    if (existingIndex >= 0) {
      // Update existing save
      saves[existingIndex] = saveData;
    } else {
      // Add new save
      saves.push(saveData);
    }
    
    // Save updated list
    localStorage.setItem(`${STORAGE_PREFIX}saves`, JSON.stringify(saves));
  } catch (error) {
    console.error('Error saving game data:', error);
    throw error;
  }
};