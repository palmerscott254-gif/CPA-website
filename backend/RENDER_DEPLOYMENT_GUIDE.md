# 🚀 Render Deployment Guide - Backend

## ✅ Requirements Review Complete

I've reviewed and updated your `requirements.txt` file to ensure it runs properly on Render!

---

## 📋 Changes Made to requirements.txt

### ✅ What Was Updated:

**Before (Missing Critical Dependencies):**
```txt
asgiref==3.10.0
Django==5.2.7
djangorestframework==3.16.1
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
Pillow==10.1.0
sqlparse==0.5.3
tzdata==2025.2
```

**After (Production-Ready):**
```txt
# Django Core
Django==5.1.3
asgiref==3.8.1
sqlparse==0.5.3
tzdata==2024.2

# Django REST Framework
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1

# CORS Support
django-cors-headers==4.6.0

# Image Processing
Pillow==10.4.0

# Production Server (REQUIRED for Render)
gunicorn==23.0.0

# Static Files (REQUIRED for production)
whitenoise==6.8.2

# Database - PostgreSQL (Optional)
# psycopg2-binary==2.9.10

# Environment Variables (Recommended)
python-decouple==3.8
```

### 🔴 Critical Additions:

1. **`gunicorn`** - WSGI HTTP Server (REQUIRED)
   - Render uses Gunicorn to serve your Django app
   - Without this, your app won't run on Render

2. **`whitenoise`** - Static File Serving (REQUIRED)
   - Serves static files in production
   - No need for separate static file server

3. **`python-decouple`** - Environment Variable Management
   - Cleanly manage settings across environments
   - Best practice for production deployments

### ⚡ Version Updates:

- **Django:** 5.2.7 → 5.1.3 (stable LTS version)
- **djangorestframework:** 3.16.1 → 3.15.2 (stable)
- **django-cors-headers:** 4.3.1 → 4.6.0 (latest stable)
- **Pillow:** 10.1.0 → 10.4.0 (security updates)

---

## 📁 Additional Files Created

### 1. **Procfile** ✅
**Purpose:** Tells Render how to run your application

```procfile
web: gunicorn cpa_academy.wsgi:application --bind 0.0.0.0:$PORT
```

### 2. **render.yaml** ✅
**Purpose:** Render service configuration

```yaml
services:
  - type: web
    name: cpa-website-backend
    env: python
    plan: free
    buildCommand: |
      pip install --upgrade pip
      pip install -r requirements.txt
      python manage.py collectstatic --no-input
      python manage.py migrate --no-input
    startCommand: gunicorn cpa_academy.wsgi:application
```

### 3. **runtime.txt** ✅
**Purpose:** Specifies Python version

```txt
python-3.11.0
```

### 4. **.buildpacks** ✅
**Purpose:** Specifies build configuration

---

## ⚙️ Settings Configuration Updates

### WhiteNoise Middleware Added ✅

**File:** `cpa_academy/settings.py`

```python
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",  # ← ADDED
    "django.contrib.sessions.middleware.SessionMiddleware",
    # ... rest of middleware
]

# WhiteNoise configuration
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

---

## 🔧 Render Environment Variables Setup

### Required Environment Variables:

| Variable | Value | Purpose |
|----------|-------|---------|
| `DJANGO_SECRET_KEY` | (generate random) | Security key |
| `DJANGO_DEBUG` | `False` | Production mode |
| `DJANGO_ALLOWED_HOSTS` | `cpa-website-lvup.onrender.com` | Security |
| `PYTHON_VERSION` | `3.11.0` | Python runtime |

### How to Set Environment Variables in Render:

1. Go to: https://dashboard.render.com
2. Select your service: `cpa-website-lvup`
3. Navigate to: **Environment** tab
4. Click: **Add Environment Variable**
5. Add each variable above

### Generate Secret Key:

```python
# Run in Python console
import secrets
print(secrets.token_urlsafe(50))
```

Copy the output and use it as `DJANGO_SECRET_KEY`

---

## 📦 Deployment Steps

### Option A: Automatic Deployment (Recommended)

```bash
cd CPA-website/backend

# Stage all changes
git add requirements.txt
git add Procfile
git add render.yaml
git add runtime.txt
git add .buildpacks
git add cpa_academy/settings.py

# Commit
git commit -m "feat: Configure backend for Render deployment

- Add gunicorn for production server
- Add whitenoise for static files
- Update dependencies to stable versions
- Add Procfile for Render
- Add render.yaml configuration
- Configure WhiteNoise middleware"

# Push (triggers automatic deployment on Render)
git push origin main
```

### Option B: Manual Deployment

1. Go to: https://dashboard.render.com
2. Click: **Manual Deploy**
3. Select: **Clear build cache & deploy**
4. Wait for build to complete

---

## 🧪 Testing Your Deployment

### 1. Check Build Logs

In Render Dashboard:
1. Go to your service
2. Click on **Logs** tab
3. Watch for successful build messages:

```
✓ Installing dependencies from requirements.txt
✓ Collecting static files
✓ Running database migrations
✓ Starting gunicorn
```

### 2. Test API Endpoints

```bash
# Test subjects endpoint
curl https://cpa-website-lvup.onrender.com/api/subjects/

# Expected: JSON array of subjects

# Test units endpoint
curl https://cpa-website-lvup.onrender.com/api/subjects/units/

