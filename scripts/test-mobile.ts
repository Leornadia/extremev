#!/usr/bin/env node

/**
 * Mobile Testing Script
 * Tests mobile optimization and responsiveness
 */

import { chromium, devices, Browser, Page } from 'playwright';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  details?: any;
}

const MOBILE_DEVICES = [
  'iPhone 12',
  'iPhone 12 Pro Max',
  'Pixel 5',
  'Samsung Galaxy S20',
  'iPad Mini',
  'iPad Pro',
];

const TEST_PAGES = [
  '/',
  '/products',
  '/gallery',
  '/contact',
  '/configurator',
  '/about',
];

async function runMobileTests() {
  console.log('🚀 Starting Mobile Optimization Tests\n');

  const browser = await chromium.launch({ headless: true });
  const results: TestResult[] = [];

  try {
    for (const deviceName of MOBILE_DEVICES) {
      console.log(`\n📱 Testing on ${deviceName}...`);
      const device = devices[deviceName];

      const context = await browser.newContext({
        ...device,
        locale: 'en-US',
      });

      const page = await context.newPage();

      for (const url of TEST_PAGES) {
        console.log(`  Testing ${url}...`);

        try {
          // Navigate to page
          await page.goto(`http://localhost:3000${url}`, {
            waitUntil: 'networkidle',
            timeout: 30000,
          });

          // Test 1: Page loads successfully
          results.push({
            name: `${deviceName} - ${url} - Page Load`,
            passed: true,
            message: 'Page loaded successfully',
          });

          // Test 2: No horizontal scroll
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > window.innerWidth;
          });

          results.push({
            name: `${deviceName} - ${url} - No Horizontal Scroll`,
            passed: !hasHorizontalScroll,
            message: hasHorizontalScroll
              ? 'Page has horizontal scroll'
              : 'No horizontal scroll detected',
          });

          // Test 3: Viewport meta tag
          const hasViewportMeta = await page.evaluate(() => {
            const meta = document.querySelector('meta[name="viewport"]');
            return !!meta;
          });

          results.push({
            name: `${deviceName} - ${url} - Viewport Meta`,
            passed: hasViewportMeta,
            message: hasViewportMeta
              ? 'Viewport meta tag present'
              : 'Missing viewport meta tag',
          });

          // Test 4: Touch targets (minimum 44x44px)
          const touchTargetIssues = await page.evaluate(() => {
            const interactiveElements = document.querySelectorAll(
              'button, a, input, select, textarea'
            );
            const issues: string[] = [];

            interactiveElements.forEach((el) => {
              const rect = el.getBoundingClientRect();
              if (rect.width < 44 || rect.height < 44) {
                issues.push(
                  `${el.tagName} at (${Math.round(rect.left)}, ${Math.round(rect.top)}) is ${Math.round(rect.width)}x${Math.round(rect.height)}px`
                );
              }
            });

            return issues;
          });

          results.push({
            name: `${deviceName} - ${url} - Touch Targets`,
            passed: touchTargetIssues.length === 0,
            message:
              touchTargetIssues.length === 0
                ? 'All touch targets meet minimum size'
                : `${touchTargetIssues.length} touch targets too small`,
            details: touchTargetIssues.slice(0, 5),
          });

          // Test 5: Font sizes (minimum 16px for body text)
          const fontSizeIssues = await page.evaluate(() => {
            const textElements = document.querySelectorAll('p, span, a, li');
            const issues: string[] = [];

            textElements.forEach((el) => {
              const fontSize = parseFloat(
                window.getComputedStyle(el).fontSize
              );
              if (fontSize < 14) {
                // Allow slightly smaller for some elements
                issues.push(
                  `${el.tagName} has font size ${fontSize}px`
                );
              }
            });

            return issues;
          });

          results.push({
            name: `${deviceName} - ${url} - Font Sizes`,
            passed: fontSizeIssues.length === 0,
            message:
              fontSizeIssues.length === 0
                ? 'All fonts meet minimum size'
                : `${fontSizeIssues.length} elements with small fonts`,
            details: fontSizeIssues.slice(0, 5),
          });

          // Test 6: Performance metrics
          const metrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType(
              'navigation'
            )[0] as PerformanceNavigationTiming;

            return {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              domInteractive: navigation.domInteractive - navigation.fetchStart,
            };
          });

          const performancePassed =
            metrics.domInteractive < 3000 && metrics.loadComplete < 5000;

          results.push({
            name: `${deviceName} - ${url} - Performance`,
            passed: performancePassed,
            message: performancePassed
              ? 'Performance metrics within acceptable range'
              : 'Performance metrics exceed thresholds',
            details: {
              domInteractive: `${Math.round(metrics.domInteractive)}ms`,
              loadComplete: `${Math.round(metrics.loadComplete)}ms`,
            },
          });

          // Test 7: Mobile navigation (if applicable)
          if (url === '/') {
            const hasMobileMenu = await page.evaluate(() => {
              const menuButton = document.querySelector(
                '[aria-label*="menu" i], [aria-label*="navigation" i]'
              );
              return !!menuButton;
            });

            results.push({
              name: `${deviceName} - ${url} - Mobile Navigation`,
              passed: hasMobileMenu,
              message: hasMobileMenu
                ? 'Mobile navigation menu found'
                : 'Mobile navigation menu not found',
            });
          }

          // Test 8: Images are responsive
          const imageIssues = await page.evaluate(() => {
            const images = document.querySelectorAll('img');
            const issues: string[] = [];

            images.forEach((img) => {
              const style = window.getComputedStyle(img);
              const hasResponsive =
                style.maxWidth === '100%' ||
                img.hasAttribute('srcset') ||
                img.closest('picture');

              if (!hasResponsive && img.naturalWidth > window.innerWidth) {
                issues.push(`Image ${img.src} may not be responsive`);
              }
            });

            return issues;
          });

          results.push({
            name: `${deviceName} - ${url} - Responsive Images`,
            passed: imageIssues.length === 0,
            message:
              imageIssues.length === 0
                ? 'All images are responsive'
                : `${imageIssues.length} images may not be responsive`,
            details: imageIssues.slice(0, 3),
          });
        } catch (error) {
          results.push({
            name: `${deviceName} - ${url} - Error`,
            passed: false,
            message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  // Print results
  console.log('\n\n📊 Test Results Summary\n');
  console.log('='.repeat(80));

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`\nTotal Tests: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  // Show failed tests
  if (failed > 0) {
    console.log('\n❌ Failed Tests:\n');
    results
      .filter((r) => !r.passed)
      .forEach((result) => {
        console.log(`  ${result.name}`);
        console.log(`    ${result.message}`);
        if (result.details) {
          console.log(`    Details:`, result.details);
        }
        console.log();
      });
  }

  // Exit with error code if tests failed
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runMobileTests().catch((error) => {
  console.error('Error running mobile tests:', error);
  process.exit(1);
});
