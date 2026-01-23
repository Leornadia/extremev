import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

let prismaInstance: PrismaClient | null = null;

// Only initialize Prisma if DATABASE_URL is configured
// This prevents build hangs when no database is available
if (process.env.DATABASE_URL) {
  try {
    prismaInstance = globalForPrisma.prisma ||
      new PrismaClient({
        log:
          process.env.NODE_ENV === 'development'
            ? ['error']
            : ['error'],
      });

    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (error) {
    console.warn('Prisma client initialization failed:', error);
    prismaInstance = null;
  }
} else {
  console.warn('DATABASE_URL not configured - using mock data');
}

export const prisma = prismaInstance as PrismaClient;

export default prisma;
