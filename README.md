# Affinity Core RCM website

Next.js 15 (App Router) + React 19 + TypeScript, statically exported to GitHub Pages.

- Live: https://api-agencypartner.github.io/affinitycore-rcm/
- Every push to `main` builds (`next build` → `out/`) and deploys via `.github/workflows/deploy.yml`.
- Local: `npm ci && npm run dev` → http://localhost:3000/affinitycore-rcm/
- Base path comes from `NEXT_PUBLIC_BASE` (default `/affinitycore-rcm`); set it to `''` when moving to the client's own domain.

## Structure
- `src/app/` – routes. Each page pre-renders with its own title/description; dynamic routes use `generateStaticParams`
  (10 services, 23 specialties, 50 states, case studies, published articles).
- `src/Shell.tsx` – client shell: intro loader, nav, Lenis smooth scroll, page curtain, footer, search.
- `src/views/` – page components. `src/sections/`, `src/components/` – folds and UI. `src/data/` – all content (Strapi-ready).
- `src/router.tsx` – `Link`, `u()` (base-path aware hrefs), `goAnchor()` for cross-page `#anchors`. Old `#/path` links redirect.

## Styling
Tailwind CSS v4 (`src/app/globals.css`). Migration from the legacy CSS files is in progress: converted components
live in Tailwind classes; legacy CSS (`src/styles.css`, `src/views/*.css`) is removed as each block is converted.

Design rules, fold order and history: `HANDOFF.md`.
