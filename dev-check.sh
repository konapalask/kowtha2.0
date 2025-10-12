#!/bin/bash

# Development Environment Checker
# Run this to verify your setup is ready

echo "🔍 Checking Development Environment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
  echo "✅ Node.js: $(node -v)"
else
  echo "❌ Node.js not found! Please install Node.js"
  exit 1
fi

# Check if npm is installed
if command -v npm &> /dev/null; then
  echo "✅ npm: $(npm -v)"
else
  echo "❌ npm not found! Please install npm"
  exit 1
fi

# Check if Android SDK is available
if command -v adb &> /dev/null; then
  echo "✅ Android SDK (adb): $(adb --version | head -n 1)"
else
  echo "⚠️  Android SDK (adb) not found - Mobile development will not work"
fi

# Check if emulator command is available
if command -v emulator &> /dev/null; then
  echo "✅ Android Emulator command available"
  
  # List available emulators
  EMULATORS=$(emulator -list-avds)
  if [ -z "$EMULATORS" ]; then
    echo "⚠️  No Android emulators configured"
    echo "   Create one using Android Studio AVD Manager"
  else
    echo "✅ Available emulators:"
    echo "$EMULATORS" | sed 's/^/   - /'
  fi
else
  echo "⚠️  Emulator command not found - Mobile development will not work"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if dependencies are installed
echo ""
echo "📦 Checking Dependencies..."
echo ""

if [ -d "apps/backend/node_modules" ]; then
  echo "✅ Backend dependencies installed"
else
  echo "⚠️  Backend dependencies missing (will auto-install when you run dev-backend.sh)"
fi

if [ -d "apps/web/node_modules" ]; then
  echo "✅ Web dependencies installed"
else
  echo "⚠️  Web dependencies missing (will auto-install when you run dev-web.sh)"
fi

if [ -d "apps/mobile/node_modules" ]; then
  echo "✅ Mobile dependencies installed"
else
  echo "⚠️  Mobile dependencies missing (will auto-install when you run dev-mobile.sh)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if ports are available
echo ""
echo "🔌 Checking Ports..."
echo ""

if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "⚠️  Port 3001 (Backend) is in use"
  echo "   Run: lsof -ti:3001 | xargs kill -9"
else
  echo "✅ Port 3001 (Backend) available"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "⚠️  Port 3000 (Web) is in use"
  echo "   Run: lsof -ti:3000 | xargs kill -9"
else
  echo "✅ Port 3000 (Web) available"
fi

if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
  echo "⚠️  Port 8081 (Metro) is in use"
  echo "   Run: lsof -ti:8081 | xargs kill -9"
else
  echo "✅ Port 8081 (Metro) available"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Ready to Start Development!"
echo ""
echo "Open 3 terminals and run:"
echo "  Terminal 1: ./dev-backend.sh"
echo "  Terminal 2: ./dev-web.sh"
echo "  Terminal 3: ./dev-mobile.sh"
echo ""
echo "Optional 4th terminal for logs:"
echo "  Terminal 4: ./dev-logs.sh"
echo ""
echo "See DEV_WORKFLOW_GUIDE.md for more details."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

