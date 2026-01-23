'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Button } from '@/components/ui/Button';
import type { Product, ProductTier } from '@prisma/client';

interface ProductCardProps {
  product: Product & { tier: ProductTier };
  onQuickView?: (product: Product & { tier: ProductTier }) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        className="block relative aspect-[4/3] overflow-hidden bg-neutral-100"
      >
        <OptimizedImage
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Tier Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-neutral-700">
          {product.tier.name}
        </div>

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            {onQuickView && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="flex-1 bg-white/95 hover:bg-white text-neutral-900"
              >
                Quick View
              </Button>
            )}
            <Link
              href={`/configurator?template=${product.slug}`}
              className="flex-1"
            >
              <Button variant="primary" size="sm" className="w-full">
                Customize
              </Button>
            </Link>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-lg font-semibold text-neutral-900 mb-1 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Product Details */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
          <span>Ages {product.ageRange}</span>
          <span>•</span>
          <span>Capacity: {product.capacity}</span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-500 mb-0.5">Starting at</p>
            <p className="text-xl font-bold text-neutral-900">
              {formatPrice(product.basePrice)}
            </p>
          </div>
          <Link href={`/products/${product.slug}`}>
            <Button variant="ghost" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
