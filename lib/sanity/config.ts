/**
 * Sanity CMS Configuration
 *
 * This file contains the configuration for connecting to Sanity CMS.
 * Sanity is used to manage content for homepage sections, product tiers,
 * gallery items, and testimonials.
 */

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-10-30', // Use current date for API version
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster reads
  token: process.env.SANITY_API_TOKEN, // Used for authenticated requests (write operations)
};

// Validate required configuration
if (!sanityConfig.projectId) {
  console.warn('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
}
