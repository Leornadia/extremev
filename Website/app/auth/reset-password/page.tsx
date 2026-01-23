import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Reset Password | Extreme V',
  description: 'Reset your Extreme V account password',
};

interface ResetPasswordPageProps {
  searchParams: {
    token?: string;
  };
}

export default function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const token = searchParams.token;

  // Redirect if no token provided
  if (!token) {
    redirect('/auth/forgot-password');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
