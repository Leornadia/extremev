'use client';

import { Design } from '@/lib/types/configurator';
import { Box, Ruler } from 'lucide-react';

interface DesignVisualizationProps {
  design: Design;
}

export function DesignVisualization({ design }: DesignVisualizationProps) {
  const componentCount = design.components?.length || 0;
  const dimensions = design.metadata?.dimensions;

  // Group components by category
  const componentsByCategory =
    design.components?.reduce(
      (acc, comp) => {
        const category = (comp as any).category || 'Other';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(comp);
        return acc;
      },
      {} as Record<string, any[]>
    ) || {};

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-50 border-b border-neutral-200">
        <div>
          <p className="text-xs text-neutral-600 mb-1">Components</p>
          <p className="text-lg font-semibold text-neutral-900">
            {componentCount}
          </p>
        </div>

        {dimensions && (
          <>
            <div>
              <p className="text-xs text-neutral-600 mb-1">Width</p>
              <p className="text-lg font-semibold text-neutral-900">
                {dimensions.width}ft
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-600 mb-1">Depth</p>
              <p className="text-lg font-semibold text-neutral-900">
                {dimensions.depth}ft
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-600 mb-1">Height</p>
              <p className="text-lg font-semibold text-neutral-900">
                {dimensions.height}ft
              </p>
            </div>
          </>
        )}
      </div>

      {/* Component List */}
      <div className="p-4">
        <h5 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
          <Box className="w-4 h-4" />
          Components Breakdown
        </h5>

        <div className="space-y-3">
          {Object.entries(componentsByCategory).map(
            ([category, components]) => (
              <div key={category}>
                <p className="text-xs font-medium text-neutral-600 uppercase mb-1">
                  {category}
                </p>
                <div className="space-y-1">
                  {components.map((comp, idx) => (
                    <div
                      key={`${comp.instanceId}-${idx}`}
                      className="flex items-center justify-between text-sm py-1"
                    >
                      <span className="text-neutral-700">
                        {(comp as any).name || 'Component'}
                      </span>
                      <span className="text-neutral-500 text-xs">
                        ID: {comp.instanceId?.slice(0, 8)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {componentCount === 0 && (
          <p className="text-sm text-neutral-500 italic">
            No components in design
          </p>
        )}
      </div>

      {/* Design Metadata */}
      {design.metadata && (
        <div className="p-4 bg-neutral-50 border-t border-neutral-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {design.metadata.ageRange && (
              <div>
                <p className="text-neutral-600">Age Range</p>
                <p className="font-medium text-neutral-900">
                  {design.metadata.ageRange}
                </p>
              </div>
            )}
            {design.metadata.estimatedWeight && (
              <div>
                <p className="text-neutral-600">Est. Weight</p>
                <p className="font-medium text-neutral-900">
                  {design.metadata.estimatedWeight} lbs
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
