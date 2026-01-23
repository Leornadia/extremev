'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Quote, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  tier: string;
  rating: number;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      "Our kids spend hours every day on their new playset. The quality is outstanding and it's held up beautifully through all seasons. Best investment we've made for our backyard!",
    author: 'Sarah M.',
    location: 'Cape Town',
    tier: 'Premium',
    rating: 5,
  },
  {
    id: '2',
    quote:
      'The design process was so easy and fun. We loved being able to customize every detail. The installation team was professional and the final result exceeded our expectations.',
    author: 'James & Lisa K.',
    location: 'Johannesburg',
    tier: 'Luxury',
    rating: 5,
  },
  {
    id: '3',
    quote:
      'We were worried about the cost, but the Essential tier gave us amazing quality at a price we could afford. Our three kids absolutely love it and we love watching them play.',
    author: 'Michael T.',
    location: 'Durban',
    tier: 'Essential',
    rating: 5,
  },
  {
    id: '4',
    quote:
      'From quote to installation, everything was seamless. The customer service was exceptional and they answered all our questions. Highly recommend Extreme V!',
    author: 'Rachel P.',
    location: 'Pretoria',
    tier: 'Premium',
    rating: 5,
  },
  {
    id: '5',
    quote:
      'The craftsmanship is incredible. You can tell this is built to last. Our grandchildren will be playing on this for years to come. Worth every penny!',
    author: 'David & Anne W.',
    location: 'Port Elizabeth',
    tier: 'Luxury',
    rating: 5,
  },
  {
    id: '6',
    quote:
      "We love that it's a family-owned company that cares about quality and safety. The playset is beautiful and our kids are outside playing instead of on screens!",
    author: 'Nomsa L.',
    location: 'Bloemfontein',
    tier: 'Premium',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, totalPages]);

  const visibleTestimonials = testimonials.slice(
    currentIndex * testimonialsPerPage,
    (currentIndex + 1) * testimonialsPerPage
  );

  const nextPage = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section className="py-24 bg-neutral-50 relative overflow-hidden perspective-1000">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-secondary-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-soft text-primary-600 mb-8 transform rotate-3 hover:rotate-12 hover:scale-110 transition-all duration-300">
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
            Loved by Families <span className="text-primary-600">Everywhere</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t just take our word for it - hear from families
            who&apos;ve transformed their backyards into magical play spaces.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {visibleTestimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-500 border border-neutral-100 flex flex-col h-full group hover:-translate-y-2 hover:rotate-x-2 perspective-500"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-secondary-400 fill-current animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-neutral-700 mb-8 leading-relaxed flex-1 relative">
                <span className="absolute -top-2 -left-2 text-primary-100 -z-10 transform -translate-x-2 -translate-y-2">
                  <Quote className="w-12 h-12 fill-current opacity-50" />
                </span>
                {testimonial.quote}
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-neutral-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-primary-700 font-bold text-lg shadow-inner group-hover:scale-110 transition-transform duration-300">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-neutral-500 font-medium">
                    {testimonial.location} <span className="text-neutral-300 mx-1">•</span> <span className="text-primary-600">{testimonial.tier} Tier</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={prevPage}
            className="p-4 rounded-full bg-white shadow-soft hover:shadow-medium text-neutral-600 hover:text-primary-600 transition-all border border-neutral-100 group hover:scale-110"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-3">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`h-3 rounded-full transition-all duration-300 ${i === currentIndex
                  ? 'bg-primary-600 w-10 shadow-md'
                  : 'bg-neutral-200 hover:bg-neutral-300 w-3 hover:scale-125'
                  }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            className="p-4 rounded-full bg-white shadow-soft hover:shadow-medium text-neutral-600 hover:text-primary-600 transition-all border border-neutral-100 group hover:scale-110"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-neutral-200/50">
          <div className="px-4 group cursor-default">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-2 font-display transform group-hover:scale-110 transition-transform duration-300">500+</div>
            <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Happy Families</div>
          </div>
          <div className="px-4 group cursor-default">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-2 font-display transform group-hover:scale-110 transition-transform duration-300">
              4.9
            </div>
            <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Average Rating</div>
          </div>
          <div className="px-4 group cursor-default">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-2 font-display transform group-hover:scale-110 transition-transform duration-300">98%</div>
            <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Would Recommend</div>
          </div>
          <div className="px-4 group cursor-default">
            <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-2 font-display transform group-hover:scale-110 transition-transform duration-300">15+</div>
            <div className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}
