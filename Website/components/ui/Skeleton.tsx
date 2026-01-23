import { cn } from '@/lib/utils';

export interface SkeletonProps {
  /**
   * Width of the skeleton (CSS value)
   */
  width?: string | number;
  /**
   * Height of the skeleton (CSS value)
   */
  height?: string | number;
  /**
   * Border radius variant
   */
  variant?: 'default' | 'circle' | 'rounded' | 'none';
  /**
   * Additional className
   */
  className?: string;
  /**
   * Whether to animate the skeleton
   */
  animate?: boolean;
}

/**
 * Skeleton component for loading states
 *
 * Displays a placeholder while content is loading to prevent layout shift
 * and provide visual feedback to users.
 *
 * @example
 * ```tsx
 * <Skeleton width="100%" height="200px" />
 * <Skeleton variant="circle" width="48px" height="48px" />
 * ```
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  variant = 'default',
  className,
  animate = true,
}: SkeletonProps) {
  const variantClasses = {
    default: 'rounded',
    circle: 'rounded-full',
    rounded: 'rounded-lg',
    none: '',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        'bg-neutral-200',
        animate && 'animate-pulse',
        variantClasses[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for text content
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="1rem"
          width={i === lines - 1 ? '80%' : '100%'}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for card content
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton height="200px" variant="rounded" />
      <div className="space-y-2">
        <Skeleton height="1.5rem" width="60%" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

/**
 * Skeleton for image with aspect ratio
 */
export function SkeletonImage({
  aspectRatio = 'video',
  className,
}: {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  className?: string;
}) {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
  };

  return (
    <Skeleton
      className={cn(aspectClasses[aspectRatio], className)}
      variant="rounded"
    />
  );
}

/**
 * Skeleton for avatar/profile picture
 */
export function SkeletonAvatar({
  size = 48,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      width={size}
      height={size}
      variant="circle"
      className={className}
    />
  );
}
