# Vercel Deployment Guide - Frontend

## Prerequisites
- GitHub account
- Vercel account (free tier available at vercel.com)
- Your code pushed to GitHub repository

---

## Step 1: Push Code to GitHub

If you haven't already pushed your code to GitHub:

```powershell
# Navigate to your project root
cd c:\Users\shiva\OneDrive\Desktop\AAprojectzip01\AAproject

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Traffic Violation Dashboard"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Sign Up / Login to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

---

## Step 3: Import Your Repository

### Method 1: Via Vercel Dashboard

1. After login, click **"Add New Project"** or **"Import Project"**
2. Click **"Continue with GitHub"**
3. Search for your repository: `traffic-signal-violation-detection`
4. Click **"Import"**

### Method 2: Direct Link
- Go to: `https://vercel.com/new`

---

## Step 4: Configure Project Settings

### Root Directory Configuration:
```
Root Directory: frontend
```
**IMPORTANT**: Since your React app is in the `frontend` folder, you MUST set this!

### Framework Preset:
```
Framework Preset: Create React App
```
Vercel will auto-detect this, but verify it's correct.

### Build and Output Settings:
```
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### Environment Variables (Optional):
If your frontend needs environment variables:
```
REACT_APP_API_URL=https://your-backend-url.com
```
**Note**: For now, you can skip this or set it to your local backend. You'll need to deploy your backend separately.

---

## Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for the build process (usually 1-3 minutes)
3. Vercel will:
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Deploy to CDN

---

## Step 6: Access Your Deployed App

After successful deployment:
- You'll get a URL like: `https://your-project-name.vercel.app`
- Vercel also provides:
  - Production URL (main branch)
  - Preview URLs (for each commit/branch)

---

## Step 7: Configure Custom Domain (Optional)

1. Go to your project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Important Notes

### 1. Backend API Connection
Your frontend currently connects to `http://localhost:5000`. You need to:

**Option A**: Deploy backend separately and update API URL
**Option B**: Use environment variables

Create `.env.production` in frontend folder:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

Then update your API calls to use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### 2. Continuous Deployment
- Every push to `main` branch auto-deploys to production
- Every push to other branches creates preview deployments
- Pull requests get unique preview URLs

### 3. Vercel CLI (Optional)
Install Vercel CLI for terminal deployment:
```powershell
npm install -g vercel

# Deploy from terminal
cd frontend
vercel

# Deploy to production
vercel --prod
```

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `package.json` has all dependencies
- Test `npm run build` locally first

### 404 Errors on Refresh
- The `vercel.json` file we created handles this
- It routes all paths to `index.html` for React Router

### Environment Variables Not Working
- Must prefix with `REACT_APP_`
- Redeploy after adding environment variables
- Check in Vercel dashboard → Settings → Environment Variables

---

## Quick Command Reference

```powershell
# Test build locally before deploying
cd c:\Users\shiva\OneDrive\Desktop\AAprojectzip01\AAproject\frontend
npm run build

# Check if build folder is created
dir build

# If successful, push to GitHub
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

---

## What We've Prepared

✅ Created `vercel.json` - Handles routing for React Router
✅ Verified `package.json` - Has correct build script
✅ Created `.gitignore` - Excludes node_modules and build files

**You're ready to deploy!** Just follow Steps 1-6 above.

---

## Next Steps After Deployment

1. **Backend Deployment**: Consider deploying backend to:
   - Railway.app
   - Render.com
   - Heroku
   - AWS/Azure

2. **Update API URLs**: Point frontend to deployed backend

3. **Test Production**: Verify all features work on live site

4. **Monitor**: Check Vercel analytics and logs

---

## Support Resources

- Vercel Documentation: https://vercel.com/docs
- React Deployment: https://create-react-app.dev/docs/deployment/
- Vercel Support: https://vercel.com/support

---

**Created**: November 29, 2025
**Project**: Traffic Signal Violation Detection Dashboard
