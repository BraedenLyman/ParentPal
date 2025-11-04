set -e

echo "🔒 Starting OWASP ZAP Full Scan for ParentPal..."

TARGET_URL="${TARGET_URL:-http://localhost:5174}"
API_URL="${API_URL:-http://localhost:3001}"
ZAP_PORT="${ZAP_PORT:-8080}"
REPORT_DIR="./zap-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZAP_API_KEY="${ZAP_API_KEY:-changeme123!}"

mkdir -p "$REPORT_DIR"

wait_for_service() {
    local url=$1
    local max_attempts=30
    local attempt=1

    echo "⏳ Waiting for $url to be ready..."

    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|302\|401"; then
            echo "✅ Service at $url is ready!"
            return 0
        fi
        echo "Attempt $attempt/$max_attempts: Service not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done

    echo "❌ Service at $url failed to become ready"
    return 1
}

echo "🚀 Starting application services..."
if ! docker ps | grep -q "parentpal-frontend-scan"; then
    echo "Starting Docker containers..."
    docker-compose -f docker-compose.zap.yml up -d

    wait_for_service "$TARGET_URL"
    echo "⏳ Waiting for backend to initialize..."
    sleep 10
fi

echo "⏳ Waiting for ZAP to start..."
wait_for_service "http://localhost:$ZAP_PORT"

echo "🔍 Running ZAP Full Scan (this may take a while)..."

docker run --rm \
    --network host \
    -v "$(pwd)/zap-reports:/zap/wrk/:rw" \
    ghcr.io/zaproxy/zaproxy:stable \
    zap-full-scan.py \
    -t "$TARGET_URL" \
    -g gen.conf \
    -r "/zap/wrk/full-report-$TIMESTAMP.html" \
    -J "/zap/wrk/full-report-$TIMESTAMP.json" \
    -w "/zap/wrk/full-report-$TIMESTAMP.md" \
    -a \
    -j \
    -l PASS \
    -m 10 \
    -z "-config api.key=$ZAP_API_KEY"

echo "✅ Full scan completed!"
echo "📊 Reports saved to: $REPORT_DIR/full-report-$TIMESTAMP.*"

SCAN_RESULT=$?

if [ $SCAN_RESULT -eq 0 ]; then
    echo "✅ No high-risk vulnerabilities found!"
    exit 0
elif [ $SCAN_RESULT -eq 1 ]; then
    echo "⚠️  Warnings found - review the report"
    exit 0
elif [ $SCAN_RESULT -eq 2 ]; then
    echo "❌ High-risk vulnerabilities detected!"
    exit 1
else
    echo "❌ Scan failed with error"
    exit 1
fi
