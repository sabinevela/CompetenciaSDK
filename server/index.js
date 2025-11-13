require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { schedulePredictions, scheduleVolcanoChecks, scheduleAlertCleanup, getRecentAlerts } = require('./scheduler');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Initialize scheduled tasks
schedulePredictions();
scheduleVolcanoChecks();
scheduleAlertCleanup();

// Simple in-memory feed store (replace with DB in production)
const feed = [];

app.get('/', (req, res) => {
  res.json({ message: 'CompetenciaSDK server running' });
});

// Weather proxy endpoint: GET /api/weather?lat=&lon=
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

    const key = process.env.OPENWEATHER_KEY;
    if (!key) return res.status(500).json({ error: 'OPENWEATHER_KEY not set on server' });

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&appid=${key}&units=metric&lang=es`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Error in /api/weather', err?.response?.data || err.message || err);
    res.status(502).json({ error: 'Failed to fetch weather data', details: err?.response?.data || err.message });
  }
});

// Simple feed endpoints: replace with persistent DB (Supabase/Firestore/MongoDB)
app.get('/api/feed', (req, res) => {
  res.json({ feed });
});

app.post('/api/feed', (req, res) => {
  const { userId, userName, message, lat, lon, type } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  const item = {
    id: String(Date.now()),
    userId: userId || 'anonymous',
    userName: userName || 'Anónimo',
    message,
    type: type || 'report',
    location: lat && lon ? { lat, lon } : null,
    createdAt: new Date().toISOString()
  };

  feed.unshift(item);
  res.status(201).json({ item });
});

// Volcanoes endpoint: fetch from IGEPN or return hardcoded active volcanoes
app.get('/api/volcanoes', async (req, res) => {
  try {
    // Hardcoded active volcanoes in Ecuador (Sierra region)
    // Source: IGEPN (Instituto Geofísico de la Escuela Politécnica Nacional)
    const volcanoes = [
      { 
        id: 'cotopaxi', 
        name: 'Cotopaxi', 
        status: 'activo', 
        lat: -0.680, 
        lon: -78.438, 
        altitude: 5897,
        province: 'Latacunga',
        lastUpdate: new Date().toISOString()
      },
      { 
        id: 'tungurahua', 
        name: 'Tungurahua', 
        status: 'activo', 
        lat: -1.211, 
        lon: -78.442, 
        altitude: 5016,
        province: 'Ambato',
        lastUpdate: new Date().toISOString()
      },
      { 
        id: 'chimborazo', 
        name: 'Chimborazo', 
        status: 'dormido', 
        lat: -1.469, 
        lon: -78.817, 
        altitude: 6263,
        province: 'Riobamba',
        lastUpdate: new Date().toISOString()
      },
      { 
        id: 'pichincha', 
        name: 'Pichincha', 
        status: 'activo', 
        lat: -0.359, 
        lon: -78.506, 
        altitude: 4784,
        province: 'Quito',
        lastUpdate: new Date().toISOString()
      },
      { 
        id: 'antisana', 
        name: 'Antisana', 
        status: 'observacion', 
        lat: -0.481, 
        lon: -78.175, 
        altitude: 5753,
        province: 'Napo',
        lastUpdate: new Date().toISOString()
      }
    ];

    // TODO: In production, fetch from IGEPN API: https://www.igepn.edu.ec/ (if available)
    // For now, return hardcoded data with current timestamp

    res.json({ volcanoes, source: 'IGEPN Ecuador' });
  } catch (err) {
    console.error('/api/volcanoes error', err);
    res.status(500).json({ error: 'Failed to fetch volcano data' });
  }
});

// AI predict endpoint: POST /api/predict
// Body: { location: {lat, lon, name}, history: [...], notes: 'optional notes' }
app.post('/api/predict', async (req, res) => {
  try {
    const { location, history, notes } = req.body;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' });

    // Build a concise prompt for the model. In production, sanitize and limit size.
    const userPrompt = `Eres un asistente climatológico especializado en Ecuador. Recibes estos datos en JSON:\n${JSON.stringify({ location, history, notes }, null, 2)}\n\nDevuelve un JSON con keys: risk_level (bajo/medio/alto), probability (0-100), message (texto corto), recommended_actions (array).`;

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'Eres un asistente que genera predicciones de riesgo climático y volcánico basadas en datos.' },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 400,
      temperature: 0.2
    };

    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const assistant = response.data?.choices?.[0]?.message?.content || '';

    // Try to parse assistant content as JSON; if fails, return raw text too
    let parsed = null;
    try {
      parsed = JSON.parse(assistant);
    } catch (e) {
      parsed = { raw: assistant };
    }

    res.json({ result: parsed });
  } catch (err) {
    console.error('/api/predict error', err?.response?.data || err.message || err);
    res.status(502).json({ error: 'AI prediction failed', details: err?.response?.data || err.message });
  }
});

// Alerts endpoint: GET recent alerts generated by scheduler
app.get('/api/alerts', (req, res) => {
  const alerts = getRecentAlerts();
  res.json({ alerts, count: alerts.length });
});

app.listen(PORT, () => {
  console.log(`CompetenciaSDK server listening on port ${PORT}`);
  console.log(`[INFO] Scheduled tasks initialized`);
  console.log(`[INFO] Available endpoints: /api/weather, /api/predict, /api/feed, /api/volcanoes, /api/alerts`);
});

// Agrega este endpoint en tu server/index.js (después de tu endpoint /api/predict)

app.post('/api/chat-weather', async (req, res) => {
  try {
    const { question, location } = req.body;

    if (!question || !location) {
      return res.status(400).json({ 
        error: 'Se requiere una pregunta y ubicación' 
      });
    }

    // 1. Obtener datos del clima actual y pronóstico
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${process.env.OPENWEATHER_KEY}&units=metric&lang=es`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // 2. Preparar contexto para ChatGPT
    const weatherContext = {
      ubicacion: weatherData.city.name,
      pais: weatherData.city.country,
      pronostico_5_dias: weatherData.list.slice(0, 8).map(item => ({
        fecha: new Date(item.dt * 1000).toLocaleDateString('es-ES', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        }),
        hora: new Date(item.dt * 1000).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        temperatura: Math.round(item.main.temp),
        sensacion_termica: Math.round(item.main.feels_like),
        descripcion: item.weather[0].description,
        humedad: item.main.humidity,
        viento: item.wind.speed,
        probabilidad_lluvia: item.pop * 100
      }))
    };

    // 3. Construir prompt para ChatGPT
    const prompt = `Eres un asistente meteorológico experto. Responde de manera natural y conversacional.

DATOS DEL CLIMA:
${JSON.stringify(weatherContext, null, 2)}

PREGUNTA DEL USUARIO: "${question}"

INSTRUCCIONES:
- Responde en español de forma clara y amigable
- Si preguntan por un día específico, busca en el pronóstico
- Incluye temperatura, condiciones y probabilidad de lluvia
- Si es relevante, da recomendaciones (llevar paraguas, abrigo, etc.)
- Sé conciso pero informativo (máximo 4-5 líneas)
- Si no tienes datos para el día exacto solicitado, ofrece el pronóstico más cercano disponible

Tu respuesta:`;

    // 4. Llamar a OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente meteorológico experto que responde preguntas sobre el clima de manera clara y amigable.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const openaiData = await openaiResponse.json();
    
    if (!openaiResponse.ok) {
      throw new Error(openaiData.error?.message || 'Error al procesar la respuesta de IA');
    }

    const aiResponse = openaiData.choices[0].message.content.trim();

    // 5. Analizar nivel de riesgo basado en el pronóstico más cercano
    const nextWeather = weatherData.list[0];
    let riskLevel = 'bajo';
    let probability = 20;

    if (nextWeather.pop > 0.7 || nextWeather.wind.speed > 15) {
      riskLevel = 'alto';
      probability = 80;
    } else if (nextWeather.pop > 0.4 || nextWeather.wind.speed > 10) {
      riskLevel = 'medio';
      probability = 50;
    }

    // 6. Responder con formato estructurado
    res.json({
      response: aiResponse,
      weather_data: {
        risk_level: riskLevel,
        probability: probability,
        temperature: Math.round(nextWeather.main.temp),
        description: nextWeather.weather[0].description,
        location: weatherData.city.name
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en chat-weather:', error);
    res.status(500).json({ 
      error: 'Error al procesar la consulta climática',
      details: error.message 
    });
  }
});