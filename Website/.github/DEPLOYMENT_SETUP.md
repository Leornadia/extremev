# Deployment Setup Guide

This guide walks you through setting up the complete CI/CD pipeline for the Extreme V website.

## Quick Start

### 1. Vercel Setup (5 minutes)

```bash
# Install Vercel CLI
npm install -g vercel@latest

# Login to Vercel
vercel login

# Link project
vercel link

# Get project IDs
vercel project ls
```

Save these values:
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 2. GitHub Secrets (5 minutes)

Go to GitHub → Settings → Secrets and variables → Actions

Add these secrets:
```
VERCEL_TOKEN          # From https://vercel.com/account/tokens
VERCEL_ORG_ID         # From step 1
VERCEL_PROJECT_ID     # From step 1
DATABASE_URL          # Your production database URL
```

### 3. Vercel Environment Variables (10 minutes)

In Vercel Dashboard → Settings → Environment Variables, add all variables from `.env.example`:

**Required:**
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `EMAIL_FROM`
- `EMAIL_API_KEY`

**Optional but recommended:**
- OAuth credentials
- Analytics IDs
- Monitoring tokens


### 4. Database Setup (10 minutes)

Choose a provider:

**Option A: Railway**
```bash
railway login
railway init
railway add postgresql
railway variables
# Copy DATABASE_URL
```

**Option B: Supabase**
1. Create project at https://supabase.com
2. Go to Settings → Database
3. Copy connection string

**Option C: AWS RDS**
1. Create PostgreSQL instance
2. Configure security groups
3. Get connection string

Then run migrations:
```bash
npm run db:migrate:deploy
npm run db:seed
```

### 5. Test Deployment (5 minutes)

```bash
# Deploy to preview
npm run deploy:preview

# Verify deployment
npm run verify:deployment <preview-url>

# If all good, deploy to production
npm run deploy:production
```

## CI/CD Pipeline

### Workflow Overview

**On Pull Request:**
1. Lint & type check
2. Build application
3. Run E2E tests
4. Deploy preview
5. Run Lighthouse audit
6. Comment preview URL on PR

**On Merge to Main:**
1. All PR checks
2. Run database migrations
3. Deploy to production
4. Verify deployment
5. Notify team

### Workflow Files

- `.github/workflows/ci.yml` - Main CI/CD pipeline
- `.github/workflows/e2e-tests.yml` - E2E test suite
- `.github/workflows/monitoring.yml` - Health checks


## Monitoring Setup

### 1. Vercel Analytics (Automatic)

Already configured via `@vercel/analytics` package.

### 2. Sentry Error Tracking (Optional)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to Vercel environment variables:
```
NEXT_PUBLIC_SENTRY_DSN=<your-dsn>
SENTRY_AUTH_TOKEN=<your-token>
```

### 3. Uptime Monitoring

**UptimeRobot Setup:**
1. Create account at https://uptimerobot.com
2. Add monitors:
   - `https://www.extremev.co.za` (Homepage)
   - `https://www.extremev.co.za/api/health` (API)
   - `https://www.extremev.co.za/configurator` (Configurator)
3. Configure alerts (email, SMS, Slack)

### 4. Slack Notifications (Optional)

Create Slack webhook and add to GitHub secrets:
```
SLACK_WEBHOOK_URL=<your-webhook-url>
```

## Rollback Procedures

### Quick Rollback

**Via Vercel Dashboard:**
1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

**Via CLI:**
```bash
vercel rollback
```

### Database Rollback

```bash
# Restore from backup
railway db restore <backup-id>

# Or manually revert migration
psql $DATABASE_URL < rollback.sql
```

## Troubleshooting

### Build Fails

```bash
# Pull environment variables
vercel env pull .env.local

# Test build locally
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check connection string format
echo $DATABASE_URL
```

### Deployment Verification Fails

```bash
# Check specific endpoint
curl -I https://www.extremev.co.za/api/health

# View Vercel logs
vercel logs
```

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **GitHub Issues**: Create issue in repository

## Checklist

Before going live:

- [ ] Vercel project configured
- [ ] GitHub secrets added
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Preview deployment tested
- [ ] Monitoring configured
- [ ] Alerts tested
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Backup strategy in place
- [ ] Team trained on rollback procedures
