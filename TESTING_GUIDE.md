# 🧪 Comprehensive Testing Guide - CPA Academy

## Overview

This guide provides step-by-step testing procedures for your deployed CPA Academy application.

**Frontend URL:** https://cpa-website-1.onrender.com  
**Backend URL:** https://cpa-website-lvup.onrender.com  

---

## 🎯 Quick Test Checklist

### Critical Tests (5 minutes)

- [ ] **1. Homepage loads** (no errors)
- [ ] **2. API calls work** (check Network tab)
- [ ] **3. No CORS errors** (check Console)
- [ ] **4. Navigation functional** (all links work)
- [ ] **5. Dark mode toggles** (theme changes)

If all 5 pass → **Your app is working!** ✅

---

## 1️⃣ Frontend Testing

### Homepage Tests

**URL:** https://cpa-website-1.onrender.com

**Test Steps:**
1. Open the URL in a browser
2. Open DevTools (F12)
3. Check Console tab

**Expected Results:**
- ✅ Page loads without errors
- ✅ Hero section visible
- ✅ Stats display (10K+ Students, etc.)
- ✅ Features cards visible
- ✅ Mission section loads
- ✅ Subjects section shows data from API
- ✅ Footer displays
- ✅ No console errors
- ✅ No CORS errors

**Test Console:**
```
Should see:
- No red errors
- API calls returning 200 OK
- Data loaded successfully
```

**Test Network Tab:**
```
GET https://cpa-website-lvup.onrender.com/api/subjects/
Status: 200
```

### Navigation Tests

**Test Hamburger Menu:**
1. Click hamburger icon (☰) on top left
2. Menu should slide open
3. Click each menu item:
   - [ ] Home → Loads homepage
   - [ ] Units → Loads units page
   - [ ] Materials → Loads materials page
   - [ ] Quizzes → Loads quizzes page
   - [ ] Missions → Loads missions page
   - [ ] Contact Support → Loads contact page

**Test Logo:**
- [ ] Click "CPA Academy" logo
- [ ] Should navigate to homepage

**Test Theme Toggle:**
- [ ] Click sun/moon icon
- [ ] Theme should switch (dark ↔ light)
- [ ] Colors change throughout page
- [ ] Preference persists on refresh

### Units Page Tests

**URL:** https://cpa-website-1.onrender.com/units

**Test Steps:**
1. Navigate to Units page
2. Open DevTools (F12)
3. Check Network tab

**Expected Results:**
- ✅ Page loads without errors
- ✅ Units displayed from API
- ✅ Each unit shows:
  - Unit title
  - Unit code
  - Description
  - Metadata (lessons, duration, difficulty)
- ✅ Search box functional
- ✅ Filter options work
- ✅ Grid/List toggle works
- ✅ Click unit card → navigates to detail page

**Test Search:**
1. Type in search box: "MICRO"
2. Results should filter
3. Clear search
4. All units should reappear

**Test API Call:**
```
Network tab should show:
GET https://cpa-website-lvup.onrender.com/api/subjects/units/
Status: 200
Response: JSON array of units
```

### Materials Page Tests

**URL:** https://cpa-website-1.onrender.com/materials

**Test Steps:**
1. Navigate to Materials page
2. Observe materials list
3. Test download functionality

**Expected Results:**
- ✅ Materials displayed from API
- ✅ Each material shows:
  - Title
  - Description
  - File type (PDF, DOC, etc.)
  - Upload date
  - Download count
- ✅ Search functionality works
- ✅ Filter by type works
- ✅ Grid/List view toggle
- ✅ Download button present

**Test Download:**
1. Click "Download" on a material
2. If logged in: File should download
3. If not logged in: Should show message

**Test API Call:**
```
Network tab should show:
GET https://cpa-website-lvup.onrender.com/api/materials/
Status: 200
Response: Paginated list of materials
```

### Quizzes Page Tests

**URL:** https://cpa-website-1.onrender.com/quizzes

**Expected Results:**
- ✅ Page loads
- ✅ Quiz sets displayed
- ✅ Search works
- ✅ Filter by difficulty
- ✅ Quiz cards styled correctly
- ✅ "Start Quiz" buttons visible

### Contact Page Tests

**URL:** https://cpa-website-1.onrender.com/contact

