'use client';

import { useState, useMemo } from 'react';
import { SavedDesign } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Search,
  SlidersHorizontal,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { DesignCard } from './DesignCard';

interface SavedDesignsGridProps {
  designs: SavedDesign[];
}

type SortOption = 'updated' | 'created' | 'name' | 'price';

export function SavedDesignsGrid({ designs }: SavedDesignsGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [showFilters, setShowFilters] = useState(false);

  const handleUpdate = () => {
    // Refresh the page to get updated data
    router.refresh();
  };

  // Filter and sort designs
  const filteredAndSortedDesigns = useMemo(() => {
    let filtered = designs;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((design) =>
        design.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'updated':
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case 'created':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price': {
          const aPrice = (a.designData as any)?.metadata?.totalPrice || 0;
          const bPrice = (b.designData as any)?.metadata?.totalPrice || 0;
          return bPrice - aPrice;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [designs, searchQuery, sortBy]);

  if (designs.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
        <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          No saved designs yet
        </h3>
        <p className="text-neutral-600 mb-6">
          Start creating your custom playset in the configurator
        </p>
        <Link
          href="/configurator"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          Open Configurator
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">Sort</span>
          </button>
        </div>
      </div>

      {/* Sort Options (Expandable) */}
      {showFilters && (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <p className="text-sm font-medium text-neutral-700 mb-3">Sort by:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSortBy('updated')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'updated'
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Last Updated</span>
            </button>
            <button
              onClick={() => setSortBy('created')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'created'
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Date Created</span>
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'name'
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Name</span>
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                sortBy === 'price'
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Price</span>
            </button>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-neutral-600">
        Showing {filteredAndSortedDesigns.length} of {designs.length} design
        {designs.length === 1 ? '' : 's'}
      </div>

      {/* Designs Grid */}
      {filteredAndSortedDesigns.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
          <Search className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            No designs found
          </h3>
          <p className="text-neutral-600">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDesigns.map((design) => (
            <DesignCard
              key={design.id}
              design={design}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
