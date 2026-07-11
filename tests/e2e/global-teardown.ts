import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
  try {
    // Clean up any global resources
    // This could include clearing test databases,
    // stopping test servers, cleaning up files, etc.

    // Example cleanup tasks:
    // - Close any persistent connections
    // - Clean up test data
    // - Generate final reports

    // Any final cleanup or reporting tasks
    process.env.TEST_COMPLETED = 'true';
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw error to avoid masking test failures
  }
}

export default globalTeardown;
