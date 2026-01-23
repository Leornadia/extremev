'use client';

import { useState } from 'react';
import { ModularComponent } from '@/lib/types/configurator';
import { OptimizedImage } from '@/components/ui/OptimizedImage';

interface ComponentCardProps {
  component: ModularComponent;
  onClick: () => void;
}

export default function ComponentCard({
  component,
  onClick,
}: ComponentCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);

    // Store component data for drop handling
    e.dataTransfer.setData('application/json', JSON.stringify(component));
    e.dataTransfer.effectAllowed = 'copy';

    // Create custom drag preview
    const dragPreview = document.createElement('div');
    dragPreview.className =
      'bg-white border-2 border-primary-500 rounded-lg shadow-xl p-3 flex items-center gap-2';
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-1000px';
    dragPreview.style.left = '-1000px';
    dragPreview.style.zIndex = '9999';

    dragPreview.innerHTML = `
      <div class="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded flex items-center justify-center">
        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <div class="text-sm font-medium text-neutral-900">${component.name}</div>
    `;

    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 25, 25);

    // Clean up drag preview after a short delay
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={`group relative bg-white rounded-lg border-2 overflow-hidden cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging
          ? 'border-primary-500 shadow-lg opacity-50'
          : 'border-neutral-200 hover:border-primary-400 hover:shadow-md'
      }`}
    >
      {/* Component Thumbnail */}
      <div className="aspect-square bg-neutral-100 relative overflow-hidden">
        {/* Placeholder for component image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>

        {/* Drag Indicator */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg
            className="w-3 h-3 text-neutral-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Component Info */}
      <div className="p-2">
        <h4 className="text-xs font-medium text-neutral-900 line-clamp-2 mb-1 min-h-[2rem]">
          {component.name}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-primary-600">
            {formatPrice(component.price)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="text-neutral-400 hover:text-primary-600 transition-colors"
            aria-label="View details"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dimensions Badge */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-neutral-700">
        {component.dimensions.width}×{component.dimensions.depth}×
        {component.dimensions.height}
        {component.dimensions.unit}
      </div>
    </div>
  );
}
