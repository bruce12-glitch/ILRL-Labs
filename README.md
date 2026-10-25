# ILRL Labs

Website for **Inference in Loops and Recurrence Learning Labs**.

[Visit the lab](https://bruce12-glitch.github.io/ILRL-Labs/)

## Development

Use Node.js 22 or newer.

```bash
npm ci
npm run dev
```

The site has five sections, in order: About, Research, Interests, Future Goals, and Members. Content and verified publication links live in `src/data/lab.ts`. The two member portraits are stored in `public/people/`.

Research titles and arXiv links open the actual preprints; PDF and project code links are listed separately. Vinoth Nandakumar's MIT mathematics doctorate links to the MIT thesis record. Interests and goals describe future directions, separate from published work.

The layout uses a text-led introduction, compact publication rows, and member profiles at the end of the page. The 3D visual and its dependencies have been removed. Native section anchors retain support for previously shared hash routes. A compact navigation menu is available on narrow screens, and hover transitions follow reduced-motion preferences.

## Validation

```bash
npm test
npm run typecheck
npm run build
```

Navigation tests cover the current sections, old page URLs, removed routes, and the final active section at the footer. Check the live site for section navigation, section order, portraits, and paper links.

## Deployment

Pushing to `main` runs `.github/workflows/ci.yml`. The build job runs tests, TypeScript, and a production build. The deployment job publishes `dist/` to GitHub Pages. Pull requests run the checks without publishing.

Vite uses relative asset paths for `/ILRL-Labs/`. JavaScript and CSS are inlined in the built HTML. Portraits, favicon, and cursor assets are included alongside it. No backend, credentials, or proprietary fonts are required.

Contact: inba.research.ilrl.labs@gmail.com
