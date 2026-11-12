import React, { useState } from 'react';
import {
  CloudSun,
  Globe2,
  Cpu,
  MapPin,
  ArrowRight,
  TrendingDown,
  Clock,
  Radio,
  Search,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';

const PRESET_CITIES = [
  { name: 'Bangalore', temp: 27.4, humidity: 64, rainRisk: 35, condition: 'Scattered Clouds' },
  { name: 'Mumbai', temp: 31.2, humidity: 78, rainRisk: 70, condition: 'Monsoon Front' },
  { name: 'New Delhi', temp: 24.8, humidity: 48, rainRisk: 10, condition: 'Clear Sky' },
  { name: 'London', temp: 15.2, humidity: 82, rainRisk: 65, condition: 'Light Drizzle' },
  { name: 'Singapore', temp: 30.5, humidity: 88, rainRisk: 85, condition: 'Tropical Storm' },
];

export const RealWeatherWidget: React.FC = () => {
  const { reading, nodeStatus } = useTelemetry();
  const [selectedCity, setSelectedCity] = useState(PRESET_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCitySelect = (city: typeof PRESET_CITIES[0]) => {
    setSelectedCity(city);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = PRESET_CITIES.find(
      (c) => c.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );
    if (match) {
      setSelectedCity(match);
    } else {
      setSelectedCity({
        name: searchQuery.trim(),
        temp: 26.5,
        humidity: 62,
        rainRisk: 40,
        condition: 'Regional Radar Forecast',
      });
    }
    setSearchQuery('');
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
      {/* Header & Slide 4 Problem Reference */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Slide 4 Thesis Validation
            </span>
            <span className="text-xs text-slate-400">
              Hyperlocal Ground IoT vs. Regional Weather Radar
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Why Weather Apps Fail vs. Smart Rain Alert System
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Commercial weather apps rely on 25km satellite grids and delayed radar sweeps (15-60 min lag).
            Our on-site IoT node measures atmospheric pressure drop and surface raindrops instantly within 0.5s.
          </p>
        </div>

        {/* City Switcher Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <form onSubmit={handleSearch} className="relative flex-1 sm:w-48">
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {PRESET_CITIES.slice(0, 3).map((city) => (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCity.name === city.name
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Column 1: Hyperlocal Smart Rain Alert Node (Active ESP32) */}
        <div className="bg-gradient-to-b from-sky-950/40 via-slate-900/60 to-slate-900/80 rounded-3xl p-6 border-2 border-sky-500/40 relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-400">
              <Cpu className="w-4 h-4 text-sky-400" />
              On-Site IoT Station (This System)
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Radio className="w-3 h-3 animate-ping" />
              LIVE TELEMETRY
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl font-black text-white">{reading.temperature.toFixed(1)}°C</div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {nodeStatus.location}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-sky-400">{reading.riskScore}%</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Rain Risk Index</div>
            </div>
          </div>

          {/* Hyperlocal Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Rain Surface</div>
              <div className="text-xs font-black text-white mt-0.5">{reading.rainIntensityPercent}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Humidity</div>
              <div className="text-xs font-black text-white mt-0.5">{reading.humidity.toFixed(1)}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Pressure</div>
              <div className="text-xs font-black text-white mt-0.5">{reading.pressure.toFixed(1)} hPa</div>
            </div>
          </div>

          {/* Key Advantages Checklist */}
          <div className="space-y-1.5 pt-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span><strong>0.5 sec response:</strong> Immediate raindrop conductivity trigger</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span><strong>Hyperlocal precision:</strong> 50m micro-zone vs. 25km city grid</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span><strong>Hardware buzzer:</strong> Audible alarm without needing smartphone app</span>
            </div>
          </div>
        </div>

        {/* Column 2: Typical Weather App / Regional Forecast */}
        <div className="bg-slate-900/40 rounded-3xl p-6 border border-slate-800/80 relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Globe2 className="w-4 h-4 text-slate-400" />
              Regional Weather App ({selectedCity.name})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              Cloud Grid (25km)
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl font-black text-slate-300">{selectedCity.temp}°C</div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {selectedCity.name} Metropolitan Region
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-300">{selectedCity.rainRisk}%</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">City Forecast Risk</div>
            </div>
          </div>

          {/* Regional Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Condition</div>
              <div className="text-xs font-bold text-slate-300 mt-0.5 truncate">{selectedCity.condition}</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Regional RH</div>
              <div className="text-xs font-bold text-slate-300 mt-0.5">{selectedCity.humidity}%</div>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Radar Refresh</div>
              <div className="text-xs font-bold text-slate-300 mt-0.5">15-45 min</div>
            </div>
          </div>

          {/* Commercial App Pitfalls */}
          <div className="space-y-1.5 pt-2 text-xs">
            <div className="flex items-center gap-2 text-amber-300/90">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span><strong>Lagged alerts:</strong> Notification often arrives 20 min after rain begins</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300/90">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span><strong>Broad coverage:</strong> Predicts rain 15km away while campus stays dry</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300/90">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span><strong>No physical alarm:</strong> Silent push notification easily missed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

