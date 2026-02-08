import {
  HeroSection,
  ProcessFlowSection,
  ValuePropositionSection,
  ProductTierSection,
  TestimonialsSection,
  CTASection,
} from '@/components/home';
import { SectionDivider } from '@/components/decorative';
import { FindPlaysetCTA } from '@/components/ui/FindPlaysetCTA';
import { generateLocalBusinessSchema } from '@/lib/seo/structured-data';

export default function Home() {
  const localBusinessSchema = generateLocalBusinessSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <main className="min-h-screen">
        <HeroSection />

        <ProcessFlowSection />

        <SectionDivider variant="grass" color="text-neutral-50" />

        <ValuePropositionSection />

        <SectionDivider variant="clouds" color="text-neutral-50" />

        <ProductTierSection />

        {/* Find My Playset CTA Banner */}
        <FindPlaysetCTA variant="banner" />

        <SectionDivider variant="hills" color="text-primary-50/30" />

        <TestimonialsSection />

        <SectionDivider variant="wave" flip color="text-primary-600" />

        <CTASection />
      </main>
    </>
  );
}
