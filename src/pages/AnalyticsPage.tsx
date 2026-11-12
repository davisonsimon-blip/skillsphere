import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Activity,
  CloudRain,
  Droplets,
  Thermometer,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { HistoryTable } from '../components/HistoryTable';

export const AnalyticsPage: React.FC = () => {
  const { history, reading } = useTelemetry();

  // Reverse history so it flows left to right chronologically
  const chartData = [...history].reverse();
  const maxEntries = 20;
  const recentSlice = chartData.slice(-maxEntries);

  // SVG Chart helpers
  const svgWidth = 800;
  const svgHeight = 180;
  const padding = 20;

  // Rain Intensity Points (0 - 100%)
  const rainPoints = recentSlice
    .map((item, idx) => {
      const x = padding + (idx / Math.max(recentSlice.length - 1, 1)) * (svgWidth - 2 * padding);
      const y = svgHeight - padding - (item.rainIntensity / 100) * (svgHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  // Humidity Points (0 - 100%)
  const humidityPoints = recentSlice
    .map((item, idx) => {
      const x = padding + (idx / Math.max(recentSlice.length - 1, 1)) * (svgWidth - 2 * padding);
      const y = svgHeight - padding - (item.humidity / 100) * (svgHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  // Risk Score Points (0 - 100%)
  const riskPoints = recentSlice
    .map((item, idx) => {
      const x = padding + (idx / Math.max(recentSlice.length - 1, 1)) * (svgWidth - 2 * padding);
      const y = svgHeight - padding - (item.riskScore / 100) * (svgHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Slide 11 Validation & Telemetry Analytics
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Live Ingestion Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Atmospheric Waveforms & Sensor Trend Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live time-series graph displaying the correlation between barometric pressure depression, relative humidity surge, and surface rain detection.
          </p>
        </div>
      </div>

      {/* Real-Time SVG Time-Series Telemetry Charts */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-400" />
              Real-Time Atmospheric Waveforms (Last 20 Observations)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live visual curves tracking Risk Index, Raindrop Intensity %, and Relative Humidity %
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-1 bg-sky-400 rounded-full"></span>
              Rain Intensity
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-1 bg-emerald-400 rounded-full"></span>
              Humidity
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-1 bg-rose-400 rounded-full"></span>
              Risk Score
            </span>
          </div>
        </div>

        {/* SVG Waveform Visualizer */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full min-w-[650px] h-48 select-none">
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#1e293b" strokeDasharray="4,4" />
            <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#1e293b" strokeDasharray="4,4" />
            <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#334155" />

            <text x={padding + 5} y={padding + 12} fill="#64748b" fontSize="9" fontFamily="monospace">100%</text>
            <text x={padding + 5} y={svgHeight / 2 + 3} fill="#64748b" fontSize="9" fontFamily="monospace">50%</text>
            <text x={padding + 5} y={svgHeight - padding - 4} fill="#64748b" fontSize="9" fontFamily="monospace">0%</text>

            {/* Polyline: Humidity (Emerald) */}
            {recentSlice.length > 1 && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={humidityPoints}
                strokeLinecap="round"
              />
            )}

            {/* Polyline: Rain Intensity (Sky Blue) */}
            {recentSlice.length > 1 && (
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                points={rainPoints}
                strokeLinecap="round"
              />
            )}

            {/* Polyline: Risk Score (Rose) */}
            {recentSlice.length > 1 && (
              <polyline
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4,2"
                points={riskPoints}
                strokeLinecap="round"
              />
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Oldest Sample (Left)</span>
          <span>Sampling Interval: 3.5s Cycle</span>
          <span>Latest Telemetry Packet (Right)</span>
        </div>
      </div>

      {/* Historical Audit Trail Table & Export */}
      <HistoryTable />
    </div>
  );
};

