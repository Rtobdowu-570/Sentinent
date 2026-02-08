# Quick Database Setup - TL;DR

Choose your path and follow the steps. Takes 5 minutes!

## 🚀 Fastest: Vercel Postgres (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login and link
vercel login
vercel link

# 3. Create database in Vercel Dashboard
# Go to: https://vercel.com/dashboard → Your Project → Storage → Create Database → Postgres

# 4. Pull environment variables
vercel env pull .env.local

# 5. Migrate schema
npx prisma generate
npx prisma db push

# Done! ✅
```

**Cost**: ~$0.25/month (256MB free tier)

---

## 🎯 Alternative: Supabase (Best Free Tier)

```bash
# 1. Create project at https://app.supabase.com

# 2. Get connection string
# Dashboard → Settings → Database → Connection string (Transaction mode)

# 3. Update .env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres"

# 4. Migrate
npx prisma generate
npx prisma db push

# Done! ✅
```

**Cost**: Free (500MB)

---

## ⚡ Alternative: Neon (Serverless)

```bash
# 1. Create project at https://console.neon.tech

# 2. Copy connection string (Pooled)

# 3. Update .env
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require"

# 4. Migrate
npx prisma generate
npx prisma db push

# Done! ✅
```

**Cost**: Free (3GB)

---

## 🛠️ Use Migration Script (Easiest)

### Mac/Linux:
```bash
./scripts/migrate-to-cloud.sh
```

### Windows:
```powershell
.\scripts\migrate-to-cloud.ps1
```

The script will guide you through the entire process!

---

## 📋 After Migration Checklist

- [ ] Test connection: `npx prisma studio`
- [ ] Update Vercel env vars with `DATABASE_URL`
- [ ] Deploy: `git push` or `vercel deploy`
- [ ] Test your app in production

---

## 🆘 Troubleshooting

### Connection fails?
```bash
# Check your connection string
echo $DATABASE_URL

# Test with Prisma
npx prisma db execute --stdin <<< "SELECT 1;"
```

### SSL error?
```bash
# Add to connection string
?sslmode=require
```

### Need help?
See [DATABASE-MIGRATION-GUIDE.md](./DATABASE-MIGRATION-GUIDE.md) for detailed instructions.

---

## 💡 Pro Tips

1. **Use pooled connections** in production (Vercel does this automatically)
2. **Keep local database** for development, use cloud for production
3. **Set up backups** after migration
4. **Monitor usage** to avoid surprise costs

---

## 🔗 Quick Links

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/docs/guides/database)
- [Neon](https://neon.tech/docs/introduction)
- [Prisma Docs](https://www.prisma.io/docs)
