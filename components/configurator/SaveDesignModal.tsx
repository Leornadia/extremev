'use client';

import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, thumbnail: string) => Promise<void>;
  defaultName?: string;
  isUpdating?: boolean;
}

export function SaveDesignModal({
  isOpen,
  onClose,
  onSave,
  defaultName = 'Untitled Design',
  isUpdating = false,
}: SaveDesignModalProps) {
  const [name, setName] = useState(defaultName);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a design name');
      return;
    }

    if (!session?.user) {
      // Redirect to sign in
      router.push('/auth/signin?callbackUrl=/configurator');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Generate thumbnail (placeholder for now)
      const thumbnail = '';

      await onSave(name.trim(), thumbnail);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save design');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">
            {isUpdating ? 'Update Design' : 'Save Design'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!session?.user && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                You need to sign in to save your design. You'll be redirected to
                the sign in page.
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="design-name"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Design Name
            </label>
            <input
              id="design-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSaving}
              placeholder="Enter a name for your design"
              className="
                w-full px-4 py-3 rounded-lg
                border border-neutral-300
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                disabled:bg-neutral-100 disabled:cursor-not-allowed
                transition-colors
              "
              maxLength={100}
              autoFocus
            />
            <p className="mt-2 text-xs text-neutral-500">
              {name.length}/100 characters
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="
              px-4 py-2 rounded-lg
              text-neutral-700 font-medium
              hover:bg-neutral-100
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="
              flex items-center gap-2
              px-6 py-2 rounded-lg
              bg-primary-600 text-white font-medium
              hover:bg-primary-700
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isUpdating ? 'Update' : 'Save'} Design</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
