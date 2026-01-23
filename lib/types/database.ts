// Database types and utilities
// Note: These types will be available after running: npx prisma generate

// Re-export Prisma types (will be available after migration)
export type {
  User,
  ProductTier,
  Product,
  Component,
  SavedDesign,
  QuoteRequest,
} from '@prisma/client';

// Type aliases for common query patterns
// These will work after running migrations
export type ProductTierWhereInput = Record<string, unknown>;
export type ProductWhereInput = Record<string, unknown>;
export type ComponentWhereInput = Record<string, unknown>;

// Configurator-specific types (from design document)
export interface Dimensions {
  width: number;
  depth: number;
  height: number;
  unit: 'ft' | 'm';
}

export interface ConnectionPoint {
  id: string;
  type: 'deck' | 'slide' | 'swing' | 'structural' | 'access';
  position: { x: number; y: number; z: number };
  orientation?: { x: number; y: number; z: number };
  allowedConnections?: string[];
}

export interface CompatibilityRule {
  requiresDeckHeight?: number;
  allowedDeckTypes?: string[];
  requiresSwingBeam?: boolean;
  requiresMinSpacing?: number;
  mountsOnDeck?: boolean;
  allowedConnections?: string[];
}

export interface ComponentMetadata {
  ageRange: string;
  capacity: number;
  materials: string[];
  colors: string[];
}

// Quote-related types
export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    postalCode: string;
  };
}

export interface ComponentPricing {
  componentId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface QuotePricing {
  components: ComponentPricing[];
  subtotal: number;
  estimatedShipping: number;
  estimatedInstallation?: number;
  total: number;
}

// Design data structure (stored in JSON fields)
export interface PlacedComponent {
  instanceId: string;
  componentId: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  connections: Connection[];
}

export interface Connection {
  fromInstanceId: string;
  toInstanceId: string;
  connectionType: string;
  connectionPoint: string;
}

export interface DesignData {
  components: PlacedComponent[];
  metadata: {
    totalPrice: number;
    dimensions: Dimensions;
    estimatedWeight: number;
    ageRange: string;
  };
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
    timestamp: string;
  };
}
