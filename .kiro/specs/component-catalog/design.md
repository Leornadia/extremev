# Design Document: Component Catalog

## Overview

This feature extends the existing playset configurator to support a comprehensive component catalog system. The system enables administrators to manage playset components with categories matching the CedarWorks-style interface (Play Structures, Beams/Bridges/Bars, Slides, Climbing, Swings, Fun Stuff) and size variants (Extra Large, Large, Medium, Small). Users can browse, filter, and add these components to their custom playset designs.

The implementation builds on the existing Prisma Component model, configurator store, and admin panel infrastructure, adding size variant support and enhanced filtering capabilities.

## Architecture

```mermaid
graph TB
    subgraph "Admin Layer"
        AdminUI[Admin Component Panel]
        AdminAPI[Admin API Routes]
    end
    
    subgraph "User Layer"
        ConfigUI[Configurator UI]
        LibraryPanel[Component Library Panel]
        DetailsModal[Component Details Modal]
    end
    
    subgraph "API Layer"
        ComponentsAPI[/api/components]
        AdminComponentsAPI[/api/admin/components]
    end
    
    subgraph "Data Layer"
        Prisma[Prisma Client]
        DB[(PostgreSQL)]
    end
    
    subgraph "State Management"
        ConfigStore[Configurator Store]
    end
    
    AdminUI --> AdminAPI
    AdminAPI --> AdminComponentsAPI
    AdminComponentsAPI --> Prisma
    
    ConfigUI --> LibraryPanel
    LibraryPanel --> ComponentsAPI
    LibraryPanel --> DetailsModal
    DetailsModal --> ConfigStore
    
    ComponentsAPI --> Prisma
    Prisma --> DB
    ConfigStore --> ConfigUI
```

## Components and Interfaces

### Database Schema Extension

The existing Component model needs a `size` field added:

```prisma
model Component {
  id                 String      @id @default(cuid())
  name               String
  category           String      // Play Structures, Slides, Swings, etc.
  subcategory        String?
  size               String?     // Extra Large, Large, Medium, Small
  tierId             String
  tier               ProductTier @relation(...)
  price              Float
  thumbnail          String
  model3D            String
  dimensions         Json
  weight             Float
  connectionPoints   Json
  compatibilityRules Json
  metadata           Json
  published          Boolean     @default(false)
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
}
```

### Category and Size Constants

```typescript
// lib/types/configurator.ts

export const COMPONENT_CATEGORIES = [
  'Play Structures',
  'Beams Bridges and Bars',
  'Slides Ramps and More',
  'Climbing',
  'Swings',
  'Fun Stuff',
] as const;

export type ComponentCategoryType = typeof COMPONENT_CATEGORIES[number];

export const COMPONENT_SIZES = [
  'Extra Large',
  'Large',
  'Medium',
  'Small',
] as const;

export type ComponentSizeType = typeof COMPONENT_SIZES[number];
```

### API Interfaces

```typescript
// Component filtering parameters
interface ComponentFilterParams {
  category?: ComponentCategoryType;
  size?: ComponentSizeType;
  search?: string;
  published?: boolean;
}

// Component creation payload
interface CreateComponentPayload {
  name: string;
  category: ComponentCategoryType;
  size?: ComponentSizeType;
  tierId: string;
  price: number;
  thumbnail: string;
  model3D: string;
  dimensions: Dimensions;
  weight: number;
  connectionPoints: ConnectionPoint[];
  compatibilityRules: CompatibilityRule[];
  metadata: ComponentMetadata;
  published?: boolean;
}

// API response for component list
interface ComponentListResponse {
  data: ModularComponent[];
  count: number;
  categories: { name: string; count: number }[];
}
```

### Component Library Panel Updates

The existing `ComponentLibraryPanel` will be enhanced with:
- Size filter pills alongside category filters
- Visual size indicators on component cards
- Category grouping with size sub-grouping option

### Connection Point Interface

```typescript
interface ConnectionPoint {
  id: string;
  type: 'deck' | 'slide' | 'swing' | 'structural' | 'roof' | 'accessory';
  position: { x: number; y: number; z: number };
  orientation: { x: number; y: number; z: number };
  allowedConnections: string[]; // Component IDs or category types
}

interface CompatibilityRule {
  ruleType: 'requires' | 'excludes' | 'recommends';
  targetComponentIds: string[];
  condition?: string;
  message?: string;
}
```

## Data Models

### Component Data Model

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (cuid) |
| name | string | Display name |
| category | string | One of the 6 defined categories |
| size | string | One of: Extra Large, Large, Medium, Small |
| subcategory | string? | Optional sub-grouping |
| tierId | string | Reference to ProductTier |
| price | number | Base price in dollars |
| thumbnail | string | URL to thumbnail image |
| model3D | string | URL to GLB/GLTF file |
| dimensions | object | { width, depth, height, unit } |
| weight | number | Weight in pounds |
| connectionPoints | array | Array of ConnectionPoint objects |
| compatibilityRules | array | Array of CompatibilityRule objects |
| metadata | object | { ageRange, capacity, materials, colors } |
| published | boolean | Visibility in user catalog |
| createdAt | datetime | Creation timestamp |
| updatedAt | datetime | Last modification timestamp |

