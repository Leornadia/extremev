/**
 * Sanity Studio Configuration Template
 *
 * NOTE: This file is a template and will show TypeScript errors in this project.
 * It's meant to be copied to a separate Sanity Studio project where the required
 * dependencies (sanity, @sanity/vision) will be installed.
 *
 * This file is a template for setting up Sanity Studio.
 * To use it:
 *
 * 1. Install Sanity Studio CLI globally:
 *    npm install -g @sanity/cli
 *
 * 2. Initialize a new Sanity Studio project:
 *    sanity init
 *
 * 3. Copy this file to your Sanity Studio project as sanity.config.ts
 *
 * 4. Update the projectId and dataset values
 *
 * 5. Run the studio:
 *    sanity dev
 *
 * Alternatively, you can manage content directly through Sanity's web interface
 * at https://www.sanity.io/manage
 */

import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemas } from './schemas';

export default defineConfig({
  name: 'extreme-v-website',
  title: 'Extreme V Website',

  projectId: 'your-project-id', // Replace with your project ID
  dataset: 'production', // or 'development'

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Homepage (singleton)
            S.listItem()
              .title('Homepage')
              .child(
                S.document().schemaType('homepage').documentId('homepage')
              ),

            // Product Tiers
            S.listItem()
              .title('Product Tiers')
              .child(S.documentTypeList('productTier').title('Product Tiers')),

            // Gallery Items
            S.listItem()
              .title('Gallery')
              .child(S.documentTypeList('galleryItem').title('Gallery Items')),

            // Testimonials
            S.listItem()
              .title('Testimonials')
              .child(S.documentTypeList('testimonial').title('Testimonials')),
          ]),
    }),
    visionTool(), // GROQ query testing tool
  ],

  schema: {
    types: schemas,
  },
});
