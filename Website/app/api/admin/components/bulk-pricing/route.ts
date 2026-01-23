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

// POST /api/admin/components/bulk-pricing - Update pricing for multiple components
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const { updates, adjustmentType, adjustmentValue } = body;

    // Validate input
    if (!updates && !adjustmentType) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Either updates array or adjustment parameters required',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const updatedComponents = [];

    // Handle individual updates
    if (updates && Array.isArray(updates)) {
      for (const update of updates) {
        if (!update.id || !update.price) {
          continue;
        }

        const component = await prisma.component.update({
          where: { id: update.id },
          data: { price: parseFloat(update.price) },
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

        updatedComponents.push(component);
      }
    }

    // Handle bulk adjustment (percentage or fixed amount)
    if (adjustmentType && adjustmentValue) {
      const { category, tierId, componentIds } = body;

      // Build where clause
      const where: Record<string, unknown> = {};
      if (category) where.category = category;
      if (tierId) where.tierId = tierId;
      if (componentIds && Array.isArray(componentIds)) {
        where.id = { in: componentIds };
      }

      // Fetch components to update
      const components = await prisma.component.findMany({ where });

      // Update each component
      for (const component of components) {
        let newPrice = component.price;

        if (adjustmentType === 'percentage') {
          newPrice = component.price * (1 + adjustmentValue / 100);
        } else if (adjustmentType === 'fixed') {
          newPrice = component.price + adjustmentValue;
        }

        // Ensure price doesn't go below 0
        newPrice = Math.max(0, newPrice);

        const updated = await prisma.component.update({
          where: { id: component.id },
          data: { price: newPrice },
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

        updatedComponents.push(updated);
      }
    }

    return NextResponse.json({
      data: updatedComponents,
      count: updatedComponents.length,
      message: `Successfully updated ${updatedComponents.length} component(s)`,
    });
  } catch (error) {
    console.error('Error updating component pricing:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update component pricing',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
