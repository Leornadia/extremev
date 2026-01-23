import { Container } from '@/components/ui';
import { GallerySkeleton } from '@/components/ui/skeletons';

/**
 * Loading state for gallery page
 */
export default function GalleryLoading() {
  return (
    <main className="min-h-screen py-16 sm:py-24">
      <Container>
        <div className="mb-12">
          <div className="h-12 w-64 bg-neutral-200 rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-neutral-200 rounded animate-pulse" />
        </div>
        <GallerySkeleton count={9} />
      </Container>
    </main>
  );
}
