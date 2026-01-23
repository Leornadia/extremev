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

// GET /api/admin/categories - Get all categories with component counts
export async function GET() {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    // Get distinct categories from components
    const categories = await prisma.component.groupBy({
      by: ['category'],
      _count: {
        category: true,
      },
      orderBy: {
        category: 'asc',
      },
    });

    // Get subcategories for each category
    const categoriesWithSubcategories = await Promise.all(
      categories.map(async (cat) => {
        const subcategories = await prisma.component.groupBy({
          by: ['subcategory'],
          where: {
            category: cat.category,
            subcategory: { not: null },
          },
          _count: {
            subcategory: true,
          },
        });

        return {
          name: cat.category,
          count: cat._count.category,
          subcategories: subcategories
            .filter((sub) => sub.subcategory !== null)
            .map((sub) => ({
              name: sub.subcategory,
              count: sub._count.subcategory,
            })),
        };
      })
    );

    return NextResponse.json({
      data: categoriesWithSubcategories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch categories',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories - Rename or reorganize categories
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { action, oldCategory, newCategory, oldSubcategory, newSubcategory } =
      body;

    if (action === 'rename-category') {
      // Rename category
      if (!oldCategory || !newCategory) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'oldCategory and newCategory are required',
              timestamp: new Date().toISOString(),
            },
          },
          { status: 400 }
        );
      }

      const result = await prisma.component.updateMany({
        where: { category: oldCategory },
        data: { category: newCategory },
      });

      return NextResponse.json({
        message: `Renamed category "${oldCategory}" to "${newCategory}"`,
        count: result.count,
      });
    } else if (action === 'rename-subcategory') {
      // Rename subcategory
      if (!oldCategory || !oldSubcategory || !newSubcategory) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message:
                'oldCategory, oldSubcategory, and newSubcategory are required',
              timestamp: new Date().toISOString(),
            },
          },
          { status: 400 }
        );
      }

      const result = await prisma.component.updateMany({
        where: {
          category: oldCategory,
          subcategory: oldSubcategory,
        },
        data: { subcategory: newSubcategory },
      });

      return NextResponse.json({
        message: `Renamed subcategory "${oldSubcategory}" to "${newSubcategory}"`,
        count: result.count,
      });
    } else if (action === 'move-components') {
      // Move components to different category
      const { componentIds, targetCategory, targetSubcategory } = body;

      if (!componentIds || !Array.isArray(componentIds) || !targetCategory) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'componentIds array and targetCategory are required',
              timestamp: new Date().toISOString(),
            },
          },
          { status: 400 }
        );
      }

      const result = await prisma.component.updateMany({
        where: { id: { in: componentIds } },
        data: {
          category: targetCategory,
          subcategory: targetSubcategory || null,
        },
      });

      return NextResponse.json({
        message: `Moved ${result.count} component(s) to "${targetCategory}"`,
        count: result.count,
      });
    }

    return NextResponse.json(
      {
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid action',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error managing categories:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to manage categories',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
