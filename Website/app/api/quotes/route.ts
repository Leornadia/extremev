import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Design } from '@/lib/types/configurator';
import { validationEngine } from '@/lib/validation';
import { calculatePricingBreakdown, validatePricing } from '@/lib/pricing';

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 quote requests per hour per IP

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `quote_${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - record.count,
  };
}

interface QuoteRequestBody {
  design: Design;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    postalCode: string;
    notes?: string;
  };
  includeInstallation?: boolean;
}

function validateQuoteRequest(data: unknown): {
  valid: boolean;
  data?: QuoteRequestBody;
  errors?: string[];
} {
  const errors: string[] = [];
  const body = data as Record<string, unknown>;

  // Validate design
  if (!body.design || typeof body.design !== 'object') {
    errors.push('Design data is required');
  } else {
    const design = body.design as Design;
    if (!design.components || !Array.isArray(design.components)) {
      errors.push('Design must contain components');
    } else if (design.components.length === 0) {
      errors.push('Design must have at least one component');
    }
  }

  // Validate customer info
  if (!body.customerInfo || typeof body.customerInfo !== 'object') {
    errors.push('Customer information is required');
  } else {
    const info = body.customerInfo as Record<string, unknown>;

    if (
      !info.name ||
      typeof info.name !== 'string' ||
      info.name.trim().length < 2
    ) {
      errors.push('Valid name is required');
    }

    if (!info.email || typeof info.email !== 'string') {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email)) {
      errors.push('Invalid email format');
    }

    if (!info.phone || typeof info.phone !== 'string') {
      errors.push('Phone number is required');
    }

    if (
      !info.city ||
      typeof info.city !== 'string' ||
      info.city.trim().length === 0
    ) {
      errors.push('City is required');
    }

    if (
      !info.state ||
      typeof info.state !== 'string' ||
      info.state.trim().length === 0
    ) {
      errors.push('State/Province is required');
    }

    if (
      !info.postalCode ||
      typeof info.postalCode !== 'string' ||
      info.postalCode.trim().length === 0
    ) {
      errors.push('Postal code is required');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: body as unknown as QuoteRequestBody,
  };
}

/**
 * POST /api/quotes
 * Create a new quote request
 */
export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many quote requests. Please try again later.',
          },
        },
        { status: 429 }
      );
    }

    // Get session (optional - quotes can be submitted without login)
    const session = await getServerSession(authOptions);

    // Parse and validate request body
    const body = await request.json();
    const validation = validateQuoteRequest(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid quote request data',
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    const {
      design,
      customerInfo,
      includeInstallation = false,
    } = validation.data!;

    // Validate design structure
    const designValidation = validationEngine.evaluate(design);
    if (designValidation.errors.length > 0) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_DESIGN',
            message: 'Design has validation errors',
            details: designValidation.errors.map((e) => e.message),
          },
        },
        { status: 400 }
      );
    }

    // Calculate pricing
    const location = {
      city: customerInfo.city,
      state: customerInfo.state,
      postalCode: customerInfo.postalCode,
    };

    const pricing = calculatePricingBreakdown(
      design,
      location,
      includeInstallation
    );

    // Validate pricing
    const pricingValidation = validatePricing(pricing);
    if (!pricingValidation.isValid) {
      return NextResponse.json(
        {
          error: {
            code: 'PRICING_ERROR',
            message: 'Failed to calculate pricing',
            details: pricingValidation.errors,
          },
        },
        { status: 400 }
      );
    }

    // Create quote request in database
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        userId: session?.user?.id || null,
        designSnapshot: design as any, // Prisma Json type
        customerInfo: customerInfo as any, // Prisma Json type
        pricing: pricing as any, // Prisma Json type
        status: 'pending',
      },
    });

    // Send email notifications (async, don't block response)
    // Import dynamically to avoid circular dependencies
    import('@/lib/email/quoteEmailService')
      .then(({ sendQuoteRequestEmails }) => {
        sendQuoteRequestEmails({
          quoteId: quoteRequest.id,
          customerInfo,
          design,
          pricing,
          createdAt: quoteRequest.createdAt,
        }).catch((error) => {
          console.error('Failed to send quote emails:', error);
        });
      })
      .catch((error) => {
        console.error('Failed to import email service:', error);
      });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        quoteRequest: {
          id: quoteRequest.id,
          status: quoteRequest.status,
          createdAt: quoteRequest.createdAt,
        },
        pricing,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quote request error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process quote request. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/quotes
 * Get quote requests for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Require authentication
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Build query
    const where: any = {
      userId: session.user.id,
    };

    if (status) {
      where.status = status;
    }

    // Fetch quote requests
    const [quoteRequests, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.quoteRequest.count({ where }),
    ]);

    return NextResponse.json(
      {
        quoteRequests,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get quote requests error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch quote requests',
        },
      },
      { status: 500 }
    );
  }
}
