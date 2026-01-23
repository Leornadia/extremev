'use client';

import { ReactNode } from 'react';
import { useLazyLoad } from '@/lib/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Skeleton } from './Skeleton';

export interface LazyLoadProps {
  children: ReactNode;
  /**
   * Placeholder to show while content is not loaded
   */
  placeholder?: ReactNode;
  /**
   * How far before entering viewport to trigger loading (default: 200px)
   */
  rootMargin?: string;
  /**
   * Additional className for the wrapper
   */
  className?: string;
  /**
   * Minimum height to prevent layout shift
   */
  minHeight?: string | number;
  /**
   * Whether to use fade-in animation when content loads
   */
  fadeIn?: boolean;
}

/**
 * LazyLoad component for progressive content loading
 *
 * Wraps content and only renders it when it's about to enter the viewport.
 * Useful for heavy components, images, or content below the fold.
 *
 * @example
 * ```tsx
 * <LazyLoad placeholder={<Skeleton />} minHeight="400px">
 *   <HeavyComponent />
 * </LazyLoad>
 * ```
 */
export function LazyLoad({
  children,
  placeholder,
  rootMargin = '200px',
  className,
  minHeight,
  fadeIn = true,
}: LazyLoadProps) {
  const [ref, shouldLoad] = useLazyLoad(rootMargin);

  const wrapperStyle = minHeight
    ? {
        minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
      }
    : undefined;

  // Default placeholder if none provided
  const defaultPlaceholder = (
    <div className="py-16">
      <Skeleton height="400px" variant="rounded" />
    </div>
  );

  return (
    <div
      ref={ref}
      className={cn(
        'lazy-load-wrapper',
        fadeIn && shouldLoad && 'animate-fadeIn',
        className
      )}
      style={wrapperStyle}
    >
      {shouldLoad ? children : placeholder || defaultPlaceholder}
    </div>
  );
}
