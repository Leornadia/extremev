'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';

type ActivityType = 'swing' | 'slide' | 'climb' | 'hang' | null;

const activityOptions = [
  {
    id: 'swing' as const,
    label: 'SWING',
    description: 'Sling Swings, Horse Swings, etc.',
  },
  {
    id: 'slide' as const,
    label: 'SLIDE',
    description: 'Big Slides, Toddler Slides, etc.',
  },
  {
    id: 'climb' as const,
    label: 'CLIMB UP',
    description: 'Ramps, Ladders, Climbing Walls, etc.',
  },
  {
    id: 'hang' as const,
    label: 'HANG ON',
    description: 'Fire Poles, Monkey Bars, Rings, etc.',
  },
];

export default function PlaysetStructuresPage() {
  const [selectedActivities, setSelectedActivities] = useState<Set<ActivityType>>(new Set());
  const router = useRouter();
  const searchParams = useSearchParams();
  const size = searchParams.get('size');

  const handleBack = () => {
    router.push('/find-my-playset/size');
  };

  const toggleActivity = (activityId: ActivityType) => {
    const newActivities = new Set(selectedActivities);
    if (newActivities.has(activityId)) {
      newActivities.delete(activityId);
    } else {
      newActivities.add(activityId);
    }
    setSelectedActivities(newActivities);
  };

  const handleContinue = () => {
    // Navigate to specialty page with size and activities filters
    const params = new URLSearchParams();
    if (size) params.append('size', size);
    if (selectedActivities.size > 0) {
      params.append('activities', Array.from(selectedActivities).join(','));
    }
    router.push(`/find-my-playset/specialty?${params.toString()}`);
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
            Any activities you really like?
          </h1>
        </div>

        {/* Activity Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          {activityOptions.map((option) => {
            const isSelected = selectedActivities.has(option.id);
            return (
              <button
                key={option.id}
                onClick={() => toggleActivity(option.id)}
                className={`group relative flex flex-col items-center p-6 rounded-xl transition-all duration-300 ${isSelected
                  ? 'bg-white ring-4 ring-primary-500 shadow-xl'
                  : 'bg-white ring-2 ring-neutral-200 hover:ring-primary-300 hover:shadow-lg'
                  }`}
              >
                {/* Icon/Illustration */}
                <div className="w-full aspect-square mb-4 flex items-center justify-center bg-neutral-50 rounded-lg p-4">
                  <div className="w-full h-full relative">
                    {option.id === 'swing' && (
                      <NextImage
                        src="/images/icons/swing.png"
                        alt="Swing"
                        fill
                        className="object-contain p-2"
                      />
                    )}
                    {option.id === 'slide' && (
                      <NextImage
                        src="/images/icons/slide.png"
                        alt="Slide"
                        fill
                        className="object-contain p-2"
                      />
                    )}
                    {option.id === 'climb' && (
                      <NextImage
                        src="/images/icons/climb.png"
                        alt="Climb Up"
                        fill
                        className="object-contain p-2"
                      />
                    )}
                    {option.id === 'hang' && (
                      <NextImage
                        src="/images/icons/hang.png"
                        alt="Hang On"
                        fill
                        className="object-contain p-2"
                      />
                    )}
                  </div>
                </div>

                {/* Label */}
                <h3
                  className={`text-xl font-bold mb-2 transition-colors ${isSelected
                    ? 'text-primary-600'
                    : 'text-neutral-700 group-hover:text-primary-600'
                    }`}
                >
                  {option.label}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-500 text-center">
                  {option.description}
                </p>

                {/* Selected Checkmark */}
                {isSelected && (
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

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-neutral-600">
            Need help deciding?{' '}
            <a
              href="/contact"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact us
            </a>{' '}
            for expert advice
          </p>
        </div>
      </Container>
    </main>
  );
}
