#!/bin/bash
# Local OWASP ZAP Security Test Script
# This script helps you test the security scan locally before pushing to GitHub

set -e

echo "🔒 ParentPal Security Scan - Local Test"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker to run ZAP scans locally."
    exit 1
fi

echo "✅ Docker found"

# Start the backend server
echo ""
echo "📦 Starting backend server..."
cd backend

if [ ! -f .env ]; then
    echo "⚠️  Creating test .env file..."
    cat > .env << EOF
PORT=3000
NODE_ENV=test
EOF
fi

npm start > /dev/null 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to start
echo "⏳ Waiting for server to start..."
for i in {1..30}; do
    if curl -f http://localhost:3000/api/test 2>/dev/null; then
        echo "✅ Server is ready!"
        break
    fi
    sleep 2
done

# Run baseline scan
echo ""
echo "🔍 Running OWASP ZAP Baseline Scan..."
echo "This may take a few minutes..."

docker run --rm \
    --network="host" \
    -v "$(pwd)/..:/zap/wrk:rw" \
    owasp/zap2docker-stable \
    zap-baseline.py \
    -t http://localhost:3000 \
    -c ../.zap/rules.tsv \
    -r zap-baseline-report.html \
    -J zap-baseline-report.json \
    -w zap-baseline-report.md \
    -a || true

echo ""
echo "📊 Scan complete!"

# Display summary
if [ -f zap-baseline-report.md ]; then
    echo ""
    echo "=== ZAP Scan Summary ==="
    head -50 zap-baseline-report.md
    echo ""
    echo "Full reports generated:"
    echo "  - HTML: backend/zap-baseline-report.html"
    echo "  - JSON: backend/zap-baseline-report.json"
    echo "  - Markdown: backend/zap-baseline-report.md"
fi

# Cleanup
echo ""
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null || true

echo ""
echo "✅ Security scan test completed!"
echo "Review the reports above to ensure the scan runs successfully."
