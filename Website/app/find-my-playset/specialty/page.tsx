'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';

type SpecialtyType = 'monkey-bars' | 'spiral-slide' | 'bridge' | 'cedar-stairway' | null;

const specialtyOptions = [
  {
    id: 'monkey-bars' as const,
    label: 'MONKEY BARS',
    description: '',
  },
  {
    id: 'spiral-slide' as const,
    label: 'SPIRAL SLIDE',
    description: '',
  },
  {
    id: 'bridge' as const,
    label: 'BRIDGE',
    description: '',
  },
  {
    id: 'cedar-stairway' as const,
    label: 'CEDAR STAIRWAY',
    description: 'Good for toddlers',
  },
];

export default function PlaysetSpecialtyPage() {
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<SpecialtyType>>(new Set());
  const router = useRouter();
  const searchParams = useSearchParams();
  const size = searchParams.get('size');
  const activities = searchParams.get('activities');

  const handleBack = () => {
    router.push(`/find-my-playset/structures?size=${size || ''}`);
  };

  const toggleSpecialty = (specialtyId: SpecialtyType) => {
    const newSpecialties = new Set(selectedSpecialties);
    if (newSpecialties.has(specialtyId)) {
      newSpecialties.delete(specialtyId);
    } else {
      newSpecialties.add(specialtyId);
    }
    setSelectedSpecialties(newSpecialties);
  };

  const handleContinue = () => {
    // Navigate to colors page with all filters
    const params = new URLSearchParams();
    if (size) params.append('size', size);
    if (activities) params.append('activities', activities);
    if (selectedSpecialties.size > 0) {
      params.append('specialty', Array.from(selectedSpecialties).join(','));
    }
    router.push(`/find-my-playset/colors?${params.toString()}`);
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
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-400 mb-2">
            Any must-have specialty items?
          </h1>
          <p className="text-base text-neutral-600">
            If you'd like Monkey Bars,{' '}
            <a href="/find-my-playset/size" className="text-primary-600 hover:text-primary-700 underline">
              switch to a large playset
            </a>
          </p>
        </div>

        {/* Specialty Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16 mt-16">
          {specialtyOptions.map((option) => {
            const isSelected = selectedSpecialties.has(option.id);
            const isDisabled = option.id === 'monkey-bars' && size !== 'large' && size !== 'extra-large';

            return (
              <button
                key={option.id}
                onClick={() => !isDisabled && toggleSpecialty(option.id)}
                disabled={isDisabled}
                className={`group relative flex flex-col items-center p-6 rounded-xl transition-all duration-300 ${isDisabled
                  ? 'opacity-40 cursor-not-allowed'
                  : isSelected
                    ? 'bg-white ring-4 ring-primary-500 shadow-xl'
                    : 'bg-white ring-2 ring-neutral-200 hover:ring-primary-300 hover:shadow-lg'
                  }`}
              >
                {/* Icon/Illustration Placeholder */}
                <div className="w-full aspect-square mb-6 flex items-center justify-center bg-neutral-50 rounded-lg relative overflow-hidden">
                  <div className="w-32 h-32 relative">
                    {option.id === 'monkey-bars' && (
                      <NextImage
                        src="/images/icons/monkey-bars.webp"
                        alt="Monkey Bars"
                        fill
                        className="object-contain"
                      />
                    )}
                    {option.id === 'spiral-slide' && (
                      <NextImage
                        src="/images/icons/spiral-slide.png"
                        alt="Spiral Slide"
                        fill
                        className="object-contain"
                      />
                    )}
                    {option.id === 'bridge' && (
                      <NextImage
                        src="/images/icons/bridge.webp"
                        alt="Bridge"
                        fill
                        className="object-contain"
                      />
                    )}
                    {option.id === 'cedar-stairway' && (
                      <NextImage
                        src="/images/icons/cedar-stairway.webp"
                        alt="Cedar Stairway"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* Label */}
                <h3
                  className={`text-xl font-bold mb-2 transition-colors ${isSelected
                    ? 'text-primary-600'
                    : isDisabled
                      ? 'text-neutral-400'
                      : 'text-neutral-700 group-hover:text-primary-600'
                    }`}
                >
                  {option.label}
                </h3>

                {/* Description */}
                {option.description && (
                  <p className="text-sm text-neutral-500 text-center">
                    {option.description}
                  </p>
                )}

                {/* Selected Checkmark */}
                {isSelected && !isDisabled && (
                  <div className="absolute top-4 right-4 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-4 h-4 text-white"
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
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="lg"
            className="px-12 py-3 text-lg rounded-full font-semibold border-2 border-neutral-300 hover:border-neutral-400 text-neutral-400"
          >
            BACK
          </Button>
          <Button
            onClick={handleContinue}
            size="lg"
            className="px-12 py-3 text-lg rounded-full font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            CONTINUE
          </Button>
        </div>
      </Container>
    </main>
  );
}
