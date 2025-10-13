# Kowtha - Quick Start Guide

## Prerequisites

- Node.js (v18+)
- Docker Desktop
- npm

## Setup (First Time)

```bash
# 1. Clone the repository (if you haven't)
git clone <repository-url>
cd kowtha

# 2. Make scripts executable
chmod +x setup-env.sh start-dev.sh verify-setup.sh

# 3. Create environment files
./setup-env.sh

# 4. Verify setup
./verify-setup.sh

# 5. Start Docker Desktop (if not running)
# Then start all services
./start-dev.sh
```

## Access Points

Once running, you can access:

| Service         | URL                        | Description           |
| --------------- | -------------------------- | --------------------- |
| **Web App**     | http://localhost:3000      | Main web interface    |
| **Backend API** | http://localhost:3001/api  | REST API              |
| **API Docs**    | http://localhost:3001/docs | Swagger documentation |
| **Database**    | localhost:5433             | PostgreSQL database   |

### Database Credentials

- **Database**: loan_verification
- **User**: kowtha
- **Password**: devpass

## Daily Development

```bash
# Start all services
./start-dev.sh

# Press CTRL+C to stop all services
```

## Environment Files

**For local development, use `.env.local` files:**

- ✅ `apps/backend/.env.local` - Backend configuration
- ✅ `apps/web/.env.local` - Web frontend configuration
- ✅ `apps/mobile/.env.local` - Mobile app configuration

**Note:** `.env` files are for production only.

## Running Mobile App

After starting the services with `./start-dev.sh`:

### iOS (macOS only)

```bash
cd apps/mobile
npm run ios
```

### Android

```bash
cd apps/mobile
npm run android
```

**Important:** For Android Emulator, update `apps/mobile/.env.local`:

```bash
REACT_APP_BASE_URL=http://10.0.2.2:3001/api/
```

For physical devices, use your computer's IP address:

```bash
# Find your IP
ifconfig | grep "inet "

# Update .env.local
REACT_APP_BASE_URL=http://YOUR_IP_ADDRESS:3001/api/
```

## Common Commands

### Backend

```bash
cd apps/backend
npm run dev          # Start development server
npm run build        # Build for production
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create and apply migrations
```

### Web

```bash
cd apps/web
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

### Mobile

```bash
cd apps/mobile
npm start            # Start Metro bundler
npm run android      # Run on Android
npm run ios          # Run on iOS
npm test             # Run tests
```

### Database

```bash
# Start database
docker-compose up -d db

# Stop database
docker-compose down

# View logs
docker-compose logs db

# Access database shell
docker-compose exec db psql -U kowtha -d loan_verification

# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d db
cd apps/backend && npx prisma migrate deploy
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000 (Web)
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001 (Backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 8081 (Mobile)
lsof -ti:8081 | xargs kill -9
```

### Database Connection Error

1. Make sure Docker Desktop is running
2. Check database status: `docker-compose ps`
3. View database logs: `docker-compose logs db`
4. Restart database: `docker-compose restart db`

### Prisma Client Error

```bash
cd apps/backend
npx prisma generate
```

### Clean Reinstall

```bash
# Remove all dependencies
rm -rf apps/*/node_modules node_modules

# Remove lock files
rm apps/*/package-lock.json

# Reinstall
cd apps/backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

## Project Structure

```
kowtha/
├── apps/
│   ├── backend/      # NestJS API (Port 3001)
│   ├── web/          # Next.js Web App (Port 3000)
│   └── mobile/       # React Native App
├── project-data/
│   └── kowtha_dev_db_091025.sql  # Initial database dump
├── logs/             # Application logs (created on start)
├── setup-env.sh      # Create .env.local files
├── start-dev.sh      # Start all services
├── verify-setup.sh   # Check setup status
└── docker-compose.yml # Database configuration
```

## Getting Help

1. Check logs in `./logs/` directory
2. Run `./verify-setup.sh` to check configuration
3. Read [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) for detailed guide
4. Check individual app README files

## Important Notes

1. **Always use `.env.local`** for local development, not `.env`
2. **Database is auto-initialized** on first run with the SQL dump
3. **Backend must be running** before web and mobile can connect
4. **For mobile**: Different URLs for simulator vs physical device
5. **Logs are saved** in `./logs/` directory for debugging

## Verification Checklist

- [ ] Docker Desktop is running
- [ ] Environment files exist (`.env.local` in each app)
- [ ] Database is running (`docker-compose ps`)
- [ ] Backend is running (http://localhost:3001/api)
- [ ] Web is running (http://localhost:3000)
- [ ] Mobile Metro bundler is running

Run `./verify-setup.sh` to check automatically!

---

For detailed information, see [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)
