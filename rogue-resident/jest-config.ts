import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig: Config = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  
  // Use directory for tests
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  
  // Mock static files with identity-obj-proxy
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|webp|svg|ico|eot|otf|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  
  // Ignore the following directories
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/public/',
  ],
  
  // Use jsdom test environment
  testEnvironment: 'jsdom',
  
  // Collect coverage information
  collectCoverage: true,
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  
  // Minimum coverage threshold
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Report directory
  coverageDirectory: '<rootDir>/coverage',
  
  // Report formats
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  
  // Verbose output
  verbose: true,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig)
