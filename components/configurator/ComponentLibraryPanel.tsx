'use client';

import { useState, useMemo, useEffect } from 'react';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { ComponentCategory, ModularComponent } from '@/lib/types/configurator';
import ComponentCard from './ComponentCard';
import ComponentDetailsModal from './ComponentDetailsModal';

const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  playdecks: 'Playdecks',
  access: 'Access',
  slides: 'Slides',
  swings: 'Swings',
  roofs: 'Roofs & Covers',
  accessories: 'Accessories',
  connectors: 'Connectors',
};

const CATEGORY_ICONS: Record<ComponentCategory, string> = {
  playdecks: '🏗️',
  access: '🪜',
  slides: '🛝',
  swings: '🎪',
  roofs: '🏠',
  accessories: '🎯',
  connectors: '🔗',
};

export default function ComponentLibraryPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ComponentCategory>
  >(new Set<ComponentCategory>(['playdecks', 'access', 'slides']));
  const [selectedComponent, setSelectedComponent] =
    useState<ModularComponent | null>(null);
  const [filterCategory, setFilterCategory] =
    useState<ComponentCategory | null>(null);
  const [components, setComponents] = useState<ModularComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { setActiveCategory } = useConfiguratorStore();

  // Fetch components from API
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filterCategory) {
          params.append('category', filterCategory);
        }
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const response = await fetch(`/api/components?${params.toString()}`);

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
        setComponents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComponents();
  }, [filterCategory, searchQuery]);

  // Components are already filtered by the API based on search and category
  const filteredComponents = components;

  // Group components by category
  const componentsByCategory = useMemo(() => {
    const grouped: Partial<Record<ComponentCategory, ModularComponent[]>> = {};

    filteredComponents.forEach((comp) => {
      if (!grouped[comp.category]) {
        grouped[comp.category] = [];
      }
      grouped[comp.category]!.push(comp);
    });

    return grouped;
  }, [filteredComponents]);

  const toggleCategory = (category: ComponentCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryFilter = (category: ComponentCategory | null) => {
    setFilterCategory(category);
    setActiveCategory(category);
  };

  const handleComponentClick = (component: ModularComponent) => {
    setSelectedComponent(component);
  };

  const handleCloseModal = () => {
    setSelectedComponent(null);
  };

  const categories = Object.keys(CATEGORY_LABELS) as ComponentCategory[];
  const hasResults = filteredComponents.length > 0;

  return (
    <>
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">
            Component Library
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Drag components to the canvas
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-neutral-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-3 border-b border-neutral-200 overflow-x-auto">
          <div className="flex gap-2">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                filterCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  filterCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Component Categories */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-600 font-medium">
                Loading components...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <svg
                className="w-16 h-16 text-red-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-neutral-600 font-medium mb-1">
                Failed to load components
              </p>
              <p className="text-sm text-neutral-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <svg
                className="w-16 h-16 text-neutral-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-neutral-600 font-medium mb-1">
                No components found
              </p>
              <p className="text-sm text-neutral-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {categories.map((category) => {
                const components = componentsByCategory[category] || [];
                if (components.length === 0) return null;

                const isExpanded = expandedCategories.has(category);

                return (
                  <div
                    key={category}
                    className="border border-neutral-200 rounded-lg overflow-hidden"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {CATEGORY_ICONS[category]}
                        </span>
                        <span className="font-medium text-neutral-900">
                          {CATEGORY_LABELS[category]}
                        </span>
                        <span className="text-xs text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-full">
                          {components.length}
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-neutral-600 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
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

                    {/* Category Components */}
                    {isExpanded && (
                      <div className="p-3 grid grid-cols-2 gap-2 bg-white">
                        {components.map((component) => (
                          <ComponentCard
                            key={component.id}
                            component={component}
                            onClick={() => handleComponentClick(component)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-neutral-200 bg-neutral-50">
          <p className="text-xs text-neutral-600 text-center">
            {filteredComponents.length} component
            {filteredComponents.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Component Details Modal */}
      {selectedComponent && (
        <ComponentDetailsModal
          component={selectedComponent}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
