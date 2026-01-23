'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: '2010',
    title: 'The Beginning',
    description:
      'Founded with a vision to bring premium playground equipment to South African families, combining safety with imaginative play.',
  },
  {
    year: '2015',
    title: 'Expansion & Growth',
    description:
      'Expanded our product line and established partnerships with leading manufacturers, ensuring the highest quality materials.',
  },
  {
    year: '2020',
    title: 'Innovation in Design',
    description:
      'Introduced custom design capabilities, allowing families to create personalized play spaces tailored to their unique needs.',
  },
  {
    year: '2025',
    title: 'Digital Transformation',
    description:
      'Launched our interactive 3D configurator, making it easier than ever to design and visualize your dream playground.',
  },
];

export function CompanyStorySection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-neutral-50">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Heading as="h1" variant="h1" className="mb-6">
            Our Story
          </Heading>
          <Text variant="large" className="text-neutral-600">
            Building dreams, one playset at a time
          </Text>
        </div>

        {/* Mission Statement */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-neutral-200">
            <Heading as="h2" variant="h2" className="mb-6 text-center">
              Our Mission
            </Heading>
            <Text
              variant="large"
              className="text-neutral-700 leading-relaxed text-center"
            >
              At Extreme V, we believe that play is essential to childhood
              development and family bonding. Our mission is to create
              beautiful, safe, and durable playground equipment that inspires
              imagination, encourages physical activity, and brings families
              together. We are committed to using premium materials, maintaining
              the highest safety standards, and providing exceptional customer
              service throughout your journey with us.
            </Text>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          <Heading as="h2" variant="h2" className="mb-12 text-center">
            Our Journey
          </Heading>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-300" />

            {/* Timeline events */}
            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div
                  key={event.year}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 w-full">
                    <div
                      className={`bg-white rounded-xl shadow-md p-6 md:p-8 border border-neutral-200 hover:shadow-lg transition-shadow ${
                        index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                      }`}
                    >
                      <div className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-semibold mb-3">
                        {event.year}
                      </div>
                      <Heading as="h3" variant="h3" className="mb-3">
                        {event.title}
                      </Heading>
                      <Text className="text-neutral-600">
                        {event.description}
                      </Text>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 border-4 border-white shadow-lg z-10 flex-shrink-0">
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Founder Story */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-xl">
                  EV
                </div>
              </div>
              <div className="flex-1">
                <Heading as="h3" variant="h3" className="mb-4">
                  A Passion for Play
                </Heading>
                <Text className="text-neutral-700 leading-relaxed mb-4">
                  Extreme V was born from a simple observation: children deserve
                  play spaces that are not only safe and durable but also
                  beautiful and inspiring. Our founders, passionate about both
                  design and child development, set out to create playground
                  equipment that would stand the test of time while sparking joy
                  and imagination.
                </Text>
                <Text className="text-neutral-700 leading-relaxed">
                  Today, we continue that mission by combining traditional
                  craftsmanship with modern technology, ensuring every family
                  can create their perfect play space.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
