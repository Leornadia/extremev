'use client';

import { Container } from '@/components/ui/Layout';
import { Heading, Text } from '@/components/ui/Typography';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'With over 15 years in playground design and child development, Sarah founded Extreme V to bring premium play experiences to families across South Africa.',
    initials: 'SJ',
    color: 'from-primary-400 to-primary-600',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Design',
    bio: 'Michael combines engineering expertise with creative vision to design safe, innovative playground structures that inspire imaginative play.',
    initials: 'MC',
    color: 'from-secondary-400 to-secondary-600',
  },
  {
    name: 'Thandi Nkosi',
    role: 'Safety & Quality Director',
    bio: 'Thandi ensures every product meets the highest safety standards, overseeing testing, certification, and quality control processes.',
    initials: 'TN',
    color: 'from-accent-sky to-primary-500',
  },
  {
    name: 'David Williams',
    role: 'Customer Experience Lead',
    bio: 'David leads our customer service team, ensuring every family receives personalized support from design consultation to installation.',
    initials: 'DW',
    color: 'from-accent-coral to-secondary-500',
  },
];

export function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white">
      <Container>
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Heading as="h1" variant="h1" className="mb-6">
            Meet Our Team
          </Heading>
          <Text variant="large" className="text-neutral-600">
            Passionate professionals dedicated to creating exceptional play
            experiences
          </Text>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-neutral-200"
            >
              {/* Avatar */}
              <div className="flex items-center justify-center py-12 bg-gradient-to-br from-neutral-100 to-neutral-50">
                <div
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-3xl font-bold shadow-lg`}
                >
                  {member.initials}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <Heading as="h3" variant="h3" className="mb-1">
                  {member.name}
                </Heading>
                <Text
                  variant="small"
                  className="text-primary-600 font-semibold mb-4"
                >
                  {member.role}
                </Text>
                <Text
                  variant="small"
                  className="text-neutral-600 leading-relaxed"
                >
                  {member.bio}
                </Text>
              </div>
            </div>
          ))}
        </div>

        {/* Team Values */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 rounded-2xl p-8 md:p-12">
            <Heading as="h2" variant="h2" className="mb-8 text-center">
              What Drives Us
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">❤️</div>
                <Heading as="h4" variant="h4" className="mb-3">
                  Passion for Play
                </Heading>
                <Text variant="small" className="text-neutral-600">
                  We believe in the transformative power of play for
                  children&apos;s development and family bonding.
                </Text>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <Heading as="h4" variant="h4" className="mb-3">
                  Commitment to Quality
                </Heading>
                <Text variant="small" className="text-neutral-600">
                  Every detail matters. We never compromise on materials,
                  safety, or craftsmanship.
                </Text>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🤝</div>
                <Heading as="h4" variant="h4" className="mb-3">
                  Customer First
                </Heading>
                <Text variant="small" className="text-neutral-600">
                  Your satisfaction is our success. We&apos;re here to support
                  you every step of the way.
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-white rounded-xl shadow-md p-8 border border-neutral-200">
            <Heading as="h3" variant="h3" className="mb-4">
              Join Our Growing Team
            </Heading>
            <Text className="text-neutral-600 mb-6">
              We&apos;re always looking for talented individuals who share our
              passion for creating exceptional play experiences. If you&apos;re
              interested in joining the Extreme V family, we&apos;d love to hear
              from you.
            </Text>
            <a
              href="mailto:careers@extremev.co.za"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
