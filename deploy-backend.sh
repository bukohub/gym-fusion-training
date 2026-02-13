#!/bin/bash

# Backend Deployment Script for Fusion Training Gym Management System
# This script deploys the backend to Vercel

echo "🚀 Starting Fusion Training Backend Deployment..."
echo "========================================================"

# Navigate to backend directory
cd /Users/robert.rosero/Documents/GODADDY/gym/backend

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the backend directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to build the project"
    exit 1
fi

# Run database migrations (if needed)
echo "🗃️ Running database migrations..."
if [ -n "$DATABASE_URL" ]; then
    echo "Using DATABASE_URL environment variable..."
    npx prisma migrate deploy
else
    echo "⚠️ Warning: DATABASE_URL not set. Skipping migrations."
    echo "Make sure to set your production DATABASE_URL environment variable."
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Backend deployment successful!"
    echo "🎉 Fusion Training backend is now live!"
else
    echo "❌ Error: Deployment failed"
    exit 1
fi

echo "========================================================"
echo "✨ Deployment completed successfully!"
echo ""
echo "📋 Important Notes:"
echo "   • Make sure your DATABASE_URL is set in Vercel environment variables"
echo "   • Verify that JWT_SECRET is configured in Vercel"
echo "   • Check that CORS settings allow your frontend domain"