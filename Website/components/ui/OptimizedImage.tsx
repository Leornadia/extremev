'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';
import { responsiveSizes } from '@/lib/image-utils';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'sizes'> {
  src: string;
  alt: string;
  sizePreset?:
    | 'full'
    | 'hero'
    | 'gallery'
    | 'productCard'
    | 'feature'
    | 'thumbnail'
    | 'avatar';
  customSizes?: string;
  fallbackSrc?: string;
  onLoadingComplete?: () => void;
}

/**
 * OptimizedImage component with automatic format selection and responsive sizing
 *
 * Features:
 * - Automatic WebP/AVIF format selection based on browser support
 * - Responsive image sizing with predefined presets
 * - Lazy loading by default
 * - Blur placeholder support
 * - Error handling with fallback
 */
export function OptimizedImage({
  src,
  alt,
  sizePreset = 'full',
  customSizes,
  fallbackSrc,
  onLoadingComplete,
  priority = false,
  quality = 85,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false);

  // Use fallback if error occurred
  const imageSrc = error && fallbackSrc ? fallbackSrc : src;

  // Get sizes string
  const sizes = customSizes || responsiveSizes[sizePreset];

  const handleLoadingComplete = () => {
    onLoadingComplete?.();
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      sizes={sizes}
      quality={quality}
      priority={priority}
      onLoad={handleLoadingComplete}
      onError={handleError}
      {...props}
    />
  );
}

/**
 * Picture component for explicit format control with fallbacks
 */
interface PictureProps {
  src: string;
  webpSrc?: string;
  avifSrc?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function Picture({
  src,
  webpSrc,
  avifSrc,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
}: PictureProps) {
  return (
    <picture>
      {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
      {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading}
      />
    </picture>
  );
}

/**
 * Responsive picture component with multiple sizes
 */
interface ResponsivePictureProps {
  sources: {
    small: string;
    medium: string;
    large: string;
  };
  webpSources?: {
    small: string;
    medium: string;
    large: string;
  };
  avifSources?: {
    small: string;
    medium: string;
    large: string;
  };
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ResponsivePicture({
  sources,
  webpSources,
  avifSources,
  alt,
  className,
  loading = 'lazy',
}: ResponsivePictureProps) {
  return (
    <picture>
      {/* AVIF sources */}
      {avifSources && (
        <>
          <source
            srcSet={avifSources.large}
            media="(min-width: 1024px)"
            type="image/avif"
          />
          <source
            srcSet={avifSources.medium}
            media="(min-width: 640px)"
            type="image/avif"
          />
          <source srcSet={avifSources.small} type="image/avif" />
        </>
      )}

      {/* WebP sources */}
      {webpSources && (
        <>
          <source
            srcSet={webpSources.large}
            media="(min-width: 1024px)"
            type="image/webp"
          />
          <source
            srcSet={webpSources.medium}
            media="(min-width: 640px)"
            type="image/webp"
          />
          <source srcSet={webpSources.small} type="image/webp" />
        </>
      )}

      {/* Fallback sources */}
      <source srcSet={sources.large} media="(min-width: 1024px)" />
      <source srcSet={sources.medium} media="(min-width: 640px)" />
      <img
        src={sources.small}
        alt={alt}
        className={className}
        loading={loading}
      />
    </picture>
  );
}
