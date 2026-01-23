import { SkeletonCard } from '../Skeleton';

/**
 * Skeleton for gallery grid loading state
 */
export function GallerySkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="break-inside-avoid">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}
