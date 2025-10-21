#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Kowtha Development Environment Verification${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

ERRORS=0
WARNINGS=0

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required tools
echo -e "${YELLOW}Checking required tools...${NC}"
echo ""

if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js: NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm: NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✓ Docker: $DOCKER_VERSION${NC}"
    
    # Check if Docker is running
    if docker ps >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Docker daemon is running${NC}"
    else
        echo -e "${YELLOW}⚠ Docker daemon is NOT running${NC}"
        echo -e "  Please start Docker Desktop to run the database"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗ Docker: NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if command_exists docker-compose; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✓ Docker Compose: $COMPOSE_VERSION${NC}"
elif command_exists docker && docker compose version >/dev/null 2>&1; then
    COMPOSE_VERSION=$(docker compose version)
    echo -e "${GREEN}✓ Docker Compose (plugin): $COMPOSE_VERSION${NC}"
else
    echo -e "${RED}✗ Docker Compose: NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check environment files
echo -e "${YELLOW}Checking environment files...${NC}"
echo ""

if [ -f "apps/backend/.env" ]; then
    echo -e "${GREEN}✓ Backend .env exists${NC}"
else
    echo -e "${RED}✗ Backend .env NOT FOUND${NC}"
    echo -e "  Run: ./setup-env.sh"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "apps/web/.env.local" ]; then
    echo -e "${GREEN}✓ Web .env.local exists${NC}"
else
    echo -e "${RED}✗ Web .env.local NOT FOUND${NC}"
    echo -e "  Run: ./setup-env.sh"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "apps/mobile/.env" ]; then
    echo -e "${GREEN}✓ Mobile .env exists${NC}"
else
    echo -e "${RED}✗ Mobile .env NOT FOUND${NC}"
    echo -e "  Run: ./setup-env.sh"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check project files
echo -e "${YELLOW}Checking project structure...${NC}"
echo ""

if [ -f "docker-compose.yml" ]; then
    echo -e "${GREEN}✓ docker-compose.yml exists${NC}"
else
    echo -e "${RED}✗ docker-compose.yml NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "project-data/kowtha_dev_db_091025.sql" ]; then
    SQL_SIZE=$(du -h project-data/kowtha_dev_db_091025.sql | cut -f1)
    echo -e "${GREEN}✓ Database dump exists ($SQL_SIZE)${NC}"
else
    echo -e "${RED}✗ Database dump NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "apps/backend/package.json" ]; then
    echo -e "${GREEN}✓ Backend package.json exists${NC}"
else
    echo -e "${RED}✗ Backend package.json NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "apps/web/package.json" ]; then
    echo -e "${GREEN}✓ Web package.json exists${NC}"
else
    echo -e "${RED}✗ Web package.json NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "apps/mobile/package.json" ]; then
    echo -e "${GREEN}✓ Mobile package.json exists${NC}"
else
    echo -e "${RED}✗ Mobile package.json NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "apps/backend/prisma/schema.prisma" ]; then
    echo -e "${GREEN}✓ Prisma schema exists${NC}"
else
    echo -e "${RED}✗ Prisma schema NOT FOUND${NC}"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check dependencies
echo -e "${YELLOW}Checking installed dependencies...${NC}"
echo ""

if [ -d "apps/backend/node_modules" ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Backend dependencies NOT installed${NC}"
    echo -e "  Will be installed when you run ./start-dev.sh"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "apps/web/node_modules" ]; then
    echo -e "${GREEN}✓ Web dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Web dependencies NOT installed${NC}"
    echo -e "  Will be installed when you run ./start-dev.sh"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "apps/mobile/node_modules" ]; then
    echo -e "${GREEN}✓ Mobile dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Mobile dependencies NOT installed${NC}"
    echo -e "  Will be installed when you run ./start-dev.sh"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check for mobile development tools
echo -e "${YELLOW}Checking mobile development tools (optional)...${NC}"
echo ""

if [ "$(uname)" == "Darwin" ]; then
    if [ -d "/Applications/Xcode.app" ]; then
        echo -e "${GREEN}✓ Xcode installed${NC}"
    else
        echo -e "${YELLOW}⚠ Xcode NOT installed (needed for iOS development)${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

if [ -d "$HOME/Library/Android/sdk" ] || [ -d "/usr/local/android-sdk" ] || [ -d "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✓ Android SDK found${NC}"
else
    echo -e "${YELLOW}⚠ Android SDK NOT found (needed for Android development)${NC}"
    echo -e "  Install Android Studio for Android development"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! You're ready to start development.${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  1. Start Docker Desktop if not running"
    echo -e "  2. Run: ${GREEN}./start-dev.sh${NC}"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup is mostly complete with $WARNINGS warning(s).${NC}"
    echo ""
    echo -e "You can proceed, but some features may not work."
    echo -e "Next steps:"
    echo -e "  1. Start Docker Desktop if not running"
    echo -e "  2. Run: ${GREEN}./start-dev.sh${NC}"
    echo ""
else
    echo -e "${RED}✗ Setup incomplete: $ERRORS error(s), $WARNINGS warning(s)${NC}"
    echo ""
    echo -e "Please fix the errors above before proceeding."
    echo ""
    exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

