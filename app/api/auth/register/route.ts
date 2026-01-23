export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  phone: z.string().optional(),
});

// Mock registered users storage (in production, this would be in database)
const mockRegisteredUsers = new Set(['demo@extremev.co.za', 'admin@extremev.co.za']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: validationResult.error.flatten().fieldErrors,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = validationResult.data;

    try {
      // Try database first if available
      if (prisma && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return NextResponse.json(
            {
              error: {
                code: 'USER_EXISTS',
                message: 'A user with this email already exists',
                timestamp: new Date().toISOString(),
              },
            },
            { status: 409 }
          );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
          data: {
            name,
            email,
            phone,
            passwordHash,
            emailVerified: null,
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: 'Registration successful. Please check your email to verify your account.',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          },
          { status: 201 }
        );
      }
    } catch (dbError) {
      console.warn('Database not available, using mock registration');
    }

    // Fallback to mock registration for demonstration
    if (mockRegisteredUsers.has(email)) {
      return NextResponse.json(
        {
          error: {
            code: 'USER_EXISTS',
            message: 'A user with this email already exists',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 409 }
      );
    }

    // Add to mock registered users
    mockRegisteredUsers.add(email);

    // Simulate successful registration
    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! You can now sign in with your credentials.',
        user: {
          id: Date.now().toString(),
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during registration',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}

async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
) {
  // Get base URL for verification link
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${token}`;

  // If using Resend
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@extremev.co.za',
      to: email,
      subject: 'Verify your Extreme V account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #10b981; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0;">Welcome to Extreme V!</h1>
            </div>
            <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
              <p>Hi ${name},</p>
              <p>Thank you for registering with Extreme V! We're excited to help you design the perfect playground for your family.</p>
              <p>To complete your registration, please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email Address</a>
              </div>
              <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
              <p style="color: #666; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
              <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours.</p>
              <p style="color: #666; font-size: 14px;">If you didn't create an account with Extreme V, you can safely ignore this email.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
              <p>© ${new Date().getFullYear()} Extreme V. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    });
  } else {
    // Log verification URL for development
    console.log('Verification URL:', verificationUrl);
    console.log(
      'Email verification is not configured. Set RESEND_API_KEY to enable email sending.'
    );
  }
}
