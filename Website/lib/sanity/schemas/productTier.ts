/**
 * Product Tier Schema
 *
 * Defines the structure for product tier information including
 * pricing ranges, features, materials, and warranty details.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const productTierSchema = {
  name: 'productTier',
  title: 'Product Tier',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Tier Name',
      type: 'string',
      description: 'e.g., "Essential", "Premium", "Luxury"',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which tiers are displayed (1, 2, 3)',
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'badge',
      title: 'Badge (Optional)',
      type: 'string',
      description: 'e.g., "Most Popular", "Best Value"',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of the tier',
      validation: (Rule: any) => Rule.required().max(300),
    },
    {
      name: 'priceRange',
      title: 'Price Range',
      type: 'object',
      fields: [
        {
          name: 'min',
          title: 'Minimum Price',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(0),
        },
        {
          name: 'max',
          title: 'Maximum Price',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(0),
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          options: {
            list: [
              { title: 'ZAR (R)', value: 'ZAR' },
              { title: 'USD ($)', value: 'USD' },
              { title: 'EUR (€)', value: 'EUR' },
            ],
          },
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of features included in this tier',
      validation: (Rule: any) => Rule.required().min(3),
    },
    {
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Materials used in this tier (e.g., "Pine Wood", "Stainless Steel Hardware")',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'warranty',
      title: 'Warranty Information',
      type: 'object',
      fields: [
        {
          name: 'structural',
          title: 'Structural Warranty (Years)',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(0),
        },
        {
          name: 'hardware',
          title: 'Hardware Warranty (Years)',
          type: 'number',
          validation: (Rule: any) => Rule.required().min(0),
        },
        {
          name: 'details',
          title: 'Warranty Details',
          type: 'text',
          description: 'Additional warranty information',
        },
      ],
    },
    {
      name: 'image',
      title: 'Tier Image',
      type: 'image',
      description: 'Representative image for this tier',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'colorAccent',
      title: 'Accent Color',
      type: 'string',
      description: 'Hex color code for tier accent (e.g., #10b981)',
      validation: (Rule: any) => Rule.regex(/^#[0-9A-Fa-f]{6}$/),
    },
    {
      name: 'specifications',
      title: 'Additional Specifications',
      type: 'object',
      fields: [
        {
          name: 'ageRange',
          title: 'Age Range',
          type: 'string',
          description: 'e.g., "3-12 years"',
        },
        {
          name: 'maxCapacity',
          title: 'Maximum Capacity',
          type: 'number',
          description: 'Maximum number of children',
        },
        {
          name: 'weightLimit',
          title: 'Weight Limit (kg)',
          type: 'number',
        },
        {
          name: 'safetyStandards',
          title: 'Safety Standards',
          type: 'array',
          of: [{ type: 'string' }],
          description:
            'Compliance certifications (e.g., "ASTM F1487", "EN 1176")',
        },
      ],
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Show this tier on the website',
      initialValue: true,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'image',
    },
  },
};
