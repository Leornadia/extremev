/**
 * Structural Integrity Validation Rules
 *
 * These rules ensure that designs are structurally sound and buildable.
 * Requirements: 20.1, 20.3
 */

import { Design } from '@/lib/types/configurator';
import {
  ErrorRule,
  ValidationRuleResult,
  getComponentData,
  getAllComponentData,
  findComponentsByCategory,
  buildConnectionGraph,
  findConnectedComponents,
} from './validationRules';

// ============================================================================
// Constants
// ============================================================================

const MAX_HEIGHT_FT = 12; // Maximum height for playground structures
const MAX_WEIGHT_LBS = 5000; // Maximum total weight
const MIN_DECK_HEIGHT_FT = 2; // Minimum deck height requiring access

// ============================================================================
// Structural Integrity Rules
// ============================================================================

/**
 * Rule: All components must be connected
 * Ensures no orphaned components exist in the design
 */
export const allComponentsConnectedRule: ErrorRule = {
  id: 'structural-all-connected',
  name: 'All Components Connected',
  description: 'All components must be connected to form a single structure',
  type: 'error',
  category: 'structural',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    if (design.components.length === 0) {
      return { passed: true, affectedComponents: [] };
    }

    if (design.components.length === 1) {
      return { passed: true, affectedComponents: [] };
    }

    // Build connection graph
    const graph = buildConnectionGraph(design);

    // Find all connected components starting from the first component
    const connectedSet = findConnectedComponents(
      design.components[0].instanceId,
      graph
    );

    // Check if all components are in the connected set
    const disconnectedComponents = design.components
      .filter((comp) => !connectedSet.has(comp.instanceId))
      .map((comp) => comp.instanceId);

    if (disconnectedComponents.length > 0) {
      return {
        passed: false,
        affectedComponents: disconnectedComponents,
        message: `${disconnectedComponents.length} component(s) are not connected to the main structure`,
        suggestion:
          'Connect all components using structural connectors or remove disconnected components',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Decks must have at least one access point
 * Ensures all elevated decks can be reached
 */
export const deckAccessRule: ErrorRule = {
  id: 'structural-deck-access',
  name: 'Deck Access Required',
  description: 'All elevated decks must have at least one access point',
  type: 'error',
  category: 'structural',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const decks = findComponentsByCategory(design, 'playdecks');

    if (decks.length === 0) {
      return { passed: true, affectedComponents: [] };
    }

    const decksWithoutAccess: string[] = [];

    for (const deck of decks) {
      const deckData = getComponentData(deck);
      if (!deckData) continue;

      // Check if deck is elevated (height > minimum)
      if (deck.position.z < MIN_DECK_HEIGHT_FT) {
        continue; // Ground-level decks don't need access
      }

      // Check if deck has any access connections (ladders, stairs, climbing walls)
      const hasAccess = deck.connections.some((conn) => {
        const connectedComp = design.components.find(
          (c) =>
            c.instanceId === conn.toInstanceId ||
            c.instanceId === conn.fromInstanceId
        );
        if (!connectedComp) return false;

        const connectedData = getComponentData(connectedComp);
        return connectedData?.category === 'access';
      });

      if (!hasAccess) {
        decksWithoutAccess.push(deck.instanceId);
      }
    }

    if (decksWithoutAccess.length > 0) {
      return {
        passed: false,
        affectedComponents: decksWithoutAccess,
        message: `${decksWithoutAccess.length} elevated deck(s) have no access point`,
        suggestion:
          'Add a ladder, stairs, or climbing wall to each elevated deck',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Height restrictions must be enforced
 * Ensures structures don't exceed maximum safe height
 */
export const heightRestrictionRule: ErrorRule = {
  id: 'structural-height-limit',
  name: 'Height Restriction',
  description: `Structures must not exceed ${MAX_HEIGHT_FT} feet in height`,
  type: 'error',
  category: 'structural',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const componentsData = getAllComponentData(design);

    const tooHighComponents: string[] = [];

    for (const { placed, data } of componentsData) {
      const topHeight = placed.position.z + data.dimensions.height;

      if (topHeight > MAX_HEIGHT_FT) {
        tooHighComponents.push(placed.instanceId);
      }
    }

    if (tooHighComponents.length > 0) {
      return {
        passed: false,
        affectedComponents: tooHighComponents,
        message: `${tooHighComponents.length} component(s) exceed the maximum height of ${MAX_HEIGHT_FT} feet`,
        suggestion: `Lower components or remove them to stay within the ${MAX_HEIGHT_FT} foot height limit`,
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Weight distribution validation
 * Ensures total weight doesn't exceed safe limits
 */
export const weightDistributionRule: ErrorRule = {
  id: 'structural-weight-limit',
  name: 'Weight Distribution',
  description: `Total structure weight must not exceed ${MAX_WEIGHT_LBS} lbs`,
  type: 'error',
  category: 'structural',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const totalWeight = design.metadata.estimatedWeight;

    if (totalWeight > MAX_WEIGHT_LBS) {
      // All components contribute to weight
      const allComponentIds = design.components.map((c) => c.instanceId);

      return {
        passed: false,
        affectedComponents: allComponentIds,
        message: `Total structure weight (${totalWeight} lbs) exceeds maximum limit of ${MAX_WEIGHT_LBS} lbs`,
        suggestion:
          'Remove some components or choose lighter alternatives to reduce total weight',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Structural support validation
 * Ensures elevated components have proper support
 */
export const structuralSupportRule: ErrorRule = {
  id: 'structural-support-required',
  name: 'Structural Support',
  description: 'Elevated components must have proper structural support',
  type: 'error',
  category: 'structural',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const componentsData = getAllComponentData(design);

    const unsupportedComponents: string[] = [];

    for (const { placed, data } of componentsData) {
      // Skip ground-level components
      if (placed.position.z < 1) continue;

      // Skip structural connectors themselves
      if (data.category === 'connectors') continue;

      // Check if component has structural connections
      const hasStructuralSupport = placed.connections.some((conn) => {
        const connectedComp = design.components.find(
          (c) =>
            c.instanceId === conn.toInstanceId ||
            c.instanceId === conn.fromInstanceId
        );
        if (!connectedComp) return false;

        const connectedData = getComponentData(connectedComp);
        return (
          connectedData?.category === 'connectors' ||
          connectedData?.category === 'playdecks'
        );
      });

      // Decks and roofs need structural support when elevated
      if (
        (data.category === 'playdecks' || data.category === 'roofs') &&
        !hasStructuralSupport &&
        placed.connections.length === 0
      ) {
        unsupportedComponents.push(placed.instanceId);
      }
    }

    if (unsupportedComponents.length > 0) {
      return {
        passed: false,
        affectedComponents: unsupportedComponents,
        message: `${unsupportedComponents.length} elevated component(s) lack proper structural support`,
        suggestion:
          'Connect components to structural supports or lower them to ground level',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Minimum component requirement
 * Ensures design has at least one playdeck as foundation
 */
export const minimumComponentRule: ErrorRule = {
  id: 'structural-minimum-components',
  name: 'Minimum Components',
  description: 'Design must include at least one playdeck as foundation',
  type: 'error',
  category: 'structural',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    if (design.components.length === 0) {
      return {
        passed: false,
        affectedComponents: [],
        message: 'Design is empty - add components to begin',
        suggestion: 'Start by adding a playdeck as the foundation',
      };
    }

    const decks = findComponentsByCategory(design, 'playdecks');

    if (decks.length === 0) {
      return {
        passed: false,
        affectedComponents: design.components.map((c) => c.instanceId),
        message: 'Design must include at least one playdeck',
        suggestion:
          'Add a playdeck to serve as the foundation of your structure',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

// ============================================================================
// Export all structural rules
// ============================================================================

export const structuralRules: ErrorRule[] = [
  allComponentsConnectedRule,
  deckAccessRule,
  heightRestrictionRule,
  weightDistributionRule,
  structuralSupportRule,
  minimumComponentRule,
];
