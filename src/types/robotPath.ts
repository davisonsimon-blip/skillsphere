export interface Point2D {
  x: number;
  y: number;
}

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  radius: number;
  label?: string;
}

export interface TerrainZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number; // m/s
  color: string;
  frictionName: string;
}

export type CalculusMethod =
  | 'EULER_LAGRANGE'      // Geodesic straight-line in flat metric space (Variational Calculus)
  | 'FERMAT_LEAST_TIME'   // Snell's Law refraction across variable velocity terrain (dT/dx = 0)
  | 'GRADIENT_POTENTIAL'  // Artificial Potential Field: q_dot = -grad(U_att + U_rep)
  | 'CURVATURE_DUBINS';   // Curvature-constrained Euler spiral/Dubins car (kappa <= kappa_max)

export interface RobotState {
  x: number;
  y: number;
  theta: number;          // Heading in radians
  velocity: number;       // Linear speed in m/s
  angularVelocity: number;// rad/s
  trail: Point2D[];
  distanceTraveled: number;
  timeElapsed: number;
  isColliding: boolean;
  status: 'IDLE' | 'MOVING' | 'REACHED_GOAL' | 'COLLISION_AVOIDED';
}

export interface PathWaypoint extends Point2D {
  index: number;
  curvature?: number;
  potential?: number;
  velocity?: number;
  timeFromStart?: number;
}

export interface CalculatedPath {
  method: CalculusMethod;
  waypoints: PathWaypoint[];
  totalLength: number;       // Arc length integral L = \int ds
  euclideanLength: number;   // ||B - A||
  estimatedTime: number;     // T = \int ds / v
  efficiencyPercent: number; // (Euclidean / ArcLength) * 100%
  maxCurvature: number;
  energyCost: number;        // J = \int (v^2 + a^2) dt
  computationTimeMs: number;
}

export interface SimulationConfig {
  start: Point2D;
  goal: Point2D;
  obstacles: Obstacle[];
  terrains: TerrainZone[];
  method: CalculusMethod;
  robotBaseSpeed: number;     // m/s
  attractionGain: number;     // k_att
  repulsionGain: number;      // k_rep
  influenceRadius: number;    // d_0
  maxCurvature: number;       // kappa_max = 1 / R_min
  stepSizeDt: number;         // dt for numerical integration
  showGradientField: boolean;
  showSensorRays: boolean;
  showVariationalBand: boolean;
  showVelocityVectors: boolean;
  canvasScale: number;        // pixels per meter
}

export interface DerivationStep {
  stepNumber: number;
  title: string;
  mathLatex: string;
  description: string;
  significance: string;
}

export interface PresentationSlide {
  id: number;
  category: string;
  title: string;
  subtitle: string;
  bullets: string[];
  keyFormula?: string;
  highlightText?: string;
  speakerNotes?: string;
}
