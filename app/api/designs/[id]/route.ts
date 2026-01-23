export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for design updates
const updateDesignSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  thumbnail: z.string().optional(),
  designData: z
    .object({
      name: z.string(),
      components: z.array(z.any()),
      metadata: z.object({
        totalPrice: z.number(),
        dimensions: z.object({
          width: z.number(),
          depth: z.number(),
          height: z.number(),
          unit: z.string(),
        }),
        estimatedWeight: z.number(),
        ageRange: z.string(),
        capacity: z.number(),
        componentCount: z.number(),
      }),
    })
    .optional(),
});

/**
 * GET /api/designs/[id]
 * Fetch a specific saved design
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const design = await prisma.savedDesign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!design) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    return NextResponse.json({ design });
  } catch (error) {
    console.error('Error fetching design:', error);
    return NextResponse.json(
      { error: 'Failed to fetch design' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/designs/[id]
 * Update a saved design
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingDesign = await prisma.savedDesign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingDesign) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    const body = await request.json();

    // Validate request body
    const validationResult = updateDesignSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid design data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (validationResult.data.name !== undefined) {
      updateData.name = validationResult.data.name;
    }

    if (validationResult.data.thumbnail !== undefined) {
      updateData.thumbnail = validationResult.data.thumbnail;
    }

    if (validationResult.data.designData !== undefined) {
      updateData.designData = validationResult.data.designData;
    }

    // Update the design
    const updatedDesign = await prisma.savedDesign.update({
      where: {
        id: params.id,
      },
      data: updateData,
    });

    return NextResponse.json({
      message: 'Design updated successfully',
      design: updatedDesign,
    });
  } catch (error) {
    console.error('Error updating design:', error);
    return NextResponse.json(
      { error: 'Failed to update design' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/designs/[id]
 * Delete a saved design
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingDesign = await prisma.savedDesign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingDesign) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // Delete the design
    await prisma.savedDesign.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: 'Design deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting design:', error);
    return NextResponse.json(
      { error: 'Failed to delete design' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/designs/[id]/duplicate
 * Duplicate a saved design
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existingDesign = await prisma.savedDesign.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingDesign) {
      return NextResponse.json({ error: 'Design not found' }, { status: 404 });
    }

    // Create a duplicate
    const duplicatedDesign = await prisma.savedDesign.create({
      data: {
        userId: session.user.id,
        name: `${existingDesign.name} (Copy)`,
        thumbnail: existingDesign.thumbnail,
        designData: existingDesign.designData,
      },
    });

    return NextResponse.json(
      {
        message: 'Design duplicated successfully',
        design: duplicatedDesign,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error duplicating design:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate design' },
      { status: 500 }
    );
  }
}
