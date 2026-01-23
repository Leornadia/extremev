import { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account | Extreme V',
  description:
    'Create an account to save your custom playground designs and request quotes.',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <RegisterForm />
    </div>
  );
}
