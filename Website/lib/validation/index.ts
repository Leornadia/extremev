/**
 * Validation System Entry Point
 *
 * Exports all validation rules and utilities
 */

import { ValidationRuleRegistry, ValidationEngine } from './validationRules';
import { structuralRules } from './structuralRules';
import { safetyErrorRules, safetyWarningRules } from './safetyRules';
import {
  compatibilityErrorRules,
  compatibilityWarningRules,
} from './compatibilityRules';

// ============================================================================
// Create and Configure Registry
// ============================================================================

/**
 * Global validation rule registry
 */
export const validationRegistry = new ValidationRuleRegistry();

// Register all structural rules
structuralRules.forEach((rule) => {
  validationRegistry.registerErrorRule(rule);
});

// Register all safety rules
safetyErrorRules.forEach((rule) => {
  validationRegistry.registerErrorRule(rule);
});

safetyWarningRules.forEach((rule) => {
  validationRegistry.registerWarningRule(rule);
});

// Register all compatibility rules
compatibilityErrorRules.forEach((rule) => {
  validationRegistry.registerErrorRule(rule);
});

compatibilityWarningRules.forEach((rule) => {
  validationRegistry.registerWarningRule(rule);
});

// ============================================================================
// Create Validation Engine
// ============================================================================

/**
 * Global validation engine instance
 */
export const validationEngine = new ValidationEngine(validationRegistry);

// ============================================================================
// Exports
// ============================================================================

export * from './validationRules';
export * from './structuralRules';
export * from './safetyRules';
export * from './compatibilityRules';
