'use client';

import { useState } from 'react';
import { Button, Spinner } from '@/components/ui';
import { X, AlertTriangle } from 'lucide-react';

interface Component {
  id: string;
  name: string;
}

interface DeleteComponentModalProps {
  component: Component;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteComponentModal({
  component,
  onClose,
  onSuccess,
}: DeleteComponentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/components/${component.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Failed to delete component'
        );
      }

      onSuccess();
    } catch (err) {
      console.error('Error deleting component:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to delete component'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-900">
            Delete Component
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-neutral-900">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{component.name}</span>?
              </p>
              <p className="text-sm text-neutral-600 mt-2">
                This action cannot be undone. The component will be permanently
                removed from the system.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-neutral-200 px-6 py-4 flex gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Deleting...
              </>
            ) : (
              'Delete Component'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
