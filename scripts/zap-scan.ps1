param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("baseline", "full", "api")]
    [string]$ScanType = "baseline",

    [Parameter(Mandatory=$false)]
    [string]$TargetUrl = "http://localhost:5174",

    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:3001",

    [Parameter(Mandatory=$false)]
    [switch]$SkipStartServices
)

Write-Host "Starting OWASP ZAP $ScanType Scan for ParentPal..." -ForegroundColor Cyan

$ReportDir = ".\zap-reports"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$ZapApiKey = "changeme123!"
$ZapPort = 8080

New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null

function Wait-ForService {
    param(
        [string]$Url,
        [int]$MaxAttempts = 30
    )

    Write-Host "Waiting for $Url to be ready..." -ForegroundColor Yellow

    for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -in @(200, 302, 401)) {
                Write-Host "Service at $Url is ready!" -ForegroundColor Green
                return $true
            }
        }
        catch {
            Write-Host "Attempt $attempt/$MaxAttempts : Service not ready yet..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }

    Write-Host "Service at $Url failed to become ready" -ForegroundColor Red
    return $false
}

if (-not $SkipStartServices) {
    Write-Host "Starting application services..." -ForegroundColor Cyan

    $dockerRunning = docker ps 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }

    Write-Host "Starting Docker containers..." -ForegroundColor Yellow
    docker-compose -f docker-compose.zap.yml up -d

    Wait-ForService -Url $TargetUrl

    Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    Write-Host "Waiting for ZAP to start..." -ForegroundColor Yellow
    Wait-ForService -Url "http://localhost:$ZapPort"
}

Write-Host "Running ZAP $ScanType Scan..." -ForegroundColor Cyan

switch ($ScanType) {
    "baseline" {
        $reportPrefix = "baseline-report-$Timestamp"
        $absolutePath = (Resolve-Path $ReportDir).Path
        $dockerPath = $absolutePath -replace '\\', '/'
        $driveLetter = $dockerPath.Substring(0, 1).ToLower()
        $dockerPath = "/$driveLetter" + $dockerPath.Substring(2)
        $volumeMount = "${dockerPath}:/zap/wrk/:rw"

        docker run --rm `
            --network parentpal_zap-network `
            -v $volumeMount `
            ghcr.io/zaproxy/zaproxy:stable `
            zap-baseline.py `
            -t $TargetUrl `
            -g gen.conf `
            -r "/zap/wrk/$reportPrefix.html" `
            -J "/zap/wrk/$reportPrefix.json" `
            -w "/zap/wrk/$reportPrefix.md" `
            -a `
            -j `
            -l PASS `
            -m 5 `
            -z "-config api.key=$ZapApiKey"
    }
    "full" {
        $reportPrefix = "full-report-$Timestamp"
        $absolutePath = (Resolve-Path $ReportDir).Path
        $dockerPath = $absolutePath -replace '\\', '/'
        $driveLetter = $dockerPath.Substring(0, 1).ToLower()
        $dockerPath = "/$driveLetter" + $dockerPath.Substring(2)
        $volumeMount = "${dockerPath}:/zap/wrk/:rw"

        docker run --rm `
            --network parentpal_zap-network `
            -v $volumeMount `
            ghcr.io/zaproxy/zaproxy:stable `
            zap-full-scan.py `
            -t $TargetUrl `
            -g gen.conf `
            -r "/zap/wrk/$reportPrefix.html" `
            -J "/zap/wrk/$reportPrefix.json" `
            -w "/zap/wrk/$reportPrefix.md" `
            -a `
            -j `
            -l PASS `
            -m 10 `
            -z "-config api.key=$ZapApiKey"
    }
    "api" {
        $reportPrefix = "api-report-$Timestamp"
        $absolutePath = (Resolve-Path $ReportDir).Path
        $dockerPath = $absolutePath -replace '\\', '/'
        $driveLetter = $dockerPath.Substring(0, 1).ToLower()
        $dockerPath = "/$driveLetter" + $dockerPath.Substring(2)
        $volumeMount = "${dockerPath}:/zap/wrk/:rw"

        docker run --rm `
            --network parentpal_zap-network `
            -v $volumeMount `
            ghcr.io/zaproxy/zaproxy:stable `
            zap-api-scan.py `
            -t "$ApiUrl/api" `
            -r "/zap/wrk/$reportPrefix.html" `
            -J "/zap/wrk/$reportPrefix.json" `
            -w "/zap/wrk/$reportPrefix.md" `
            -z "-config api.key=$ZapApiKey"
    }
}

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "Scan completed!" -ForegroundColor Cyan
Write-Host "Reports saved to: $ReportDir\$reportPrefix.*" -ForegroundColor Cyan

if ($exitCode -eq 0) {
    Write-Host "SUCCESS: No high-risk vulnerabilities found!" -ForegroundColor Green
    exit 0
}
elseif ($exitCode -eq 1) {
    Write-Host "WARNING: Warnings found - review the report" -ForegroundColor Yellow
    exit 0
}
else {
    Write-Host "FAIL: High-risk vulnerabilities detected!" -ForegroundColor Red
    exit 1
}
