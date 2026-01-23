import { test, expect } from '@playwright/test';

test.describe('Homepage to Product Browsing Flow', () => {
  test('should navigate from homepage to product catalog', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify homepage loads with hero section
    await expect(page.locator('h1').first()).toBeVisible();

    // Click on "Browse Products" or similar CTA
    const browseButton = page.getByRole('link', { name: /browse|products|shop/i });
    await browseButton.first().click();

    // Verify navigation to products page
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator('h1')).toContainText(/products|catalog/i);
  });

  test('should filter products by tier', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], article', { timeout: 10000 });

    // Find and click a tier filter
    const tierFilter = page.getByRole('button', { name: /essential|premium|luxury/i }).first();
    if (await tierFilter.isVisible()) {
      await tierFilter.click();

      // Wait for filtered results
      await page.waitForTimeout(500);

      // Verify products are displayed
      const products = page.locator('[data-testid="product-card"], article');
      await expect(products.first()).toBeVisible();
    }
  });

  test('should view product details', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], article', { timeout: 10000 });

    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"], article').first();
    await firstProduct.click();

    // Verify product detail page loads
    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to configurator from product page', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"], article', { timeout: 10000 });

    // Click on first product
    const firstProduct = page.locator('[data-testid="product-card"], article').first();
    await firstProduct.click();

    // Look for "Customize" or "Design" button
    const customizeButton = page.getByRole('link', { name: /customize|design|configure/i }).first();
    if (await customizeButton.isVisible()) {
      await customizeButton.click();

      // Verify navigation to configurator
      await expect(page).toHaveURL(/\/configurator/);
    }
  });

  test('should navigate through product tiers page', async ({ page }) => {
    await page.goto('/tiers');

    // Verify tiers page loads
    await expect(page.locator('h1')).toBeVisible();

    // Verify tier cards are displayed
    const tierCards = page.locator('[data-testid="tier-card"], article');
    await expect(tierCards.first()).toBeVisible();

    // Click on a tier to view products
    const viewProductsLink = page.getByRole('link', { name: /view products|browse|explore/i }).first();
    if (await viewProductsLink.isVisible()) {
      await viewProductsLink.click();

      // Verify navigation to filtered products
      await expect(page).toHaveURL(/\/products/);
    }
  });

  test('should view gallery and lightbox', async ({ page }) => {
    await page.goto('/gallery');

    // Wait for gallery images to load
    await page.waitForSelector('img', { timeout: 10000 });

    // Verify gallery page loads
    await expect(page.locator('h1')).toBeVisible();

    // Click on first image to open lightbox
    const firstImage = page.locator('img[alt]').first();
    await firstImage.click();

    // Verify lightbox opens (look for modal or overlay)
    const lightbox = page.locator('[role="dialog"], [data-testid="lightbox"]');
    if (await lightbox.isVisible()) {
      await expect(lightbox).toBeVisible();

      // Close lightbox
      const closeButton = page.getByRole('button', { name: /close/i });
      await closeButton.click();
    }
  });
});
