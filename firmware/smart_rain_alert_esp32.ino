/*
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
#define BUZZER_PIN        18    // Active Piezo Buzzer
#define LED_GREEN_PIN     23    // Normal Status LED
#define LED_ORANGE_PIN    19    // Watch / Warning LED
#define LED_RED_PIN        5    // Severe Rain LED

// I2C Pins for BME280
#define I2C_SDA           21
#define I2C_SCL           22

// ---------------------- WI-FI & CLOUD CONFIG ----------------------
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Server Ingestion Endpoint (Update with your local PC IP or cloud URL)
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
  Serial.println("\n[SYSTEM BOOT] Initializing Smart Rain Alert System Node...");

  // Configure Pins
  pinMode(RAIN_ANALOG_PIN, INPUT);
  pinMode(RAIN_DIGITAL_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_ORANGE_PIN, OUTPUT);
  pinMode(LED_RED_PIN, OUTPUT);

  // Self-Test LEDs and Buzzer
  digitalWrite(LED_GREEN_PIN, HIGH);
  digitalWrite(LED_ORANGE_PIN, HIGH);
  digitalWrite(LED_RED_PIN, HIGH);
  digitalWrite(BUZZER_PIN, HIGH);
  delay(200);
  digitalWrite(BUZZER_PIN, LOW);
  digitalWrite(LED_GREEN_PIN, LOW);
  digitalWrite(LED_ORANGE_PIN, LOW);
  digitalWrite(LED_RED_PIN, LOW);

  // Initialize I2C and BME280
  Wire.begin(I2C_SDA, I2C_SCL);
  if (!bme.begin(0x76, &Wire)) {
    if (!bme.begin(0x77, &Wire)) {
      Serial.println("[ERROR] BME280 sensor not detected! Check wiring.");
    }
  } else {
    Serial.println("[OK] BME280 Environmental Sensor Online (Temp, Humidity, Pressure).");
    baselinePressure = bme.readPressure() / 100.0F;
    lastPressureReading = baselinePressure;
  }

  // Connect to Wi-Fi
  Serial.print("[CONNECTING] Wi-Fi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[OK] Connected to Wi-Fi Network.");
    Serial.print("Node IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[OFFLINE] Running in Autonomous Standalone Edge Mode.");
  }
}

void loop() {
  unsigned long now = millis();
  if (now - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    lastTelemetryTime = now;

    // 1. SENSE: Read Raw Sensors
    int rainRaw = analogRead(RAIN_ANALOG_PIN);
    bool rainDigital = (digitalRead(RAIN_DIGITAL_PIN) == LOW); // LOW indicates moisture on comparator
    
    float temperature = bme.readTemperature();
    float humidity = bme.readHumidity();
    float pressure = bme.readPressure() / 100.0F; // Convert Pa to hPa

    // Calculate Pressure Delta (Simulated or Real gradient)
    float pressureDelta = lastPressureReading - pressure;
    lastPressureReading = pressure;

    // Calculate Rain Intensity Percentage (0% Dry -> 100% Saturated)
    float rainIntensity = 0.0;
    if (rainRaw < RAIN_DRY_THRESHOLD) {
      rainIntensity = map(rainRaw, RAIN_DRY_THRESHOLD, 800, 0, 100);
      rainIntensity = constrain(rainIntensity, 0.0, 100.0);
    }

    // 2. PREDICT: Calculate Multi-Factor Rain Risk Score (0 - 100)
    int riskScore = 0;
    
    // Plate surface moisture contributes up to 50 points
    riskScore += (int)(rainIntensity * 0.50);

    // High humidity (>75%) adds up to 30 points
    if (humidity > 70.0) {
      riskScore += (int)((humidity - 70.0) * 1.0);
    }

    // Rapid barometric pressure drop adds up to 20 points
    if (pressureDelta > 0.5) {
      riskScore += (int)(pressureDelta * 15.0);
    }
    riskScore = constrain(riskScore, 0, 100);

    // 3. DECIDE: Map to 4 Alert Levels
    String alertLevel = "GREEN";
    if (rainIntensity > 50.0 || riskScore >= 75) {
      alertLevel = "RED"; // Severe Heavy Downpour
    } else if (riskScore >= 50 || rainIntensity > 15.0) {
      alertLevel = "ORANGE"; // Warning - Rain Imminent
    } else if (riskScore >= 25 || humidity > 75.0) {
      alertLevel = "YELLOW"; // Watch - Pressure Falling
    } else {
      alertLevel = "GREEN"; // Safe
    }

    // 4. ALERT: Actuate Local Hardware (LEDs & Buzzer)
    actuateLocalHardware(alertLevel);

    // Output Telemetry to Serial Monitor for Debugging
    Serial.printf("[TELEMETRY] Rain: %d (%.1f%%) | Temp: %.1fC | Hum: %.1f%% | Press: %.1fhPa | Risk: %d%% | Alert: %s\n",
                  rainRaw, rainIntensity, temperature, humidity, pressure, riskScore, alertLevel.c_str());

    // 5. COLLECT: Stream JSON payload to Cloud Backend
    if (WiFi.status() == WL_CONNECTED) {
      sendTelemetryToCloud(rainRaw, rainIntensity, temperature, humidity, pressure, riskScore, alertLevel);
    }
  }
}

// Controls local indicators (Green, Orange, Red LEDs and Piezo Buzzer)
void actuateLocalHardware(String level) {
  if (level == "RED") {
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_ORANGE_PIN, LOW);
    digitalWrite(LED_RED_PIN, HIGH);
    
    // Sound continuous/rapid alarm
    digitalWrite(BUZZER_PIN, HIGH);
    delay(100);
    digitalWrite(BUZZER_PIN, LOW);
  } else if (level == "ORANGE") {
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_ORANGE_PIN, HIGH);
    digitalWrite(LED_RED_PIN, LOW);

    // Intermittent warning beep
    digitalWrite(BUZZER_PIN, HIGH);
    delay(40);
    digitalWrite(BUZZER_PIN, LOW);
  } else if (level == "YELLOW") {
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_ORANGE_PIN, HIGH);
    digitalWrite(LED_RED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  } else {
    // Green Safe
    digitalWrite(LED_GREEN_PIN, HIGH);
    digitalWrite(LED_ORANGE_PIN, LOW);
    digitalWrite(LED_RED_PIN, LOW);
    digitalWrite(BUZZER_PIN, LOW);
  }
}

// Dispatches JSON telemetry payload to the Node.js / Cloud Server
void sendTelemetryToCloud(int rainAdc, float rainIntensity, float temp, float hum, float press, int risk, String level) {
  HTTPClient http;
  http.begin(serverEndpoint);
  http.addHeader("Content-Type", "application/json");

  // Construct JSON String
  String payload = "{";
  payload += "\"nodeId\":\"ESP32-NODE-01\",";
  payload += "\"rainAnalog\":" + String(rainAdc) + ",";
  payload += "\"rainIntensityPercent\":" + String(rainIntensity, 1) + ",";
  payload += "\"temperature\":" + String(temp, 1) + ",";
  payload += "\"humidity\":" + String(hum, 1) + ",";
  payload += "\"pressure\":" + String(press, 1) + ",";
  payload += "\"riskScore\":" + String(risk) + ",";
  payload += "\"alertLevel\":\"" + level + "\"";
  payload += "}";

  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    // Serial.printf("[CLOUD] Ingestion response code: %d\n", httpCode);
  } else {
    // Serial.printf("[CLOUD ERROR] Failed to send telemetry: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

