import React from 'react';
import {
  Ruler,
  Clock,
  Compass,
  Zap,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { CalculatedPath, RobotState } from '../types/robotPath';

interface PathTelemetryCardProps {
  calculatedPath: CalculatedPath;
  robotState: RobotState;
}

export const PathTelemetryCard: React.FC<PathTelemetryCardProps> = ({
  calculatedPath,
  robotState,
}) => {
  const headingDeg = ((robotState.theta * 180) / Math.PI + 360) % 360;
  const progressPercent = Math.min(
    100,
    (robotState.distanceTraveled / Math.max(calculatedPath.totalLength, 0.01)) * 100
  );

  return (
    <div className="space-y-4">
      {/* 5-Card Telemetry Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1: Arc Length Integral L */}
        <div className="glass-card rounded-2xl p-4 border border-rain-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-sky-400">
              <Ruler className="w-3.5 h-3.5" />
              Arc Length L
            </span>
            <span className="font-mono text-[9px] text-slate-400">∫ ds</span>
          </div>
          <div className="text-xl font-black text-white font-mono">
            {calculatedPath.totalLength.toFixed(2)} <span className="text-xs text-slate-400">m</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Euclidean: <strong className="text-slate-300">{calculatedPath.euclideanLength.toFixed(2)}m</strong>
          </div>
        </div>

        {/* Metric 2: Transit Time Functional T */}
        <div className="glass-card rounded-2xl p-4 border border-rain-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              Transit Time T
            </span>
            <span className="font-mono text-[9px] text-slate-400">∫ ds/v</span>
          </div>
          <div className="text-xl font-black text-amber-400 font-mono">
            {calculatedPath.estimatedTime.toFixed(2)} <span className="text-xs text-slate-400">s</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Elapsed: <strong className="text-slate-300">{robotState.timeElapsed.toFixed(1)}s</strong>
          </div>
        </div>

        {/* Metric 3: Path Efficiency Ratio */}
        <div className="glass-card rounded-2xl p-4 border border-rain-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              Efficiency η
            </span>
            <span className="font-mono text-[9px] text-slate-400">De / L</span>
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {calculatedPath.efficiencyPercent}%
          </div>
          <div className="text-[10px] text-slate-400">
            {calculatedPath.efficiencyPercent >= 98
              ? 'Near-ideal straight line'
              : 'Detour for safety'}
          </div>
        </div>

        {/* Metric 4: Instantaneous Robot Coordinates */}
        <div className="glass-card rounded-2xl p-4 border border-rain-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-purple-400">
              <Compass className="w-3.5 h-3.5" />
              Robot State
            </span>
            <span className="font-mono text-[9px] text-slate-400">q(t)</span>
          </div>
          <div className="text-base font-black text-white font-mono">
            [{robotState.x.toFixed(2)}, {robotState.y.toFixed(2)}]
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Heading: <strong className="text-purple-300">{headingDeg.toFixed(0)}°</strong>
          </div>
        </div>

        {/* Metric 5: Maximum Curvature κ */}
        <div className="glass-card rounded-2xl p-4 border border-rain-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
              Peak Curvature
            </span>
            <span className="font-mono text-[9px] text-slate-400">κ_max</span>
          </div>
          <div className="text-xl font-black text-cyan-400 font-mono">
            {calculatedPath.maxCurvature.toFixed(2)} <span className="text-xs text-slate-400">m⁻¹</span>
          </div>
          <div className="text-[10px] text-slate-400">
            R_min:{' '}
            <strong className="text-slate-300">
              {calculatedPath.maxCurvature > 0
                ? `${(1 / calculatedPath.maxCurvature).toFixed(2)}m`
                : '∞ (Linear)'}
            </strong>
          </div>
        </div>

        {/* Metric 6: Collision Safety Status */}
        <div className="glass-card rounded-2xl p-4 border border-rain-border space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety
            </span>
            <span className="font-mono text-[9px] text-slate-400">Status</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                robotState.isColliding
                  ? 'bg-rose-500 animate-ping'
                  : robotState.status === 'REACHED_GOAL'
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-emerald-400'
              }`}
            ></span>
            <span className="text-xs font-black text-white">
              {robotState.isColliding
                ? 'Collision!'
                : robotState.status === 'REACHED_GOAL'
                ? 'Goal Reached!'
                : 'Clear Path'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400">
            Calc Latency: {calculatedPath.computationTimeMs}ms
          </div>
        </div>
      </div>

      {/* Traversal Progress Bar */}
      <div className="glass-card rounded-2xl p-4 border border-rain-border space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            Path Traversal Execution Progress
          </span>
          <span className="font-mono font-bold text-sky-400">
            {progressPercent.toFixed(1)}% Completed ({robotState.distanceTraveled.toFixed(2)}m /{' '}
            {calculatedPath.totalLength.toFixed(2)}m)
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 h-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
