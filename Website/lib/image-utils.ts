/**
 * Utility functions for image optimization and responsive sizing
 */

/**
 * Generate responsive sizes string for Next.js Image component
 *
 * @param config - Configuration object for responsive sizes
 * @returns Sizes string for Next.js Image component
 */
export function generateResponsiveSizes(config: {
  mobile?: string;
  tablet?: string;
  desktop?: string;
  default?: string;
}): string {
  const {
    mobile = '100vw',
    tablet = '50vw',
    desktop = '33vw',
    default: defaultSize = '100vw',
  } = config;

  return `(max-width: 640px) ${mobile}, (max-width: 1024px) ${tablet}, ${desktop || defaultSize}`;
}

/**
 * Predefined responsive size configurations for common use cases
 */
export const responsiveSizes = {
  // Full width on all devices
  full: '100vw',

  // Hero images - full width on mobile, large on desktop
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px',

  // Gallery grid - 1 column mobile, 2 tablet, 3 desktop
  gallery: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',

  // Product cards - 1 column mobile, 2 tablet, 3-4 desktop
  productCard: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',

  // Feature images - full mobile, half tablet/desktop
  feature: '(max-width: 768px) 100vw, 50vw',

  // Thumbnails - small fixed sizes
  thumbnail: '(max-width: 640px) 150px, 200px',

  // Avatar/icon - very small fixed sizes
  avatar: '(max-width: 640px) 48px, 64px',
};

/**
 * Get optimal image quality based on image type
 *
 * @param type - Type of image
 * @returns Quality value (1-100)
 */
export function getOptimalQuality(
  type: 'hero' | 'product' | 'thumbnail' | 'background' | 'default'
): number {
  const qualityMap = {
    hero: 90, // High quality for hero images
    product: 85, // Good quality for product images
    thumbnail: 75, // Lower quality for thumbnails
    background: 70, // Lower quality for backgrounds
    default: 80, // Default quality
  };

  return qualityMap[type] || qualityMap.default;
}

/**
 * Check if an image should be loaded with priority
 *
 * @param position - Position of image on page
 * @returns Whether to use priority loading
 */
export function shouldUsePriority(
  position: 'above-fold' | 'below-fold' | 'hero'
): boolean {
  return position === 'above-fold' || position === 'hero';
}

/**
 * Generate blur data URL for placeholder
 * This is a simple implementation - in production, you might generate actual blur hashes
 *
 * @param width - Width of placeholder
 * @param height - Height of placeholder
 * @returns Data URL for blur placeholder
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10
): string {
  // Simple gray gradient as placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgb(240,240,240);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(220,220,220);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Get optimized image URL based on format support
 * Returns the best format URL available
 *
 * @param urls - Object containing different format URLs
 * @returns Best available image URL
 */
export function getOptimizedImageUrl(urls: {
  original: string;
  webp?: string;
  avif?: string;
}): string {
  // In a real implementation, you would check browser support
  // For now, prefer AVIF > WebP > Original
  return urls.avif || urls.webp || urls.original;
}

/**
 * Get responsive image srcset string
 *
 * @param urls - Object containing responsive image URLs
 * @returns srcset string for responsive images
 */
export function getResponsiveSrcSet(urls: {
  small: string;
  medium: string;
  large: string;
}): string {
  return `${urls.small} 640w, ${urls.medium} 1024w, ${urls.large} 1920w`;
}

/**
 * Build picture element sources for multiple formats
 *
 * @param sources - Object containing format-specific URLs
 * @returns Array of source elements data
 */
export function buildPictureSources(sources: {
  avif?: { small: string; medium: string; large: string };
  webp?: { small: string; medium: string; large: string };
  fallback: { small: string; medium: string; large: string };
}) {
  const result = [];

  if (sources.avif) {
    result.push({
      type: 'image/avif',
      srcset: getResponsiveSrcSet(sources.avif),
    });
  }

  if (sources.webp) {
    result.push({
      type: 'image/webp',
      srcset: getResponsiveSrcSet(sources.webp),
    });
  }

  result.push({
    type: 'image/jpeg',
    srcset: getResponsiveSrcSet(sources.fallback),
  });

  return result;
}
