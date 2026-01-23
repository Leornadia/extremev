import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  canonical?: string;
}

const siteConfig = {
  name: 'Extreme V',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.extremev.co.za',
  ogImage: '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
  description:
    'Design and build your dream playground with Extreme V. Premium quality jungle gyms, custom configurations, and expert installation across South Africa.',
  keywords: [
    'jungle gym',
    'playground equipment',
    'outdoor play',
    'custom playground',
    'South Africa',
    'jungle gym configurator',
    'playground design',
    'kids outdoor equipment',
  ],
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    ogImage,
    ogType = 'website',
    noindex = false,
    canonical,
  } = config;

  const fullTitle = title.includes('Extreme V')
    ? title
    : `${title} | ${siteConfig.name}`;

  const url = canonical || siteConfig.url;
  const imageUrl = ogImage
    ? `${siteConfig.url}${ogImage}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords].join(', '),
    authors: [{ name: 'Extreme V' }],
    creator: 'Extreme V',
    publisher: 'Extreme V',
    robots: noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      locale: 'en_ZA',
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: '@extremev',
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  };
}

export { siteConfig };
