'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Layout';
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  PlusCircle,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'My Designs',
    href: '/dashboard/designs',
    icon: Package,
  },
  {
    name: 'Quote Requests',
    href: '/dashboard/quotes',
    icon: FileText,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg
                        transition-colors duration-200
                        ${
                          isActive
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-neutral-700 hover:bg-neutral-50'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Quick Action Button */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <Link
                  href="/configurator"
                  className="
                    flex items-center justify-center gap-2
                    w-full px-4 py-3 rounded-lg
                    bg-primary-600 text-white font-medium
                    hover:bg-primary-700 transition-colors
                  "
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>New Design</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
