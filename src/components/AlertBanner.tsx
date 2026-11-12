import React from 'react';
import { AlertTriangle, CheckCircle2, CloudRain, Bell, Volume2, ShieldAlert, Users, Tractor, Car } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext';
import { ALERT_LEVELS_INFO } from '../data/presentationSlides';

export const AlertBanner: React.FC = () => {
  const { reading, thresholds } = useTelemetry();
  const info = ALERT_LEVELS_INFO[reading.alertLevel] || ALERT_LEVELS_INFO.GREEN;

  return (
    <div className={`rounded-3xl p-5 border shadow-xl transition-all ${info.bgClass}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Side: Alert Title & Description */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black shrink-0 ${
              reading.alertLevel === 'RED'
                ? 'bg-rose-500 text-white animate-bounce'
                : reading.alertLevel === 'ORANGE'
                ? 'bg-orange-500 text-white animate-pulse'
                : reading.alertLevel === 'YELLOW'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-emerald-500 text-slate-950'
            }`}
          >
            {reading.alertLevel === 'RED' ? (
              <ShieldAlert className="w-6 h-6" />
            ) : reading.alertLevel === 'ORANGE' ? (
              <AlertTriangle className="w-6 h-6" />
            ) : reading.alertLevel === 'YELLOW' ? (
              <CloudRain className="w-6 h-6" />
            ) : (
              <CheckCircle2 className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${info.badgeClass}`}>
                Level {info.code}: {info.name}
              </span>
              <span className="text-xs text-slate-400">
                Risk Probability: <strong className="text-white">{reading.riskScore}%</strong>
              </span>
              {reading.alertLevel === 'RED' && (
                <span className="flex items-center gap-1 text-[11px] font-black text-rose-400 uppercase tracking-widest animate-pulse">
                  <Volume2 className="w-3.5 h-3.5" />
                  Hardware Buzzer Sounding
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
              {info.triggerDescription}
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {info.actionDescription}
            </p>
          </div>
        </div>

        {/* Right Side: Stakeholder Advisory Cards */}
        <div className="flex items-center gap-2 text-xs shrink-0 pt-2 lg:pt-0">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center gap-2">
            <Tractor className="w-4 h-4 text-amber-400" />
            <div>
              <div className="font-bold text-white text-[11px]">Farmers</div>
              <div className="text-[10px] text-slate-300">
                {reading.alertLevel === 'RED'
                  ? 'Cover harvest now'
                  : reading.alertLevel === 'ORANGE'
                  ? 'Pause irrigation'
                  : 'Favorable field work'}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-center gap-2">
            <Car className="w-4 h-4 text-sky-400" />
            <div>
              <div className="font-bold text-white text-[11px]">Commuters</div>
              <div className="text-[10px] text-slate-300">
                {reading.alertLevel === 'RED'
                  ? 'Waterlogged roads'
                  : reading.alertLevel === 'ORANGE'
                  ? 'Depart ahead of rain'
                  : 'Clear transit'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

