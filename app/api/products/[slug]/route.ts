import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, getProducts } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

// Mock data for when database is not available (must match main products API)
const mockProducts = [
  {
    id: '1',
    name: 'Adventure Playground Set',
    slug: 'adventure-playground-set',
    shortDescription: 'Complete playground set with slides, swings, and climbing features',
    longDescription: 'The Adventure Playground Set is our flagship product, featuring a comprehensive array of play equipment designed to keep children entertained for hours. This premium set includes dual slides, a climbing wall, monkey bars, and a spacious platform deck. Built with high-quality cedar wood and stainless steel hardware, this playground is designed to withstand years of active play while maintaining its beautiful appearance.',
    basePrice: 15000,
    images: [
      '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
    ],
    thumbnail: '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
    published: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tierId: 'premium',
    ageRange: '3-12 years',
    capacity: 15,
    dimensions: { width: 20, depth: 15, height: 12, unit: 'ft' },
    features: [
      'Dual wave slides',
      'Rock climbing wall',
      'Monkey bars',
      'Spacious platform deck',
      'Swing set with 3 swings',
      'Sandbox area',
      'Steering wheel accessory',
      'Telescope'
    ],
    tier: {
      id: 'premium',
      name: 'Premium',
      slug: 'premium',
      description: 'High-end playground equipment',
      priceMin: 15000,
      priceMax: 75000,
      features: ['Premium materials', 'Extended warranty', 'Professional installation available'],
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
    longDescription: 'The Classic Jungle Gym brings timeless play value to your backyard. Featuring traditional monkey bars, a sturdy climbing frame, and a fun slide, this jungle gym provides endless opportunities for physical activity and imaginative play. Constructed with treated pine and galvanized steel, it offers excellent durability at an affordable price point.',
    basePrice: 8500,
    images: ['/images/Red%20Wooden%20Playset%20with%20Yellow%20Slide%20and%20Sandpit.webp'],
    thumbnail: '/images/Red%20Wooden%20Playset%20with%20Yellow%20Slide%20and%20Sandpit.webp',
    published: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tierId: 'standard',
    ageRange: '3-10 years',
    capacity: 10,
    dimensions: { width: 15, depth: 12, height: 10, unit: 'ft' },
    features: [
      'Monkey bars',
      'Climbing frame',
      'Wave slide',
      'Platform deck',
      'Two belt swings',
      'Ladder access'
    ],
    tier: {
      id: 'standard',
      name: 'Standard',
      slug: 'standard',
      description: 'Quality playground equipment for everyday fun',
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
    longDescription: 'The Compact Play Structure is the perfect solution for smaller backyards. Despite its compact footprint, this play structure packs in plenty of fun with a slide, climbing wall, and swing set. Its space-efficient design makes it ideal for urban homes while still providing children with hours of outdoor entertainment.',
    basePrice: 5500,
    images: ['/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp'],
    thumbnail: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
    published: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    tierId: 'basic',
    ageRange: '2-8 years',
    capacity: 6,
    dimensions: { width: 10, depth: 8, height: 8, unit: 'ft' },
    features: [
      'Wave slide',
      'Small climbing wall',
      'Single swing',
      'Compact platform deck',
      'Ladder access'
    ],
    tier: {
      id: 'basic',
      name: 'Basic',
      slug: 'basic',
      description: 'Affordable playground solutions',
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

// GET /api/products/[slug] - Get individual product details
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    let product;
    let relatedProducts: typeof mockProducts = [];

    try {
      // Try to fetch from database first
      product = await getProductBySlug(slug);

      if (product && product.published) {
        // Fetch related products (same tier, different products)
        const related = await getProducts({
          tierId: product.tierId,
          published: true,
          NOT: { id: product.id },
        });
        relatedProducts = related.slice(0, 4);
      }
    } catch (dbError) {
      console.warn('Database not available, using mock data:', dbError);
      // Use mock data when database is not available
      product = mockProducts.find(p => p.slug === slug);
      if (product) {
        // Get related products from mock data (same tier, different product)
        relatedProducts = mockProducts.filter(
          p => p.tierId === product!.tierId && p.id !== product!.id
        ).slice(0, 4);
      }
    }

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

    return NextResponse.json({
      product,
      relatedProducts,
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
