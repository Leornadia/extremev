/**
 * Mobile-Optimized Configurator Controls
 * Provides touch-friendly controls for the configurator on mobile devices
 */

'use client';

import React, { useState } from 'react';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { useIsMobile, useOrientation } from '@/lib/hooks/useMobileDetection';
import { cn } from '@/lib/utils';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Trash2,
  Move,
  Grid3x3,
  Eye,
  EyeOff,
} from 'lucide-react';

export function MobileConfiguratorControls() {
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const { 
    ui, 
    setGridSize, 
    toggleSnapToGrid,
    removeComponent,
    design
  } = useConfiguratorStore();
  
  // Get selected component from the store
  const selectedComponent = ui.selectedComponentIds.length > 0 
    ? design.components.find(c => c.instanceId === ui.selectedComponentIds[0])
    : null;

  const [showControls, setShowControls] = useState(true);

  if (!isMobile) return null;

  return (
    <>
      {/* Floating Action Button to toggle controls */}
      <button
        onClick={() => setShowControls(!showControls)}
        className={cn(
          'fixed bottom-4 right-4 z-30',
          'w-14 h-14 rounded-full',
          'bg-primary-600 text-white',
          'shadow-lg',
          'flex items-center justify-center',
          'touch-target',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'transition-transform duration-200',
          'active:scale-95'
        )}
        aria-label={showControls ? 'Hide controls' : 'Show controls'}
        aria-expanded={showControls}
      >
        {showControls ? (
          <EyeOff className="w-6 h-6" aria-hidden="true" />
        ) : (
          <Eye className="w-6 h-6" aria-hidden="true" />
        )}
      </button>

      {/* Control Panel */}
      {showControls && (
        <div
          className={cn(
            'fixed bottom-20 right-4 z-30',
            'bg-white rounded-2xl shadow-2xl',
            'p-3',
            'flex flex-col gap-2',
            'border border-neutral-200',
            orientation === 'landscape' && 'bottom-4 right-20'
          )}
          role="toolbar"
          aria-label="Configurator controls"
        >
          {/* Zoom Controls */}
          <div className="flex gap-2">
            <button
              className={cn(
                'w-12 h-12 rounded-xl',
                'bg-neutral-100 hover:bg-neutral-200',
                'flex items-center justify-center',
                'touch-target',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                'transition-colors duration-200',
                'active:scale-95'
              )}
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-neutral-700" aria-hidden="true" />
            </button>
            <button
              className={cn(
                'w-12 h-12 rounded-xl',
                'bg-neutral-100 hover:bg-neutral-200',
                'flex items-center justify-center',
                'touch-target',
                'focus:outline-none focus:ring-2 focus:ring-primary-500',
                'transition-colors duration-200',
                'active:scale-95'
              )}
              aria-label="Zoom out"
            >
              <ZoomOut
                className="w-5 h-5 text-neutral-700"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={() => toggleSnapToGrid()}
            className={cn(
              'w-12 h-12 rounded-xl',
              'flex items-center justify-center',
              'touch-target',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'transition-colors duration-200',
              'active:scale-95',
              ui.snapToGrid
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            )}
            aria-label={
              ui.snapToGrid ? 'Disable grid snap' : 'Enable grid snap'
            }
            aria-pressed={ui.snapToGrid}
          >
            <Grid3x3 className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Component Controls (shown when component is selected) */}
          {selectedComponent && (
            <>
              <div className="h-px bg-neutral-200 my-1" role="separator" />

              <button
                className={cn(
                  'w-12 h-12 rounded-xl',
                  'bg-neutral-100 hover:bg-neutral-200',
                  'flex items-center justify-center',
                  'touch-target',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  'transition-colors duration-200',
                  'active:scale-95'
                )}
                aria-label="Rotate component"
              >
                <RotateCw
                  className="w-5 h-5 text-neutral-700"
                  aria-hidden="true"
                />
              </button>

              <button
                className={cn(
                  'w-12 h-12 rounded-xl',
                  'bg-neutral-100 hover:bg-neutral-200',
                  'flex items-center justify-center',
                  'touch-target',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500',
                  'transition-colors duration-200',
                  'active:scale-95'
                )}
                aria-label="Move component"
              >
                <Move className="w-5 h-5 text-neutral-700" aria-hidden="true" />
              </button>

              <button
                onClick={() => removeComponent(selectedComponent.instanceId)}
                className={cn(
                  'w-12 h-12 rounded-xl',
                  'bg-red-50 hover:bg-red-100',
                  'flex items-center justify-center',
                  'touch-target',
                  'focus:outline-none focus:ring-2 focus:ring-red-500',
                  'transition-colors duration-200',
                  'active:scale-95'
                )}
                aria-label="Delete component"
              >
                <Trash2 className="w-5 h-5 text-red-600" aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Touch Gesture Hints (shown briefly on first load) */}
      <div
        className={cn(
          'fixed bottom-4 left-4 z-20',
          'bg-black/75 text-white',
          'px-4 py-2 rounded-lg',
          'text-sm',
          'pointer-events-none',
          'opacity-0 animate-fade-in-out'
        )}
        role="status"
        aria-live="polite"
      >
        <p>Pinch to zoom • Drag to pan</p>
      </div>
    </>
  );
}
