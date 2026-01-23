'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /**
   * Whether to freeze the observer after the first intersection
   * Useful for lazy loading that should only trigger once
   */
  freezeOnceVisible?: boolean;
  /**
   * Initial visibility state
   */
  initialIsIntersecting?: boolean;
}

/**
 * Custom hook for intersection observer
 * Useful for lazy loading, infinite scroll, and visibility tracking
 *
 * @param options - Intersection observer options
 * @returns Tuple of [ref, isIntersecting, entry]
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, boolean, IntersectionObserverEntry | null] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
    initialIsIntersecting = false,
  } = options;

  const elementRef = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(initialIsIntersecting);

  const frozen = freezeOnceVisible && isIntersecting;

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !element) {
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const [entry] = entries;
      setEntry(entry);
      setIsIntersecting(entry.isIntersecting);
    };

    const observerOptions: IntersectionObserverInit = {
      threshold,
      root,
      rootMargin,
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, threshold, root, rootMargin, frozen]);

  return [elementRef, isIntersecting, entry];
}

/**
 * Hook specifically for lazy loading content
 * Loads content when it's about to enter the viewport
 *
 * @param rootMargin - How far before entering viewport to trigger (default: 200px)
 * @returns Tuple of [ref, shouldLoad]
 */
export function useLazyLoad<T extends HTMLElement = HTMLDivElement>(
  rootMargin: string = '200px'
): [React.RefObject<T>, boolean] {
  const [ref, isIntersecting] = useIntersectionObserver<T>({
    rootMargin,
    freezeOnceVisible: true,
  });

  return [ref, isIntersecting];
}
