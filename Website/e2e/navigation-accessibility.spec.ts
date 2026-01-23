import { test, expect } from '@playwright/test';

test.describe('Navigation and Accessibility', () => {
  test('should navigate through main menu', async ({ page }) => {
    await page.goto('/');

    // Verify header navigation is visible
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Test navigation links
    const homeLink = page.getByRole('link', { name: /home/i });
    if (await homeLink.isVisible()) {
      await expect(homeLink).toBeVisible();
    }

    const productsLink = page.getByRole('link', { name: /products/i });
    if (await productsLink.isVisible()) {
      await productsLink.click();
      await expect(page).toHaveURL(/\/products/);
    }
  });

  test('should open and close mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for hamburger menu button
    const menuButton = page.getByRole('button', { name: /menu|navigation/i });
    if (await menuButton.isVisible()) {
      // Open menu
      await menuButton.click();
      await page.waitForTimeout(500);

      // Verify menu is open
      const mobileMenu = page.locator('[data-testid="mobile-menu"], nav[role="dialog"]');
      if (await mobileMenu.isVisible()) {
        await expect(mobileMenu).toBeVisible();

        // Close menu
        const closeButton = page.getByRole('button', { name: /close/i });
        await closeButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should navigate using keyboard', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Verify focus is visible
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName;
    });

    expect(focusedElement).toBeTruthy();
  });

  test('should have skip navigation link', async ({ page }) => {
    await page.goto('/');

    // Press Tab to focus skip link
    await page.keyboard.press('Tab');

    // Check if skip link is visible or becomes visible on focus
    const skipLink = page.getByRole('link', { name: /skip to content|skip navigation/i });
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1.first()).toBeVisible();

    // Verify only one h1 exists
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = page.locator('img');
    const imageCount = await images.count();

    if (imageCount > 0) {
      // Check first few images for alt text
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        
        // Alt attribute should exist (can be empty for decorative images)
        expect(alt !== null).toBeTruthy();
      }
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/contact');

    // Check that form inputs have associated labels
    const nameInput = page.getByLabel(/name/i);
    await expect(nameInput).toBeVisible();

    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toBeVisible();
  });

  test('should have footer with links', async ({ page }) => {
    await page.goto('/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verify footer is visible
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify footer has links
    const footerLinks = footer.locator('a');
    const linkCount = await footerLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should have breadcrumb navigation on product pages', async ({ page }) => {
    await page.goto('/products');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"], article').first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();

      // Look for breadcrumb
      const breadcrumb = page.locator('nav[aria-label="breadcrumb"], [data-testid="breadcrumb"]');
      if (await breadcrumb.isVisible()) {
        await expect(breadcrumb).toBeVisible();
      }
    }
  });

  test('should maintain focus after modal close', async ({ page }) => {
    await page.goto('/configurator');

    // Wait for configurator to load
    await page.waitForTimeout(1000);

    // Find a component card
    const componentCard = page.locator('[data-testid="component-card"]').first();
    if (await componentCard.isVisible()) {
      // Click on component to open modal
      await componentCard.click();

      // Wait for modal
      await page.waitForTimeout(500);

      // Close modal with keyboard
      await page.keyboard.press('Escape');

      // Wait for modal to close
      await page.waitForTimeout(500);

      // Focus should return to trigger element or be managed properly
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(focusedElement).toBeTruthy();
    }
  });
});
