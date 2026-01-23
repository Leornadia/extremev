import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = 'h-12 w-auto',
  width = 180,
  height = 48
}) => {
  return (
    <img
      src="/images/extreme-velvet-logo.webp"
      alt="Extreme Velvet Logo"
      width={width}
      height={height}
      className={className}
      loading="eager"
      suppressHydrationWarning
    />
  );
};
