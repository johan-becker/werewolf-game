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
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
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
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testTimeout: 10000,
  maxWorkers: 1, // Prevent database conflicts in tests
  // Clear mocks after each test
  clearMocks: true,
  restoreMocks: true,
  // Werewolf-themed test configuration
  collectCoverageFrom: [
    'src/services/werewolf-*.{ts,tsx}',
    'src/services/role-*.{ts,tsx}',
    'src/services/role-strategies/*.{ts,tsx}',
    'src/services/chat.service.{ts,tsx}',
    'src/services/game.service.{ts,tsx}',
    'src/controllers/*.{ts,tsx}',
    'src/socket/**/*.{ts,tsx}',
    '!**/*.d.ts',
  ],
};