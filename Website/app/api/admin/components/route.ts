import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Helper function to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const isAdmin =
    session?.user?.email && adminEmails.includes(session.user.email);

  if (!isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Admin access required',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 }
      ),
    };
  }

  return { authorized: true };
}

// GET /api/admin/components - Get all components (including unpublished)
export async function GET(request: NextRequest) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const searchParams = request.nextUrl.searchParams;

    // Extract query parameters
    const category = searchParams.get('category');
    const tierId = searchParams.get('tier');
    const published = searchParams.get('published');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (tierId) {
      where.tierId = tierId;
    }

    if (published !== null && published !== 'all') {
      where.published = published === 'true';
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { subcategory: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Fetch components with tier information
    const [components, total] = await Promise.all([
      prisma.component.findMany({
        where,
        include: {
          tier: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        take: limit,
        skip: offset,
      }),
      prisma.component.count({ where }),
    ]);

    return NextResponse.json({
      data: components,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
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

// POST /api/admin/components - Create new component
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'name',
      'category',
      'tierId',
      'price',
      'thumbnail',
      'model3D',
      'dimensions',
      'weight',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: `Missing required field: ${field}`,
              timestamp: new Date().toISOString(),
            },
          },
          { status: 400 }
        );
      }
    }

    // Create component
    const component = await prisma.component.create({
      data: {
        name: body.name,
        category: body.category,
        subcategory: body.subcategory || null,
        tierId: body.tierId,
        price: parseFloat(body.price),
        thumbnail: body.thumbnail,
        model3D: body.model3D,
        dimensions: body.dimensions,
        weight: parseFloat(body.weight),
        connectionPoints: body.connectionPoints || [],
        compatibilityRules: body.compatibilityRules || [],
        metadata: body.metadata || {},
        published: body.published || false,
      },
      include: {
        tier: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: component,
        message: 'Component created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create component',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
