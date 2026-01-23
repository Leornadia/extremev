import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { ImageCarousel } from '@/components/products/ImageCarousel';
import { ProductSpecs } from '@/components/products/ProductSpecs';
import { RelatedProducts } from '@/components/products/RelatedProducts';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/seo/structured-data';

async function getProduct(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/api/products/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getProduct(params.slug);

  if (!data || !data.product) {
    return {
      title: 'Product Not Found',
    };
  }

  const { product } = data;

  return generateSEOMetadata({
    title: `${product.name} - ${product.tier.name} Tier`,
    description: product.shortDescription,
    keywords: [
      product.name,
      product.tier.name,
      'jungle gym',
      'playground equipment',
      product.ageRange,
    ],
    ogImage: product.images[0] || undefined,
    ogType: 'product',
    canonical: `/products/${product.slug}`,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getProduct(params.slug);

  if (!data || !data.product) {
    notFound();
  }

  const { product, relatedProducts } = data;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Generate structured data
  const productSchema = generateProductSchema(product, product.images);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.name, url: `/products/${product.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <Container className="py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: product.name, href: `/products/${product.slug}` },
          ]}
        />
      </Container>

      <Container className="py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Carousel */}
          <div>
            <ImageCarousel images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div>
            {/* Tier Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {product.tier.name} Tier
            </div>

            <Heading as="h1" variant="h1" className="mb-4">
              {product.name}
            </Heading>

            <Text variant="large" className="text-neutral-600 mb-6">
              {product.shortDescription}
            </Text>

            {/* Price */}
            <div className="mb-8 p-6 bg-neutral-50 rounded-lg">
              <Text variant="small" className="text-neutral-600 mb-1">
                Starting at
              </Text>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-neutral-900">
                  {formatPrice(product.basePrice)}
                </span>
              </div>
              <Text variant="small" className="text-neutral-500 mt-2">
                Final price may vary based on customization
              </Text>
            </div>

            {/* CTAs */}
            <div className="space-y-3 mb-8">
              <Button
                variant="primary"
                size="lg"
                href={`/configurator?template=${product.slug}`}
                className="w-full"
              >
                Customize This Design
              </Button>
              <Button
                variant="secondary"
                size="lg"
                href="/contact"
                className="w-full"
              >
                Request a Quote
              </Button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <Text variant="caption" className="text-neutral-500">
                    Age Range
                  </Text>
                  <Text
                    variant="small"
                    weight="semibold"
                    className="text-neutral-900"
                  >
                    {product.ageRange}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <Text variant="caption" className="text-neutral-500">
                    Capacity
                  </Text>
                  <Text
                    variant="small"
                    weight="semibold"
                    className="text-neutral-900"
                  >
                    {product.capacity} kids
                  </Text>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <ProductSpecs product={product} />
          </div>
        </div>

        {/* Description and Features */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Long Description */}
          <div>
            <Heading as="h2" variant="h2" className="mb-6">
              About This Product
            </Heading>
            <div className="prose prose-neutral max-w-none">
              <Text className="text-neutral-700 whitespace-pre-line">
                {product.longDescription}
              </Text>
            </div>
          </div>

          {/* Features */}
          <div>
            <Heading as="h2" variant="h2" className="mb-6">
              Key Features
            </Heading>
            <ul className="space-y-3">
              {product.features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <svg
                      className="w-4 h-4 text-primary-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <Text className="text-neutral-700">{feature}</Text>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Materials and Safety */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <Heading as="h3" variant="h3">
                  Premium Materials
                </Heading>
              </div>
              <Text className="text-neutral-700">
                Crafted from {product.tier.materials.join(', ')} for durability
                and safety. All materials meet or exceed international safety
                standards.
              </Text>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <Heading as="h3" variant="h3">
                  Safety Certified
                </Heading>
              </div>
              <Text className="text-neutral-700">
                Backed by our {product.tier.warrantyStructural}-year structural
                warranty and {product.tier.warrantyHardware}-year hardware
                warranty. Designed with safety as the top priority.
              </Text>
            </div>
          </div>
        </div>
      </Container>

      {/* Related Products */}
      <RelatedProducts products={relatedProducts} />
    </>
  );
}
