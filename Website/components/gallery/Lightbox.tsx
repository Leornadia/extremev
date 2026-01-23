'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GalleryItem } from './GalleryGrid';

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  currentIndex: number;
  totalItems: number;
}

export function Lightbox({
  item,
  onClose,
  onNavigate,
  currentIndex,
  totalItems,
}: LightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        onNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNavigate]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
        aria-label="Close lightbox"
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

      {/* Navigation buttons */}
      {totalItems > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('prev');
            }}
            className="absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Previous image"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('next');
            }}
            className="absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Next image"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Content container */}
      <div
        className="max-w-7xl w-full mx-4 flex flex-col lg:flex-row gap-6 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 relative w-full">
          <div className="relative w-full aspect-[4/3] lg:aspect-video">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 70vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Image counter */}
          {totalItems > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm">
              {currentIndex + 1} / {totalItems}
            </div>
          )}
        </div>

        {/* Details panel */}
        <div className="lg:w-80 bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {item.title}
          </h2>

          {item.location && (
            <div className="flex items-center gap-2 text-neutral-600 mb-4">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm">{item.location}</span>
            </div>
          )}

          {item.productTier && (
            <div className="mb-4">
              <span
                className={cn(
                  'inline-block px-3 py-1 rounded-full text-sm font-medium',
                  item.productTier === 'Essential' &&
                    'bg-blue-100 text-blue-800',
                  item.productTier === 'Premium' &&
                    'bg-primary-100 text-primary-800',
                  item.productTier === 'Luxury' && 'bg-amber-100 text-amber-800'
                )}
              >
                {item.productTier} Tier
              </span>
            </div>
          )}

          {item.category.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.category.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {item.description && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                Description
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* CTA buttons */}
          <div className="mt-6 space-y-3">
            <button className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
              Design Your Own
            </button>
            <button className="w-full px-4 py-3 bg-white hover:bg-neutral-50 text-primary-600 border-2 border-primary-600 rounded-lg font-medium transition-colors">
              Request Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
