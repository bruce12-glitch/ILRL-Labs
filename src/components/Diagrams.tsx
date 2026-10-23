import type { CSSProperties } from "react";

/* ────────────────────────────────────────────────────────────────────────
 * 3D isometric system diagrams for ILRL.
 * Clean depth — just enough to make the research feel tangible.
 * ──────────────────────────────────────────────────────────────────────── */

const NAVY = "#21386E";
const INK = "#191712";
const SOFT = "#5B564A";
const MUTE = "#8B8577";
const LINE = "#D3CEBE";
const LINE_SOFT = "#E6E0D1";
const GOLD = "#997A30";
const GOLD_MID = "#BA9850";
const GOLD_LIGHT = "#E8D8AE";
const PAPER = "#FCFBF7";

interface FaceSet {
  top: string;
  front: string;
  side: string;
}

const DEEP: FaceSet = { top: "#6D84B8", front: "#4E679E", side: NAVY };
const MID: FaceSet = { top: "#A5B3D0", front: "#8194BA", side: "#6277A8" };
const LIGHT: FaceSet = { top: "#D6DDE9", front: "#BAC5DB", side: "#9DABC8" };
const GOLDEN: FaceSet = { top: GOLD_LIGHT, front: GOLD_MID, side: GOLD };
const PAPER_TILE: FaceSet = { top: PAPER, front: "#F0ECE0", side: "#DDD5C3" };
const DARK_BAR: FaceSet = { top: "#5B564A", front: "#332E25", side: "#191712" };

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
  stroke = NAVY,
  strokeOpacity = 0.28,
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

