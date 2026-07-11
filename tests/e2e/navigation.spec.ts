import { test, expect } from '@playwright/test';

const uiTimeout = 30_000;

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible({
      timeout: uiTimeout,
    });
  });

  test('should navigate to all main pages', async ({ page }) => {
    await expect(page).toHaveTitle(/LLM Works/);

    const navigationTargets = [
      { name: /^Arena$/i, path: /\/arena/, heading: /arena/i },
      { name: /^Bench$/i, path: /\/bench/, heading: /bench/i },
      { name: /^Dashboard$/i, path: /\/dashboard/, heading: /dashboard/i },
    ];

    for (const target of navigationTargets) {
      await page.goto('/');
      await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible({
        timeout: uiTimeout,
      });

      await page.getByRole('link', { name: target.name }).click();
      await expect(page).toHaveURL(target.path);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(target.heading);
    }

    await page.goto('/settings');
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { level: 1, name: /^Settings$/i })).toHaveCount(1);
    await expect(
      page.getByRole('heading', { level: 1, name: /Settings Control Center/i })
    ).toBeVisible();
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();

    // Should have a way to get back home
    await page.getByRole('link', { name: /return home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab through navigation elements
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON']).toContain(focused);
  });

  test('should work on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Mobile navigation might be different (hamburger menu)
      const menuButton = page.locator('[aria-label*="menu"], [aria-label*="Menu"]');
      if (await menuButton.isVisible()) {
        await menuButton.click();
      }
    }

    // Should still be able to navigate
    await page.getByRole('link', { name: /^Arena$/i }).click();
    await expect(page).toHaveURL(/\/arena/);
  });
});
