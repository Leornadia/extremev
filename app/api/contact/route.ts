export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { env } from '@/lib/env';

// Initialize Resend client
const resend = env.emailApiKey ? new Resend(env.emailApiKey) : null;

// Rate limiting store (in-memory for simplicity)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per hour per IP

function getRateLimitKey(request: NextRequest): string {
  // Use IP address for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
  return `contact_${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
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

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

function validateContactData(data: unknown): {
  valid: boolean;
  data?: ContactFormData;
  errors?: string[];
} {
  const errors: string[] = [];
  const formData = data as Record<string, unknown>;

  if (
    !formData.name ||
    typeof formData.name !== 'string' ||
    formData.name.trim().length < 2
  ) {
    errors.push('Name must be at least 2 characters');
  }

  if (!formData.email || typeof formData.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('Invalid email format');
  }

  if (!formData.phone || typeof formData.phone !== 'string') {
    errors.push('Phone number is required');
  } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
    errors.push('Invalid phone number format');
  }

  if (
    !formData.message ||
    typeof formData.message !== 'string' ||
    formData.message.trim().length < 10
  ) {
    errors.push('Message must be at least 10 characters');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: (formData.name as string).trim(),
      email: (formData.email as string).trim().toLowerCase(),
      phone: (formData.phone as string).trim(),
      message: (formData.message as string).trim(),
    },
  };
}

async function sendEmail(data: ContactFormData): Promise<void> {
  if (!resend) {
    console.warn('Email service not configured. Skipping email send.');
    return;
  }

  const emailFrom = env.emailFrom || 'noreply@extremev.co.za';

  try {
    // Send notification to business
    await resend.emails.send({
      from: emailFrom,
      to: 'info@extremev.co.za',
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
      `,
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: emailFrom,
      to: data.email,
      subject: 'Thank you for contacting Extreme V',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your message and will get back to you within 24 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>The Extreme V Team</p>
        <p><small>If you didn't submit this form, please ignore this email.</small></p>
      `,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email notification');
  }
}

async function storeSubmission(data: ContactFormData): Promise<void> {
  // TODO: Store in database when database is set up
  // For now, just log the submission
  console.log('Contact form submission:', {
    ...data,
    timestamp: new Date().toISOString(),
  });
}

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
            message: 'Too many requests. Please try again later.',
          },
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate data
    const validation = validateContactData(body);
    if (!validation.valid) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid form data',
            details: validation.errors,
          },
        },
        { status: 400 }
      );
    }

    const contactData = validation.data!;

    // Store submission
    await storeSubmission(contactData);

    // Send emails
    await sendEmail(contactData);

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process your request. Please try again later.',
        },
      },
      { status: 500 }
    );
  }
}
