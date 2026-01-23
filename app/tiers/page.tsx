import { Metadata } from 'next';
import { TierComparisonTable } from '@/components/products/TierComparisonTable';
import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Compare Product Tiers | Extreme V',
  description:
    'Compare our Essential, Premium, and Luxury jungle gym tiers to find the perfect playset for your family. See features, materials, warranties, and pricing.',
  keywords: [
    'jungle gym tiers',
    'playground pricing',
    'compare playsets',
    'essential premium luxury',
  ],
  canonical: '/tiers',
});

export default function TiersPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Product Tiers', url: '/tiers' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <main className="min-h-screen bg-neutral-50 py-12">
        <Container>
          {/* Header Section */}
          <div className="mb-12 text-center">
            <Heading as="h1" variant="h1" className="mb-4">
              Compare Our Product Tiers
            </Heading>
            <Text
              variant="large"
              className="mx-auto max-w-3xl text-neutral-600"
            >
              Choose the tier that best fits your needs and budget. All our
              jungle gyms are built with safety and durability in mind, with
              each tier offering unique features and benefits.
            </Text>
          </div>

          {/* Comparison Table */}
          <TierComparisonTable />

          {/* Additional Information */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <span className="text-2xl">🏆</span>
              </div>
              <Heading as="h3" variant="h3" className="mb-2">
                Premium Quality
              </Heading>
              <Text className="text-neutral-600">
                Every tier is built with high-quality materials and expert
                craftsmanship, ensuring years of safe play for your family.
              </Text>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <span className="text-2xl">🛡️</span>
              </div>
              <Heading as="h3" variant="h3" className="mb-2">
                Safety First
              </Heading>
              <Text className="text-neutral-600">
                All our products meet or exceed safety standards, with
                comprehensive warranties to give you peace of mind.
              </Text>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                <span className="text-2xl">🎨</span>
              </div>
              <Heading as="h3" variant="h3" className="mb-2">
                Fully Customizable
              </Heading>
              <Text className="text-neutral-600">
                Use our online configurator to design your perfect playset, or
                choose from our pre-designed models.
              </Text>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
