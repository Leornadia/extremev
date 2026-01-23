import { Button } from '@/components/ui';

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background Gradient - Using brand purple and orange */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900" />

      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-secondary-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-20 right-20 animate-float hidden lg:block">
        <svg className="w-24 h-24 text-white/10" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
      <div className="absolute bottom-20 left-20 animate-float delay-2000 hidden lg:block">
        <svg className="w-32 h-32 text-white/5" viewBox="0 0 100 100" fill="currentColor">
          <rect x="20" y="20" width="60" height="60" rx="10" transform="rotate(15 50 50)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 mb-10 shadow-glow animate-float">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          {/* Heading */}
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
            Ready to Build Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-secondary-100">Family's Adventure?</span>
          </h2>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Get your quick quote today for premium wooden playground equipment.
            With our simple DIY kits and patented bracket system, your jungle gym adventure starts here!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto min-w-[240px] bg-white text-primary-900 hover:bg-primary-50 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg font-bold py-6"
            >
              Get Quick Quote
              <svg
                className="w-6 h-6 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[240px] text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm text-lg font-semibold py-6"
            >
              View Jungle Gyms
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 text-white/90 text-base font-medium">
            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
              <svg className="w-6 h-6 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Simple DIY Assembly</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
              <svg className="w-6 h-6 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Child Safety Priority</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full backdrop-blur-sm border border-white/10">
              <svg className="w-6 h-6 text-secondary-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>20+ Years Experience</span>
            </div>
          </div>

          {/* Contact Alternative */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <p className="text-primary-200 mb-6 text-lg">
              Prefer to talk to someone? We&apos;re here to help!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a
                href="tel:+27117023155"
                className="flex items-center gap-3 text-white hover:text-secondary-300 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">+27 11 702 3155</span>
              </a>
              <div className="hidden sm:block w-1 h-8 bg-white/10" />
              <a
                href="mailto:info@extremev.co.za"
                className="flex items-center gap-3 text-white hover:text-secondary-300 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="font-bold text-lg">info@extremev.co.za</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
