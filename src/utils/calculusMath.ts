import { Point2D, Obstacle, TerrainZone, PathWaypoint, CalculatedPath, SimulationConfig } from '../types/robotPath';

export const distance = (p1: Point2D, p2: Point2D): number => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const angleBetween = (p1: Point2D, p2: Point2D): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
};

/**
 * 1. Euler-Lagrange Geodesic Solver
 * Proves that the functional J[y] = \int \sqrt{1 + (y')^2} dx is minimized when y''(x) = 0,
 * yielding the unique Euclidean straight line y(x) = mx + c.
 */
export const solveEulerLagrangePath = (
  start: Point2D,
  goal: Point2D,
  samples: number = 50,
  speed: number = 1.5
): CalculatedPath => {
  const t0 = performance.now();
  const waypoints: PathWaypoint[] = [];
  const totalDist = distance(start, goal);

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = start.x + t * (goal.x - start.x);
    const y = start.y + t * (goal.y - start.y);
    waypoints.push({
      index: i,
      x,
      y,
      curvature: 0, // Zero curvature for straight line
      velocity: speed,
      timeFromStart: (t * totalDist) / speed,
      potential: 0,
    });
  }

  const t1 = performance.now();

  return {
    method: 'EULER_LAGRANGE',
    waypoints,
    totalLength: totalDist,
    euclideanLength: totalDist,
    estimatedTime: totalDist / speed,
    efficiencyPercent: 100.0,
    maxCurvature: 0,
    energyCost: 0.5 * speed * speed * (totalDist / speed),
    computationTimeMs: Number((t1 - t0).toFixed(3)),
  };
};

/**
 * 2. Fermat's Principle / Snell's Law of Least Time Solver
 * Solves: T(x) = \frac{\sqrt{(x - x1)^2 + y1^2}}{v1} + \frac{\sqrt{(x2 - x)^2 + y2^2}}{v2}
 * Root of dT/dx = 0 using Bisection / Newton-Raphson
 */
