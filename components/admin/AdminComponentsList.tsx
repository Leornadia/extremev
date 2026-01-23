'use client';

import { useState, useEffect } from 'react';
import { ComponentCard } from './ComponentCard';
import { ComponentFilters } from './ComponentFilters';
import { Spinner } from '@/components/ui';
import { AlertCircle } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  tierId: string;
  tier: {
    id: string;
    name: string;
    slug: string;
  };
  price: number;
  thumbnail: string;
  model3D: string;
  dimensions: unknown;
  weight: number;
  connectionPoints: unknown;
  compatibilityRules: unknown;
  metadata: unknown;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminComponentsListProps {
  refreshTrigger?: number;
  onComponentUpdated?: () => void;
  onComponentDeleted?: () => void;
}

export function AdminComponentsList({
  refreshTrigger = 0,
  onComponentUpdated,
  onComponentDeleted,
}: AdminComponentsListProps) {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: 'all',
    tier: 'all',
    published: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchComponents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger, filters]);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.category !== 'all')
        params.append('category', filters.category);
      if (filters.tier !== 'all') params.append('tier', filters.tier);
      if (filters.published !== 'all')
        params.append('published', filters.published);
      if (filters.search) params.append('search', filters.search);
      params.append('sortBy', filters.sortBy);
      params.append('sortOrder', filters.sortOrder);

      const response = await fetch(
        `/api/admin/components?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch components');
      }

      const data = await response.json();
      setComponents(data.data || []);
    } catch (err) {
      console.error('Error fetching components:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load components'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">
              Error Loading Components
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <ComponentFilters filters={filters} onFiltersChange={setFilters} />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          {components.length} component{components.length !== 1 ? 's' : ''}{' '}
          found
        </p>
      </div>

      {/* Components Grid */}
      {components.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-600">No components found</p>
          <p className="text-sm text-neutral-500 mt-2">
            Try adjusting your filters or create a new component
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map((component) => (
            <ComponentCard
              key={component.id}
              component={component}
              onUpdated={onComponentUpdated}
              onDeleted={onComponentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
}
