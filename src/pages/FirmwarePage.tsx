import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Terminal,
  Cpu,
  Layers,
  Activity,
  Zap,
  CheckCircle2,
  Server,
  CloudRain,
  Calculator,
} from 'lucide-react';
import { FirmwareViewer } from '../components/FirmwareViewer';

export const FirmwarePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Slide 8 & 9 Software Architecture
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              ESP32 C++ & Node.js REST API
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Firmware Algorithms & Cloud Telemetry Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Mathematical formulations running on the embedded microcontroller for early precipitation detection and seamless cloud ingestion.
          </p>
        </div>

        <Link
          to="/"
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Activity className="w-4 h-4" />
          Test in Live Dashboard
        </Link>
      </div>

      {/* Firmware Source Code Viewer */}
      <FirmwareViewer />

      {/* Embedded Mathematical Formulations Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-sky-400" />
          <h3 className="text-xl font-black text-white">
            Embedded Mathematics & Predictive Formulations
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          The ESP32 does not merely wait for rain to hit the sensor. It computes atmospheric instability indices in real time using 3 continuous meteorological models:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Formula 1: Barometric Front Pressure Gradient */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              1. Pressure Tendency (ΔP)
            </div>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-sky-300 border border-slate-800">
              ΔP = P(t) - P(t - 1hr)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A rapid barometric drop (&gt; 1.5 hPa/hr) signals a convective frontal boundary approaching long before clouds condense overhead.
            </p>
          </div>

          {/* Formula 2: Dew Point Approximation */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              2. Magnus Dew Point
            </div>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800">
              Td ≈ T - ((100 - RH) / 5)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When ambient temperature nears the dew point (T - Td &lt; 2.5°C), the air reaches 100% saturation, triggering precipitation condensation.
            </p>
          </div>

          {/* Formula 3: Multi-Metric Composite Risk Score */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Composite Risk Index (0-100%)
            </div>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-amber-300 border border-slate-800 leading-snug">
              Risk = 0.6·Rain% + 1.5·(RH-70) + 15·ΔP
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A weighted heuristic blending physical raindrop conductivity, relative humidity excess, and pressure gradient into a single actionable index.
            </p>
          </div>
        </div>
      </div>

      {/* Cloud Ingestion Architecture & Backend Spec */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-sky-400" />
            <h3 className="text-xl font-black text-white">
              Cloud Ingestion REST API Architecture (`backend/server.js`)
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Node.js Native HTTP • Zero Dependencies
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The system includes a production-grade, zero-dependency Node.js HTTP server configured on port 5000 that ingests live ESP32 telemetry packets, persists audit logs, and coordinates WebSocket/SMS dispatches:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] text-emerald-400 uppercase font-bold">GET /api/status</div>
            <div className="text-xs text-white">Node Health & Heartbeat</div>
            <div className="text-[11px] text-slate-400 font-sans">Returns station RSSI, uptime, and firmware version.</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] text-sky-400 uppercase font-bold">POST /api/telemetry</div>
            <div className="text-xs text-white">Sensor Data Ingestion</div>
            <div className="text-[11px] text-slate-400 font-sans">Accepts JSON payloads from ESP32 every 3.5s.</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] text-amber-400 uppercase font-bold">GET /api/alerts</div>
            <div className="text-xs text-white">Active Alert Events</div>
            <div className="text-[11px] text-slate-400 font-sans">Streams active warnings to web clients.</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] text-rose-400 uppercase font-bold">POST /api/thresholds</div>
            <div className="text-xs text-white">Over-The-Air Calibration</div>
            <div className="text-[11px] text-slate-400 font-sans">Dynamically tunes sensitivity and buzzer parameters.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

