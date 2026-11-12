import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Info,
} from 'lucide-react';
import { DERIVATION_STEPS } from '../data/robotScenarios';

export const CalculusDerivation: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Interactive Variational Perturbation Sandbox
  const [epsilon, setEpsilon] = useState<number>(0.0);
  const [calcX1, setCalcX1] = useState<number>(1.0);
  const [calcY1, setCalcY1] = useState<number>(2.0);
  const [calcX2, setCalcX2] = useState<number>(7.0);
  const [calcY2, setCalcY2] = useState<number>(5.0);

  // Math derivations
  const dx = calcX2 - calcX1;
  const dy = calcY2 - calcY1;
  const slope = dx !== 0 ? dy / dx : 0;
  const intercept = calcY1 - slope * calcX1;
  const directEuclidean = Math.sqrt(dx * dx + dy * dy);

  // Variational Perturbation: y_pert(x) = y(x) + epsilon * sin(pi * (x - x1) / dx)
  // Arc length with perturbation evaluated via numerical quadrature (Simpson's rule)
  const N = 100;
  let perturbedLength = 0;
  for (let i = 0; i < N; i++) {
    const xMid = calcX1 + (i + 0.5) * (dx / N);
    const xi = (xMid - calcX1) / dx;
    // Derivative of perturbation: d/dx [epsilon * sin(pi * xi)] = epsilon * (pi/dx) * cos(pi * xi)
    const dPert_dx = dx !== 0 ? epsilon * (Math.PI / dx) * Math.cos(Math.PI * xi) : 0;
    const yPrime = slope + dPert_dx;
    const ds = Math.sqrt(1 + yPrime * yPrime) * (dx / N);
    perturbedLength += ds;
  }

  const lengthDelta = perturbedLength - directEuclidean;

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
            Mathematical Foundations
          </span>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            Calculus of Variations • Euler-Lagrange
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Analytical Proof: Why the Shortest Path is a Straight Line
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Explore the formal step-by-step calculus proofs establishing Euclidean geodesics, Snell's law refraction across terrain interfaces, and artificial potential field obstacle gradient dynamics.
        </p>
      </div>

      {/* 2. Interactive Step-by-Step Derivation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Step Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {DERIVATION_STEPS.map((step) => (
            <button
              key={step.stepNumber}
              onClick={() => setActiveStep(step.stepNumber)}
              className={`w-full p-4 rounded-2xl border text-left transition-all ${
                activeStep === step.stepNumber
                  ? 'bg-sky-500/15 border-sky-500/50 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-white">
                  <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center text-[10px] font-mono">
                    {step.stepNumber}
                  </span>
                  Step {step.stepNumber}
                </span>
                {activeStep === step.stepNumber && (
                  <span className="text-[10px] text-sky-400 font-mono">Active</span>
                )}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                {step.title}
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Step Explanations (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
          {(() => {
            const current =
              DERIVATION_STEPS.find((s) => s.stepNumber === activeStep) || DERIVATION_STEPS[0];
            return (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider font-mono">
                    Step {current.stepNumber} of {DERIVATION_STEPS.length}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Calculus Formulation
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">{current.title}</h3>

                {/* Mathematical Equation Display Box */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-sm text-sky-300 leading-relaxed overflow-x-auto shadow-inner">
                  <code>{current.mathLatex}</code>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>{current.description}</p>
                </div>

                {/* Significance Highlight */}
                <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-500/20 flex items-start gap-3 text-xs">
                  <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Engineering & Robotic Significance:</strong>
                    <span className="text-slate-300">{current.significance}</span>
                  </div>
                </div>

                {/* Next Step Button */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() =>
                      setActiveStep((prev) => (prev < DERIVATION_STEPS.length ? prev + 1 : 1))
                    }
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-2 transition-all"
                  >
                    Next Mathematical Step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* 3. Interactive Variational Perturbation Test-Bench */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3 className="text-xl font-black text-white">
            Interactive Variational Calculus Sandbox (Perturbation Test)
          </h3>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Test the principle of stationary action: Perturb the straight-line curve with an arbitrary sinusoidal variation{' '}
          <code className="text-sky-300">δy(x) = ε · sin(π(x - x₁)/Δx)</code>. Observe how any non-zero perturbation{' '}
          <code className="text-amber-400">ε ≠ 0</code> strictly increases the arc-length integral!
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Start Point A (x₁, y₁):</span>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                value={calcX1}
                onChange={(e) => setCalcX1(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono"
              />
              <input
                type="number"
                step="0.5"
                value={calcY1}
                onChange={(e) => setCalcY1(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Goal Point B (x₂, y₂):</span>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.5"
                value={calcX2}
                onChange={(e) => setCalcX2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono"
              />
              <input
                type="number"
                step="0.5"
                value={calcY2}
                onChange={(e) => setCalcY2(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono"
              />
            </div>
          </div>

          <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 sm:col-span-2">
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Variational Perturbation Amplitude (ε):</span>
              <span className="font-mono text-amber-400 font-bold">{epsilon.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.05"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>-2.5 (Downward bow)</span>
              <span>0.0 (True Geodesic)</span>
              <span>+2.5 (Upward bow)</span>
            </div>
          </div>
        </div>

        {/* Live Mathematical Verification Result */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Theoretical Geodesic Length (L₀)
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">
              {directEuclidean.toFixed(3)} m
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              y(x) = {slope.toFixed(2)}x {intercept >= 0 ? `+ ${intercept.toFixed(2)}` : `- ${Math.abs(intercept).toFixed(2)}`}
            </div>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Perturbed Curve Length L[y + ε·η]
            </div>
            <div className="text-xl font-black text-amber-400 font-mono mt-1">
              {perturbedLength.toFixed(3)} m
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Numerical Integral ∫ √(1 + (y' + ε·η')²) dx
            </div>
          </div>

          <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">
              Length Penalty ΔL = L - L₀
            </div>
            <div
              className={`text-xl font-black font-mono mt-1 ${
                Math.abs(lengthDelta) < 0.001 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              +{lengthDelta.toFixed(3)} m
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {Math.abs(lengthDelta) < 0.001
                ? 'Minimum Achieved! (ε = 0)'
                : 'Suboptimal! Variational derivative > 0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
