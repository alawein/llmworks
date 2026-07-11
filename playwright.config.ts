import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://127.0.0.1:4174';
const projects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
];

if (process.env.PLAYWRIGHT_INCLUDE_FIREFOX === 'true') {
  projects.push({
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  });
}

if (process.env.PLAYWRIGHT_INCLUDE_WEBKIT === 'true') {
  projects.push({
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  });
}

/**
 * LLMWorks E2E Test Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  globalSetup: './tests/e2e/global-setup.ts',
  globalTeardown: './tests/e2e/global-teardown.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
  projects,
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 300 * 1000,
  },
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
    },
  },
  snapshotDir: './tests/visual/__snapshots__',
  outputDir: 'test-results/',
});
