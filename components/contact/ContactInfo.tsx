import React from 'react';
import { Heading, Text } from '@/components/ui/Typography';

interface ContactInfoItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

export function ContactInfo() {
  const contactItems: ContactInfoItem[] = [
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      label: 'Phone',
      value: '+27 12 345 6789',
      href: 'tel:+27123456789',
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      label: 'Email',
      value: 'info@extremev.co.za',
      href: 'mailto:info@extremev.co.za',
    },
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      label: 'Address',
      value: 'Pretoria, South Africa',
    },
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '8:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 1:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  return (
    <div className="space-y-8">
      {/* Contact Details */}
      <div>
        <Heading as="h3" className="mb-6">
          Get in Touch
        </Heading>
        <div className="space-y-4">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                {item.icon}
              </div>
              <div>
                <Text className="text-sm font-medium text-neutral-500">
                  {item.label}
                </Text>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-lg font-medium text-neutral-900 transition-colors hover:text-primary-600"
                  >
                    {item.value}
                  </a>
                ) : (
                  <Text className="text-lg font-medium">{item.value}</Text>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div>
        <Heading as="h3" className="mb-4">
          Business Hours
        </Heading>
        <div className="space-y-2">
          {businessHours.map((schedule, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b border-neutral-200 py-2 last:border-0"
            >
              <Text className="font-medium text-neutral-700">
                {schedule.day}
              </Text>
              <Text className="text-neutral-600">{schedule.hours}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div>
        <Heading as="h3" className="mb-4">
          Location
        </Heading>
        <div className="overflow-hidden rounded-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228706.48197814636!2d28.034088!3d-25.746111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e9560398e1b4f3f%3A0x6c3f4c5c5c5c5c5c!2sPretoria%2C%20South%20Africa!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Extreme V Location"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
