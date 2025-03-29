import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import { ReactFlowProvider } from 'reactflow'

// Import your reducers
import gameReducer from '@/lib/redux/slices/game-slice'
import mapReducer from '@/lib/redux/slices/map-slice'
import nodeReducer from '@/lib/redux/slices/node-slice'
import challengeReducer from '@/lib/redux/slices/challenge-slice'
import inventoryReducer from '@/lib/redux/slices/inventory-slice'
import saveLoadReducer from '@/lib/redux/slices/save-load-slice'

// Test store options for configureStore
interface TestStoreOptions {
  preloadedState?: any
  reducers?: Record<string, any>
}

// Create a test store with optional preloaded state and reducers
export function createTestStore({ preloadedState, reducers }: TestStoreOptions = {}): EnhancedStore {
  return configureStore({
    reducer: {
      game: gameReducer,
      map: mapReducer,
      node: nodeReducer,
      challenge: challengeReducer,
      inventory: inventoryReducer,
      saveLoad: saveLoadReducer,
      ...reducers
    },
    preloadedState
  })
}

// Interface for the custom render function
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  store?: EnhancedStore
  preloadedState?: any
  withReactFlow?: boolean
}

// Custom render function that wraps the component with providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    store = createTestStore(),
    preloadedState,
    withReactFlow = false,
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Create a new store if preloadedState is provided
  if (preloadedState) {
    store = createTestStore({ preloadedState })
  }
  
  // Function to wrap the component with providers
  function Wrapper({ children }: { children: React.ReactNode }) {
    if (withReactFlow) {
      return (
        <Provider store={store}>
          <ReactFlowProvider>
            {children}
          </ReactFlowProvider>
        </Provider>
      )
    }
    
    return (
      <Provider store={store}>
        {children}
      </Provider>
    )
  }
  
  // Return an object with the rendered component and the store
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}

// Mock window.matchMedia for tests
export function setupMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// Create a debounce mock for hooks that use it
export function mockDebounce<T extends (...args: any[]) => any>(
  fn: T
): jest.MockedFunction<T> {
  return jest.fn((...args) => fn(...args)) as jest.MockedFunction<T>
}

// Mock local storage for tests
export function mockLocalStorage() {
  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString()
      },
      removeItem: (key: string) => {
        delete store[key]
      },
      clear: () => {
        store = {}
      },
      length: Object.keys(store).length,
      key: (index: number) => Object.keys(store)[index] || null,
    }
  })()
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  })
  
  return localStorageMock
}