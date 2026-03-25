import { test, expect } from '@playwright/test';

const uiTimeout = 30_000;

test.describe('LLMWorks Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/LLM Works/i);
    await expect(page.getByRole('heading', { level: 1, name: /Architect Superior/i })).toBeVisible({
      timeout: uiTimeout,
    });
  });

  test('should expose the primary navigation', async ({ page }) => {
    await page.goto('/');
    const navigation = page.getByRole('navigation', { name: /main navigation/i });
    await expect(navigation).toBeVisible({ timeout: uiTimeout });
    await expect(navigation.getByRole('link', { name: /LLM Works Home/i })).toBeVisible({
      timeout: uiTimeout,
    });
    await expect(navigation.getByRole('link', { name: /^Arena$/i })).toBeVisible({
      timeout: uiTimeout,
    });
    await expect(navigation.getByRole('link', { name: /^Bench$/i })).toBeVisible({
      timeout: uiTimeout,
    });
    await expect(page.getByRole('link', { name: /^Dashboard$/i })).toBeVisible({
      timeout: uiTimeout,
    });
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/');
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('button', { name: /toggle mobile menu/i })).toBeVisible({
      timeout: uiTimeout,
    });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible({
      timeout: uiTimeout,
    });
  });
});