**Expected Results:**
- ✅ Contact form displays
- ✅ "We reply within 24 hours" message
- ✅ Contact info cards visible
- ✅ Form validation works
- ✅ Submit button functional

### Missions Page Tests

**URL:** https://cpa-website-1.onrender.com/missions

**Expected Results:**
- ✅ Mission statement displays
- ✅ Core values section visible
- ✅ Goals section displays
- ✅ CTA section present
- ✅ Animations smooth

---

## 2️⃣ Authentication Testing

### Registration Flow

**URL:** https://cpa-website-1.onrender.com/register

**Test Steps:**
1. Click "Register" button
2. Fill in form:
   - Username: `testuser123`
   - Email: `testuser123@example.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
3. Check "I agree to terms"
4. Click "Register"

**Expected Results:**
- ✅ Form validation works
- ✅ Password visibility toggle works
- ✅ Terms checkbox required
- ✅ Submit sends POST request
- ✅ Success message displays
- ✅ Redirects to login page

**Test API Call:**
```
POST https://cpa-website-lvup.onrender.com/api/auth/register/
Status: 201 Created
Response: User object
```

### Login Flow

**URL:** https://cpa-website-1.onrender.com/login

**Test Steps:**
1. Click "Login" button
2. Enter credentials:
   - Username: `testuser123`
   - Password: `TestPass123!`
3. Click "Login"

**Expected Results:**
- ✅ Form validation works
- ✅ Password visibility toggle
- ✅ "Remember me" checkbox
- ✅ Submit sends POST request
- ✅ Tokens stored in localStorage
- ✅ Redirects to homepage
- ✅ User menu appears (shows username)
- ✅ "Login/Register" buttons hidden

**Test API Call:**
```
POST https://cpa-website-lvup.onrender.com/api/auth/login/
Status: 200 OK
Response: {access, refresh, user}
```

**Check localStorage:**
```javascript
// Open Console and run:
localStorage.getItem('access_token')  // Should have JWT
localStorage.getItem('refresh_token') // Should have JWT
```

### Logout Flow

**Test Steps:**
1. When logged in, click user menu
2. Click "Logout"

**Expected Results:**
- ✅ Tokens cleared from localStorage
- ✅ User menu disappears
- ✅ "Login/Register" buttons reappear
- ✅ Redirects to homepage
- ✅ Protected content inaccessible

---

## 3️⃣ Backend API Testing

### Test API Root

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://cpa-website-lvup.onrender.com/"
```

**Expected Response:**
```json
{
  "message": "CPA Academy API",
  "version": "1.0",
  "endpoints": {
    "admin": "/admin/",
    "authentication": "/api/auth/",
    "subjects": "/api/subjects/",
    "materials": "/api/materials/",
    "quizzes": "/api/quizzes/"
  }
}
```

### Test Subjects Endpoint

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://cpa-website-lvup.onrender.com/api/subjects/"
```

**Expected Response:**
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "LEVEL 1",
      "slug": "Start",
      "units": []
    }
  ]
}
```

### Test Units Endpoint

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://cpa-website-lvup.onrender.com/api/subjects/units/"
```

**Expected Response:**
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "title": "MICROECONOMICS",
      "code": "MHR040900KJ",
      "description": "...",
      "order": 1
    }
  ]
}
```

### Test Materials Endpoint

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "https://cpa-website-lvup.onrender.com/api/materials/"
```

**Expected Response:**
```json
{
  "count": 1,
  "results": [
    {
      "id": 1,
      "title": "...",
      "description": "...",
      "file": "https://cpa-website-lvup.onrender.com/media/...",
      "file_type": "pdf",
      "upload_date": "2025-10-26T...",
      "is_public": true
    }
  ]
}
```

### Test CORS Headers

**PowerShell:**
```powershell
$response = Invoke-WebRequest -Uri "https://cpa-website-lvup.onrender.com/api/subjects/" `
  -Headers @{"Origin"="https://cpa-website-1.onrender.com"} `
  -Method Options

