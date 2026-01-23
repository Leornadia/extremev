/**
 * Sanity Schema Definitions
 *
 * This file exports all content type schemas for the Sanity CMS.
 * These schemas define the structure of content that can be managed
 * through the Sanity Studio interface.
 */

import { homepageSchema } from './homepage';
import { productTierSchema } from './productTier';
import { galleryItemSchema } from './galleryItem';
import { testimonialSchema } from './testimonial';

/**
 * All schema types for Sanity Studio
 *
 * To use these schemas in Sanity Studio:
 * 1. Create a sanity.config.ts file in your Sanity Studio project
 * 2. Import these schemas
 * 3. Add them to the schema configuration
 *
 * @example
 * ```typescript
 * import { defineConfig } from 'sanity';
 * import { schemas } from './schemas';
 *
 * export default defineConfig({
 *   // ... other config
 *   schema: {
 *     types: schemas,
 *   },
 * });
 * ```
 */
export const schemas = [
  homepageSchema,
  productTierSchema,
  galleryItemSchema,
  testimonialSchema,
];

// Export individual schemas for direct access
export {
  homepageSchema,
  productTierSchema,
  galleryItemSchema,
  testimonialSchema,
};
