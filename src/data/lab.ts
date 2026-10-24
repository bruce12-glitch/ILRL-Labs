export interface Metric {
  label: string;
  value: string;
  detail: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  status: string;
  arxivId: string;
  arxivUrl: string;
  code: string;
  summary: string;
  problemStatement: string;
  contributions: string[];
  metrics: Metric[];
}

export interface ResearchDirection {
  id: string;
  index: string;
  title: string;
  domain: string;
  hypothesis: string;
  mechanisms: string[];
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  date: string;
  arxivId: string;
  pdfUrl: string;
  codeUrl: string;
  abstract: string;
  bibtex: string;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  focus: string;
  email?: string;
  github?: string;
}

export interface NewsItem {
  date: string;
  tag: string;
  text: string;
  link?: string;
}

export const LAB_META = {
  name: "ILRL Labs",
  fullName: "Inference, Learning & Reasoning Systems Laboratory",
  tagline: "Hardware-aligned memory management, information-theoretic context pruning, and intrinsic exploration for long-context language and world models.",
  thesis:
    "Modern LLM serving is bottlenecked by memory bandwidth and quadratic prefill compute rather than parameter count alone. We design exact-budget KV-cache allocators, early-layer Rényi-2 pruning rules, and bounded epistemic drives that run within real GPU page tables.",
  location: "Chennai, India",
  contactEmail: "inba.research.ilrl.labs@gmail.com",
  liveSite: "https://bruce12-glitch.github.io/ILRL-Labs/",
  frontendRepo: "https://github.com/bruce12-glitch/ILRL-Labs",
  backendRepo: "https://github.com/bruce12-glitch/ILRL-Backend",
};

export const STATS: Metric[] = [
  {
    label: "LongBench Quality Retention",
    value: "93.3%",
    detail: "Page-EntroKV on Qwen2.5-1.5B-Instruct under strict page eviction",
  },
  {
    label: "Physical Page Budget Adherence",
    value: "1.00× UOR",
    detail: "Zero GQA union over-retention via Hamilton-Hare block allocation",
  },
  {
    label: "Passkey Recall @ 20% KV Budget",
    value: "100%",
    detail: "Maintains full retrieval where mean-pooling eviction drops to 0%",
  },
  {
    label: "Active Preprints (Oct 2026)",
    value: "02",
    detail: "arXiv:2610.03135 (Page-EntroKV) & arXiv:2610.09757 (EntroPrefill)",
  },
];

