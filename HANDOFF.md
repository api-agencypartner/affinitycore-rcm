# Affinity Core website — handoff brief

Paste this file (and attach `affinity-core-src.zip`) at the start of a new chat.

## What exists
- **Prototype link (homepage + Services, one site):** https://claude.ai/artifact/UYYNm2arqYiEiqeRSPEAQp
- **Original homepage link (frozen, do not change):** https://claude.ai/artifact/3H9P4S6Z4eTBC1kNPeNiPD
- **Plan / shot list:** https://claude.ai/artifact/TdYuM12mtQciCgjPsrKXop
- Stack: React 18 + Vite + TypeScript, `motion` (motion.dev, for later Framer conversion), Lenis smooth scroll, single-file build (`vite-plugin-singlefile`). Hash router (`src/router.tsx`).
- Run: `npm i && npx vite build` → `dist/index.html`. To publish: replace ` crossorigin` and set `<title>`.

## Pages done
- Home (`/`) — Figma design, loader → nav handoff, hero carousel, specialities, process, bento services, platforms, testimonials, assessment, FAQ, CTA, footer. **Do not change the homepage design.**
- Services overview (`#/services`) — hero claim card, "Follow the claim" pinned route board (purple-recoloured fluted glass bg + 75% white blur overlay), revenue-leak Sankey ($100 → $79, sealable), need picker (crossfade, no layout overlap), engagement table, sample proof, CTA.
- 9 service pages (`#/services/<slug>`) — one template, all content in `src/data/services.ts` (hero, queue widget, cited stat, calculator, sticky "document" story with fixes/stamps, work order, FAQs, closing CTA, SEO title/description). `[Confirm with Affinity Core]` marks unverified claims.
- Specialties overview (`#/specialties`): rulebook deck hero (cycles 7 specialties: signature code, "watch for", rules), index of all 23 grouped in 5 groups with rule-lens chips (prior auth / time / global periods / modifier 25 / 26-TC / drug units), "Spot the error" claim quiz (dark inset panel), proof, FAQ, CTA. `?focus=<slug>` scrolls to + pulses a tile (used by nav + footer for specialties without a page).
- Specialty template (`#/specialties/<slug>`), Cardiology built: ECG "beat strip" hero widget, AMA prior-auth stat (39/week, 13 h) + prior-auth cost calculator, 8-code ledger (what trips it / how we catch it), cath-lab document story (vessel modifiers, 59/XU, add-ons; reuses service `HowWeWork`), CMS-0057-F authorization clock (72 h / 7 days, MA + Medicaid + CHIP), related specialties, proof, FAQ, CTA. Data in `src/data/specialties.ts` — add a specialty by adding a `SpecialtyFull` entry and `page: true`; unbuilt slugs fall back to the overview.
- Loader also plays when entering on a Services URL ("RCM Services Orchestrated to Outperform") and a Specialties URL ("Billing Built Around Your Specialty").
- Cross-page nav: `#anchor` links and default `Button` go to homepage `#assessment` from any page; homepage bento cards and "View All" open service pages; footer links mapped.

- Services hero: "X-ray of a claim" (`src/components/ClaimXray.tsx`): CMS-1500 form, 3D tilt, lens tours one box per service, hover lens + readout under CTA; form at 80% on desktop.
- Service pages hero: `ClaimFocus` camera close-up on the service's own boxes (map in `SERVICE_BOXES`), per-service box copy; rail is now the curved route.
- Case studies (`#/case-studies`, `#/case-studies/<slug>`): slope chart hero, filter grid, metric definitions; template = results board, practice profile, found/fixed rows, 90-day scrubber. Data in `src/data/insights.ts` — ALL FIGURES ILLUSTRATIVE until client approves real results.
- Blog (`#/blog`, `#/blog/<slug>`): featured + filter grid + newsletter; article template with progress bar, sticky TOC, stat/callout/timeline/table blocks, sources. 2 full articles (CMS-0057-F prior auth rule; modifier 25); 4 "coming soon".
- Contact (`#/contact`): call/email/visit rows, call-back form (GoHighLevel embed still needed), next-steps line, office card, FAQ.
- Homepage comment round done: plain eyebrows, outline bento buttons, liquid hover on CTA buttons, real testimonials (rcm.affinitycore.co) with stars, footer socials/phone/email buttons/official address, FAQ call CTA.

