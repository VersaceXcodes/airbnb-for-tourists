#!/bin/bash

echo "=== Testing Airbnb Application Functionality ==="
echo

BASE_URL="https://123airbnb-for-tourists.launchpulse.ai"

# Test 1: Health Check
echo "1. Testing API Health Check..."
health_response=$(curl -s "$BASE_URL/api/health")
if echo "$health_response" | grep -q '"status":"ok"'; then
    echo "✓ Health check passed"
else
    echo "✗ Health check failed"
    echo "Response: $health_response"
fi
echo

# Test 2: Frontend Loading
echo "2. Testing Frontend Loading..."
frontend_response=$(curl -s "$BASE_URL")
if echo "$frontend_response" | grep -q "Vite + React + TS"; then
    echo "✓ Frontend loading"
else
    echo "✗ Frontend not loading properly"
fi
echo

# Test 3: Properties API
echo "3. Testing Properties API..."
properties_response=$(curl -s "$BASE_URL/api/properties")
if echo "$properties_response" | grep -q "property_id"; then
    echo "✓ Properties API working"
    echo "  Found $(echo "$properties_response" | grep -o "property_id" | wc -l) properties"
else
    echo "✗ Properties API failed"
    echo "Response: $properties_response"
fi
echo

# Test 4: User Registration
echo "4. Testing User Registration..."
test_email="testuser_$(date +%s)@example.com"
register_response=$(curl -s "$BASE_URL/api/auth/register" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$test_email\",\"password\":\"testpass123\",\"name\":\"Test User\"}")

if echo "$register_response" | grep -q "token"; then
    echo "✓ User registration working"
    # Extract token for further testing
    token=$(echo "$register_response" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
else
    echo "✗ User registration failed"
    echo "Response: $register_response"
fi
echo

# Test 5: User Login  
echo "5. Testing User Login..."
login_response=$(curl -s "$BASE_URL/api/auth/login" \
    -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$test_email\",\"password\":\"testpass123\"}")

if echo "$login_response" | grep -q "token"; then
    echo "✓ User login working"
else
    echo "✗ User login failed"
    echo "Response: $login_response"
fi
echo

# Test 6: Auth Verification
echo "6. Testing Auth Verification..."
if [ -n "$token" ]; then
    verify_response=$(curl -s "$BASE_URL/api/auth/verify" \
        -H "Authorization: Bearer $token")
    
    if echo "$verify_response" | grep -q "user"; then
        echo "✓ Auth verification working"
    else
        echo "✗ Auth verification failed"
        echo "Response: $verify_response"
    fi
else
    echo "- Skipped (no token available)"
fi
echo

# Test 7: CORS Headers
echo "7. Testing CORS Configuration..."
cors_response=$(curl -s -I "$BASE_URL/api/health" | grep -i "access-control")
if [ -n "$cors_response" ]; then
    echo "✓ CORS headers present"
    echo "  $cors_response"
else
    echo "? CORS headers check (may be handled by Cloudflare)"
fi
echo

# Test 8: Static Assets
echo "8. Testing Static Assets..."
asset_response=$(curl -s -I "$BASE_URL/assets/index-CzjmB55G.js")
if echo "$asset_response" | grep -q "200"; then
    echo "✓ Static assets accessible"
else
    echo "✗ Static assets not accessible"
fi
echo

echo "=== Application Test Complete ==="