export const PROJECTS: Project[] = [
  {
    id: "page-entrokv",
    index: "01",
    title: "Page-EntroKV",
    subtitle: "Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention",
    status: "Preprint · arXiv:2610.03135",
    arxivId: "2610.03135",
    arxivUrl: "https://arxiv.org/abs/2610.03135",
    code: "https://github.com/bruce12-glitch/PageEntro-KV",
    summary:
      "Token-level KV eviction schemes break paged attention because evicting non-contiguous tokens leaves fragmented holes inside physical GPU blocks, while independent head selection inflates memory under Grouped-Query Attention (GQA).",
    problemStatement:
      "When K/V heads are shared across query groups, independent token eviction across heads forces the runtime to retain the union of selected positions, violating the target memory budget (UOR > 1.00×). Mean-pooling across pages destroys high-conviction retrieval needles.",
    contributions: [
      "Scores physical KV pages using Order-2 Rényi conviction aggregated at the GQA group level, preserving sharp attention spikes that mean-pooling smooths out.",
      "Allocates layer-wise page budgets with the discrete Hamilton-Hare (largest-remainder) method so total retained pages match the hardware budget bit-for-bit (UOR = 1.00×).",
      "Evaluated on Qwen2.5-1.5B-Instruct across LongBench (qasper, multifieldqa_en, lcc, repobench-p), retaining 93.3% of full-cache quality and 100% needle recall at a 20% budget.",
    ],
    metrics: [
      { label: "Union Over-Retention (UOR)", value: "1.00×", detail: "Bit-exact physical page budget enforcement" },
      { label: "Needle Recall (20% Budget)", value: "100%", detail: "vs. 0% under naive page mean-pooling" },
      { label: "LongBench Retention", value: "93.3%", detail: "Across QA and repository-level code tasks" },
    ],
  },
  {
    id: "entroprefill",
    index: "02",
    title: "EntroPrefill",
    subtitle: "Rényi-Guided Context Pruning with Conditional Stability Guarantees for RAG",
    status: "Preprint · arXiv:2610.09757",
    arxivId: "2610.09757",
    arxivUrl: "https://arxiv.org/abs/2610.09757",
    code: "https://github.com/bruce12-glitch/Entro-Prefill",
    summary:
      "Retrieval-Augmented Generation pipelines stuff puluhan of retrieved passages into the prompt, paying quadratic O(N²) prefill latency on distracting chunks before decoding a single output token.",
    problemStatement:
      "Uniform token dropping during prefill corrupts cross-document reasoning if an informative passage is partially truncated or dropped before its semantic utility stabilizes across early transformer layers.",
    contributions: [
      "Measures chunk-level Order-2 Rényi conviction in early transformer layers to separate high-leverage evidence from low-entropy boilerplate before full-depth prefill.",
      "Derives conditional output stability bounds linking early-layer attention mass removed to an upper bound on KL divergence in the final next-token distribution.",
      "Prunes uninformative RAG chunks on the fly, cutting Time-To-First-Token (TTFT) and prefill FLOPs without fine-tuning model weights.",
    ],
    metrics: [
      { label: "Prefill Complexity", value: "Sub-O(N²)", detail: "Early-layer chunk pruning reduces effective context N" },
      { label: "Scoring Signal", value: "Rényi-2", detail: "Collision entropy highlights concentrated attention mass" },
      { label: "Weight Modification", value: "Zero-Shot", detail: "Training-free drop-in pass for standard RAG pipelines" },
    ],
  },
];

export const RESEARCH_DIRECTIONS: ResearchDirection[] = [
  {
    id: "aed-dreamer",
    index: "D1",
    title: "Aversive Epistemic Drive (AED-Dreamer)",
    domain: "Reinforcement Learning & World Models",
    hypothesis:
      "Pure curiosity bonuses stall in noisy or deceptive local minima once prediction error plateaus. A bounded aversive accumulator ('computational boredom') forces agents out of degenerate behavioral attractors.",
    mechanisms: [
      "Couples a leaky state-visitation saturation integral with latent world-model rollouts in Dreamer-class architectures.",
      "Penalizes low-information trajectory loops even when local reward variance is zero, restoring exploration in sparse-reward environments.",
    ],
  },
  {
    id: "mixed-precision-paged-kv",
    index: "D2",
    title: "Mixed-Precision Paged KV Tiers",
    domain: "CUDA Kernels & vLLM Memory Systems",
    hypothesis:
      "Instead of hard eviction at the page boundary, medium-conviction KV pages can be demoted in-place from BF16 to FP8/INT4 while keeping hot Rényi-2 pages in full precision.",
    mechanisms: [
      "Extends Hamilton-Hare page budgeting to multi-tier bitwidth allocation under fixed HBM byte caps.",
      "Eliminates PCIe host-offload stalls during long-horizon reasoning and repository-scale code completion.",
    ],
  },
  {
    id: "verifiable-inference",
    index: "D3",
    title: "Zero-Trust Cryptographic Provenance for Model Serving",
    domain: "Adversarial Systems & Supply-Chain Integrity",
    hypothesis:
      "Multi-tenant inference and B2B verification pipelines require lightweight cryptographic commitments to prove that context pruning or routing was executed honestly.",
    mechanisms: [
      "Builds on our VendorChain zero-trust verification architecture to attach verifiable state commitments to distributed inference pipelines.",
    ],
  },
];

