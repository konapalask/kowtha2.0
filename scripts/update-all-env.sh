#!/bin/bash

echo "Updating all .env files for local development..."
echo ""

# Update Backend .env
cat > /Users/shashank/projects/kowtha/apps/backend/.env << 'EOF'
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

echo "✅ Backend .env updated"

# Update Web .env.local (Next.js uses .env.local for local dev)
cat > /Users/shashank/projects/kowtha/apps/web/.env.local << 'EOF'
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

echo "✅ Web .env.local updated"

# Update Mobile .env (React Native uses .env by default)
cat > /Users/shashank/projects/kowtha/apps/mobile/.env << 'EOF'
# API Configuration
# For iOS Simulator: Use localhost
# For Android Emulator: Use 10.0.2.2
# For Physical Device: Use your machine's IP address

REACT_APP_BASE_URL=http://localhost:3001/api/

# Environment
NODE_ENV=development
EOF

echo "✅ Mobile .env updated"

echo ""
echo "✅ All environment files updated successfully!"
echo ""
echo "Summary:"
echo "- Backend uses: .env"
echo "- Web uses: .env.local (Next.js convention)"
echo "- Mobile uses: .env"
echo ""
echo "Database: localhost:5433"
echo "Backend: http://localhost:3001"
echo "Web: http://localhost:3000"

