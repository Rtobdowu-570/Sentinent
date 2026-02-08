# Script to migrate Prisma database to cloud (Windows)
# Supports: Vercel Postgres, Supabase, Neon, Railway

Write-Host "🚀 Prisma Cloud Database Migration Tool" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if npx is available
try {
    $null = Get-Command npx -ErrorAction Stop
} catch {
    Write-Host "❌ npx not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

Write-Host "Select your cloud database provider:"
Write-Host "1) Vercel Postgres (Recommended for Vercel deployments)"
Write-Host "2) Supabase (Great free tier, 500MB)"
Write-Host "3) Neon (Serverless, auto-scaling)"
Write-Host "4) Railway (Simple & fast)"
Write-Host "5) Custom (I have my own connection string)"
Write-Host ""
$choice = Read-Host "Enter choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 Vercel Postgres Setup" -ForegroundColor Cyan
        Write-Host "========================" -ForegroundColor Cyan
        Write-Host ""
        
        # Check if Vercel CLI is installed
        try {
            $null = Get-Command vercel -ErrorAction Stop
        } catch {
            Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
            npm install -g vercel
        }
        
        Write-Host "Logging in to Vercel..."
        vercel login
        
        Write-Host ""
        Write-Host "Linking to Vercel project..."
        vercel link
        
        Write-Host ""
        Write-Host "Pulling environment variables..."
        vercel env pull .env.local
        
        Write-Host ""
        Write-Host "✅ Vercel environment variables saved to .env.local" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:"
        Write-Host "1. Go to https://vercel.com/dashboard"
        Write-Host "2. Select your project → Storage → Create Database → Postgres"
        Write-Host "3. After creation, run: vercel env pull .env.local"
        Write-Host "4. Then run this script again to complete migration"
    }
    
    "2" {
        Write-Host ""
        Write-Host "📦 Supabase Setup" -ForegroundColor Cyan
        Write-Host "=================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Go to https://app.supabase.com"
        Write-Host "2. Create a new project"
        Write-Host "3. Go to Settings → Database"
        Write-Host "4. Copy the Connection string (Transaction mode)"
        Write-Host ""
        $db_url = Read-Host "Paste your Supabase connection string"
        
        if ([string]::IsNullOrWhiteSpace($db_url)) {
            Write-Host "❌ No connection string provided" -ForegroundColor Red
            exit 1
        }
        
        "DATABASE_URL=`"$db_url`"" | Out-File -FilePath .env.cloud -Encoding UTF8
        Write-Host "✅ Connection string saved to .env.cloud" -ForegroundColor Green
    }
    
    "3" {
        Write-Host ""
        Write-Host "📦 Neon Setup" -ForegroundColor Cyan
        Write-Host "=============" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Go to https://console.neon.tech"
        Write-Host "2. Create a new project"
        Write-Host "3. Copy the Connection string (Pooled)"
        Write-Host ""
        $db_url = Read-Host "Paste your Neon connection string"
        
        if ([string]::IsNullOrWhiteSpace($db_url)) {
            Write-Host "❌ No connection string provided" -ForegroundColor Red
            exit 1
        }
        
        "DATABASE_URL=`"$db_url`"" | Out-File -FilePath .env.cloud -Encoding UTF8
        Write-Host "✅ Connection string saved to .env.cloud" -ForegroundColor Green
    }
    
    "4" {
        Write-Host ""
        Write-Host "📦 Railway Setup" -ForegroundColor Cyan
        Write-Host "================" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1. Go to https://railway.app"
        Write-Host "2. Create a new project"
        Write-Host "3. Add PostgreSQL service"
        Write-Host "4. Copy the Postgres Connection URL"
        Write-Host ""
        $db_url = Read-Host "Paste your Railway connection string"
        
        if ([string]::IsNullOrWhiteSpace($db_url)) {
            Write-Host "❌ No connection string provided" -ForegroundColor Red
            exit 1
        }
        
        "DATABASE_URL=`"$db_url`"" | Out-File -FilePath .env.cloud -Encoding UTF8
        Write-Host "✅ Connection string saved to .env.cloud" -ForegroundColor Green
    }
    
    "5" {
        Write-Host ""
        Write-Host "📦 Custom Database Setup" -ForegroundColor Cyan
        Write-Host "========================" -ForegroundColor Cyan
        Write-Host ""
        $db_url = Read-Host "Paste your PostgreSQL connection string"
        
        if ([string]::IsNullOrWhiteSpace($db_url)) {
            Write-Host "❌ No connection string provided" -ForegroundColor Red
            exit 1
        }
        
        "DATABASE_URL=`"$db_url`"" | Out-File -FilePath .env.cloud -Encoding UTF8
        Write-Host "✅ Connection string saved to .env.cloud" -ForegroundColor Green
    }
    
    default {
        Write-Host "❌ Invalid choice" -ForegroundColor Red
        exit 1
    }
}

# If we have a connection string, proceed with migration
if (Test-Path .env.cloud) {
    Write-Host ""
    Write-Host "🔄 Migrating database schema..." -ForegroundColor Yellow
    Write-Host ""
    
    # Load the cloud database URL
    $envContent = Get-Content .env.cloud
    foreach ($line in $envContent) {
        if ($line -match '^DATABASE_URL=(.+)$') {
            $env:DATABASE_URL = $matches[1].Trim('"')
        }
    }
    
    # Generate Prisma client
    Write-Host "Generating Prisma client..."
    npx prisma generate
    
    # Push schema to cloud database
    Write-Host ""
    Write-Host "Pushing schema to cloud database..."
    npx prisma db push
    
    Write-Host ""
    Write-Host "✅ Schema migration complete!" -ForegroundColor Green
    Write-Host ""
    
    # Ask about data migration
    $migrate_data = Read-Host "Do you want to migrate existing data? (y/n)"
    
    if ($migrate_data -eq "y" -or $migrate_data -eq "Y") {
        Write-Host ""
        Write-Host "⚠️  Data migration requires manual steps:" -ForegroundColor Yellow
        Write-Host "1. Export from local: pg_dump your_local_db > backup.sql"
        Write-Host "2. Import to cloud: psql `$env:DATABASE_URL < backup.sql"
        Write-Host ""
        Write-Host "Or use Prisma Studio to copy data manually:"
        Write-Host "  npx prisma studio"
    }
    
    Write-Host ""
    Write-Host "🎉 Migration complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Test connection: npx prisma studio"
    Write-Host "2. Update Vercel environment variables with your DATABASE_URL"
    Write-Host "3. Deploy: git push or vercel deploy"
    Write-Host ""
    Write-Host "Your cloud database URL is saved in .env.cloud"
    Write-Host "Add it to your .env file or Vercel environment variables"
}
