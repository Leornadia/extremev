import Image from 'next/image';
import { responsiveSizes } from '@/lib/image-utils';
import { Trophy, Sparkles, Shield, Check } from 'lucide-react';

interface ValueProposition {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  bgColor: string;
  accentColor: string;
}

const valueProps: ValueProposition[] = [
  {
    id: 'premium-quality',
    title: 'Premium Quality',
    description:
      'Johannesburg\'s most specialised and sought-after designer and manufacturer of wooden playground equipment. Our superior products can be found throughout the African continent, in DIY stores, building supply retailers and hardware and garden supply stores.',
    features: [
      'High-grade wooden construction',
      'Patented connection bracket system (2009)',
      'Superior products found throughout Africa',
      'Available in DIY stores and retailers',
      'H4 treated timber - lasts 5x longer than H3',
    ],
    image: '/images/Large%20Double-Tower%20Wooden%20Jungle%20Gym%20with%20Blue%20Slide.webp',
    imageAlt: 'Premium quality ExtremeV jungle gym with double tower and blue slide',
    imagePosition: 'right',
    bgColor: 'bg-white',
    accentColor: 'text-primary-600',
    icon: <Trophy className="w-8 h-8" strokeWidth={1.5} />,
  },
  {
    id: 'simple-diy',
    title: 'Simplicity',
    description:
      'Our Jungle Gym DIY kits are made to allow for simple assembly. The step by step instructions that we offer are highly detailed, easy to read and make the building process a fun and simple experience that the entire family can partake in and enjoy!',
    features: [
      'Connection brackets included',
      'Spade bits provided',
      'Drills included',
      'All important parts for construction',
      'Detailed, easy-to-read instructions',
    ],
    image: '/images/Outdoor%20Wooden%20Climbing%20Frame%20with%20Rock%20Wall%20and%20Monkey%20Bars.webp',
    imageAlt: 'Easy DIY assembly - wooden climbing frame with rock wall',
    imagePosition: 'left',
    bgColor: 'bg-neutral-50',
    accentColor: 'text-secondary-500',
    icon: <Sparkles className="w-8 h-8" strokeWidth={1.5} />,
  },
  {
    id: 'safety-flexibility',
    title: 'Safety & Flexibility',
    description:
      'Safety is our number one priority! Child safety is imperative to the design and manufacture of our jungle gyms. All jungle gym play sets are designed to be customised with a wide variety of accessory options and room for expansion.',
    features: [
      'Handgrips for secure climbing',
      'Bolt caps for safety',
      'Strong ground anchors',
      'Wide variety of accessory options',
      'Room for expansion as children grow',
    ],
    image: '/images/Children%20Playing%20on%20a%20Wooden%20Jungle%20Gym%20with%20a%20Green%20Slide.webp',
    imageAlt: 'Local South African expertise - children enjoying jungle gym',
    imagePosition: 'right',
    bgColor: 'bg-white',
    accentColor: 'text-accent-teal',
    icon: <Shield className="w-8 h-8" strokeWidth={1.5} />,
  },
];

export function ValuePropositionSection() {
  return (
    <section className="py-0">
      {valueProps.map((prop, index) => (
        <div
          key={prop.id}
          className={`${prop.bgColor} py-20 sm:py-32 relative overflow-hidden perspective-1000`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30 animate-pulse-slow ${prop.imagePosition === 'left' ? '-left-20 top-0 bg-primary-100' : '-right-20 bottom-0 bg-secondary-100'
              }`}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${prop.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
                }`}
            >
              {/* Image */}
              <div
                className={`${prop.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2'
                  } relative group perspective-500`}
              >
                <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02] group-hover:rotate-y-2 group-hover:shadow-3xl">
                  <Image
                    src={prop.image}
                    alt={prop.imageAlt}
                    fill
                    sizes={responsiveSizes.feature}
                    className="object-cover"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Floating Badge */}
                <div className={`absolute -bottom-8 ${prop.imagePosition === 'left' ? '-right-8' : '-left-8'} bg-white p-6 rounded-2xl shadow-xl max-w-[200px] hidden sm:block animate-float transform hover:scale-110 transition-transform duration-300 z-20`}>
                  <div className={`${prop.accentColor} mb-2`}>
                    {prop.icon}
                  </div>
                  <p className="font-bold text-neutral-900 leading-tight">{prop.title}</p>
                </div>
              </div>

              {/* Content */}
              <div
                className={`${prop.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'
                  }`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-neutral-100 mb-8 hover:scale-105 transition-transform duration-300">
                  <span className={`w-2 h-2 rounded-full ${prop.accentColor.replace('text-', 'bg-')} animate-pulse`}></span>
                  <span className={`text-sm font-semibold uppercase tracking-wider ${prop.accentColor}`}>
                    {prop.title}
                  </span>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                  {prop.title === 'Premium Quality' && <>World-Class <span className="text-primary-600">Quality</span></>}
                  {prop.title === 'Simplicity' && <>Designed for <span className="text-secondary-500">Simplicity</span></>}
                  {prop.title === 'Safety & Flexibility' && <>Uncompromised <span className="text-accent-teal">Safety</span></>}
                </h2>

                <p className="text-xl text-neutral-600 mb-10 leading-relaxed">
                  {prop.description}
                </p>

                <ul className="space-y-5">
                  {prop.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4 group">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${prop.accentColor.replace('text-', 'bg-')}/10 flex items-center justify-center mt-0.5 group-hover:scale-110 transition-transform duration-300`}>
                        <Check className={`w-4 h-4 ${prop.accentColor}`} strokeWidth={3} />
                      </div>
                      <span className="text-lg text-neutral-700 group-hover:text-neutral-900 transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
