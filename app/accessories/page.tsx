'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

interface Accessory {
    name: string;
    price?: string;
    description?: string;
    category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS' | 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES' | 'JUNGLE GYM ACCESSORIES';
    image?: string;
}

const accessories: Accessory[] = [
    // SWING SEATS - BABY SWINGS - HORSE SWINGS
    {
        name: 'SWING SEATS',
        price: 'R 2,800.00',
        description: 'A classic swing seat, which is available in wood or plastic, brightly colored.\nWeight limit 50 KG.',
        category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/SWING SEATS.webp',
    },
    {
        name: 'BABY SWINGS',
        price: 'R 730.00',
        description: 'For the youngest member of your family this structural foam seat features safe one-piece construction.\nIncludes safety belt.',
        category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/BABY SWINGS.webp',
    },
    {
        name: 'HORSE SWINGS',
        price: 'Contact for price',
        description: 'This is a favourite with all kids as it stimulates their role play.',
        category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/HORSE SWINGS.webp',
    },
    // DRUM SWINGS - SMALL SLIDES - LARGE SLIDES
    {
        name: 'DRUM SWINGS',
        price: 'R 1,200.00',
        description: 'This kind of swing enables playtime for multiple children. It works to complete a jungle gym... encouraging sociable play and fun.',
        category: 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/DRUM SWINGS.webp',
    },
    {
        name: 'SMALL SLIDE',
        price: 'R 2,400.00',
        description: 'The small slide option is great for younger children. This offers hours of fun and excitement for your kids.',
        category: 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/SMALL SLIDE.webp',
    },
    {
        name: 'LARGE SLIDE',
        price: 'R 3,950.00',
        description: 'Slides encourage activity and imagination. Your children will have heaps of fun on our slides and will keep themselves entertained for hours on end.',
        category: 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/LARGE SLIDE.webp',
    },
    // JUNGLE GYM ACCESSORIES
    {
        name: 'MONKEY BARS',
        price: 'R 2,000.00',
        description: 'Build upper body strength.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/MONKEY BARS.webp',
    },
    {
        name: 'COMMANDO NET',
        price: 'R 1,100.00',
        description: 'Adventurous climbing challenge.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/COMMANDO NET.webp',
    },
    {
        name: 'LADDER',
        price: 'Contact for price',
        description: 'Standard access ladder.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/LADDER.webp',
    },
    {
        name: 'WHEEL LADDER',
        price: 'Contact for price',
        description: 'Fun wheel climbing ladder.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/WHEEL LADDER.webp',
    },
    {
        name: 'FIREMAN POLE',
        price: 'Contact for price',
        description: 'Quick exit from the tower.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/FIREMAN POLE.webp',
    },
    {
        name: 'BRIDGE',
        price: 'Contact for price',
        description: 'Connect towers together.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/BRIDGE.webp',
    },
    {
        name: 'CATWALK',
        price: 'Contact for price',
        description: 'Elevated walkway between structures.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/CATWALK.webp',
    },
    {
        name: 'TYRE BALL',
        price: 'Contact for price',
        description: 'Fun swinging tyre.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/TYRE BALL.webp',
    },
    {
        name: 'ROOF',
        price: 'Contact for price',
        description: 'Shade and weather protection.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/ROOF.webp',
    },
    {
        name: 'TOWER (NO ROOF)',
        price: 'Contact for price',
        description: 'Open-top tower structure.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/TOWER (no roof).webp',
    },
    {
        name: 'TOWER (WITH ROOF)',
        price: 'Contact for price',
        description: 'Standalone tower with shelter.',
        category: 'JUNGLE GYM ACCESSORIES',
        image: '/images/Accessories/TOWER (with roof).webp',
    },
];

export default function AccessoriesPage() {
    const categories = [
        'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        'JUNGLE GYM ACCESSORIES'
    ] as const;

    return (
        <main className="min-h-screen pt-24 pb-16 bg-[#1a1a2e]">
            <Container>
                <div className="text-center mb-16">
                    <Heading as="h1" variant="h1" className="mb-6 text-white">
                        Jungle Gym Accessories
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-300">
                        Enhance your jungle gym with our wide range of high-quality accessories.
                    </Text>
                </div>

                <div className="space-y-12">
                    {categories.map((category) => {
                        const categoryItems = accessories.filter((item) => item.category === category);

                        return (
                            <div key={category} className="border-2 border-orange-400 bg-white">
                                {/* Section Header */}
                                <div className="bg-[#1a1a2e] text-orange-400 text-center py-2 border-b-2 border-orange-400 font-bold text-xl uppercase tracking-wide">
                                    {category}
                                </div>

                                {/* Items Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-neutral-300">
                                    {categoryItems.map((item) => (
                                        <div key={item.name} className="flex flex-col h-full">
                                            {/* Image */}
                                            <div className="relative h-64 w-full bg-white border-b border-orange-300">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain p-2"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                )}
                                            </div>

                                            {/* Item Name */}
                                            <div className="text-center py-1 font-bold text-orange-500 text-lg uppercase tracking-wide border-b border-neutral-300">
                                                {item.name}
                                            </div>

                                            {/* Description */}
                                            <div className="text-center p-4 text-sm text-[#1a1a2e] flex-grow flex items-center justify-center">
                                                <p className="whitespace-pre-line leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-16 text-center">
                    <Link href="/contact">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white border-none rounded-none px-8 uppercase font-bold tracking-wider">
                            Contact Us to Order
                        </Button>
                    </Link>
                </div>
            </Container>
        </main>
    );
}
