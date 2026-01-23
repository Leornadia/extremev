#!/bin/bash

# Deployment Verification Script
# Runs health checks and smoke tests after deployment

set -e

DEPLOYMENT_URL=${1:-"https://www.extremev.co.za"}

echo "🔍 Verifying deployment at: $DEPLOYMENT_URL"

# Function to check HTTP status
check_endpoint() {
  local endpoint=$1
  local expected_status=${2:-200}
  
  echo "Checking $endpoint..."
  status=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL$endpoint")
  
  if [ "$status" -eq "$expected_status" ]; then
    echo "✅ $endpoint returned $status"
    return 0
  else
    echo "❌ $endpoint returned $status (expected $expected_status)"
    return 1
  fi
}

# Check critical endpoints
echo ""
echo "📋 Running endpoint checks..."
echo "================================"

check_endpoint "/" 200
check_endpoint "/products" 200
check_endpoint "/configurator" 200
check_endpoint "/contact" 200
check_endpoint "/gallery" 200
check_endpoint "/about" 200
check_endpoint "/api/products" 200
check_endpoint "/api/components" 200

# Check API health endpoint (if exists)
if check_endpoint "/api/health" 200 2>/dev/null; then
  echo "✅ Health check endpoint is responding"
fi

# Check for common issues
echo ""
echo "🔍 Checking for common issues..."
echo "================================"

# Check if JavaScript bundles are loading
echo "Checking JavaScript bundles..."
if curl -s "$DEPLOYMENT_URL" | grep -q "_next/static"; then
  echo "✅ JavaScript bundles are present"
else
  echo "⚠️  Warning: JavaScript bundles may not be loading correctly"
fi

# Check if images are optimized
echo "Checking image optimization..."
if curl -s "$DEPLOYMENT_URL" | grep -q "/_next/image"; then
  echo "✅ Image optimization is active"
else
  echo "⚠️  Warning: Image optimization may not be configured"
fi

# Performance check
echo ""
echo "⚡ Running performance check..."
echo "================================"

response_time=$(curl -o /dev/null -s -w '%{time_total}\n' "$DEPLOYMENT_URL")
response_time_ms=$(echo "$response_time * 1000" | bc)

echo "Response time: ${response_time_ms}ms"

if (( $(echo "$response_time < 3" | bc -l) )); then
  echo "✅ Response time is good (< 3s)"
else
  echo "⚠️  Warning: Response time is slow (> 3s)"
fi

# SSL/TLS check
echo ""
echo "🔒 Checking SSL/TLS..."
echo "================================"

if curl -s "$DEPLOYMENT_URL" | grep -q "https"; then
  echo "✅ HTTPS is configured"
else
  echo "⚠️  Warning: HTTPS may not be properly configured"
fi

# Final summary
echo ""
echo "================================"
echo "✅ Deployment verification complete!"
echo "================================"
echo ""
echo "Deployment URL: $DEPLOYMENT_URL"
echo "Timestamp: $(date)"
