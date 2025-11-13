# CompetenciaSDK - Quick Start Guide

Get the app running in 5 minutes ⚡

## 1. Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Git** — [Download](https://git-scm.com/)
- **Expo CLI** — `npm install -g eas-cli`
- **Code Editor** — VS Code recommended
- **Mobile Device** — with Expo Go app (iOS/Android)

## 2. Clone & Install

```powershell
# Clone repository
git clone https://github.com/your-repo/CompetenciaSDK.git
cd CompetenciaSDK

# Install frontend
npm install

# Install backend
cd server
npm install
cd ..
```

**Estimated time:** 3-5 minutes

## 3. Configure API Keys

```powershell
# Copy template
Copy-Item server\.env.example server\.env

# Edit with your keys
code server\.env
```

**Get keys from:**
1. **OpenWeatherMap:**
   - Go to https://openweathermap.org/api
   - Sign up → API Keys section
   - Copy your default key

2. **OpenAI:**
   - Go to https://platform.openai.com/api-keys
   - Create new secret key
   - Copy (format: `sk-...`)

**File should look like:**
```env
OPENWEATHER_KEY=abc123def456...
OPENAI_API_KEY=sk_abc123def456...
PORT=4000
NODE_ENV=development
```

## 4. Start Backend

```powershell
cd server
npm run dev
```

**Expected output:**
```
Server running on http://localhost:4000
[CRON] Prediction scheduler started
✅ Backend ready
```

**Leave this terminal running** ← Important!

## 5. Start Frontend (New Terminal)

```powershell
npm start
```

**Expected output:**
```
Expo server is ready at http://localhost:19006
› Metro waiting on http://localhost:19006
› Press 's' to switch mode
› Press 'a' to open Android
› Press 'i' to open iOS
› Press 'w' to open web
› Press 'c' to clear cache
› Press 'q' to quit
```

## 6. Connect Device

### Option A: Physical Device
1. Install "Expo Go" app (iOS App Store / Google Play)
2. Open Expo Go app
3. Scan QR code from terminal
4. App opens on device ✅

### Option B: iOS Simulator
```powershell
# Press 'i' in the terminal
# Simulator opens automatically
```

### Option C: Android Emulator
```powershell
# Press 'a' in the terminal
# Emulator opens automatically
```

## 7. Verify It Works

### Frontend
- ✅ App opens to Login screen
- ✅ Tap "Register" → Create account
- ✅ Navigate to Home → See weather card
- ✅ Tap "Feed" → View community posts
- ✅ Tap "Volcanes" → See 5 Ecuador volcanoes

### Backend
- ✅ Terminal shows `GET /api/weather`
- ✅ Terminal shows `GET /api/volcanoes`
- ✅ No errors in console

## 8. Common Issues

| Issue | Solution |
|-------|----------|
| **"Cannot find module 'dotenv'"** | Run `cd server && npm install` |
| **"Port 4000 already in use"** | Change PORT in .env or kill process |
| **"Network request failed"** | Verify backend is running on port 4000 |
| **"Invalid API key"** | Check OPENWEATHER_KEY and OPENAI_API_KEY |
| **White screen on app** | Reload: press 'r' in terminal |
| **Emulator slow** | Close other apps, increase RAM allocation |

## 9. Next Steps

### Test the API
See [`TESTING.md`](./TESTING.md) for curl commands:
```powershell
# Test weather endpoint
curl "http://localhost:4000/api/weather?lat=-0.18&lon=-78.47"

# Test volcano endpoint
curl "http://localhost:4000/api/volcanoes"
```

### Explore the Code
Key files to understand:
- **Frontend:** `screens/FirstPage.tsx` (home screen)
- **Frontend:** `src/config.ts` (SERVER_URL configuration)
- **Backend:** `server/index.js` (API endpoints)
- **Backend:** `server/scheduler.js` (cron jobs)

### Make a Change
1. Edit a file (e.g., `screens/FirstPage.tsx`)
2. Save (Ctrl+S)
3. App auto-reloads on device
4. See your changes instantly ✨

### Read Documentation
- [`README.md`](./README.md) — Full project overview
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System design
- [`TESTING.md`](./TESTING.md) — API testing guide
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) — Production deployment
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — How to contribute

