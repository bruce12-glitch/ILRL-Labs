import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import {
  buildElectricArc,
  computeStageTilt,
  getHandOffsets,
  type ElectricArc,
  type SparkParticle,
} from "../utils/touchPhysics";

interface CyberneticTouchProps {
  motionEnabled?: boolean;
  variant?: "hero" | "bottom";
}

/**
 * Exact fingertip contact point in cyber_hand_upper.png / human_hand_lower.png (768x1052):
 * cx = 400 / 768 = 0.5208, cy = 526 / 1052 = 0.500
 */
const VISUAL_CONTACT = {
  x: 0.5208,
  y: 0.5,
} as const;

const EDGE_START_OFFSET = 220;

export function CyberneticTouch({
  motionEnabled = true,
  variant = "hero",
}: CyberneticTouchProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [connected, setConnected] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [phaseLabel, setPhaseLabel] = useState<"approaching" | "connected">(
    "approaching"
  );

  const particlesRef = useRef<SparkParticle[]>([]);
  const electricArcsRef = useRef<ElectricArc[]>([]);
  const animationPhaseRef = useRef<0 | 1>(0);
  const touchProgressRef = useRef<number>(0);
  const approachRafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const createContactSparkBurst = useCallback((x: number, y: number) => {
    for (let i = 0; i < 42; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.2 + 0.8;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.1 + 0.6,
        alpha: 0.9,
        decay: Math.random() * 0.028 + 0.012,
        color: Math.random() > 0.3 ? "#ffecb3" : "#ffa433",
      });
    }
  }, []);

  const triggerInitialTouch = useCallback(() => {
    if (approachRafRef.current) cancelAnimationFrame(approachRafRef.current);
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setConnected(false);
    setPhaseLabel("approaching");
    particlesRef.current = [];
    electricArcsRef.current = [];
    animationPhaseRef.current = 0;
    touchProgressRef.current = 0;

    if (!motionEnabled) {
      setConnected(true);
      setPhaseLabel("connected");
      animationPhaseRef.current = 1;
      touchProgressRef.current = 1;
      return;
    }

    timerRef.current = window.setTimeout(() => {
      setConnected(true);
      const startTime = performance.now();
      const duration = 2500;

      const trackApproach = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        touchProgressRef.current = progress;

        const canvas = canvasRef.current;
        const width = canvas?.width ?? 520;
        const height = canvas?.height ?? 712;
        const targetX = width * VISUAL_CONTACT.x;
        const targetY = height * VISUAL_CONTACT.y;

        if (progress > 0.58 && progress < 0.95 && Math.random() < 0.28) {
          electricArcsRef.current.push(
            buildElectricArc(targetX, targetY, progress)
          );
        }

        if (progress >= 0.94 && animationPhaseRef.current === 0) {
          animationPhaseRef.current = 1;
          setPhaseLabel("connected");
          createContactSparkBurst(targetX, targetY);
        }

        if (progress < 1) {
          approachRafRef.current = requestAnimationFrame(trackApproach);
        }
      };

      approachRafRef.current = requestAnimationFrame(trackApproach);
    }, 60);
  }, [createContactSparkBurst, motionEnabled]);

  useEffect(() => {
    triggerInitialTouch();
    return () => {
      if (approachRafRef.current) cancelAnimationFrame(approachRafRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [triggerInitialTouch]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width));
      canvas.height = Math.max(1, Math.round(rect.height));
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const targetX = width * VISUAL_CONTACT.x;
      const targetY = height * VISUAL_CONTACT.y;

      ctx.clearRect(0, 0, width, height);

      if (
        motionEnabled &&
        animationPhaseRef.current === 1 &&
        Math.random() < 0.1
      ) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.2 + 0.3;
        particlesRef.current.push({
          x: targetX + (Math.random() - 0.5) * 4,
          y: targetY + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: Math.random() * 1.5 + 0.6,
          alpha: 0.78,
          decay: 0.022,
          color: "#ffe29a",
        });
      }

      const arcs = electricArcsRef.current;
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0, arc.life);
        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1);

        const steps = 5;
        for (let j = 1; j < steps; j++) {
          const t = j / steps;
          const px =
            arc.x1 + (arc.x2 - arc.x1) * t + (Math.random() - 0.5) * 12;
          const py =
            arc.y1 + (arc.y2 - arc.y1) * t + (Math.random() - 0.5) * 12;
          ctx.lineTo(px, py);
        }
        ctx.lineTo(arc.x2, arc.y2);
        ctx.stroke();

        arc.life -= arc.decay;
        if (arc.life <= 0) arcs.splice(i, 1);
      }

      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0) parts.splice(i, 1);
      }

      ctx.globalAlpha = 1.0;
      if (motionEnabled) {
        rafId = requestAnimationFrame(render);
      }
    };

    if (motionEnabled) {
      rafId = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [motionEnabled]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!motionEnabled || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    setTilt(computeStageTilt(e.clientX, e.clientY, rect, 6));
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const offsets = getHandOffsets(connected, EDGE_START_OFFSET);
  const cyberHandUrl = `${import.meta.env.BASE_URL}assets/hands/cyber-hand-upper.png`;
  const humanHandUrl = `${import.meta.env.BASE_URL}assets/hands/human-hand-lower.png`;

  return (
    <div
      className={`cyber-touch-wrapper cyber-touch-${variant}`}
      data-testid={`cyber-touch-${variant}`}
      data-state={phaseLabel}
    >
      <div className="cyber-stage-unboxed">
        <div
          ref={stageRef}
          id={variant === "bottom" ? "stage" : `stage-${variant}`}
          className={`stage-seamless ${connected ? "connected" : ""}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label="Cybernetic hand and human hand reaching from the screen edges to touch at the center"
          style={{
            transform: `perspective(1100px) rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`,
          }}
        >
          {/* Ambient radial glow behind the convergence point */}
          <div className="convergence-ambient-glow" />

          {/* Cybernetic Hand (Top-Left) — completely separate isolated hand PNG */}
          <motion.img
            id={variant === "bottom" ? "handCyber" : `handCyber-${variant}`}
            src={cyberHandUrl}
            alt=""
            className="hand-seamless hand-cyber-isolated"
            initial={
              motionEnabled
                ? {
                    x: -EDGE_START_OFFSET,
                    y: -EDGE_START_OFFSET,
                    opacity: 0,
                  }
                : false
            }
            animate={{
              x: offsets.cyber.x,
              y: offsets.cyber.y,
              opacity: 1,
            }}
            transition={
              motionEnabled
                ? { duration: 2.5, ease: [0.16, 1, 0.3, 1] }
                : { duration: 0 }
            }
          />

          {/* Human Hand (Bottom-Right) — completely separate isolated hand PNG */}
          <motion.img
            id={variant === "bottom" ? "handHuman" : `handHuman-${variant}`}
            src={humanHandUrl}
            alt=""
            className="hand-seamless hand-human-isolated"
            initial={
              motionEnabled
                ? {
                    x: EDGE_START_OFFSET,
                    y: EDGE_START_OFFSET,
                    opacity: 0,
                  }
                : false
            }
            animate={{
              x: offsets.human.x,
              y: offsets.human.y,
              opacity: 1,
            }}
            transition={
              motionEnabled
                ? { duration: 2.5, ease: [0.16, 1, 0.3, 1] }
                : { duration: 0 }
            }
          />

          {/* Subtle Particle and Pre-Contact Arc Canvas */}
          <canvas
            ref={canvasRef}
            id={variant === "bottom" ? "fxCanvas" : `fxCanvas-${variant}`}
            className="fx-canvas"
          />

          {/* Fingertip Optical Light Core & Anamorphic Lens Streak */}
          <div
            className="light-core"
            style={{
              left: `${VISUAL_CONTACT.x * 100}%`,
              top: `${VISUAL_CONTACT.y * 100}%`,
            }}
          />
          <div
            className="flare-streak"
            style={{
              left: `${VISUAL_CONTACT.x * 100}%`,
              top: `${VISUAL_CONTACT.y * 100}%`,
            }}
          />

          {/* Seamless 4-edge + radial scrim fading into #101211 canvas */}
          <div className="stage-edge-scrim" />
        </div>
      </div>
    </div>
  );
}
