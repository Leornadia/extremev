#!/usr/bin/env node

/**
 * Content Migration Script
 *
 * Helps migrate content from the old website to the new platform.
 * This script provides utilities for:
 * - Validating content structure
 * - Checking for missing assets
 * - Generating content reports
 * - Preparing content for Sanity import
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface ContentAudit {
  images: {
    total: number;
    optimized: number;
    needsOptimization: number;
    missing: string[];
  };
  videos: {
    total: number;
    optimized: number;
    needsOptimization: number;
  };
  models3D: {
    total: number;
    valid: number;
    invalid: string[];
  };
  content: {
    homepage: boolean;
    products: number;
    gallery: number;
    testimonials: number;
  };
}

interface MigrationReport {
  timestamp: string;
  audit: ContentAudit;
  recommendations: string[];
  nextSteps: string[];
}

/**
 * Check if a file exists
 */
function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Get file size in KB
 */
function getFileSizeKB(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size / 1024;
  } catch {
    return 0;
  }
}

/**
 * Check if image is optimized (WebP format and reasonable size)
 */
function isImageOptimized(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  const sizeKB = getFileSizeKB(filePath);

  // Check if WebP or if JPEG/PNG is reasonably sized
  if (ext === '.webp') return true;
  if (['.jpg', '.jpeg', '.png'].includes(ext) && sizeKB < 200) return true;

  return false;
}

/**
 * Audit images in the project
 */
async function auditImages(): Promise<ContentAudit['images']> {
  console.log('📸 Auditing images...');

  const imagePatterns = [
    'Images/**/*.{jpg,jpeg,png,webp}',
    'public/images/**/*.{jpg,jpeg,png,webp}',
  ];

  const images: string[] = [];
  for (const pattern of imagePatterns) {
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    images.push(...files);
  }

  let optimized = 0;
  let needsOptimization = 0;
  const missing: string[] = [];

  for (const image of images) {
    if (!fileExists(image)) {
      missing.push(image);
      continue;
    }

    if (isImageOptimized(image)) {
      optimized++;
    } else {
      needsOptimization++;
    }
  }

  console.log(`  ✓ Found ${images.length} images`);
  console.log(`  ✓ ${optimized} optimized`);
  console.log(`  ⚠ ${needsOptimization} need optimization`);
  if (missing.length > 0) {
    console.log(`  ✗ ${missing.length} missing`);
  }

  return {
    total: images.length,
    optimized,
    needsOptimization,
    missing,
  };
}

/**
 * Audit videos in the project
 */
async function auditVideos(): Promise<ContentAudit['videos']> {
  console.log('🎥 Auditing videos...');

  const videoPatterns = [
    'Videos/**/*.{mp4,webm,mov}',
    'public/videos/**/*.{mp4,webm,mov}',
  ];

  const videos: string[] = [];
  for (const pattern of videoPatterns) {
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    videos.push(...files);
  }

  let optimized = 0;
  let needsOptimization = 0;

  for (const video of videos) {
    const sizeKB = getFileSizeKB(video);
    const ext = path.extname(video).toLowerCase();

    // Consider MP4 under 10MB as optimized
    if (ext === '.mp4' && sizeKB < 10240) {
      optimized++;
    } else {
      needsOptimization++;
    }
  }

  console.log(`  ✓ Found ${videos.length} videos`);
  console.log(`  ✓ ${optimized} optimized`);
  console.log(`  ⚠ ${needsOptimization} need optimization`);

  return {
    total: videos.length,
    optimized,
    needsOptimization,
  };
}

/**
 * Audit 3D models in the project
 */
async function audit3DModels(): Promise<ContentAudit['models3D']> {
  console.log('🎨 Auditing 3D models...');

  const modelPatterns = [
    '3D/**/*.{glb,gltf}',
    'public/models/**/*.{glb,gltf}',
  ];

  const models: string[] = [];
  for (const pattern of modelPatterns) {
    const files = await glob(pattern, { ignore: 'node_modules/**' });
    models.push(...files);
  }

  let valid = 0;
  const invalid: string[] = [];

  for (const model of models) {
    const sizeKB = getFileSizeKB(model);
    const ext = path.extname(model).toLowerCase();

    // Check if GLB format and reasonable size (<5MB)
    if (ext === '.glb' && sizeKB > 0 && sizeKB < 5120) {
      valid++;
    } else {
      invalid.push(model);
    }
  }

  console.log(`  ✓ Found ${models.length} 3D models`);
  console.log(`  ✓ ${valid} valid`);
  if (invalid.length > 0) {
    console.log(`  ⚠ ${invalid.length} need attention`);
  }

  return {
    total: models.length,
    valid,
    invalid,
  };
}

/**
 * Check content completeness
 */
