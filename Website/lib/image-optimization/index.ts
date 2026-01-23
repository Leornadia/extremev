/**
 * Image optimization module
 * Provides utilities for automatic image processing, format conversion, and optimization
 */

export {
  processImage,
  compressImage,
  generateThumbnail,
  convertImageFormat,
  getImageMetadata,
  isValidImage,
  type ImageProcessingOptions,
  type ImageProcessingResult,
  type ProcessedImage,
} from './imageProcessor';

export {
  uploadAndOptimizeImage,
  getRecommendedOptions,
  getOptimalQuality,
  type UploadOptions,
  type UploadResult,
} from './uploadService';
