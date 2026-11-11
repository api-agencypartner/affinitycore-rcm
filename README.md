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
Tailwind CSS v4, utilities only — there are no component stylesheets.
- `src/app/globals.css` – layer order `theme, base, utilities, overrides`, Tailwind imports, `--spacing: 0.1rem`
  (so `p-16` = 1.6rem; the site's root font size scales with the viewport, so rem values are the design's px/10).
- `src/app/base.css` – `@layer base`: resets, element defaults, CSS variables, keyframes, url() images.
  `@layer overrides`: the few classes that are added at runtime or built from template strings
  (CTA pattern sides, X-ray swap states, footer column modifiers, `lenis`), so they still beat utilities.
- Components keep their BEM class names (`foot__brand`, `pg__body`…) as hooks; the styling itself is arbitrary-value
  utilities next to them, e.g. `[padding:4rem_2.4rem] [@media(max-width:_767px)]:[padding:2.8rem_1.6rem]`.
  Class lists built in JS are wrapped in ``String.raw`…` `` so `\_` escapes survive.
- Tailwind scans the whole project; `@source not inline(...)` blocks utility names that clash with old class names
  (`container`, `h-40`, `h-56`, `h-64`).

Design rules, fold order and history: `HANDOFF.md`.
