# OAuth Setup Guide

This guide explains how to configure Google and Facebook OAuth providers for the Extreme V website authentication system.

## Overview

The authentication system supports three methods:

1. **Email/Password** - Traditional credentials-based authentication
2. **Google OAuth** - Sign in with Google account
3. **Facebook OAuth** - Sign in with Facebook account

OAuth providers are optional and can be enabled by configuring the appropriate environment variables.

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"

### 2. Configure OAuth Consent Screen

1. Click "OAuth consent screen" in the left sidebar
2. Select "External" user type (or "Internal" if using Google Workspace)
3. Fill in the required information:
   - **App name**: Extreme V
   - **User support email**: Your support email
   - **Developer contact email**: Your developer email
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users (for development)
6. Save and continue

### 3. Create OAuth 2.0 Credentials

1. Click "Credentials" in the left sidebar
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application"
4. Configure:
   - **Name**: Extreme V Web Client
   - **Authorized JavaScript origins**:
     - Development: `http://localhost:3000`
     - Production: `https://www.extremev.co.za`
   - **Authorized redirect URIs**:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://www.extremev.co.za/api/auth/callback/google`
5. Click "Create"
6. Copy the **Client ID** and **Client Secret**

### 4. Add to Environment Variables

Add to your `.env` or `.env.local` file:

```bash
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Facebook OAuth Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" > "Create App"
3. Select "Consumer" as the app type
4. Fill in the app details:
   - **App name**: Extreme V
   - **App contact email**: Your contact email
5. Click "Create App"

### 2. Add Facebook Login Product

1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Select "Web" as the platform
4. Enter your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://www.extremev.co.za`

### 3. Configure OAuth Settings

1. Go to "Facebook Login" > "Settings" in the left sidebar
2. Add **Valid OAuth Redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/facebook`
   - Production: `https://www.extremev.co.za/api/auth/callback/facebook`
3. Save changes

### 4. Get App Credentials

1. Go to "Settings" > "Basic" in the left sidebar
2. Copy the **App ID** and **App Secret**
3. For production, you'll need to switch the app from "Development" to "Live" mode

### 5. Add to Environment Variables

Add to your `.env` or `.env.local` file:

```bash
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

## Testing OAuth Integration

### Local Development

1. Ensure all environment variables are set in `.env.local`
2. Restart your development server: `npm run dev`
3. Navigate to `/auth/signin` or `/auth/register`
4. Click "Google" or "Facebook" button
5. Complete the OAuth flow
6. You should be redirected back to the application and signed in

### Verify Database

After successful OAuth sign-in, check your database:

```sql
-- Check user was created
SELECT * FROM "User" WHERE email = 'your-oauth-email@example.com';

-- Check OAuth account was linked
SELECT * FROM "Account" WHERE provider IN ('google', 'facebook');
```

## Account Linking

The system uses `allowDangerousEmailAccountLinking: true` which means:

- If a user signs up with email/password and later signs in with Google/Facebook using the same email, the accounts will be automatically linked
- Users can sign in with any linked authentication method
- This is convenient but requires email verification to be secure

**Security Note**: In production, ensure email verification is enforced before allowing account linking.

## Troubleshooting

### "Redirect URI mismatch" Error

**Problem**: OAuth provider rejects the redirect URI

**Solution**:

- Verify the redirect URI in your OAuth provider settings exactly matches: `{NEXTAUTH_URL}/api/auth/callback/{provider}`
- Check that `NEXTAUTH_URL` environment variable is set correctly
- Ensure there are no trailing slashes

### "Invalid client" Error

**Problem**: Client ID or Secret is incorrect

**Solution**:

- Double-check the credentials in your `.env` file
- Ensure there are no extra spaces or quotes
- Verify you're using the correct credentials for your environment (dev vs production)

### OAuth Sign-in Works but User Not Created

**Problem**: OAuth flow completes but user is not in database

**Solution**:

- Check database connection is working
- Verify Prisma schema includes `Account` and `Session` models
- Run `npx prisma generate` to update Prisma Client
- Check server logs for database errors

### "Email already in use" Error

**Problem**: User tries to sign up with OAuth but email is already registered

**Solution**:

- This is expected behavior with `allowDangerousEmailAccountLinking: false`
- User should sign in with their original method first
- Or enable account linking (current configuration)

## Production Deployment

### Checklist

- [ ] Update OAuth redirect URIs to production domain
- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Verify `NEXTAUTH_SECRET` is set to a secure random string
- [ ] Test OAuth flows on production domain
- [ ] Switch Facebook app to "Live" mode
- [ ] Verify Google OAuth consent screen is published
- [ ] Enable email verification for security
- [ ] Monitor OAuth error logs

### Environment Variables

Ensure these are set in your production environment (Vercel, Railway, etc.):

```bash
NEXTAUTH_URL="https://www.extremev.co.za"
NEXTAUTH_SECRET="your-production-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

## Security Considerations

1. **Never commit credentials**: Keep `.env` files out of version control
2. **Use different credentials**: Use separate OAuth apps for development and production
3. **Rotate secrets**: Periodically rotate client secrets
4. **Monitor usage**: Check OAuth provider dashboards for suspicious activity
5. **Email verification**: Enforce email verification before account linking
6. **HTTPS only**: OAuth should only be used over HTTPS in production

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Prisma Adapter for NextAuth](https://authjs.dev/reference/adapter/prisma)

## Support

If you encounter issues with OAuth setup:

1. Check the [NextAuth.js Discussions](https://github.com/nextauthjs/next-auth/discussions)
2. Review provider-specific documentation
3. Check application logs for detailed error messages
4. Verify all environment variables are correctly set
