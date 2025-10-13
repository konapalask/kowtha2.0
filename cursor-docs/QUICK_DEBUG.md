# 🚀 Quick Debug Workflow

## The Simplest Way to Debug Android Issues

### 1. Start Live Log Monitor

```bash
./capture-android-logs.sh
```

Leave this running in a terminal. It will show you ALL errors in real-time.

### 2. Use Your App

Go ahead and test:

- Select RBL bank
- Click "Load Form"
- Whatever causes the error

### 3. Copy & Paste Error to Me

When you see an error in the terminal:

- Select the error lines (including 5-10 lines before/after)
- Copy (Cmd+C)
- Paste directly in chat

**That's it!** No screenshots, no files, no extra steps.

---

## What You'll See

```
10-11 15:30:45 I ReactNativeJS: Creating QA Test Loan...
10-11 15:30:46 I ReactNativeJS: Calling http://localhost:8080/loans/qa-test-loan
10-11 15:30:47 E ReactNativeJS: Network request failed
10-11 15:30:47 E ReactNativeJS: Error: Failed to create QA loan
10-11 15:30:47 I ReactNativeJS:   at QAFormTesting.tsx:360
```

Just copy this whole block and send it to me!

---

## Pro Tips

- Keep it running all the time while testing
- Use Cmd+F to search for specific errors
- Press Ctrl+C to stop when done

---

**That's literally it.** Way simpler than screenshots or log files!
