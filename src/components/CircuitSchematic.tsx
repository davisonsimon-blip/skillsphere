import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  DollarSign,
  CheckCircle2,
  Zap,
  Info,
  Maximize2,
  ChevronRight,
  ShieldCheck,
  Cable,
} from 'lucide-react';

interface ComponentSpec {
  id: string;
  name: string;
  subtitle: string;
  voltage: string;
  interfaceType: string;
  pinsUsed: string;
  unitPrice: number;
  description: string;
  wiringTips: string;
}

const COMPONENTS: ComponentSpec[] = [
  {
    id: 'esp32',
    name: 'ESP32 NodeMCU-32S',
    subtitle: 'Dual-Core Tensilica Xtensa 32-bit MCU @ 240MHz',
    voltage: '3.3V Logic / 5V USB VIN',
    interfaceType: 'Built-in 802.11 b/g/n Wi-Fi + BLE',
    pinsUsed: 'GPIO 21 (SDA), GPIO 22 (SCL), GPIO 34 (ADC1_CH6), GPIO 35 (DO), GPIO 25 (Buzzer), GPIO 18, 19, 23 (LEDs)',
    unitPrice: 4.5,
    description: 'Central microcontroller running the predictive rainfall algorithm, analog ADC sampling, I2C bus communication, and HTTP POST transmission to cloud REST API.',
    wiringTips: 'Power via micro-USB or 5V VIN pin. ADC1 channels (GPIO 32-39) are used because ADC2 is disabled when Wi-Fi is actively transmitting.',
  },
  {
    id: 'bme280',
    name: 'Bosch BME280 Sensor Module',
    subtitle: 'Precision Barometric Pressure, Relative Humidity & Temperature',
    voltage: '3.3V DC (Do not connect to 5V)',
    interfaceType: 'I2C Bus (Default Address: 0x76 or 0x77)',
    pinsUsed: 'VIN -> 3.3V, GND -> GND, SCL -> GPIO 22, SDA -> GPIO 21',
    unitPrice: 3.8,
    description: 'Provides barometric pressure (±1 hPa accuracy), humidity (±3% accuracy), and temperature. Enables early atmospheric front prediction before cloud condensation.',
    wiringTips: 'Always connect to the ESP32 3.3V rail. Pull-up resistors (4.7kΩ) are built into the breakout board.',
  },
  {
    id: 'rain-plate',
    name: 'FC-37 / YL-83 Rain Sensor Plate',
    subtitle: 'Nickel-plated Interdigitated Raindrop Detection Surface + LM393 Comparator',
    voltage: '3.3V - 5.0V DC',
    interfaceType: 'Dual Output: Analog Voltage (AO) + Digital Threshold (DO)',
    pinsUsed: 'VCC -> 3.3V, GND -> GND, AO -> GPIO 34 (ADC1), DO -> GPIO 35 (Input)',
    unitPrice: 1.8,
    description: 'Detects the physical arrival of precipitation droplets. As water bridges the conductive copper tracks, surface resistance decreases and analog voltage drops proportionally.',
    wiringTips: 'Mount plate at a 15°-20° tilt outdoors so droplets roll off naturally and dry after rainfall ceases.',
  },
  {
    id: 'buzzer',
    name: 'Active 5V Piezoelectric Buzzer',
    subtitle: 'High-Decibel (85dB @ 10cm) Acoustic Warning Transducer',
    voltage: '3.3V - 5V DC',
    interfaceType: 'Digital PWM / GPIO High-Low Trigger',
    pinsUsed: 'VCC (+) -> GPIO 25, GND (-) -> GND',
    unitPrice: 0.6,
    description: 'Emits distinct audio cadence: dual warning chirp on Orange Alert (2.2 kHz) and continuous emergency siren on Red Alert (2.8 kHz) for local field operators.',
    wiringTips: 'Observe polarity: the longer leg or marked (+) terminal must connect to ESP32 GPIO 25.',
  },
  {
    id: 'leds',
    name: 'Tri-Color LED Status Indicator Bank',
    subtitle: 'Green (Safe), Yellow (Watch), Red (Severe) 5mm Diffused LEDs',
    voltage: '2.0V - 3.2V (Forward Drop)',
    interfaceType: 'Digital Outputs with 3x 220Ω Current-Limiting Resistors',
    pinsUsed: 'Green -> GPIO 18, Yellow -> GPIO 19, Red -> GPIO 23, Cathodes -> GND',
    unitPrice: 0.5,
    description: 'Provides immediate visual confirmation of the 4-tier alert level even without internet connectivity or dashboard access.',
    wiringTips: 'Always place a 220Ω or 330Ω resistor in series with each LED anode to limit current to ~10mA per pin.',
  },
  {
    id: 'breadboard-wires',
    name: 'Prototyping Solderless Breadboard & Wires',
    subtitle: '400-tie Point Breadboard + 20cm Dupont Jumper Wires (M-M & M-F)',
    voltage: 'N/A',
    interfaceType: 'Passive Interconnect',
    pinsUsed: 'Common 3.3V Rail, Common Ground Bus',
    unitPrice: 2.0,
    description: 'Allows rapid lab testing, reconfigurability, and clean pin breakout without requiring custom PCB fabrication during development.',
    wiringTips: 'Keep I2C wire lengths under 30cm to avoid signal capacitive degradation.',
  },
  {
    id: 'power-supply',
    name: '5V Micro-USB Power Supply / 18650 Battery',
    subtitle: 'Standard 5V 1A Adapter or Single 18650 Li-ion Cell with TP4056 Charger',
    voltage: '5.0V DC regulated',
    interfaceType: 'Micro-USB Connector / VIN Rail',
    pinsUsed: 'USB Connector / ESP32 VIN & GND',
    unitPrice: 1.0,
    description: 'Powers the complete IoT node at ~80mA average current during active Wi-Fi transmission and < 15mA during sensor polling.',
    wiringTips: 'For field deployment, a 5V 1W mini solar panel connected to a TP4056 module provides indefinite 24/7 autonomous runtime.',
  },
];

