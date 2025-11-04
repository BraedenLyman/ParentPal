param(
    [string]$FirebaseApiKey = "AIzaSyCTXx4ygbONWRCB4COjEqUtD2hIAnopuic",
    [string]$ParentEmail = "parent@gmail.com",
    [string]$ParentPassword = "Parent123!",
    [string]$BabysitterEmail = "braedenlyman7@gmail.com",
    [string]$BabysitterPassword = "Braebro1!",
    [string]$FrontendUrl = "http://parentpal-frontend-scan:5173",
    [string]$BackendUrl = "http://parentpal-backend-scan:3000",
    [string]$ScanType = "full",
    [switch]$UseAutomationPlan
)

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$reportDir = "zap-reports"
$reportName = "authenticated-$ScanType-$timestamp"

Write-Host "`nParentPal Authenticated Security Scan" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

if (-not $FirebaseApiKey) {
    Write-Host "ERROR: Firebase API Key is required for authenticated scanning." -ForegroundColor Red
    Write-Host "Please set the FIREBASE_API_KEY environment variable or pass it as a parameter." -ForegroundColor Yellow
    Write-Host "`nExample:" -ForegroundColor Yellow
    Write-Host "  `$env:FIREBASE_API_KEY = 'your-api-key-here'" -ForegroundColor White
    Write-Host "  .\scripts\zap-authenticated-scan.ps1`n" -ForegroundColor White
    exit 1
}

Write-Host "Creating reports directory..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $reportDir | Out-Null

$absoluteReportPath = (Resolve-Path $reportDir).Path
$dockerPath = $absoluteReportPath -replace '\\', '/'
$driveLetter = $dockerPath.Substring(0, 1).ToLower()
$dockerPath = "/$driveLetter" + $dockerPath.Substring(2)

$zapConfigPath = (Resolve-Path ".zap").Path
$zapDockerPath = $zapConfigPath -replace '\\', '/'
$zapDriveLetter = $zapDockerPath.Substring(0, 1).ToLower()
$zapDockerPath = "/$zapDriveLetter" + $zapDockerPath.Substring(2)

Write-Host "Starting application services..." -ForegroundColor Cyan
docker-compose -f docker-compose.zap.yml up -d 2>&1 | Out-Null

Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`nAuthenticated Scan Configuration:" -ForegroundColor Cyan
Write-Host "  Frontend URL: $FrontendUrl" -ForegroundColor White
Write-Host "  Backend URL: $BackendUrl" -ForegroundColor White
Write-Host "  Parent Email: $ParentEmail" -ForegroundColor White
Write-Host "  Babysitter Email: $BabysitterEmail" -ForegroundColor White
Write-Host "  Scan Type: $ScanType" -ForegroundColor White
Write-Host ""

if ($UseAutomationPlan) {
    Write-Host "Running ZAP Automation Framework scan..." -ForegroundColor Green
    Write-Host "This will take 10-20 minutes for comprehensive testing..." -ForegroundColor Yellow
    Write-Host ""

    docker run --rm `
        --network parentpal_zap-network `
        -v "${dockerPath}:/zap/wrk/:rw" `
        -v "${zapDockerPath}:/zap/config/:ro" `
        ghcr.io/zaproxy/zaproxy:stable `
        zap.sh `
        -cmd `
        -autorun /zap/config/authenticated-scan-plan.yaml `
        -config api.addrs.addr.name=.* `
        -config api.addrs.addr.regex=true `
        -config api.key=changeme123!

    $exitCode = $LASTEXITCODE
} else {
    Write-Host "Running manual authenticated scan..." -ForegroundColor Green
    Write-Host "This approach uses the standard scan with manual token injection..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "IMPORTANT: For full authenticated scanning, you need to:" -ForegroundColor Yellow
    Write-Host "  1. Get Firebase ID token for test users" -ForegroundColor White
    Write-Host "  2. Configure ZAP to include Authorization headers" -ForegroundColor White
    Write-Host "  3. Use the automation framework (add -UseAutomationPlan flag)" -ForegroundColor White
    Write-Host ""

    $scanScript = if ($ScanType -eq "full") { "zap-full-scan.py" } else { "zap-baseline-scan.py" }

    docker run --rm `
        --network parentpal_zap-network `
        -v "${dockerPath}:/zap/wrk/:rw" `
        ghcr.io/zaproxy/zaproxy:stable `
        $scanScript `
        -t $FrontendUrl `
        -r "$reportName.html" `
        -J "$reportName.json" `
        -w "$reportName.md" `
        -I

    $exitCode = $LASTEXITCODE
}

Write-Host ""
if ($exitCode -eq 0 -or $exitCode -eq 1 -or $exitCode -eq 2) {
    Write-Host "Scan completed!" -ForegroundColor Green
    Write-Host "Reports saved to: .\$reportDir\$reportName.*" -ForegroundColor Cyan

    Write-Host "`nGenerated files:" -ForegroundColor Cyan
    Get-ChildItem $reportDir -Filter "$reportName.*" | ForEach-Object {
        Write-Host "  - $($_.Name) ($([math]::Round($_.Length/1KB, 2)) KB)" -ForegroundColor White
    }

    $htmlReport = Join-Path $reportDir "$reportName.html"
    if (Test-Path $htmlReport) {
        Write-Host "`nOpening HTML report..." -ForegroundColor Green
        Start-Process $htmlReport
    }

    Write-Host ""
    if ($exitCode -eq 2) {
        Write-Host "RESULT: High-risk vulnerabilities detected!" -ForegroundColor Red
        Write-Host "Review the report for details and remediation steps." -ForegroundColor Yellow
    } elseif ($exitCode -eq 1) {
        Write-Host "RESULT: Low or medium-risk vulnerabilities detected." -ForegroundColor Yellow
    } else {
        Write-Host "RESULT: No significant vulnerabilities detected." -ForegroundColor Green
    }
} else {
    Write-Host "ERROR: Scan failed with exit code $exitCode" -ForegroundColor Red
    exit $exitCode
}

Write-Host ""
Write-Host "Note: For true authenticated scanning with Firebase:" -ForegroundColor Cyan
Write-Host "  1. Set FIREBASE_API_KEY environment variable" -ForegroundColor White
Write-Host "  2. Ensure test accounts exist in Firebase" -ForegroundColor White
Write-Host "  3. Use -UseAutomationPlan flag for advanced features" -ForegroundColor White
Write-Host ""
