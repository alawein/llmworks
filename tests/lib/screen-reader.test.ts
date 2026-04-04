/**
 * Tests for src/lib/screen-reader.ts
 *
 * Covers: detectScreenReader, announceStatus, announceError,
 * announceNavigation, announceFormValidation, announceLoading,
 * announceModal, announceTableChange, announceSelection, announceProgress,
 * manageFocus, screenReaderFeatures.
 */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  detectScreenReader,
  announceToScreenReader,
  announceStatus,
  announceError,
  announceNavigation,
  announceFormValidation,
  announceLoading,
  announceModal,
  announceTableChange,
  announceSelection,
  announceProgress,
  manageFocus,
  screenReaderFeatures,
} from '@/lib/screen-reader';

describe('Screen Reader utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  // ─── detectScreenReader ────────────────────────────────────────────

  describe('detectScreenReader', () => {
    it('returns null when no screen reader is detected', () => {
      // Default jsdom user agent does not match any screen reader
      expect(detectScreenReader()).toBeNull();
    });
  });

  // ─── announceToScreenReader ────────────────────────────────────────

  describe('announceToScreenReader', () => {
    it('creates an aria-live element in the DOM', () => {
      announceToScreenReader('Hello screen reader');
      vi.advanceTimersByTime(200);

      const announcer = document.querySelector('[aria-live]');
      expect(announcer).not.toBeNull();
    });

    it('sets textContent after a small delay', () => {
      announceToScreenReader('Test message', 'polite', 50);
      vi.advanceTimersByTime(50);

      const announcer = document.querySelector('[aria-live="polite"]');
      expect(announcer?.textContent).toBe('Test message');
    });

    it('removes the element after the announcement timeout', () => {
      announceToScreenReader('Temporary', 'polite', 0);
      vi.advanceTimersByTime(0); // Set textContent
      vi.advanceTimersByTime(1000); // Polite removal timeout

      const announcer = document.querySelector('[aria-live="polite"]');
      expect(announcer).toBeNull();
    });

    it('uses assertive priority when specified', () => {
      announceToScreenReader('Urgent!', 'assertive', 0);
      vi.advanceTimersByTime(0);

      const announcer = document.querySelector('[aria-live="assertive"]');
      expect(announcer).not.toBeNull();
    });

    it('does not announce empty messages', () => {
      announceToScreenReader('   ');
      vi.advanceTimersByTime(200);

      const announcer = document.querySelector('[aria-live]');
      expect(announcer).toBeNull();
    });
  });

  // ─── announceStatus ────────────────────────────────────────────────

  describe('announceStatus', () => {
    it('announces a status message', () => {
      announceStatus('Connected');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toBe('Connected');
    });

    it('includes context when provided', () => {
      announceStatus('Ready', 'Server');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toBe('Server: Ready');
    });
  });

  // ─── announceError ─────────────────────────────────────────────────

  describe('announceError', () => {
    it('announces error assertively', () => {
      announceError('Invalid input');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="assertive"]');
      expect(el?.textContent).toBe('Error: Invalid input');
    });

    it('includes field name when provided', () => {
      announceError('Required', 'Email');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="assertive"]');
      expect(el?.textContent).toBe('Error in Email: Required');
    });
  });

  // ─── announceNavigation ────────────────────────────────────────────

  describe('announceNavigation', () => {
    it('announces page navigation', () => {
      announceNavigation('Dashboard');
      vi.advanceTimersByTime(600);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toBe('Navigated to Dashboard');
    });

    it('includes breadcrumb path when provided', () => {
      announceNavigation('Settings', ['Home', 'Account', 'Settings']);
      vi.advanceTimersByTime(600);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('Home > Account > Settings');
    });
  });

  // ─── announceFormValidation ────────────────────────────────────────

  describe('announceFormValidation', () => {
    it('announces valid form', () => {
      announceFormValidation(true);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live]');
      expect(el?.textContent).toContain('valid and ready to submit');
    });

    it('announces single error', () => {
      announceFormValidation(false, ['Name is required']);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="assertive"]');
      expect(el?.textContent).toContain('1 error found');
    });

    it('announces multiple errors', () => {
      announceFormValidation(false, ['Name is required', 'Email is invalid']);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="assertive"]');
      expect(el?.textContent).toContain('2 errors found');
    });
  });

  // ─── announceLoading ───────────────────────────────────────────────

  describe('announceLoading', () => {
    it('announces loading state', () => {
      announceLoading(true);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('Loading');
    });

    it('announces finished loading', () => {
      announceLoading(false);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('Finished loading');
    });

    it('includes context when provided', () => {
      announceLoading(true, 'Results');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toBe('Results Loading...');
    });
  });

  // ─── announceModal ─────────────────────────────────────────────────

  describe('announceModal', () => {
    it('announces modal opened', () => {
      announceModal(true, 'Confirm Delete');
      vi.advanceTimersByTime(300);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('Confirm Delete dialog opened');
      expect(el?.textContent).toContain('Press Escape to close');
    });

    it('announces modal closed', () => {
      announceModal(false, 'Settings');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('Settings dialog closed');
    });

    it('includes description when opening', () => {
      announceModal(true, 'Warning', 'This action cannot be undone');
      vi.advanceTimersByTime(300);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('This action cannot be undone');
    });
  });

  // ─── announceTableChange ───────────────────────────────────────────

  describe('announceTableChange', () => {
    it('announces sorted table', () => {
      announceTableChange('sorted', 'Name', 'ascending');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('sorted by Name in ascending order');
    });

    it('announces filtered table with row count', () => {
      announceTableChange('filtered', undefined, undefined, 42);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('Showing 42 results');
    });

    it('announces updated table', () => {
      announceTableChange('updated', undefined, undefined, 10);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('10 rows displayed');
    });
  });

  // ─── announceSelection ─────────────────────────────────────────────

  describe('announceSelection', () => {
    it('announces no selection', () => {
      announceSelection(0, 10);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('No items selected');
    });

    it('announces all selected', () => {
      announceSelection(5, 5);
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('All 5 items selected');
    });

    it('announces partial selection', () => {
      announceSelection(3, 10, 'rows');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toContain('3 of 10 rows selected');
    });
  });

  // ─── announceProgress ──────────────────────────────────────────────

  describe('announceProgress', () => {
    it('announces progress at 25% milestones', () => {
      announceProgress(25, 'Upload');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toBe('Upload: 25% complete');
    });

    it('announces 100% completion', () => {
      announceProgress(100, 'Download');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live="polite"]');
      expect(el?.textContent).toBe('Download: 100% complete');
    });

    it('does not announce non-milestone percentages', () => {
      announceProgress(33, 'Process');
      vi.advanceTimersByTime(200);

      const el = document.querySelector('[aria-live]');
      expect(el).toBeNull();
    });
  });

  // ─── manageFocus ───────────────────────────────────────────────────

  describe('manageFocus', () => {
    describe('save / restore', () => {
      it('saves the currently active element', () => {
        const btn = document.createElement('button');
        document.body.appendChild(btn);
        btn.focus();

        const saved = manageFocus.save();
        expect(saved).toBe(btn);
      });

      it('restores focus to the saved element', () => {
        const btn = document.createElement('button');
        document.body.appendChild(btn);
        btn.focus();

        const saved = manageFocus.save();

        // Move focus away
        const input = document.createElement('input');
        document.body.appendChild(input);
        input.focus();

        manageFocus.restore(saved);
        expect(document.activeElement).toBe(btn);
      });

      it('handles null gracefully', () => {
        expect(() => manageFocus.restore(null)).not.toThrow();
      });
    });

    describe('focusFirst / focusLast', () => {
      it('focuses the first focusable element', () => {
        const container = document.createElement('div');
        const btn1 = document.createElement('button');
        btn1.textContent = 'First';
        const btn2 = document.createElement('button');
        btn2.textContent = 'Second';
        container.appendChild(btn1);
        container.appendChild(btn2);
        document.body.appendChild(container);

        const result = manageFocus.focusFirst(container);
        expect(result).toBe(true);
        expect(document.activeElement).toBe(btn1);
      });

      it('focuses the last focusable element', () => {
        const container = document.createElement('div');
        const btn1 = document.createElement('button');
        const btn2 = document.createElement('button');
        container.appendChild(btn1);
        container.appendChild(btn2);
        document.body.appendChild(container);

        const result = manageFocus.focusLast(container);
        expect(result).toBe(true);
        expect(document.activeElement).toBe(btn2);
      });

      it('returns false when no focusable elements exist', () => {
        const container = document.createElement('div');
        container.innerHTML = '<span>No buttons</span>';
        document.body.appendChild(container);

        expect(manageFocus.focusFirst(container)).toBe(false);
        expect(manageFocus.focusLast(container)).toBe(false);
      });
    });

    describe('trapFocus', () => {
      it('returns a cleanup function', () => {
        const container = document.createElement('div');
        const btn = document.createElement('button');
        container.appendChild(btn);
        document.body.appendChild(container);

        const cleanup = manageFocus.trapFocus(container);
        expect(typeof cleanup).toBe('function');
        cleanup();
      });
    });
  });

  // ─── screenReaderFeatures ──────────────────────────────────────────

  describe('screenReaderFeatures', () => {
    it('supportsSpeech returns a boolean', () => {
      expect(typeof screenReaderFeatures.supportsSpeech()).toBe('boolean');
    });

    it('prefersReducedMotion returns a boolean', () => {
      expect(typeof screenReaderFeatures.prefersReducedMotion()).toBe('boolean');
    });

    it('isHighContrastMode returns a boolean', () => {
      expect(typeof screenReaderFeatures.isHighContrastMode()).toBe('boolean');
    });

    it('isActive returns a boolean', () => {
      expect(typeof screenReaderFeatures.isActive()).toBe('boolean');
    });
  });
});
