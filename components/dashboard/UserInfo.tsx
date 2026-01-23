'use client';

import { User } from '@prisma/client';
import { Mail, Phone, Calendar } from 'lucide-react';

interface UserInfoProps {
  user: Pick<User, 'name' | 'email' | 'phone' | 'createdAt'>;
}

export function UserInfo({ user }: UserInfoProps) {
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Welcome back, {user.name}!
          </h1>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-neutral-700">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-neutral-700">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-neutral-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Member since {memberSince}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
