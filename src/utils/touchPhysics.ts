export interface Point2D {
  x: number;
  y: number;
}

export interface ElectricArc {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
  decay: number;
  color: string;
}

export interface ShockwaveRing {
  r: number;
  maxR: number;
  width: number;
  alpha: number;
  speed: number;
}

export interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

/**
 * Contact coordinates where the cybernetic fingertip (top-left) and
 * human fingertip (bottom-right) meet near the center of the stage.
 */
export const CONTACT_NORM = {
  x: 0.545,
  y: 0.468,
} as const;

export const RETRACTED_OFFSET = 160;

/**
 * Computes the pixel coordinates of the fingertip contact point
 * for a given stage width and height.
 */
export function getContactCoordinates(width: number, height: number): Point2D {
  return {
    x: width * CONTACT_NORM.x,
    y: height * CONTACT_NORM.y,
  };
}

/**
 * Computes the translation offsets for the cybernetic hand (top-left)
 * and human hand (bottom-right) given connection state or progress [0..1].
 */
export function getHandOffsets(connected: boolean, offsetPx: number = RETRACTED_OFFSET): {
  cyber: Point2D;
  human: Point2D;
} {
  if (connected) {
    return {
      cyber: { x: 0, y: 0 },
      human: { x: 0, y: 0 },
    };
  }
  return {
    cyber: { x: -offsetPx, y: -offsetPx },
    human: { x: offsetPx, y: offsetPx },
  };
}

/**
 * Creates an electrical pre-arc jumping between the approaching fingertips.
 */
export function buildElectricArc(
  targetX: number,
  targetY: number,
  progress: number,
  rand: number = Math.random()
): ElectricArc {
  const clamped = Math.max(0, Math.min(1, progress));
  const gap = (1 - clamped) * 90;
  return {
    x1: targetX - gap * 0.7,
    y1: targetY - gap * 0.7,
    x2: targetX + gap * 0.4,
    y2: targetY + gap * 0.4,
    life: 1.0,
    decay: 0.12,
    color: rand > 0.4 ? "#ffe8b5" : "#8fe7ff",
  };
}

/**
 * Creates the dual shockwave rings when the fingertips connect at the center.
 */
export function buildSupernovaShockwaves(stageWidth: number): ShockwaveRing[] {
  return [
    { r: 5, maxR: stageWidth * 0.65, width: 4, alpha: 1, speed: 7 },
    { r: 5, maxR: stageWidth * 0.45, width: 8, alpha: 0.8, speed: 4.5 },
  ];
}

/**
 * Computes 3D perspective tilt angles (deg) from cursor position within stage bounds.
 */
export function computeStageTilt(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  maxDegrees: number = 8
): { rotateX: number; rotateY: number } {
  if (rect.width <= 0 || rect.height <= 0) {
    return { rotateX: 0, rotateY: 0 };
  }
  const normX = (clientX - rect.left) / rect.width - 0.5;
  const normY = (clientY - rect.top) / rect.height - 0.5;
  return {
    rotateY: Number((normX * maxDegrees).toFixed(2)),
    rotateX: Number((-normY * maxDegrees).toFixed(2)),
  };
}
