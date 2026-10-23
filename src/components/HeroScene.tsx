import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────
 * HeroScene — lightweight animated 3D backdrop for the hero.
 * A perspective dot-grid "attention field" with a travelling wave plus a
 * slow orbital loop (the recurrence motif). Dependency-free canvas:
 * DPR-capped, pauses offscreen, and renders one static frame when the
 * user prefers reduced motion.
 * ──────────────────────────────────────────────────────────────────────── */

const LIME = [198, 255, 74] as const;
const LIMEDIM = [115, 160, 45] as const;

function mix(a: readonly number[], b: readonly number[], t: number) {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}

export function HeroScene({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g: CanvasRenderingContext2D = ctx;

    let raf = 0;
    let running = true;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = !!entry?.isIntersecting;
        if (visible && !running && !reduced) {
          running = true;
          raf = requestAnimationFrame(draw);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden && running) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!document.hidden && !running && !reduced && canvas.getBoundingClientRect().top < window.innerHeight) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    // Project a tilted plane: grid (gx, gz) → screen with wave height y.
    function draw(t = 0) {
      if (!running && t !== 0) return;
      g.clearRect(0, 0, w, h);

      const cols = 34;
      const rows = 18;
      const cx = w * 0.72;
      const horizon = h * 0.30;
      const spreadX = Math.min(w * 0.42, 520);
      const spreadY = Math.max(h * 0.30, 120);
      const time = t / 1600;

      for (let r = 0; r < rows; r++) {
        const v = r / (rows - 1); // 0 far → 1 near
        for (let c = 0; c < cols; c++) {
          const u = c / (cols - 1) - 0.5;
          const wave =
            Math.sin(u * 6 + time * 1.4) * 0.5 +
            Math.sin(v * 5 - time * 1.1) * 0.5;
          const depth = v * v; // perspective compression
          const x = cx + u * spreadX * (0.35 + depth);
          const y = horizon + depth * spreadY + wave * 7 * depth - 8 * (1 - depth);
          const rad = 0.7 + depth * 1.7;
          const heat = Math.min(1, Math.max(0, 0.5 + wave * 0.5));
          g.beginPath();
          g.arc(x, y, rad, 0, Math.PI * 2);
          g.fillStyle = mix(LIMEDIM, LIME, heat * 0.75);
          g.globalAlpha = 0.08 + depth * 0.32;
          g.fill();
        }
      }
      g.globalAlpha = 1;

      // Orbital loop — the recurrence motif, slow and faint.
      const loopT = reduced ? 0.6 : time * 0.35;
      g.save();
      g.translate(cx, horizon + spreadY * 0.42);
      g.rotate(-0.18);
      g.strokeStyle = "rgba(198,255,74,0.4)";
      g.lineWidth = 1.4;
      for (const [rx, ry, alpha] of [[150, 34, 0.5], [110, 24, 0.35], [70, 15, 0.25]] as const) {
        g.globalAlpha = alpha;
        g.beginPath();
        g.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        g.stroke();
      }
      // satellite token travelling the outer loop
      const sx = Math.cos(loopT) * 150;
      const sy = Math.sin(loopT) * 34;
      g.globalAlpha = 0.95;
      g.fillStyle = "rgb(198,255,74)";
      g.beginPath();
      g.arc(sx, sy, 3.4, 0, Math.PI * 2);
      g.fill();
      g.restore();
      g.globalAlpha = 1;

      if (!reduced && running) raf = requestAnimationFrame(draw);
    }

    if (reduced) {
      running = false;
      draw(0);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
