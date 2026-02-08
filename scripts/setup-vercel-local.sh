#!/bin/bash

# Setup script for local development with Vercel environment
# This script helps you set up your local environment to match Vercel

set -e

echo "🚀 Setting up local environment for Vercel deployment..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

# Check if user is logged in to Vercel
echo ""
echo "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please log in to Vercel:"
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

# Link to Vercel project
echo ""
echo "Linking to Vercel project..."
if [ ! -d ".vercel" ]; then
    vercel link
else
    echo "✅ Already linked to Vercel project"
fi

# Pull environment variables
echo ""
echo "Pulling environment variables from Vercel..."
vercel env pull .env.local

echo ""
echo "✅ Environment variables saved to .env.local"

# Generate Prisma client
echo ""
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo ""
read -p "Do you want to push the database schema? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma db push
    echo "✅ Database schema pushed"
fi

echo ""
echo "🎉 Setup complete! You can now run:"
echo "   npm run dev"
echo ""
echo "Your local environment is now configured to match Vercel."
