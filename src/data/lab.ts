export const LAB = {
  name: "ILRL",
  fullName: "Inference in Loops and Recurrence Learning Labs",
  email: "inba.research.ilrl.labs@gmail.com",
  url: "https://bruce12-glitch.github.io/ILRL-Labs/",
  about:
    "We work on LLM inference, ML systems, and computer science algorithms. Our research looks at how language models use memory, process long contexts, and reuse computation.",
  thesis:
    "Modern language models treat context processing and token generation as a linear pass over growing key-value states. We study how information-theoretic pruning, hardware-aligned memory hierarchies, and iterative depth recurrence allow models to reason over long horizons under bounded compute and memory budgets.",
  agenda:
    "Our interests include holographic model compression, looped transformers, the future of inference in AGI, and unexplored conflicts in AGI.",
};

export const HERO_PILLARS = [
  {
    index: "01",
    domain: "Context Pruning",
    title: "EntroPrefill · RAG Prefill Stability",
    description:
      "Rényi-guided context pruning during prefill with explicit token deletion budgets and conditional divergence guarantees on downstream generation.",
    href: "#entroprefill",
    meta: "arXiv:2610.09757",
  },
  {
    index: "02",
    domain: "KV-Cache Memory",
    title: "Page-EntroKV · GQA Page Eviction",
    description:
      "Hardware-aligned physical KV-cache page selection under grouped-query attention using entropy-weighted head pooling and strict memory bounds.",
    href: "#page-entrokv",
    meta: "arXiv:2610.03135",
  },
  {
    index: "03",
    domain: "Recurrent Depth",
    title: "Looped & Compressed Architectures",
    description:
      "Trading static parameter footprint for iterative depth computation through looped transformer blocks and holographic shared representations.",
    href: "#interests",
    meta: "Recurrence · Capacity",
  },
  {
    index: "04",
    domain: "AGI Systems",
    title: "Long-Horizon Inference & Conflicts",
    description:
      "Investigating structural tensions between persistent memory, continual adaptation, and objective alignment in autonomous reasoning systems.",
    href: "#future-goals",
    meta: "Reasoning · Alignment",
  },
] as const;

export const PAPERS = [
  {
    id: "entroprefill",
    name: "EntroPrefill",
    title:
      "Rényi-Guided Context Pruning with Conditional Stability Guarantees for Retrieval-Augmented Generation",
    author: "Inbasekaran S",
    date: "October 2026",
    arxivId: "arXiv:2610.09757",
    topic: "Context pruning · Information theory",
    summary:
      "Pruning context during prefill, with explicit deletion constraints and conditional bounds on output stability.",
    detail:
      "Retrieval-augmented generation pipelines frequently ingest large, noisy document chunks that inflate time-to-first-token and saturate KV-cache memory. EntroPrefill formulates prefill token retention as a constrained information-preservation problem using Rényi entropy over attention distributions, pruning low-information segments before full decoding begins while bounding the divergence of the resulting output distribution.",
    contributions: [
      {
        label: "Rényi Entropy Scoring",
        text: "Measures head-wise attention concentration during early prefill layers to distinguish high-leverage evidence tokens from redundant context.",
      },
      {
        label: "Conditional Stability Bounds",
        text: "Establishes explicit mathematical guarantees linking token deletion thresholds to bounded shifts in conditional next-token distributions.",
      },
      {
        label: "Prefill Latency & Memory Reduction",
        text: "Reduces KV-cache footprint and prefill compute overhead in long-context RAG workloads without retraining model weights.",
      },
    ],
    arxiv: "https://arxiv.org/abs/2610.09757",
    pdf: "https://arxiv.org/pdf/2610.09757",
    code: "https://github.com/bruce12-glitch/Entro-Prefill",
  },
  {
    id: "page-entrokv",
    name: "Page-EntroKV",
    title:
      "Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention",
    author: "Inbasekaran S",
    date: "October 2026",
    arxivId: "arXiv:2610.03135",
    topic: "KV-cache memory · ML systems",
    summary:
      "Selecting physical KV-cache pages under grouped-query attention, with entropy-weighted head pooling and exact memory budgets.",
    detail:
      "Fine-grained token eviction policies often fragment physical GPU memory and fail to translate theoretical token savings into real wall-clock throughput in paged serving engines. Page-EntroKV operates directly at the granularity of physical KV-cache pages under Grouped-Query Attention (GQA), aggregating query-group attention statistics via entropy-weighted pooling to evict whole memory blocks cleanly.",
    contributions: [
      {
        label: "Page-Granular Eviction",
        text: "Aligns eviction decisions with contiguous physical KV-cache pages so freed blocks can be immediately reclaimed by paged attention allocators.",
      },
      {
        label: "GQA Entropy-Weighted Pooling",
        text: "Resolves score disagreement across query heads sharing a single key-value head by weighting each query head according to its spectral entropy.",
      },
      {
        label: "Deterministic Memory Budgets",
        text: "Maintains strict upper bounds on device memory consumption across long-sequence decoding while preserving multi-needle retrieval accuracy.",
      },
    ],
    arxiv: "https://arxiv.org/abs/2610.03135",
    pdf: "https://arxiv.org/pdf/2610.03135",
    code: "https://github.com/bruce12-glitch/PageEntro-KV",
  },
] as const;