const PINOUT_CONNECTIONS = [
  { pin: 'GPIO 34', component: 'Rain Plate AO', signal: 'Analog In (0-4095)', wire: 'Yellow', desc: 'Raindrop surface resistance ADC' },
  { pin: 'GPIO 35', component: 'Rain Plate DO', signal: 'Digital In', wire: 'Orange', desc: 'Hardware threshold trigger' },
  { pin: 'GPIO 21', component: 'BME280 SDA', signal: 'I2C Serial Data', wire: 'Blue', desc: 'Atmospheric telemetry stream' },
  { pin: 'GPIO 22', component: 'BME280 SCL', signal: 'I2C Serial Clock', wire: 'Green', desc: '100kHz I2C clock sync' },
  { pin: 'GPIO 25', component: 'Piezo Buzzer (+)', signal: 'Digital PWM Out', wire: 'Purple', desc: 'Acoustic siren frequency' },
  { pin: 'GPIO 18', component: 'Green LED (+)', signal: 'Digital Out (via 220Ω)', wire: 'Lime', desc: 'Level 1: Safe Status' },
  { pin: 'GPIO 19', component: 'Yellow LED (+)', signal: 'Digital Out (via 220Ω)', wire: 'Amber', desc: 'Level 2: Watch Status' },
  { pin: 'GPIO 23', component: 'Red LED (+)', signal: 'Digital Out (via 220Ω)', wire: 'Red', desc: 'Level 4: Severe Alarm' },
  { pin: '3V3 (Pin 1)', component: 'BME280 & Rain VCC', signal: '3.3V DC Power Rail', wire: 'Red', desc: 'Regulated sensor power' },
  { pin: 'GND (Pin 2/14)', component: 'Common Ground', signal: '0V Reference', wire: 'Black', desc: 'Ground return path' },
];

