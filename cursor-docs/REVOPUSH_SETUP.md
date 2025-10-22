# RevoPush Setup Guide

## Overview

RevoPush (CodePush) integration enables over-the-air (OTA) updates for the Android React Native app, allowing QA engineers to receive updates without rebuilding APKs.

## Current Configuration

### JavaScript Integration

- **File**: `apps/mobile/index.js`
- **Status**: ✅ Configured with CodePush HOC wrapper
- **Update Strategy**: `ON_APP_RESUME` (checks for updates when app resumes)
- **Install Mode**: `IMMEDIATE` (shows dialog, installs immediately)
- **Debug Mode**: Enabled for QA testing

### Android Native Configuration

- **MainApplication.kt**: ✅ Configured with `CodePush.getJSBundleFile()`
- **build.gradle**: ✅ RevoPush plugin applied
- **strings.xml**: ✅ Deployment key and server URL configured
  - Server URL: `https://api.revopush.org`
  - Deployment Key: `BYneeFfgIcFbUCkZyuEzSzr0ZjUuN1gf9oHafg`

## How to Push Updates

### Prerequisites

1. Install RevoPush CLI globally:

   ```bash
   npm install -g @revopush/cli
   ```

2. Login to RevoPush:
   ```bash
   revopush login
   ```

### Deploy Update

1. Navigate to mobile app directory:

   ```bash
   cd apps/mobile
   ```

2. Build and deploy update:

   ```bash
   revopush release-react kowtha-app android -d Staging
   ```

3. For production deployment:
   ```bash
   revopush release-react kowtha-app android -d Production
   ```

## QA Testing Workflow

### For QA Engineers

1. Install the APK on test device
2. The app will automatically check for updates when:
   - App is launched
   - App resumes from background
3. When an update is available:
   - A dialog will appear with "Update Available" message
   - Tap "Update Now" to apply the update
   - App will restart automatically after update

### Testing Updates

1. Make code changes in the app
2. Developer runs `revopush release-react kowtha-app android -d Staging`
3. QA opens the app and should see update dialog
4. After updating, verify changes are applied

## Deployment Keys

The current Android deployment key is configured in:

- `apps/mobile/android/app/src/main/res/values/strings.xml`
- `apps/mobile/index.js` (as fallback)

**Key**: `BYneeFfgIcFbUCkZyuEzSzr0ZjUuN1gf9oHafg`

To update the deployment key:

1. Update `strings.xml` with new key
2. Update `index.js` with new key if needed
3. Rebuild the app

## Troubleshooting

### Updates Not Appearing

1. **Check internet connection** - Updates require internet
2. **Force check for updates** - Restart the app
3. **Verify deployment key** - Ensure key matches RevoPush dashboard
4. **Check app version** - Updates are version-specific

### Debug Mode Issues

- Updates should work in debug mode for QA testing
- If updates don't work in debug, try release build first

### Common Issues

1. **"No updates available"** - Check if update was actually deployed
2. **Update dialog not showing** - Verify `InstallMode.IMMEDIATE` configuration
3. **Update fails to install** - Check device storage and network

## Configuration Details

### Update Dialog Messages

- **Title**: "Update Available"
- **Message**: "An update is available. The app will restart after updating."
- **Button**: "Update Now"

### Update Frequency

- **Check Frequency**: `ON_APP_RESUME` - checks every time app resumes
- **Install Mode**: `IMMEDIATE` - shows dialog immediately

## Development Notes

- iOS is not in scope for this project
- Only Android deployment key is configured
- Updates work in both debug and release builds for QA convenience
