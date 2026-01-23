'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ComponentFormModal } from './ComponentFormModal';
import { DeleteComponentModal } from './DeleteComponentModal';
import { Button } from '@/components/ui';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  tier: {
    name: string;
  };
  price: number;
  thumbnail: string;
  published: boolean;
}

interface ComponentCardProps {
  component: Component;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

export function ComponentCard({
  component,
  onUpdated,
  onDeleted,
}: ComponentCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    onUpdated?.();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteModalOpen(false);
    onDeleted?.();
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className="relative aspect-square bg-neutral-100">
          <Image
            src={component.thumbnail}
            alt={component.name}
            fill
            className="object-cover"
          />
          {!component.published && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              Draft
            </div>
          )}
          {component.published && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Published
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900 mb-1">
            {component.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
            <span className="bg-neutral-100 px-2 py-0.5 rounded">
              {component.category}
            </span>
            {component.subcategory && (
              <span className="bg-neutral-100 px-2 py-0.5 rounded">
                {component.subcategory}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-neutral-600">
              {component.tier.name}
            </span>
            <span className="font-semibold text-primary-600">
              ${component.price.toFixed(2)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <ComponentFormModal
          mode="edit"
          componentId={component.id}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteComponentModal
          component={component}
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
