import { cn } from '@/lib/utils';

export interface SpinnerProps {
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color variant
   */
  variant?: 'primary' | 'secondary' | 'white' | 'neutral';
  /**
   * Additional className
   */
  className?: string;
  /**
   * Label for screen readers
   */
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const variantClasses = {
  primary: 'border-primary-200 border-t-primary-600',
  secondary: 'border-secondary-200 border-t-secondary-600',
  white: 'border-white/30 border-t-white',
  neutral: 'border-neutral-200 border-t-neutral-600',
};

/**
 * Spinner component for loading states
 *
 * Displays an animated spinner to indicate loading or processing.
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="primary" />
 * ```
 */
export function Spinner({
  size = 'md',
  variant = 'primary',
  className,
  label = 'Loading...',
}: SpinnerProps) {
  return (
    <div
      className={cn(
        'inline-block rounded-full animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Full-page loading overlay with spinner
 */
export function LoadingOverlay({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm',
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" variant="primary" />
        {message && <p className="text-neutral-600 font-medium">{message}</p>}
      </div>
    </div>
  );
}

/**
 * Inline loading state with spinner and text
 */
export function LoadingInline({
  message = 'Loading...',
  size = 'sm',
  className,
}: {
  message?: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Spinner size={size} variant="primary" />
      <span className="text-neutral-600">{message}</span>
    </div>
  );
}
