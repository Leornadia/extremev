'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
    Shield,
    CheckCircle,
    Clock,
    Wrench,
    Phone,
    MessageCircle,
    AlertCircle
} from 'lucide-react';

const warrantyCovers = [
    'Structural integrity of all wooden components',
    'Connection brackets and hardware',
    'Defects in materials or workmanship',
    'H4 treatment effectiveness',
    'Fibreglass slides (manufacturing defects)',
];

const warrantyDoesNotCover = [
    'Normal wear and tear',
    'Damage from improper use or overloading',
    'Damage from extreme weather events',
    'Modifications made after purchase',
    'Failure to follow assembly instructions',
    'Commercial use (unless specified)',
];

const maintenanceTips = [
    {
        title: 'Regular Inspection',
        description: 'Check all bolts, brackets, and connections monthly. Tighten any loose components.',
    },
    {
        title: 'Cleaning',
        description: 'Clean surfaces with mild soap and water. Avoid harsh chemicals that may damage the wood treatment.',
    },
    {
        title: 'Wood Treatment',
        description: 'Apply a water-based wood sealant annually to maintain protection and appearance.',
    },
    {
        title: 'Hardware Check',
        description: 'Inspect chains, swing seats, and moving parts for wear. Replace if showing signs of damage.',
    },
];

export default function WarrantyPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <Container>
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 text-primary-600 mb-6">
                        <Shield className="w-10 h-10" />
                    </div>
                    <Heading as="h1" variant="h1" className="mb-6">
                        Warranty Information
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-600">
                        We stand behind the quality of our products with comprehensive warranty coverage.
                    </Text>
                </div>

                {/* Warranty Overview */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12 mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-5xl font-bold text-primary-600 mb-2">5</div>
                            <Text className="text-neutral-700 font-semibold">Year Structural Warranty</Text>
                            <Text className="text-neutral-600 text-sm mt-2">On all wooden components and hardware</Text>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-secondary-500 mb-2">H4</div>
                            <Text className="text-neutral-700 font-semibold">Treatment Guarantee</Text>
                            <Text className="text-neutral-600 text-sm mt-2">Lasts 5x longer than H3 treated timber</Text>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-accent-teal mb-2">SABS</div>
                            <Text className="text-neutral-700 font-semibold">Approved Materials</Text>
                            <Text className="text-neutral-600 text-sm mt-2">All materials meet industry standards</Text>
                        </div>
                    </div>
                </div>

                {/* What's Covered */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <Heading as="h2" variant="h3">What's Covered</Heading>
                        </div>
                        <ul className="space-y-4">
                            {warrantyCovers.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <Text className="text-neutral-700">{item}</Text>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertCircle className="w-8 h-8 text-amber-500" />
                            <Heading as="h2" variant="h3">What's Not Covered</Heading>
                        </div>
                        <ul className="space-y-4">
                            {warrantyDoesNotCover.map((item) => (
                                <li key={item} className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <Text className="text-neutral-700">{item}</Text>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Maintenance Tips */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <Wrench className="w-8 h-8 text-primary-600" />
                        <Heading as="h2" variant="h2">Maintenance Tips</Heading>
                    </div>
                    <Text className="text-neutral-600 mb-8 max-w-2xl">
                        Proper maintenance will extend the life of your jungle gym and keep it looking great for years to come. We offer a minimal-fee maintenance service if you prefer professional care.
                    </Text>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {maintenanceTips.map((tip) => (
                            <div key={tip.title} className="bg-neutral-50 rounded-xl p-6">
                                <Heading as="h3" variant="h4" className="mb-2">
                                    {tip.title}
                                </Heading>
                                <Text className="text-neutral-600">
                                    {tip.description}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Warranty Claim */}
                <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Heading as="h2" variant="h2" className="mb-6 text-white">
                                Need to Make a Claim?
                            </Heading>
                            <Text className="text-neutral-300 mb-6">
                                If you believe you have a warranty issue, please contact us with:
                            </Text>
                            <ul className="space-y-3 mb-8">
                                {['Your original order number or invoice', 'Photos showing the issue', 'Description of the problem', 'Date you first noticed the issue'].map((item) => (
                                    <li key={item} className="flex items-center gap-3 text-neutral-200">
                                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <Heading as="h3" variant="h3" className="mb-4 text-white">
                                Contact Our Support Team
                            </Heading>
                            <div className="space-y-4 mb-6">
                                <a href="tel:+27117023155" className="flex items-center gap-3 text-white hover:text-primary-300 transition-colors">
                                    <Phone className="w-5 h-5" />
                                    <span>+27 11 702 3155</span>
                                </a>
                                <a href="https://wa.me/27737707679" className="flex items-center gap-3 text-white hover:text-primary-300 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>WhatsApp: +27 73 770 7679</span>
                                </a>
                            </div>
                            <Link href="/contact">
                                <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100">
                                    Submit a Claim
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
