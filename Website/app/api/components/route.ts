import { NextRequest, NextResponse } from 'next/server';
import { mockComponents, MockComponent } from '@/lib/data/mock-components';

interface TransformedComponent {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  thumbnail: string;
  model3D: string;
  dimensions: { width: number; depth: number; height: number; unit: 'ft' | 'm' };
  weight: number;
  connectionPoints: unknown[];
  compatibilityRules: unknown;
  metadata: { ageRange: string; capacity: number; materials: string[]; colors: string[] };
  tier: unknown;
}

export const dynamic = 'force-dynamic';

// Cache configuration for component data (revalidate every 5 minutes)
export const revalidate = 300;

// Helper to check if database is available
async function getDatabaseComponents(where: Record<string, unknown>) {
  try {
    // Dynamically import to avoid errors when Prisma isn't configured
    const { getComponents, getComponentsByCategory } = await import('@/lib/db/queries');
    const category = where.category as string | undefined;

    const components = category
      ? await getComponentsByCategory(category)
      : await getComponents(where);

    return components.map((comp: { id: string; name: string; category: string; subcategory?: string | null; price: number; thumbnail: string; model3D: string; dimensions: unknown; weight: number; connectionPoints: unknown; compatibilityRules: unknown; metadata: unknown; tier: unknown }) => {
      const dimensions = comp.dimensions as {
        width: number;
        depth: number;
        height: number;
        unit: 'ft' | 'm';
      };

      const metadata = comp.metadata as {
        ageRange: string;
        capacity: number;
        materials: string[];
        colors: string[];
        tier?: string;
      };

      return {
        id: comp.id,
        name: comp.name,
        category: comp.category,
        subcategory: comp.subcategory || undefined,
        price: comp.price,
        thumbnail: comp.thumbnail,
        model3D: comp.model3D,
        dimensions,
        weight: comp.weight,
        connectionPoints: comp.connectionPoints as unknown[],
        compatibilityRules: comp.compatibilityRules as unknown[],
        metadata,
        tier: comp.tier,
      };
    });
  } catch {
    // Database not available, return null to use mock data
    return null;
  }
}

// GET /api/components - Get components with filtering
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build where clause
    const where: Record<string, unknown> = { published: true };

    if (category) {
      where.category = category;
    }

    // Try to get from database first
    let components: (TransformedComponent | MockComponent)[] | null = await getDatabaseComponents(where);

    // If database not available, use mock data
    if (components === null) {
      console.log('[API] Using mock component data (database not available)');
      components = [...mockComponents];

      // Apply category filter
      if (category) {
        components = components.filter(
          (c) => c.category.toLowerCase() === category.toLowerCase()
        );
      }
    }

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      components = components.filter((comp) => {
        const metadata = comp.metadata as { materials?: string[] };
        return (
          comp.name.toLowerCase().includes(searchLower) ||
          comp.category.toLowerCase().includes(searchLower) ||
          comp.subcategory?.toLowerCase().includes(searchLower) ||
          metadata.materials?.some((m: string) =>
            m.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    return NextResponse.json(
      {
        data: components,
        count: components.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch components',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