## 10. Useful Commands

### Frontend
```powershell
npm start          # Start dev server
npm run build      # Build for production
npm run web        # Open web version
npm test           # Run tests (when available)
```

### Backend
```powershell
npm run dev        # Start with auto-reload (nodemon)
npm run start      # Start production mode
npm test           # Run tests (when available)
```

### Database (Future)
```powershell
# When PostgreSQL is added:
npm run migrate    # Run database migrations
npm run seed       # Populate test data
```

## 11. Development Tips

### Hot Reload
- **Frontend:** Saves auto-reload (press 's' to restart)
- **Backend:** nodemon auto-restarts on file change
- **Device:** Changes appear in seconds

### Debug Mode
```powershell
# Backend logging
npm run dev       # See all API calls and cron jobs

# Frontend logging
# Open Expo Go → Menu (⌘+M on iOS) → Debug remote JS
```

### Database Inspection (Supabase)
1. Go to https://supabase.com/
2. Open CompetenciaSDK project
3. View users, posts, etc.

### Performance Profiling
```powershell
# Backend performance
# Check server logs for slow API calls
# Monitor CPU/memory: npm run dev

# Frontend performance
# Use React DevTools browser extension
# Profile with Expo Debugger
```

## 12. Project Structure at a Glance

```
CompetenciaSDK/
├── screens/              # App screens (11 total)
│   ├── FirstPage.tsx     # Home with weather
│   ├── FeedScreen.tsx    # Community posts
│   ├── VolcanoesScreen.tsx
│   ├── PredictScreen.tsx
│   └── ... (7 more)
│
├── src/
│   ├── config.ts         # SERVER_URL config
│   ├── services/         # API calls
│   └── contexts/         # Global state (Auth)
│
├── server/
│   ├── index.js          # Express app + 5 endpoints
│   ├── scheduler.js      # Cron jobs (predictions, cleanup)
│   ├── package.json
│   └── .env              # YOUR API keys (secret!)
│
├── README.md             # Full documentation
├── ARCHITECTURE.md       # System design
├── TESTING.md           # API test commands
├── DEPLOYMENT.md        # Production guide
└── CONTRIBUTING.md      # How to contribute
```

## 13. What Happens Next?

### When You Run the App

1. **Frontend (Expo):**
   - Loads screens
   - Connects to backend
   - Fetches weather data
   - Displays UI on device

2. **Backend (Express):**
   - Starts on port 4000
   - Loads API keys from .env
   - Initializes cron scheduler
   - Waits for requests

3. **Scheduled Tasks:**
   - Every 6 hours: Run AI predictions
   - Every hour: Check volcano status
   - Daily: Clean up old alerts

4. **User Interaction:**
   - User taps a button
   - Frontend calls `/api/endpoint`
   - Backend fetches external API
   - Response displayed on device

## 14. Troubleshooting Guide

### Problem: "Connection refused on localhost:4000"

**Cause:** Backend not running

**Fix:**
```powershell
# Terminal 1: Start backend
cd server
npm run dev

# Wait for "Server running on http://localhost:4000"
```

### Problem: "Invalid API key"

**Cause:** OPENAI_API_KEY or OPENWEATHER_KEY wrong

**Fix:**
```powershell
# Check .env file
type server\.env

# Verify keys from:
# - https://platform.openai.com/api-keys (for OpenAI)
# - https://openweathermap.org/api (for OpenWeather)

# Update and restart backend
code server\.env   # Edit
npm run dev        # Restart
```

### Problem: "Metro bundler times out"

**Cause:** System slow or cache corrupted

**Fix:**
```powershell
# Option 1: Clear cache
npm start -- --reset-cache

# Option 2: Kill and restart
Stop-Process -Name node -Force
npm start
```

## 15. Minimal Setup (No Device Needed)

For quick testing without a physical device:

```powershell
# Start just the backend
cd server
npm run dev

# In another terminal, test API with curl (see TESTING.md)
curl "http://localhost:4000/api/weather?lat=-0.18&lon=-78.47"
```

---

**🎉 You're all set! Start coding!**

Need help? Check:
- [`README.md`](./README.md) — Overview
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System design
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Development guide
- GitHub Issues — Known problems
