import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db/queries';
import { cached, cacheKeys, getCacheHeaders } from '@/lib/performance/cache';

export const dynamic = 'force-dynamic';

// Mock data for when database is not available
const mockProducts = [
  {
    id: '1',
    name: 'Adventure Playground Set',
    slug: 'adventure-playground-set',
    description: 'Complete playground set with slides, swings, and climbing features',
    basePrice: 15000,
    images: [
      '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
    ],
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tierId: 'premium',
    tier: {
      id: 'premium',
      name: 'Premium',
      description: 'High-end playground equipment',
      basePrice: 15000,
      features: ['Premium materials', 'Extended warranty'],
      materials: ['Cedar wood', 'Stainless steel'],
      warranty: '10 years',
      ageRange: '3-12 years',
      capacity: 15,
      dimensions: { width: 20, depth: 15, height: 12, unit: 'ft' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: '2',
    name: 'Classic Jungle Gym',
    slug: 'classic-jungle-gym',
    description: 'Traditional jungle gym with monkey bars and climbing frame',
    basePrice: 8500,
    images: ['/images/Red%20Wooden%20Playset%20with%20Yellow%20Slide%20and%20Sandpit.webp'],
    published: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tierId: 'standard',
    tier: {
      id: 'standard',
      name: 'Standard',
      description: 'Quality playground equipment for everyday fun',
      basePrice: 8500,
      features: ['Durable construction', '5-year warranty'],
      materials: ['Treated pine', 'Galvanized steel'],
      warranty: '5 years',
      ageRange: '3-10 years',
      capacity: 10,
      dimensions: { width: 15, depth: 12, height: 10, unit: 'ft' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: '3',
    name: 'Compact Play Structure',
    slug: 'compact-play-structure',
    description: 'Space-saving playground perfect for smaller yards',
    basePrice: 5500,
    images: ['/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp'],
    published: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    tierId: 'basic',
    tier: {
      id: 'basic',
      name: 'Basic',
      description: 'Affordable playground solutions',
      basePrice: 5500,
      features: ['Easy assembly', '3-year warranty'],
      materials: ['Treated pine', 'Powder-coated steel'],
      warranty: '3 years',
      ageRange: '2-8 years',
      capacity: 6,
      dimensions: { width: 10, depth: 8, height: 8, unit: 'ft' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
];

// GET /api/products - Get products with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const tierId = searchParams.get('tier');
    const sortBy = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '12', 10);

    let products;
    
    try {
      // Try to fetch from database first
      const where: Record<string, unknown> = { published: true };
      if (tierId) {
        where.tierId = tierId;
      }

      const cacheKey = cacheKeys.products(
        `tier=${tierId || 'all'}&sort=${sortBy}`
      );
      products = await cached(cacheKey, () => getProducts(where), {
        ttl: 5 * 60 * 1000, // 5 minutes
        staleWhileRevalidate: 10 * 60 * 1000, // 10 minutes
        tags: ['products'],
      });
    } catch (dbError) {
      console.warn('Database not available, using mock data:', dbError);
      // Use mock data when database is not available
      products = mockProducts.filter(product => 
        !tierId || product.tierId === tierId
      );
    }

    // Apply sorting
    const sortedProducts = [...products];
    switch (sortBy) {
      case 'price-asc':
        sortedProducts.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'name':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    // Apply pagination
    const total = sortedProducts.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

    return NextResponse.json(
      {
        data: paginatedProducts,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      },
      {
        headers: getCacheHeaders({
          maxAge: 60, // 1 minute
          staleWhileRevalidate: 300, // 5 minutes
          public: true,
        }),
      }
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch products',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
