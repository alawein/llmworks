import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Launch browser for setup tasks
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Warm up the application
    console.log('🔥 Warming up application...');
    await page.goto(process.env.BASE_URL || 'http://localhost:4173');

    // Wait for the app to be ready
    await page.waitForLoadState('networkidle');

    // Pre-cache critical resources if needed
    await page.evaluate(() => {
      // Trigger any critical resource loading
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js');
      }
    });

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;
