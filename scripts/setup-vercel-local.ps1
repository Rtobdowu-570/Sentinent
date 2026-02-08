# Setup script for local development with Vercel environment (Windows)
# This script helps you set up your local environment to match Vercel

Write-Host "🚀 Setting up local environment for Vercel deployment..." -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Vercel CLI already installed" -ForegroundColor Green
}

# Check if user is logged in to Vercel
Write-Host ""
Write-Host "Checking Vercel authentication..."
$vercelWhoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please log in to Vercel:" -ForegroundColor Yellow
    vercel login
} else {
    Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
}

# Link to Vercel project
Write-Host ""
Write-Host "Linking to Vercel project..."
if (-not (Test-Path ".vercel")) {
    vercel link
} else {
    Write-Host "✅ Already linked to Vercel project" -ForegroundColor Green
}

# Pull environment variables
Write-Host ""
Write-Host "Pulling environment variables from Vercel..."
vercel env pull .env.local

Write-Host ""
Write-Host "✅ Environment variables saved to .env.local" -ForegroundColor Green

# Generate Prisma client
Write-Host ""
Write-Host "Generating Prisma client..."
npx prisma generate

# Push database schema
Write-Host ""
$pushSchema = Read-Host "Do you want to push the database schema? (y/n)"
if ($pushSchema -eq "y" -or $pushSchema -eq "Y") {
    npx prisma db push
    Write-Host "✅ Database schema pushed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Setup complete! You can now run:" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your local environment is now configured to match Vercel." -ForegroundColor Green
