import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Check if database is available
const dbUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
const isDatabaseAvailable = !!dbUrl && !!prisma;

// Mock users for demonstration (when database is not available)
const mockUsers = [
  {
    id: '1',
    email: 'demo@extremev.co.za',
    name: 'Demo User',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LG7my', // "password"
  },
  {
    id: '2',
    email: 'admin@extremev.co.za',
    name: 'Admin User',
    passwordHash: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LG7my', // "password"
  },
];

export const authOptions: NextAuthOptions = {
  // Only use adapter if database is available and prisma is initialized
  adapter: isDatabaseAvailable ? PrismaAdapter(prisma) : undefined,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        try {
          // Try database first if available
          if (isDatabaseAvailable) {
            const user = await prisma.user.findUnique({
              where: {
                email: credentials.email,
              },
            });

            if (!user || !user.passwordHash) {
              throw new Error('Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.passwordHash
            );

            if (!isPasswordValid) {
              throw new Error('Invalid credentials');
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
        } catch (dbError) {
          console.warn('Database not available, using mock authentication');
        }

        // Fallback to mock users for demonstration
        const user = mockUsers.find(u => u.email === credentials.email);

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
    // Only include OAuth providers if credentials are properly configured
    ...(process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id' ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
    ...(process.env.FACEBOOK_CLIENT_ID &&
      process.env.FACEBOOK_CLIENT_SECRET &&
      process.env.FACEBOOK_CLIENT_ID !== 'your-facebook-app-id' ? [
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    ] : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow all sign-ins
      // The adapter will handle creating/linking accounts
      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
