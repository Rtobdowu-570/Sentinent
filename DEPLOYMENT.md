# Vercel Deployment Guide

This guide will help you deploy the Agentic Outreach Researcher application to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A [Vercel account](https://vercel.com/signup)
2. A [GitHub account](https://github.com) with your code pushed to a repository
3. All required API keys and services set up:
   - Clerk account for authentication
   - Vercel Postgres database (or another PostgreSQL provider)
   - Google Gemini API key
   - Tavily or Perplexity API key for news search
   - Jina AI API key for web scraping
   - Upstash Redis for rate limiting (optional but recommended)

## Step 1: Set Up External Services

### 1.1 Clerk Authentication

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Enable sign-in methods: Email, Google, GitHub
4. Copy your API keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
5. Set redirect URLs:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

### 1.2 Vercel Postgres Database

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string (it will be automatically added to your environment variables)

### 1.3 Google Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy the `GEMINI_API_KEY`

### 1.4 Tavily API (News Search)

1. Go to [Tavily](https://tavily.com)
2. Sign up and get your API key
3. Copy the `TAVILY_API_KEY`

### 1.5 Jina AI Reader

1. Go to [Jina AI](https://jina.ai)
2. Sign up and get your API key
3. Copy the `JINA_API_KEY`

### 1.6 Upstash Redis (Optional)

1. Go to [Upstash](https://upstash.com)
2. Create a Redis database
3. Copy the REST URL and token:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (or `pnpm build`)
   - **Output Directory**: `.next` (default)

5. Add environment variables (see Step 3)
6. Click "Deploy"

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to link your project
```

## Step 3: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

### Required Variables

```env
# Database
DATABASE_URL=<your-vercel-postgres-url>

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# AI Services
GEMINI_API_KEY=<your-gemini-api-key>

# News Search (at least one required)
TAVILY_API_KEY=<your-tavily-api-key>
# OR
PERPLEXITY_API_KEY=<your-perplexity-api-key>

# Web Scraping
JINA_API_KEY=<your-jina-api-key>

# Rate Limiting (optional but recommended)
UPSTASH_REDIS_REST_URL=<your-upstash-redis-url>
UPSTASH_REDIS_REST_TOKEN=<your-upstash-redis-token>

# App URL (set after first deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Your actual value
   - **Environment**: Select all (Production, Preview, Development)
4. Click "Save"

## Step 4: Set Up Database

After your first deployment, you need to set up the database schema:

### Option A: Using Vercel CLI

```bash
# Connect to your Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run Prisma migrations
npx prisma generate
npx prisma db push
```

### Option B: Using Vercel Dashboard

1. Go to your project → "Settings" → "Environment Variables"
2. Copy your `DATABASE_URL`
3. Run locally:
   ```bash
   DATABASE_URL="<your-vercel-postgres-url>" npx prisma db push
   ```

## Step 5: Update Clerk Redirect URLs

After deployment, update your Clerk application settings:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to "Paths" settings
4. Update URLs to use your Vercel domain:
   - Sign-in URL: `https://your-app.vercel.app/sign-in`
   - Sign-up URL: `https://your-app.vercel.app/sign-up`
   - After sign-in: `https://your-app.vercel.app/dashboard`
   - After sign-up: `https://your-app.vercel.app/dashboard`

## Step 6: Verify Deployment

1. Visit your deployed application: `https://your-app.vercel.app`
2. Test authentication:
   - Sign up with a new account
   - Sign in with existing account
3. Test core functionality:
   - Create a research by entering a company URL
   - View research history
   - Check dashboard statistics

## Troubleshooting

### Build Fails

**Issue**: Build fails with module not found errors

**Solution**: 
- Ensure all dependencies are in `package.json`
- Check that `pnpm-lock.yaml` or `package-lock.json` is committed
- Try clearing build cache in Vercel settings

### Database Connection Errors

**Issue**: "Connection terminated unexpectedly"

**Solution**:
- Verify `DATABASE_URL` is set correctly
- Ensure database schema is pushed: `npx prisma db push`
- Check Vercel Postgres is active and not paused

### Authentication Not Working

**Issue**: Redirects to sign-in page repeatedly

**Solution**:
- Verify all Clerk environment variables are set
- Check Clerk dashboard redirect URLs match your domain
- Ensure `NEXT_PUBLIC_CLERK_*` variables are set for all environments

### API Rate Limits

**Issue**: External API calls failing

**Solution**:
- Verify all API keys are valid and active
- Check API usage limits on provider dashboards
- Ensure environment variables are set in Vercel

### Serverless Function Timeout

**Issue**: Functions timing out (10s limit on Hobby plan)

**Solution**:
- Upgrade to Pro plan for 60s timeout
- Optimize scraping and API calls
- Consider using background jobs for long operations

## Performance Optimization

### 1. Enable Edge Runtime (Optional)

For faster response times, you can enable Edge Runtime for specific routes:

```typescript
// app/api/your-route/route.ts
export const runtime = 'edge'
```

### 2. Configure Caching

Add caching headers to API routes:

```typescript
return NextResponse.json(data, {
  headers: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
  }
})
```

### 3. Optimize Images

Use Next.js Image component for automatic optimization:

```tsx
import Image from 'next/image'

<Image src="/logo.png" alt="Logo" width={200} height={50} />
```

## Monitoring and Analytics

### Vercel Analytics

1. Go to your project → "Analytics"
2. Enable Web Analytics
3. View real-time performance metrics

### Error Tracking

Consider integrating error tracking:
- [Sentry](https://sentry.io)
- [LogRocket](https://logrocket.com)
- [Datadog](https://www.datadoghq.com)

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Custom Domains

1. Go to your project → "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed
4. Update Clerk redirect URLs to use custom domain

## Security Best Practices

1. **Never commit `.env` files** - Use Vercel environment variables
2. **Rotate API keys regularly** - Update in Vercel settings
3. **Use environment-specific keys** - Different keys for production/preview
4. **Enable HTTPS only** - Vercel does this by default
5. **Review Clerk security settings** - Enable MFA, session management

## Cost Considerations

### Vercel Pricing
- **Hobby**: Free (100GB bandwidth, 100 hours serverless execution)
- **Pro**: $20/month (1TB bandwidth, 1000 hours execution)

### Database Costs
- **Vercel Postgres**: Starts at $0.25/month (compute) + storage

### API Costs
- **Gemini API**: Free tier available, then pay-per-use
- **Tavily API**: Check pricing on their website
- **Jina AI**: Free tier available
- **Upstash Redis**: Free tier: 10K requests/day

## Support

If you encounter issues:

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Documentation](https://nextjs.org/docs)
3. Check application logs in Vercel Dashboard
4. Open an issue on GitHub

## Next Steps

After successful deployment:

1. Set up monitoring and alerts
2. Configure custom domain
3. Enable analytics
4. Set up error tracking
5. Plan for scaling (upgrade plans as needed)
6. Implement CI/CD improvements
7. Add end-to-end tests

---

**Congratulations!** Your Agentic Outreach Researcher is now live on Vercel! 🎉
