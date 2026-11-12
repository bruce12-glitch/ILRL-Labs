import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  computeOrthographicFrustum,
  computeWaveHead,
  getInfinityAccentDot,
  MICRO_DOT_CONFIG,
  sampleLemniscatePoint,
} from "../utils/microDotMath";

interface MicroDotInfinityStageProps {
  motionEnabled: boolean;
}

const VERTEX_SHADER = /* glsl */ `
attribute float aNormX;
attribute float aNormY;
attribute float aCoverage;
attribute float aColIndex;
uniform float uWaveHead;
uniform float uTime;
uniform float uPointSizePx;
uniform float uLeadSigma;
uniform float uTailDecay;
varying float vBaseLum;
varying float vLeadEdge;
varying float vTailEnergy;
varying float vCoverage;

void main() {
  vCoverage = aCoverage;
  // Distance from moving wavefront
  float delta = aNormX - uWaveHead;
  // 1. Sharp leading inference wavefront
  float lead = exp(-(delta * delta) / (2.0 * uLeadSigma * uLeadSigma));
  // 2. Exponential decay tail with high-frequency column harmonic shimmer
  float rawTail = (delta < 0.0) ? exp(delta / uTailDecay) : 0.0;
  float harmonic = 0.86 + 0.14 * sin(aColIndex * 1.35 - uTime * 16.0 + aNormY * 9.0);
  float tail = rawTail * harmonic;
  vLeadEdge = lead;
  vTailEnergy = max(lead, tail);
  // Isoquant-matched horizontal resting luminance gradient (0.88 left -> 0.22 right)
  vBaseLum = mix(0.88, 0.22, pow(aNormX, 0.85));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  // Crisp contour scaling + subtle 14% optical dilation at wave peak
  float edgeScale = mix(0.76, 1.0, aCoverage);
  float pulseScale = 1.0 + vTailEnergy * 0.14;
  gl_PointSize = uPointSizePx * edgeScale * pulseScale;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
varying float vBaseLum;
varying float vLeadEdge;
varying float vTailEnergy;
varying float vCoverage;

void main() {
  vec2 uv = (gl_PointCoord - vec2(0.5)) * 2.0;
  float r2 = dot(uv, uv);
  if (r2 > 1.0) discard;
  float r = sqrt(r2);
  // Anti-aliased circular micro-diode mask
  float discMask = 1.0 - smoothstep(0.76, 1.0, r);
  // 3D hemispherical micro-lens dome
  float dome = mix(0.84, 1.10, sqrt(max(0.0, 1.0 - r2)));
  // Resting monochrome gradient (#e0e2e0 on left -> #383b39 on right)
  vec3 restColor = vec3(0.96, 0.99, 0.97) * vBaseLum * dome;
  // Active tail color (pure titanium white)
  vec3 tailColor = vec3(1.0, 1.0, 1.0) * dome;
  // Leading wavefront spectral dispersion (subtle ice-cyan optical rim)
  vec3 spectralLead = vec3(0.78, 0.93, 1.0) * 1.08;
  vec3 activeColor = mix(tailColor, spectralLead, clamp(vLeadEdge * 0.75, 0.0, 1.0));
  vec3 finalColor = mix(restColor, activeColor, clamp(vTailEnergy * 0.96, 0.0, 1.0));
  gl_FragColor = vec4(finalColor, discMask * vCoverage);
}
`;