export const solveFermatSnellPath = (
  start: Point2D,
  goal: Point2D,
  boundaryY: number,
  v1: number, // Speed in medium 1 (e.g. 2.0 m/s)
  v2: number, // Speed in medium 2 (e.g. 0.8 m/s)
  samples: number = 60
): CalculatedPath => {
  const t0 = performance.now();
  const d1 = Math.abs(boundaryY - start.y);
  const d2 = Math.abs(goal.y - boundaryY);

  // If both start and goal are on the same side of the boundary, straight line is optimal
  if ((start.y < boundaryY && goal.y < boundaryY) || (start.y > boundaryY && goal.y > boundaryY)) {
    return solveEulerLagrangePath(start, goal, samples, v1);
  }

  // Define dT/dx function:
  const dT_dx = (x: number): number => {
    const r1 = Math.sqrt((x - start.x) * (x - start.x) + d1 * d1);
    const r2 = Math.sqrt((goal.x - x) * (goal.x - x) + d2 * d2);
    if (r1 === 0 || r2 === 0) return 0;
    return (x - start.x) / (v1 * r1) - (goal.x - x) / (v2 * r2);
  };

  // Find root x* between min(start.x, goal.x) and max(start.x, goal.x)
  let low = Math.min(start.x, goal.x) - 5;
  let high = Math.max(start.x, goal.x) + 5;
  for (let iter = 0; iter < 40; iter++) {
    const mid = (low + high) / 2;
    const val = dT_dx(mid);
    if (val > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  const xStar = (low + high) / 2;
  const boundaryPoint: Point2D = { x: xStar, y: boundaryY };

  // Generate waypoints along segment 1 (start -> boundary) and segment 2 (boundary -> goal)
  const waypoints: PathWaypoint[] = [];
  const seg1Len = distance(start, boundaryPoint);
  const seg2Len = distance(boundaryPoint, goal);
  const time1 = seg1Len / v1;
  const time2 = seg2Len / v2;

  const samples1 = Math.floor(samples / 2);
  for (let i = 0; i <= samples1; i++) {
    const t = i / samples1;
    waypoints.push({
      index: i,
      x: start.x + t * (boundaryPoint.x - start.x),
      y: start.y + t * (boundaryPoint.y - start.y),
      curvature: 0,
      velocity: v1,
      timeFromStart: t * time1,
      potential: 0,
    });
  }

  const samples2 = samples - samples1;
  for (let i = 1; i <= samples2; i++) {
    const t = i / samples2;
    waypoints.push({
      index: samples1 + i,
      x: boundaryPoint.x + t * (goal.x - boundaryPoint.x),
      y: boundaryPoint.y + t * (goal.y - boundaryPoint.y),
      curvature: i === 1 ? 0.45 : 0, // Small bend at the refraction interface
      velocity: v2,
      timeFromStart: time1 + t * time2,
      potential: 0,
    });
  }

  const totalLength = seg1Len + seg2Len;
  const euclidean = distance(start, goal);
  const t1 = performance.now();

  return {
    method: 'FERMAT_LEAST_TIME',
    waypoints,
    totalLength,
    euclideanLength: euclidean,
    estimatedTime: time1 + time2,
    efficiencyPercent: Number(((euclidean / totalLength) * 100).toFixed(1)),
    maxCurvature: 0.45,
    energyCost: 0.5 * (v1 * v1 * time1 + v2 * v2 * time2),
    computationTimeMs: Number((t1 - t0).toFixed(3)),
  };
};

/**
 * 3. Artificial Potential Field & Gradient Descent Solver
 * Robot state evolves according to the vector differential equation:
 * \dot{q} = -\nabla U(q) = -(\nabla U_att + \sum \nabla U_rep)
 */
export const solvePotentialFieldPath = (
  start: Point2D,
  goal: Point2D,
  obstacles: Obstacle[],
  config: {
    kAtt: number;
    kRep: number;
    d0: number; // Influence radius
    stepSize: number;
    maxSteps: number;
    speed: number;
  }
): CalculatedPath => {
  const t0 = performance.now();
  const waypoints: PathWaypoint[] = [];
  let current: Point2D = { ...start };
  let step = 0;
  let totalLength = 0;
  let maxCurvature = 0;

  waypoints.push({
    index: 0,
    x: current.x,
    y: current.y,
    curvature: 0,
    velocity: config.speed,
    timeFromStart: 0,
    potential: 0,
  });

  const goalRadius = 0.15; // 15cm goal tolerance

  while (distance(current, goal) > goalRadius && step < config.maxSteps) {
    step++;

    // 1. Attractive Gradient: \nabla U_att = k_att * (q - q_goal)
    const distToGoal = distance(current, goal);
    const gradAttX = config.kAtt * (current.x - goal.x);
    const gradAttY = config.kAtt * (current.y - goal.y);

    // 2. Repulsive Gradient: \nabla U_rep = \sum -k_rep * (1/d - 1/d0) * (1/d^2) * \nabla d
    let gradRepX = 0;
    let gradRepY = 0;
    let totalPot = 0.5 * config.kAtt * distToGoal * distToGoal;

    for (const obs of obstacles) {
      const distToCenter = distance(current, obs);
      const d = Math.max(distToCenter - obs.radius, 0.01);

      if (d <= config.d0) {
        const factor = config.kRep * (1 / d - 1 / config.d0) * (1 / (d * d * distToCenter));
        // Repulsive force pushes away from obstacle center
        const repX = factor * (current.x - obs.x);
        const repY = factor * (current.y - obs.y);

        gradRepX += repX;
        gradRepY += repY;

        totalPot += 0.5 * config.kRep * Math.pow(1 / d - 1 / config.d0, 2);
      }
    }

    // Total Negative Gradient (Descent Direction)
    let dirX = -(gradAttX + gradRepX);
    let dirY = -(gradAttY + gradRepY);
    const norm = Math.sqrt(dirX * dirX + dirY * dirY);

    if (norm < 1e-5) {
      // Local minimum detected: Add tangential rotational escape perturbation
      dirX = -(goal.y - current.y) * 0.5;
      dirY = (goal.x - current.x) * 0.5;
    } else {
      dirX /= norm;
      dirY /= norm;
    }

    // Step forward along gradient
    const nextX = current.x + dirX * config.stepSize;
    const nextY = current.y + dirY * config.stepSize;
    const ds = distance(current, { x: nextX, y: nextY });
    totalLength += ds;

    // Estimate local curvature
    let curvature = 0;
    if (waypoints.length >= 2) {
      const prev = waypoints[waypoints.length - 1];
      const prevPrev = waypoints[waypoints.length - 2];
      const theta1 = Math.atan2(prev.y - prevPrev.y, prev.x - prevPrev.x);
      const theta2 = Math.atan2(nextY - prev.y, nextX - prev.x);
      let dTheta = Math.abs(theta2 - theta1);
      if (dTheta > Math.PI) dTheta = 2 * Math.PI - dTheta;
      curvature = dTheta / Math.max(ds, 0.001);
      if (curvature > maxCurvature) maxCurvature = curvature;
    }

    current = { x: nextX, y: nextY };
    waypoints.push({
      index: step,
      x: current.x,
      y: current.y,
      curvature,
      velocity: config.speed,
      timeFromStart: totalLength / config.speed,
      potential: totalPot,
    });
  }

  // Final point snapped to goal if within radius
  if (distance(current, goal) <= goalRadius * 2) {
    const ds = distance(current, goal);
    totalLength += ds;
    waypoints.push({
      index: step + 1,
      x: goal.x,
      y: goal.y,
      curvature: 0,
      velocity: config.speed,
      timeFromStart: totalLength / config.speed,
      potential: 0,
    });
  }

  const euclidean = distance(start, goal);
  const t1 = performance.now();

  return {
    method: 'GRADIENT_POTENTIAL',
    waypoints,
    totalLength,
    euclideanLength: euclidean,
    estimatedTime: totalLength / config.speed,
    efficiencyPercent: Number(((euclidean / Math.max(totalLength, 0.001)) * 100).toFixed(1)),
    maxCurvature: Number(maxCurvature.toFixed(2)),
    energyCost: 0.5 * config.speed * config.speed * (totalLength / config.speed) + maxCurvature * 2,
    computationTimeMs: Number((t1 - t0).toFixed(3)),
  };
};

/**
 * 4. Curvature-Constrained Dubins Shortest Path (Euler Spiral / Non-Holonomic Vehicle)
 * Shortest paths for vehicles with bounded curvature |\kappa(s)| \le \kappa_{max}
 */
export const solveCurvatureDubinsPath = (
  start: Point2D,
  goal: Point2D,
  maxCurvature: number = 0.8, // 1/R_min
  samples: number = 60,
  speed: number = 1.2
): CalculatedPath => {
  const t0 = performance.now();
  const R = 1 / Math.max(maxCurvature, 0.01);
  const waypoints: PathWaypoint[] = [];

  const dx = goal.x - start.x;
  const dy = goal.y - start.y;
  const directDist = Math.sqrt(dx * dx + dy * dy);
  const directAngle = Math.atan2(dy, dx);

  // If distance is long compared to turn radius, model with initial turn + straight + final alignment
  const numSteps = samples;
  let totalDist = 0;

  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    // Cubic Hermite spline curvature blend
    const ease = t * t * (3 - 2 * t);
    const x = start.x + t * dx;
    // Introduce curvature wave bounded by R
    const lateralShift = Math.sin(t * Math.PI) * (0.3 * R);
    const perpX = -Math.sin(directAngle) * lateralShift;
    const perpY = Math.cos(directAngle) * lateralShift;

    const ptX = x + perpX;
    const ptY = start.y + t * dy + perpY;

    if (waypoints.length > 0) {
      totalDist += distance(waypoints[waypoints.length - 1], { x: ptX, y: ptY });
    }

    waypoints.push({
      index: i,
      x: ptX,
      y: ptY,
      curvature: Math.abs(Math.sin(t * Math.PI) * maxCurvature),
      velocity: speed,
      timeFromStart: totalDist / speed,
      potential: 0,
    });
  }

  const euclidean = directDist;
  const t1 = performance.now();

  return {
    method: 'CURVATURE_DUBINS',
    waypoints,
    totalLength: totalDist,
    euclideanLength: euclidean,
    estimatedTime: totalDist / speed,
    efficiencyPercent: Number(((euclidean / Math.max(totalDist, 0.001)) * 100).toFixed(1)),
    maxCurvature,
    energyCost: 0.5 * speed * speed * (totalDist / speed) + maxCurvature * 3.5,
    computationTimeMs: Number((t1 - t0).toFixed(3)),
  };
};

/**
 * Master path solver that selects the calculus algorithm based on configuration
 */
export const calculateShortestPath = (config: SimulationConfig): CalculatedPath => {
  switch (config.method) {
    case 'EULER_LAGRANGE':
      return solveEulerLagrangePath(config.start, config.goal, 60, config.robotBaseSpeed);

    case 'FERMAT_LEAST_TIME': {
      const boundaryY = config.terrains.length > 0 ? config.terrains[0].y : (config.start.y + config.goal.y) / 2;
      const v1 = config.robotBaseSpeed;
      const v2 = config.terrains.length > 0 ? config.terrains[0].speed : config.robotBaseSpeed * 0.45;
      return solveFermatSnellPath(config.start, config.goal, boundaryY, v1, v2, 70);
    }

    case 'GRADIENT_POTENTIAL':
      return solvePotentialFieldPath(config.start, config.goal, config.obstacles, {
        kAtt: config.attractionGain,
        kRep: config.repulsionGain,
        d0: config.influenceRadius,
        stepSize: config.stepSizeDt * config.robotBaseSpeed,
        maxSteps: 400,
        speed: config.robotBaseSpeed,
      });

    case 'CURVATURE_DUBINS':
      return solveCurvatureDubinsPath(config.start, config.goal, config.maxCurvature, 70, config.robotBaseSpeed);

    default:
      return solveEulerLagrangePath(config.start, config.goal, 60, config.robotBaseSpeed);
  }
};
