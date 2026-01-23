import { Page } from '@playwright/test';

/**
 * Helper function to wait for configurator to load
 */
export async function waitForConfiguratorLoad(page: Page) {
  await page.waitForTimeout(1000);
  
  // Wait for canvas to be visible
  const canvas = page.locator('canvas, [data-testid="design-canvas"]');
  await canvas.first().waitFor({ state: 'visible', timeout: 10000 });
}

/**
 * Helper function to select a component category
 */
export async function selectComponentCategory(page: Page, categoryName: string) {
  const categoryButton = page.getByRole('button', { name: new RegExp(categoryName, 'i') });
  if (await categoryButton.isVisible()) {
    await categoryButton.click();
    await page.waitForTimeout(500);
  }
}

/**
 * Helper function to add a component to the canvas
 */
export async function addComponentToCanvas(page: Page, componentIndex: number = 0) {
  const componentCard = page.locator('[data-testid="component-card"]').nth(componentIndex);
  if (await componentCard.isVisible()) {
    // Drag component to canvas
    const canvas = page.locator('canvas, [data-testid="design-canvas"]').first();
    await componentCard.dragTo(canvas);
    await page.waitForTimeout(500);
  }
}

/**
 * Helper function to toggle view mode
 */
export async function toggleViewMode(page: Page) {
  const viewToggle = page.getByRole('button', { name: /2d|3d|view/i });
  if (await viewToggle.first().isVisible()) {
    await viewToggle.first().click();
    await page.waitForTimeout(1000);
  }
}

/**
 * Helper function to save design
 */
export async function saveDesign(page: Page, designName: string) {
  const saveButton = page.getByRole('button', { name: /save/i });
  if (await saveButton.isVisible()) {
    await saveButton.click();
    await page.waitForTimeout(500);

    // Fill in design name if modal appears
    const nameInput = page.getByLabel(/name|title/i);
    if (await nameInput.isVisible()) {
      await nameInput.fill(designName);
      
      const confirmButton = page.getByRole('button', { name: /save|confirm/i });
      await confirmButton.click();
      await page.waitForTimeout(1000);
    }
  }
}

/**
 * Helper function to request a quote
 */
export async function requestQuote(
  page: Page,
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    postalCode: string;
  }
) {
  const quoteButton = page.getByRole('button', { name: /quote|request/i });
  if (await quoteButton.isVisible()) {
    await quoteButton.click();
    await page.waitForTimeout(500);

    // Fill in quote form
    const nameInput = page.getByLabel(/name/i);
    if (await nameInput.isVisible()) {
      await nameInput.fill(customerInfo.name);
    }

    const emailInput = page.getByLabel(/email/i);
    if (await emailInput.isVisible()) {
      await emailInput.fill(customerInfo.email);
    }

    const phoneInput = page.getByLabel(/phone/i);
    if (await phoneInput.isVisible()) {
      await phoneInput.fill(customerInfo.phone);
    }

    const cityInput = page.getByLabel(/city/i);
    if (await cityInput.isVisible()) {
      await cityInput.fill(customerInfo.city);
    }

    const stateInput = page.getByLabel(/state/i);
    if (await stateInput.isVisible()) {
      await stateInput.fill(customerInfo.state);
    }

    const postalInput = page.getByLabel(/postal|zip/i);
    if (await postalInput.isVisible()) {
      await postalInput.fill(customerInfo.postalCode);
    }

    // Submit quote request
    const submitButton = page.getByRole('button', { name: /submit|send|request/i });
    await submitButton.click();
    await page.waitForTimeout(2000);
  }
}
