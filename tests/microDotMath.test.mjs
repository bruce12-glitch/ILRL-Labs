import assert from "node:assert/strict";
import test from "node:test";
import {
  computeOrthographicFrustum,
  computeWaveHead,
  getInfinityAccentDot,
  MICRO_DOT_CONFIG,
  sampleLemniscatePoint,
} from "../src/utils/microDotMath.ts";

test("parametric Lemniscate of Bernoulli reaches expected extrema and origin crossing", () => {
  const a = 100;
  const rightApex = sampleLemniscatePoint(0, a);
  assert.equal(rightApex.x, 100);
  assert.equal(rightApex.y, 0);

  const centerCrossing = sampleLemniscatePoint(Math.PI / 2, a);
  assert.ok(Math.abs(centerCrossing.x) < 1e-10);
  assert.ok(Math.abs(centerCrossing.y) < 1e-10);

  const leftApex = sampleLemniscatePoint(Math.PI, a);
  assert.equal(leftApex.x, -100);
  assert.ok(Math.abs(leftApex.y) < 1e-10);
});

test("infinity symbol upper-right accent dot sits inside the right lobe", () => {
  const dot = getInfinityAccentDot(200);
  assert.ok(dot.dotX > 0, "Accent dot should be in right lobe (+X)");
  assert.ok(dot.dotY < 0, "Accent dot should be in upper half (-Y in canvas coords)");
  assert.ok(dot.dotRadius > 0);
});

test("spectral inference wave head sweeps from -0.22 to 1.32 over waveCycleSeconds", () => {
  const start = computeWaveHead(0, MICRO_DOT_CONFIG.waveCycleSeconds);
  assert.ok(Math.abs(start - -0.22) < 1e-6);

  const mid = computeWaveHead(MICRO_DOT_CONFIG.waveCycleSeconds * 0.5, MICRO_DOT_CONFIG.waveCycleSeconds);
  assert.ok(Math.abs(mid - 0.55) < 1e-6);
});

test("orthographic frustum preserves minimum vertical margin and scales point size", () => {
  const desktop = computeOrthographicFrustum(1280, 360, 26, 4.5, 2);
  assert.ok(desktop.frustumWidth >= 26 * 1.18);
  assert.ok(desktop.frustumHeight >= 4.5 * 1.7);
  assert.ok(desktop.pointSizePx > 2);
});
