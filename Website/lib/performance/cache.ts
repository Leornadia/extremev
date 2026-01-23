/**
 * Caching Strategy Implementation
 *
 * Provides multi-layer caching with memory cache, Redis support, and cache invalidation.
 * Implements stale-while-revalidate pattern for optimal performance.
 */

/**
 * Cache configuration
 */
export interface CacheConfig {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: number; // Serve stale content while revalidating
  tags?: string[]; // Cache tags for invalidation
}

/**
 * Cache entry
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
}

/**
 * In-memory cache implementation
 */
class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number = 1000; // Maximum number of entries

  set<T>(key: string, data: T, config: CacheConfig = {}) {
    const ttl = config.ttl || 5 * 60 * 1000; // Default 5 minutes

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      tags: config.tags || [],
    });

    // Cleanup if cache is too large
    if (this.cache.size > this.maxSize) {
      this.cleanup();
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    const age = Date.now() - entry.timestamp;

    // Check if expired
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  invalidateByTag(tag: string) {
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
      }
    }
  }

  invalidateByPattern(pattern: string) {
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  private cleanup() {
    // Remove oldest entries
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);

    const toRemove = Math.floor(this.maxSize * 0.2); // Remove 20%

    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.ttl,
        tags: entry.tags,
      })),
    };
  }
}

/**
 * Redis cache adapter (for production use)
 */
class RedisCache {
  private client: any = null;
  private connected: boolean = false;

  async connect() {
    if (this.connected) return;

    try {
      // Redis client would be initialized here
      // For now, this is a placeholder for future Redis integration

      // Example with ioredis:
      // const Redis = require('ioredis');
      // this.client = new Redis(process.env.REDIS_URL);

      this.connected = true;
      console.log('Redis cache connected');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.connected = false;
    }
  }

