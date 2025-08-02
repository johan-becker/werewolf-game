import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import React from 'react';

// Configure React Testing Library
configure({
  testIdAttribute: 'data-testid',
});

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

// Mock Framer Motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Socket.IO client for werewolf game
jest.mock('socket.io-client', () => ({
  io: jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    connected: true,
  })),
}));

// Mock werewolf-specific APIs
global.fetch = jest.fn();

// Setup werewolf theme testing environment
beforeEach(() => {
  // Reset fetch mock
  (fetch as jest.Mock).mockClear();
  
  // Mock werewolf game state
  window.localStorage.setItem('werewolf-game-theme', 'dark');
  window.localStorage.setItem('werewolf-user-pack', 'shadow-wolves');
});

afterEach(() => {
  // Clean up after each test
  window.localStorage.clear();
});

// Global test timeout
jest.setTimeout(10000);

console.log('🐺 Werewolf frontend test environment initialized');