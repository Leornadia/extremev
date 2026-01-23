# Pricing Calculator

This module handles pricing calculations for custom jungle gym designs.

## Features

- **Component Pricing**: Calculates total cost based on selected components
- **Shipping Estimation**: Estimates shipping costs based on location and weight
- **Installation Estimation**: Optional installation cost calculation
- **Complexity Analysis**: Adjusts pricing based on design complexity

## Usage

```typescript
import { calculatePricingBreakdown } from '@/lib/pricing';

const pricing = calculatePricingBreakdown(
  design,
  {
    city: 'Johannesburg',
    state: 'Gauteng',
    postalCode: '2000',
  },
  true // Include installation
);

console.log(pricing.total); // Total price in ZAR
```

## Pricing Structure

### Component Pricing

- Each component has a base price
- Quantities are automatically calculated
- Subtotal is sum of all component prices

### Shipping Estimation

- **Base Rate**: R500 flat fee
- **Distance Rate**: R200 for major cities, R800 for remote areas
- **Weight Rate**: R2 per kg

### Installation Estimation (Optional)

- **Base Rate**: R2000
- **Component Rate**: R300 per component
- **Complexity Multiplier**: 1.0 - 1.6x based on:
  - Height (>8ft adds 0.1x, >10ft adds 0.2x)
  - Footprint (>150 sq ft adds 0.1x, >200 sq ft adds 0.2x)
  - Component count (>10 adds 0.1x, >15 adds 0.2x)

## API

### `calculateComponentPricing(design: Design)`

Returns component breakdown and subtotal.

### `calculateShippingEstimate(design: Design, location: LocationInfo)`

Returns shipping cost breakdown.

### `calculateInstallationEstimate(design: Design)`

Returns installation cost breakdown.

### `calculatePricingBreakdown(design: Design, location: LocationInfo, includeInstallation?: boolean)`

Returns complete pricing breakdown with all costs.

### `formatPrice(amount: number, currency?: string)`

Formats price for display (default: ZAR).

### `validatePricing(pricing: PricingBreakdown)`

Validates pricing calculation results.

## Notes

- All prices are in South African Rand (ZAR)
- Shipping rates are simplified estimates
- Production implementation should use actual distance calculation APIs
- Installation estimates are optional and can be excluded
