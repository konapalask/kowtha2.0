#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📱 Waiting for Android Emulator to Boot${NC}"
echo ""

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo -e "${RED}❌ ADB not found. Make sure Android SDK is installed.${NC}"
    exit 1
fi

# Check if any devices are connected
DEVICE_COUNT=$(adb devices | grep -v "List" | grep "device" | wc -l | xargs)

if [ "$DEVICE_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}⚠️  No Android devices/emulators detected${NC}"
    echo ""
    echo "Please start your Android emulator first:"
    echo "1. Open Android Studio"
    echo "2. Go to Tools > Device Manager"
    echo "3. Start an emulator"
    echo ""
    echo "Or from command line:"
    echo "  emulator -avd <device_name>"
    exit 1
fi

echo -e "${YELLOW}Detected devices:${NC}"
adb devices
echo ""

# Wait for device to boot
echo -e "${YELLOW}Waiting for emulator to finish booting...${NC}"
echo -e "${BLUE}(This can take 1-3 minutes)${NC}"
echo ""

MAX_WAIT=180  # 3 minutes
WAIT_TIME=0

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    BOOT_STATUS=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')
    
    if [ "$BOOT_STATUS" == "1" ]; then
        echo ""
        echo -e "${GREEN}✅ Emulator is ready!${NC}"
        echo ""
        
        # Show device info
        echo -e "${BLUE}Device Information:${NC}"
        echo -e "Model: $(adb shell getprop ro.product.model)"
        echo -e "Android: $(adb shell getprop ro.build.version.release)"
        echo -e "API Level: $(adb shell getprop ro.build.version.sdk)"
        echo ""
        
        echo -e "${GREEN}You can now run:${NC}"
        echo -e "  cd apps/mobile && npm run android"
        echo ""
        exit 0
    fi
    
    echo -n "."
    sleep 3
    WAIT_TIME=$((WAIT_TIME + 3))
done

echo ""
echo -e "${RED}❌ Timeout waiting for emulator to boot${NC}"
echo "The emulator is taking longer than expected."
echo ""
echo "Try:"
echo "1. Restart the emulator"
echo "2. Check if your computer has enough resources"
echo "3. Use a lighter Android Virtual Device"
exit 1

