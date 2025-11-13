# CompetenciaSDK - API Testing Guide

This guide provides curl commands and step-by-step instructions to test all API endpoints.

## Prerequisites

1. Server running:
   ```powershell
   cd server && npm run dev
   ```
   Should see: `[CRON] Prediction scheduler started`

2. `.env` file configured with valid API keys

## Test Scenarios

### Scenario 1: Test Weather Proxy

**Objective:** Verify OpenWeatherMap integration is working

1. Get current location coordinates (example: Quito, Ecuador)
   - Latitude: -0.1807
   - Longitude: -78.4678

2. Request weather from proxy:
   ```powershell
   $response = Invoke-WebRequest -Uri "http://localhost:4000/api/weather?lat=-0.1807&lon=-78.4678" -Method GET
   $response.Content | ConvertFrom-Json | ConvertTo-Json
   ```

3. Verify response includes:
   - `main.temp` (temperature)
   - `main.humidity` (humidity %)
   - `weather[0].description` (weather condition)
   - `wind.speed` (wind speed)

**Expected outcome:** JSON with current weather data ✅

---

### Scenario 2: Test Community Feed

**Objective:** Test post creation and retrieval

#### 2a. Get empty feed
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/feed" -Method GET
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

Expected: `{ "posts": [], "count": 0 }`

#### 2b. Create a feed post
```powershell
$body = @{
    userName = "TestUser"
    message = "Lluvia intensa reportada en Quito"
    coordinates = @{
        lat = -0.1807
        lon = -78.4678
    }
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:4000/api/feed" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'} `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

Expected response:
```json
{
  "success": true,
  "post": {
    "id": "uuid",
    "userName": "TestUser",
    "message": "Lluvia intensa reportada en Quito",
    "coordinates": { "lat": -0.1807, "lon": -78.4678 },
    "createdAt": "2025-11-13T10:30:00Z"
  }
}
```

