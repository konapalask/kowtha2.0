#!/bin/bash

# Update backend .env file with correct local development settings

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

echo "✅ Backend .env file updated successfully!"

