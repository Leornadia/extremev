'use client';

import { useState } from 'react';
import { X, Edit2, Loader2 } from 'lucide-react';

interface RenameDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
  currentName: string;
}

export default function RenameDesignModal({
  isOpen,
  onClose,
  onRename,
  currentName,
}: RenameDesignModalProps) {
  const [name, setName] = useState(currentName);
  const [isRenaming, setIsRenaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRename = async () => {
    if (!name.trim()) {
      setError('Please enter a design name');
      return;
    }

    if (name.trim() === currentName) {
      onClose();
      return;
    }

    setIsRenaming(true);
    setError(null);

    try {
      await onRename(name.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename design');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRenaming) {
      handleRename();
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
          <h2 className="text-xl font-bold text-neutral-900">Rename Design</h2>
          <button
            onClick={onClose}
            disabled={isRenaming}
            className="text-neutral-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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
              disabled={isRenaming}
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
            disabled={isRenaming}
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
            onClick={handleRename}
            disabled={isRenaming || !name.trim()}
            className="
              flex items-center gap-2
              px-6 py-2 rounded-lg
              bg-primary-600 text-white font-medium
              hover:bg-primary-700
              transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isRenaming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Renaming...</span>
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                <span>Rename</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
