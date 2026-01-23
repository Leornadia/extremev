'use client';

import { useState } from 'react';
import QuoteRequestForm, { QuoteRequestFormData } from './QuoteRequestForm';
import QuoteConfirmation from './QuoteConfirmation';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteRequestModal({
  isOpen,
  onClose,
}: QuoteRequestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);
  const design = useConfiguratorStore((state) => state.design);
  const validation = useConfiguratorStore((state) => state.validation);
  const clearDesign = useConfiguratorStore((state) => state.clearDesign);

  const handleSubmit = async (formData: QuoteRequestFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          design,
          customerInfo: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Failed to submit quote request'
        );
      }

      const { quoteRequest } = await response.json();
      setSubmittedQuoteId(quoteRequest.id);
    } catch (err) {
      console.error('Quote submission error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to submit quote request'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedQuoteId(null);
    setError(null);
    onClose();
  };

  const handleNewDesign = () => {
    clearDesign();
    handleClose();
  };

  if (!isOpen) return null;

  // Show confirmation screen after successful submission
  if (submittedQuoteId) {
    return (
      <QuoteConfirmation
        quoteId={submittedQuoteId}
        onClose={handleClose}
        onNewDesign={handleNewDesign}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              Request a Quote
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Fill in your details to receive a personalized quote for your
              custom design
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-neutral-400 hover:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {/* Validation Errors */}
          {!validation.isValid && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-red-800 mb-1">
                    Design Validation Errors
                  </h4>
                  <p className="text-sm text-red-700 mb-2">
                    Please fix the following issues before requesting a quote:
                  </p>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {validation.errors.map((error) => (
                      <li key={error.id}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* General Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-semibold text-red-800">Error</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Design Summary */}
          <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
            <h4 className="text-sm font-semibold text-neutral-900 mb-2">
              Design Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-600">Components:</span>
                <span className="ml-2 font-medium text-neutral-900">
                  {design.metadata.componentCount}
                </span>
              </div>
              <div>
                <span className="text-neutral-600">Estimated Price:</span>
                <span className="ml-2 font-medium text-neutral-900">
                  R {design.metadata.totalPrice.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-600">Dimensions:</span>
                <span className="ml-2 font-medium text-neutral-900">
                  {design.metadata.dimensions.width} ×{' '}
                  {design.metadata.dimensions.depth} ×{' '}
                  {design.metadata.dimensions.height}{' '}
                  {design.metadata.dimensions.unit}
                </span>
              </div>
              <div>
                <span className="text-neutral-600">Capacity:</span>
                <span className="ml-2 font-medium text-neutral-900">
                  {design.metadata.capacity} children
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <QuoteRequestForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}
