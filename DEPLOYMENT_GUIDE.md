# Gym App - Vercel Deployment Guide

This guide walks you through deploying your gym management system to Vercel with a PostgreSQL database.

## ✅ What's Already Prepared

I've already created the necessary configuration files for you:
- `backend/vercel.json` - Backend deployment configuration
- `frontend/vercel.json` - Frontend deployment configuration
- `backend/prisma/schema.production.prisma` - PostgreSQL schema
- `backend/.env.production.example` - Environment variables template
- Updated package.json scripts for production deployment

## 🗄️ Database Setup (Choose One)

### Option 1: Vercel Postgres (Recommended)
```bash
# In your Vercel dashboard:
# 1. Go to Storage → Create Database → Postgres
# 2. Copy the connection string
```

### Option 2: Supabase (Free Tier Available)
```bash
# 1. Create account at supabase.com
# 2. Create new project
# 3. Go to Settings → Database
# 4. Copy connection string
```

### Option 3: Railway
```bash
# 1. Create account at railway.app
# 2. Create new project → Add PostgreSQL
# 3. Copy connection string from Variables tab
```

## 🚀 Step-by-Step Deployment

### Step 1: Database Migration

1. **Backup your current data** (export from SQLite if needed):
```bash
sqlite3 backend/prisma/dev.db ".dump" > backup.sql
```

2. **Switch to PostgreSQL schema**:
```bash
cd backend
cp prisma/schema.production.prisma prisma/schema.prisma
```

3. **Set up your database connection**:
- Get your PostgreSQL connection string from your chosen provider
- It should look like: `postgresql://user:password@host:port/database`

### Step 2: Deploy Backend API

1. **Create new Vercel project for backend**:
```bash
cd backend
npx vercel
# Choose: Create new project
# Project name: gym-backend (or your choice)
# Directory: ./
```

2. **Set environment variables in Vercel dashboard**:
- Go to your project → Settings → Environment Variables
- Add these variables:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-chars
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

3. **Deploy**:
```bash
npx vercel --prod
```

### Step 3: Run Database Migrations

Once your backend is deployed, run migrations:
```bash
# Make sure DATABASE_URL is set in your environment
npx prisma migrate deploy
```

### Step 4: Deploy Frontend

1. **Update API URL in frontend** (if hardcoded):
```typescript
// Update your API base URL to point to your deployed backend
const API_BASE_URL = 'https://your-backend-domain.vercel.app'
```

2. **Create new Vercel project for frontend**:
```bash
cd ../frontend
npx vercel
# Choose: Create new project
# Project name: gym-frontend (or your choice)
# Directory: ./
```

3. **Set environment variables** (if any):
```
VITE_API_URL=https://your-backend-domain.vercel.app
```

4. **Deploy**:
```bash
npx vercel --prod
```

### Step 5: Configure CORS

Update your backend's CORS configuration to allow your frontend domain:

```typescript
// In your main.ts or app configuration
app.enableCors({
  origin: ['https://your-frontend-domain.vercel.app'],
  credentials: true,
});
```

## 🔧 Environment Variables Reference

### Backend Environment Variables (Required)
```env
DATABASE_URL=postgresql://user:pass@host:port/database
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend Environment Variables (Optional)
```env
VITE_API_URL=https://your-backend.vercel.app
```

## 🎯 Post-Deployment Checklist

- [ ] Backend API is accessible and returns proper responses
- [ ] Database connection is working
- [ ] Frontend can communicate with backend
- [ ] User authentication works
- [ ] File uploads work (if using Vercel, files go to /tmp)
- [ ] CORS is properly configured

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify your DATABASE_URL is correct
   - Ensure your database allows connections from Vercel IPs
   - Check if you need to run `npx prisma migrate deploy`

2. **CORS Errors**
   - Update your backend CORS configuration
   - Ensure FRONTEND_URL environment variable is set correctly

3. **Build Failures**
   - Check your build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation passes

4. **File Upload Issues**
   - Vercel has a 250MB deployment limit
   - Use /tmp directory for temporary files
   - Consider using external storage (AWS S3, Cloudinary) for persistent files

## 📊 Database Migration Notes

- **Float → Decimal**: Changed price fields to Decimal for better precision
- **SQLite → PostgreSQL**: Some syntax differences handled automatically by Prisma
- **File Paths**: Update any hardcoded file paths for Vercel's filesystem

## 🚨 Security Considerations

- Never commit environment variables to Git
- Use strong JWT secrets (32+ characters)
- Enable SSL in production database connections
- Validate all inputs on both frontend and backend
- Use HTTPS for all production URLs

## 📈 Monitoring & Maintenance

- Monitor your database usage (most free tiers have limits)
- Set up Vercel Analytics for performance monitoring
- Consider implementing error tracking (Sentry)
- Regular database backups

---

**Need Help?**
- Check Vercel documentation: https://vercel.com/docs
- Check your chosen database provider's documentation
- Vercel support: https://vercel.com/support