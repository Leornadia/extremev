/**
 * Mobile Performance Optimizer Component
 * Applies mobile-specific optimizations when mounted
 */

'use client';

import { useEffect } from 'react';
import {
  useViewportHeight,
  useTouchOptimization,
  useNetworkQuality,
} from '@/lib/hooks/useMobileDetection';
import { shouldReduceMotion } from '@/lib/utils/mobileOptimization';

interface MobilePerformanceOptimizerProps {
  children: React.ReactNode;
}

export function MobilePerformanceOptimizer({
  children,
}: MobilePerformanceOptimizerProps) {
  // Set viewport height CSS variable
  useViewportHeight();

  // Optimize touch interactions
  useTouchOptimization();

  // Monitor network quality
  const { isSlowConnection, saveData } = useNetworkQuality();

  useEffect(() => {
    // Add mobile-specific classes to body
    document.body.classList.add('mobile-optimized');

    // Apply performance optimizations based on network
    if (isSlowConnection || saveData) {
      document.body.classList.add('slow-connection');
    } else {
      document.body.classList.remove('slow-connection');
    }

    // Apply reduced motion if preferred
    if (shouldReduceMotion()) {
      document.body.classList.add('reduce-motion');
    }

    return () => {
      document.body.classList.remove(
        'mobile-optimized',
        'slow-connection',
        'reduce-motion'
      );
    };
  }, [isSlowConnection, saveData]);

  return <>{children}</>;
}
