import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

const FIRMWARE_CODE = `/*
 * =========================================================================================
 * Project: Smart Rain Alert System - Low-Cost IoT Early-Warning System for Local Rainfall
 * Target Microcontroller: ESP32 DevKit V1
 * Sensors: BME280 (I2C), FC-37 / YL-83 Rain Drop Sensor Plate
 * Actuators: Active 5V Piezo Buzzer, Status LEDs
 * University Project-Based Training (PBT) Demonstration Firmware
 * =========================================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

// ---------------------- PIN DEFINITIONS ----------------------
#define RAIN_ANALOG_PIN   34    // ADC1_CH6 connected to Rain Sensor Analog OUT
#define RAIN_DIGITAL_PIN  35    // Connected to Rain Sensor Digital DO (Comparator)
#define BUZZER_PIN        25    // Active Piezo Buzzer (PWM / Digital)
#define LED_GREEN_PIN     18    // Normal Status LED
#define LED_ORANGE_PIN    19    // Watch / Warning LED
#define LED_RED_PIN       23    // Severe Rain LED

// I2C Pins for BME280
#define I2C_SDA           21
#define I2C_SCL           22

// ---------------------- WI-FI & CLOUD CONFIG ----------------------
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server Ingestion Endpoint (Update with local PC IP or cloud URL)
const char* serverEndpoint = "http://192.168.1.100:5000/api/telemetry";

// ---------------------- GLOBAL OBJECTS & STATE ----------------------
Adafruit_BME280 bme; // I2C address 0x76 or 0x77

// Calibration Thresholds
const int RAIN_DRY_THRESHOLD = 3200;      // Above 3200 ADC is completely dry
const int RAIN_HEAVY_THRESHOLD = 1500;    // Below 1500 ADC is heavy rain

float baselinePressure = 1013.25;
float lastPressureReading = 1013.25;
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 3000; // Sample every 3 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\\n[SYSTEM BOOT] Initializing Smart Rain Alert System Node...");

  // Configure Pins
  pinMode(RAIN_ANALOG_PIN, INPUT);
  pinMode(RAIN_DIGITAL_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_ORANGE_PIN, OUTPUT);
  pinMode(LED_RED_PIN, OUTPUT);

  // Initialize LEDs (All off initially)
  digitalWrite(LED_GREEN_PIN, LOW);
  digitalWrite(LED_ORANGE_PIN, LOW);
  digitalWrite(LED_RED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  // Boot Test Chirp
  tone(BUZZER_PIN, 2000, 150);

  // Initialize I2C Bus for BME280
  Wire.begin(I2C_SDA, I2C_SCL);
  if (!bme.begin(0x76, &Wire)) {
    Serial.println("[ERROR] Could not find a valid BME280 sensor at 0x76! Trying 0x77...");
    if (!bme.begin(0x77, &Wire)) {
      Serial.println("[CRITICAL] BME280 check failed. Check wiring!");
    }
  } else {
    Serial.println("[OK] BME280 sensor initialized successfully.");
  }

  // Connect to Wi-Fi
  connectWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  // Periodic Telemetry Transmission
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = millis();
    sampleAndTransmitSensors();
  }
}

void connectWiFi() {
  Serial.print("[WIFI] Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\\n[WIFI] Connected! Local IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("\\n[WIFI] Connection timeout. Running in standalone local alarm mode.");
  }
}

void sampleAndTransmitSensors() {
  // 1. Read Rain Sensor Plate
  int rainAnalogVal = analogRead(RAIN_ANALOG_PIN);
  int rainDigitalVal = digitalRead(RAIN_DIGITAL_PIN);

  // Convert analog reading (0 to 4095) to intensity percentage
  // Higher analog voltage = drier; lower = wetter
  float rainIntensityPercent = 0.0;
  if (rainAnalogVal < RAIN_DRY_THRESHOLD) {
    rainIntensityPercent = map(constrain(rainAnalogVal, 800, RAIN_DRY_THRESHOLD),
                               RAIN_DRY_THRESHOLD, 800, 5, 100);
  }

  // 2. Read BME280 Atmospheric Conditions
  float tempC = bme.readTemperature();
  float humidityPercent = bme.readHumidity();
  float pressureHpa = bme.readPressure() / 100.0F;

  // Calculate Barometric Pressure Gradient (drop over time)
  float pressureDrop = lastPressureReading - pressureHpa;
  lastPressureReading = pressureHpa;

  // 3. Multi-Metric Rain Risk Formulation
  float riskScore = 0.0;
  if (rainIntensityPercent > 0) riskScore += rainIntensityPercent * 0.6;
  if (humidityPercent > 70) riskScore += (humidityPercent - 70) * 1.5;
  if (pressureDrop > 0.5) riskScore += (pressureDrop * 15.0);
  riskScore = constrain(riskScore, 0.0, 100.0);

  // Determine Alert Level
  String alertLevel = "GREEN";
  if (riskScore >= 75 || rainIntensityPercent >= 60) {
    alertLevel = "RED";
  } else if (riskScore >= 50 || rainIntensityPercent >= 20) {
    alertLevel = "ORANGE";
  } else if (riskScore >= 25 || humidityPercent >= 75) {
    alertLevel = "YELLOW";
  }

  // 4. Update Hardware Indicators & Piezo Siren
  updateHardwareActuators(alertLevel);

  // 5. Serialize JSON Payload & Send HTTP POST to Cloud/Local Server
  if (WiFi.status() == WL_CONNECTED) {
    sendHTTPTelemetry(rainAnalogVal, rainIntensityPercent, tempC, humidityPercent, pressureHpa, riskScore, alertLevel);
  }
}

void updateHardwareActuators(String level) {
  if (level == "RED") {
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_ORANGE_PIN, LOW);
    digitalWrite(LED_RED_PIN, HIGH);
    tone(BUZZER_PIN, 2800, 600); // Continuous High-Pitch Siren
  } else if (level == "ORANGE") {
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_ORANGE_PIN, HIGH);
    digitalWrite(LED_RED_PIN, LOW);
    tone(BUZZER_PIN, 2200, 150); // Warning Chirp
  } else if (level == "YELLOW") {
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_ORANGE_PIN, HIGH);
    digitalWrite(LED_RED_PIN, LOW);
    noTone(BUZZER_PIN);
  } else {
    digitalWrite(LED_GREEN_PIN, HIGH);
    digitalWrite(LED_ORANGE_PIN, LOW);
    digitalWrite(LED_RED_PIN, LOW);
    noTone(BUZZER_PIN);
  }
}

void sendHTTPTelemetry(int rainAdc, float rainPct, float temp, float hum, float press, float risk, String level) {
  HTTPClient http;
  http.begin(serverEndpoint);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\\"nodeId\\":\\"ESP32-RAIN-01\\",";
  payload += "\\"rainAnalog\\":" + String(rainAdc) + ",";
  payload += "\\"rainIntensityPercent\\":" + String(rainPct, 1) + ",";
  payload += "\\"temperature\\":" + String(temp, 1) + ",";
  payload += "\\"humidity\\":" + String(hum, 1) + ",";
  payload += "\\"pressure\\":" + String(press, 1) + ",";
  payload += "\\"riskScore\\":" + String((int)risk) + ",";
  payload += "\\"alertLevel\\":\\"" + level + "\\"";
  payload += "}";

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    Serial.printf("[HTTP] POST Result: %d -> %s\\n", httpCode, level.c_str());
  } else {
    Serial.printf("[HTTP] POST Failed: %s\\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}`;

