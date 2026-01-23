# Image Optimization Pipeline

This module provides a comprehensive image optimization pipeline for the Extreme V website, handling automatic format conversion, compression, and responsive image generation.

## Features

- **Automatic Format Conversion**: Converts images to WebP and AVIF formats for optimal performance
- **Responsive Image Generation**: Creates multiple sizes (640px, 1024px, 1920px) for responsive loading
- **Smart Compression**: Applies optimal compression based on image type
- **Thumbnail Generation**: Automatically generates thumbnails for gallery and product images
- **Validation**: Validates image files before processing
- **Type Safety**: Full TypeScript support with comprehensive types

## Architecture

```
lib/image-optimization/
├── imageProcessor.ts    # Core image processing with Sharp
├── uploadService.ts     # Upload service with optimization
├── index.ts            # Public API exports
└── README.md           # This file
```

## Usage

### Basic Image Upload with Optimization

```typescript
import { uploadAndOptimizeImage } from '@/lib/image-optimization';

// Upload and optimize an image
const result = await uploadAndOptimizeImage(file, {
  quality: 85,
  generateResponsive: true,
  generateFormats: true,
  generateThumbnail: true,
});

if (result.success) {
  console.log('Original:', result.data.original.url);
  console.log('WebP:', result.data.webp?.url);
  console.log('AVIF:', result.data.avif?.url);
  console.log('Thumbnail:', result.data.thumbnail);
  console.log('Responsive:', result.data.responsive);
}
```

### Using Recommended Presets

```typescript
import { uploadAndOptimizeImage, getRecommendedOptions } from '@/lib/image-optimization';

// Use preset for product images
const options = getRecommendedOptions('product');
const result = await uploadAndOptimizeImage(file, options);

// Available presets:
// - 'hero': High quality, 1920px, no thumbnail
// - 'product': Good quality, 1200px, with thumbnail
// - 'gallery': Good quality, 1200px, with thumbnail
// - 'thumbnail': Lower quality, 400px, no responsive
// - 'avatar': Square crop, 200px, no responsive
```

### Direct Image Processing

```typescript
import { processImage } from '@/lib/image-optimization';

const buffer = await file.arrayBuffer();
const result = await processImage(Buffer.from(buffer), 'my-image.jpg', {
  quality: 90,
  width: 1920,
  generateResponsive: true,
  generateFormats: true,
});
```

### Image Compression

```typescript
import { compressImage } from '@/lib/image-optimization';

const buffer = await file.arrayBuffer();
const compressed = await compressImage(Buffer.from(buffer), 85);
```

### Format Conversion

```typescript
import { convertImageFormat } from '@/lib/image-optimization';

const buffer = await file.arrayBuffer();
const webpBuffer = await convertImageFormat(Buffer.from(buffer), 'webp', 85);
const avifBuffer = await convertImageFormat(Buffer.from(buffer), 'avif', 80);
```

### Thumbnail Generation

```typescript
import { generateThumbnail } from '@/lib/image-optimization';

const buffer = await file.arrayBuffer();
const thumbnail = await generateThumbnail(Buffer.from(buffer), 200, 75);
```

## API Endpoint Integration

The upload API endpoint (`/api/admin/upload`) automatically uses the optimization pipeline:

```typescript
// Client-side upload
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'image');
formData.append('imageType', 'product'); // Optional: hero, product, gallery, thumbnail, avatar

const response = await fetch('/api/admin/upload', {
  method: 'POST',
  body: formData,
});

const data = await response.json();
// Returns:
// {
//   data: {
//     url: '/Images/optimized/image.jpg',
//     webp: '/Images/optimized/image.webp',
//     avif: '/Images/optimized/image.avif',
//     thumbnail: '/Images/thumbnails/image-thumb.webp',
//     responsive: {
//       small: '/Images/optimized/image-640w.jpg',
//       medium: '/Images/optimized/image-1024w.jpg',
//       large: '/Images/optimized/image-1920w.jpg'
//     },
//     width: 1920,
//     height: 1080,
//     size: 245678
//   }
// }
```

## Frontend Components

### OptimizedImage Component

Use the `OptimizedImage` component for automatic format selection and responsive sizing:

```tsx
import { OptimizedImage } from '@/components/ui';

<OptimizedImage
  src="/Images/optimized/product.jpg"
  alt="Product image"
  width={1200}
  height={800}
  sizePreset="productCard"
  priority={false}
  quality={85}
/>
```

