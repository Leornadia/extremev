import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header, Footer } from '@/components/navigation';
import { SessionProvider } from '@/components/auth';
import { SkipNavigation } from '@/components/ui/SkipNavigation';
import { FindPlaysetCTA } from '@/components/ui/FindPlaysetCTA';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { ServiceWorkerProvider } from '@/components/performance/ServiceWorkerProvider';
import { MobilePerformanceOptimizer } from '@/components/mobile/MobilePerformanceOptimizer';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/seo/structured-data';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = generateSEOMetadata({
  title: 'Extreme V - Premium Jungle Gyms & Playground Equipment',
  description:
    'Design and build your dream playground with Extreme V. Premium quality jungle gyms, custom configurations, and expert installation across South Africa.',
  keywords: [
    'jungle gym South Africa',
    'playground equipment',
    'custom jungle gym',
    'outdoor play equipment',
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased no-text-size-adjust`}
        suppressHydrationWarning
      >
        <SessionProvider>
          <MobilePerformanceOptimizer>
            <PerformanceMonitor />
            <ServiceWorkerProvider />
            <SkipNavigation />
            <Header />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <FindPlaysetCTA variant="floating" />
            <Footer />
          </MobilePerformanceOptimizer>
        </SessionProvider>
      </body>
    </html>
  );
}
