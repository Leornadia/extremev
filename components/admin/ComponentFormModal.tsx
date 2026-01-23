'use client';

import { useState, useEffect } from 'react';
import { Button, Spinner } from '@/components/ui';
import { FileUpload } from './FileUpload';
import { ConnectionRulesEditor } from './ConnectionRulesEditor';
import { X, AlertCircle } from 'lucide-react';

interface ComponentFormModalProps {
  mode: 'create' | 'edit';
  componentId?: string;
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

export function ComponentFormModal({
  mode,
  componentId,
  onClose,
  onSuccess,
}: ComponentFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    tierId: '',
    price: '',
    thumbnail: '',
    model3D: '',
    weight: '',
    published: false,
    // Dimensions
    width: '',
    depth: '',
    height: '',
    unit: 'ft',
    // Metadata
    ageRange: '',
    capacity: '',
    materials: '',
    colors: '',
  });
  const [connectionPoints, setConnectionPoints] = useState<unknown[]>([]);
  const [compatibilityRules, setCompatibilityRules] = useState<unknown[]>([]);

  useEffect(() => {
    fetchTiers();
    if (mode === 'edit' && componentId) {
      fetchComponent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, componentId]);

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

  const fetchComponent = async () => {
    if (!componentId) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/admin/components/${componentId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch component');
      }

      const { data } = await response.json();

      const dimensions = data.dimensions as {
        width: number;
        depth: number;
        height: number;
        unit: string;
      };

      const metadata = data.metadata as {
        ageRange?: string;
        capacity?: number;
        materials?: string[];
        colors?: string[];
      };

      setFormData({
        name: data.name,
        category: data.category,
        subcategory: data.subcategory || '',
        tierId: data.tierId,
        price: data.price.toString(),
        thumbnail: data.thumbnail,
        model3D: data.model3D,
        weight: data.weight.toString(),
        published: data.published,
        width: dimensions.width?.toString() || '',
        depth: dimensions.depth?.toString() || '',
        height: dimensions.height?.toString() || '',
        unit: dimensions.unit || 'ft',
        ageRange: metadata.ageRange || '',
        capacity: metadata.capacity?.toString() || '',
        materials: metadata.materials?.join(', ') || '',
        colors: metadata.colors?.join(', ') || '',
      });

      setConnectionPoints(
        Array.isArray(data.connectionPoints) ? data.connectionPoints : []
      );
      setCompatibilityRules(
        Array.isArray(data.compatibilityRules) ? data.compatibilityRules : []
      );
    } catch (err) {
      console.error('Error fetching component:', err);
      setError('Failed to load component data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory || null,
        tierId: formData.tierId,
        price: parseFloat(formData.price),
        thumbnail: formData.thumbnail,
        model3D: formData.model3D,
        weight: parseFloat(formData.weight),
        published: formData.published,
        dimensions: {
          width: parseFloat(formData.width),
          depth: parseFloat(formData.depth),
          height: parseFloat(formData.height),
          unit: formData.unit,
        },
        metadata: {
          ageRange: formData.ageRange,
          capacity: formData.capacity ? parseInt(formData.capacity) : 0,
          materials: formData.materials
            .split(',')
            .map((m) => m.trim())
            .filter(Boolean),
          colors: formData.colors
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
        },
        connectionPoints,
        compatibilityRules,
      };

      const url =
        mode === 'create'
          ? '/api/admin/components'
          : `/api/admin/components/${componentId}`;

      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save component');
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving component:', err);
      setError(err instanceof Error ? err.message : 'Failed to save component');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">
            {mode === 'create' ? 'Create Component' : 'Edit Component'}
          </h2>
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

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Subcategory
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tier *
                </label>
                <select
                  name="tierId"
                  value={formData.tierId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select tier</option>
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Media</h3>

            <FileUpload
              type="image"
              label="Thumbnail Image *"
              currentUrl={formData.thumbnail}
              onUploadComplete={(url) =>
                setFormData((prev) => ({ ...prev, thumbnail: url }))
              }
            />

            {formData.thumbnail && (
              <input
                type="hidden"
                name="thumbnail"
                value={formData.thumbnail}
                required
              />
            )}

            <FileUpload
              type="model"
              label="3D Model (GLB/GLTF) *"
              currentUrl={formData.model3D}
              onUploadComplete={(url) =>
                setFormData((prev) => ({ ...prev, model3D: url }))
              }
            />

            {formData.model3D && (
              <input
                type="hidden"
                name="model3D"
                value={formData.model3D}
                required
              />
            )}
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Dimensions</h3>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Width *
                </label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Depth *
                </label>
                <input
                  type="number"
                  name="depth"
                  value={formData.depth}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Height *
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="ft">Feet</option>
                  <option value="m">Meters</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Weight (lbs) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
                step="0.1"
                min="0"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">
              Additional Information
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Age Range
                </label>
                <input
                  type="text"
                  name="ageRange"
                  value={formData.ageRange}
                  onChange={handleChange}
                  placeholder="e.g., 3-12 years"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Capacity (children)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Materials (comma-separated)
              </label>
              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                placeholder="e.g., Cedar Wood, Stainless Steel"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Available Colors (comma-separated)
              </label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                placeholder="e.g., Natural, Green, Blue"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Connection Rules */}
          <ConnectionRulesEditor
            connectionPoints={connectionPoints as never[]}
            compatibilityRules={compatibilityRules}
            onChange={(points, rules) => {
              setConnectionPoints(points);
              setCompatibilityRules(rules);
            }}
          />

          {/* Publishing */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-neutral-700"
            >
              Publish component (make visible in configurator)
            </label>
          </div>

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
                  Saving...
                </>
              ) : mode === 'create' ? (
                'Create Component'
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
