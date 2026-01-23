/**
 * Sanity Webhook Handler
 *
 * This API route handles webhooks from Sanity CMS to trigger
 * Incremental Static Regeneration (ISR) when content is updated.
 *
 * Setup in Sanity:
 * 1. Go to your Sanity project settings
 * 2. Navigate to "API" → "Webhooks"
 * 3. Create a new webhook with URL: https://your-domain.com/api/sanity/revalidate
 * 4. Set a secret token and add it to SANITY_WEBHOOK_SECRET env variable
 * 5. Select which document types should trigger the webhook
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook secret for validating requests from Sanity
 * Set this in your environment variables
 */
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

/**
 * Map of Sanity document types to paths that should be revalidated
 */
const REVALIDATION_MAP: Record<string, string[]> = {
  homepage: ['/'],
  productTier: ['/', '/products', '/tiers'],
  galleryItem: ['/', '/gallery'],
  testimonial: ['/'],
};

/**
 * POST handler for Sanity webhooks
 */
export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!WEBHOOK_SECRET) {
      console.error('SANITY_WEBHOOK_SECRET is not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (token !== WEBHOOK_SECRET) {
      console.error('Invalid webhook secret');
      return NextResponse.json(
        { error: 'Invalid webhook secret' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const body = await request.json();
    const documentType = body._type;

    if (!documentType) {
      return NextResponse.json(
        { error: 'Missing document type in webhook payload' },
        { status: 400 }
      );
    }

    // Get paths to revalidate for this document type
    const pathsToRevalidate = REVALIDATION_MAP[documentType] || [];

    if (pathsToRevalidate.length === 0) {
      console.log(`No revalidation paths configured for type: ${documentType}`);
      return NextResponse.json({
        message: 'No paths to revalidate',
        documentType,
      });
    }

    // Revalidate all relevant paths
    const revalidationPromises = pathsToRevalidate.map(async (path) => {
      try {
        revalidatePath(path);
        console.log(`Revalidated path: ${path}`);
        return { path, success: true };
      } catch (error) {
        console.error(`Error revalidating path ${path}:`, error);
        return { path, success: false, error: String(error) };
      }
    });

    const results = await Promise.all(revalidationPromises);

    return NextResponse.json({
      message: 'Revalidation triggered',
      documentType,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET handler for testing webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Sanity webhook endpoint is active',
    note: 'Use POST with proper authentication to trigger revalidation',
  });
}
