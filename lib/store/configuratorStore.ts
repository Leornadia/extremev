import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  ConfiguratorStore,
  Design,
  PlacedComponent,
  ModularComponent,
  Vector3D,
  Connection,
  ComponentCategory,
  ValidationResult,
  DesignMetadata,
} from '@/lib/types/configurator';
import { validationEngine } from '@/lib/validation';

/**
 * Helper function to calculate metadata from placed components
 */
const calculateMetadataWithComponents = (
  components: PlacedComponent[]
): DesignMetadata => {
  if (components.length === 0) {
    return {
      totalPrice: 0,
      dimensions: { width: 0, depth: 0, height: 0, unit: 'ft' },
      estimatedWeight: 0,
      ageRange: '3-12',
      capacity: 0,
      componentCount: 0,
    };
  }

  let totalPrice = 0;
  let totalWeight = 0;
  let maxWidth = 0;
  let maxDepth = 0;
  let maxHeight = 0;
  let totalCapacity = 0;

  components.forEach((placedComp) => {
    // Extract component data from customizations
    const componentData = placedComp.customizations?.options?._componentData as
      | ModularComponent
      | undefined;

    if (componentData) {
      totalPrice += componentData.price;
      totalWeight += componentData.weight;
      totalCapacity += componentData.metadata.capacity;

      // Calculate bounding box
      const compMaxX = placedComp.position.x + componentData.dimensions.width;
      const compMaxY = placedComp.position.y + componentData.dimensions.depth;
      const compMaxZ = placedComp.position.z + componentData.dimensions.height;

      maxWidth = Math.max(maxWidth, compMaxX);
      maxDepth = Math.max(maxDepth, compMaxY);
      maxHeight = Math.max(maxHeight, compMaxZ);
    }
  });

  return {
    totalPrice,
    dimensions: {
      width: Math.round(maxWidth * 10) / 10,
      depth: Math.round(maxDepth * 10) / 10,
      height: Math.round(maxHeight * 10) / 10,
      unit: 'ft',
    },
    estimatedWeight: Math.round(totalWeight),
    ageRange: '3-12',
    capacity: totalCapacity,
    componentCount: components.length,
  };
};

/**
 * Initial state for a new design
 */
const createInitialDesign = (): Design => ({
  name: 'Untitled Design',
  components: [],
  metadata: {
    totalPrice: 0,
    dimensions: { width: 0, depth: 0, height: 0, unit: 'ft' },
    estimatedWeight: 0,
    ageRange: '3-12',
    capacity: 0,
    componentCount: 0,
  },
});

/**
 * Initial validation result
 */
const createInitialValidation = (): ValidationResult => ({
  isValid: true,
  errors: [],
  warnings: [],
});

/**
 * Configurator Store
 *
 * Manages the complete state of the product configurator including:
 * - Design state (components, connections, metadata)
 * - UI state (view mode, selection, grid settings)
 * - Validation state
 * - History for undo/redo
 */
