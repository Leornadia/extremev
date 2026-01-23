'use client';

import { Button } from '@/components/ui/Button';

interface QuoteConfirmationProps {
  quoteId: string;
  onClose: () => void;
  onNewDesign?: () => void;
}

export default function QuoteConfirmation({
  quoteId,
  onClose,
  onNewDesign,
}: QuoteConfirmationProps) {
  const referenceNumber = quoteId.slice(0, 8).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        {/* Success Header */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white px-8 py-10 rounded-t-xl text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2">Quote Request Submitted!</h2>
          <p className="text-primary-50 text-lg">
            We've received your custom design
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          {/* Reference Number */}
          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-6 text-center mb-6">
            <p className="text-sm text-neutral-600 mb-2">
              Your Reference Number
            </p>
            <div className="text-3xl font-bold text-primary-600 tracking-wider mb-2">
              #{referenceNumber}
            </div>
            <p className="text-xs text-neutral-500">
              Please save this for your records
            </p>
          </div>

          {/* What's Next */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-3">
              What Happens Next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                  1
                </div>
                <div>
                  <p className="font-medium text-neutral-900">
                    Email Confirmation
                  </p>
                  <p className="text-sm text-neutral-600">
                    Check your inbox for a confirmation email with all the
                    details
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                  2
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Team Review</p>
                  <p className="text-sm text-neutral-600">
                    Our experts will review your design and prepare a detailed
                    quote
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                  3
                </div>
                <div>
                  <p className="font-medium text-neutral-900">
                    We'll Contact You
                  </p>
                  <p className="text-sm text-neutral-600">
                    Expect to hear from us within 24 business hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Response Time */}
          <div className="bg-neutral-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-primary-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-medium text-neutral-900 text-sm">
                  Expected Response Time
                </p>
                <p className="text-sm text-neutral-600">
                  Within 24 business hours
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-neutral-200 pt-6 mb-6">
            <p className="text-sm text-neutral-600 mb-3">
              Questions in the meantime? We're here to help!
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-700">
                <svg
                  className="w-4 h-4 mr-2 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@extremev.co.za"
                  className="hover:text-primary-600"
                >
                  info@extremev.co.za
                </a>
              </div>
              <div className="flex items-center text-neutral-700">
                <svg
                  className="w-4 h-4 mr-2 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a href="tel:+27123456789" className="hover:text-primary-600">
                  +27 12 345 6789
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {onNewDesign && (
              <Button
                variant="secondary"
                onClick={onNewDesign}
                className="flex-1"
              >
                Create New Design
              </Button>
            )}
            <Button variant="primary" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
