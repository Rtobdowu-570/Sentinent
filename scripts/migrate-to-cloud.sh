#!/bin/bash

# Script to migrate Prisma database to cloud
# Supports: Vercel Postgres, Supabase, Neon, Railway

set -e

echo "🚀 Prisma Cloud Database Migration Tool"
echo "========================================"
echo ""

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

echo "Select your cloud database provider:"
echo "1) Vercel Postgres (Recommended for Vercel deployments)"
echo "2) Supabase (Great free tier, 500MB)"
echo "3) Neon (Serverless, auto-scaling)"
echo "4) Railway (Simple & fast)"
echo "5) Custom (I have my own connection string)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "📦 Vercel Postgres Setup"
        echo "========================"
        echo ""
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        echo "Logging in to Vercel..."
        vercel login
        
        echo ""
        echo "Linking to Vercel project..."
        vercel link
        
        echo ""
        echo "Pulling environment variables..."
        vercel env pull .env.local
        
        echo ""
        echo "✅ Vercel environment variables saved to .env.local"
        echo ""
        echo "Next steps:"
        echo "1. Go to https://vercel.com/dashboard"
        echo "2. Select your project → Storage → Create Database → Postgres"
        echo "3. After creation, run: vercel env pull .env.local"
        echo "4. Then run this script again to complete migration"
        ;;
        
    2)
        echo ""
        echo "📦 Supabase Setup"
        echo "================="
        echo ""
        echo "1. Go to https://app.supabase.com"
        echo "2. Create a new project"
        echo "3. Go to Settings → Database"
        echo "4. Copy the Connection string (Transaction mode)"
        echo ""
        read -p "Paste your Supabase connection string: " db_url
        
        if [ -z "$db_url" ]; then
            echo "❌ No connection string provided"
            exit 1
        fi
        
        echo "DATABASE_URL=\"$db_url\"" > .env.cloud
        echo "✅ Connection string saved to .env.cloud"
        ;;
        
    3)
        echo ""
        echo "📦 Neon Setup"
        echo "============="
        echo ""
        echo "1. Go to https://console.neon.tech"
        echo "2. Create a new project"
        echo "3. Copy the Connection string (Pooled)"
        echo ""
        read -p "Paste your Neon connection string: " db_url
        
        if [ -z "$db_url" ]; then
            echo "❌ No connection string provided"
            exit 1
        fi
        
        echo "DATABASE_URL=\"$db_url\"" > .env.cloud
        echo "✅ Connection string saved to .env.cloud"
        ;;
        
    4)
        echo ""
        echo "📦 Railway Setup"
        echo "================"
        echo ""
        echo "1. Go to https://railway.app"
        echo "2. Create a new project"
        echo "3. Add PostgreSQL service"
        echo "4. Copy the Postgres Connection URL"
        echo ""
        read -p "Paste your Railway connection string: " db_url
        
        if [ -z "$db_url" ]; then
            echo "❌ No connection string provided"
            exit 1
        fi
        
        echo "DATABASE_URL=\"$db_url\"" > .env.cloud
        echo "✅ Connection string saved to .env.cloud"
        ;;
        
    5)
        echo ""
        echo "📦 Custom Database Setup"
        echo "========================"
        echo ""
        read -p "Paste your PostgreSQL connection string: " db_url
        
        if [ -z "$db_url" ]; then
            echo "❌ No connection string provided"
            exit 1
        fi
        
        echo "DATABASE_URL=\"$db_url\"" > .env.cloud
        echo "✅ Connection string saved to .env.cloud"
        ;;
        
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# If we have a connection string, proceed with migration
if [ -f ".env.cloud" ]; then
    echo ""
    echo "🔄 Migrating database schema..."
    echo ""
    
    # Load the cloud database URL
    export $(cat .env.cloud | xargs)
    
    # Generate Prisma client
    echo "Generating Prisma client..."
    npx prisma generate
    
    # Push schema to cloud database
    echo ""
    echo "Pushing schema to cloud database..."
    npx prisma db push
    
    echo ""
    echo "✅ Schema migration complete!"
    echo ""
    
    # Ask about data migration
    read -p "Do you want to migrate existing data? (y/n) " migrate_data
    
    if [[ $migrate_data =~ ^[Yy]$ ]]; then
        echo ""
        echo "⚠️  Data migration requires manual steps:"
        echo "1. Export from local: pg_dump your_local_db > backup.sql"
        echo "2. Import to cloud: psql \$DATABASE_URL < backup.sql"
        echo ""
        echo "Or use Prisma Studio to copy data manually:"
        echo "  npx prisma studio"
    fi
    
    echo ""
    echo "🎉 Migration complete!"
    echo ""
    echo "Next steps:"
    echo "1. Test connection: npx prisma studio"
    echo "2. Update Vercel environment variables with your DATABASE_URL"
    echo "3. Deploy: git push or vercel deploy"
    echo ""
    echo "Your cloud database URL is saved in .env.cloud"
    echo "Add it to your .env file or Vercel environment variables"
fi
