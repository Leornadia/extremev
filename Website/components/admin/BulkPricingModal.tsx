'use client';

import { useState, useEffect } from 'react';
import { Button, Spinner } from '@/components/ui';
import { X, AlertCircle, DollarSign } from 'lucide-react';

interface BulkPricingModalProps {
  onClose: () => void;
  onSuccess: () => void;
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

export function BulkPricingModal({
  onClose,
  onSuccess,
}: BulkPricingModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    adjustmentType: 'percentage',
    adjustmentValue: '',
    category: '',
    tierId: '',
  });

  useEffect(() => {
    fetchTiers();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        adjustmentType: formData.adjustmentType,
        adjustmentValue: parseFloat(formData.adjustmentValue),
        category: formData.category || undefined,
        tierId: formData.tierId || undefined,
      };

      const response = await fetch('/api/admin/components/bulk-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update pricing');
      }

      const data = await response.json();
      alert(data.message);
      onSuccess();
    } catch (err) {
      console.error('Error updating pricing:', err);
      setError(err instanceof Error ? err.message : 'Failed to update pricing');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Bulk Pricing Update
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This will update prices for all components
              matching the selected filters. Use with caution.
            </p>
          </div>

          {/* Adjustment Type */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Adjustment Type *
            </label>
            <select
              name="adjustmentType"
              value={formData.adjustmentType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="percentage">Percentage Change</option>
              <option value="fixed">Fixed Amount Change</option>
            </select>
          </div>

          {/* Adjustment Value */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {formData.adjustmentType === 'percentage'
                ? 'Percentage (%)'
                : 'Amount ($)'}{' '}
              *
            </label>
            <input
              type="number"
              name="adjustmentValue"
              value={formData.adjustmentValue}
              onChange={handleChange}
              required
              step="0.01"
              placeholder={
                formData.adjustmentType === 'percentage'
                  ? 'e.g., 10 for +10%, -5 for -5%'
                  : 'e.g., 50 for +$50, -10 for -$10'
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {formData.adjustmentType === 'percentage'
                ? 'Enter positive number to increase, negative to decrease'
                : 'Enter positive amount to add, negative to subtract'}
            </p>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">
              Filter Components (Optional)
            </h3>
            <p className="text-sm text-neutral-600">
              Leave filters empty to update all components
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tier
                </label>
                <select
                  name="tierId"
                  value={formData.tierId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Tiers</option>
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.adjustmentValue && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
              <h4 className="font-semibold text-neutral-900 mb-2">Preview</h4>
              <div className="space-y-1 text-sm">
                <p className="text-neutral-700">
                  Example: $100.00 →{' '}
                  <span className="font-semibold text-primary-600">
                    $
                    {formData.adjustmentType === 'percentage'
                      ? (
                          100 *
                          (1 +
                            parseFloat(formData.adjustmentValue || '0') / 100)
                        ).toFixed(2)
                      : (
                          100 + parseFloat(formData.adjustmentValue || '0')
                        ).toFixed(2)}
                  </span>
                </p>
                <p className="text-neutral-700">
                  Example: $250.00 →{' '}
                  <span className="font-semibold text-primary-600">
                    $
                    {formData.adjustmentType === 'percentage'
                      ? (
                          250 *
                          (1 +
                            parseFloat(formData.adjustmentValue || '0') / 100)
                        ).toFixed(2)
                      : (
                          250 + parseFloat(formData.adjustmentValue || '0')
                        ).toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Updating...
                </>
              ) : (
                'Update Prices'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
