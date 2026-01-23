'use client';

import { QuoteRequest } from '@prisma/client';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface QuoteRequestsListProps {
  quoteRequests: QuoteRequest[];
}

const statusConfig = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50',
  },
  reviewed: {
    label: 'Under Review',
    icon: AlertCircle,
    color: 'text-blue-600 bg-blue-50',
  },
  quoted: {
    label: 'Quote Sent',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50',
  },
  converted: {
    label: 'Converted',
    icon: CheckCircle,
    color: 'text-primary-600 bg-primary-50',
  },
};

export function QuoteRequestsList({ quoteRequests }: QuoteRequestsListProps) {
  if (quoteRequests.length === 0) {
    return (
      <div className="text-center py-12 bg-neutral-50 rounded-lg border-2 border-dashed border-neutral-200">
        <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-900 mb-2">
          No quote requests yet
        </h3>
        <p className="text-neutral-600">
          Create a design and request a quote to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quoteRequests.map((quote) => {
        const status =
          statusConfig[quote.status as keyof typeof statusConfig] ||
          statusConfig.pending;
        const StatusIcon = status.icon;
        const customerInfo = quote.customerInfo as any;
        const pricing = quote.pricing as any;

        return (
          <div
            key={quote.id}
            className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-neutral-900">
                    Quote Request #{quote.id.slice(0, 8)}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-neutral-600">Submitted</p>
                    <p className="text-sm font-medium text-neutral-900">
                      {new Date(quote.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  {pricing?.total && (
                    <div>
                      <p className="text-sm text-neutral-600">
                        Estimated Total
                      </p>
                      <p className="text-sm font-medium text-neutral-900">
                        ${pricing.total.toLocaleString()}
                      </p>
                    </div>
                  )}

                  {customerInfo?.location && (
                    <div>
                      <p className="text-sm text-neutral-600">Location</p>
                      <p className="text-sm font-medium text-neutral-900">
                        {customerInfo.location.city},{' '}
                        {customerInfo.location.state}
                      </p>
                    </div>
                  )}
                </div>

                {quote.notes && (
                  <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
                    <p className="text-sm text-neutral-700">{quote.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
