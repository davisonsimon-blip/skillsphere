import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Presentation,
  BookOpen,
  Code2,
  CheckCircle2,
  Bot,
  Activity,
} from 'lucide-react';
import {
  Point2D,
  Obstacle,
  SimulationConfig,
  RobotState,
  CalculatedPath,
} from '../types/robotPath';
import { calculateShortestPath, distance } from '../utils/calculusMath';
import { PRESET_SCENARIOS } from '../data/robotScenarios';
import { RobotCanvas } from '../components/RobotCanvas';
import { ManualControls } from '../components/ManualControls';
import { PathTelemetryCard } from '../components/PathTelemetryCard';

export const SimulationPage: React.FC = () => {
  // 1. Simulation Configuration
  const [config, setConfig] = useState<SimulationConfig>(PRESET_SCENARIOS[2].config); // Starts with obstacle scenario

  // 2. Computed Path
  const [calculatedPath, setCalculatedPath] = useState<CalculatedPath>(() =>
    calculateShortestPath(PRESET_SCENARIOS[2].config)
  );

  // 3. Robot State
  const [robotState, setRobotState] = useState<RobotState>({
    x: PRESET_SCENARIOS[2].config.start.x,
    y: PRESET_SCENARIOS[2].config.start.y,
    theta: 0,
    velocity: PRESET_SCENARIOS[2].config.robotBaseSpeed,
    angularVelocity: 0,
    trail: [PRESET_SCENARIOS[2].config.start],
    distanceTraveled: 0,
    timeElapsed: 0,
    isColliding: false,
    status: 'IDLE',
  });

  // 4. Execution Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeTool, setActiveTool] = useState<
    'SELECT' | 'ADD_OBSTACLE' | 'MOVE_GOAL' | 'MANUAL_DRIVE'
  >('SELECT');

  const currentWaypointIndexRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Recalculate path whenever configuration changes
  const handleRecalculatePath = useCallback((newConfig: SimulationConfig) => {
    const path = calculateShortestPath(newConfig);
    setCalculatedPath(path);
  }, []);

  const handleUpdateConfig = (updates: Partial<SimulationConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      handleRecalculatePath(next);
      return next;
    });
  };

  // Reset Robot Position
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    currentWaypointIndexRef.current = 0;
    setRobotState({
      x: config.start.x,
      y: config.start.y,
      theta: 0,
      velocity: config.robotBaseSpeed,
      angularVelocity: 0,
      trail: [config.start],
      distanceTraveled: 0,
      timeElapsed: 0,
      isColliding: false,
      status: 'IDLE',
    });
  }, [config.start, config.robotBaseSpeed]);

  // Load Preset Experiment
  const handleLoadPreset = (index: number) => {
    const preset = PRESET_SCENARIOS[index] || PRESET_SCENARIOS[0];
    setConfig(preset.config);
    const path = calculateShortestPath(preset.config);
    setCalculatedPath(path);
    setIsPlaying(false);
    currentWaypointIndexRef.current = 0;
    setRobotState({
      x: preset.config.start.x,
      y: preset.config.start.y,
      theta: 0,
      velocity: preset.config.robotBaseSpeed,
      angularVelocity: 0,
      trail: [preset.config.start],
      distanceTraveled: 0,
      timeElapsed: 0,
      isColliding: false,
      status: 'IDLE',
    });
  };

  // Node Drag Updates
  const handleUpdateStart = (p: Point2D) => {
    setConfig((prev) => {
      const next = { ...prev, start: p };
      handleRecalculatePath(next);
      return next;
    });
    setRobotState((prev) => ({
      ...prev,
      x: p.x,
      y: p.y,
      trail: [p],
      distanceTraveled: 0,
    }));
  };

  const handleUpdateGoal = (p: Point2D) => {
    setConfig((prev) => {
      const next = { ...prev, goal: p };
      handleRecalculatePath(next);
      return next;
    });
  };

  const handleUpdateObstacles = (obs: Obstacle[]) => {
    setConfig((prev) => {
      const next = { ...prev, obstacles: obs };
      handleRecalculatePath(next);
      return next;
    });
  };

  const handleAddObstacle = (p: Point2D) => {
    const newObs: Obstacle = {
      id: `obs-${Date.now()}`,
      x: p.x,
      y: p.y,
      radius: 0.9,
      label: `Barrier ${config.obstacles.length + 1}`,
    };
    handleUpdateObstacles([...config.obstacles, newObs]);
  };

  const handleDeleteObstacle = (id: string) => {
    handleUpdateObstacles(config.obstacles.filter((o) => o.id !== id));
  };

  // Single Step Calculus Iteration
  const handleStepForward = () => {
    const wps = calculatedPath.waypoints;
    if (wps.length === 0) return;

    const nextIdx = Math.min(currentWaypointIndexRef.current + 1, wps.length - 1);
    currentWaypointIndexRef.current = nextIdx;
    const targetWp = wps[nextIdx];

    setRobotState((prev) => {
      const dx = targetWp.x - prev.x;
      const dy = targetWp.y - prev.y;
      const heading = Math.atan2(dy, dx);
      const stepDist = Math.sqrt(dx * dx + dy * dy);

      // Check collision with any obstacle
      let collision = false;
      for (const obs of config.obstacles) {
        if (distance(targetWp, obs) < obs.radius) {
          collision = true;
          break;
        }
      }

      const reached = distance(targetWp, config.goal) < 0.2;

      return {
        ...prev,
        x: targetWp.x,
        y: targetWp.y,
        theta: heading,
        trail: [...prev.trail.slice(-120), { x: targetWp.x, y: targetWp.y }],
        distanceTraveled: prev.distanceTraveled + stepDist,
        timeElapsed: prev.timeElapsed + stepDist / config.robotBaseSpeed,
        isColliding: collision,
        status: reached ? 'REACHED_GOAL' : collision ? 'COLLISION_AVOIDED' : 'MOVING',
      };
    });
  };

  // Manual Steering Driver (Arrow Keys / Button Driving)
  const handleManualDrive = (dTheta: number, vStep: number) => {
    setRobotState((prev) => {
      const newTheta = prev.theta + dTheta;
      const newX = Math.max(
        0.2,
        Math.min(9.8, prev.x + Math.cos(newTheta) * vStep)
      );
      const newY = Math.max(
        0.2,
        Math.min(5.8, prev.y + Math.sin(newTheta) * vStep)
      );
      const stepDist = distance({ x: prev.x, y: prev.y }, { x: newX, y: newY });

      let collision = false;
      for (const obs of config.obstacles) {
        if (distance({ x: newX, y: newY }, obs) < obs.radius) {
          collision = true;
          break;
        }
      }

      const reached = distance({ x: newX, y: newY }, config.goal) < 0.3;

      return {
        ...prev,
        x: newX,
        y: newY,
        theta: newTheta,
        trail: [...prev.trail.slice(-150), { x: newX, y: newY }],
        distanceTraveled: prev.distanceTraveled + stepDist,
        timeElapsed: prev.timeElapsed + stepDist / config.robotBaseSpeed,
        isColliding: collision,
        status: reached ? 'REACHED_GOAL' : 'MOVING',
      };
    });
  };

  // Keyboard navigation listener for manual driving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTool === 'MANUAL_DRIVE') {
        if (e.key === 'ArrowUp' || e.key === 'w') {
          e.preventDefault();
          handleManualDrive(0, 0.3);
        } else if (e.key === 'ArrowDown' || e.key === 's') {
          e.preventDefault();
          handleManualDrive(0, -0.2);
        } else if (e.key === 'ArrowLeft' || e.key === 'a') {
          e.preventDefault();
          handleManualDrive(0.2, 0.08);
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          e.preventDefault();
          handleManualDrive(-0.2, 0.08);
        }
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool]);

  // Animation Loop for Path Traversal
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const wps = calculatedPath.waypoints;
    if (wps.length <= 1) return;

    const animate = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000.0;
      lastTimeRef.current = time;

      // Advance along path
      const speed = config.robotBaseSpeed * playbackSpeed;
      const currentIdx = currentWaypointIndexRef.current;

      if (currentIdx >= wps.length - 1) {
        setIsPlaying(false);
        setRobotState((prev) => ({ ...prev, status: 'REACHED_GOAL' }));
        return;
      }

      // Find next waypoint
      const nextIdx = Math.min(currentIdx + 1, wps.length - 1);
      const targetWp = wps[nextIdx];

      setRobotState((prev) => {
        const dx = targetWp.x - prev.x;
        const dy = targetWp.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const heading = Math.atan2(dy, dx);

        const moveStep = Math.min(dist, speed * dt * 2.5);
        const newX = prev.x + (dist > 0 ? (dx / dist) * moveStep : 0);
        const newY = prev.y + (dist > 0 ? (dy / dist) * moveStep : 0);

        if (dist < 0.15) {
          currentWaypointIndexRef.current = nextIdx;
        }

        // Collision check
        let collision = false;
        for (const obs of config.obstacles) {
          if (distance({ x: newX, y: newY }, obs) < obs.radius) {
            collision = true;
            break;
          }
        }

        const reached = distance({ x: newX, y: newY }, config.goal) < 0.25;

        return {
          ...prev,
          x: newX,
          y: newY,
          theta: heading,
          trail: [...prev.trail.slice(-200), { x: newX, y: newY }],
          distanceTraveled: prev.distanceTraveled + moveStep,
          timeElapsed: prev.timeElapsed + dt * playbackSpeed,
          isColliding: collision,
          status: reached ? 'REACHED_GOAL' : collision ? 'COLLISION_AVOIDED' : 'MOVING',
        };
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, calculatedPath, config.robotBaseSpeed, config.obstacles, config.goal, playbackSpeed]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card rounded-3xl p-6 sm:p-8 border border-rain-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Robotics & Mathematics Studio
            </span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Live Interactive Manual Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
            Finding the Simple Shortest Path for a Moving Robot Using Calculus
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Analytical optimization studio applying the Euler-Lagrange variational equation, Fermat least-time refraction, and vector potential gradient descent for autonomous mobile robotics.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/presentation"
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/25 flex items-center gap-2 transition-all hover:scale-105"
          >
            <Presentation className="w-4 h-4" />
            10-Slide Viva Deck
          </Link>
          <Link
            to="/derivation"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            Calculus Proofs
          </Link>
        </div>
      </div>

      {/* 2. Real-Time Telemetry KPI Strip */}
      <PathTelemetryCard calculatedPath={calculatedPath} robotState={robotState} />

      {/* 3. Interactive 2D Simulation Canvas */}
      <RobotCanvas
        config={config}
        calculatedPath={calculatedPath}
        robotState={robotState}
        onUpdateStart={handleUpdateStart}
        onUpdateGoal={handleUpdateGoal}
        onUpdateObstacle={handleUpdateObstacles}
        onAddObstacle={handleAddObstacle}
        onDeleteObstacle={handleDeleteObstacle}
        activeTool={activeTool}
        onManualDriveStep={handleManualDrive}
      />

      {/* 4. Manual Controls & Parameter Tuning Studio */}
      <ManualControls
        config={config}
        onUpdateConfig={handleUpdateConfig}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
        onStepForward={handleStepForward}
        onReset={handleReset}
        playbackSpeed={playbackSpeed}
        onUpdateSpeed={setPlaybackSpeed}
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        onManualDrive={handleManualDrive}
        onLoadPreset={handleLoadPreset}
      />
    </div>
  );
};
