#!/bin/bash

# Backend Development Server
# Run this in Terminal 1

set -e

echo "🔧 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start PostgreSQL with Docker
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d db

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0

until docker-compose exec -T db pg_isready -U kowtha -d loan_verification >/dev/null 2>&1; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database failed to start after $MAX_RETRIES attempts"
        docker-compose logs db
        exit 1
    fi
    echo -n "."
    sleep 2
done

echo ""
echo "✅ Database is ready!"
echo ""

# Check if database is already initialized
echo "🔍 Checking database state..."
DB_INITIALIZED=$(docker-compose exec db psql -U kowtha -d loan_verification -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")

if [ "$DB_INITIALIZED" -gt "0" ]; then
    echo "✅ Database already initialized with $DB_INITIALIZED tables"
else
    echo "⚠️  Database appears empty. If the SQL dump didn't import, you may need to run migrations."
fi
echo ""

cd apps/backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  npm install
fi

echo ""
echo "🚀 Backend running on http://localhost:3001"
echo "📋 API Docs: http://localhost:3001/api"
echo "🔥 Hot reload enabled - changes will auto-restart"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run in development mode with hot reload
npm run dev

