import { NextResponse } from 'next/server';
import { getProductTiers } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

// Mock data for when database is not available
const mockTiers = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Affordable playground solutions for smaller spaces and budgets',
    basePrice: 5500,
    features: ['Easy assembly', '3-year warranty', 'Basic safety features'],
    materials: ['Treated pine', 'Powder-coated steel'],
    warranty: '3 years',
    ageRange: '2-8 years',
    capacity: 6,
    dimensions: { width: 10, depth: 8, height: 8, unit: 'ft' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Quality playground equipment for everyday fun and adventure',
    basePrice: 8500,
    features: ['Durable construction', '5-year warranty', 'Enhanced safety features'],
    materials: ['Treated pine', 'Galvanized steel'],
    warranty: '5 years',
    ageRange: '3-10 years',
    capacity: 10,
    dimensions: { width: 15, depth: 12, height: 10, unit: 'ft' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'High-end playground equipment with premium materials and features',
    basePrice: 15000,
    features: ['Premium materials', 'Extended warranty', 'Advanced safety systems'],
    materials: ['Cedar wood', 'Stainless steel'],
    warranty: '10 years',
    ageRange: '3-12 years',
    capacity: 15,
    dimensions: { width: 20, depth: 15, height: 12, unit: 'ft' },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// GET /api/tiers - Get all product tiers
export async function GET() {
  try {
    let tiers;
    
    try {
      // Try to fetch from database first
      tiers = await getProductTiers();
    } catch (dbError) {
      console.warn('Database not available, using mock data:', dbError);
      // Use mock data when database is not available
      tiers = mockTiers;
    }

    return NextResponse.json({
      data: tiers,
    });
  } catch (error) {
    console.error('Error fetching product tiers:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch product tiers',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