export const PAPERS: Paper[] = [
  {
    id: "page-entrokv-2026",
    title: "Page-EntroKV: Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention",
    authors: ["Inbasekaran S"],
    venue: "arXiv Preprint",
    date: "Oct 2026",
    arxivId: "2610.03135",
    pdfUrl: "https://arxiv.org/pdf/2610.03135",
    codeUrl: "https://github.com/bruce12-glitch/PageEntro-KV",
    abstract:
      "We introduce Page-EntroKV, a block-aligned KV-cache eviction architecture for Grouped-Query Attention (GQA) models. By combining GQA-group Order-2 Rényi conviction scoring with discrete Hamilton-Hare page allocation, Page-EntroKV eliminates union over-retention (UOR = 1.00×) and internal page fragmentation, retaining 93.3% of uncompressed performance on Qwen2.5-1.5B-Instruct across LongBench.",
    bibtex: `@article{inbasekaran2026pageentrokv,
  title   = {Page-EntroKV: Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention},
  author  = {Inbasekaran S},
  journal = {arXiv preprint arXiv:2610.03135},
  year    = {2026}
}`,
  },
  {
    id: "entroprefill-2026",
    title: "EntroPrefill: Rényi-Guided Context Pruning with Conditional Stability Guarantees for Retrieval-Augmented Generation",
    authors: ["Inbasekaran S"],
    venue: "arXiv Preprint",
    date: "Oct 2026",
    arxivId: "2610.09757",
    pdfUrl: "https://arxiv.org/pdf/2610.09757",
    codeUrl: "https://github.com/bruce12-glitch/Entro-Prefill",
    abstract:
      "EntroPrefill mitigates the quadratic prefill bottleneck in long-context Retrieval-Augmented Generation by pruning low-conviction context chunks in early transformer layers using Order-2 Rényi entropy, backed by conditional distributional stability guarantees.",
    bibtex: `@article{inbasekaran2026entroprefill,
  title   = {EntroPrefill: R{\\'e}nyi-Guided Context Pruning with Conditional Stability Guarantees for Retrieval-Augmented Generation},
  author  = {Inbasekaran S},
  journal = {arXiv preprint arXiv:2610.09757},
  year    = {2026}
}`,
  },
];

export const PEOPLE: Person[] = [
  {
    id: "inbasekaran-s",
    name: "Inbasekaran S",
    role: "Principal Student Researcher & Lab Lead",
    affiliation: "Department of Computer Science & Engineering, SRMIST",
    focus: "LLM Inference Acceleration, Paged KV-Cache Compression, Rényi-Guided Pruning, and Intrinsic RL Exploration (AED-Dreamer).",
    email: "inba.research.ilrl.labs@gmail.com",
    github: "https://github.com/bruce12-glitch",
  },
  {
    id: "faculty-advisory",
    name: "Senior Faculty Advisory Group",
    role: "Research Mentorship & Theoretical Supervision",
    affiliation: "Department of Networking & Communications (SRMIST) & Senior Faculty Collaborators (Amrita University)",
    focus: "Information-Theoretic Bounds, Algorithmic Analysis, Dynamical Systems in Epistemic RL, and Systems Verification.",
  },
];

export const NEWS: NewsItem[] = [
  {
    date: "2026-10-07",
    tag: "PREPRINT",
    text: "Released EntroPrefill (arXiv:2610.09757): early-layer Rényi-2 context pruning for RAG with conditional output stability guarantees.",
    link: "https://github.com/bruce12-glitch/Entro-Prefill",
  },
  {
    date: "2026-10-02",
    tag: "PREPRINT",
    text: "Released Page-EntroKV (arXiv:2610.03135): hardware-aligned KV-cache eviction achieving UOR = 1.00× and 93.3% LongBench retention on Qwen2.5-1.5B-Instruct.",
    link: "https://github.com/bruce12-glitch/PageEntro-KV",
  },
  {
    date: "2026-10-01",
    tag: "LAB",
    text: "Founded ILRL Labs to consolidate open-source codebases and technical monographs across LLM inference systems and epistemic reinforcement learning.",
    link: "https://github.com/bruce12-glitch/ILRL-Labs",
  },
];