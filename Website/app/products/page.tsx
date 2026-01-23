'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { QuickViewModal } from '@/components/products/QuickViewModal';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import type { Product, ProductTier } from '@prisma/client';

interface PaginatedResponse {
  data: (Product & { tier: ProductTier })[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<(Product & { tier: ProductTier })[]>(
    []
  );
  const [tiers, setTiers] = useState<ProductTier[]>([]);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<
    (Product & { tier: ProductTier }) | null
  >(null);

  // Fetch tiers on mount
  useEffect(() => {
    async function fetchTiers() {
      try {
        const response = await fetch('/api/tiers');
        const data = await response.json();
        setTiers(data.data || []);
      } catch (error) {
        console.error('Error fetching tiers:', error);
      }
    }
    fetchTiers();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          sort: sortBy,
          page: currentPage.toString(),
          pageSize: '12',
        });

        if (selectedTier) {
          params.append('tier', selectedTier);
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PaginatedResponse = await response.json();

        setProducts(data.data || []);
        setPagination(data.pagination || {
          page: 1,
          pageSize: 12,
          total: 0,
          totalPages: 0,
        });
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setPagination({
          page: 1,
          pageSize: 12,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [selectedTier, sortBy, currentPage]);

  const handleTierChange = (tierId: string | null) => {
    setSelectedTier(tierId);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Container className="py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
          ]}
        />
      </Container>

      <Container className="py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Heading as="h1" variant="h1" className="mb-4">
            Our Products
          </Heading>
          <Text variant="large" className="text-neutral-600 max-w-2xl mx-auto">
            Explore our collection of premium jungle gyms and playground
            equipment. Each design can be customized to fit your space and your
            children&apos;s needs.
          </Text>
        </div>

        {/* Filters */}
        <ProductFilters
          tiers={tiers}
          selectedTier={selectedTier}
          sortBy={sortBy}
          onTierChange={handleTierChange}
          onSortChange={handleSortChange}
        />

        {/* Results Count */}
        {!isLoading && pagination && (
          <div className="mb-6">
            <Text variant="small" className="text-neutral-600">
              Showing {products.length} of {pagination.total || 0} products
            </Text>
          </div>
        )}

        {/* Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          onQuickView={setQuickViewProduct}
        />

        {/* Pagination */}
        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    page === currentPage
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </Container>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
