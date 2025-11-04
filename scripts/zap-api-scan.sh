set -e

echo "🔒 Starting OWASP ZAP API Scan for ParentPal Backend..."

API_URL="${API_URL:-http://localhost:3001}"
ZAP_PORT="${ZAP_PORT:-8080}"
REPORT_DIR="./zap-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ZAP_API_KEY="${ZAP_API_KEY:-changeme123!}"
OPENAPI_SPEC="${OPENAPI_SPEC:-./backend/openapi.yaml}"

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

echo "🚀 Starting backend services..."
if ! docker ps | grep -q "parentpal-backend-scan"; then
    echo "Starting Docker containers..."
    docker-compose -f docker-compose.zap.yml up -d backend db

    echo "⏳ Waiting for backend to initialize..."
    sleep 10
fi

echo "⏳ Waiting for ZAP to start..."
if ! docker ps | grep -q "parentpal-zap"; then
    docker-compose -f docker-compose.zap.yml up -d zap
fi
wait_for_service "http://localhost:$ZAP_PORT"

echo "🔍 Running ZAP API Scan..."

if [ -f "$OPENAPI_SPEC" ]; then
    echo "📝 Using OpenAPI specification: $OPENAPI_SPEC"
    docker run --rm \
        --network host \
        -v "$(pwd)/zap-reports:/zap/wrk/:rw" \
        -v "$(pwd)/$OPENAPI_SPEC:/zap/api-spec.yaml:ro" \
        ghcr.io/zaproxy/zaproxy:stable \
        zap-api-scan.py \
        -t /zap/api-spec.yaml \
        -f openapi \
        -r "/zap/wrk/api-report-$TIMESTAMP.html" \
        -J "/zap/wrk/api-report-$TIMESTAMP.json" \
        -w "/zap/wrk/api-report-$TIMESTAMP.md" \
        -z "-config api.key=$ZAP_API_KEY"
else
    echo "⚠️  No OpenAPI spec found, running generic API scan"
    docker run --rm \
        --network host \
        -v "$(pwd)/zap-reports:/zap/wrk/:rw" \
        ghcr.io/zaproxy/zaproxy:stable \
        zap-api-scan.py \
        -t "$API_URL/api" \
        -r "/zap/wrk/api-report-$TIMESTAMP.html" \
        -J "/zap/wrk/api-report-$TIMESTAMP.json" \
        -w "/zap/wrk/api-report-$TIMESTAMP.md" \
        -z "-config api.key=$ZAP_API_KEY"
fi

echo "✅ API scan completed!"
echo "📊 Reports saved to: $REPORT_DIR/api-report-$TIMESTAMP.*"

SCAN_RESULT=$?

if [ $SCAN_RESULT -eq 0 ]; then
    echo "✅ No high-risk API vulnerabilities found!"
    exit 0
elif [ $SCAN_RESULT -eq 1 ]; then
    echo "⚠️  API warnings found - review the report"
    exit 0
elif [ $SCAN_RESULT -eq 2 ]; then
    echo "❌ High-risk API vulnerabilities detected!"
    exit 1
else
    echo "❌ API scan failed with error"
    exit 1
fi
