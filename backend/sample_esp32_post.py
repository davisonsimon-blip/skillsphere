"""
Smart Rain Alert System - ESP32 Hardware Telemetry Simulator
Sends simulated or real serial sensor data to the local cloud API.
Run with: python backend/sample_esp32_post.py
"""

import urllib.request
import json
import time
import random

SERVER_URL = "http://localhost:5000/api/telemetry"

print("==================================================")
print("🌧️ Starting Simulated ESP32 Telemetry Transmitter")
print(f"Target Endpoint: {SERVER_URL}")
print("Press Ctrl+C to terminate transmission.")
print("==================================================")

# Initial conditions (Pre-rain building up)
temp = 29.5
hum = 62.0
press = 1013.8
rain_pct = 0.0

try:
    step = 0
    while True:
        step += 1
        
        # Simulate realistic weather cycle:
        # Steps 1-5: Clear day
        # Steps 6-12: Pressure drops, humidity increases (Warning state)
        # Steps 13-20: Rain drops start on plate (Severe state)
        if step < 6:
            state = "Clear / Dry"
            hum = max(50.0, hum + random.uniform(-0.5, 0.5))
            press = 1013.5 + random.uniform(-0.2, 0.2)
            rain_pct = 0.0
        elif step < 13:
            state = "Storm Gathering (Pressure Falling)"
            hum = min(92.0, hum + 3.2)
            press = max(1006.0, press - 0.9)
            rain_pct = 0.0
        else:
            state = "Downpour Active (Rain Plate Wet)"
            hum = 95.0
            press = 1005.2 + random.uniform(-0.3, 0.3)
            rain_pct = min(100.0, rain_pct + 18.0)
            if step > 22:
                step = 0 # reset cycle

        rain_analog = int(4000 - (rain_pct / 100.0) * 3200)

        payload = {
            "nodeId": "ESP32-DEV-SIM",
            "temperature": round(temp, 1),
            "humidity": round(hum, 1),
            "pressure": round(press, 1),
            "pressureDelta1h": round(1013.5 - press, 2),
            "rainAnalog": rain_analog,
            "rainIntensityPercent": round(rain_pct, 1),
            "forecastProbability": 80 if step >= 6 else 15,
            "wifiRssi": random.randint(-62, -54)
        }

        req = urllib.request.Request(
            SERVER_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        try:
            with urllib.request.urlopen(req, timeout=3) as response:
                result = json.loads(response.read().decode())
                current_level = result["reading"]["alertLevel"]
                risk = result["reading"]["riskScore"]
                print(f"[Packet #{step:03d}] {state:<32} | Rain: {rain_pct:4.1f}% | Press: {press:.1f}hPa | Risk: {risk:2d}% | Alert: {current_level}")
        except Exception as e:
            print(f"[Connection Error] Is backend server running on port 5000? ({e})")

        time.sleep(3)

except KeyboardInterrupt:
    print("\nTransmission stopped.")

