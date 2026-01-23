'use client';

import { useState, useEffect } from 'react';
import { QuoteRequest, User } from '@prisma/client';
import { AdminQuoteCard } from './AdminQuoteCard';
import { AdminQuoteFilters } from './AdminQuoteFilters';
import { Spinner } from '@/components/ui/Spinner';
import { AlertCircle } from 'lucide-react';

type QuoteRequestWithUser = QuoteRequest & {
  user: Pick<User, 'id' | 'name' | 'email'> | null;
};

interface QuoteRequestsResponse {
  quoteRequests: QuoteRequestWithUser[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export function AdminQuotesList() {
  const [quotes, setQuotes] = useState<QuoteRequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter, sortBy, sortOrder]);

  async function fetchQuotes() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        status: statusFilter,
        sortBy,
        sortOrder,
        limit: '50',
        offset: '0',
      });

      const response = await fetch(`/api/admin/quotes?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch quote requests');
      }

      const data: QuoteRequestsResponse = await response.json();
      setQuotes(data.quoteRequests);
    } catch (err) {
      console.error('Error fetching quotes:', err);
      setError('Failed to load quote requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(
    quoteId: string,
    newStatus: string,
    notes?: string
  ) {
    try {
      const response = await fetch(`/api/admin/quotes/${quoteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quote status');
      }

      // Refresh the list
      await fetchQuotes();
    } catch (err) {
      console.error('Error updating quote:', err);
      alert('Failed to update quote status. Please try again.');
    }
  }

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
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminQuoteFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        totalCount={quotes.length}
      />

      {quotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <p className="text-neutral-600">No quote requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <AdminQuoteCard
              key={quote.id}
              quote={quote}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
