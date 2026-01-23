'use client';

import { useState, useEffect } from 'react';
import { Button, Spinner } from '@/components/ui';
import { X, AlertCircle, FolderTree, Edit2 } from 'lucide-react';

interface Category {
  name: string;
  count: number;
  subcategories: Array<{ name: string; count: number }>;
}

interface CategoryManagementModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CategoryManagementModal({
  onClose,
  onSuccess,
}: CategoryManagementModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{
    category: string;
    subcategory: string;
  } | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load categories'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRenameCategory = async (oldName: string) => {
    if (!newName.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rename-category',
          oldCategory: oldName,
          newCategory: newName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Failed to rename category'
        );
      }

      setEditingCategory(null);
      setNewName('');
      await fetchCategories();
      onSuccess();
    } catch (err) {
      console.error('Error renaming category:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to rename category'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRenameSubcategory = async (
    category: string,
    oldSubcategory: string
  ) => {
    if (!newName.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rename-subcategory',
          oldCategory: category,
          oldSubcategory,
          newSubcategory: newName.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || 'Failed to rename subcategory'
        );
      }

      setEditingSubcategory(null);
      setNewName('');
      await fetchCategories();
      onSuccess();
    } catch (err) {
      console.error('Error renaming subcategory:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to rename subcategory'
      );
    } finally {
      setLoading(false);
    }
  };

  const startEditCategory = (categoryName: string) => {
    setEditingCategory(categoryName);
    setNewName(categoryName);
    setEditingSubcategory(null);
  };

  const startEditSubcategory = (category: string, subcategory: string) => {
    setEditingSubcategory({ category, subcategory });
    setNewName(subcategory);
    setEditingCategory(null);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubcategory(null);
    setNewName('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">
              Category Management
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {loading && !categories.length ? (
            <div className="flex items-center justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Renaming categories will update all
                  components in that category. This action cannot be undone.
                </p>
              </div>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className="border border-neutral-200 rounded-lg p-4"
                  >
                    {/* Category */}
                    <div className="flex items-center justify-between mb-3">
                      {editingCategory === category.name ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            autoFocus
                          />
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleRenameCategory(category.name)}
                            disabled={loading}
                          >
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h3 className="font-semibold text-neutral-900">
                              {category.name}
                            </h3>
                            <p className="text-sm text-neutral-600">
                              {category.count} component
                              {category.count !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => startEditCategory(category.name)}
                            className="text-neutral-600 hover:text-primary-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Subcategories */}
                    {category.subcategories.length > 0 && (
                      <div className="ml-4 space-y-2 border-l-2 border-neutral-200 pl-4">
                        {category.subcategories.map((sub) => (
                          <div
                            key={sub.name}
                            className="flex items-center justify-between"
                          >
                            {editingSubcategory?.category === category.name &&
                            editingSubcategory?.subcategory === sub.name ? (
                              <div className="flex-1 flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newName}
                                  onChange={(e) => setNewName(e.target.value)}
                                  className="flex-1 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  autoFocus
                                />
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() =>
                                    handleRenameSubcategory(
                                      category.name,
                                      sub.name
                                    )
                                  }
                                  disabled={loading}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={cancelEdit}
                                  disabled={loading}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <p className="text-sm text-neutral-700">
                                    {sub.name}
                                  </p>
                                  <p className="text-xs text-neutral-500">
                                    {sub.count} component
                                    {sub.count !== 1 ? 's' : ''}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    startEditSubcategory(
                                      category.name,
                                      sub.name
                                    )
                                  }
                                  className="text-neutral-600 hover:text-primary-600"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-200 px-6 py-4">
          <Button variant="ghost" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