export const CircuitSchematic: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>('esp32');

  const selectedComp = COMPONENTS.find((c) => c.id === selectedCompId) || COMPONENTS[0];
  const totalBOMCost = COMPONENTS.reduce((sum, c) => sum + c.unitPrice, 0);

  return (
    <div className="space-y-8">
      {/* Overview & Interactive Visual Circuit Schematic */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
                PBT Hardware Architecture
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Total BOM: ${totalBOMCost.toFixed(2)} USD
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              Interactive ESP32 Circuit Schematic & Sensor Interface
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Click any hardware component below to inspect its pin connections, electrical properties, and wiring guidelines.
            </p>
          </div>

          {/* Quick Component Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {COMPONENTS.slice(0, 5).map((comp) => (
              <button
                key={comp.id}
                onClick={() => setSelectedCompId(comp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCompId === comp.id
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {comp.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Schematic Diagram (SVG-rendered) */}
        <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-6 border border-slate-800 relative overflow-x-auto">
          <div className="min-w-[700px] flex items-center justify-center py-6">
            <svg viewBox="0 0 850 420" className="w-full max-w-[850px] select-none">
              <defs>
                <linearGradient id="espGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="bmeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#075985" />
                </linearGradient>
                <linearGradient id="rainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#115e59" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Central Breadboard Outline */}
              <rect
                x="20"
                y="30"
                width="810"
                height="360"
                rx="16"
                fill="#0a0f1d"
                stroke="#1e293b"
                strokeWidth="2"
              />

              {/* Power Rail Lines */}
              <line x1="30" y1="45" x2="820" y2="45" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" />
              <text x="35" y="42" fill="#ef4444" fontSize="9" fontWeight="bold">
                +3.3V POWER RAIL
              </text>
              <line x1="30" y1="375" x2="820" y2="375" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" />
              <text x="35" y="388" fill="#3b82f6" fontSize="9" fontWeight="bold">
                COMMON GND RAIL
              </text>

              {/* --- ESP32 NodeMCU Module (Center) --- */}
              <g
                className="cursor-pointer transition-all"
                onClick={() => setSelectedCompId('esp32')}
              >
                <rect
                  x="310"
                  y="70"
                  width="230"
                  height="260"
                  rx="12"
                  fill="url(#espGrad)"
                  stroke={selectedCompId === 'esp32' ? '#38bdf8' : '#334155'}
                  strokeWidth={selectedCompId === 'esp32' ? '3' : '1.5'}
                  filter={selectedCompId === 'esp32' ? 'url(#glow)' : undefined}
                />
                {/* ESP32 Wi-Fi Antenna Trace */}
                <path
                  d="M 370 80 L 480 80 L 480 115 L 370 115 Z"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1"
                />
                <text x="425" y="102" fill="#94a3b8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ESP-WROOM-32
                </text>
                <text x="425" y="145" fill="#ffffff" fontSize="14" fontWeight="900" textAnchor="middle">
                  ESP32 DevKit V1
                </text>
                <text x="425" y="162" fill="#38bdf8" fontSize="10" textAnchor="middle">
                  Dual-Core 240MHz MCU
                </text>

                {/* Left Pinout Labels */}
                <text x="320" y="200" fill="#94a3b8" fontSize="9" fontFamily="monospace">GPIO 34 (ADC)</text>
                <text x="320" y="225" fill="#94a3b8" fontSize="9" fontFamily="monospace">GPIO 35 (DO)</text>
                <text x="320" y="250" fill="#94a3b8" fontSize="9" fontFamily="monospace">GPIO 21 (SDA)</text>
                <text x="320" y="275" fill="#94a3b8" fontSize="9" fontFamily="monospace">GPIO 22 (SCL)</text>

                {/* Right Pinout Labels */}
                <text x="530" y="200" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">GPIO 25 (Buzzer)</text>
                <text x="530" y="225" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">GPIO 18 (Green)</text>
                <text x="530" y="250" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">GPIO 19 (Yellow)</text>
                <text x="530" y="275" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="end">GPIO 23 (Red)</text>
              </g>

              {/* --- BME280 Module (Top Left) --- */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCompId('bme280')}
              >
                <rect
                  x="60"
                  y="70"
                  width="180"
                  height="110"
                  rx="10"
                  fill="url(#bmeGrad)"
                  stroke={selectedCompId === 'bme280' ? '#38bdf8' : '#0284c7'}
                  strokeWidth={selectedCompId === 'bme280' ? '3' : '1.5'}
                  filter={selectedCompId === 'bme280' ? 'url(#glow)' : undefined}
                />
                <text x="150" y="95" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                  BME280 Sensor
                </text>
                <text x="150" y="112" fill="#bae6fd" fontSize="9" textAnchor="middle">
                  I2C (0x76) • Temp/RH/Press
                </text>
                <rect x="75" y="125" width="150" height="42" rx="6" fill="#0c4a6e" />
                <text x="85" y="140" fill="#ffffff" fontSize="8" fontFamily="monospace">VIN: 3.3V  | GND: 0V</text>
                <text x="85" y="155" fill="#38bdf8" fontSize="8" fontFamily="monospace">SCL: G22   | SDA: G21</text>
              </g>

              {/* --- FC-37 Rain Drop Sensor Board (Bottom Left) --- */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCompId('rain-plate')}
              >
                <rect
                  x="60"
                  y="220"
                  width="180"
                  height="120"
                  rx="10"
                  fill="url(#rainGrad)"
                  stroke={selectedCompId === 'rain-plate' ? '#38bdf8' : '#0f766e'}
                  strokeWidth={selectedCompId === 'rain-plate' ? '3' : '1.5'}
                  filter={selectedCompId === 'rain-plate' ? 'url(#glow)' : undefined}
                />
                <text x="150" y="245" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                  FC-37 Rain Plate
                </text>
                <text x="150" y="262" fill="#a7f3d0" fontSize="9" textAnchor="middle">
                  Interdigitated Nickel Plate
                </text>
                <rect x="75" y="275" width="150" height="52" rx="6" fill="#134e4a" />
                <text x="85" y="292" fill="#ffffff" fontSize="8" fontFamily="monospace">VCC: 3.3V  | GND: 0V</text>
                <text x="85" y="307" fill="#facc15" fontSize="8" fontFamily="monospace">AO: GPIO 34 (Analog ADC)</text>
                <text x="85" y="320" fill="#fb923c" fontSize="8" fontFamily="monospace">DO: GPIO 35 (Comparator)</text>
              </g>

              {/* --- Buzzer Transducer (Top Right) --- */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCompId('buzzer')}
              >
                <circle
                  cx="680"
                  cy="125"
                  r="45"
                  fill="#1e1b4b"
                  stroke={selectedCompId === 'buzzer' ? '#38bdf8' : '#6366f1'}
                  strokeWidth={selectedCompId === 'buzzer' ? '3' : '1.5'}
                  filter={selectedCompId === 'buzzer' ? 'url(#glow)' : undefined}
                />
                <circle cx="680" cy="125" r="14" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
                <text x="680" y="185" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Active Piezo Buzzer
                </text>
                <text x="680" y="198" fill="#a5b4fc" fontSize="8" textAnchor="middle">
                  GPIO 25 (+) • 85dB Siren
                </text>
              </g>

              {/* --- Status LED Indicators (Bottom Right) --- */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCompId('leds')}
              >
                <rect
                  x="600"
                  y="230"
                  width="180"
                  height="110"
                  rx="10"
                  fill="#111827"
                  stroke={selectedCompId === 'leds' ? '#38bdf8' : '#374151'}
                  strokeWidth={selectedCompId === 'leds' ? '3' : '1.5'}
                  filter={selectedCompId === 'leds' ? 'url(#glow)' : undefined}
                />
                <text x="690" y="252" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Alert Status LEDs
                </text>

                {/* Green LED */}
                <circle cx="635" cy="280" r="10" fill="#10b981" />
                <text x="635" y="305" fill="#a7f3d0" fontSize="8" textAnchor="middle">G18</text>
                <text x="635" y="320" fill="#6ee7b7" fontSize="7" textAnchor="middle">Safe</text>

                {/* Yellow LED */}
                <circle cx="690" cy="280" r="10" fill="#f59e0b" />
                <text x="690" y="305" fill="#fde68a" fontSize="8" textAnchor="middle">G19</text>
                <text x="690" y="320" fill="#fcd34d" fontSize="7" textAnchor="middle">Watch</text>

                {/* Red LED */}
                <circle cx="745" cy="280" r="10" fill="#ef4444" />
                <text x="745" y="305" fill="#fecaca" fontSize="8" textAnchor="middle">G23</text>
                <text x="745" y="320" fill="#f87171" fontSize="7" textAnchor="middle">Alarm</text>
              </g>

              {/* Wire Connections (Curved Paths) */}
              {/* Rain Plate AO -> ESP32 GPIO 34 */}
              <path
                d="M 240 292 C 275 292, 275 200, 310 200"
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                strokeDasharray="4,2"
              />
              {/* BME280 SDA/SCL -> ESP32 GPIO 21/22 */}
              <path
                d="M 240 145 C 275 145, 275 250, 310 250"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <path
                d="M 240 155 C 280 155, 280 275, 310 275"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2.5"
              />

              {/* ESP32 GPIO 25 -> Buzzer */}
              <path
                d="M 540 200 C 590 200, 600 125, 635 125"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />
              {/* ESP32 LEDs */}
              <path
                d="M 540 225 C 570 225, 580 280, 625 280"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
              />
              <path
                d="M 540 250 C 570 250, 580 280, 680 280"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <path
                d="M 540 275 C 570 275, 580 280, 735 280"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Component Inspector & Detailed Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Selected Component Card (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Component Inspector
              </span>
              <h4 className="text-xl font-black text-white mt-2">{selectedComp.name}</h4>
              <p className="text-xs text-slate-400 font-medium">{selectedComp.subtitle}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ${selectedComp.unitPrice.toFixed(2)}
              </span>
              <div className="text-[10px] text-slate-400">Unit Cost (USD)</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
            {selectedComp.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Operating Voltage</div>
              <div className="text-xs font-mono font-bold text-sky-300 mt-1">{selectedComp.voltage}</div>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Protocol / Interface</div>
              <div className="text-xs font-mono font-bold text-emerald-300 mt-1">{selectedComp.interfaceType}</div>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">ESP32 Pin Mappings</div>
            <div className="text-xs font-mono text-white font-bold">{selectedComp.pinsUsed}</div>
          </div>

          <div className="bg-sky-950/30 rounded-2xl p-3.5 border border-sky-500/20 flex items-start gap-3">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-sky-300">Engineering & Wiring Guideline</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{selectedComp.wiringTips}</div>
            </div>
          </div>
        </div>

        {/* Bill of Materials (BOM) & Low-Cost Target Breakdown (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              Bill of Materials (BOM)
            </h4>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Target: &lt; $15.00
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Slide 7 engineering milestone: Deploying reliable early rain warning on a university lab and rural community budget.
          </p>

          <div className="space-y-2 pt-2">
            {COMPONENTS.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedCompId(item.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedCompId === item.id
                    ? 'bg-sky-500/15 border-sky-500/40 text-white'
                    : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                <div className="truncate max-w-[220px]">
                  <span className="font-bold text-slate-200">{item.name}</span>
                </div>
                <div className="font-mono font-bold text-emerald-400">
                  ${item.unitPrice.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Total System Hardware Cost</div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              ${totalBOMCost.toFixed(2)} <span className="text-xs text-slate-400">USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pinout Mapping Table */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-4">
        <h4 className="text-lg font-black text-white flex items-center gap-2">
          <Cable className="w-5 h-5 text-sky-400" />
          Full ESP32 Pinout Matrix & Wire Color Standard
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">ESP32 Pin</th>
                <th className="py-2.5 px-3">Target Component</th>
                <th className="py-2.5 px-3">Signal Type</th>
                <th className="py-2.5 px-3">Jumper Wire</th>
                <th className="py-2.5 px-3">Functional Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {PINOUT_CONNECTIONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-sky-400">{row.pin}</td>
                  <td className="py-2.5 px-3 font-sans text-white">{row.component}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.signal}</td>
                  <td className="py-2.5 px-3 font-sans">
                    <span className="inline-flex items-center gap-1.5 text-slate-200">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            row.wire === 'Red'
                              ? '#ef4444'
                              : row.wire === 'Black'
                              ? '#334155'
                              : row.wire === 'Yellow'
                              ? '#eab308'
                              : row.wire === 'Orange'
                              ? '#f97316'
                              : row.wire === 'Blue'
                              ? '#3b82f6'
                              : row.wire === 'Green' || row.wire === 'Lime'
                              ? '#22c55e'
                              : '#a855f7',
                        }}
                      ></span>
                      {row.wire}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-400">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
