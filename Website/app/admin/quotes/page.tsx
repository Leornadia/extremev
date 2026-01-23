import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AdminQuotesList } from '@/components/admin/AdminQuotesList';
import { Spinner } from '@/components/ui/Spinner';

export const metadata = {
  title: 'Admin - Quote Requests | Extreme V',
  description: 'Manage customer quote requests',
};

export default async function AdminQuotesPage() {
  // Check authentication
  const session = await getServerSession(authOptions);

  // Basic admin check - verify user is authenticated and has admin email
  // In production, you'd want a proper role-based system
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  const isAdmin =
    session?.user?.email && adminEmails.includes(session.user.email);

  if (!isAdmin) {
    redirect('/auth/signin?callbackUrl=/admin/quotes');
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Quote Requests
          </h1>
          <p className="mt-2 text-neutral-600">
            Manage and review customer quote requests
          </p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <AdminQuotesList />
        </Suspense>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <Spinner size="lg" />
    </div>
  );
}
