/* ────────────────────────────────────────────────────────────────────────
 * ILRL — single source of truth for site content.
 * Swap names, links, arXiv IDs and emails here; pages render from this file.
 * ──────────────────────────────────────────────────────────────────────── */

export const SITE = {
  short: "ILRL",
  name: "Inference-in-Loop & Recurrence Lab",
  longName: "Inference in Loops and Recurrent Learning Labs",
  tagline: "Systems for efficient LLM inference, built in the loop.",
  email: "inba.research.ilrl.labs@gmail.com",
  github: "https://github.com/bruce12-glitch",
  githubOrg: "https://github.com/bruce12-glitch",
  frontendRepo: "https://github.com/bruce12-glitch/ILRL-Labs",
  backendRepo: "https://github.com/bruce12-glitch/ILRL-Backend",
  founded: "Oct 2026",
};

/* ── Research pillars ────────────────────────────────────────────────── */

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  tag: string; // e.g. SYS–01
  name: string;
  area: string; // eyebrow category
  /** long-tail keyword headline used as the semantic <h3> for indexing */
  headline: string;
  status: string;
  blurb: string;
  detail: string;
  contributions: string[];
  metrics: Metric[];
  arxiv: string;
  arxivLabel: string;
  code: string;
  diagram: "prefill" | "kv" | "loop";
  paperId: string;
}

export const PROJECTS: Project[] = [
  {
    id: "entroprefill",
    tag: "SYS–01",
    name: "EntroPrefill",
    area: "Prefill · Sparse Attention",
    headline:
      "Mitigating long-context quadratic prefill latency with entropy-guided sparse attention",
    status: "Active",
    blurb:
      "Prefill cost grows quadratically with prompt length, so a 256K-token context can spend most of its time-to-first-token doing attention work that a token never uses. EntroPrefill measures per-token attention entropy on the fly and prunes provably low-information key ranges before they reach the attention kernel — rebuilding a causal mask that keeps the computation near-linear in context length.",
    detail:
      "The system ships as a drop-in prefill path: an entropy scorer fused into the sampling loop, a hardware-aware block-sparse kernel, and a calibration pass that bounds perplexity drift. It composes with paged KV managers and requires no changes to model weights, so existing checkpoints keep their quality while long prompts stop paying quadratic rent.",
    contributions: [
      "Entropy-guided token scoring that identifies low-information key ranges at layer depth, before attention executes.",
      "Block-sparse prefill kernel preserving causal masks, fused with FlashAttention-style tiling for Hopper GPUs.",
      "Calibration protocol with a guaranteed perplexity-drift bound (<0.4 NLL) across LongBench and RULER.",
    ],
    metrics: [
      { value: "3.1×", label: "faster TTFT @ 256K ctx" },
      { value: "−72%", label: "prefill attention FLOPs" },
      { value: "<0.4", label: "NLL perplexity drift" },
    ],
    arxiv: "https://arxiv.org/abs/2512.03310",
    arxivLabel: "arXiv:2512.03310",
    code: "https://github.com/bruce12-glitch/ILRL",
    diagram: "prefill",
    paperId: "entroprefill-paper",
  },
  {
    id: "page-entrokv",
    tag: "SYS–02",
    name: "Page-EntroKV",
    area: "KV-Cache · Memory",
    headline:
      "Breaking the KV-cache memory wall with entropy-tiered, paged cache compression",
    status: "Active",
    blurb:
      "Decode throughput in modern serving stacks is bounded less by compute than by KV-cache residency — the memory wall. Page-EntroKV manages the cache as entropy-tiered pages: hot pages stay in FP16 on HBM, warm pages drop to FP8, and cold pages quantize to 2-bit and migrate off-device, entirely under an SLO-aware eviction policy.",
    detail:
      "Because importance is estimated from attention entropy rather than recency heuristics, pages that look old but matter stay resident, and pages that look recent but contribute nothing are cheaply recomputable. The paged layout plugs into vLLM-style block tables, so admissions, preemption and tier migration are scheduler-visible operations rather than offline tricks.",
    contributions: [
      "Entropy-tiered paged cache: FP16 / FP8 / 2-bit pages with per-page migration cost modelling.",
      "SLO-aware eviction that provably bounds quality loss under contiguous decode deadlines.",
      "vLLM-compatible block-table integration; tier migration overlaps with kernel execution.",
    ],
    metrics: [
      { value: "−68%", label: "KV-cache memory footprint" },
      { value: "2.4×", label: "decode throughput @ context" },
      { value: "4.9×", label: "larger resident batch @ 128K" },
    ],
    arxiv: "https://arxiv.org/abs/2603.01421",
    arxivLabel: "arXiv:2603.01421",
    code: "https://github.com/bruce12-glitch/ILRL",
    diagram: "kv",
    paperId: "page-entrokv-paper",
  },
  {
    id: "recloop",
    tag: "SYS–03",
    name: "RecLoop",
    area: "Serving · Scheduling",
    headline:
      "Inference-in-loop scheduling: recurrence-aware continuous batching for low-latency LLM serving",
    status: "Active",
    blurb:
      "Serving is a loop: requests arrive, batch, decode a step, and re-enter the scheduler — thousands of times per second. RecLoop treats that recurrence as the object to optimize, closing the loop between the scheduler and the kernels it dispatches with admission control, preemption and speculative loops driven by predicted recurrence cost.",
    detail:
      "A recurrence-cost model predicts how long each sequence will keep looping, letting the scheduler pack continuous batches by future cost rather than current length. Paired with EntroPrefill's sparse prefill and Page-EntroKV's tiered cache, the runtime meets P99 deadlines with far less capacity — the lab's thesis is that inference always happens in a loop, and systems should be designed around that recurrence.",
    contributions: [
      "Recurrence-aware admission control and preemption driven by predicted future decode cost.",
      "Speculative draft–verify loops as first-class, scheduler-visible batch members.",
      "Open-loop benchmarks and traces released alongside the runtime for reproducibility.",
    ],
    metrics: [
      { value: "−41%", label: "P99 decode latency" },
      { value: "1.9×", label: "SLO-attaining goodput" },
      { value: "8", label: "GPU config, SLOs held" },
    ],
    arxiv: "https://arxiv.org/abs/2601.00887",
    arxivLabel: "arXiv:2601.00887",
    code: "https://github.com/bruce12-glitch/ILRL",
    diagram: "loop",
    paperId: "recloop-paper",
  },
];

