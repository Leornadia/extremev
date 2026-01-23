import { GalleryGrid } from '@/components/gallery';
import { Container, Section } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata = generateSEOMetadata({
  title: 'Gallery - Extreme V Jungle Gyms',
  description:
    'Browse our gallery of installed jungle gyms and playground equipment. See real examples of custom designs and happy families enjoying their outdoor play spaces.',
  keywords: [
    'jungle gym gallery',
    'playground photos',
    'installed playsets',
    'customer projects',
  ],
  canonical: '/gallery',
});

export default function GalleryPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Gallery', url: '/gallery' },
  ]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <main className="min-h-screen">
        <Section spacing="lg" background="gray">
          <Container>
            <div className="text-center mb-12">
              <Heading as="h1" variant="h1" className="mb-4">
                Gallery
              </Heading>
              <Text
                variant="large"
                className="text-neutral-600 max-w-2xl mx-auto"
              >
                Explore our collection of installed jungle gyms and playground
                equipment. See how families across South Africa are creating
                amazing play spaces.
              </Text>
            </div>

            <GalleryGrid />
          </Container>
        </Section>
      </main>
    </>
  );
}
