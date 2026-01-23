import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/quotes/[id]
 * Get a specific quote request
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const quoteRequest = await prisma.quoteRequest.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!quoteRequest) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Quote request not found',
          },
        },
        { status: 404 }
      );
    }

    // Verify ownership
    if (quoteRequest.userId !== session.user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
          },
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        quoteRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get quote request error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch quote request',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/quotes/[id]
 * Update quote request notes (customer can add notes)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    const quoteRequest = await prisma.quoteRequest.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!quoteRequest) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Quote request not found',
          },
        },
        { status: 404 }
      );
    }

    // Verify ownership
    if (quoteRequest.userId !== session.user.id) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Access denied',
          },
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { notes } = body;

    if (notes !== undefined && typeof notes !== 'string') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Notes must be a string',
          },
        },
        { status: 400 }
      );
    }

    const updatedQuoteRequest = await prisma.quoteRequest.update({
      where: {
        id: params.id,
      },
      data: {
        notes,
      },
    });

    return NextResponse.json(
      {
        quoteRequest: updatedQuoteRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update quote request error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update quote request',
        },
      },
      { status: 500 }
    );
  }
}
