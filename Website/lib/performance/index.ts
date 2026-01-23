/**
 * Performance Optimization Utilities
 *
 * Central export for all performance-related utilities including:
 * - Code splitting and lazy loading (client-side only)
 * - Route prefetching (client-side only)
 * - Service worker management (client-side only)
 * - Database query optimization (server-side)
 * - Caching strategies (server-side)
 *
 * Note: Client-side utilities should only be imported in client components.
 * Server-side utilities (cache, db-optimization) can be used anywhere.
 */

// Client-side utilities (use only in 'use client' components)
// Import these directly from their files to avoid server/client boundary issues
// export * from './code-splitting.tsx';
// export * from './prefetch';
// export * from './service-worker';

// Database optimization
export {
  createOptimizedPrismaClient,
  QueryMonitor,
  queryMonitor,
  measureQuery,
  batchQueries,
  getPaginationParams,
  getCursorPaginationParams,
  selectFields,
  commonFilters,
  optimizeIncludes,
  queryCache,
  cachedQuery,
  checkDatabaseHealth,
  getDatabaseStats,
} from './db-optimization';

// Caching
export {
  cache,
  cached,
  cacheKeys,
  cacheTags,
  invalidateRelatedCaches,
  warmCache,
  getCacheHeaders,
} from './cache';

export type { CacheConfig } from './cache';
export type {
  PaginationOptions,
  CursorPaginationOptions,
} from './db-optimization';
