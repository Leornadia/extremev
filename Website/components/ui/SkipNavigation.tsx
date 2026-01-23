import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Skip Navigation Links Component
 * Provides keyboard users with quick access to main content areas
 * Meets WCAG 2.1 AA requirement for bypass blocks
 */
export const SkipNavigation: React.FC = () => {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        className={cn(
          'fixed top-4 left-4 z-[100]',
          'bg-primary-600 text-white',
          'px-6 py-3 rounded-lg',
          'font-medium text-sm',
          'focus:outline-none focus:ring-4 focus:ring-primary-300',
          'transition-all duration-200',
          'shadow-lg'
        )}
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className={cn(
          'fixed top-4 left-4 z-[100]',
          'bg-primary-600 text-white',
          'px-6 py-3 rounded-lg',
          'font-medium text-sm',
          'focus:outline-none focus:ring-4 focus:ring-primary-300',
          'transition-all duration-200',
          'shadow-lg',
          'mt-16'
        )}
      >
        Skip to navigation
      </a>
    </div>
  );
};
