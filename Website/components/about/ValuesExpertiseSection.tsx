'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';

interface Certification {
  name: string;
  description: string;
  icon: string;
}

interface Material {
  name: string;
  description: string;
  benefits: string[];
}

const certifications: Certification[] = [
  {
    name: 'Safety Standards',
    description:
      'All products meet or exceed international playground safety standards',
    icon: '🛡️',
  },
  {
    name: 'Quality Assurance',
    description:
      'Rigorous testing and inspection processes ensure lasting durability',
    icon: '✓',
  },
  {
    name: 'Environmental Commitment',
    description:
      'Sustainably sourced materials and eco-friendly manufacturing practices',
    icon: '🌱',
  },
  {
    name: 'Expert Installation',
    description:
      'Professional installation teams trained in safety and precision',
    icon: '🔧',
  },
];

const materials: Material[] = [
  {
    name: 'Premium Timber',
    description:
      'Sustainably sourced, pressure-treated wood for maximum durability',
    benefits: [
      'Weather-resistant treatment',
      'Natural aesthetic appeal',
      'Splinter-free finish',
      '15-year structural warranty',
    ],
  },
  {
    name: 'Commercial-Grade Hardware',
    description: 'Stainless steel and galvanized components built to last',
    benefits: [
      'Rust and corrosion resistant',
      'Heavy-duty load capacity',
      'Smooth, safe edges',
      'UV-resistant coatings',
    ],
  },
  {
    name: 'Safety Surfacing',
    description:
      'Impact-absorbing materials that meet fall height requirements',
    benefits: [
      'ASTM certified impact attenuation',
      'Drainage-friendly design',
      'Low maintenance requirements',
      'Available in multiple colors',
    ],
  },
];

const safetyStandards = [
  {
    title: 'Structural Integrity',
    description:
      'Every design undergoes load testing to ensure it can safely support multiple children at play.',
  },
  {
    title: 'Fall Zone Protection',
    description:
      'Proper spacing and surfacing recommendations to minimize injury risk from falls.',
  },
  {
    title: 'Age-Appropriate Design',
    description:
      'Equipment scaled and configured for specific age groups with appropriate challenge levels.',
  },
  {
    title: 'Regular Inspections',
    description:
      'Comprehensive inspection guidelines provided to maintain safety over the product lifetime.',
  },
];

export function ValuesExpertiseSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Heading as="h1" variant="h1" className="mb-6">
            Quality & Expertise
          </Heading>
          <Text variant="large" className="text-neutral-600">
            Our commitment to excellence in every detail
          </Text>
        </div>

        {/* Certifications Grid */}
        <div className="mb-20">
          <Heading as="h2" variant="h2" className="mb-10 text-center">
            Certifications & Standards
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.name}
                className="bg-gradient-to-br from-primary-50 to-white rounded-xl p-6 border border-primary-100 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{cert.icon}</div>
                <Heading as="h4" variant="h4" className="mb-3">
                  {cert.name}
                </Heading>
                <Text variant="small" className="text-neutral-600">
                  {cert.description}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Materials Section */}
        <div className="mb-20">
          <Heading as="h2" variant="h2" className="mb-10 text-center">
            Premium Materials
          </Heading>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {materials.map((material) => (
              <div
                key={material.name}
                className="bg-neutral-50 rounded-xl p-8 border border-neutral-200"
              >
                <Heading as="h3" variant="h3" className="mb-3">
                  {material.name}
                </Heading>
                <Text className="text-neutral-600 mb-6">
                  {material.description}
                </Text>
                <ul className="space-y-3">
                  {material.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="text-primary-500 mt-1 flex-shrink-0">
                        ✓
                      </span>
                      <Text variant="small" className="text-neutral-700">
                        {benefit}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Standards */}
        <div className="max-w-5xl mx-auto">
          <Heading as="h2" variant="h2" className="mb-10 text-center">
            Safety Standards
          </Heading>
          <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-2xl p-8 md:p-12">
            <Text
              variant="large"
              className="text-neutral-700 mb-10 text-center"
            >
              Safety is our top priority. Every product is designed and
              manufactured with rigorous attention to safety standards and best
              practices.
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {safetyStandards.map((standard) => (
                <div
                  key={standard.title}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <Heading
                    as="h4"
                    variant="h4"
                    className="mb-3 text-primary-700"
                  >
                    {standard.title}
                  </Heading>
                  <Text variant="small" className="text-neutral-600">
                    {standard.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Guarantee */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-primary-600 text-white rounded-2xl p-8 md:p-12 text-center">
            <Heading as="h2" variant="h2" className="mb-6 text-white">
              Our Quality Guarantee
            </Heading>
            <Text variant="large" className="mb-8 opacity-90">
              We stand behind every product we sell with comprehensive
              warranties and dedicated customer support. Your satisfaction and
              your children&apos;s safety are our highest priorities.
            </Text>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">15 Years</div>
                <Text variant="small" className="opacity-90">
                  Structural Warranty
                </Text>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">5 Years</div>
                <Text variant="small" className="opacity-90">
                  Hardware Warranty
                </Text>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Lifetime</div>
                <Text variant="small" className="opacity-90">
                  Customer Support
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
