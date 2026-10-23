# ILRL — Frontend

Public website for the **Inference-in-Loop & Recurrence Lab (ILRL)**.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-14b8a6?style=for-the-badge)](https://bruce12-glitch.github.io/ILRL-Labs/)
[![CI](https://github.com/bruce12-glitch/ILRL-Labs/actions/workflows/ci.yml/badge.svg)](https://github.com/bruce12-glitch/ILRL-Labs/actions/workflows/ci.yml)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite 7](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)

---

## 🧭 About ILRL

**ILRL (Inference-in-Loop & Recurrence Lab)** is a remote-first research lab building open systems for efficient LLM inference. Our work treats recurrence — the loop between inference and memory — as the fundamental unit of optimization.

| Research Pillar | Focus | Status |
|-----------------|-------|--------|
| **EntroPrefill** | Sparse attention for long-context prefill | Active |
| **Page-EntroKV** | Entropy-tiered paged KV-cache compression | Active |
| **RecLoop** | Recurrence-aware continuous batching scheduler | Active |

**Founded:** October 2026  
**Contact:** inba.research.ilrl.labs@gmail.com  
**Organization:** [github.com/bruce12-glitch](https://github.com/bruce12-glitch)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ (see `.nvmrc`)

### Installation
```bash
npm install
cp .env.example .env   # set VITE_API_URL to your backend
npm run dev            # http://localhost:5173
```

### Scripts
| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build → `dist/index.html` |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check (no emit) |
| `npm run lint` | ESLint check |

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000` |

Only `VITE_`-prefixed variables reach the browser. `.env` is git-ignored; `.env.example` documents all values.

---

## 📁 Project Structure

```
src/
├── components/    # Nav, Footer, HeroScene, Diagrams, Reveal, Icons
├── data/lab.ts    # Single source of truth (projects, people, news, site config)
├── pages/         # Home, Research, Publications, People
├── utils/         # api.ts (env-based client), cn.ts
├── router.tsx     # Hash router (#/research, #/people, …)
├── App.tsx
└── main.tsx
```

---

## 🔗 Links

- **Frontend Repo:** https://github.com/bruce12-glitch/ILRL-Labs
- **Backend Repo:** https://github.com/bruce12-glitch/ILRL-Backend
- **Organization:** https://github.com/bruce12-glitch
- **Live Site:** https://bruce12-glitch.github.io/ILRL-Labs/

---

## 🛠 Tech Stack

- **Framework:** React 19 + Vite 7 + TypeScript
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Animation:** Framer Motion (reduced-motion aware)
- **3D:** Inline SVG + CSS animations (no Three.js dependency)
- **Icons:** Custom SVG (GitHub, LinkedIn) + Lucide React
- **Fonts:** Newsreader (serif), Inter (sans), IBM Plex Mono (mono) — self-hosted

---

## 📦 Deployment

### GitHub Pages
The CI workflow (`.github/workflows/ci.yml`) builds and deploys to GitHub Pages on push to `main`. The Pages site is served from `dist/index.html` (single-file via `vite-plugin-singlefile`).

### Custom Domain / Vercel / Netlify
```bash
npm run build
# Deploy dist/ to any static host
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Run `npm run typecheck && npm run build`
5. Open a PR

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.