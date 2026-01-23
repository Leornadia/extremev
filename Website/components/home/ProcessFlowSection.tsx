import { Button } from '@/components/ui';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface ProcessStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  shadowColor: string;
}

const steps: ProcessStep[] = [
  {
    id: 'design',
    stepNumber: 1,
    title: 'Design Your Gym',
    description:
      'Choose from our flexible jungle gym designs or customize with a wide variety of accessory options for endless expansion possibilities',
    color: 'text-accent-sky',
    gradient: 'from-accent-sky/20 to-accent-sky/5',
    shadowColor: 'shadow-accent-sky/20',
    icon: (
      <div className="relative w-16 h-16">
        <Image
          src="/images/icons/flexible-designs.png"
          alt="Design Your Gym"
          fill
          className="object-contain"
        />
      </div>
    ),
  },
  {
    id: 'build',
    stepNumber: 2,
    title: 'Build with Ease',
    description:
      'Our DIY kits include all required parts, brackets, spade bits, drills, and detailed easy-to-read instructions for simple assembly',
    color: 'text-accent-coral',
    gradient: 'from-accent-coral/20 to-accent-coral/5',
    shadowColor: 'shadow-accent-coral/20',
    icon: (
      <div className="relative w-16 h-16">
        <Image
          src="/images/icons/easy-assembly.png"
          alt="Build with Ease"
          fill
          className="object-contain"
        />
      </div>
    ),
  },
  {
    id: 'safety',
    stepNumber: 3,
    title: 'Enjoy the Safety',
    description:
      'Child safety is our number one priority. Every product includes secure handgrips, bolt caps, and strong ground anchors for maximum protection',
    color: 'text-primary-600',
    gradient: 'from-primary-100 to-primary-50',
    shadowColor: 'shadow-primary-500/20',
    icon: (
      <div className="relative w-16 h-16">
        <Image
          src="/images/icons/safety-first.png"
          alt="Enjoy the Safety"
          fill
          className="object-contain"
        />
      </div>
    ),
  },
];

export function ProcessFlowSection() {
  return (
    <section className="py-24 bg-neutral-50 relative overflow-hidden perspective-1000">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -translate-y-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl translate-y-1/2 animate-pulse-slow delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-neutral-100 mb-6 hover:scale-105 transition-transform duration-300">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wider">
              Simple Process
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            3 Steps to Your <span className="text-primary-600">ExtremeV Fun</span>
          </h2>
          <p className="text-xl text-neutral-600 leading-relaxed">
            From flexible design to simple assembly to ultimate safety -
            we make premium playground equipment accessible to every family.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative mb-24">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-neutral-200 to-transparent z-0"></div>

          {steps.map((step, index) => (
            <div key={step.id} className="relative group z-10 perspective-500">
              <div className={`bg-white rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-500 h-full border border-neutral-100 group-hover:border-primary-100 transform group-hover:-translate-y-4 group-hover:rotate-x-2 ${step.shadowColor}`}>
                {/* Step Number & Icon */}
                <div className="flex flex-col items-center text-center mb-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-inner relative overflow-hidden group-hover:scale-110 transition-transform duration-500 group-hover:shadow-lg`}>
                    <div className={`absolute top-0 right-0 p-2 text-xs font-bold opacity-20 ${step.color}`}>0{step.stepNumber}</div>
                    <div className={`${step.color} transform transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 group-hover:drop-shadow-md`}>
                      {step.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="relative group perspective-500">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl transform rotate-1 opacity-10 group-hover:rotate-2 transition-transform duration-500"></div>
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-neutral-100 relative overflow-hidden transform transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50 animate-pulse-slow"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              <div className="text-center lg:text-left max-w-2xl">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                  <div className="p-2 bg-primary-50 rounded-lg text-primary-600 group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900">
                    The ExtremeV Promise
                  </h3>
                </div>
                <p className="text-lg text-neutral-600">
                  Flexibility, Simplicity, Safety - Creating memorable moments with your family.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <a href="/configurator" className="inline-block">
                  <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/30 px-8 transform hover:scale-105 transition-all duration-300">
                    Start Designing
                  </Button>
                </a>
                <a href="/products" className="inline-block">
                  <Button variant="outline" size="lg" className="border-2 border-neutral-200 hover:border-primary-500 text-neutral-700 hover:text-primary-600 px-8 transform hover:scale-105 transition-all duration-300">
                    Browse Products
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
