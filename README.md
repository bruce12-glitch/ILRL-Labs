# ILRL Labs

The website for **Inference in Loops and Recurrence Learning Labs**.

[Visit the lab](https://bruce12-glitch.github.io/ILRL-Labs/)

## Development

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

The public site runs without a backend or API credentials. Project descriptions, member information, and notes live in `src/data/lab.ts`.

## Pages and interactions

- Home: a CSS 3D inference sketch with pointer rotation and prefill/decode controls.
- Research: two current projects, short descriptions, and links to their code.
- Playground: a token walkthrough, adjustable KV-page budget, and a causal attention map.
- Members: Inbasekaran S and Vinoth Nandakumar, with their original portraits and profile links.
- Notes: short explanations of the questions behind the work.

The playground uses illustrative scores and weights, not model outputs or benchmark measurements. It does not reproduce the research algorithms. Motion can be paused in the header and follows the system's reduced-motion setting. Touch devices keep their normal cursor; pointer devices use small SVG cursors.

## Validation

```bash
npm test
npm run typecheck
npm run build
```

The tests check page-budget selection, causal attention normalization, route compatibility, member data, and link restrictions. The app uses React, TypeScript, Vite, Lucide icons, and ordinary CSS. Fonts come from the device's system stack.

## Deployment

Pushing to `main` runs `.github/workflows/ci.yml`. The build job runs tests, type checking, and a production build. The deployment job publishes `dist/` to GitHub Pages. Pull requests run the build checks without publishing.

Vite uses relative asset paths for project hosting under `/ILRL-Labs/`. JavaScript and CSS are inlined into the built HTML; portraits, favicon, and cursor assets are included alongside it. Hash routes preserve direct links without a server rewrite.

Contact: inba.research.ilrl.labs@gmail.com
