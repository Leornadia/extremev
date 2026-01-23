# Deployment Quick Reference

## Essential Commands

### Deploy
```bash
npm run deploy:preview      # Deploy to preview
npm run deploy:production   # Deploy to production
```

### Database
```bash
npm run db:migrate:deploy   # Run migrations
npm run migrate:production  # Safe production migration
```

### Verification
```bash
npm run verify:deployment <url>  # Verify deployment
curl https://www.extremev.co.za/api/health  # Health check
```

### Rollback
```bash
vercel rollback             # Rollback deployment
```

## GitHub Actions Workflows

- **CI/CD**: `.github/workflows/ci.yml`
- **E2E Tests**: `.github/workflows/e2e-tests.yml`
- **Monitoring**: `.github/workflows/monitoring.yml`

## Environment Variables

### Required
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `EMAIL_API_KEY`

### GitHub Secrets
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## Monitoring

- **Health**: https://www.extremev.co.za/api/health
- **Vercel Dashboard**: https://vercel.com/dashboard
- **UptimeRobot**: Configure at https://uptimerobot.com

## Documentation

- **Full Guide**: `DEPLOYMENT.md`
- **Setup**: `.github/DEPLOYMENT_SETUP.md`
- **Monitoring**: `MONITORING.md`

## Support

- Vercel: https://vercel.com/support
- GitHub Issues: Create in repository
