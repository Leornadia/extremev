'use client';

/**
 * Offline Page
 *
 * Displayed when the user is offline and tries to access a page that's not cached.
 */

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline - Extreme V',
  description: 'You are currently offline',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          You&apos;re Offline
        </h1>

        <p className="text-neutral-600 mb-8">
          It looks like you&apos;ve lost your internet connection. Some features
          may not be available until you&apos;re back online.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full bg-neutral-200 text-neutral-700 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-300 transition-colors"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 p-4 bg-neutral-100 rounded-lg">
          <p className="text-sm text-neutral-600">
            <strong>Tip:</strong> Previously visited pages may still be
            available while offline.
          </p>
        </div>
      </div>
    </div>
  );
}
