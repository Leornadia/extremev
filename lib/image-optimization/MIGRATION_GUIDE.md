# Image Optimization Migration Guide

This guide helps you migrate existing image handling code to use the new image optimization pipeline.

## Overview

The new image optimization pipeline provides:
- Automatic WebP and AVIF conversion
- Responsive image generation
- Smart compression
- Thumbnail generation
- Type-safe APIs

## Migration Steps

### 1. Update Image Uploads

#### Before (Old Upload Code)

```typescript
// Old way - direct file upload
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/admin/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
// Returns: { url: '/Images/image.jpg' }
```

#### After (New Optimized Upload)

```typescript
// New way - optimized upload with formats
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'image');
formData.append('imageType', 'product'); // Specify image type for optimal settings

const response = await fetch('/api/admin/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
// Returns: {
//   url: '/Images/optimized/image.jpg',
//   webp: '/Images/optimized/image.webp',
//   avif: '/Images/optimized/image.avif',
//   thumbnail: '/Images/thumbnails/image-thumb.webp',
//   responsive: { small, medium, large }
// }
```

### 2. Update Image Components

#### Before (Standard Next.js Image)

```tsx
import Image from 'next/image';

<Image
  src="/Images/product.jpg"
  alt="Product"
  width={1200}
  height={800}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

#### After (OptimizedImage Component)

```tsx
import { OptimizedImage } from '@/components/ui';

<OptimizedImage
  src="/Images/optimized/product.jpg"
  alt="Product"
  width={1200}
  height={800}
  sizePreset="productCard" // Automatic responsive sizing
  quality={85}
/>
```

### 3. Update Database Schema

If you store image URLs in the database, update your schema to store multiple formats:

#### Before

```prisma
model Product {
  id    String @id
  image String // Single image URL
}
```

#### After

```prisma
model Product {
  id        String  @id
  image     String  // Original/fallback URL
  imageWebp String? // WebP version
  imageAvif String? // AVIF version
  thumbnail String? // Thumbnail URL
}
```

### 4. Update Image Queries

#### Before

```typescript
const product = await prisma.product.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    image: true,
  },
});
```

#### After

```typescript
const product = await prisma.product.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    image: true,
    imageWebp: true,
    imageAvif: true,
    thumbnail: true,
  },
});
```

### 5. Update Frontend Display

#### Before

```tsx
<img src={product.image} alt={product.name} />
```

#### After (with Picture element)

```tsx
import { Picture } from '@/components/ui';

<Picture
  src={product.image}
  webpSrc={product.imageWebp}
  avifSrc={product.imageAvif}
  alt={product.name}
  width={1200}
  height={800}
/>
```

### 6. Update Admin Components

Update the FileUpload component to handle optimized responses:

#### Before

```typescript
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  setImageUrl(data.data.url);
};
```

#### After

```typescript
const handleUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'image');
  formData.append('imageType', 'product');
  
  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });
  
  const data = await response.json();
  
  // Store all format URLs
  setImageUrl(data.data.url);
  setImageWebp(data.data.webp);
  setImageAvif(data.data.avif);
  setThumbnail(data.data.thumbnail);
};
```

## Batch Migration Script

For migrating existing images, create a script:

```typescript
// scripts/migrate-images.ts
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { processImage } from '@/lib/image-optimization';

async function migrateImages() {
  const imagesDir = join(process.cwd(), 'public', 'Images');
  const files = await readdir(imagesDir);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      console.log(`Processing ${file}...`);
      
      const buffer = await readFile(join(imagesDir, file));
      
      await processImage(buffer, file, {
        quality: 85,
        generateResponsive: true,
        generateFormats: true,
      });
      
      console.log(`✓ ${file} optimized`);
    }
  }
  
  console.log('Migration complete!');
}

migrateImages();
```

Run with:
```bash
npx ts-node scripts/migrate-images.ts
```

## Component Updates

### Gallery Component

#### Before

```tsx
<div className="grid grid-cols-3 gap-4">
  {images.map((image) => (
    <img key={image.id} src={image.url} alt={image.title} />
  ))}
</div>
```

#### After

```tsx
import { OptimizedImage } from '@/components/ui';

<div className="grid grid-cols-3 gap-4">
  {images.map((image) => (
    <OptimizedImage
      key={image.id}
      src={image.url}
      alt={image.title}
      width={400}
      height={300}
      sizePreset="gallery"
    />
  ))}
</div>
```

### Hero Section

#### Before

```tsx
<div className="hero">
  <img src="/Images/hero.jpg" alt="Hero" />
</div>
```

#### After

```tsx
import { OptimizedImage } from '@/components/ui';

<div className="hero">
  <OptimizedImage
    src="/Images/optimized/hero.jpg"
    alt="Hero"
    width={1920}
    height={1080}
    sizePreset="hero"
    priority={true}
    quality={90}
  />
</div>
```

### Product Cards

#### Before

```tsx
<div className="product-card">
  <img src={product.image} alt={product.name} />
  <h3>{product.name}</h3>
</div>
```

#### After

```tsx
import { OptimizedImage } from '@/components/ui';

<div className="product-card">
  <OptimizedImage
    src={product.image}
    alt={product.name}
    width={400}
    height={300}
    sizePreset="productCard"
  />
  <h3>{product.name}</h3>
</div>
```

## Testing Checklist

After migration, verify:

- [ ] All images load correctly
- [ ] WebP/AVIF formats are served to supporting browsers
- [ ] Responsive images load appropriate sizes
- [ ] Thumbnails display correctly
- [ ] Upload functionality works in admin panel
- [ ] Image quality is acceptable
- [ ] Page load times have improved
- [ ] No broken image links
- [ ] Alt text is preserved
- [ ] Lazy loading works correctly

## Performance Verification

Check improvements using:

1. **Lighthouse**: Run audit before and after
2. **Network Tab**: Compare file sizes
3. **PageSpeed Insights**: Check Core Web Vitals

Expected improvements:
- 50-80% reduction in image file sizes
- Faster LCP (Largest Contentful Paint)
- Better overall performance score

## Rollback Plan

If issues occur:

1. Keep original images in `/Images` directory
2. New optimized images are in `/Images/optimized`
3. To rollback, update image URLs to point to originals
4. Database changes can be rolled back via migration

## Common Issues

### Issue: Images not displaying

**Solution**: Check that the `public/Images/optimized` directory exists and has correct permissions.

```bash
mkdir -p public/Images/optimized
chmod 755 public/Images/optimized
```

### Issue: WebP/AVIF not working

**Solution**: Verify Next.js config includes formats:

```javascript
// next.config.mjs
images: {
  formats: ['image/avif', 'image/webp'],
}
```

### Issue: Upload fails

**Solution**: Check Sharp installation:

```bash
npm list sharp
# If not found:
npm install sharp --legacy-peer-deps
```

### Issue: Large file sizes

**Solution**: Adjust quality settings:

```typescript
// Lower quality for non-critical images
const options = {
  quality: 75, // Instead of 85
  generateResponsive: true,
  generateFormats: true,
};
```

## Support

For issues or questions:
1. Check the main README.md
2. Review error logs in server console
3. Verify Sharp installation and version
4. Check file permissions on upload directories
