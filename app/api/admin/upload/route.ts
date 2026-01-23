import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import {
  uploadAndOptimizeImage,
  getRecommendedOptions,
} from '@/lib/image-optimization';

export const dynamic = 'force-dynamic';

// Helper function to check admin access
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const isAdmin =
    session?.user?.email && adminEmails.includes(session.user.email);

  if (!isAdmin) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Admin access required',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 401 }
      ),
    };
  }

  return { authorized: true };
}

// Validate file type
function validateFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.toLowerCase().split('.').pop();
  return extension ? allowedTypes.includes(extension) : false;
}

// Generate unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const sanitizedName = nameWithoutExt
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();
  return `${sanitizedName}-${timestamp}-${randomString}.${extension}`;
}

// POST /api/admin/upload - Upload files (3D models, images)
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAccess();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'model' or 'image'
    const imageType = formData.get('imageType') as string; // 'hero', 'product', 'gallery', etc.

    if (!file) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'No file provided',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes =
      type === 'model'
        ? ['glb', 'gltf']
        : ['jpg', 'jpeg', 'png', 'webp', 'avif'];

    if (!validateFileType(file.name, allowedTypes)) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for models, 10MB for images)
    const maxSize = type === 'model' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: `File too large. Maximum size: ${maxSize / 1024 / 1024}MB`,
            timestamp: new Date().toISOString(),
          },
        },
        { status: 400 }
      );
    }

    // Handle 3D model uploads (no optimization needed)
    if (type === 'model') {
      const uniqueFilename = generateUniqueFilename(file.name);
      const uploadDir = join(process.cwd(), 'public', '3D');

      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filepath = join(uploadDir, uniqueFilename);

      await writeFile(filepath, buffer);

      return NextResponse.json({
        data: {
          filename: uniqueFilename,
          url: `/3D/${uniqueFilename}`,
          size: file.size,
          type: file.type,
        },
        message: 'File uploaded successfully',
      });
    }

    // Handle image uploads with automatic optimization
    const optimizationOptions = imageType
      ? getRecommendedOptions(
          imageType as 'hero' | 'product' | 'gallery' | 'thumbnail' | 'avatar'
        )
      : getRecommendedOptions('product');

    const result = await uploadAndOptimizeImage(file, optimizationOptions);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          error: {
            code: 'PROCESSING_ERROR',
            message: result.error || 'Failed to process image',
            timestamp: new Date().toISOString(),
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: {
        filename: file.name,
        url: result.data.original.url,
        webp: result.data.webp?.url,
        avif: result.data.avif?.url,
        thumbnail: result.data.thumbnail,
        responsive: result.data.responsive
          ? {
              small: result.data.responsive.small.url,
              medium: result.data.responsive.medium.url,
              large: result.data.responsive.large.url,
            }
          : undefined,
        size: result.data.original.size,
        width: result.data.original.width,
        height: result.data.original.height,
        type: file.type,
      },
      message: 'Image uploaded and optimized successfully',
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to upload file',
          details: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 }
    );
  }
}
