import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { TelemetryProvider } from './context/TelemetryContext';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { HardwarePage } from './pages/HardwarePage';
import { FirmwarePage } from './pages/FirmwarePage';
import { ComparisonPage } from './pages/ComparisonPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PresentationPage } from './pages/PresentationPage';
import { CloudRain, Cpu, Code2, GitCompare, BarChart3, Presentation, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-rain-border/80 mt-16 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <CloudRain className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                Smart Rain Alert System
              </div>
              <p className="text-[11px] text-slate-400">
                A Low-Cost IoT Early-Warning System for Local Rainfall • University PBT Project
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <Link to="/" className="hover:text-sky-400 transition-colors">
              Dashboard
            </Link>
            <Link to="/hardware" className="hover:text-sky-400 transition-colors">
              Hardware & BOM
            </Link>
            <Link to="/firmware" className="hover:text-sky-400 transition-colors">
              ESP32 Firmware
            </Link>
            <Link to="/comparison" className="hover:text-sky-400 transition-colors">
              App vs System
            </Link>
            <Link to="/analytics" className="hover:text-sky-400 transition-colors">
              Logs & CSV
            </Link>
            <Link to="/presentation" className="hover:text-sky-400 transition-colors text-sky-400 font-bold">
              14-Slide Deck
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center md:text-right">
            <span>Sense • Predict • Alert</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">ESP32 + BME280 + Web Audio Synthesizer</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const App: React.FC = () => {
  return (
    <TelemetryProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-slate-950">
          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/hardware" element={<HardwarePage />} />
              <Route path="/firmware" element={<FirmwarePage />} />
              <Route path="/comparison" element={<ComparisonPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/presentation" element={<PresentationPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </TelemetryProvider>
  );
};

export default App;
