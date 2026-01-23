import { Page } from '@playwright/test';

/**
 * Helper function to register a new user
 */
export async function registerUser(
  page: Page,
  email: string,
  password: string,
  name: string
) {
  await page.goto('/auth/register');

  await page.getByLabel(/name/i).fill(name);
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).first().fill(password);

  const submitButton = page.getByRole('button', { name: /register|sign up|create/i });
  await submitButton.click();

  // Wait for redirect or success
  await page.waitForTimeout(2000);
}

/**
 * Helper function to login a user
 */
export async function loginUser(page: Page, email: string, password: string) {
  await page.goto('/auth/signin');

  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);

  const submitButton = page.getByRole('button', { name: /sign in|login|log in/i });
  await submitButton.click();

  // Wait for redirect
  await page.waitForTimeout(2000);
}

/**
 * Helper function to logout a user
 */
export async function logoutUser(page: Page) {
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForTimeout(1000);
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  await page.goto('/dashboard');
  await page.waitForTimeout(1000);
  return page.url().includes('/dashboard');
}
