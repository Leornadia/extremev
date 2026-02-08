'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface FindPlaysetCTAProps {
    variant?: 'floating' | 'inline' | 'banner';
    className?: string;
}

/**
 * Floating CTA button that appears on all pages to help users find their ideal playset.
 * Features a magnetic 3D icon and attention-grabbing animation.
 * Automatically hides on /find-my-playset pages to avoid distraction.
 */
export function FindPlaysetCTA({ variant = 'floating', className }: FindPlaysetCTAProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isPulsing, setIsPulsing] = useState(true);
    const pathname = usePathname();

    // Check if user is on a find-my-playset page
    const isOnFindPlaysetPage = pathname?.startsWith('/find-my-playset');

    useEffect(() => {
        // Don't show at all if on find-my-playset pages
        if (isOnFindPlaysetPage) {
            setIsVisible(false);
            return;
        }

        // Show the button after a short delay for a smoother page load
        const timer = setTimeout(() => setIsVisible(true), 1000);

        // Stop pulsing after 10 seconds to not be too distracting
        const pulseTimer = setTimeout(() => setIsPulsing(false), 10000);

        return () => {
            clearTimeout(timer);
            clearTimeout(pulseTimer);
        };
    }, [isOnFindPlaysetPage]);

    // Restart pulsing when user scrolls significantly
    useEffect(() => {
        if (isOnFindPlaysetPage) return;

        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY) > 500) {
                setIsPulsing(true);
                lastScrollY = currentScrollY;

                // Stop pulsing after 5 seconds
                setTimeout(() => setIsPulsing(false), 5000);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOnFindPlaysetPage]);

    // For floating variant, don't render anything if on find-my-playset pages
    if (variant === 'floating' && isOnFindPlaysetPage) {
        return null;
    }

    if (variant === 'floating') {
        return (
            <div
                className={cn(
                    'fixed bottom-6 right-6 z-50 transition-all duration-500',
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
                    className
                )}
            >
                <Link
                    href="/find-my-playset"
                    className={cn(
                        'group flex items-center gap-3 px-6 py-4 rounded-full',
                        'bg-gradient-to-r from-primary-500 to-primary-600',
                        'text-white font-semibold shadow-2xl',
                        'hover:from-primary-600 hover:to-primary-700',
                        'hover:shadow-primary-500/30 hover:shadow-xl',
                        'transform transition-all duration-300',
                        'hover:scale-105 active:scale-95',
                        isPulsing && 'animate-pulse-subtle'
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    aria-label="Find your perfect playset with our interactive tool"
                >
                    {/* 3D Cube Icon */}
                    <span className={cn(
                        'relative w-8 h-8 transition-transform duration-300',
                        isHovered && 'rotate-12 scale-110'
                    )}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="w-full h-full"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {/* 3D Cube */}
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        {/* Sparkle effect */}
                        <span className={cn(
                            'absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full',
                            'opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                            'animate-ping'
                        )} />
                    </span>

                    {/* Text */}
                    <span className="flex flex-col items-start">
                        <span className="text-xs uppercase tracking-wider opacity-80">3D Preview</span>
                        <span className="text-sm font-bold">Find My Playset</span>
                    </span>

                    {/* Arrow */}
                    <svg
                        className={cn(
                            'w-5 h-5 transition-transform duration-300',
                            isHovered && 'translate-x-1'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </Link>

                {/* Glow effect */}
                <div
                    className={cn(
                        'absolute inset-0 rounded-full bg-primary-500/20 blur-xl -z-10',
                        'transition-opacity duration-300',
                        isHovered ? 'opacity-100' : 'opacity-50'
                    )}
                />
            </div>
        );
    }

    if (variant === 'banner') {
        return (
            <section className={cn(
                'relative overflow-hidden py-16 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500',
                className
            )}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <svg
                            className="w-12 h-12 text-white/90"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Not Sure Which Playset Is Right for You?
                    </h2>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Use our interactive 3D tool to explore different playsets, customize features,
                        and find the perfect jungle gym for your family.
                    </p>

                    <Link
                        href="/find-my-playset"
                        className={cn(
                            'inline-flex items-center gap-3 px-8 py-4 rounded-full',
                            'bg-white text-primary-600 font-bold text-lg',
                            'hover:bg-neutral-50 hover:scale-105',
                            'transform transition-all duration-300 shadow-2xl',
                            'focus:outline-none focus:ring-4 focus:ring-white/50'
                        )}
                    >
                        <svg
                            className="w-6 h-6"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        Find My Playset
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                        </svg>
                    </Link>
                </div>
            </section>
        );
    }

    // Inline variant
    return (
        <Link
            href="/find-my-playset"
            className={cn(
                'group inline-flex items-center gap-2 px-5 py-2.5 rounded-full',
                'bg-gradient-to-r from-primary-500 to-primary-600',
                'text-white font-semibold text-sm',
                'hover:from-primary-600 hover:to-primary-700',
                'transform transition-all duration-300',
                'hover:scale-105 shadow-lg hover:shadow-xl',
                className
            )}
        >
            <svg
                className="w-5 h-5 group-hover:rotate-12 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            3D Preview
        </Link>
    );
}

/**
 * CSS animation for subtle pulsing effect
 * Add to globals.css:
 * @keyframes pulse-subtle {
 *   0%, 100% { transform: scale(1); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
 *   50% { transform: scale(1.02); box-shadow: 0 25px 50px -12px rgba(234, 88, 12, 0.4); }
 * }
 * .animate-pulse-subtle { animation: pulse-subtle 2s ease-in-out infinite; }
 */
