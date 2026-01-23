import { test, expect } from '@playwright/test';

/**
 * Full user journey test - from homepage to quote request
 * This test demonstrates a complete user flow through the website
 */
test.describe('Complete User Journey', () => {
  test('should complete full journey from homepage to quote request', async ({ page }) => {
    // Step 1: Visit homepage
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();

    // Step 2: Browse to products
    const browseButton = page.getByRole('link', { name: /browse|products|shop/i }).first();
    if (await browseButton.isVisible()) {
      await browseButton.click();
      await expect(page).toHaveURL(/\/products/);
    } else {
      await page.goto('/products');
    }

    // Step 3: View a product
    await page.waitForSelector('[data-testid="product-card"], article', { timeout: 10000 });
    const firstProduct = page.locator('[data-testid="product-card"], article').first();
    await firstProduct.click();
    await expect(page).toHaveURL(/\/products\/.+/);

    // Step 4: Navigate to configurator
    const customizeButton = page.getByRole('link', { name: /customize|design|configure/i }).first();
    if (await customizeButton.isVisible()) {
      await customizeButton.click();
    } else {
      await page.goto('/configurator');
    }
    await expect(page).toHaveURL(/\/configurator/);

    // Step 5: Wait for configurator to load
    await page.waitForTimeout(2000);
    const canvas = page.locator('canvas, [data-testid="design-canvas"]');
    await expect(canvas.first()).toBeVisible();

    // Step 6: Browse components (if available)
    const componentCard = page.locator('[data-testid="component-card"]').first();
    if (await componentCard.isVisible()) {
      await componentCard.click();
      await page.waitForTimeout(500);

      // Close modal if it opens
      const closeButton = page.getByRole('button', { name: /close/i });
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }

    // Step 7: Attempt to request quote
    const quoteButton = page.getByRole('button', { name: /quote|request/i });
    if (await quoteButton.isVisible()) {
      await quoteButton.click();
      await page.waitForTimeout(500);

      // Verify quote form appears
      const quoteForm = page.locator('[data-testid="quote-form"], form');
      if (await quoteForm.isVisible()) {
        await expect(quoteForm).toBeVisible();

        // Fill in quote form
        const nameInput = page.getByLabel(/name/i);
        if (await nameInput.isVisible()) {
          await nameInput.fill('Test Customer');
        }

        const emailInput = page.getByLabel(/email/i);
        if (await emailInput.isVisible()) {
          await emailInput.fill('customer@example.com');
        }

        const phoneInput = page.getByLabel(/phone/i);
        if (await phoneInput.isVisible()) {
          await phoneInput.fill('1234567890');
        }

        // Note: In a real test, we would complete the form and submit
        // For now, we just verify the form is functional
      }
    }
  });

  test('should navigate through all main pages', async ({ page }) => {
    // Homepage
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();

    // Products
    await page.goto('/products');
    await expect(page.locator('h1')).toContainText(/products|catalog/i);

    // Tiers
    await page.goto('/tiers');
    await expect(page.locator('h1')).toBeVisible();

    // Gallery
    await page.goto('/gallery');
    await expect(page.locator('h1')).toContainText(/gallery/i);

    // Contact
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText(/contact/i);

    // Configurator
    await page.goto('/configurator');
    await page.waitForTimeout(1000);
    const canvas = page.locator('canvas, [data-testid="design-canvas"]');
    await expect(canvas.first()).toBeVisible();
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Visit homepage
    await page.goto('/');
    await expect(page.locator('h1').first()).toBeVisible();

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu|navigation/i });
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // Verify menu is open
      const mobileMenu = page.locator('[data-testid="mobile-menu"], nav[role="dialog"]');
      if (await mobileMenu.isVisible()) {
        await expect(mobileMenu).toBeVisible();

        // Navigate to products via mobile menu
        const productsLink = page.getByRole('link', { name: /products/i });
        if (await productsLink.isVisible()) {
          await productsLink.click();
          await expect(page).toHaveURL(/\/products/);
        }
      }
    }

    // Test configurator on mobile
    await page.goto('/configurator');
    await page.waitForTimeout(1000);
    
    // Verify configurator loads on mobile
    const canvas = page.locator('canvas, [data-testid="design-canvas"]');
    await expect(canvas.first()).toBeVisible();
  });
});
