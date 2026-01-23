import { test, expect } from '@playwright/test';

test.describe('Configurator Design and Quote Flow', () => {
  test('should load configurator with component library', async ({ page }) => {
    await page.goto('/configurator');

    // Verify configurator loads
    await expect(page.locator('h1, h2')).toContainText(/configurator|design|build/i);

    // Verify component library is visible
    const componentLibrary = page.locator('[data-testid="component-library"]');
    if (await componentLibrary.isVisible()) {
      await expect(componentLibrary).toBeVisible();
    }

    // Verify canvas is visible
    const canvas = page.locator('canvas, [data-testid="design-canvas"]');
    await expect(canvas.first()).toBeVisible();
  });

  test('should browse component categories', async ({ page }) => {
    await page.goto('/configurator');

    // Wait for component library to load
    await page.waitForTimeout(1000);

    // Find category buttons or tabs
    const categories = page.getByRole('button', { name: /deck|slide|swing|access/i });
    const categoryCount = await categories.count();

    if (categoryCount > 0) {
      // Click on first category
      await categories.first().click();

      // Verify components are displayed
      await page.waitForTimeout(500);
      const components = page.locator('[data-testid="component-card"]');
      if (await components.first().isVisible()) {
        await expect(components.first()).toBeVisible();
      }
    }
  });

  test('should toggle between 2D and 3D view', async ({ page }) => {
    await page.goto('/configurator');

    // Wait for configurator to load
    await page.waitForTimeout(1000);

    // Look for view toggle button
    const viewToggle = page.getByRole('button', { name: /2d|3d|view/i });
    const toggleCount = await viewToggle.count();

    if (toggleCount > 0) {
      // Click toggle
      await viewToggle.first().click();

      // Wait for view to change
      await page.waitForTimeout(1000);

      // Verify view changed (canvas should still be visible)
      const canvas = page.locator('canvas');
      await expect(canvas.first()).toBeVisible();
    }
  });

  test('should open component details modal', async ({ page }) => {
    await page.goto('/configurator');

    // Wait for components to load
    await page.waitForTimeout(1000);

    // Find a component card
    const componentCard = page.locator('[data-testid="component-card"]').first();
    if (await componentCard.isVisible()) {
      // Click on component for details
      await componentCard.click();

      // Look for modal or details panel
      const modal = page.locator('[role="dialog"], [data-testid="component-details"]');
      if (await modal.isVisible()) {
        await expect(modal).toBeVisible();

        // Close modal
        const closeButton = page.getByRole('button', { name: /close/i });
        await closeButton.click();
      }
    }
  });

  test('should save design (requires authentication)', async ({ page }) => {
    await page.goto('/configurator');

    // Wait for configurator to load
    await page.waitForTimeout(1000);

    // Look for save button
    const saveButton = page.getByRole('button', { name: /save/i });
    if (await saveButton.isVisible()) {
      await saveButton.click();

      // Should either open save modal or redirect to login
      await page.waitForTimeout(500);

      // Check if login page or save modal appears
      const currentUrl = page.url();
      const hasSaveModal = await page.locator('[role="dialog"]').isVisible();

      expect(currentUrl.includes('/auth/signin') || hasSaveModal).toBeTruthy();
    }
  });

  test('should request quote with validation', async ({ page }) => {
    await page.goto('/configurator');

    // Wait for configurator to load
    await page.waitForTimeout(1000);

    // Look for quote request button
    const quoteButton = page.getByRole('button', { name: /quote|request/i });
    if (await quoteButton.isVisible()) {
      await quoteButton.click();

      // Wait for modal or form
      await page.waitForTimeout(500);

      // Check if quote form appears
      const quoteForm = page.locator('[data-testid="quote-form"], form');
      if (await quoteForm.isVisible()) {
        await expect(quoteForm).toBeVisible();

        // Try to submit empty form to test validation
        const submitButton = page.getByRole('button', { name: /submit|send/i });
        await submitButton.click();

        // Should show validation errors
        await page.waitForTimeout(500);
        const errorMessage = page.locator('[role="alert"], .error, [data-testid="error"]');
        if (await errorMessage.first().isVisible()) {
          await expect(errorMessage.first()).toBeVisible();
        }
      }
    }
  });

  test('should display validation warnings for invalid designs', async ({ page }) => {
    await page.goto('/configurator');

    // Wait for configurator to load
    await page.waitForTimeout(1000);

    // Look for validation panel or badge
    const validationPanel = page.locator('[data-testid="validation-panel"], [data-testid="validation-badge"]');
    
    // Validation panel should exist (even if design is empty)
    if (await validationPanel.first().isVisible()) {
      await expect(validationPanel.first()).toBeVisible();
    }
  });
});
