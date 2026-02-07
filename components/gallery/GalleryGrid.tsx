'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { responsiveSizes } from '@/lib/image-utils';
import { GalleryFilter } from './GalleryFilter';
import { Lightbox } from './Lightbox';

export interface GalleryItem {
  id: string;
  image: string;
  thumbnail: string;
  title: string;
  category: string[];
  productTier?: string;
  location?: string;
  description?: string;
}

const galleryImage = (file: string) =>
  `/images/gallery/${file}`;

// Sample gallery data - in production, this would come from a CMS or database
const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    image: galleryImage('Backyard with In-ground Trampoline and Playground.webp'),
    thumbnail: galleryImage('Backyard with In-ground Trampoline and Playground.webp'),
    title: 'Premium Backyard Paradise',
    category: ['Jungle Gym', 'Slides'],
    productTier: 'Premium',
    location: 'Cape Town',
    description:
      'A beautiful premium jungle gym installation featuring multiple slides and climbing areas.',
  },
  {
    id: '2',
    image: galleryImage('Kids Playing in the jungle gym2.webp'),
    thumbnail: galleryImage('Kids Playing in the jungle gym2.webp'),
    title: 'Adventure Playset',
    category: ['Jungle Gym', 'Swings'],
    productTier: 'Premium',
    location: 'Johannesburg',
    description:
      'Complete adventure playset with swings and multiple play areas.',
  },
  {
    id: '3',
    image: galleryImage('Children Playing on a Wooden Jungle Gym with a Green Slide.webp'),
    thumbnail: galleryImage('Children Playing on a Wooden Jungle Gym with a Green Slide.webp'),
    title: 'Family Fun Zone',
    category: ['Jungle Gym'],
    productTier: 'Essential',
    location: 'Durban',
    description: 'Perfect family-sized jungle gym for hours of outdoor fun.',
  },
  {
    id: '4',
    image: galleryImage('Colorful Barrel Crawl Tunnel on a Sand Playground.webp'),
    thumbnail: galleryImage('Colorful Barrel Crawl Tunnel on a Sand Playground.webp'),
    title: 'Barrel Crawl Adventure',
    category: ['Slides'],
    productTier: 'Premium',
    location: 'Pretoria',
    description: 'Exciting barrel tunnel feature for endless entertainment.',
  },
  {
    id: '5',
    image: galleryImage('Outdoor Wooden Climbing Frame with Rock Wall and Monkey Bars.webp'),
    thumbnail: galleryImage('Outdoor Wooden Climbing Frame with Rock Wall and Monkey Bars.webp'),
    title: 'Wooden Wonder',
    category: ['Jungle Gym', 'Accessories'],
    productTier: 'Luxury',
    location: 'Cape Town',
    description:
      'Luxury wooden jungle gym with premium finishes and accessories.',
  },
  {
    id: '6',
    image: galleryImage('494936990_1331187581913558_6916942041237400274_n.webp'),
    thumbnail: galleryImage('494936990_1331187581913558_6916942041237400274_n.webp'),
    title: 'Classic Design',
    category: ['Jungle Gym'],
    productTier: 'Essential',
    location: 'Port Elizabeth',
    description: 'Timeless jungle gym design perfect for any backyard.',
  },
  {
    id: '7',
    image: galleryImage('Outdoor Entertainment Area with a Thatched Roof and Bar.webp'),
    thumbnail: galleryImage('Outdoor Entertainment Area with a Thatched Roof and Bar.webp'),
    title: 'Multi-Level Play',
    category: ['Jungle Gym', 'Slides'],
    productTier: 'Premium',
    location: 'Bloemfontein',
    description: 'Multi-level entertainment space with integrated play zones.',
  },
  {
    id: '8',
    image: galleryImage('Red Wooden Playset with Yellow Slide and Sandpit.webp'),
    thumbnail: galleryImage('Red Wooden Playset with Yellow Slide and Sandpit.webp'),
    title: 'Modern Playset',
    category: ['Jungle Gym', 'Swings'],
    productTier: 'Premium',
    location: 'Stellenbosch',
    description: 'Contemporary design with swings and climbing features.',
  },
];

export function GalleryGrid() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'tier'>('recent');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let items = [...GALLERY_ITEMS];

    // Apply category filter
    if (selectedCategories.length > 0) {
      items = items.filter((item) =>
        item.category.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Apply tier filter
    if (selectedTiers.length > 0) {
      items = items.filter(
        (item) => item.productTier && selectedTiers.includes(item.productTier)
      );
    }

    // Apply sorting
    if (sortBy === 'tier') {
      const tierOrder = { Essential: 1, Premium: 2, Luxury: 3 };
      items.sort((a, b) => {
        const tierA = tierOrder[a.productTier as keyof typeof tierOrder] || 0;
        const tierB = tierOrder[b.productTier as keyof typeof tierOrder] || 0;
        return tierA - tierB;
      });
    }
    // 'recent' and 'popular' would use actual data in production

    return items;
  }, [selectedCategories, selectedTiers, sortBy]);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;

    if (direction === 'prev') {
      setLightboxIndex(
        lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1
      );
    } else {
      setLightboxIndex(
        lightboxIndex === filteredItems.length - 1 ? 0 : lightboxIndex + 1
      );
    }
  };

  return (
    <div>
      <GalleryFilter
        selectedCategories={selectedCategories}
        selectedTiers={selectedTiers}
        sortBy={sortBy}
        onCategoryChange={setSelectedCategories}
        onTierChange={setSelectedTiers}
        onSortChange={setSortBy}
      />

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item, index) => (
          <div
            key={item.id}
            className="break-inside-avoid group cursor-pointer"
            onClick={() => handleImageClick(index)}
          >
            <div className="relative overflow-hidden rounded-lg bg-neutral-100 shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  sizes={responsiveSizes.gallery}
                  className="object-cover"
                  loading="lazy"
                  quality={80}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    {item.location && (
                      <p className="text-sm text-white/90">{item.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tier badge */}
              {item.productTier && (
                <div className="absolute top-3 right-3">
                  <span
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium shadow-md',
                      item.productTier === 'Essential' &&
                      'bg-blue-500 text-white',
                      item.productTier === 'Premium' &&
                      'bg-primary-500 text-white',
                      item.productTier === 'Luxury' && 'bg-amber-500 text-white'
                    )}
                  >
                    {item.productTier}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-neutral-500 text-lg">
            No items match your filters. Try adjusting your selection.
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          item={filteredItems[lightboxIndex]}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigate}
          currentIndex={lightboxIndex}
          totalItems={filteredItems.length}
        />
      )}
    </div>
  );
}
