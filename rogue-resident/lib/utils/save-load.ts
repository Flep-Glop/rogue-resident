import { RootState } from '@/lib/redux/store';
import { tryCatch } from './error-handlers';
import { AppError, ErrorType } from './error-handlers';
import { formatDateTime } from './date-utils';

const STORAGE_PREFIX = 'rogue_resident_save_';
const MAX_SAVES = 10; // Maximum number of manual saves
const MAX_AUTOSAVES = 3; // Maximum number of auto-saves
const STATE_VERSION = '1.0.0'; // Use for migration if state schema changes

export interface SaveGameData {
  id: string;
  name: string;
  timestamp: number;
  floorLevel: number;
  playerHealth: number;
  playerInsight: number;
  score: number;
  character?: string;
  difficulty?: string;
  completedNodes?: number;
  itemCount?: number;
  version?: string;
  isAutosave?: boolean;
  thumbnail?: string; // Base64 encoded image if we add screenshots
}

/**
 * Saves the current game state to storage
 * @param saveId Unique identifier for the save
 * @param state Current Redux state
 * @param isAutosave Whether this is an autosave
 * @returns The save metadata
 */
export const saveGameToStorage = async (
  saveId: string, 
  state: RootState, 
  options: { 
    isAutosave?: boolean,
    customName?: string,
    generateThumbnail?: boolean
  } = {}
): Promise<SaveGameData> => {
  try {
    const { isAutosave = saveId === 'autosave', customName, generateThumbnail = false } = options;
    
    // Calculate save name
    let saveName: string;
    if (customName) {
      saveName = customName;
    } else if (isAutosave) {
      saveName = 'Auto Save';
    } else {
      // Create a descriptive name with floor and timestamp
      const dateStr = formatDateTime(new Date());
      saveName = `Floor ${state.map.floorLevel} - ${dateStr}`;
    }
    
    // Create save metadata with more details
    const saveData: SaveGameData = {
      id: saveId,
      name: saveName,
      timestamp: Date.now(),
      floorLevel: state.map.floorLevel,
      playerHealth: state.game.playerHealth,
      playerInsight: state.game.playerInsight,
      score: state.game.score,
      character: state.game.selectedCharacterId || undefined,
      difficulty: state.game.difficulty,
      completedNodes: state.map.nodes.filter(n => n.status === 'completed').length,
      itemCount: state.inventory.items.length,
      version: STATE_VERSION,
      isAutosave
    };
    
    // Optionally generate thumbnail (if we implement this feature)
    if (generateThumbnail) {
      // This would capture a screenshot of the game state
      // saveData.thumbnail = await generateSaveThumbnail();
    }
    
    // Clean up old saves before adding new one
    if (isAutosave) {
      cleanupAutosaves(MAX_AUTOSAVES - 1); // -1 to make room for new save
    } else {
      cleanupManualSaves(MAX_SAVES - 1); // -1 to make room for new save
    }
    
    // Save metadata to list of saves
    await saveSaveGameData(saveData);
    
    // Prepare state for storage with version info
    const stateForStorage = {
      ...state,
      _saveInfo: {
        version: STATE_VERSION,
        timestamp: Date.now(),
        isAutosave
      }
    };
    
    // Serialize and save full game state
    const serializedState = JSON.stringify(stateForStorage);
    localStorage.setItem(`${STORAGE_PREFIX}${saveId}`, serializedState);
    
    return saveData;
  } catch (error) {
    console.error('Error saving game:', error);
    throw new AppError(
      `Failed to save game: ${error instanceof Error ? error.message : String(error)}`, 
      ErrorType.SAVE_LOAD
    );
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
    
    if (!serializedState) {
      return null;
    }
    
    // Parse the state
    const state = JSON.parse(serializedState);
    
    // Check if migration is needed
    if (state._saveInfo?.version !== STATE_VERSION) {
      return migrateStateIfNeeded(state);
    }
    
    return state;
  } catch (error) {
    console.error('Error loading game:', error);
    throw new AppError(
      `Failed to load game: ${error instanceof Error ? error.message : String(error)}`, 
      ErrorType.SAVE_LOAD
    );
  }
};

/**
 * Migrates state from older versions if needed
 * @param state The state to migrate
 * @returns Migrated state
 */
const migrateStateIfNeeded = (state: any) => {
  // This is where we would handle migrations between different state versions
  // For now, just return the state as-is
  
  console.log('State migration may be needed from version', 
    state._saveInfo?.version || 'unknown', 
    'to', STATE_VERSION);
  
  return state;
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
    
    return true;
  } catch (error) {
    console.error('Error deleting saved game:', error);
    throw new AppError(
      `Failed to delete save: ${error instanceof Error ? error.message : String(error)}`, 
      ErrorType.SAVE_LOAD
    );
  }
};

/**
 * Gets a list of all saved games
 * @returns Array of save metadata
 */
export const getSavedGames = (): SaveGameData[] => {
  return tryCatch(() => {
    const savedGamesJson = localStorage.getItem(`${STORAGE_PREFIX}saves`);
    return savedGamesJson ? JSON.parse(savedGamesJson) : [];
  }, []);
};

/**
 * Adds or updates save metadata in the list of saves
 * @param saveData Save metadata
 */
