/**
 * Safety Compliance Validation Rules
 *
 * These rules ensure that designs meet safety standards and regulations.
 * Requirements: 20.3
 */

import { Design } from '@/lib/types/configurator';
import {
  ErrorRule,
  WarningRule,
  ValidationRuleResult,
  getComponentData,
  getAllComponentData,
  findComponentsByCategory,
} from './validationRules';

// ============================================================================
// Safety Constants (Based on ASTM F1487 and CPSC Guidelines)
// ============================================================================

const MIN_SPACING_FT = 1.5; // Minimum spacing between components
const FALL_ZONE_MULTIPLIER = 1.5; // Fall zone = height * multiplier
const MIN_FALL_ZONE_FT = 6; // Minimum fall zone radius
const MAX_CAPACITY_PER_SQFT = 2; // Maximum children per square foot
const AGE_RANGES = {
  toddler: { min: 2, max: 5, maxHeight: 4 },
  preschool: { min: 2, max: 5, maxHeight: 6 },
  schoolAge: { min: 5, max: 12, maxHeight: 12 },
};

// ============================================================================
// Safety Compliance Rules
// ============================================================================

/**
 * Rule: Minimum spacing between components
 * Ensures adequate space to prevent collisions
 */
export const minimumSpacingRule: ErrorRule = {
  id: 'safety-minimum-spacing',
  name: 'Minimum Spacing',
  description: `Components must be at least ${MIN_SPACING_FT} feet apart`,
  type: 'error',
  category: 'safety',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const componentsData = getAllComponentData(design);

    const tooCloseComponents: string[] = [];

    // Check each pair of components
    for (let i = 0; i < componentsData.length; i++) {
      for (let j = i + 1; j < componentsData.length; j++) {
        const comp1 = componentsData[i];
        const comp2 = componentsData[j];

        // Calculate distance between component centers
        const dx = comp1.placed.position.x - comp2.placed.position.x;
        const dy = comp1.placed.position.y - comp2.placed.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Calculate minimum required distance based on component sizes
        const minDistance =
          (comp1.data.dimensions.width + comp2.data.dimensions.width) / 2 +
          MIN_SPACING_FT;

        if (distance < minDistance) {
          if (!tooCloseComponents.includes(comp1.placed.instanceId)) {
            tooCloseComponents.push(comp1.placed.instanceId);
          }
          if (!tooCloseComponents.includes(comp2.placed.instanceId)) {
            tooCloseComponents.push(comp2.placed.instanceId);
          }
        }
      }
    }

    if (tooCloseComponents.length > 0) {
      return {
        passed: false,
        affectedComponents: tooCloseComponents,
        message: `${tooCloseComponents.length} component(s) are too close together`,
        suggestion: `Maintain at least ${MIN_SPACING_FT} feet of spacing between components for safety`,
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Fall zone calculation
 * Ensures adequate fall zones around elevated components
 */
export const fallZoneRule: ErrorRule = {
  id: 'safety-fall-zone',
  name: 'Fall Zone Clearance',
  description:
    'Adequate fall zones must be maintained around elevated components',
  type: 'error',
  category: 'safety',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const componentsData = getAllComponentData(design);

    const fallZoneViolations: string[] = [];

    // Check elevated components (slides, swings, elevated decks)
    for (const { placed, data } of componentsData) {
      const height = placed.position.z + data.dimensions.height;

      // Only check components above ground level
      if (height < 2) continue;

      // Calculate required fall zone
      const requiredFallZone = Math.max(
        height * FALL_ZONE_MULTIPLIER,
        MIN_FALL_ZONE_FT
      );

      // Check if other components intrude into fall zone
      for (const { placed: otherPlaced, data: otherData } of componentsData) {
        if (placed.instanceId === otherPlaced.instanceId) continue;

        // Calculate distance
        const dx = placed.position.x - otherPlaced.position.x;
        const dy = placed.position.y - otherPlaced.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Account for component sizes
        const clearance =
          distance - (data.dimensions.width + otherData.dimensions.width) / 2;

        if (clearance < requiredFallZone) {
          if (!fallZoneViolations.includes(placed.instanceId)) {
            fallZoneViolations.push(placed.instanceId);
          }
        }
      }
    }

    if (fallZoneViolations.length > 0) {
      return {
        passed: false,
        affectedComponents: fallZoneViolations,
        message: `${fallZoneViolations.length} component(s) have insufficient fall zone clearance`,
        suggestion:
          'Increase spacing around elevated components to meet fall zone requirements',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Age-appropriate component combinations
 * Ensures components are suitable for the target age range
 */
export const ageAppropriateRule: ErrorRule = {
  id: 'safety-age-appropriate',
  name: 'Age-Appropriate Design',
  description: 'All components must be appropriate for the target age range',
  type: 'error',
  category: 'safety',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const componentsData = getAllComponentData(design);

    if (componentsData.length === 0) {
      return { passed: true, affectedComponents: [] };
    }

    // Determine overall age range from design metadata
    const designAgeRange = design.metadata.ageRange;

    const inappropriateComponents: string[] = [];

    for (const { placed, data } of componentsData) {
      const componentAgeRange = data.metadata.ageRange;

      // Check if component age range is compatible with design age range
      // This is a simplified check - in production, you'd parse age ranges properly
      if (componentAgeRange && componentAgeRange !== designAgeRange) {
        // Check for height restrictions based on age
        const height = placed.position.z + data.dimensions.height;

        if (
          designAgeRange.includes('2-5') &&
          height > AGE_RANGES.preschool.maxHeight
        ) {
          inappropriateComponents.push(placed.instanceId);
        } else if (
          designAgeRange.includes('5-12') &&
          height > AGE_RANGES.schoolAge.maxHeight
        ) {
          inappropriateComponents.push(placed.instanceId);
        }
      }
    }

    if (inappropriateComponents.length > 0) {
      return {
        passed: false,
        affectedComponents: inappropriateComponents,
        message: `${inappropriateComponents.length} component(s) may not be age-appropriate`,
        suggestion:
          'Review component heights and features for the target age range',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Capacity limits
 * Ensures design doesn't exceed safe capacity
 */
export const capacityLimitRule: ErrorRule = {
  id: 'safety-capacity-limit',
  name: 'Capacity Limit',
  description: 'Design must not exceed safe capacity limits',
  type: 'error',
  category: 'safety',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const totalCapacity = design.metadata.capacity;
    const totalArea =
      design.metadata.dimensions.width * design.metadata.dimensions.depth;

    // Calculate maximum safe capacity based on area
    const maxSafeCapacity = Math.floor(totalArea * MAX_CAPACITY_PER_SQFT);

    if (totalCapacity > maxSafeCapacity) {
      const allComponentIds = design.components.map((c) => c.instanceId);

      return {
        passed: false,
        affectedComponents: allComponentIds,
        message: `Design capacity (${totalCapacity} children) exceeds safe limit of ${maxSafeCapacity} for the structure size`,
        suggestion:
          'Reduce the number of high-capacity components or increase the structure size',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Slide exit clearance
 * Ensures slides have adequate exit clearance
 */
export const slideExitClearanceRule: ErrorRule = {
  id: 'safety-slide-exit',
  name: 'Slide Exit Clearance',
  description: 'Slides must have adequate exit clearance',
  type: 'error',
  category: 'safety',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const slides = findComponentsByCategory(design, 'slides');

    if (slides.length === 0) {
      return { passed: true, affectedComponents: [] };
    }

    const slidesWithoutClearance: string[] = [];
    const requiredClearance = 6; // 6 feet clearance at slide exit

    for (const slide of slides) {
      const slideData = getComponentData(slide);
      if (!slideData) continue;

      // Calculate slide exit position (simplified - assumes slide exits forward)
      const exitX = slide.position.x + slideData.dimensions.depth;
      const exitY = slide.position.y;

      // Check if any components are too close to the exit
      let hasAdequateClearance = true;

      for (const comp of design.components) {
        if (comp.instanceId === slide.instanceId) continue;

        const compData = getComponentData(comp);
        if (!compData) continue;

        const dx = Math.abs(exitX - comp.position.x);
        const dy = Math.abs(exitY - comp.position.y);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < requiredClearance) {
          hasAdequateClearance = false;
          break;
        }
      }

      if (!hasAdequateClearance) {
        slidesWithoutClearance.push(slide.instanceId);
      }
    }

    if (slidesWithoutClearance.length > 0) {
      return {
        passed: false,
        affectedComponents: slidesWithoutClearance,
        message: `${slidesWithoutClearance.length} slide(s) lack adequate exit clearance`,
        suggestion: `Ensure ${requiredClearance} feet of clearance at slide exits`,
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

/**
 * Rule: Swing clearance
 * Ensures swings have adequate clearance
 */
export const swingClearanceRule: ErrorRule = {
  id: 'safety-swing-clearance',
  name: 'Swing Clearance',
  description: 'Swings must have adequate clearance in all directions',
  type: 'error',
  category: 'safety',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const swings = findComponentsByCategory(design, 'swings');

    if (swings.length === 0) {
      return { passed: true, affectedComponents: [] };
    }

    const swingsWithoutClearance: string[] = [];
    const requiredClearance = 8; // 8 feet clearance around swings

    for (const swing of swings) {
      const swingData = getComponentData(swing);
      if (!swingData) continue;

      // Check if any components are too close
      let hasAdequateClearance = true;

      for (const comp of design.components) {
        if (comp.instanceId === swing.instanceId) continue;

        const compData = getComponentData(comp);
        if (!compData) continue;

        const dx = swing.position.x - comp.position.x;
        const dy = swing.position.y - comp.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const minDistance =
          (swingData.dimensions.width + compData.dimensions.width) / 2 +
          requiredClearance;

        if (distance < minDistance) {
          hasAdequateClearance = false;
          break;
        }
      }

      if (!hasAdequateClearance) {
        swingsWithoutClearance.push(swing.instanceId);
      }
    }

    if (swingsWithoutClearance.length > 0) {
      return {
        passed: false,
        affectedComponents: swingsWithoutClearance,
        message: `${swingsWithoutClearance.length} swing(s) lack adequate clearance`,
        suggestion: `Ensure ${requiredClearance} feet of clearance around all swings`,
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

// ============================================================================
// Safety Warning Rules
// ============================================================================

/**
 * Warning: Recommended safety surfacing
 */
export const safetySurfacingWarning: WarningRule = {
  id: 'safety-surfacing-recommended',
  name: 'Safety Surfacing Recommended',
  description: 'Safety surfacing is recommended for this design',
  type: 'warning',
  category: 'safety',
  enabled: true,
  check: (design: Design): ValidationRuleResult => {
    const maxHeight = design.metadata.dimensions.height;

    if (maxHeight > 2) {
      return {
        passed: false,
        affectedComponents: [],
        message:
          'Safety surfacing (rubber mulch, wood chips, or safety mats) is recommended for structures over 2 feet high',
        suggestion:
          'Consider adding safety surfacing to reduce injury risk from falls',
      };
    }

    return { passed: true, affectedComponents: [] };
  },
};

// ============================================================================
// Export all safety rules
// ============================================================================

export const safetyErrorRules: ErrorRule[] = [
  minimumSpacingRule,
  fallZoneRule,
  ageAppropriateRule,
  capacityLimitRule,
  slideExitClearanceRule,
  swingClearanceRule,
];

export const safetyWarningRules: WarningRule[] = [safetySurfacingWarning];
