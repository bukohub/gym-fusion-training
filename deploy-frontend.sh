#!/bin/bash

# Frontend Deployment Script for Fusion Training Gym Management System
# This script deploys the frontend to Vercel

echo "🚀 Starting Fusion Training Frontend Deployment..."
echo "========================================================"

# Navigate to frontend directory
cd /Users/robert.rosero/Documents/GODADDY/gym/frontend

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
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

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod --yes

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend deployment successful!"
    echo "🎉 Fusion Training frontend is now live!"
else
    echo "❌ Error: Deployment failed"
    exit 1
fi

echo "========================================================"
echo "✨ Deployment completed successfully!"