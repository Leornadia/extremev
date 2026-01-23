# Sanity CMS Usage Examples

This document provides practical examples of how to use the Sanity CMS integration in your Next.js application.

## Basic Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="abc123xyz"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="sk..."
SANITY_WEBHOOK_SECRET="your-secret-token"
```

### 2. Verify Connection

Test your connection by running:

```typescript
import { sanityClient } from '@/lib/sanity';

const test = await sanityClient.fetch('*[_type == "homepage"][0]');
console.log(test);
```

## Fetching Content in Server Components

### Homepage Content

```typescript
// app/page.tsx
import { getHomepage, urlFor } from '@/lib/sanity';

export default async function HomePage() {
  const homepage = await getHomepage();

  if (!homepage) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Hero Section */}
      <section>
        <h1>{homepage.hero.headline}</h1>
        <p>{homepage.hero.subheadline}</p>
        <img
          src={urlFor(homepage.hero.backgroundImage).width(1920).url()}
          alt={homepage.hero.backgroundImage.alt}
        />
      </section>

      {/* Process Flow */}
      <section>
        <h2>{homepage.processFlow.sectionTitle}</h2>
        {homepage.processFlow.steps.map((step) => (
          <div key={step.stepNumber}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            <img
              src={urlFor(step.illustration).width(400).url()}
              alt={step.illustration.alt}
            />
          </div>
        ))}
      </section>

      {/* Value Propositions */}
      {homepage.valuePropositions.map((vp, index) => (
        <section key={index}>
          <h2>{vp.title}</h2>
          <p>{vp.description}</p>
          <ul>
            {vp.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
          <img
            src={urlFor(vp.image).width(800).url()}
            alt={vp.image.alt}
          />
        </section>
      ))}
    </div>
  );
}
```

### Product Tiers

```typescript
// app/tiers/page.tsx
import { getProductTiers, urlFor } from '@/lib/sanity';

