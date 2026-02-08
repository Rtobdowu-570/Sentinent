# Vercel Quick Start Guide

Get your Agentic Outreach Researcher deployed to Vercel in minutes!

## 🚀 Quick Deploy (5 Minutes)

### 1. Prepare Your Repository

```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the "Deploy" button above (or go to [vercel.com/new](https://vercel.com/new))
2. Import your GitHub repository
3. Vercel will auto-detect Next.js settings
4. Click "Deploy" (it will fail initially - that's expected!)

### 3. Add Environment Variables

Go to your project → Settings → Environment Variables and add:

**Critical Variables** (app won't work without these):
```
DATABASE_URL=<from-vercel-postgres>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<from-clerk>
CLERK_SECRET_KEY=<from-clerk>
GEMINI_API_KEY=<from-google>
TAVILY_API_KEY=<from-tavily>
JINA_API_KEY=<from-jina>
```

**Clerk URLs** (copy these exactly):
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Set Up Database

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Set up database
npx prisma generate
npx prisma db push
```

### 5. Redeploy

Go to Vercel Dashboard → Deployments → Click "Redeploy"

### 6. Update Clerk

Go to [Clerk Dashboard](https://dashboard.clerk.com) → Your App → Paths:
- Update all URLs to use your Vercel domain: `https://your-app.vercel.app`

### 7. Test Your App

Visit `https://your-app.vercel.app` and:
- ✅ Sign up with a new account
- ✅ Create a research
- ✅ View dashboard

## 📋 Where to Get API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| Clerk | [dashboard.clerk.com](https://dashboard.clerk.com) | ✅ Yes |
| Vercel Postgres | [vercel.com/storage](https://vercel.com/storage) | ✅ Yes |
| Google Gemini | [makersuite.google.com](https://makersuite.google.com/app/apikey) | ✅ Yes |
| Tavily | [tavily.com](https://tavily.com) | ✅ Limited |
| Jina AI | [jina.ai](https://jina.ai) | ✅ Yes |
| Upstash Redis | [upstash.com](https://upstash.com) | ✅ Yes (optional) |

## 🔧 Troubleshooting

### Build Fails
```bash
# Check build logs in Vercel Dashboard
# Common fix: Clear build cache and redeploy
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set
# Run: npx prisma db push
```

### Authentication Not Working
```bash
# Check all CLERK_* variables are set
# Update Clerk redirect URLs to match your domain
```

### API Errors
```bash
# Verify all API keys are valid
# Check API provider dashboards for usage limits
```

## 📚 Full Documentation

- **Detailed Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Checklist**: [.vercel-deploy-checklist.md](./.vercel-deploy-checklist.md)
- **Main README**: [README.md](./README.md)

## 💡 Pro Tips

1. **Use Preview Deployments**: Every PR gets a preview URL
2. **Environment Variables**: Set different keys for Production vs Preview
3. **Custom Domain**: Add in Settings → Domains
4. **Analytics**: Enable in Settings → Analytics
5. **Monitoring**: Set up error tracking (Sentry, LogRocket)

## 🆘 Need Help?

1. Check [Vercel Documentation](https://vercel.com/docs)
2. Review deployment logs in Vercel Dashboard
3. Check [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
4. Open an issue on GitHub

## 🎉 Success!

Your app is now live! Share your deployment:
- Production URL: `https://your-app.vercel.app`
- Custom domain: Configure in Vercel settings

---

**Next Steps:**
- [ ] Add custom domain
- [ ] Enable analytics
- [ ] Set up monitoring
- [ ] Configure CI/CD
- [ ] Add end-to-end tests
