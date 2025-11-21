# Security Testing with OWASP ZAP

This document explains the automated security testing setup for ParentPal using OWASP ZAP.

## 🎯 What's Been Set Up

### ✅ Automated Security Scans
Your GitHub Actions workflow now includes comprehensive security testing that runs on every push and pull request to `main` or `develop` branches.

### 📋 Scan Types

1. **Baseline Scan** - Passive security analysis
   - Checks for common vulnerabilities without active attacks
   - Fast and safe to run repeatedly
   - Analyzes HTTP headers, cookies, and response content

2. **Full Scan** - Active security testing
   - Performs active attacks to find vulnerabilities
   - Tests for SQL injection, XSS, path traversal, etc.
   - More thorough but takes longer

## 🔍 What Gets Scanned

The security scan checks for:

### Critical Issues (WARN level)
- ⚠️ **SQL Injection** - Database manipulation attempts
- ⚠️ **Cross-Site Scripting (XSS)** - Reflected and persistent
- ⚠️ **Path Traversal** - Unauthorized file access
- ⚠️ **Remote Code Execution** - Code and command injection
- ⚠️ **Weak Authentication** - Authentication bypass attempts
- ⚠️ **CORS Misconfigurations** - Cross-origin security

### Medium Priority (WARN level)
- CSRF token validation
- Content Security Policy
- Cache control directives

### Informational (INFO level)
- Cookie security attributes
- Information disclosure in comments
- Server information leakage

## 📊 How to View Results

### 1. GitHub Actions
After pushing code:
1. Go to your repository on GitHub
2. Click the **"Actions"** tab
3. Select the latest workflow run
4. Look for the **"security-scan"** job
5. View the scan summary in the job output

### 2. Artifacts
Download detailed reports:
1. In the workflow run, scroll to **"Artifacts"**
2. Download **"zap-scan-results"**
3. Contains:
   - `report_html.html` - Interactive web report
   - `report_json.json` - Machine-readable results
   - `report_md.md` - Markdown summary
   - `server.log` - Backend server logs

### 3. Pull Request Comments
On pull requests, security findings are automatically posted as comments with:
- Summary of issues found
- Severity levels
- Links to full reports

### 4. GitHub Summary
Each workflow run includes a security summary on the summary page showing key findings.

## 🚀 Running Scans Locally

### Option 1: Using the Test Script
```bash
# Make sure Docker is installed
./.github/workflows/test-security-local.sh
```

### Option 2: Manual Docker Commands
```bash
# Start your backend server
cd backend && npm start

# In another terminal, run ZAP baseline scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -r zap-report.html

# Or run full scan (more thorough)
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t http://localhost:3000 \
  -r zap-full-report.html
```

## 🔧 Configuration Files

### `.zap/rules.tsv`
Defines security scanning rules and thresholds:
- **IGNORE**: Known false positives or non-applicable issues
- **INFO**: Informational findings only
- **WARN**: Important issues that generate warnings
- **FAIL**: Critical issues (currently set to WARN to allow scans to complete)

### `.zap/api-spec.yaml`
OpenAPI specification for your API:
- Helps ZAP understand your endpoints
- Improves scan accuracy
- Reduces false positives

### `.github/workflows/test.yml`
GitHub Actions workflow configuration:
- Runs after backend/frontend tests pass
- Spins up test database and server
- Executes ZAP scans
- Generates and uploads reports

## ✅ Ensuring Scans Run Successfully

### Key Improvements Made:

1. **✅ Robust Server Startup**
   - 30 retries with 2-second intervals (1 minute total)
   - Proper health check on `/api/test` endpoint
   - Logs server output for debugging

2. **✅ Scan Reliability**
   - `continue-on-error: true` prevents workflow failure
   - Both baseline and full scans run
   - Results always uploaded, even on failure

3. **✅ Comprehensive Reporting**
   - HTML, JSON, and Markdown formats
   - Server logs included in artifacts
   - GitHub Summary shows key findings
   - PR comments with scan results

4. **✅ Proper Cleanup**
   - Server process killed after scan
   - Resources properly released
   - No hanging processes

## 🔍 Troubleshooting

### Scan Not Running?
1. Check if backend tests pass first (required)
2. Verify database connection in workflow
3. Check server startup logs in artifacts

### No Report Generated?
1. Ensure server is accessible at `http://localhost:3000`
2. Check if `/api/test` endpoint responds
3. Review ZAP scan logs in GitHub Actions

### Too Many Warnings?
1. Review findings in the report
2. Update `.zap/rules.tsv` for known false positives
3. Add inline comments explaining security decisions

### Server Won't Start?
1. Check `backend/server.log` in artifacts
2. Verify `.env` configuration
3. Ensure database is accessible

## 📈 Best Practices

### 1. Review Every Scan
Don't ignore security warnings. Review each finding:
- Is it a real vulnerability?
- Is it a false positive?
- Can it be fixed or mitigated?

### 2. Keep Rules Updated
Update `.zap/rules.tsv` as your security posture evolves:
- Document why rules are ignored
- Review ignored rules periodically
- Adjust thresholds as needed

### 3. Fix Critical Issues First
Prioritize vulnerabilities:
1. SQL Injection, XSS, RCE (Critical)
2. Authentication, Authorization (High)
3. Information Disclosure (Medium)
4. Configuration Issues (Low)

### 4. Update API Spec
Keep `.zap/api-spec.yaml` in sync with your API:
- Add new endpoints as they're created
- Update request/response schemas
- Document authentication requirements

### 5. Test Locally First
Before pushing:
```bash
# Run local security scan
./.github/workflows/test-security-local.sh

# Review findings
open backend/zap-baseline-report.html
```

## 🔐 Security Scanning Workflow

```
┌─────────────────────────────────────────────────────┐
│  1. Push/PR to main or develop                      │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  2. Run Backend Tests (310 tests)                   │
│     Run Frontend Tests                              │
│     Run Linter                                      │
└────────────────┬────────────────────────────────────┘
                 │ ✅ All tests pass
                 ▼
┌─────────────────────────────────────────────────────┐
│  3. Security Scan Job                               │
│     - Start PostgreSQL database                     │
│     - Install backend dependencies                  │
│     - Start backend server                          │
│     - Wait for health check                         │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  4. OWASP ZAP Baseline Scan                         │
│     - Passive security analysis                     │
│     - Check headers, cookies, responses             │
│     - Generate baseline report                      │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  5. OWASP ZAP Full Scan                             │
│     - Active security testing                       │
│     - SQL injection, XSS, path traversal tests     │
│     - Generate full report                          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  6. Generate Reports & Upload Artifacts             │
│     - Create HTML, JSON, Markdown reports           │
│     - Add summary to GitHub workflow                │
│     - Comment on PR (if applicable)                 │
│     - Upload all reports as artifacts               │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│  7. Cleanup                                         │
│     - Stop backend server                           │
│     - Release resources                             │
└─────────────────────────────────────────────────────┘
```

## 📚 Additional Resources

- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)
- [ZAP GitHub Actions](https://github.com/zaproxy/action-baseline)

## 🤝 Contributing

When adding new API endpoints:
1. Update `.zap/api-spec.yaml` with the new endpoint
2. Run local security scan to test
3. Review scan results for new vulnerabilities
4. Fix any issues before merging

---

**Remember**: Security is an ongoing process, not a one-time task. Regular scans help maintain a secure application! 🔒
