'use client';

/**
 * Service Worker Provider
 *
 * Registers and manages the service worker for offline support.
 */

import { useEffect } from 'react';
import {
  registerServiceWorker,
  setupOfflineDetection,
} from '@/lib/performance/service-worker';

export function ServiceWorkerProvider() {
  useEffect(() => {
    // Register service worker
    registerServiceWorker();

    // Setup offline detection
    const cleanup = setupOfflineDetection(
      () => {
        // Online callback
        console.log('Connection restored');

        // Show notification
        showNotification('You are back online', 'success');
      },
      () => {
        // Offline callback
        console.log('Connection lost');

        // Show notification
        showNotification(
          'You are offline. Some features may be limited.',
          'warning'
        );
      }
    );

    return cleanup;
  }, []);

  return null;
}

/**
 * Show notification to user
 */
function showNotification(
  message: string,
  type: 'success' | 'warning' | 'error'
) {
  // Check if notification already exists
  const existing = document.getElementById('offline-notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'offline-notification';
  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm animate-slide-in ${
    type === 'success'
      ? 'bg-green-600'
      : type === 'warning'
        ? 'bg-amber-600'
        : 'bg-red-600'
  } text-white`;

  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="flex-1">
        <p class="font-semibold">${message}</p>
      </div>
      <button 
        onclick="this.parentElement.parentElement.remove()"
        class="text-white hover:text-neutral-200 transition-colors"
        aria-label="Close notification"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}
