'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Typography';

// Define ProductTier type locally to avoid Prisma dependency issues
interface ProductTier {
  id: string;
  name: string;
  slug: string;
  priceMin: number;
  priceMax: number;
  features: string[];
  materials: string[];
  warrantyStructural: number;
  warrantyHardware: number;
  image: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ComparisonFeature {
  label: string;
  key: keyof ProductTier | 'custom';
  getValue: (tier: ProductTier) => React.ReactNode;
  category?: string;
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    label: 'Price Range',
    key: 'custom',
    getValue: (tier) => (
      <div className="font-semibold text-primary-600 text-lg">
        ${tier.priceMin.toLocaleString()} - ${tier.priceMax.toLocaleString()}
      </div>
    ),
    category: 'Pricing',
  },
  {
    label: 'Materials',
    key: 'materials',
    getValue: (tier) => (
      <ul className="space-y-1 text-sm">
        {tier.materials.map((material: string, idx: number) => (
          <li key={idx} className="flex items-center justify-center gap-1">
            <span className="text-primary-500">✓</span>
            <span>{material}</span>
          </li>
        ))}
      </ul>
    ),
    category: 'Quality',
  },
  {
    label: 'Structural Warranty',
    key: 'warrantyStructural',
    getValue: (tier) => (
      <div className="font-medium text-neutral-900">
        <span className="text-2xl font-bold text-primary-600">
          {tier.warrantyStructural}
        </span>{' '}
        {tier.warrantyStructural === 1 ? 'year' : 'years'}
      </div>
    ),
    category: 'Warranty',
  },
  {
    label: 'Hardware Warranty',
    key: 'warrantyHardware',
    getValue: (tier) => (
      <div className="font-medium text-neutral-900">
        <span className="text-2xl font-bold text-primary-600">
          {tier.warrantyHardware}
        </span>{' '}
        {tier.warrantyHardware === 1 ? 'year' : 'years'}
      </div>
    ),
    category: 'Warranty',
  },
];

export function TierComparisonTable() {
  const [tiers, setTiers] = useState<ProductTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTiers() {
      try {
        const response = await fetch('/api/tiers');
        if (!response.ok) {
          throw new Error('Failed to fetch tiers');
        }
        const data = await response.json();
        setTiers(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTiers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <Text className="text-red-600">Error loading tiers: {error}</Text>
      </div>
    );
  }

  if (tiers.length === 0) {
    return (
      <div className="rounded-lg bg-neutral-100 p-6 text-center">
        <Text className="text-neutral-600">
          No product tiers available at this time.
        </Text>
      </div>
    );
  }

  // Group features by category
  const categories = Array.from(
    new Set(comparisonFeatures.map((f) => f.category).filter(Boolean))
  );

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
      <table className="min-w-[800px] w-full">
        <thead>
          <tr className="border-b-2 border-neutral-200 bg-neutral-50">
            <th className="p-6 text-left">
              <Text
                variant="small"
                className="font-semibold uppercase tracking-wide text-neutral-500"
              >
                Features
              </Text>
            </th>
            {tiers.map((tier, index) => {
              // Highlight the middle tier as "Most Popular"
              const isPopular = tiers.length === 3 && index === 1;

              return (
                <th
                  key={tier.id}
                  className={`p-6 text-center relative ${
                    isPopular ? 'bg-primary-50 border-2 border-primary-500' : ''
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block rounded-full bg-primary-500 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-md">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-2 mt-2">
                    <Text
                      variant="large"
                      weight="bold"
                      className="text-neutral-900"
                    >
                      {tier.name}
                    </Text>
                  </div>
                  {tier.image && (
                    <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={tier.image}
                        alt={tier.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <>
              {/* Category Header */}
              <tr key={`category-${category}`} className="bg-neutral-50">
                <td colSpan={tiers.length + 1} className="p-4">
                  <Text
                    variant="small"
                    weight="semibold"
                    className="uppercase tracking-wide text-neutral-700"
                  >
                    {category}
                  </Text>
                </td>
              </tr>

              {/* Features in this category */}
              {comparisonFeatures
                .filter((f) => f.category === category)
                .map((feature, idx) => (
                  <tr
                    key={`${category}-${idx}`}
                    className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                  >
                    <td className="p-6 bg-neutral-50">
                      <Text className="font-medium text-neutral-700">
                        {feature.label}
                      </Text>
                    </td>
                    {tiers.map((tier, tierIndex) => {
                      const isPopular = tiers.length === 3 && tierIndex === 1;
                      return (
                        <td
                          key={tier.id}
                          className={`p-6 text-center ${
                            isPopular ? 'bg-primary-50/30' : ''
                          }`}
                        >
                          {feature.getValue(tier)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </>
          ))}

          {/* Key Features Section */}
          <tr className="bg-neutral-50">
            <td colSpan={tiers.length + 1} className="p-4">
              <Text
                variant="small"
                weight="semibold"
                className="uppercase tracking-wide text-neutral-700"
              >
                Key Features
              </Text>
            </td>
          </tr>
          <tr className="border-b border-neutral-100">
            <td className="p-6 bg-neutral-50">
              <Text weight="medium" className="text-neutral-700">
                Included Features
              </Text>
            </td>
            {tiers.map((tier, tierIndex) => {
              const isPopular = tiers.length === 3 && tierIndex === 1;
              return (
                <td
                  key={tier.id}
                  className={`p-6 ${isPopular ? 'bg-primary-50/30' : ''}`}
                >
                  <ul className="space-y-2 text-left text-sm">
                    {tier.features
                      .slice(0, 5)
                      .map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 text-primary-500 font-bold">
                            ✓
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    {tier.features.length > 5 && (
                      <li className="text-neutral-500 italic">
                        + {tier.features.length - 5} more features
                      </li>
                    )}
                  </ul>
                </td>
              );
            })}
          </tr>

          {/* CTA Row */}
          <tr className="bg-neutral-50">
            <td className="p-6 bg-neutral-50">
              <Text weight="medium" className="text-neutral-700">
                Browse Products
              </Text>
            </td>
            {tiers.map((tier, tierIndex) => {
              const isPopular = tiers.length === 3 && tierIndex === 1;
              return (
                <td
                  key={tier.id}
                  className={`p-6 ${isPopular ? 'bg-primary-50/30' : ''}`}
                >
                  <div className="flex flex-col gap-2">
                    <Link href={`/products?tier=${tier.slug}`}>
                      <Button
                        variant="primary"
                        className={`w-full ${
                          isPopular ? 'shadow-lg hover:shadow-xl' : ''
                        }`}
                      >
                        View {tier.name}
                      </Button>
                    </Link>
                    <Link href="/configurator">
                      <Button variant="secondary" className="w-full">
                        Design Custom
                      </Button>
                    </Link>
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
