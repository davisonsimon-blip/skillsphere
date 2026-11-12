import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Point2D,
  Obstacle,
  TerrainZone,
  CalculusMethod,
  SimulationConfig,
  CalculatedPath,
  RobotState,
} from '../types/robotPath';
import { distance, angleBetween } from '../utils/calculusMath';

interface RobotCanvasProps {
  config: SimulationConfig;
  calculatedPath: CalculatedPath;
  robotState: RobotState;
  onUpdateStart: (p: Point2D) => void;
  onUpdateGoal: (p: Point2D) => void;
  onUpdateObstacle: (obs: Obstacle[]) => void;
  onAddObstacle: (p: Point2D) => void;
  onDeleteObstacle: (id: string) => void;
  activeTool: 'SELECT' | 'ADD_OBSTACLE' | 'MOVE_GOAL' | 'MANUAL_DRIVE';
  onManualDriveStep?: (dTheta: number, v: number) => void;
}

export const RobotCanvas: React.FC<RobotCanvasProps> = ({
  config,
  calculatedPath,
  robotState,
  onUpdateStart,
  onUpdateGoal,
  onUpdateObstacle,
  onAddObstacle,
  onDeleteObstacle,
  activeTool,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [draggedItem, setDraggedItem] = useState<
    { type: 'START' | 'GOAL' | 'OBSTACLE'; id?: string; offset?: Point2D } | null
  >(null);
  const [hoverCoord, setHoverCoord] = useState<Point2D | null>(null);

  // Coordinate transforms: Meters (0..10, 0..6) <-> Canvas Pixels
  const canvasWidth = 840;
  const canvasHeight = 500;
  const scaleX = canvasWidth / 10.0; // 84 px per meter
  const scaleY = canvasHeight / 6.0; // 83.3 px per meter

  const toPixels = useCallback(
    (p: Point2D): Point2D => ({
      x: p.x * scaleX,
      y: canvasHeight - p.y * scaleY, // Flip Y for math Cartesian system
    }),
    [scaleX, scaleY, canvasHeight]
  );

  const toMeters = useCallback(
    (pix: Point2D): Point2D => ({
      x: Number((pix.x / scaleX).toFixed(2)),
      y: Number(((canvasHeight - pix.y) / scaleY).toFixed(2)),
    }),
    [scaleX, scaleY, canvasHeight]
  );

  // Main Canvas Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Background & Grid
    ctx.fillStyle = '#080E21';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Grid lines (every 1 meter)
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#151F3D';
    for (let x = 0; x <= 10; x++) {
      const px = x * scaleX;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, canvasHeight);
      ctx.stroke();

      // Tick label
      ctx.fillStyle = '#334155';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${x}m`, px + 3, canvasHeight - 6);
    }

    for (let y = 0; y <= 6; y++) {
      const py = canvasHeight - y * scaleY;
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(canvasWidth, py);
      ctx.stroke();

      // Tick label
      ctx.fillStyle = '#334155';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`${y}m`, 4, py - 4);
    }

    // 2. Draw Refraction Terrain Zones (if any)
    config.terrains.forEach((t) => {
      const topPix = canvasHeight - (t.y + t.height) * scaleY;
      const leftPix = t.x * scaleX;
      const widthPix = t.width * scaleX;
      const heightPix = t.height * scaleY;

      ctx.fillStyle = t.color;
      ctx.fillRect(leftPix, topPix, widthPix, heightPix);

      // Boundary line
      const boundaryPixY = canvasHeight - t.y * scaleY;
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, boundaryPixY);
      ctx.lineTo(canvasWidth, boundaryPixY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = '#FDE68A';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `🌿 ${t.name} (Speed: ${t.speed} m/s) • Snell Interface`,
        leftPix + 16,
        topPix + 22
      );
    });

    // 3. Draw Artificial Potential Gradient Vector Field (if enabled)
    if (config.showGradientField && config.method === 'GRADIENT_POTENTIAL') {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.lineWidth = 1;

      for (let gx = 0.5; gx < 10; gx += 0.8) {
        for (let gy = 0.5; gy < 6; gy += 0.8) {
          // Negative gradient
          const distToGoal = distance({ x: gx, y: gy }, config.goal);
          const attX = config.attractionGain * (config.goal.x - gx);
          const attY = config.attractionGain * (config.goal.y - gy);

          let repX = 0;
          let repY = 0;
          for (const obs of config.obstacles) {
            const dCenter = distance({ x: gx, y: gy }, obs);
            const d = Math.max(dCenter - obs.radius, 0.05);
            if (d < config.influenceRadius) {
              const factor =
                config.repulsionGain *
                (1 / d - 1 / config.influenceRadius) *
                (1 / (d * d * dCenter));
              repX += factor * (gx - obs.x);
              repY += factor * (gy - obs.y);
            }
          }

          let dirX = attX + repX;
          let dirY = attY + repY;
          const mag = Math.sqrt(dirX * dirX + dirY * dirY);
          if (mag > 0) {
            dirX /= mag;
            dirY /= mag;
          }

          const arrowLen = 10;
          const pStart = toPixels({ x: gx, y: gy });
          const pEnd = {
            x: pStart.x + dirX * arrowLen,
            y: pStart.y - dirY * arrowLen, // Flip Y
          };

          ctx.beginPath();
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();
        }
      }
    }

    // 4. Draw Circular Obstacles & Safety Halos
    config.obstacles.forEach((obs) => {
      const pObs = toPixels(obs);
      const rPix = obs.radius * scaleX;
      const haloPix = (obs.radius + config.influenceRadius) * scaleX;

      // Influence halo
      ctx.beginPath();
      ctx.arc(pObs.x, pObs.y, haloPix, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.06)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);

      // Solid obstacle body
      ctx.beginPath();
      ctx.arc(pObs.x, pObs.y, rPix, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Center crosshair
      ctx.fillStyle = '#FCA5A5';
      ctx.beginPath();
      ctx.arc(pObs.x, pObs.y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Label & coordinate
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(obs.label || `Obstacle R=${obs.radius}m`, pObs.x, pObs.y - rPix - 8);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`(${obs.x}, ${obs.y})`, pObs.x, pObs.y + rPix + 14);
      ctx.textAlign = 'left';
    });

    // 5. Draw Calculated Shortest Path
    if (calculatedPath.waypoints.length > 1) {
      // Glow background path
      ctx.beginPath();
      calculatedPath.waypoints.forEach((wp, idx) => {
        const pix = toPixels(wp);
        if (idx === 0) ctx.moveTo(pix.x, pix.y);
        else ctx.lineTo(pix.x, pix.y);
      });
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 8;
      ctx.stroke();

      // Core sharp calculus line
      ctx.beginPath();
      calculatedPath.waypoints.forEach((wp, idx) => {
        const pix = toPixels(wp);
        if (idx === 0) ctx.moveTo(pix.x, pix.y);
        else ctx.lineTo(pix.x, pix.y);
      });
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Path Waypoint Dots
      calculatedPath.waypoints.forEach((wp, idx) => {
        if (idx % 6 === 0) {
          const pix = toPixels(wp);
          ctx.beginPath();
          ctx.arc(pix.x, pix.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = '#0284C7';
          ctx.fill();
        }
      });
    }

    // 6. Draw Robot Traveled Trail
    if (robotState.trail.length > 1) {
      ctx.beginPath();
      robotState.trail.forEach((pt, idx) => {
        const pix = toPixels(pt);
        if (idx === 0) ctx.moveTo(pix.x, pix.y);
        else ctx.lineTo(pix.x, pix.y);
      });
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // 7. Draw Start Node (A)
    const pStart = toPixels(config.start);
    ctx.beginPath();
    ctx.arc(pStart.x, pStart.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pStart.x, pStart.y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('A (Start)', pStart.x + 14, pStart.y - 10);
    ctx.fillStyle = '#6EE7B7';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`(${config.start.x}, ${config.start.y})`, pStart.x + 14, pStart.y + 3);

    // 8. Draw Goal Node (B)
    const pGoal = toPixels(config.goal);
    ctx.beginPath();
    ctx.arc(pGoal.x, pGoal.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Goal reticle
    ctx.beginPath();
    ctx.arc(pGoal.x, pGoal.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('B (Goal)', pGoal.x + 14, pGoal.y - 10);
    ctx.fillStyle = '#FCA5A5';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText(`(${config.goal.x}, ${config.goal.y})`, pGoal.x + 14, pGoal.y + 3);

    // 9. Draw Moving Robot
    const pRobot = toPixels({ x: robotState.x, y: robotState.y });
    const robotHeading = -robotState.theta; // Inverted for canvas coordinate system

    ctx.save();
    ctx.translate(pRobot.x, pRobot.y);
    ctx.rotate(robotHeading);

    // Sensor Scanner Rays (if enabled)
    if (config.showSensorRays) {
      const rayRange = 70;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, rayRange, -Math.PI / 4, Math.PI / 4);
      ctx.closePath();
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, rayRange);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Robot Wheels
    ctx.fillStyle = '#334155';
    ctx.fillRect(-10, -14, 20, 5); // Left wheel
    ctx.fillRect(-10, 9, 20, 5);  // Right wheel

    // Robot Main Chassis
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.roundRect(-12, -9, 24, 18, 4);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Robot Caster Wheel & Top Dome
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Direction Heading Pointer Arrow
    ctx.fillStyle = '#FACC15';
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(6, -4);
    ctx.lineTo(6, 4);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Robot label & coordinates tag
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 9px "JetBrains Mono", monospace';
    ctx.fillText(
      `Robot [${robotState.x.toFixed(2)}, ${robotState.y.toFixed(2)}]`,
      pRobot.x - 28,
      pRobot.y - 18
    );

    // 10. Hover Tooltip Coordinates
    if (hoverCoord) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(canvasWidth - 140, 10, 130, 26);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(canvasWidth - 140, 10, 130, 26);

      ctx.fillStyle = '#38BDF8';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(`X: ${hoverCoord.x}m  Y: ${hoverCoord.y}m`, canvasWidth - 130, 27);
    }
  }, [
    config,
    calculatedPath,
    robotState,
    scaleX,
    scaleY,
    canvasHeight,
    toPixels,
    hoverCoord,
  ]);

  // Mouse Interactivity: Dragging Start, Goal, and Obstacles
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickPix: Point2D = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const clickM = toMeters(clickPix);

    // 1. Check Start Node Hit (Radius 0.3m)
    if (distance(clickM, config.start) <= 0.4) {
      setDraggedItem({ type: 'START' });
      return;
    }

    // 2. Check Goal Node Hit
    if (distance(clickM, config.goal) <= 0.4) {
      setDraggedItem({ type: 'GOAL' });
      return;
    }

    // 3. Check Obstacle Hits
    for (const obs of config.obstacles) {
      if (distance(clickM, obs) <= obs.radius + 0.2) {
        setDraggedItem({
          type: 'OBSTACLE',
          id: obs.id,
          offset: { x: obs.x - clickM.x, y: obs.y - clickM.y },
        });
        return;
      }
    }

    // 4. If Add Obstacle tool is active, place a new obstacle
    if (activeTool === 'ADD_OBSTACLE') {
      onAddObstacle(clickM);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mousePix: Point2D = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    const mouseM = toMeters(mousePix);
    setHoverCoord(mouseM);

    if (!draggedItem) return;

    // Clamp coordinates within 0.2m to 9.8m
    const clampedX = Math.max(0.2, Math.min(9.8, mouseM.x));
    const clampedY = Math.max(0.2, Math.min(5.8, mouseM.y));

    if (draggedItem.type === 'START') {
      onUpdateStart({ x: clampedX, y: clampedY });
    } else if (draggedItem.type === 'GOAL') {
      onUpdateGoal({ x: clampedX, y: clampedY });
    } else if (draggedItem.type === 'OBSTACLE' && draggedItem.id) {
      const updated = config.obstacles.map((obs) => {
        if (obs.id === draggedItem.id) {
          const offX = draggedItem.offset?.x || 0;
          const offY = draggedItem.offset?.y || 0;
          return {
            ...obs,
            x: Math.max(0.5, Math.min(9.5, Number((clampedX + offX).toFixed(2)))),
            y: Math.max(0.5, Math.min(5.5, Number((clampedY + offY).toFixed(2)))),
          };
        }
        return obs;
      });
      onUpdateObstacle(updated);
    }
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
  };

  return (
    <div
      ref={containerRef}
      className="glass-card rounded-3xl p-4 sm:p-6 border border-rain-border relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            2D Cartesian Continuous Space Simulation Arena
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            Dimensions: 10.0m × 6.0m
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Tip: Click & drag <strong className="text-emerald-400">Point A</strong>,{' '}
          <strong className="text-rose-400">Point B</strong>, or{' '}
          <strong className="text-amber-400">Obstacles</strong> directly on the canvas!
        </div>
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 flex justify-center">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            handleMouseUp();
            setHoverCoord(null);
          }}
          className="cursor-crosshair max-w-full h-auto"
        />
      </div>
    </div>
  );
};
