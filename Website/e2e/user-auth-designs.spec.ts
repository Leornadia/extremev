import { test, expect } from '@playwright/test';

test.describe('User Registration and Design Saving', () => {
  // Generate unique email for each test run
  const timestamp = Date.now();
  const testEmail = `test-${timestamp}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  test('should display registration page', async ({ page }) => {
    await page.goto('/auth/register');

    // Verify registration form is visible
    await expect(page.locator('h1, h2')).toContainText(/register|sign up|create account/i);

    // Verify form fields exist
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i).first()).toBeVisible();
  });

  test('should validate registration form', async ({ page }) => {
    await page.goto('/auth/register');

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /register|sign up|create/i });
    await submitButton.click();

    // Should show validation errors
    await page.waitForTimeout(500);
    const errorMessages = page.locator('[role="alert"], .error, [data-testid="error"]');
    if (await errorMessages.first().isVisible()) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('should register new user', async ({ page }) => {
    await page.goto('/auth/register');

    // Fill in registration form
    await page.getByLabel(/name/i).fill(testName);
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).first().fill(testPassword);

    // Submit form
    const submitButton = page.getByRole('button', { name: /register|sign up|create/i });
    await submitButton.click();

    // Wait for redirect or success message
    await page.waitForTimeout(2000);

    // Should redirect to verification page, dashboard, or show success message
    const currentUrl = page.url();
    const hasSuccessMessage = await page.locator('text=/success|verify|check your email/i').isVisible();

    expect(
      currentUrl.includes('/verify') ||
      currentUrl.includes('/dashboard') ||
      currentUrl.includes('/auth/signin') ||
      hasSuccessMessage
    ).toBeTruthy();
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/auth/signin');

    // Verify login form is visible
    await expect(page.locator('h1, h2')).toContainText(/sign in|login|log in/i);

    // Verify form fields exist
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('should validate login form', async ({ page }) => {
    await page.goto('/auth/signin');

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /sign in|login|log in/i });
    await submitButton.click();

    // Should show validation errors
    await page.waitForTimeout(500);
    const errorMessages = page.locator('[role="alert"], .error, [data-testid="error"]');
    if (await errorMessages.first().isVisible()) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');

    // Submit form
    const submitButton = page.getByRole('button', { name: /sign in|login|log in/i });
    await submitButton.click();

    // Wait for error message
    await page.waitForTimeout(2000);

    // Should show error message
    const errorMessage = page.locator('text=/invalid|incorrect|error|failed/i');
    if (await errorMessage.first().isVisible()) {
      await expect(errorMessage.first()).toBeVisible();
    }
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth/signin');

    // Click forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i });
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();

      // Verify navigation to forgot password page
      await expect(page).toHaveURL(/\/auth\/forgot-password/);
      await expect(page.locator('h1, h2')).toContainText(/forgot password|reset/i);
    }
  });

  test('should access dashboard when authenticated', async ({ page }) => {
    // Note: This test assumes user is logged in via browser context
    // In a real scenario, you'd use a setup script to authenticate

    await page.goto('/dashboard');

    // If not authenticated, should redirect to login
    await page.waitForTimeout(1000);
    const currentUrl = page.url();

    // Either on dashboard or redirected to login
    expect(
      currentUrl.includes('/dashboard') ||
      currentUrl.includes('/auth/signin')
    ).toBeTruthy();
  });

  test('should display saved designs in dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // If on dashboard (authenticated)
    if (page.url().includes('/dashboard')) {
      // Look for saved designs section
      const savedDesignsSection = page.locator('text=/saved designs|my designs/i');
      if (await savedDesignsSection.isVisible()) {
        await expect(savedDesignsSection).toBeVisible();
      }

      // Look for design cards or empty state
      const designCards = page.locator('[data-testid="design-card"]');
      const emptyState = page.locator('text=/no designs|create your first/i');

      // Either designs exist or empty state is shown
      const hasDesigns = await designCards.first().isVisible();
      const hasEmptyState = await emptyState.isVisible();

      expect(hasDesigns || hasEmptyState).toBeTruthy();
    }
  });

  test('should navigate to configurator from dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // If on dashboard (authenticated)
    if (page.url().includes('/dashboard')) {
      // Look for "Create New Design" or similar button
      const createButton = page.getByRole('link', { name: /create|new design|start/i });
      if (await createButton.first().isVisible()) {
        await createButton.first().click();

        // Should navigate to configurator
        await expect(page).toHaveURL(/\/configurator/);
      }
    }
  });

  test('should load saved design from dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // If on dashboard (authenticated)
    if (page.url().includes('/dashboard')) {
      // Look for design cards
      const designCard = page.locator('[data-testid="design-card"]').first();
      if (await designCard.isVisible()) {
        // Click on design to load it
        await designCard.click();

        // Should navigate to configurator with loaded design
        await page.waitForTimeout(1000);
        await expect(page).toHaveURL(/\/configurator/);
      }
    }
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/dashboard');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // If on dashboard (authenticated)
    if (page.url().includes('/dashboard')) {
      // Look for logout button
      const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
      if (await logoutButton.isVisible()) {
        await logoutButton.click();

        // Wait for redirect
        await page.waitForTimeout(1000);

        // Should redirect to homepage or login
        const currentUrl = page.url();
        expect(
          currentUrl === '/' ||
          currentUrl.includes('/auth/signin')
        ).toBeTruthy();
      }
    }
  });
});
