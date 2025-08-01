// Global test setup for werewolf shared package

beforeAll(() => {
  console.log('🌕 Setting up werewolf shared utilities test environment...');
});

beforeEach(() => {
  // Clear any mocks before each test
  jest.clearAllMocks();
});

afterAll(() => {
  console.log('🌑 Cleaning up werewolf shared utilities test environment...');
});

// Global test timeout
jest.setTimeout(5000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};