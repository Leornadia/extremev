export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for design data
const saveDesignSchema = z.object({
  name: z.string().min(1).max(100),
  thumbnail: z.string().optional(),
  designData: z.object({
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
  }),
});

/**
 * GET /api/designs
 * Fetch all saved designs for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const designs = await prisma.savedDesign.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ designs });
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/designs
 * Create a new saved design
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validationResult = saveDesignSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid design data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, thumbnail, designData } = validationResult.data;

    // Create the saved design
    const savedDesign = await prisma.savedDesign.create({
      data: {
        userId: session.user.id,
        name,
        thumbnail: thumbnail || '',
        designData,
      },
    });

    return NextResponse.json(
      {
        message: 'Design saved successfully',
        design: savedDesign,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving design:', error);
    return NextResponse.json(
      { error: 'Failed to save design' },
      { status: 500 }
    );
  }
}
