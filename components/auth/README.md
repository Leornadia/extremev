# Authentication Components

This directory contains authentication-related components for the Extreme V website.

## Components

### LoginForm

A complete login form component with email/password authentication.

**Usage:**

```tsx
import { LoginForm } from '@/components/auth';

export default function SignInPage() {
  return <LoginForm />;
}
```

**Features:**

- Email and password input fields
- Client-side validation
- Error handling with user-friendly messages
- Loading states during authentication
- Link to registration page
- Link to forgot password page
- Callback URL support for redirecting after login

### LogoutButton

A button component that handles user logout.

**Usage:**

```tsx
import { LogoutButton } from '@/components/auth';

export default function MyComponent() {
  return <LogoutButton variant="primary">Sign Out</LogoutButton>;
}
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'ghost' (default: 'ghost')
- `className`: Additional CSS classes
- `children`: Button text (default: 'Sign Out')

### UserMenu

A dropdown menu component that displays user information and authentication options.

**Usage:**

```tsx
import { UserMenu } from '@/components/auth';

export default function Header() {
  return (
    <header>
      <UserMenu />
    </header>
  );
}
```

**Features:**

- Shows "Sign In" and "Sign Up" buttons when not authenticated
- Shows user avatar and dropdown menu when authenticated
- Displays user name and email
- Links to dashboard, designs, and quotes
- Logout functionality
- Click-outside to close

### RegisterForm

A complete registration form component with email verification.

**Usage:**

```tsx
import { RegisterForm } from '@/components/auth';

export default function RegisterPage() {
  return <RegisterForm />;
}
```

### ForgotPasswordForm

A form component for requesting a password reset link.

**Usage:**

```tsx
import { ForgotPasswordForm } from '@/components/auth';

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
```

**Features:**

- Email input field
- Client-side validation
- Success message after submission
- Link back to sign in page
- Prevents email enumeration attacks

### ResetPasswordForm

A form component for resetting a user's password with a valid token.

**Usage:**

```tsx
import { ResetPasswordForm } from '@/components/auth';

export default function ResetPasswordPage({ searchParams }) {
  return <ResetPasswordForm token={searchParams.token} />;
}
```

**Props:**

- `token`: The password reset token from the URL

**Features:**

- New password input with validation
- Confirm password field
- Password visibility toggle
- Password strength requirements
- Success message with auto-redirect
- Token validation and expiration handling

### SessionProvider

A wrapper component that provides authentication session context to the application.

**Usage:**

```tsx
import { SessionProvider } from '@/components/auth';

export default function RootLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

## Hooks

### useAuth

A custom hook that provides authentication functionality.

**Usage:**

```tsx
import { useAuth } from '@/lib/hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name}!</p>
      ) : (
        <button onClick={handleLogin}>Sign In</button>
      )}
    </div>
  );
}
```

**Returns:**

- `user`: Current user object or null
- `session`: Full session object
- `status`: 'authenticated' | 'loading' | 'unauthenticated'
- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Boolean indicating if session is loading
- `login(email, password)`: Function to authenticate user
- `logout()`: Function to sign out user

## Pages

### /auth/signin

Login page where users can sign in with email and password.

### /auth/register

Registration page where new users can create an account.

### /auth/verify-email

Email verification page for confirming user email addresses.

### /auth/forgot-password

Password reset request page where users can request a password reset link.

### /auth/reset-password

Password reset page where users can set a new password using a valid reset token.

### /auth/error

Error page displayed when authentication fails.

## Authentication Flow

1. **Login:**
   - User navigates to `/auth/signin`
   - User enters email and password
   - Form submits to NextAuth credentials provider
   - On success, user is redirected to callback URL or home page
   - On error, error message is displayed

2. **Registration:**
   - User navigates to `/auth/register`
   - User enters name, email, and password
   - Account is created in database
   - Verification email is sent
   - User is redirected to verify email page

3. **Password Reset:**
   - User clicks "Forgot Password" on login page
   - User navigates to `/auth/forgot-password`
   - User enters email address
   - System generates secure reset token (1-hour expiration)
   - Reset email is sent with link to `/auth/reset-password?token=xxx`
   - User clicks link and enters new password
   - Password is updated in database
   - Token is marked as used
   - User is redirected to sign in page

4. **Logout:**
   - User clicks logout button
   - NextAuth signs out the user
   - User is redirected to home page
   - Session is cleared

5. **Protected Routes:**
   - Use `useAuth` hook to check authentication status
   - Redirect unauthenticated users to `/auth/signin`
   - Pass current URL as callback URL for post-login redirect

## Error Handling

The authentication system handles the following errors:

- Invalid credentials
- Network errors
- Server errors
- Session expiration

All errors are displayed to users with clear, actionable messages.

## Security Features

- Passwords are hashed with bcrypt (12 rounds)
- JWT-based session management
- CSRF protection
- Secure HTTP-only cookies
- 30-day session expiration
- Email verification for new accounts
- Password reset tokens are hashed (SHA-256)
- Reset tokens expire after 1 hour
- Tokens are single-use only
- Email enumeration protection (same response for existing/non-existing emails)
- Password complexity requirements (8+ chars, uppercase, lowercase, number)
