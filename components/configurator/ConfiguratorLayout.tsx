'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ComponentLibraryPanel from './ComponentLibraryPanel';
import DesignCanvas from './DesignCanvas';
import ConfiguratorToolbar from './ConfiguratorToolbar';
import { ValidationPanel } from './ValidationPanel';
import { MobileConfiguratorControls } from './MobileConfiguratorControls';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { Menu, X, Loader2, AlertCircle } from 'lucide-react';

export default function ConfiguratorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoadingDesign, setIsLoadingDesign] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const designId = searchParams.get('design');
  const { loadDesign } = useConfiguratorStore();

  // Load design from URL parameter
  useEffect(() => {
    if (!designId) return;

    const fetchAndLoadDesign = async () => {
      setIsLoadingDesign(true);
      setLoadError(null);

      try {
        const response = await fetch(`/api/designs/${designId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Design not found');
          } else if (response.status === 401) {
            throw new Error('Please sign in to load this design');
          } else {
            throw new Error('Failed to load design');
          }
        }

        const { design } = await response.json();

        // Load the design into the configurator
        loadDesign(design.designData);
      } catch (error) {
        console.error('Error loading design:', error);
        setLoadError(
          error instanceof Error ? error.message : 'Failed to load design'
        );
      } finally {
        setIsLoadingDesign(false);
      }
    };

    fetchAndLoadDesign();
  }, [designId, loadDesign]);

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Loading Overlay */}
      {isLoadingDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">
                  Loading Design
                </h3>
                <p className="text-sm text-neutral-600">
                  Please wait while we load your design...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {loadError && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 mb-1">
                  Failed to Load Design
                </h4>
                <p className="text-sm text-red-700">{loadError}</p>
              </div>
              <button
                onClick={() => setLoadError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label={
          isMobileSidebarOpen
            ? 'Close component library'
            : 'Open component library'
        }
        aria-expanded={isMobileSidebarOpen}
        aria-controls="component-library-sidebar"
      >
        {isMobileSidebarOpen ? (
          <X className="w-6 h-6" aria-hidden="true" />
        ) : (
          <Menu className="w-6 h-6" aria-hidden="true" />
        )}
      </button>

      {/* Sidebar - Component Library */}
      <aside
        id="component-library-sidebar"
        className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-80 bg-white border-r border-neutral-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${!isSidebarOpen && 'lg:-translate-x-full lg:w-0'}
          overflow-hidden
        `}
        role="complementary"
        aria-label="Component library"
      >
        <ComponentLibraryPanel />
      </aside>

      {/* Mobile Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main
        className="flex-1 flex flex-col overflow-hidden"
        role="main"
        aria-label="Design canvas"
      >
        {/* Toolbar */}
        <ConfiguratorToolbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Canvas Area */}
        <div
          className="flex-1 overflow-hidden"
          role="region"
          aria-label="Design workspace"
        >
          <DesignCanvas />
        </div>

        {/* Validation Panel */}
        <ValidationPanel />
      </main>

      {/* Mobile Controls */}
      <MobileConfiguratorControls />
    </div>
  );
}
