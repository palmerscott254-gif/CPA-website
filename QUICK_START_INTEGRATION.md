# ⚡ Quick Start - Connect Frontend to Backend

**Status:** Backend is live ✅ | Frontend needs env var ⏳

---

## 🎯 Single Action Required

### Set Environment Variable in Vercel

**1. Go to Vercel Dashboard:**
```
https://vercel.com/dashboard
```

**2. Select Your Project:**
- Click on: `cpa-website-qbf3-git-main-palmerscott254-gifs-projects`

**3. Add Environment Variable:**
```
Settings → Environment Variables → Add New

Name:  REACT_APP_API_BASE
Value: https://cpa-website-lvup.onrender.com/api

Environment: ✓ Production
             ✓ Preview (optional)
             ✓ Development (optional)

→ Click "Save"
```

**4. Redeploy:**
```
Deployments tab → Latest deployment → "Redeploy"
```

**5. Wait 2-3 minutes for deployment to complete**

**6. Test:**
```
Visit: https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app
Open: DevTools (F12) → Network tab
Navigate: Click "Units" or "Materials"
Verify: API calls go to https://cpa-website-lvup.onrender.com
```

---

## ✅ Done!

Your frontend will now communicate with your deployed backend on Render!

---

## 🔍 Verification

### Check Network Tab:
```
Request URL should be:
https://cpa-website-lvup.onrender.com/api/subjects/units/

NOT:
http://localhost:8000/api/subjects/units/
```

### Successful Integration Shows:
- ✅ Status: 200
- ✅ No CORS errors
- ✅ Data loads on page
- ✅ No console errors

---

## 🚨 Troubleshooting

### If API calls still go to localhost:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check env var is set in Vercel
4. Verify deployment completed

### If you get CORS errors:
1. Check backend is deployed to Render
2. Verify this URL works: https://cpa-website-lvup.onrender.com/api
3. Backend middleware fix was committed (see below)

---

## 📝 Optional: Commit Backend Fix

The CORS middleware order was corrected. Commit this:

```bash
cd CPA-website/backend
git add cpa_academy/settings.py
git commit -m "fix: Correct CORS middleware order"
git push origin main
```

This ensures Render has the latest configuration.

---

## 🎉 That's It!

One environment variable = Full integration!

**Time:** 5 minutes  
**Difficulty:** Very Easy  
**Result:** Production-ready full-stack app! 🚀

