export const LAB_META = {
  name: "ILRL",
  fullName: "Inference in Loops and Recurrence Learning Labs",
  email: "inba.research.ilrl.labs@gmail.com",
  url: "https://bruce12-glitch.github.io/ILRL-Labs/",
};

export const PROJECTS = [
  {
    id: "page-entrokv",
    name: "Page-EntroKV",
    area: "Memory",
    question: "What is worth keeping?",
    summary: "We study which KV-cache pages to keep when a language model runs out of memory.",
    detail: "The focus is page-level selection, shared attention heads, and staying within a fixed memory budget.",
    code: "https://github.com/bruce12-glitch/PageEntro-KV",
    demo: "cache",
  },
  {
    id: "entroprefill",
    name: "EntroPrefill",
    area: "Inference",
    question: "Does every passage need a full read?",
    summary: "We work on pruning retrieved context before it passes through the later layers of a language model.",
    detail: "We want to reduce work before the first answer token, while keeping the evidence the answer needs.",
    code: "https://github.com/bruce12-glitch/Entro-Prefill",
    demo: "loop",
  },
] as const;

export const PEOPLE = [
  {
    name: "Inbasekaran S",
    role: "Founder & Researcher",
    focus: "LLM inference and memory systems.",
    photo: "people/inba.jpg",
    links: [
      { label: "GitHub", href: "https://github.com/bruce12-glitch" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/inbasekaran-s-106a90383" },
    ],
  },
  {
    name: "Vinoth Nandakumar",
    role: "Research Mentor",
    focus: "Mathematics and theoretical research.",
    photo: "people/vinu.jpg",
    links: [
      { label: "Scholar", href: "https://scholar.google.com/citations?user=SKq_-mgAAAAJ&hl=en" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/vinoth-nandakumar-07456b149/" },
    ],
  },
] as const;

export const NOTES = [
  {
    title: "Why think in pages?",
    topic: "Memory",
    text: "A serving system stores keys and values in blocks of memory. Keeping a few useful tokens scattered across many blocks can leave most of those blocks occupied. We look at the page as a unit of selection, so the decision lines up with the memory it actually uses.",
  },
  {
    title: "Before the first token.",
    topic: "Inference",
    text: "A long prompt has to be processed before a model can begin its answer. In retrieval-augmented generation, some of that prompt may be irrelevant. Our question is where to remove that context, and how to tell when removing it changes the answer.",
  },
  {
    title: "A loop still needs memory.",
    topic: "Recurrence",
    text: "Reusing a layer can reduce the number of model parameters. It does not make every other cost disappear. We are interested in how the memory needed for inference changes as a model takes more steps.",
  },
] as const;
