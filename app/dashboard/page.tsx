import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { SavedDesignsGrid } from '@/components/dashboard/SavedDesignsGrid';
import { QuoteRequestsList } from '@/components/dashboard/QuoteRequestsList';
import { UserInfo } from '@/components/dashboard/UserInfo';

export const metadata: Metadata = {
  title: 'My Dashboard | Extreme V',
  description: 'Manage your saved designs and quote requests',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // Fetch user data with saved designs and quote requests
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      savedDesigns: {
        orderBy: { updatedAt: 'desc' },
      },
      quoteRequests: {
        orderBy: { createdAt: 'desc' },
        take: 10, // Show last 10 quote requests
      },
    },
  });

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* User Information Section */}
        <UserInfo user={user} />

        {/* Saved Designs Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">My Designs</h2>
            <p className="text-neutral-600 mt-1">
              {user.savedDesigns.length === 0
                ? 'Start creating your dream playset in the configurator'
                : `You have ${user.savedDesigns.length} saved design${user.savedDesigns.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <SavedDesignsGrid designs={user.savedDesigns} />
        </section>

        {/* Quote Requests Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">
              Quote Requests
            </h2>
            <p className="text-neutral-600 mt-1">
              {user.quoteRequests.length === 0
                ? 'No quote requests yet'
                : `Showing your ${user.quoteRequests.length} most recent quote request${user.quoteRequests.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <QuoteRequestsList quoteRequests={user.quoteRequests} />
        </section>
      </div>
    </DashboardLayout>
  );
}
