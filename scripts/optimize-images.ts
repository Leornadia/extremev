#!/usr/bin/env ts-node

/**
 * Batch image optimization script
 * Processes all images in the public/Images directory and generates optimized versions
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { processImage } from '../lib/image-optimization/imageProcessor';

interface OptimizationStats {
  processed: number;
  failed: number;
  totalOriginalSize: number;
  totalOptimizedSize: number;
  errors: Array<{ file: string; error: string }>;
}

const stats: OptimizationStats = {
  processed: 0,
  failed: 0,
  totalOriginalSize: 0,
  totalOptimizedSize: 0,
  errors: [],
};

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Process a single image file
 */
async function processImageFile(
  filepath: string,
  filename: string
): Promise<void> {
  try {
    console.log(`Processing: ${filename}`);

    // Read file
    const buffer = await readFile(filepath);
    const fileStats = await stat(filepath);
    stats.totalOriginalSize += fileStats.size;

    // Process image
    const result = await processImage(buffer, filename, {
      quality: 85,
      generateResponsive: true,
      generateFormats: true,
    });

    // Calculate savings
    const optimizedSize =
      result.original.size +
      (result.webp?.size || 0) +
      (result.avif?.size || 0);
    stats.totalOptimizedSize += optimizedSize;

    const savings = ((fileStats.size - result.original.size) / fileStats.size) * 100;

    console.log(`  ✓ Original: ${formatBytes(fileStats.size)}`);
    console.log(`  ✓ Optimized: ${formatBytes(result.original.size)} (${savings.toFixed(1)}% smaller)`);
    if (result.webp) {
      console.log(`  ✓ WebP: ${formatBytes(result.webp.size)}`);
    }
    if (result.avif) {
      console.log(`  ✓ AVIF: ${formatBytes(result.avif.size)}`);
    }
    if (result.responsive) {
      console.log(`  ✓ Responsive: 3 sizes generated`);
    }

    stats.processed++;
  } catch (error) {
    console.error(`  ✗ Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    stats.failed++;
    stats.errors.push({
      file: filename,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(dirPath: string): Promise<void> {
  try {
    const files = await readdir(dirPath);

    for (const file of files) {
      const filepath = join(dirPath, file);
      const fileStats = await stat(filepath);

      // Skip directories and non-image files
      if (fileStats.isDirectory()) {
        continue;
      }

      // Only process image files
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        await processImageFile(filepath, file);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('This script will process all images in public/Images');
  console.log('and generate optimized versions with WebP, AVIF, and responsive sizes.\n');

  const imagesDir = join(process.cwd(), 'public', 'Images');

  console.log(`Source directory: ${imagesDir}\n`);
  console.log('Starting optimization...\n');

  const startTime = Date.now();

  try {
    await processDirectory(imagesDir);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('Optimization Complete!');
    console.log('='.repeat(60));
    console.log(`\nProcessed: ${stats.processed} images`);
    console.log(`Failed: ${stats.failed} images`);
    console.log(`Duration: ${duration}s`);
    console.log(`\nOriginal total size: ${formatBytes(stats.totalOriginalSize)}`);
    console.log(`Optimized total size: ${formatBytes(stats.totalOptimizedSize)}`);

    if (stats.totalOriginalSize > 0) {
      const totalSavings =
        ((stats.totalOriginalSize - stats.totalOptimizedSize) /
          stats.totalOriginalSize) *
        100;
      console.log(`Total savings: ${totalSavings.toFixed(1)}%`);
    }

    if (stats.errors.length > 0) {
      console.log('\n⚠️  Errors:');
      stats.errors.forEach(({ file, error }) => {
        console.log(`  - ${file}: ${error}`);
      });
    }

    console.log('\n✨ Optimized images saved to: public/Images/optimized/');
    console.log('✨ Thumbnails saved to: public/Images/thumbnails/\n');
  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the script
main();
