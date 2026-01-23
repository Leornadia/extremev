/**
 * Validation Rule Engine
 *
 * This module defines the validation rule structure and evaluation system
 * for the product configurator. Rules are evaluated in real-time as the
 * design state changes.
 */

import {
  Design,
  PlacedComponent,
  ModularComponent,
  ValidationError,
  ValidationWarning,
  ValidationErrorType,
  ValidationWarningType,
} from '@/lib/types/configurator';

// ============================================================================
// Rule Types
// ============================================================================

/**
 * Base validation rule interface
 */
export interface ValidationRule<
  T extends 'error' | 'warning' = 'error' | 'warning',
> {
  id: string;
  name: string;
  description: string;
  type: T;
  category: 'structural' | 'safety' | 'compatibility';
  enabled: boolean;
  check: (design: Design) => ValidationRuleResult;
}

/**
 * Result of a validation rule check
 */
export interface ValidationRuleResult {
  passed: boolean;
  affectedComponents: string[]; // Instance IDs
  message?: string;
  suggestion?: string;
}

/**
 * Error rule type
 */
export type ErrorRule = ValidationRule<'error'>;

/**
 * Warning rule type
 */
export type WarningRule = ValidationRule<'warning'>;

// ============================================================================
// Rule Registry
// ============================================================================

/**
 * Registry of all validation rules
 */
export class ValidationRuleRegistry {
  private errorRules: Map<string, ErrorRule> = new Map();
  private warningRules: Map<string, WarningRule> = new Map();

  /**
   * Register an error rule
   */
  registerErrorRule(rule: ErrorRule): void {
    this.errorRules.set(rule.id, rule);
  }

  /**
   * Register a warning rule
   */
  registerWarningRule(rule: WarningRule): void {
    this.warningRules.set(rule.id, rule);
  }

  /**
   * Get all error rules
   */
  getErrorRules(): ErrorRule[] {
    return Array.from(this.errorRules.values()).filter((rule) => rule.enabled);
  }

  /**
   * Get all warning rules
   */
  getWarningRules(): WarningRule[] {
    return Array.from(this.warningRules.values()).filter(
      (rule) => rule.enabled
    );
  }

  /**
   * Get a specific rule by ID
   */
  getRule(id: string): ValidationRule | undefined {
    return this.errorRules.get(id) || this.warningRules.get(id);
  }

  /**
   * Enable or disable a rule
   */
  setRuleEnabled(id: string, enabled: boolean): void {
    const rule = this.getRule(id);
    if (rule) {
      rule.enabled = enabled;
    }
  }

  /**
   * Get rules by category
   */
  getRulesByCategory(
    category: 'structural' | 'safety' | 'compatibility'
  ): ValidationRule[] {
    const allRules = [...this.getErrorRules(), ...this.getWarningRules()];
    return allRules.filter((rule) => rule.category === category);
  }
}

// ============================================================================
// Rule Evaluation Engine
// ============================================================================

/**
 * Evaluates all validation rules against a design
 */
export class ValidationEngine {
  private registry: ValidationRuleRegistry;

  constructor(registry: ValidationRuleRegistry) {
    this.registry = registry;
  }

  /**
   * Evaluate all rules and return errors and warnings
   */
  evaluate(design: Design): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Evaluate error rules
    for (const rule of this.registry.getErrorRules()) {
      const result = rule.check(design);
      if (!result.passed) {
        errors.push({
          id: `${rule.id}-${Date.now()}`,
          type: this.mapRuleToErrorType(rule),
          message: result.message || rule.description,
          affectedComponents: result.affectedComponents,
          suggestion: result.suggestion,
        });
      }
    }

    // Evaluate warning rules
    for (const rule of this.registry.getWarningRules()) {
      const result = rule.check(design);
      if (!result.passed) {
        warnings.push({
          id: `${rule.id}-${Date.now()}`,
          type: this.mapRuleToWarningType(rule),
          message: result.message || rule.description,
          affectedComponents: result.affectedComponents,
          suggestion: result.suggestion,
        });
      }
    }

