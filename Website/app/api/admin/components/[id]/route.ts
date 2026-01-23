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

// GET /api/admin/components/[id] - Get specific component
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const component = await prisma.component.findUnique({
      where: { id: params.id },
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

    if (!component) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Component not found',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: component });
  } catch (error) {
    console.error('Error fetching component:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch component',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/components/[id] - Update component
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();

    // Check if component exists
    const existingComponent = await prisma.component.findUnique({
      where: { id: params.id },
    });

    if (!existingComponent) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Component not found',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.subcategory !== undefined)
      updateData.subcategory = body.subcategory;
    if (body.tierId !== undefined) updateData.tierId = body.tierId;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;
    if (body.model3D !== undefined) updateData.model3D = body.model3D;
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;
    if (body.weight !== undefined) updateData.weight = parseFloat(body.weight);
    if (body.connectionPoints !== undefined)
      updateData.connectionPoints = body.connectionPoints;
    if (body.compatibilityRules !== undefined)
      updateData.compatibilityRules = body.compatibilityRules;
    if (body.metadata !== undefined) updateData.metadata = body.metadata;
    if (body.published !== undefined) updateData.published = body.published;

    // Update component
    const component = await prisma.component.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({
      data: component,
      message: 'Component updated successfully',
    });
  } catch (error) {
    console.error('Error updating component:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update component',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/components/[id] - Delete component
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    // Check if component exists
    const existingComponent = await prisma.component.findUnique({
      where: { id: params.id },
    });

    if (!existingComponent) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Component not found',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 404 }
      );
    }

    // Check if component is used in any saved designs
    const designsUsingComponent = await prisma.savedDesign.findMany({
      where: {
        designData: {
          path: ['components'],
          array_contains: [{ componentId: params.id }],
        },
      },
      select: { id: true },
    });

    if (designsUsingComponent.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: 'COMPONENT_IN_USE',
            message: `Cannot delete component. It is used in ${designsUsingComponent.length} saved design(s)`,
            details: {
              designCount: designsUsingComponent.length,
            },
            timestamp: new Date().toISOString(),
          },
        },
        { status: 409 }
      );
    }

    // Delete component
    await prisma.component.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Component deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting component:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete component',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
