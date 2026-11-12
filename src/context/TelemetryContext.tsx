import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  SensorReading,
  AlertLevelCode,
  AlertEvent,
  NodeStatus,
  ThresholdConfig,
} from '../types/rainAlert';
import { ALERT_LEVELS_INFO } from '../data/presentationSlides';
import { hardwareBuzzer } from '../utils/hardwareBuzzer';

interface TelemetryContextType {
  reading: SensorReading;
  history: Array<{
    timestamp: string;
    temperature: number;
    humidity: number;
    pressure: number;
    rainIntensity: number;
    riskScore: number;
    alertLevel: AlertLevelCode;
  }>;
  alerts: AlertEvent[];
  nodeStatus: NodeStatus;
  thresholds: ThresholdConfig;
  isSimulating: boolean;
  setIsSimulating: (active: boolean) => void;
  isBuzzerMuted: boolean;
  toggleBuzzerMute: () => void;
  testHardwareBuzzer: () => void;
  updateSensorValues: (updates: Partial<SensorReading>) => void;
  triggerScenario: (scenario: 'SUNNY' | 'WATCH' | 'WARNING' | 'DOWNPOUR') => void;
  acknowledgeAlert: (alertId: string) => void;
  clearAlerts: () => void;
  updateThresholds: (updates: Partial<ThresholdConfig>) => void;
  sendManualSms: (phone: string, text: string) => void;
  fetchLiveForecast: (city?: string) => Promise<void>;
  cityForecast: { city: string; forecastRisk: number; condition: string } | null;
}

const initialReading: SensorReading = {
  timestamp: new Date().toLocaleTimeString(),
  rainAnalog: 3840,
  rainDetected: false,
  rainIntensityPercent: 0,
  rainStatus: 'Dry',
  temperature: 28.6,
  humidity: 58.4,
  pressure: 1013.2,
  pressureTrend: 'Stable',
  pressureDelta1h: -0.2,
  dewPoint: 19.4,
  riskScore: 12,
  alertLevel: 'GREEN',
  forecastProbability: 15,
};

const initialNode: NodeStatus = {
  nodeId: 'ESP32-RAIN-01',
  nodeName: 'Campus Station Alpha (Block C)',
  location: 'Faculty of Engineering, Roof West',
  coordinates: { lat: 12.9716, lng: 77.5946 },
  ipAddress: '192.168.1.145',
  wifiRssi: -58,
  batteryPercent: 96,
  solarPowered: true,
  firmwareVersion: 'v2.4.1-PBT-Release',
  status: 'ONLINE',
  lastHeartbeat: 'Just now',
  packetsSent: 1582,
};

