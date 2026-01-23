/**
 * Image processing and optimization service using Sharp
 * Handles automatic format conversion, compression, and responsive image generation
 */

import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface ImageProcessingOptions {
  quality?: number;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  generateResponsive?: boolean;
  generateFormats?: boolean;
}

export interface ProcessedImage {
  url: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface ImageProcessingResult {
  original: ProcessedImage;
  webp?: ProcessedImage;
  avif?: ProcessedImage;
  responsive?: {
    small: ProcessedImage;
    medium: ProcessedImage;
    large: ProcessedImage;
  };
}

/**
 * Responsive image breakpoints
 */
const RESPONSIVE_SIZES = {
  small: 640,
  medium: 1024,
  large: 1920,
};

/**
 * Default quality settings by format
 */
const DEFAULT_QUALITY = {
  jpeg: 85,
  png: 90,
  webp: 85,
  avif: 80,
};

/**
 * Process and optimize an image with multiple format and size variants
 */
export async function processImage(
  buffer: Buffer,
  filename: string,
  options: ImageProcessingOptions = {}
): Promise<ImageProcessingResult> {
  const {
    quality,
    width,
    height,
    fit = 'cover',
    format = 'jpeg',
    generateResponsive = true,
    generateFormats = true,
  } = options;

  // Get image metadata
  const metadata = await sharp(buffer).metadata();
  const originalWidth = metadata.width || 1920;
  const originalHeight = metadata.height || 1080;

  // Prepare base filename without extension
  const baseFilename = filename.replace(/\.[^/.]+$/, '');
  const uploadDir = join(process.cwd(), 'public', 'Images', 'optimized');

  // Ensure directory exists
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const result: ImageProcessingResult = {
    original: {
      url: '',
      width: originalWidth,
      height: originalHeight,
      format: format,
      size: 0,
    },
  };

  // Process original format
  const originalFilename = `${baseFilename}.${format}`;
  const originalPath = join(uploadDir, originalFilename);

  let pipeline = sharp(buffer);

  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit });
  }

  const originalBuffer = await pipeline
    .toFormat(format, { quality: quality || DEFAULT_QUALITY[format] })
    .toBuffer();

  await writeFile(originalPath, originalBuffer);

  result.original = {
    url: `/Images/optimized/${originalFilename}`,
    width: width || originalWidth,
    height: height || originalHeight,
    format: format,
    size: originalBuffer.length,
  };

  // Generate WebP version
  if (generateFormats) {
    const webpFilename = `${baseFilename}.webp`;
    const webpPath = join(uploadDir, webpFilename);

    const webpBuffer = await sharp(buffer)
      .resize(width, height, { fit })
      .webp({ quality: quality || DEFAULT_QUALITY.webp })
      .toBuffer();

    await writeFile(webpPath, webpBuffer);

    result.webp = {
      url: `/Images/optimized/${webpFilename}`,
      width: width || originalWidth,
      height: height || originalHeight,
      format: 'webp',
      size: webpBuffer.length,
    };

    // Generate AVIF version
    const avifFilename = `${baseFilename}.avif`;
    const avifPath = join(uploadDir, avifFilename);

    const avifBuffer = await sharp(buffer)
      .resize(width, height, { fit })
      .avif({ quality: quality || DEFAULT_QUALITY.avif })
      .toBuffer();

    await writeFile(avifPath, avifBuffer);

    result.avif = {
      url: `/Images/optimized/${avifFilename}`,
      width: width || originalWidth,
      height: height || originalHeight,
      format: 'avif',
      size: avifBuffer.length,
    };
  }

  // Generate responsive sizes
  if (generateResponsive) {
    result.responsive = {
      small: await processResponsiveSize(
        buffer,
        baseFilename,
        uploadDir,
        RESPONSIVE_SIZES.small,
        format,
        quality
      ),
      medium: await processResponsiveSize(
        buffer,
        baseFilename,
        uploadDir,
        RESPONSIVE_SIZES.medium,
        format,
        quality
      ),
      large: await processResponsiveSize(
        buffer,
        baseFilename,
        uploadDir,
        RESPONSIVE_SIZES.large,
        format,
        quality
      ),
    };
  }

  return result;
}

/**
 * Process a single responsive size variant
 */
async function processResponsiveSize(
  buffer: Buffer,
  baseFilename: string,
  uploadDir: string,
  width: number,
  format: string,
  quality?: number
): Promise<ProcessedImage> {
  const filename = `${baseFilename}-${width}w.${format}`;
  const filepath = join(uploadDir, filename);

  const processedBuffer = await sharp(buffer)
    .resize(width, undefined, { fit: 'inside', withoutEnlargement: true })
    .toFormat(format, { quality: quality || DEFAULT_QUALITY[format] })
    .toBuffer();

  await writeFile(filepath, processedBuffer);

  const metadata = await sharp(processedBuffer).metadata();

  return {
    url: `/Images/optimized/${filename}`,
    width: metadata.width || width,
    height: metadata.height || 0,
    format: format,
    size: processedBuffer.length,
  };
}

/**
 * Compress an existing image without changing format
 */
export async function compressImage(
  buffer: Buffer,
  quality: number = 85
): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata();
  const format = (metadata.format || 'jpeg') as
    | 'jpeg'
    | 'png'
    | 'webp'
    | 'avif';

  return sharp(buffer).toFormat(format, { quality }).toBuffer();
}

/**
 * Generate thumbnail from image
 */
export async function generateThumbnail(
  buffer: Buffer,
  size: number = 200,
  quality: number = 75
): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, { fit: 'cover' })
    .webp({ quality })
    .toBuffer();
}

/**
 * Convert image to specific format
 */
export async function convertImageFormat(
  buffer: Buffer,
  targetFormat: 'jpeg' | 'png' | 'webp' | 'avif',
  quality?: number
): Promise<Buffer> {
  return sharp(buffer)
    .toFormat(targetFormat, {
      quality: quality || DEFAULT_QUALITY[targetFormat],
    })
    .toBuffer();
}

/**
 * Get image metadata
 */
export async function getImageMetadata(buffer: Buffer) {
  return sharp(buffer).metadata();
}

/**
 * Validate if buffer is a valid image
 */
export async function isValidImage(buffer: Buffer): Promise<boolean> {
  try {
    await sharp(buffer).metadata();
    return true;
  } catch {
    return false;
  }
}
