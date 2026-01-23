'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from './MobileMenu';
import { UserMenu } from '@/components/auth/UserMenu';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Main navigation items shown in header (desktop only)
const headerNavItems: NavItem[] = [
  {
    label: 'Jungle Gyms',
    href: '/products',
    children: [
      { label: 'Browse All', href: '/products' },
      { label: 'Swing Sets', href: '/products/swing-sets' },
      { label: 'Climbing Units', href: '/products/climbing-units' },
      { label: 'Compare Tiers', href: '/tiers' },
    ],
  },
  { label: 'Gallery', href: '/gallery' },
  {
    label: 'How to Buy',
    href: '/how-to-buy',
    children: [
      { label: 'Purchasing', href: '/how-to-buy/purchasing' },
      { label: 'Warranty', href: '/how-to-buy/warranty' },
      { label: 'Lay-By Options', href: '/how-to-buy/layby' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

// All navigation items for mobile menu
const allNavigationItems: NavItem[] = [
  {
    label: 'Jungle Gyms',
    href: '/products',
    children: [
      { label: 'Browse All', href: '/products' },
      { label: 'Swing Sets', href: '/products/swing-sets' },
      { label: 'Climbing Units', href: '/products/climbing-units' },
      { label: 'Compare Tiers', href: '/tiers' },
    ],
  },
  { label: 'Accessories', href: '/accessories' },
  { label: 'Lapas & Timber', href: '/lapas-timber' },
  { label: 'Configurator', href: '/configurator' },
  { label: 'Gallery', href: '/gallery' },
  {
    label: 'How to Buy',
    href: '/how-to-buy',
    children: [
      { label: 'Purchasing', href: '/how-to-buy/purchasing' },
      { label: 'Warranty', href: '/how-to-buy/warranty' },
      { label: 'Lay-By Options', href: '/how-to-buy/layby' },
    ],
  },
  { label: 'Why Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header
        id="navigation"
        role="banner"
        className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-neutral-200"
      >
        <Container>
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
              aria-label="Extreme Velvet - Home"
            >
              <Logo />
            </Link>

            {/* Desktop Navigation - Right Aligned */}
            <div className="flex items-center gap-4">
              {/* Essential Nav Items - Desktop Only */}
              <nav
                className="hidden lg:flex items-center gap-1"
                role="navigation"
                aria-label="Main navigation"
                suppressHydrationWarning
              >
                {headerNavItems.map((item) => (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() =>
                      item.children && setActiveDropdown(item.label)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'px-4 py-2 text-[15px] font-medium transition-colors whitespace-nowrap uppercase tracking-wide',
                        'text-[#5A8B8B] hover:text-[#4A9B9B]',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded'
                      )}
                      aria-haspopup={item.children ? 'true' : undefined}
                      aria-expanded={
                        item.children && activeDropdown === item.label
                          ? 'true'
                          : 'false'
                      }
                    >
                      {item.label}
                    </Link>

                    {/* Dropdown Menu */}
                    {item.children && activeDropdown === item.label && (
                      <div
                        className="absolute top-full right-0 mt-2 w-56 bg-white shadow-xl border border-neutral-100 py-3"
                        role="menu"
                        aria-label={`${item.label} submenu`}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-6 py-3 text-[15px] text-[#5A8B8B] hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                            role="menuitem"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-neutral-800 hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="text-sm font-semibold uppercase tracking-wider text-neutral-800">
                  MENU
                </span>
                <svg
                  className="w-5 h-5 text-neutral-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Menu - Outside header for proper z-index layering */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigationItems={allNavigationItems}
      />

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-[72px]" />
    </>
  );
};
