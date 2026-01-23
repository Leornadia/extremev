import { Container, Skeleton, SkeletonText } from '@/components/ui';

/**
 * Loading state for about page
 */
export default function AboutLoading() {
  return (
    <main className="min-h-screen py-16 sm:py-24">
      {/* Hero Section Skeleton */}
      <section className="mb-16">
        <Container>
          <div className="text-center mb-12">
            <Skeleton height="3rem" width="400px" className="mx-auto mb-4" />
            <Skeleton height="1.5rem" width="600px" className="mx-auto" />
          </div>
        </Container>
      </section>

      {/* Content Sections Skeleton */}
      {Array.from({ length: 3 }).map((_, i) => (
        <section key={i} className="py-12">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className={i % 2 === 0 ? 'order-1' : 'order-2'}>
                <Skeleton height="400px" variant="rounded" />
              </div>
              <div className={i % 2 === 0 ? 'order-2' : 'order-1'}>
                <Skeleton height="2rem" width="250px" className="mb-4" />
                <SkeletonText lines={5} />
              </div>
            </div>
          </Container>
        </section>
      ))}
    </main>
  );
}
