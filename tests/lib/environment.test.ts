/**
 * Tests for src/lib/environment.ts
 *
 * The module reads import.meta.env at module scope, making isolated testing
 * tricky. We test the exported functions using their current behavior
 * (defaulting to development when VITE_ENVIRONMENT is not set).
 *
 * Covers: getConfig, getConfigValue, isFeatureEnabled, getEnvironment,
 * isProduction, isDevelopment, isStaging, updateConfig, resetConfig.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

import {
  getConfig,
  getConfigValue,
  isFeatureEnabled,
  getEnvironment,
  isProduction,
  isDevelopment,
  isStaging,
  updateConfig,
  resetConfig,
} from '@/lib/environment';

describe('Environment', () => {
  beforeEach(() => {
    resetConfig();
  });

  // ─── getConfig ─────────────────────────────────────────────────────

  describe('getConfig', () => {
    it('returns a configuration object with expected top-level keys', () => {
      const config = getConfig();
      expect(config).toHaveProperty('environment');
      expect(config).toHaveProperty('apiUrl');
      expect(config).toHaveProperty('features');
      expect(config).toHaveProperty('security');
      expect(config).toHaveProperty('performance');
      expect(config).toHaveProperty('monitoring');
      expect(config).toHaveProperty('api');
      expect(config).toHaveProperty('ui');
    });

    it('has features as an object with boolean values', () => {
      const { features } = getConfig();
      expect(typeof features.analytics).toBe('boolean');
      expect(typeof features.debugMode).toBe('boolean');
      expect(typeof features.serviceWorker).toBe('boolean');
    });
  });

  // ─── getConfigValue ────────────────────────────────────────────────

  describe('getConfigValue', () => {
    it('returns the features section', () => {
      const features = getConfigValue('features');
      expect(features).toHaveProperty('analytics');
      expect(features).toHaveProperty('debugMode');
    });

    it('returns the api section with timeout settings', () => {
      const api = getConfigValue('api');
      expect(typeof api.timeout).toBe('number');
      expect(typeof api.retryAttempts).toBe('number');
    });
  });

  // ─── isFeatureEnabled ──────────────────────────────────────────────

  describe('isFeatureEnabled', () => {
    it('returns a boolean for each known feature', () => {
      expect(typeof isFeatureEnabled('analytics')).toBe('boolean');
      expect(typeof isFeatureEnabled('debugMode')).toBe('boolean');
      expect(typeof isFeatureEnabled('serviceWorker')).toBe('boolean');
    });
  });

  // ─── getEnvironment ────────────────────────────────────────────────

  describe('getEnvironment', () => {
    it('returns a string matching one of the valid environments', () => {
      const env = getEnvironment();
      expect(['development', 'staging', 'production']).toContain(env);
    });
  });

  // ─── isProduction / isDevelopment / isStaging ─────────────────────

  describe('environment checks', () => {
    it('at most one of isProduction/isDevelopment/isStaging is true', () => {
      const flags = [isProduction(), isDevelopment(), isStaging()];
      const trueCount = flags.filter(Boolean).length;
      expect(trueCount).toBeLessThanOrEqual(1);
    });

    it('isProduction returns false in test environment', () => {
      // In vitest, MODE is typically not "production"
      expect(isProduction()).toBe(false);
    });
  });

  // ─── updateConfig ──────────────────────────────────────────────────

  describe('updateConfig', () => {
    it('merges partial config updates in development mode', () => {
      // This test only works when isDevelopment() is true
      if (!isDevelopment()) return;

      const originalApiUrl = getConfig().apiUrl;
      updateConfig({ apiUrl: 'http://custom-api:3001' });
      expect(getConfig().apiUrl).toBe('http://custom-api:3001');

      // Reset
      updateConfig({ apiUrl: originalApiUrl });
    });
  });

  // ─── resetConfig ───────────────────────────────────────────────────

  describe('resetConfig', () => {
    it('restores configuration to defaults', () => {
      if (!isDevelopment()) return;

      const originalUrl = getConfig().apiUrl;
      updateConfig({ apiUrl: 'http://overridden:9999' });
      expect(getConfig().apiUrl).toBe('http://overridden:9999');

      resetConfig();
      expect(getConfig().apiUrl).toBe(originalUrl);
    });
  });

  // ─── Development config defaults ──────────────────────────────────

  describe('development config defaults', () => {
    it('development has debugMode enabled', () => {
      // If we're running as development, debugMode should be true
      if (getEnvironment() === 'development') {
        expect(isFeatureEnabled('debugMode')).toBe(true);
      }
    });

    it('development has betaFeatures enabled', () => {
      if (getEnvironment() === 'development') {
        expect(isFeatureEnabled('betaFeatures')).toBe(true);
      }
    });

    it('development has rateLimiting disabled', () => {
      if (getEnvironment() === 'development') {
        expect(getConfig().security.rateLimiting).toBe(false);
      }
    });

    it('development has api timeout of 30000ms', () => {
      if (getEnvironment() === 'development') {
        expect(getConfig().api.timeout).toBe(30000);
      }
    });
  });
});
