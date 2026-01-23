import {
  CompanyStorySection,
  ValuesExpertiseSection,
  TeamSection,
} from '@/components/about';
import { SectionDivider } from '@/components/decorative';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data';

export const metadata = generateSEOMetadata({
  title: 'About Us - Extreme V',
  description:
    "Learn about Extreme V's commitment to quality, safety, and creating beautiful play spaces for families across South Africa.",
  keywords: [
    'about extreme v',
    'playground company',
    'jungle gym manufacturer',
    'South Africa',
  ],
  canonical: '/about',
});

export default function AboutPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
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
        <CompanyStorySection />

        <SectionDivider variant="wave" color="text-neutral-50" />

        <ValuesExpertiseSection />

        <SectionDivider variant="grass" color="text-primary-50/30" />

        <TeamSection />
      </main>
    </>
  );
}