export const RESEARCH_METHODOLOGY = [
  {
    index: "M1",
    title: "Analytical Guarantees",
    text: "Every pruning or eviction rule is paired with explicit bounds on distributional drift, entropy retention, or worst-case approximation error.",
  },
  {
    index: "M2",
    title: "Hardware Sympathy",
    text: "Algorithms are designed around physical GPU execution realities—block tables, GQA head sharing, memory bandwidth, and contiguous page allocation.",
  },
  {
    index: "M3",
    title: "Zero-Retraining Deployment",
    text: "Inference-time mechanisms plug directly into pretrained transformer checkpoints and open-source serving stacks with reproducible evaluation harnesses.",
  },
] as const;

export const PEOPLE = [
  {
    name: "Inbasekaran S",
    role: "Founder & Researcher",
    focus: "LLM inference, KV-cache memory systems, and context pruning algorithms",
    bio: "Founded ILRL to investigate the algorithmic and systems foundations of language model inference. His work focuses on information-theoretic context pruning during prefill, hardware-aligned KV-cache page eviction under grouped-query attention, and recurrent depth computation in transformers.",
    areas: [
      "Rényi-guided context pruning (EntroPrefill)",
      "Paged KV-cache management under GQA (Page-EntroKV)",
      "Looped transformers & recurrent inference systems",
    ],
    education: "",
    educationSource: "",
    photo: "people/inba.jpg",
    links: [
      { label: "GitHub", href: "https://github.com/bruce12-glitch" },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/inbasekaran-s-106a90383",
      },
      { label: "EntroPrefill", href: "https://arxiv.org/abs/2610.09757" },
      { label: "Page-EntroKV", href: "https://arxiv.org/abs/2610.03135" },
    ],
  },
  {
    name: "Vinoth Nandakumar",
    role: "Research Mentor",
    focus: "Mathematics, representation theory, and foundations of machine learning",
    bio: "Advises ILRL on mathematical rigor, representation theory, and algorithmic structure. Holds a PhD in Mathematics from MIT, bringing deep experience in pure mathematics and theoretical analysis to problems in model compression, high-dimensional geometry, and inference stability.",
    areas: [
      "Mathematical foundations of machine learning",
      "Representation theory & high-dimensional compression",
      "Stability guarantees & theoretical computer science",
    ],
    education: "PhD in Mathematics, MIT",
    educationSource:
      "https://dspace.mit.edu/entities/publication/3e87b7bb-0f9a-4278-90e7-24083a43b599",
    photo: "people/vinu.jpg",
    links: [
      {
        label: "Scholar",
        href: "https://scholar.google.com/citations?user=SKq_-mgAAAAJ&hl=en",
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/vinoth-nandakumar-07456b149/",
      },
      {
        label: "MIT Thesis",
        href: "https://dspace.mit.edu/entities/publication/3e87b7bb-0f9a-4278-90e7-24083a43b599",
      },
    ],
  },
] as const;

