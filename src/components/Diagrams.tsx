import type { CSSProperties } from "react";

/* ────────────────────────────────────────────────────────────────────────
 * 3D isometric motif for ILRL — Midnight, Cobalt & Azure palette.
 * Clean depth — just enough to make the research feel tangible.
 * ──────────────────────────────────────────────────────────────────────── */

const AZURE = "#007FFF";
const SOFT = "#B9D8FF";
const MUTE = "#75A7DE";
const LINE = "#0047AB";
const LINE_SOFT = "#002D62";

interface FaceSet {
  top: string;
  front: string;
  side: string;
}

const DEEP: FaceSet = { top: "#B9D8FF", front: "#007FFF", side: "#0047AB" };
const MID: FaceSet = { top: "#0047AB", front: "#002D62", side: "#001B3D" };
const LIGHT: FaceSet = { top: "#002D62", front: "#001B3D", side: "#000E22" };

/* ── IsoBlock: the primitive 3D tile ──────────────────────────────────── */

interface IsoBlockProps {
  x: number;
  y: number;
  w: number;
  h: number;
  dx?: number;
  dy?: number;
  faces?: FaceSet;
  dashed?: boolean;
  stroke?: string;
  strokeOpacity?: number;
  className?: string;
  style?: CSSProperties;
  shadow?: boolean;
}

function IsoBlock({
  x, y, w, h,
  dx = 5, dy = 3.5,
  faces = DEEP,
  dashed = false,
  stroke = MUTE,
  strokeOpacity = 0.35,
  className,
  style,
  shadow = false,
}: IsoBlockProps) {
  const front = `${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}`;
  const top = `${x},${y} ${x + dx},${y - dy} ${x + w + dx},${y - dy} ${x + w},${y}`;
  const side = `${x + w},${y} ${x + w + dx},${y - dy} ${x + w + dx},${y + h - dy} ${x + w},${y + h}`;

  if (dashed) {
    return (
      <g className={className} style={style} strokeLinejoin="round">
        <polygon points={front} fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeDasharray="3 3" />
        <polygon points={top} fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeDasharray="3 3" />
        <polygon points={side} fill="none" stroke={stroke} strokeOpacity={strokeOpacity} strokeDasharray="3 3" />
      </g>
    );
  }

  return (
    <g
      className={className}
      style={style}
      filter={shadow ? "url(#iso-shadow)" : undefined}
      strokeLinejoin="round"
    >
      <polygon points={front} fill={faces.front} />
      <polygon points={side} fill={faces.side} />
      <polygon points={top} fill={faces.top} />
    </g>
  );
}

/* ── Shared SVG <defs> ────────────────────────────────────────────────── */

function SharedDefs() {
  return (
    <defs>
      <filter id="iso-shadow" x="-25%" y="-15%" width="170%" height="185%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.45" />
      </filter>
    </defs>
  );
}

/* ── Text helper ──────────────────────────────────────────────────────── */

function T(props: {
  x: number; y: number; children: string;
  size?: number; fill?: string; anchor?: string; ls?: string; italic?: boolean;
}) {
  return (
    <text
      x={props.x} y={props.y}
      fontFamily={props.italic ? "var(--font-serif)" : "var(--font-mono)"}
      fontStyle={props.italic ? "italic" : "normal"}
      fontSize={props.size ?? 10}
      fill={props.fill ?? SOFT}
      textAnchor={(props.anchor as "start" | "middle" | "end" | undefined) ?? "start"}
      letterSpacing={props.ls ?? "0"}
    >
      {props.children}
    </text>
  );
}

/* ── Legend iso tile ──────────────────────────────────────────────────── */

function LegendIso({ x, y, kind }: { x: number; y: number; kind: "deep" | "pruned" | "mid" | "light" }) {
  const fMap = { deep: DEEP, mid: MID, light: LIGHT, pruned: DEEP };
  if (kind === "pruned") return <IsoBlock x={x} y={y} w={10} h={10} dx={3} dy={2} dashed stroke={AZURE} strokeOpacity={0.4} />;
  return <IsoBlock x={x} y={y} w={10} h={10} dx={3} dy={2} faces={fMap[kind]} shadow />;
}

/* ══════════════════════════════════════════════════════════════════════
 * HERO: Attention matrix + KV pages — the lab's signature visual
 * ══════════════════════════════════════════════════════════════════════ */

export function AttentionMotif() {
  const N = 11;
  const cell = 16;
  const gap = 6;
  const step = cell + gap;
  const x0 = 14;
  const y0 = 58;
  const dx = 4.5;
  const dy = 3.3;

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c <= r; c++) {
      const d = r - c;
      const pruned = d > 2 && (r * 3 + c) % 5 === 1;
      const x = x0 + c * step;
      const y = y0 + r * step;
      const faces = d <= 1 ? DEEP : d <= 3 ? MID : LIGHT;
      const delay = ((r * 7 + c * 5) % 13) * 480;
      const dur = 5 + (r % 3) * 1.5;

      if (pruned) {
        cells.push(
          <IsoBlock key={`${r}-${c}`} x={x} y={y} w={cell} h={cell} dx={dx} dy={dy} dashed stroke={AZURE} strokeOpacity={0.3} />
        );
      } else {
        cells.push(
          <IsoBlock
            key={`${r}-${c}`}
            x={x} y={y} w={cell} h={cell}
            dx={dx} dy={dy} faces={faces} shadow
            className="kvcell"
            style={{ "--del": `${delay}ms`, "--dur": `${dur}s` } as CSSProperties}
          />
        );
      }
    }
  }

  const pages: React.ReactNode[] = [];
  const px = 350;
  const pw = 56;
  const ph = 12;
  const pgap = 7;
  for (let i = 0; i < 13; i++) {
    const y = 72 + i * (ph + pgap);
    const faces = i < 5 ? DEEP : i < 9 ? MID : LIGHT;
    const dashed = i >= 10;
    pages.push(
      <IsoBlock
        key={i} x={px} y={y} w={pw} h={ph}
        dx={5} dy={3} faces={faces} dashed={dashed}
        stroke={MUTE} strokeOpacity={0.4} shadow={!dashed}
      />
    );
  }

  return (
    <svg viewBox="0 0 448 386" className="h-auto w-full" role="img" aria-label="3D sparse attention matrix beside tiered KV-cache pages">
      <SharedDefs />

      {/* header bar */}
      <T x={14} y={12} ls="2" fill={AZURE}>ATTENTION IS NOT FREE</T>
      <T x={432} y={12} italic anchor="end" size={11} fill={SOFT}>pages, tiers &amp; loops</T>
      <line x1={0} y1={28} x2={448} y2={28} stroke={LINE_SOFT} />

      {/* section labels */}
      <T x={14} y={48} ls="2">ATTENTION · CAUSAL</T>
      <T x={350} y={48} ls="2">KV PAGES</T>

      {/* content */}
      {cells}
      {pages}

      {/* divider */}
      <line x1={336} y1={66} x2={336} y2={330} stroke={LINE} strokeDasharray="2 4" />

      {/* legend */}
      <g transform="translate(14, 362)">
        <LegendIso x={0} y={0} kind="deep" />
        <T x={17} y={8.8} size={9.5}>attended</T>
        <LegendIso x={82} y={0} kind="pruned" />
        <T x={99} y={8.8} size={9.5}>pruned</T>
        <LegendIso x={156} y={0} kind="mid" />
        <T x={173} y={8.8} size={9.5}>warm · fp8</T>
        <LegendIso x={253} y={0} kind="light" />
        <T x={270} y={8.8} size={9.5}>cold · 2-bit</T>
      </g>
    </svg>
  );
}
