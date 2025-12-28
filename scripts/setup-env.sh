#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up environment files for local development...${NC}"
echo ""

# Backend .env (Backend and Prisma use .env by default)
cat > apps/backend/.env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://kowtha:devpass@localhost:5433/loan_verification?schema=public"
SHADOW_DATABASE_URL="postgresql://kowtha:devpass@localhost:5433/loan_verification_shadow?schema=public"

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this
REFRESH_TOKEN_EXPIRES_IN=30d

# AWS S3 Configuration (if needed)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=kowtha-documents

# Redis Configuration (if needed)
REDIS_HOST=localhost
REDIS_PORT=6379

# CORS Origins
CORS_ORIGIN=http://localhost:3000,http://localhost:19006

# API Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
EOF

echo -e "${GREEN}✓ Created apps/backend/.env${NC}"

# Web .env.local
cat > apps/web/.env.local << 'EOF'
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/
NEXT_PUBLIC_DOMAIN_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production

# Sentry Configuration (Optional)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Environment
NODE_ENV=development
EOF

echo -e "${GREEN}✓ Created apps/web/.env.local${NC}"

# Mobile .env (React Native uses .env by default)
cat > apps/mobile/.env << 'EOF'
# API Configuration
# For iOS Simulator and Android Emulator running on same machine as backend
# iOS Simulator: Use localhost
# Android Emulator: Use 10.0.2.2 (Android's special alias to host machine)
# Physical Device: Use your machine's IP address (e.g., 192.168.x.x)

# For development, use one of these based on your setup:
REACT_APP_BASE_URL=http://localhost:3001/api/
# REACT_APP_BASE_URL=http://10.0.2.2:3001/api/  # For Android Emulator
# REACT_APP_BASE_URL=http://192.168.1.100:3001/api/  # For Physical Device (replace with your IP)

# Environment
NODE_ENV=development
EOF

echo -e "${GREEN}✓ Created apps/mobile/.env${NC}"

echo ""
echo -e "${GREEN}✅ All environment files created successfully!${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT:${NC}"
echo "1. Backend uses: .env"
echo "2. Web uses: .env.local (Next.js convention)"
echo "3. Mobile uses: .env"
echo "4. For mobile app on Android Emulator, change REACT_APP_BASE_URL to http://10.0.2.2:3001/api/"
echo "5. For mobile app on physical device, use your machine's IP address"
echo ""
echo "To find your IP address:"
echo "  macOS/Linux: ifconfig | grep 'inet '"
echo "  Windows: ipconfig"
echo ""

