import assert from "node:assert/strict";
import test from "node:test";
import {
  buildElectricArc,
  buildSupernovaShockwaves,
  computeStageTilt,
  CONTACT_NORM,
  getContactCoordinates,
  getHandOffsets,
  RETRACTED_OFFSET,
} from "../src/utils/touchPhysics.ts";

test("contact coordinates map to (54.5%, 46.8%) of stage dimensions", () => {
  const coords = getContactCoordinates(1000, 2000);
  assert.equal(coords.x, 545);
  assert.equal(coords.y, 936);
  assert.equal(CONTACT_NORM.x, 0.545);
  assert.equal(CONTACT_NORM.y, 0.468);
});

test("hand offsets retract to (-160, -160) and (+160, +160) when separated and center to (0, 0) when connected", () => {
  const separated = getHandOffsets(false);
  assert.deepEqual(separated.cyber, { x: -RETRACTED_OFFSET, y: -RETRACTED_OFFSET });
  assert.deepEqual(separated.human, { x: RETRACTED_OFFSET, y: RETRACTED_OFFSET });

  const connected = getHandOffsets(true);
  assert.deepEqual(connected.cyber, { x: 0, y: 0 });
  assert.deepEqual(connected.human, { x: 0, y: 0 });
});

test("electric arc gap shrinks as fingertips approach contact", () => {
  const earlyArc = buildElectricArc(260, 480, 0.5, 0.8);
  const lateArc = buildElectricArc(260, 480, 0.9, 0.2);

  const earlySpan = earlyArc.x2 - earlyArc.x1;
  const lateSpan = lateArc.x2 - lateArc.x1;
  assert.ok(earlySpan > lateSpan, "Arc span should decrease as progress approaches 1");
  assert.equal(earlyArc.color, "#ffe8b5");
  assert.equal(lateArc.color, "#8fe7ff");
});

test("supernova shockwaves scale with stage width", () => {
  const rings = buildSupernovaShockwaves(500);
  assert.equal(rings.length, 2);
  assert.equal(rings[0].maxR, 325);
  assert.equal(rings[1].maxR, 225);
});

test("stage 3D tilt calculates centered perspective rotation", () => {
  const rect = { left: 100, top: 100, width: 400, height: 800 };
  const centerTilt = computeStageTilt(300, 500, rect);
  assert.deepEqual(centerTilt, { rotateX: 0, rotateY: 0 });

  const cornerTilt = computeStageTilt(500, 100, rect);
  assert.equal(cornerTilt.rotateY, 4);
  assert.equal(cornerTilt.rotateX, 4);
});
