# 📱 How to Capture Android Logs (Much Better Than Screenshots!)

## Quick Summary

Instead of taking screenshots, just run the live log monitor and **see errors in real-time**!

---

## ✅ **Live Log Monitoring** (BEST METHOD)

```bash
./capture-android-logs.sh
```

**What you'll see in real-time:**

- ✅ JavaScript errors with stack traces
- ✅ Network request failures
- ✅ Toast messages
- ✅ QA form errors
- ✅ Backend responses

**Press Ctrl+C to stop**

**Pro Tip:** Keep this running in a separate terminal while testing!

---

## 🔧 **Manual ADB Commands** (If You Want More Control)

### See ALL logs (unfiltered):

```bash
adb logcat
```

### Filter by your app only:

```bash
adb logcat | grep "kowthafi"
```

### Filter by JavaScript errors:

```bash
adb logcat | grep "ReactNativeJS"
```

### Save last 500 lines:

```bash
adb logcat -d -t 500 > error_logs.txt
```

### Clear logs and start fresh:

```bash
adb logcat -c
adb logcat
```

---

## ✅ **Method 4: React Native Debugger** (Visual)

1. Shake your device/emulator (Ctrl+M on emulator)
2. Select "Debug"
3. Open Chrome DevTools at: `chrome://inspect`
4. Click "Console" to see all JavaScript logs

---

## 🔍 **What to Look For in Logs**

When you share logs with me, look for lines containing:

- **`Error:`** - JavaScript errors
- **`Exception:`** - Native Android crashes
- **`FATAL:`** - App crashes
- **`ReactNativeJS:`** - JavaScript console.log output
- **`Network request failed`** - API call issues

---

## 🎯 **Best Practice for Sharing Errors**

1. **Reproduce the error** (e.g., click "Load Form")
2. **Immediately run**: `./save-android-logs.sh`
3. **Find the error** in the generated file (search for "Error")
4. **Copy 20-30 lines** around the error (before + after)
5. **Paste in chat** instead of screenshot

---

## 📋 **Example: What Good Logs Look Like**

Instead of a screenshot showing:

```
Toast error: 'warning' type doesn't exist
```

You'd share:

```
10-11 15:30:45.123  1234  5678 I ReactNativeJS: Error creating QA loan: TypeError: Cannot read property 'data' of undefined
10-11 15:30:45.124  1234  5678 I ReactNativeJS:     at QAFormTesting.tsx:360:35
10-11 15:30:45.125  1234  5678 I ReactNativeJS:     at tryCallOne (core.js:37)
10-11 15:30:45.126  1234  5678 I ReactNativeJS: Network request failed: http://localhost:8080/loans/qa-test-loan
10-11 15:30:45.127  1234  5678 E ReactNativeJS: Toast type 'warning' does not exist
```

**This gives me:**

- ✅ Exact error message
- ✅ File name and line number
- ✅ Stack trace
- ✅ Network endpoint that failed
- ✅ Timestamps

vs screenshot which gives:

- ❌ Partial error message
- ❌ No context
- ❌ No stack trace
- ❌ Hard to copy/paste

---

## 🚀 **Quick Start** (Do This Now!)

**Step 1:** Start the live monitor

```bash
./capture-android-logs.sh
```

**Step 2:** In your app, trigger the error

- Select RBL bank
- Click "Load Form"
- Watch Terminal 1 - error appears immediately!

**Step 3:** Copy the error from terminal and paste it to me

That's it! Way faster than screenshots.

---

## 💡 **Pro Tips**

1. **Keep logs running** while testing - much faster than reproducing errors
2. **Search logs** with Ctrl+F for specific errors
3. **Share 20-30 lines** around the error for context
4. **Clear logs** before reproducing: `adb logcat -c`

---

## 🎊 **Benefits Over Screenshots**

| Screenshots               | Logs                             |
| ------------------------- | -------------------------------- |
| ❌ Partial error text     | ✅ Full error with stack trace   |
| ❌ No context             | ✅ Complete context before/after |
| ❌ Can't copy/paste       | ✅ Easy to copy/paste            |
| ❌ Multiple images needed | ✅ One text block                |
| ❌ Lost detail            | ✅ All details preserved         |
| ❌ Blurry on zoom         | ✅ Crystal clear text            |

---

## 📞 **How to Share Errors With Me**

When you see an error:

1. ✅ **Have `./capture-android-logs.sh` running**
2. ✅ **Reproduce the error** in the app
3. ✅ **Copy the error lines** from the terminal
4. ✅ **Paste directly** in chat

**Example:**

> "Getting this when I click Load Form for RBL:"
>
> ```
> 10-11 15:30:45 ReactNativeJS: Error creating QA loan
> 10-11 15:30:45 Network request failed: http://localhost:8080/loans/qa-test-loan
> 10-11 15:30:45 TypeError: Cannot read property 'data' of undefined
> ```

**Way better than screenshots!** I can see the exact error, line numbers, and fix it immediately.

---

**Created**: October 11, 2025  
**TL;DR**: Just keep `./capture-android-logs.sh` running while testing!
