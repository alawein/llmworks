import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const baseURL =
    config.projects[0]?.use.baseURL ?? process.env.PLAYWRIGHT_TEST_BASE_URL ?? 'http://127.0.0.1:4174';

  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Warm up the application
    await page.goto(baseURL);

    // Wait for the app shell; ongoing background work can keep `networkidle` open.
    await page.getByRole('heading', { level: 1, name: /Architect Superior/i }).waitFor();
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
