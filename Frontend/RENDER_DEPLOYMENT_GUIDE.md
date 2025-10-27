# 🚀 Render Deployment Guide - Frontend

## Overview

This guide covers deploying the CPA Academy frontend React application on Render.

---

## 📋 Prerequisites

- GitHub repository connected to Render
- Backend deployed on Render at: `https://cpa-website-lvup.onrender.com`
- Node.js version: 18.x or higher

---

## ⚡ Quick Deploy (Recommended)

###Step 1: Push to GitHub

```bash
cd CPA-website/Frontend
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### Step 2: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your frontend code

### Step 3: Configure Build Settings

**Basic Settings:**
```
Name: cpa-academy-frontend
Region: Choose closest to your users
Branch: main
Root Directory: CPA-website/Frontend
```

**Build Settings:**
```
Runtime: Node
Build Command: npm ci && npm run build
Start Command: npx serve -s build -l $PORT
```

**Environment Variables:**
```
NODE_VERSION = 18.17.0
REACT_APP_API_BASE = https://cpa-website-lvup.onrender.com/api
NODE_ENV = production
GENERATE_SOURCEMAP = false
```

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment (5-10 minutes).

---

## 🔧 Manual Configuration

If you're not using `render.yaml`, configure these settings manually:

### Environment Variables in Render Dashboard

Go to: **Your Service → Environment → Environment Variables**

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_VERSION` | `18.17.0` |
| `REACT_APP_API_BASE` | `https://cpa-website-lvup.onrender.com/api` |
| `NODE_ENV` | `production` |
| `GENERATE_SOURCEMAP` | `false` |

### Build Configuration

**Install Command:**
```bash
npm ci
```

**Build Command:**
```bash
npm run build
```

**Start Command:**
```bash
npx serve -s build -l $PORT
```

---

## 📁 Project Structure

```
Frontend/
├── render.yaml           # Render Blueprint (automatic deployment)
├── _redirects            # React Router SPA redirect rules
├── .env.production       # Production environment variables
├── .env.development      # Development environment variables
├── package.json          # Updated with serve package
├── public/
│   └── index.html       # Updated with meta tags
└── src/
    ├── api.js           # API client with environment variable support
    └── app.js           # React Router configuration
```

---

## 🔄 React Router Configuration

### SPA Routing with `_redirects`

The `_redirects` file ensures all routes are handled by React Router:

```
/*    /index.html   200
```

This file is automatically copied to `build/_redirects` during the build process via the `postbuild` script in `package.json`.

### How it Works

1. User navigates to `/units` or any route
2. Render serves `index.html`
3. React Router takes over and renders the correct component
4. No 404 errors on page refresh

---

## 🌐 API Configuration

### Environment-Based API URLs

The frontend automatically uses the correct API URL based on the environment:

**Development (Local):**
```javascript
REACT_APP_API_BASE=http://localhost:8000/api
```

**Production (Render):**
```javascript
REACT_APP_API_BASE=https://cpa-website-lvup.onrender.com/api
```

### API Client (`src/api.js`)

```javascript
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";
```

The API client:
- ✅ Automatically handles JWT authentication
- ✅ Implements token refresh logic
- ✅ Provides error handling
- ✅ Supports all HTTP methods

---

## 🔒 Security Headers

The `render.yaml` includes security headers:

```yaml
headers:
  - path: /*
    name: X-Frame-Options
    value: DENY
  - path: /*
    name: X-Content-Type-Options
    value: nosniff
  - path: /*
    name: X-XSS-Protection
    value: 1; mode=block
  - path: /*
    name: Referrer-Policy
    value: strict-origin-when-cross-origin
```

---

## 📦 Build Optimization

### Production Build Features

- ✅ Minified JavaScript and CSS
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Asset optimization
- ✅ Source maps disabled (`GENERATE_SOURCEMAP=false`)

### Bundle Size

Expected production bundle sizes:
- Main bundle: ~200-250 KB (gzipped)
- Vendor chunk: ~150 KB (React, Router, Framer Motion)
- Total initial load: ~350-400 KB

---

## 🧪 Testing Deployment

