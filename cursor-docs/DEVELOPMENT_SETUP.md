# Kowtha Development Environment Setup

This guide will help you set up and run the complete Kowtha development environment with Backend, Web Frontend, and Mobile app.

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose**
- **Git**

For mobile development, you'll also need:

- **Xcode** (for iOS development on macOS)
- **Android Studio** (for Android development)
- **React Native CLI** (installed via npm)

## Architecture Overview

The project consists of three main applications:

1. **Backend** (`apps/backend/`) - NestJS API server with Prisma ORM

   - Port: 3001
   - API Endpoint: http://localhost:3001/api
   - Swagger Docs: http://localhost:3001/docs

2. **Web** (`apps/web/`) - Next.js web application

   - Port: 3000
   - URL: http://localhost:3000

3. **Mobile** (`apps/mobile/`) - React Native mobile application

   - Metro Bundler Port: 8081

4. **Database** - PostgreSQL 14 running in Docker
   - Port: 5432
   - Database: loan_verification
   - User: kowtha
   - Password: devpass

## Environment Files

### Which .env file is used?

**For local development, you should use `.env.local`** files in each app directory:

- `apps/backend/.env.local` - Backend configuration
- `apps/web/.env.local` - Web frontend configuration
- `apps/mobile/.env.local` - Mobile app configuration

The `.env` files are for production use only.

### Environment File Details

#### Backend (.env.local)

```bash
DATABASE_URL="postgresql://kowtha:devpass@localhost:5433/loan_verification?schema=public"
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### Web (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/
NEXT_PUBLIC_DOMAIN_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost
```

#### Mobile (.env.local)

```bash
# Choose based on your setup:
REACT_APP_BASE_URL=http://localhost:3001/api/  # For iOS Simulator
# REACT_APP_BASE_URL=http://10.0.2.2:3001/api/  # For Android Emulator
# REACT_APP_BASE_URL=http://192.168.1.100:3001/api/  # For Physical Device
```

**Note:** For physical devices, replace `192.168.1.100` with your computer's actual IP address on your local network.

## Quick Start

### Option 1: Using the Start Script (Recommended)

1. **Setup environment files:**

```bash
chmod +x setup-env.sh
./setup-env.sh
```

This will create `.env.local` files in each app directory with default development settings.

2. **Make the start script executable:**

```bash
chmod +x start-dev.sh
```

3. **Run the script:**

```bash
./start-dev.sh
```

This will:

- Start PostgreSQL in Docker
- Initialize the database with the SQL dump
- Install dependencies for all apps (if needed)
- Run Prisma migrations
- Start Backend, Web, and Mobile services
- Display logs in the `logs/` directory

3. **To stop all services:**
   Press `CTRL+C` in the terminal where the script is running.

### Option 2: Manual Setup

#### Step 1: Start Database

```bash
# Start PostgreSQL
docker-compose up -d db

# Check if database is running
docker-compose ps
```

#### Step 2: Setup Backend

```bash
cd apps/backend

# Install dependencies
npm install

# Run migrations (this will also apply the SQL dump on first run)
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Start backend in development mode
npm run dev
```

Backend should now be running on http://localhost:3001

#### Step 3: Setup Web Frontend

Open a new terminal:

```bash
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

Web should now be running on http://localhost:3000

#### Step 4: Setup Mobile App

Open a new terminal:

```bash
cd apps/mobile

# Install dependencies
npm install

# Start Metro bundler
npm start
```

In another terminal, run the app:

For iOS:

```bash
cd apps/mobile
npm run ios
```

For Android:

```bash
cd apps/mobile
npm run android
```

## Database Management

### Initial Database Setup

The database is automatically initialized with the SQL dump located at:
`project-data/kowtha_dev_db_091025.sql`

This happens automatically when you first start the Docker container.

### Applying Migrations

After the initial setup, to apply new migrations:

```bash
cd apps/backend

# Run migrations
npx prisma migrate deploy

