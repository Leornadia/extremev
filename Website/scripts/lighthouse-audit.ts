#!/usr/bin/env ts-node

/**
 * Lighthouse Audit Script
 * 
 * Runs Lighthouse audits on key pages and generates performance reports.
 * This helps identify performance bottlenecks and track improvements over time.
 * 
 * Usage:
 *   npm run audit
 *   npm run audit -- --url=http://localhost:3000
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface AuditConfig {
  url: string;
  pages: string[];
  outputDir: string;
  thresholds: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
}

const config: AuditConfig = {
  url: process.env.AUDIT_URL || 'http://localhost:3000',
  pages: [
    '/',
    '/products',
    '/configurator',
    '/gallery',
    '/contact',
    '/about',
  ],
  outputDir: path.join(process.cwd(), 'lighthouse-reports'),
  thresholds: {
    performance: 80,
    accessibility: 90,
    bestPractices: 80,
    seo: 90,
  },
};

interface LighthouseResult {
  page: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
  };
  passed: boolean;
}

function ensureOutputDir() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
}

function runLighthouse(pageUrl: string, pageName: string): LighthouseResult | null {
  console.log(`\n🔍 Auditing: ${pageUrl}`);
  
  try {
    // Check if lighthouse is installed
    try {
      execSync('which lighthouse', { stdio: 'ignore' });
    } catch {
      console.error('❌ Lighthouse CLI not found. Install with: npm install -g lighthouse');
      return null;
    }

    const outputPath = path.join(config.outputDir, `${pageName.replace(/\//g, '-')}.json`);
    const htmlPath = path.join(config.outputDir, `${pageName.replace(/\//g, '-')}.html`);
    
    // Run Lighthouse
    const command = `lighthouse "${pageUrl}" \
      --output=json \
      --output=html \
      --output-path="${outputPath.replace('.json', '')}" \
      --chrome-flags="--headless --no-sandbox" \
      --quiet`;
    
    execSync(command, { stdio: 'inherit' });
    
    // Read and parse results
    const results = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    
    const scores = {
      performance: Math.round(results.categories.performance.score * 100),
      accessibility: Math.round(results.categories.accessibility.score * 100),
      bestPractices: Math.round(results.categories['best-practices'].score * 100),
      seo: Math.round(results.categories.seo.score * 100),
    };
    
    const metrics = {
      firstContentfulPaint: results.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: results.audits['largest-contentful-paint'].numericValue,
      totalBlockingTime: results.audits['total-blocking-time'].numericValue,
      cumulativeLayoutShift: results.audits['cumulative-layout-shift'].numericValue,
      speedIndex: results.audits['speed-index'].numericValue,
    };
    
    const passed = 
      scores.performance >= config.thresholds.performance &&
      scores.accessibility >= config.thresholds.accessibility &&
      scores.bestPractices >= config.thresholds.bestPractices &&
      scores.seo >= config.thresholds.seo;
    
    console.log(`  Performance: ${scores.performance}/100`);
    console.log(`  Accessibility: ${scores.accessibility}/100`);
    console.log(`  Best Practices: ${scores.bestPractices}/100`);
    console.log(`  SEO: ${scores.seo}/100`);
    console.log(`  Status: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`  Report: ${htmlPath}`);
    
    return {
      page: pageName,
      scores,
      metrics,
      passed,
    };
  } catch (error) {
    console.error(`❌ Error auditing ${pageUrl}:`, error);
    return null;
  }
}

function generateSummary(results: LighthouseResult[]) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 LIGHTHOUSE AUDIT SUMMARY');
  console.log('='.repeat(60));
  
  const allPassed = results.every(r => r.passed);
  
  console.log(`\nTotal Pages Audited: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.passed).length}`);
  console.log(`Failed: ${results.filter(r => !r.passed).length}`);
  
  console.log('\nAverage Scores:');
  const avgScores = {
    performance: Math.round(results.reduce((sum, r) => sum + r.scores.performance, 0) / results.length),
    accessibility: Math.round(results.reduce((sum, r) => sum + r.scores.accessibility, 0) / results.length),
    bestPractices: Math.round(results.reduce((sum, r) => sum + r.scores.bestPractices, 0) / results.length),
    seo: Math.round(results.reduce((sum, r) => sum + r.scores.seo, 0) / results.length),
  };
  
  console.log(`  Performance: ${avgScores.performance}/100`);
  console.log(`  Accessibility: ${avgScores.accessibility}/100`);
  console.log(`  Best Practices: ${avgScores.bestPractices}/100`);
  console.log(`  SEO: ${avgScores.seo}/100`);
  
  console.log('\nPages Below Threshold:');
  results.forEach(result => {
    if (!result.passed) {
      console.log(`  ❌ ${result.page}`);
      Object.entries(result.scores).forEach(([key, value]) => {
        const threshold = config.thresholds[key as keyof typeof config.thresholds];
        if (value < threshold) {
          console.log(`     ${key}: ${value}/100 (threshold: ${threshold})`);
        }
      });
    }
  });
  
  console.log(`\n${allPassed ? '✅ All audits passed!' : '❌ Some audits failed. Review reports for details.'}`);
  console.log(`\nReports saved to: ${config.outputDir}`);
  console.log('='.repeat(60) + '\n');
  
  // Save summary to file
  const summaryPath = path.join(config.outputDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({ results, avgScores, allPassed }, null, 2));
  
  return allPassed;
}

async function main() {
  console.log('🚀 Starting Lighthouse Audits');
  console.log(`Target URL: ${config.url}`);
  console.log(`Pages to audit: ${config.pages.length}`);
  
  ensureOutputDir();
  
  const results: LighthouseResult[] = [];
  
  for (const page of config.pages) {
    const pageUrl = `${config.url}${page}`;
    const result = runLighthouse(pageUrl, page);
    if (result) {
      results.push(result);
    }
  }
  
  if (results.length === 0) {
    console.error('\n❌ No successful audits. Make sure the server is running and Lighthouse is installed.');
    process.exit(1);
  }
  
  const allPassed = generateSummary(results);
  
  // Exit with error code if audits failed
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
