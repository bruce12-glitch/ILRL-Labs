# ILRL Labs

Website for **Inference in Loops and Recurrence Learning Labs**.

[Visit the lab](https://bruce12-glitch.github.io/ILRL-Labs/)

## Development

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

The site has five sections: About, Members, Research, Interests, and Future Goals. Content and verified publication links live in `src/data/lab.ts`. The two member portraits are stored in `public/people/`.

Research titles and arXiv links open the actual preprints; PDF and project code links are listed separately. Vinoth Nandakumar's MIT mathematics doctorate links to the MIT thesis record. Interests and goals describe future directions, separate from published work.

## Three.js visual

`src/components/HeroScene.tsx` renders a mathematical loop with Three.js and OrbitControls. It uses WebGL when available and the Three.js SVG renderer otherwise. Both support dragging, keyboard arrows, and a global pause control. Animation pauses outside the viewport and in hidden tabs, follows reduced-motion preferences, and releases resources on unmount. WebGL pixel density is capped; the SVG fallback uses fewer faces and a 24 fps cap. The geometry is procedural; no video or remote 3D assets are loaded.

The site uses native section anchors, with redirects for previously shared hash routes. A compact navigation menu is available on narrow screens.

## Validation

```bash
npm test
npm run typecheck
npm run build
```

Navigation tests cover the current sections, old page URLs, and removed routes. Check the live site for WebGL rendering, pause/rotation controls, section navigation, portraits, and paper links.

## Deployment

Pushing to `main` runs `.github/workflows/ci.yml`. The build job runs tests, TypeScript, and a production build. The deployment job publishes `dist/` to GitHub Pages. Pull requests run the checks without publishing.

Vite uses relative asset paths for `/ILRL-Labs/`. JavaScript and CSS are inlined in the built HTML. Portraits, favicon, and cursor assets are included alongside it. No backend, credentials, or proprietary fonts are required.

Contact: inba.research.ilrl.labs@gmail.com
