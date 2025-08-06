import 'reflect-metadata';

// Global test setup for werewolf backend
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DISABLE_RATE_LIMITING = 'true'; // Disable rate limiting for integration tests
  process.env.JWT_SECRET = 'test-secret-for-werewolf-game';
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/werewolf_test';
  process.env.SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'http://localhost:54321';
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY || 'test-key';

  // Initialize test database if needed
  // eslint-disable-next-line no-console
  console.log('🌕 Setting up werewolf test environment...');
});

beforeEach(() => {
  // Clear any mocks before each test
  jest.clearAllMocks();
});

afterAll(async () => {
  // Cleanup after all tests
  // eslint-disable-next-line no-console
  console.log('🌑 Cleaning up werewolf test environment...');
});

// Global test timeout for async operations
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock werewolf-specific environment variables
process.env.WEREWOLF_GAME_SECRET = 'test-werewolf-secret';
process.env.MOON_PHASE_API_KEY = 'test-moon-api-key';
process.env.PACK_TERRITORY_ENABLED = 'true';

// Dummy test to satisfy Jest requirement
describe('Test Setup', () => {
  it('should load test environment correctly', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.WEREWOLF_GAME_SECRET).toBeDefined();
  });
});
