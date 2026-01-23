# SEO Implementation Guide

This directory contains all SEO-related utilities and configurations for the Extreme V website.

## Overview

The SEO implementation includes:
- Dynamic metadata generation for all pages
- Structured data (JSON-LD) for rich search results
- Automatic sitemap generation
- Robots.txt configuration
- Open Graph and Twitter Card tags
- Breadcrumb navigation with structured data

## Files

### `metadata.ts`
Provides utilities for generating Next.js metadata objects with SEO best practices:
- Title optimization
- Meta descriptions
- Keywords
- Open Graph tags
- Twitter Cards
- Canonical URLs
- Robots directives

### `structured-data.ts`
Generates JSON-LD structured data for:
- Organization schema
- Website schema
- Product schema
- Breadcrumb schema
- LocalBusiness schema

### `index.ts`
Exports all SEO utilities for easy importing.

## Usage

### Adding Metadata to a Page

```typescript
import { generateMetadata } from '@/lib/seo';

export const metadata = generateMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  keywords: ['keyword1', 'keyword2'],
  canonical: '/your-page-url',
  ogImage: '/images/og-image.jpg',
  ogType: 'website', // or 'article', 'product'
});
```

### Adding Structured Data

```typescript
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data';

export default function YourPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Your Page', url: '/your-page' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {/* Your page content */}
    </>
  );
}
```

### Product Pages

Product pages automatically include:
- Product schema with pricing and availability
- Breadcrumb navigation
- Rich snippets for search results

```typescript
import { generateProductSchema } from '@/lib/seo/structured-data';

const productSchema = generateProductSchema(product, product.images);
```

## Sitemap

The sitemap is automatically generated at `/sitemap.xml` and includes:
- All static pages
- Dynamic product pages from the database
- Last modified dates
- Change frequencies
- Priority values

The sitemap updates automatically when products are added or modified.

## Robots.txt

The robots.txt file is generated at `/robots.txt` and:
- Allows all search engines to crawl public pages
- Blocks admin, API, and private routes
- Blocks AI crawlers (GPTBot, ChatGPT-User)
- References the sitemap

## Environment Variables

Required environment variables for SEO:

```env
NEXT_PUBLIC_SITE_URL="https://www.extremev.co.za"
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="your-verification-code"
```

## Best Practices

### Title Tags
- Keep titles under 60 characters
- Include primary keyword
- Make titles unique for each page
- Include brand name (automatically appended)

### Meta Descriptions
- Keep descriptions between 150-160 characters
- Include call-to-action
- Make descriptions unique and compelling
- Include target keywords naturally

### Keywords
- Focus on 3-5 primary keywords per page
- Use long-tail keywords for specific pages
- Include location-based keywords (e.g., "South Africa")
- Avoid keyword stuffing

### Images
- Always include alt text
- Use descriptive filenames
- Optimize image sizes
- Use next/image for automatic optimization

### Structured Data
- Include Organization schema on all pages (via root layout)
- Add Product schema to product pages
- Use Breadcrumb schema for navigation
- Include LocalBusiness schema on homepage and contact page

## Testing

### Google Search Console
1. Verify site ownership using NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
2. Submit sitemap: https://www.extremev.co.za/sitemap.xml
3. Monitor indexing status and errors

### Rich Results Test
Test structured data: https://search.google.com/test/rich-results

### PageSpeed Insights
Test performance: https://pagespeed.web.dev/

### Lighthouse
Run Lighthouse audits in Chrome DevTools:
- Performance
- Accessibility
- Best Practices
- SEO

## Monitoring

Regular SEO monitoring should include:
- Search Console performance reports
- Organic traffic in Google Analytics
- Keyword rankings
- Core Web Vitals
- Crawl errors
- Index coverage

## Future Enhancements

Potential SEO improvements:
- Multi-language support (hreflang tags)
- FAQ schema for common questions
- Review schema for customer testimonials
- Video schema for product videos
- Article schema for blog posts (if added)
- AMP pages for mobile (if needed)

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
