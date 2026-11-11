import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Presentation,
  Activity,
  Cpu,
  Code2,
  Sparkles,
  Volume2,
  Layers,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { PRESENTATION_SLIDES, ALERT_LEVELS_INFO } from '../data/presentationSlides';
import { useTelemetry } from '../context/TelemetryContext';

export const PresentationPage: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const { reading, triggerScenario } = useTelemetry();

  const totalSlides = PRESENTATION_SLIDES.length;
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Deck Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-4 sm:p-6 border border-rain-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base">PBT University Presentation</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Slide {currentSlide.id} of {totalSlides}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Smart Rain Alert System: A Low-Cost IoT Early-Warning System for Local Rainfall
            </p>
          </div>
        </div>

        {/* Action Buttons & Keyboard Hints */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
              showNotes
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1" />
            Speaker Notes
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Toggle fullscreen (Press F)"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>

          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            Live Demo
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 h-full transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        ></div>
      </div>

      {/* Main Slide Card (16:9 Aspect Ratio Feel) */}
      <div className="glass-card rounded-[32px] p-8 sm:p-12 border-2 border-rain-border/80 shadow-2xl relative min-h-[500px] flex flex-col justify-between overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Slide Header */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              {currentSlide.badge || currentSlide.category}
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">
              Slide 0{currentSlide.id} / 14
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-300/80 font-medium max-w-3xl">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Body / Bullets */}
        <div className="py-8 relative z-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSlide.contentBullets.map((bullet, idx) => {
              const hasColon = bullet.includes(':');
              const [head, ...rest] = hasColon ? bullet.split(':') : ['', bullet];

              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-sky-500/30 transition-all flex items-start gap-3.5"
                >
                  <span className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {hasColon ? (
                      <>
                        <strong className="text-white font-black block mb-0.5">{head}:</strong>
                        <span className="text-slate-300">{rest.join(':')}</span>
                      </>
                    ) : (
                      <span>{bullet}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Highlight Banner */}
          {currentSlide.keyHighlight && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-blue-500/10 border border-sky-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-sky-200">
                  {currentSlide.keyHighlight}
                </span>
              </div>

              {/* Interactive jump button depending on slide topic */}
              {currentSlide.id === 4 && (
                <Link
                  to="/comparison"
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  Explore Comparison Matrix <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {currentSlide.id === 7 && (
                <Link
                  to="/hardware"
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  View Circuit Schematic <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {currentSlide.id === 8 && (
                <Link
                  to="/firmware"
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shrink-0 flex items-center gap-1"
                >
                  View Arduino C++ Code <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
              {currentSlide.id === 10 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => triggerScenario('WATCH')}
                    className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black"
                  >
                    Simulate Watch
                  </button>
                  <button
                    onClick={() => triggerScenario('DOWNPOUR')}
                    className="px-2.5 py-1 rounded-lg bg-rose-500 text-white text-[10px] font-black"
                  >
                    Simulate Downpour
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Slide Footer Navigation */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between relative z-10">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white border border-slate-700 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Slide
          </button>

          {/* Quick Jump Slide Selector Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {PRESENTATION_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlideIndex
                    ? 'w-7 bg-sky-400'
                    : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Jump to slide ${slide.id}: ${slide.title}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === totalSlides - 1}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-30 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 flex items-center gap-2 transition-all"
          >
            Next Slide
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Speaker Notes Drawer (Optional) */}
      {showNotes && (
        <div className="glass-card rounded-3xl p-6 border border-sky-500/30 space-y-2 bg-slate-950/90">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Speaker Viva Notes for Slide {currentSlide.id}: {currentSlide.title}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentSlide.id === 1 &&
              'Welcome the examiner panel. Emphasize that this is an end-to-end working IoT prototype designed around the core principle of "Sense, Predict, Alert" under a strict $15 budget constraint.'}
            {currentSlide.id === 2 &&
              'Address the real-world problem: Regional weather forecasts average predictions over a 40-60 km² grid. Rainstorms are convective and localized within 1-2 km. Mention losses incurred by local farmers and commuter gridlocks.'}
            {currentSlide.id === 3 &&
              'State the 4 clear engineering objectives: Local detection (FC-37 + BME280), Early prediction (barometric slope), Rapid multi-channel alerts (SMS + buzzer), and affordability.'}
            {currentSlide.id === 4 &&
              'Highlight the comparison matrix: Point out that commercial smartphone apps are passive (user must open them) and lagged (15-60 min), while our IoT node pushes immediate alarms in 0.5 seconds.'}
            {currentSlide.id === 5 &&
              'Explain the three-tier methodology: Edge sensing layer -> Cloud analytical engine -> Multi-channel notification dispatch.'}
            {currentSlide.id === 6 &&
              'Walk through the system architecture diagram showing ESP32, BME280 I2C bus, FC-37 analog input, active buzzer, and Node.js REST API.'}
            {currentSlide.id === 7 &&
              'Walk through the Bill of Materials: ESP32 ($4.50), BME280 ($3.80), FC-37 ($1.80), Buzzer ($0.60), LEDs ($0.50). Total BOM is $14.20, beating the sub-$15 target.'}
            {currentSlide.id === 8 &&
              'Discuss the firmware algorithms: Dew point formula, barometric front pressure gradient (hPa/hr), and the weighted risk index.'}
            {currentSlide.id === 9 &&
              'Demonstrate the step-by-step pipeline from sensor polling every 3.5 seconds to cloud serialization.'}
            {currentSlide.id === 10 &&
              'Demonstrate the 4 Alert Levels (Green Safe, Yellow Watch, Orange Warning, Red Severe). Click the simulation buttons to show examiner the live response.'}
            {currentSlide.id === 11 &&
              'Discuss validation results: 94.2% local detection accuracy within 500m radius, 18-minute advance warning before heavy cloudbursts.'}
            {currentSlide.id === 12 &&
              'Summarize key engineering benefits: Actionable, low-cost, scalable, and solar energy autonomous.'}
            {currentSlide.id === 13 &&
              'Review stakeholder use cases: Agriculture (crop drying), Commuters, Campus facility managers, and outdoor sports event desks.'}
            {currentSlide.id === 14 &&
              'Conclude with future scope: LoRaWAN mesh networks for rural valleys, AI micro-climate training, and automated mechanical storm shutter actuation.'}
          </p>
        </div>
      )}

      {/* Keyboard Shortcut Helper Footer */}
      <div className="text-center text-[11px] text-slate-400 font-mono">
        Keyboard controls: <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">←</kbd> Previous | <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">→</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Space</kbd> Next | <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">F</kbd> Fullscreen
      </div>
    </div>
  );
};
