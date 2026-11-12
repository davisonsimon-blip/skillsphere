import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  PlusCircle,
  Sliders,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { CalculusMethod, SimulationConfig, Point2D } from '../types/robotPath';
import { PRESET_SCENARIOS } from '../data/robotScenarios';

interface ManualControlsProps {
  config: SimulationConfig;
  onUpdateConfig: (updates: Partial<SimulationConfig>) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onReset: () => void;
  playbackSpeed: number;
  onUpdateSpeed: (speed: number) => void;
  activeTool: 'SELECT' | 'ADD_OBSTACLE' | 'MOVE_GOAL' | 'MANUAL_DRIVE';
  onSelectTool: (tool: 'SELECT' | 'ADD_OBSTACLE' | 'MOVE_GOAL' | 'MANUAL_DRIVE') => void;
  onManualDrive: (dTheta: number, v: number) => void;
  onLoadPreset: (presetIndex: number) => void;
}

export const ManualControls: React.FC<ManualControlsProps> = ({
  config,
  onUpdateConfig,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onReset,
  playbackSpeed,
  onUpdateSpeed,
  activeTool,
  onSelectTool,
  onManualDrive,
  onLoadPreset,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Primary Simulation & Manual Stepper Toolbar */}
      <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Manual Execution Engine
            </span>
            <h3 className="text-lg font-black text-white mt-1">
              Simulation Playback & Calculus Stepping
            </h3>
          </div>

          {/* Core Execution Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all text-xs font-bold flex items-center gap-1.5"
              title="Reset robot position to Start (Point A)"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Reset
            </button>

            <button
              onClick={onStepForward}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-sky-500/40 hover:border-sky-500 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
              title="Advance exactly 1 calculus iteration (dt step)"
            >
              <SkipForward className="w-4 h-4 text-sky-400" />
              Single Step Δt
            </button>

            <button
              onClick={onTogglePlay}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-all ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 shadow-sky-500/25'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
              {isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            </button>
          </div>
        </div>

        {/* Speed Multiplier & Interactive Canvas Tools */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Speed:</span>
            {[0.25, 0.5, 1.0, 2.0, 4.0].map((s) => (
              <button
                key={s}
                onClick={() => onUpdateSpeed(s)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  playbackSpeed === s
                    ? 'bg-sky-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Canvas Mode Toggle */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1">Canvas Tool:</span>
            <button
              onClick={() => onSelectTool('SELECT')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                activeTool === 'SELECT'
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Drag Nodes
            </button>
            <button
              onClick={() => onSelectTool('ADD_OBSTACLE')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                activeTool === 'ADD_OBSTACLE'
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Obstacle
            </button>
            <button
              onClick={() => onSelectTool('MANUAL_DRIVE')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                activeTool === 'MANUAL_DRIVE'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Manual Drive
            </button>
          </div>
        </div>
      </div>

      {/* 2. Manual Driving Joystick (When Manual Drive Mode is Active) */}
      {activeTool === 'MANUAL_DRIVE' && (
        <div className="glass-card rounded-3xl p-5 border border-emerald-500/30 bg-emerald-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Manual Robot Driving Controls
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">
              Keyboard Arrow Keys Supported
            </span>
          </div>
          <p className="text-[11px] text-slate-300">
            Use the steering pad below to drive the robot manually across the arena. Watch the live deviation from the mathematical geodesic!
          </p>
          <div className="flex justify-center py-2">
            <div className="grid grid-cols-3 gap-2 w-36">
              <div></div>
              <button
                onClick={() => onManualDrive(0, 0.4)}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center active:scale-95 transition-all shadow-md"
                title="Forward (Up Arrow)"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div></div>

              <button
                onClick={() => onManualDrive(0.25, 0.1)}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center active:scale-95 transition-all shadow-md"
                title="Steer Left (Left Arrow)"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => onManualDrive(0, -0.2)}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center active:scale-95 transition-all shadow-md"
                title="Reverse (Down Arrow)"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
              <button
                onClick={() => onManualDrive(-0.25, 0.1)}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center active:scale-95 transition-all shadow-md"
                title="Steer Right (Right Arrow)"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Preset Experiments Bar */}
      <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Laboratory Preset Experiments
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {PRESET_SCENARIOS.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => onLoadPreset(idx)}
              className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/40 text-left transition-all group"
            >
              <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">
                {scenario.name.split(':')[0]}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                {scenario.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Calculus Method Selector & Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calculus Formulation Selection */}
        <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Calculus Optimization Method
            </h4>
          </div>

          <div className="space-y-2">
            {[
              {
                id: 'EULER_LAGRANGE',
                name: 'Euler-Lagrange Geodesic (Variational)',
                formula: 'y"(x) = 0 => y(x) = mx + c',
                desc: 'Minimizes arc length functional J[y] = ∫√(1 + y\'²) dx in Euclidean flat space.',
              },
              {
                id: 'FERMAT_LEAST_TIME',
                name: "Fermat's Least Time (Snell's Law)",
                formula: 'dT/dx = 0 => sin(θ1)/v1 = sin(θ2)/v2',
                desc: 'Optimizes refraction angle across dual-velocity terrain zones.',
              },
              {
                id: 'GRADIENT_POTENTIAL',
                name: 'Artificial Potential Field Gradient',
                formula: 'q_dot = -∇(U_att + ∑ U_rep)',
                desc: 'Continuous gradient descent safely deflecting around obstacle boundaries.',
              },
              {
                id: 'CURVATURE_DUBINS',
                name: 'Curvature-Bounded Dubins Vehicle',
                formula: '|κ(s)| ≤ κ_max = 1 / R_min',
                desc: 'Enforces non-holonomic vehicle minimum turning radius constraint.',
              },
            ].map((method) => (
              <div
                key={method.id}
                onClick={() => onUpdateConfig({ method: method.id as CalculusMethod })}
                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                  config.method === method.id
                    ? 'bg-sky-500/15 border-sky-500/50 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{method.name}</span>
                  <span className="font-mono text-[10px] text-sky-400">{method.formula}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Parameter Tuning Sliders & Coordinates */}
        <div className="glass-card rounded-3xl p-5 border border-rain-border space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            Manual Calculus Mathematical Parameters
          </h4>

          {/* Coordinate Inputs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase">
                Start Point A (x, y)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="9.8"
                  value={config.start.x}
                  onChange={(e) =>
                    onUpdateConfig({ start: { ...config.start, x: parseFloat(e.target.value) || 1 } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="5.8"
                  value={config.start.y}
                  onChange={(e) =>
                    onUpdateConfig({ start: { ...config.start, y: parseFloat(e.target.value) || 1 } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-rose-400 uppercase">
                Goal Point B (x, y)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="9.8"
                  value={config.goal.x}
                  onChange={(e) =>
                    onUpdateConfig({ goal: { ...config.goal, x: parseFloat(e.target.value) || 8 } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
                <input
                  type="number"
                  step="0.1"
                  min="0.2"
                  max="5.8"
                  value={config.goal.y}
                  onChange={(e) =>
                    onUpdateConfig({ goal: { ...config.goal, y: parseFloat(e.target.value) || 5 } })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-1 text-xs">
            {/* Robot Speed Slider */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Robot Velocity (v):</span>
                <span className="font-mono text-sky-400">{config.robotBaseSpeed.toFixed(1)} m/s</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={config.robotBaseSpeed}
                onChange={(e) => onUpdateConfig({ robotBaseSpeed: parseFloat(e.target.value) })}
                className="w-full accent-sky-400"
              />
            </div>

            {/* Repulsion Gain k_rep */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Obstacle Repulsion Gain (k_rep):</span>
                <span className="font-mono text-amber-400">{config.repulsionGain.toFixed(0)}</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={config.repulsionGain}
                onChange={(e) => onUpdateConfig({ repulsionGain: parseFloat(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Obstacle Influence Radius d_0 */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Obstacle Influence Horizon (d_0):</span>
                <span className="font-mono text-rose-400">{config.influenceRadius.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.1"
                value={config.influenceRadius}
                onChange={(e) => onUpdateConfig({ influenceRadius: parseFloat(e.target.value) })}
                className="w-full accent-rose-400"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.showGradientField}
                onChange={(e) => onUpdateConfig({ showGradientField: e.target.checked })}
                className="rounded accent-sky-400"
              />
              Show ∇U Gradient Vector Field
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.showSensorRays}
                onChange={(e) => onUpdateConfig({ showSensorRays: e.target.checked })}
                className="rounded accent-sky-400"
              />
              Show Sensor Cones
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
