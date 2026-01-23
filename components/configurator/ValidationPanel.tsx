'use client';

import React from 'react';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { ValidationError, ValidationWarning } from '@/lib/types/configurator';

/**
 * ValidationPanel Component
 *
 * Displays validation errors and warnings for the current design.
 * Requirements: 20.2, 20.4, 20.5
 */
export function ValidationPanel() {
  const validation = useConfiguratorStore((state) => state.validation);
  const highlightComponents = useConfiguratorStore(
    (state) => state.highlightComponents
  );
  const clearHighlight = useConfiguratorStore((state) => state.clearHighlight);

  const { isValid, errors, warnings } = validation;

  // Don't show panel if everything is valid
  if (isValid && warnings.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-t border-neutral-200">
      {/* Summary Header */}
      <div className="px-4 py-3 border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-neutral-900">
              Design Validation
            </h3>
            {!isValid && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                Action Required
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs">
            {errors.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-neutral-600">
                  {errors.length} Error{errors.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {warnings.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-neutral-600">
                  {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {/* Errors Section */}
          {errors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-red-900">
                  {errors.length} Error{errors.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className="space-y-2">
                {errors.map((error) => (
                  <ValidationErrorItem
                    key={error.id}
                    error={error}
                    onHighlight={(componentIds) => {
                      highlightComponents(componentIds);
                    }}
                    onClearHighlight={() => clearHighlight()}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Warnings Section */}
          {warnings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-amber-900">
                  {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
                </h3>
              </div>
              <div className="space-y-2">
                {warnings.map((warning) => (
                  <ValidationWarningItem
                    key={warning.id}
                    warning={warning}
                    onHighlight={(componentIds) => {
                      highlightComponents(componentIds);
                    }}
                    onClearHighlight={() => clearHighlight()}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quote Request Blocker */}
          {!isValid && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-900">
                    Quote requests are blocked
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    Please fix all validation errors before requesting a quote.
                    Your design must meet safety and structural requirements.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ValidationErrorItem Component
 */
interface ValidationErrorItemProps {
  error: ValidationError;
  onHighlight: (componentIds: string[]) => void;
  onClearHighlight: () => void;
}

function ValidationErrorItem({
  error,
  onHighlight,
  onClearHighlight,
}: ValidationErrorItemProps) {
  const [isHighlighted, setIsHighlighted] = React.useState(false);

  const handleToggleHighlight = () => {
    if (isHighlighted) {
      onClearHighlight();
      setIsHighlighted(false);
    } else {
      onHighlight(error.affectedComponents);
      setIsHighlighted(true);
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900">
                {error.message}
              </p>
              {error.suggestion && (
                <div className="mt-2 p-2 bg-red-100 rounded border border-red-300">
                  <p className="text-xs text-red-800">
                    <strong>Suggestion:</strong> {error.suggestion}
                  </p>
                </div>
              )}
            </div>
            {error.affectedComponents.length > 0 && (
              <button
                onClick={handleToggleHighlight}
                className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  isHighlighted
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-red-200 text-red-800 hover:bg-red-300'
                }`}
                title={
                  isHighlighted ? 'Clear highlight' : 'Highlight components'
                }
              >
                {isHighlighted ? 'Clear' : 'Show'} (
                {error.affectedComponents.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ValidationWarningItem Component
 */
interface ValidationWarningItemProps {
  warning: ValidationWarning;
  onHighlight: (componentIds: string[]) => void;
  onClearHighlight: () => void;
}

function ValidationWarningItem({
  warning,
  onHighlight,
  onClearHighlight,
}: ValidationWarningItemProps) {
  const [isHighlighted, setIsHighlighted] = React.useState(false);

  const handleToggleHighlight = () => {
    if (isHighlighted) {
      onClearHighlight();
      setIsHighlighted(false);
    } else {
      onHighlight(warning.affectedComponents);
      setIsHighlighted(true);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">
                {warning.message}
              </p>
              {warning.suggestion && (
                <div className="mt-2 p-2 bg-amber-100 rounded border border-amber-300">
                  <p className="text-xs text-amber-800">
                    <strong>Suggestion:</strong> {warning.suggestion}
                  </p>
                </div>
              )}
            </div>
            {warning.affectedComponents.length > 0 && (
              <button
                onClick={handleToggleHighlight}
                className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  isHighlighted
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
                }`}
                title={
                  isHighlighted ? 'Clear highlight' : 'Highlight components'
                }
              >
                {isHighlighted ? 'Clear' : 'Show'} (
                {warning.affectedComponents.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
