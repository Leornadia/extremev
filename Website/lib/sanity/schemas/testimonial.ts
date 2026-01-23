/**
 * Testimonial Schema
 *
 * Defines the structure for customer testimonials and reviews.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const testimonialSchema = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      description: 'Name of the customer providing the testimonial',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'customerTitle',
      title: 'Customer Title/Role',
      type: 'string',
      description: 'e.g., "Parent of 3", "School Principal", "Homeowner"',
    },
    {
      name: 'customerPhoto',
      title: 'Customer Photo',
      type: 'image',
      description: 'Photo of the customer (optional)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'text',
      description: 'The customer testimonial text',
      validation: (Rule: any) => Rule.required().max(500),
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Star rating (1-5)',
      validation: (Rule: any) => Rule.required().min(1).max(5),
      initialValue: 5,
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Customer location (e.g., "Cape Town, South Africa")',
    },
    {
      name: 'projectImage',
      title: 'Project Image',
      type: 'image',
      description: "Image of the customer's playground (optional)",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        },
      ],
    },
    {
      name: 'productTier',
      title: 'Product Tier',
      type: 'reference',
      to: [{ type: 'productTier' }],
      description: 'Associated product tier (optional)',
    },
    {
      name: 'date',
      title: 'Testimonial Date',
      type: 'date',
      description: 'When the testimonial was received',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show this testimonial prominently on homepage',
      initialValue: false,
    },
    {
      name: 'verified',
      title: 'Verified Purchase',
      type: 'boolean',
      description: 'Mark as verified customer',
      initialValue: true,
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Show this testimonial on the website',
      initialValue: true,
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Manual sort order (lower numbers appear first)',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Date (Newest First)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Rating (Highest First)',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Featured First',
      name: 'featured',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'date', direction: 'desc' },
      ],
    },
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'quote',
      media: 'customerPhoto',
      rating: 'rating',
      featured: 'featured',
    },
    prepare(selection: any) {
      const { title, subtitle, media, rating, featured } = selection;
      const stars = '⭐'.repeat(rating || 0);
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: `${stars} - ${subtitle?.substring(0, 60)}...`,
        media,
      };
    },
  },
};
