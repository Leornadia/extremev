# Database Layer Documentation

This directory contains database utilities and query functions for the Extreme V website.

## Files

- `queries.ts` - Common database queries and utility functions
- `../prisma.ts` - Prisma client singleton instance
- `../types/database.ts` - TypeScript types for database models

## Usage

### Importing the Prisma Client

```typescript
import prisma from '@/lib/prisma';

// Use in API routes or server components
const products = await prisma.product.findMany();
```

### Using Query Utilities

```typescript
import { getProducts, getProductBySlug } from '@/lib/db/queries';

// Get all published products
const products = await getProducts();

// Get a specific product
const product = await getProductBySlug('backyard-explorer');

// Get products by tier
const premiumProducts = await getProductsByTier(tierId);
```

## Available Query Functions

### Product Tiers

- `getProductTiers(where?)` - Get all product tiers
- `getProductTierBySlug(slug)` - Get tier by slug with products

### Products

- `getProducts(where?)` - Get all products
- `getProductBySlug(slug)` - Get product by slug
- `getProductsByTier(tierId)` - Get products in a tier
- `searchProducts(searchTerm)` - Search products by name/description

### Components

- `getComponents(where?)` - Get all components
- `getComponentsByCategory(category)` - Get components by category
- `getComponentById(id)` - Get component by ID
- `getComponentCategories()` - Get list of all categories

### Users

- `getUserByEmail(email)` - Get user by email
- `getUserWithDesigns(userId)` - Get user with saved designs

### Saved Designs

- `getSavedDesignsByUser(userId)` - Get user's saved designs
- `getSavedDesignById(id, userId)` - Get specific design

### Quote Requests

- `getQuoteRequestsByUser(userId)` - Get user's quote requests
- `getQuoteRequestById(id)` - Get quote request by ID
- `getPendingQuoteRequests()` - Get all pending quotes (admin)

### Statistics

- `getDatabaseStats()` - Get database statistics (admin)

## Example API Route

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { getProducts } from '@/lib/db/queries';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

## Example Server Component

```typescript
// app/products/page.tsx
import { getProducts } from '@/lib/db/queries';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.shortDescription}</p>
        </div>
      ))}
    </div>
  );
}
```

## Best Practices

1. **Use query utilities** - Prefer using functions from `queries.ts` over direct Prisma calls
2. **Error handling** - Always wrap database calls in try-catch blocks
3. **Type safety** - Import types from `@/lib/types/database`
4. **Connection management** - Use the singleton instance from `lib/prisma.ts`
5. **Server-side only** - Never import Prisma client in client components
6. **Caching** - Consider using Next.js caching for frequently accessed data

## Adding New Queries

When adding new query functions:

1. Add the function to `queries.ts`
2. Include proper TypeScript types
3. Add error handling
4. Document the function with JSDoc comments
5. Update this README

Example:

```typescript
/**
 * Get featured products for homepage
 * @returns Array of featured products with tier information
 */
export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { published: true, featured: true },
    include: { tier: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });
}
```

## Performance Tips

1. **Use select** to fetch only needed fields
2. **Use include** carefully to avoid over-fetching
3. **Add indexes** to frequently queried fields (already configured in schema)
4. **Use pagination** for large result sets
5. **Enable connection pooling** in production
6. **Monitor slow queries** with Prisma logging

## Troubleshooting

### "PrismaClient is unable to run in the browser"

- Ensure you're only importing Prisma in server components or API routes
- Check that client components don't import database utilities

### "Invalid `prisma.model.findMany()` invocation"

- Verify your schema is up to date: `npm run db:generate`
- Check that migrations are applied: `npm run db:migrate`

### Connection pool exhausted

- Enable connection pooling in production
- Use the singleton pattern (already implemented in `lib/prisma.ts`)
- Consider using PgBouncer for serverless deployments
