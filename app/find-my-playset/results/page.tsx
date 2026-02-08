'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

type TierType = 'rustic' | 'classic' | 'architectural';

interface PlaysetResult {
  id: string;
  name: string;
  tier: TierType;
  image: string;
}

// Mock data - in production, this would come from your database
const mockResults: PlaysetResult[] = [
  {
    id: 'classic-1018',
    name: 'CLASSIC 1018',
    tier: 'classic',
    image: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
  },
  {
    id: 'architectural-9753',
    name: 'ARCHITECTURAL 9753',
    tier: 'architectural',
    image: '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
  },
];

export default function PlaysetResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const size = searchParams.get('size');
  const activities = searchParams.get('activities');
  const specialty = searchParams.get('specialty');
  const color = searchParams.get('color');

  const [currentIndexes, setCurrentIndexes] = useState({
    rustic: 0,
    classic: 0,
    architectural: 0,
  });

  // Filter results by tier
  const rusticResults = mockResults.filter((r) => r.tier === 'rustic');
  const classicResults = mockResults.filter((r) => r.tier === 'classic');
  const architecturalResults = mockResults.filter((r) => r.tier === 'architectural');

  // Check what features are not available for rustic
  const rusticUnavailable = [];
  if (specialty?.includes('spiral-slide')) rusticUnavailable.push('Spiral Slide');
  if (specialty?.includes('monkey-bars')) rusticUnavailable.push('Monkey Bars');
  if (specialty?.includes('cedar-stairway')) rusticUnavailable.push('Cedar Stairway');
  if (color === 'color-accents') rusticUnavailable.push('Color Accents');

  const handleNext = (tier: TierType, maxCount: number) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [tier]: (prev[tier] + 1) % maxCount,
    }));
  };

  const handlePrev = (tier: TierType, maxCount: number) => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [tier]: (prev[tier] - 1 + maxCount) % maxCount,
    }));
  };

  const ResultColumn = ({
    title,
    tier,
    results,
    totalCount,
    unavailableItems,
  }: {
    title: string;
    tier: TierType;
    results: PlaysetResult[];
    totalCount: number;
    unavailableItems?: string[];
  }) => {
    const currentIndex = currentIndexes[tier];
    const hasResults = results.length > 0;
    const currentResult = hasResults ? results[currentIndex] : null;

    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold text-primary-600 mb-2">{title}</h2>

        {!hasResults ? (
          <div className="text-center">
            <p className="text-red-500 font-semibold mb-4">NO MATCHES</p>
            {unavailableItems && unavailableItems.length > 0 && (
              <div className="text-left text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                <p className="mb-2">The following are not available on {title.split(' ')[0]} Playsets:</p>
                <ul className="space-y-1">
                  {unavailableItems.map((item) => (
                    <li key={item}>
                      <span className="text-primary-600">✓</span> = you selected
                      <br />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-neutral-600">
                {currentIndex + 1} of {totalCount}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handlePrev(tier, totalCount)}
                  className="p-1 rounded-full border border-neutral-300 hover:bg-neutral-100"
                  aria-label="Previous"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleNext(tier, totalCount)}
                  className="p-1 rounded-full border border-neutral-300 hover:bg-neutral-100"
                  aria-label="Next"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {currentResult && (
              <div className="w-full">
                <div className="group relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => {
                    const queryString = searchParams.toString();
                    router.push(`/find-my-playset/product/${currentResult.id}${queryString ? `?${queryString}` : ''}`);
                  }}
                >
                  <Image
                    src={currentResult.image}
                    alt={currentResult.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* View 3D Button Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <button
                    className="absolute bottom-3 left-3 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      const queryString = searchParams.toString();
                      router.push(`/find-my-playset/product/${currentResult.id}${queryString ? `?${queryString}` : ''}`);
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                      <line x1="12" y1="22.08" x2="12" y2="12" />
                    </svg>
                    View 3D
                  </button>
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2 text-center">
                  {currentResult.name}
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      const queryString = searchParams.toString();
                      router.push(`/find-my-playset/product/${currentResult.id}${queryString ? `?${queryString}` : ''}`);
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm text-center"
                  >
                    SEE PRICES
                  </button>
                  <Button
                    onClick={() => {
                      const queryString = searchParams.toString();
                      router.push(`/find-my-playset/product/${currentResult.id}${queryString ? `?${queryString}` : ''}`);
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full rounded-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                  >
                    MORE ABOUT THIS SET
                  </Button>
                  <p className="text-xs text-neutral-500 text-center">
                    playset details, similar playsets, next steps
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
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

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          <ResultColumn
            title="RUSTIC RESULTS"
            tier="rustic"
            results={rusticResults}
            totalCount={0}
            unavailableItems={rusticUnavailable}
          />
          <ResultColumn
            title="CLASSIC RESULTS"
            tier="classic"
            results={classicResults}
            totalCount={19}
          />
          <ResultColumn
            title="ARCHITECTURAL RESULTS"
            tier="architectural"
            results={architecturalResults}
            totalCount={20}
          />
        </div>

        {/* Start Over Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push('/find-my-playset')}
            variant="ghost"
            size="lg"
            className="px-12 py-3 text-lg rounded-full font-semibold border-2 border-neutral-300 hover:border-neutral-400 text-neutral-400"
          >
            START OVER
          </Button>
        </div>
      </Container>
    </main>
  );
}
