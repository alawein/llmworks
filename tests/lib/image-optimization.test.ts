/**
 * Tests for src/lib/image-optimization.ts
 *
 * Covers: generateSrcSet, createLazyImage, preloadImage.
 * Heavy browser-dependent functions (convertToWebP, compressImage) are
 * not tested because they require real Canvas 2D contexts.
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  generateSrcSet,
  createLazyImage,
  preloadImage,
} from '@/lib/image-optimization';

describe('Image Optimization', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ─── generateSrcSet ────────────────────────────────────────────────

  describe('generateSrcSet', () => {
    it('generates a srcset string with default sizes', () => {
      const srcset = generateSrcSet('/images/hero.jpg');
      expect(srcset).toContain('480w');
      expect(srcset).toContain('768w');
      expect(srcset).toContain('1024w');
      expect(srcset).toContain('1280w');
      expect(srcset).toContain('1920w');
    });

    it('uses custom sizes when provided', () => {
      const srcset = generateSrcSet('/images/thumb.png', [200, 400]);
      expect(srcset).toContain('200w');
      expect(srcset).toContain('400w');
      expect(srcset).not.toContain('1920w');
    });

    it('preserves the file extension in each entry', () => {
      const srcset = generateSrcSet('/img/photo.webp', [320]);
      expect(srcset).toContain('.webp');
    });

    it('inserts width before the extension', () => {
      const srcset = generateSrcSet('/img/bg.jpg', [640]);
      expect(srcset).toBe('/img/bg-640w.jpg 640w');
    });

    it('returns comma-separated entries for multiple sizes', () => {
      const srcset = generateSrcSet('/img/pic.jpg', [100, 200]);
      const parts = srcset.split(', ');
      expect(parts).toHaveLength(2);
    });
  });

  // ─── createLazyImage ───────────────────────────────────────────────

  describe('createLazyImage', () => {
    it('returns an HTMLImageElement', () => {
      const img = createLazyImage({
        src: '/img/photo.jpg',
        alt: 'Test photo',
      });
      expect(img).toBeInstanceOf(HTMLImageElement);
    });

    it('sets alt attribute', () => {
      const img = createLazyImage({
        src: '/img/photo.jpg',
        alt: 'A scenic view',
      });
      expect(img.alt).toBe('A scenic view');
    });

    it('sets loading attribute', () => {
      const img = createLazyImage({
        src: '/img/photo.jpg',
        alt: 'Test',
        loading: 'eager',
      });
      expect(img.loading).toBe('eager');
    });

    it('sets className when provided', () => {
      const img = createLazyImage({
        src: '/img/photo.jpg',
        alt: 'Test',
        className: 'rounded shadow',
      });
      expect(img.className).toBe('rounded shadow');
    });

    it('sets placeholder as initial src for lazy images', () => {
      const img = createLazyImage({
        src: '/img/real.jpg',
        alt: 'Test',
        placeholder: '/img/placeholder.svg',
      });
      // With IntersectionObserver mocked in setup.ts, src should be placeholder
      expect(img.src).toContain('placeholder.svg');
    });

    it('falls back to src directly when loading is eager', () => {
      const img = createLazyImage({
        src: '/img/real.jpg',
        alt: 'Test',
        loading: 'eager',
      });
      expect(img.src).toContain('real.jpg');
    });
  });

  // ─── preloadImage ──────────────────────────────────────────────────

  describe('preloadImage', () => {
    it('resolves when image loads successfully', async () => {
      // Mock Image constructor to auto-trigger onload
      const originalImage = globalThis.Image;
      globalThis.Image = class MockImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        private _src = '';

        get src() {
          return this._src;
        }
        set src(value: string) {
          this._src = value;
          // Simulate successful load
          setTimeout(() => this.onload?.(), 0);
        }
      } as any;

      await expect(preloadImage('/img/test.jpg')).resolves.toBeUndefined();

      globalThis.Image = originalImage;
    });

    it('rejects when image fails to load', async () => {
      const originalImage = globalThis.Image;
      globalThis.Image = class MockImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        private _src = '';

        get src() {
          return this._src;
        }
        set src(value: string) {
          this._src = value;
          // Simulate error
          setTimeout(() => this.onerror?.(), 0);
        }
      } as any;

      await expect(preloadImage('/img/missing.jpg')).rejects.toThrow(
        'Failed to preload image'
      );

      globalThis.Image = originalImage;
    });
  });
});
