'use client';

import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { Layers, Box } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ViewModeToggle() {
  const { ui, setViewMode } = useConfiguratorStore();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleViewModeChange = (mode: '2D' | '3D') => {
    if (mode === ui.viewMode || isTransitioning) return;

    setIsTransitioning(true);
    setViewMode(mode);

    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-1 flex gap-1">
      <button
        onClick={() => handleViewModeChange('2D')}
        disabled={isTransitioning}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          flex items-center gap-2
          ${
            ui.viewMode === '2D'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-100'
          }
          ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Switch to 2D view"
        aria-pressed={ui.viewMode === '2D'}
      >
        <Layers className="w-4 h-4" />
        <span>2D View</span>
      </button>
      <button
        onClick={() => handleViewModeChange('3D')}
        disabled={isTransitioning}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          flex items-center gap-2
          ${
            ui.viewMode === '3D'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-neutral-700 hover:bg-neutral-100'
          }
          ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label="Switch to 3D view"
        aria-pressed={ui.viewMode === '3D'}
      >
        <Box className="w-4 h-4" />
        <span>3D View</span>
      </button>
    </div>
  );
}