function drawInfinitySymbol(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  width: number
) {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = width * 0.135;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const a = width * 0.46;
  const yScale = 1.16;
  const steps = 180;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const { x, y } = sampleLemniscatePoint(t, a, yScale);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Signature ILRL Labs upper-right inward diagonal tick + interior accent inside the right lobe
  const { dotX, dotY, dotRadius } = getInfinityAccentDot(width);
  ctx.beginPath();
  ctx.moveTo(a * 0.8, -a * 0.31);
  ctx.lineTo(dotX, dotY);
  ctx.lineWidth = width * 0.125;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(dotX, dotY, dotRadius * 0.88, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function buildMicroDotLockup(word: string) {
  const offCanvas = document.createElement("canvas");
  const ctx = offCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      geometry: new THREE.BufferGeometry(),
      worldWidth: 18,
      worldHeight: 4.5,
    };
  }

  const fontSpec = `${MICRO_DOT_CONFIG.fontWeight} ${MICRO_DOT_CONFIG.fontSizePx}px "Inter", -apple-system, BlinkMacSystemFont, Arial, sans-serif`;
  ctx.font = fontSpec;
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      `${MICRO_DOT_CONFIG.letterSpacingPx}px`;
  }

  const textMetrics = ctx.measureText(word);
  const symbolWidth = MICRO_DOT_CONFIG.fontSizePx * 1.15;
  const symbolGap = MICRO_DOT_CONFIG.fontSizePx * 0.34;
  const padPx = MICRO_DOT_CONFIG.gridStepPx * 6;
  const widthPx = Math.ceil(
    padPx * 2 + symbolWidth + symbolGap + textMetrics.width
  );
  const heightPx = Math.ceil(MICRO_DOT_CONFIG.fontSizePx * 1.36);

  offCanvas.width = widthPx;
  offCanvas.height = heightPx;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, widthPx, heightPx);

  const midY = heightPx * 0.5;
  drawInfinitySymbol(ctx, padPx + symbolWidth * 0.5, midY, symbolWidth);

  ctx.font = fontSpec;
  if ("letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
      `${MICRO_DOT_CONFIG.letterSpacingPx}px`;
  }
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(
    word,
    padPx + symbolWidth + symbolGap,
    midY + MICRO_DOT_CONFIG.fontSizePx * 0.02
  );

  const imgData = ctx.getImageData(0, 0, widthPx, heightPx).data;
  const step = MICRO_DOT_CONFIG.gridStepPx;
  const cols = Math.floor(widthPx / step);
  const rows = Math.floor(heightPx / step);
  const rawDots: Array<{ c: number; r: number; coverage: number }> = [];

  let minCol = Infinity;
  let maxCol = -Infinity;
  let minRow = Infinity;
  let maxRow = -Infinity;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      const startX = c * step;
      const startY = r * step;
      for (let sy = 0; sy < step; sy++) {
        const rowOffset = (startY + sy) * widthPx;
        for (let sx = 0; sx < step; sx++) {
          sum += imgData[(rowOffset + startX + sx) * 4];
        }
      }
      const coverage = sum / (step * step * 255);
      if (coverage > 0.15) {
        if (c < minCol) minCol = c;
        if (c > maxCol) maxCol = c;
        if (r < minRow) minRow = r;
        if (r > maxRow) maxRow = r;
        rawDots.push({
          c,
          r,
          coverage: THREE.MathUtils.smoothstep(coverage, 0.14, 0.62),
        });
      }
    }
  }

  const spanCols = Math.max(1, maxCol - minCol);
  const spanRows = Math.max(1, maxRow - minRow);
  const centerCol = (minCol + maxCol) * 0.5;
  const centerRow = (minRow + maxRow) * 0.5;
  const count = rawDots.length;

  const positions = new Float32Array(count * 3);
  const aNormX = new Float32Array(count);
  const aNormY = new Float32Array(count);
  const aCoverage = new Float32Array(count);
  const aColIndex = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const d = rawDots[i];
    positions[i * 3] = (d.c - centerCol) * MICRO_DOT_CONFIG.dotSpacingWorld;
    positions[i * 3 + 1] = -(d.r - centerRow) * MICRO_DOT_CONFIG.dotSpacingWorld;
    positions[i * 3 + 2] = 0.0;
    aNormX[i] = (d.c - minCol) / spanCols;
    aNormY[i] = (d.r - minRow) / spanRows;
    aCoverage[i] = d.coverage;
    aColIndex[i] = d.c - minCol;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aNormX", new THREE.BufferAttribute(aNormX, 1));
  geometry.setAttribute("aNormY", new THREE.BufferAttribute(aNormY, 1));
  geometry.setAttribute("aCoverage", new THREE.BufferAttribute(aCoverage, 1));
  geometry.setAttribute("aColIndex", new THREE.BufferAttribute(aColIndex, 1));

  return {
    geometry,
    worldWidth: (spanCols + 6) * MICRO_DOT_CONFIG.dotSpacingWorld,
    worldHeight: (spanRows + 6) * MICRO_DOT_CONFIG.dotSpacingWorld,
  };
}

