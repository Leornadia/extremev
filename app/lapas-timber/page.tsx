'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Flame, Home, Fence, Construction, TreeDeciduous } from 'lucide-react';

export default function LapasTimberPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <Container>
                <div className="text-center mb-16">
                    <Heading as="h1" variant="h1" className="mb-6">
                        Thatch, Lapas & Timber
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-600">
                        Beyond jungle gyms, we are experts in thatching and premium timber supplies.
                    </Text>
                </div>

                {/* Thatch & Lapas Section */}
                <div className="mb-24">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-neutral-100 flex flex-col md:flex-row">
                        <div className="md:w-1/2 min-h-[400px] relative">
                            <Image
                                src="/images/Tach and Lapa/chatgpt-image-latest-high-fidelity-20251216_b_improve_the_quality_ (1).webp"
                                alt="Professional lapa construction with thatched roof"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold mb-6 w-fit">
                                <Flame className="w-4 h-4" />
                                <span>Thatching Experts</span>
                            </div>

                            <Heading as="h2" variant="h2" className="mb-6">
                                Thatch & Lapas
                            </Heading>

                            <Text className="text-neutral-600 mb-6 leading-relaxed">
                                We are a well-known and respected thatching company serving corporate clients, domestic homes, rest camps, and game farms. Our team offers highly personalised service, professional advice, and custom designs to suit your specific needs.
                            </Text>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <span className="text-neutral-700">All materials are SABS approved</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <span className="text-neutral-700">Advanced fire retardant treatment available</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <ShieldCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    <span className="text-neutral-700">5-year guarantee certificate included</span>
                                </li>
                            </ul>

                            <Link href="/contact">
                                <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50">
                                    Get a Quote
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Poles & Timber Section */}
                <div>
                    <div className="bg-neutral-900 rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row-reverse text-white">
                        <div className="md:w-1/2 min-h-[400px] relative">
                            <Image
                                src="/images/Tach and Lapa/b_improve_the_quality_.webp"
                                alt="Beautiful thatched roof house showcasing quality timber and thatch work"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>

                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-700 text-stone-200 text-sm font-semibold mb-6 w-fit">
                                <Construction className="w-4 h-4" />
                                <span>Timber Supply</span>
                            </div>

                            <Heading as="h2" variant="h2" className="mb-6 text-white">
                                Poles & Timber
                            </Heading>

                            <Text className="text-neutral-300 mb-6 leading-relaxed">
                                We supply high-quality H4 treated Gum poles and timber. Our H4 treatment ensures your timber lasts 5x longer than standard H3 treated timber, making it perfect for long-term outdoor use.
                            </Text>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <Fence className="w-6 h-6 text-stone-300 mb-2" />
                                    <h4 className="font-bold mb-1">Fencing</h4>
                                    <p className="text-sm text-neutral-400">Durable poles for all fencing needs</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <Construction className="w-6 h-6 text-stone-300 mb-2" />
                                    <h4 className="font-bold mb-1">Building</h4>
                                    <p className="text-sm text-neutral-400">Structural timber, droppers & transmission poles</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <Home className="w-6 h-6 text-stone-300 mb-2" />
                                    <h4 className="font-bold mb-1">Decking</h4>
                                    <p className="text-sm text-neutral-400">Premium sawn timber for decks</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <ShieldCheck className="w-6 h-6 text-stone-300 mb-2" />
                                    <h4 className="font-bold mb-1">SABS Approved</h4>
                                    <p className="text-sm text-neutral-400">Certified quality you can trust</p>
                                </div>
                            </div>

                            <Link href="/contact">
                                <Button className="bg-white text-neutral-900 hover:bg-neutral-200 border-none">
                                    Enquire Stock
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </Container>
        </main>
    );
}

