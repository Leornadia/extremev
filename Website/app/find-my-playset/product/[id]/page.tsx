'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import type { Simple3DViewerConfig } from '@/components/viewer/Simple3DViewer';

const Simple3DViewer = dynamic(() => import('@/components/viewer/Simple3DViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-100 to-green-100">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg text-neutral-600">Loading 3D Viewer...</p>
      </div>
    </div>
  ),
});

interface SimilarProduct {
  id: string;
  name: string;
  image: string;
}

type TierSlug = 'classic' | 'architectural' | 'rustic';

interface ProductDetail {
  id: string;
  name: string;
  tier: TierSlug;
  dimensions: string;
  image: string;
  similarCount: number;
  model3D: string;
  viewerConfig: Simple3DViewerConfig;
}

const sharedViewerConfig: Simple3DViewerConfig = {
  modelTargetSize: 7.5,
  cameraPosition: [7, 4, 7] as [number, number, number],
  cameraTarget: [0, 1.8, 0] as [number, number, number],
  cameraFov: 45,
  minDistance: 2.5,
  maxDistance: 28,
  autoRotateSpeed: 1,
  environment: {
    file: '/environments/charolettenbrunn_park_4k.exr',
    background: true,
    ground: { height: 5, radius: 40, scale: 20 },
    environmentIntensity: 0.8,
    backgroundIntensity: 2,
  },
  contactShadows: {
    position: [0, -0.001, 0] as [number, number, number],
    opacity: 0.6,
    scale: 25,
    blur: 1.5,
    far: 20,
    resolution: 1024,
    color: '#1f1f1f',
  },
};

const createViewerConfig = (
  overrides?: Partial<Simple3DViewerConfig>
): Simple3DViewerConfig => ({
  ...sharedViewerConfig,
  ...overrides,
  environment: {
    ...sharedViewerConfig.environment,
    ...(overrides?.environment || {}),
    ground: {
      ...sharedViewerConfig.environment.ground,
      ...(overrides?.environment?.ground || {}),
    },
  },
  contactShadows: {
    ...sharedViewerConfig.contactShadows,
    ...(overrides?.contactShadows || {}),
  },
});

// Mock data - in production, this would come from your database
const mockProducts: Record<string, ProductDetail> = {
  'classic-3332': {
    id: 'classic-3332',
    name: 'Classic 3332',
    tier: 'classic',
    dimensions: "24' x 13' x 12'",
    image: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
    similarCount: 27,
    model3D: '/models/classic-3332.glb',
    viewerConfig: createViewerConfig({
      cameraPosition: [8, 4.5, 8] as [number, number, number],
      modelTargetSize: 8,
    }),
  },
  'classic-1018': {
    id: 'classic-1018',
    name: 'Classic 1018',
    tier: 'classic',
    dimensions: "20' x 12' x 10'",
    image: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
    similarCount: 19,
    model3D: '/models/classic-1018.glb',
    viewerConfig: createViewerConfig(),
  },
  'architectural-9753': {
    id: 'architectural-9753',
    name: 'Architectural 9753',
    tier: 'architectural',
    dimensions: "28' x 16' x 14'",
    image: '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
    similarCount: 20,
    model3D: '/models/architectural-9753.glb',
    viewerConfig: createViewerConfig({
      cameraPosition: [9, 5, 9] as [number, number, number],
      cameraTarget: [0, 2.3, 0] as [number, number, number],
      modelTargetSize: 8.5,
    }),
  },
};

const similarProducts: SimilarProduct[] = [
  {
    id: 'classic-3332',
    name: 'Classic 3332',
    image: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
  },
  {
    id: 'architectural-9753',
    name: 'Architectural 9753',
    image: '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
  },
  {
    id: 'classic-1018',
    name: 'Classic 1018',
    image: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
  },
];

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id as string;

  const product = mockProducts[productId] || mockProducts['classic-1018'];
  const [isSaved, setIsSaved] = useState(false);
  const [show3DView, setShow3DView] = useState(false);
  const [viewResetKey, setViewResetKey] = useState(0);

  const handleBackToResults = () => {
    // Preserve the search parameters when going back
    const queryString = searchParams.toString();
    router.push(`/find-my-playset/results${queryString ? `?${queryString}` : ''}`);
  };

  const handleBrowseTier = () => {
    router.push(`/products?tier=${product.tier}`);
  };

  const handleReset3DView = () => {
    setViewResetKey((prev) => prev + 1);
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

        {/* Product Detail Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Product Image */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-neutral-600 mb-8">{product.dimensions}</p>

            {/* Action Links */}
            <div className="space-y-3 mb-8">
              <a
                href={`/products/${productId}`}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See price
              </a>
              <a
                href={`/configurator?base=${productId}`}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
                Customize this
              </a>
              <a
                href={`/contact?product=${productId}`}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Request quote w/ shipping
              </a>
            </div>

            {/* View Options */}
            <div className="flex gap-6 mb-8 pb-8 border-b border-neutral-200">
              <button
                onClick={() => setShow3DView(true)}
                className="flex flex-col items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="text-sm font-medium">View 3D</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-primary-600 hover:text-primary-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span className="text-sm font-medium">Aerial</span>
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`flex flex-col items-center gap-2 ${isSaved ? 'text-red-500' : 'text-neutral-600 hover:text-red-500'
                  }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={isSaved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>

            {/* Similar Playsets Info */}
            <p className="text-neutral-600 mb-6">
              <span className="font-semibold">{product.similarCount} similar playsets</span> shown below{' '}
              <button className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-neutral-400 text-neutral-600 hover:bg-neutral-100">
                <span className="text-xs">?</span>
              </button>
            </p>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleBackToResults}
                variant="ghost"
                className="w-full rounded-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 py-3"
              >
                BACK TO RESULTS
              </Button>
              <Button
                onClick={handleBrowseTier}
                variant="ghost"
                className="w-full rounded-full border-2 border-primary-600 text-primary-600 hover:bg-primary-50 py-3"
              >
                BROWSE {product.tier.toUpperCase()}
              </Button>
            </div>
          </div>
        </div>

        {/* More Like This Section */}
        <div className="border-t border-neutral-200 pt-12">
          <h2 className="text-3xl font-bold text-primary-600 text-center mb-12">
            More Like This
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarProducts.map((similar) => (
              <div key={similar.id} className="group cursor-pointer">
                <div className="relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={similar.image}
                    alt={similar.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-neutral-900">{similar.name}</h3>
                  <a
                    href={`/find-my-playset/product/${similar.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    SEE PRICE
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* 3D View Modal */}
        {show3DView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-lg overflow-hidden m-4">
              {/* Close Button */}
              <button
                onClick={() => setShow3DView(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close 3D View"
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

              {/* 3D Viewer Content */}
              <div className="w-full h-full flex flex-col">
                <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                  <h2 className="text-2xl font-bold text-neutral-900">{product.name} - 3D View</h2>
                  <p className="text-sm text-neutral-600">Click and drag to rotate • Scroll to zoom • Right-click to pan</p>
                </div>

                <div className="flex-1 relative">
                  <Simple3DViewer
                    modelPath={product.model3D}
                    productName={product.name}
                    resetSignal={viewResetKey}
                    viewerConfig={product.viewerConfig}
                  />
                </div>

                <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
                  <div className="flex gap-4">
                    <button
                      onClick={handleReset3DView}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Reset View
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShow3DView(false);
                      router.push(`/configurator?base=${productId}`);
                    }}
                    className="px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                  >
                    Customize This Design
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </Container>
    </main>
  );
}
