export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Health Check Endpoint
 *
 * Used by monitoring services to verify application health
 * Checks database connectivity and returns service status
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: 'up',
        api: 'up',
      },
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;

    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        services: {
          database: 'down',
          api: 'up',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
        version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
        environment: process.env.NODE_ENV || 'development',
      },
      { status: 503 }
    );
  }
}
