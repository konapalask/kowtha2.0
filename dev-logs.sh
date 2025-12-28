#!/bin/bash

# Mobile Logs Viewer (Android)
# Run this in Terminal 4 (optional but recommended)

echo "📋 Capturing Android Logs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Filtering: ReactNativeJS, Errors, QA, Network"
echo "   Press Ctrl+C to stop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Clear previous logs
adb logcat -c

# Stream logs with color coding
adb logcat | grep -E "ReactNativeJS|Error|Exception|FATAL|Network|Toast|QA|Failed|kowthafi" | \
while read line; do
  if echo "$line" | grep -q "Error\|Exception\|FATAL\|Failed"; then
    echo -e "\033[0;31m$line\033[0m"  # Red
  elif echo "$line" | grep -q "Warning\|WARN"; then
    echo -e "\033[0;33m$line\033[0m"  # Yellow
  elif echo "$line" | grep -q "Success\|✅\|✓"; then
    echo -e "\033[0;32m$line\033[0m"  # Green
  elif echo "$line" | grep -q "QA\|Test"; then
    echo -e "\033[0;36m$line\033[0m"  # Cyan
  else
    echo "$line"
  fi
done

