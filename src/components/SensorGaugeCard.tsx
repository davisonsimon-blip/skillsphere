import React from 'react';
import {
  CloudRain,
  Droplets,
  Gauge,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Zap,
  Activity
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const SensorGaugeCard: React.FC = () => {
  const { reading } = useTelemetry();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Rain Sensor Plate (FC-37) */}
      <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-sky-400">
            <CloudRain className="w-4 h-4" />
            Rain Drop Plate
          </span>
          <span className="font-mono text-[10px] text-slate-400">ADC: {reading.rainAnalog}</span>
        </div>

        <div>
          <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
            {reading.rainIntensityPercent}%
            <span className="text-xs text-slate-400 font-semibold">surface wet</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider ${
                reading.rainIntensityPercent > 50
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : reading.rainIntensityPercent > 10
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : reading.rainIntensityPercent > 0
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {reading.rainStatus}
            </span>
          </div>
        </div>

        {/* Rain Plate Resistance Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              reading.rainIntensityPercent > 50
                ? 'bg-rose-500'
                : reading.rainIntensityPercent > 15
                ? 'bg-orange-500'
                : 'bg-sky-400'
            }`}
            style={{ width: `${Math.max(4, reading.rainIntensityPercent)}%` }}
          ></div>
        </div>
      </div>

      {/* 2. Relative Humidity (BME280) */}
      <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Droplets className="w-4 h-4" />
            Humidity (RH)
          </span>
          <span className="text-[10px] text-slate-400">Threshold: 75%</span>
        </div>

        <div>
          <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
            {reading.humidity}%
            <span className="text-xs text-slate-400 font-semibold">RH</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {reading.humidity > 75 ? (
              <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                <TrendingUp className="w-3.5 h-3.5" />
                Pre-Rain Rising
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <Minus className="w-3.5 h-3.5" />
                Normal Range
              </span>
            )}
          </div>
        </div>

        {/* Humidity Gauge bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              reading.humidity > 80 ? 'bg-amber-400' : 'bg-cyan-400'
            }`}
            style={{ width: `${reading.humidity}%` }}
          ></div>
        </div>
      </div>

      {/* 3. Barometric Pressure (BME280) */}
      <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-purple-400">
            <Gauge className="w-4 h-4" />
            Pressure (P)
          </span>
          <span className="text-[10px] text-slate-400 font-mono">1h Gradient</span>
        </div>

        <div>
          <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
            {reading.pressure}
            <span className="text-xs text-slate-400 font-semibold">hPa</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {reading.pressureDelta1h > 1.2 ? (
              <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                <TrendingDown className="w-3.5 h-3.5" />
                Dropping -{reading.pressureDelta1h} hPa/hr
              </span>
            ) : (
              <span className="text-slate-400 font-medium text-[11px]">
                Stable barometer
              </span>
            )}
          </div>
        </div>

        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(10, ((reading.pressure - 990) / 35) * 100))}%` }}
          ></div>
        </div>
      </div>

      {/* 4. Temperature & Dew Point (BME280) */}
      <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-amber-400">
            <Thermometer className="w-4 h-4" />
            Temp / Dew Point
          </span>
          <span className="text-[10px] text-slate-400 font-mono">T / Td</span>
        </div>

        <div>
          <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
            {reading.temperature}°C
            <span className="text-xs text-slate-400 font-semibold">
              ({((reading.temperature * 9) / 5 + 32).toFixed(1)}°F)
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Dew Point: <strong className="text-cyan-300 font-mono">{reading.dewPoint}°C</strong>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(10, (reading.temperature / 45) * 100))}%` }}
          ></div>
        </div>
      </div>

      {/* 5. Rain Risk Probability Score Dial */}
      <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-3 relative overflow-hidden bg-gradient-to-br from-slate-900/90 to-rain-panel">
        <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 text-sky-300">
            <Sparkles className="w-4 h-4" />
            Rain Risk Index
          </span>
          <span className="text-[10px] font-mono text-sky-400 font-bold">ALGORITHM</span>
        </div>

        <div>
          <div className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1">
            {reading.riskScore}%
            <span className="text-xs text-slate-400 font-semibold">probability</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 line-clamp-1">
            Blends sensors + pressure + forecast
          </div>
        </div>

        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              reading.riskScore >= 75
                ? 'bg-rose-500'
                : reading.riskScore >= 50
                ? 'bg-orange-500'
                : reading.riskScore >= 25
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.max(5, reading.riskScore)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

