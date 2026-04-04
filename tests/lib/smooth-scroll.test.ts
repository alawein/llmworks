/**
 * Tests for src/lib/smooth-scroll.ts
 *
 * Covers: scrollToElement, initSmoothScroll.
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { scrollToElement, initSmoothScroll } from '@/lib/smooth-scroll';

describe('Smooth Scroll', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // ─── scrollToElement ───────────────────────────────────────────────

  describe('scrollToElement', () => {
    it('calls window.scrollTo when element exists', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      const el = document.createElement('div');
      el.id = 'target-section';
      document.body.appendChild(el);

      // Mock offsetTop
      Object.defineProperty(el, 'offsetTop', { value: 500, configurable: true });

      scrollToElement('target-section');

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth',
      });
    });

    it('applies offset when provided', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      const el = document.createElement('div');
      el.id = 'section2';
      document.body.appendChild(el);
      Object.defineProperty(el, 'offsetTop', { value: 800, configurable: true });

      scrollToElement('section2', 60);

      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 740, // 800 - 60
        behavior: 'smooth',
      });
    });

    it('does nothing when element does not exist', () => {
      const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      scrollToElement('nonexistent');

      expect(scrollToSpy).not.toHaveBeenCalled();
    });
  });

  // ─── initSmoothScroll ──────────────────────────────────────────────

  describe('initSmoothScroll', () => {
    it('registers a click event listener on document', () => {
      const addEventSpy = vi.spyOn(document, 'addEventListener');

      initSmoothScroll();

      expect(addEventSpy).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('scrolls to target when clicking anchor link with hash href', () => {
      initSmoothScroll();

      // Create a target element
      const target = document.createElement('div');
      target.id = 'features';
      document.body.appendChild(target);

      // Create an anchor link
      const link = document.createElement('a');
      link.setAttribute('href', '#features');
      document.body.appendChild(link);

      // Click the link
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(event);

      // scrollIntoView is mocked in setup.ts
      expect(target.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      });
    });

    it('does not interfere with non-hash links', () => {
      initSmoothScroll();

      const externalLink = document.createElement('a');
      externalLink.setAttribute('href', 'https://example.com');
      document.body.appendChild(externalLink);

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      externalLink.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('ignores anchor links with href="#"', () => {
      initSmoothScroll();

      const hashOnlyLink = document.createElement('a');
      hashOnlyLink.setAttribute('href', '#');
      document.body.appendChild(hashOnlyLink);

      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      hashOnlyLink.dispatchEvent(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
