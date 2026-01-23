/**
 * Mobile-Optimized Input Component
 * Provides enhanced input experience for mobile devices
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import {
  preventInputZoom,
  allowInputZoom,
} from '@/lib/utils/mobileOptimization';

interface MobileOptimizedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  preventZoom?: boolean;
}

export const MobileOptimizedInput = React.forwardRef<
  HTMLInputElement,
  MobileOptimizedInputProps
>(
  (
    {
      label,
      error,
      helperText,
      preventZoom = true,
      className,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const generatedId = useRef(
      `input-${Math.random().toString(36).substr(2, 9)}`
    );
    const inputId = id || generatedId.current;

    useEffect(() => {
      if (!preventZoom) return;

      const input = inputRef.current;
      if (!input) return;

      const handleFocus = () => {
        preventInputZoom();
      };

      const handleBlur = () => {
        allowInputZoom();
      };

      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);

      return () => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
        allowInputZoom();
      };
    }, [preventZoom]);

    // Combine refs
    const setRefs = (element: HTMLInputElement | null) => {
      inputRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        <input
          ref={setRefs}
          id={inputId}
          type={type}
          className={cn(
            'w-full px-4 py-3 rounded-lg border border-neutral-300',
            'text-base', // Minimum 16px to prevent zoom on iOS
            'bg-white text-neutral-900',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            // Touch-friendly sizing
            'min-h-[44px]', // WCAG minimum touch target
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helperText
                ? `${inputId}-helper`
                : undefined
          }
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

MobileOptimizedInput.displayName = 'MobileOptimizedInput';
