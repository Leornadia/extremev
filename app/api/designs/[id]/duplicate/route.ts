export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
