#!/bin/bash
# Live Android log monitoring - see errors in real-time!

echo "📱 Live Android Logs - Watching for errors..."
echo "🔍 Filtering: ReactNativeJS, Errors, Network, Toast"
echo "⏹️  Press Ctrl+C to stop"
echo "================================================"
echo ""

# Clear old logs first
adb logcat -c

# Live stream with color-coded output and better filtering
adb logcat -v time | grep -E "(ReactNativeJS|Error|Exception|FATAL|Network|Toast|QA|Failed|kowthafi)" --color=always
