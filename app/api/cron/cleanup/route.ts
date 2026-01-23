export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Cron Job: Database Cleanup
 *
 * Runs daily at 2:00 AM to clean up old data
 * - Deletes expired password reset tokens
 * - Removes old unverified user accounts
 * - Archives old quote requests
 *
 * Triggered by Vercel Cron (configured in vercel.json)
 */
export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const startTime = Date.now();
    const results = {
      deletedTokens: 0,
      deletedUnverifiedUsers: 0,
      archivedQuotes: 0,
    };

    // Delete expired password reset tokens (older than 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Note: This assumes you have a PasswordResetToken model
    // Adjust based on your actual schema
    try {
      const deletedTokens = await prisma.$executeRaw`
        DELETE FROM "PasswordResetToken"
        WHERE "expiresAt" < ${twentyFourHoursAgo}
      `;
      results.deletedTokens = Number(deletedTokens);
    } catch {
      console.log('No PasswordResetToken table found, skipping token cleanup');
    }

    // Delete unverified user accounts older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
      const deletedUsers = await prisma.user.deleteMany({
        where: {
          emailVerified: null,
          createdAt: {
            lt: sevenDaysAgo,
          },
        },
      });
      results.deletedUnverifiedUsers = deletedUsers.count;
    } catch (error) {
      console.log('Error deleting unverified users:', error);
    }

    // Archive old quote requests (older than 90 days and in 'pending' status)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    try {
      const archivedQuotes = await prisma.quoteRequest.updateMany({
        where: {
          status: 'pending',
          createdAt: {
            lt: ninetyDaysAgo,
          },
        },
        data: {
          status: 'archived',
        },
      });
      results.archivedQuotes = archivedQuotes.count;
    } catch (error) {
      console.log('Error archiving quotes:', error);
    }

    const duration = Date.now() - startTime;

    console.log('Cleanup completed:', results);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      results,
    });
  } catch (error) {
    console.error('Cleanup job failed:', error);

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
