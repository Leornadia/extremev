'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { UserMenu } from '@/components/auth/UserMenu';
import { useFocusTrap, useFocusRestore } from '@/lib/hooks/useFocusManagement';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navigationItems: NavItem[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  navigationItems,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const menuRef = useFocusTrap(isOpen);
  useFocusRestore();

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60]"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide-out Menu */}
      <nav
        ref={menuRef as React.RefObject<HTMLElement>}
        id="mobile-menu"
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-[70]',
          'transform transition-transform duration-300 ease-in-out',
          'shadow-2xl overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <Link href="/" onClick={onClose} className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">
            <Logo className="h-9 w-auto" width={140} height={37} />
          </Link>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
            aria-label="Close navigation menu"
          >
            <svg
              className="w-6 h-6 text-neutral-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Find My Playset - Prominent CTA */}
        <div className="px-6 pt-6 pb-2">
          <Link
            href="/find-my-playset"
            onClick={onClose}
            className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg hover:from-primary-600 hover:to-primary-700 transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <span className="flex flex-col items-start">
              <span className="text-xs uppercase tracking-wider opacity-80">3D Preview</span>
              <span className="text-base font-bold">Find My Playset</span>
            </span>
            <svg
              className="w-5 h-5 ml-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="p-6">
          <ul className="space-y-2" role="list">
            {navigationItems.map((item) => (
              <li key={item.href}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className="w-full flex items-center justify-between py-3 text-left text-[15px] font-medium text-[#5A8B8B] hover:text-[#4A9B9B] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded"
                      aria-expanded={expandedItems.has(item.label)}
                      aria-controls={`submenu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={cn(
                          'w-5 h-5 transition-transform',
                          expandedItems.has(item.label) && 'rotate-180'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {expandedItems.has(item.label) && (
                      <ul
                        id={`submenu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        className="mt-2 ml-4 space-y-2 border-l-2 border-neutral-200 pl-4"
                        role="list"
                      >
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={onClose}
                              className="block py-2 text-[15px] text-neutral-600 hover:text-[#4A9B9B] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-3 text-[15px] font-medium text-[#5A8B8B] hover:text-[#4A9B9B] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* User Account Section */}
        <div className="px-6 py-4 border-t border-neutral-200">
          <div className="mb-4">
            <UserMenu />
          </div>
        </div>

        {/* Contact Info */}
        <div className="px-6 py-4 border-t border-neutral-200">
          <div className="space-y-3">
            <a
              href="tel:+27117023155"
              className="flex items-center space-x-3 py-2 text-[15px] text-neutral-700 hover:text-[#4A9B9B] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded"
              aria-label="Call us at +27 11 702 3155"
            >
              <svg
                className="w-5 h-5 text-[#4A9B9B]"
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
              <span className="font-medium">+27 11 702 3155</span>
            </a>
            <a
              href="mailto:info@extremev.co.za"
              className="flex items-center space-x-3 py-2 text-[15px] text-neutral-700 hover:text-[#4A9B9B] transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset rounded"
              aria-label="Email us at info@extremev.co.za"
            >
              <svg
                className="w-5 h-5 text-[#4A9B9B]"
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
              <span className="font-medium">info@extremev.co.za</span>
            </a>
          </div>
        </div>

        {/* CTA Button */}
        <div className="p-6 border-t border-neutral-200">
          <Button href="/configurator" className="w-full" onClick={onClose}>
            Get Quick Quote
          </Button>
        </div>
      </nav>
    </>
  );
};
