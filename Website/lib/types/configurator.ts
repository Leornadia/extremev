/**
 * Configurator Type Definitions
 *
 * These types define the structure of the product configurator state,
 * components, and validation system.
 */

// ============================================================================
// Core Component Types
// ============================================================================

/**
 * Represents a modular component available in the component library
 */
export interface ModularComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  subcategory?: string;
  price: number;
  thumbnail: string;
  model3D: string; // URL to GLB/GLTF file
  dimensions: Dimensions;
  weight: number;
  connectionPoints: ConnectionPoint[];
  compatibilityRules: CompatibilityRule[];
  metadata: ComponentMetadata;
}

/**
 * Component categories for organization
 */
export type ComponentCategory =
  | 'playdecks'
  | 'access'
  | 'slides'
  | 'swings'
  | 'roofs'
  | 'accessories'
  | 'connectors';

/**
 * Physical dimensions of a component
 */
export interface Dimensions {
  width: number;
  depth: number;
  height: number;
  unit: 'ft' | 'm';
}

/**
 * Additional metadata for components
 */
export interface ComponentMetadata {
  ageRange: string;
  capacity: number;
  materials: string[];
  colors: string[];
  tier?: string; // Product tier (Essential, Premium, Luxury)
}

// ============================================================================
// Connection System Types
// ============================================================================

/**
 * Defines a point where components can connect
 */
export interface ConnectionPoint {
  id: string;
  type: ConnectionType;
  position: Vector3D;
  orientation: Vector3D;
  allowedConnections: string[]; // Component IDs or types that can connect
}

/**
 * Types of connections between components
 */
export type ConnectionType =
  | 'deck'
  | 'slide'
  | 'swing'
  | 'structural'
  | 'roof'
  | 'accessory';

/**
 * 3D vector for positions and orientations
 */
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Represents an active connection between two placed components
 */
export interface Connection {
  id: string;
  fromInstanceId: string;
  toInstanceId: string;
  fromConnectionPointId: string;
  toConnectionPointId: string;
  connectionType: ConnectionType;
}

/**
 * Rules for component compatibility
 */
export interface CompatibilityRule {
  ruleType: 'requires' | 'excludes' | 'recommends';
  targetComponentIds: string[];
  condition?: string;
  message?: string;
}

// ============================================================================
// Placed Component Types
// ============================================================================

/**
 * Represents a component that has been placed in the design
 */
export interface PlacedComponent {
  instanceId: string; // Unique ID for this instance
  componentId: string; // Reference to ModularComponent
  position: Vector3D;
  rotation: Vector3D;
  connections: Connection[];
  customizations?: ComponentCustomization;
}

/**
 * Customization options for placed components
 */
export interface ComponentCustomization {
  color?: string;
  material?: string;
  options?: Record<string, unknown>; // Allow unknown type for flexibility
}

// ============================================================================
// Design State Types
// ============================================================================

/**
 * Complete design state
 */
export interface Design {
  id?: string;
  name?: string;
  components: PlacedComponent[];
  metadata: DesignMetadata;
  thumbnail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Calculated metadata for the design
 */
export interface DesignMetadata {
  totalPrice: number;
  dimensions: Dimensions;
  estimatedWeight: number;
  ageRange: string;
  capacity: number;
  componentCount: number;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation result for the design
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

/**
 * Validation error that prevents quote request
 */
export interface ValidationError {
  id: string;
  type: ValidationErrorType;
  message: string;
  affectedComponents: string[]; // Instance IDs
  suggestion?: string;
}

/**
 * Validation warning that doesn't block quote request
 */
export interface ValidationWarning {
  id: string;
  type: ValidationWarningType;
  message: string;
  affectedComponents: string[];
  suggestion?: string;
}

/**
 * Types of validation errors
 */
export type ValidationErrorType =
  | 'structural_integrity'
  | 'safety_compliance'
  | 'compatibility'
  | 'connection_invalid'
  | 'height_exceeded'
  | 'capacity_exceeded'
  | 'missing_access'
  | 'disconnected_component';

/**
 * Types of validation warnings
 */
export type ValidationWarningType =
  | 'suboptimal_layout'
  | 'material_mismatch'
  | 'age_range_mismatch'
  | 'recommended_component_missing';

// ============================================================================
// UI State Types
// ============================================================================

/**
 * UI state for the configurator
 */
export interface ConfiguratorUIState {
  viewMode: '2D' | '3D';
  selectedComponentIds: string[]; // Instance IDs
  activeCategory: ComponentCategory | null;
  gridSize: number;
  snapToGrid: boolean;
  showDimensions: boolean;
  showConnectionPoints: boolean;
  isLoading: boolean;
  isSaving: boolean;
  highlightedComponentIds: string[]; // For validation error highlighting
}

// ============================================================================
// Complete Configurator State
// ============================================================================

/**
 * Complete state for the configurator application
 */
export interface ConfiguratorState {
  design: Design;
  ui: ConfiguratorUIState;
  validation: ValidationResult;
  history: {
    past: Design[];
    future: Design[];
  };
}

// ============================================================================
// Action Types
// ============================================================================

/**
 * Actions for modifying the configurator state
 */
export interface ConfiguratorActions {
  // Component Management
  addComponent: (component: ModularComponent, position: Vector3D) => void;
  removeComponent: (instanceId: string) => void;
  updateComponentPosition: (instanceId: string, position: Vector3D) => void;
  updateComponentRotation: (instanceId: string, rotation: Vector3D) => void;
  duplicateComponent: (instanceId: string) => void;

  // Connection Management
  createConnection: (connection: Omit<Connection, 'id'>) => void;
  removeConnection: (connectionId: string) => void;

  // Selection Management
  selectComponent: (instanceId: string, multiSelect?: boolean) => void;
  deselectComponent: (instanceId: string) => void;
  clearSelection: () => void;
  highlightComponents: (instanceIds: string[]) => void;
  clearHighlight: () => void;

  // Design Management
  loadDesign: (design: Design) => void;
  clearDesign: () => void;
  updateDesignName: (name: string) => void;

  // UI Management
  setViewMode: (mode: '2D' | '3D') => void;
  setActiveCategory: (category: ComponentCategory | null) => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;

  // History Management (Undo/Redo)
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Validation
  validateDesign: () => ValidationResult;

  // Metadata Calculation
  calculateMetadata: () => DesignMetadata;

  // Design Saving
  captureDesignThumbnail: () => Promise<string | null>;
  saveDesign: (name: string, thumbnail: string) => Promise<string>;
  updateSavedDesign: (
    designId: string,
    name: string,
    thumbnail: string
  ) => Promise<void>;
}

// ============================================================================
// Store Type
// ============================================================================

/**
 * Complete Zustand store type
 */
export type ConfiguratorStore = ConfiguratorState & ConfiguratorActions;
