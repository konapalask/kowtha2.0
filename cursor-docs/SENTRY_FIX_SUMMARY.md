# 🔧 Sentry Configuration Fix

## 🐛 Problem

The web application was failing to start with the error:

```
error - Failed to load next.config.js
Module not found: Can't resolve '@sentry/nextjs'
```

## 🔍 Root Cause

The `@sentry/nextjs` package was listed in `package.json` but not properly available in `node_modules`. The configuration files were trying to import Sentry without error handling, causing the entire app to fail.

**Files affected:**

1. `apps/web/next.config.js` - Required Sentry without try-catch
2. `apps/web/src/pages/_error.tsx` - Direct import of Sentry

## ✅ Solutions Applied

### 1. Fixed `next.config.js`

**Before:**

```javascript
const { withSentryConfig } = require("@sentry/nextjs");
module.exports = withSentryConfig(nextConfig, { ... });
```

**After:**

```javascript
let config = nextConfig;

try {
  const { withSentryConfig } = require("@sentry/nextjs");

  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_AUTH_TOKEN) {
    config = withSentryConfig(nextConfig, { ... });
  }
} catch (e) {
  console.log("⚠️  Sentry not configured - running without error tracking");
}

module.exports = config;
```

### 2. Fixed `_error.tsx`

**Before:**

```typescript
import * as Sentry from "@sentry/nextjs";

CustomErrorComponent.getInitialProps = async (contextData: any) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return Error.getInitialProps(contextData);
};
```

**After:**

```typescript
import Error from "next/error";

CustomErrorComponent.getInitialProps = async (contextData: any) => {
  try {
    const Sentry = await import("@sentry/nextjs");
    await Sentry.captureUnderscoreErrorException(contextData);
  } catch (e) {
    console.log("Error tracking not available");
  }
  return Error.getInitialProps(contextData);
};
```

### 3. Cleared Port Conflicts

Added commands to clear port 3000 before starting:

```bash
lsof -ti:3000 | xargs kill -9 2>/dev/null
```

## 🎯 Benefits

✅ **Web app now starts without Sentry** - Perfect for local development  
✅ **No build errors** - Configuration loads successfully  
✅ **Port conflicts resolved** - Automatic cleanup before start  
✅ **Still supports Sentry** - Will work in production if configured  
✅ **Graceful degradation** - Missing Sentry doesn't break the app

## 🚀 Testing

The web application now:

- ✅ Starts successfully on port 3000
- ✅ Loads environment variables (.env.local and .env)
- ✅ Compiles client and server successfully
- ✅ Shows warning when Sentry not configured (expected)
- ✅ Falls back to default behavior without Sentry

## 📝 Notes

- **For local development**: Sentry is optional and disabled by default
- **For production**: Set `NEXT_PUBLIC_SENTRY_DSN` to enable error tracking
- **Test pages**: `/sentry-example-page` still requires Sentry to be installed

## 🔄 Running the App

```bash
# Kill any process on port 3000
lsof -ti:3000 | xargs kill -9

# Start the web app
cd apps/web
npm run dev

# Or use the full stack script
./start-dev.sh
```

## ✅ Verification

```bash
# Check if web app is running
curl http://localhost:3000

# Check logs
tail -f logs/web.log
```

---

**Date Fixed:** October 11, 2025  
**Status:** ✅ Resolved  
**Impact:** Web application now starts successfully for local development
