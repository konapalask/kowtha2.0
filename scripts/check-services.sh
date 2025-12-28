#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Service Health Check${NC}"
echo ""

# Check Database
echo -e "${YELLOW}Checking Database...${NC}"
if docker ps | grep -q kowtha-postgres; then
    DB_STATUS=$(docker inspect kowtha-postgres --format='{{.State.Health.Status}}' 2>/dev/null || echo "unknown")
    echo -e "  ${GREEN}✓ PostgreSQL: Running ($DB_STATUS)${NC}"
    echo -e "    Port: 5433"
else
    echo -e "  ${RED}✗ PostgreSQL: NOT RUNNING${NC}"
    echo -e "    ${YELLOW}Fix: docker-compose up -d db${NC}"
fi

# Check Backend
echo ""
echo -e "${YELLOW}Checking Backend...${NC}"
if lsof -i:3001 > /dev/null 2>&1; then
    if curl -s http://localhost:3001/api > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓ Backend: Running & Responding${NC}"
        echo -e "    URL: http://localhost:3001/api"
    else
        echo -e "  ${YELLOW}⚠ Backend: Port occupied but not responding${NC}"
    fi
else
    echo -e "  ${RED}✗ Backend: NOT RUNNING${NC}"
    echo -e "    ${YELLOW}Fix: cd apps/backend && npm run dev${NC}"
fi

# Check Web
echo ""
echo -e "${YELLOW}Checking Web...${NC}"
if lsof -i:3000 > /dev/null 2>&1; then
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "  ${GREEN}✓ Web: Running & Responding${NC}"
        echo -e "    URL: http://localhost:3000"
    else
        echo -e "  ${YELLOW}⚠ Web: Port occupied but not responding${NC}"
    fi
else
    echo -e "  ${RED}✗ Web: NOT RUNNING${NC}"
    echo -e "    ${YELLOW}Fix: cd apps/web && npm run dev${NC}"
fi

# Check Mobile Metro
echo ""
echo -e "${YELLOW}Checking Mobile Metro...${NC}"
if lsof -i:8081 > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓ Metro Bundler: Running${NC}"
    echo -e "    Port: 8081"
else
    echo -e "  ${RED}✗ Metro Bundler: NOT RUNNING${NC}"
    echo -e "    ${YELLOW}Fix: cd apps/mobile && npm start${NC}"
fi

# Check Android Emulator
echo ""
echo -e "${YELLOW}Checking Android Emulator...${NC}"
if command -v adb &> /dev/null; then
    DEVICE_COUNT=$(adb devices | grep -v "List" | grep "device" | wc -l | xargs)
    if [ "$DEVICE_COUNT" -gt "0" ]; then
        echo -e "  ${GREEN}✓ Android Emulator: Connected${NC}"
        adb devices | grep device | grep -v "List"
    else
        echo -e "  ${YELLOW}⚠ Android Emulator: Not connected${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠ ADB not found${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Summary
ISSUES=0
! docker ps | grep -q kowtha-postgres && ISSUES=$((ISSUES + 1))
! lsof -i:3001 > /dev/null 2>&1 && ISSUES=$((ISSUES + 1))
! lsof -i:3000 > /dev/null 2>&1 && ISSUES=$((ISSUES + 1))

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ All core services are running!${NC}"
    echo ""
    echo -e "Access your apps:"
    echo -e "  Web:     ${BLUE}http://localhost:3000${NC}"
    echo -e "  API:     ${BLUE}http://localhost:3001/api${NC}"
    echo -e "  Docs:    ${BLUE}http://localhost:3001/docs${NC}"
    echo -e "  DB:      ${BLUE}localhost:5433${NC}"
else
    echo -e "${RED}⚠️  $ISSUES service(s) not running${NC}"
    echo ""
    echo -e "Quick fix: ${GREEN}./start-dev.sh${NC}"
fi

echo ""

