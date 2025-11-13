// scheduler.js - Tareas programadas para predicciones y alertas
const cron = require('node-cron');
const axios = require('axios');

// In-memory alerts store (replace with DB in production)
const recentAlerts = [];
const ALERT_THRESHOLD = 0.70; // 70% risk threshold

// Schedule predictions every 6 hours (0:00, 6:00, 12:00, 18:00)
function schedulePredictions() {
  cron.schedule('0 */6 * * *', async () => {
    console.log('[CRON] Generating periodic predictions...');
    await generatePredictionsForKeyLocations();
  });
  console.log('[CRON] Prediction scheduler started (every 6 hours)');
}

// Schedule volcano checks every hour
function scheduleVolcanoChecks() {
  cron.schedule('0 * * * *', async () => {
    console.log('[CRON] Checking volcano status...');
    // TODO: Call IGEPN API or external source to verify volcano status changes
    // If change detected, create an alert
  });
  console.log('[CRON] Volcano checker started (every hour)');
}

// Schedule alert cleanup (remove old alerts after 7 days)
function scheduleAlertCleanup() {
  cron.schedule('0 0 * * *', () => {
    console.log('[CRON] Cleaning up old alerts...');
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const originalLength = recentAlerts.length;
    
    for (let i = recentAlerts.length - 1; i >= 0; i--) {
      if (new Date(recentAlerts[i].createdAt) < sevenDaysAgo) {
        recentAlerts.splice(i, 1);
      }
    }
    console.log(`[CRON] Removed ${originalLength - recentAlerts.length} old alerts`);
  });
  console.log('[CRON] Alert cleanup scheduler started (daily at midnight)');
}

// Helper: generate predictions for key locations
async function generatePredictionsForKeyLocations() {
  // Key locations in Ecuador (Sierra region with volcanic/seismic activity)
  const keyLocations = [
    { name: 'Quito', lat: -0.1807, lon: -78.4678 },
    { name: 'Latacunga', lat: -0.9281, lon: -78.6119 },
    { name: 'Ambato', lat: -1.2392, lon: -78.6339 },
    { name: 'Riobamba', lat: -1.6734, lon: -78.6294 }
  ];

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.error('[CRON] OPENAI_API_KEY not configured');
    return;
  }

  for (const loc of keyLocations) {
    try {
      const prompt = `Genera una predicción de riesgo climático y volcánico para ${loc.name}, Ecuador (${loc.lat}, ${loc.lon}). 
Responde en JSON: { risk_level: "bajo|medio|alto", probability: 0-100, message: "texto corto", recommended_actions: ["acción1", "acción2"] }`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente de predicción climática. Responde siempre en JSON válido.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 300,
        temperature: 0.3
      }, {
        headers: { 'Authorization': `Bearer ${openaiKey}` }
      });

      const content = response.data?.choices?.[0]?.message?.content || '';
      let prediction = {};

      try {
        prediction = JSON.parse(content);
      } catch (e) {
        prediction = { raw: content, message: 'Predicción generada (formato no estructurado)' };
      }

      // Store prediction
      console.log(`[CRON] Prediction for ${loc.name}:`, prediction);

      // Create alert if risk is high
      if (prediction.probability && prediction.probability > ALERT_THRESHOLD * 100) {
        const alert = {
          id: `alert-${Date.now()}`,
          location: loc.name,
          riskLevel: prediction.risk_level || 'desconocido',
          probability: prediction.probability,
          message: prediction.message || 'Alerta automática generada',
          createdAt: new Date().toISOString(),
          actions: prediction.recommended_actions || []
        };
        recentAlerts.unshift(alert);
        console.log(`[CRON] HIGH RISK ALERT for ${loc.name}:`, alert);
      }
    } catch (err) {
      console.error(`[CRON] Error generating prediction for ${loc.name}:`, err.message);
    }
  }
}

// Public function to get recent alerts
function getRecentAlerts() {
  return recentAlerts.slice(0, 10); // Return last 10 alerts
}

module.exports = {
  schedulePredictions,
  scheduleVolcanoChecks,
  scheduleAlertCleanup,
  getRecentAlerts
};