Available size presets:
- `full`: 100vw on all devices
- `hero`: Full width on mobile, 1200px max on desktop
- `gallery`: 1 column mobile, 2 tablet, 3 desktop
- `productCard`: 1 column mobile, 2 tablet, 4 desktop
- `feature`: Full mobile, half tablet/desktop
- `thumbnail`: Small fixed sizes (150-200px)
- `avatar`: Very small fixed sizes (48-64px)

### Picture Component

For explicit format control with fallbacks:

```tsx
import { Picture } from '@/components/ui';

<Picture
  src="/Images/optimized/hero.jpg"
  webpSrc="/Images/optimized/hero.webp"
  avifSrc="/Images/optimized/hero.avif"
  alt="Hero image"
  width={1920}
  height={1080}
  loading="eager"
/>
```

### ResponsivePicture Component

For responsive images with multiple formats:

```tsx
import { ResponsivePicture } from '@/components/ui';

<ResponsivePicture
  sources={{
    small: '/Images/optimized/image-640w.jpg',
    medium: '/Images/optimized/image-1024w.jpg',
    large: '/Images/optimized/image-1920w.jpg',
  }}
  webpSources={{
    small: '/Images/optimized/image-640w.webp',
    medium: '/Images/optimized/image-1024w.webp',
    large: '/Images/optimized/image-1920w.webp',
  }}
  avifSources={{
    small: '/Images/optimized/image-640w.avif',
    medium: '/Images/optimized/image-1024w.avif',
    large: '/Images/optimized/image-1920w.avif',
  }}
  alt="Responsive image"
  loading="lazy"
/>
```

## Configuration

### Quality Settings

Default quality settings by format:
- JPEG: 85
- PNG: 90
- WebP: 85
- AVIF: 80

### Responsive Breakpoints

- Small: 640px
- Medium: 1024px
- Large: 1920px

### File Size Limits

- Images: 10MB maximum
- 3D Models: 50MB maximum

## Output Structure

Optimized images are saved in the following structure:

```
public/
├── Images/
│   ├── optimized/
│   │   ├── image-name-timestamp-random.jpg
│   │   ├── image-name-timestamp-random.webp
│   │   ├── image-name-timestamp-random.avif
│   │   ├── image-name-timestamp-random-640w.jpg
│   │   ├── image-name-timestamp-random-1024w.jpg
│   │   └── image-name-timestamp-random-1920w.jpg
│   └── thumbnails/
│       └── image-name-timestamp-random-thumb.webp
```

## Performance Benefits

### Format Comparison

For a typical 1920x1080 product image:
- Original JPEG (quality 100): ~800KB
- Optimized JPEG (quality 85): ~250KB (69% reduction)
- WebP (quality 85): ~180KB (78% reduction)
- AVIF (quality 80): ~120KB (85% reduction)

### Responsive Loading

Serving appropriately sized images based on device:
- Mobile (640px): ~50KB vs ~250KB (80% reduction)
- Tablet (1024px): ~120KB vs ~250KB (52% reduction)
- Desktop (1920px): ~250KB (full quality)

### Browser Support

- **AVIF**: Chrome 85+, Firefox 93+, Safari 16+
- **WebP**: Chrome 23+, Firefox 65+, Safari 14+
- **JPEG/PNG**: Universal fallback

The pipeline automatically serves the best format supported by the user's browser.

## Best Practices

1. **Always specify image type**: Use the `imageType` parameter for optimal settings
2. **Use appropriate presets**: Choose the right preset for your use case
3. **Lazy load below-fold images**: Set `priority={false}` for images not immediately visible
4. **Provide alt text**: Always include descriptive alt text for accessibility
5. **Use responsive sizes**: Let the browser choose the appropriate image size
6. **Monitor file sizes**: Check the output sizes to ensure optimal compression

## Troubleshooting

### Images not optimizing

- Check that Sharp is installed: `npm list sharp`
- Verify file permissions on the `public/Images` directory
- Check server logs for processing errors

### Format not supported

- Ensure Next.js config includes WebP and AVIF in `images.formats`
- Verify Sharp supports the format (AVIF requires Sharp 0.29+)

### Large file sizes

- Reduce quality setting (try 75-80 for non-critical images)
- Ensure responsive sizes are being generated
- Check that compression is enabled

## Dependencies

- **sharp**: ^0.33.0 - High-performance image processing
- **Next.js**: 14.2+ - Image optimization and serving
- **TypeScript**: 5+ - Type safety

## Future Enhancements

- [ ] Automatic blur placeholder generation
- [ ] Image CDN integration (Cloudinary/Imgix)
- [ ] Batch processing for existing images
- [ ] Progressive JPEG encoding
- [ ] Smart cropping with face detection
- [ ] Automatic alt text generation with AI
