'use client';

import { useState } from 'react';
import type { ProductTier } from '@prisma/client';

interface ProductFiltersProps {
  tiers: ProductTier[];
  selectedTier: string | null;
  sortBy: string;
  onTierChange: (tierId: string | null) => void;
  onSortChange: (sortBy: string) => void;
}

export function ProductFilters({
  tiers,
  selectedTier,
  sortBy,
  onTierChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tier Filter */}
        <div className="flex-1">
          <label
            htmlFor="tier-filter"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Filter by Tier
          </label>
          <select
            id="tier-filter"
            value={selectedTier || ''}
            onChange={(e) => onTierChange(e.target.value || null)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="">All Tiers</option>
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="flex-1">
          <label
            htmlFor="sort-filter"
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            Sort by
          </label>
          <select
            id="sort-filter"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {selectedTier && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-neutral-600">Active filters:</span>
          <button
            onClick={() => onTierChange(null)}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
          >
            {tiers.find((t) => t.id === selectedTier)?.name}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