export const FirmwareViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'CODE' | 'GUIDE' | 'LIBRARIES'>('CODE');

  const handleCopy = () => {
    navigator.clipboard.writeText(FIRMWARE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadIno = () => {
    const element = document.createElement('a');
    const file = new Blob([FIRMWARE_CODE], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'smart_rain_alert_esp32.ino';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              ESP32 C++ Production Firmware
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              v2.4.1 • Arduino IDE Ready
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Embedded Node Firmware Source Code
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Complete Arduino C++ sketch implementing ADC sampling, I2C BME280 telemetry, multi-metric predictive formulation, and cloud HTTP POST.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-sky-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
            {copied ? 'Copied Code!' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownloadIno}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 text-xs font-black flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
          >
            <Download className="w-4 h-4" />
            Download .INO Sketch
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('CODE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'CODE'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Arduino C++ Code
        </button>
        <button
          onClick={() => setActiveTab('GUIDE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'GUIDE'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Flashing & Setup Guide
        </button>
        <button
          onClick={() => setActiveTab('LIBRARIES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'LIBRARIES'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Required Libraries
        </button>
      </div>

      {/* Tab 1: Code View */}
      {activeTab === 'CODE' && (
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>firmware/smart_rain_alert_esp32.ino</span>
            <span>220 lines • 7.4 KB</span>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[520px] overflow-y-auto">
            <code>{FIRMWARE_CODE}</code>
          </pre>
        </div>
      )}

      {/* Tab 2: Flashing Guide */}
      {activeTab === 'GUIDE' && (
        <div className="space-y-4 text-xs">
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black flex items-center justify-center text-xs">
                1
              </span>
              Install Arduino IDE & ESP32 Board Package
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Open Arduino IDE (v2.0 or newer). Navigate to <strong>File → Preferences</strong> and add the official Espressif board manager URL:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-sky-300 text-[11px] border border-slate-800 select-all">
              https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
            </div>
            <p className="text-slate-400">
              Then go to <strong>Tools → Board → Boards Manager</strong>, search for <code>esp32</code> by Espressif Systems, and click Install.
            </p>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black flex items-center justify-center text-xs">
                2
              </span>
              Configure WiFi Credentials & Local Server URL
            </h4>
            <p className="text-slate-300 leading-relaxed">
              In lines 30-34 of <code>smart_rain_alert_esp32.ino</code>, set your 2.4 GHz Wi-Fi SSID and password:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-slate-200 text-[11px] border border-slate-800">
              const char* ssid = "University_WiFi";<br />
              const char* password = "Password123";<br />
              const char* serverEndpoint = "http://192.168.1.145:5000/api/telemetry";
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-black flex items-center justify-center text-xs">
                3
              </span>
              Upload to ESP32 NodeMCU
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Connect your ESP32 via micro-USB. In Tools menu, select <strong>Board: ESP32 Dev Module</strong> and the corresponding COM port (e.g., COM3). Press <strong>Upload</strong>. Open Serial Monitor at <strong>115200 baud</strong> to view live sensor telemetry packets.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Required Libraries */}
      {activeTab === 'LIBRARIES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Adafruit BME280 Library</span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
                v2.2.2+
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Provides driver support for temperature, humidity, and barometric pressure over standard I2C (0x76 address).
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Install via Arduino Library Manager: Search "Adafruit BME280"</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Adafruit Unified Sensor</span>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
                v1.1.9+
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Base abstract class for Adafruit physical sensor drivers, providing standardized SI units and calibration headers.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Install via Arduino Library Manager: Search "Adafruit Unified Sensor"</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">WiFi.h & HTTPClient.h</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Built-in
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Core network stack bundled with the official ESP32 Arduino Core for socket management and HTTP 1.1 POST JSON dispatches.
            </p>
            <div className="text-[10px] text-slate-500 font-mono">No extra download needed. Included in ESP32 board package.</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Wire.h</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Built-in
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Hardware Two-Wire Interface (I2C) master controller handling communication with BME280 on SDA (GPIO 21) & SCL (GPIO 22).
            </p>
            <div className="text-[10px] text-slate-500 font-mono">Standard Arduino core library.</div>
          </div>
        </div>
      )}
    </div>
  );
};