export function MicroDotInfinityStage({
  motionEnabled,
}: MicroDotInfinityStageProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const motionEnabledRef = useRef(motionEnabled);
  motionEnabledRef.current = motionEnabled;

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const gl = document.createElement("canvas").getContext("webgl2");
    if (!gl) return;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      // Keep the static mark when WebGL initialization fails.
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-10, 10, 5, -5, 0.1, 100);
    camera.position.set(0, 0, 10);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x101211, 0.0);
    const pr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(pr);
    renderer.setSize(host.clientWidth || 1024, host.clientHeight || 280);
    host.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uWaveHead: { value: 0.45 },
        uTime: { value: 0.0 },
        uPointSizePx: { value: 6.0 },
        uLeadSigma: { value: MICRO_DOT_CONFIG.waveLeadSigma },
        uTailDecay: { value: MICRO_DOT_CONFIG.waveTailDecay },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });

    let pointsMesh: THREE.Points | null = null;
    let lockupMetrics = { worldWidth: 18, worldHeight: 4.5 };
    let disposed = false;

    const handleResize = () => {
      if (disposed || !host) return;
      const w = Math.max(1, host.clientWidth);
      const h = Math.max(1, host.clientHeight);
      const currentPr = isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(currentPr);
      renderer.setSize(w, h);

      const { frustumWidth, frustumHeight, pointSizePx } =
        computeOrthographicFrustum(
          w,
          h,
          lockupMetrics.worldWidth,
          lockupMetrics.worldHeight,
          currentPr
        );

      camera.left = -frustumWidth / 2;
      camera.right = frustumWidth / 2;
      camera.top = frustumHeight / 2;
      camera.bottom = -frustumHeight / 2;
      camera.updateProjectionMatrix();

      material.uniforms.uPointSizePx.value = pointSizePx;
    };

    const rebuildGeometry = () => {
      if (disposed) return;
      if (pointsMesh) {
        scene.remove(pointsMesh);
        pointsMesh.geometry.dispose();
      }
      const built = buildMicroDotLockup(MICRO_DOT_CONFIG.text);
      lockupMetrics = {
        worldWidth: built.worldWidth,
        worldHeight: built.worldHeight,
      };
      pointsMesh = new THREE.Points(built.geometry, material);
      scene.add(pointsMesh);
      handleResize();
      renderer.render(scene, camera);
    };

    rebuildGeometry();
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) rebuildGeometry();
      });
    }

    window.addEventListener("resize", handleResize);

    const startTimeMs = performance.now();
    let frameId = 0;
    let timerId = 0;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext | null;
      if (!gl || typeof gl.fenceSync !== "function") {
        timerId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          timerId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timerId = window.setTimeout(cb, 80);
        }
      };
      timerId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const elapsed = (performance.now() - startTimeMs) * 0.001;
      if (motionEnabledRef.current) {
        material.uniforms.uWaveHead.value = computeWaveHead(
          elapsed,
          MICRO_DOT_CONFIG.waveCycleSeconds
        );
        material.uniforms.uTime.value = elapsed;
      } else {
        material.uniforms.uWaveHead.value = 0.56;
        material.uniforms.uTime.value = 0.0;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      window.removeEventListener("resize", handleResize);
      if (frameId) cancelAnimationFrame(frameId);
      if (timerId) window.clearTimeout(timerId);
      if (pointsMesh) {
        scene.remove(pointsMesh);
        pointsMesh.geometry.dispose();
      }
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      id="ilrl-logo-stage"
      className="ilrl-logo-stage"
      data-testid="ilrl-logo-stage"
      role="img"
      aria-label="ILRL Labs"
    >
      <div ref={mountRef} className="ilrl-logo-canvas-host" />
      <img
        className="ilrl-logo-fallback"
        src={`${import.meta.env.BASE_URL}favicon.svg`}
        width="80"
        height="46"
        alt=""
        loading="lazy"
      />
    </div>
  );
}
