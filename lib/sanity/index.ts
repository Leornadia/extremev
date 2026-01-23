/**
 * Sanity CMS Integration
 *
 * Main export file for Sanity CMS functionality.
 * Import from this file to access all Sanity-related utilities.
 */

// Configuration
export { sanityConfig } from './config';

// Clients
export { sanityClient, sanityWriteClient, urlFor } from './client';

// Types
export type {
  SanityDocument,
  SanityImage,
  SanityFile,
  CTA,
  Homepage,
  ProductTier,
  GalleryItem,
  Testimonial,
  SanityDocumentType,
} from './types';

// Queries
export {
  homepageQuery,
  productTiersQuery,
  productTierBySlugQuery,
  galleryItemsQuery,
  filteredGalleryItemsQuery,
  galleryItemBySlugQuery,
  testimonialsQuery,
  featuredTestimonialsQuery,
  testimonialsByTierQuery,
} from './queries';

// Fetch utilities
export {
  getHomepage,
  getProductTiers,
  getProductTierBySlug,
  getGalleryItems,
  getFilteredGalleryItems,
  getGalleryItemBySlug,
  getTestimonials,
  getFeaturedTestimonials,
  getTestimonialsByTier,
  REVALIDATE_TIME,
} from './fetch';

// Schemas (for Sanity Studio setup)
export {
  schemas,
  homepageSchema,
  productTierSchema,
  galleryItemSchema,
  testimonialSchema,
} from './schemas';