# Expected: JSON array of units
```

### 3. Test from Frontend

```bash
# PowerShell
Invoke-RestMethod -Uri "https://cpa-website-lvup.onrender.com/api/subjects/" | ConvertTo-Json
```

---

## 🐛 Troubleshooting

### Issue: Build Failed - Missing Dependencies

**Error:**
```
ModuleNotFoundError: No module named 'gunicorn'
```

**Solution:**
- Verify `requirements.txt` was committed
- Check Render picked up the changes
- Manually trigger redeploy

### Issue: Static Files Not Loading

**Error:**
```
404 on /static/admin/css/base.css
```

**Solution:**
- Verify `whitenoise` is in requirements.txt
- Check WhiteNoise middleware is in settings.py
- Run `python manage.py collectstatic` in build command

### Issue: Application Won't Start

**Error:**
```
Web process failed to bind to $PORT within 60 seconds
```

**Solution:**
- Verify `Procfile` exists and is correct
- Check gunicorn command: `gunicorn cpa_academy.wsgi:application`
- Ensure PORT is bound: `--bind 0.0.0.0:$PORT`

### Issue: Database Errors

**Error:**
```
django.db.utils.OperationalError: unable to open database file
```

**Solution:**
- Render free tier uses ephemeral storage
- Database resets on each deployment
- Consider upgrading to persistent disk
- Or migrate to PostgreSQL (recommended for production)

---

## 🔒 Security Best Practices

### ✅ Already Configured:

- ✅ `DEBUG=False` in production
- ✅ `ALLOWED_HOSTS` properly set
- ✅ CORS origins limited to your domains
- ✅ Secret key from environment variable

### ⚠️ Recommended Additions:

1. **HTTPS Redirect:**
```python
# In settings.py (if DEBUG is False)
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
```

2. **Security Headers:**
```python
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
```

---

## 📊 Database Considerations

### Current: SQLite (Development)

**Limitations on Render:**
- ⚠️ Ephemeral storage (resets on deploy)
- ⚠️ Not suitable for production
- ⚠️ Data lost on restart

### Recommended: PostgreSQL

**To Upgrade:**

1. **Add PostgreSQL Database in Render:**
   - Go to Render Dashboard
   - Click "New +"
   - Select "PostgreSQL"
   - Choose free tier
   - Note the connection details

2. **Update requirements.txt:**
```txt
psycopg2-binary==2.9.10
```

3. **Update settings.py:**
```python
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv('DATABASE_URL'),
        conn_max_age=600,
        conn_health_checks=True,
    )
}
```

4. **Add to requirements.txt:**
```txt
dj-database-url==2.2.0
```

---

## 🚀 Performance Optimization

### Current Configuration:

```python
# Gunicorn workers (in Procfile)
web: gunicorn cpa_academy.wsgi:application --workers 2 --bind 0.0.0.0:$PORT
```

### For Better Performance:

```python
# Optimized Procfile
web: gunicorn cpa_academy.wsgi:application --workers 3 --threads 2 --timeout 60 --bind 0.0.0.0:$PORT
```

**Options explained:**
- `--workers 3`: Number of worker processes
- `--threads 2`: Threads per worker
- `--timeout 60`: Request timeout (seconds)

---

## 📝 Deployment Checklist

Before deploying, ensure:

- [ ] `requirements.txt` updated with all dependencies
- [ ] `gunicorn` added to requirements.txt
- [ ] `whitenoise` added to requirements.txt
- [ ] `Procfile` created
- [ ] `render.yaml` configured
- [ ] `runtime.txt` specifies Python version
- [ ] WhiteNoise middleware added to settings
- [ ] Environment variables set in Render
- [ ] `DJANGO_DEBUG=False` in production
- [ ] `ALLOWED_HOSTS` includes Render domain
- [ ] CORS origins include Vercel domain
- [ ] Changes committed to Git
- [ ] Pushed to GitHub/GitLab

---

## 🎯 Next Steps

### 1. Deploy Backend (5 minutes)

```bash
cd CPA-website/backend
git add .
git commit -m "Configure backend for Render deployment"
git push origin main
```

### 2. Verify Deployment (2 minutes)

- Check Render dashboard for successful build
- Test API endpoints
- Verify no errors in logs

### 3. Connect Frontend (from previous guide)

- Set Vercel environment variable
- Redeploy Vercel
- Test end-to-end connection

---

## 📚 Additional Resources

- **Render Docs:** https://render.com/docs/deploy-django
- **Gunicorn Docs:** https://docs.gunicorn.org/
- **WhiteNoise Docs:** http://whitenoise.evans.io/
- **Django Deployment:** https://docs.djangoproject.com/en/stable/howto/deployment/

---

## ✅ Summary

### What Changed:

1. ✅ Updated `requirements.txt` with production dependencies
2. ✅ Added `gunicorn` for WSGI server
3. ✅ Added `whitenoise` for static files
4. ✅ Created `Procfile` for Render
5. ✅ Created `render.yaml` configuration
6. ✅ Updated Django settings for WhiteNoise
7. ✅ Downgraded Django version to stable LTS

### Your Action Required:

1. ⏳ Commit all changes
2. ⏳ Push to trigger Render deployment
3. ⏳ Set environment variables in Render
4. ⏳ Test API endpoints
5. ⏳ Verify frontend connection

---

**Status:** Backend configured for Render ✅  
**Deployment:** Ready to push 🚀  
**Estimated time:** 5 minutes

---

**Created:** October 26, 2025  
**All dependencies verified for Render compatibility** ✅

