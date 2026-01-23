# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All tests passing (`npm run test:e2e`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format:check`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)

### Environment Setup
- [ ] Vercel project created
- [ ] GitHub secrets configured
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `DATABASE_URL`
- [ ] Vercel environment variables set
  - [ ] `DATABASE_URL`
  - [ ] `DIRECT_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL`
  - [ ] `EMAIL_API_KEY`
  - [ ] `CRON_SECRET`
  - [ ] All public variables (`NEXT_PUBLIC_*`)

### Database
- [ ] Database created and accessible
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Migrations tested in staging
- [ ] Seed data prepared (if needed)

### Monitoring
- [ ] Vercel Analytics enabled
- [ ] UptimeRobot monitors configured
  - [ ] Homepage monitor
  - [ ] API health monitor
  - [ ] Configurator monitor
- [ ] Alert channels configured
  - [ ] Email alerts
  - [ ] Slack notifications (optional)
- [ ] Sentry configured (optional)

### Security
- [ ] Environment variables secured
- [ ] API routes protected
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers configured

## Deployment

### Initial Deployment
- [ ] Deploy to preview first
- [ ] Test preview deployment thoroughly
- [ ] Run verification script
- [ ] Check health endpoint
- [ ] Test critical user flows
- [ ] Review performance metrics

### Production Deployment
- [ ] Create database backup
- [ ] Notify team of deployment
- [ ] Merge to main branch
- [ ] Monitor CI/CD pipeline
- [ ] Verify deployment success
- [ ] Run post-deployment checks

## Post-Deployment

### Verification
- [ ] Homepage loads correctly
- [ ] API endpoints responding
- [ ] Configurator functional
- [ ] Database connectivity confirmed
- [ ] Health check passing
- [ ] SSL certificate active
- [ ] DNS configured correctly

### Testing
- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test configurator
- [ ] Test quote request
- [ ] Test contact form
- [ ] Test admin dashboard

### Monitoring
- [ ] Check Vercel Analytics
- [ ] Verify UptimeRobot status
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor response times

### Documentation
- [ ] Update deployment log
- [ ] Document any issues
- [ ] Update team wiki
- [ ] Notify stakeholders

## Rollback Plan

If issues occur:
- [ ] Identify the issue
- [ ] Assess severity
- [ ] Decide: fix forward or rollback
- [ ] Execute rollback if needed
- [ ] Verify rollback success
- [ ] Document incident
- [ ] Plan fix for next deployment

## Emergency Contacts

- **On-call Engineer**: [Name/Contact]
- **Lead Developer**: [Name/Contact]
- **Database Admin**: [Name/Contact]
- **DevOps**: [Name/Contact]

## Resources

- **Deployment Guide**: `DEPLOYMENT.md`
- **Monitoring Guide**: `MONITORING.md`
- **Quick Reference**: `.github/DEPLOYMENT_QUICK_REFERENCE.md`
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/[org]/[repo]/actions

## Notes

- Always deploy during low-traffic hours when possible
- Have rollback plan ready before deploying
- Monitor closely for first 30 minutes after deployment
- Document any issues or learnings
