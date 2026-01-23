'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface ConnectionPoint {
  id: string;
  type: string;
  position: { x: number; y: number; z: number };
  orientation: { x: number; y: number; z: number };
  allowedConnections: string[];
}

interface ConnectionRulesEditorProps {
  connectionPoints: ConnectionPoint[];
  compatibilityRules: unknown[];
  onChange: (
    connectionPoints: ConnectionPoint[],
    compatibilityRules: unknown[]
  ) => void;
}

const CONNECTION_TYPES = [
  'deck',
  'slide',
  'swing',
  'ladder',
  'stairs',
  'roof',
  'structural',
];

export function ConnectionRulesEditor({
  connectionPoints,
  compatibilityRules,
  onChange,
}: ConnectionRulesEditorProps) {
  const [points, setPoints] = useState<ConnectionPoint[]>(
    connectionPoints || []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<ConnectionPoint>>({});

  const handleAddPoint = () => {
    const newPoint: ConnectionPoint = {
      id: `cp-${Date.now()}`,
      type: 'deck',
      position: { x: 0, y: 0, z: 0 },
      orientation: { x: 0, y: 0, z: 0 },
      allowedConnections: [],
    };
    const updatedPoints = [...points, newPoint];
    setPoints(updatedPoints);
    onChange(updatedPoints, compatibilityRules);
    setEditingIndex(updatedPoints.length - 1);
    setEditForm(newPoint);
  };

  const handleEditPoint = (index: number) => {
    setEditingIndex(index);
    setEditForm(points[index]);
  };

  const handleSavePoint = () => {
    if (editingIndex === null) return;

    const updatedPoints = [...points];
    updatedPoints[editingIndex] = editForm as ConnectionPoint;
    setPoints(updatedPoints);
    onChange(updatedPoints, compatibilityRules);
    setEditingIndex(null);
    setEditForm({});
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const handleDeletePoint = (index: number) => {
    const updatedPoints = points.filter((_, i) => i !== index);
    setPoints(updatedPoints);
    onChange(updatedPoints, compatibilityRules);
  };

  const handleFormChange = (field: string, value: unknown) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    setEditForm((prev) => ({
      ...prev,
      position: {
        ...(prev.position || { x: 0, y: 0, z: 0 }),
        [axis]: parseFloat(value) || 0,
      },
    }));
  };

  const handleOrientationChange = (axis: 'x' | 'y' | 'z', value: string) => {
    setEditForm((prev) => ({
      ...prev,
      orientation: {
        ...(prev.orientation || { x: 0, y: 0, z: 0 }),
        [axis]: parseFloat(value) || 0,
      },
    }));
  };

  const handleAllowedConnectionsChange = (value: string) => {
    const connections = value
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    setEditForm((prev) => ({ ...prev, allowedConnections: connections }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900">Connection Points</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleAddPoint}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Point
        </Button>
      </div>

      {points.length === 0 ? (
        <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="text-neutral-600">No connection points defined</p>
          <p className="text-sm text-neutral-500 mt-1">
            Click &quot;Add Point&quot; to create a connection point
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {points.map((point, index) => (
            <div
              key={point.id}
              className="border border-neutral-200 rounded-lg p-4"
            >
              {editingIndex === index ? (
                // Edit Form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Type
                    </label>
                    <select
                      value={editForm.type || ''}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      {CONNECTION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Position (x, y, z)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.position?.x || 0}
                        onChange={(e) =>
                          handlePositionChange('x', e.target.value)
                        }
                        placeholder="X"
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.position?.y || 0}
                        onChange={(e) =>
                          handlePositionChange('y', e.target.value)
                        }
                        placeholder="Y"
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.position?.z || 0}
                        onChange={(e) =>
                          handlePositionChange('z', e.target.value)
                        }
                        placeholder="Z"
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Orientation (x, y, z)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.orientation?.x || 0}
                        onChange={(e) =>
                          handleOrientationChange('x', e.target.value)
                        }
                        placeholder="X"
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.orientation?.y || 0}
                        onChange={(e) =>
                          handleOrientationChange('y', e.target.value)
                        }
                        placeholder="Y"
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={editForm.orientation?.z || 0}
                        onChange={(e) =>
                          handleOrientationChange('z', e.target.value)
                        }
                        placeholder="Z"
                        className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Allowed Connections (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.allowedConnections?.join(', ') || ''}
                      onChange={(e) =>
                        handleAllowedConnectionsChange(e.target.value)
                      }
                      placeholder="e.g., deck, slide, ladder"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleSavePoint}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                // Display View
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-neutral-900">
                        {point.type}
                      </span>
                      <span className="text-xs text-neutral-500">
                        #{point.id}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Position: ({point.position.x}, {point.position.y},{' '}
                      {point.position.z})
                    </p>
                    <p className="text-sm text-neutral-600">
                      Orientation: ({point.orientation.x}, {point.orientation.y}
                      , {point.orientation.z})
                    </p>
                    {point.allowedConnections.length > 0 && (
                      <p className="text-sm text-neutral-600">
                        Allowed: {point.allowedConnections.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditPoint(index)}
                      className="text-neutral-600 hover:text-primary-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePoint(index)}
                      className="text-neutral-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> Connection points define where other components
          can attach to this component. Position and orientation are in 3D space
          relative to the component&apos;s origin.
        </p>
      </div>
    </div>
  );
}