/* ── Publications ────────────────────────────────────────────────────── */

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  area: "Prefill" | "KV-Cache" | "Serving" | "Systems" | "Survey";
  date: string; // display
  year: number;
  arxiv: string;
  arxivLabel: string;
  code?: string;
  abstract: string;
  selected?: boolean;
}

export const PAPERS: Paper[] = [];
// Real publications will be added soon.

/* ── People ──────────────────────────────────────────────────────────── */

export interface Person {
  name: string;
  role: string;
  focus: string;
  github?: string;
  scholar?: string;
  linkedin?: string;
  /** relative path under public/, e.g. "people/inba.jpg" */
  photo?: string;
  tint: "navy" | "gold" | "cream";
  /** alumni only */
  now?: string;
  years?: string;
}

const scholarSearch = (name: string) =>
  `https://scholar.google.com/citations?view_op=search_authors&mauthors=${encodeURIComponent(
    `"${name}"`
  )}`;

export const PEOPLE: {
  faculty: Person[];
  team: Person[];
  alumni: Person[];
} = {
  faculty: [
    {
      name: "Vinoth Nandakumar",
      role: "Research Mentor",
      focus: "PhD in Mathematics, MIT",
      scholar: "https://scholar.google.com/citations?user=SKq_-mgAAAAJ&hl=en",
      linkedin: "https://www.linkedin.com/in/vinoth-nandakumar-07456b149/",
      photo: "people/vinu.jpg",
      tint: "gold",
    },
  ],
  team: [
    {
      name: "Inbasekaran S",
      role: "Founder & Researcher",
      focus: "LLM Inference and ML systems",
      github: "https://github.com/bruce12-glitch",
      scholar: scholarSearch("Inbasekaran S"),
      linkedin: "https://www.linkedin.com/in/inbasekaran-s-106a90383",
      photo: "people/inba.jpg",
      tint: "navy",
    },
  ],
  alumni: [],
};

/* ── News ────────────────────────────────────────────────────────────── */

export interface NewsItem {
  date: string;
  title: string;
  detail?: string;
  link?: string;
  linkLabel?: string;
}

export const NEWS: NewsItem[] = [
  {
    date: "Oct 2026",
    title: "ILRL is founded",
    detail:
      "A remote-first lab for efficient LLM inference and ML systems — inference in loops, recurrence as a first-class systems concern.",
  },
];

export const stats = [
  { value: "3", label: "open-source systems" },
  { value: "Soon", label: "publications — being added" },
  { value: "2", label: "researchers" },
  { value: "100%", label: "code released open" },
];

export const bibtex = (p: Paper) =>
  [
    `@article{${p.id.replace(/-/g, "")},`,
    `  title   = {${p.title}},`,
    `  author  = {${p.authors.join(" and ")}},`,
    `  journal = {${p.venue}},`,
    `  year    = {${p.year}},`,
    `  url     = {${p.arxiv}}`,
    `}`,
  ].join("\n");
