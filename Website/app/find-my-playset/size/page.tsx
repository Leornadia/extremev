'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type PlaysetSize = 'small' | 'medium' | 'large' | 'extra-large' | null;
type PlaysetSizeValue = Exclude<PlaysetSize, null>;

const sizeOptions = [
  {
    id: 'small' as const,
    label: 'SMALL',
    description: 'Perfect for smaller yards',
    image: '/images/Red%20Wooden%20Playset%20with%20Yellow%20Slide%20and%20Sandpit.webp',
  },
  {
    id: 'medium' as const,
    label: 'MEDIUM',
    description: 'Great for most families',
    image: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
  },
  {
    id: 'large' as const,
    label: 'LARGE',
    description: 'Spacious play area',
    image: '/images/Children%27s%20Wooden%20Playground%20with%20Blue%20Slide%20and%20Tire%20Swing.webp',
  },
  {
    id: 'extra-large' as const,
    label: 'EXTRA LARGE',
    description: 'Maximum fun space',
    image: '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
  },
];

export default function PlaysetSizePage() {
  const [selectedSize, setSelectedSize] = useState<PlaysetSize>(null);
  const router = useRouter();

  const goToStructures = (size: PlaysetSizeValue) => {
    const encodedSize = encodeURIComponent(size);
    router.push(`/find-my-playset/structures?size=${encodedSize}`);
  };

  const handleSelectSize = (size: PlaysetSizeValue) => {
    setSelectedSize(size);
    goToStructures(size);
  };

  const handleContinue = () => {
    if (selectedSize) {
      goToStructures(selectedSize);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Container className="py-12 sm:py-16">
        {/* Close Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => router.back()}
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            What size playset would you like?
          </h1>
        </div>

        {/* Size Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
          {sizeOptions.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => handleSelectSize(option.id)}
              className={`group relative bg-white rounded-xl p-6 transition-all duration-300 ${
                selectedSize === option.id
                  ? 'ring-4 ring-primary-500 shadow-xl scale-105'
                  : 'ring-2 ring-neutral-200 hover:ring-primary-300 hover:shadow-lg'
              }`}
            >
              {/* Image */}
              <div className="relative w-full aspect-square mb-6 overflow-hidden rounded-lg">
                <Image
                  src={option.image}
                  alt={`${option.label} playset`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Label */}
              <h3
                className={`text-xl font-bold mb-2 transition-colors ${
                  selectedSize === option.id
                    ? 'text-primary-600'
                    : 'text-[#5A8B8B] group-hover:text-primary-600'
                }`}
              >
                {option.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-neutral-600">{option.description}</p>

              {/* Selected Indicator */}
              {selectedSize === option.id && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
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
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedSize}
            size="lg"
            className={`px-16 py-4 text-lg rounded-full font-semibold transition-all duration-300 ${
              selectedSize
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
            }`}
          >
            CONTINUE
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8">
          <p className="text-neutral-600">
            Not sure which size? <a href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">Contact us</a> for help
          </p>
        </div>
      </Container>
    </main>
  );
}
