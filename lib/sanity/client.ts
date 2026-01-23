/**
 * Sanity Client
 *
 * Provides configured Sanity clients for reading and writing data.
 */

import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { sanityConfig } from './config';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Standard Sanity client for read operations
 * Uses CDN in production for better performance
 */
export const sanityClient = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
  useCdn: sanityConfig.useCdn,
});

/**
 * Authenticated Sanity client for write operations
 * Requires SANITY_API_TOKEN environment variable
 */
export const sanityWriteClient = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
  useCdn: false, // Never use CDN for write operations
  token: sanityConfig.token,
});

/**
 * Image URL builder for generating optimized image URLs
 */
const builder = imageUrlBuilder(sanityClient);

/**
 * Helper function to generate image URLs from Sanity image references
 *
 * @param source - Sanity image source object
 * @returns Image URL builder instance
 *
 * @example
 * ```tsx
 * const imageUrl = urlFor(image)
 *   .width(800)
 *   .height(600)
 *   .format('webp')
 *   .url();
 * ```
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
