import React from 'react';
import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { ContactForm, ContactInfo } from '@/components/contact';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata = generateSEOMetadata({
  title: 'Contact Us - Extreme V',
  description:
    "Get in touch with Extreme V for custom jungle gym designs, quotes, and inquiries. We're here to help create the perfect playground for your family.",
  keywords: ['contact', 'get quote', 'jungle gym inquiry', 'customer service'],
  canonical: '/contact',
});

export default function ContactPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <main className="min-h-screen bg-neutral-50 py-16">
        <Container>
          {/* Header */}
          <div className="mb-12 text-center">
            <Heading as="h1" className="mb-4">
              Get in Touch
            </Heading>
            <Text className="mx-auto max-w-2xl text-lg text-neutral-600">
              Have questions about our jungle gyms or want to start designing
              your dream playground? We&apos;re here to help!
            </Text>
          </div>

          {/* Contact Form and Info Grid */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Heading as="h2" className="mb-6">
                Send us a Message
              </Heading>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <ContactInfo />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 rounded-2xl bg-primary-50 p-8 text-center">
            <Heading as="h3" className="mb-4">
              Ready to Design Your Playground?
            </Heading>
            <Text className="mb-6 text-neutral-600">
              Use our interactive configurator to create a custom jungle gym
              that fits your space and budget.
            </Text>
            <a
              href="/configurator"
              className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
            >
              Start Designing
            </a>
          </div>
        </Container>
      </main>
    </>
  );
}
