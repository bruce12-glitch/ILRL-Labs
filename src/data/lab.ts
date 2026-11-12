export const LAB = {
  name: "ILRL",
  fullName: "Inference in Loops and Recurrence Learning Labs",
  email: "inba.research.ilrl.labs@gmail.com",
  url: "https://bruce12-glitch.github.io/ILRL-Labs/",
  about: "We work on LLM inference, ML systems, and computer science algorithms. Our research looks at how language models use memory, process long contexts, and reuse computation.",
};

export const PAPERS = [
  {
    id: "entroprefill",
    name: "EntroPrefill",
    title: "Rényi-Guided Context Pruning with Conditional Stability Guarantees for Retrieval-Augmented Generation",
    author: "Inbasekaran S",
    date: "October 2026",
    topic: "Context pruning",
    summary: "Pruning context during prefill, with explicit deletion constraints and conditional bounds on output stability.",
    arxiv: "https://arxiv.org/abs/2610.09757",
    pdf: "https://arxiv.org/pdf/2610.09757",
    code: "https://github.com/bruce12-glitch/Entro-Prefill",
  },
  {
    id: "page-entrokv",
    name: "Page-EntroKV",
    title: "Hardware-Aligned, Entropy-Weighted KV-Cache Eviction under Grouped-Query Attention",
    author: "Inbasekaran S",
    date: "October 2026",
    topic: "KV-cache memory",
    summary: "Selecting physical KV-cache pages under grouped-query attention, with entropy-weighted head pooling and exact memory budgets.",
    arxiv: "https://arxiv.org/abs/2610.03135",
    pdf: "https://arxiv.org/pdf/2610.03135",
    code: "https://github.com/bruce12-glitch/PageEntro-KV",
  },
] as const;

export const PEOPLE = [
  {
    name: "Inbasekaran S",
    role: "Founder & Researcher",
    focus: "LLM inference and ML systems",
    education: "",
    educationSource: "",
    photo: "people/inba.jpg",
    links: [
      { label: "GitHub", href: "https://github.com/bruce12-glitch" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/inbasekaran-s-106a90383" },
    ],
  },
  {
    name: "Vinoth Nandakumar",
    role: "Research Mentor",
    focus: "Mathematics and machine learning",
    education: "PhD in Mathematics, MIT",
    educationSource: "https://dspace.mit.edu/entities/publication/3e87b7bb-0f9a-4278-90e7-24083a43b599",
    photo: "people/vinu.jpg",
    links: [
      { label: "Scholar", href: "https://scholar.google.com/citations?user=SKq_-mgAAAAJ&hl=en" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vinoth-nandakumar-07456b149/" },
    ],
  },
] as const;

export const INTERESTS = [
  {
    id: "compression",
    title: "Holographic Model Compression",
    description: "Can shared representations hold more model capacity while keeping inference practical?",
    keywords: "Representation · Compression · Capacity",
  },
  {
    id: "recurrence",
    title: "Looped Transformers",
    description: "Reusing layers across depth, and understanding what repeated computation costs in memory and latency.",
    keywords: "Recurrence · Memory · Compute",
  },
  {
    id: "agi",
    title: "Future of Inference in AGI",
    description: "How inference should evolve for longer reasoning, persistent memory, and systems that act over time.",
    keywords: "Reasoning · Memory · Adaptation",
  },
  {
    id: "algorithms",
    title: "Computer Science Algorithms",
    description: "Algorithms for learning and inference, with attention to computational complexity and memory use.",
    keywords: "Algorithms · Complexity · Efficiency",
  },
  {
    id: "agi-conflicts",
    title: "Unexplored Conflicts in AGI",
    description: "Questions about where reasoning, memory, learning, and objectives may work against one another, and how those conflicts could be resolved.",
    keywords: "Reasoning · Learning · Objectives",
  },
] as const;

export const GOALS = [
  { title: "Evaluate at a larger scale.", text: "Test on larger models and serving systems. Report memory, latency, and task quality together." },
  { title: "Connect compression and recurrence.", text: "Study how compressed representations and reused layers change the cost of inference." },
  { title: "Make the results reproducible.", text: "Release evaluation code, configurations, and measured results alongside our papers." },
] as const;
