/**
 * Performance Monitoring
 *
 * Tracks Core Web Vitals and custom performance metrics
 */

import { timing } from './google-analytics';
import type { PerformanceMetric } from './types';

/**
 * Report Web Vitals to Google Analytics
 */
export const reportWebVitals = (metric: PerformanceMetric): void => {
  // Send to Google Analytics
  timing(
    'Web Vitals',
    metric.name,
    Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric.id
  );

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Performance]', metric.name, metric.value, metric.rating);
  }
};

/**
 * Track custom performance metrics
 */
export const trackPerformance = (
  metricName: string,
  duration: number
): void => {
  timing('Custom Performance', metricName, Math.round(duration));
};

/**
 * Track 3D model loading time
 */
export const track3DModelLoad = (modelName: string, loadTime: number): void => {
  timing('3D Performance', '3D Model Load', Math.round(loadTime), modelName);
};

/**
 * Track page load time
 */
export const trackPageLoad = (pageName: string): void => {
  if (typeof window === 'undefined') return;

  // Use Navigation Timing API
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

  if (pageLoadTime > 0) {
    timing('Page Load', pageName, pageLoadTime);
  }
};

/**
 * Track API response time
 */
export const trackAPICall = (
  endpoint: string,
  duration: number,
  success: boolean
): void => {
  timing(
    'API Performance',
    endpoint,
    Math.round(duration),
    success ? 'Success' : 'Failed'
  );
};

/**
 * Track configurator render time
 */
export const trackConfiguratorRender = (
  viewMode: '2D' | '3D',
  renderTime: number
): void => {
  timing(
    'Configurator Performance',
    `${viewMode} Render`,
    Math.round(renderTime)
  );
};

/**
 * Track image optimization metrics
 */
export const trackImageLoad = (
  imageUrl: string,
  loadTime: number,
  fileSize?: number
): void => {
  timing('Image Performance', 'Image Load', Math.round(loadTime), imageUrl);

  if (fileSize) {
    timing(
      'Image Performance',
      'Image Size',
      Math.round(fileSize / 1024),
      imageUrl
    );
  }
};

/**
 * Performance observer for long tasks
 */
export const observeLongTasks = (): void => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window))
    return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Report long tasks (> 50ms)
        if (entry.duration > 50) {
          timing(
            'Long Tasks',
            'Task Duration',
            Math.round(entry.duration),
            entry.name
          );
        }
      }
    });

    observer.observe({ entryTypes: ['longtask'] });
  } catch (error) {
    // PerformanceObserver not supported or error occurred
    console.warn('Long task observation not supported:', error);
  }
};

/**
 * Measure and track a function execution time
 */
export const measurePerformance = async <T>(
  name: string,
  fn: () => Promise<T> | T
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    trackPerformance(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    trackPerformance(`${name} (Error)`, duration);
    throw error;
  }
};

/**
 * Track memory usage (if available)
 */
export const trackMemoryUsage = (): void => {
  if (typeof window === 'undefined') return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = (performance as unknown as { memory: any }).memory;

  if (memory) {
    timing(
      'Memory',
      'Used JS Heap',
      Math.round(memory.usedJSHeapSize / 1048576)
    ); // MB
    timing(
      'Memory',
      'Total JS Heap',
      Math.round(memory.totalJSHeapSize / 1048576)
    ); // MB
  }
};
