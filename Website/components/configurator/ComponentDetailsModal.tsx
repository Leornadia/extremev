'use client';

import { useEffect } from 'react';
import { ModularComponent } from '@/lib/types/configurator';
import { Button } from '@/components/ui/Button';

interface ComponentDetailsModalProps {
  component: ModularComponent;
  onClose: () => void;
}

export default function ComponentDetailsModal({
  component,
  onClose,
}: ComponentDetailsModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-neutral-900 mb-1">
              {component.name}
            </h2>
            <p className="text-sm text-neutral-600 capitalize">
              {component.category.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6 text-neutral-600"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Component Preview */}
          <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-lg mb-6 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="inline-flex items-baseline gap-2 bg-primary-50 px-4 py-2 rounded-lg">
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(component.price)}
              </span>
              <span className="text-sm text-neutral-600">per unit</span>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-6">
            {/* Dimensions */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                Dimensions
              </h3>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-600 mb-1">Width</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {component.dimensions.width}
                    <span className="text-sm text-neutral-600 ml-1">
                      {component.dimensions.unit}
                    </span>
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-600 mb-1">Depth</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {component.dimensions.depth}
                    <span className="text-sm text-neutral-600 ml-1">
                      {component.dimensions.unit}
                    </span>
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-600 mb-1">Height</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {component.dimensions.height}
                    <span className="text-sm text-neutral-600 ml-1">
                      {component.dimensions.unit}
                    </span>
                  </p>
                </div>
                <div className="bg-neutral-50 rounded-lg p-3">
                  <p className="text-xs text-neutral-600 mb-1">Weight</p>
                  <p className="text-lg font-semibold text-neutral-900">
                    {component.weight}
                    <span className="text-sm text-neutral-600 ml-1">lbs</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-sm text-neutral-600 min-w-[100px]">
                    Age Range:
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    {component.metadata.ageRange} years
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-sm text-neutral-600 min-w-[100px]">
                    Capacity:
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    {component.metadata.capacity}{' '}
                    {component.metadata.capacity === 1 ? 'child' : 'children'}
                  </span>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                Materials
              </h3>
              <div className="flex flex-wrap gap-2">
                {component.metadata.materials.map((material, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Colors */}
            {component.metadata.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                  Available Colors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {component.metadata.colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                // TODO: Add to canvas functionality will be implemented in task 14.2
                console.log('Add to canvas:', component.id);
                onClose();
              }}
            >
              Add to Canvas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
