import { Skeleton, SkeletonText } from '../Skeleton';

/**
 * Skeleton for generic section loading state
 */
export function SectionSkeleton() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton height="3rem" width="300px" className="mx-auto mb-4" />
          <Skeleton height="1.5rem" width="500px" className="mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton height="200px" variant="rounded" />
              <Skeleton height="1.5rem" width="80%" />
              <SkeletonText lines={3} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
