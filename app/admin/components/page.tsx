'use client';

import { useState } from 'react';
import { AdminComponentsList, ComponentFormModal } from '@/components/admin';
import { BulkPricingModal } from '@/components/admin/BulkPricingModal';
import { CategoryManagementModal } from '@/components/admin/CategoryManagementModal';
import { Button } from '@/components/ui';
import { Plus, DollarSign, FolderTree } from 'lucide-react';

export default function AdminComponentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkPricingModalOpen, setIsBulkPricingModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleComponentCreated = () => {
    setIsCreateModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleComponentUpdated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleComponentDeleted = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleBulkPricingSuccess = () => {
    setIsBulkPricingModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCategorySuccess = () => {
    setIsCategoryModalOpen(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Component Management
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage modular components for the product configurator
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2"
          >
            <FolderTree className="w-5 h-5" />
            Categories
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsBulkPricingModalOpen(true)}
            className="flex items-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Bulk Pricing
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Component
          </Button>
        </div>
      </div>

      {/* Components List */}
      <AdminComponentsList
        refreshTrigger={refreshTrigger}
        onComponentUpdated={handleComponentUpdated}
        onComponentDeleted={handleComponentDeleted}
      />

      {/* Create Component Modal */}
      {isCreateModalOpen && (
        <ComponentFormModal
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleComponentCreated}
        />
      )}

      {/* Bulk Pricing Modal */}
      {isBulkPricingModalOpen && (
        <BulkPricingModal
          onClose={() => setIsBulkPricingModalOpen(false)}
          onSuccess={handleBulkPricingSuccess}
        />
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <CategoryManagementModal
          onClose={() => setIsCategoryModalOpen(false)}
          onSuccess={handleCategorySuccess}
        />
      )}
    </div>
  );
}
