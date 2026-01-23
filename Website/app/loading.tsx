import { LoadingOverlay } from '@/components/ui';

/**
 * Root loading state for Next.js App Router
 * Displayed during page transitions and initial loads
 */
export default function Loading() {
  return <LoadingOverlay message="Loading..." />;
}
