/**
 * Pricing Calculator Service
 *
 * Calculates pricing for custom jungle gym designs including:
 * - Component totals
 * - Shipping estimation based on location
 * - Optional installation estimate
 */

import {
  Design,
  PlacedComponent,
  ModularComponent,
} from '@/lib/types/configurator';

export interface ComponentPricing {
  componentId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingEstimate {
  baseRate: number;
  distanceRate: number;
  weightRate: number;
  total: number;
}

export interface InstallationEstimate {
  baseRate: number;
  componentRate: number;
  complexityMultiplier: number;
  total: number;
}

export interface PricingBreakdown {
  components: ComponentPricing[];
  subtotal: number;
  shipping: ShippingEstimate;
  installation?: InstallationEstimate;
  total: number;
}

export interface LocationInfo {
  city: string;
  state: string;
  postalCode: string;
}

/**
 * Calculate component pricing from design
 */
export function calculateComponentPricing(design: Design): {
  components: ComponentPricing[];
  subtotal: number;
} {
  const componentMap = new Map<string, ComponentPricing>();

  design.components.forEach((placedComp: PlacedComponent) => {
    // Extract component data from customizations
    const componentData = placedComp.customizations?.options?._componentData as
      | ModularComponent
      | undefined;

    if (!componentData) {
      console.warn(
        `Component data not found for instance ${placedComp.instanceId}`
      );
      return;
    }

    const existing = componentMap.get(componentData.id);

    if (existing) {
      existing.quantity += 1;
      existing.totalPrice = existing.quantity * existing.unitPrice;
    } else {
      componentMap.set(componentData.id, {
        componentId: componentData.id,
        name: componentData.name,
        quantity: 1,
        unitPrice: componentData.price,
        totalPrice: componentData.price,
      });
    }
  });

  const components = Array.from(componentMap.values());
  const subtotal = components.reduce((sum, comp) => sum + comp.totalPrice, 0);

  return { components, subtotal };
}

/**
 * Estimate shipping cost based on location and design weight
 */
export function calculateShippingEstimate(
  design: Design,
  location: LocationInfo
): ShippingEstimate {
  // Base shipping rate (flat fee)
  const baseRate = 500; // R500 base rate

  // Calculate distance rate based on location
  // This is a simplified estimation - in production, you'd use actual distance calculation
  const distanceRate = estimateDistanceRate(location);

  // Calculate weight-based rate
  const weight = design.metadata.estimatedWeight;
  const weightRate = calculateWeightRate(weight);

  const total = baseRate + distanceRate + weightRate;

  return {
    baseRate,
    distanceRate,
    weightRate,
    total: Math.round(total),
  };
}

/**
 * Estimate distance-based shipping rate
 * This is a simplified version - production would use actual distance calculation
 */
function estimateDistanceRate(location: LocationInfo): number {
  // Major cities in South Africa with lower rates
  const majorCities = [
    'johannesburg',
    'pretoria',
    'cape town',
    'durban',
    'port elizabeth',
    'bloemfontein',
  ];

  const cityLower = location.city.toLowerCase();
  const isMajorCity = majorCities.some((city) => cityLower.includes(city));

  if (isMajorCity) {
    return 200; // R200 for major cities
  }

  // Higher rate for remote areas
  return 800; // R800 for other areas
}

/**
 * Calculate weight-based shipping rate
 */
function calculateWeightRate(weight: number): number {
  // R2 per kg
  const ratePerKg = 2;
  return Math.round(weight * ratePerKg);
}

/**
 * Calculate optional installation estimate
 */
export function calculateInstallationEstimate(
  design: Design
): InstallationEstimate {
  // Base installation rate
  const baseRate = 2000; // R2000 base installation fee

  // Rate per component
  const componentCount = design.metadata.componentCount;
  const componentRate = componentCount * 300; // R300 per component

  // Complexity multiplier based on design characteristics
  const complexityMultiplier = calculateComplexityMultiplier(design);

  const total = Math.round((baseRate + componentRate) * complexityMultiplier);

  return {
    baseRate,
    componentRate,
    complexityMultiplier,
    total,
  };
}

/**
 * Calculate complexity multiplier for installation
 */
function calculateComplexityMultiplier(design: Design): number {
  let multiplier = 1.0;

  // Increase for height
  if (design.metadata.dimensions.height > 10) {
    multiplier += 0.2;
  } else if (design.metadata.dimensions.height > 8) {
    multiplier += 0.1;
  }

  // Increase for large footprint
  const footprint =
    design.metadata.dimensions.width * design.metadata.dimensions.depth;
  if (footprint > 200) {
    multiplier += 0.2;
  } else if (footprint > 150) {
    multiplier += 0.1;
  }

  // Increase for many components
  if (design.metadata.componentCount > 15) {
    multiplier += 0.2;
  } else if (design.metadata.componentCount > 10) {
    multiplier += 0.1;
  }

  return Math.round(multiplier * 100) / 100;
}

/**
 * Calculate complete pricing breakdown
 */
export function calculatePricingBreakdown(
  design: Design,
  location: LocationInfo,
  includeInstallation: boolean = false
): PricingBreakdown {
  const { components, subtotal } = calculateComponentPricing(design);
  const shipping = calculateShippingEstimate(design, location);
  const installation = includeInstallation
    ? calculateInstallationEstimate(design)
    : undefined;

  const total = subtotal + shipping.total + (installation?.total || 0);

  return {
    components,
    subtotal,
    shipping,
    installation,
    total,
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'ZAR'): string {
  if (currency === 'ZAR') {
    return `R ${amount.toLocaleString('en-ZA')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

/**
 * Validate pricing calculation
 */
export function validatePricing(pricing: PricingBreakdown): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (pricing.components.length === 0) {
    errors.push('No components in design');
  }

  if (pricing.subtotal <= 0) {
    errors.push('Invalid subtotal');
  }

  if (pricing.shipping.total < 0) {
    errors.push('Invalid shipping cost');
  }

  if (pricing.total <= 0) {
    errors.push('Invalid total price');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
