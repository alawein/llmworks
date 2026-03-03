// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the environment module
vi.mock('@/lib/environment', () => ({
  getConfig: vi.fn(() => ({
    features: {
      analytics: true,
      debugMode: false,
    },
    security: {
      rateLimiting: false,
    },
  })),
  isFeatureEnabled: vi.fn((feature: string) => feature === 'analytics'),
}));

import {
  trackPageView,
  trackLegacyEvent,
  trackError,
  trackPerformance,
  getAnalyticsData,
  clearAnalyticsData,
} from '@/lib/analytics';

// ─── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'llmworks_analytics_events';
const SESSION_KEY = 'llmworks_session_id';
const USER_KEY = 'llmworks_user_id';

/** Get the last value written to STORAGE_KEY */
function getStoredEvents(): any[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

describe('Analytics - Legacy Event Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ─── trackPageView ──────────────────────────────────────────────────────

  describe('trackPageView', () => {
    it('stores a page_view event in localStorage', () => {
      trackPageView('/home', 'Home Page');

      const stored = getStoredEvents();
      expect(stored.length).toBe(1);
      expect(stored[0].type).toBe('page_view');
      expect(stored[0].path).toBe('/home');
      expect(stored[0].title).toBe('Home Page');
    });

    it('uses document.title when title is not provided', () => {
      document.title = 'Default Title';

      trackPageView('/about');

      const stored = getStoredEvents();
      expect(stored[0].title).toBe('Default Title');
    });

    it('includes referrer in the event', () => {
      trackPageView('/contact');

      const stored = getStoredEvents();
      expect(stored[0]).toHaveProperty('referrer');
    });

    it('enriches event with session ID, user ID, and timestamp', () => {
      trackPageView('/dashboard');

      const stored = getStoredEvents();
      const event = stored[0];

      expect(event.ts).toBeDefined();
      expect(typeof event.ts).toBe('number');
      expect(event.sessionId).toBeDefined();
      expect(event.userId).toBeDefined();
      expect(event.userAgent).toBeDefined();
    });
  });

  // ─── trackLegacyEvent ────────────────────────────────────────────────────

  describe('trackLegacyEvent', () => {
    it('stores a custom event with name and payload', () => {
      trackLegacyEvent('button_click', { buttonId: 'signup' });

      const stored = getStoredEvents();
      expect(stored[0].type).toBe('event');
      expect(stored[0].name).toBe('button_click');
      expect(stored[0].payload).toEqual({ buttonId: 'signup' });
    });

    it('stores an event without payload', () => {
      trackLegacyEvent('page_scroll');

      const stored = getStoredEvents();
      expect(stored[0].type).toBe('event');
      expect(stored[0].name).toBe('page_scroll');
      expect(stored[0].payload).toBeUndefined();
    });
  });

  // ─── trackError ──────────────────────────────────────────────────────────

  describe('trackError', () => {
    it('stores an error event with message and stack', () => {
      const error = new Error('Something went wrong');
      trackError(error, 'component-render');

      const stored = getStoredEvents();
      const event = stored[0];
      expect(event.type).toBe('error');
      expect(event.name).toBe('error_occurred');
      expect(event.payload.message).toBe('Something went wrong');
      expect(event.payload.context).toBe('component-render');
      expect(event.payload.stack).toBeDefined();
    });

    it('stores error without context', () => {
      const error = new Error('Oops');
      trackError(error);

      const stored = getStoredEvents();
      expect(stored[0].payload.context).toBeUndefined();
    });

    it('includes the current URL in the error payload', () => {
      const error = new Error('fail');
      trackError(error);

      const stored = getStoredEvents();
      expect(stored[0].payload).toHaveProperty('url');
    });
  });

  // ─── trackPerformance ────────────────────────────────────────────────────

  describe('trackPerformance', () => {
    it('stores a performance event with name and duration', () => {
      trackPerformance('api_call', 250);

      const stored = getStoredEvents();
      const event = stored[0];
      expect(event.type).toBe('performance');
      expect(event.name).toBe('api_call');
      expect(event.payload.duration).toBe(250);
    });

    it('includes additional data in the payload', () => {
      trackPerformance('render', 100, { component: 'Dashboard' });

      const stored = getStoredEvents();
      expect(stored[0].payload.component).toBe('Dashboard');
      expect(stored[0].payload.duration).toBe(100);
    });

    it('includes the current URL in the payload', () => {
      trackPerformance('load', 500);

      const stored = getStoredEvents();
      expect(stored[0].payload).toHaveProperty('url');
    });
  });

  // ─── getAnalyticsData ────────────────────────────────────────────────────

  describe('getAnalyticsData', () => {
    it('returns empty array when no data is stored', () => {
      const data = getAnalyticsData();
      expect(data).toEqual([]);
    });

    it('returns stored events', () => {
      // Pre-populate storage
      const events = [
        { type: 'page_view', path: '/home', ts: Date.now() },
        { type: 'event', name: 'click', ts: Date.now() },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

      const data = getAnalyticsData();
      expect(data).toHaveLength(2);
      expect(data[0].type).toBe('page_view');
    });

    it('returns empty array on corrupted storage', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json{{{');
      const data = getAnalyticsData();
      expect(data).toEqual([]);
    });
  });

  // ─── clearAnalyticsData ──────────────────────────────────────────────────

  describe('clearAnalyticsData', () => {
    it('removes the analytics storage key', () => {
      // Populate first
      trackLegacyEvent('something');
      expect(getStoredEvents().length).toBeGreaterThan(0);

      clearAnalyticsData();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('getAnalyticsData returns empty after clearing', () => {
      trackLegacyEvent('event1');
      clearAnalyticsData();
      expect(getAnalyticsData()).toEqual([]);
    });
  });

  // ─── Event accumulation ────────────────────────────────────────────────

  describe('event accumulation', () => {
    it('appends new events to existing ones', () => {
      trackLegacyEvent('first');
      trackLegacyEvent('second');

      const stored = getStoredEvents();
      expect(stored.length).toBe(2);
      expect(stored[0].name).toBe('first');
      expect(stored[1].name).toBe('second');
    });

    it('keeps at most 1000 events (trimming old ones)', () => {
      // Pre-populate with 999 events
      const existingEvents = Array.from({ length: 999 }, (_, i) => ({
        type: 'event',
        name: `event_${i}`,
        ts: Date.now(),
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEvents));

      // Add 2 more (total would be 1001, trimmed to 1000)
      trackLegacyEvent('new_event_1');
      trackLegacyEvent('new_event_2');

      const stored = getStoredEvents();
      expect(stored.length).toBeLessThanOrEqual(1000);
    });
  });

  // ─── Session and user ID persistence ──────────────────────────────────

  describe('session and user ID', () => {
    it('generates and stores a session ID', () => {
      trackLegacyEvent('test');

      const sessionId = localStorage.getItem(SESSION_KEY);
      expect(sessionId).toBeDefined();
      expect(sessionId).toMatch(/^session_/);
    });

    it('generates and stores a user ID', () => {
      trackLegacyEvent('test');

      const userId = localStorage.getItem(USER_KEY);
      expect(userId).toBeDefined();
      expect(userId).toMatch(/^user_/);
    });

    it('reuses existing session and user IDs', () => {
      localStorage.setItem(SESSION_KEY, 'session_existing');
      localStorage.setItem(USER_KEY, 'user_existing');

      trackLegacyEvent('test');

      const stored = getStoredEvents();
      expect(stored[0].sessionId).toBe('session_existing');
      expect(stored[0].userId).toBe('user_existing');
    });

    it('uses the same session ID across multiple events', () => {
      trackLegacyEvent('event1');
      trackLegacyEvent('event2');

      const stored = getStoredEvents();
      expect(stored[0].sessionId).toBe(stored[1].sessionId);
    });
  });

  // ─── Graceful failure ────────────────────────────────────────────────────

  describe('graceful failure handling', () => {
    it('does not throw when localStorage.getItem throws', () => {
      const originalGetItem = localStorage.getItem.bind(localStorage);
      vi.spyOn(localStorage, 'getItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => trackLegacyEvent('test')).not.toThrow();

      vi.restoreAllMocks();
    });
  });
});
