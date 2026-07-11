import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const waitForAppShell = async (page: Page) => {
  await page.locator('#main, main').first().waitFor({ state: 'visible' });
};

test.describe('Accessibility', () => {
  test('should keep the primary navigation axe-clean on routed pages', async ({ page }) => {
    const pages = ['/', '/arena', '/bench', '/dashboard', '/settings'];

    for (const path of pages) {
      await page.goto(path);
      await waitForAppShell(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('nav[aria-label="Main navigation"]')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });

  test('should keep routed content free of critical axe violations', async ({ page }) => {
    const pages = ['/', '/arena', '/bench', '/dashboard', '/settings'];

    for (const path of pages) {
      await page.goto(path);
      await waitForAppShell(page);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#main')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .disableRules(['color-contrast'])
        .analyze();
      const criticalViolations = accessibilityScanResults.violations.filter(
        (violation) => violation.impact === 'critical'
      );

      expect(
        criticalViolations.map((violation) => ({
          id: violation.id,
          targets: violation.nodes.map((node) => node.target.join(' ')),
        }))
      ).toEqual([]);
    }
  });

  test('should not expose benchmark display rows as controls', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    const modelRankings = page.locator('ul[aria-label="Model rankings"]');
    await expect(modelRankings).toBeVisible();
    await expect(modelRankings.getByRole('button')).toHaveCount(0);

    const evaluationMetrics = page.locator('ul[aria-label="Evaluation metrics"]');
    await expect(evaluationMetrics).toBeVisible();
    await expect(evaluationMetrics.getByRole('button')).toHaveCount(0);
  });

  test('should expose expanded state on dashboard toggles', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    const intelligenceToggle = page.getByRole('button', {
      name: /expand sample intelligence dashboard/i,
    });
    await intelligenceToggle.scrollIntoViewIfNeeded();
    await expect(intelligenceToggle).toHaveAttribute('aria-expanded', 'false');

    await intelligenceToggle.click();
    await expect(
      page.getByRole('button', { name: /collapse sample intelligence dashboard/i })
    ).toHaveAttribute('aria-expanded', 'true');

    const specsToggle = page.getByRole('button', {
      name: /expand technical specifications/i,
    });
    await specsToggle.scrollIntoViewIfNeeded();
    await expect(specsToggle).toHaveAttribute('aria-expanded', 'false');
  });

  test('should copy displayed API endpoint paths', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            (window as Window & { __copiedText?: string }).__copiedText = text;
          },
        },
      });
    });

    await page.goto('/');
    await waitForAppShell(page);

    await page
      .getByRole('heading', { name: 'Technical Specifications', exact: true })
      .scrollIntoViewIfNeeded();
    await page.getByRole('tab', { name: /^api$/i }).click();
    await page
      .getByRole('button', { name: /copy supabase\.functions\.invoke\("benchmarks"\) endpoint/i })
      .click();

    await expect
      .poll(() =>
        page.evaluate(() => (window as Window & { __copiedText?: string }).__copiedText)
      )
      .toBe('supabase.functions.invoke("benchmarks")');
  });

  test('should include visible demo toggle labels in accessible names', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    await expect(
      page.getByRole('button', { name: /auto mode: switch showcase demo to manual mode/i })
    ).toBeVisible();
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    // Tab through elements
    const focusableElements = [];
    let previousElement = null;

    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const currentElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el
          ? {
              tagName: el.tagName,
              role: el.getAttribute('role'),
              ariaLabel: el.getAttribute('aria-label'),
              text: el.textContent?.trim().substring(0, 50),
            }
          : null;
      });

      if (currentElement && currentElement !== previousElement) {
        focusableElements.push(currentElement);
        previousElement = currentElement;
      }
    }

    // Should have focusable elements
    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('should support screen reader navigation', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    // Check for proper heading hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for landmarks
    const main = page.locator('main');
    await expect(main).toBeVisible();

    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('should have accessible forms', async ({ page }) => {
    await page.goto('/settings');
    await waitForAppShell(page);

    // Check that all inputs have labels
    const inputs = await page.locator('input:not([type="hidden"])').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');

      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = (await label.count()) > 0;

        expect(hasLabel || ariaLabel || ariaLabelledby).toBeTruthy();
      } else {
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      }
    }
  });

  test('should support keyboard-only navigation', async ({ page }) => {
    await page.goto('/arena');
    await waitForAppShell(page);

    // Should be able to navigate without mouse
    await page.keyboard.press('Tab');

    // Check that actions can be performed
    const activeElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A', 'INPUT', 'SELECT']).toContain(activeElement);
  });

  test('should handle high contrast mode', async ({ page, contextOptions }) => {
    await page.goto('/');
    await waitForAppShell(page);

    // In forced colors mode, check that content is still visible
    if (contextOptions.forcedColors === 'active') {
      // Key content should still be visible
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('should respect reduced motion preferences', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    // Check that animations are disabled or reduced
    const hasReducedMotion = await page.evaluate(
      () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    if (hasReducedMotion) {
      // Verify that animations are disabled
      const animatedElements = await page.locator('[class*="animate"]').all();

      for (const element of animatedElements) {
        const animationDuration = await element.evaluate(
          (el) => window.getComputedStyle(el).animationDuration
        );
        // Should be 0 or very short for reduced motion
        expect(parseFloat(animationDuration)).toBeLessThanOrEqual(0.1);
      }
    }
  });

  test('should expose accessible primary navigation controls', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    const navigation = page.getByRole('navigation', { name: /main navigation/i });

    await expect(navigation.getByRole('link', { name: /LLM Works Home/i })).toBeVisible();
    await expect(navigation.getByRole('link', { name: /^Platform$/i })).toBeVisible();
    await expect(navigation.getByRole('link', { name: /^Arena$/i })).toBeVisible();
    await expect(navigation.getByRole('link', { name: /^Bench$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /^Dashboard$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /open accessibility toolbar/i })).toBeVisible();
  });

  test('should support accessibility toolbar features', async ({ page }) => {
    await page.goto('/');
    await waitForAppShell(page);

    // Open accessibility toolbar
    const accessibilityButton = page.locator(
      '[aria-label*="accessibility"], [title*="accessibility"]'
    );
    if (await accessibilityButton.isVisible()) {
      await accessibilityButton.click();

      const highContrastToggle = page.getByRole('switch', { name: /high contrast/i });
      if (await highContrastToggle.isVisible()) {
        await highContrastToggle.click();

        await expect
          .poll(() =>
            page.evaluate(() => document.documentElement.classList.contains('a11y-high-contrast'))
          )
          .toBe(true);
      }

      const largeTextToggle = page.getByRole('switch', { name: /large text/i });
      if (await largeTextToggle.isVisible()) {
        await largeTextToggle.click();

        await expect
          .poll(() =>
            page.evaluate(() => document.documentElement.classList.contains('a11y-large-text'))
          )
          .toBe(true);
      }
    }
  });
});
