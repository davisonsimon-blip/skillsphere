// =========================================================================================
// Smart Rain Alert System - Node.js Cloud Ingestion & Telemetry REST API
// Zero External Dependencies (Native Node.js HTTP Server)
// =========================================================================================

import http from 'node:http';

const PORT = process.env.PORT || 5000;

// In-Memory Telemetry State
let latestReading = {
  timestamp: new Date().toLocaleTimeString(),
  rainAnalog: 3850,
  rainDetected: false,
  rainIntensityPercent: 0,
  rainStatus: 'Dry',
  temperature: 28.4,
  humidity: 58.2,
  pressure: 1013.4,
  pressureTrend: 'Stable',
  pressureDelta1h: -0.2,
  dewPoint: 19.3,
  riskScore: 8,
  alertLevel: 'GREEN',
  forecastProbability: 15,
};

// 24-hour historical buffer for time-series charts
let historyLog = [];

// Seed realistic initial 12 points
const nowMs = Date.now();
for (let i = 12; i >= 0; i--) {
  const t = new Date(nowMs - i * 5 * 60 * 1000);
  historyLog.push({
    timestamp: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: +(28.0 + Math.sin(i) * 1.2).toFixed(1),
    humidity: +(55.0 + i * 1.1).toFixed(1),
    pressure: +(1014.2 - i * 0.15).toFixed(1),
    rainIntensity: 0,
    riskScore: Math.min(100, Math.max(5, Math.round(10 + i * 1.5))),
    alertLevel: 'GREEN',
  });
}

// Alert notifications history
let alertHistory = [
  {
    id: 'alt-init-1',
    timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    level: 'YELLOW',
    title: 'Atmospheric Watch Initiated',
    message: 'Barometric pressure dropping at 1.4 hPa/hr with humidity rising to 76%. Monitoring pre-condensation.',
    channels: ['DASHBOARD', 'APP'],
    recipients: ['Farmer Ram (Field Node 1)', 'Commuter John'],
    acknowledged: true,
  },
];

// Node Status
let nodeInfo = {
  nodeId: 'ESP32-RAIN-01',
  nodeName: 'Campus Weather Station Alpha',
  location: 'Faculty of Engineering, Block C Roof',
  coordinates: { lat: 12.9716, lng: 77.5946 },
  ipAddress: '192.168.1.145',
  wifiRssi: -58,
  batteryPercent: 94,
  solarPowered: true,
  firmwareVersion: 'v2.4.1-PBT-Release',
  status: 'ONLINE',
  lastHeartbeat: new Date().toLocaleTimeString(),
  packetsSent: 1420,
};

// Thresholds configuration
let thresholds = {
  rainPlateSensitivity: 60,
  humidityWatchThreshold: 75,
  pressureDropThreshold: 1.5,
  buzzerEnabled: true,
  soundAlarmEnabled: true,
  autoSmsEnabled: true,
  subscriberPhones: [
    { name: 'Dr. Ramesh (Agronomist)', phone: '+91 98450 11223', role: 'Farm Manager' },
    { name: 'Campus Facilities Lead', phone: '+91 98450 44556', role: 'Building & Drains' },
    { name: 'Student Transit Desk', phone: '+91 98450 77889', role: 'Commuter Alert' },
  ],
};

// Decision logic to calculate Risk Score & Alert Level
function computeAlertState(reading) {
  let risk = 0;
  
  // Rain plate saturation contributes heavily
  risk += Math.round(reading.rainIntensityPercent * 0.50);

  // Humidity above watch threshold
  if (reading.humidity > thresholds.humidityWatchThreshold) {
    risk += Math.round((reading.humidity - thresholds.humidityWatchThreshold) * 1.2);
  }

  // Barometric pressure drop
  if (reading.pressureDelta1h > thresholds.pressureDropThreshold) {
    risk += Math.round(reading.pressureDelta1h * 15);
  }

  // Regional forecast integration
  risk += Math.round((reading.forecastProbability || 20) * 0.15);
  risk = Math.min(100, Math.max(0, risk));

  let level = 'GREEN';
  let rainStatus = 'Dry';

  if (reading.rainIntensityPercent > 55 || risk >= 75) {
    level = 'RED';
    rainStatus = 'Heavy Downpour';
  } else if (reading.rainIntensityPercent > 15 || risk >= 50) {
    level = 'ORANGE';
    rainStatus = 'Moderate Rain';
  } else if (reading.rainIntensityPercent > 2 || risk >= 25) {
    level = 'YELLOW';
    rainStatus = 'Moisture/Drops';
  }

  return { riskScore: risk, alertLevel: level, rainStatus };
}

