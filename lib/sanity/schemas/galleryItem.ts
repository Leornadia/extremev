/**
 * Gallery Item Schema
 *
 * Defines the structure for gallery items showcasing installed
 * playground equipment with project details and metadata.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const galleryItemSchema = {
  name: 'galleryItem',
  title: 'Gallery Item',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description: 'Name or description of the project',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Main Image',
      type: 'image',
      description: 'Primary project photo',
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
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      description:
        'Optimized thumbnail for grid display (optional, will use main image if not provided)',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'additionalImages',
      title: 'Additional Images',
      type: 'array',
      of: [
        {
          type: 'image',
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
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
      description: 'Additional project photos',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Project description and details',
      validation: (Rule: any) => Rule.max(500),
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Product categories featured (e.g., "Slides", "Swings", "Climbing")',
      options: {
        list: [
          { title: 'Slides', value: 'slides' },
          { title: 'Swings', value: 'swings' },
          { title: 'Climbing', value: 'climbing' },
          { title: 'Playdecks', value: 'playdecks' },
          { title: 'Accessories', value: 'accessories' },
          { title: 'Complete Sets', value: 'complete-sets' },
        ],
      },
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'productTier',
      title: 'Product Tier',
      type: 'reference',
      to: [{ type: 'productTier' }],
      description: 'Associated product tier',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'object',
      fields: [
        {
          name: 'city',
          title: 'City',
          type: 'string',
        },
        {
          name: 'state',
          title: 'State/Province',
          type: 'string',
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
        },
      ],
      description: 'Project location (optional)',
    },
    {
      name: 'installationDate',
      title: 'Installation Date',
      type: 'date',
      description: 'When the project was completed',
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Highlight this project in featured galleries',
      initialValue: false,
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Additional tags for filtering (e.g., "backyard", "school", "park")',
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      description: 'Show this item in the gallery',
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
      title: 'Installation Date (Newest First)',
      name: 'dateDesc',
      by: [{ field: 'installationDate', direction: 'desc' }],
    },
    {
      title: 'Sort Order',
      name: 'sortOrder',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
    {
      title: 'Featured First',
      name: 'featured',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'installationDate', direction: 'desc' },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location.city',
      media: 'image',
      featured: 'featured',
    },
    prepare(selection: any) {
      const { title, subtitle, media, featured } = selection;
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: subtitle || 'No location',
        media,
      };
    },
  },
};
