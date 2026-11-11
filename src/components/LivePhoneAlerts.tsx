import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  MessageSquare,
  ShieldAlert,
  AlertTriangle,
  CloudRain,
  CheckCircle,
  Wifi,
  Battery,
  Volume2,
  BellRing,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { ALERT_LEVELS_INFO } from '../data/presentationSlides';

export const LivePhoneAlerts: React.FC = () => {
  const { alerts, reading, clearAlerts, sendManualSms, thresholds } = useTelemetry();
  const [customPhone, setCustomPhone] = useState('+91 98450 11223');
  const [customMsg, setCustomMsg] = useState('Heavy rain approaching Faculty Block C. Secure open drying areas immediately.');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    sendManualSms(customPhone, customMsg.trim());
    setFeedback(`SMS dispatched to ${customPhone}!`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const currentLevelInfo = ALERT_LEVELS_INFO[reading.alertLevel] || ALERT_LEVELS_INFO.GREEN;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Simulated Smartphone Mockup (5 cols) */}
      <div className="lg:col-span-5 flex justify-center">
        <div className="w-full max-w-[340px] bg-slate-900 border-4 border-slate-700/80 rounded-[44px] shadow-2xl p-3 relative ring-1 ring-sky-500/20">
          {/* Phone Speaker Notch & Front Camera */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-20">
            <div className="w-10 h-1.5 bg-slate-800 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-sky-950/80 rounded-full border border-sky-500/30"></div>
          </div>

          {/* Inner Phone Screen */}
          <div className="bg-slate-950 rounded-[34px] overflow-hidden border border-slate-800 flex flex-col h-[520px]">
            {/* Phone Status Bar */}
            <div className="pt-3 px-5 pb-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{reading.timestamp.slice(0, 5) || '10:45'}</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] text-emerald-400 font-semibold">4G LTE</span>
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Messaging App Header */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-md">
                  🌧️
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                    <span>RAIN-ALERT</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">IoT Broadcast Node 01</div>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                PBT GSM
              </span>
            </div>

            {/* SMS Message Thread */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
              <div className="text-center my-1">
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full">
                  Today • SMS Early Warning System
                </span>
              </div>

              {alerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <CloudRain className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                  <p>No active rain alerts sent yet.</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Trigger a scenario on the hardware bench to simulate automated SMS dispatches.
                  </p>
                </div>
              ) : (
                alerts.slice(0, 6).map((alert) => {
                  const isRed = alert.level === 'RED';
                  const isOrange = alert.level === 'ORANGE';
                  const isYellow = alert.level === 'YELLOW';

                  return (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-2xl border space-y-1.5 shadow-sm transition-all ${
                        isRed
                          ? 'bg-rose-950/60 border-rose-500/50 text-rose-100'
                          : isOrange
                          ? 'bg-orange-950/60 border-orange-500/50 text-orange-100'
                          : isYellow
                          ? 'bg-amber-950/50 border-amber-500/40 text-amber-100'
                          : 'bg-slate-900 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-semibold">
                        <span className="flex items-center gap-1 font-bold">
                          {isRed ? (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                          ) : isOrange ? (
                            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                          ) : (
                            <BellRing className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          LEVEL {alert.level}: {alert.title}
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">{alert.message}</p>
                      <div className="pt-1 flex items-center justify-between text-[9px] text-slate-400 border-t border-white/10">
                        <span>To: {alert.recipients[0] || 'Community Stakeholder'}</span>
                        <span className="text-emerald-400 font-medium">✓ Delivered</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Phone Message Input Bar Mockup */}
            <div className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                readOnly
                placeholder="SMS broadcast channel (Read-only)"
                className="flex-1 bg-slate-950 text-[11px] text-slate-400 px-3 py-1.5 rounded-full border border-slate-800 focus:outline-none"
              />
              <div className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Send className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Alert Management & Stakeholder Dispatch System (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Header card with system metrics */}
        <div className="glass-card rounded-3xl p-6 border border-rain-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-sky-400" />
                Live SMS & Push Dispatch Engine
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated GSM/Twilio/Push gateway notifying enrolled farmers, campus staff, and commuters
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${currentLevelInfo.badgeClass}`}
            >
              Current State: {currentLevelInfo.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Dispatch Mode</div>
              <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {thresholds.autoSmsEnabled ? 'Automated Early Alert' : 'Manual Trigger Only'}
              </div>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Enrolled Subscribers</div>
              <div className="text-sm font-bold text-white mt-0.5">
                {thresholds.subscriberPhones.length} Stakeholders
              </div>
            </div>
            <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Alert History Count</div>
              <div className="text-sm font-bold text-sky-400 mt-0.5">{alerts.length} Total Logs</div>
            </div>
          </div>
        </div>

        {/* Stakeholder Directory Card */}
        <div className="glass-card rounded-3xl p-6 border border-rain-border space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            Registered Broadcast Stakeholders (Priority Queue)
          </h4>
          <div className="space-y-2.5">
            {thresholds.subscriberPhones.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-sky-500/30 transition-all text-xs"
              >
                <div>
                  <div className="font-bold text-white">{sub.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                    <span>{sub.phone}</span>
                    <span>•</span>
                    <span className="text-sky-400 font-sans">{sub.role}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sendManualSms(
                      sub.phone,
                      `[URGENT RAIN ALERT] High atmospheric risk detected by Campus Station Alpha. Level: ${reading.alertLevel}`
                    );
                    setFeedback(`Alert sent to ${sub.name}!`);
                    setTimeout(() => setFeedback(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold transition-all flex items-center gap-1.5 text-xs"
                >
                  <Send className="w-3 h-3" />
                  Test Ping
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Manual SMS Dispatch Form for Live Examiner Demonstration */}
        <div className="glass-card rounded-3xl p-6 border border-rain-border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Direct SMS Transmitter (Live Demo Form)
            </h4>
            {alerts.length > 0 && (
              <button
                type="button"
                onClick={clearAlerts}
                className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                title="Clear notification logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Logs
              </button>
            )}
          </div>

          <form onSubmit={handleSendCustom} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
                  placeholder="+91 98450 XXXXX"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Alert Severity Tag
                </label>
                <div className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-sky-300 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Manual Operator Broadcast
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Advisory Message Body
              </label>
              <textarea
                rows={2}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 resize-none"
                placeholder="Enter alert advisory text..."
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-emerald-400 font-medium">
                {feedback ? feedback : 'Simulates instant cellular GSM/Twilio API delivery'}
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch Custom SMS
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
