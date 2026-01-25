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
    category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS' | 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES' | 'Climbing & Add-ons';
    image?: string;
}

const accessories: Accessory[] = [
    // SWING SEATS - BABY SWINGS - HORSE SWINGS
    {
        name: 'SWING SEATS',
        price: 'R 2,800.00',
        description: 'A classic swing seat, which is available in wood or plastic, brightly colored.\nWeight limit 50 KG.',
        category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/epsilon_a_improve_the_quality_.webp',
    },
    {
        name: 'BABY SWINGS',
        price: 'R 730.00',
        description: 'For the youngest member of your family this structural foam seat features safe one-piece construction.\nIncludes safety belt.',
        category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/20260124_2014_Image Generation_remix_01kfrkbvc8ez7ssxse5j6b21ss.webp',
    },
    {
        name: 'HORSE SWINGS',
        price: 'Contact for price',
        description: 'This is a favourite with all kids as it stimulates their role play.',
        category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/epsilon-fast_b_improve_the_quality_.webp',
    },
    // DRUM SWINGS - SMALL SLIDES - LARGE SLIDES
    {
        name: 'DRUM SWINGS',
        price: 'R 1,200.00',
        description: 'This kind of swing enables playtime for multiple children. It works to complete a jungle gym... encouraging sociable play and fun.',
        category: 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/chatgpt-image-latest-high-fidelity-20251216_b_improve_the_quality_.webp',
    },
    {
        name: 'SMALL SLIDE',
        price: 'R 2,400.00',
        description: 'The small slide option is great for younger children. This offers hours of fun and excitement for your kids.',
        category: 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/20260124_2016_Red Playground Slide_remix_01kfrkga7pe0wsvwfd2xd3rbq1.webp',
    },
    {
        name: 'LARGE SLIDE',
        price: 'R 3,950.00',
        description: 'Slides encourage activity and imagination. Your children will have heaps of fun on our slides and will keep themselves entertained for hours on end.',
        category: 'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/chatgpt-image-latest-high-fidelity-20251216_b_improve_the_quality_ (1).webp',
    },
];

export default function AccessoriesPage() {
    const categories = [
        'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES'
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
