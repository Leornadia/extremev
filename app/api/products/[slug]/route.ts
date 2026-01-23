import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, getProducts } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

// GET /api/products/[slug] - Get individual product details
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Product not found',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    if (!product.published) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Product not found',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    // Fetch related products (same tier, different products)
    const relatedProducts = await getProducts({
      tierId: product.tierId,
      published: true,
      NOT: { id: product.id },
    });

    // Limit to 4 related products
    const limitedRelated = relatedProducts.slice(0, 4);

    return NextResponse.json({
      product,
      relatedProducts: limitedRelated,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch product',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
