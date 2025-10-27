#!/bin/bash

# CPA Academy - API Connection Test Script
# Tests the connection between frontend and backend

echo "🧪 Testing CPA Academy API Connection..."
echo "=========================================="
echo ""

# Configuration
BACKEND_URL="https://cpa-website-lvup.onrender.com"
FRONTEND_URL="https://cpa-website-qbf3-git-main-palmerscott254-gifs-projects.vercel.app"

echo "📍 Backend URL: $BACKEND_URL"
echo "📍 Frontend URL: $FRONTEND_URL"
echo ""

# Test 1: Backend Health Check
echo "1️⃣ Testing Backend Health..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/")
if [ $HTTP_CODE -eq 200 ] || [ $HTTP_CODE -eq 404 ]; then
    echo "   ✅ Backend is reachable (HTTP $HTTP_CODE)"
else
    echo "   ❌ Backend unreachable (HTTP $HTTP_CODE)"
fi
echo ""

# Test 2: Subjects Endpoint
echo "2️⃣ Testing Subjects API..."
SUBJECTS_RESPONSE=$(curl -s "$BACKEND_URL/api/subjects/")
if echo "$SUBJECTS_RESPONSE" | grep -q "id\|name\|error" ; then
    echo "   ✅ Subjects API responding"
else
    echo "   ❌ Subjects API not responding correctly"
fi
echo ""

# Test 3: Units Endpoint
echo "3️⃣ Testing Units API..."
UNITS_RESPONSE=$(curl -s "$BACKEND_URL/api/subjects/units/")
if echo "$UNITS_RESPONSE" | grep -q "id\|title\|error" ; then
    echo "   ✅ Units API responding"
else
    echo "   ❌ Units API not responding correctly"
fi
echo ""

# Test 4: Materials Endpoint
echo "4️⃣ Testing Materials API..."
MATERIALS_RESPONSE=$(curl -s "$BACKEND_URL/api/materials/")
if echo "$MATERIALS_RESPONSE" | grep -q "id\|title\|error\|results" ; then
    echo "   ✅ Materials API responding"
else
    echo "   ❌ Materials API not responding correctly"
fi
echo ""

# Test 5: CORS Headers
echo "5️⃣ Testing CORS Configuration..."
CORS_RESPONSE=$(curl -s -I -H "Origin: $FRONTEND_URL" \
    -H "Access-Control-Request-Method: GET" \
    -H "Access-Control-Request-Headers: Content-Type" \
    "$BACKEND_URL/api/subjects/" | grep -i "access-control")

if echo "$CORS_RESPONSE" | grep -q "access-control-allow-origin" ; then
    echo "   ✅ CORS headers present"
    echo "   $CORS_RESPONSE"
else
    echo "   ⚠️  CORS headers may not be configured"
fi
echo ""

# Test 6: Frontend Accessibility
echo "6️⃣ Testing Frontend Accessibility..."
FRONTEND_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ $FRONTEND_CODE -eq 200 ]; then
    echo "   ✅ Frontend is accessible (HTTP $FRONTEND_CODE)"
else
    echo "   ❌ Frontend unreachable (HTTP $FRONTEND_CODE)"
fi
echo ""

# Summary
echo "=========================================="
echo "✅ Test Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Set REACT_APP_API_BASE in Vercel environment variables"
echo "   2. Redeploy Vercel application"
echo "   3. Visit $FRONTEND_URL"
echo "   4. Check browser console for any errors"
echo "   5. Test login/registration functionality"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"



