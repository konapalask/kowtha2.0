# Puppeteer Permission Error Fix

## Issue
When generating PDF previews for PD verification reports, the following error was occurring:

```
EACCES: permission denied, mkdtemp '/var/folders/zz/zyxvpxvq6csfxvn_n0000000000000/T/puppeteer_dev_chrome_profile-XXXXXX'
```

**Endpoint affected**: `GET /loans/:id/preview-final-report?type=Business&department=PD`

## Root Cause
Puppeteer (used for PDF generation) was trying to create a temporary Chrome profile directory in the system's temp folder, but didn't have the necessary permissions. This is a common issue on macOS and Linux systems where:

1. The default temp directory has restricted permissions
2. Puppeteer tries to create random temporary directories with `mkdtemp`
3. The process doesn't have write permissions to create these directories

## Solution
The fix involves:

1. **Using a project-local temporary directory** instead of system temp (which has permission restrictions)
2. **Using `userDataDir` option** in Puppeteer to specify where Chrome should store its profile
3. **Adding additional Chrome flags** to improve stability and avoid permission issues

### Changes Made

#### 1. Updated `PDFBufferGeneration` method (`loan.service.ts`)
```typescript
async PDFBufferGeneration(htmlTemplate: string): Promise<Buffer> {
  // Use project-local temp directory to avoid system permission issues
  // This directory will be in the project root: /kowtha/.temp/puppeteer
  const tempDir = path.resolve(process.cwd(), '.temp', 'puppeteer');
  
  // Ensure the directory exists and has proper permissions
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true, mode: 0o755 });
  }

  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: tempDir,  // ← Project-local temp directory
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",  // ← New: Prevents /dev/shm issues
      "--disable-gpu",             // ← New: Disables GPU for headless
      "--lang=en-IN",
      "--intl.accept_languages=en-IN",
    ],
  });

  // ... rest of the method
}
```

#### 2. Added `.temp/` to `.gitignore`
```gitignore
# Temp directories
.temp/
```

### Key Improvements

1. **Project-Local Temp Directory**: 
   - Uses `process.cwd()` to create a `.temp/puppeteer` directory in the project root
   - Avoids macOS system-protected directories like `/var/folders/zz/...`
   - Always has proper write permissions within the project
   - Sets permissions to `0o755` (rwxr-xr-x) ensuring read/write access

2. **UserDataDir Option**:
   - Tells Puppeteer exactly where to store Chrome's user data
   - Avoids random directory creation attempts in restricted system folders
   - Reuses the same directory across multiple PDF generations

3. **Additional Chrome Flags**:
   - `--disable-dev-shm-usage`: Prevents issues with shared memory in Docker/containers
   - `--disable-gpu`: Disables GPU acceleration (not needed for headless PDF generation)

4. **Git Ignore**:
   - Added `.temp/` to `.gitignore` to prevent committing Puppeteer cache files

## Verification

### Test the Fix
```bash
# Test the PDF preview endpoint
curl -X GET \
  'http://localhost:3000/loans/912/preview-final-report?type=Business&department=PD' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  --output preview.pdf
```

### Expected Result
- PDF should generate successfully without permission errors
- No more `EACCES: permission denied` errors
- Temp directory created at: `/Users/bys/Desktop/kowtha/.temp/puppeteer`
- Directory will be ignored by git (added to `.gitignore`)

## Environment-Specific Notes

### macOS
- **Previous Issue**: System temp directory `/var/folders/zz/...` had restricted permissions
- **Current Solution**: Uses project-local `.temp/puppeteer` directory
- Permissions: Works automatically as it's within the project directory

### Linux
- Uses project-local `.temp/puppeteer` directory
- Should work automatically with proper project permissions
- Docker: Already includes `--no-sandbox` flag for containerized environments

### Windows
- Uses project-local `.temp\puppeteer` directory
- Should work automatically with the fix

## Cleanup

The `.temp/puppeteer` directory will persist across restarts. To clean it up:

```bash
# macOS/Linux
rm -rf .temp/

# Windows (PowerShell)
Remove-Item -Recurse -Force .temp

# Or programmatically add cleanup on server shutdown (optional)
```

**Note**: The directory is small (typically < 100MB) and reusing it improves performance by avoiding re-initialization of Chrome profiles.

## Alternative Solutions (Not Implemented)

If the current fix doesn't work in some environments, consider:

1. **Use `TMPDIR` environment variable**:
   ```typescript
   const tempDir = process.env.TMPDIR || os.tmpdir();
   ```

2. **Create unique temp dirs per request** (slower but cleaner):
   ```typescript
   const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puppeteer-'));
   // ... use it ...
   fs.rmSync(tempDir, { recursive: true }); // cleanup
   ```

3. **Use different PDF library** (major change):
   - Consider `pdfkit` or `html-pdf-node` if Puppeteer continues to cause issues

## Related Issues
- Affects all PDF generation endpoints using `PDFBufferGeneration` method
- This includes:
  - PD verification report previews
  - Final report generation
  - Any other PDF exports using Puppeteer

## Testing Checklist
- [x] Fixed permission error for PD preview
- [ ] Test on production environment
- [ ] Test on Docker containers
- [ ] Verify no memory leaks from persistent temp directory
- [ ] Monitor disk space usage of temp directory

