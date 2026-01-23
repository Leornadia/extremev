import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Playwright tests
 * This runs once before all tests
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;

  console.log('Starting global setup...');

  // Launch browser to verify the app is running
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the app to be ready
    console.log(`Checking if app is ready at ${baseURL}...`);
    await page.goto(baseURL || 'http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    console.log('App is ready!');
  } catch (error) {
    console.error('Failed to connect to the app:', error);
    throw error;
  } finally {
    await browser.close();
  }

  console.log('Global setup complete!');
}

export default globalSetup;
