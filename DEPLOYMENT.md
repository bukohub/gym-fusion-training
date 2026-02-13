# Fusion Training - Deployment Guide

This guide explains how to deploy the Fusion Training gym management system to Vercel using the provided deployment scripts.

## Prerequisites

- Node.js installed
- Vercel CLI installed (`npm i -g vercel`)
- Vercel account set up and logged in (`vercel login`)
- Database configured (for backend deployments)

## Deployment Scripts

### Frontend Deployment

To deploy the frontend to Vercel:

```bash
./deploy-frontend.sh
```

This script will:
- Install dependencies
- Build the React application
- Deploy to Vercel production

### Backend Deployment

To deploy the backend to Vercel:

```bash
./deploy-backend.sh
```

This script will:
- Install dependencies
- Build the NestJS application
- Run database migrations (if DATABASE_URL is set)
- Deploy to Vercel production

## Environment Variables

### Backend Required Variables (set in Vercel dashboard):
- `DATABASE_URL` - Your production database connection string
- `JWT_SECRET` - Secret key for JWT authentication
- Any other environment variables your application needs

### Frontend Required Variables (if any):
- `VITE_API_URL` - Your backend API URL (if needed)

## Usage Notes

1. Make sure both scripts are executable (already done):
   ```bash
   chmod +x deploy-frontend.sh deploy-backend.sh
   ```

2. Run from the project root directory:
   ```bash
   # Deploy frontend only
   ./deploy-frontend.sh

   # Deploy backend only
   ./deploy-backend.sh

   # Deploy both (run separately)
   ./deploy-frontend.sh && ./deploy-backend.sh
   ```

3. The scripts include error checking and will stop if any step fails.

4. Both scripts provide colored output to show progress and results.

## Troubleshooting

- If deployment fails, check your Vercel CLI is logged in: `vercel whoami`
- For backend issues, verify your environment variables in Vercel dashboard
- For database issues, ensure your DATABASE_URL is correctly formatted
- Check build logs in Vercel dashboard for detailed error information

## Project Structure

- `deploy-frontend.sh` - Frontend deployment script
- `deploy-backend.sh` - Backend deployment script
- `frontend/` - React frontend application
- `backend/` - NestJS backend application

Happy deploying! 🚀