function auditContent(): ContentAudit['content'] {
  console.log('📝 Auditing content...');

  const content = {
    homepage: false,
    products: 0,
    gallery: 0,
    testimonials: 0,
  };

  // Check if homepage content exists in Sanity schemas
  const homepageSchema = fileExists('lib/sanity/schemas/homepage.ts');
  content.homepage = homepageSchema;

  console.log(`  ${homepageSchema ? '✓' : '✗'} Homepage schema ready`);
  console.log(`  ℹ Products: Check database for count`);
  console.log(`  ℹ Gallery: Check Sanity CMS for count`);
  console.log(`  ℹ Testimonials: Check Sanity CMS for count`);

  return content;
}

/**
 * Generate recommendations based on audit
 */
function generateRecommendations(audit: ContentAudit): string[] {
  const recommendations: string[] = [];

  // Image recommendations
  if (audit.images.needsOptimization > 0) {
    recommendations.push(
      `Optimize ${audit.images.needsOptimization} images using: npm run optimize:images`
    );
  }

  if (audit.images.missing.length > 0) {
    recommendations.push(
      `${audit.images.missing.length} images are referenced but missing. Check paths.`
    );
  }

  // Video recommendations
  if (audit.videos.needsOptimization > 0) {
    recommendations.push(
      `Optimize ${audit.videos.needsOptimization} videos (compress to <10MB, convert to MP4)`
    );
  }

  // 3D model recommendations
  if (audit.models3D.invalid.length > 0) {
    recommendations.push(
      `${audit.models3D.invalid.length} 3D models need attention (convert to GLB, reduce size)`
    );
  }

  if (audit.models3D.total === 0) {
    recommendations.push(
      'No 3D models found. Create and add GLB models for configurator components.'
    );
  }

  // Content recommendations
  if (!audit.content.homepage) {
    recommendations.push('Set up homepage content in Sanity CMS');
  }

  return recommendations;
}

/**
 * Generate next steps
 */
function generateNextSteps(audit: ContentAudit): string[] {
  const steps: string[] = [];

  // Prioritize based on what's missing
  if (audit.images.needsOptimization > 0) {
    steps.push('1. Run image optimization script');
  }

  if (audit.models3D.total === 0) {
    steps.push('2. Create and add 3D models for components');
  }

  if (!audit.content.homepage) {
    steps.push('3. Set up Sanity CMS and add homepage content');
  }

  steps.push('4. Add products to database using Prisma Studio');
  steps.push('5. Create gallery items in Sanity CMS');
  steps.push('6. Add customer testimonials to Sanity CMS');
  steps.push('7. Create pre-designed templates in configurator');
  steps.push('8. Run final content validation');
  steps.push('9. Complete launch checklist');

  return steps;
}

/**
 * Generate migration report
 */
async function generateReport(): Promise<MigrationReport> {
  console.log('\n🔍 Starting Content Migration Audit...\n');

  const audit: ContentAudit = {
    images: await auditImages(),
    videos: await auditVideos(),
    models3D: await audit3DModels(),
    content: auditContent(),
  };

  const recommendations = generateRecommendations(audit);
  const nextSteps = generateNextSteps(audit);

  const report: MigrationReport = {
    timestamp: new Date().toISOString(),
    audit,
    recommendations,
    nextSteps,
  };

  return report;
}

/**
 * Save report to file
 */
function saveReport(report: MigrationReport): void {
  const reportPath = path.join(
    process.cwd(),
    'content-migration-report.json'
  );
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

/**
 * Print report summary
 */
function printSummary(report: MigrationReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 CONTENT MIGRATION SUMMARY');
  console.log('='.repeat(60));

  console.log('\n📈 Statistics:');
  console.log(`  Images: ${report.audit.images.total} total`);
  console.log(
    `    - ${report.audit.images.optimized} optimized, ${report.audit.images.needsOptimization} need work`
  );
  console.log(`  Videos: ${report.audit.videos.total} total`);
  console.log(
    `    - ${report.audit.videos.optimized} optimized, ${report.audit.videos.needsOptimization} need work`
  );
  console.log(`  3D Models: ${report.audit.models3D.total} total`);
  console.log(
    `    - ${report.audit.models3D.valid} valid, ${report.audit.models3D.invalid.length} need attention`
  );

  if (report.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
  }

  console.log('\n📋 Next Steps:');
  report.nextSteps.forEach((step) => {
    console.log(`  ${step}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log(
    '\n📚 For detailed migration instructions, see: CONTENT_MIGRATION_GUIDE.md'
  );
  console.log('✅ For launch preparation, see: LAUNCH_CHECKLIST.md\n');
}

/**
 * Main execution
 */
async function main() {
  try {
    const report = await generateReport();
    saveReport(report);
    printSummary(report);

    // Exit with error code if there are critical issues
    const hasCriticalIssues =
      report.audit.images.missing.length > 0 ||
      report.audit.models3D.total === 0;

    if (hasCriticalIssues) {
      console.log(
        '\n⚠️  Critical issues found. Please address before launch.\n'
      );
      process.exit(1);
    }

    console.log('\n✨ Content audit complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during content audit:', error);
    process.exit(1);
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  main();
}

export { generateReport, type MigrationReport, type ContentAudit };
