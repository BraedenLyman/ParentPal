# OWASP ZAP Security Scanning Configuration

This directory contains configuration files for automated security testing using OWASP ZAP (Zed Attack Proxy).

## Files

### `rules.tsv`
Defines custom scanning rules and thresholds for security vulnerabilities:
- **FAIL**: Critical issues that should fail the build
- **WARN**: Important issues that generate warnings
- **INFO**: Informational findings
- **IGNORE**: Known false positives or non-applicable checks

### `api-spec.yaml`
OpenAPI 3.0 specification that helps ZAP understand your API endpoints and how to test them properly.

## What Gets Scanned?

The security scan checks for:

### High Priority Issues (FAIL)
- ✅ SQL Injection vulnerabilities
- ✅ Cross-Site Scripting (XSS) - Reflected and Persistent
- ✅ Path Traversal attacks
- ✅ Remote Code Execution
- ✅ OS Command Injection
- ✅ Weak Authentication

### Medium Priority Issues (WARN)
- ⚠️ CSRF Token absence
- ⚠️ Content Security Policy issues
- ⚠️ CORS misconfigurations
- ⚠️ Information disclosure via headers

### Low Priority Issues (INFO)
- ℹ️ Cache control directives
- ℹ️ Cookie security attributes
- ℹ️ Suspicious comments in responses

## How It Works

1. **Tests Run First**: Backend and frontend tests complete successfully
2. **Server Starts**: A test database and backend server are spun up
3. **Baseline Scan**: ZAP performs a passive scan of all endpoints
4. **API Scan**: ZAP actively tests API endpoints based on OpenAPI spec
5. **Results Generated**: HTML, JSON, and Markdown reports are created
6. **PR Comment**: Security findings are automatically posted to pull requests

## Viewing Results

### In GitHub Actions
1. Go to the **Actions** tab in your repository
2. Click on the latest workflow run
3. Find the **security-scan** job
4. Download the **zap-scan-results** artifact for detailed reports

### On Pull Requests
Security scan results are automatically posted as comments on PRs with:
- Summary of findings
- Severity levels
- Recommendations for fixes

## Customizing Scans

### Adding New Endpoints
Edit `api-spec.yaml` to include new API endpoints:

```yaml
paths:
  /api/your-endpoint:
    post:
      summary: Description
      requestBody:
        # Define request structure
      responses:
        '200':
          description: Success
```

### Adjusting Rules
Edit `rules.tsv` to change how specific vulnerabilities are handled:

```tsv
# Format: ID	THRESHOLD	[ALERT_THRESHOLD]
40018	FAIL	# SQL Injection - Critical, fail build
10202	WARN	# CSRF - Important, warn only
10096	IGNORE	# Timestamp - Not a security issue
```

### Common Rule IDs
- `40018` - SQL Injection
- `40012` - XSS (Reflected)
- `40014` - XSS (Persistent)
- `6` - Path Traversal
- `90019` - Code Injection
- `90020` - Remote OS Command Injection
- `10105` - Weak Authentication
- `10202` - Missing CSRF Tokens

## Security Best Practices

The scan helps enforce:

1. **Input Validation**: All user inputs are properly validated
2. **SQL Injection Prevention**: Parameterized queries are used
3. **XSS Protection**: Output encoding and CSP headers
4. **Authentication**: Secure auth mechanisms
5. **Authorization**: Proper access controls
6. **HTTPS**: Secure transport layer
7. **Headers**: Security headers (Helmet.js)
8. **CORS**: Properly configured origins

## Manual Security Testing

To run ZAP manually:

```bash
# Install ZAP
# Download from https://www.zaproxy.org/download/

# Start your backend server
cd backend && npm start

# Run baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -r zap-report.html

# Run API scan
docker run -t owasp/zap2docker-stable zap-api-scan.py \
  -t .zap/api-spec.yaml \
  -f openapi \
  -r zap-api-report.html
```

## Troubleshooting

### Scan Failing?
- Check if the backend server started successfully
- Verify the database connection
- Review the ZAP logs in GitHub Actions
- Ensure all endpoints are accessible

### Too Many Warnings?
- Review and update `rules.tsv` for known false positives
- Add comments explaining why certain issues are ignored
- Keep a record of security decisions

### Need Help?
- OWASP ZAP Documentation: https://www.zaproxy.org/docs/
- Report issues: https://github.com/zaproxy/zaproxy/issues

## Continuous Improvement

Security scanning should evolve with your application:

1. **Regular Updates**: Keep ZAP rules updated
2. **Review Findings**: Investigate all warnings and failures
3. **Fix Vulnerabilities**: Address issues before they reach production
4. **Update Specs**: Keep `api-spec.yaml` in sync with API changes
5. **Learn**: Use findings to improve secure coding practices