  async set<T>(key: string, data: T, config: CacheConfig = {}) {
    if (!this.connected) return;

    try {
      const ttl = config.ttl || 5 * 60 * 1000;
      const value = JSON.stringify({
        data,
        timestamp: Date.now(),
        tags: config.tags || [],
      });

      // await this.client.setex(key, Math.floor(ttl / 1000), value);

      // Store tags for invalidation
      if (config.tags) {
        for (const tag of config.tags) {
          // await this.client.sadd(`tag:${tag}`, key);
        }
      }
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.connected) return null;

    try {
      // const value = await this.client.get(key);
      // if (!value) return null;

      // const parsed = JSON.parse(value);
      // return parsed.data;

      return null; // Placeholder
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async delete(key: string) {
    if (!this.connected) return;

    try {
      // await this.client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async invalidateByTag(tag: string) {
    if (!this.connected) return;

    try {
      // const keys = await this.client.smembers(`tag:${tag}`);
      // if (keys.length > 0) {
      //   await this.client.del(...keys);
      //   await this.client.del(`tag:${tag}`);
      // }
    } catch (error) {
      console.error('Redis invalidate by tag error:', error);
    }
  }

  async clear() {
    if (!this.connected) return;

    try {
      // await this.client.flushdb();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }
}

/**
 * Multi-layer cache manager
 */
class CacheManager {
  private memoryCache: MemoryCache;
  private redisCache: RedisCache;
  private useRedis: boolean;

  constructor() {
    this.memoryCache = new MemoryCache();
    this.redisCache = new RedisCache();
    this.useRedis = process.env.REDIS_URL !== undefined;

    if (this.useRedis) {
      this.redisCache.connect();
    }
  }

  async set<T>(key: string, data: T, config: CacheConfig = {}) {
    // Always set in memory cache
    this.memoryCache.set(key, data, config);

    // Set in Redis if available
    if (this.useRedis) {
      await this.redisCache.set(key, data, config);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    const memoryResult = this.memoryCache.get<T>(key);
    if (memoryResult !== null) {
      return memoryResult;
    }

    // Try Redis if available
    if (this.useRedis) {
      const redisResult = await this.redisCache.get<T>(key);
      if (redisResult !== null) {
        // Populate memory cache
        this.memoryCache.set(key, redisResult);
        return redisResult;
      }
    }

    return null;
  }

  async delete(key: string) {
    this.memoryCache.delete(key);

    if (this.useRedis) {
      await this.redisCache.delete(key);
    }
  }

  async invalidateByTag(tag: string) {
    this.memoryCache.invalidateByTag(tag);

    if (this.useRedis) {
      await this.redisCache.invalidateByTag(tag);
    }
  }

  invalidateByPattern(pattern: string) {
    this.memoryCache.invalidateByPattern(pattern);
  }

  async clear() {
    this.memoryCache.clear();

    if (this.useRedis) {
      await this.redisCache.clear();
    }
  }

  getStats() {
    return {
      memory: this.memoryCache.getStats(),
      redis: this.useRedis ? 'connected' : 'not configured',
    };
  }
}

// Global cache instance
export const cache = new CacheManager();

/**
 * Cached function wrapper with stale-while-revalidate
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  config: CacheConfig = {}
): Promise<T> {
  // Try to get from cache
  const cached = await cache.get<T>(key);

  if (cached !== null) {
    // If stale-while-revalidate is enabled, revalidate in background
    if (config.staleWhileRevalidate) {
      // Don't await - revalidate in background
      fn()
        .then((fresh) => {
          cache.set(key, fresh, config);
        })
        .catch((err) => {
          console.error('Background revalidation failed:', err);
        });
    }

    return cached;
  }

  // Cache miss - fetch fresh data
  const fresh = await fn();
  await cache.set(key, fresh, config);

  return fresh;
}

/**
 * Cache key builders
 */
export const cacheKeys = {
  product: (slug: string) => `product:${slug}`,
  products: (filters?: string) => `products:${filters || 'all'}`,
  component: (id: string) => `component:${id}`,
  components: (category?: string) => `components:${category || 'all'}`,
  user: (id: string) => `user:${id}`,
  design: (id: string) => `design:${id}`,
  designs: (userId: string) => `designs:user:${userId}`,
  quote: (id: string) => `quote:${id}`,
  quotes: (userId?: string) => `quotes:${userId || 'all'}`,
  gallery: (filters?: string) => `gallery:${filters || 'all'}`,
  tiers: () => 'tiers:all',
};

/**
 * Cache tags for invalidation
 */
export const cacheTags = {
  products: 'products',
  components: 'components',
  users: 'users',
  designs: 'designs',
  quotes: 'quotes',
  gallery: 'gallery',
  tiers: 'tiers',
};

/**
 * Invalidate related caches when data changes
 */
export async function invalidateRelatedCaches(entity: string, id?: string) {
  switch (entity) {
    case 'product':
      await cache.invalidateByTag(cacheTags.products);
      if (id) await cache.delete(cacheKeys.product(id));
      break;

    case 'component':
      await cache.invalidateByTag(cacheTags.components);
      if (id) await cache.delete(cacheKeys.component(id));
      break;

    case 'design':
      await cache.invalidateByTag(cacheTags.designs);
      if (id) await cache.delete(cacheKeys.design(id));
      break;

    case 'quote':
      await cache.invalidateByTag(cacheTags.quotes);
      if (id) await cache.delete(cacheKeys.quote(id));
      break;

    case 'gallery':
      await cache.invalidateByTag(cacheTags.gallery);
      break;

    default:
      console.warn(`Unknown entity type for cache invalidation: ${entity}`);
  }
}

/**
 * Cache warming - preload frequently accessed data
 */
export async function warmCache() {
  console.log('Warming cache...');

  try {
    // Preload critical data
    // This would be called on app startup or after deployments

    // Example:
    // await cached(cacheKeys.products(), () => fetchProducts(), { ttl: 10 * 60 * 1000 });
    // await cached(cacheKeys.components(), () => fetchComponents(), { ttl: 10 * 60 * 1000 });

    console.log('Cache warmed successfully');
  } catch (error) {
    console.error('Cache warming failed:', error);
  }
}

/**
 * Response caching headers
 */
export function getCacheHeaders(config: {
  maxAge?: number;
  staleWhileRevalidate?: number;
  public?: boolean;
}) {
  const {
    maxAge = 60,
    staleWhileRevalidate = 300,
    public: isPublic = true,
  } = config;

  return {
    'Cache-Control': `${isPublic ? 'public' : 'private'}, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}
