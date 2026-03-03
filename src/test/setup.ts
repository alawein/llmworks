import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Extend Jest matchers with custom accessibility matchers
import 'jest-axe/extend-expect';

// Suppress React act() warnings in test environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// ----- Shared browser API mocks -----
// These are missing from jsdom and needed by virtually every component test.

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
  takeRecords: vi.fn(),
})) as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as any;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollIntoView (not implemented in jsdom)
HTMLElement.prototype.scrollIntoView = vi.fn();
