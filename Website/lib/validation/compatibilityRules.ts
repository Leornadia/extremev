/**
 * Compatibility Validation Rules
 *
 * These rules ensure that components are compatible with each other.
 * Requirements: 20.1
 */

import { Design, ConnectionType } from '@/lib/types/configurator';
import {
  ErrorRule,
  WarningRule,
  ValidationRuleResult,
  getComponentData,
  getAllComponentData,
} from './validationRules';

// ============================================================================
// Compatibility Rules
// ============================================================================

/**
 * Rule: Connection point matching
 * Ensures connections are made between compatible connection points
 */
export const connectionPointMatchingRule: ErrorRule = {
  id: 'compatibility-connection-points',
  name: 'Connection Point Matching',
  description: 'Connections must be made between compatible connection points',
  type: 'error',
  category: 'compatibility',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const invalidConnections: string[] = [];

    for (const component of design.components) {
      const componentData = getComponentData(component);
      if (!componentData) continue;

      for (const connection of component.connections) {
        // Find the connected component
        const connectedComp = design.components.find(
          (c) =>
            c.instanceId === connection.toInstanceId ||
            c.instanceId === connection.fromInstanceId
        );

        if (!connectedComp) {
          invalidConnections.push(component.instanceId);
          continue;
        }

        const connectedData = getComponentData(connectedComp);
        if (!connectedData) continue;

        // Find the connection points
        const fromPoint = componentData.connectionPoints.find(
          (cp) => cp.id === connection.fromConnectionPointId
        );
        const toPoint = connectedData.connectionPoints.find(
          (cp) => cp.id === connection.toConnectionPointId
        );

        if (!fromPoint || !toPoint) {
          invalidConnections.push(component.instanceId);
          continue;
        }

        // Check if connection types are compatible
        if (!areConnectionTypesCompatible(fromPoint.type, toPoint.type)) {
          invalidConnections.push(component.instanceId);
        }

        // Check if components are in allowed connections list
        const isAllowed =
          fromPoint.allowedConnections.includes(connectedData.id) ||
          fromPoint.allowedConnections.includes(connectedData.category) ||
          fromPoint.allowedConnections.includes('*'); // Wildcard

        if (!isAllowed) {
          invalidConnections.push(component.instanceId);
        }
      }
    }

    // Remove duplicates
    const uniqueInvalidConnections = Array.from(new Set(invalidConnections));

    if (uniqueInvalidConnections.length > 0) {
      return {
        passed: false,
        affectedComponents: uniqueInvalidConnections,
        message: `${uniqueInvalidConnections.length} component(s) have invalid connections`,
        suggestion:
          'Ensure connections are made between compatible connection points',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Component size compatibility
 * Ensures connected components have compatible sizes
 */
export const componentSizeCompatibilityRule: ErrorRule = {
  id: 'compatibility-component-size',
  name: 'Component Size Compatibility',
  description: 'Connected components must have compatible sizes',
  type: 'error',
  category: 'compatibility',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const incompatibleComponents: string[] = [];

    for (const component of design.components) {
      const componentData = getComponentData(component);
      if (!componentData) continue;

      for (const connection of component.connections) {
        const connectedComp = design.components.find(
          (c) =>
            c.instanceId === connection.toInstanceId ||
            c.instanceId === connection.fromInstanceId
        );

        if (!connectedComp) continue;

        const connectedData = getComponentData(connectedComp);
        if (!connectedData) continue;

        // Check size compatibility based on connection type
        if (connection.connectionType === 'deck') {
          // Decks should have similar widths when connected
          const widthDiff = Math.abs(
            componentData.dimensions.width - connectedData.dimensions.width
          );

          if (widthDiff > 2) {
            // Allow 2 feet difference
            incompatibleComponents.push(component.instanceId);
          }
        } else if (connection.connectionType === 'slide') {
          // Slides should match deck width
          if (componentData.category === 'playdecks') {
            const widthDiff = Math.abs(
              componentData.dimensions.width - connectedData.dimensions.width
            );

            if (widthDiff > 1) {
              // Allow 1 foot difference for slides
              incompatibleComponents.push(component.instanceId);
            }
          }
        }
      }
    }

    // Remove duplicates
    const uniqueIncompatibleComponents = Array.from(
      new Set(incompatibleComponents)
    );

    if (uniqueIncompatibleComponents.length > 0) {
      return {
        passed: false,
        affectedComponents: uniqueIncompatibleComponents,
        message: `${uniqueIncompatibleComponents.length} component(s) have size compatibility issues`,
        suggestion:
          'Connect components with similar sizes or use adapter components',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Material compatibility across tiers
 * Ensures components from different tiers are compatible
 */
export const materialCompatibilityRule: WarningRule = {
  id: 'compatibility-material-tier',
  name: 'Material Compatibility',
  description: 'Components should be from compatible product tiers',
  type: 'warning',
  category: 'compatibility',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const componentsData = getAllComponentData(design);

    if (componentsData.length === 0) {
      return { passed: true, affectedComponents: [] };
    }

    // Collect all tiers used in the design
    const tiers = new Set<string>();
    componentsData.forEach(({ data }) => {
      if (data.metadata.tier) {
        tiers.add(data.metadata.tier);
      }
    });

    // If mixing tiers, issue a warning
    if (tiers.size > 1) {
      const mixedTierComponents = componentsData
        .filter(({ data }) => data.metadata.tier)
        .map(({ placed }) => placed.instanceId);

      return {
        passed: false,
        affectedComponents: mixedTierComponents,
        message: `Design mixes components from ${tiers.size} different product tiers: ${Array.from(tiers).join(', ')}`,
        suggestion:
          'Consider using components from the same tier for consistent quality and aesthetics',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Color coordination
 * Warns if colors don't coordinate well
 */
export const colorCoordinationWarning: WarningRule = {
  id: 'compatibility-color-coordination',
  name: 'Color Coordination',
  description: 'Component colors should coordinate well',
  type: 'warning',
  category: 'compatibility',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const componentsData = getAllComponentData(design);

    if (componentsData.length < 2) {
      return { passed: true, affectedComponents: [] };
    }

    // Collect all colors used
    const colors = new Set<string>();
    componentsData.forEach(({ data }) => {
      data.metadata.colors.forEach((color) => colors.add(color));
    });

    // If using too many colors, issue a warning
    if (colors.size > 4) {
      const allComponentIds = design.components.map((c) => c.instanceId);

      return {
        passed: false,
        affectedComponents: allComponentIds,
        message: `Design uses ${colors.size} different colors, which may look busy`,
        suggestion:
          'Consider limiting to 2-3 coordinating colors for a cohesive look',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Compatibility rules enforcement
 * Enforces component-specific compatibility rules
 */
export const compatibilityRulesEnforcementRule: ErrorRule = {
  id: 'compatibility-rules-enforcement',
  name: 'Compatibility Rules Enforcement',
  description: 'Component compatibility rules must be satisfied',
  type: 'error',
  category: 'compatibility',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const violatingComponents: string[] = [];

    for (const component of design.components) {
      const componentData = getComponentData(component);
      if (!componentData) continue;

      // Check each compatibility rule
      for (const rule of componentData.compatibilityRules) {
        if (rule.ruleType === 'requires') {
          // Check if required components are present
          const hasRequiredComponent = design.components.some((c) => {
            const cData = getComponentData(c);
            return (
              cData &&
              rule.targetComponentIds.some(
                (targetId) =>
                  targetId === cData.id || targetId === cData.category
              )
            );
          });

          if (!hasRequiredComponent) {
            violatingComponents.push(component.instanceId);
          }
        } else if (rule.ruleType === 'excludes') {
          // Check if excluded components are absent
          const hasExcludedComponent = design.components.some((c) => {
            const cData = getComponentData(c);
            return (
              cData &&
              rule.targetComponentIds.some(
                (targetId) =>
                  targetId === cData.id || targetId === cData.category
              )
            );
          });

          if (hasExcludedComponent) {
            violatingComponents.push(component.instanceId);
          }
        }
      }
    }

    // Remove duplicates
    const uniqueViolatingComponents = Array.from(new Set(violatingComponents));

    if (uniqueViolatingComponents.length > 0) {
      return {
        passed: false,
        affectedComponents: uniqueViolatingComponents,
        message: `${uniqueViolatingComponents.length} component(s) violate compatibility rules`,
        suggestion:
          'Review component requirements and exclusions to resolve conflicts',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Recommended component combinations
 * Suggests recommended components based on what's in the design
 */
export const recommendedComponentsWarning: WarningRule = {
  id: 'compatibility-recommended-components',
  name: 'Recommended Components',
  description: 'Recommended components for this design',
  type: 'warning',
  category: 'compatibility',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const recommendations: string[] = [];

    for (const component of design.components) {
      const componentData = getComponentData(component);
      if (!componentData) continue;

      // Check for recommended components
      for (const rule of componentData.compatibilityRules) {
        if (rule.ruleType === 'recommends') {
          const hasRecommendedComponent = design.components.some((c) => {
            const cData = getComponentData(c);
            return (
              cData &&
              rule.targetComponentIds.some(
                (targetId) =>
                  targetId === cData.id || targetId === cData.category
              )
            );
          });

          if (!hasRecommendedComponent && rule.message) {
            recommendations.push(component.instanceId);
          }
        }
      }
    }

    // Remove duplicates
    const uniqueRecommendations = Array.from(new Set(recommendations));

    if (uniqueRecommendations.length > 0) {
      return {
        passed: false,
        affectedComponents: uniqueRecommendations,
        message: 'Some recommended components are missing from your design',
        suggestion:
          'Consider adding recommended components to enhance the play experience',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if two connection types are compatible
 */
function areConnectionTypesCompatible(
  type1: ConnectionType,
  type2: ConnectionType
): boolean {
  // Define compatibility matrix
  const compatibilityMatrix: Record<ConnectionType, ConnectionType[]> = {
    deck: ['deck', 'structural', 'slide', 'accessory'],
    slide: ['deck', 'structural'],
    swing: ['structural', 'roof'],
    structural: ['deck', 'slide', 'swing', 'roof', 'structural'],
    roof: ['deck', 'structural', 'swing'],
    accessory: ['deck', 'structural'],
  };

  return (
    compatibilityMatrix[type1]?.includes(type2) ||
    compatibilityMatrix[type2]?.includes(type1)
  );
}

// ============================================================================
// Export all compatibility rules
// ============================================================================

export const compatibilityErrorRules: ErrorRule[] = [
  connectionPointMatchingRule,
  componentSizeCompatibilityRule,
  compatibilityRulesEnforcementRule,
];

export const compatibilityWarningRules: WarningRule[] = [
  materialCompatibilityRule,
  colorCoordinationWarning,
  recommendedComponentsWarning,
];
