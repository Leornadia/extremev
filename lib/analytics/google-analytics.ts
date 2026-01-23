/**
 * Google Analytics Integration
 *
 * Provides functions for tracking page views and events with Google Analytics 4
 */

import type { PageViewEvent, AnalyticsEvent } from './types';

// Check if GA is available
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Check if we're in production and GA is configured
export const isAnalyticsEnabled = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    !!GA_TRACKING_ID &&
    process.env.NODE_ENV === 'production'
  );
};

// Initialize gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

/**
 * Track page views
 */
export const pageview = (url: string, title?: string): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  const event: PageViewEvent = {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
  };

  window.gtag('config', GA_TRACKING_ID!, {
    page_path: url,
    page_title: title,
  });

  // Also send as event for better tracking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.gtag('event', 'page_view', event as any);
};

/**
 * Track custom events
 */
export const event = ({
  action,
  category,
  label,
  value,
  nonInteraction = false,
}: AnalyticsEvent): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    non_interaction: nonInteraction,
  });
};

/**
 * Track exceptions/errors
 */
export const exception = (description: string, fatal = false): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('event', 'exception', {
    description,
    fatal,
  });
};

/**
 * Track timing events (for performance monitoring)
 */
export const timing = (
  category: string,
  variable: string,
  value: number,
  label?: string
): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('event', 'timing_complete', {
    name: variable,
    value: value,
    event_category: category,
    event_label: label,
  });
};

/**
 * Set user properties
 */
export const setUserProperties = (
  properties: Record<string, string | number | boolean>
): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Set user ID for cross-device tracking
 */
export const setUserId = (userId: string): void => {
  if (!isAnalyticsEnabled() || !window.gtag) return;

  window.gtag('config', GA_TRACKING_ID!, {
    user_id: userId,
  });
};
