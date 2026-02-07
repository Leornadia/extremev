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
    shortDescription: 'Complete playground set with slides, swings, and climbing features',
    longDescription: 'The Adventure Playground Set is our flagship product, featuring a comprehensive array of play equipment designed to keep children entertained for hours.',
    basePrice: 15000,
    images: [
      '/images/Large Double-Tower Wooden Jungle Gym with Blue Slide.webp',
    ],
    thumbnail: '/images/Large Double-Tower Wooden Jungle Gym with Blue Slide.webp',
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tierId: 'premium',
    ageRange: '3-12 years',
    capacity: 15,
    features: ['Dual slides', 'Climbing wall', 'Monkey bars', 'Swing set'],
    dimensions: { width: 20, depth: 15, height: 12, unit: 'ft' },
    tier: {
      id: 'premium',
      name: 'Premium',
      slug: 'premium',
      priceMin: 15000,
      priceMax: 75000,
      features: ['Premium materials', 'Extended warranty'],
      materials: ['Cedar wood', 'Stainless steel'],
      warrantyStructural: 10,
      warrantyHardware: 5,
      image: '/images/tiers/premium-tier.jpg',
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: '2',
    name: 'Classic Jungle Gym',
    slug: 'classic-jungle-gym',
    shortDescription: 'Traditional jungle gym with monkey bars and climbing frame',
    longDescription: 'The Classic Jungle Gym brings timeless play value to your backyard with traditional monkey bars and a sturdy climbing frame.',
    basePrice: 8500,
    images: ['/images/Red Wooden Playset with Yellow Slide and Sandpit.webp'],
    thumbnail: '/images/Red Wooden Playset with Yellow Slide and Sandpit.webp',
    published: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tierId: 'standard',
    ageRange: '3-10 years',
    capacity: 10,
    features: ['Monkey bars', 'Climbing frame', 'Wave slide', 'Swings'],
    dimensions: { width: 15, depth: 12, height: 10, unit: 'ft' },
    tier: {
      id: 'standard',
      name: 'Standard',
      slug: 'standard',
      priceMin: 8500,
      priceMax: 35000,
      features: ['Durable construction', '5-year warranty'],
      materials: ['Treated pine', 'Galvanized steel'],
      warrantyStructural: 5,
      warrantyHardware: 2,
      image: '/images/tiers/standard-tier.jpg',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  {
    id: '3',
    name: 'Compact Play Structure',
    slug: 'compact-play-structure',
    shortDescription: 'Space-saving playground perfect for smaller yards',
    longDescription: 'The Compact Play Structure is the perfect solution for smaller backyards, packing fun into a compact footprint.',
    basePrice: 5500,
    images: ['/images/Wooden Jungle Gym with Green Slide in a Garden.webp'],
    thumbnail: '/images/Wooden Jungle Gym with Green Slide in a Garden.webp',
    published: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    tierId: 'basic',
    ageRange: '2-8 years',
    capacity: 6,
    features: ['Wave slide', 'Climbing wall', 'Single swing', 'Platform deck'],
    dimensions: { width: 10, depth: 8, height: 8, unit: 'ft' },
    tier: {
      id: 'basic',
      name: 'Basic',
      slug: 'basic',
      priceMin: 5500,
      priceMax: 15000,
      features: ['Easy assembly', '3-year warranty'],
      materials: ['Treated pine', 'Powder-coated steel'],
      warrantyStructural: 3,
      warrantyHardware: 1,
      image: '/images/tiers/basic-tier.jpg',
      order: 0,
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
