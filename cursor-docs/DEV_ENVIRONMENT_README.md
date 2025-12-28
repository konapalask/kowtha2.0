# 🚀 Kowtha Development Environment - Complete Setup Guide

## ✅ Setup Summary

Your monolithic development environment is now configured to run all three applications simultaneously:

- **Backend** (NestJS API) - Port 3001
- **Web** (Next.js) - Port 3000
- **Mobile** (React Native) - Metro Bundler on Port 8081
- **Database** (PostgreSQL 14) - Port 5432

## 📦 What's Been Configured

### 1. Environment Files (`.env.local`)

✅ **Backend** (`apps/backend/.env.local`)

```bash
DATABASE_URL="postgresql://kowtha:devpass@localhost:5433/loan_verification?schema=public"
PORT=3001
NODE_ENV=development
JWT_SECRET=...
# + AWS, Redis, CORS, Rate Limiting configs
```

✅ **Web** (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/
NEXT_PUBLIC_DOMAIN_BASE_URL=http://localhost:3000
NODE_ENV=development
```

✅ **Mobile** (`apps/mobile/.env.local`)

```bash
REACT_APP_BASE_URL=http://localhost:3001/api/
NODE_ENV=development
```

### 2. Database Configuration

✅ **Docker Compose** (`docker-compose.yml`)

- PostgreSQL 14 container
- Auto-initialization with SQL dump on first start
- Health checks configured
- Persistent volume for data

✅ **Database Credentials**

- Host: `localhost`
- Port: `5432`
- Database: `loan_verification`
- User: `kowtha`
- Password: `devpass`

✅ **SQL Dump**: `project-data/kowtha_dev_db_091025.sql` (412K)

- Automatically loaded on first container start
- Contains full schema and initial data

### 3. Automation Scripts

✅ **`setup-env.sh`**

- Creates all `.env.local` files
- Configures default development settings
- Run once before first start

✅ **`start-dev.sh`**

- Starts all services with one command
- Handles dependencies, migrations, and startup
- Monitors all processes
- Saves logs to `./logs/` directory

✅ **`verify-setup.sh`**

- Checks system requirements
- Verifies file structure
- Validates configuration
- Provides troubleshooting guidance

## 🎯 Quick Start (3 Simple Steps)

### Step 1: Start Docker Desktop

Make sure Docker Desktop is running on your machine.

### Step 2: Run the Start Script

```bash
./start-dev.sh
```

### Step 3: Access Your Applications

- **Web**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **API Docs**: http://localhost:3001/docs
- **Database**: localhost:5433

**That's it!** All three services are now running. 🎉

## 📱 Running Mobile App

After starting the services, run the mobile app:

### iOS (macOS only)

```bash
cd apps/mobile
npm run ios
```

### Android Emulator

First, update `apps/mobile/.env.local`:

```bash
REACT_APP_BASE_URL=http://10.0.2.2:3001/api/
```

Then run:

```bash
cd apps/mobile
npm run android
```

### Physical Device

1. Find your machine's IP:

   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. Update `apps/mobile/.env.local`:

   ```bash
   REACT_APP_BASE_URL=http://YOUR_IP:3001/api/
   ```

3. Run the app:
   ```bash
   cd apps/mobile
   npm run ios    # or npm run android
   ```

## 🗂️ Service Management

### Start All Services

```bash
./start-dev.sh
```

### Stop All Services

Press `CTRL+C` in the terminal where `start-dev.sh` is running.

### View Logs

Logs are saved in the `./logs/` directory:

- `logs/backend.log` - Backend server
- `logs/web.log` - Web frontend
- `logs/mobile.log` - Mobile Metro bundler

You can also tail logs in real-time:

```bash
tail -f logs/backend.log
tail -f logs/web.log
tail -f logs/mobile.log
```

### Restart Individual Services

If you need to restart just one service, stop all and modify the start script, or:

**Backend only:**

```bash
cd apps/backend
npm run dev
```

**Web only:**

```bash
cd apps/web
npm run dev
```

**Mobile only:**

```bash
cd apps/mobile
npm start
```

## 🗄️ Database Management

### Connect to Database

**Using psql (via Docker):**

```bash
docker-compose exec db psql -U kowtha -d loan_verification
```

**Using Prisma Studio (GUI):**

```bash
cd apps/backend
npx prisma studio
# Opens at http://localhost:5555
```

**Using any PostgreSQL client:**

- Connection string: `postgresql://kowtha:devpass@localhost:5433/loan_verification`

### Run Migrations

**Apply pending migrations:**

```bash
cd apps/backend
npx prisma migrate deploy
```

**Create new migration:**

```bash
cd apps/backend
npx prisma migrate dev --name your_migration_name
```

**Regenerate Prisma client:**

```bash
cd apps/backend
npx prisma generate
```

### Reset Database

⚠️ **WARNING: This deletes all data!**

```bash
docker-compose down -v
docker-compose up -d db
cd apps/backend
npx prisma migrate deploy
```

## 🔍 Environment Files Explained

### Why `.env.local`?

In Node.js development, the environment file precedence is:

1. `.env.local` (highest priority) - **Used for local development**
2. `.env.development` - Development defaults
3. `.env` - **Production configuration**

**For local development, always use `.env.local` files.**

### Verify Environment Files

Check if files exist:

```bash
ls -la apps/backend/.env.local
ls -la apps/web/.env.local
ls -la apps/mobile/.env.local
```

Recreate if missing:

```bash
./setup-env.sh
```

## 🛠️ Common Tasks

### Install Dependencies

```bash
# Backend
cd apps/backend && npm install

# Web
cd apps/web && npm install

# Mobile
cd apps/mobile && npm install
```

### Build for Production

```bash
# Backend
cd apps/backend && npm run build

# Web
cd apps/web && npm run build

# Mobile
cd apps/mobile
# iOS
npm run ios --configuration Release
# Android
cd android && ./gradlew assembleRelease
```

### Run Tests

```bash
# Backend
cd apps/backend && npm test

# Mobile
cd apps/mobile && npm test
```

### Linting

```bash
# Backend
cd apps/backend && npm run lint

# Web
cd apps/web && npm run lint

# Mobile
cd apps/mobile && npm run lint
```

## 🚨 Troubleshooting

### Problem: Port Already in Use

```bash
# Check what's using the ports
lsof -i:3000  # Web
lsof -i:3001  # Backend
lsof -i:8081  # Mobile

# Kill processes
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
lsof -ti:8081 | xargs kill -9
```

### Problem: Docker Won't Start

1. Make sure Docker Desktop is running
2. Check Docker status: `docker ps`
3. Restart Docker Desktop
4. Check Docker logs: `docker-compose logs db`

### Problem: Database Connection Failed

```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Verify connection
docker-compose exec db psql -U kowtha -d loan_verification -c "SELECT 1"
```

### Problem: Prisma Client Errors

```bash
cd apps/backend
npx prisma generate
npx prisma migrate deploy
```

### Problem: Mobile Can't Connect to Backend

**For iOS Simulator:**

- Use `http://localhost:3001/api/`
- Check `apps/mobile/.env.local`

**For Android Emulator:**

- Use `http://10.0.2.2:3001/api/`
- Update `apps/mobile/.env.local`

**For Physical Device:**

- Use your machine's IP address
- Ensure both are on same WiFi network
- Check firewall settings

### Problem: "Module not found" Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Problem: Need to Start Fresh

```bash
# Complete reset
docker-compose down -v
rm -rf apps/*/node_modules
rm -rf apps/*/package-lock.json
rm -rf logs

# Reinstall
./setup-env.sh
cd apps/backend && npm install
cd ../web && npm install
cd ../mobile && npm install

# Start again
./start-dev.sh
```

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / Mobile App                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ├─── Web Frontend (Next.js) :3000
                  │
                  └─── Mobile App (React Native Metro) :8081
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Backend API (NestJS) :3001                  │
│              - REST API endpoints                        │
│              - Swagger docs at /docs                     │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Prisma ORM
                  ▼
┌─────────────────────────────────────────────────────────┐
│         PostgreSQL Database :5432                        │
│         - User: kowtha                                   │
│         - DB: loan_verification                          │
└─────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
kowtha/
├── apps/
│   ├── backend/                  # NestJS Backend
│   │   ├── src/                  # Source code
│   │   ├── prisma/               # Database schema & migrations
│   │   │   ├── schema.prisma     # Database schema
│   │   │   └── migrations/       # Migration files
│   │   ├── .env.local            # ✅ Local config
│   │   └── package.json
│   │
│   ├── web/                      # Next.js Web App
│   │   ├── src/                  # Source code
│   │   ├── .env.local            # ✅ Local config
│   │   └── package.json
│   │
│   └── mobile/                   # React Native App
│       ├── src/                  # Source code
│       ├── .env.local            # ✅ Local config
│       └── package.json
│
├── project-data/
│   └── kowtha_dev_db_091025.sql  # Database dump
│
├── logs/                         # Runtime logs
│   ├── backend.log
│   ├── web.log
│   └── mobile.log
│
├── docker-compose.yml            # Database config
├── setup-env.sh                  # Setup script
├── start-dev.sh                  # Start all services
├── verify-setup.sh               # Verify setup
│
└── Documentation/
    ├── DEV_ENVIRONMENT_README.md # This file
    ├── QUICK_START.md            # Quick reference
    ├── DEVELOPMENT_SETUP.md      # Detailed guide
    └── SETUP_COMPLETE.md         # Setup summary
```

## 🔐 Security Notes

- ⚠️ `.env.local` files contain development credentials only
- ⚠️ Never commit `.env.local` files (already in `.gitignore`)
- ⚠️ Change JWT secrets for production
- ⚠️ Database password is for local development only
- ✅ Use strong credentials in production
- ✅ Enable HTTPS for production APIs
- ✅ Review CORS settings before production

## 📚 Additional Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Daily development quick reference
- **[DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)** - Comprehensive setup guide
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Setup completion summary

## 🆘 Getting Help

### Check Setup Status

```bash
./verify-setup.sh
```

### View Logs

```bash
# All logs
ls -lh logs/

# Tail specific log
tail -f logs/backend.log
tail -f logs/web.log
tail -f logs/mobile.log
```

### Test Database Connection

```bash
docker-compose exec db psql -U kowtha -d loan_verification -c "SELECT version();"
```

### Test Backend API

```bash
curl http://localhost:3001/api
curl http://localhost:3001/docs
```

### Test Web Frontend

```bash
curl http://localhost:3000
```

## ✅ Pre-flight Checklist

Before starting development:

- [ ] Docker Desktop is running
- [ ] All `.env.local` files exist (`./verify-setup.sh`)
- [ ] No port conflicts (3000, 3001, 8081, 5432)
- [ ] Node.js v18+ installed
- [ ] Dependencies installed (or will be auto-installed)
- [ ] Sufficient disk space (>2GB)

## 🚀 Ready to Start?

```bash
# 1. Verify setup
./verify-setup.sh

# 2. Start all services
./start-dev.sh

# 3. Open in browser
# Web: http://localhost:3000
# API Docs: http://localhost:3001/docs

# 4. Start coding! 🎉
```

---

**Questions or Issues?**

1. Run `./verify-setup.sh`
2. Check logs in `./logs/`
3. Review troubleshooting section above
4. Consult the detailed guides

**Happy Coding!** 🚀

---

_Last Updated: October 11, 2025_  
_Setup Status: ✅ Complete and Tested_
