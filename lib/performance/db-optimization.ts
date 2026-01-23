/**
 * Database Query Optimization Utilities
 *
 * Provides utilities for optimizing database queries, including connection pooling,
 * query batching, and performance monitoring.
 */

import { PrismaClient } from '@prisma/client';

/**
 * Optimized Prisma client with connection pooling
 */
export function createOptimizedPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
}

/**
 * Query performance monitoring
 */
export class QueryMonitor {
  private queries: Map<
    string,
    { count: number; totalTime: number; avgTime: number }
  > = new Map();

  track(queryName: string, duration: number) {
    const existing = this.queries.get(queryName) || {
      count: 0,
      totalTime: 0,
      avgTime: 0,
    };

    existing.count++;
    existing.totalTime += duration;
    existing.avgTime = existing.totalTime / existing.count;

    this.queries.set(queryName, existing);
  }

  getStats() {
    return Array.from(this.queries.entries()).map(([name, stats]) => ({
      query: name,
      ...stats,
    }));
  }

  getSlowestQueries(limit = 10) {
    return this.getStats()
      .sort((a, b) => b.avgTime - a.avgTime)
      .slice(0, limit);
  }

  reset() {
    this.queries.clear();
  }
}

export const queryMonitor = new QueryMonitor();

/**
 * Measure query execution time
 */
export async function measureQuery<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const start = performance.now();

  try {
    const result = await queryFn();
    const duration = performance.now() - start;

    queryMonitor.track(queryName, duration);

    if (duration > 1000) {
      console.warn(
        `Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`
      );
    }

    return result;
  } catch (error) {
    const duration = performance.now() - start;
    queryMonitor.track(`${queryName} (error)`, duration);
    throw error;
  }
}

/**
 * Batch multiple queries together
 */
export async function batchQueries<
  T extends Record<string, () => Promise<any>>,
>(queries: T): Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }> {
  const entries = Object.entries(queries);
  const results = await Promise.all(
    entries.map(([key, queryFn]) =>
      measureQuery(key, queryFn as () => Promise<any>)
    )
  );

  return Object.fromEntries(
    entries.map(([key], index) => [key, results[index]])
  ) as any;
}

/**
 * Optimized pagination helper
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

export function getPaginationParams(options: PaginationOptions) {
  const { page, pageSize, orderBy } = options;

  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy,
  };
}

/**
 * Cursor-based pagination (more efficient for large datasets)
 */
export interface CursorPaginationOptions<T> {
  cursor?: T;
  take: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

export function getCursorPaginationParams<T>(
  options: CursorPaginationOptions<T>
) {
  const { cursor, take, orderBy } = options;

  return {
    ...(cursor ? { cursor, skip: 1 } : {}),
    take,
    orderBy,
  };
}

/**
 * Select only needed fields to reduce data transfer
 */
export const selectFields = {
  user: {
    minimal: {
      id: true,
      name: true,
      email: true,
    },
    withDates: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  product: {
    card: {
      id: true,
      name: true,
      slug: true,
      thumbnail: true,
      shortDescription: true,
      basePrice: true,
      tier: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
    detail: {
      id: true,
      name: true,
      slug: true,
      images: true,
      thumbnail: true,
      shortDescription: true,
      longDescription: true,
      basePrice: true,
      dimensions: true,
      ageRange: true,
      capacity: true,
      features: true,
      tier: true,
    },
  },
  component: {
    library: {
      id: true,
      name: true,
      category: true,
      subcategory: true,
      price: true,
      thumbnail: true,
      dimensions: true,
      metadata: true,
    },
    full: {
      id: true,
      name: true,
      category: true,
      subcategory: true,
      price: true,
      thumbnail: true,
      model3D: true,
      dimensions: true,
      weight: true,
      connectionPoints: true,
      compatibilityRules: true,
      metadata: true,
    },
  },
  savedDesign: {
    list: {
      id: true,
      name: true,
      thumbnail: true,
      createdAt: true,
      updatedAt: true,
    },
    full: {
      id: true,
      name: true,
      thumbnail: true,
      designData: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

/**
 * Common query filters
 */
export const commonFilters = {
  published: { published: true },
  notDeleted: { deletedAt: null },
  active: { published: true, deletedAt: null },
};

/**
 * Optimize includes to prevent N+1 queries
 */
export function optimizeIncludes<T extends Record<string, any>>(include: T): T {
  // Add select statements to includes to limit data
  return Object.entries(include).reduce((acc, [key, value]) => {
    if (typeof value === 'object' && value !== null) {
      acc[key] = {
        ...value,
        // Add default select if not specified
        select: value.select || undefined,
      };
    } else {
      acc[key] = value;
    }
    return acc;
  }, {} as T);
}

/**
 * Cache query results in memory (simple implementation)
 */
class QueryCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private ttl: number = 5 * 60 * 1000; // 5 minutes default

  set(key: string, data: any, ttl?: number) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Auto-cleanup after TTL
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl || this.ttl);
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  invalidate(pattern: string) {
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

export const queryCache = new QueryCache();

/**
 * Cached query wrapper
 */
export async function cachedQuery<T>(
  cacheKey: string,
  queryFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = queryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Execute query
  const result = await queryFn();

  // Cache result
  queryCache.set(cacheKey, result, ttl);

  return result;
}

/**
 * Database connection health check
 */
export async function checkDatabaseHealth(
  prisma: PrismaClient
): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

/**
 * Get database statistics
 */
export async function getDatabaseStats(prisma: PrismaClient) {
  try {
    const [userCount, productCount, componentCount, designCount, quoteCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.component.count(),
        prisma.savedDesign.count(),
        prisma.quoteRequest.count(),
      ]);

    return {
      users: userCount,
      products: productCount,
      components: componentCount,
      designs: designCount,
      quotes: quoteCount,
    };
  } catch (error) {
    console.error('Failed to get database stats:', error);
    return null;
  }
}
