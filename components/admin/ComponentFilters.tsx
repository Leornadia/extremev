'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface ComponentFiltersProps {
  filters: {
    category: string;
    tier: string;
    published: string;
    search: string;
    sortBy: string;
    sortOrder: string;
  };
  onFiltersChange: (filters: ComponentFiltersProps['filters']) => void;
}

const CATEGORIES = [
  'Playdecks',
  'Access',
  'Slides',
  'Swings',
  'Roofs',
  'Accessories',
  'Connectors',
];

export function ComponentFilters({
  filters,
  onFiltersChange,
}: ComponentFiltersProps) {
  const [tiers, setTiers] = useState<Array<{ id: string; name: string }>>([]);
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    fetchTiers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: searchInput });
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const fetchTiers = async () => {
    try {
      const response = await fetch('/api/tiers');
      if (response.ok) {
        const data = await response.json();
        setTiers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tiers:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, category..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tier
          </label>
          <select
            value={filters.tier}
            onChange={(e) => handleFilterChange('tier', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Tiers</option>
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.name}
              </option>
            ))}
          </select>
        </div>

        {/* Published Filter */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Status
          </label>
          <select
            value={filters.published}
            onChange={(e) => handleFilterChange('published', e.target.value)}
            className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      {/* Sort Options */}
      <div className="mt-4 flex items-center gap-4">
        <label className="text-sm font-medium text-neutral-700">Sort by:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="createdAt">Date Created</option>
          <option value="name">Name</option>
          <option value="category">Category</option>
          <option value="price">Price</option>
        </select>

        <select
          value={filters.sortOrder}
          onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
