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
    category: 'Swings' | 'Slides' | 'Climbing' | 'Add-ons' | 'Structures';
    image?: string;
}

const accessories: Accessory[] = [
    // Swings
    {
        name: 'Double Swing',
        price: 'R 2,800.00',
        description: 'Encourages sociable play between children.',
        category: 'Swings',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/epsilon_a_improve_the_quality_.webp',
    },
    {
        name: 'Baby Swing Seat',
        price: 'R 730.00',
        description: 'Safe and secure seat for toddlers.',
        category: 'Swings',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/20260124_2014_Image Generation_remix_01kfrkbvc8ez7ssxse5j6b21ss.webp',
    },
    {
        name: 'Tyre Horse Swing',
        price: 'Contact for price',
        description: 'Fun horse-shaped tyre swing.',
        category: 'Swings',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/epsilon-fast_b_improve_the_quality_.webp',
    },
    // Slides
    {
        name: '3m Fibreglass Jumbo Slide',
        price: 'R 3,950.00',
        description: 'Large slide for maximum fun.',
        category: 'Slides',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/chatgpt-image-latest-high-fidelity-20251216_b_improve_the_quality_ (1).webp',
    },
    {
        name: 'Junior Jumbo Slide',
        price: 'R 2,400.00',
        description: 'Perfect for smaller children.',
        category: 'Slides',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/20260124_2016_Red Playground Slide_remix_01kfrkga7pe0wsvwfd2xd3rbq1.webp',
    },
    {
        name: 'Straight Slide',
        price: 'Contact for price',
        description: 'Classic straight design.',
        category: 'Slides',
        image: '/images/Accessories/Acc-straightslide.png',
    },
    // Climbing
    {
        name: 'Monkey Bars',
        price: 'R 2,000.00',
        description: 'Build upper body strength.',
        category: 'Climbing',
        image: '/images/Accessories/Acc-monkeybars.png',
    },
    {
        name: 'Commando Climbing Net',
        price: 'R 1,100.00',
        description: 'Adventurous climbing challenge.',
        category: 'Climbing',
        image: '/images/CLIMBING NETS/20260124_2021_Image Generation_remix_01kfrksvddee1vda8b1z7hv5ef.webp',
    },
    {
        name: 'Ladder',
        price: 'Contact for price',
        description: 'Standard access ladder.',
        category: 'Climbing',
        image: '/images/Accessories/Acc-ladder.png',
    },
    {
        name: 'Wheel Ladder',
        price: 'Contact for price',
        description: 'Fun wheel climbing ladder.',
        category: 'Climbing',
        image: '/images/Accessories/Acc-wheelladder.png',
    },
    {
        name: 'Fireman Pole',
        price: 'Contact for price',
        description: 'Quick exit from the tower.',
        category: 'Climbing',
        image: '/images/Accessories/Acc-firemanpole.png',
    },
    // Add-ons
    {
        name: 'Single Drum with steering wheel',
        price: 'R 1,200.00',
        description: 'Imaginative play station.',
        category: 'Add-ons',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/chatgpt-image-latest-high-fidelity-20251216_b_improve_the_quality_.webp',
    },
    {
        name: 'Double Drum with 2 steering wheels',
        price: 'R 1,960.00',
        description: 'Double the fun!',
        category: 'Add-ons',
        image: '/images/Accessories/Acc-drum.png',
    },
    {
        name: 'Bridge',
        price: 'Contact for price',
        description: 'Connect towers together.',
        category: 'Add-ons',
        image: '/images/Accessories/Acc-bridge.png',
    },
    {
        name: 'Catwalk',
        price: 'Contact for price',
        description: 'Elevated walkway between structures.',
        category: 'Add-ons',
        image: '/images/Accessories/Acc-catwalk.png',
    },
    {
        name: 'Tyre Ball',
        price: 'Contact for price',
        description: 'Fun swinging tyre.',
        category: 'Add-ons',
        image: '/images/Accessories/Acc-tyreball.png',
    },
    {
        name: 'See-Saw',
        price: 'Contact for price',
        description: 'Classic playground favourite.',
        category: 'Add-ons',
        image: '/images/Accessories/Acc-seasaw.png',
    },
    {
        name: 'Roof',
        price: 'Contact for price',
        description: 'Shade and weather protection.',
        category: 'Add-ons',
        image: '/images/Accessories/Acc-roof.png',
    },
    // Structures
    {
        name: 'Tower (with roof)',
        price: 'Contact for price',
        description: 'Standalone tower with shelter.',
        category: 'Structures',
        image: '/images/Accessories/Acc-tower-withroof.png',
    },
    {
        name: 'Tower (without roof)',
        price: 'Contact for price',
        description: 'Open-top tower structure.',
        category: 'Structures',
        image: '/images/Accessories/Acc-tower-noroof.png',
    },
];

export default function AccessoriesPage() {
    const categories = ['Swings', 'Slides', 'Climbing', 'Structures', 'Add-ons'] as const;

    return (
        <main className="min-h-screen pt-24 pb-16">
            <Container>
                <div className="text-center mb-16">
                    <Heading as="h1" variant="h1" className="mb-6">
                        Jungle Gym Accessories
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-600">
                        Enhance your jungle gym with our wide range of high-quality accessories. From swings and slides to climbing nets and towers, we have everything to make playtime extra special.
                    </Text>
                </div>

                <div className="grid gap-16">
                    {categories.map((category) => {
                        const categoryItems = accessories.filter((item) => item.category === category);
                        if (categoryItems.length === 0) return null;

                        return (
                            <div key={category}>
                                <Heading as="h2" variant="h3" className="mb-8 border-b border-neutral-200 pb-2">
                                    {category}
                                </Heading>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {categoryItems.map((item) => (
                                        <div
                                            key={item.name}
                                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-lg transition-shadow group"
                                        >
                                            {item.image && (
                                                <div className="relative h-48 bg-neutral-50 overflow-hidden">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <Heading as="h3" variant="h4" className="mb-2">
                                                    {item.name}
                                                </Heading>
                                                {item.description && (
                                                    <Text className="text-neutral-500 text-sm mb-4">
                                                        {item.description}
                                                    </Text>
                                                )}
                                                <div className="flex items-center justify-between">
                                                    <span className="text-primary-600 font-bold text-lg">
                                                        {item.price}
                                                    </span>
                                                    <Link href="/contact">
                                                        <Button size="sm" variant="outline">
                                                            Enquire
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20 bg-primary-50 rounded-2xl p-8 md:p-12 text-center">
                    <ShoppingBag className="w-12 h-12 text-primary-600 mx-auto mb-6" />
                    <Heading as="h2" variant="h2" className="mb-4">
                        Ready to Order?
                    </Heading>
                    <Text className="mb-8 max-w-2xl mx-auto">
                        Contact us today to discuss your accessory requirements. We can advise on compatibility and installation.
                    </Text>
                    <Link href="/contact">
                        <Button size="lg">Contact Us</Button>
                    </Link>
                </div>
            </Container>
        </main>
    );
}
