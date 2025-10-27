# CPA Academy - Deployment Configuration Guide

## 🚀 Backend & Frontend Connection Setup

**Backend (Render):** https://cpa-website-lvup.onrender.com  
**Frontend (Vercel):** https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app  
**Status:** ✅ CORS Configured | ⏳ Environment Variables Needed

---

## 📋 Quick Setup Checklist

### Backend (Render) - Already Configured ✅
- ✅ CORS origins updated to include Vercel domain
- ✅ ALLOWED_HOSTS configured for Render deployment
- ✅ Environment variable support added

### Frontend (Vercel) - Needs Configuration ⚠️
- ⏳ Environment variables need to be set in Vercel dashboard
- ⏳ Redeploy after setting variables

---

## 🔧 Step 1: Configure Vercel Environment Variables

### In Vercel Dashboard:

1. **Go to your project:** https://vercel.com/dashboard
2. **Click on your project:** `cpa-website-qbf3-git-main-palmerscott254-gifs-projects`
3. **Navigate to:** Settings → Environment Variables
4. **Add the following variable:**

| Name | Value | Environment |
|------|-------|-------------|
| `REACT_APP_API_BASE` | `https://cpa-website-lvup.onrender.com/api` | Production |
| `REACT_APP_API_BASE` | `http://localhost:8000/api` | Preview (optional) |
| `REACT_APP_API_BASE` | `http://localhost:8000/api` | Development (optional) |

### Screenshot Guide:
```
Settings → Environment Variables → Add New

Name: REACT_APP_API_BASE
Value: https://cpa-website-lvup.onrender.com/api
Environment: ✓ Production
```

5. **Click "Save"**
6. **Redeploy** your application:
   - Go to Deployments tab
   - Click on the latest deployment
   - Click "Redeploy" button
   - OR: Push a new commit to trigger automatic deployment

---

## 🔧 Step 2: Configure Render Environment Variables (Optional)

### In Render Dashboard:

1. **Go to:** https://dashboard.render.com
2. **Select your service:** `cpa-website-lvup`
3. **Navigate to:** Environment → Environment Variables
4. **Add/Update these variables:**

| Variable | Value | Purpose |
|----------|-------|---------|
| `DJANGO_SECRET_KEY` | `<your-secret-key>` | Django security |
| `DJANGO_DEBUG` | `False` | Production mode |
| `DJANGO_ALLOWED_HOSTS` | `cpa-website-lvup.onrender.com` | Security |
| `CORS_ALLOWED_ORIGINS` | (optional) | Additional origins |

### Generate Secret Key:
```python
# Run this in Python console to generate a new secret key
import secrets
print(secrets.token_urlsafe(50))
```

---

## 📁 Step 3: Local Development Environment Files

### For Local Development (Create these files manually):

#### Create: `Frontend/.env.development`
```bash
# Development Environment
REACT_APP_API_BASE=http://localhost:8000/api
NODE_ENV=development
```

#### Create: `Frontend/.env.production.local` (For local production testing)
```bash
# Local Production Testing
REACT_APP_API_BASE=https://cpa-website-lvup.onrender.com/api
NODE_ENV=production
```

#### Create: `Frontend/.env.example` (For documentation)
```bash
# Environment Configuration Example
REACT_APP_API_BASE=http://localhost:8000/api
NODE_ENV=development

# Optional: Analytics
# REACT_APP_GA_TRACKING_ID=your-tracking-id
```

**Note:** These files are `.gitignore`d for security. Vercel will use its own environment variables.

---

## 🔍 Step 4: Verify Backend CORS Configuration

### Check Backend Settings (Already Applied ✅)

The following has been added to `backend/cpa_academy/settings.py`:

```python
# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app",
]

# Environment variable support
if os.getenv("CORS_ALLOWED_ORIGINS"):
    CORS_ALLOWED_ORIGINS.extend(
        [origin.strip() for origin in os.getenv("CORS_ALLOWED_ORIGINS").split(",")]
    )

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Updated ALLOWED_HOSTS
ALLOWED_HOSTS = ["*"] if DEBUG else [
    "cpa-website-lvup.onrender.com",
    "localhost",
    "127.0.0.1",
]
```

### Deploy Backend Changes to Render:

```bash
cd CPA-website/backend

# Commit the CORS changes
git add cpa_academy/settings.py
git commit -m "Configure CORS for Vercel deployment"
git push origin main
```

**Render will automatically redeploy** when it detects the push to `main` branch.

---

## 🧪 Step 5: Test API Connection

### Test Backend API Directly:

1. **Check Health Endpoint:**
```bash
curl https://cpa-website-lvup.onrender.com/api/
```

2. **Test Subjects Endpoint:**
```bash
curl https://cpa-website-lvup.onrender.com/api/subjects/
```

3. **Test Authentication:**
```bash
# Test registration endpoint
curl -X POST https://cpa-website-lvup.onrender.com/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123!"}'
```

### Test Frontend → Backend Connection:

1. **Open Vercel deployment:**
   ```
   https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app
   ```

2. **Open Browser DevTools:**
   - Press F12
   - Go to Console tab
   - Go to Network tab

3. **Check API Calls:**
   - Navigate to different pages (Units, Materials, Quizzes)
   - Watch Network tab for API requests
   - Should see requests to: `https://cpa-website-lvup.onrender.com/api/...`
   - Status codes should be 200 (success) or 401 (unauthorized, which is expected if not logged in)

4. **Test Registration/Login:**
   - Try registering a new account
   - Check Network tab for successful API calls
   - Verify no CORS errors in Console

### Expected Results:
✅ No CORS errors in console  
✅ API requests going to `https://cpa-website-lvup.onrender.com`  
✅ Successful responses (200, 201) for valid requests  
✅ Login/registration working  
✅ Data loading on Units, Materials, Quizzes pages  

---

## 🐛 Troubleshooting

### Problem: CORS Error in Browser Console

**Error:**
```
Access to fetch at 'https://cpa-website-lvup.onrender.com/api/...' 
from origin 'https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app' 
has been blocked by CORS policy
```

**Solution:**
1. Verify backend changes are deployed to Render
2. Check Render logs for any deployment errors
3. Ensure CORS_ALLOWED_ORIGINS includes your exact Vercel URL
4. Restart Render service manually if needed

### Problem: API calls going to localhost

**Error:**
```
Failed to fetch: http://localhost:8000/api/...
```

**Solution:**
1. Verify Vercel environment variable is set correctly
2. Redeploy Vercel application
3. Clear browser cache and hard reload (Ctrl+Shift+R)
4. Check that you're viewing the latest deployment

### Problem: 404 Not Found on API endpoints

**Error:**
```
404 Not Found - https://cpa-website-lvup.onrender.com/api/subjects/
```

**Solution:**
1. Check if backend is running on Render
2. Verify URL pattern in backend `urls.py`
3. Check Render logs for backend errors
4. Ensure database migrations are applied

### Problem: 500 Internal Server Error

**Error:**
```
500 Internal Server Error
```

**Solution:**
1. Check Render logs for Python errors
2. Verify all required environment variables are set
3. Check database connection
4. Ensure `DEBUG=False` in production
5. Verify `ALLOWED_HOSTS` includes Render domain

---

## 📱 Vercel Deployment Commands

### Manual Deployment:
```bash
cd CPA-website/Frontend

# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

### Automatic Deployment:
- **Every push to `main`** branch triggers automatic deployment to production
- **Pull requests** create preview deployments
- Environment variables from Vercel dashboard are automatically injected

---

## 🔐 Security Checklist

Before going live, ensure:

- [ ] `DJANGO_SECRET_KEY` set to strong random value on Render
- [ ] `DJANGO_DEBUG=False` on Render
- [ ] `ALLOWED_HOSTS` properly configured
- [ ] CORS origins limited to your domains only
- [ ] SSL/HTTPS enabled (automatic on Vercel and Render)
- [ ] Database backups configured (if using PostgreSQL)
- [ ] Environment variables not exposed in frontend code
- [ ] API rate limiting considered
- [ ] Authentication working correctly

---

## 🚀 Deployment Workflow

### Making Changes:

1. **Update Frontend:**
   ```bash
   cd CPA-website/Frontend
   # Make your changes
   git add .
   git commit -m "Your changes"
   git push origin main
   # Vercel auto-deploys
   ```

2. **Update Backend:**
   ```bash
   cd CPA-website/backend
   # Make your changes
   python manage.py test  # Run tests
   git add .
   git commit -m "Your changes"
   git push origin main
   # Render auto-deploys
   ```

### Monitoring Deployments:

- **Vercel:** https://vercel.com/dashboard
- **Render:** https://dashboard.render.com

---

## 📊 API Endpoints Reference

### Base URL:
```
Production: https://cpa-website-lvup.onrender.com/api
Development: http://localhost:8000/api
```

### Available Endpoints:
- `GET /subjects/` - List all subjects
- `GET /subjects/{slug}/` - Get subject details
- `GET /subjects/units/` - List all units
- `GET /subjects/units/{id}/` - Get unit details
- `GET /materials/` - List materials
- `GET /materials/{id}/download/` - Download material
- `POST /auth/register/` - Register new user
- `POST /auth/login/` - Login user
- `POST /auth/refresh/` - Refresh token
- `GET /auth/user/` - Get user profile

---

## 💡 Pro Tips

### Faster Debugging:
1. **Enable Vercel deployment logs** in real-time
2. **Use Render logs** to debug backend issues
3. **Browser DevTools** Network tab is your friend
4. **Test API endpoints** with Postman or curl first

### Performance Optimization:
1. **Vercel automatically** optimizes React bundles
2. **Render free tier** may have cold starts (first request slower)
3. **Enable Vercel Analytics** for performance insights
4. **Consider upgrading Render** plan if needed for better performance

### Custom Domain (Optional):
1. **Add custom domain in Vercel:** Settings → Domains
2. **Update CORS_ALLOWED_ORIGINS** to include custom domain
3. **Update environment variables** if needed
4. **Redeploy both** frontend and backend

---

## ✅ Final Verification Steps

1. **Set Vercel Environment Variable** ⏳
   ```
   REACT_APP_API_BASE = https://cpa-website-lvup.onrender.com/api
   ```

2. **Commit Backend Changes** ⏳
   ```bash
   git add backend/cpa_academy/settings.py
   git commit -m "Configure CORS for Vercel deployment"
   git push origin main
   ```

3. **Redeploy Vercel** ⏳
   - Automatic after setting env var and triggering new deployment

4. **Test Connection** ⏳
   - Visit Vercel URL
   - Check browser console for errors
   - Test login/registration
   - Verify data loads

5. **Monitor Logs** ⏳
   - Vercel deployment logs
   - Render application logs

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ No CORS errors in browser console  
✅ API calls show `https://cpa-website-lvup.onrender.com` in Network tab  
✅ Homepage loads subjects from backend  
✅ Units, Materials, Quizzes pages load data  
✅ Login/Registration works  
✅ Dark mode toggle works  
✅ Navigation works smoothly  
✅ No 404 or 500 errors  

---

## 📞 Need Help?

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **Django CORS:** https://github.com/adamchainz/django-cors-headers
- **React Env Vars:** https://create-react-app.dev/docs/adding-custom-environment-variables/

---

**Last Updated:** October 26, 2025  
**Status:** Backend CORS configured ✅ | Frontend env vars pending ⏳

