'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { LogoutButton } from './LogoutButton';

export function UserMenu() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="h-10 w-10 rounded-full bg-neutral-200 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/signin"
          className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-md hover:bg-neutral-100 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
          {user?.name?.charAt(0).toUpperCase() ||
            user?.email?.charAt(0).toUpperCase()}
        </div>
        <svg
          className={`h-4 w-4 text-neutral-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-50">
          <div className="px-4 py-3 border-b border-neutral-200">
            <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
            <p className="text-xs text-neutral-600 truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/designs"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={() => setIsOpen(false)}
            >
              My Designs
            </Link>
            <Link
              href="/dashboard/quotes"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              onClick={() => setIsOpen(false)}
            >
              Quote Requests
            </Link>
          </div>

          {/* Admin Link - Only visible to admin users */}
          {user?.email &&
            process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').includes(
              user.email
            ) && (
              <div className="border-t border-neutral-200 py-1">
                <Link
                  href="/admin/quotes"
                  className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </div>
            )}

          <div className="border-t border-neutral-200 py-1">
            <div className="px-4 py-2">
              <LogoutButton
                variant="ghost"
                className="w-full text-left text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
