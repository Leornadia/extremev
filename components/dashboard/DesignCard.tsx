'use client';

import { useState } from 'react';
import { SavedDesign } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Loader2,
} from 'lucide-react';
import RenameDesignModal from '@/components/dashboard/RenameDesignModal';
import DeleteConfirmModal from '@/components/dashboard/DeleteConfirmModal';

interface DesignCardProps {
  design: SavedDesign;
  onUpdate: () => void;
}

export function DesignCard({ design, onUpdate }: DesignCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const metadata = (design.designData as any)?.metadata;
  const componentCount = metadata?.componentCount || 0;
  const totalPrice = metadata?.totalPrice || 0;

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    setShowMenu(false);

    try {
      const response = await fetch(`/api/designs/${design.id}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate design');
      }

      onUpdate();
    } catch (error) {
      console.error('Error duplicating design:', error);
      alert('Failed to duplicate design. Please try again.');
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleRename = async (newName: string) => {
    try {
      const response = await fetch(`/api/designs/${design.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to rename design');
      }

      onUpdate();
    } catch (error) {
      console.error('Error renaming design:', error);
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/designs/${design.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete design');
      }

      onUpdate();
    } catch (error) {
      console.error('Error deleting design:', error);
      throw error;
    }
  };

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative">
        {/* Thumbnail */}
        <div className="aspect-video bg-neutral-100 relative">
          {design.thumbnail ? (
            <Image
              src={design.thumbnail}
              alt={design.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="w-12 h-12 text-neutral-400" />
            </div>
          )}

          {/* Duplicating Overlay */}
          {isDuplicating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-neutral-900 truncate flex-1 pr-2">
              {design.name}
            </h3>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 text-neutral-400 hover:text-neutral-600 rounded transition-colors"
                aria-label="Design actions"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />

                  {/* Menu */}
                  <div className="absolute right-0 top-8 z-20 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowRenameModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Rename</span>
                    </button>
                    <button
                      onClick={handleDuplicate}
                      disabled={isDuplicating}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <p className="text-xs text-neutral-600">
              {componentCount} component{componentCount === 1 ? '' : 's'}
            </p>
            {totalPrice > 0 && (
              <p className="text-xs text-neutral-600">
                Est. ${totalPrice.toLocaleString()}
              </p>
            )}
            <p className="text-xs text-neutral-500">
              Updated {new Date(design.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <Link
            href={`/configurator?design=${design.id}`}
            className="block text-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Open Design
          </Link>
        </div>
      </div>

      {/* Rename Modal */}
      <RenameDesignModal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onRename={handleRename}
        currentName={design.name}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        designName={design.name}
      />
    </>
  );
}
