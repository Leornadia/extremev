import { Heading } from '@/components/ui/Typography';
import { ProductCard } from './ProductCard';
import type { Product, ProductTier } from '@prisma/client';

interface RelatedProductsProps {
  products: (Product & { tier: ProductTier })[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Heading as="h2" className="text-center mb-12">
          Related Products
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
