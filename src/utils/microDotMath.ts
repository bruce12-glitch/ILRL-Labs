export const MICRO_DOT_CONFIG = {
  text: "ILRL LABS",
  fontWeight: "600",
  fontSizePx: 216, // High-density vertical resolution (~34 dot rows)
  letterSpacingPx: 5, // Clean tracking for uppercase stems
  gridStepPx: 6, // 6px sampling cell -> 4 to 5 micro-dots per stem width
  dotSpacingWorld: 0.22, // World-space center-to-center pitch
  dotRadiusFill: 0.75, // Dot diameter ratio (leaves crisp dark gap)
  waveCycleSeconds: 3.4, // Duration of one full left-to-right inference sweep
  waveLeadSigma: 0.02, // Razor-sharp spectral leading edge
  waveTailDecay: 0.165, // Exponential decay trail
} as const;

export interface LemniscatePoint {
  x: number;
  y: number;
}

/**
 * Parametric Lemniscate of Bernoulli used by the ILRL LABS infinity emblem.
 */
export function sampleLemniscatePoint(
  t: number,
  a: number,
  yScale: number = 1.16
): LemniscatePoint {
  const sinT = Math.sin(t);
  const cosT = Math.cos(t);
  const denom = 1 + sinT * sinT;
  return {
    x: (a * cosT) / denom,
    y: ((a * sinT * cosT) / denom) * yScale,
  };
}

/**
 * Returns the upper-right interior accent dot geometry inside the right lobe.
 */
export function getInfinityAccentDot(symbolWidth: number): {
  dotX: number;
  dotY: number;
  dotRadius: number;
} {
  const a = symbolWidth * 0.46;
  return {
    dotX: a * 0.56,
    dotY: -a * 0.14,
    dotRadius: symbolWidth * 0.068,
  };
}

/**
 * Computes the normalized wavefront head position [-0.22 .. 1.32] for a given elapsed time.
 */
export function computeWaveHead(
  elapsedSeconds: number,
  cycleSeconds: number = MICRO_DOT_CONFIG.waveCycleSeconds
): number {
  const safeCycle = Math.max(0.001, cycleSeconds);
  const phase =
    (((elapsedSeconds % safeCycle) + safeCycle) % safeCycle) / safeCycle;
  return -0.22 + (1.32 - -0.22) * phase;
}

/**
 * Computes orthographic camera frustum dimensions and point size in pixels.
 */
export function computeOrthographicFrustum(
  viewportWidth: number,
  viewportHeight: number,
  worldWidth: number,
  worldHeight: number,
  pixelRatio: number
): {
  frustumWidth: number;
  frustumHeight: number;
  pointSizePx: number;
} {
  const w = Math.max(1, viewportWidth);
  const h = Math.max(1, viewportHeight);
  const aspect = w / h;
  const targetWidth = worldWidth * 1.18;
  let frustumWidth = targetWidth;
  let frustumHeight = frustumWidth / aspect;

  if (frustumHeight < worldHeight * 1.7) {
    frustumHeight = worldHeight * 1.7;
    frustumWidth = frustumHeight * aspect;
  }

  const pixelsPerWorldUnit = (w * pixelRatio) / frustumWidth;
  const pointSizePx =
    MICRO_DOT_CONFIG.dotSpacingWorld *
    pixelsPerWorldUnit *
    MICRO_DOT_CONFIG.dotRadiusFill;

  return {
    frustumWidth,
    frustumHeight,
    pointSizePx,
  };
}
