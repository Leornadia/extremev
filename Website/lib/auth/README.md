# Authentication System

This directory contains the NextAuth.js authentication configuration for the Extreme V website.

## Overview

The authentication system uses NextAuth.js v4 with the following features:

- **Credentials Provider**: Email/password authentication
- **OAuth Providers**: Google and Facebook social login (optional)
- **JWT Sessions**: Stateless session management
- **Prisma Adapter**: Database integration for user accounts
- **Session Management**: 30-day session duration
- **Type Safety**: Full TypeScript support

## Configuration

### Environment Variables

Required environment variables in `.env`:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
DATABASE_URL="postgresql://..."
```

### Database Schema

The following models are required in the Prisma schema:

- `User`: User accounts with email, password, and profile information
- `Account`: OAuth account connections (for future social login)
- `Session`: Active user sessions
- `VerificationToken`: Email verification tokens

## Usage

### Server-Side

Use the utility functions from `lib/auth-utils.ts`:

```typescript
import { getSession, getCurrentUser, requireAuth } from '@/lib/auth-utils';

// Get current session
const session = await getSession();

// Get current user
const user = await getCurrentUser();

// Require authentication (redirects if not authenticated)
const session = await requireAuth();
```

### Client-Side

Use the `useAuth` hook:

```typescript
'use client';

import { useAuth } from '@/lib/hooks';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### API Routes

Protected API routes:

```typescript
import { getSession } from '@/lib/auth-utils';

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Handle authenticated request
  return Response.json({ user: session.user });
}
```

## Authentication Flow

### Login

1. User submits email and password
2. Credentials provider validates against database
3. Password is compared using bcrypt
4. JWT token is generated and stored in cookie
5. User is redirected to dashboard or previous page

### Session Management

- Sessions are stored as JWT tokens in HTTP-only cookies
- Sessions expire after 30 days of inactivity
- Session data includes user ID, email, and name
- Sessions are automatically refreshed on page load

### Logout

1. User clicks logout
2. Session token is cleared from cookies
3. User is redirected to homepage

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt with salt rounds
- **HTTP-Only Cookies**: Session tokens are stored in HTTP-only cookies
- **CSRF Protection**: Built-in CSRF protection via NextAuth.js
- **Secure Sessions**: JWT tokens are signed with NEXTAUTH_SECRET
- **Database Integration**: User data is stored securely in PostgreSQL

## Custom Pages

Authentication pages are located at:

- `/auth/signin` - Sign in page
- `/auth/signout` - Sign out confirmation
- `/auth/error` - Authentication error page

These pages need to be created in the next task (19.3).

## User Registration (Task 19.2 - Completed)

### Registration Flow

Users can register at `/auth/register` by providing:

- Full name
- Email address
- Password (min 8 chars, must include uppercase, lowercase, and number)
- Phone number (optional)

### Email Verification

After registration:

1. A verification token is generated and stored in the database
2. A verification email is sent to the user's email address
3. The email contains a link to `/auth/verify-email?token=xxx`
4. The token expires after 24 hours
5. Once verified, users can sign in

### API Endpoints

**POST /api/auth/register**
Registers a new user account.

Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+27 12 345 6789"
}
```

**GET /api/auth/verify-email?token=xxx**
Verifies a user's email address.

### Email Configuration

The registration flow uses Resend for sending verification emails:

1. Sign up for a Resend account at https://resend.com
2. Get your API key from the dashboard
3. Add to `.env`: `RESEND_API_KEY="your-resend-api-key"`
4. Configure your sending domain in Resend

**Development Mode:** If `RESEND_API_KEY` is not set, the verification URL will be logged to the console.

## OAuth Social Login (Task 19.5 - Completed)

The system supports optional OAuth authentication with Google and Facebook. Users can sign in or register using their social accounts.

### Supported Providers

- **Google OAuth**: Sign in with Google account
- **Facebook OAuth**: Sign in with Facebook account

### Setup

For detailed OAuth setup instructions, see [OAUTH_SETUP.md](./OAUTH_SETUP.md).

Quick setup:

1. Create OAuth apps in Google Cloud Console and Facebook Developers
2. Configure redirect URIs: `{NEXTAUTH_URL}/api/auth/callback/{provider}`
3. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-app-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
   ```
4. Restart the development server

### Account Linking

The system uses automatic account linking based on email addresses:

- If a user signs up with email/password and later uses OAuth with the same email, accounts are linked
- Users can sign in with any linked authentication method
- The `Account` model stores OAuth provider information

### User Experience

On the sign-in and registration pages, users will see:

1. Traditional email/password form
2. "Or continue with" divider
3. Google and Facebook buttons with brand icons
4. Clicking an OAuth button redirects to the provider's consent screen
5. After authorization, users are redirected back and signed in

## Future Enhancements

- Two-factor authentication
- Additional OAuth providers (Apple, Microsoft)
- Session management dashboard
- Account unlinking interface

## Troubleshooting

### "Invalid credentials" error

- Verify email exists in database
- Check password hash is correct
- Ensure bcrypt is comparing correctly

### Session not persisting

- Check NEXTAUTH_SECRET is set
- Verify NEXTAUTH_URL matches your domain
- Check cookie settings in browser

### Database connection errors

- Verify DATABASE_URL is correct
- Ensure database is running
- Check Prisma schema is up to date

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [JWT Sessions](https://next-auth.js.org/configuration/options#session)
