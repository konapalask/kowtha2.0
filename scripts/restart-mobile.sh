#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Restarting Mobile Service${NC}"
echo ""

# Kill Metro bundler processes
echo -e "${YELLOW}Stopping Metro bundler...${NC}"
pkill -f "react-native start" 2>/dev/null || true
pkill -f "node.*cli.js start" 2>/dev/null || true
lsof -ti:8081 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 2

echo -e "${GREEN}✅ Metro bundler stopped${NC}"
echo ""

# Clear Metro cache
echo -e "${YELLOW}Clearing Metro cache...${NC}"
cd apps/mobile
rm -rf node_modules/.cache 2>/dev/null || true
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true

echo -e "${GREEN}✅ Cache cleared${NC}"
echo ""

# Show current configuration
echo -e "${BLUE}Current mobile configuration:${NC}"
cat .env
echo ""

# Start Metro bundler with cache reset
echo -e "${YELLOW}Starting Metro bundler with fresh cache...${NC}"
echo -e "${BLUE}This will run in the background. Check logs/mobile.log for output.${NC}"
echo ""

cd /Users/shashank/projects/kowtha
npm start --prefix apps/mobile -- --reset-cache > logs/mobile.log 2>&1 &
METRO_PID=$!

sleep 5

if ps -p $METRO_PID > /dev/null; then
    echo -e "${GREEN}✅ Metro bundler started successfully (PID: $METRO_PID)${NC}"
    echo -e "${BLUE}📱 Metro bundler running on: http://localhost:8081${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Rebuild your app:"
    echo -e "   ${GREEN}iOS:${NC}     cd apps/mobile && npm run ios"
    echo -e "   ${GREEN}Android:${NC} cd apps/mobile && npm run android"
    echo ""
    echo "2. Check logs: tail -f logs/mobile.log"
    echo ""
    echo -e "${BLUE}To stop: pkill -f 'react-native start'${NC}"
else
    echo -e "${RED}❌ Failed to start Metro bundler${NC}"
    echo "Check logs/mobile.log for details:"
    tail -20 logs/mobile.log
    exit 1
fi

