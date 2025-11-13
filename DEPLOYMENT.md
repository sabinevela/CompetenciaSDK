# CompetenciaSDK - Documentación de Despliegue

## Índice
1. [Arquitectura](#arquitectura)
2. [Requisitos previos](#requisitos-previos)
3. [Setup local](#setup-local)
4. [Despliegue en Heroku](#despliegue-en-heroku)
5. [Despliegue en Vercel](#despliegue-en-vercel)
6. [Despliegue en Azure](#despliegue-en-azure)
7. [Variables de entorno](#variables-de-entorno)
8. [Tareas programadas](#tareas-programadas)
9. [Troubleshooting](#troubleshooting)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                       Expo App (React Native)               │
│  Frontend: Quito, Ambato, Latacunga (ubicaciones usuarios)  │
│  Pantallas: Home, Feed, Volcanes, Predicción, Emergencia    │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTP/HTTPS)
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend (Node.js + Express)              │
│                                                              │
│  Endpoints:                                                  │
│  ├─ GET /api/weather?lat=X&lon=Y     → OpenWeatherMap       │
│  ├─ POST /api/predict                → OpenAI ChatGPT       │
│  ├─ GET|POST /api/feed               → In-memory (DB ready) │
│  ├─ GET /api/volcanoes               → IGEPN data           │
│  └─ GET /api/alerts                  → Scheduled alerts      │
│                                                              │
│  Scheduled Tasks:                                            │
│  ├─ Every 6h: Generate predictions (key locations)          │
│  ├─ Every 1h: Check volcano status                          │
│  └─ Daily: Clean up old alerts                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
    ┌─────────▼────────────┐  ┌────────▼──────────┐
    │  External APIs       │  │   Databases       │
    ├─ OpenWeatherMap     │  ├─ Supabase Auth    │
    ├─ OpenAI GPT-3.5     │  ├─ Supabase Storage │
    └─ IGEPN (volcanes)   │  └─ (Optional: DB)   │
```

---

## Requisitos previos

- **Node.js** 16+ y npm 8+
- **Expo CLI** (`npm install -g expo-cli`)
- **Cuentas:**
  - OpenWeatherMap API key (free tier ok)
  - OpenAI API key (requiere tarjeta de crédito)
  - Supabase proyecto (para autenticación)
  - Git + GitHub (para despliegue)

---

## Setup local

### 1. Clonar y configurar el proyecto

```bash
git clone https://github.com/sabinevela/CompetenciaSDK.git
cd CompetenciaSDK
npm install
```

### 2. Configurar servidor backend

```bash
cd server
npm install
```

Crear archivo `.env` (copia de `.env.example`):

```
OPENWEATHER_KEY=tu_openweathermap_key
OPENAI_API_KEY=sk-tu-openai-key
PORT=4000
```

### 3. Actualizar `src/config.ts` si usas dispositivo físico

Si ejecutas Expo en teléfono/tablet:

```typescript
// src/config.ts
export const SERVER_URL = 'http://192.168.X.X:4000'; // Tu IP local
```

Para obtener tu IP: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)

### 4. Ejecutar en desarrollo (2 terminales)

Terminal 1 - Backend:
```bash
cd server
npm run dev  # o npm run start
```

Terminal 2 - Frontend (Expo):
```bash
npm start
# o
npm run web   # para web
npm run android  # para Android (requiere Android Studio)
npm run ios   # para iOS (Mac)
```

---

## Despliegue en Heroku

### 1. Preparar proyecto para Heroku

```bash
# Crear Procfile en server/
echo "web: node index.js" > server/Procfile
```

### 2. Crear app en Heroku

```bash
npm install -g heroku
heroku login
heroku create competenciasdk-server
```

### 3. Configurar variables de entorno

```bash
heroku config:set OPENWEATHER_KEY=tu_key
heroku config:set OPENAI_API_KEY=sk-tu-key
heroku config:set PORT=5000
```

### 4. Deploy

```bash
# Desde la raíz del proyecto
git push heroku main
```

O si usas rama distinta:
```bash
git push heroku tu-rama:main
```

### 5. Actualizar frontend

En `src/config.ts`:
```typescript
export const SERVER_URL = 'https://competenciasdk-server.herokuapp.com';
```

### 6. Monitorear logs

```bash
heroku logs -t
```

---

## Despliegue en Vercel (servidor Node.js)

**Nota:** Vercel es mejor para frontend Expo (web). Para el backend, Heroku o Azure es más recomendado.

Si aún así quieres usar Vercel para el backend:

### 1. Crear `vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server/index.js"
    }
  ]
}
```

### 2. Deploy

```bash
npm install -g vercel
vercel
# Sigue los prompts
vercel env add OPENWEATHER_KEY
vercel env add OPENAI_API_KEY
vercel --prod
```

### 3. Actualizar cliente

En `src/config.ts`:
```typescript
export const SERVER_URL = 'https://tu-proyecto.vercel.app';
```

---

## Despliegue en Azure

### 1. Requisitos

- Cuenta Azure con créditos gratis o suscripción
- Azure CLI (`az`) instalado

### 2. Crear App Service

```bash
az login
az group create --name competenciasdk-rg --location eastus
az appservice plan create --name competenciasdk-plan --resource-group competenciasdk-rg --sku F1
az webapp create --resource-group competenciasdk-rg --plan competenciasdk-plan --name competenciasdk-server --runtime "node|18"
```

### 3. Configurar variables de entorno

```bash
az webapp config appsettings set --resource-group competenciasdk-rg --name competenciasdk-server --settings OPENWEATHER_KEY="tu_key" OPENAI_API_KEY="sk-key" PORT=80
```

### 4. Deploy desde Git

```bash
az webapp deployment source config --resource-group competenciasdk-rg --name competenciasdk-server --repo-url https://github.com/sabinevela/CompetenciaSDK --branch main --manual-integration
```

O usar GitHub Actions (recomendado para CI/CD automático).

### 5. Actualizar cliente

En `src/config.ts`:
```typescript
export const SERVER_URL = 'https://competenciasdk-server.azurewebsites.net';
```

---

## Variables de entorno

### Backend `.env`

```env
# OpenWeatherMap API (free tier: openweathermap.org)
OPENWEATHER_KEY=123456789abcdef...

# OpenAI API key (https://platform.openai.com/account/api-keys)
OPENAI_API_KEY=sk-proj-...

# Node environment
NODE_ENV=production

# Server port
PORT=4000
```

**IMPORTANTE:** Nunca commits `.env` a Git. Usa secrets manager en producción (Heroku, Vercel, Azure, GitHub Secrets).

---

## Tareas programadas

El servidor incluye 3 tareas cron automáticas:

### 1. Predicciones periódicas (cada 6 horas)

```
00:00, 06:00, 12:00, 18:00 UTC
```

Genera predicciones IA para:
- Quito
- Latacunga
- Ambato
- Riobamba

Si el riesgo > 70%, crea una alerta automática.

### 2. Verificación de volcanes (cada hora)

```
Cada hora en :00
```

Intenta conectar con IGEPN para detectar cambios de estado. Actualmente es un stub; requiere integración con API oficial de IGEPN.

### 3. Limpieza de alertas (diariamente)

```
00:00 UTC (medianoche)
```

Elimina alertas más antiguas de 7 días.

### Ver alertas generadas

```bash
curl http://localhost:4000/api/alerts
```

Respuesta:
```json
{
  "alerts": [
    {
      "id": "alert-1234567890",
      "location": "Quito",
      "riskLevel": "alto",
      "probability": 85,
      "message": "Riesgo de inundación en zonas bajas...",
      "createdAt": "2025-11-13T10:30:00Z",
      "actions": ["evacuate", "alert_authorities"]
    }
  ],
  "count": 1
}
```

---

## Troubleshooting

### Error: "Network request failed"

**Síntoma:** Expo no puede conectar al backend.

**Solución:**
1. Verifica que el servidor está corriendo: `npm run start` en `server/`
2. Si usas emulador/teléfono, actualiza `src/config.ts` con tu IP local
3. Abre firewall: en Windows, permite acceso al puerto 4000

### Error: "OPENAI_API_KEY not set"

**Solución:**
1. Crea `.env` en `server/`
2. Añade `OPENAI_API_KEY=sk-...`
3. Reinicia el servidor

### Error: "Cannot find module 'node-cron'"

**Solución:**
```bash
cd server
npm install node-cron
```

### Predicciones no se generan

**Síntoma:** Logs no muestran `[CRON] Generating predictions...`

**Solución:**
1. Verifica que `node-cron` está instalado
2. Comprueba que `OPENAI_API_KEY` es válido
3. Revisa logs: `npm run dev` para ver errores en tiempo real

### Conexión a Supabase desde app pero backend falla

**Solución:** El backend y frontend usan Supabase de forma independiente.
- Frontend: usa SDK de Supabase directamente para auth/storage
- Backend: puede conectarse a Supabase si se requiere persistencia del feed (actualmente en memoria)

Para persistencia, actualiza `server/index.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
```

---

## Next Steps (Roadmap)

- [ ] Integración real con API IGEPN
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Persistencia del feed en Supabase/MongoDB
- [ ] Dashboard admin (visualizar alertas)
- [ ] Tests automatizados (Jest)
- [ ] CI/CD con GitHub Actions
- [ ] Mapas interactivos (Mapbox/Leaflet)
- [ ] Soporte offline

---

## Contacto & Soporte

- **Repo:** https://github.com/sabinevela/CompetenciaSDK
- **Issues:** Abre un issue en GitHub
- **Docs:** Revisa este README y `server/README.md`
