#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🧹 Complete Clean Rebuild for Android${NC}"
echo ""

cd /Users/shashank/projects/kowtha/apps/mobile

# Step 1: Kill running processes
echo -e "${YELLOW}1. Stopping all running processes...${NC}"
pkill -f "react-native start" 2>/dev/null
pkill -f "gradle" 2>/dev/null
lsof -ti:8081 | xargs kill -9 2>/dev/null
sleep 2
echo -e "${GREEN}✓ Processes stopped${NC}"
echo ""

# Step 2: Clean Metro cache
echo -e "${YELLOW}2. Cleaning Metro bundler cache...${NC}"
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*
rm -rf /tmp/react-*
rm -rf $TMPDIR/react-*
echo -e "${GREEN}✓ Metro cache cleaned${NC}"
echo ""

# Step 3: Clean Android build
echo -e "${YELLOW}3. Cleaning Android build directories...${NC}"
cd android
./gradlew clean 2>/dev/null || echo "Gradlew clean failed, continuing..."
cd ..
rm -rf android/.gradle
rm -rf android/app/build
rm -rf android/build
echo -e "${GREEN}✓ Android build cleaned${NC}"
echo ""

# Step 4: Uninstall app from emulator
echo -e "${YELLOW}4. Uninstalling app from emulator...${NC}"
adb uninstall com.beyondscale.kowthafi 2>/dev/null || echo "App not found on device"
echo -e "${GREEN}✓ App uninstalled${NC}"
echo ""

# Step 5: Start Metro with clean cache
echo -e "${YELLOW}5. Starting Metro bundler with fresh cache...${NC}"
cd /Users/shashank/projects/kowtha/apps/mobile
npm start -- --reset-cache > /Users/shashank/projects/kowtha/logs/mobile.log 2>&1 &
METRO_PID=$!
echo -e "${GREEN}✓ Metro started (PID: $METRO_PID)${NC}"
echo ""

# Step 6: Wait for Metro to be ready
echo -e "${YELLOW}6. Waiting for Metro bundler to be ready...${NC}"
sleep 10
echo -e "${GREEN}✓ Metro should be ready${NC}"
echo ""

# Step 7: Build and install
echo -e "${YELLOW}7. Building and installing app...${NC}"
echo -e "${BLUE}This will take 1-2 minutes...${NC}"
echo ""

cd /Users/shashank/projects/kowtha/apps/mobile
npx react-native run-android

echo ""
echo -e "${GREEN}✅ Clean rebuild complete!${NC}"
echo ""
echo -e "${BLUE}If you see errors, check:${NC}"
echo "  - Metro logs: tail -f logs/mobile.log"
echo "  - Backend logs: tail -f logs/backend.log"

