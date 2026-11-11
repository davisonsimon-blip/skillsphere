export type AlertLevelCode = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export interface SensorReading {
  timestamp: string;
  rainAnalog: number; // 0 (saturated wet) to 4095 (completely dry)
  rainDetected: boolean;
  rainIntensityPercent: number; // 0% dry -> 100% torrential
  rainStatus: 'Dry' | 'Moisture/Drops' | 'Moderate Rain' | 'Heavy Downpour';
  temperature: number; // Celsius
  humidity: number; // % RH
  pressure: number; // hPa
  pressureTrend: 'Falling Rapidly' | 'Falling Slowly' | 'Stable' | 'Rising';
  pressureDelta1h: number; // hPa drop/rise in 1 hour
  dewPoint: number;
  riskScore: number; // 0 to 100
  alertLevel: AlertLevelCode;
  forecastProbability: number; // % from weather API
}

export interface AlertLevelInfo {
  code: AlertLevelCode;
  name: 'Safe' | 'Watch' | 'Warning' | 'Severe';
  color: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
  triggerDescription: string;
  actionDescription: string;
  buzzerActive: boolean;
  smsTriggered: boolean;
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  level: AlertLevelCode;
  title: string;
  message: string;
  channels: ('DASHBOARD' | 'APP' | 'SMS' | 'BUZZER')[];
  recipients: string[];
  acknowledged: boolean;
}

export interface NodeStatus {
  nodeId: string;
  nodeName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  ipAddress: string;
  wifiRssi: number; // dBm e.g. -58 dBm
  batteryPercent: number;
  solarPowered: boolean;
  firmwareVersion: string;
  status: 'ONLINE' | 'TRANSMITTING' | 'OFFLINE';
  lastHeartbeat: string;
  packetsSent: number;
}

export interface ThresholdConfig {
  rainPlateSensitivity: number; // % threshold
  humidityWatchThreshold: number; // default 75%
  pressureDropThreshold: number; // default 1.5 hPa/hr
  buzzerEnabled: boolean;
  soundAlarmEnabled: boolean;
  autoSmsEnabled: boolean;
  subscriberPhones: { name: string; phone: string; role: string }[];
}

export interface PresentationSlide {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  contentBullets: string[];
  keyHighlight?: string;
  badge?: string;
}