export default async function TiersPage() {
  const tiers = await getProductTiers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tiers.map((tier) => (
        <div key={tier._id} className="border rounded-lg p-6">
          <img
            src={urlFor(tier.image).width(400).height(300).url()}
            alt={tier.image.alt}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="text-2xl font-bold mt-4">{tier.name}</h2>
          {tier.badge && (
            <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded text-sm">
              {tier.badge}
            </span>
          )}
          <p className="text-gray-600 mt-2">{tier.description}</p>
          <div className="mt-4">
            <p className="text-lg font-semibold">
              {tier.priceRange.currency} {tier.priceRange.min.toLocaleString()} -{' '}
              {tier.priceRange.max.toLocaleString()}
            </p>
          </div>
          <ul className="mt-4 space-y-2">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

### Gallery Items

```typescript
// app/gallery/page.tsx
import { getGalleryItems, urlFor } from '@/lib/sanity';

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item._id} className="group cursor-pointer">
          <img
            src={urlFor(item.thumbnail || item.image)
              .width(600)
              .height(400)
              .url()}
            alt={item.image.alt}
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="mt-2 font-semibold">{item.title}</h3>
          {item.location && (
            <p className="text-sm text-gray-600">
              {item.location.city}, {item.location.country}
            </p>
          )}
          <div className="flex gap-2 mt-2">
            {item.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs bg-gray-200 px-2 py-1 rounded"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Testimonials

```typescript
// app/page.tsx (testimonials section)
import { getFeaturedTestimonials, urlFor } from '@/lib/sanity';

export default async function HomePage() {
  const testimonials = await getFeaturedTestimonials(3);

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial._id} className="bg-white p-6 rounded-lg shadow">
            {testimonial.customerPhoto && (
              <img
                src={urlFor(testimonial.customerPhoto).width(80).height(80).url()}
                alt={testimonial.customerPhoto.alt}
                className="w-20 h-20 rounded-full mx-auto"
              />
            )}
            <div className="flex justify-center my-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-700 italic">"{testimonial.quote}"</p>
            <div className="mt-4 text-center">
              <p className="font-semibold">{testimonial.customerName}</p>
              {testimonial.customerTitle && (
                <p className="text-sm text-gray-600">{testimonial.customerTitle}</p>
              )}
              {testimonial.location && (
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Image Optimization

### Basic Image URL

```typescript
import { urlFor } from '@/lib/sanity';

const imageUrl = urlFor(image).url();
```

### Responsive Images

```typescript
const imageUrl = urlFor(image)
  .width(800)
  .height(600)
  .format('webp')
  .quality(80)
  .url();
```

### With Next.js Image Component

```typescript
import Image from 'next/image';
import { urlFor } from '@/lib/sanity';

<Image
  src={urlFor(image).width(800).height(600).url()}
  alt={image.alt || ''}
  width={800}
  height={600}
  className="rounded-lg"
/>
```

### Responsive Srcset

```typescript
const srcset = [400, 800, 1200]
  .map((width) => `${urlFor(image).width(width).url()} ${width}w`)
  .join(', ');

<img
  src={urlFor(image).width(800).url()}
  srcSet={srcset}
  sizes="(max-width: 768px) 100vw, 800px"
  alt={image.alt}
/>
```

## Filtering and Searching

### Filter Gallery by Category

```typescript
import { getFilteredGalleryItems } from '@/lib/sanity';

// Filter by category
const slideItems = await getFilteredGalleryItems('slides', null);

// Filter by tier
const premiumItems = await getFilteredGalleryItems(null, 'premium');

// Filter by both
const premiumSlides = await getFilteredGalleryItems('slides', 'premium');
```

### Get Testimonials by Tier

```typescript
import { getTestimonialsByTier } from '@/lib/sanity';

const premiumTestimonials = await getTestimonialsByTier('premium');
```

## Dynamic Routes

### Product Tier Detail Page

```typescript
// app/tiers/[slug]/page.tsx
import { getProductTierBySlug, getProductTiers } from '@/lib/sanity';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const tiers = await getProductTiers();
  return tiers.map((tier) => ({
    slug: tier.slug.current,
  }));
}

export default async function TierDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const tier = await getProductTierBySlug(params.slug);

  if (!tier) {
    notFound();
  }

  return (
    <div>
      <h1>{tier.name}</h1>
      <p>{tier.description}</p>
      {/* ... rest of the page */}
    </div>
  );
}
```

## Revalidation

### On-Demand Revalidation via Webhook

The webhook is automatically set up at `/api/sanity/revalidate`.

To configure in Sanity:

1. Go to your Sanity project settings
2. Navigate to API → Webhooks
3. Create a new webhook:
   - URL: `https://your-domain.com/api/sanity/revalidate`
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - HTTP method: POST
   - HTTP Headers: `Authorization: Bearer your-webhook-secret`
4. Select document types: homepage, productTier, galleryItem, testimonial

### Manual Revalidation

```typescript
import { revalidatePath } from 'next/cache';

// In an API route or server action
revalidatePath('/');
revalidatePath('/gallery');
revalidatePath('/tiers');
```

## Error Handling

### Graceful Fallbacks

```typescript
import { getHomepage } from '@/lib/sanity';

export default async function HomePage() {
  const homepage = await getHomepage();

  if (!homepage) {
    return (
      <div className="text-center py-16">
        <h1>Welcome to Extreme V</h1>
        <p>Content is being loaded...</p>
      </div>
    );
  }

  // Render homepage content
}
```

### Try-Catch for Custom Error Handling

```typescript
import { sanityClient } from '@/lib/sanity';

try {
  const data = await sanityClient.fetch(query);
  return data;
} catch (error) {
  console.error('Sanity fetch error:', error);
  // Return fallback data or show error UI
  return null;
}
```

## TypeScript Tips

### Type-Safe Queries

```typescript
import { sanityClient } from '@/lib/sanity';
import type { ProductTier } from '@/lib/sanity';

const tiers = await sanityClient.fetch<ProductTier[]>(
  '*[_type == "productTier"]'
);

// tiers is now typed as ProductTier[]
```

### Custom Query Types

```typescript
interface CustomQueryResult {
  name: string;
  count: number;
}

const result = await sanityClient.fetch<CustomQueryResult>(
  '*[_type == "productTier"] { "name": name, "count": count(*) }'
);
```

## Performance Tips

1. **Use ISR**: All fetch functions use ISR with 1-minute revalidation
2. **Optimize Images**: Always specify width/height and use WebP format
3. **Limit Queries**: Use `[0...10]` syntax to limit results
4. **Select Only Needed Fields**: Don't fetch entire documents if you only need specific fields
5. **Use CDN**: Production automatically uses Sanity's CDN for faster reads

## Troubleshooting

### Content Not Updating

1. Check if webhook is configured correctly
2. Verify `SANITY_WEBHOOK_SECRET` matches in both Sanity and your app
3. Check webhook logs in Sanity dashboard
4. Manually trigger revalidation: `revalidatePath('/')`

### Images Not Loading

1. Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
2. Check if image assets exist in Sanity
3. Ensure CORS is configured in Sanity project settings
4. Add Sanity CDN domain to Next.js `images.domains` config

### TypeScript Errors

1. Run `npm install` to ensure all types are installed
2. Check that `@sanity/client` and `@sanity/image-url` are installed
3. Verify import paths are correct
