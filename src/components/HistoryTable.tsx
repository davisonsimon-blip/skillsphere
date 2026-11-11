import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileJson,
  Search,
  Filter,
  ArrowUpDown,
  CloudRain,
  Activity,
  Trash2,
  Calendar,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { AlertLevelCode } from '../types/rainAlert';
import { ALERT_LEVELS_INFO } from '../data/presentationSlides';

export const HistoryTable: React.FC = () => {
  const { history, reading } = useTelemetry();
  const [levelFilter, setLevelFilter] = useState<'ALL' | AlertLevelCode>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter history
  const filteredHistory = history.filter((item) => {
    const matchesLevel = levelFilter === 'ALL' || item.alertLevel === levelFilter;
    const matchesSearch =
      item.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alertLevel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Calculate summary statistics
  const peakRain = history.reduce((max, h) => Math.max(max, h.rainIntensity), 0);
  const avgHumidity = history.length
    ? (history.reduce((sum, h) => sum + h.humidity, 0) / history.length).toFixed(1)
    : '0';
  const lowestPressure = history.length
    ? Math.min(...history.map((h) => h.pressure)).toFixed(1)
    : '0';

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Temperature (C)', 'Humidity (%)', 'Pressure (hPa)', 'Rain Intensity (%)', 'Risk Score (%)', 'Alert Level'];
    const rows = filteredHistory.map((h) => [
      `"${h.timestamp}"`,
      h.temperature.toFixed(2),
      h.humidity.toFixed(2),
      h.pressure.toFixed(2),
      h.rainIntensity,
      h.riskScore,
      `"${h.alertLevel}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_rain_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredHistory, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `smart_rain_telemetry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Data Ingestion Log
            </span>
            <span className="text-xs text-slate-400">
              {history.length} Live Packets Logged
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            Historical Sensor Telemetry & Audit Trail
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Logged readings from the on-board BME280 barometric engine and FC-37 precipitation sensor.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-emerald-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-sky-500/40 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
          >
            <FileJson className="w-4 h-4 text-sky-400" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Observations</div>
          <div className="text-xl font-black text-white mt-0.5 font-mono">{history.length}</div>
        </div>
        <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Peak Rain Recorded</div>
          <div className="text-xl font-black text-sky-400 mt-0.5 font-mono">{peakRain}%</div>
        </div>
        <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Average Humidity</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5 font-mono">{avgHumidity}%</div>
        </div>
        <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Lowest Pressure Drop</div>
          <div className="text-xl font-black text-amber-400 mt-0.5 font-mono">{lowestPressure} hPa</div>
        </div>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search timestamp or alert level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'GREEN', 'YELLOW', 'ORANGE', 'RED'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                levelFilter === lvl
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lvl === 'ALL' ? 'All Logs' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="py-3 px-4 font-bold">Timestamp</th>
              <th className="py-3 px-4 font-bold">Rain Intensity</th>
              <th className="py-3 px-4 font-bold">Temperature</th>
              <th className="py-3 px-4 font-bold">Rel Humidity</th>
              <th className="py-3 px-4 font-bold">Pressure</th>
              <th className="py-3 px-4 font-bold">Risk Index</th>
              <th className="py-3 px-4 font-bold">Alert Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 font-sans text-xs">
                  No telemetry entries match your filter.
                </td>
              </tr>
            ) : (
              filteredHistory.slice(0, 15).map((row, idx) => {
                const info = ALERT_LEVELS_INFO[row.alertLevel] || ALERT_LEVELS_INFO.GREEN;
                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-2.5 px-4 text-slate-300 font-sans text-xs">{row.timestamp}</td>
                    <td className="py-2.5 px-4 font-bold">
                      <span
                        className={
                          row.rainIntensity > 50
                            ? 'text-rose-400'
                            : row.rainIntensity > 0
                            ? 'text-sky-300'
                            : 'text-slate-400'
                        }
                      >
                        {row.rainIntensity}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-200">{row.temperature.toFixed(1)}°C</td>
                    <td className="py-2.5 px-4 text-slate-200">{row.humidity.toFixed(1)}%</td>
                    <td className="py-2.5 px-4 text-slate-200">{row.pressure.toFixed(1)} hPa</td>
                    <td className="py-2.5 px-4 font-bold text-sky-400">{row.riskScore}%</td>
                    <td className="py-2.5 px-4 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${info.badgeClass}`}>
                        {row.alertLevel}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {filteredHistory.length > 15 && (
        <div className="text-center text-xs text-slate-400">
          Showing 15 most recent entries of {filteredHistory.length}. Export CSV to view the entire audit log.
        </div>
      )}
    </div>
  );
};
