#!/bin/bash

# Web Development Server
# Run this in Terminal 2

set -e

echo "🌐 Starting Web Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd apps/web

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing web dependencies..."
  npm install
fi

echo ""
echo "🚀 Web running on http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run Next.js in development mode
npm run dev

