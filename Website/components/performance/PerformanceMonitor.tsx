'use client';

/**
 * Performance Monitor Component
 *
 * Monitors and reports performance metrics including Core Web Vitals.
 * Integrates with analytics to track real user performance.
 */

import { useEffect } from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined' || typeof document === 'undefined')
      return;

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;

        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        reportMetric({
          name: 'LCP',
          value: lcp,
          rating:
            lcp <= 2500 ? 'good' : lcp <= 4000 ? 'needs-improvement' : 'poor',
        });
      });

      try {
        lcpObserver.observe({
          type: 'largest-contentful-paint',
          buffered: true,
        });
      } catch (e) {
        // LCP not supported
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;
          reportMetric({
            name: 'FID',
            value: fid,
            rating:
              fid <= 100 ? 'good' : fid <= 300 ? 'needs-improvement' : 'poor',
          });
        });
      });

      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        // FID not supported
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // CLS not supported
      }

      // Report CLS on page hide
      const reportCLS = () => {
        reportMetric({
          name: 'CLS',
          value: clsValue,
          rating:
            clsValue <= 0.1
              ? 'good'
              : clsValue <= 0.25
                ? 'needs-improvement'
                : 'poor',
        });
      };

      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportCLS();
        }
      });

      // Fallback: Monitor basic performance metrics
      const monitorBasicMetrics = () => {
        const perf = window.performance as Performance & {
          timing?: PerformanceTiming;
        };

        if (!perf || !perf.timing) return;

        const timing = perf.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domContentLoaded =
          timing.domContentLoadedEventEnd - timing.navigationStart;
        const firstPaint = perf
          .getEntriesByType('paint')
          .find((entry) => entry.name === 'first-contentful-paint');

        console.log('Performance Metrics:', {
          loadTime: `${loadTime}ms`,
          domContentLoaded: `${domContentLoaded}ms`,
          firstPaint: firstPaint ? `${firstPaint.startTime}ms` : 'N/A',
        });
      };

      const handleLoad = () => {
        setTimeout(monitorBasicMetrics, 0);
      };

      window.addEventListener('load', handleLoad);

      // Cleanup
      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Report metric to analytics
 */
function reportMetric(metric: PerformanceMetric) {
  console.log(`[Performance] ${metric.name}:`, {
    value: `${Math.round(metric.value)}ms`,
    rating: metric.rating,
  });

  // Send to analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      value: Math.round(metric.value),
      event_label: metric.rating,
      non_interaction: true,
    });
  }

  // Send to Vercel Analytics
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', {
      name: metric.name,
      data: {
        value: metric.value,
        rating: metric.rating,
      },
    });
  }
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !('performance' in window)) {
    return null;
  }

  const timing = window.performance.timing;
  const navigation = window.performance.navigation;

  return {
    // Navigation timing
    navigationStart: timing.navigationStart,
    redirectTime: timing.redirectEnd - timing.redirectStart,
    dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
    tcpTime: timing.connectEnd - timing.connectStart,
    requestTime: timing.responseStart - timing.requestStart,
    responseTime: timing.responseEnd - timing.responseStart,
    domProcessingTime: timing.domComplete - timing.domLoading,
    loadTime: timing.loadEventEnd - timing.navigationStart,

    // Navigation type
    navigationType:
      navigation.type === 0
        ? 'navigate'
        : navigation.type === 1
          ? 'reload'
          : navigation.type === 2
            ? 'back_forward'
            : 'unknown',

    // Resource timing
    resources: performance.getEntriesByType('resource').length,
  };
}
