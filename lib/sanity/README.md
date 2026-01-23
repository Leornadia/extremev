# Sanity CMS Integration

This directory contains the Sanity CMS integration for the Extreme V website. Sanity is used to manage dynamic content including homepage sections, product tiers, gallery items, and testimonials.

## Setup Instructions

### 1. Create a Sanity Project

1. Go to [sanity.io](https://www.sanity.io/) and sign up or log in
2. Create a new project
3. Choose a project name (e.g., "Extreme V Website")
4. Select a dataset name (default: "production")
5. Note your Project ID from the project settings

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-api-token"
```

To get an API token:

1. Go to your Sanity project settings
2. Navigate to "API" → "Tokens"
3. Create a new token with "Editor" permissions
4. Copy the token to your environment variables

### 3. Install Sanity Studio (Optional)

For a local content management interface, you can set up Sanity Studio:

```bash
npm install -g @sanity/cli
sanity init
```

Follow the prompts to connect to your existing project.

## File Structure

- `config.ts` - Sanity configuration and environment variables
- `client.ts` - Sanity client instances and image URL builder
- `schemas/` - Content type schemas (homepage, product tiers, gallery, testimonials)
- `queries.ts` - GROQ queries for fetching content
- `types.ts` - TypeScript types for Sanity documents

## Usage

### Fetching Content

```typescript
import { sanityClient } from '@/lib/sanity/client';
import { homepageQuery } from '@/lib/sanity/queries';

// Fetch homepage content
const homepage = await sanityClient.fetch(homepageQuery);
```

### Optimizing Images

```typescript
import { urlFor } from '@/lib/sanity/client';

// Generate optimized image URL
const imageUrl = urlFor(image)
  .width(800)
  .height(600)
  .format('webp')
  .quality(80)
  .url();
```

## Content Types

The following content types are defined:

1. **Homepage** - Hero section, process flow, value propositions
2. **Product Tier** - Tier information, features, pricing ranges
3. **Gallery Item** - Project photos with metadata
4. **Testimonial** - Customer reviews and quotes

See `schemas/` directory for detailed schema definitions.

## API Version

We use a dated API version (`2024-10-30`) to ensure consistent behavior. This can be updated as needed when Sanity releases new API features.

## CDN Usage

- **Production**: Uses Sanity's CDN for fast, cached reads
- **Development**: Direct API calls for immediate content updates
- **Write Operations**: Always bypass CDN for immediate consistency

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Image URLs](https://www.sanity.io/docs/image-url)
