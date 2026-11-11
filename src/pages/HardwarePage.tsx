import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  BatteryCharging,
  Sun,
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Code2,
  DollarSign,
  Maximize2,
} from 'lucide-react';
import { CircuitSchematic } from '../components/CircuitSchematic';

export const HardwarePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Slide 7 & 8 Hardware Architecture
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Low-Cost Edge Design (&lt; $15)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Hardware Engineering, Pinout & Circuit Schematic
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Detailed electronic component selection, ESP32 GPIO routing, sensor interfaces, and off-grid solar power architecture.
          </p>
        </div>

        <Link
          to="/firmware"
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Code2 className="w-4 h-4" />
          View Arduino Firmware
        </Link>
      </div>

      {/* Interactive Circuit Schematic Component */}
      <CircuitSchematic />

      {/* Field Deployment & Enclosure Engineering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enclosure & Environmental Protection Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-black text-white">
              Field Housing & Environmental Packaging (IP65)
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In harsh outdoor conditions, sensors face heat, dust, and continuous moisture. The system incorporates deliberate mechanical packaging techniques:
          </p>

          <div className="space-y-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                15° Angled Rain Sensor Mount
              </div>
              <p className="text-slate-400 leading-relaxed">
                Mounting the FC-37 plate at a 15-20° pitch prevents water pooling, allowing droplets to roll off naturally and dry rapidly once precipitation subsides.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                PTFE Breathable Membrane Vent
              </div>
              <p className="text-slate-400 leading-relaxed">
                The BME280 barometric chamber is shielded inside the enclosure with an ePTFE micro-porous membrane that allows air pressure and humidity equalization while blocking liquid water ingress.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Anti-Corrosion Duty Cycling
              </div>
              <p className="text-slate-400 leading-relaxed">
                Rather than powering the rain plate continuously (which causes electrolytic nickel corrosion), the ESP32 powers the sensor via a GPIO high pulse only during sampling intervals.
              </p>
            </div>
          </div>
        </div>

        {/* Off-Grid Solar & Battery Power Architecture */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-4">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-black text-white">
              Autonomous Solar Power Harvesting Subsystem
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Designed for remote agricultural fields, bus stops, and university rooftops with zero dependence on mains electricity:
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">18650 Li-ion Cell</div>
              <div className="text-sm font-bold text-white mt-1">3.7V 2600 mAh</div>
              <div className="text-[11px] text-slate-400 mt-0.5">38 hours runtime without sun</div>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Solar Collector</div>
              <div className="text-sm font-bold text-white mt-1">5V 1.5W Panel</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Full recharge in 4 hrs daylight</div>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Charge Controller</div>
              <div className="text-sm font-bold text-white mt-1">TP4056 Module</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Overcharge & short protection</div>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Power Draw</div>
              <div className="text-sm font-bold text-emerald-400 mt-1">68 mA @ 3.3V</div>
              <div className="text-[11px] text-slate-400 mt-0.5">ESP32 active Wi-Fi burst</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
            <strong>100% Carbon-Neutral Operation:</strong> The prototype has been verified to operate continuously through 4 consecutive overcast monsoon days on a single battery charge cycle.
          </div>
        </div>
      </div>
    </div>
  );
};
