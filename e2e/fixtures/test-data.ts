/**
 * Test data fixtures for E2E tests
 */

export const testUsers = {
  validUser: {
    name: 'Test User',
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
};

export const testCustomer = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  city: 'Cape Town',
  state: 'Western Cape',
  postalCode: '8001',
};

export const testContactForm = {
  name: 'Jane Smith',
  email: 'jane.smith@example.com',
  phone: '555-987-6543',
  message: 'I am interested in learning more about your jungle gym products.',
};

export const testDesign = {
  name: 'My Custom Playset',
  description: 'A custom design for testing',
};

/**
 * Generate unique test email
 */
export function generateTestEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
}

/**
 * Generate unique design name
 */
export function generateDesignName(): string {
  return `Test Design ${Date.now()}`;
}
