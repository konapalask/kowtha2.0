# 🚀 Quick Development Tips

## ✅ Pre-filled Login Credentials (Development Only)

The mobile app now has **pre-filled credentials** for faster development:

- **Mobile**: `9912994742` (auto-filled)
- **OTP**: `122446` (auto-filled)

This only works in **development mode** (`__DEV__` flag). Production builds won't have these defaults.

---

## 🔄 Rebuild the App

After making code changes to the mobile app:

```bash
# Quick rebuild (if Metro is running)
cd apps/mobile
npm run android

# Full clean rebuild (if things are broken)
./clean-rebuild-android.sh
```

---

## 📱 Testing Flow

1. Open the app on emulator
2. Mobile number is already filled: `9912994742`
3. Click "Generate OTP"
4. OTP is already filled: `122446`
5. Click "Verify OTP"
6. ✅ Logged in!

---

## 🔧 Manual Rebuild Steps

If the script fails:

```bash
# 1. Stop Metro
pkill -f "react-native start"

# 2. Clean caches
cd apps/mobile
rm -rf android/.gradle android/app/build android/build
rm -rf node_modules/.cache

# 3. Uninstall app
adb uninstall com.beyondscale.kowthafi

# 4. Start Metro fresh
npm start -- --reset-cache &

# 5. Wait 10 seconds
sleep 10

# 6. Build and install
npm run android
```

---

## 📊 Check Service Status

```bash
# Check all services at once
./check-services.sh

# Individual checks
docker ps | grep kowtha-postgres  # Database
lsof -i:3001                       # Backend
lsof -i:3000                       # Web
lsof -i:8081                       # Mobile Metro
adb devices                        # Android emulator
```

---

## 🐛 Common Issues

### Mobile app stuck loading

- Check: `tail -f logs/mobile.log`
- Fix: `./clean-rebuild-android.sh`

### Backend not responding

- Check: `tail -f logs/backend.log`
- Fix: `docker-compose restart db`

### Database connection error

- Check: `docker ps | grep postgres`
- Fix: `docker-compose up -d db`

### Port conflicts

- Check: `lsof -i:3000,3001,8081`
- Fix: Kill processes or use `./start-dev.sh` (auto-cleanup)

---

## 💡 Pro Tips

1. **Keep logs open** in separate terminals:

   ```bash
   tail -f logs/backend.log
   tail -f logs/web.log
   tail -f logs/mobile.log
   ```

2. **Use OTP from backend logs**:

   ```bash
   tail -f logs/backend.log | grep "otp"
   ```

3. **Quick service restart**:

   ```bash
   ./start-dev.sh  # Starts everything with one command
   ```

4. **Check user permissions** in database:
   ```bash
   docker exec kowtha-postgres psql -U kowtha -d loan_verification \
     -c "SELECT mobile, name, \"defaultDepartment\" FROM \"User\" WHERE mobile = '9912994742';"
   ```

---

**Happy coding! 🎉**

