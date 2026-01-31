'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { ShieldCheck, Award, Heart, Search, ChevronDown } from 'lucide-react';

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // Check for mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldPlayVideo(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  // Handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlayVideo || prefersReducedMotion) return;

    // Use requestIdleCallback for non-critical video loading
    const loadVideo = () => {
      video.load();
      video.play().catch(() => {
        // Autoplay was prevented, show poster instead
        console.log('Video autoplay prevented');
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadVideo, { timeout: 2000 });
    } else {
      setTimeout(loadVideo, 100);
    }
  }, [shouldPlayVideo, prefersReducedMotion]);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className="relative h-screen bg-neutral-900 overflow-hidden perspective-1000">
      {/* Background Video - Full Width Landscape */}
      <div ref={containerRef} className="absolute inset-0">
        {/* Poster/Fallback Image - Shows while video loads or on reduced motion */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-950 transition-opacity duration-700 ${isVideoLoaded && !prefersReducedMotion ? 'opacity-0' : 'opacity-100'
            }`}
          aria-hidden="true"
        >
          {/* Placeholder gradient background */}
          <div className="absolute inset-0 bg-[url('/images/hero-poster.webp')] bg-cover bg-center bg-no-repeat" />
        </div>

        {/* Optimized Video Element */}
        {!prefersReducedMotion && (
          <video
            ref={videoRef}
            autoPlay={false}
            muted
            loop
            playsInline
            preload="metadata"
            className={`w-full h-full object-cover transition-opacity duration-700 ${isVideoLoaded ? 'opacity-90' : 'opacity-0'
              }`}
            onLoadedData={handleVideoLoaded}
            onCanPlayThrough={handleVideoLoaded}
            suppressHydrationWarning
            // Optimize for mobile - lower quality on cellular
            {...(isMobile && { 'data-mobile': 'true' })}
          >
            {/* WebM for modern browsers - better compression */}
            <source
              src="/videos/Cover Video.webm"
              type="video/webm"
            />
            {/* MP4 fallback for Safari and older browsers */}
            <source
              src="/videos/Extreme V Landing Page video (2).mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-950/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl animate-fadeIn">
            {/* Logo */}
            <div className="mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              <div className="relative h-24 w-auto inline-block">
                <Image
                  src="/images/extreme-velvet-logo.webp"
                  alt="Extreme Velvet Logo"
                  width={300}
                  height={96}
                  className="h-24 w-auto drop-shadow-glow hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>

            {/* Decorative Icons */}
            <div className="flex gap-6 mb-8 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-10 h-10 text-secondary-500 drop-shadow-lg hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-default">
                <ShieldCheck className="w-full h-full" strokeWidth={1.5} />
              </div>
              <div className="w-10 h-10 text-accent-teal drop-shadow-lg hover:scale-125 hover:-rotate-12 transition-all duration-300 cursor-default">
                <Award className="w-full h-full" strokeWidth={1.5} />
              </div>
              <div className="w-10 h-10 text-primary-500 drop-shadow-lg hover:scale-125 hover:rotate-12 transition-all duration-300 cursor-default">
                <Heart className="w-full h-full" strokeWidth={1.5} />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-hero font-bold text-white mb-8 leading-none tracking-tight drop-shadow-lg animate-slideUp" style={{ animationDelay: '0.3s' }}>
              Enhanced Life,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 animate-gradient-x">
                Promoting Growth
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl lg:text-2xl text-neutral-200 mb-10 leading-relaxed max-w-2xl drop-shadow-md animate-slideUp" style={{ animationDelay: '0.4s' }}>
              Johannesburg's Most Specialised Wooden Playground Equipment • Established 2009 Patent
            </p>

            {/* Category Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mb-10 animate-slideUp" style={{ animationDelay: '0.5s' }}>
              <a href="/products" className="inline-block group">
                <Button
                  variant="ghost"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:border-secondary-500 hover:bg-secondary-500 hover:text-white px-10 py-6 text-lg rounded-2xl font-semibold w-full backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg hover:shadow-secondary-500/25 transform hover:scale-105 hover:-translate-y-1"
                >
                  OUTDOOR
                </Button>
              </a>
              <a href="/products" className="inline-block group">
                <Button
                  variant="ghost"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:border-primary-500 hover:bg-primary-500 hover:text-white px-10 py-6 text-lg rounded-2xl font-semibold w-full backdrop-blur-md bg-white/5 transition-all duration-300 shadow-lg hover:shadow-primary-500/25 transform hover:scale-105 hover:-translate-y-1"
                >
                  INDOOR
                </Button>
              </a>
            </div>

            {/* Search/Find CTA */}
            <div className="mb-12 animate-slideUp" style={{ animationDelay: '0.6s' }}>
              <a href="/find-my-playset" className="inline-block">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-400 hover:to-secondary-500 text-white flex items-center gap-3 text-xl px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-secondary-500/40 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <Search className="w-6 h-6" strokeWidth={2.5} />
                  FIND MY PLAYSET
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 text-sm font-medium text-white/90 animate-slideUp" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-black/30 transition-colors duration-300">
                <ShieldCheck className="w-5 h-5 text-secondary-400" />
                <span>Child Safety Priority</span>
              </div>
              <div className="flex items-center gap-3 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-black/30 transition-colors duration-300">
                <Award className="w-5 h-5 text-secondary-400" />
                <span>Patented Bracket System</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown className="w-8 h-8" />
      </div>
    </section>
  );
}
