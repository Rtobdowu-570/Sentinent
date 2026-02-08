# Database Migration Guide: Local to Cloud

This guide will help you migrate your Prisma database from local development to a cloud provider.

## Option 1: Vercel Postgres (Recommended)

**Best for**: Vercel deployments, simplest setup, automatic integration

### Step 1: Create Vercel Postgres Database

#### Via Vercel Dashboard (Easiest):

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create one)
3. Click **"Storage"** tab
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Configure:
   - **Name**: `agentic-outreach-db` (or your choice)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
7. Click **"Create"**

#### Via Vercel CLI:

```bash
# Login to Vercel
vercel login

# Link your project
vercel link

# Create database (follow prompts)
vercel storage create postgres
```

### Step 2: Get Connection String

After creation, Vercel automatically adds these environment variables:
- `POSTGRES_URL` - Connection string with pooling
- `POSTGRES_URL_NON_POOLING` - Direct connection (use for migrations)
- `POSTGRES_PRISMA_URL` - Optimized for Prisma
- `POSTGRES_URL_NO_SSL` - Without SSL

**Use `POSTGRES_PRISMA_URL` for your app!**

### Step 3: Update Local Environment

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# This creates .env.local with your cloud database URL
```

Your `.env.local` will now have:
```env
POSTGRES_PRISMA_URL="postgres://..."
```

### Step 4: Update Your `.env` for Local Development

Option A - Use cloud database for local dev:
```bash
# Copy from .env.local
DATABASE_URL="<your-POSTGRES_PRISMA_URL>"
```

Option B - Keep local database, use cloud only in production:
```bash
# Keep your local DATABASE_URL in .env
# Cloud URL will be used automatically in Vercel
```

### Step 5: Migrate Schema to Cloud Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to cloud database
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate deploy
```

### Step 6: Migrate Existing Data (Optional)

If you have data in your local database:

```bash
# Export data from local database
npx prisma db seed  # If you have a seed script

# Or manually export/import
pg_dump your_local_db > backup.sql
psql $POSTGRES_URL_NON_POOLING < backup.sql
```

### Step 7: Verify Connection

```bash
# Test the connection
npx prisma studio

# Should open Prisma Studio connected to cloud database
```

### Step 8: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   ```
   DATABASE_URL = <your-POSTGRES_PRISMA_URL>
   ```
3. Select all environments (Production, Preview, Development)
4. Save

### Step 9: Deploy

```bash
# Commit changes
git add .
git commit -m "Configure cloud database"
git push

# Or redeploy in Vercel Dashboard
```

---

## Option 2: Supabase (Great Free Tier)

**Best for**: Free tier with 500MB storage, built-in auth, real-time features

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Configure:
   - **Name**: Your project name
   - **Database Password**: Strong password (save it!)
   - **Region**: Closest to your users
4. Click **"Create new project"**

### Step 2: Get Connection String

1. In Supabase Dashboard → Settings → Database
2. Copy **Connection string** (Transaction mode)
3. Replace `[YOUR-PASSWORD]` with your database password

Format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### Step 3: Update Environment Variables

```env
# .env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

### Step 4: Migrate Schema

```bash
npx prisma generate
npx prisma db push
```

### Step 5: Update Vercel

Add `DATABASE_URL` to Vercel environment variables with your Supabase connection string.

---

## Option 3: Neon (Serverless Postgres)

**Best for**: Serverless, auto-scaling, generous free tier

### Step 1: Create Neon Project