### Filter State Model

```typescript
interface ComponentFilterState {
  category: ComponentCategoryType | null;
  size: ComponentSizeType | null;
  searchQuery: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Component Creation Completeness
*For any* valid component creation payload containing all required fields (name, category, price, tierId), creating the component SHALL result in a stored record with a unique ID, creation timestamp, and all provided field values preserved exactly.
**Validates: Requirements 1.1, 1.3**

### Property 2: Required Field Validation
*For any* component creation or update payload missing one or more required fields (name, category, price, tierId), the System SHALL reject the operation and return validation errors identifying each missing field.
**Validates: Requirements 1.2, 7.2**

### Property 3: Category and Size Enum Validation
*For any* component creation payload, the category field SHALL only accept values from the defined set {Play Structures, Beams Bridges and Bars, Slides Ramps and More, Climbing, Swings, Fun Stuff}, and the size field SHALL only accept values from {Extra Large, Large, Medium, Small} or null.
**Validates: Requirements 2.1, 2.2**

### Property 4: 3D Model Format Validation
*For any* uploaded 3D model file, the System SHALL accept only files with .glb or .gltf extensions and reject all other file formats.
**Validates: Requirements 1.4**

### Property 5: Category and Size Filtering Correctness
*For any* set of components and any combination of category and size filters, the filtered result SHALL contain exactly those components that match all applied filter criteria, and no components that fail any filter criterion.
**Validates: Requirements 2.3, 4.2, 5.1, 5.2**

### Property 6: Search Result Correctness
*For any* search query string and set of components, the search results SHALL contain exactly those components whose name contains the search string (case-insensitive), and no components whose name does not contain the search string.
**Validates: Requirements 4.3**

### Property 7: Category Count Accuracy
*For any* set of published components, the category counts displayed SHALL equal the actual count of published components in each category.
**Validates: Requirements 4.1**

### Property 8: Empty Category Hiding
*For any* category with zero published components, that category SHALL NOT appear in the user-facing component library category list.
**Validates: Requirements 2.4**

### Property 9: Publish State Visibility
*For any* component, when published is true the component SHALL appear in user-facing queries, and when published is false the component SHALL NOT appear in user-facing queries but SHALL appear in admin queries.
**Validates: Requirements 6.1, 6.2, 6.3**

### Property 10: Connection Rules Round-Trip
*For any* valid connection rules data structure, serializing to JSON and deserializing back SHALL produce a data structure equivalent to the original.
**Validates: Requirements 3.4**

### Property 11: Connection Validation Correctness
*For any* two components with defined connection points and compatibility rules, attempting to connect them SHALL succeed if and only if the compatibility rules permit the connection.
**Validates: Requirements 3.3**

### Property 12: Component Update Timestamp
*For any* component update operation that modifies at least one field, the updatedAt timestamp SHALL be greater than the previous updatedAt value.
**Validates: Requirements 7.1**

### Property 13: Component Deletion Completeness
*For any* deleted component, subsequent queries (both user and admin) SHALL NOT return that component.
**Validates: Requirements 7.3**

### Property 14: Component Display Completeness
*For any* component displayed in the library, the display SHALL include the thumbnail, name, size (if defined), and price.
**Validates: Requirements 4.4**

## Error Handling

### Validation Errors
- Missing required fields: Return 400 with field-specific error messages
- Invalid category/size values: Return 400 with allowed values list
- Invalid file format: Return 400 with accepted formats

### Database Errors
- Connection failures: Return 503 with retry suggestion
- Constraint violations: Return 409 with conflict details
- Not found: Return 404 with resource identifier

### File Upload Errors
- File too large: Return 413 with size limit
- Upload failure: Return 500 with retry option

## Testing Strategy

### Property-Based Testing Library
Use `fast-check` for TypeScript property-based testing.

### Unit Tests
- Component validation functions
- Filter logic functions
- Category/size enum helpers
- Connection rule serialization

### Property-Based Tests
Each correctness property will be implemented as a property-based test using fast-check:
- Generate random valid/invalid component payloads
- Generate random filter combinations
- Generate random search queries
- Generate random connection rule structures

Test configuration:
- Minimum 100 iterations per property test
- Each test tagged with: `**Feature: component-catalog, Property {number}: {property_text}**`

### Integration Tests
- API endpoint testing with database
- Admin CRUD operations
- User filtering and search
- Component addition to design

### Test Data Generators
```typescript
// Example generator for component payloads
const componentPayloadArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 100 }),
  category: fc.constantFrom(...COMPONENT_CATEGORIES),
  size: fc.option(fc.constantFrom(...COMPONENT_SIZES)),
  price: fc.float({ min: 0, max: 100000 }),
  // ... other fields
});
```
