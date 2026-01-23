'use client';

import React from 'react';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';

/**
 * ValidationBadge Component
 *
 * Shows a compact validation status indicator in the toolbar
 */
export function ValidationBadge() {
  const validation = useConfiguratorStore((state) => state.validation);

  const { isValid, errors, warnings } = validation;

  if (isValid && warnings.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-medium text-green-900">Valid Design</span>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs font-medium text-red-900">
          {errors.length} Error{errors.length !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  if (warnings.length > 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-xs font-medium text-amber-900">
          {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
        </span>
      </div>
    );
  }

  return null;
}
