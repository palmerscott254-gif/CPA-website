# 🚀 Quick Deployment Checklist

## ✅ Completed
- [x] Backend CORS configuration updated
- [x] Vercel domain added to ALLOWED_ORIGINS
- [x] CORS headers configured
- [x] Deployment guide created

## ⏳ Your Action Required

### 1. Set Vercel Environment Variable (5 minutes)

**In Vercel Dashboard:**
1. Go to: https://vercel.com/dashboard
2. Select your project
3. Navigate to: **Settings → Environment Variables**
4. Add:
   - **Name:** `REACT_APP_API_BASE`
   - **Value:** `https://cpa-website-lvup.onrender.com/api`
   - **Environment:** ✓ Production

### 2. Commit Backend Changes (2 minutes)

```bash
cd CPA-website/backend
git add cpa_academy/settings.py
git commit -m "Configure CORS for Vercel deployment"
git push origin main
```

**Render will auto-deploy** when it detects the push.

### 3. Redeploy Vercel (1 minute)

**Option A - Automatic:**
```bash
cd CPA-website/Frontend
git add .
git commit -m "Update deployment configuration"
git push origin main
```

**Option B - Manual:**
- Go to Vercel Dashboard
- Go to Deployments tab
- Click "Redeploy" on latest deployment

### 4. Test Connection (5 minutes)

**Open your Vercel URL:**
```
https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app
```

**Check Browser Console (F12):**
- ✅ No CORS errors
- ✅ API calls to `https://cpa-website-lvup.onrender.com`
- ✅ Successful responses (200 status)

**Test Features:**
- ✅ Homepage loads
- ✅ Navigate to Units page
- ✅ Navigate to Materials page  
- ✅ Try registration/login
- ✅ Dark mode toggle works

---

## 🔍 Quick Test Commands

### Test Backend API:
```bash
# PowerShell
Invoke-WebRequest -Uri "https://cpa-website-lvup.onrender.com/api/subjects/"

# bash/curl
curl https://cpa-website-lvup.onrender.com/api/subjects/
```

### Expected Response:
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

---

## 🐛 Troubleshooting

### CORS Error?
1. ✅ Verify backend changes are pushed
2. ✅ Wait for Render to redeploy (2-3 minutes)
3. ✅ Check Render logs for errors

### Still using localhost?
1. ✅ Verify Vercel env var is set
2. ✅ Redeploy Vercel (env vars only apply after redeploy)
3. ✅ Clear browser cache (Ctrl+Shift+R)

### 404 Errors?
1. ✅ Check Render service is running
2. ✅ Verify backend URLs are correct
3. ✅ Check Render logs

---

## 📞 Resources

- **Full Guide:** See `DEPLOYMENT_GUIDE.md`
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com

---

**Total Time: ~15 minutes** ⏱️

