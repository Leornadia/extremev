import Image from 'next/image';
import { Button } from '@/components/ui';

interface ProductTier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  badge?: string;
  popular?: boolean;
  primaryCta: string;
  secondaryCta: string;
}

const tiers: ProductTier[] = [
  {
    id: 'jungle-gyms',
    name: 'Jungle Gyms',
    tagline: 'Custom wooden playgrounds for every garden',
    description:
      "Extreme-V designs and manufactures jungle gyms in Johannesburg, delivering safe and stylish play spaces that bring your family's vision to life.",
    features: [
      'Patented bracket system for secure swings and structures',
      'DIY-ready kits with detailed, easy-to-follow instructions',
      'Safety components such as handgrips, bolt caps, and ground anchors',
      'Expansive range supplied throughout Gauteng and beyond',
    ],
    image: '/images/Red%20Wooden%20Playset%20with%20Yellow%20Slide%20and%20Sandpit.webp',
    imageAlt: 'Children enjoying a wooden jungle gym by Extreme-V',
    primaryCta: 'Explore Jungle Gyms',
    secondaryCta: 'See how our kits work →',
  },
  {
    id: 'accessories',
    name: 'Jungle Gym Accessories',
    tagline: 'Upgrade every adventure with thoughtful add-ons',
    description:
      'From connection brackets to swings, accessories keep each playset safe, flexible, and ready for imaginative expansion.',
    features: [
      'Handgrips, bolt caps, and anchors engineered for child safety',
      'Accessory kits that include the tools needed for assembly',
      'Modular options that adapt as your family grows',
      'Expert merchandising support for retail partners',
    ],
    image: '/images/Wooden%20Jungle%20Gym%20with%20Green%20Slide%20in%20a%20Garden.webp',
    imageAlt: 'Accessory-rich jungle gym with slides and swings',
    badge: 'Most Popular',
    popular: true,
    primaryCta: 'Shop Accessories',
    secondaryCta: 'Browse the full accessory list →',
  },
  {
    id: 'lapas',
    name: 'Lapas & Timber',
    tagline: 'Enhance outdoor living with handcrafted structures',
    description:
      'Beyond play areas, Extreme-V builds lapas, timber decks, and structural poles that transform gardens into multifunctional retreats.',
    features: [
      'Thatched lapas and timber elements made for South African weather',
      'Tailored designs that elevate backyard entertainment spaces',
      'Experts available for planning installations across Johannesburg',
      'Reliable supply of poles and timber for DIY projects',
    ],
    image: '/images/Children%27s%20Wooden%20Playground%20with%20Blue%20Slide%20and%20Tire%20Swing.webp',
    imageAlt: 'Lapa and timber seating next to an Extreme-V play area',
    primaryCta: 'Plan Your Outdoor Space',
    secondaryCta: 'Discuss lapas & timber needs →',
  },
];

export function ProductTierSection() {
  return (
    <section className="py-24 bg-neutral-900 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-900/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
            <span className="text-sm font-semibold text-primary-300 uppercase tracking-wider">
              Our Products
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">
            Build with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Extreme-V</span>
          </h2>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Explore the core products we supply across South Africa—crafted
            jungle gyms, accessories, lapas, and timber solutions inspired by
            our original site.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-neutral-800 rounded-3xl overflow-hidden border transition-all duration-500 group hover:-translate-y-2 ${tier.popular
                  ? 'border-primary-500 shadow-glow ring-1 ring-primary-500/50'
                  : 'border-neutral-700 hover:border-neutral-600 shadow-xl'
                }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-bold rounded-full shadow-lg">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={tier.image}
                  alt={tier.imageAlt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />

                {/* Tier Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-3xl font-bold text-white mb-2 font-display">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-primary-300 font-medium tracking-wide uppercase">{tier.tagline}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col h-full bg-neutral-800">
                {/* Description */}
                <p className="text-base text-neutral-400 leading-relaxed mb-8 min-h-[80px]">
                  {tier.description}
                </p>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group/item">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-3.5 h-3.5 text-primary-400 group-hover/item:text-primary-300 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-neutral-300 group-hover/item:text-white transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="space-y-4 pt-6 border-t border-neutral-700">
                  <Button
                    variant={tier.popular ? 'primary' : 'secondary'}
                    className={`w-full py-6 text-lg font-semibold ${tier.popular ? 'bg-primary-600 hover:bg-primary-500' : 'bg-neutral-700 hover:bg-neutral-600 text-white border-transparent'}`}
                  >
                    {tier.primaryCta}
                  </Button>
                  <button className="w-full text-sm text-neutral-400 hover:text-white font-medium transition-colors flex items-center justify-center gap-2 group/btn">
                    {tier.secondaryCta.replace(' →', '')}
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-neutral-400 mb-6 text-lg">
            Not sure which solution fits your space?
          </p>
          <Button variant="outline" size="lg" className="border-neutral-700 text-white hover:bg-white hover:text-neutral-900 px-8 py-6 text-lg rounded-full transition-all duration-300">
            Talk to the Extreme-V team
          </Button>
        </div>
      </div>
    </section>
  );
}
