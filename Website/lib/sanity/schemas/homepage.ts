/**
 * Homepage Content Schema
 *
 * Defines the structure for homepage content including hero section,
 * process flow, value propositions, and CTA sections.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const homepageSchema = {
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero Section
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'tagline',
          title: 'Tagline',
          type: 'string',
          description: 'Brand tagline (e.g., "Play is Beautiful")',
          validation: (Rule: any) => Rule.required().max(50),
        },
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
          description: 'Main headline (max 15 words)',
          validation: (Rule: any) => Rule.required().max(100),
        },
        {
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
          description: 'Supporting text below headline',
          validation: (Rule: any) => Rule.max(200),
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
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
          ],
        },
        {
          name: 'backgroundVideo',
          title: 'Background Video (Optional)',
          type: 'file',
          description: 'Video file for hero background',
        },
        {
          name: 'primaryCTA',
          title: 'Primary Call-to-Action',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
        {
          name: 'secondaryCTA',
          title: 'Secondary Call-to-Action',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
            },
          ],
        },
      ],
    },

    // Process Flow Section
    {
      name: 'processFlow',
      title: 'Process Flow Section',
      type: 'object',
      fields: [
        {
          name: 'sectionTitle',
          title: 'Section Title',
          type: 'string',
          description: 'e.g., "3 Steps to Play"',
        },
        {
          name: 'steps',
          title: 'Process Steps',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'stepNumber',
                  title: 'Step Number',
                  type: 'number',
                  validation: (Rule: any) => Rule.required().min(1),
                },
                {
                  name: 'title',
                  title: 'Step Title',
                  type: 'string',
                  description: 'e.g., "Choose It", "Play It"',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'text',
                  validation: (Rule: any) => Rule.max(200),
                },
                {
                  name: 'illustration',
                  title: 'Illustration',
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
                  ],
                },
                {
                  name: 'icon',
                  title: 'Icon (Optional)',
                  type: 'string',
                  description: 'Icon name from Lucide React',
                },
              ],
            },
          ],
          validation: (Rule: any) => Rule.min(3).max(4),
        },
      ],
    },

    // Value Propositions
    {
      name: 'valuePropositions',
      title: 'Value Propositions',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description:
                'Icon name from Lucide React (e.g., "Diamond", "Heart")',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              description: 'e.g., "Premium Products"',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              validation: (Rule: any) => Rule.required().max(300),
            },
            {
              name: 'features',
              title: 'Key Features',
              type: 'array',
              of: [{ type: 'string' }],
              description: 'Bullet points highlighting key features',
            },
            {
              name: 'image',
              title: 'Lifestyle Image',
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
              ],
            },
            {
              name: 'imagePosition',
              title: 'Image Position',
              type: 'string',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Right', value: 'right' },
                ],
              },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'cta',
              title: 'Call-to-Action (Optional)',
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Button Text',
                  type: 'string',
                },
                {
                  name: 'href',
                  title: 'Link URL',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
      validation: (Rule: any) => Rule.min(3).max(3),
    },

    // CTA Section
    {
      name: 'ctaSection',
      title: 'Call-to-Action Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'primaryCTA',
          title: 'Primary Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
          ],
        },
        {
          name: 'secondaryCTA',
          title: 'Secondary Button (Optional)',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
            },
            {
              name: 'href',
              title: 'Link URL',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Content',
      };
    },
  },
};
