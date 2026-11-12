import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Presentation,
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { PRESENTATION_SLIDES } from '../data/robotScenarios';

export const PresentationDeck: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);

  const totalSlides = PRESENTATION_SLIDES.length;
  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];

  // Keyboard navigation
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
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-4 sm:p-6 border border-rain-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-sky-500/20">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base">Project Defense Deck</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Slide 0{currentSlide.id} of {totalSlides}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Finding the Simple Shortest Path for a Moving Robot Using Calculus
            </p>
          </div>
        </div>

        {/* Buttons */}
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
            Speaker Viva Notes
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
            <Compass className="w-3.5 h-3.5" />
            Live Arena
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

      {/* Main Slide Canvas */}
      <div className="glass-card rounded-[32px] p-8 sm:p-12 border-2 border-rain-border/80 shadow-2xl relative min-h-[500px] flex flex-col justify-between overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Slide Header */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              {currentSlide.category}
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">
              Slide 0{currentSlide.id} / {totalSlides}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-300/80 font-medium max-w-3xl">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Slide Content Bullets */}
        <div className="py-6 relative z-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSlide.bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-sky-500/30 transition-all flex items-start gap-3.5"
              >
                <span className="w-6 h-6 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {bullet}
                </span>
              </div>
            ))}
          </div>

          {/* Formula & Highlight Callout */}
          {currentSlide.keyFormula && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-sky-300">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
                <span>{currentSlide.keyFormula}</span>
              </div>
              {currentSlide.highlightText && (
                <span className="text-[11px] font-sans text-slate-300 italic">
                  {currentSlide.highlightText}
                </span>
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

          {/* Carousel Dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {PRESENTATION_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentSlideIndex ? 'w-7 bg-sky-400' : 'bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Slide ${slide.id}: ${slide.title}`}
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

      {/* Speaker Viva Notes Drawer */}
      {showNotes && currentSlide.speakerNotes && (
        <div className="glass-card rounded-3xl p-6 border border-sky-500/30 space-y-2 bg-slate-950/90">
          <div className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Speaker Viva Notes for Slide 0{currentSlide.id}: {currentSlide.title}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentSlide.speakerNotes}
          </p>
        </div>
      )}

      {/* Keyboard Shortcut Hints */}
      <div className="text-center text-[11px] text-slate-400 font-mono">
        Navigation: <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">←</kbd> Previous | <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">→</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Space</kbd> Next | <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">F</kbd> Fullscreen
      </div>
    </div>
  );
};
