/**
 * GROQ Queries for Sanity Content
 *
 * GROQ (Graph-Relational Object Queries) is Sanity's query language.
 * These queries define how to fetch and shape content from the CMS.
 *
 * Learn more: https://www.sanity.io/docs/groq
 */

/**
 * Query for fetching homepage content
 * Includes all sections: hero, process flow, value propositions, and CTA
 */
export const homepageQuery = `
  *[_type == "homepage"][0] {
    _id,
    _type,
    hero {
      tagline,
      headline,
      subheadline,
      backgroundImage {
        asset->,
        alt
      },
      backgroundVideo {
        asset->
      },
      primaryCTA,
      secondaryCTA
    },
    processFlow {
      sectionTitle,
      steps[] {
        stepNumber,
        title,
        description,
        illustration {
          asset->,
          alt
        },
        icon
      }
    },
    valuePropositions[] {
      icon,
      title,
      description,
      features,
      image {
        asset->,
        alt
      },
      imagePosition,
      cta
    },
    ctaSection {
      title,
      description,
      backgroundImage {
        asset->,
        alt
      },
      primaryCTA,
      secondaryCTA
    }
  }
`;

/**
 * Query for fetching all published product tiers
 * Ordered by display order
 */
export const productTiersQuery = `
  *[_type == "productTier" && published == true] | order(order asc) {
    _id,
    _type,
    name,
    "slug": slug.current,
    order,
    badge,
    description,
    priceRange,
    features,
    materials,
    warranty,
    image {
      asset->,
      alt
    },
    colorAccent,
    specifications,
    published
  }
`;

/**
 * Query for fetching a single product tier by slug
 */
export const productTierBySlugQuery = `
  *[_type == "productTier" && slug.current == $slug && published == true][0] {
    _id,
    _type,
    name,
    "slug": slug.current,
    order,
    badge,
    description,
    priceRange,
    features,
    materials,
    warranty,
    image {
      asset->,
      alt
    },
    colorAccent,
    specifications,
    published
  }
`;

/**
 * Query for fetching all published gallery items
 * Includes product tier reference
 */
export const galleryItemsQuery = `
  *[_type == "galleryItem" && published == true] | order(featured desc, installationDate desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    image {
      asset->,
      alt
    },
    thumbnail {
      asset->,
      alt
    },
    description,
    categories,
    productTier->{
      _id,
      name,
      "slug": slug.current
    },
    location,
    installationDate,
    featured,
    tags,
    published,
    sortOrder
  }
`;

/**
 * Query for fetching gallery items with filters
 * Supports filtering by category and tier
 */
export const filteredGalleryItemsQuery = `
  *[_type == "galleryItem" && published == true 
    && ($category == null || $category in categories)
    && ($tier == null || productTier->slug.current == $tier)
  ] | order(featured desc, installationDate desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    image {
      asset->,
      alt
    },
    thumbnail {
      asset->,
      alt
    },
    description,
    categories,
    productTier->{
      _id,
      name,
      "slug": slug.current
    },
    location,
    installationDate,
    featured,
    tags,
    published,
    sortOrder
  }
`;

/**
 * Query for fetching a single gallery item by slug
 * Includes all images and full details
 */
export const galleryItemBySlugQuery = `
  *[_type == "galleryItem" && slug.current == $slug && published == true][0] {
    _id,
    _type,
    title,
    "slug": slug.current,
    image {
      asset->,
      alt
    },
    thumbnail {
      asset->,
      alt
    },
    additionalImages[] {
      asset->,
      alt,
      caption
    },
    description,
    categories,
    productTier->{
      _id,
      name,
      "slug": slug.current,
      priceRange
    },
    location,
    installationDate,
    featured,
    tags,
    published,
    sortOrder
  }
`;

/**
 * Query for fetching all published testimonials
 * Ordered by featured first, then by date
 */
export const testimonialsQuery = `
  *[_type == "testimonial" && published == true] | order(featured desc, date desc) {
    _id,
    _type,
    customerName,
    customerTitle,
    customerPhoto {
      asset->,
      alt
    },
    quote,
    rating,
    location,
    projectImage {
      asset->,
      alt
    },
    productTier->{
      _id,
      name,
      "slug": slug.current
    },
    date,
    featured,
    verified,
    published,
    sortOrder
  }
`;

/**
 * Query for fetching featured testimonials only
 * Limited to a specific number for homepage display
 */
export const featuredTestimonialsQuery = `
  *[_type == "testimonial" && published == true && featured == true] | order(sortOrder asc, date desc) [0...$limit] {
    _id,
    _type,
    customerName,
    customerTitle,
    customerPhoto {
      asset->,
      alt
    },
    quote,
    rating,
    location,
    projectImage {
      asset->,
      alt
    },
    date,
    featured,
    verified
  }
`;

/**
 * Query for fetching testimonials by tier
 */
export const testimonialsByTierQuery = `
  *[_type == "testimonial" && published == true && productTier->slug.current == $tier] | order(date desc) {
    _id,
    _type,
    customerName,
    customerTitle,
    customerPhoto {
      asset->,
      alt
    },
    quote,
    rating,
    location,
    date,
    verified
  }
`;
