'use client';
/**
 * /states: parent page for all 50 state landing pages.
 * Hero → interactive map + filterable state grid (map and cards highlight each other) →
 * "by Medicare contractor" content fold (SEO/AEO, internal links) → form → FAQ → CTA.
 */
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Search, X, MapPin } from 'lucide-react';
import { Eyebrow, SplitWords, Reveal } from '../components/ui';
import { HeroCapture } from '../components/HeroCapture';
import { USMap } from '../components/USMap';
import { CTA, FAQ } from '../sections/Closing';
import { Assessment } from '../sections/Assessment';
import { Link } from '../router';
import { STATES } from '../data/states';
import { MACS, MAC_OF, REGION_OF } from '../data/states-all';
import { ease, vp } from '../motion';

/** Cards shown per step on small screens (0 = no limit on desktop). */
function useStep() {
  const get = () => (typeof window === 'undefined' ? 0 : window.innerWidth <= 767 ? 8 : window.innerWidth <= 1279 ? 12 : 0);
  const [n, setN] = useState(get);
  useEffect(() => { const f = () => setN(get()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return n;
}

const REGIONS = ['All', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'] as const;
type Region = (typeof REGIONS)[number];

function Hero() {
  return (
    <section className="sth [display:grid] [grid-template-columns:minmax(0,_1.25fr)_minmax(0,_0.75fr)] [gap:8rem] [align-items:end] [padding:16rem_var(--gutter)_4rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4rem] [@media(max-width:_1279px)]:[padding-top:12rem]">
      <div className="sth__copy [display:flex] [flex-direction:column] [gap:2.4rem]">
        <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ States we serve</motion.p>
        <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={['Medical billing', 'in all 50 states.']} bold={['50']} />
        <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
          Every state has its own Medicare contractor, Medicaid program and prompt-pay deadline. Pick yours to see the rules we bill by there, or start with a free review of your claims.
        </motion.p>
        <motion.div className="sh-hero__cta [display:flex] [align-items:center] [gap:3.2rem] [flex-wrap:wrap]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
          <HeroCapture source="states" />
        </motion.div>
      </div>
      <motion.dl className="sth__stats [display:flex] [flex-direction:column] [gap:0] [border-top:1px_solid_#ece8fa] [&>div]:[display:flex] [&>div]:[align-items:baseline] [&>div]:[gap:2rem] [&>div]:[padding:2.2rem_0] [&>div]:[border-bottom:1px_solid_#ece8fa] [&_dt]:[min-width:7rem] [&_dt]:[font-family:var(--f-jak)] [&_dt]:[font-weight:500] [&_dt]:[font-size:5.6rem] [&_dt]:[line-height:1] [&_dt]:[letter-spacing:-0.2rem] [&_dt]:[color:var(--purple)] [&_dd]:[margin:0] [&_dd]:[font-size:1.7rem] [&_dd]:[line-height:1.4] [&_dd]:[color:#4a4f63] [@media(max-width:_1279px)]:[&_dt]:[font-size:4.4rem] [@media(max-width:_1279px)]:[&_dd]:[font-size:16px]" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: ease.out, delay: 0.6 }}>
        <div><dt>50</dt><dd>states with their own billing page</dd></div>
        <div><dt>12</dt><dd>Medicare jurisdictions we work every day</dd></div>
        <div><dt>1</dt><dd>US-based team, in your time zone</dd></div>
      </motion.dl>
    </section>
  );
}

function Finder() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState<Region>('All');
  const [hot, setHot] = useState<string | null>(null);
  // Phones/tablets: show a short list first; search and region tabs narrow it, "Show more" reveals the rest
  const step = useStep();
  const [limit, setLimit] = useState<number | null>(null);
  useEffect(() => { setLimit(null); }, [q, region]);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return STATES.filter((s) => (region === 'All' || REGION_OF[s.abbr] === region) &&
      (!t || s.name.toLowerCase().includes(t) || s.abbr.toLowerCase() === t || s.cities.some((c) => c.toLowerCase().includes(t))));
  }, [q, region]);
  return (
    <section className="stfd container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:10rem]" id="all-states">
      <div className="stfd__head [display:flex] [align-items:flex-end] [justify-content:space-between] [gap:4rem] [flex-wrap:wrap] [@media(max-width:_767px)]:[gap:2rem]">
        <div>
          <Eyebrow>/ Find your state</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Hover a state,', 'click to open its page.']} stagger={0.04} />
        </div>
        <div className="stfd__tools [display:flex] [flex-direction:column] [align-items:flex-end] [gap:1.2rem] [@media(max-width:_1279px)]:[align-items:stretch] [@media(max-width:_1279px)]:[width:100%]">
          <label className="stfd__search [display:flex] [align-items:center] [gap:1rem] [width:38rem] [max-width:100%] [height:5.2rem] [padding:0_1.8rem] [border-radius:10rem] [background:#fff] [border:1px_solid_#e4e0f2] [color:var(--purple)] [transition:border-color_0.3s,_box-shadow_0.3s] [&:focus-within]:[border-color:var(--purple)] [&:focus-within]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [&_input]:[flex:1] [&_input]:[min-width:0] [&_input]:[height:100%] [&_input]:[border:0] [&_input]:[outline:none] [&_input]:[background:transparent] [&_input]:[font-family:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-style:inherit] [&_input]:[line-height:inherit] [&_input]:[font-size:1.6rem] [&_input]:[color:var(--ink-2)] [&_button]:[display:grid] [&_button]:[place-items:center] [&_button]:[color:#8a8ea0] [@media(max-width:_1279px)]:[width:100%]">
            <Search size={18} aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a state or city" aria-label="Search a state or city" />
            {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search"><X size={16} /></button>}
          </label>
          <div className="stfd__tabs [display:flex] [flex-wrap:wrap] [gap:0.4rem] [padding:0.4rem] [border-radius:10rem] [background:#f6f3ff] [&_button]:[position:relative] [&_button]:[height:4rem] [&_button]:[padding:0_1.8rem] [&_button]:[border-radius:10rem] [&_button]:[font-size:1.5rem] [&_button]:[font-weight:500] [&_button]:[color:#6b6f7c] [&_button]:[transition:color_0.3s] [&_button_span]:[position:relative] [&_button_span]:[z-index:1] [@media(max-width:_1279px)]:[flex-wrap:nowrap] [@media(max-width:_1279px)]:[overflow-x:auto] [@media(max-width:_1279px)]:[scrollbar-width:none] [@media(max-width:_1279px)]:[border-radius:1.6rem] [@media(max-width:_1279px)]:[&_button]:[flex:none]" role="tablist" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button key={r} type="button" role="tab" aria-selected={region === r} className={region === r ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => setRegion(r)}>
                {region === r && <motion.i layoutId="stfd-tab" className="stfd__tab-hl [position:absolute] [inset:0] [border-radius:inherit] [background:var(--purple)]" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                <span>{r}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div className="stfd__map [max-width:112rem] [margin:5.6rem_auto_0] [padding:4rem] [border-radius:3.2rem] [background:linear-gradient(180deg,_#faf9ff,_#f4f1ff)] [border:1px_solid_#ece8fa] [@media(max-width:_1279px)]:[padding:2rem] [@media(max-width:_1279px)]:[border-radius:2.4rem] [@media(max-width:_767px)]:[margin-top:2.4rem] [@media(max-width:_767px)]:[padding:1.2rem]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <USMap active={hot} onActive={setHot} />
      </motion.div>

      <motion.ul className="stfd__grid [list-style:none] [padding:0] [margin:4rem_0_0] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:1.2rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[margin-top:2rem] [@media(max-width:_767px)]:[gap:0.8rem]" layout>
        <AnimatePresence initial={false}>
          {shown.slice(0, step ? (limit ?? step) : undefined).map((s) => (
            <motion.li key={s.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease: ease.out }}>
              <Link to={`/states/${s.slug}`} className={String.raw`stfd__card [display:flex] [align-items:center] [gap:1.4rem] [height:100%] [padding:1.6rem_1.8rem] [border-radius:1.8rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.35s_cubic-bezier(.22,1,.36,1),_box-shadow_0.35s_cubic-bezier(.22,1,.36,1),_transform_0.35s_cubic-bezier(.22,1,.36,1)] [&:hover]:[border-color:#cfc3ff] [&:hover]:[box-shadow:0_1.2rem_3rem_rgba(106,_65,_249,_0.12)] [&:hover]:[transform:translateY(-0.2rem)] [&.is-on]:[border-color:#cfc3ff] [&.is-on]:[box-shadow:0_1.2rem_3rem_rgba(106,_65,_249,_0.12)] [&.is-on]:[transform:translateY(-0.2rem)] [@media(max-width:_767px)]:[padding:1.2rem_1.4rem] ${hot === s.id ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`}
                onMouseEnter={() => setHot(s.id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(s.id)} onBlur={() => setHot(null)}>
                <span className="stfd__abbr [flex:none] [display:grid] [place-items:center] [width:4.4rem] [height:4.4rem] [border-radius:1.2rem] [background:#f3efff] [font-family:var(--f-mono)] [font-size:1.4rem] [font-weight:600] [color:var(--purple)] [transition:background_0.35s,_color_0.35s] [.stfd\_\_card:hover_&]:[background:var(--purple)] [.stfd\_\_card:hover_&]:[color:#fff] [.stfd\_\_card.is-on_&]:[background:var(--purple)] [.stfd\_\_card.is-on_&]:[color:#fff]">{s.abbr}</span>
                <span className="stfd__t [flex:1] [min-width:0] [display:flex] [flex-direction:column] [gap:0.3rem] [&_b]:[font-weight:500] [&_b]:[font-size:1.7rem] [&_b]:[color:var(--ink-2)] [&_small]:[font-size:1.3rem] [&_small]:[color:#8a8ea0] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [@media(max-width:_1279px)]:[&_b]:[font-size:16px]"><b>{s.name}</b><small>Medicare {s.chips[0][1]} · {s.chips[1][1]}</small></span>
                <ArrowRight className="stfd__go [flex:none] [color:#c4bbe6] [transition:color_0.3s,_transform_0.35s_cubic-bezier(.22,1,.36,1)] [.stfd\_\_card:hover_&]:[color:var(--purple)] [.stfd\_\_card:hover_&]:[transform:translateX(0.3rem)] [.stfd\_\_card.is-on_&]:[color:var(--purple)] [.stfd\_\_card.is-on_&]:[transform:translateX(0.3rem)]" size={16} />
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {step > 0 && shown.length > (limit ?? step) && (
        <div className="stfd__more [display:flex] [flex-direction:column] [align-items:center] [gap:1.2rem] [margin-top:2.4rem] [&_p]:[font-size:14px] [&_p]:[color:#8a8ea0] [&_div]:[display:flex] [&_div]:[gap:0.8rem]">
          <p>Showing {limit ?? step} of {shown.length} states</p>
          <div>
            <button type="button" className="stfd__more-btn [height:4.8rem] [padding:0_2.4rem] [border-radius:10rem] [font-size:15px] [font-weight:500] [transition:background_0.3s,_color_0.3s,_border-color_0.3s] [background:var(--purple)] [color:#fff] [&:hover]:[background:#5430e6]" onClick={() => setLimit((limit ?? step) + step)}>Show {Math.min(step, shown.length - (limit ?? step))} more</button>
            <button type="button" className="stfd__all-btn [height:4.8rem] [padding:0_2.4rem] [border-radius:10rem] [font-size:15px] [font-weight:500] [transition:background_0.3s,_color_0.3s,_border-color_0.3s] [border:1px_solid_#e4e0f2] [color:var(--ink-2)] [background:#fff] [&:hover]:[border-color:var(--purple)] [&:hover]:[color:var(--purple)]" onClick={() => setLimit(shown.length)}>Show all</button>
          </div>
        </div>
      )}
      {shown.length === 0 && <p className="stfd__empty [display:flex] [align-items:center] [gap:0.8rem] [margin-top:2.4rem] [font-size:1.6rem] [color:#6b6f7c]"><MapPin size={16} /> No state matches “{q}”. We bill in all 50, so <Link to="#assessment" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">tell us where you are <ArrowRight size={14} /></Link></p>}
    </section>
  );
}

/** SEO/AEO: states grouped by Medicare Administrative Contractor, every state linked. */
function ByContractor() {
  const groups = useMemo(() => {
    const m = new Map<string, typeof STATES>();
    STATES.forEach((s) => { const k = MAC_OF[s.slug]; if (!m.has(k)) m.set(k, []); m.get(k)!.push(s); });
    return [...m.entries()].sort((a, b) => MACS[a[0]].name.localeCompare(MACS[b[0]].name) || a[0].localeCompare(b[0]));
  }, []);
  return (
    <section className="stmac container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem]" aria-labelledby="stmac-t">
      <div className="stmac__intro [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [column-gap:8rem] [row-gap:2rem] [align-items:start] [&_h2]:[margin:0] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
        <Eyebrow>/ By Medicare contractor</Eyebrow>
        <h2 id="stmac-t" className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]">Who processes Medicare claims in your state?</h2>
        <Reveal as="p" className="stmac__p [margin:0] [padding-top:0.6rem] [font-size:1.8rem] [line-height:1.7] [color:#4a4f63] [@media(max-width:_1279px)]:[font-size:16px]">
          Medicare Part B claims are processed by a Medicare Administrative Contractor (MAC) assigned to each state. Each MAC publishes its own local coverage determinations, edits and portal, so the same claim can pass in one state and deny in another. These are the jurisdictions we work, and the states in each.
        </Reveal>
      </div>
      <div className="stmac__grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1.2rem] [margin-top:4.8rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
        {groups.map(([k, list]) => (
          <div key={k} className="stmac__card [padding:2.4rem_2.6rem] [border-radius:2rem] [background:#fff] [border:1px_solid_#ece8fa] [&_h3]:[margin:0.8rem_0_1.2rem] [&_h3]:[font-family:var(--f-jak)] [&_h3]:[font-weight:500] [&_h3]:[font-size:2rem] [&_h3]:[line-height:1.3] [&_h3]:[color:var(--ink-2)]">
            <p className="stmac__j [font-family:var(--f-mono)] [font-size:1.2rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:var(--purple)]">Jurisdiction {MACS[k].j.replace(/^J/, '')}</p>
            <h3>{MACS[k].name}</h3>
            <p className="stmac__states [font-size:1.6rem] [line-height:1.7] [color:#4a4f63] [&_a]:[color:var(--purple)] [&_a]:[text-decoration:underline] [&_a]:[text-decoration-color:rgba(106,_65,_249,_0.3)]! [&_a]:[text-underline-offset:0.2em] [&_a:hover]:[text-decoration-color:currentColor]! [@media(max-width:_1279px)]:[font-size:16px]">{list.map((s, i) => <span key={s.slug}>{i > 0 && ', '}<Link to={`/states/${s.slug}`}>{s.name}</Link></span>)}</p>
          </div>
        ))}
      </div>
      <p className="stmac__src [margin-top:2rem] [font-size:1.4rem] [color:#8a8ea0] [&_a]:[color:inherit] [&_a]:[text-decoration:underline]">Source: <a href="https://www.cms.gov/files/document/macs-state-pdf" target="_blank" rel="noopener noreferrer">CMS, Medicare Administrative Contractors by state</a>.</p>
    </section>
  );
}

const FAQS = [
  ['Do you really bill in all 50 states?', 'Yes. Billing and coding run inside your EHR and payer portals, so we can work any state. What changes by state is the payer rulebook: the Medicare contractor, the Medicaid program and the prompt-pay law, and each state page covers those.'],
  ['Why does the state matter for medical billing?', 'Medicare Part B claims go to a regional contractor with its own coverage rules, Medicaid is run by each state with its own plans and authorization lists, and commercial payment deadlines are set by state law. Billing that ignores those differences gets more denials and slower payments.'],
  ['Do you work in my time zone?', 'Yes. Your account is handled on your local time, from Eastern to Hawaii time, so questions get answered the same business day.'],
  ['Where is Affinity Core based?', 'Our office is in Plano, Texas. Our billers and coders are US-based and work remotely inside your systems wherever your practice is.'],
  ['Can you bill for a group with locations in several states?', 'Yes. Each location’s claims go out under the rules of its own state and Medicare jurisdiction, and you get one report across all of them.'],
];

export function StatesHub() {
  useEffect(() => {
    document.title = 'Medical Billing Services in All 50 States · Affinity Core';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Medical billing and revenue cycle management in all 50 states. Find your state’s Medicare contractor, Medicaid program and prompt-pay rules, and get a free revenue review.');
  }, []);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <Hero />
      <Finder />
      <ByContractor />
      <Assessment source="states-hub" />
      <FAQ items={FAQS} eyebrow="/ State billing FAQs" lines={['What practices ask', 'about billing by state.']} />
      <CTA eyebrow="/ Free revenue review" lines={['Your state’s rules,', 'your numbers.']} />
    </main>
  );
}
