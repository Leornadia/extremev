/**
 * Upload service with automatic image optimization
 * Handles file uploads with automatic format conversion and responsive image generation
 */

import {
  processImage,
  generateThumbnail,
  isValidImage,
  type ImageProcessingOptions,
  type ImageProcessingResult,
} from './imageProcessor';

export interface UploadOptions extends ImageProcessingOptions {
  generateThumbnail?: boolean;
  thumbnailSize?: number;
}

export interface UploadResult {
  success: boolean;
  data?: ImageProcessingResult & {
    thumbnail?: string;
  };
  error?: string;
}

/**
 * Upload and optimize an image with automatic processing
 */
export async function uploadAndOptimizeImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate image
    const isValid = await isValidImage(buffer);
    if (!isValid) {
      return {
        success: false,
        error: 'Invalid image file',
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    const sanitizedName = nameWithoutExt
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase();
    const uniqueFilename = `${sanitizedName}-${timestamp}-${randomString}.${extension}`;

    // Process image with all optimizations
    const result = await processImage(buffer, uniqueFilename, {
      generateResponsive: true,
      generateFormats: true,
      ...options,
    });

    // Generate thumbnail if requested
    let thumbnailUrl: string | undefined;
    if (options.generateThumbnail) {
      const thumbnailBuffer = await generateThumbnail(
        buffer,
        options.thumbnailSize || 200
      );

      // Save thumbnail
      const { writeFile, mkdir } = await import('fs/promises');
      const { join } = await import('path');
      const { existsSync } = await import('fs');

      const thumbnailDir = join(
        process.cwd(),
        'public',
        'Images',
        'thumbnails'
      );
      if (!existsSync(thumbnailDir)) {
        await mkdir(thumbnailDir, { recursive: true });
      }

      const thumbnailFilename = `${sanitizedName}-${timestamp}-${randomString}-thumb.webp`;
      const thumbnailPath = join(thumbnailDir, thumbnailFilename);
      await writeFile(thumbnailPath, thumbnailBuffer);

      thumbnailUrl = `/Images/thumbnails/${thumbnailFilename}`;
    }

    return {
      success: true,
      data: {
        ...result,
        thumbnail: thumbnailUrl,
      },
    };
  } catch (error) {
    console.error('Error uploading and optimizing image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get optimal quality based on image type
 */
export function getOptimalQuality(
  type: 'hero' | 'product' | 'thumbnail' | 'background' | 'default'
): number {
  const qualityMap = {
    hero: 90,
    product: 85,
    thumbnail: 75,
    background: 70,
    default: 80,
  };

  return qualityMap[type] || qualityMap.default;
}

/**
 * Get recommended processing options for different image types
 */
export function getRecommendedOptions(
  type: 'hero' | 'product' | 'gallery' | 'thumbnail' | 'avatar'
): UploadOptions {
  const optionsMap: Record<string, UploadOptions> = {
    hero: {
      quality: 90,
      width: 1920,
      generateResponsive: true,
      generateFormats: true,
      generateThumbnail: false,
    },
    product: {
      quality: 85,
      width: 1200,
      generateResponsive: true,
      generateFormats: true,
      generateThumbnail: true,
      thumbnailSize: 300,
    },
    gallery: {
      quality: 85,
      width: 1200,
      generateResponsive: true,
      generateFormats: true,
      generateThumbnail: true,
      thumbnailSize: 200,
    },
    thumbnail: {
      quality: 75,
      width: 400,
      generateResponsive: false,
      generateFormats: true,
      generateThumbnail: false,
    },
    avatar: {
      quality: 80,
      width: 200,
      height: 200,
      fit: 'cover',
      generateResponsive: false,
      generateFormats: true,
      generateThumbnail: false,
    },
  };

  return optionsMap[type] || optionsMap.product;
}
