import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Authentication Error | Extreme V',
  description: 'An error occurred during authentication.',
};

function ErrorContent() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Authentication Error
          </h1>

          <p className="text-neutral-600 mb-6">
            An error occurred while trying to sign you in. This could be due to
            invalid credentials or a temporary issue.
          </p>

          <div className="space-y-3">
            <Link href="/auth/signin" className="block">
              <Button variant="primary" className="w-full">
                Try Again
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                Return Home
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <p className="text-sm text-neutral-600">
              Need help?{' '}
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-700"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