export const useConfiguratorStore = create<ConfiguratorStore>()(
  devtools(
    (set, get) => ({
      // ============================================================================
      // Initial State
      // ============================================================================
      design: createInitialDesign(),
      ui: {
        viewMode: '2D',
        selectedComponentIds: [],
        activeCategory: null,
        gridSize: 1,
        snapToGrid: true,
        showDimensions: true,
        showConnectionPoints: false,
        isLoading: false,
        isSaving: false,
        highlightedComponentIds: [], // For validation error highlighting
      },
      validation: createInitialValidation(),
      history: {
        past: [],
        future: [],
      },

      // ============================================================================
      // Component Management Actions
      // ============================================================================

      addComponent: (component: ModularComponent, position: Vector3D) => {
        set((state) => {
          const instanceId = `${component.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const newComponent: PlacedComponent = {
            instanceId,
            componentId: component.id,
            position,
            rotation: { x: 0, y: 0, z: 0 },
            connections: [],
            // Store component data for metadata calculation
            customizations: {
              options: {
                _componentData: component, // Store full component data
              },
            },
          };

          const newDesign: Design = {
            ...state.design,
            components: [...state.design.components, newComponent],
          };

          // Calculate new metadata with component data
          const metadata = calculateMetadataWithComponents(
            newDesign.components
          );
          newDesign.metadata = metadata;

          // Add to history
          const newHistory = {
            past: [...state.history.past, state.design],
            future: [],
          };

          return {
            design: newDesign,
            history: newHistory,
            ui: {
              ...state.ui,
              selectedComponentIds: [instanceId],
            },
          };
        });

        // Validate after adding
        get().validateDesign();
      },

      removeComponent: (instanceId: string) => {
        set((state) => {
          const newComponents = state.design.components.filter(
            (c) => c.instanceId !== instanceId
          );

          // Remove connections involving this component
          const newComponentsWithConnections = newComponents.map((comp) => ({
            ...comp,
            connections: comp.connections.filter(
              (conn) =>
                conn.fromInstanceId !== instanceId &&
                conn.toInstanceId !== instanceId
            ),
          }));

          const newDesign: Design = {
            ...state.design,
            components: newComponentsWithConnections,
          };

          // Calculate new metadata
          const metadata = calculateMetadataWithComponents(
            newComponentsWithConnections
          );
          newDesign.metadata = metadata;

          // Add to history
          const newHistory = {
            past: [...state.history.past, state.design],
            future: [],
          };

          return {
            design: newDesign,
            history: newHistory,
            ui: {
              ...state.ui,
              selectedComponentIds: state.ui.selectedComponentIds.filter(
                (id) => id !== instanceId
              ),
            },
          };
        });

        // Validate after removing
        get().validateDesign();
      },

      updateComponentPosition: (instanceId: string, position: Vector3D) => {
        set((state) => {
          const newComponents = state.design.components.map((comp) =>
            comp.instanceId === instanceId ? { ...comp, position } : comp
          );

          const newDesign: Design = {
            ...state.design,
            components: newComponents,
          };

          return { design: newDesign };
        });
      },

      updateComponentRotation: (instanceId: string, rotation: Vector3D) => {
        set((state) => {
          const newComponents = state.design.components.map((comp) =>
            comp.instanceId === instanceId ? { ...comp, rotation } : comp
          );

          const newDesign: Design = {
            ...state.design,
            components: newComponents,
          };

          return { design: newDesign };
        });
      },

      duplicateComponent: (instanceId: string) => {
        set((state) => {
          const original = state.design.components.find(
            (c) => c.instanceId === instanceId
          );

          if (!original) return state;

          const newInstanceId = `${original.componentId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const duplicate: PlacedComponent = {
            ...original,
            instanceId: newInstanceId,
            position: {
              x: original.position.x + 2,
              y: original.position.y + 2,
              z: original.position.z,
            },
            connections: [], // Don't copy connections
          };

          const newComponents = [...state.design.components, duplicate];

          const newDesign: Design = {
            ...state.design,
            components: newComponents,
          };

          // Calculate new metadata
          const metadata = calculateMetadataWithComponents(newComponents);
          newDesign.metadata = metadata;

          // Add to history
          const newHistory = {
            past: [...state.history.past, state.design],
            future: [],
          };

          return {
            design: newDesign,
            history: newHistory,
            ui: {
              ...state.ui,
              selectedComponentIds: [newInstanceId],
            },
          };
        });

        get().validateDesign();
      },

      // ============================================================================
      // Connection Management Actions
      // ============================================================================

      createConnection: (connection: Omit<Connection, 'id'>) => {
        set((state) => {
          const connectionId = `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const newConnection: Connection = {
            ...connection,
            id: connectionId,
          };

          const newComponents = state.design.components.map((comp) => {
            if (comp.instanceId === connection.fromInstanceId) {
              return {
                ...comp,
                connections: [...comp.connections, newConnection],
              };
            }
            return comp;
          });

          const newDesign: Design = {
            ...state.design,
            components: newComponents,
          };

          // Add to history
          const newHistory = {
            past: [...state.history.past, state.design],
            future: [],
          };

          return {
            design: newDesign,
            history: newHistory,
          };
        });

        get().validateDesign();
      },

      removeConnection: (connectionId: string) => {
        set((state) => {
          const newComponents = state.design.components.map((comp) => ({
            ...comp,
            connections: comp.connections.filter((c) => c.id !== connectionId),
          }));

          const newDesign: Design = {
            ...state.design,
            components: newComponents,
          };

          // Add to history
          const newHistory = {
            past: [...state.history.past, state.design],
            future: [],
          };

          return {
            design: newDesign,
            history: newHistory,
          };
        });

        get().validateDesign();
      },

      // ============================================================================
      // Selection Management Actions
      // ============================================================================

      selectComponent: (instanceId: string, multiSelect = false) => {
        set((state) => {
          const selectedIds = multiSelect
            ? [...state.ui.selectedComponentIds, instanceId]
            : [instanceId];

          return {
            ui: {
              ...state.ui,
              selectedComponentIds: selectedIds,
            },
          };
        });
      },

      deselectComponent: (instanceId: string) => {
        set((state) => ({
          ui: {
            ...state.ui,
            selectedComponentIds: state.ui.selectedComponentIds.filter(
              (id) => id !== instanceId
            ),
          },
        }));
      },

      clearSelection: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            selectedComponentIds: [],
          },
        }));
      },

      highlightComponents: (instanceIds: string[]) => {
        set((state) => ({
          ui: {
            ...state.ui,
            highlightedComponentIds: instanceIds,
          },
        }));
      },

      clearHighlight: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            highlightedComponentIds: [],
          },
        }));
      },

      // ============================================================================
      // Design Management Actions
      // ============================================================================

      loadDesign: (design: Design) => {
        set((state) => ({
          design,
          history: {
            past: [],
            future: [],
          },
          ui: {
            ...state.ui,
            selectedComponentIds: [],
          },
        }));

        get().validateDesign();
      },

      clearDesign: () => {
        set((state) => ({
          design: createInitialDesign(),
          history: {
            past: [...state.history.past, state.design],
            future: [],
          },
          ui: {
            ...state.ui,
            selectedComponentIds: [],
          },
          validation: createInitialValidation(),
        }));
      },

      updateDesignName: (name: string) => {
        set((state) => ({
          design: {
            ...state.design,
            name,
          },
        }));
      },

      // ============================================================================
      // UI Management Actions
      // ============================================================================

      setViewMode: (mode: '2D' | '3D') => {
        set((state) => ({
          ui: {
            ...state.ui,
            viewMode: mode,
          },
        }));
      },

      setActiveCategory: (category: ComponentCategory | null) => {
        set((state) => ({
          ui: {
            ...state.ui,
            activeCategory: category,
          },
        }));
      },

      toggleSnapToGrid: () => {
        set((state) => ({
          ui: {
            ...state.ui,
            snapToGrid: !state.ui.snapToGrid,
          },
        }));
      },

      setGridSize: (size: number) => {
        set((state) => ({
          ui: {
            ...state.ui,
            gridSize: size,
          },
        }));
      },

      // ============================================================================
      // History Management Actions (Undo/Redo)
      // ============================================================================

      undo: () => {
        set((state) => {
          if (state.history.past.length === 0) return state;

          const previous = state.history.past[state.history.past.length - 1];
          const newPast = state.history.past.slice(0, -1);

          return {
            design: previous,
            history: {
              past: newPast,
              future: [state.design, ...state.history.future],
            },
          };
        });

        get().validateDesign();
      },

      redo: () => {
        set((state) => {
          if (state.history.future.length === 0) return state;

          const next = state.history.future[0];
          const newFuture = state.history.future.slice(1);

          return {
            design: next,
            history: {
              past: [...state.history.past, state.design],
              future: newFuture,
            },
          };
        });

        get().validateDesign();
      },

      canUndo: () => {
        return get().history.past.length > 0;
      },

      canRedo: () => {
        return get().history.future.length > 0;
      },

      // ============================================================================
      // Validation
      // ============================================================================

      validateDesign: () => {
        const state = get();
        const design = state.design;

        // Use validation engine to evaluate all rules
        const { errors, warnings } = validationEngine.evaluate(design);

        const validation: ValidationResult = {
          isValid: errors.length === 0,
          errors,
          warnings,
        };

        set({ validation });
        return validation;
      },

      // ============================================================================
      // Metadata Calculation
      // ============================================================================

      calculateMetadata: () => {
        const state = get();
        const { components } = state.design;

        // TODO: Implement actual metadata calculation
        // This is a placeholder that will be enhanced when component data is available

        const metadata: DesignMetadata = {
          totalPrice: 0,
          dimensions: { width: 0, depth: 0, height: 0, unit: 'ft' },
          estimatedWeight: 0,
          ageRange: '3-12',
          capacity: 0,
          componentCount: components.length,
        };

        return metadata;
      },

      // ============================================================================
      // Screenshot/Thumbnail Management
      // ============================================================================

      // Note: Screenshot capture is handled by the useScreenshot hook
      // This is just a placeholder for future integration with design saving
      captureDesignThumbnail: async (): Promise<string | null> => {
        // This will be implemented when integrating with the save design feature
        // It will use the useScreenshot hook to capture a thumbnail
        // and return a data URL or blob URL
        return null;
      },

      // ============================================================================
      // Design Saving
      // ============================================================================

      saveDesign: async (name: string, thumbnail: string): Promise<string> => {
        const state = get();

        set((state) => ({
          ui: {
            ...state.ui,
            isSaving: true,
          },
        }));

        try {
          const response = await fetch('/api/designs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              thumbnail,
              designData: state.design,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save design');
          }

          const { design } = await response.json();

          // Update design with saved ID and name
          set((state) => ({
            design: {
              ...state.design,
              id: design.id,
              name,
            },
            ui: {
              ...state.ui,
              isSaving: false,
            },
          }));

          return design.id;
        } catch (error) {
          set((state) => ({
            ui: {
              ...state.ui,
              isSaving: false,
            },
          }));
          throw error;
        }
      },

      updateSavedDesign: async (
        designId: string,
        name: string,
        thumbnail: string
      ): Promise<void> => {
        const state = get();

        set((state) => ({
          ui: {
            ...state.ui,
            isSaving: true,
          },
        }));

        try {
          const response = await fetch(`/api/designs/${designId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name,
              thumbnail,
              designData: state.design,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update design');
          }

          // Update design name
          set((state) => ({
            design: {
              ...state.design,
              name,
            },
            ui: {
              ...state.ui,
              isSaving: false,
            },
          }));
        } catch (error) {
          set((state) => ({
            ui: {
              ...state.ui,
              isSaving: false,
            },
          }));
          throw error;
        }
      },
    }),
    {
      name: 'configurator-store',
    }
  )
);
