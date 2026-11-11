import React from 'react';
import { Link } from 'react-router-dom';
import {
  CloudRain,
  Activity,
  Presentation,
  Cpu,
  Code2,
  GitCompare,
  BarChart3,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { AlertBanner } from '../components/AlertBanner';
import { SensorGaugeCard } from '../components/SensorGaugeCard';
import { HardwareBench } from '../components/HardwareBench';
import { LivePhoneAlerts } from '../components/LivePhoneAlerts';
import { RealWeatherWidget } from '../components/RealWeatherWidget';
import { HistoryTable } from '../components/HistoryTable';

export const DashboardPage: React.FC = () => {
  const { reading, nodeStatus } = useTelemetry();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & System Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6 border border-rain-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Node Operational
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Station ID: {nodeStatus.nodeId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Smart Rain Early-Warning Telemetry Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Autonomous multi-sensor IoT edge station combining barometric pressure plunge, surface raindrop conductivity, and acoustic alert synthesis.
          </p>
        </div>

        {/* Quick Launch to PBT Slides */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/presentation"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Presentation className="w-4 h-4" />
            Launch 14-Slide PBT Deck
          </Link>
          <Link
            to="/hardware"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Cpu className="w-4 h-4 text-sky-400" />
            Circuit Wiring
          </Link>
        </div>
      </div>

      {/* 1. Active 4-Tier Alert Banner */}
      <AlertBanner />

      {/* 2. Sensor Telemetry Gauges (5 Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-400" />
            Real-Time Edge Sensor Gauges
          </h2>
          <span className="text-xs text-slate-400 font-mono">Sampling Cycle: 3.5s</span>
        </div>
        <SensorGaugeCard />
      </div>

      {/* 3. Physical Simulation & Hardware Test-Bench */}
      <HardwareBench />

      {/* 4. Real Weather Widget (Hyperlocal vs Regional Comparison) */}
      <RealWeatherWidget />

      {/* 5. Live SMS Alerts & Phone Mockup */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Radio className="w-4 h-4 text-sky-400" />
          Community Multi-Stakeholder Notification Engine
        </h2>
        <LivePhoneAlerts />
      </div>

      {/* 6. Recent Historical Telemetry Log & CSV Export */}
      <HistoryTable />
    </div>
  );
};
