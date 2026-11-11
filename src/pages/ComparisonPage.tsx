import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GitCompare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Volume2,
  WifiOff,
  DollarSign,
  Users,
  Sparkles,
  ArrowRight,
  Presentation,
} from 'lucide-react';

const COMPARISON_FACTORS = [
  {
    metric: 'Rainfall Detection Latency',
    standardApp: '15 to 60 Minutes (Delayed satellite sweeps & cloud radar interpolation)',
    ourSystem: '0.5 Seconds (Instant physical raindrop contact on conductive plate)',
    winner: 'system',
    impact: 'Crucial for farmers drying grains, open construction sites, and students walking between campus blocks.',
  },
  {
    metric: 'Spatial Resolution & Accuracy',
    standardApp: '25 km to 50 km Regional Grid (Predicts city-wide average)',
    ourSystem: '50 Meters Micro-Zone (Pinpoint localized microclimate on-site)',
    winner: 'system',
    impact: 'Eliminates false alarms where it rains 10km away while the campus remains completely dry.',
  },
  {
    metric: 'Ground-Truth Verification',
    standardApp: 'Statistical probability model (e.g., "40% chance of rain today")',
    ourSystem: 'Direct ADC measurement of water conductivity + barometric front plunge',
    winner: 'system',
    impact: 'Binary confirmation of actual precipitation onset rather than probabilistic speculation.',
  },
  {
    metric: 'Acoustic / Local Alerting',
    standardApp: 'Silent smartphone push notification (Easily muted or missed in pocket)',
    ourSystem: 'Active 85dB Piezo Siren + Multi-color high-luminance LED strobe',
    winner: 'system',
    impact: 'Alerts workers in loud agricultural fields or workshops without requiring screens.',
  },
  {
    metric: 'Offline & Grid Independence',
    standardApp: 'Zero functionality without cellular internet connection',
    ourSystem: 'Fully autonomous local edge alarm; sounds buzzer even if Wi-Fi fails',
    winner: 'system',
    impact: 'Lifesaving reliability during storm-induced cellular tower blackouts.',
  },
  {
    metric: 'Stakeholder Actionability',
    standardApp: 'Generic cloudy umbrella icon with no tailored guidance',
    ourSystem: '4-Tier protocol with specific checklists for Farmers, Transit, Facilities',
    winner: 'system',
    impact: 'Transforms passive weather viewing into immediate preventive action.',
  },
  {
    metric: 'Hardware Deployment Cost',
    standardApp: 'Commercial Davis/Campbell stations cost $800 - $3,500 USD',
    ourSystem: '$14.20 USD Total Bill of Materials (BOM)',
    winner: 'system',
    impact: 'Democratizes early disaster warning for rural schools, smallholder farms, and developing communities.',
  },
];

export const ComparisonPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MATRIX' | 'SIMULATION'>('MATRIX');
  const [simulatedRainElapsed, setSimulatedRainElapsed] = useState<number>(0);
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);

  // Simulation controls
  const handleStartSim = () => {
    setSimulatedRainElapsed(0);
    setIsSimRunning(true);
    let sec = 0;
    const interval = setInterval(() => {
      sec += 1;
      setSimulatedRainElapsed(sec);
      if (sec >= 45) {
        clearInterval(interval);
        setIsSimRunning(false);
      }
    }, 150);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Presentation Slide 4 Core Matrix
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Benchmarked Evaluation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Commercial Weather Apps vs. Smart Rain Alert System
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Why traditional smartphone weather applications fail during sudden microbursts, and how localized IoT edge sensing solves the problem.
          </p>
        </div>

        <Link
          to="/presentation"
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all hover:scale-105 shrink-0"
        >
          <Presentation className="w-4 h-4" />
          View in Slide Deck
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'MATRIX'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          7-Factor Comparison Matrix
        </button>
        <button
          onClick={() => setActiveTab('SIMULATION')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'SIMULATION'
              ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          Interactive Response Latency Benchmark
        </button>
      </div>

      {/* View 1: 7-Factor Comparison Matrix */}
      {activeTab === 'MATRIX' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {COMPARISON_FACTORS.map((item, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-5 sm:p-6 border border-rain-border hover:border-sky-500/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base font-black text-white">{item.metric}</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-fit">
                    Smart Rain System Superiority
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Standard Weather App */}
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                      <XCircle className="w-4 h-4 shrink-0" />
                      Typical Weather Apps (AccuWeather / Google)
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.standardApp}</p>
                  </div>

                  {/* Our System */}
                  <div className="bg-sky-950/30 p-4 rounded-2xl border border-sky-500/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Smart Rain Alert System (Our IoT Node)
                    </div>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed">{item.ourSystem}</p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1 italic">
                  <strong>Practical Impact:</strong> {item.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Response Latency Benchmark Demonstration */}
      {activeTab === 'SIMULATION' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-white">
                Live Precipitation Response Speed Race
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Demonstrates how quickly each system detects sudden localized cloudbursts and warns users.
              </p>
            </div>
            <button
              onClick={handleStartSim}
              disabled={isSimRunning}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 transition-all flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              {isSimRunning ? 'Simulating Sudden Rainstorm...' : 'Start Sudden Downpour Race'}
            </button>
          </div>

          <div className="space-y-6 pt-4">
            {/* Our System Progress */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Smart Rain Alert System (FC-37 Plate + Buzzer)
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {simulatedRainElapsed >= 1 ? 'ALARM SOUNDED IN 0.5s!' : 'Waiting for rain droplet...'}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: simulatedRainElapsed >= 1 ? '100%' : '0%' }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Droplet contacts interdigitated trace. Voltage drops below 1500 ADC within 0.5 seconds. Hardware buzzer sounds immediately.
              </p>
            </div>

            {/* Commercial App Progress */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Commercial Weather App (Cloud Satellite / Doppler Grid)
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {simulatedRainElapsed >= 35
                    ? 'Push notification delivered (25 min later)'
                    : `Radar sweeping... (${Math.min(simulatedRainElapsed * 40, 100)}% cycle)`}
                </span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min((simulatedRainElapsed / 35) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400">
                Satellite scans regional sector every 15-30 minutes. Radar algorithm parses cloud density. Silent notification sent long after ground is already soaked.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
