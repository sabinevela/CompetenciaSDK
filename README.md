# CompetenciaSDK 🏔️ - Innovación climática para Ecuador

**Aplicación móvil Expo (React Native) + Backend Node.js para monitoreo climático, alertas volcánicas y reportes comunitarios en Ecuador.**

> 🚀 Aplicación competencia: monitor de clima, predicciones IA y alertas sobre volcanes activos en la Sierra ecuatoriana.

## 🎯 Características principales

✅ **Autenticación:** Login/registro con Supabase  
✅ **Clima en tiempo real:** Integración OpenWeatherMap con geolocalización  
✅ **Predicción IA:** OpenAI GPT para generar predicciones de riesgo  
✅ **Feed comunitario:** Reportes de usuarios sobre lluvia, deslizamientos, etc.  
✅ **Volcanes activos:** Monitor de 5 volcanes ecuatorianos (Cotopaxi, Tungurahua, etc.)  
✅ **Tareas programadas:** Predicciones automáticas cada 6h, alertas de alto riesgo  
✅ **Educación:** Información sobre cambio climático y preparación ante desastres  
✅ **Planes de emergencia:** Checklists y contactos de emergencia  
✅ **Sostenibilidad:** Retos de acciones ecológicas  

---

## 📱 Pantallas de la app

| Pantalla | Descripción |
|----------|-----------|
| **Home (FirstPage)** | Clima actual, alertas activas, acciones rápidas (8 botones) |
| **Feed Comunitario** | Crea y visualiza reportes de otros usuarios con geolocalización |
| **Volcanes Activos** | Lista de volcanes con estado, altitud y ubicación |
| **Predicción IA** | Genera predicción de riesgo basada en IA para tu ubicación |
| **Mapa de Riesgos** | (Placeholder) Integración futura con Mapbox |
| **Plan de Emergencia** | Checklists, rutas de evacuación, contactos 911 |
| **Educación Climática** | Artículos sobre clima, volcanes, inundaciones |
| **Acciones Sostenibles** | Retos medioambientales y tracking de impacto |
| **Perfil** | Avatar, nombre, email, logout |

---

## 🏗️ Arquitectura técnica

### Frontend (Expo App)
- **Framework:** Expo 54, React Native, TypeScript
- **Navegación:** React Navigation (Stack Navigator)
- **Auth:** Supabase SDK
- **Estilos:** React Native StyleSheet + Linear Gradient
- **Icons:** Expo Icons (@expo/vector-icons)
- **Permisos:** Geolocalización (expo-location), cámara, galería

### Backend (Node.js + Express)
- **Runtime:** Node.js 16+
- **Framework:** Express 4.18
- **APIs:** OpenWeatherMap, OpenAI ChatGPT, IGEPN (volcanes)
- **Tareas cron:** node-cron (predicciones, alertas, limpieza)
- **Auth/DB:** Supabase (optional persistence)

### Flujo de datos

```
[App] → (HTTPS) → [Backend] → {OpenAI, OpenWeatherMap, IGEPN, Supabase}
         ↓
      config.ts
   (SERVER_URL)
```

---

## 🚀 Quick Start

### 1. Instalación

```bash
# Clonar
git clone https://github.com/sabinevela/CompetenciaSDK.git
cd CompetenciaSDK

# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Configuración

**Backend `.env`** (server/.env):
```
OPENWEATHER_KEY=tu_key_aqui
OPENAI_API_KEY=sk-tu-key-aqui
PORT=4000
```

**Frontend** (src/config.ts):
```typescript
export const SERVER_URL = 'http://localhost:4000';
// O tu IP si usas móvil: 'http://192.168.X.X:4000'
```

### 3. Ejecutar (2 terminales)

Terminal 1:
```bash
cd server && npm run start
```

Terminal 2:
```bash
npm start  # Expo
```

Abre la app en Expo Go, emulador Android/iOS, o web.

---

## 📚 Documentación detallada

| Documento | Contenido |
|-----------|-----------|
| [`server/README.md`](./server/README.md) | Endpoints API, ejemplos curl |
| [`server/.env.example`](./server/.env.example) | Variables de entorno requeridas |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Despliegue en Heroku, Vercel, Azure |
| [`src/config.ts`](./src/config.ts) | Configuración del cliente (SERVER_URL) |

---

## 🔐 Seguridad

⚠️ **IMPORTANTES:**

1. **Nunca** expongas API keys en el cliente. Usa backend proxy ✅ (implementado)
2. **Nunca** commits `.env` a Git. Usa `.gitignore`:
   ```
   server/.env
   .env
   .env.local
   ```
3. **Revoca** keys comprometidas inmediatamente en panel de OpenAI/OpenWeatherMap
4. **Valida** entrada en backend antes de llamar a OpenAI
5. **Rate-limit** endpoints para evitar abuso (futura mejora)

---

## 📋 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-----------|
| GET | `/api/weather?lat=X&lon=Y` | Clima por coordenadas (proxy OpenWeatherMap) |
| POST | `/api/predict` | Predicción IA (OpenAI GPT-3.5) |
| GET | `/api/feed` | Lista de reportes comunitarios |
| POST | `/api/feed` | Crear nuevo reporte |
| GET | `/api/volcanoes` | Lista de volcanes activos |
| GET | `/api/alerts` | Alertas generadas automáticamente |

---

## ⏰ Tareas programadas

El backend ejecuta 3 cron jobs automáticos:

| Tarea | Frecuencia | Acción |
|-------|-----------|--------|
| **Predicciones** | Cada 6h (0:00, 6:00, 12:00, 18:00 UTC) | Genera IA para 4 ubicaciones clave; crea alertas si riesgo > 70% |
| **Volcanes** | Cada hora | Verifica cambios de estado (stub, requiere IGEPN API) |
| **Limpieza alertas** | Diario a las 00:00 UTC | Elimina alertas > 7 días |

Ver alertas: `GET http://localhost:4000/api/alerts`

