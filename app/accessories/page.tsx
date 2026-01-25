'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ChevronRight } from 'lucide-react';

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
        description: 'A classic swing seat, which is available in wood or plastic, brightly colored. Weight limit 50 KG.',
        category: 'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        image: '/images/SWING SEATS - BABY SWINGS - HORSE SWINGS/SWING SEATS.webp',
    },
    {
        name: 'BABY SWINGS',
        price: 'R 730.00',
        description: 'For the youngest member of your family this structural foam seat features safe one-piece construction. Includes safety belt.',
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

const categoryDisplayNames: Record<string, string> = {
    'SWING SEATS - BABY SWINGS - HORSE SWINGS': 'Swings Collection',
    'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES': 'Drums & Slides',
    'JUNGLE GYM ACCESSORIES': 'Jungle Gym Accessories',
};

export default function AccessoriesPage() {
    const categories = [
        'SWING SEATS - BABY SWINGS - HORSE SWINGS',
        'DRUM SWINGS - SMALL SLIDES - LARGE SLIDES',
        'JUNGLE GYM ACCESSORIES'
    ] as const;

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

                <Container>
                    <div className="relative text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span>Premium Quality Accessories</span>
                        </div>

                        <Heading as="h1" variant="h1" className="mb-6 text-slate-900">
                            <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                                Jungle Gym Accessories
                            </span>
                        </Heading>

                        <Text variant="large" className="max-w-2xl mx-auto text-slate-600 leading-relaxed">
                            Elevate your children&apos;s play experience with our premium collection of accessories.
                            Each piece is crafted for safety, durability, and endless fun.
                        </Text>
                    </div>
                </Container>
            </section>

            {/* Accessories Sections */}
            <section className="pb-24">
                <Container>
                    <div className="space-y-20">
                        {categories.map((category, categoryIndex) => {
                            const categoryItems = accessories.filter((item) => item.category === category);

                            return (
                                <div key={category} className="relative">
                                    {/* Section Header */}
                                    <div className="flex items-center justify-center mb-12">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                                        <div className="px-8 relative">
                                            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                                {categoryDisplayNames[category] || category}
                                            </h2>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                                    </div>

                                    {/* Items Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {categoryItems.map((item, index) => (
                                            <div
                                                key={item.name}
                                                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 hover:border-amber-200"
                                                style={{
                                                    animationDelay: `${index * 100}ms`,
                                                }}
                                            >
                                                {/* Image Container */}
                                                <div className="relative h-56 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                                                    {item.image && (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                        />
                                                    )}
                                                    {/* Overlay on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>

                                                {/* Content */}
                                                <div className="p-6">
                                                    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors duration-300">
                                                        {item.name}
                                                    </h3>

                                                    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                                        {item.description}
                                                    </p>

                                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                        <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                                                            {item.price}
                                                        </span>
                                                        <Link
                                                            href="/contact"
                                                            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors group/link"
                                                        >
                                                            Enquire
                                                            <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Accent line */}
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Container>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl" />
                </div>

                <Container>
                    <div className="relative text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Enhance Your{' '}
                            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                Jungle Gym?
                            </span>
                        </h2>
                        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                            Contact us today to discuss your accessory requirements. Our team will help you choose the perfect additions for your play structure.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none px-10 py-6 text-lg font-semibold rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300"
                                >
                                    Get a Quote
                                </Button>
                            </Link>
                            <Link href="/products">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg font-semibold rounded-xl transition-all duration-300"
                                >
                                    View Jungle Gyms
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </main>
    );
}
