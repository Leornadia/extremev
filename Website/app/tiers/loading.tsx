import { Container } from '@/components/ui/Layout';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TiersLoading() {
  return (
    <main className="min-h-screen bg-neutral-50 py-12">
      <Container>
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <Skeleton className="mx-auto mb-4 h-12 w-96" />
          <Skeleton className="mx-auto h-6 w-full max-w-3xl" />
          <Skeleton className="mx-auto mt-2 h-6 w-2/3 max-w-3xl" />
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto rounded-lg bg-white shadow-lg">
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-4 gap-4 border-b border-neutral-200 p-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>

            {/* Feature Rows */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-4 gap-4 border-b border-neutral-100 p-6"
              >
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}

            {/* CTA Row */}
            <div className="grid grid-cols-4 gap-4 p-6">
              <div />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