$response.Headers['Access-Control-Allow-Origin']
```

**Expected Result:**
```
Access-Control-Allow-Origin: https://cpa-website-1.onrender.com
```

### Test Admin Panel

**URL:** https://cpa-website-lvup.onrender.com/admin/

**Test Steps:**
1. Open admin URL
2. Login with superuser credentials

**Expected Results:**
- ✅ Admin login page loads
- ✅ Static files (CSS/JS) load
- ✅ WhiteNoise serving files
- ✅ Can access admin dashboard
- ✅ Models visible (Users, Subjects, Units, Materials, Quizzes)

---

## 4️⃣ Responsive Design Testing

### Desktop Testing (> 1024px)

**Test At:**
- 1920x1080 (Full HD)
- 1366x768 (Laptop)

**Expected:**
- ✅ Full navigation bar
- ✅ Logo centered
- ✅ Multi-column layouts
- ✅ Large images
- ✅ Desktop spacing

### Tablet Testing (640px - 1024px)

**Test At:**
- 768x1024 (iPad)
- 820x1180 (iPad Air)

**Expected:**
- ✅ Hamburger menu
- ✅ 2-column layouts
- ✅ Responsive images
- ✅ Touch-friendly buttons
- ✅ Proper spacing

### Mobile Testing (< 640px)

**Test At:**
- 375x667 (iPhone SE)
- 390x844 (iPhone 12 Pro)
- 360x740 (Android)

**Expected:**
- ✅ Hamburger menu
- ✅ Single column layouts
- ✅ Stack cards vertically
- ✅ Touch-friendly (44px min)
- ✅ No horizontal scroll
- ✅ Readable text
- ✅ Working inputs

**DevTools Test:**
1. Open DevTools (F12)
2. Click device toolbar icon
3. Select different devices
4. Test all pages

---

## 5️⃣ Performance Testing

### Lighthouse Audit

**Test Steps:**
1. Open https://cpa-website-1.onrender.com
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Click "Generate report"
5. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
   - ✅ SEO
6. Click "Analyze page load"

**Target Scores:**
- Performance: > 85
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### Network Performance

**Test Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Disable cache
4. Refresh page (Ctrl+F5)

**Expected:**
- Total size: < 500 KB
- Requests: < 20
- Load time: < 3 seconds
- API calls: < 500ms each

### Bundle Size Check

**Check Build Output:**
```
Main JS: 115.71 KB (gzipped)
CSS: 8.83 KB (gzipped)
Total: ~124.5 KB
```

**Status:** ✅ Excellent (target: < 200 KB)

---

## 6️⃣ Browser Compatibility Testing

### Desktop Browsers

**Test On:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Test Features:**
- [ ] Page loads correctly
- [ ] Animations work
- [ ] Dark mode works
- [ ] Forms submit
- [ ] API calls work

### Mobile Browsers

**Test On:**
- [ ] Chrome Mobile
- [ ] Safari Mobile
- [ ] Firefox Mobile
- [ ] Samsung Internet

**Test Features:**
- [ ] Responsive layout
- [ ] Touch interactions
- [ ] Hamburger menu
- [ ] Forms usable
- [ ] No horizontal scroll

---

## 7️⃣ Integration Testing Scenarios

### Scenario 1: New User Journey

**Steps:**
1. Visit homepage (not logged in)
2. Browse units
3. Click register
4. Create account
5. Login
6. Browse materials
7. Attempt download
8. Logout

**Expected:** All steps work seamlessly

### Scenario 2: Returning User

**Steps:**
1. Visit homepage
2. Login
3. Check user menu shows correctly
4. Navigate to units
5. View unit details
6. Download material
7. Take quiz (if available)
8. Logout

**Expected:** Smooth flow, no errors

### Scenario 3: Mobile User

**Steps:**
1. Open on mobile device
2. Test hamburger menu
3. Navigate all pages
4. Test dark mode
5. Fill contact form
6. Test responsiveness

**Expected:** Mobile-optimized experience

---

## 8️⃣ Error Handling Testing

### Network Error Testing

**Test Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Change throttling to "Offline"
4. Try to load pages

**Expected:**
- ✅ Graceful error messages
- ✅ No app crashes
- ✅ Retry functionality
- ✅ User-friendly feedback

### API Error Testing

**Test Scenarios:**
1. **Backend down:** Should show error message
2. **Invalid token:** Should redirect to login
3. **404 endpoint:** Should handle gracefully
4. **Slow response:** Should show loading state

### Form Validation Testing

**Test Invalid Inputs:**
- [ ] Empty required fields
- [ ] Invalid email format
- [ ] Password too short
- [ ] Passwords don't match
- [ ] Special characters in username

**Expected:** Clear validation messages

---

## 9️⃣ Security Testing

### HTTPS Verification

**Check:**
- [ ] Frontend uses HTTPS
- [ ] Backend uses HTTPS
- [ ] No mixed content warnings
- [ ] Valid SSL certificate

### Authentication Security

**Test:**
- [ ] Passwords hidden by default
- [ ] JWT tokens in localStorage only
- [ ] Token refresh works
- [ ] Logout clears tokens
- [ ] Protected routes require auth

### CORS Security

**Test:**
- [ ] Requests from frontend succeed
- [ ] Requests from other origins blocked
- [ ] Proper CORS headers present
- [ ] Credentials handled correctly

---

## 🔟 Load Testing (Optional)

### Manual Load Test

**Test Steps:**
1. Open multiple browser tabs (10+)
2. Navigate to different pages simultaneously
3. Trigger API calls at same time

**Expected:**
- ✅ All requests succeed
- ✅ No significant slowdown
- ✅ No errors or crashes

### Backend Performance

**Monitor:**
- Response times
- Error rates
- Database queries
- Memory usage

**Tools:**
- Render dashboard metrics
- Django Debug Toolbar (dev only)

---

## ✅ Test Results Template

### Test Summary

**Date:** _____________  
**Tester:** _____________  
**Environment:** Production

### Results

| Category | Tests | Passed | Failed | Notes |
|----------|-------|--------|--------|-------|
| Homepage | 5 | ___ | ___ | |
| Navigation | 6 | ___ | ___ | |
| Units Page | 5 | ___ | ___ | |
| Materials Page | 6 | ___ | ___ | |
| Authentication | 8 | ___ | ___ | |
| API Endpoints | 5 | ___ | ___ | |
| Responsive Design | 3 | ___ | ___ | |
| Performance | 4 | ___ | ___ | |
| Browser Compat | 4 | ___ | ___ | |
| Security | 5 | ___ | ___ | |

**Total:** ___/51 tests passed

### Issues Found

1. **Issue:** ___________________  
   **Severity:** High/Medium/Low  
   **Status:** Open/Fixed

2. **Issue:** ___________________  
   **Severity:** High/Medium/Low  
   **Status:** Open/Fixed

### Overall Assessment

**Status:** ⬜ Pass ⬜ Pass with issues ⬜ Fail

**Notes:**
___________________________________
___________________________________

---

## 🚨 Troubleshooting Common Issues

### Issue: CORS Errors

**Symptoms:** Console shows CORS policy error

**Solutions:**
1. Verify backend deployed with latest code
2. Check Render backend logs
3. Clear browser cache
4. Hard refresh (Ctrl+F5)

### Issue: API Calls Fail

**Symptoms:** Network errors, 404, 500

**Solutions:**
1. Check backend is running (visit backend URL)
2. Verify API base URL in environment
3. Check Render backend logs for errors
4. Test API directly with PowerShell

### Issue: Slow Performance

**Symptoms:** Pages load slowly

**Solutions:**
1. Check Render free tier (cold starts)
2. Wait for initial deployment to warm up
3. Check browser network throttling
4. Clear browser cache

### Issue: Authentication Not Working

**Symptoms:** Can't login or tokens not saved

**Solutions:**
1. Check localStorage in DevTools
2. Verify backend auth endpoints work
3. Test API directly
4. Clear localStorage and retry

---

## 📊 Testing Checklist Summary

### Critical Tests (Must Pass)
- [ ] Homepage loads
- [ ] API calls succeed
- [ ] No CORS errors
- [ ] Navigation works
- [ ] Authentication functions

### Important Tests (Should Pass)
- [ ] All pages load correctly
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Forms validate
- [ ] Downloads work

### Nice-to-Have Tests
- [ ] Performance > 85 Lighthouse score
- [ ] Cross-browser compatibility
- [ ] Load handling
- [ ] Error recovery

---

**If all critical tests pass → Your app is production-ready!** ✅

**Testing Time Estimate:**
- Quick test: 5 minutes
- Basic testing: 30 minutes
- Comprehensive testing: 2 hours
- Full regression: 4 hours

**Happy Testing!** 🧪

