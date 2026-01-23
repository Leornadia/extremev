/**
 * Mobile Detection and Optimization Hooks
 * Provides utilities for detecting mobile devices and optimizing mobile experience
 */

import { useState, useEffect } from 'react';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouchDevice: boolean;
  screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Hook to detect device type and characteristics
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouchDevice: false,
        screenSize: 'lg',
        orientation: 'landscape',
        viewportWidth: 1024,
        viewportHeight: 768,
      };
    }

    return getDeviceInfo();
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    const handleOrientationChange = () => {
      // Delay to ensure dimensions are updated
      setTimeout(() => {
        setDeviceInfo(getDeviceInfo());
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}

/**
 * Get current device information
 */
function getDeviceInfo(): DeviceInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - legacy property
    navigator.msMaxTouchPoints > 0;

  // Determine screen size based on Tailwind breakpoints
  let screenSize: DeviceInfo['screenSize'] = 'xs';
  if (width >= 1536) screenSize = '2xl';
  else if (width >= 1280) screenSize = 'xl';
  else if (width >= 1024) screenSize = 'lg';
  else if (width >= 768) screenSize = 'md';
  else if (width >= 640) screenSize = 'sm';

  // Determine device type
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  // Determine orientation
  const orientation: DeviceInfo['orientation'] =
    width > height ? 'landscape' : 'portrait';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    screenSize,
    orientation,
    viewportWidth: width,
    viewportHeight: height,
  };
}

/**
 * Hook to detect if user is on a mobile device (simplified)
 */
export function useIsMobile(): boolean {
  const { isMobile } = useDeviceDetection();
  return isMobile;
}

/**
 * Hook to detect if device supports touch
 */
export function useIsTouchDevice(): boolean {
  const { isTouchDevice } = useDeviceDetection();
  return isTouchDevice;
}

/**
 * Hook to get current screen orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const { orientation } = useDeviceDetection();
  return orientation;
}

/**
 * Hook to optimize touch interactions
 */
export function useTouchOptimization() {
  const { isTouchDevice } = useDeviceDetection();

  useEffect(() => {
    if (!isTouchDevice) return;

    // Prevent double-tap zoom on buttons and interactive elements
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventDoubleTapZoom, {
      passive: false,
    });

    return () => {
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, [isTouchDevice]);

  return {
    isTouchDevice,
    // Minimum touch target size (44x44px per WCAG)
    minTouchTarget: 44,
  };
}

/**
 * Hook to handle viewport height issues on mobile (address bar)
 */
export function useViewportHeight() {
  useEffect(() => {
    const setVH = () => {
      // Set CSS custom property for actual viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);
}

/**
 * Hook to detect network connection quality
 */
export function useNetworkQuality() {
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [effectiveType, setEffectiveType] = useState<string>('4g');
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    // @ts-ignore - Network Information API
    const connection =
      // @ts-ignore
      navigator.connection ||
      // @ts-ignore
      navigator.mozConnection ||
      // @ts-ignore
      navigator.webkitConnection;

    if (!connection) return;

    const updateConnectionInfo = () => {
      setConnectionType(connection.type || 'unknown');
      setEffectiveType(connection.effectiveType || '4g');
      setSaveData(connection.saveData || false);
    };

    updateConnectionInfo();
    connection.addEventListener('change', updateConnectionInfo);

    return () => {
      connection.removeEventListener('change', updateConnectionInfo);
    };
  }, []);

  return {
    connectionType,
    effectiveType,
    saveData,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g',
  };
}