1. Go to [Neon Console](https://console.neon.tech)
2. Click **"Create a project"**
3. Configure:
   - **Name**: Your project name
   - **Region**: Closest to your users
4. Click **"Create project"**

### Step 2: Get Connection String

1. In Neon Console → Dashboard
2. Copy **Connection string**
3. Choose **Pooled connection** for better performance

### Step 3: Update Environment Variables

```env
# .env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
```

### Step 4: Migrate Schema

```bash
npx prisma generate
npx prisma db push
```

---

## Option 4: Railway (Simple & Fast)

**Best for**: Quick setup, developer-friendly

### Step 1: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**

### Step 2: Get Connection String

1. Click on your Postgres service
2. Go to **"Connect"** tab
3. Copy **Postgres Connection URL**

### Step 3: Update Environment Variables

```env
# .env
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:7432/railway"
```

### Step 4: Migrate Schema

```bash
npx prisma generate
npx prisma db push
```

---

## Option 5: PlanetScale (MySQL - Requires Schema Changes)

**Note**: PlanetScale uses MySQL, so you'll need to update your Prisma schema.

### Step 1: Update Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"  // Changed from postgresql
  url      = env("DATABASE_URL")
  relationMode = "prisma"  // Required for PlanetScale
}
```

### Step 2: Create PlanetScale Database

1. Go to [PlanetScale](https://planetscale.com)
2. Create new database
3. Get connection string

### Step 3: Update and Migrate

```bash
npx prisma generate
npx prisma db push
```

---

## Comparison Table

| Provider | Free Tier | Best For | Setup Time |
|----------|-----------|----------|------------|
| **Vercel Postgres** | 256MB | Vercel deployments | 2 min |
| **Supabase** | 500MB | Full-featured, auth | 3 min |
| **Neon** | 3GB | Serverless, scaling | 2 min |
| **Railway** | $5 credit | Quick setup | 2 min |
| **PlanetScale** | 5GB | MySQL, branching | 5 min |

---

## Migration Checklist

- [ ] Choose cloud provider
- [ ] Create database
- [ ] Get connection string
- [ ] Update `.env` or `.env.local`
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Test connection with `npx prisma studio`
- [ ] Update Vercel environment variables
- [ ] Deploy and test
- [ ] Migrate existing data (if needed)
- [ ] Update documentation

---

## Troubleshooting

### Connection Timeout

**Issue**: Database connection times out

**Solutions**:
- Check if database is in same region as Vercel deployment
- Verify connection string is correct
- Ensure SSL mode is set correctly
- Check firewall/IP whitelist settings

### SSL Certificate Error

**Issue**: SSL certificate verification failed

**Solutions**:
```env
# Add to connection string
DATABASE_URL="postgresql://...?sslmode=require"

# Or disable SSL (not recommended for production)
DATABASE_URL="postgresql://...?sslmode=disable"
```

### Migration Fails

**Issue**: `prisma db push` fails

**Solutions**:
```bash
# Use direct connection (not pooled)
DATABASE_URL="<non-pooled-url>" npx prisma db push

# Or use migrations
npx prisma migrate dev --name init
npx prisma migrate deploy
```

### Connection Pool Exhausted

**Issue**: Too many connections

**Solutions**:
- Use connection pooling (PgBouncer)
- Reduce `max` in Pool configuration
- Use Vercel's `POSTGRES_PRISMA_URL` (has built-in pooling)

---

## Best Practices

1. **Use Connection Pooling**: Always use pooled connections in production
2. **Separate Environments**: Different databases for dev/staging/production
3. **Backup Regularly**: Set up automated backups
4. **Monitor Usage**: Track database size and query performance
5. **Use Migrations**: For production, use `prisma migrate` instead of `db push`
6. **Secure Credentials**: Never commit connection strings to git
7. **SSL in Production**: Always use SSL for production databases

---

## Cost Optimization

1. **Start with Free Tier**: Most providers offer generous free tiers
2. **Monitor Usage**: Set up alerts for storage/bandwidth limits
3. **Clean Old Data**: Regularly archive or delete old records
4. **Optimize Queries**: Use indexes and efficient queries
5. **Connection Pooling**: Reduces connection overhead

---

## Next Steps After Migration

1. **Set up backups**: Configure automated backups
2. **Enable monitoring**: Set up database monitoring
3. **Configure alerts**: Get notified of issues
4. **Document connection**: Update team documentation
5. **Test thoroughly**: Verify all features work with cloud database

---

## Need Help?

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Docs](https://supabase.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Railway Docs](https://docs.railway.app)
