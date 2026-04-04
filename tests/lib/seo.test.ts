/**
 * Tests for src/lib/seo.ts
 *
 * Covers: setSEO (title, description, keywords, ogImage, canonical URL)
 * and injectJsonLd.
 */

// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';

import { setSEO, injectJsonLd } from '@/lib/seo';

describe('SEO utilities', () => {
  beforeEach(() => {
    // Reset head to a clean state
    document.head.innerHTML = '';
    document.title = '';
  });

  // ─── setSEO ────────────────────────────────────────────────────────

  describe('setSEO', () => {
    it('sets document.title', () => {
      setSEO({ title: 'My Page' });
      expect(document.title).toBe('My Page');
    });

    it('sets og:title and twitter:title meta tags', () => {
      setSEO({ title: 'OG Title' });

      const ogTitle = document.querySelector('meta[property="og:title"]');
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      expect(ogTitle?.getAttribute('content')).toBe('OG Title');
      expect(twitterTitle?.getAttribute('content')).toBe('OG Title');
    });

    it('sets meta description', () => {
      setSEO({ title: 'Page', description: 'A test description' });

      const meta = document.querySelector('meta[name="description"]');
      expect(meta?.getAttribute('content')).toBe('A test description');
    });

    it('sets og:description and twitter:description', () => {
      setSEO({ title: 'Page', description: 'Desc text' });

      const ogDesc = document.querySelector('meta[property="og:description"]');
      const twDesc = document.querySelector('meta[property="twitter:description"]');
      expect(ogDesc?.getAttribute('content')).toBe('Desc text');
      expect(twDesc?.getAttribute('content')).toBe('Desc text');
    });

    it('sets keywords meta tag', () => {
      setSEO({ title: 'Page', keywords: 'llm, evaluation, security' });

      const meta = document.querySelector('meta[name="keywords"]');
      expect(meta?.getAttribute('content')).toBe('llm, evaluation, security');
    });

    it('sets og:image and twitter:image', () => {
      setSEO({ title: 'Page', ogImage: '/img/hero.png' });

      const ogImg = document.querySelector('meta[property="og:image"]');
      const twImg = document.querySelector('meta[property="twitter:image"]');
      expect(ogImg?.getAttribute('content')).toBe('/img/hero.png');
      expect(twImg?.getAttribute('content')).toBe('/img/hero.png');
    });

    it('creates canonical link element', () => {
      setSEO({ title: 'Page', path: '/about' });

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).not.toBeNull();
      expect(canonical?.getAttribute('href')).toContain('/about');
    });

    it('updates og:url and twitter:url', () => {
      setSEO({ title: 'Page', path: '/docs' });

      const ogUrl = document.querySelector('meta[property="og:url"]');
      const twUrl = document.querySelector('meta[property="twitter:url"]');
      expect(ogUrl?.getAttribute('content')).toContain('/docs');
      expect(twUrl?.getAttribute('content')).toContain('/docs');
    });

    it('updates existing meta tags instead of creating duplicates', () => {
      setSEO({ title: 'First', description: 'Initial' });
      setSEO({ title: 'Second', description: 'Updated' });

      const descriptions = document.querySelectorAll('meta[name="description"]');
      expect(descriptions.length).toBe(1);
      expect(descriptions[0].getAttribute('content')).toBe('Updated');
    });

    it('uses current pathname when path is not provided', () => {
      setSEO({ title: 'No Path' });

      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical?.getAttribute('href')).toContain(window.location.pathname);
    });
  });

  // ─── injectJsonLd ──────────────────────────────────────────────────

  describe('injectJsonLd', () => {
    it('creates a script element with type application/ld+json', () => {
      injectJsonLd({ '@type': 'WebSite', name: 'LLMWorks' });

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
    });

    it('serializes the data object as JSON', () => {
      const data = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Test' };
      injectJsonLd(data);

      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script?.textContent).toBe(JSON.stringify(data));
    });

    it('uses default id when none is provided', () => {
      injectJsonLd({ name: 'default' });

      const script = document.getElementById('page-structured-data');
      expect(script).not.toBeNull();
    });

    it('uses custom id when provided', () => {
      injectJsonLd({ name: 'custom' }, 'custom-ld');

      const script = document.getElementById('custom-ld');
      expect(script).not.toBeNull();
    });

    it('updates existing script element instead of creating duplicates', () => {
      injectJsonLd({ name: 'first' }, 'update-test');
      injectJsonLd({ name: 'second' }, 'update-test');

      const scripts = document.querySelectorAll('#update-test');
      expect(scripts.length).toBe(1);

      const parsed = JSON.parse(scripts[0].textContent || '');
      expect(parsed.name).toBe('second');
    });
  });
});
