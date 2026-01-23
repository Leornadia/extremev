# Database Setup Guide

## Overview

This project uses PostgreSQL with Prisma ORM for database management. The database stores product information, user accounts, saved designs, and quote requests.

## Local Development Setup

### Option 1: Local PostgreSQL Installation

1. Install PostgreSQL on your machine
2. Create a database:
   ```bash
   createdb extremev
   ```
3. Update `.env.local` with your connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/extremev"
   ```

### Option 2: Docker PostgreSQL

1. Run PostgreSQL in Docker:
   ```bash
   docker run --name extremev-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=extremev -p 5432:5432 -d postgres:15
   ```
2. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/extremev"
   ```

## Production Setup

### Railway

1. Create a new PostgreSQL database on Railway
2. Copy the connection string from Railway dashboard
3. Add to your production environment variables:
   ```
   DATABASE_URL="postgresql://user:password@host.railway.app:5432/railway?pgbouncer=true"
   ```

### Supabase

1. Create a new project on Supabase
2. Go to Settings > Database
3. Copy the connection string (use "Connection Pooling" for production)
4. Add to environment variables:
   ```
   DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
   ```

### AWS RDS

1. Create a PostgreSQL instance on AWS RDS
2. Configure security groups to allow connections
3. Enable connection pooling with RDS Proxy (recommended)
4. Add connection string to environment variables

## Connection Pooling

For production deployments, connection pooling is essential to handle serverless function connections efficiently.

**PgBouncer** (recommended for Railway/Supabase):

- Add `?pgbouncer=true` to your DATABASE_URL
- Set `connection_limit=10` in the connection string

**RDS Proxy** (for AWS):

- Create an RDS Proxy for your database
- Use the proxy endpoint in your DATABASE_URL

## Database Migrations

### Create a new migration

```bash
npx prisma migrate dev --name description_of_changes
```

### Apply migrations to production

```bash
npx prisma migrate deploy
```

### Reset database (development only)

```bash
npx prisma migrate reset
```

## Prisma Client

### Generate Prisma Client

After schema changes, regenerate the client:

```bash
npx prisma generate
```

### Prisma Studio (Database GUI)

View and edit data in your database:

```bash
npx prisma studio
```

## Seeding the Database

Run the seed script to populate initial data:

```bash
npx prisma db seed
```

## Backup Strategy

### Automated Backups

**Railway**: Automatic daily backups included in paid plans

**Supabase**: Automatic daily backups, point-in-time recovery available

**AWS RDS**: Configure automated backups in RDS settings

- Set backup retention period (7-35 days recommended)
- Enable automated snapshots
- Configure backup window during low-traffic hours

### Manual Backup

```bash
# Export database
pg_dump -h hostname -U username -d extremev > backup.sql

# Restore database
psql -h hostname -U username -d extremev < backup.sql
```

## Monitoring

- Monitor connection pool usage
- Set up alerts for connection limits
- Track query performance with Prisma logging
- Use database provider's monitoring tools

## Security Best Practices

1. Never commit `.env` files with real credentials
2. Use strong passwords for database users
3. Restrict database access to specific IP addresses
4. Enable SSL/TLS for database connections
5. Regularly update database and Prisma versions
6. Use read replicas for heavy read operations (production)
7. Implement rate limiting on API endpoints

## Troubleshooting

### Connection Issues

- Verify DATABASE_URL is correct
- Check firewall/security group settings
- Ensure database is running
- Verify SSL requirements

### Migration Issues

- Use `DIRECT_URL` for migrations if using connection pooling
- Check for schema conflicts
- Review migration history: `npx prisma migrate status`

### Performance Issues

- Enable connection pooling
- Add database indexes (already configured in schema)
- Use Prisma query optimization
- Consider read replicas for scaling
