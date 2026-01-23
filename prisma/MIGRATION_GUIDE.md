# Database Migration Guide

## Quick Start

This guide helps you apply the database migrations for the Extreme V website.

## Prerequisites

Ensure you have a running PostgreSQL database. See `DATABASE_SETUP.md` for setup instructions.

## Apply Migrations

### Development Environment

```bash
# Apply all pending migrations
npx prisma migrate dev

# This will:
# 1. Apply the migration to your database
# 2. Generate the Prisma Client
# 3. Prompt to seed the database (optional)
```

### Production Environment

```bash
# Apply migrations without prompts
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Seed the Database

After applying migrations, populate with sample data:

```bash
npx prisma db seed
```

This creates:

- 3 Product Tiers (Essential, Premium, Luxury)
- 6 Sample Products
- 10 Modular Components
- 1 Test User
- 2 Sample Saved Designs

## Verify Migration

Check that tables were created:

```bash
# Open Prisma Studio
npx prisma studio
```

Or connect directly to your database:

```bash
# Using psql
psql $DATABASE_URL

# List tables
\dt

# Check User table
SELECT * FROM "User";

# Check SavedDesign table
SELECT * FROM "SavedDesign";
```

## Current Migrations

### 20241029000000_add_user_and_saved_design_models

Adds user authentication and design management models:

- User, Account, Session, VerificationToken (NextAuth)
- PasswordResetToken
- SavedDesign
- QuoteRequest

See `prisma/migrations/20241029000000_add_user_and_saved_design_models/README.md` for details.

## Troubleshooting

### "Can't reach database server"

Ensure your database is running:

```bash
# If using Docker
docker ps

# Start if not running
docker start extremev-postgres
```

### "Database does not exist"

Create the database:

```bash
createdb extremev
```

### Reset Database (Development Only)

⚠️ **WARNING**: This deletes all data!

```bash
npx prisma migrate reset
```

This will:

1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run the seed script

## Migration Status

Check which migrations have been applied:

```bash
npx prisma migrate status
```

## Generate Prisma Client

After schema changes:

```bash
npx prisma generate
```

## Common Workflows

### Adding a New Model

1. Edit `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name add_new_model`
3. Update seed script if needed
4. Test the migration

### Modifying an Existing Model

1. Edit `prisma/schema.prisma`
2. Create migration: `npx prisma migrate dev --name modify_model_name`
3. Review the generated SQL
4. Apply and test

### Rolling Back (Development)

```bash
# Reset to a clean state
npx prisma migrate reset

# Or manually delete migration files and reset
```

## Production Deployment Checklist

- [ ] Backup production database
- [ ] Test migrations on staging environment
- [ ] Review generated SQL for any issues
- [ ] Apply migrations: `npx prisma migrate deploy`
- [ ] Verify application functionality
- [ ] Monitor for errors

## Additional Resources

- [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- Project-specific: `DATABASE_SETUP.md`
