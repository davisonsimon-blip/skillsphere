import React from 'react';
import {
  SlidersHorizontal,
  Sun,
  CloudSun,
  AlertTriangle,
  CloudLightning,
  Volume2,
  RefreshCw,
  Zap,
  Cpu,
  Radio
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

export const HardwareBench: React.FC = () => {
  const {
    reading,
    updateSensorValues,
    triggerScenario,
    isSimulating,
    setIsSimulating,
    testHardwareBuzzer,
    nodeStatus,
  } = useTelemetry();

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive PBT Hardware Test-Bench</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            IoT Edge Simulation & Calibration Controls
          </h2>
          <p className="text-xs text-slate-400">
            For project demonstration: Test edge response by simulating sudden weather drops or tweaking real sensor sliders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isSimulating
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>{isSimulating ? 'Auto-Telemetry: ON' : 'Auto-Telemetry: PAUSED'}</span>
          </button>

          <button
            onClick={testHardwareBuzzer}
            className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sound Buzzer</span>
          </button>
        </div>
      </div>

      {/* 1. 1-Touch Scenario Demonstration Buttons */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          1-Touch Demonstration Scenarios (Click to test system response):
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => triggerScenario('SUNNY')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              reading.alertLevel === 'GREEN'
                ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md ring-1 ring-emerald-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">1. Clear / Sunny</div>
              <p className="text-[10px] text-slate-400">Green Safe • Stable</p>
            </div>
          </button>

          <button
            onClick={() => triggerScenario('WATCH')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              reading.alertLevel === 'YELLOW'
                ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">2. Pre-Rain Watch</div>
              <p className="text-[10px] text-slate-400">Yellow • RH &gt; 78%</p>
            </div>
          </button>

          <button
            onClick={() => triggerScenario('WARNING')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              reading.alertLevel === 'ORANGE'
                ? 'bg-orange-500/15 border-orange-500/50 shadow-md ring-1 ring-orange-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">3. Storm Warning</div>
              <p className="text-[10px] text-slate-400">Orange • ΔP Drop & SMS</p>
            </div>
          </button>

          <button
            onClick={() => triggerScenario('DOWNPOUR')}
            className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
              reading.alertLevel === 'RED'
                ? 'bg-rose-500/15 border-rose-500/50 shadow-md ring-1 ring-rose-500'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <CloudLightning className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-xs text-white">4. Downpour Active</div>
              <p className="text-[10px] text-slate-400">Red Severe • Buzzer ON</p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Precision Manual Calibration Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
        {/* Slider 1: Rain Sensor Plate Wetness */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-sky-300">Rain Plate Saturation:</span>
            <span className="font-mono text-white text-sm">{reading.rainIntensityPercent}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={reading.rainIntensityPercent}
            onChange={(e) => {
              const val = Number(e.target.value);
              const analog = Math.round(4000 - (val / 100) * 3200);
              updateSensorValues({ rainIntensityPercent: val, rainAnalog: analog });
            }}
            className="w-full accent-sky-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Dry: 4000 ADC)</span>
            <span>100% (Flooded: 800 ADC)</span>
          </div>
        </div>

        {/* Slider 2: Atmospheric Humidity */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-cyan-300">Relative Humidity:</span>
            <span className="font-mono text-white text-sm">{reading.humidity}%</span>
          </div>
          <input
            type="range"
            min="30"
            max="100"
            value={reading.humidity}
            onChange={(e) => updateSensorValues({ humidity: Number(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>30% (Dry Air)</span>
            <span>75% (Watch)</span>
            <span>100% (Saturated)</span>
          </div>
        </div>

        {/* Slider 3: Barometric Pressure Drop (hPa/hr) */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold">
            <span className="text-purple-300">Pressure Gradient (ΔP/hr):</span>
            <span className="font-mono text-white text-sm">-{reading.pressureDelta1h} hPa</span>
          </div>
          <input
            type="range"
            min="0"
            max="4.0"
            step="0.1"
            value={reading.pressureDelta1h}
            onChange={(e) => {
              const delta = Number(e.target.value);
              updateSensorValues({ pressureDelta1h: delta, pressure: +(1013.2 - delta).toFixed(1) });
            }}
            className="w-full accent-purple-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.0 (Stable)</span>
            <span>1.5 (Storm Slope)</span>
            <span>4.0 (Squall Drop)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

