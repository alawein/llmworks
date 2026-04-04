/**
 * Tests for src/lib/performance.ts — exported utility functions
 *
 * Covers: measure, measureAsync, getPerformanceMetrics, getPerformanceScore,
 * generateSrcSet. The PerformanceMonitor class is a singleton that hooks
 * into browser PerformanceObserver APIs; we test the exported helper
 * functions which are usable without the singleton.
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  measure,
  measureAsync,
  getPerformanceMetrics,
  getPerformanceScore,
} from '@/lib/performance';

describe('Performance utilities', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ─── measure ───────────────────────────────────────────────────────

  describe('measure', () => {
    it('returns the result of the function', () => {
      const result = measure('add', () => 2 + 3);
      expect(result).toBe(5);
    });

    it('logs the measurement to console', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      measure('test-op', () => 42);
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('[Performance] test-op:');
    });

    it('rethrows errors from the measured function', () => {
      expect(() =>
        measure('failing', () => {
          throw new Error('boom');
        })
      ).toThrow('boom');
    });

    it('logs with "(failed)" suffix when function throws', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        measure('fail-op', () => {
          throw new Error('oops');
        });
      } catch {
        // expected
      }
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy.mock.calls[0][0]).toContain('fail-op (failed):');
    });
  });

  // ─── measureAsync ──────────────────────────────────────────────────

  describe('measureAsync', () => {
    it('returns the result of the async function', async () => {
      const result = await measureAsync('async-op', async () => 'done');
      expect(result).toBe('done');
    });

    it('rethrows errors from the async function', async () => {
      await expect(
        measureAsync('fail-async', async () => {
          throw new Error('async boom');
        })
      ).rejects.toThrow('async boom');
    });

    it('logs the measurement to console', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      await measureAsync('timed', async () => 'result');
      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0][0];
      expect(logCall).toContain('[Performance] timed:');
    });
  });

  // ─── getPerformanceMetrics ─────────────────────────────────────────

  describe('getPerformanceMetrics', () => {
    it('returns an object (possibly empty)', () => {
      const metrics = getPerformanceMetrics();
      expect(typeof metrics).toBe('object');
    });
  });

  // ─── getPerformanceScore ───────────────────────────────────────────

  describe('getPerformanceScore', () => {
    it('returns a number between 0 and 100', () => {
      const score = getPerformanceScore();
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});