const initialThresholds: ThresholdConfig = {
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

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reading, setReading] = useState<SensorReading>(initialReading);
  const [alerts, setAlerts] = useState<AlertEvent[]>([
    {
      id: 'alt-demo-1',
      timestamp: '10:45 AM',
      level: 'YELLOW',
      title: 'Atmospheric Watch Initiated',
      message: 'Barometric pressure dropping at 1.4 hPa/hr with relative humidity climbing above 75%.',
      channels: ['DASHBOARD', 'APP'],
      recipients: ['Dr. Ramesh (Agronomist)', 'Student Transit Desk'],
      acknowledged: true,
    },
  ]);
  const [history, setHistory] = useState<any[]>(() => {
    // Generate initial realistic 15 points
    const points = [];
    const now = Date.now();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now - i * 4 * 60 * 1000);
      points.push({
        timestamp: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: +(28.2 + Math.sin(i * 0.4) * 0.8).toFixed(1),
        humidity: +(54.0 + i * 0.9).toFixed(1),
        pressure: +(1013.8 - i * 0.12).toFixed(1),
        rainIntensity: 0,
        riskScore: Math.min(100, Math.max(5, 10 + i * 2)),
        alertLevel: 'GREEN' as AlertLevelCode,
      });
    }
    return points;
  });

  const [nodeStatus, setNodeStatus] = useState<NodeStatus>(initialNode);
  const [thresholds, setThresholds] = useState<ThresholdConfig>(initialThresholds);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isBuzzerMuted, setIsBuzzerMuted] = useState<boolean>(false);
  const [cityForecast, setCityForecast] = useState<{ city: string; forecastRisk: number; condition: string } | null>({
    city: 'Local Region',
    forecastRisk: 25,
    condition: 'Partly Cloudy with Scattered Cells',
  });

  const prevAlertLevelRef = useRef<AlertLevelCode>('GREEN');

  // Trigger Hardware Piezo Buzzer sound when Alert Level changes to ORANGE or RED
  useEffect(() => {
    const current = reading.alertLevel;
    const prev = prevAlertLevelRef.current;
    prevAlertLevelRef.current = current;

    if (!isBuzzerMuted && thresholds.buzzerEnabled) {
      if (current === 'RED') {
        hardwareBuzzer.startSevereAlarm();
      } else if (current === 'ORANGE') {
        hardwareBuzzer.startWarningAlarm();
      } else {
        hardwareBuzzer.stop();
      }
    } else {
      hardwareBuzzer.stop();
    }
  }, [reading.alertLevel, isBuzzerMuted, thresholds.buzzerEnabled]);

  // Periodic Telemetry Simulator (runs smoothly every 3.5s for live presentation realism)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setReading((prev) => {
        // Add tiny realistic sensor noise
        const tempNoise = +(prev.temperature + (Math.random() - 0.5) * 0.1).toFixed(1);
        const humNoise = Math.min(99, Math.max(30, +(prev.humidity + (Math.random() - 0.5) * 0.2).toFixed(1)));
        const pressNoise = +(prev.pressure + (Math.random() - 0.5) * 0.05).toFixed(1);
        const nowStr = new Date().toLocaleTimeString();

        // Calculate dew point: T - ((100 - RH)/5)
        const dewPoint = +(tempNoise - ((100 - humNoise) / 5)).toFixed(1);

        // Calculate risk score
        const risk = calculateRisk(prev.rainIntensityPercent, humNoise, prev.pressureDelta1h, prev.forecastProbability, thresholds);
        const alertLevel = determineAlertLevel(prev.rainIntensityPercent, risk);

        // Check if level changed to trigger SMS
        if ((alertLevel === 'ORANGE' || alertLevel === 'RED') && prev.alertLevel !== alertLevel) {
          triggerSmsAlert(alertLevel, prev.rainIntensityPercent, humNoise, nowStr);
        }

        const updated = {
          ...prev,
          timestamp: nowStr,
          temperature: tempNoise,
          humidity: humNoise,
          pressure: pressNoise,
          dewPoint,
          riskScore: risk,
          alertLevel,
        };

        // Append to history
        setHistory((h) => [
          ...h.slice(-24),
          {
            timestamp: nowStr,
            temperature: updated.temperature,
            humidity: updated.humidity,
            pressure: updated.pressure,
            rainIntensity: updated.rainIntensityPercent,
            riskScore: updated.riskScore,
            alertLevel: updated.alertLevel,
          },
        ]);

        // Update node packets count
        setNodeStatus((n) => ({
          ...n,
          packetsSent: n.packetsSent + 1,
          lastHeartbeat: 'Just now',
        }));

        return updated;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSimulating, thresholds]);

  // Risk formula blending live plate, humidity, pressure drop rate, and forecast
  const calculateRisk = (
    rainIntensity: number,
    humidity: number,
    pressureDelta1h: number,
    forecastProb: number,
    cfg: ThresholdConfig
  ): number => {
    let score = 0;

    // 1. Rain Plate surface moisture (Weight: 45%)
    score += Math.round(rainIntensity * 0.45);

    // 2. Humidity component (Weight: 25%)
    if (humidity > cfg.humidityWatchThreshold) {
      score += Math.min(25, Math.round((humidity - cfg.humidityWatchThreshold) * 1.2));
    }

    // 3. Pressure drop rate gradient (Weight: 20%)
    if (pressureDelta1h > 0) {
      score += Math.min(20, Math.round(pressureDelta1h * 10));
    }

    // 4. Forecast API component (Weight: 10%)
    score += Math.round((forecastProb || 15) * 0.10);

    return Math.min(100, Math.max(0, score));
  };

  const determineAlertLevel = (rainIntensity: number, risk: number): AlertLevelCode => {
    if (rainIntensity >= 50 || risk >= 75) return 'RED';
    if (rainIntensity >= 15 || risk >= 50) return 'ORANGE';
    if (rainIntensity >= 2 || risk >= 25) return 'YELLOW';
    return 'GREEN';
  };

  const triggerSmsAlert = (level: AlertLevelCode, rainPct: number, hum: number, timeStr: string) => {
    const isRed = level === 'RED';
    const newAlert: AlertEvent = {
      id: `alt-${Date.now()}`,
      timestamp: timeStr,
      level,
      title: isRed ? '🚨 SEVERE RAIN ALARM' : '⚠️ ADVANCE RAIN WARNING (30-60m)',
      message: isRed
        ? `HEAVY DOWNPOUR DETECTED on Campus Station Alpha! Surface rain sensor at ${rainPct}%. Local buzzer active. Move harvests and outdoor assets inside immediately.`
        : `Atmospheric pressure dropping rapidly with ${hum}% relative humidity. Rain probability high. Plan transit before waterlogging.`,
      channels: isRed ? ['DASHBOARD', 'APP', 'SMS', 'BUZZER'] : ['DASHBOARD', 'APP', 'SMS'],
      recipients: thresholds.subscriberPhones.map((s) => `${s.name} (${s.phone})`),
      acknowledged: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  // 1-Click Presentation Test Scenarios for Evaluators
  const triggerScenario = (scenario: 'SUNNY' | 'WATCH' | 'WARNING' | 'DOWNPOUR') => {
    const nowStr = new Date().toLocaleTimeString();

    if (scenario === 'SUNNY') {
      updateSensorValues({
        rainAnalog: 3950,
        rainIntensityPercent: 0,
        rainStatus: 'Dry',
        rainDetected: false,
        temperature: 30.5,
        humidity: 48.0,
        pressure: 1014.5,
        pressureTrend: 'Stable',
        pressureDelta1h: -0.1,
        riskScore: 6,
        alertLevel: 'GREEN',
        forecastProbability: 5,
      });
    } else if (scenario === 'WATCH') {
      updateSensorValues({
        rainAnalog: 3700,
        rainIntensityPercent: 0,
        rainStatus: 'Dry',
        rainDetected: false,
        temperature: 27.2,
        humidity: 78.5,
        pressure: 1011.8,
        pressureTrend: 'Falling Slowly',
        pressureDelta1h: 1.4,
        riskScore: 38,
        alertLevel: 'YELLOW',
        forecastProbability: 40,
      });
    } else if (scenario === 'WARNING') {
      updateSensorValues({
        rainAnalog: 3100,
        rainIntensityPercent: 18,
        rainStatus: 'Moisture/Drops',
        rainDetected: true,
        temperature: 24.8,
        humidity: 88.0,
        pressure: 1008.2,
        pressureTrend: 'Falling Rapidly',
        pressureDelta1h: 2.6,
        riskScore: 64,
        alertLevel: 'ORANGE',
        forecastProbability: 75,
      });
      triggerSmsAlert('ORANGE', 18, 88.0, nowStr);
    } else if (scenario === 'DOWNPOUR') {
      updateSensorValues({
        rainAnalog: 1120,
        rainIntensityPercent: 88,
        rainStatus: 'Heavy Downpour',
        rainDetected: true,
        temperature: 22.4,
        humidity: 96.0,
        pressure: 1005.4,
        pressureTrend: 'Falling Rapidly',
        pressureDelta1h: 3.8,
        riskScore: 94,
        alertLevel: 'RED',
        forecastProbability: 95,
      });
      triggerSmsAlert('RED', 88, 96.0, nowStr);
    }
  };

  const updateSensorValues = (updates: Partial<SensorReading>) => {
    setReading((prev) => {
      const merged = { ...prev, ...updates, timestamp: new Date().toLocaleTimeString() };
      const dewPoint = +(merged.temperature - ((100 - merged.humidity) / 5)).toFixed(1);
      const risk = calculateRisk(merged.rainIntensityPercent, merged.humidity, merged.pressureDelta1h, merged.forecastProbability, thresholds);
      const alertLevel = determineAlertLevel(merged.rainIntensityPercent, risk);

      let rainStatus: SensorReading['rainStatus'] = 'Dry';
      if (merged.rainIntensityPercent > 55) rainStatus = 'Heavy Downpour';
      else if (merged.rainIntensityPercent > 15) rainStatus = 'Moderate Rain';
      else if (merged.rainIntensityPercent > 2) rainStatus = 'Moisture/Drops';

      return {
        ...merged,
        dewPoint,
        riskScore: risk,
        alertLevel,
        rainStatus,
        rainDetected: merged.rainIntensityPercent > 2,
      };
    });
  };

  const toggleBuzzerMute = () => {
    const next = !isBuzzerMuted;
    setIsBuzzerMuted(next);
    hardwareBuzzer.setMuted(next);
  };

  const testHardwareBuzzer = () => {
    hardwareBuzzer.testBuzzer();
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const updateThresholds = (updates: Partial<ThresholdConfig>) => {
    setThresholds((prev) => ({ ...prev, ...updates }));
  };

  const sendManualSms = (phone: string, text: string) => {
    const manualAlert: AlertEvent = {
      id: `sms-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level: reading.alertLevel,
      title: 'Manual SMS Broadcast',
      message: text,
      channels: ['SMS'],
      recipients: [`Direct Phone (${phone})`],
      acknowledged: true,
    };
    setAlerts((prev) => [manualAlert, ...prev]);
  };

  const fetchLiveForecast = async (cityName: string = 'Bengaluru') => {
    try {
      // Free public Open-Meteo API (zero API key needed)
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=12.97&longitude=77.59&current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&hourly=precipitation_probability');
      if (res.ok) {
        const data = await res.json();
        const prob = data.current?.precipitation_probability || 35;
        setCityForecast({
          city: cityName,
          forecastRisk: prob,
          condition: prob > 60 ? 'Rain Likely' : prob > 30 ? 'Overcast / Chance of Showers' : 'Clear Skies',
        });
        updateSensorValues({ forecastProbability: prob });
      }
    } catch (e) {
      // Fallback
      setCityForecast({
        city: cityName,
        forecastRisk: 28,
        condition: 'Scattered Cloud Clusters',
      });
    }
  };

  return (
    <TelemetryContext.Provider
      value={{
        reading,
        history,
        alerts,
        nodeStatus,
        thresholds,
        isSimulating,
        setIsSimulating,
        isBuzzerMuted,
        toggleBuzzerMute,
        testHardwareBuzzer,
        updateSensorValues,
        triggerScenario,
        acknowledgeAlert,
        clearAlerts,
        updateThresholds,
        sendManualSms,
        fetchLiveForecast,
        cityForecast,
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = () => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};

