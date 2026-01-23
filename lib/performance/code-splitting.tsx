'use client';

/**
 * Code Splitting Utilities
 *
 * Provides utilities for dynamic imports and code splitting to optimize bundle size.
 * Use these helpers to lazy-load heavy components and reduce initial page load.
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading component for lazy-loaded modules
 */
export const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
  </div>
);

/**
 * Error boundary fallback for lazy-loaded modules
 */
export const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-[200px] text-center p-4">
    <div>
      <p className="text-red-600 font-semibold mb-2">
        Failed to load component
      </p>
      <p className="text-sm text-neutral-600">{error.message}</p>
    </div>
  </div>
);

/**
 * Create a lazy-loaded component with loading and error states
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: ComponentType;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || LoadingFallback,
    ssr: options?.ssr ?? true,
  });
}

/**
 * Lazy-load heavy 3D components
 */
export const lazy3DComponents = {
  Canvas3D: lazyLoad(() => import('@/components/configurator/Canvas3D'), {
    ssr: false,
  }),
  Scene3D: lazyLoad(() => import('@/components/configurator/Scene3D'), {
    ssr: false,
  }),
  PlacedComponent3D: lazyLoad(
    () => import('@/components/configurator/PlacedComponent3D'),
    { ssr: false }
  ),
};

/**
 * Lazy-load admin components (not needed for most users)
 */
export const lazyAdminComponents = {
  AdminComponentsList: lazyLoad(
    () => import('@/components/admin/AdminComponentsList')
  ),
  AdminQuotesList: lazyLoad(() => import('@/components/admin/AdminQuotesList')),
  ComponentFormModal: lazyLoad(
    () => import('@/components/admin/ComponentFormModal')
  ),
  BulkPricingModal: lazyLoad(
    () => import('@/components/admin/BulkPricingModal')
  ),
  CategoryManagementModal: lazyLoad(
    () => import('@/components/admin/CategoryManagementModal')
  ),
};

/**
 * Lazy-load modal components (only loaded when opened)
 */
export const lazyModalComponents = {
  QuoteRequestModal: lazyLoad(
    () => import('@/components/configurator/QuoteRequestModal')
  ),
  SaveDesignModal: lazyLoad(
    () => import('@/components/configurator/SaveDesignModal')
  ),
  ComponentDetailsModal: lazyLoad(
    () => import('@/components/configurator/ComponentDetailsModal')
  ),
  QuickViewModal: lazyLoad(
    () => import('@/components/products/QuickViewModal')
  ),
  Lightbox: lazyLoad(() => import('@/components/gallery/Lightbox')),
};

/**
 * Preload a component before it's needed
 */
export function preloadComponent(importFn: () => Promise<any>) {
  // Trigger the import but don't wait for it
  importFn().catch((err) => {
    console.warn('Failed to preload component:', err);
  });
}

/**
 * Preload components on user interaction (hover, focus)
 */
export function setupPreloading() {
  if (typeof window === 'undefined') return;

  // Preload configurator when user hovers over "Design" links
  const designLinks = document.querySelectorAll('a[href*="/configurator"]');
  designLinks.forEach((link) => {
    link.addEventListener(
      'mouseenter',
      () => {
        preloadComponent(
          () => import('@/components/configurator/ConfiguratorLayout')
        );
      },
      { once: true }
    );
  });

  // Preload product pages when hovering over product cards
  const productLinks = document.querySelectorAll('a[href*="/products/"]');
  productLinks.forEach((link) => {
    link.addEventListener(
      'mouseenter',
      () => {
        preloadComponent(() => import('@/components/products/ImageCarousel'));
      },
      { once: true }
    );
  });
}

/**
 * Bundle size analysis helper
 */
export function logBundleInfo() {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      '💡 Code splitting active. Heavy components will be lazy-loaded.'
    );
  }
}
