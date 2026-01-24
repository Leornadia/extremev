'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { SectionDivider } from '@/components/decorative';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface Accessory {
    name: string;
    price?: string;
    description?: string;
    category: 'Swings' | 'Slides' | 'Climbing' | 'Add-ons';
}

const accessories: Accessory[] = [
    {
        name: 'Double Swing',
        price: 'R 2,800.00',
        description: 'Encourages sociable play between children.',
        category: 'Swings',
    },
    {
        name: '3m Fibreglass Jumbo Slide',
        price: 'R 3,950.00',
        category: 'Slides',
    },
    {
        name: 'Junior Jumbo Slide',
        price: 'R 2,400.00',
        category: 'Slides',
    },
    {
        name: 'Monkey Bars',
        price: 'R 2,000.00',
        category: 'Climbing',
    },
    {
        name: 'Commando Climbing Net',
        price: 'R 1,100.00',
        category: 'Climbing',
    },
    {
        name: 'Wall Climbing Grips',
        price: 'R 170.00 each',
        category: 'Climbing',
    },
    {
        name: 'Sand Pit (1.8m x 1.8m)',
        price: 'R 2,250.00',
        category: 'Add-ons',
    },
    {
        name: 'Baby Swing Seat',
        price: 'R 730.00',
        category: 'Swings',
    },
    {
        name: 'Single Drum with double steering wheel',
        price: 'R 1,200.00',
        category: 'Add-ons',
    },
    {
        name: 'Double Drum with 2 steering wheels',
        price: 'R 1,960.00',
        category: 'Add-ons',
    },
];

const otherItems = [
    'Bridge',
    'Catwalk',
    'Tower (with and without roof)',
    'Tyre Ball',
    'Roof',
    'See-Saw',
    'Straight Slide',
];

export default function AccessoriesPage() {
    const categories = Array.from(new Set(accessories.map((a) => a.category)));

    return (
        <main className="min-h-screen pt-24 pb-16">
            <Container>
                <div className="text-center mb-16">
                    <Heading as="h1" variant="h1" className="mb-6">
                        Jungle Gym Accessories
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-600">
                        Enhance your jungle gym with our wide range of high-quality accessories. From swings and slides to climbing nets and sandpits, we have everything to make playtime extra special.
                    </Text>
                </div>

                <div className="grid gap-16">
                    {categories.map((category) => (
                        <div key={category}>
                            <Heading as="h2" variant="h3" className="mb-8 border-b border-neutral-200 pb-2">
                                {category}
                            </Heading>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {accessories
                                    .filter((item) => item.category === category)
                                    .map((item) => (
                                        <div
                                            key={item.name}
                                            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow"
                                        >
                                            <Heading as="h3" variant="h4" className="mb-2">
                                                {item.name}
                                            </Heading>
                                            {item.description && (
                                                <Text className="text-neutral-500 text-sm mb-4">
                                                    {item.description}
                                                </Text>
                                            )}
                                            <div className="mt-4 flex items-center justify-between">
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
                                    ))}
                            </div>
                        </div>
                    ))}

                    {/* Other Items Section */}
                    <div>
                        <Heading as="h2" variant="h3" className="mb-8 border-b border-neutral-200 pb-2">
                            Other Available Items
                        </Heading>
                        <div className="flex flex-wrap gap-4">
                            {otherItems.map((item) => (
                                <span
                                    key={item}
                                    className="px-4 py-2 bg-neutral-50 rounded-full text-neutral-700 border border-neutral-200 font-medium"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
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