## Design rules learned (from Ali's feedback)
- 120px side margins (`--gutter: 12rem`, 1rem = 10px at 1920). One section heading size (5.6rem); hero bigger.
- No two filled folds next to each other; avoid full-width filled bands; prefer rounded inset panels.
- Purple palette only (no magenta/cyan); avoid red/green icons on dark; backgrounds subtle.
- Not traditional sections: each fold needs a concept, real data, motion. No "AI slop".
- Animations smooth/subtle; no overlapping cards during transitions.

## Assets
- Envato (licensed to project "Affinity Core Website"): `~/Downloads/affinity-envato/` — lavender videos, grainy textures, Virelia fluted glass. In use: `src/assets/fluted-purple.jpg`.
- Two photos still not downloaded (billing specialist at dual monitors; coder at desk) — Envato IDs 9614b698…, 8df0fc86….

## Next steps
1. More specialty pages from the template (22 to go; lite data already written for each). Confirm list: nav has 23, homepage button says "25+".
2. Swap in Envato photos (billing specialist, coder) for case studies/contact.
3. Real case studies + GHL form embed from client.
4. Mobile polish, SEO per page, Framer handoff notes.

## Open questions for client
Phone number (214-851-2698 vs 214-851-2698), specialties list (23 vs "25+"), which cardiology services are in scope (EP? device clinic?), whether they handle prior auth, publishable stats/case studies, GHL form details, turnaround times, coder credentials.

## Latest pass (pop covers, light mode, cutouts)
- Case covers use `PopCover`: photo clipped below `--clip`, person cut-out on top so the head breaks out, glass metric widget + chip. `cut` is optional; the orthopedics case now uses a cleaner Envato photo (case-ortho-desk + cut) with the breakout.
- Spot the error, prior-auth calculator and 90-day scrubber panels are light mode (overrides at the end of insights.css).
- Cut-outs defringed (scratchpad `defringe.py`): specialists.png, case-billing (background bleed removed), case-coder.

