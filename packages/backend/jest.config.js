/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  coverageDirectory: 'coverage',
  // Merged coverage collection patterns - prioritizing werewolf-specific services while maintaining general coverage
  collectCoverageFrom: [
    // General source files
    'src/**/*.{ts,tsx}',
    // Werewolf-specific services (high priority)
    'src/services/werewolf-*.{ts,tsx}',
    'src/services/role-*.{ts,tsx}',
    'src/services/role-strategies/*.{ts,tsx}',
    'src/services/chat.service.{ts,tsx}',
    'src/services/game.service.{ts,tsx}',
    'src/controllers/*.{ts,tsx}',
    'src/socket/**/*.{ts,tsx}',
    // Exclusions
    '!src/**/*.d.ts',
    '!src/server.ts',
    '!src/cli/**',
    '!src/generated/**',
    '!src/migrations/**',
    '!**/node_modules/**',
    '!**/coverage/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  // Load test environment variables
  setupFiles: ['<rootDir>/src/__tests__/env-setup.ts'],
  // Fixed module name mapping with proper Jest configuration key
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@werewolf/shared$': '<rootDir>/../shared/src',
  },
  testTimeout: 10000,
  maxWorkers: 1, // Prevent database conflicts in tests
  // Clear mocks after each test
  clearMocks: true,
  restoreMocks: true,
  // Enable TypeScript path mapping support
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};