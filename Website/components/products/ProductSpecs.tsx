interface ProductSpecsProps {
  product: {
    dimensions: unknown;
    ageRange: string;
    capacity: number;
    tier: {
      name: string;
      materials: string[];
      warrantyStructural: number;
      warrantyHardware: number;
    };
  };
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const dimensions = product.dimensions as {
    width: number;
    depth: number;
    height: number;
    unit: string;
  };

  return (
    <div className="bg-neutral-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Specifications
      </h3>

      <dl className="space-y-3">
        <div className="flex justify-between py-2 border-b border-neutral-200">
          <dt className="text-sm font-medium text-neutral-600">Dimensions</dt>
          <dd className="text-sm text-neutral-900">
            {dimensions.width} × {dimensions.depth} × {dimensions.height}{' '}
            {dimensions.unit}
          </dd>
        </div>

        <div className="flex justify-between py-2 border-b border-neutral-200">
          <dt className="text-sm font-medium text-neutral-600">Age Range</dt>
          <dd className="text-sm text-neutral-900">{product.ageRange}</dd>
        </div>

        <div className="flex justify-between py-2 border-b border-neutral-200">
          <dt className="text-sm font-medium text-neutral-600">Capacity</dt>
          <dd className="text-sm text-neutral-900">
            {product.capacity} children
          </dd>
        </div>

        <div className="flex justify-between py-2 border-b border-neutral-200">
          <dt className="text-sm font-medium text-neutral-600">Product Tier</dt>
          <dd className="text-sm text-neutral-900">{product.tier.name}</dd>
        </div>

        <div className="flex justify-between py-2 border-b border-neutral-200">
          <dt className="text-sm font-medium text-neutral-600">Materials</dt>
          <dd className="text-sm text-neutral-900 text-right">
            {product.tier.materials.join(', ')}
          </dd>
        </div>

        <div className="flex justify-between py-2">
          <dt className="text-sm font-medium text-neutral-600">Warranty</dt>
          <dd className="text-sm text-neutral-900">
            {product.tier.warrantyStructural} years structural,{' '}
            {product.tier.warrantyHardware} years hardware
          </dd>
        </div>
      </dl>
    </div>
  );
}
