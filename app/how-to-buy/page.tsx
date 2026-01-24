'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
    ShoppingCart,
    CreditCard,
    Truck,
    Shield,
    Clock,
    Wrench,
    CheckCircle,
    Phone,
    MessageCircle
} from 'lucide-react';

const purchaseSteps = [
    {
        icon: <MessageCircle className="w-8 h-8" />,
        title: 'Get in Touch',
        description: 'Contact us via phone, WhatsApp, or email to discuss your requirements. We offer free professional advice on choosing the right jungle gym for your space.',
    },
    {
        icon: <ShoppingCart className="w-8 h-8" />,
        title: 'Choose Your Design',
        description: 'Browse our range of jungle gyms, large jungle gyms, and accessories. We offer both standard designs and custom-made solutions.',
    },
    {
        icon: <CreditCard className="w-8 h-8" />,
        title: 'Place Your Order',
        description: 'Once you\'ve decided, place your order with a deposit. We offer lay-by options to make your purchase more affordable.',
    },
    {
        icon: <Wrench className="w-8 h-8" />,
        title: 'Delivery or Installation',
        description: 'Receive your DIY kit with detailed instructions, or opt for our professional installation service. Installation is usually completed in less than 24 hours from deposit.',
    },
];

const features = [
    {
        icon: <Clock className="w-6 h-6" />,
        title: 'Quick Turnaround',
        description: 'Installation usually completed in less than 24 hours from deposit.',
    },
    {
        icon: <Shield className="w-6 h-6" />,
        title: 'Quality Guaranteed',
        description: 'All materials are SABS approved with H4 treatment for 5x longer life.',
    },
    {
        icon: <Truck className="w-6 h-6" />,
        title: 'Delivery Available',
        description: 'We deliver throughout South Africa and across the African continent.',
    },
    {
        icon: <Wrench className="w-6 h-6" />,
        title: 'DIY or Installed',
        description: 'Choose our easy-to-follow DIY kits or professional installation.',
    },
];

const diyKitIncludes = [
    'Connection brackets',
    'Spade bits',
    'Drills',
    'All important parts for construction',
    'Detailed, easy-to-read instructions',
    'Handgrips for secure climbing',
    'Bolt caps for safety',
    'Strong ground anchors',
];

export default function HowToBuyPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <Container>
                {/* Header */}
                <div className="text-center mb-16">
                    <Heading as="h1" variant="h1" className="mb-6">
                        How to Buy
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-600">
                        Getting your dream jungle gym is easy. Here's everything you need to know about purchasing from Extreme V.
                    </Text>
                </div>

                {/* Purchase Steps */}
                <div className="mb-20">
                    <Heading as="h2" variant="h2" className="text-center mb-12">
                        Simple 4-Step Process
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {purchaseSteps.map((step, index) => (
                            <div key={step.title} className="relative">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 h-full hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0">
                                            {step.icon}
                                        </div>
                                        <span className="text-4xl font-bold text-neutral-200">{index + 1}</span>
                                    </div>
                                    <Heading as="h3" variant="h4" className="mb-2">
                                        {step.title}
                                    </Heading>
                                    <Text className="text-neutral-600 text-sm">
                                        {step.description}
                                    </Text>
                                </div>
                                {index < purchaseSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-neutral-300 text-2xl">
                                        →
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="bg-neutral-50 rounded-3xl p-8 md:p-12 mb-20">
                    <Heading as="h2" variant="h2" className="text-center mb-12">
                        Why Buy From Us?
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => (
                            <div key={feature.title} className="text-center">
                                <div className="w-14 h-14 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-primary-600 mb-4">
                                    {feature.icon}
                                </div>
                                <Heading as="h4" variant="h4" className="mb-2">
                                    {feature.title}
                                </Heading>
                                <Text className="text-neutral-600 text-sm">
                                    {feature.description}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DIY Kit Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <div>
                        <Heading as="h2" variant="h2" className="mb-6">
                            DIY Kits Include Everything You Need
                        </Heading>
                        <Text className="text-neutral-600 mb-8">
                            Our Jungle Gym DIY kits are made to allow for simple assembly. The step-by-step instructions we offer are highly detailed, easy to read, and make the building process a fun experience that the entire family can partake in and enjoy!
                        </Text>
                        <ul className="space-y-3">
                            {diyKitIncludes.map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className="text-neutral-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 flex flex-col justify-center">
                        <Heading as="h3" variant="h3" className="mb-4">
                            Lay-By Options Available
                        </Heading>
                        <Text className="text-neutral-600 mb-6">
                            We understand that a jungle gym is an investment in your family. That's why we offer flexible lay-by payment options to make your purchase more affordable.
                        </Text>
                        <Link href="/contact">
                            <Button>Enquire About Lay-By</Button>
                        </Link>
                    </div>
                </div>

                {/* Installation Section */}
                <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Heading as="h2" variant="h2" className="mb-6 text-white">
                                Professional Installation
                            </Heading>
                            <Text className="text-neutral-300 mb-6">
                                Prefer to leave the hard work to us? Our skilled and experienced team can install your jungle gym quickly and safely. Installations are usually completed in less than 24 hours from deposit.
                            </Text>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-neutral-200">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    Custom-made jungle gyms
                                </li>
                                <li className="flex items-center gap-3 text-neutral-200">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    Free branch cutting and dumping if installed in trees
                                </li>
                                <li className="flex items-center gap-3 text-neutral-200">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    Jungle gyms can carry up to 10 fully grown adults
                                </li>
                                <li className="flex items-center gap-3 text-neutral-200">
                                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                    Minimal fee for maintenance
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <Heading as="h3" variant="h3" className="mb-4 text-white">
                                Get Started Today
                            </Heading>
                            <Text className="text-neutral-300 mb-6">
                                Ready to bring joy to your backyard? Contact us for a free quote and professional advice.
                            </Text>
                            <div className="space-y-4">
                                <a href="tel:+27117023155" className="flex items-center gap-3 text-white hover:text-primary-300 transition-colors">
                                    <Phone className="w-5 h-5" />
                                    <span>+27 11 702 3155</span>
                                </a>
                                <a href="https://wa.me/27737707679" className="flex items-center gap-3 text-white hover:text-primary-300 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span>WhatsApp: +27 73 770 7679</span>
                                </a>
                            </div>
                            <div className="mt-6">
                                <Link href="/contact">
                                    <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100">
                                        Request a Quote
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Heading as="h2" variant="h2" className="mb-4">
                        Ready to Get Started?
                    </Heading>
                    <Text className="text-neutral-600 mb-8 max-w-xl mx-auto">
                        Browse our products or use our Find My Playset tool to discover the perfect jungle gym for your family.
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products">
                            <Button size="lg">Browse Products</Button>
                        </Link>
                        <Link href="/find-my-playset">
                            <Button size="lg" variant="outline">Find My Playset</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </main>
    );
}
