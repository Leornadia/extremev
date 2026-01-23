'use client';

import { useState } from 'react';
import { QuoteRequest, User } from '@prisma/client';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DesignVisualization } from './DesignVisualization';

type QuoteRequestWithUser = QuoteRequest & {
  user: Pick<User, 'id' | 'name' | 'email'> | null;
};

interface AdminQuoteCardProps {
  quote: QuoteRequestWithUser;
  onStatusUpdate: (
    quoteId: string,
    newStatus: string,
    notes?: string
  ) => Promise<void>;
}

const statusConfig = {
  pending: {
    label: 'Pending Review',
    icon: Clock,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    nextStatus: 'reviewed',
    nextLabel: 'Mark as Reviewed',
  },
  reviewed: {
    label: 'Under Review',
    icon: AlertCircle,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    nextStatus: 'quoted',
    nextLabel: 'Mark as Quoted',
  },
  quoted: {
    label: 'Quote Sent',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-50 border-green-200',
    nextStatus: 'converted',
    nextLabel: 'Mark as Converted',
  },
  converted: {
    label: 'Converted',
    icon: CheckCircle,
    color: 'text-primary-600 bg-primary-50 border-primary-200',
    nextStatus: null,
    nextLabel: null,
  },
};

export function AdminQuoteCard({ quote, onStatusUpdate }: AdminQuoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState(quote.notes || '');
  const [editingNotes, setEditingNotes] = useState(false);

  const status =
    statusConfig[quote.status as keyof typeof statusConfig] ||
    statusConfig.pending;
  const StatusIcon = status.icon;
  const customerInfo = quote.customerInfo as any;
  const pricing = quote.pricing as any;
  const design = quote.designSnapshot as any;

  async function handleStatusChange(newStatus: string) {
    setUpdating(true);
    try {
      await onStatusUpdate(quote.id, newStatus);
    } finally {
      setUpdating(false);
    }
  }

  async function handleSaveNotes() {
    setUpdating(true);
    try {
      await onStatusUpdate(quote.id, quote.status, notes);
      setEditingNotes(false);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-neutral-900 text-lg">
                Quote #{quote.id.slice(0, 8).toUpperCase()}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {status.label}
              </span>
            </div>

            <p className="text-sm text-neutral-600">
              Submitted{' '}
              {new Date(quote.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="ml-4"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Expand
              </>
            )}
          </Button>
        </div>

        {/* Customer Info Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-2">
            <UserIcon className="w-4 h-4 text-neutral-500 mt-0.5" />
            <div>
              <p className="text-xs text-neutral-600">Customer</p>
              <p className="text-sm font-medium text-neutral-900">
                {customerInfo?.name || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Mail className="w-4 h-4 text-neutral-500 mt-0.5" />
            <div>
              <p className="text-xs text-neutral-600">Email</p>
              <p className="text-sm font-medium text-neutral-900">
                {customerInfo?.email || quote.user?.email || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />
            <div>
              <p className="text-xs text-neutral-600">Location</p>
              <p className="text-sm font-medium text-neutral-900">
                {customerInfo?.city}, {customerInfo?.state}
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        {pricing?.total && (
          <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Estimated Total</span>
              <span className="text-lg font-bold text-neutral-900">
                ${pricing.total.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-neutral-200 p-6 bg-neutral-50 space-y-6">
          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerInfo?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700">
                    {customerInfo.phone}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-700">
                  {customerInfo?.city}, {customerInfo?.state}{' '}
                  {customerInfo?.postalCode}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          {pricing && (
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">
                Pricing Breakdown
              </h4>
              <div className="bg-white rounded-lg p-4 space-y-2">
                {pricing.components && pricing.components.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-neutral-600 uppercase">
                      Components
                    </p>
                    {pricing.components
                      .slice(0, 5)
                      .map((comp: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-neutral-700">
                            {comp.name}{' '}
                            {comp.quantity > 1 && `(×${comp.quantity})`}
                          </span>
                          <span className="text-neutral-900">
                            ${comp.totalPrice.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    {pricing.components.length > 5 && (
                      <p className="text-xs text-neutral-500">
                        +{pricing.components.length - 5} more components
                      </p>
                    )}
                  </div>
                )}

                <div className="border-t border-neutral-200 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="text-neutral-900">
                      ${pricing.subtotal?.toLocaleString()}
                    </span>
                  </div>
                  {pricing.estimatedShipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        Estimated Shipping
                      </span>
                      <span className="text-neutral-900">
                        ${pricing.estimatedShipping?.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {pricing.estimatedInstallation > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-600">Installation</span>
                      <span className="text-neutral-900">
                        ${pricing.estimatedInstallation?.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-neutral-900">Total</span>
                    <span className="text-neutral-900">
                      ${pricing.total?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Design Visualization */}
          {design && (
            <div>
              <h4 className="font-semibold text-neutral-900 mb-3">Design</h4>
              <DesignVisualization design={design} />
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-neutral-900">Admin Notes</h4>
              {!editingNotes && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingNotes(true)}
                >
                  Edit
                </Button>
              )}
            </div>

            {editingNotes ? (
              <div className="space-y-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add notes about this quote request..."
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveNotes}
                    disabled={updating}
                    size="sm"
                  >
                    Save Notes
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setNotes(quote.notes || '');
                      setEditingNotes(false);
                    }}
                    disabled={updating}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4">
                {notes ? (
                  <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                    {notes}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-500 italic">
                    No notes added yet
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Status Actions */}
          {status.nextStatus && (
            <div className="flex gap-2 pt-4 border-t border-neutral-200">
              <Button
                onClick={() => handleStatusChange(status.nextStatus!)}
                disabled={updating}
              >
                {status.nextLabel}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
