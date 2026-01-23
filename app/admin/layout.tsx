import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, FileText, ArrowLeft, Package } from 'lucide-react';

export const metadata = {
  title: 'Admin Dashboard | Extreme V',
  description: 'Admin dashboard for managing Extreme V website',
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check authentication
  const session = await getServerSession(authOptions);

  // Basic admin check
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const isAdmin =
    session?.user?.email && adminEmails.includes(session.user.email);

  if (!isAdmin) {
    redirect('/auth/signin?callbackUrl=/admin/quotes');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Site
              </Link>

              <div className="h-6 w-px bg-neutral-300" />

              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary-600" />
                <span className="font-semibold text-neutral-900">
                  Admin Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">
                {session?.user?.name || session?.user?.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6">
            <Link
              href="/admin/quotes"
              className="flex items-center gap-2 px-3 py-4 text-sm font-medium text-neutral-600 hover:text-primary-700 border-b-2 border-transparent hover:border-primary-600"
            >
              <FileText className="w-4 h-4" />
              Quote Requests
            </Link>
            <Link
              href="/admin/components"
              className="flex items-center gap-2 px-3 py-4 text-sm font-medium text-neutral-600 hover:text-primary-700 border-b-2 border-transparent hover:border-primary-600"
            >
              <Package className="w-4 h-4" />
              Components
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
