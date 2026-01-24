'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
    CreditCard,
    Truck,
    Package,
    CheckCircle,
    Phone,
    MessageCircle,
    MapPin,
    Clock
} from 'lucide-react';

const paymentMethods = [
    {
        title: 'Bank Transfer (EFT)',
        description: 'Direct bank transfer to our account. Proof of payment required before dispatch.',
        icon: <CreditCard className="w-6 h-6" />,
    },
    {
        title: 'Cash on Collection',
        description: 'Pay cash when collecting from our premises in Kyalami.',
        icon: <Package className="w-6 h-6" />,
    },
    {
        title: 'Lay-By Plan',
        description: 'Spread the cost over time with our flexible lay-by options.',
        icon: <Clock className="w-6 h-6" />,
    },
];

const deliveryOptions = [
    {
        title: 'Collection',
        description: 'Collect your order from our premises at Cnr Main & Cedar Rd, Kyalami A/H, Johannesburg.',
        icon: <MapPin className="w-6 h-6" />,
    },
    {
        title: 'Delivery',
        description: 'We deliver throughout South Africa and across the African continent. Delivery fees apply based on location.',
        icon: <Truck className="w-6 h-6" />,
    },
];

const purchaseProcess = [
    'Contact us to discuss your requirements and receive a quote',
    'Review and approve the quote',
    'Pay a deposit to confirm your order (50% deposit on orders)',
    'Production begins - typically 5-10 working days',
    'Balance payment due before delivery/collection',
    'Collect your DIY kit or schedule installation',
];

export default function PurchasingPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <Container>
                {/* Header */}
                <div className="text-center mb-16">
                    <Heading as="h1" variant="h1" className="mb-6">
                        Purchasing Information
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-600">
                        Everything you need to know about buying from Extreme V.
                    </Text>
                </div>

                {/* Purchase Process */}
                <div className="mb-20">
                    <Heading as="h2" variant="h2" className="mb-8">
                        How to Purchase
                    </Heading>
                    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8">
                        <ol className="space-y-6">
                            {purchaseProcess.map((step, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 font-bold">
                                        {index + 1}
                                    </div>
                                    <Text className="text-neutral-700 pt-1">{step}</Text>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-20">
                    <Heading as="h2" variant="h2" className="mb-8">
                        Payment Methods
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {paymentMethods.map((method) => (
                            <div key={method.title} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mb-4">
                                    {method.icon}
                                </div>
                                <Heading as="h3" variant="h4" className="mb-2">
                                    {method.title}
                                </Heading>
                                <Text className="text-neutral-600 text-sm">
                                    {method.description}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery Options */}
                <div className="mb-20">
                    <Heading as="h2" variant="h2" className="mb-8">
                        Delivery & Collection
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {deliveryOptions.map((option) => (
                            <div key={option.title} className="bg-neutral-50 rounded-2xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white text-primary-600 flex items-center justify-center flex-shrink-0">
                                        {option.icon}
                                    </div>
                                    <div>
                                        <Heading as="h3" variant="h4" className="mb-2">
                                            {option.title}
                                        </Heading>
                                        <Text className="text-neutral-600">
                                            {option.description}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DIY vs Installation */}
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-3xl p-8 md:p-12 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <Heading as="h2" variant="h2" className="mb-6">
                                DIY Kit
                            </Heading>
                            <Text className="text-neutral-600 mb-6">
                                Our DIY kits come with everything you need:
                            </Text>
                            <ul className="space-y-3">
                                {['Connection brackets', 'Spade bits and drills', 'All hardware included', 'Detailed step-by-step instructions', 'Handgrips and safety caps'].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-neutral-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <Heading as="h2" variant="h2" className="mb-6">
                                Professional Installation
                            </Heading>
                            <Text className="text-neutral-600 mb-6">
                                Let our experienced team handle everything:
                            </Text>
                            <ul className="space-y-3">
                                {['Completed within 24 hours', 'Free branch cutting if in trees', 'All waste removed', 'Professional finish guaranteed', 'Maintenance service available'].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-neutral-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 text-center">
                    <Heading as="h2" variant="h2" className="mb-4 text-white">
                        Ready to Order?
                    </Heading>
                    <Text className="text-neutral-300 mb-8 max-w-xl mx-auto">
                        Contact us today for a free quote and professional advice on choosing the right jungle gym for your needs.
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+27117023155">
                            <Button className="bg-white text-neutral-900 hover:bg-neutral-100 gap-2">
                                <Phone className="w-5 h-5" />
                                Call Us
                            </Button>
                        </a>
                        <a href="https://wa.me/27737707679">
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp
                            </Button>
                        </a>
                    </div>
                </div>
            </Container>
        </main>
    );
}