export const INTERESTS = [
  {
    id: "compression",
    title: "Holographic Model Compression",
    description:
      "Can shared representations hold more model capacity while keeping inference practical? We study structured parameter superposition, low-rank and spectral projections, and algebraic weight sharing that preserve expressive power without inflating memory bandwidth.",
    question:
      "How much task capacity can be packed into fixed-width representations before interference degrades multi-step reasoning?",
    keywords: "Representation · Compression · Capacity",
  },
  {
    id: "recurrence",
    title: "Looped Transformers",
    description:
      "Reusing layers across depth, and understanding what repeated computation costs in memory and latency. By iterating a shared block of transformer layers with adaptive halting or fixed recurrence schedules, models can scale test-time compute independently of parameter count.",
    question:
      "When does iterative depth recurrence outperform wider static stacks under identical memory-bandwidth envelopes?",
    keywords: "Recurrence · Memory · Compute",
  },
  {
    id: "agi",
    title: "Future of Inference in AGI",
    description:
      "How inference should evolve for longer reasoning, persistent memory, and systems that act over time. Moving beyond stateless single-turn decoding requires architectures that selectively consolidate episodic state while bounding KV-cache growth.",
    question:
      "What inference primitives are required for continuous, multi-day reasoning without catastrophic context saturation?",
    keywords: "Reasoning · Memory · Adaptation",
  },
  {
    id: "algorithms",
    title: "Computer Science Algorithms",
    description:
      "Algorithms for learning and inference, with attention to computational complexity and memory use. We apply sublinear data structures, streaming entropy estimators, and cache-aware paging policies to eliminate bottlenecks in attention and retrieval.",
    question:
      "How can classical paging, sketching, and combinatorial optimization provide tight worst-case guarantees for neural serving?",
    keywords: "Algorithms · Complexity · Efficiency",
  },
  {
    id: "agi-conflicts",
    title: "Unexplored Conflicts in AGI",
    description:
      "Questions about where reasoning, memory, learning, and objectives may work against one another, and how those conflicts could be resolved. Optimizing for aggressive context compression or rapid plasticity can silently erode calibration, safety invariants, or long-tail recall.",
    question:
      "Where do efficiency, continual memory updates, and objective stability fundamentally collide during autonomous inference?",
    keywords: "Reasoning · Learning · Objectives",
  },
  {
    id: "memory-systems",
    title: "Hardware-Aligned Memory Hierarchies",
    description:
      "Bridging the gap between theoretical token sparsity and physical accelerator execution. We design block-granular KV eviction, GQA-aware head pooling, and prefill-decode disaggregation schemes that respect GPU cache lines and page tables.",
    question:
      "How do we co-design information-theoretic pruning criteria with physical virtual-memory paging in modern serving engines?",
    keywords: "KV-Cache · Paged Attention · Systems",
  },
] as const;

export const GOALS = [
  {
    title: "Evaluate at a larger scale.",
    text: "Test on larger models and serving systems. Report memory, latency, and task quality together.",
    detail:
      "Extend EntroPrefill and Page-EntroKV evaluations across 30B–70B+ parameter grouped-query attention models under realistic multi-tenant batching, measuring time-to-first-token, tail token latency, physical page reclamation, and exact downstream task fidelity.",
    milestones: [
      "Multi-node & high-concurrency paged serving benchmarks",
      "Joint Pareto curves across memory budget, throughput, and accuracy",
      "Long-horizon stress tests up to 128k–1M token contexts",
    ],
  },
  {
    title: "Connect compression and recurrence.",
    text: "Study how compressed representations and reused layers change the cost of inference.",
    detail:
      "Unify KV-cache state pruning with looped transformer architectures where layers are applied repeatedly across depth. Analyze how state errors propagate across recurrent iterations and design stability-preserving compression schedules.",
    milestones: [
      "Recurrent state stability bounds under iterative layer reuse",
      "Holographic weight-sharing paired with bounded KV-cache pages",
      "Adaptive compute allocation per token and per recurrence loop",
    ],
  },
  {
    title: "Make the results reproducible.",
    text: "Release evaluation code, configurations, and measured results alongside our papers.",
    detail:
      "Maintain clean, dependency-light reference implementations, deterministic evaluation scripts, and raw benchmark logs for every preprint so independent researchers can verify claims on commodity and datacenter GPUs.",
    milestones: [
      "Open-source kernels & harnesses for EntroPrefill and Page-EntroKV",
      "Standardized configuration manifests and seed-locked baselines",
      "Transparent reporting of failure modes and boundary conditions",
    ],
  },
] as const;
