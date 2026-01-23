/**
 * Service Worker Registration and Management
 *
 * Handles service worker registration, updates, and lifecycle management.
 */

/**
 * Register the service worker
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service workers not supported');
    return;
  }

  // Only register in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Service worker registration skipped in development');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service worker registered:', registration.scope);

      // Check for updates periodically
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000
      ); // Check every hour

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;

        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();

    for (const registration of registrations) {
      await registration.unregister();
      console.log('Service worker unregistered');
    }
  } catch (error) {
    console.error('Failed to unregister service worker:', error);
  }
}

/**
 * Clear all caches
 */
export async function clearCaches() {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();

    await Promise.all(cacheNames.map((name) => caches.delete(name)));

    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
}

/**
 * Show update notification to user
 */
function showUpdateNotification() {
  // Create a simple notification
  const notification = document.createElement('div');
  notification.className =
    'fixed bottom-4 right-4 bg-primary-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm';
  notification.innerHTML = `
    <div class="flex items-center gap-4">
      <div class="flex-1">
        <p class="font-semibold mb-1">Update Available</p>
        <p class="text-sm opacity-90">A new version is available. Refresh to update.</p>
      </div>
      <button 
        id="sw-refresh-btn"
        class="bg-white text-primary-600 px-4 py-2 rounded font-semibold hover:bg-neutral-100 transition-colors"
      >
        Refresh
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Handle refresh button
  const refreshBtn = document.getElementById('sw-refresh-btn');
  refreshBtn?.addEventListener('click', () => {
    window.location.reload();
  });

  // Auto-dismiss after 30 seconds
  setTimeout(() => {
    notification.remove();
  }, 30000);
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

/**
 * Get service worker registration
 */
export async function getServiceWorkerRegistration() {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    return await navigator.serviceWorker.getRegistration();
  } catch (error) {
    console.error('Failed to get service worker registration:', error);
    return null;
  }
}

/**
 * Check if app is running in offline mode
 */
export function isOffline(): boolean {
  return typeof window !== 'undefined' && !navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function setupOfflineDetection(
  onOnline?: () => void,
  onOffline?: () => void
) {
  if (typeof window === 'undefined') return;

  const handleOnline = () => {
    console.log('App is online');
    onOnline?.();
  };

  const handleOffline = () => {
    console.log('App is offline');
    onOffline?.();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
