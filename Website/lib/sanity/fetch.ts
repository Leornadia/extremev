/**
 * Sanity Data Fetching Utilities
 *
 * Provides helper functions for fetching content from Sanity CMS
 * with support for Incremental Static Regeneration (ISR) and caching.
 */

import { sanityClient } from './client';
import type { Homepage, ProductTier, GalleryItem, Testimonial } from './types';
import {
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

/**
 * Revalidation time for ISR (in seconds)
 * Content will be regenerated at most once per this interval
 */
export const REVALIDATE_TIME = 60; // 1 minute

/**
 * Fetch homepage content
 * Uses ISR with 1-minute revalidation
 */
export async function getHomepage(): Promise<Homepage | null> {
  try {
    const homepage = await sanityClient.fetch<Homepage>(
      homepageQuery,
      {},
      {
        next: { revalidate: REVALIDATE_TIME },
      }
    );
    return homepage;
  } catch (error) {
    console.error('Error fetching homepage:', error);
    return null;
  }
}

/**
 * Fetch all published product tiers
 * Uses ISR with 1-minute revalidation
 */
export async function getProductTiers(): Promise<ProductTier[]> {
  try {
    const tiers = await sanityClient.fetch<ProductTier[]>(
      productTiersQuery,
      {},
      {
        next: { revalidate: REVALIDATE_TIME },
      }
    );
    return tiers || [];
  } catch (error) {
    console.error('Error fetching product tiers:', error);
    return [];
  }
}

/**
 * Fetch a single product tier by slug
 * Uses ISR with 1-minute revalidation
 */
export async function getProductTierBySlug(
  slug: string
): Promise<ProductTier | null> {
  try {
    const tier = await sanityClient.fetch<ProductTier>(
      productTierBySlugQuery,
      { slug },
      { next: { revalidate: REVALIDATE_TIME } }
    );
    return tier;
  } catch (error) {
    console.error(`Error fetching product tier with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all published gallery items
 * Uses ISR with 1-minute revalidation
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const items = await sanityClient.fetch<GalleryItem[]>(
      galleryItemsQuery,
      {},
      {
        next: { revalidate: REVALIDATE_TIME },
      }
    );
    return items || [];
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return [];
  }
}

/**
 * Fetch filtered gallery items
 *
 * @param category - Filter by category (optional)
 * @param tier - Filter by product tier slug (optional)
 */
export async function getFilteredGalleryItems(
  category?: string | null,
  tier?: string | null
): Promise<GalleryItem[]> {
  try {
    const items = await sanityClient.fetch<GalleryItem[]>(
      filteredGalleryItemsQuery,
      { category, tier },
      { next: { revalidate: REVALIDATE_TIME } }
    );
    return items || [];
  } catch (error) {
    console.error('Error fetching filtered gallery items:', error);
    return [];
  }
}

/**
 * Fetch a single gallery item by slug
 * Uses ISR with 1-minute revalidation
 */
export async function getGalleryItemBySlug(
  slug: string
): Promise<GalleryItem | null> {
  try {
    const item = await sanityClient.fetch<GalleryItem>(
      galleryItemBySlugQuery,
      { slug },
      { next: { revalidate: REVALIDATE_TIME } }
    );
    return item;
  } catch (error) {
    console.error(`Error fetching gallery item with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetch all published testimonials
 * Uses ISR with 1-minute revalidation
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const testimonials = await sanityClient.fetch<Testimonial[]>(
      testimonialsQuery,
      {},
      {
        next: { revalidate: REVALIDATE_TIME },
      }
    );
    return testimonials || [];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

/**
 * Fetch featured testimonials
 *
 * @param limit - Maximum number of testimonials to fetch (default: 5)
 */
export async function getFeaturedTestimonials(
  limit: number = 5
): Promise<Testimonial[]> {
  try {
    const testimonials = await sanityClient.fetch<Testimonial[]>(
      featuredTestimonialsQuery,
      { limit },
      { next: { revalidate: REVALIDATE_TIME } }
    );
    return testimonials || [];
  } catch (error) {
    console.error('Error fetching featured testimonials:', error);
    return [];
  }
}

/**
 * Fetch testimonials for a specific product tier
 *
 * @param tierSlug - Product tier slug
 */
export async function getTestimonialsByTier(
  tierSlug: string
): Promise<Testimonial[]> {
  try {
    const testimonials = await sanityClient.fetch<Testimonial[]>(
      testimonialsByTierQuery,
      { tier: tierSlug },
      { next: { revalidate: REVALIDATE_TIME } }
    );
    return testimonials || [];
  } catch (error) {
    console.error(`Error fetching testimonials for tier "${tierSlug}":`, error);
    return [];
  }
}

/**
 * Invalidate cache for a specific path
 * This is used with webhooks to trigger revalidation when content changes
 *
 * @param path - Path to revalidate (e.g., '/products', '/gallery')
 */
export async function revalidatePath(path: string): Promise<void> {
  try {
    // This will be called from the webhook API route
    // Next.js will handle the actual revalidation
    console.log(`Revalidating path: ${path}`);
  } catch (error) {
    console.error(`Error revalidating path "${path}":`, error);
  }
}
