'use client';

/**
 * Analytics Provider Component
 *
 * Handles route change tracking and initializes analytics
 */

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/analytics/google-analytics';
import { observeLongTasks } from '@/lib/analytics/performance';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    // Initialize performance monitoring
    observeLongTasks();
  }, []);

  return <>{children}</>;
}
