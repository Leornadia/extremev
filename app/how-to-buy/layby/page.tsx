'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import {
    CreditCard,
    CheckCircle,
    Calendar,
    Percent,
    Phone,
    MessageCircle,
    ArrowRight
} from 'lucide-react';

const laybyBenefits = [
    'No credit checks required',
    'Flexible payment terms',
    'Secure your order while you pay',
    'No interest charges',
    'Pay at your own pace',
    'Reserve popular designs before they sell out',
];

const laybySteps = [
    {
        step: 1,
        title: 'Choose Your Jungle Gym',
        description: 'Browse our range and select the perfect jungle gym for your family. Contact us for a quote.',
    },
    {
        step: 2,
        title: 'Pay Initial Deposit',
        description: 'Pay a minimum 30% deposit to secure your order and lock in the current price.',
    },
    {
        step: 3,
        title: 'Make Regular Payments',
        description: 'Make payments over an agreed period (typically 3-6 months). Pay weekly, fortnightly, or monthly.',
    },
    {
        step: 4,
        title: 'Collect or Receive Delivery',
        description: 'Once fully paid, collect your DIY kit or schedule installation. Delivery available nationwide.',
    },
];

const faqItems = [
    {
        question: 'What is the minimum deposit?',
        answer: 'A minimum of 30% deposit is required to secure your order. Larger deposits will reduce your remaining balance and potentially shorten your payment period.',
    },
    {
        question: 'How long can I take to pay off?',
        answer: 'Payment terms are flexible and typically range from 3 to 6 months, depending on the total order value. We can discuss a plan that works for your budget.',
    },
    {
        question: 'Are there any interest charges?',
        answer: 'No, there are no interest or finance charges on lay-by purchases. You pay only the quoted price.',
    },
    {
        question: 'Can I pay my lay-by off early?',
        answer: 'Absolutely! Early payments are welcome and will allow you to receive your order sooner.',
    },
    {
        question: 'What happens if I miss a payment?',
        answer: 'Please contact us as soon as possible if you anticipate missing a payment. We\'ll work with you to find a solution.',
    },
    {
        question: 'Is my deposit refundable?',
        answer: 'Deposits are generally non-refundable as they secure your order. However, we may discuss options on a case-by-case basis.',
    },
];

export default function LaybyPage() {
    return (
        <main className="min-h-screen pt-24 pb-16">
            <Container>
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary-100 text-secondary-600 mb-6">
                        <CreditCard className="w-10 h-10" />
                    </div>
                    <Heading as="h1" variant="h1" className="mb-6">
                        Lay-By Options
                    </Heading>
                    <Text variant="large" className="max-w-2xl mx-auto text-neutral-600">
                        Make your dream jungle gym affordable with our flexible lay-by payment plans.
                    </Text>
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-br from-secondary-50 to-primary-50 rounded-3xl p-8 md:p-12 mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <Heading as="h2" variant="h2" className="mb-6">
                                Why Choose Lay-By?
                            </Heading>
                            <Text className="text-neutral-600 mb-8">
                                At Extreme V, we believe every family deserves a quality jungle gym. Our lay-by option makes it easy to spread the cost while securing your order.
                            </Text>
                            <ul className="space-y-4">
                                {laybyBenefits.map((benefit) => (
                                    <li key={benefit} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-neutral-700">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <div className="flex items-center gap-4 mb-6">
                                <Percent className="w-12 h-12 text-secondary-500" />
                                <div>
                                    <Text className="text-3xl font-bold text-neutral-900">0%</Text>
                                    <Text className="text-neutral-600">Interest</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <Calendar className="w-12 h-12 text-primary-500" />
                                <div>
                                    <Text className="text-3xl font-bold text-neutral-900">3-6</Text>
                                    <Text className="text-neutral-600">Months to Pay</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <CreditCard className="w-12 h-12 text-accent-teal" />
                                <div>
                                    <Text className="text-3xl font-bold text-neutral-900">30%</Text>
                                    <Text className="text-neutral-600">Minimum Deposit</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mb-20">
                    <Heading as="h2" variant="h2" className="text-center mb-12">
                        How Lay-By Works
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {laybySteps.map((item, index) => (
                            <div key={item.step} className="relative">
                                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 h-full">
                                    <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center font-bold text-lg mb-4">
                                        {item.step}
                                    </div>
                                    <Heading as="h3" variant="h4" className="mb-2">
                                        {item.title}
                                    </Heading>
                                    <Text className="text-neutral-600 text-sm">
                                        {item.description}
                                    </Text>
                                </div>
                                {index < laybySteps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 text-neutral-300">
                                        <ArrowRight className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="mb-20">
                    <Heading as="h2" variant="h2" className="text-center mb-12">
                        Frequently Asked Questions
                    </Heading>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {faqItems.map((faq) => (
                            <div key={faq.question} className="bg-neutral-50 rounded-xl p-6">
                                <Heading as="h3" variant="h4" className="mb-2">
                                    {faq.question}
                                </Heading>
                                <Text className="text-neutral-600">
                                    {faq.answer}
                                </Text>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 text-center">
                    <Heading as="h2" variant="h2" className="mb-4 text-white">
                        Start Your Lay-By Today
                    </Heading>
                    <Text className="text-neutral-300 mb-8 max-w-xl mx-auto">
                        Contact us to discuss a payment plan that works for you. Our team is ready to help make your jungle gym dreams a reality.
                    </Text>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+27117023155">
                            <Button className="bg-white text-neutral-900 hover:bg-neutral-100 gap-2">
                                <Phone className="w-5 h-5" />
                                +27 11 702 3155
                            </Button>
                        </a>
                        <a href="https://wa.me/27737707679">
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Us
                            </Button>
                        </a>
                    </div>
                </div>
            </Container>
        </main>
    );
}
