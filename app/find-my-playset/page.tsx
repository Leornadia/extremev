import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import NextImage from 'next/image';

export default function FindMyPlaysetPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-neutral-50">
      <Container className="py-16 sm:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-neutral-600">
            <li>
              <a href="/" className="hover:text-primary-600 transition-colors">
                Home
              </a>
            </li>
            <li>/</li>
            <li className="text-neutral-900 font-medium">Find My Playset</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Illustration */}
          <div className="mb-12 relative">
            <div className="relative w-full max-w-2xl mx-auto aspect-[16/10]">
              <NextImage
                src="/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp"
                alt="ExtremeV Jungle Gym Illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-6">
            Find My Playset
          </h1>

          {/* Description */}
          <p className="text-xl text-neutral-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            With our flexible jungle gym designs, infinitely customizable modular options, and
            hundreds of accessories, ExtremeV playsets offer endless possibilities for play.
            Let us help you find the perfect playset.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a href="/find-my-playset/size" className="inline-block">
              <Button
                size="lg"
                className="bg-primary-600 hover:bg-primary-700 text-white px-12 py-4 text-lg rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                START
              </Button>
            </a>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center">
              <div className="w-24 h-24 relative mb-4">
                <NextImage
                  src="/images/icons/flexible-designs.png"
                  alt="Flexible Designs"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Flexible Designs
              </h3>
              <p className="text-neutral-600">
                Customizable modular designs that grow with your family
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center">
              <div className="w-24 h-24 relative mb-4">
                <NextImage
                  src="/images/icons/safety-first.png"
                  alt="Safety First"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Safety First
              </h3>
              <p className="text-neutral-600">
                Patented bracket system (2009) ensures maximum safety
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center">
              <div className="w-24 h-24 relative mb-4">
                <NextImage
                  src="/images/icons/easy-assembly.png"
                  alt="Easy Assembly"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Easy Assembly
              </h3>
              <p className="text-neutral-600">
                DIY kits with detailed instructions for simple setup
              </p>
            </div>
          </div>

          {/* Additional CTA */}
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <p className="text-neutral-600 mb-4">
              Need help choosing? Our team is here to assist you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+27117023155"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+27 11 702 3155</span>
              </a>
              <span className="text-neutral-400">•</span>
              <a
                href="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
