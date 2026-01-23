'use client';

import { useState } from 'react';
import {
  Undo,
  Redo,
  Save,
  Download,
  PanelLeftClose,
  PanelLeft,
  Grid3x3,
} from 'lucide-react';
import Link from 'next/link';
import { useConfiguratorStore } from '@/lib/store/configuratorStore';
import { ValidationBadge } from './ValidationBadge';
import { SaveDesignModal } from './SaveDesignModal';

interface ConfiguratorToolbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export default function ConfiguratorToolbar({
  isSidebarOpen,
  onToggleSidebar,
}: ConfiguratorToolbarProps) {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const {
    ui,
    design,
    validation,
    canUndo,
    canRedo,
    undo,
    redo,
    toggleSnapToGrid,
    updateDesignName,
    saveDesign,
    updateSavedDesign,
  } = useConfiguratorStore();

  const handleSave = async (name: string, thumbnail: string) => {
    if (design.id) {
      // Update existing design
      await updateSavedDesign(design.id, name, thumbnail);
    } else {
      // Save new design
      await saveDesign(name, thumbnail);
    }
  };
  return (
    <div className="bg-white border-b border-neutral-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Logo/Back */}
          <Link
            href="/"
            className="text-sm font-medium text-neutral-700 hover:text-neutral-900"
          >
            ← Back to Home
          </Link>

          {/* Sidebar Toggle (Desktop) */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Center Section - Design Name & Canvas Controls */}
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            value={design.name || 'Untitled Design'}
            onChange={(e) => updateDesignName(e.target.value)}
            className="px-3 py-1 text-center border border-transparent hover:border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500"
          />

          {/* Canvas Controls */}
          <div className="flex items-center gap-1 border-l border-neutral-200 pl-4">
            <button
              onClick={toggleSnapToGrid}
              className={`p-2 rounded-lg transition-colors ${
                ui.snapToGrid
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
              title="Toggle Snap to Grid"
              aria-label="Toggle snap to grid"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Validation Badge */}
          <ValidationBadge />

          {/* Undo/Redo */}
          <div className="hidden sm:flex items-center gap-1 mr-2">
            <button
              onClick={undo}
              className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canUndo()}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              className="p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!canRedo()}
              aria-label="Redo"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Save */}
          <button
            onClick={() => setIsSaveModalOpen(true)}
            disabled={ui.isSaving}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{ui.isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          {/* Save Design Modal */}
          <SaveDesignModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            onSave={handleSave}
            defaultName={design.name || 'Untitled Design'}
            isUpdating={!!design.id}
          />

          {/* Export */}
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>

          {/* Request Quote */}
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary-500 text-white hover:bg-primary-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-neutral-400"
            disabled={!validation.isValid}
            title={
              !validation.isValid
                ? 'Fix validation errors before requesting a quote'
                : 'Request a quote for this design'
            }
          >
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
}
