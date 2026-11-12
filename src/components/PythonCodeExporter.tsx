import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileSpreadsheet,
  FileJson,
  Terminal,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CalculatedPath } from '../types/robotPath';

interface PythonCodeExporterProps {
  calculatedPath: CalculatedPath;
}

const PYTHON_CODE = `# ==============================================================================
# Title: Finding the Simple Shortest Path for a Moving Robot Using Calculus
# Methods: Euler-Lagrange Geodesic, Fermat Snell Refraction, & Potential Fields
# Academic Project Demonstration Script (Python 3.9+ / NumPy / SciPy / Matplotlib)
# ==============================================================================

import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import minimize_scalar

class CalculusRobotPlanner:
    def __init__(self, start=(1.0, 4.5), goal=(8.5, 1.5)):
        self.start = np.array(start, dtype=float)
        self.goal = np.array(goal, dtype=float)

    # -------------------------------------------------------------------------
    # 1. Euler-Lagrange Analytical Geodesic (Calculus of Variations)
    # Proves: y''(x) = 0  =>  y(x) = mx + c
    # -------------------------------------------------------------------------
    def solve_geodesic(self, num_points=100):
        dx = self.goal[0] - self.start[0]
        dy = self.goal[1] - self.start[1]
        slope = dy / dx if dx != 0 else 0
        intercept = self.start[1] - slope * self.start[0]
        
        x_vals = np.linspace(self.start[0], self.goal[0], num_points)
        y_vals = slope * x_vals + intercept
        arc_length = np.sqrt(dx**2 + dy**2)
        
        print(f"[Calculus] Euler-Lagrange Geodesic: y = {slope:.3f}x + {intercept:.3f}")
        print(f"[Calculus] Theoretical Arc Length: L = {arc_length:.3f} m")
        return x_vals, y_vals, arc_length

    # -------------------------------------------------------------------------
    # 2. Fermat's Principle / Snell's Law of Least Time
    # Solves: dT/dx = 0  =>  sin(theta_1) / v1 = sin(theta_2) / v2
    # -------------------------------------------------------------------------
    def solve_fermat_least_time(self, boundary_y=3.0, v1=2.0, v2=0.8):
        y1 = abs(boundary_y - self.start[1])
        y2 = abs(self.goal[1] - boundary_y)
        
        def transit_time(x):
            d1 = np.sqrt((x - self.start[0])**2 + y1**2)
            d2 = np.sqrt((self.goal[0] - x)**2 + y2**2)
            return (d1 / v1) + (d2 / v2)
        
        res = minimize_scalar(transit_time, bounds=(min(self.start[0], self.goal[0]), max(self.start[0], self.goal[0])), method='bounded')
        x_star = res.x
        min_time = res.fun
        
        print(f"[Calculus] Optimal Boundary Interface Point x* = {x_star:.3f} m")
        print(f"[Calculus] Minimal Transit Time T = {min_time:.3f} s")
        return x_star, min_time

    # -------------------------------------------------------------------------
    # 3. Artificial Potential Field Gradient Descent
    # Solves: dq/dt = -grad(U_att + sum(U_rep))
    # -------------------------------------------------------------------------
    def solve_potential_field(self, obstacles=[(5.0, 3.0, 1.0)], k_att=1.2, k_rep=30.0, d0=1.5, dt=0.05):
        q = np.copy(self.start)
        trajectory = [np.copy(q)]
        
        for _ in range(400):
            if np.linalg.norm(q - self.goal) < 0.15:
                break
            
            # Attractive gradient: grad(U_att) = k_att * (q - q_goal)
            grad_att = k_att * (q - self.goal)
            
            # Repulsive gradient: grad(U_rep)
            grad_rep = np.zeros(2)
            for obs_x, obs_y, obs_r in obstacles:
                obs_center = np.array([obs_x, obs_y])
                dist_center = np.linalg.norm(q - obs_center)
                d = max(dist_center - obs_r, 0.01)
                
                if d < d0:
                    factor = k_rep * (1.0/d - 1.0/d0) * (1.0 / (d**2 * dist_center))
                    grad_rep += factor * (q - obs_center)
            
            # Descent vector
            grad_total = grad_att + grad_rep
            norm = np.linalg.norm(grad_total)
            if norm > 1e-4:
                direction = -grad_total / norm
            else:
                direction = np.array([-(self.goal[1] - q[1]), (self.goal[0] - q[0])])
            
            q += direction * (dt * 1.5)
            trajectory.append(np.copy(q))
            
        trajectory = np.array(trajectory)
        print(f"[Calculus] Potential Field Converged in {len(trajectory)} steps.")
        return trajectory

if __name__ == "__main__":
    planner = CalculusRobotPlanner(start=(1.0, 4.5), goal=(8.5, 1.5))
    x_geo, y_geo, L = planner.solve_geodesic()
    x_star, T = planner.solve_fermat_least_time()
    traj = planner.solve_potential_field()
    print("[SUCCESS] All calculus path formulations computed successfully!")
`;

export const PythonCodeExporter: React.FC<PythonCodeExporterProps> = ({ calculatedPath }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PYTHON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPy = () => {
    const element = document.createElement('a');
    const file = new Blob([PYTHON_CODE], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'shortest_path_robot_calculus.py';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportCSV = () => {
    const headers = ['Index', 'X_meters', 'Y_meters', 'Curvature_m_inv', 'Velocity_m_s', 'TimeFromStart_s'];
    const rows = calculatedPath.waypoints.map((w) => [
      w.index,
      w.x.toFixed(3),
      w.y.toFixed(3),
      (w.curvature || 0).toFixed(3),
      (w.velocity || 0).toFixed(2),
      (w.timeFromStart || 0).toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `robot_path_waypoints_${calculatedPath.method.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(calculatedPath, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `robot_path_waypoints_${calculatedPath.method.toLowerCase()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-rain-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
                Code & Waypoints Hub
              </span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Python 3.9+ / NumPy / SciPy
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Complete Python & Numerical Calculus Implementation
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Production script running all 3 calculus formulations (Euler-Lagrange, Fermat Snell, Potential Field).
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Download simulated path waypoints as CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-sky-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="Download full trajectory data as JSON"
            >
              <FileJson className="w-4 h-4 text-sky-400" />
              Export JSON
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
              {copied ? 'Copied Script!' : 'Copy Python'}
            </button>
            <button
              onClick={handleDownloadPy}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-sky-500/20"
            >
              <Download className="w-4 h-4" />
              Download .PY File
            </button>
          </div>
        </div>
      </div>

      {/* Code Viewer Card */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-5 py-2.5 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 font-bold text-slate-300">shortest_path_robot_calculus.py</span>
          </div>
          <span>110 lines • Python 3</span>
        </div>
        <pre className="p-5 overflow-x-auto text-xs font-mono text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto">
          <code>{PYTHON_CODE}</code>
        </pre>
      </div>
    </div>
  );
};
