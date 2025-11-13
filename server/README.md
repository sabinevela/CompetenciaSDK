# CompetenciaSDK - Backend Server

This is an Express.js backend supporting the CompetenciaSDK Expo app. It provides secure API endpoints for weather proxying, AI predictions, community feed, and volcano monitoring.

## Features

- **Weather Proxy** — secures OpenWeatherMap API key server-side
- **AI Predictions** — OpenAI ChatGPT integration for climate/volcano risk assessment
- **Community Feed** — post reports with geolocation
- **Volcano Monitoring** — Ecuador volcano data from IGEPN
- **Scheduled Alerts** — automatic risk predictions (every 6 hours) + cleanup jobs
- **Alert API** — retrieve recent high-risk alerts

## Quick Start

### 1. Install & Setup

```powershell
cd server
npm install
```

### 2. Create `.env` file

Copy `.env.example` and add your API keys:

```env
OPENWEATHER_KEY=your_openweathermap_key
OPENAI_API_KEY=sk-your-openai-key
PORT=4000
NODE_ENV=development
```

### 3. Start Server

```powershell
npm run start        # production
npm run dev          # development (auto-reload with nodemon)
```

Server runs on `http://localhost:4000`

## API Endpoints

### Weather Proxy
**GET** `/api/weather?lat=0&lon=0`

Request:
```bash
curl "http://localhost:4000/api/weather?lat=-0.1807&lon=-78.4678"
```

Response:
```json
{
  "main": { "temp": 18, "humidity": 65, "pressure": 1013 },
  "weather": [{ "main": "Clouds", "description": "partly cloudy" }],
  "wind": { "speed": 3.5 }
}
```

---

### Feed - Get Posts
**GET** `/api/feed`

Response:
```json
{
  "posts": [
    {
      "id": "uuid",
      "userName": "Kevin",
      "message": "Lluvia intensa en Quito",
      "coordinates": { "lat": -0.18, "lon": -78.47 },
      "createdAt": "2025-11-13T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### Feed - Create Post
**POST** `/api/feed`

Request:
```json
{
  "userName": "Kevin",
  "message": "Deslizamiento reportado en la avenida principal",
  "coordinates": { "lat": -0.18, "lon": -78.47 }
}
```

Response:
```json
{
  "success": true,
  "post": { "id": "uuid", "userName": "Kevin", ... }
}
```

---

### AI Prediction
**POST** `/api/predict`

Request:
```json
{
  "location": {
    "name": "Quito",
    "lat": -0.18,
    "lon": -78.47
  },
  "history": ["Deslizamiento el 15/11", "Lluvia el 14/11"],
  "notes": "Zona montañosa con pendiente pronunciada"
}
```

Response:
```json
{
  "result": {
    "risk_level": "alto",
    "probability": 85,
    "message": "Alto riesgo de inundaciones y deslizamientos en próximas 48 horas",
    "recommended_actions": ["evacuate", "alert_authorities", "secure_structures"]
  }
}
```

---

### Volcano Data
**GET** `/api/volcanoes`

Response:
```json
{
  "volcanoes": [
    {
      "id": "cotopaxi",
      "name": "Cotopaxi",
      "status": "activo",
      "latitude": -0.680,
      "longitude": -78.438,
      "altitude": 5897,
      "province": "Latacunga"
    },
    {
      "id": "tungurahua",
      "name": "Tungurahua",
      "status": "observacion",
      "latitude": -1.234,
      "longitude": -78.442,
      "altitude": 5016,
      "province": "Tungurahua"
    }
  ],
  "source": "IGEPN Ecuador",
  "count": 5
}
```

**Status values:** `activo` (red), `observacion` (orange), `dormido` (green)

---

### Alerts
**GET** `/api/alerts`

Response:
```json
{
  "alerts": [
    {
      "id": "alert-1234567890",
      "location": "Quito",
      "riskLevel": "alto",
      "probability": 85,
      "message": "Alto riesgo de inundaciones...",
      "createdAt": "2025-11-13T10:30:00Z",
      "actions": ["evacuate", "alert_authorities"]
    }
  ],
  "count": 1
}
```

## Scheduled Tasks (Cron Jobs)

The server runs 3 automatic background jobs:

| Task | Schedule | Description |
|------|----------|-------------|
| Predictions | Every 6 hours (0, 6, 12, 18 UTC) | AI risk predictions for Quito, Latacunga, Ambato, Riobamba |
| Volcano Check | Every hour | Checks volcano status (placeholder for IGEPN real-time API) |
| Alert Cleanup | Daily at 00:00 UTC | Removes alerts older than 7 days |

View logs in terminal when running `npm run dev`

## Environment Variables

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `OPENWEATHER_KEY` | ✅ | - | From openweathermap.org |
| `OPENAI_API_KEY` | ✅ | - | From platform.openai.com (sk-...) |
| `PORT` | ❌ | 4000 | Server port |
| `NODE_ENV` | ❌ | development | Set to `production` for deployment |

## Architecture

```
Client (Expo App)
      ↓
Express Backend (localhost:4000)
      ├─→ OpenWeatherMap API
      ├─→ OpenAI ChatGPT API
      ├─→ In-memory Feed Storage
      ├─→ Static Volcano Data (IGEPN)
      └─→ Node-cron Scheduler
            ├─ 6h Predictions
            ├─ 1h Volcano Checks
            └─ Daily Cleanup
```

## Production Checklist

- [ ] Move feed to persistent DB (Supabase, MongoDB, PostgreSQL)
- [ ] Add input validation (Joi, Zod)
- [ ] Enable rate-limiting (express-rate-limit)
- [ ] Use secrets manager (Heroku, Azure, Vercel)
- [ ] Enable HTTPS/TLS
- [ ] Add error tracking (Sentry)
- [ ] Monitor cron jobs
- [ ] Integrate real IGEPN API for volcano updates
- [ ] Add request logging (Morgan)
- [ ] Set up CI/CD (GitHub Actions)

## Deployment

See [`DEPLOYMENT.md`](../DEPLOYMENT.md) for:
- **Heroku** deployment
- **Vercel** deployment  
- **Azure** deployment
- **Troubleshooting**

Quick Heroku:
```powershell
heroku create my-competencia-app
heroku config:set OPENAI_API_KEY=sk-...
git push heroku main
```

## Technologies

- **Node.js 18+**
- **Express 4.18**
- **Axios** — HTTP requests
- **node-cron** — Scheduled tasks
- **dotenv** — Environment variables
- **CORS** — Cross-origin requests

## License

MIT — See LICENSE file
