/**
 * TypeScript Types for Sanity Documents
 *
 * These types correspond to the Sanity schemas and provide
 * type safety when working with CMS content in the application.
 */

/**
 * Base Sanity document fields
 */
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

/**
 * Sanity image with metadata
 */
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  caption?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

/**
 * Sanity file reference
 */
export interface SanityFile {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

/**
 * Call-to-Action button
 */
export interface CTA {
  text: string;
  href: string;
}

/**
 * Homepage content structure
 */
export interface Homepage extends SanityDocument {
  _type: 'homepage';
  hero: {
    tagline: string;
    headline: string;
    subheadline?: string;
    backgroundImage: SanityImage;
    backgroundVideo?: SanityFile;
    primaryCTA: CTA;
    secondaryCTA?: CTA;
  };
  processFlow: {
    sectionTitle?: string;
    steps: Array<{
      stepNumber: number;
      title: string;
      description: string;
      illustration: SanityImage;
      icon?: string;
    }>;
  };
  valuePropositions: Array<{
    icon: string;
    title: string;
    description: string;
    features: string[];
    image: SanityImage;
    imagePosition: 'left' | 'right';
    cta?: CTA;
  }>;
  ctaSection: {
    title: string;
    description?: string;
    backgroundImage?: SanityImage;
    primaryCTA: CTA;
    secondaryCTA?: CTA;
  };
}

/**
 * Product Tier structure
 */
export interface ProductTier extends SanityDocument {
  _type: 'productTier';
  name: string;
  slug: {
    current: string;
  };
  order: number;
  badge?: string;
  description: string;
  priceRange: {
    min: number;
    max: number;
    currency: 'ZAR' | 'USD' | 'EUR';
  };
  features: string[];
  materials: string[];
  warranty: {
    structural: number;
    hardware: number;
    details?: string;
  };
  image: SanityImage;
  colorAccent?: string;
  specifications?: {
    ageRange?: string;
    maxCapacity?: number;
    weightLimit?: number;
    safetyStandards?: string[];
  };
  published: boolean;
}

/**
 * Gallery Item structure
 */
export interface GalleryItem extends SanityDocument {
  _type: 'galleryItem';
  title: string;
  slug: {
    current: string;
  };
  image: SanityImage;
  thumbnail?: SanityImage;
  additionalImages?: SanityImage[];
  description?: string;
  categories: string[];
  productTier?: {
    _ref: string;
    _type: 'reference';
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  installationDate?: string;
  featured: boolean;
  tags?: string[];
  published: boolean;
  sortOrder: number;
}

/**
 * Testimonial structure
 */
export interface Testimonial extends SanityDocument {
  _type: 'testimonial';
  customerName: string;
  customerTitle?: string;
  customerPhoto?: SanityImage;
  quote: string;
  rating: number;
  location?: string;
  projectImage?: SanityImage;
  productTier?: {
    _ref: string;
    _type: 'reference';
  };
  date: string;
  featured: boolean;
  verified: boolean;
  published: boolean;
  sortOrder: number;
}

/**
 * Union type of all Sanity document types
 */
export type SanityDocumentType =
  | Homepage
  | ProductTier
  | GalleryItem
  | Testimonial;
