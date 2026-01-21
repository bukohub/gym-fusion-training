#!/bin/bash

# Production Deployment Script for Gym App
# This script helps prepare your app for Vercel deployment

echo "🚀 Preparing Gym App for Production Deployment"

# Step 1: Database Migration Preparation
echo "📊 Step 1: Database Migration"
echo "Current database: SQLite (dev.db)"
echo "Target database: PostgreSQL"

echo "1. Choose your database provider:"
echo "   - Vercel Postgres (recommended)"
echo "   - Supabase (free tier available)"
echo "   - Railway"
echo "   - Neon"
echo ""

# Step 2: Replace Prisma Schema
echo "📝 Step 2: Updating Prisma Schema for Production"
cd backend
if [ -f "prisma/schema.production.prisma" ]; then
    echo "Backing up current schema..."
    cp prisma/schema.prisma prisma/schema.development.prisma
    echo "Replacing with production schema..."
    cp prisma/schema.production.prisma prisma/schema.prisma
    echo "✅ Schema updated for PostgreSQL"
else
    echo "❌ Production schema not found"
fi

# Step 3: Install dependencies and build
echo "📦 Step 3: Installing dependencies and building"
npm install
npm run build

# Step 4: Frontend preparation
echo "🎨 Step 4: Preparing frontend"
cd ../frontend
npm install
npm run build

cd ..

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Set up your database (PostgreSQL)"
echo "2. Run database migrations with: npx prisma migrate deploy"
echo "3. Deploy backend to Vercel from /backend folder"
echo "4. Deploy frontend to Vercel from /frontend folder"
echo "5. Configure environment variables in Vercel dashboard"