### Local Production Build

Test the production build locally:

```bash
# Build the production bundle
npm run build

# Serve the build locally
npm run serve

# Visit http://localhost:3000
```

### Verify API Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to different pages
4. Verify API calls go to `https://cpa-website-lvup.onrender.com/api`
5. Check for 200 status codes
6. Ensure no CORS errors

---

## 🔍 Troubleshooting

### Build Fails

**Error: `npm ci` fails**
```bash
# Solution: Delete package-lock.json and reinstall
rm package-lock.json
npm install
npm run build
```

**Error: Out of memory**
```bash
# Solution: Increase Node memory
# Add to package.json scripts:
"build": "NODE_OPTIONS=--max_old_space_size=4096 react-scripts build"
```

### Routing Issues

**404 on page refresh**
- ✅ Ensure `_redirects` file exists
- ✅ Verify `postbuild` script runs
- ✅ Check `build/_redirects` exists after build

**Routes not working**
- ✅ Verify `BrowserRouter` is used (not `HashRouter`)
- ✅ Check routes are defined in `app.js`
- ✅ Ensure `_redirects` is in the build folder

### API Connection Issues

**API calls go to localhost**
- ✅ Check `REACT_APP_API_BASE` is set in Render
- ✅ Verify environment variable starts with `REACT_APP_`
- ✅ Rebuild and redeploy after changing env vars

**CORS errors**
- ✅ Ensure backend CORS includes your Render frontend URL
- ✅ Check backend `settings.py` `CORS_ALLOWED_ORIGINS`
- ✅ Verify backend is running

### Performance Issues

**Slow initial load**
- ✅ Enable gzip compression (Render does this automatically)
- ✅ Implement code splitting
- ✅ Lazy load routes
- ✅ Optimize images

---

## 📊 Monitoring

### Render Dashboard

Monitor your deployment:
- **Logs**: View build and runtime logs
- **Metrics**: CPU, memory usage
- **Deploys**: See deployment history
- **Shell**: Access container shell

### Logging

Add logging to your app:

```javascript
// src/utils/logger.js
export const logger = {
  error: (message, error) => {
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (e.g., Sentry)
      console.error(message, error);
    } else {
      console.error(message, error);
    }
  }
};
```

---

## 🔄 Continuous Deployment

### Automatic Deploys

Render automatically deploys when you push to the connected branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
# Render auto-deploys
```

### Manual Deploy

Trigger manual deployment in Render Dashboard:
1. Go to your service
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**

---

## 🎯 Performance Checklist

- [x] Environment variables configured
- [x] `_redirects` file for SPA routing
- [x] Production build optimized
- [x] Source maps disabled
- [x] API URL points to production backend
- [x] Security headers configured
- [x] HTTPS enabled (automatic on Render)
- [x] Gzip compression enabled (automatic)

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain

1. Go to **Settings → Custom Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `cpa-academy.com`)
4. Follow DNS configuration instructions
5. Render provides free SSL certificate

### DNS Configuration

Add these records to your DNS provider:

```
Type: CNAME
Name: www (or @)
Value: your-service.onrender.com
```

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [React Router Documentation](https://reactrouter.com/)

---

## ✅ Deployment Checklist

### Before Deployment

- [ ] All ESLint warnings fixed
- [ ] Build runs without errors locally
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] React Router configured correctly
- [ ] `_redirects` file created

### After Deployment

- [ ] Service shows "Live" status
- [ ] Homepage loads correctly
- [ ] All routes accessible
- [ ] API calls reach backend
- [ ] No CORS errors
- [ ] Dark mode works
- [ ] Responsive design working
- [ ] Forms submit correctly

---

## 🎉 Success!

Your frontend is now deployed on Render!

**Frontend URL:** `https://your-service-name.onrender.com`
**Backend URL:** `https://cpa-website-lvup.onrender.com`

### Next Steps

1. Test all features thoroughly
2. Set up monitoring/analytics
3. Configure custom domain (optional)
4. Set up error tracking (Sentry)
5. Implement CI/CD improvements

---

**Deployment Date:** October 27, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅

