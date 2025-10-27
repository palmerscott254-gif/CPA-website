# 🚀 CPA Academy - Frontend to Backend Connection

## ✅ Changes Applied

I've successfully configured your frontend and backend to work together in production!

### 1. Backend CORS Configuration ✅
**File:** `backend/cpa_academy/settings.py`

**Changes Made:**
- ✅ Added your Vercel domain to `CORS_ALLOWED_ORIGINS`
- ✅ Updated `ALLOWED_HOSTS` with Render domain
- ✅ Added proper CORS headers for authentication
- ✅ Added environment variable support for additional origins

### 2. Documentation Created ✅
- ✅ `DEPLOYMENT_GUIDE.md` - Complete deployment walkthrough
- ✅ `QUICK_DEPLOYMENT_CHECKLIST.md` - Quick reference
- ✅ `DEPLOYMENT_SUMMARY.md` - Detailed summary
- ✅ `test-api-connection.sh` - API testing script

---

## 🎯 Your Action Items (15 minutes)

### Step 1: Commit Backend Changes ⚠️ REQUIRED

```bash
# Navigate to backend directory
cd CPA-website/backend

# Stage the changes
git add cpa_academy/settings.py

# Commit with descriptive message
git commit -m "Configure CORS for Vercel deployment

- Add Vercel domain to CORS_ALLOWED_ORIGINS
- Update ALLOWED_HOSTS for Render deployment
- Add CORS headers for authentication support
- Add environment variable support for flexibility"

# Push to trigger Render deployment
git push origin main
```

**What happens:** Render detects the push and automatically redeploys your backend (takes 2-5 minutes).

---

### Step 2: Set Vercel Environment Variable ⚠️ REQUIRED

**In Vercel Dashboard:**

1. **Navigate to:** https://vercel.com/dashboard
2. **Select your project:** Look for `cpa-website` or similar name
3. **Go to:** Settings tab → Environment Variables
4. **Click:** "Add New" button

**Add this variable:**
```
Name:        REACT_APP_API_BASE
Value:       https://cpa-website-lvup.onrender.com/api
Environment: ✓ Production (check this box)
```

5. **Click:** Save

**Screenshot Guide:**
```
Settings → Environment Variables
┌─────────────────────────────────────────┐
│ Name:  REACT_APP_API_BASE               │
│ Value: https://cpa-website-lvup.onr...  │
│ Environment: [✓] Production             │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

---

### Step 3: Redeploy Vercel ⚠️ REQUIRED

**Environment variables only take effect AFTER redeployment!**

**Option A - Push Documentation (Recommended):**
```bash
# Navigate to frontend
cd CPA-website/Frontend

# Stage all new documentation
git add ../DEPLOYMENT_GUIDE.md
git add ../QUICK_DEPLOYMENT_CHECKLIST.md
git add ../DEPLOYMENT_SUMMARY.md
git add ../README_DEPLOYMENT.md
git add ../test-api-connection.sh

# Commit
git commit -m "docs: Add deployment configuration and guides"

# Push to trigger automatic deployment
git push origin main
```

**Option B - Manual Redeploy:**
1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click on the most recent deployment
5. Click "Redeploy" button
6. Click "Redeploy" to confirm

---

### Step 4: Test Everything 🧪

**Test Backend API:**
```bash
# Using curl (Git Bash, Mac, Linux)
curl https://cpa-website-lvup.onrender.com/api/subjects/

# Using PowerShell (Windows)
Invoke-RestMethod -Uri "https://cpa-website-lvup.onrender.com/api/subjects/" | ConvertTo-Json
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "Economics",
    "slug": "economics",
    ...
  }
]
```

**Test Frontend Connection:**

1. **Open your Vercel URL:**
   ```
   https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app
   ```

2. **Open Browser DevTools (F12)**

3. **Check Console Tab:**
   - ❌ Should see NO red CORS errors
   - ❌ Should see NO "localhost" connection errors
   - ✅ Should be clean or only normal React messages

4. **Check Network Tab:**
   - Navigate to Units, Materials, or Quizzes pages
   - Watch for API requests
   - ✅ Requests should go to: `https://cpa-website-lvup.onrender.com`
   - ✅ Status codes should be: 200 (success) or 401 (not logged in - expected)

5. **Test Features:**
   - ✅ Homepage loads
   - ✅ Units page shows data
   - ✅ Materials page shows data
   - ✅ Quizzes page shows data
   - ✅ Registration form works
   - ✅ Login form works
   - ✅ Dark mode toggle works
   - ✅ Hamburger menu works

---

## 📊 What Was Changed

### Backend Configuration

**File: `backend/cpa_academy/settings.py`**

```python
# CORS settings - UPDATED
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",                           # Local dev
    "http://127.0.0.1:3000",                          # Local dev
    "https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app",  # ADDED
]

# Environment variable support - ADDED
if os.getenv("CORS_ALLOWED_ORIGINS"):
    CORS_ALLOWED_ORIGINS.extend(
        [origin.strip() for origin in os.getenv("CORS_ALLOWED_ORIGINS").split(",")]
    )

CORS_ALLOW_CREDENTIALS = True

# CORS headers - ADDED
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

# ALLOWED_HOSTS - UPDATED
ALLOWED_HOSTS = ["*"] if DEBUG else [
    "cpa-website-lvup.onrender.com",  # ADDED
    "localhost",
    "127.0.0.1",
]
```

### Frontend Configuration

**Environment Variable (Set in Vercel Dashboard):**
```
REACT_APP_API_BASE = https://cpa-website-lvup.onrender.com/api
```

**This replaces the localhost default in `src/api.js`:**
```javascript
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";
// Will now use: https://cpa-website-lvup.onrender.com/api in production
```

---

## 🔍 Verification Checklist

After completing Steps 1-4, verify:

### Backend:
- [ ] Changes committed to Git
- [ ] Pushed to GitHub/GitLab
- [ ] Render shows "Live" status
- [ ] Render deployment succeeded
- [ ] API endpoint returns data: `/api/subjects/`

### Frontend:
- [ ] Vercel environment variable set
- [ ] Vercel redeployed after setting variable
- [ ] Latest deployment shows in Vercel dashboard
- [ ] Frontend loads without errors

### Connection:
- [ ] Browser console has no CORS errors
- [ ] Network tab shows requests to Render URL
- [ ] API responses return successfully (200 status)
- [ ] Homepage loads subjects from backend
- [ ] Units/Materials/Quizzes pages load data
- [ ] Login/Registration functionality works

---

## 🚨 Troubleshooting Guide

### ❌ CORS Error in Console

**Symptom:**
```
Access to fetch at 'https://cpa-website-lvup.onrender.com/api/subjects/' 
from origin 'https://...vercel.app' has been blocked by CORS policy
```

**Solutions:**
1. ✅ Verify backend changes are pushed to Git
2. ✅ Check Render dashboard shows successful deployment
3. ✅ Wait 2-3 minutes for Render to finish deploying
4. ✅ Manually restart Render service if needed
5. ✅ Clear browser cache (Ctrl+Shift+R)

### ❌ Still connecting to localhost

**Symptom:**
```
Failed to connect to localhost:8000
```

**Solutions:**
1. ✅ Verify Vercel environment variable is actually set
2. ✅ Ensure you redeployed AFTER setting the variable
3. ✅ Check deployment timestamp to confirm it's the latest
4. ✅ Clear browser cache and hard refresh

### ❌ Backend not responding / 503 Error

**Symptom:**
```
503 Service Unavailable
```

**Causes & Solutions:**
1. **Render free tier spins down:** First request takes 30-60 seconds to wake up
2. **Backend crashed:** Check Render logs for errors
3. **Database issue:** Verify database is connected
4. **Solution:** Wait and retry, or check Render dashboard

### ❌ 404 Not Found

**Symptom:**
```
404 Not Found - /api/subjects/
```

**Solutions:**
1. ✅ Verify backend is running on Render
2. ✅ Check URL is correct (includes `/api/`)
3. ✅ Verify backend routes are configured correctly
4. ✅ Check Render logs for routing errors

---

## 🎓 Understanding the Setup

### How It Works:

1. **Development (localhost):**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`
   - API calls: `http://localhost:8000/api/`

2. **Production (deployed):**
   - Frontend: `https://...vercel.app`
   - Backend: `https://...onrender.com`
   - API calls: `https://...onrender.com/api/`

### Environment Variables:

- **Vercel:** Uses `process.env.REACT_APP_API_BASE` from environment variables
- **Localhost:** Falls back to `http://localhost:8000/api` if variable not set
- **Build time:** Env vars are injected during build, not at runtime

### CORS (Cross-Origin Resource Sharing):

- **Purpose:** Allows frontend (Vercel) to call backend (Render)
- **Without CORS:** Browser blocks cross-origin requests
- **With CORS:** Backend explicitly allows requests from Vercel domain

---

## 📞 Additional Resources

- **Full Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Quick Checklist:** `QUICK_DEPLOYMENT_CHECKLIST.md`
- **Detailed Summary:** `DEPLOYMENT_SUMMARY.md`
- **API Test Script:** `test-api-connection.sh`

- **Vercel Docs:** https://vercel.com/docs/environment-variables
- **Render Docs:** https://render.com/docs
- **Django CORS:** https://github.com/adamchainz/django-cors-headers

---

## 🎉 Success Criteria

You'll know everything is working when:

✅ **No errors in browser console**  
✅ **Network tab shows API calls to Render**  
✅ **Homepage loads subjects from backend**  
✅ **Units page displays unit list**  
✅ **Materials page displays materials**  
✅ **Quizzes page displays quizzes**  
✅ **Login/Registration works**  
✅ **Dark mode toggle works**  
✅ **All navigation functional**  

---

## 📝 Summary of URLs

| Service | Type | URL |
|---------|------|-----|
| Frontend (Vercel) | Production | https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app |
| Backend (Render) | Production | https://cpa-website-lvup.onrender.com |
| Backend API | Endpoint | https://cpa-website-lvup.onrender.com/api |
| Frontend (Local) | Development | http://localhost:3000 |
| Backend (Local) | Development | http://localhost:8000 |

---

## ⏱️ Expected Timeline

1. **Commit backend changes:** 2 minutes
2. **Render auto-deploy:** 2-5 minutes  
3. **Set Vercel env var:** 2 minutes
4. **Redeploy Vercel:** 1-3 minutes
5. **Testing:** 5 minutes

**Total:** ~15-20 minutes

---

**Status:** Configuration complete ✅ | Deployment pending ⏳  
**Next:** Follow Steps 1-4 above to deploy  
**Questions?** See `DEPLOYMENT_GUIDE.md` for detailed help

---

**Created:** October 26, 2025  
**Ready to deploy!** 🚀



