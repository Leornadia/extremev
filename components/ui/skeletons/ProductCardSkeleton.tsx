import { Skeleton, SkeletonText } from '../Skeleton';

/**
 * Skeleton for product card loading state
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      <Skeleton height="250px" variant="none" />
      <div className="p-6 space-y-4">
        <Skeleton height="1.5rem" width="70%" />
        <SkeletonText lines={2} />
        <div className="flex items-center justify-between pt-4">
          <Skeleton height="2rem" width="100px" />
          <Skeleton height="2.5rem" width="120px" variant="rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for product grid loading state
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
