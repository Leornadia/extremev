'use client';

import { Filter, ArrowUpDown } from 'lucide-react';

interface AdminQuoteFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  sortBy: string;
  onSortByChange: (sortBy: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalCount: number;
}

export function AdminQuoteFilters({
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  totalCount,
}: AdminQuoteFiltersProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">Filters</span>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm text-neutral-600">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="quoted">Quoted</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm text-neutral-600">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="createdAt">Date</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Sort Order */}
          <button
            onClick={() =>
              onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
            }
            className="p-1.5 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            title={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
          >
            <ArrowUpDown className="w-4 h-4 text-neutral-600" />
          </button>

          {/* Results Count */}
          <div className="text-sm text-neutral-600 ml-2">
            {totalCount} {totalCount === 1 ? 'result' : 'results'}
          </div>
        </div>
      </div>
    </div>
  );
}
