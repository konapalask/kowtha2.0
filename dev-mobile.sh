#!/bin/bash

# Mobile Development Server (Android)
# Run this in Terminal 3

set -e

echo "📱 Starting Mobile App (Android)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd apps/mobile

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing mobile dependencies..."
  npm install
fi

# Check if emulator is running
if ! adb devices | grep -q emulator; then
  echo "🔄 Starting Android emulator..."
  echo "   (This may take 30-60 seconds)"
  echo ""
  
  # List available emulators
  EMULATORS=$(emulator -list-avds)
  
  if [ -z "$EMULATORS" ]; then
    echo "❌ No Android emulators found!"
    echo "   Please create one using Android Studio AVD Manager"
    exit 1
  fi
  
  # Get first available emulator
  EMULATOR_NAME=$(echo "$EMULATORS" | head -n 1)
  
  echo "   Starting emulator: $EMULATOR_NAME"
  emulator -avd "$EMULATOR_NAME" > /dev/null 2>&1 &
  
  # Wait for emulator to boot
  echo "   Waiting for emulator to boot..."
  adb wait-for-device
  
  # Wait a bit more for full boot
  sleep 10
  
  echo "   ✓ Emulator ready"
  echo ""
fi

echo ""
echo "🚀 Mobile app starting..."
echo "📱 Metro bundler: http://localhost:8081"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run React Native
npx react-native run-android

