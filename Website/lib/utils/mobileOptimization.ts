/**
 * Mobile Optimization Utilities
 * Provides utilities for optimizing mobile experience
 */

/**
 * Prevent iOS rubber band scrolling on specific elements
 */
export function preventOverscroll(element: HTMLElement) {
  let startY = 0;

  const touchStart = (e: TouchEvent) => {
    startY = e.touches[0].pageY;
  };

  const touchMove = (e: TouchEvent) => {
    const y = e.touches[0].pageY;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const height = element.clientHeight;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + height >= scrollHeight;

    // Prevent overscroll at boundaries
    if ((isAtTop && y > startY) || (isAtBottom && y < startY)) {
      e.preventDefault();
    }
  };

  element.addEventListener('touchstart', touchStart, { passive: true });
  element.addEventListener('touchmove', touchMove, { passive: false });

  return () => {
    element.removeEventListener('touchstart', touchStart);
    element.removeEventListener('touchmove', touchMove);
  };
}

/**
 * Optimize touch event handling with passive listeners
 */
export function addPassiveTouchListener(
  element: HTMLElement,
  event: string,
  handler: EventListener
) {
  element.addEventListener(event, handler, { passive: true });
  return () => element.removeEventListener(event, handler);
}

/**
 * Debounce scroll events for better performance
 */
export function debounceScroll(
  callback: () => void,
  delay: number = 100
): () => void {
  let timeoutId: NodeJS.Timeout;
  let ticking = false;

  return () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
}

/**
 * Check if element is in viewport (optimized for mobile)
 */
export function isInViewport(
  element: HTMLElement,
  threshold: number = 0
): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView =
    rect.top <= windowHeight - threshold && rect.top + rect.height >= threshold;
  const horInView =
    rect.left <= windowWidth - threshold && rect.left + rect.width >= threshold;

  return vertInView && horInView;
}

/**
 * Optimize images for mobile devices
 */
export function getOptimizedImageUrl(
  url: string,
  width: number,
  quality: number = 75
): string {
  // If using Next.js Image Optimization API
  if (url.startsWith('/')) {
    return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
  }
  return url;
}

/**
 * Detect if device is in standalone mode (PWA)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    // @ts-expect-error - navigator.standalone is non-standard
    window.navigator.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches
  );
}

/**
 * Get safe area insets for devices with notches
 */
export function getSafeAreaInsets() {
  if (typeof window === 'undefined') {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  const style = getComputedStyle(document.documentElement);

  return {
    top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
    right: parseInt(
      style.getPropertyValue('env(safe-area-inset-right)') || '0'
    ),
    bottom: parseInt(
      style.getPropertyValue('env(safe-area-inset-bottom)') || '0'
    ),
    left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
  };
}

/**
 * Optimize animations for mobile performance
 */
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Handle mobile keyboard visibility
 */
export function onKeyboardVisibilityChange(
  callback: (visible: boolean) => void
): () => void {
  if (typeof window === 'undefined') return () => { };

  const initialHeight = window.innerHeight;

  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const keyboardVisible = currentHeight < initialHeight * 0.75;
    callback(keyboardVisible);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}

/**
 * Optimize touch target size
 */
export function ensureMinimumTouchTarget(size: number): string {
  const minSize = 44; // WCAG minimum
  return `${Math.max(size, minSize)}px`;
}

/**
 * Detect if user is on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Detect if user is on Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * Get device pixel ratio for high-DPI displays
 */
export function getDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  return window.devicePixelRatio || 1;
}

/**
 * Optimize scroll performance with momentum scrolling
 */
export function enableMomentumScrolling(element: HTMLElement) {
  // @ts-expect-error - webkitOverflowScrolling is non-standard
  element.style.webkitOverflowScrolling = 'touch';
  element.style.overflowY = 'auto';
}

/**
 * Prevent zoom on input focus (iOS)
 */
export function preventInputZoom() {
  if (!isIOS()) return;

  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    const content = viewport.getAttribute('content');
    viewport.setAttribute(
      'content',
      `${content}, maximum-scale=1.0, user-scalable=no`
    );
  }
}

/**
 * Allow zoom after input blur (iOS)
 */
export function allowInputZoom() {
  if (!isIOS()) return;

  const viewport = document.querySelector('meta[name=viewport]');
  if (viewport) {
    const content = viewport.getAttribute('content');
    const newContent = content
      ?.replace(', maximum-scale=1.0', '')
      .replace(', user-scalable=no', '');
    if (newContent) {
      viewport.setAttribute('content', newContent);
    }
  }
}
