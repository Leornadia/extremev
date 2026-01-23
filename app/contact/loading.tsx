import { Container, Skeleton, SkeletonText } from '@/components/ui';

/**
 * Loading state for contact page
 */
export default function ContactLoading() {
  return (
    <main className="min-h-screen py-16 sm:py-24">
      <Container>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton height="3rem" width="300px" className="mx-auto mb-4" />
            <Skeleton height="1.5rem" width="500px" className="mx-auto" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info Skeleton */}
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton height="1.5rem" width="150px" />
                  <SkeletonText lines={2} />
                </div>
              ))}
            </div>

            {/* Contact Form Skeleton */}
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton height="1rem" width="100px" />
                  <Skeleton
                    height={i === 3 ? '150px' : '48px'}
                    variant="rounded"
                  />
                </div>
              ))}
              <Skeleton height="48px" variant="rounded" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
