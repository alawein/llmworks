import { test, expect, type Page } from '@playwright/test';

const visualThemeSettings = {
  colorScheme: 'tactical',
  intensity: 75,
  glassMorphism: 60,
  animations: false,
  particleEffects: false,
  dynamicBackground: false,
  soundEffects: false,
  accessibility: {
    reducedMotion: true,
    highContrast: false,
    largeText: false,
  },
};

async function prepareHomepage(page: Page) {
  await page.addInitScript((themeSettings) => {
    window.localStorage.setItem('themeSettings', JSON.stringify(themeSettings));
  }, visualThemeSettings);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole('heading', { level: 1, name: /Architect Superior/i })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole('region', { name: /strategic analytics/i })).toBeVisible({
    timeout: 30_000,
  });

  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }

      button[aria-label="Open theme customizer"],
      button[aria-label="Dismiss achievement"],
      .fixed.top-20.right-4,
      .fixed.bottom-20.right-4,
      .fixed.bottom-4.left-4,
      .fixed.bottom-4.right-4 {
        visibility: hidden !important;
      }
    `,
  });

  await page.waitForTimeout(300);
}

/**
 * Visual regression is intentionally Chromium-only.
 * Cross-engine rendering differences were generating noisy baselines while
 * functional coverage already runs across Chromium, Firefox, and WebKit.
 */
test.describe('Visual Regression Tests', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual baselines are Chromium-only.');

  test('homepage visual snapshot', async ({ page }) => {
    await prepareHomepage(page);

    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixelRatio: 0.05,
      timeout: 15_000,
    });
  });

  test('strategic analytics panel visual snapshot', async ({ page }) => {
    await prepareHomepage(page);

    await expect(page.getByRole('region', { name: /strategic analytics/i })).toHaveScreenshot(
      'strategic-analytics-panel.png',
      {
        maxDiffPixelRatio: 0.05,
      }
    );
  });

  test('responsive mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await prepareHomepage(page);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      maxDiffPixelRatio: 0.05,
    });
  });
});
