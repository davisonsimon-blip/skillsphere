import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { SimulationPage } from './pages/SimulationPage';
import { DerivationPage } from './pages/DerivationPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { CodePage } from './pages/CodePage';
import { PresentationPage } from './pages/PresentationPage';
import { Bot, Compass, Calculator, GitCompare, Code2, Presentation, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="glass-panel border-t border-rain-border/80 mt-16 py-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-cyan-400 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Bot className="w-5 h-5 text-slate-950 stroke-[2.3]" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                Shortest Path for a Moving Robot Using Calculus
              </div>
              <p className="text-[11px] text-slate-400">
                Variational Optimization • Euler-Lagrange • Fermat Least Time • University Engineering Project
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <Link to="/" className="hover:text-sky-400 transition-colors">
              Simulation Arena
            </Link>
            <Link to="/derivation" className="hover:text-sky-400 transition-colors">
              Calculus Proofs
            </Link>
            <Link to="/comparison" className="hover:text-sky-400 transition-colors">
              Algorithms
            </Link>
            <Link to="/code" className="hover:text-sky-400 transition-colors">
              Python Code & CSV
            </Link>
            <Link to="/presentation" className="hover:text-sky-400 transition-colors text-sky-400 font-bold">
              10-Slide Deck
            </Link>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center md:text-right">
            <span>Sense • Formulate • Optimize • Navigate</span>
            <span className="block text-[10px] text-slate-400 mt-0.5">
              Continuous ℝ² Optimization with Manual Stepping
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#080E21] text-slate-100 selection:bg-sky-500 selection:text-slate-950 font-sans">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<SimulationPage />} />
            <Route path="/derivation" element={<DerivationPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/code" element={<CodePage />} />
            <Route path="/presentation" element={<PresentationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