const saveSaveGameData = async (saveData: SaveGameData) => {
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
    
    // Sort saves by timestamp (newest first)
    saves.sort((a, b) => b.timestamp - a.timestamp);
    
    // Save updated list
    localStorage.setItem(`${STORAGE_PREFIX}saves`, JSON.stringify(saves));
  } catch (error) {
    console.error('Error saving game data:', error);
    throw new AppError(
      `Failed to save game metadata: ${error instanceof Error ? error.message : String(error)}`, 
      ErrorType.SAVE_LOAD
    );
  }
};

/**
 * Cleans up autosaves, keeping only the most recent ones
 * @param keepCount Number of autosaves to keep
 */
export const cleanupAutosaves = (keepCount: number) => {
  try {
    const saves = getSavedGames();
    const autosaves = saves.filter(save => save.isAutosave);
    
    // Sort by timestamp (newest first)
    autosaves.sort((a, b) => b.timestamp - a.timestamp);
    
    // Delete old autosaves beyond the keep count
    if (autosaves.length > keepCount) {
      const savesToDelete = autosaves.slice(keepCount);
      
      // Delete each save
      savesToDelete.forEach(save => {
        localStorage.removeItem(`${STORAGE_PREFIX}${save.id}`);
      });
      
      // Update saves list
      const updatedSaves = saves.filter(save => 
        !savesToDelete.some(deleteThis => deleteThis.id === save.id)
      );
      localStorage.setItem(`${STORAGE_PREFIX}saves`, JSON.stringify(updatedSaves));
    }
  } catch (error) {
    console.error('Error cleaning up autosaves:', error);
  }
};

/**
 * Cleans up manual saves, keeping only the most recent ones
 * @param keepCount Number of manual saves to keep
 */
export const cleanupManualSaves = (keepCount: number) => {
  try {
    const saves = getSavedGames();
    const manualSaves = saves.filter(save => !save.isAutosave);
    
    // Sort by timestamp (newest first)
    manualSaves.sort((a, b) => b.timestamp - a.timestamp);
    
    // Delete old manual saves beyond the keep count
    if (manualSaves.length > keepCount) {
      const savesToDelete = manualSaves.slice(keepCount);
      
      // Delete each save
      savesToDelete.forEach(save => {
        localStorage.removeItem(`${STORAGE_PREFIX}${save.id}`);
      });
      
      // Update saves list
      const updatedSaves = saves.filter(save => 
        !savesToDelete.some(deleteThis => deleteThis.id === save.id)
      );
      localStorage.setItem(`${STORAGE_PREFIX}saves`, JSON.stringify(updatedSaves));
    }
  } catch (error) {
    console.error('Error cleaning up manual saves:', error);
  }
};

/**
 * Checks if game state exists in storage
 * @returns Boolean indicating if any saves exist
 */
export const hasSavedGames = (): boolean => {
  return tryCatch(() => {
    const saves = getSavedGames();
    return saves.length > 0;
  }, false);
};

/**
 * Exports save data to a file that can be downloaded
 * @param saveId The save ID to export
 * @returns Blob containing the save data
 */
export const exportSaveToFile = async (saveId: string): Promise<Blob> => {
  try {
    const serializedState = localStorage.getItem(`${STORAGE_PREFIX}${saveId}`);
    if (!serializedState) {
      throw new Error('Save not found');
    }
    
    // Get save metadata
    const saves = getSavedGames();
    const saveMetadata = saves.find(save => save.id === saveId);
    
    // Create export package with both metadata and full state
    const exportData = {
      metadata: saveMetadata,
      fullState: JSON.parse(serializedState),
      exportDate: new Date().toISOString(),
      gameVersion: '1.0.0' // Should match app version
    };
    
    // Convert to JSON string
    const exportString = JSON.stringify(exportData, null, 2);
    
    // Create blob for download
    return new Blob([exportString], { type: 'application/json' });
  } catch (error) {
    console.error('Error exporting save:', error);
    throw new AppError(
      `Failed to export save: ${error instanceof Error ? error.message : String(error)}`, 
      ErrorType.SAVE_LOAD
    );
  }
};

/**
 * Imports save data from a file
 * @param fileContent The content of the save file
 * @returns The imported save metadata
 */
export const importSaveFromFile = async (fileContent: string): Promise<SaveGameData> => {
  try {
    // Parse the file content
    const importData = JSON.parse(fileContent);
    
    // Validate import data
    if (!importData.metadata || !importData.fullState) {
      throw new Error('Invalid save file format');
    }
    
    // Generate a new save ID to avoid conflicts
    const newSaveId = `import_${Date.now()}`;
    const metadata = {
      ...importData.metadata,
      id: newSaveId,
      name: `Imported: ${importData.metadata.name}`,
      timestamp: Date.now(),
      isImported: true
    };
    
    // Update the state with the new save ID
    const fullState = {
      ...importData.fullState,
      _saveInfo: {
        ...importData.fullState._saveInfo,
        importedFrom: importData.metadata.id,
        importDate: new Date().toISOString()
      }
    };
    
    // Save to storage
    localStorage.setItem(`${STORAGE_PREFIX}${newSaveId}`, JSON.stringify(fullState));
    await saveSaveGameData(metadata);
    
    return metadata;
  } catch (error) {
    console.error('Error importing save:', error);
    throw new AppError(
      `Failed to import save: ${error instanceof Error ? error.message : String(error)}`, 
      ErrorType.SAVE_LOAD
    );
  }
};