# Or for development with name prompt
npx prisma migrate dev
```

### Viewing the Database

You can connect to the database using any PostgreSQL client:

- Host: localhost
- Port: 5432
- Database: loan_verification
- User: kowtha
- Password: devpass

Using psql:

```bash
docker-compose exec db psql -U kowtha -d loan_verification
```

### Resetting the Database

If you need to reset the database:

```bash
# Stop and remove containers with volumes
docker-compose down -v

# Start fresh
docker-compose up -d db

# Wait for database to be ready, then run migrations
cd apps/backend
npx prisma migrate deploy
```

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Check if PostgreSQL is running:

```bash
docker-compose ps
```

2. Check database logs:

```bash
docker-compose logs db
```

3. Verify the database URL in `apps/backend/.env.local`

### Port Already in Use

If you get "port already in use" errors:

```bash
# For backend (port 3001)
lsof -ti:3001 | xargs kill -9

# For web (port 3000)
lsof -ti:3000 | xargs kill -9

# For mobile (port 8081)
lsof -ti:8081 | xargs kill -9
```

### Mobile App Not Connecting to Backend

For mobile app, the backend URL depends on your setup:

- **iOS Simulator**: Use `http://localhost:3001/api/`
- **Android Emulator**: Use `http://10.0.2.2:3001/api/`
- **Physical Device**: Use your computer's IP (e.g., `http://192.168.1.100:3001/api/`)

To find your IP address:

- macOS/Linux: `ifconfig | grep inet`
- Windows: `ipconfig`

Update `apps/mobile/.env.local` with the correct URL.

### Prisma Client Issues

If you encounter Prisma client errors:

```bash
cd apps/backend
npx prisma generate
```

### Clean Reinstall

To do a clean reinstall of all dependencies:

```bash
# Remove all node_modules
rm -rf apps/backend/node_modules
rm -rf apps/web/node_modules
rm -rf apps/mobile/node_modules
rm -rf node_modules

# Remove package-lock files
rm apps/backend/package-lock.json
rm apps/web/package-lock.json
rm apps/mobile/package-lock.json

# Reinstall
cd apps/backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

## Development Workflow

### Making Database Schema Changes

1. Edit `apps/backend/prisma/schema.prisma`
2. Create and apply migration:

```bash
cd apps/backend
npx prisma migrate dev --name your_migration_name
```

3. The Prisma client will be regenerated automatically

### Testing

#### Backend

```bash
cd apps/backend
npm run test
```

#### Mobile

```bash
cd apps/mobile
npm run test
# Or with coverage
npm run test:coverage
```

### Building for Production

#### Backend

```bash
cd apps/backend
npm run build
```

#### Web

```bash
cd apps/web
npm run build
npm start  # Start production server
```

#### Mobile

For iOS:

```bash
cd apps/mobile
npx react-native run-ios --configuration Release
```

For Android:

```bash
cd apps/mobile
cd android
./gradlew assembleRelease
```

## Useful Commands

### Backend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate   # Generate Prisma client
npm run prisma:migrate    # Run migrations
```

### Web

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

### Mobile

```bash
npm start            # Start Metro bundler
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run test         # Run tests
npm run lint         # Run linter
```

### Docker

```bash
docker-compose up -d db      # Start database
docker-compose down          # Stop all services
docker-compose down -v       # Stop and remove volumes
docker-compose logs db       # View database logs
docker-compose exec db bash  # Access database container
```

## Project Structure

```
kowtha/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   ├── prisma/
│   │   ├── .env.local    # Local environment config
│   │   └── package.json
│   ├── web/              # Next.js web app
│   │   ├── src/
│   │   ├── .env.local    # Local environment config
│   │   └── package.json
│   └── mobile/           # React Native app
│       ├── src/
│       ├── .env.local    # Local environment config
│       └── package.json
├── project-data/
│   └── kowtha_dev_db_091025.sql  # Database dump
├── docker-compose.yml    # Docker services
├── start-dev.sh          # Start all services script
└── DEVELOPMENT_SETUP.md  # This file
```

## Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

If you encounter any issues not covered in this guide, please:

1. Check the logs in the `logs/` directory
2. Review the error messages carefully
3. Consult the respective framework documentation
4. Check Docker container logs: `docker-compose logs db`
