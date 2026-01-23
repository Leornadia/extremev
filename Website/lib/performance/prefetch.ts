'use client';

/**
 * Route Prefetching Utilities
 *
 * Implements intelligent prefetching strategies to improve perceived performance
 * by loading pages before users navigate to them.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prefetch routes based on user behavior
 */
export function usePrefetchRoutes(routes: string[]) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch routes after a short delay to avoid blocking initial render
    const timeoutId = setTimeout(() => {
      routes.forEach((route) => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [router, routes]);
}

/**
 * Prefetch route on link hover
 */
export function usePrefetchOnHover(href: string) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(href);
  };

  return { onMouseEnter: handleMouseEnter };
}

/**
 * Prefetch critical routes for the application
 */
export function usePrefetchCriticalRoutes() {
  usePrefetchRoutes(['/products', '/configurator', '/gallery', '/contact']);
}

/**
 * Prefetch routes based on viewport intersection
 */
export function usePrefetchOnVisible(
  href: string,
  ref: React.RefObject<HTMLElement>
) {
  const router = useRouter();

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            router.prefetch(href);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [href, ref, router]);
}

/**
 * Prefetch data for a route
 */
export async function prefetchData(url: string) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to prefetch: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Prefetch failed:', error);
    return null;
  }
}

/**
 * Prefetch product data when hovering over product cards
 */
export function usePrefetchProductData(productSlug: string | null) {
  useEffect(() => {
    if (!productSlug) return;

    const timeoutId = setTimeout(() => {
      prefetchData(`/api/products/${productSlug}`);
    }, 300); // Debounce to avoid excessive requests

    return () => clearTimeout(timeoutId);
  }, [productSlug]);
}

/**
 * Prefetch components data for configurator
 */
export function usePrefetchConfiguratorData() {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      prefetchData('/api/components');
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);
}

/**
 * Setup global prefetching based on user navigation patterns
 */
export function setupIntelligentPrefetching() {
  if (typeof window === 'undefined') return;

  // Track user navigation patterns
  const navigationHistory: string[] = [];
  let lastPath = window.location.pathname;

  // Observe navigation changes
  const observer = new MutationObserver(() => {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      navigationHistory.push(currentPath);
      lastPath = currentPath;

      // Predict next route based on common patterns
      predictAndPrefetch(navigationHistory);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => observer.disconnect();
}

/**
 * Predict and prefetch likely next routes
 */
function predictAndPrefetch(history: string[]) {
  const lastRoute = history[history.length - 1];

  // Common navigation patterns
  const patterns: Record<string, string[]> = {
    '/': ['/products', '/configurator', '/gallery'],
    '/products': ['/configurator', '/products/'],
    '/gallery': ['/configurator', '/contact'],
    '/configurator': ['/auth/signin', '/dashboard'],
  };

  const routesToPrefetch = patterns[lastRoute] || [];

  // Use requestIdleCallback to prefetch during idle time
  if ('requestIdleCallback' in window) {
    const win = window as Window & {
      requestIdleCallback: (callback: () => void) => void;
    };
    win.requestIdleCallback(() => {
      routesToPrefetch.forEach((route) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    });
  }
}

/**
 * Prefetch images that are likely to be viewed
 */
export function prefetchImages(imageUrls: string[]) {
  if (typeof window === 'undefined') return;

  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch critical assets on page load
 */
export function prefetchCriticalAssets() {
  if (typeof window === 'undefined') return;

  // Prefetch hero images
  const heroImages = [
    '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
    '/images/Outdoor%20Wooden%20Climbing%20Frame%20with%20Rock%20Wall%20and%20Monkey%20Bars.webp',
  ];

  // Use requestIdleCallback to avoid blocking main thread
  if ('requestIdleCallback' in window) {
    const win = window as Window & {
      requestIdleCallback: (callback: () => void) => void;
    };
    win.requestIdleCallback(() => {
      prefetchImages(heroImages);
    });
  } else {
    setTimeout(() => prefetchImages(heroImages), 1000);
  }
}
