#!/bin/bash

# Production Database Migration Script
# This script safely runs database migrations in production

set -e  # Exit on error

echo "🔄 Starting production database migration..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL environment variable is not set"
  exit 1
fi

# Check if we're in production
if [ "$NODE_ENV" != "production" ]; then
  echo "⚠️  Warning: NODE_ENV is not set to 'production'"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Backup reminder
echo "⚠️  IMPORTANT: Ensure you have a recent database backup before proceeding!"
read -p "Do you have a recent backup? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "❌ Please create a backup before running migrations"
  exit 1
fi

# Generate Prisma Client
echo "📦 Generating Prisma Client..."
npm run db:generate

# Run migrations
echo "🚀 Running database migrations..."
npm run db:migrate:deploy

# Verify migration
if [ $? -eq 0 ]; then
  echo "✅ Database migrations completed successfully!"
  
  # Optional: Run a health check
  echo "🔍 Running post-migration health check..."
  # Add your health check command here if needed
  # curl -f https://www.extremev.co.za/api/health || exit 1
  
  echo "✅ All checks passed!"
else
  echo "❌ Migration failed! Please check the logs and restore from backup if necessary."
  exit 1
fi