## Forms, phone, gradient (v23)
- Forms stay as our own designed forms (Contact + Assessment) for now. A ready GoHighLevel embed component exists in `components/GhlForm.tsx` (form ID kqH0bBYXUvdSDkNhyt0a from rcm.affinitycore.co) but is not used; swap it in when Ali says.
- Bento cards on the homepage use a text + arrow link (`.svc__go`) instead of outline buttons.
- Phone is the official 214-851-2698 everywhere (official footer also lists 214-851-2695).
- Purple fills inside widgets use the plain widget gradient `--grad` / `--grad-x` (#8a6bff → #6a41f9).
- Case-study numbers stay as illustrative placeholders until real data arrives.

## Performance pass (keep these rules in the Next.js build)
- Frosted panels use a pre-blurred image (`fluted-frost.jpg`, `fluted-frost-sm.jpg` for small cards) under a white overlay. No live `backdrop-filter` on large panels.
- The button goo SVG filter is only applied while hovered (`.btn.is-goo`).
- No permanent `will-change` on reveal text. Only elements moved every scroll frame get it (parallax pills, CTA rows, journey traveler, progress bars).
- Looping CSS animations pause when their section is off screen (`[data-off]`, set by an IntersectionObserver in App).
- Claim-form heroes: the tour pauses off screen. While hovered, layout is only read when the pointer or page moves.
- Lenis runs inside Motion's frame loop (`frame.update`) with lerp 0.12 and wheelMultiplier 1.
- LayoutGroup wraps only the loader and nav, so nav state changes don't re-render the page.
- Cut-out drop shadows are baked into the webp files. Star shadows use one filter per row, not one per star.

## Specialty pages, blog covers (v30)
- All 23 specialties now have full pages. Content lives in `data/sp-primary.ts`, `sp-medical.ts`, `sp-surgical.ts` and `sp-behavioral-hospital.ts`. Shared sources, calculator presets and the prior-auth block are in `data/specialtyKit.ts`. Each page sets a `wave` (hero/ledger trace shape) and a `photo`. `auth` is optional; specialties without it skip the prior-auth fold.
- Blog covers are code-built scenes (`components/BlogCover.tsx`): eob, claim, clock, hold, sticky, stat. Each article picks one via its `cover` field. The 100-title content plan is in a separate doc.
- Nav: "| RCM" sub-brand after the logo, links aligned left, phone number on the call button (collapses to the icon below 1440px).
- Case covers: portrait breakout with one frame line (34%), set per case with `fit` (zoom/shift plus the disc behind the head).
- 90-day scrubber: custom track driven by a motion value, with an invisible native range input on top.
- Each specialty hero now has its own signature widget (`components/SpecialtyWidgets.tsx`, keyed by slug): session clock (mental health), therapy split (psychiatry), anesthesia record, scan match (radiology), specimen jars (pathology), body map (derm), eyes (ophth), spine levels (pain), toes (podiatry), dose vial (urology), wound grid, ESRD month (nephro), EEG + Botox vial (neuro), infusion hierarchy (onc), colon path (GI), test wells (allergy), 40-week line (OB), OR board (ASC), 90-day global (ortho), add-on chips (IM), vaccine components (peds), door-to-claim (urgent care). Cardiology keeps the ECG beat strip. The widgets loop only while on screen.
- "Codes we see every day" card: each specialty has its own line drawing (`components/SpecialtyArt.tsx`): colon, kidneys, brain, IV bag, lungs, uterus, stethoscope, syringe, clock + cross, OR lamp, knee, skin layers, eye, spine, foot, urinary tract, dressing + ruler, head + speech bubble, head + capsule, capnography wave, chest x-ray, microscope. Cardiology keeps the ECG. A marker with the code moves to where the selected code applies (`pts[i]`).

## Careers + HIPAA badge + time zone copy (v38)
- `/careers` (`pages/Careers.tsx`, data in `data/careers.ts`, a Strapi "Job openings" collection later). It has a "Today on the team" wins ticker, 9 RCM roles with team filters (expand for details, then an inline apply form), a career ladder per track, perks, the hiring steps and an FAQ. Lines marked [Confirm] are perks and process details still to confirm.
- Footer awards strip replaced with the HIPAA compliant badge (`assets/hipaa-badge.png`, transparent) on a white disc. The hero HIPAA badge uses the same file.
- Turnaround and reply copy now says "US-based, working in your time zone" (Contact, Urgent care FAQ).

## Envato photos (v32)
- 22 specialty hero photos in `src/assets/sp/<slug>.webp` (licensed to "Affinity Core Website"), picked up by `import.meta.glob` in SpecialtyPage. Focal points per photo live in `SP_POS`; alt text is `photoAlt` in the sp-*.ts data. Strapi: specialty.heroImage + heroFocal.
- Contact page has a new "Who picks up" fold (`WhoAnswers`): team photo (`assets/sp/contact.webp`), 30+ chip, and live PT/MT/CT/ET clocks; the viewer's zone is highlighted, else CT (Plano office). The pulse dot is CSS and pauses off screen.
- Orthopedics case: `case-ortho-desk.jpg` + `case-ortho-desk-cut.webp` (rembg u2net_human_seg + defringe).
- Originals (full-res) are in Ali's ~/Downloads/affinity-envato/specialty.

## Specialty-only folds (v40, cardiology first)
- Specialty pages no longer reuse the service-page "problem in numbers" calculator and sticky document. When a specialty has `leak` / `claim` data they render instead (fallback to the old folds until each specialty is written).
- `LeakFall` (components/SpecialtyFolds.tsx): waterfall of one month's expected revenue draining through 5 specialty leaks, broken axis at 85% so leaks are readable, practice-size toggle (Solo / N / 20) rescales every number, hover/click a leak for "where it leaks / how we stop it". Illustrative numbers, labelled as such.
- `TwoClaims`: the same visit as two claims stacked; a fix line follows the cursor down the claim (tap toggles on touch) and each row flips from "as it usually goes out" to "as we send it", the running total counts up, and the matching "why" note lights up. Reduced motion shows the fixed claim.
- Strapi: specialty.leak (perProvider, sizes, leaks[label, cause, pct, fix], note) and specialty.claim (visit, rows[label, bad, good, why], note).

## Case study covers (v42)
- Pop-out cut-outs, discs and floating widgets are gone. `CaseCover` is one full-frame documentary photo with a shared grade (soft-light purple tint + bottom scrim) and the headline result written on the photo ("Denials 57% lower · 14% → 6% in 90 days").
- `CaseCard` body: practice profile line (specialty · size · location), title, three before → after metrics (struck-through before, bold after, headline metric in purple), "Read case study". Used on the case-studies hub, related cases and the case fold on every service/specialty page.
- Case detail page shows the photo plain next to the practice profile (the result is already in the hero board).
- Case data: `alt` and optional `pos` (focal point) per case; `cut`, `fit`, `clip`, `side` removed. Real client photos and names drop straight in when approved.

## Specialty folds rolled out to all 23 specialties (v44)
- Content lives in `src/data/sp-folds.ts` (one entry per slug: leak waterfall + two-claims example), merged into each page in `specialties.ts`. Cardiology keeps its own entry in specialties.ts.
- Each specialty has 4 specialty-specific leaks + the shared "Denials never worked" leak, a practice-size toggle in its own unit (physicians, locations, ORs, clinicians…), and a 3–4 line claim built from its ledger codes.
- All amounts, expected revenue per provider and leak rates are ILLUSTRATIVE and labelled on the page. Review with Affinity Core before launch.
- Mobile (≤640px): the waterfall hides per-bar labels and shows Expected / Collected under the chart; the selected leak's $ shows in the detail panel; the claim table drops the status column and "why" notes stack.
- Urgent care case study photo replaced (`case-urgent-desk.jpg`, Envato, licensed to "Affinity Core Website").

## Careers polish (v45)
- "Where it leads" ladder: each rung now shows what you'll own (3 points) and a growth badge (credential / track), with step-up arrows between rungs; the top rung is the purple one. Data: `LADDER` in data/careers.ts (title, note, owns[], badge).
- Careers page gets bottom breathing room before the footer (`page--tail`), like Contact.

## Organic / SEO pass on child pages (v49)
**Loader**: plays only when the site is entered on a parent page, each with its own line: Home ("Medical Billing Service That Gets You Paid Faster"), /services ("Nine Services, One Accountable Team"), /specialties ("23 Specialties, Each Billed Its Own Way"), /case-studies ("Results Measured in Your Own Numbers"), /careers ("Build Your Revenue Cycle Career Here"), /blog ("Plain-English Guides to Getting Paid"). Child pages (service, specialty, case study, article) open straight to content. Config: `LOADER_WORDS` in App.tsx.

**New folds**
- `Included` (specialty pages, after the leak waterfall): the whole cycle in 3 phases (before the visit / after the visit / after the claim), 10 steps, each linking to its service page; coding and claim lines name the specialty and its top codes. Internal links for SEO.
- `EhrStrip` (specialty and service pages): reuses the homepage Platforms fold (floating logo pills on arcs) with page-specific copy ("We bill {specialty|service} directly in your EHR…"). `Platforms` takes optional lines/copy/cta props.
- `SpecialtyReads` (specialty pages, replaces the case-study fold there): 3 blog guides picked by relevance (specialty name, codes on the page, prior-auth/behavioral topics), published articles first. Service pages keep the case-study fold.

**FAQs**: `searchFaqs()` (data/seo.ts) puts the questions people search first (cost, how long switching takes), keeps each page's expertise questions, and adds "keep our in-house staff" and "which EHRs" where missing. Max 8 per page. Pricing and switching-time answers carry [Confirm with Affinity Core].

**Structured data**: every service and specialty page writes JSON-LD (Service + BreadcrumbList + FAQPage) via `pageJsonLd()`; the prototype injects it client-side, [Confirm] markers are stripped from schema text.

**SEO phase (Next.js build) — required**
1. Real URLs (`/specialties/cardiology`, `/services/medical-coding`), no hash routing. 301 any old paths.
2. Server-render all copy, including the interactive folds' text (leak labels/causes/fixes, claim rows and "why" notes, code ledger, FAQs), so it's in the initial HTML.
3. Render `pageJsonLd()` output in `<head>` server-side; add Organization JSON-LD site-wide.
4. Per-page `<title>`, meta description, canonical, Open Graph image (seoTitle / seoDescription already in data).
5. XML sitemap with all 23 specialty + 9 service pages + case studies + published articles; robots.txt.
6. Core Web Vitals: hero image priority/preload, lazy-load below-fold images, no loader on child pages (done), keep animation bundles split per route.
7. Content calendar: specialty guides from the 100-title blog plan feed `SpecialtyReads` automatically (match on specialty name / codes).

## Child-page restructure for conversion (v50)
Fold order now follows: hero → the problem → proof → how → objections → ask.
- **Specialty pages:** Hero (+TrustRow) → LeakFall/Problem → Ledger → TwoClaims/HowWeWork → MidCta → AuthClock (if auth) → Proof → Included → EhrStrip → Switching → Assessment → FAQ → SpecialtyReads → Related → CTA.
- **Service pages:** Hero (+TrustRow) → Problem (calculator) → HowWeWork → Proof → MidCta → Ticket → SpecialtyChips → EhrStrip → Switching → Assessment (formFirst) → FAQ → Rail → CTA.
- New components in `components/ChildFolds.tsx`: `TrustRow` (HIPAA, 30+ US-based, certified coders), `MidCta` (purple band + phone), `Switching` (4-step 30-day onboarding, "From you" line per step), `SpecialtyChips` (service → specialty links, internal linking for SEO).
- `data/estimate.ts`: tiny store. The service-page calculator writes its headline result; `Assessment formFirst` shows it as "Your estimate from above" and sends it in a hidden `estimate` field. Form also sends a hidden `source` (`specialty:<slug>` / `service:<slug>`) for lead attribution — map both to Strapi/CRM fields.
- `Assessment` props: `monthly` (specialty-sized estimator default), `specialty` (pre-selects the dropdown), `formFirst`, `source`.
- Service hero x-ray lens is now light mode (lavender plate, purple ring) to match the default form.
- [Confirm with Affinity Core]: onboarding timeline in Switching, credentials list in TrustRow.

## v51–v58 (Oct 15–20)
- Class-name collisions fixed: Switching fold now `swt-*` (was `sw`, clashed with hero widget `.sw`); case card overflow rule scoped to `.cs__card.cx` (was clipping ClaimXray `.cx`). Rule of thumb: grep a prefix before using it.
- Specialty hero widgets: every SIGNATURE widget's `.sw__viz` uses cardiology's framed grid panel.
- Loader also plays on in-site navigation to parent pages (services, specialties, careers, case studies, blog), once per page per visit. Home never replays.
- Home hero: HIPAA badge moved from stats into a "Certified by" row (replaced "Trusted BY" logos); stepped spacing 12/20/40/48/72px.
- Service hero x-ray lens is light mode.
- Specialties hub: arrow button hidden on desktop, bare arrow ≤1100px; new search (icon expands to input; matches names, ALIASES map in SpecialtiesHub.tsx and CPT codes; empty state); "Spot the error" fold removed from the page (component kept).
- Open: footer badges need hi-res files (Clutch, CPC, HIPAA); [Confirm] items; mobile nav/polish pass; cardiology photo; About page; PPC landing mode; "What changed in 2026" section.