    return { errors, warnings };
  }

  /**
   * Evaluate a specific category of rules
   */
  evaluateCategory(
    design: Design,
    category: 'structural' | 'safety' | 'compatibility'
  ): {
    errors: ValidationError[];
    warnings: ValidationWarning[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    const rules = this.registry.getRulesByCategory(category);

    for (const rule of rules) {
      const result = rule.check(design);
      if (!result.passed) {
        if (rule.type === 'error') {
          errors.push({
            id: `${rule.id}-${Date.now()}`,
            type: this.mapRuleToErrorType(rule),
            message: result.message || rule.description,
            affectedComponents: result.affectedComponents,
            suggestion: result.suggestion,
          });
        } else {
          warnings.push({
            id: `${rule.id}-${Date.now()}`,
            type: this.mapRuleToWarningType(rule),
            message: result.message || rule.description,
            affectedComponents: result.affectedComponents,
            suggestion: result.suggestion,
          });
        }
      }
    }

    return { errors, warnings };
  }

  /**
   * Map rule to error type
   */
  private mapRuleToErrorType(rule: ValidationRule): ValidationErrorType {
    // Map based on rule ID prefix or category
    if (rule.id.startsWith('structural')) {
      return 'structural_integrity';
    } else if (rule.id.startsWith('safety')) {
      return 'safety_compliance';
    } else if (rule.id.startsWith('compatibility')) {
      return 'compatibility';
    } else if (rule.id.includes('connection')) {
      return 'connection_invalid';
    } else if (rule.id.includes('height')) {
      return 'height_exceeded';
    } else if (rule.id.includes('capacity')) {
      return 'capacity_exceeded';
    } else if (rule.id.includes('access')) {
      return 'missing_access';
    } else if (rule.id.includes('disconnected')) {
      return 'disconnected_component';
    }
    return 'structural_integrity';
  }

  /**
   * Map rule to warning type
   */
  private mapRuleToWarningType(rule: ValidationRule): ValidationWarningType {
    if (rule.id.includes('material')) {
      return 'material_mismatch';
    } else if (rule.id.includes('age')) {
      return 'age_range_mismatch';
    } else if (rule.id.includes('recommended')) {
      return 'recommended_component_missing';
    }
    return 'suboptimal_layout';
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract component data from a placed component
 */
export function getComponentData(
  placedComponent: PlacedComponent
): ModularComponent | null {
  return (
    (placedComponent.customizations?.options
      ?._componentData as ModularComponent) || null
  );
}

/**
 * Get all component data from design
 */
export function getAllComponentData(
  design: Design
): Array<{ placed: PlacedComponent; data: ModularComponent }> {
  return design.components
    .map((placed) => {
      const data = getComponentData(placed);
      return data ? { placed, data } : null;
    })
    .filter(
      (item): item is { placed: PlacedComponent; data: ModularComponent } =>
        item !== null
    );
}

/**
 * Find components by category
 */
export function findComponentsByCategory(
  design: Design,
  category: string
): PlacedComponent[] {
  return design.components.filter((placed) => {
    const data = getComponentData(placed);
    return data?.category === category;
  });
}

/**
 * Check if two components are connected
 */
export function areComponentsConnected(
  component1: PlacedComponent,
  component2: PlacedComponent
): boolean {
  return component1.connections.some(
    (conn) =>
      conn.toInstanceId === component2.instanceId ||
      conn.fromInstanceId === component2.instanceId
  );
}

/**
 * Build a connection graph to find disconnected components
 */
export function buildConnectionGraph(design: Design): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  // Initialize graph with all components
  design.components.forEach((comp) => {
    graph.set(comp.instanceId, new Set());
  });

  // Add connections
  design.components.forEach((comp) => {
    comp.connections.forEach((conn) => {
      const fromSet = graph.get(conn.fromInstanceId);
      const toSet = graph.get(conn.toInstanceId);

      if (fromSet) fromSet.add(conn.toInstanceId);
      if (toSet) toSet.add(conn.fromInstanceId);
    });
  });

  return graph;
}

/**
 * Find all connected components starting from a component
 */
export function findConnectedComponents(
  startInstanceId: string,
  graph: Map<string, Set<string>>
): Set<string> {
  const visited = new Set<string>();
  const queue = [startInstanceId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    visited.add(current);
    const neighbors = graph.get(current);

    if (neighbors) {
      neighbors.forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      });
    }
  }

  return visited;
}
