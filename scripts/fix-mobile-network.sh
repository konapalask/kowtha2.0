#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Mobile Network Configuration Fix${NC}"
echo ""

# Get machine's IP address
IP=$(ifconfig | grep "inet " | grep -v "127.0.0.1" | awk '{print $2}' | head -1)

echo -e "${YELLOW}Your machine's IP address: ${GREEN}$IP${NC}"
echo ""

echo -e "${BLUE}Select your mobile device type:${NC}"
echo "1. iOS Simulator (use localhost)"
echo "2. Android Emulator (use 10.0.2.2)"
echo "3. Physical Device (use $IP)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    API_URL="http://localhost:3001/api/"
    DEVICE="iOS Simulator"
    ;;
  2)
    API_URL="http://10.0.2.2:3001/api/"
    DEVICE="Android Emulator"
    ;;
  3)
    API_URL="http://$IP:3001/api/"
    DEVICE="Physical Device"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo -e "${BLUE}Updating mobile .env for ${GREEN}$DEVICE${NC}"

cat > apps/mobile/.env << EOF
# API Configuration
# Device: $DEVICE

REACT_APP_BASE_URL=$API_URL

# Environment
NODE_ENV=development
EOF

echo ""
echo -e "${GREEN}✅ Updated apps/mobile/.env${NC}"
echo -e "${BLUE}API URL:${NC} $API_URL"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "1. Stop the Metro bundler (Ctrl+C)"
echo "2. Clear the cache: cd apps/mobile && npm start -- --reset-cache"
echo "3. Restart your mobile app"
echo ""

# Test backend connectivity
echo -e "${BLUE}Testing backend connection...${NC}"
if curl -s http://localhost:3001/api/accounts/otp/generate > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running and accessible${NC}"
else
    echo -e "${YELLOW}⚠️  Backend might not be running. Start it with: ./start-dev.sh${NC}"
fi

echo ""
echo -e "${BLUE}Updated configuration:${NC}"
cat apps/mobile/.env

