/**
 * Mobile Testing Utilities
 * Provides utilities for testing mobile functionality
 */

/**
 * Simulate touch events for testing
 */
export function simulateTouchEvent(
  element: HTMLElement,
  eventType: 'touchstart' | 'touchmove' | 'touchend',
  options: {
    clientX?: number;
    clientY?: number;
    pageX?: number;
    pageY?: number;
  } = {}
) {
  const touch = new Touch({
    identifier: Date.now(),
    target: element,
    clientX: options.clientX || 0,
    clientY: options.clientY || 0,
    pageX: options.pageX || 0,
    pageY: options.pageY || 0,
    screenX: options.clientX || 0,
    screenY: options.clientY || 0,
    radiusX: 2.5,
    radiusY: 2.5,
    rotationAngle: 0,
    force: 0.5,
  });

  const touchEvent = new TouchEvent(eventType, {
    cancelable: true,
    bubbles: true,
    touches: [touch],
    targetTouches: [touch],
    changedTouches: [touch],
  });

  element.dispatchEvent(touchEvent);
}

/**
 * Simulate swipe gesture
 */
export function simulateSwipe(
  element: HTMLElement,
  direction: 'left' | 'right' | 'up' | 'down',
  distance: number = 100
) {
  const startX = 100;
  const startY = 100;
  let endX = startX;
  let endY = startY;

  switch (direction) {
    case 'left':
      endX = startX - distance;
      break;
    case 'right':
      endX = startX + distance;
      break;
    case 'up':
      endY = startY - distance;
      break;
    case 'down':
      endY = startY + distance;
      break;
  }

  simulateTouchEvent(element, 'touchstart', {
    clientX: startX,
    clientY: startY,
  });

  simulateTouchEvent(element, 'touchmove', {
    clientX: endX,
    clientY: endY,
  });

  simulateTouchEvent(element, 'touchend', {
    clientX: endX,
    clientY: endY,
  });
}

/**
 * Set viewport size for testing
 */
export function setViewportSize(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  window.dispatchEvent(new Event('resize'));
}

/**
 * Mobile viewport presets
 */
export const MOBILE_VIEWPORTS = {
  iphoneSE: { width: 375, height: 667 },
  iphone12: { width: 390, height: 844 },
  iphone12ProMax: { width: 428, height: 926 },
  pixel5: { width: 393, height: 851 },
  samsungGalaxyS20: { width: 360, height: 800 },
  ipadMini: { width: 768, height: 1024 },
  ipadAir: { width: 820, height: 1180 },
  ipadPro: { width: 1024, height: 1366 },
};

/**
 * Test if element meets minimum touch target size
 */
export function meetsMinimumTouchTarget(
  element: HTMLElement,
  minSize: number = 44
): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= minSize && rect.height >= minSize;
}

/**
 * Test if text is readable on mobile (minimum font size)
 */
export function hasReadableFontSize(
  element: HTMLElement,
  minSize: number = 16
): boolean {
  const fontSize = window.getComputedStyle(element).fontSize;
  const fontSizeValue = parseFloat(fontSize);
  return fontSizeValue >= minSize;
}

/**
 * Test if element is scrollable
 */
export function isScrollable(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const overflowX = style.overflowX;

  return (
    overflowY === 'scroll' ||
    overflowY === 'auto' ||
    overflowX === 'scroll' ||
    overflowX === 'auto'
  );
}

/**
 * Test if element has momentum scrolling enabled (iOS)
 */
export function hasMomentumScrolling(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  // @ts-expect-error - webkitOverflowScrolling is non-standard
  return style.webkitOverflowScrolling === 'touch';
}

/**
 * Measure tap delay
 */
export async function measureTapDelay(element: HTMLElement): Promise<number> {
  const startTime = performance.now();

  return new Promise((resolve) => {
    const handleClick = () => {
      const endTime = performance.now();
      const delay = endTime - startTime;
      element.removeEventListener('click', handleClick);
      resolve(delay);
    };

    element.addEventListener('click', handleClick);
    element.click();
  });
}

/**
 * Test if page is mobile-friendly
 */
export interface MobileFriendlinessReport {
  hasViewportMeta: boolean;
  hasMinimumFontSize: boolean;
  hasTouchTargets: boolean;
  hasResponsiveImages: boolean;
  hasNoHorizontalScroll: boolean;
  score: number;
}

export function testMobileFriendliness(): MobileFriendlinessReport {
  const report: MobileFriendlinessReport = {
    hasViewportMeta: false,
    hasMinimumFontSize: true,
    hasTouchTargets: true,
    hasResponsiveImages: true,
    hasNoHorizontalScroll: true,
    score: 0,
  };

  // Check viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  report.hasViewportMeta = !!viewportMeta;

  // Check font sizes
  const textElements = document.querySelectorAll('p, span, a, button, input');
  textElements.forEach((el) => {
    if (!hasReadableFontSize(el as HTMLElement, 16)) {
      report.hasMinimumFontSize = false;
    }
  });

  // Check touch targets
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea'
  );
  interactiveElements.forEach((el) => {
    if (!meetsMinimumTouchTarget(el as HTMLElement)) {
      report.hasTouchTargets = false;
    }
  });

  // Check for horizontal scroll
  report.hasNoHorizontalScroll =
    document.documentElement.scrollWidth <= window.innerWidth;

  // Check responsive images
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    const style = window.getComputedStyle(img);
    if (style.maxWidth !== '100%' && !img.hasAttribute('srcset')) {
      report.hasResponsiveImages = false;
    }
  });

  // Calculate score
  const checks = [
    report.hasViewportMeta,
    report.hasMinimumFontSize,
    report.hasTouchTargets,
    report.hasResponsiveImages,
    report.hasNoHorizontalScroll,
  ];
  report.score = (checks.filter(Boolean).length / checks.length) * 100;

  return report;
}

/**
 * Test orientation change handling
 */
export function testOrientationChange(
  callback: (orientation: 'portrait' | 'landscape') => void
) {
  const handleOrientationChange = () => {
    const orientation =
      window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    callback(orientation);
  };

  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);

  return () => {
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('resize', handleOrientationChange);
  };
}

/**
 * Performance metrics for mobile
 */
export interface MobilePerformanceMetrics {
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

export function getMobilePerformanceMetrics(): Promise<MobilePerformanceMetrics> {
  return new Promise((resolve) => {
    const metrics: Partial<MobilePerformanceMetrics> = {};

    // Get FCP and LCP from Performance Observer
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pEntry = entry as any;
          if (
            entry.entryType === 'paint' &&
            entry.name === 'first-contentful-paint'
          ) {
            metrics.firstContentfulPaint = entry.startTime;
          }
          if (entry.entryType === 'largest-contentful-paint') {
            metrics.largestContentfulPaint = entry.startTime;
          }
          if (entry.entryType === 'first-input') {
            metrics.firstInputDelay = pEntry.processingStart - entry.startTime;
          }
          if (entry.entryType === 'layout-shift') {
            metrics.cumulativeLayoutShift =
              (metrics.cumulativeLayoutShift || 0) + pEntry.value;
          }
        }
      });

      observer.observe({
        entryTypes: [
          'paint',
          'largest-contentful-paint',
          'first-input',
          'layout-shift',
        ],
      });

      // Resolve after a delay to collect metrics
      setTimeout(() => {
        observer.disconnect();
        resolve(metrics as MobilePerformanceMetrics);
      }, 5000);
    } else {
      resolve({
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        timeToInteractive: 0,
      });
    }
  });
}
