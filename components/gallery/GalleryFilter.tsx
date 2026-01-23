'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface GalleryFilterProps {
  selectedCategories: string[];
  selectedTiers: string[];
  sortBy: 'recent' | 'popular' | 'tier';
  onCategoryChange: (categories: string[]) => void;
  onTierChange: (tiers: string[]) => void;
  onSortChange: (sort: 'recent' | 'popular' | 'tier') => void;
}

const CATEGORIES = [
  'Jungle Gym',
  'Slides',
  'Swings',
  'Accessories',
  'Climbing',
];

const TIERS = ['Essential', 'Premium', 'Luxury'];

const SORT_OPTIONS = [
  { value: 'recent' as const, label: 'Most Recent' },
  { value: 'popular' as const, label: 'Most Popular' },
  { value: 'tier' as const, label: 'By Tier' },
];

export function GalleryFilter({
  selectedCategories,
  selectedTiers,
  sortBy,
  onCategoryChange,
  onTierChange,
  onSortChange,
}: GalleryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  const toggleTier = (tier: string) => {
    if (selectedTiers.includes(tier)) {
      onTierChange(selectedTiers.filter((t) => t !== tier));
    } else {
      onTierChange([...selectedTiers, tier]);
    }
  };

  const clearAllFilters = () => {
    onCategoryChange([]);
    onTierChange([]);
  };

  const activeFilterCount = selectedCategories.length + selectedTiers.length;

  return (
    <div className="mb-8">
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-neutral-200 rounded-lg shadow-sm"
        >
          <span className="font-medium text-neutral-900">
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </span>
          <svg
            className={cn(
              'w-5 h-5 transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filter panel */}
      <div
        className={cn(
          'bg-white border border-neutral-200 rounded-lg shadow-sm p-6 transition-all duration-300',
          !isExpanded && 'hidden lg:block'
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Categories */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    selectedCategories.includes(category)
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tiers */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Product Tier
            </h3>
            <div className="flex flex-wrap gap-2">
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => toggleTier(tier)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    selectedTiers.includes(tier)
                      ? tier === 'Essential'
                        ? 'bg-blue-500 text-white shadow-md'
                        : tier === 'Premium'
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-amber-500 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  )}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="lg:w-48">
            <h3 className="text-sm font-semibold text-neutral-700 mb-3">
              Sort By
            </h3>
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(e.target.value as 'recent' | 'popular' | 'tier')
              }
              className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear filters */}
        {activeFilterCount > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <button
              onClick={clearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Clear all filters ({activeFilterCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