function SharedDefs({ withArrow }: { withArrow?: string }) {
  return (
    <defs>
      <filter id="iso-shadow" x="-25%" y="-15%" width="170%" height="185%">
        <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#191712" floodOpacity="0.10" />
      </filter>
      {withArrow && (
        <marker id={withArrow} markerWidth="8" markerHeight="8" refX="6.5" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={SOFT} />
        </marker>
      )}
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
  if (kind === "pruned") return <IsoBlock x={x} y={y} w={10} h={10} dx={3} dy={2} dashed strokeOpacity={0.33} />;
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
          <IsoBlock key={`${r}-${c}`} x={x} y={y} w={cell} h={cell} dx={dx} dy={dy} dashed strokeOpacity={0.25} />
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
      <T x={14} y={12} ls="2">ATTENTION IS NOT FREE</T>
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

/* ══════════════════════════════════════════════════════════════════════
 * EntroPrefill: tokens → entropy scorer → sparse mask → TTFT bars
 * ══════════════════════════════════════════════════════════════════════ */

export function EntroPrefillDiagram() {
  const N = 6;
  const cell = 18;
  const gap = 6;
  const step = cell + gap;
  const mx = 38;
  const my = 130;

  const cells: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c <= r; c++) {
      const d = r - c;
      const keep = d <= 1 || (r * 3 + c * 5) % 4 !== 0;
      const faces = d <= 1 ? DEEP : d <= 2 ? MID : LIGHT;
      cells.push(
        <IsoBlock
          key={`${r}-${c}`}
          x={mx + c * step} y={my + r * step}
          w={cell} h={cell} dx={4.2} dy={3}
          faces={faces} dashed={!keep} shadow={keep}
        />
      );
    }
  }

  const tokens: React.ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    tokens.push(
      <g key={i}>
        <IsoBlock x={38 + i * 50} y={36} w={34} h={16} dx={6} dy={4} faces={PAPER_TILE} shadow />
        <T x={55 + i * 50} y={48} size={9.2} fill={NAVY} anchor="middle">{`t${i}`}</T>
      </g>
    );
  }

  return (
    <svg viewBox="0 0 760 304" className="h-auto w-full" role="img" aria-label="EntroPrefill 3D pipeline diagram">
      <SharedDefs withArrow="arr-p" />

      <T x={38} y={16} ls="2">LONG-CONTEXT PROMPT · 256K TOKENS</T>
      {tokens}
      <IsoBlock x={338} y={36} w={78} h={16} dx={6} dy={4} dashed stroke={MUTE} strokeOpacity={0.34} />
      <T x={377} y={48} size={9.2} fill={MUTE} anchor="middle">··· 256K</T>

      {/* arrow → scorer */}
      <line x1={430} y1={44} x2={490} y2={44} stroke={SOFT} strokeWidth={1.3} markerEnd="url(#arr-p)" />

      {/* entropy scorer box */}
      <IsoBlock x={498} y={25} w={150} h={38} dx={9} dy={6} faces={PAPER_TILE} shadow />
      <T x={575} y={44} size={10} fill={INK} anchor="middle">entropy scorer</T>
      <T x={575} y={58} size={8.8} fill={MUTE} anchor="middle">H(token | context)</T>

      {/* scorer → mask */}
      <line x1={575} y1={74} x2={575} y2={110} stroke={SOFT} strokeWidth={1.3} strokeDasharray="3 3" />
      <line x1={575} y1={110} x2={355} y2={146} stroke={SOFT} strokeWidth={1.3} markerEnd="url(#arr-p)" />

      <T x={38} y={108} ls="2">SPARSE CAUSAL MASK</T>
      {cells}

      {/* mask legend */}
      <LegendIso x={218} y={my + 10} kind="deep" />
      <T x={235} y={my + 18.8} size={9.2}>kept range</T>
      <LegendIso x={218} y={my + 34} kind="pruned" />
      <T x={235} y={my + 42.8} size={9.2}>pruned (low info)</T>

      {/* TTFT comparison */}
      <T x={546} y={112} ls="2">TIME-TO-FIRST-TOKEN</T>
      <T x={546} y={138} size={9.2}>dense prefill</T>
      <IsoBlock x={546} y={148} w={150} h={10} dx={7} dy={4} faces={DARK_BAR} shadow />
      <T x={710} y={157} size={9.2}>100%</T>
      <T x={546} y={190} size={9.2}>EntroPrefill</T>
      <IsoBlock x={546} y={200} w={44} h={10} dx={7} dy={4} faces={GOLDEN} shadow />
      <T x={603} y={209} size={9.2} fill={GOLD}>28%</T>

      <T x={38} y={294} size={9.2} fill={MUTE}>Fig. 1 — Entropy selects informative key ranges before attention executes; prefill stays near-linear in context length.</T>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════
 * Page-EntroKV: tiered paged cache as 3D slabs
 * ══════════════════════════════════════════════════════════════════════ */

export function PageEntroKVDiagram() {
  return (
    <svg viewBox="0 0 760 304" className="h-auto w-full" role="img" aria-label="Page-EntroKV 3D tiered cache diagram">
      <SharedDefs withArrow="arr-k" />

      {/* HBM panel */}
      <rect x={24} y={30} width={392} height={184} rx={12} fill="none" stroke={LINE} />
      <T x={40} y={52} ls="2" fill={MUTE}>GPU HBM · PAGED KVCACHE</T>

      {/* HOT tier */}
      <T x={40} y={82} size={9.2} fill={SOFT}>HOT · fp16</T>
      {Array.from({ length: 4 }).map((_, i) => (
        <IsoBlock key={`h${i}`} x={40 + i * 80} y={96} w={62} h={18} dx={6} dy={4} faces={DEEP} shadow />
      ))}

      {/* WARM tier */}
      <T x={40} y={136} size={9.2} fill={SOFT}>WARM · fp8</T>
      {Array.from({ length: 4 }).map((_, i) => (
        <IsoBlock key={`w${i}`} x={40 + i * 80} y={150} w={62} h={18} dx={6} dy={4} faces={MID} shadow />
      ))}

      {/* COLD tier */}
      <T x={40} y={190} size={9.2} fill={SOFT}>COLD · 2-bit</T>
      {Array.from({ length: 4 }).map((_, i) => (
        <IsoBlock key={`c${i}`} x={40 + i * 80} y={204} w={62} h={18} dx={6} dy={4} dashed stroke={MUTE} strokeOpacity={0.4} />
      ))}

      <T x={40} y={244} size={8.8}>hot: entropy ≥ θ₁</T>
      <T x={176} y={244} size={8.8}>warm: recent + reused</T>
      <T x={318} y={244} size={8.8}>cold: recomputable</T>

      {/* offload arrow */}
      <path d="M 420 214 L 474 214 L 474 258" fill="none" stroke={SOFT} strokeWidth={1.3} strokeDasharray="4 3" markerEnd="url(#arr-k)" />
      <IsoBlock x={480} y={247} w={136} h={15} dx={6} dy={4} faces={PAPER_TILE} shadow />
      <T x={492} y={258.5} size={9.2}>CPU / NVMe offload tier</T>

      {/* KV memory comparison */}
      <T x={454} y={40} ls="2">KV MEMORY / SEQUENCE</T>
      <T x={454} y={66} size={9.2}>paged fp16</T>
      <IsoBlock x={454} y={76} w={160} h={10} dx={7} dy={4} faces={DARK_BAR} shadow />
      <T x={626} y={85} size={9.2}>100%</T>
      <T x={454} y={114} size={9.2}>Page-EntroKV</T>
      <IsoBlock x={454} y={124} w={52} h={10} dx={7} dy={4} faces={GOLDEN} shadow />
      <T x={518} y={133} size={9.2} fill={GOLD}>32%</T>

      {/* batch comparison */}
      <T x={454} y={164} ls="2">RESIDENT BATCH @ 128K</T>
      <T x={454} y={190} size={9.2}>baseline</T>
      <IsoBlock x={454} y={200} w={34} h={10} dx={7} dy={4} faces={DARK_BAR} shadow />
      <T x={454} y={234} size={9.2}>tiered pages</T>
      <IsoBlock x={454} y={244} w={162} h={10} dx={7} dy={4} faces={DEEP} shadow />
      <T x={628} y={253} size={9.2} fill={NAVY}>4.9×</T>

      <T x={24} y={294} size={9.2} fill={MUTE}>Fig. 2 — Pages migrate between residencies by attention entropy, breaking the KV-cache memory wall without quality cliffs.</T>
    </svg>
  );
}

export function ProjectDiagram({ kind }: { kind: "prefill" | "kv" }) {
  if (kind === "prefill") return <EntroPrefillDiagram />;
  return <PageEntroKVDiagram />;
}
