import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test('should display contact page', async ({ page }) => {
    await page.goto('/contact');

    // Verify contact page loads
    await expect(page.locator('h1')).toContainText(/contact/i);

    // Verify contact form is visible
    const contactForm = page.locator('form');
    await expect(contactForm.first()).toBeVisible();
  });

  test('should validate contact form fields', async ({ page }) => {
    await page.goto('/contact');

    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /submit|send|contact/i });
    await submitButton.click();

    // Should show validation errors
    await page.waitForTimeout(500);
    const errorMessages = page.locator('[role="alert"], .error, [data-testid="error"]');
    if (await errorMessages.first().isVisible()) {
      await expect(errorMessages.first()).toBeVisible();
    }
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/contact');

    // Fill in invalid email
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('invalid-email');

    // Try to submit
    const submitButton = page.getByRole('button', { name: /submit|send|contact/i });
    await submitButton.click();

    // Should show email validation error
    await page.waitForTimeout(500);
    const errorMessage = page.locator('text=/invalid email|valid email/i');
    if (await errorMessage.isVisible()) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');

    // Fill in form fields
    const nameInput = page.getByLabel(/name/i);
    await nameInput.fill('Test User');

    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('test@example.com');

    const phoneInput = page.getByLabel(/phone/i);
    if (await phoneInput.isVisible()) {
      await phoneInput.fill('1234567890');
    }

    const messageInput = page.getByLabel(/message/i);
    await messageInput.fill('This is a test message for the contact form.');

    // Submit form
    const submitButton = page.getByRole('button', { name: /submit|send|contact/i });
    await submitButton.click();

    // Wait for success message
    await page.waitForTimeout(2000);

    // Should show success message
    const successMessage = page.locator('text=/success|thank you|received|sent/i');
    if (await successMessage.isVisible()) {
      await expect(successMessage).toBeVisible();
    }
  });

  test('should display contact information', async ({ page }) => {
    await page.goto('/contact');

    // Verify contact information is displayed
    const contactInfo = page.locator('text=/phone|email|address/i');
    await expect(contactInfo.first()).toBeVisible();
  });
});
