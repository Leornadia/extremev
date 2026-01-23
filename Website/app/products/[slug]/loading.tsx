import { Container } from '@/components/ui/Layout';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductDetailLoading() {
  return (
    <>
      <Container className="py-8">
        <Skeleton className="h-4 w-64" />
      </Container>

      <Container className="py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Skeleton */}
          <div>
            <Skeleton className="aspect-square rounded-lg mb-4" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-5/6 mb-6" />

            {/* Price Skeleton */}
            <div className="mb-8 p-6 bg-neutral-50 rounded-lg">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-12 w-40 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>

            {/* CTA Skeletons */}
            <div className="space-y-3 mb-8">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>

            {/* Quick Info Skeleton */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>

            {/* Specs Skeleton */}
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
          </div>
          <div>
            <Skeleton className="h-8 w-48 mb-6" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full mb-3" />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