---

## 🗂️ Estructura del proyecto

```
CompetenciaSDK/
├── screens/
│   ├── FirstPage.tsx           # Home (clima + acciones rápidas)
│   ├── FeedScreen.tsx          # Feed comunitario
│   ├── VolcanoesScreen.tsx     # Monitor de volcanes
│   ├── PredictScreen.tsx       # Predicción IA
│   ├── MapaScreen.tsx          # Mapa de riesgos (placeholder)
│   ├── EducacionScreen.tsx     # Educación climática
│   ├── EmergenciaScreen.tsx    # Plan de emergencia
│   ├── AccionesScreen.tsx      # Acciones sostenibles
│   ├── LoginScreen.tsx         # Login
│   ├── RegisterScreen.tsx      # Registro
│   └── ProfileScreen.tsx       # Perfil usuario
├── navegacion/
│   └── Navigation.tsx          # Stack Navigator
├── security/
│   └── supabase.ts             # Config Supabase
├── src/
│   └── config.ts               # SERVER_URL
├── server/
│   ├── index.js                # Express app + endpoints
│   ├── scheduler.js            # Cron jobs
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── app.json                    # Config Expo
├── package.json
├── tsconfig.json
├── DEPLOYMENT.md               # Guía despliegue
└── README.md                   # Este archivo
```

---

## 🛠️ Tech Stack

### Frontend
- Expo 54 (React Native)
- TypeScript
- React Navigation
- Supabase (Auth)
- Expo Location (Geolocalización)
- Expo Image Picker (Fotos)
- Linear Gradient (UI)

### Backend
- Node.js 16+
- Express 4.18
- Axios (HTTP client)
- Dotenv (Config)
- node-cron (Tasks)
- CORS

### APIs externas
- OpenWeatherMap (Clima)
- OpenAI GPT-3.5-turbo (Predicciones IA)
- Supabase (Auth, Storage)
- IGEPN (Volcanes - datos hardcoded)

---

## 📦 Despliegue

### Desarrollo local
```bash
cd server && npm run start  # Backend
npm start                   # Frontend Expo
```

### Producción
Ver [`DEPLOYMENT.md`](./DEPLOYMENT.md) para:
- ✅ Heroku (recomendado para backend)
- ✅ Vercel (alternativa)
- ✅ Azure App Service
- ✅ GitHub Actions CI/CD

Ejemplo rápido (Heroku):
```bash
git init && git add . && git commit -m "initial"
heroku create my-app
heroku config:set OPENAI_API_KEY=sk-...
git push heroku main
```

---

## 🔄 Roadmap futuro

- [ ] Integración real con API IGEPN
- [ ] Push notifications (FCM)
- [ ] Persistencia del feed en DB (Supabase/MongoDB)
- [ ] Dashboard admin
- [ ] Tests automatizados
- [ ] Mapas interactivos (Mapbox)
- [ ] Modo offline
- [ ] Soporte para iOS/Android nativos (EAS build)

---

## 📄 Licencia

MIT License - Libre para usar y modificar

---

## 👥 Contribuidores

- **Kevin** (@sabinevela) - Desarrollador principal

---

## 📞 Soporte

- 📧 Email: kevincs44555@gmail.com
- 🐛 Issues: https://github.com/sabinevela/CompetenciaSDK/issues
- 📚 Docs: Ver [`DEPLOYMENT.md`](./DEPLOYMENT.md) y [`server/README.md`](./server/README.md)

---

**Hecho con ❤️ para la protección climática en Ecuador** 🇪🇨