// HTTP Server
const server = http.createServer((req, res) => {
  // Set CORS Headers so Vite frontend or any browser can communicate
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // GET /api/status
  if (req.method === 'GET' && url.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ONLINE',
      uptimeSec: process.uptime(),
      node: nodeInfo,
      latestAlertLevel: latestReading.alertLevel,
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // GET /api/telemetry
  if (req.method === 'GET' && url.pathname === '/api/telemetry') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      latest: latestReading,
      history: historyLog.slice(-30),
      node: nodeInfo,
      thresholds,
    }));
    return;
  }

  // POST /api/telemetry (Incoming payload from physical ESP32 or simulation)
  if (req.method === 'POST' && url.pathname === '/api/telemetry') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const timeStr = new Date().toLocaleTimeString();

        // Update node heartbeat
        nodeInfo.lastHeartbeat = timeStr;
        nodeInfo.packetsSent += 1;
        if (payload.nodeId) nodeInfo.nodeId = payload.nodeId;
        if (payload.wifiRssi) nodeInfo.wifiRssi = payload.wifiRssi;

        // Merge incoming sensor values
        const merged = {
          ...latestReading,
          timestamp: timeStr,
          temperature: payload.temperature ?? latestReading.temperature,
          humidity: payload.humidity ?? latestReading.humidity,
          pressure: payload.pressure ?? latestReading.pressure,
          pressureDelta1h: payload.pressureDelta1h ?? latestReading.pressureDelta1h,
          rainAnalog: payload.rainAnalog ?? latestReading.rainAnalog,
          rainIntensityPercent: payload.rainIntensityPercent ?? latestReading.rainIntensityPercent,
          forecastProbability: payload.forecastProbability ?? latestReading.forecastProbability,
        };

        // Compute Dew Point: Td = T - ((100 - RH)/5)
        merged.dewPoint = +(merged.temperature - ((100 - merged.humidity) / 5)).toFixed(1);

        // Recalculate Risk & Alert Level
        const evaluated = computeAlertState(merged);
        merged.riskScore = evaluated.riskScore;
        merged.alertLevel = evaluated.alertLevel;
        merged.rainStatus = evaluated.rainStatus;
        merged.rainDetected = merged.rainIntensityPercent > 2;

        const previousLevel = latestReading.alertLevel;
        latestReading = merged;

        // Add to time-series history
        historyLog.push({
          timestamp: timeStr,
          temperature: merged.temperature,
          humidity: merged.humidity,
          pressure: merged.pressure,
          rainIntensity: merged.rainIntensityPercent,
          riskScore: merged.riskScore,
          alertLevel: merged.alertLevel,
        });
        if (historyLog.length > 50) historyLog.shift();

        // Log an alert event if level elevated to ORANGE or RED
        if ((merged.alertLevel === 'ORANGE' || merged.alertLevel === 'RED') && previousLevel !== merged.alertLevel) {
          const newAlert = {
            id: `alt-${Date.now()}`,
            timestamp: timeStr,
            level: merged.alertLevel,
            title: merged.alertLevel === 'RED' ? 'CRITICAL: Severe Downpour Detected' : 'WARNING: Rain Imminent (30m Notice)',
            message: merged.alertLevel === 'RED'
              ? `Sensor plate moisture ${merged.rainIntensityPercent}% with torrential rainfall active. Sounding perimeter buzzer and dispatching field alerts.`
              : `Atmospheric humidity at ${merged.humidity}% with rapid pressure drop. High convective storm probability flagged.`,
            channels: merged.alertLevel === 'RED' ? ['DASHBOARD', 'APP', 'SMS', 'BUZZER'] : ['DASHBOARD', 'APP', 'SMS'],
            recipients: thresholds.subscriberPhones.map(s => `${s.name} (${s.phone})`),
            acknowledged: false,
          };
          alertHistory.unshift(newAlert);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reading: latestReading }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // GET /api/alerts
  if (req.method === 'GET' && url.pathname === '/api/alerts') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(alertHistory));
    return;
  }

  // POST /api/alerts/clear
  if (req.method === 'POST' && url.pathname === '/api/alerts/clear') {
    alertHistory = [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Alert history cleared' }));
    return;
  }

  // POST /api/thresholds
  if (req.method === 'POST' && url.pathname === '/api/thresholds') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        thresholds = { ...thresholds, ...update };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, thresholds }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid config' }));
      }
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🌧️ Smart Rain Alert System - Telemetry API Ingestion Server`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`🔌 Ingestion Endpoint for ESP32: POST http://<YOUR_IP>:${PORT}/api/telemetry`);
  console.log(`================================================================`);
});