#### 2c. Retrieve feed (should have 1 post)
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/feed" -Method GET
$response.Content | ConvertFrom-Json | ConvertTo-Json
```

Expected: `{ "posts": [{ "id": "uuid", ... }], "count": 1 }`

#### 2d. Create multiple posts
```powershell
for ($i = 1; $i -le 3; $i++) {
    $body = @{
        userName = "User$i"
        message = "Reporte $i desde la app"
        coordinates = @{
            lat = -0.1807 + $i * 0.01
            lon = -78.4678
        }
    } | ConvertTo-Json

    Invoke-WebRequest -Uri "http://localhost:4000/api/feed" `
        -Method POST `
        -Headers @{'Content-Type' = 'application/json'} `
        -Body $body | Out-Null
    
    Start-Sleep -Milliseconds 500
}
```

**Expected outcome:** Feed contains 4 posts ✅

---

### Scenario 3: Test AI Prediction

**Objective:** Verify OpenAI integration for risk assessment

```powershell
$body = @{
    location = @{
        name = "Quito"
        lat = -0.1807
        lon = -78.4678
    }
    history = @(
        "Deslizamiento el 2025-11-10",
        "Lluvia intensa el 2025-11-05"
    )
    notes = "Zona montañosa con pendiente pronunciada, cerca de río"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:4000/api/predict" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'} `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

Expected response structure:
```json
{
  "result": {
    "risk_level": "alto|medio|bajo",
    "probability": 75,
    "message": "Detailed risk assessment...",
    "recommended_actions": ["evacuate", "alert_authorities", ...]
  }
}
```

**Verify:**
- `risk_level` is one of: `alto`, `medio`, `bajo`
- `probability` is 0-100
- `message` contains actionable information
- `recommended_actions` is array of strings

**Expected outcome:** Receives structured risk prediction from OpenAI ✅

---

### Scenario 4: Test Volcano Data

**Objective:** Verify volcano endpoint serves Ecuador data

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/volcanoes" -Method GET
$volcanoes = $response.Content | ConvertFrom-Json
$volcanoes | ConvertTo-Json -Depth 5
```

Expected response:
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
    ...
  ],
  "source": "IGEPN Ecuador",
  "count": 5
}
```

**Verify:**
- At least 5 volcanoes returned
- Each has: `id`, `name`, `status`, `latitude`, `longitude`, `altitude`, `province`
- Status values are: `activo`, `observacion`, or `dormido`
- Source is attributed to IGEPN

**Expected outcome:** Gets 5 Ecuador volcanoes with IGEPN attribution ✅

---

### Scenario 5: Test Alerts (Scheduled Task Output)

**Objective:** Verify alerts endpoint returns predicted risks

```powershell
$response = Invoke-WebRequest -Uri "http://localhost:4000/api/alerts" -Method GET
$alerts = $response.Content | ConvertFrom-Json
$alerts | ConvertTo-Json -Depth 5
```

Expected response (initially empty):
```json
{
  "alerts": [],
  "count": 0
}
```

**Note:** Alerts populate automatically when:
1. Scheduler runs prediction job (every 6 hours at 0, 6, 12, 18 UTC)
2. A prediction has probability > 70%

To test without waiting 6 hours, manually trigger in server code or wait for next scheduled run.

**Expected outcome:** Alerts endpoint accessible, returns empty array until scheduler runs ✅

---

### Scenario 6: Test Error Handling

#### 6a. Missing coordinates
```powershell
$body = @{
    location = @{ name = "Quito" }
    history = @()
    notes = ""
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/predict" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'} `
    -Body $body
```

Expected: 400 Bad Request or partial response with graceful fallback

#### 6b. Invalid weather coordinates
```powershell
Invoke-WebRequest -Uri "http://localhost:4000/api/weather?lat=999&lon=999"
```

Expected: 400 Bad Request or error message

#### 6c. Feed with missing fields
```powershell
$body = @{
    userName = "Test"
    # missing message and coordinates
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:4000/api/feed" `
    -Method POST `
    -Headers @{'Content-Type' = 'application/json'} `
    -Body $body
```

Expected: 400 Bad Request

**Expected outcome:** API gracefully handles errors ✅

---

## Automated Test Suite (Optional)

Create `test-api.ps1`:

```powershell
$baseUrl = "http://localhost:4000"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param([string]$name, [string]$method, [string]$endpoint, [hashtable]$body)
    
    try {
        $params = @{
            Uri = "$baseUrl$endpoint"
            Method = $method
        }
        if ($body) {
            $params.Headers = @{'Content-Type' = 'application/json'}
            $params.Body = $body | ConvertTo-Json
        }
        
        $response = Invoke-WebRequest @params
        Write-Host "✅ $name" -ForegroundColor Green
        $script:testsPassed++
        return $response
    }
    catch {
        Write-Host "❌ $name - $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $null
    }
}

Write-Host "`n🧪 CompetenciaSDK API Test Suite`n" -ForegroundColor Cyan

Test-Endpoint "GET /api/feed" "GET" "/api/feed" $null
Test-Endpoint "GET /api/volcanoes" "GET" "/api/volcanoes" $null
Test-Endpoint "GET /api/alerts" "GET" "/api/alerts" $null
Test-Endpoint "GET /api/weather" "GET" "/api/weather?lat=-0.18&lon=-78.47" $null

$feedBody = @{
    userName = "TestUser"
    message = "Test post"
    coordinates = @{ lat = -0.18; lon = -78.47 }
}
Test-Endpoint "POST /api/feed" "POST" "/api/feed" $feedBody

Write-Host "`n📊 Results: $testsPassed passed, $testsFailed failed`n" -ForegroundColor Cyan
```

Run:
```powershell
./test-api.ps1
```

---

## Load Testing (Optional - Apache Bench)

```bash
# Install Apache Bench (if not installed)
# Download from https://httpd.apache.org/download.cgi

# Test weather endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 "http://localhost:4000/api/weather?lat=-0.18&lon=-78.47"

# Test feed endpoint
ab -n 100 -c 10 "http://localhost:4000/api/feed"

# Test volcanes endpoint
ab -n 100 -c 10 "http://localhost:4000/api/volcanoes"
```

---

## Integration Testing (Frontend + Backend)

1. **Run both:**
   ```powershell
   # Terminal 1: Backend
   cd server && npm run dev
   
   # Terminal 2: Frontend
   npm start
   ```

2. **Test in Expo App:**
   - Go to Home screen → observe weather loads
   - Tap "Feed" → create post with location
   - Tap "Volcanes" → observe 5 volcanoes
   - Tap "Predict" → get AI risk assessment
   - Check alerts (if scheduler has run)

3. **Check Backend Logs:**
   - Should see POST requests logged
   - Cron job execution at scheduled times
   - No error traces in console

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Check server is running (`npm run dev`) |
| `Invalid API key` | Verify `.env` has valid OPENWEATHER_KEY and OPENAI_API_KEY |
| `CORS error` | Backend CORS is enabled by default; check browser console |
| `Empty feed` | Feed is in-memory; resets on server restart |
| `No alerts` | Wait for scheduler (6h cycle) or manually test `/api/predict` |
| `Weather returns null` | OpenWeatherMap API key invalid or rate-limited |

---

## Success Criteria

All tests pass when:
- ✅ Weather returns temperature, humidity, wind
- ✅ Feed stores and retrieves posts
- ✅ Predict returns risk assessment JSON
- ✅ Volcanoes returns 5 Ecuador volcanoes
- ✅ Alerts returns array (empty until scheduler runs)
- ✅ Error responses are graceful
- ✅ Frontend app connects to all endpoints

---

## Next Steps

After testing:
1. Deploy backend to production (see DEPLOYMENT.md)
2. Update `SERVER_URL` in frontend `src/config.ts`
3. Test end-to-end on mobile device
4. Monitor server logs for errors
5. Set up alerts/monitoring (Sentry, Datadog, etc.)
