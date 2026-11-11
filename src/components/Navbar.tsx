import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CloudRain,
  Activity,
  Cpu,
  Code2,
  GitCompare,
  BarChart3,
  Presentation,
  Volume2,
  VolumeX,
  Bell,
  Wifi,
  BatteryCharging,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { ALERT_LEVELS_INFO } from '../data/presentationSlides';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { reading, nodeStatus, isBuzzerMuted, toggleBuzzerMute, testHardwareBuzzer } = useTelemetry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLevelInfo = ALERT_LEVELS_INFO[reading.alertLevel] || ALERT_LEVELS_INFO.GREEN;

  const navLinks = [
    { name: 'Live Dashboard', path: '/', icon: Activity },
    { name: 'Hardware & Circuit', path: '/hardware', icon: Cpu },
    { name: 'ESP32 Firmware', path: '/firmware', icon: Code2 },
    { name: 'App vs System', path: '/comparison', icon: GitCompare },
    { name: 'Analytics & Logs', path: '/analytics', icon: BarChart3 },
    { name: 'PBT Slides Deck', path: '/presentation', icon: Presentation, highlight: true },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-rain-border/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <CloudRain className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-sky-300 via-cyan-200 to-white bg-clip-text text-transparent">
                  Smart Rain Alert
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  IoT System
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                Sense • Predict • Alert • University PBT Project
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs'
                      : link.highlight
                      ? 'bg-gradient-to-r from-sky-500/15 to-purple-500/15 text-sky-200 border border-sky-500/30 hover:bg-sky-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & Hardware Status */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live 4-Level Indicator Badge */}
            <div
              title={currentLevelInfo.triggerDescription}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black border transition-all ${currentLevelInfo.bgClass}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  reading.alertLevel === 'RED'
                    ? 'bg-rose-500 animate-ping'
                    : reading.alertLevel === 'ORANGE'
                    ? 'bg-orange-500 animate-pulse'
                    : reading.alertLevel === 'YELLOW'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              ></span>
              <span className="uppercase tracking-wider">{currentLevelInfo.code}: {currentLevelInfo.name}</span>
            </div>

            {/* Hardware Piezo Buzzer Controls */}
            <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={toggleBuzzerMute}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isBuzzerMuted
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'
                }`}
                title={isBuzzerMuted ? 'Buzzer Muted (Click to Unmute)' : 'Buzzer Active (Click to Mute)'}
              >
                {isBuzzerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={testHardwareBuzzer}
                className="hidden sm:inline-block px-2 py-1 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
                title="Trigger 5V Piezo Audio Beep Test"
              >
                Test Audio
              </button>
            </div>

            {/* ESP32 Node Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/70 border border-slate-800 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Wifi className="w-3.5 h-3.5" />
                <span>{nodeStatus.wifiRssi} dBm</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>{nodeStatus.batteryPercent}%</span>
              </span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-5 border-t border-slate-800 bg-[#0B132B]/95 backdrop-blur-2xl space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};
