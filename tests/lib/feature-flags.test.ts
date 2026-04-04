/**
 * Tests for src/lib/feature-flags.ts
 *
 * Covers: isFeatureFlagEnabled, getAllFeatureFlags, getEnabledFeatures,
 * setOverride, clearOverrides, and condition evaluation.
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the environment module
vi.mock('@/lib/environment', () => ({
  getConfig: vi.fn(() => ({
    features: {
      analytics: false,
      debugMode: false,
      betaFeatures: true,
    },
    security: {
      rateLimiting: false,
    },
  })),
  isFeatureEnabled: vi.fn(() => false),
  isProduction: vi.fn(() => false),
}));

import {
  isFeatureFlagEnabled,
  getAllFeatureFlags,
  getEnabledFeatures,
  setOverride,
  clearOverrides,
  useFeatureFlag,
} from '@/lib/feature-flags';

const OVERRIDE_KEY = 'llm_works_feature_overrides';

describe('Feature Flags', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ─── getAllFeatureFlags ─────────────────────────────────────────────

  describe('getAllFeatureFlags', () => {
    it('returns an object with feature flag definitions', () => {
      const flags = getAllFeatureFlags();
      expect(typeof flags).toBe('object');
      expect(Object.keys(flags).length).toBeGreaterThan(0);
    });

    it('includes known feature flags', () => {
      const flags = getAllFeatureFlags();
      expect(flags['arena.multimodel']).toBeDefined();
      expect(flags['arena.multimodel'].enabled).toBe(true);
    });

    it('returns a copy (not the internal reference)', () => {
      const flags1 = getAllFeatureFlags();
      const flags2 = getAllFeatureFlags();
      expect(flags1).not.toBe(flags2);
      expect(flags1).toEqual(flags2);
    });
  });

  // ─── isFeatureFlagEnabled ──────────────────────────────────────────

  describe('isFeatureFlagEnabled', () => {
    it('returns true for globally enabled flags with 100% rollout', () => {
      expect(isFeatureFlagEnabled('arena.multimodel')).toBe(true);
    });

    it('returns false for globally disabled flags without context', () => {
      expect(isFeatureFlagEnabled('arena.collaboration')).toBe(false);
    });

    it('returns false for unknown flag names', () => {
      expect(isFeatureFlagEnabled('nonexistent.flag')).toBe(false);
    });

    it('respects localStorage overrides', () => {
      setOverride('arena.collaboration', true);
      expect(isFeatureFlagEnabled('arena.collaboration')).toBe(true);

      setOverride('arena.collaboration', false);
      expect(isFeatureFlagEnabled('arena.collaboration')).toBe(false);
    });

    it('returns false when user context does not affect basic flag check', () => {
      // Feature flags use enabled + rollout, not user-level targeting
      expect(
        isFeatureFlagEnabled('arena.collaboration', {
          id: 'user1',
          groups: ['regular-users'],
        })
      ).toBe(false);
    });

    it('evaluates rollout percentage consistently for same user', () => {
      const result1 = isFeatureFlagEnabled('dashboard.realtime', {
        id: 'consistent-user',
      });
      const result2 = isFeatureFlagEnabled('dashboard.realtime', {
        id: 'consistent-user',
      });
      expect(result1).toBe(result2);
    });
  });

  // ─── Condition evaluation ──────────────────────────────────────────

  describe('condition evaluation', () => {
    it('evaluates equals condition', () => {
      // bench.parallel has condition: plan === 'enterprise'
      const result = isFeatureFlagEnabled('bench.parallel', {
        id: 'user1',
        plan: 'enterprise',
      });
      // The flag is disabled (enabled: false), so conditions don't override that
      expect(result).toBe(false);
    });
  });

  // ─── setOverride / clearOverrides ──────────────────────────────────

  describe('setOverride', () => {
    it('stores override in localStorage', () => {
      setOverride('perf.wasm', true);
      const stored = JSON.parse(localStorage.getItem(OVERRIDE_KEY) || '{}');
      expect(stored['perf.wasm']).toBe(true);
    });

    it('can override a flag to false', () => {
      setOverride('arena.multimodel', false);
      expect(isFeatureFlagEnabled('arena.multimodel')).toBe(false);
    });
  });

  describe('clearOverrides', () => {
    it('removes all overrides from localStorage', () => {
      setOverride('perf.wasm', true);
      setOverride('arena.multimodel', false);

      clearOverrides();

      expect(localStorage.getItem(OVERRIDE_KEY)).toBeNull();
    });

    it('restores default behavior after clearing', () => {
      setOverride('arena.multimodel', false);
      clearOverrides();
      expect(isFeatureFlagEnabled('arena.multimodel')).toBe(true);
    });
  });

  // ─── getEnabledFeatures ────────────────────────────────────────────

  describe('getEnabledFeatures', () => {
    it('returns an array of enabled flag names', () => {
      const enabled = getEnabledFeatures();
      expect(Array.isArray(enabled)).toBe(true);
      expect(enabled).toContain('arena.multimodel');
      expect(enabled).toContain('bench.custom');
    });

    it('does not include disabled flags', () => {
      const enabled = getEnabledFeatures();
      // arena.collaboration is disabled without override
      expect(enabled).not.toContain('arena.collaboration');
    });

    it('supports user context filtering', () => {
      const enabled = getEnabledFeatures({
        id: 'dev@llmworks.dev',
        email: 'dev@llmworks.dev',
        groups: ['beta-testers'],
      });
      // experimental.voice targets dev@llmworks.dev specifically
      // but it's enabled: false, so it won't be in the list
      expect(Array.isArray(enabled)).toBe(true);
    });
  });

  // ─── useFeatureFlag ────────────────────────────────────────────────

  describe('useFeatureFlag', () => {
    it('returns a boolean', () => {
      const result = useFeatureFlag('arena.multimodel');
      expect(typeof result).toBe('boolean');
    });

    it('mirrors isFeatureFlagEnabled behavior', () => {
      expect(useFeatureFlag('arena.multimodel')).toBe(
        isFeatureFlagEnabled('arena.multimodel')
      );
    });
  });
});
