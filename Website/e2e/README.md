# End-to-End Tests

This directory contains end-to-end tests for the Extreme V website using Playwright.

## Test Structure

The tests are organized by user journey:

- **homepage-to-products.spec.ts**: Tests navigation from homepage through product browsing
- **configurator-quote.spec.ts**: Tests the product configurator and quote request flow
- **user-auth-designs.spec.ts**: Tests user registration, authentication, and design management
- **contact-form.spec.ts**: Tests the contact form submission flow
- **navigation-accessibility.spec.ts**: Tests navigation and accessibility features

## Running Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests in headed mode (see browser)
```bash
npm run test:e2e:headed
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run specific test file
```bash
npx playwright test e2e/homepage-to-products.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests on mobile
```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Debugging Tests

### Debug mode
```bash
npx playwright test --debug
```

### Show test report
```bash
npx playwright show-report
```

### View traces
```bash
npx playwright show-trace trace.zip
```

## Test Helpers

Helper functions are available in the `helpers/` directory:

- **auth.ts**: Authentication helpers (register, login, logout)
- **configurator.ts**: Configurator interaction helpers

## Writing New Tests

When writing new tests:

1. Use descriptive test names that explain the user action
2. Use semantic selectors (role, label, text) over CSS selectors
3. Add appropriate waits for async operations
4. Use helper functions for common operations
5. Test both happy paths and error cases
6. Ensure tests are independent and can run in any order

## CI/CD Integration

Tests are configured to run in CI with:
- Automatic retries on failure (2 retries)
- GitHub Actions reporter
- Screenshot and trace capture on failure

## Environment Variables

Set `PLAYWRIGHT_TEST_BASE_URL` to test against a different environment:

```bash
PLAYWRIGHT_TEST_BASE_URL=https://staging.extremev.co.za npm run test:e2e
```

## Test Coverage

These tests cover the following critical user journeys:

1. **Homepage to Product Browsing**
   - Homepage navigation
   - Product filtering and sorting
   - Product detail viewing
   - Gallery browsing

2. **Configurator and Quote Flow**
   - Component library browsing
   - 2D/3D view toggling
   - Design validation
   - Quote request submission

3. **User Authentication and Design Management**
   - User registration
   - Login/logout
   - Design saving and loading
   - Dashboard navigation

4. **Contact Form**
   - Form validation
   - Successful submission

5. **Navigation and Accessibility**
   - Keyboard navigation
   - Mobile menu
   - Skip links
   - Form labels
   - Image alt text

## Known Limitations

- Some tests require authentication and may need setup scripts for CI
- 3D rendering tests may be limited in headless mode
- Email verification tests require email service integration
- Quote submission tests may need database cleanup between runs
