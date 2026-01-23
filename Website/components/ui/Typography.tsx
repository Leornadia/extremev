import React from 'react';
import { cn } from '@/lib/utils';

// Heading Component
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'hero' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as, variant, className, children, ...props }, ref) => {
    const Component = as || 'h2';
    const variantStyle = variant || (as === 'h1' ? 'h1' : as || 'h2');

    const variantClasses = {
      hero: 'text-hero font-bold leading-tight tracking-tight text-neutral-900',
      h1: 'text-h1 font-bold leading-tight tracking-tight text-neutral-900',
      h2: 'text-h2 font-semibold leading-tight tracking-tight text-neutral-900',
      h3: 'text-h3 font-semibold leading-snug text-neutral-900',
      h4: 'text-xl font-semibold leading-snug text-neutral-900',
      h5: 'text-lg font-medium leading-normal text-neutral-900',
      h6: 'text-base font-medium leading-normal text-neutral-900',
    };

    return (
      <Component
        ref={ref}
        className={cn(variantClasses[variantStyle], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

// Text Component
type TextVariant = 'body' | 'small' | 'large' | 'caption';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextColor = 'default' | 'muted' | 'subtle' | 'primary' | 'secondary';

interface BaseTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  children: React.ReactNode;
}

export type TextProps = BaseTextProps &
  React.HTMLAttributes<HTMLParagraphElement>;

const getTextClasses = (
  variant: TextVariant,
  weight: TextWeight,
  color: TextColor
) => {
  const variantClasses = {
    large: 'text-lg leading-relaxed',
    body: 'text-base leading-relaxed',
    small: 'text-sm leading-normal',
    caption: 'text-xs leading-normal',
  };

  const weightClasses = {
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const colorClasses = {
    default: 'text-neutral-900',
    muted: 'text-neutral-700',
    subtle: 'text-neutral-500',
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
  };

  return cn(
    variantClasses[variant],
    weightClasses[weight],
    colorClasses[color]
  );
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      variant = 'body',
      weight = 'regular',
      color = 'default',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <p
        ref={ref}
        className={cn(getTextClasses(variant, weight, color), className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

Text.displayName = 'Text';
