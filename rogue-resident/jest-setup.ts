// Import jest-dom add-ons
import '@testing-library/jest-dom'

// Mock the window.matchMedia API
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
  
  callback: IntersectionObserverCallback
  
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})

// Mock localStorage
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
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock ReactFlow
jest.mock('reactflow', () => ({
  ...jest.requireActual('reactflow'),
  Handle: jest.fn().mockImplementation(({ type, position, className }) => (
    <div data-testid={`handle-${type}-${position}`} className={className} />
  )),
  ReactFlowProvider: jest.fn().mockImplementation(({ children }) => children),
  useReactFlow: jest.fn().mockReturnValue({
    setCenter: jest.fn(),
    fitView: jest.fn(),
    getNodes: jest.fn().mockReturnValue([]),
    getEdges: jest.fn().mockReturnValue([]),
  }),
}))

// Add global mocks for testing
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock console methods to catch errors
const originalError = console.error
const originalWarn = console.warn
const originalLog = console.log

beforeAll(() => {
  console.error = (...args: any[]) => {
    // Check if the error is from React Testing Library
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render has been deprecated')
    ) {
      return
    }
    originalError(...args)
  }
  
  console.warn = (...args: any[]) => {
    // Suppress specific warnings here if needed
    originalWarn(...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
  console.log = originalLog
})

// Make dates in tests deterministic
// Set a fixed date for tests using dates
const mockDate = new Date('2025-01-01T12:00:00Z')
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string)
