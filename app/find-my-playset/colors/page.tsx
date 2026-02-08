'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';

type ColorPreference = 'no-preference' | 'color-accents' | 'natural';

const colorOptions = [
  {
    id: 'no-preference' as const,
    label: 'NO PREFERENCE',
  },
  {
    id: 'color-accents' as const,
    label: 'COLOR ACCENTS',
  },
  {
    id: 'natural' as const,
    label: 'NATURAL',
  },
];

export default function PlaysetColorsPage() {
  const [selectedColor, setSelectedColor] = useState<ColorPreference>('no-preference');
  const router = useRouter();
  const searchParams = useSearchParams();
  const size = searchParams.get('size');
  const activities = searchParams.get('activities');
  const specialty = searchParams.get('specialty');

  const handleBack = () => {
    const params = new URLSearchParams();
    if (size) params.append('size', size);
    if (activities) params.append('activities', activities);
    router.push(`/find-my-playset/specialty?${params.toString()}`);
  };

  const handleFindPlayset = () => {
    // Navigate to results page with all filters
    const params = new URLSearchParams();
    if (size) params.append('size', size);
    if (activities) params.append('activities', activities);
    if (specialty) params.append('specialty', specialty);
    if (selectedColor !== 'no-preference') {
      params.append('color', selectedColor);
    }
    router.push(`/find-my-playset/results?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-white">
      <Container className="py-12 sm:py-16">
        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Close"
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

        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-400 mb-2">
            Any color accents?
          </h1>
        </div>

        {/* Color Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-5xl mx-auto mb-16">
          {colorOptions.map((option) => {
            const isSelected = selectedColor === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedColor(option.id)}
                className="group relative flex flex-col items-center transition-all duration-300"
              >
                {/* Illustration Placeholder */}
                <div className="w-full aspect-[3/4] mb-6 flex items-center justify-center bg-neutral-50 rounded-lg relative overflow-hidden">
                  <div className="w-32 h-32 relative">
                    {option.id === 'no-preference' && (
                      <NextImage
                        src="/images/icons/no-preference.webp"
                        alt="No Preference"
                        fill
                        className="object-contain"
                      />
                    )}
                    {option.id === 'color-accents' && (
                      <NextImage
                        src="/images/icons/color-accents.webp"
                        alt="Color Accents"
                        fill
                        className="object-contain"
                      />
                    )}
                    {option.id === 'natural' && (
                      <NextImage
                        src="/images/icons/natural.webp"
                        alt="Natural"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg z-10">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Label */}
                <h3
                  className={`text-xl font-bold transition-colors ${isSelected
                    ? 'text-primary-600'
                    : 'text-neutral-700 group-hover:text-primary-600'
                    }`}
                >
                  {option.label}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 items-center">
          <Button
            onClick={handleFindPlayset}
            size="lg"
            className="px-12 py-3 text-lg rounded-full font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            FIND MY PLAYSET
          </Button>
          <Button
            onClick={handleBack}
            variant="ghost"
            size="lg"
            className="px-12 py-3 text-lg rounded-full font-semibold border-2 border-neutral-300 hover:border-neutral-400 text-neutral-400"
          >
            BACK
          </Button>
        </div>
      </Container>
    </main>
  );
}
