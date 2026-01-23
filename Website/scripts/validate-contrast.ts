/**
 * Color Contrast Validation Script
 * Validates that color combinations meet WCAG 2.1 AA standards
 */

import { getContrastRatio, meetsContrastRequirement } from '../lib/utils/accessibility';

interface ColorPair {
  name: string;
  foreground: string;
  background: string;
  isLargeText?: boolean;
  context: string;
}

// Define color pairs to validate
const colorPairs: ColorPair[] = [
  // Primary colors
  {
    name: 'Primary button text',
    foreground: '#ffffff',
    background: '#047857',
    context: 'Button text on primary background',
  },
  {
    name: 'Primary button hover',
    foreground: '#ffffff',
    background: '#065f46',
    context: 'Button text on primary hover background',
  },
  {
    name: 'Primary link',
    foreground: '#047857',
    background: '#ffffff',
    context: 'Primary colored links on white background',
  },
  
  // Secondary colors
  {
    name: 'Secondary button text',
    foreground: '#ffffff',
    background: '#b45309',
    context: 'Button text on secondary background',
  },
  {
    name: 'Secondary button hover',
    foreground: '#ffffff',
    background: '#92400e',
    context: 'Button text on secondary hover background',
  },
  
  // Text colors
  {
    name: 'Body text',
    foreground: '#404040',
    background: '#ffffff',
    context: 'Main body text on white background',
  },
  {
    name: 'Heading text',
    foreground: '#171717',
    background: '#ffffff',
    context: 'Heading text on white background',
  },
  {
    name: 'Muted text',
    foreground: '#737373',
    background: '#ffffff',
    context: 'Secondary/muted text on white background',
  },
  
  // Interactive elements
  {
    name: 'Link hover',
    foreground: '#065f46',
    background: '#ffffff',
    context: 'Link hover state',
  },
  {
    name: 'Focus ring',
    foreground: '#047857',
    background: '#ffffff',
    context: 'Focus indicator',
  },
  
  // Backgrounds
  {
    name: 'Text on light background',
    foreground: '#404040',
    background: '#f5f5f5',
    context: 'Text on light gray background',
  },
  {
    name: 'Text on primary light',
    foreground: '#047857',
    background: '#f0f9f4',
    context: 'Dark text on light primary background',
  },
  
  // Error states
  {
    name: 'Error text',
    foreground: '#dc2626',
    background: '#ffffff',
    context: 'Error message text',
  },
  {
    name: 'Error background',
    foreground: '#7f1d1d',
    background: '#fef2f2',
    context: 'Error text on error background',
  },
  
  // Success states
  {
    name: 'Success text',
    foreground: '#047857',
    background: '#ffffff',
    context: 'Success message text',
  },
  
  // Large text (headings)
  {
    name: 'Large heading',
    foreground: '#171717',
    background: '#ffffff',
    isLargeText: true,
    context: 'Large heading text',
  },
  {
    name: 'Large muted text',
    foreground: '#737373',
    background: '#ffffff',
    isLargeText: true,
    context: 'Large secondary text',
  },
];

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function validateContrast() {
  console.log(`${colors.bold}${colors.blue}Color Contrast Validation${colors.reset}\n`);
  console.log('WCAG 2.1 AA Requirements:');
  console.log('- Normal text: 4.5:1 minimum');
  console.log('- Large text (18pt+ or 14pt+ bold): 3:1 minimum');
  console.log('- Interactive elements: 3:1 minimum\n');
  console.log('─'.repeat(80) + '\n');

  let passCount = 0;
  let failCount = 0;
  const failures: ColorPair[] = [];

  colorPairs.forEach((pair) => {
    const ratio = getContrastRatio(pair.foreground, pair.background);
    const passes = meetsContrastRequirement(
      pair.foreground,
      pair.background,
      pair.isLargeText || false
    );

    const requiredRatio = pair.isLargeText ? 3 : 4.5;
    const status = passes
      ? `${colors.green}✓ PASS${colors.reset}`
      : `${colors.red}✗ FAIL${colors.reset}`;

    console.log(`${colors.bold}${pair.name}${colors.reset}`);
    console.log(`  Context: ${pair.context}`);
    console.log(`  Foreground: ${pair.foreground}`);
    console.log(`  Background: ${pair.background}`);
    console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1 (Required: ${requiredRatio}:1)`);
    console.log(`  Status: ${status}`);
    console.log('');

    if (passes) {
      passCount++;
    } else {
      failCount++;
      failures.push(pair);
    }
  });

  console.log('─'.repeat(80) + '\n');
  console.log(`${colors.bold}Summary${colors.reset}`);
  console.log(`Total pairs tested: ${colorPairs.length}`);
  console.log(`${colors.green}Passed: ${passCount}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failCount}${colors.reset}`);

  if (failures.length > 0) {
    console.log(`\n${colors.bold}${colors.red}Failed Color Pairs:${colors.reset}`);
    failures.forEach((pair) => {
      const ratio = getContrastRatio(pair.foreground, pair.background);
      const requiredRatio = pair.isLargeText ? 3 : 4.5;
      console.log(`  - ${pair.name}: ${ratio.toFixed(2)}:1 (needs ${requiredRatio}:1)`);
    });
    console.log('');
    process.exit(1);
  } else {
    console.log(`\n${colors.green}${colors.bold}All color pairs meet WCAG 2.1 AA standards!${colors.reset}\n`);
    process.exit(0);
  }
}

// Run validation
validateContrast();
