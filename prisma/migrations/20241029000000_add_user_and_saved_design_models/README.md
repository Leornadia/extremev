# Migration: Add User and SavedDesign Models

**Created:** October 29, 2025  
**Migration Name:** `add_user_and_saved_design_models`

## Overview

This migration adds the User and SavedDesign models to support user authentication and design management functionality as specified in Requirement 13.3.

## Models Added

### User Model

- Stores user account information for authentication
- Supports both email/password and OAuth authentication via NextAuth.js
- Includes fields for email verification and profile information
- Related to SavedDesign and QuoteRequest models

### Account Model (NextAuth)

- Stores OAuth provider account information
- Links external authentication providers to User accounts

### Session Model (NextAuth)

- Manages user session tokens
- Enables secure session-based authentication

### VerificationToken Model (NextAuth)

- Handles email verification tokens
- Used for passwordless authentication flows

### PasswordResetToken Model

- Manages password reset tokens
- Includes expiration and usage tracking

### SavedDesign Model

- Stores user-created playground configurations from the Product Configurator
- Contains complete design data as JSON
- Includes thumbnail for visual preview
- Linked to User via foreign key with CASCADE delete

### QuoteRequest Model

- Stores customer quote requests with design snapshots
- Can be linked to authenticated users or anonymous submissions
- Includes pricing calculations and customer information

## Key Features

### User Model

- **Authentication**: Supports both credential-based and OAuth authentication
- **Email Verification**: Tracks email verification status
- **Profile**: Stores name, phone, and optional profile image
- **Relationships**: One-to-many with SavedDesign and QuoteRequest

### SavedDesign Model

- **Design Storage**: Complete configurator state stored as JSON
- **Thumbnails**: Visual preview of saved designs
- **Timestamps**: Tracks creation and last update
- **User Association**: Linked to User with CASCADE delete (designs deleted when user is deleted)

## Indexes

Performance indexes added for:

- User email lookups
- SavedDesign queries by userId and creation date
- QuoteRequest queries by userId, status, and creation date
- Account and Session lookups for authentication

## Foreign Key Relationships

- `Account.userId` → `User.id` (CASCADE delete)
- `Session.userId` → `User.id` (CASCADE delete)
- `SavedDesign.userId` → `User.id` (CASCADE delete)
- `QuoteRequest.userId` → `User.id` (SET NULL on delete)

## To Apply This Migration

When the database is available, run:

```bash
# Apply the migration
npx prisma migrate deploy

# Or in development
npx prisma migrate dev
```

## Seed Data

The seed script (`prisma/seed.ts`) has been updated to include:

- Sample test user account
- Two sample saved designs demonstrating the data structure

Run the seed after migration:

```bash
npx prisma db seed
```

## Requirements Satisfied

This migration satisfies **Requirement 13.3** from the website redesign specification:

- ✅ User model added to Prisma schema
- ✅ SavedDesign model added with proper relationships
- ✅ Migration created
- ✅ Seed script updated with sample user and design data

## Related Files

- `prisma/schema.prisma` - Schema definitions
- `prisma/seed.ts` - Updated seed script with user and design data
- `lib/auth.ts` - NextAuth configuration using these models
- `app/api/designs/` - API routes for design management
