/* eslint-env jest */

// Test setup
beforeAll(() => {
  console.log('Setting up test environment');
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  console.log('Cleaning up test environment');
});

// Global test utilities
global.testUtils = {
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),
  randomId: () => Math.random().toString(36).substring(7),
};

// Jest configuration
jest.setTimeout(10000);

// Mock implementations
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// TypeScript declarations for global test utilities
declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    delay: (ms: number) => Promise<void>;
    randomId: () => string;
  };
}

export {};
