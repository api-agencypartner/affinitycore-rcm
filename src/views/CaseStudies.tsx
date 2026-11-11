'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useInView, animate, useMotionValue, useTransform } from 'motion/react';
import { ArrowRight, ChevronLeft, Check } from 'lucide-react';
import { Button, CountUp, Eyebrow, Logo, Reveal, SplitWords } from '../components/ui';
import { CTA } from '../sections/Closing';
import { IntroBlock, caseIntro } from '../components/IntroBlock';
import { Link, go } from '../router';
import { CASES, METRICS, getCase, type Case, type MetricKey } from '../data/insights';
import { SERVICES } from '../data/services';
import { ease, vp } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';

const svc = (slug: string) => SERVICES.find((s) => s.slug === slug);
const fmtM = (k: MetricKey, v: number) => `${Math.round(v)}${METRICS.find((m) => m.key === k)!.unit}`;
const setMeta = (title: string, desc: string) => {
  document.title = `${title} · Affinity Core`;
  let m = document.querySelector('meta[name="description"]');
  if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
  m.setAttribute('content', desc);
};

/* ================= Overview hero: slope chart, before → day 90 ================= */
/** label spacing in chart units: phones show the chart at about half size, so labels get bigger and need more room */
const GAP = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches ? 34 : 22;
function Slope() {
  const [k, setK] = useState<MetricKey>('denial');
  const [hot, setHot] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.3 });
  const m = METRICS.find((x) => x.key === k)!;
  const vals = CASES.flatMap((c) => [c.before[k], c.after[k]]);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.18 || 1;
  const Y = (v: number) => 40 + (1 - (v - (lo - pad)) / (hi - lo + 2 * pad)) * 300;
  // Dodge labels so equal values don't print on top of each other
  const dodge = (ys: number[]) => {
    const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y); const out = [...ys];
    order.forEach((o, j) => { const prev = j ? out[order[j - 1].i] : -Infinity; out[o.i] = Math.max(o.y, prev + GAP); });
    return out;
  };
  const L1 = dodge(CASES.map((c) => Y(c.before[k]))), L2 = dodge(CASES.map((c) => Y(c.after[k])));
  return (
    <div className="sl [position:relative] [isolation:isolate] [overflow:hidden] [border-radius:4rem] [border:1px_solid_rgba(106,_65,_249,_0.14)] [box-shadow:0_4rem_10rem_-4rem_rgba(80,_40,_220,_0.25)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background:rgba(255,_255,_255,_0.72)] [padding:3.2rem_3.6rem_2.8rem] [@media(max-width:_1279px)]:[padding:2.4rem_1.6rem] [@media(max-width:_1279px)]:[border-radius:2.8rem]" ref={ref}>
      <div className="sl__bg [position:absolute] [inset:0] [z-index:-2] [overflow:hidden] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[max-width:none] [&_img]:[object-fit:cover] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate]" aria-hidden><img src={fluted} alt="" /></div>
      <LayoutGroup>
        <div className="sl__tabs [display:inline-flex] [gap:0.4rem] [padding:0.4rem] [border-radius:4rem] [background:rgba(255,_255,_255,_0.8)] [border:1px_solid_var(--lav-border)] [&_button]:[position:relative] [&_button]:[padding:1rem_1.8rem] [&_button]:[border-radius:4rem] [&_button]:[font-size:1.5rem] [&_button]:[color:var(--ink-2)] [&_button]:[isolation:isolate] [&_button]:[transition:color_0.3s] [&_button_span]:[position:relative] [&_button_span]:[z-index:1] [@media(max-width:_1279px)]:[flex-wrap:wrap] [@media(max-width:_1279px)]:[border-radius:2rem]" role="tablist" aria-label="Metric">
          {METRICS.map((x) => (
            <button key={x.key} role="tab" aria-selected={k === x.key} className={k === x.key ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => setK(x.key)}>
              {k === x.key && <motion.span layoutId="sl-pill" className="sl__pill [position:absolute] [inset:0] [border-radius:4rem] [.sl\_\_tabs_span&]:[position:absolute] [.sl\_\_tabs_span&]:[z-index:0] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span>{x.short}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <div className="sl__chart [margin-top:2rem] [&_svg]:[display:block] [&_svg]:[width:100%] [&_svg]:[height:auto] [&_svg]:[overflow:visible] [&_svg]:[font-family:var(--f-sans)]">
        <svg viewBox="0 0 600 380" aria-label={`${m.label} before and after 90 days for each case study`}>
          <line x1="90" x2="90" y1="20" y2="360" className="sl__axis [stroke:rgba(106,_65,_249,_0.18)] [stroke-width:2] [stroke-dasharray:2_6]" />
          <line x1="400" x2="400" y1="20" y2="360" className="sl__axis [stroke:rgba(106,_65,_249,_0.18)] [stroke-width:2] [stroke-dasharray:2_6]" />
          <text x="90" y="14" className="sl__ax [font-family:var(--f-mono)] [font-size:13px] [letter-spacing:0.06em] [text-transform:uppercase] [fill:#8a83a8] [text-anchor:middle] [@media(max-width:_767px)]:[font-size:22px]">Before</text>
          <text x="400" y="14" className="sl__ax [font-family:var(--f-mono)] [font-size:13px] [letter-spacing:0.06em] [text-transform:uppercase] [fill:#8a83a8] [text-anchor:middle] [@media(max-width:_767px)]:[font-size:22px]">Day 90</text>
          {CASES.map((c, i) => {
            const y1 = Y(c.before[k]), y2 = Y(c.after[k]);
            const dim = hot && hot !== c.slug;
            return (
              <g key={c.slug} className={String.raw`sl__line [cursor:pointer] [transition:opacity_0.3s] [&_line]:[stroke:#8a6bff] [&_line]:[stroke-width:3] [&_line]:[stroke-linecap:round] [&.is-dim]:[opacity:0.18] [&.is-hot_line]:[stroke:var(--purple)] [&.is-hot_line]:[stroke-width:4] ${dim ? 'is-dim' : ''} ${hot === c.slug ? 'is-hot' : ''}`} onMouseEnter={() => setHot(c.slug)} onMouseLeave={() => setHot(null)} onClick={() => go(`/case-studies/${c.slug}`)}>
                <motion.line x1="90" x2="400" initial={false} animate={{ y1, y2: on ? y2 : y1 }} transition={{ duration: 1.1, ease: ease.out, delay: on ? i * 0.08 : 0 }} />
                <motion.circle cx="90" r="7" className="was [.proof\_\_pair_i&]:[background:#ddd8ee] [.cs\_\_track_i&]:[background:#cfc6f3] [.tc\_\_delta_b&]:[color:#a3a6b8] [.tc\_\_delta_b&]:[text-decoration:line-through] [.tc\_\_delta_b&]:[text-decoration-thickness:2px]! [.sl\_\_line_&]:[fill:#fff] [.sl\_\_line_&]:[stroke:#b7a3ff] [.sl\_\_line_&]:[stroke-width:3]" initial={false} animate={{ cy: y1 }} transition={{ duration: 0.8, ease: ease.out }} />
                <motion.circle cx="400" r="8" className="now [.sl\_\_line_&]:[fill:var(--purple)] [.sl\_\_line_&]:[stroke:#fff] [.sl\_\_line_&]:[stroke-width:3] [.cs\_\_track_i&]:[background:var(--grad-x)] [.proof\_\_pair_i&]:[background:var(--grad-x)]" initial={false} animate={{ cy: on ? y2 : y1 }} transition={{ duration: 1.1, ease: ease.out, delay: on ? i * 0.08 : 0 }} />
                <motion.text x="74" textAnchor="end" className="sl__v [font-size:15px] [fill:#6b6f7c] [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[font-size:13px] [@media(max-width:_767px)]:[font-size:26px]!" initial={false} animate={{ y: L1[i] + 5 }}>{fmtM(k, c.before[k])}</motion.text>
                <motion.text x="418" className="sl__v sl__v--now [font-size:15px] [font-variant-numeric:tabular-nums] [fill:var(--ink-2)] [font-weight:600] [@media(max-width:_1279px)]:[font-size:13px] [@media(max-width:_767px)]:[font-size:26px]!" initial={false} animate={{ y: (on ? L2[i] : L1[i]) + 5 }} transition={{ duration: 1.1, ease: ease.out, delay: on ? i * 0.08 : 0 }}>{fmtM(k, c.after[k])} <tspan className="sl__sp [font-weight:400] [fill:#6b6f7c] [@media(max-width:_767px)]:[display:none]">{c.specialty}</tspan></motion.text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="sl__foot [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55] [margin-top:1.2rem] [font-size:1.4rem] [color:#6b6f7c]">{m.better === 'down' ? 'Lower is better.' : 'Higher is better.'} Hover a line to pick out one practice; click to read it.</p>
    </div>
  );
}

const loc = (c: Case) => c.profile.find(([k]) => k === 'Location')?.[1];
/** Labels shown on a card: specialty, size, location. */
const labels = (c: Case) => [...c.tag.split(' · '), loc(c)].filter(Boolean) as string[];
const headline = (c: Case) => {
  const m = METRICS.find((x) => x.key === c.headline)!;
  const a = c.before[c.headline], b = c.after[c.headline];
  const delta = m.better === 'down' ? `−${Math.round((1 - b / a) * 100)}%` : `+${b - a} pts`;
  return { m, a, b, delta };
};

/** Kept for the case detail page (plain photo next to the practice profile). */
export function CaseCover({ c, big }: { c: Case; big?: boolean }) {
  return (
    <div className={String.raw`cx__photo [position:relative] [aspect-ratio:16_/_10] [overflow:hidden] [background:#ece6ff] [isolation:isolate] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [&_img]:[filter:saturate(0.88)_contrast(1.03)_brightness(1.02)] [&_img]:[transform:scale(1.001)] [&_img]:[transition:transform_1.2s_cubic-bezier(.16,1,.3,1)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:1] [&::before]:[background:#6a41f9] [&::before]:[mix-blend-mode:soft-light] [&::before]:[opacity:0.22] [&::before]:[pointer-events:none] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[inset:0] [&::after]:[z-index:1] [&::after]:[background:linear-gradient(180deg,_rgba(20,_11,_48,_0)_52%,_rgba(20,_11,_48,_0.55)_100%)] [&::after]:[pointer-events:none] [.cs\_\_card.cx:hover_&_img]:[transform:scale(1.04)] ${big ? String.raw`cx__photo--big [aspect-ratio:4_/_3]! [&::after]:[display:none]` : ''}`}>
      <img src={c.photo} alt={c.alt} loading="lazy" style={c.pos ? { objectPosition: c.pos } : undefined} />
    </div>
  );
}

/** Compact case card: photo with one result widget, labels, one title. `still`: no own entrance (inside a grid that crossfades as a whole). */
export function CaseCard({ c, k = 0, still }: { c: Case; k?: number; still?: boolean }) {
  const enter = still ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: vp, transition: { duration: 0.8, ease: ease.out, delay: (k % 4) * 0.08 } };
  const { m, a, b, delta } = headline(c);
  const to = `/case-studies/${c.slug}`;
  return (
    <motion.article className="cc [display:flex] [flex-direction:column] [border-radius:2.4rem] [border:1px_solid_#ece8fa] [background:#fff] [overflow:hidden] [cursor:pointer] [outline:none] [transition:box-shadow_0.5s,_transform_0.5s_cubic-bezier(.16,1,.3,1),_border-color_0.4s] [&:hover]:[transform:translateY(-0.4rem)] [&:hover]:[border-color:#ddd3ff] [&:hover]:[box-shadow:0_2rem_4.8rem_rgba(106,_65,_249,_0.1)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [&_h3]:[font-weight:500] [&_h3]:[font-size:2.2rem] [&_h3]:[line-height:1.25] [&_h3]:[letter-spacing:-0.03rem] [&_h3]:[color:var(--ink-2)] [&_h3]:[text-wrap:balance] [@media(max-width:_640px)]:[&_h3]:[font-size:2rem]" onClick={() => go(to)} {...enter}
      role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') go(to); }}>
      <div className="cc__photo [position:relative] [aspect-ratio:4_/_3] [overflow:hidden] [background:#ece6ff] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [&_img]:[transition:transform_1.2s_cubic-bezier(.16,1,.3,1)] [.cc:hover_&_img]:[transform:scale(1.04)] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[inset:0.8rem] [&::after]:[z-index:2] [&::after]:[border-radius:1.6rem] [&::after]:[border:1px_solid_rgba(255,_255,_255,_0.35)] [&::after]:[pointer-events:none]">
        <img src={c.photo} alt={c.alt} loading="lazy" style={c.pos ? { objectPosition: c.pos } : undefined} />
        {/* Affinity Core layer: purple grade, fluted-glass band (the brand texture) and the logo's gradient mark */}
        <span className="cc__grade [position:absolute] [inset:0] [z-index:1] [pointer-events:none] [background:linear-gradient(180deg,_rgba(106,_65,_249,_0)_45%,_rgba(40,_18,_120,_0.45)_100%),_#6a41f9] [mix-blend-mode:soft-light] [opacity:0.9]" aria-hidden />
        <span className="cc__flute [position:absolute] [z-index:1] [top:0] [bottom:0] [right:0] [width:34%] [pointer-events:none] [background:repeating-linear-gradient(90deg,_rgba(255,_255,_255,_0.22)_0_0.6rem,_rgba(255,_255,_255,_0.04)_0.6rem_1.6rem),_linear-gradient(90deg,_rgba(138,_107,_255,_0.0),_rgba(138,_107,_255,_0.35))] [-webkit-backdrop-filter:blur(0.6rem)_saturate(1.2)] [backdrop-filter:blur(0.6rem)_saturate(1.2)] [-webkit-mask-image:linear-gradient(90deg,_transparent,_#000_40%)] [mask-image:linear-gradient(90deg,_transparent,_#000_40%)]" aria-hidden />
        <span className="cc__mark [position:absolute] [z-index:3] [left:1.6rem] [top:1.6rem] [display:inline-flex] [align-items:center] [gap:0.8rem] [background:rgba(20,_11,_48,_0.55)] [-webkit-backdrop-filter:blur(0.8rem)] [backdrop-filter:blur(0.8rem)] [color:#fff] [font-family:var(--f-mono)] [font-size:1.1rem] [letter-spacing:0.06em] [text-transform:uppercase] [padding:0.9rem_1.4rem] [border-radius:1.2rem]" aria-hidden><Logo light /></span>
        <span className="cc__chip [position:absolute] [left:1.2rem] [bottom:1.2rem] [display:flex] [flex-direction:column] [gap:0.2rem] [padding:1rem_1.4rem_1.1rem] [border-radius:1.6rem] [background:rgba(255,_255,_255,_0.94)] [box-shadow:0_0.8rem_2.4rem_rgba(20,_11,_48,_0.16)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.1rem] [&_small]:[letter-spacing:0.04em] [&_small]:[text-transform:uppercase] [&_small]:[color:#6b6f7c] [&>span]:[display:flex] [&>span]:[align-items:baseline] [&>span]:[gap:0.8rem] [&>span]:[font-variant-numeric:tabular-nums] [&_s]:[font-size:1.5rem] [&_s]:[color:#a3a6b8] [&_s]:[text-decoration-thickness:1px] [&_b]:[font-weight:600] [&_b]:[font-size:2.4rem] [&_b]:[letter-spacing:-0.03rem] [&_b]:[color:var(--ink-2)] [&_em]:[font-style:normal] [&_em]:[padding:0.2rem_0.8rem] [&_em]:[border-radius:1rem] [&_em]:[background:var(--grad-x)] [&_em]:[color:#fff] [&_em]:[font-size:1.25rem] [&_em]:[font-weight:600] [&_em]:[align-self:center] [z-index:3]">
          <small>{m.label} · 90 days</small>
          <span><s>{a}{m.unit}</s><b>{b}{m.unit}</b><em>{delta}</em></span>
        </span>
      </div>
      <div className="cc__body [display:flex] [flex-direction:column] [gap:1.2rem] [flex:1] [padding:2.2rem]">
        <ul className="cc__labels [display:flex] [flex-wrap:wrap] [gap:0.6rem] [&_li]:[border-radius:2rem] [&_li]:[background:#f4f0ff] [&_li]:[font-size:1.3rem] [&_li]:[color:#5b5f6e] [&_li:first-child]:[background:none] [&_li:first-child]:[border:1px_solid_#ddd3ff] [&_li:first-child]:[color:var(--purple)] [&_li:first-child]:[font-weight:500] [&_li]:[display:inline-flex] [&_li]:[align-items:center] [&_li]:[height:2.8rem] [&_li]:[padding:0_1.1rem] [&_li]:[line-height:1] [&_li:first-child]:[height:2.8rem] [&_li]:[padding-top:0.3rem]!">{labels(c).map((l) => <li key={l}>{l}</li>)}</ul>
        <h3>{c.title}</h3>
        <span className="cc__more [margin-top:auto] [padding-top:0.4rem] [display:inline-flex] [align-items:center] [gap:0.6rem] [font-weight:500] [font-size:1.5rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [.cc:hover_&_svg]:[transform:translateX(0.4rem)]">Read case study <ArrowRight size={16} /></span>
      </div>
    </motion.article>
  );
}

const DEFS: [string, string, string][] = [
  ['Denial rate', 'Denied claims ÷ claims submitted', 'How often payers say no the first time.'],
  ['Days in A/R', 'Total A/R ÷ average daily charges', 'How long, on average, it takes to get paid.'],
  ['Clean claim rate', 'Claims accepted on first submission ÷ claims submitted', 'How often a claim goes through without edits or rejections.'],
  ['Net collection rate', 'Payments ÷ (charges − contractual adjustments)', 'How much of what you’re owed you actually collect.'],
];

export function CaseStudiesHub() {
  const [f, setF] = useState('All');
  const specs = ['All', ...CASES.map((c) => c.specialty)];
  const list = CASES.filter((c) => f === 'All' || c.specialty === f);
  useEffect(() => setMeta('Medical Billing Case Studies', 'Before-and-after results from practices that handed their billing to Affinity Core: denial rate, days in A/R, clean claims and net collections.'), []);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <section className="xh csh [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1.05fr)] [gap:6rem] [align-items:center] [padding:14rem_var(--gutter)_6rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[gap:4rem]">
        <div className="xh__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
          <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Case studies</motion.p>
          <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={['Results, measured', 'in practices’ own', 'numbers.']} bold={['numbers.']} />
          <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
            Every engagement starts with a baseline and ends with a 90-day readout on the same four numbers. Here’s where four practices started, and where they landed.
          </motion.p>
          <motion.div className="sh-hero__cta [display:flex] [align-items:center] [gap:3.2rem] [flex-wrap:wrap]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
            <Button>Get a free revenue assessment</Button>
            <Link to="#cases" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">Browse case studies <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
        <motion.div className="xh__stage [position:relative] [.csh_&]:[align-self:center]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: ease.out, delay: 0.4 }}>
          <Slope />
        </motion.div>
      </section>

      <section className="cs container csl [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]" id="cases">
        <div className="cs__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:2rem] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[gap:1.2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
          <div>
            <Eyebrow>/ All case studies</Eyebrow>
            <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Pick a practice like yours.']} stagger={0.04} />
          </div>
        </div>
        <LayoutGroup>
          <div className="need__chips csl__chips [display:flex] [flex-wrap:wrap] [gap:1.2rem] [margin-top:3.2rem]" role="tablist">
            {specs.map((s) => (
              <button key={s} role="tab" aria-selected={f === s} className={String.raw`need__chip [position:relative] [padding:1.4rem_2.4rem] [border-radius:6rem] [border:1px_solid_#e3def5] [font-size:1.8rem] [color:var(--ink-2)] [isolation:isolate] [transition:color_0.35s_0.08s,_border-color_0.35s] [&>span:not(.need\_\_pill)]:[position:relative] [&>span:not(.need\_\_pill)]:[z-index:1] [&.is-on]:[color:#fff] [&.is-on]:[border-color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[flex:0_0_auto] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[white-space:nowrap] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[font-size:1.6rem] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[padding:1.2rem_2rem] ${f === s ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => setF(s)}>
                {f === s && <motion.span layoutId="csl-pill" className="need__pill [position:absolute] [inset:-1px] [border-radius:6rem] [z-index:0] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                <span>{s}</span>
              </button>
            ))}
          </div>
          {/* filter change: the whole grid crossfades once (no per-card reflow jumps) */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={f} className="cs__grid cs__grid--4 [display:grid] [margin-top:4rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [.csl_&]:[margin-top:3.2rem] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:2rem] [@media(max-width:_1440px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } }}>
              {list.map((c, k) => <CaseCard key={c.slug} c={c} k={k} still={f !== 'All' || undefined} />)}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </section>

      <section className="mdef container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [display:grid] [grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.2fr)] [gap:6rem] [align-items:start] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:10rem] [@media(max-width:_1279px)]:[gap:3.2rem]">
        <div className="mdef__head [display:flex] [flex-direction:column] [gap:1.2rem] [position:sticky] [top:14rem] [@media(max-width:_1279px)]:[position:static]">
          <Eyebrow>/ How we measure</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Four numbers,', 'so you can check us.']} stagger={0.04} />
          <Reveal as="p" className="body-18 [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]">The same four metrics appear in every monthly report, calculated the same way, from your own system.</Reveal>
        </div>
        <div className="mdef__grid [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
          {DEFS.map(([t, f2, d], i) => (
            <Reveal key={t} className="mdef__card [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-direction:column] [gap:1.2rem] [padding:3.2rem] [border-radius:2.4rem] [background:var(--panel)] [border:1px_solid_#efebfb] [&_b]:[font-weight:500] [&_b]:[font-size:2.8rem] [&_b]:[letter-spacing:-0.05rem] [&_b]:[color:var(--ink-2)] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.4rem] [&_code]:[line-height:1.5] [&_code]:[color:var(--purple)] [&_code]:[background:#fff] [&_code]:[border:1px_solid_var(--lav-border)] [&_code]:[border-radius:1rem] [&_code]:[padding:1rem_1.2rem] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.5] [&_p]:[color:#5b5f72]" delay={i * 0.08}>
              <span className="mdef__n [font-family:var(--f-mono)] [font-size:1.3rem] [color:#a29cbc]">0{i + 1}</span>
              <b>{t}</b>
              <code>{f2}</code>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA eyebrow="/ Your practice next" lines={['Get your own baseline,', 'free, in your own numbers.']} />
    </main>
  );
}

/* ================= Case study template ================= */
function Board({ c }: { c: Case }) {
  return (
    <div className="cb [position:relative] [isolation:isolate] [overflow:hidden] [border-radius:4rem] [border:1px_solid_rgba(106,_65,_249,_0.14)] [box-shadow:0_4rem_10rem_-4rem_rgba(80,_40,_220,_0.25)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background:rgba(255,_255,_255,_0.72)] [padding:3.6rem] [@media(max-width:_1279px)]:[padding:2rem] [@media(max-width:_1279px)]:[border-radius:2.8rem]">
      <div className="sl__bg [position:absolute] [inset:0] [z-index:-2] [overflow:hidden] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[max-width:none] [&_img]:[object-fit:cover] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate]" aria-hidden><img src={fluted} alt="" /></div>
      <p className="cb__label [display:inline-flex] [align-items:center] [gap:0.8rem] [font-family:var(--f-mono)] [font-size:1.3rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:#6b6f7c] [&_span]:[width:0.8rem] [&_span]:[height:0.8rem] [&_span]:[border-radius:50%] [&_span]:[background:var(--purple)] [&_span]:[box-shadow:0_0_0_0.5rem_rgba(106,_65,_249,_0.14)]"><span />Before → Day 90</p>
      <div className="cb__grid [display:grid] [gap:1.6rem] [margin-top:2rem] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
        {[...METRICS].sort((x, y) => Number(y.key === c.headline) - Number(x.key === c.headline)).map((m, i) => {
          const a = c.before[m.key], b = c.after[m.key];
          const lead = m.key === c.headline;
          return (
            <motion.div key={m.key} className={String.raw`cb__tile [display:flex] [flex-direction:column] [gap:1rem] [padding:2.4rem] [border-radius:2.4rem] [background:rgba(255,_255,_255,_0.88)] [border:1px_solid_#fff] [box-shadow:0_1.6rem_4rem_rgba(57,_28,_160,_0.08)] [&.is-lead]:[grid-column:1_/_-1] [&.is-lead]:[color:#fff] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#6b6f7c] [&.is-lead_small]:[color:#d9ceff] [&_em]:[font-style:normal] [&_em]:[font-weight:600] [&_em]:[font-size:1.4rem] [&_em]:[color:var(--purple)] [&.is-lead_em]:[color:#fff] [&.is-lead]:[background:var(--grad)] [&.is-lead]:[border-color:transparent] ${lead ? 'is-lead' : ''}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.6 + i * 0.1 }}>
              <small>{m.label}</small>
              <div className="cb__nums [display:flex] [align-items:center] [gap:1.2rem] [color:#a29cbc] [&_s]:[font-size:2.4rem] [&_s]:[text-decoration-thickness:2px] [&_b]:[font-weight:500] [&_b]:[font-size:4.4rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.12rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-variant-numeric:tabular-nums] [.cb\_\_tile.is-lead_&]:[color:rgba(255,_255,_255,_0.6)] [.cb\_\_tile.is-lead_&_s]:[font-size:3.2rem] [.cb\_\_tile.is-lead_&_b]:[font-size:9.6rem] [.cb\_\_tile.is-lead_&_b]:[letter-spacing:-0.3rem] [.cb\_\_tile.is-lead_&_b]:[color:#fff] [@media(max-width:_1279px)]:[.cb\_\_tile.is-lead_&_b]:[font-size:6.4rem] [.cb\_\_tile:not(.is-lead)_&_b]:[font-size:3.6rem] [.cb\_\_tile:not(.is-lead)_&_s]:[font-size:2rem]"><s>{a}{m.unit}</s><ArrowRight size={lead ? 22 : 16} /><b><CountUp value={b} suffix={m.unit} start delay={0.9 + i * 0.1} /></b></div>
              <span className="cb__bar [height:0.6rem] [border-radius:1rem] [background:rgba(106,_65,_249,_0.12)] [overflow:hidden] [.cb\_\_tile.is-lead_&]:[background:rgba(255,_255,_255,_0.2)] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[border-radius:1rem] [&_i]:[transform-origin:left] [.cb\_\_tile.is-lead_&_i]:[background:#fff] [&_i]:[background:var(--grad-x)]"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: Math.min(a, b) / Math.max(a, b) }} transition={{ duration: 1.2, ease: ease.out, delay: 1 + i * 0.1 }} /></span>
              <em>{m.better === 'down' ? `${Math.round((1 - b / a) * 100)}% lower` : `+${b - a} pts`}</em>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NinetyDays({ c }: { c: Case }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  const [day, setDay] = useState(0);
  const mv = useMotionValue(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!on || touched) return;
    const ctl = animate(mv, 90, { duration: 5, ease: 'easeInOut', onUpdate: (v) => { const r = Math.round(v); setDay((d) => (d === r ? d : r)); } });
    return () => ctl.stop();
  }, [on, touched, mv]);
  const fill = useTransform(mv, (v) => v / 90);
  const thumbX = useTransform(mv, (v) => `${(v / 90) * 100}%`);
  const t = day / 90; const e = 1 - Math.pow(1 - t, 2);
  const val = (k: MetricKey) => c.before[k] + (c.after[k] - c.before[k]) * e;
  return (
    <section className="nd container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]" ref={ref}>
      <div className="nd__head [display:flex] [flex-direction:column] [gap:1.2rem]">
        <Eyebrow>/ The first 90 days</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Drag through', 'the first 90 days.']} stagger={0.04} />
      </div>
      <div className="nd__panel [position:relative] [margin-top:4rem] [padding:4.8rem] [border-radius:4rem] [overflow:hidden] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[inset:auto_-10%_-60%_40%] [&::after]:[height:90%] [&::after]:[pointer-events:none] [@media(max-width:_1279px)]:[padding:3.2rem_2rem] [@media(max-width:_1279px)]:[border-radius:2.8rem] [background:linear-gradient(165deg,_#f4f0ff_0%,_#fbfaff_55%,_#fff_100%)] [color:var(--ink-2)] [border:1px_solid_var(--lav-border)] [box-shadow:0_3rem_8rem_-3rem_rgba(80,_40,_220,_0.18)] [&::after]:[background:radial-gradient(closest-side,_rgba(138,_107,_255,_0.14),_transparent)] [@media(max-width:_640px)]:[padding:3.2rem_2rem]">
        <div className="nd__day [position:absolute] [right:4.8rem] [top:3.6rem] [text-align:right] [&_small]:[display:block] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_b]:[font-weight:500] [&_b]:[font-size:7.2rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.2rem] [&_b]:[font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[right:2rem] [@media(max-width:_1279px)]:[top:2.4rem] [@media(max-width:_1279px)]:[&_b]:[font-size:5.6rem] [&_small]:[color:#8a8ea0] [&_b]:[color:var(--purple)] [@media(max-width:_640px)]:[right:2rem] [@media(max-width:_640px)]:[top:2.4rem] [@media(max-width:_640px)]:[&_b]:[font-size:5.6rem]"><small>Day</small><b>{day}</b></div>
        {/* Custom track (fill, thumb, milestones on the line) driven by a motion value; the native range
            input sits on top, invisible, for drag + keyboard. No per-frame React renders for the visuals. */}
        <div className="nd__slider [position:relative] [margin:8rem_0_7rem] [height:2.8rem] [&_input]:[position:absolute] [&_input]:[inset:-1rem_-1.5rem] [&_input]:[width:calc(100%_+_3rem)] [&_input]:[height:calc(100%_+_2rem)] [&_input]:[margin:0] [&_input]:[opacity:0] [&_input]:[cursor:grab] [&_input]:[z-index:3] [&_input:active]:[cursor:grabbing] [@media(max-width:_1279px)]:[margin:9rem_0.8rem_6rem]">
          <div className="nd__rail [position:absolute] [left:0] [right:0] [top:50%] [height:0.6rem] [margin-top:-0.3rem] [border-radius:1rem] [background:#e6e0fb]" aria-hidden>
            <motion.i className="nd__fill [position:absolute] [inset:0] [border-radius:inherit] [background:var(--grad-x)] [transform-origin:left]" style={{ scaleX: fill }} />
            {c.timeline.map((m) => (
              <span key={m.day} className={String.raw`nd__dot [position:absolute] [top:50%] [width:2rem] [height:2rem] [margin:-1rem_0_0_-1rem] [border-radius:50%] [display:grid] [place-items:center] [background:#fff] [border:1.5px_solid_#d6cdf7] [color:#fff] [transition:background_0.3s,_border-color_0.3s] [&.is-done]:[background:var(--purple)] [&.is-done]:[border-color:var(--purple)] ${day >= m.day ? String.raw`is-done [.pp\_\_list_li&]:[color:var(--ink-2)] [.pa-art\_\_steps_li&]:[color:#6a41f9]` : ''}`} style={{ left: `${(m.day / 90) * 100}%` }}>
                {day >= m.day && <Check size={11} strokeWidth={3.2} />}
              </span>
            ))}
            <motion.b className="nd__thumb [position:absolute] [top:50%] [width:3rem] [height:3rem] [margin:-1.5rem_0_0_-1.5rem] [border-radius:50%] [background:#fff] [border:0.6rem_solid_var(--purple)] [box-shadow:0_0.6rem_1.6rem_rgba(106,_65,_249,_0.35)] [z-index:2] [.nd\_\_slider:focus-within_&]:[outline:2px_solid_var(--purple)] [.nd\_\_slider:focus-within_&]:[outline-offset:4px]!" style={{ left: thumbX }} />
          </div>
          <input type="range" min={0} max={90} value={day} aria-label="Day of engagement"
            onChange={(ev) => { const v = Number(ev.target.value); setTouched(true); mv.set(v); setDay(v); }} />
          <div className="nd__marks [position:absolute] [left:0] [right:0] [top:calc(100%_+_1.2rem)] [height:0]">
            {c.timeline.map((m) => (
              <button key={m.day} className={String.raw`nd__mark [position:absolute] [translate:-50%_0] [color:#8a8ea0] [font-size:1.3rem] [white-space:nowrap] [z-index:4] [&.is-done]:[color:var(--ink-2)] [&:first-child]:[translate:0_0] [&:last-child]:[translate:-100%_0] [@media(max-width:_1279px)]:[&_span]:[display:none] [@media(max-width:_640px)]:[scale:0.72] [@media(max-width:_640px)]:[&:first-child]:[display:none] ${day >= m.day ? String.raw`is-done [.pp\_\_list_li&]:[color:var(--ink-2)] [.pa-art\_\_steps_li&]:[color:#6a41f9]` : ''}`} style={{ left: `${(m.day / 90) * 100}%` }} onClick={() => { setTouched(true); mv.set(m.day); setDay(m.day); }}>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="nd__cols [display:grid] [grid-template-columns:minmax(0,_1.2fr)_minmax(0,_1fr)] [gap:4.8rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:3.2rem]">
          <div className="nd__metrics [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:2.4rem_3.2rem]">
            {METRICS.map((m) => {
              const v = val(m.key);
              return (
                <div key={m.key} className="nd__m [&_small]:[font-size:1.4rem] [&_b]:[display:block] [&_b]:[margin-top:0.4rem] [&_b]:[font-weight:500] [&_b]:[font-size:4.4rem] [&_b]:[letter-spacing:-0.1rem] [&_b]:[font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[&_b]:[font-size:3.2rem] [&_small]:[color:#6b6f7c] [&_b]:[color:var(--ink-2)]">
                  <small>{m.label}</small>
                  <b>{fmtM(m.key, v)}</b>
                  <span className="nd__track [display:block] [margin-top:1rem] [height:0.4rem] [border-radius:1rem] [overflow:hidden] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[transform-origin:left] [&_i]:[transition:transform_0.15s_linear] [background:#e6e0fb] [&_i]:[background:var(--grad-x)]"><i style={{ transform: `scaleX(${v / Math.max(c.before[m.key], c.after[m.key])})` }} /></span>
                </div>
              );
            })}
          </div>
          <div className="nd__log [display:flex] [flex-direction:column] [gap:1.2rem] [min-height:24rem]">
            <AnimatePresence mode="popLayout" initial={false}>
              {[...c.timeline].filter((m) => day >= m.day).reverse().slice(0, 3).map((m) => (
                <motion.div key={m.day} className="nd__entry [padding:1.8rem_2rem] [border-radius:1.6rem] [border:1px_solid_rgba(255,_255,_255,_0.1)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_p]:[margin-top:0.6rem] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.5] [background:#fff] [border-color:#ece8fa]! [box-shadow:0_1rem_2.4rem_rgba(57,_28,_160,_0.06)] [&_small]:[color:var(--purple)] [&_p]:[color:#4a4f63]" layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                  <small>Day {m.day} · {m.label}</small><p>{m.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseStudyPage({ slug }: { slug: string }) {
  const c = getCase(slug)!;
  const others = CASES.filter((x) => x.slug !== slug).slice(0, 3);
  useEffect(() => setMeta(`${c.specialty} Case Study: ${c.title}`, `${c.tag}. ${c.challenge[0]}`), [c]);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <section className="sp-hero csd-hero [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [padding:16.4rem_var(--gutter)_6rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[min-height:0] [align-items:center]">
        <div className="sp-hero__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
          <motion.nav className="crumbs [display:flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.4rem] [&_a]:[color:var(--purple)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
            <Link to="/case-studies"><ChevronLeft size={16} /> Case studies</Link><span>/</span><span>{c.specialty}</span>
          </motion.nav>
          <motion.p className="cs__tag [font-family:var(--f-mono)] [font-size:1.3rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:var(--purple)] [.csd-hero_&]:[margin-top:-1.2rem]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{c.tag}</motion.p>
          <SplitWords as="h1" className="page-title csd-title [font-weight:500] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [font-size:5.6rem] [@media(max-width:_1279px)]:[font-size:3.8rem]" animateNow delay={0.3} stagger={0.05} lines={[c.title]} />
          <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>{c.challenge[0]}</motion.p>
          <motion.div className="csd-svcs [display:flex] [flex-wrap:wrap] [align-items:center] [gap:1rem] [&_small]:[width:100%] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
            <small>Services used</small>
            {c.services.map((s) => <Link key={s} to={`/services/${s}`} className="csd-chip [display:inline-flex] [align-items:center] [gap:0.6rem] [padding:1rem_1.6rem] [border-radius:4rem] [border:1px_solid_var(--lav-border)] [font-size:1.6rem] [color:var(--ink-2)] [transition:background_0.3s,_border-color_0.3s,_color_0.3s] [&:hover]:[color:#fff] [&:hover]:[background:var(--grad)] [&:hover]:[border-color:transparent]">{svc(s)?.name} <ArrowRight size={14} /></Link>)}
          </motion.div>
        </div>
        <motion.div className="csd-stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.3 }}>
          <Board c={c} />
        </motion.div>
      </section>

      <IntroBlock d={caseIntro(c)} />

      <section className="csp container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:center] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:8rem] [@media(max-width:_1279px)]:[gap:3.2rem]">
        <Reveal className="csp__photo csp__photo--cx [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [aspect-ratio:auto] [border-radius:3.2rem] [overflow:hidden]"><CaseCover c={c} big /></Reveal>
        <div className="csp__info [display:flex] [flex-direction:column] [gap:2.4rem] [&_dl]:[border-top:1px_solid_#ece8f7] [&_dl>div]:[display:grid] [&_dl>div]:[grid-template-columns:16rem_1fr] [&_dl>div]:[gap:2rem] [&_dl>div]:[padding:2rem_0] [&_dl>div]:[border-bottom:1px_solid_#ece8f7] [&_dt]:[font-family:var(--f-mono)] [&_dt]:[font-size:1.3rem] [&_dt]:[text-transform:uppercase] [&_dt]:[letter-spacing:0.06em] [&_dt]:[color:#8a8ea0] [&_dt]:[padding-top:0.3rem] [&_dd]:[font-size:2rem] [&_dd]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[&_dl>div]:[grid-template-columns:11rem_1fr] [@media(max-width:_1279px)]:[&_dd]:[font-size:1.7rem]">
          <Eyebrow>/ The practice</Eyebrow>
          <dl>{c.profile.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </section>

      <section className="ff container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
        <div className="ff__head [display:flex] [flex-direction:column] [gap:1.2rem]">
          <Eyebrow>/ What we found, what we fixed</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Three problems.', 'Three fixes at the source.']} stagger={0.04} />
        </div>
        <ol className="ff__rows [margin-top:4rem] [display:flex] [flex-direction:column] [gap:1.6rem] [list-style:none]">
          {c.challenge.map((p, i) => (
            <motion.li key={i} className="ff__row [display:grid] [grid-template-columns:6rem_minmax(0,_1fr)_8rem_minmax(0,_1.2fr)] [align-items:center] [gap:2.4rem] [padding:3.2rem] [border-radius:2.8rem] [border:1px_solid_#ece8fa] [background:#fff] [&_small]:[display:block] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0] [&_small]:[margin-bottom:0.8rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_1279px)]:[padding:2.4rem]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: i * 0.08 }}>
              <span className="ff__n [font-family:var(--f-mono)] [font-size:1.6rem] [color:#a29cbc]">0{i + 1}</span>
              <div className="ff__found [&_p]:[font-size:1.9rem] [&_p]:[line-height:1.5] [&_p]:[color:var(--ink-2)]"><small>Found</small><p>{p}</p></div>
              <motion.span className="ff__arrow [height:2px] [background:linear-gradient(90deg,_#d6cdf7,_var(--purple))] [transform-origin:left] [position:relative] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[right:-1px] [&::after]:[top:-0.5rem] [&::after]:[border:0.6rem_solid_transparent] [&::after]:[border-left:0.9rem_solid_var(--purple)]! [&::after]:[border-right:0]! [@media(max-width:_1279px)]:[width:4rem] [@media(max-width:_1279px)]:[transform:rotate(90deg)]" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.3 + i * 0.08 }} aria-hidden />
              <div className="ff__fixed [padding:2.4rem] [border-radius:2rem] [background:var(--panel)] [border:1px_solid_#efebfb] [&_small]:[color:var(--purple)] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[color:var(--ink-2)] [&_p]:[margin-top:0.6rem] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.5] [&_p]:[color:#5b5f72]"><small>Fixed</small><b>{c.did[i].title}</b><p>{c.did[i].body}</p></div>
            </motion.li>
          ))}
        </ol>
      </section>

      <NinetyDays c={c} />

      <section className="cs container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
        <div className="cs__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:2rem] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[gap:1.2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
          <div><Eyebrow>/ More case studies</Eyebrow><SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Other practices,', 'same four numbers.']} stagger={0.04} /></div>
          <Link to="/case-studies" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">All case studies <ArrowRight size={18} /></Link>
        </div>
        <div className="cs__grid cs__grid--3 [display:grid] [margin-top:4rem] [.csl_&]:[margin-top:3.2rem] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">{others.map((o, k) => <CaseCard key={o.slug} c={o} k={k} />)}</div>
      </section>

      <CTA eyebrow="/ Your practice next" lines={['Want numbers like these?', 'Start with a free baseline.']} />
    </main>
  );
}
