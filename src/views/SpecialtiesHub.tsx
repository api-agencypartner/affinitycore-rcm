'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { ArrowRight, BookOpen, Check, CheckCircle2, X, Search } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords, CountUp } from '../components/ui';
import { CTA, FAQ } from '../sections/Closing';
import { Assessment } from '../sections/Assessment';
import { Proof } from './ServicesHub';
import { Link } from '../router';
import { SPECIALTIES, GROUPS, RULES, SPOT, ERROR_TYPES, getSpecialtyLite, matches, type RuleId, type SpecialtyLite } from '../data/specialties';
import { ease } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';

const CONFIRM = '[Confirm with Affinity Core]';
const ruleShort = (id: RuleId) => RULES.find((r) => r.id === id)!.short;

/** "?focus=slug" on the hash (from nav / footer links) */
const readFocus = () => (typeof window === 'undefined' ? null : new URLSearchParams(window.location.search).get('focus'));

/* ================= 1. Hero: the rulebook deck ================= */
const DECK = ['cardiology', 'mental-health', 'anesthesia', 'orthopedics', 'gastroenterology', 'radiology', 'oncology'].map((s) => getSpecialtyLite(s)!);

function RuleCard({ s }: { s: SpecialtyLite }) {
  const Icon = s.icon;
  const [code, label] = s.codes[0];
  return (
    <>
      <div className="rb__top [display:flex] [align-items:center] [gap:1.6rem]">
        <span className="rb__icon [width:5.2rem] [height:5.2rem] [flex:0_0_5.2rem] [border-radius:1.6rem] [display:grid] [place-items:center] [background:#f1edff] [color:var(--purple)] [&_svg]:[width:2.6rem] [&_svg]:[height:2.6rem] [&_svg]:[stroke-width:1.6]"><Icon /></span>
        <span className="rb__name [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2.8rem] [&_b]:[letter-spacing:-0.04rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.25rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0]"><b>{s.name}</b><small>{s.group}</small></span>
      </div>
      <div className="rb__code [display:flex] [align-items:baseline] [gap:1.6rem] [padding:2rem_0] [border-top:1px_dashed_#e2def0] [border-bottom:1px_dashed_#e2def0] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:4.8rem] [&_code]:[line-height:1] [&_code]:[letter-spacing:-0.1rem] [&_code]:[color:var(--purple)] [&_span]:[font-size:1.6rem] [&_span]:[color:#5b5f72] [@media(max-width:_1279px)]:[&_code]:[font-size:3.6rem]"><code>{code}</code><span>{label}</span></div>
      <div className="rb__watch [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.08em] [&_small]:[color:var(--purple)] [&_p]:[margin-top:0.8rem] [&_p]:[font-size:2rem] [&_p]:[line-height:1.45] [&_p]:[letter-spacing:-0.02rem] [@media(max-width:_1279px)]:[&_p]:[font-size:1.8rem]"><small>Watch for</small><p>{s.watch}</p></div>
      <ul className="rb__rules [display:flex] [flex-wrap:wrap] [gap:0.8rem] [&_li]:[padding:0.6rem_1.2rem] [&_li]:[border-radius:3rem] [&_li]:[background:#f6f3ff] [&_li]:[border:1px_solid_var(--lav-border)] [&_li]:[font-size:1.35rem] [&_li]:[color:#4a4f63]">{(Object.keys(s.rules) as RuleId[]).map((r) => <li key={r}>{ruleShort(r)}</li>)}</ul>
    </>
  );
}

function Rulebook() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % DECK.length), 3200);
    return () => clearInterval(id);
  }, [paused]);
  const s = DECK[i];
  return (
    <div className="rb [position:relative] [height:min(68rem,_calc(100svh_-_20rem))] [min-height:58rem] [border-radius:4rem] [overflow:hidden] [isolation:isolate] [border:1px_solid_rgba(106,_65,_249,_0.14)] [box-shadow:0_4rem_10rem_-4rem_rgba(80,_40,_220,_0.25)] [display:flex] [flex-direction:column] [justify-content:center] [align-items:center] [padding:6rem_4rem_4rem] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background:rgba(255,_255,_255,_0.62)] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[padding:9rem_2rem_6rem] [@media(max-width:_1279px)]:[border-radius:2.8rem]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="rb__bg [position:absolute] [inset:0] [z-index:-2] [overflow:hidden] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[max-width:none] [&_img]:[object-fit:cover] [&_img]:[object-position:30%_50%] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate] [@media(prefers-reduced-motion:_reduce)]:[&_img]:[animation:none]" aria-hidden><img src={fluted} alt="" /></div>
      <div className="rb__count [position:absolute] [left:4rem] [top:3.6rem] [display:flex] [align-items:baseline] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a83a8] [@media(max-width:_1279px)]:[left:2.4rem] [@media(max-width:_1279px)]:[top:2.4rem]" aria-hidden>
        <span className="rb__count-n [position:relative] [display:inline-block] [height:4.4rem] [overflow:hidden] [&_b]:[display:block] [&_b]:[font-family:var(--f-sans)] [&_b]:[font-weight:500] [&_b]:[font-size:4.4rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.1rem] [&_b]:[color:var(--purple)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.b key={i} initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.6, ease: ease.out }}>0{i + 1}</motion.b>
          </AnimatePresence>
        </span>
        <span>/ 0{DECK.length} rulebooks</span>
      </div>
      <div className="rb__stack [position:relative] [width:min(52rem,_100%)]">
        <span className="rb__ghost rb__ghost--2 [position:absolute] [left:50%] [height:4rem] [border-radius:2.8rem_2.8rem_0_0] [border:1px_solid_rgba(255,_255,_255,_0.9)] [translate:-50%_0] [width:84%] [top:-3rem] [background:rgba(255,_255,_255,_0.35)]" aria-hidden />
        <span className="rb__ghost rb__ghost--1 [position:absolute] [left:50%] [height:4rem] [border-radius:2.8rem_2.8rem_0_0] [background:rgba(255,_255,_255,_0.55)] [border:1px_solid_rgba(255,_255,_255,_0.9)] [translate:-50%_0] [width:92%] [top:-1.6rem]" aria-hidden />
        <div className="rb__card [position:relative] [min-height:43rem] [padding:3.6rem] [border-radius:2.8rem] [background:rgba(255,_255,_255,_0.92)] [border:1px_solid_#fff] [box-shadow:0_3rem_8rem_rgba(57,_28,_160,_0.16),_0_0.4rem_1.2rem_rgba(57,_28,_160,_0.06)] [color:var(--ink-2)] [@media(max-width:_1279px)]:[min-height:46rem] [@media(max-width:_1279px)]:[padding:2.8rem_2.4rem]" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.slug} className="rb__in [display:flex] [flex-direction:column] [gap:2.4rem]"
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } }} exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}>
              <RuleCard s={s} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="rb__dots [position:absolute] [left:4rem] [right:4rem] [bottom:3.2rem] [display:grid] [grid-template-columns:repeat(7,_1fr)] [gap:0.8rem] [&_button]:[position:relative] [&_button]:[height:0.4rem] [&_button]:[border-radius:1rem] [&_button]:[background:rgba(106,_65,_249,_0.16)] [&_button]:[overflow:hidden] [&_button]:[padding:0] [&_button::after]:[content:''] [&_button::after]:[position:absolute] [&_button::after]:[inset:-1.2rem_0] [&_i]:[position:absolute] [&_i]:[inset:0] [&_i]:[transform-origin:left] [&_button:focus-visible]:[outline:2px_solid_var(--purple)] [&_button:focus-visible]:[outline-offset:4px]! [@media(max-width:_1279px)]:[left:2.4rem] [@media(max-width:_1279px)]:[right:2.4rem] [@media(max-width:_1279px)]:[bottom:2.4rem] [&_i]:[background:var(--grad-x)]" role="tablist" aria-label="Specialty examples">
        {DECK.map((d, k) => (
          <button key={d.slug} role="tab" aria-selected={k === i} aria-label={d.name} className={k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => setI(k)}>
            {k === i && !paused && <motion.i key={i} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.2, ease: 'linear' }} />}
            {k === i && paused && <i style={{ transform: 'scaleX(1)' }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="xh [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1.05fr)] [gap:6rem] [align-items:center] [padding:14rem_var(--gutter)_6rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[gap:4rem]">
      <div className="xh__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
        <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Specialty billing</motion.p>
        <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={['Every specialty', 'bills by its own', 'rulebook.']} bold={['rulebook.']} />
        <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
          Time units in anesthesia. Split components in cardiology. Global periods in orthopedics. Your claims are coded by people who know your specialty’s rules, so they go out right the first time.
        </motion.p>
        <motion.div className="sh-hero__cta [display:flex] [align-items:center] [gap:3.2rem] [flex-wrap:wrap]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
          <Button>Get a free revenue assessment</Button>
          <Link to="#index" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">Find your specialty <ArrowRight size={18} /></Link>
        </motion.div>
      </div>
      <motion.div className="xh__stage [position:relative] [.csh_&]:[align-self:center]" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: ease.out, delay: 0.4 }}>
        <Rulebook />
      </motion.div>
    </section>
  );
}

/* ================= 2. Index with rule lenses ================= */
function SpecialtySearch({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const show = open || !!q;
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  return (
    <motion.div className={String.raw`xs [position:relative] [flex:none] [display:flex] [align-items:center] [height:4.8rem] [width:4.8rem] [border-radius:3rem] [background:#fff] [border:1px_solid_#e2dbf8] [overflow:hidden] [transition:border-color_0.3s,_box-shadow_0.3s] [&.is-open]:[width:34rem] [&.is-open]:[border-color:var(--purple)] [&.is-open]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.1)] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[border-color:#e2dbf8] [@media(max-width:_1279px)]:[box-shadow:none] [@media(max-width:_1279px)]:[&.is-open]:[width:100%] [@media(max-width:_1279px)]:[&.is-open]:[border-color:#e2dbf8] [@media(max-width:_1279px)]:[&.is-open]:[box-shadow:none] [@media(min-width:_1280px)]:[&.is-open]:[width:auto] [@media(min-width:_1280px)]:[&.is-open]:[flex:1_1_0] [@media(min-width:_1280px)]:[&.is-open]:[min-width:20rem] [@media(min-width:_1280px)]:[&.is-open]:[max-width:34rem] [@media(min-width:_1280px)]:[&.is-open]:[margin-left:auto] ${show ? 'is-open' : ''}`} layout transition={{ type: 'spring', stiffness: 320, damping: 32 }}>
      <button type="button" className="xs__btn [flex:none] [width:4.6rem] [height:4.6rem] [display:grid] [place-items:center] [color:var(--purple)] [.xs:not(.is-open)_&:hover]:[background:#f4f0ff]" aria-label={show ? 'Search specialties' : 'Open specialty search'} onClick={() => (show ? input.current?.focus() : setOpen(true))}>
        <Search size={18} />
      </button>
      <input ref={input} className="xs__input [flex:1] [min-width:0] [height:100%] [border:0] [outline:0] [background:none] [font-family:inherit] [font-weight:inherit] [font-style:inherit] [line-height:inherit] [font-size:1.6rem] [color:var(--ink-2)] [padding-right:1.6rem] [opacity:0] [transition:opacity_0.2s] [.xs.is-open_&]:[opacity:1] [&::placeholder]:[color:#a29cbc] [&::-webkit-search-cancel-button]:[display:none] [@media(max-width:_1279px)]:[opacity:1]" type="search" value={q} placeholder="Specialty or CPT code"
        aria-label="Search specialties" tabIndex={show ? 0 : -1}
        onChange={(e) => setQ(e.target.value)} onBlur={() => { if (!q) setOpen(false); }}
        onKeyDown={(e) => { if (e.key === 'Escape') { setQ(''); setOpen(false); (e.target as HTMLInputElement).blur(); } }} />
      {q && <button type="button" className="xs__clear [flex:none] [width:3.2rem] [height:3.2rem] [margin-right:0.8rem] [border-radius:50%] [display:grid] [place-items:center] [color:#6b6f7c] [background:#f4f0ff]" aria-label="Clear search" onClick={() => { setQ(''); input.current?.focus(); }}><X size={16} /></button>}
    </motion.div>
  );
}

function Tile({ s, lens, focus }: { s: SpecialtyLite; lens: RuleId | null; focus: boolean }) {
  const Icon = s.icon;
  const hit = lens ? !!s.rules[lens] : true;
  const [hover, setHover] = useState(false);
  const mode = lens ? (hit ? 'rule' : 'miss') : hover ? 'watch' : 'codes';
  const body = (
    <>
      <span className="xt__top [display:flex] [justify-content:space-between] [align-items:flex-start]">
        <span className="xt__icon [flex:0_0_5.2rem] [display:grid] [place-items:center] [background:#f1edff] [color:var(--purple)] [&_svg]:[stroke-width:1.6] [width:4.4rem] [height:4.4rem] [flex-basis:4.4rem]! [border-radius:1.2rem] [transition:background_0.4s,_color_0.4s] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [.xt.is-hit_&]:[color:#fff] [@media(max-width:_767px)]:[width:3.6rem] [@media(max-width:_767px)]:[height:3.6rem] [@media(max-width:_767px)]:[flex-basis:3.6rem]! [.xt.is-hit_&]:[background:var(--grad)] [.xt.is-hit_&]:[border-color:transparent]"><Icon /></span>
        {s.page && <span className="xt__go [width:3.6rem] [height:3.6rem] [border-radius:50%] [display:grid] [place-items:center] [color:#fff] [transition:transform_0.5s_cubic-bezier(.16,1,.3,1)] [.xt:hover_&]:[transform:rotate(-45deg)] [.xt_&]:[display:none] [@media(max-width:_1279px)]:[.xt_&]:[display:grid] [@media(max-width:_1279px)]:[.xt_&]:[width:auto] [@media(max-width:_1279px)]:[.xt_&]:[height:auto] [@media(max-width:_1279px)]:[.xt_&]:[border-radius:0] [@media(max-width:_1279px)]:[.xt_&]:[background:none] [@media(max-width:_1279px)]:[.xt_&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.xt_&]:[transform:none] [@media(max-width:_1279px)]:[.xt_&_svg]:[width:2rem] [@media(max-width:_1279px)]:[.xt_&_svg]:[height:2rem] [@media(max-width:_767px)]:[width:2.8rem] [@media(max-width:_767px)]:[height:2.8rem] [background:var(--grad)] [border-color:transparent]"><ArrowRight size={16} /></span>}
      </span>
      <b className="xt__name [font-weight:500] [font-size:2.2rem] [line-height:1.15] [letter-spacing:-0.03rem] [@media(max-width:_1279px)]:[font-size:1.9rem] [@media(max-width:_767px)]:[font-size:1.6rem] [@media(max-width:_767px)]:[line-height:1.3]">{s.name}</b>
      <span className="xt__body [margin-top:auto] [min-height:6.2rem] [display:flex] [align-items:flex-end] [overflow:hidden] [@media(max-width:_767px)]:[display:none]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={mode + (lens ?? '')} className={String.raw`xt__swap [display:flex] [flex-wrap:wrap] [gap:0.6rem] [font-size:1.45rem] [line-height:1.4] [color:#5b5f72] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.3rem] [&_code]:[color:var(--purple)] [&_code]:[background:#fff] [&_code]:[border:1px_solid_var(--lav-border)] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.7rem] [.xt:hover_&_code]:[background:#f6f3ff] [.xt.is-hit_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:1.3rem] xt__swap--${mode}`}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.28, ease: ease.out }}>
            {mode === 'codes' && s.codes.map(([c, l]) => <code key={c} title={l}>{c}</code>)}
            {mode === 'watch' && s.watch}
            {mode === 'rule' && lens && s.rules[lens]}
            {mode === 'miss' && 'Not a usual issue'}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
  const cls = String.raw`xt [position:relative] [flex:1] [min-width:0] [min-height:19rem] [display:flex] [flex-direction:column] [gap:1.2rem] [padding:2.4rem] [border-radius:2.4rem] [background:var(--panel)] [border:1px_solid_#efebfb] [color:var(--ink-2)] [outline:none] [transition:background_0.4s,_border-color_0.4s,_opacity_0.4s,_box-shadow_0.5s,_transform_0.5s_cubic-bezier(.16,1,.3,1)] [&:hover]:[background:#fff] [&:hover]:[border-color:#d9d1fb] [&:hover]:[box-shadow:0_2rem_5rem_rgba(106,_65,_249,_0.1)] [&:focus-visible]:[background:#fff] [&:focus-visible]:[border-color:#d9d1fb] [&:focus-visible]:[box-shadow:0_2rem_5rem_rgba(106,_65,_249,_0.1)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [&.has-page:hover]:[transform:translateY(-0.4rem)] [&.is-hit]:[background:#fff] [&.is-hit]:[border-color:var(--purple)] [&.is-hit]:[box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.12)] [&.is-miss]:[opacity:0.42] [&.is-miss:hover]:[opacity:0.8] [&.is-focus]:[border-color:var(--purple)] [&.is-focus]:[animation:xt-pulse_1.4s_ease-out_2_0.9s] [@media(max-width:_1279px)]:[min-height:20rem] [@media(max-width:_1279px)]:[padding:1.8rem] [@media(max-width:_1279px)]:[border-radius:2rem] [@media(prefers-reduced-motion:_reduce)]:[&.is-focus]:[animation:none] [@media(max-width:_767px)]:[min-height:0] [@media(max-width:_767px)]:[padding:1.6rem] [@media(max-width:_767px)]:[gap:1rem] [@media(max-width:_767px)]:[border-radius:1.8rem] ${lens ? (hit ? 'is-hit' : 'is-miss') : ''} ${focus ? 'is-focus' : ''} ${s.page ? 'has-page' : ''}`;
  const props = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onFocus: () => setHover(true), onBlur: () => setHover(false) };
  return (
    <motion.li layout="position" id={`sp-${s.slug}`} className="xt__li [min-width:0] [display:flex]"
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } } }}>
      {s.page
        ? <Link to={`/specialties/${s.slug}`} className={cls} aria-label={`${s.name} billing`} {...props}>{body}</Link>
        : <div className={cls} tabIndex={0} {...props}>{body}</div>}
    </motion.li>
  );
}

function Index() {
  const [lens, setLens] = useState<RuleId | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const shown = SPECIALTIES.filter((s) => matches(s, q));
  const hits = lens ? shown.filter((s) => s.rules[lens]).length : shown.length;
  const rule = RULES.find((r) => r.id === lens);

  // Focus a specialty from "?focus=" links (on load and when the hash changes on this page)
  useEffect(() => {
    const on = () => setFocus(readFocus());
    on();
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);
  useEffect(() => {
    if (!focus) return;
    const t = setTimeout(() => document.getElementById(`sp-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 1100);
    const u = setTimeout(() => setFocus(null), 5200);
    return () => { clearTimeout(t); clearTimeout(u); };
  }, [focus]);

  return (
    <section className="xi container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:10rem]" id="index">
      <div className="xi__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:4rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
        <div className="xi__title [display:flex] [flex-direction:column] [gap:1.2rem]">
          <Eyebrow>/ Find your specialty</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Pick your specialty.', 'See which rules hit it.']} stagger={0.04} />
        </div>
        <div className="xi__count [display:flex] [flex-direction:column] [align-items:flex-end] [gap:0.6rem] [max-width:40rem] [text-align:right] [&_b]:[font-weight:500] [&_b]:[font-size:8.8rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.3rem] [&_b]:[color:var(--purple)] [&_b]:[font-variant-numeric:tabular-nums] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0] [@media(max-width:_1279px)]:[align-items:flex-start] [@media(max-width:_1279px)]:[text-align:left] [@media(max-width:_1279px)]:[&_b]:[font-size:6.4rem]" aria-live="polite">
          <b><CountUp value={hits} duration={0.6} /></b>
          <small>{q ? (shown.length === 1 ? 'specialty matches' : 'specialties match') : lens ? `of ${SPECIALTIES.length} specialties hit by this rule` : 'specialties we bill for'}</small>
        </div>
      </div>

      <div className="xi__bar [display:flex] [align-items:center] [justify-content:space-between] [gap:2.4rem] [margin-top:4.8rem] [@media(max-width:_1279px)]:[flex-direction:column-reverse] [@media(max-width:_1279px)]:[align-items:stretch] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_1279px)]:[margin-top:3.2rem]">
      <LayoutGroup>
        <div className="need__chips xi__chips [display:flex] [flex-wrap:wrap] [gap:1.2rem] [margin-top:4.8rem] [@media(max-width:_1279px)]:[flex-wrap:nowrap] [@media(max-width:_1279px)]:[overflow-x:auto] [@media(max-width:_1279px)]:[margin-inline:calc(var(--gutter)_*_-1)] [@media(max-width:_1279px)]:[padding:0.4rem_var(--gutter)] [@media(max-width:_1279px)]:[scrollbar-width:none] [.xi\_\_bar_&]:[margin-top:0] [.xi\_\_bar_&]:[min-width:0] [@media(min-width:_1280px)]:[.xi\_\_bar_&]:[flex:none] [@media(min-width:_1280px)]:[.xi\_\_bar_&]:[flex-wrap:nowrap]" role="tablist" aria-label="Billing rule lens">
          {[null, ...RULES.map((r) => r.id)].map((id) => {
            const on = lens === id;
            return (
              <button key={id ?? 'all'} role="tab" aria-selected={on} className={String.raw`need__chip [position:relative] [padding:1.4rem_2.4rem] [border-radius:6rem] [border:1px_solid_#e3def5] [font-size:1.8rem] [color:var(--ink-2)] [isolation:isolate] [transition:color_0.35s_0.08s,_border-color_0.35s] [&>span:not(.need\_\_pill)]:[position:relative] [&>span:not(.need\_\_pill)]:[z-index:1] [&.is-on]:[color:#fff] [&.is-on]:[border-color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[flex:0_0_auto] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[white-space:nowrap] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[font-size:1.6rem] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[padding:1.2rem_2rem] ${on ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => setLens(id)}>
                {on && <motion.span layoutId="xi-pill" className="need__pill [position:absolute] [inset:-1px] [border-radius:6rem] [z-index:0] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }} />}
                <span>{id ? RULES.find((r) => r.id === id)!.chip : 'All specialties'}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <SpecialtySearch q={q} setQ={setQ} />
      </div>
      <div className="xi__why [min-height:3.4rem] [margin-top:2.8rem] [font-size:2.2rem] [line-height:1.4] [color:var(--ink-2)] [max-width:90rem] [&_b]:[font-weight:500] [&_b]:[color:var(--purple)] [@media(max-width:_1279px)]:[font-size:1.8rem] [@media(max-width:_1279px)]:[min-height:7.6rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={lens ?? 'all'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
            {rule ? <><b>{rule.label}.</b> {rule.why}</> : 'Hover a specialty for the one thing that trips its claims most often. Pick a rule above to see who it hits.'}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="xi__groups [margin-top:4.8rem] [display:flex] [flex-direction:column]">
        {GROUPS.filter((g) => shown.some((s) => s.group === g)).map((g) => (
          <div key={g} className="xi__group [display:grid] [grid-template-columns:26rem_minmax(0,_1fr)] [gap:2.4rem] [padding:2.4rem_0] [border-top:1px_solid_#ece8f7] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_767px)]:[padding:2rem_0] [@media(max-width:_767px)]:[gap:1.4rem]">
            <p className="xi__glabel [padding-top:1.6rem] [padding-right:2rem] [line-height:1.5] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:var(--ink-2)] [&_span]:[margin-left:0.6rem] [&_span]:[color:#a29cbc] [@media(max-width:_1279px)]:[padding-top:0.4rem]">{g} <span>{shown.filter((s) => s.group === g).length}</span></p>
            <motion.ul className="xi__grid [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:1.6rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_1279px)]:[gap:1.2rem] [@media(max-width:_767px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_767px)]:[gap:1rem]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
              {shown.filter((s) => s.group === g).map((s) => <Tile key={s.slug} s={s} lens={lens} focus={focus === s.slug} />)}
            </motion.ul>
          </div>
        ))}
        {q && !shown.length && (
          <div className="xi__empty [display:flex] [align-items:center] [justify-content:space-between] [gap:2.4rem] [padding:4rem_0] [border-top:1px_solid_#ece8f7] [font-size:2rem] [color:#4a4f63] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
            <p><b>No match for “{q}”.</b> We bill for more specialties than we list here.</p>
            <Link to="#assessment" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">Ask us about yours <ArrowRight size={18} /></Link>
          </div>
        )}
      </div>
      <Reveal className="xi__foot [display:flex] [align-items:center] [justify-content:space-between] [gap:2.4rem] [margin-top:2.4rem] [padding-top:3.2rem] [border-top:1px_solid_#ece8f7] [font-size:2rem] [color:var(--ink-2)] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
        <p>Don’t see yours? We likely bill for it.</p>
        <Link to="#assessment" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">Ask us on a free call <ArrowRight size={18} /></Link>
      </Reveal>
    </section>
  );
}

/* ================= 3. Spot the error ================= */
function SpotTheError() {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [score, setScore] = useState<boolean[]>([]);
  const c = SPOT[i];
  const done = pick !== null;
  const right = pick === c.answer;
  const choose = (k: number) => { if (done) return; setPick(k); setScore((s) => { const n = [...s]; n[i] = k === c.answer; return n; }); };
  const next = () => { setPick(null); setI((v) => (v + 1) % SPOT.length); };
  const spotted = score.filter(Boolean).length;
  return (
    <section className="se container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
      <motion.div className="se__panel [position:relative] [padding:6.4rem] [border-radius:4rem] [overflow:hidden] [isolation:isolate] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[inset:auto_-10%_-50%_30%] [&::after]:[height:80%] [&::after]:[z-index:-1] [&::after]:[pointer-events:none] [@media(max-width:_1279px)]:[padding:4rem_2.4rem] [@media(max-width:_1279px)]:[border-radius:2.8rem] [background:linear-gradient(165deg,_#f4f0ff_0%,_#fbfaff_55%,_#fff_100%)] [color:var(--ink-2)] [border:1px_solid_var(--lav-border)] [box-shadow:0_3rem_8rem_-3rem_rgba(80,_40,_220,_0.18)] [&::after]:[background:radial-gradient(closest-side,_rgba(138,_107,_255,_0.14),_transparent)]" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease: ease.out }}>
        <div className="se__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:4rem] [&>div:first-child]:[display:flex] [&>div:first-child]:[flex-direction:column] [&>div:first-child]:[gap:1.2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start] [@media(max-width:_1279px)]:[gap:2.4rem]">
          <div>
            <Eyebrow className="eyebrow--light [color:#fff]! [.process\_\_panel_&]:[color:var(--purple)]! [.stp-sv\_\_head_&]:[color:rgba(255,_255,_255,_0.82)]! [.se\_\_panel_&]:[color:var(--ink)]!">/ Try it yourself</Eyebrow>
            <SplitWords className="h-56 se__title [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem] [color:var(--ink-2)]" lines={['Spot the error', 'before the payer does.']} stagger={0.04} />
          </div>
          <div className="se__score [display:flex] [flex-direction:column] [align-items:flex-end] [gap:0.6rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_b]:[font-weight:500] [&_b]:[font-size:7.2rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.2rem] [&_b]:[font-variant-numeric:tabular-nums] [&_b_span]:[font-size:3.2rem] [&_b_span]:[letter-spacing:0] [@media(max-width:_1279px)]:[align-items:flex-start] [&_small]:[color:#8a8ea0] [&_b]:[color:var(--purple)] [&_b_span]:[color:#b6b1c9]">
            <small>Spotted</small>
            <b>{spotted}<span> / {SPOT.length}</span></b>
          </div>
        </div>

        <div className="se__main [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [margin-top:5.6rem] [align-items:start] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:3.2rem] [@media(max-width:_1279px)]:[margin-top:3.2rem]">
          <div className="se__slip-wrap [min-height:34rem] [@media(max-width:_1279px)]:[min-height:0]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} className="se__slip [position:relative] [padding:3.6rem] [border-radius:2rem] [background:#fff] [color:#23243a] [font-family:var(--f-man)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0.8rem] [&::before]:[border-radius:1.4rem] [&::before]:[border:1px_dashed_#ece8f7] [&::before]:[pointer-events:none] [@media(max-width:_1279px)]:[padding:2.8rem_2.4rem] [box-shadow:0_2.4rem_6rem_rgba(57,_28,_160,_0.14)] [border:1px_solid_#ece8fa]" initial={{ opacity: 0, x: 40, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: -1 }} exit={{ opacity: 0, x: -30, rotate: -3 }} transition={{ duration: 0.55, ease: ease.out }}>
                <div className="se__slip-top [display:flex] [justify-content:space-between] [font-family:var(--f-mono)] [font-size:1.2rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:#8a8ea0]"><span>Claim line · {c.specialty}</span><span>0{i + 1} / 0{SPOT.length}</span></div>
                <div className="se__line [display:flex] [flex-direction:column] [gap:0.6rem] [margin-top:2.4rem] [padding-bottom:2.4rem] [border-bottom:2px_solid_#23243a] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:4.4rem] [&_code]:[line-height:1] [&_code]:[color:var(--purple)] [&_code]:[align-self:flex-start] [&_code]:[position:relative] [&_code::after]:[content:''] [&_code::after]:[position:absolute] [&_code::after]:[left:-0.4rem] [&_code::after]:[right:-0.4rem] [&_code::after]:[top:50%] [&_code::after]:[height:0.3rem] [&_code::after]:[background:#6a41f9] [&_code::after]:[transform:scaleX(0)] [&_code::after]:[transform-origin:left] [&_code::after]:[transition:transform_0.5s_cubic-bezier(.16,1,.3,1)] [&_span]:[font-size:1.7rem] [&_span]:[color:#4a4f63] [@media(max-width:_1279px)]:[&_code]:[font-size:3.2rem]">
                  <code className={done ? String.raw`is-struck [.se\_\_line_code&]:[color:#b6b1c9] [.se\_\_line_code&::after]:[transform:scaleX(1)]` : ''}>{c.code}</code>
                  <span>{c.desc}</span>
                </div>
                <div className="se__note [margin-top:2rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.15rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0] [&_p]:[margin-top:0.6rem] [&_p]:[font-family:'Caveat',_'Segoe_Script',_cursive] [&_p]:[font-size:2.8rem] [&_p]:[line-height:1.2] [&_p]:[color:var(--purple)]"><small>From the note</small><p>{c.note}</p></div>
                <AnimatePresence>
                  {done && (
                    <motion.div className="se__fix [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.15rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0] [overflow:hidden] [&_small]:[display:block] [&_small]:[margin-top:2rem] [&_b]:[display:inline-block] [&_b]:[margin-top:0.6rem] [&_b]:[padding:0.8rem_1.4rem] [&_b]:[border-radius:1rem] [&_b]:[background:#f1edff] [&_b]:[color:var(--purple)] [&_b]:[font-weight:700] [&_b]:[font-size:2rem]" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.5, ease: ease.out }}>
                      <small>Corrected</small><b>{c.fix}</b>
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {done && (
                    <motion.span className="se__stamp [position:absolute] [right:3.2rem] [top:7rem] [padding:0.8rem_1.8rem] [border:0.4rem_solid_var(--purple)] [border-radius:1rem] [font-family:var(--f-mono)] [font-weight:700] [font-size:2.4rem] [letter-spacing:0.2em] [color:var(--purple)] [mix-blend-mode:multiply] [@media(max-width:_1279px)]:[top:5.6rem] [@media(max-width:_1279px)]:[right:1.6rem] [@media(max-width:_1279px)]:[font-size:1.8rem] [@media(max-width:_1279px)]:[padding:0.6rem_1.2rem]" initial={{ scale: 2.2, opacity: 0, rotate: -24 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ type: 'spring', stiffness: 420, damping: 18 }}>
                      {right ? 'CAUGHT' : 'FIXED'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="se__ask [display:flex] [flex-direction:column] [gap:2rem]">
            <p className="se__q [font-weight:500] [font-size:3.2rem] [letter-spacing:-0.06rem] [@media(max-width:_1279px)]:[font-size:2.6rem] [color:var(--ink-2)]">What’s wrong with this line?</p>
            <div className="se__opts [display:flex] [flex-direction:column] [gap:1.2rem]">
              {ERROR_TYPES.map((t, k) => {
                const isAns = done && k === c.answer;
                const isWrong = done && k === pick && !right;
                return (
                  <button key={t} className={String.raw`se__opt [display:flex] [align-items:center] [gap:1.6rem] [padding:1.8rem_2.2rem] [border-radius:1.8rem] [border:1px_solid_rgba(255,_255,_255,_0.16)] [font-size:1.9rem] [text-align:left] [transition:background_0.3s,_border-color_0.3s,_opacity_0.3s] [&>span:nth-child(2)]:[flex:1] [&:focus-visible]:[outline:2px_solid_#c4b5ff] [&:focus-visible]:[outline-offset:3px]! [&.is-wrong]:[text-decoration:line-through] [&.is-dim]:[opacity:0.35] [&.is-dim]:[cursor:default] [background:#fff] [border-color:#e3def5]! [color:var(--ink-2)] [&:hover:not(:disabled)]:[background:#fff] [&:hover:not(:disabled)]:[border-color:var(--purple)]! [&:hover:not(:disabled)]:[box-shadow:0_1.2rem_3rem_rgba(106,_65,_249,_0.1)] [&:focus-visible]:[outline-color:var(--purple)]! [&.is-ans]:[color:#fff] [&.is-ans_svg]:[color:#fff] [&.is-wrong]:[color:#8a8ea0] [&.is-wrong]:[border-color:#d9d1fb]! [&.is-wrong]:[text-decoration-color:#b7a3ff]! [&.is-ans]:[background:var(--grad)] [&.is-ans]:[border-color:transparent]! ${isAns ? 'is-ans' : ''} ${isWrong ? 'is-wrong' : ''} ${done && !isAns && !isWrong ? 'is-dim' : ''}`} onClick={() => choose(k)} disabled={done && !isAns && !isWrong}>
                    <span className="se__key [width:3.2rem] [height:3.2rem] [border-radius:0.8rem] [display:grid] [place-items:center] [font-family:var(--f-mono)] [font-size:1.4rem] [background:#f1edff] [color:var(--purple)] [.se\_\_opt.is-ans_&]:[background:#fff] [.se\_\_opt.is-ans_&]:[color:var(--purple)]">{String.fromCharCode(65 + k)}</span>
                    <span>{t}</span>
                    {isAns && <Check size={18} strokeWidth={2.5} />}
                    {isWrong && <X size={18} strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>
            <div className="se__why [min-height:12rem] [&_p]:[font-size:1.8rem] [&_p]:[line-height:1.6] [&_b]:[font-weight:600] [&_p]:[color:#4a4f63] [&_b]:[color:var(--ink-2)]" aria-live="polite">
              <AnimatePresence mode="wait">
                {done && (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                    <p><b>{right ? 'Right. ' : 'Close. '}</b>{c.why}</p>
                    <button className="se__next [display:inline-flex] [align-items:center] [gap:0.8rem] [margin-top:1.6rem] [font-weight:500] [font-size:1.8rem] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [color:var(--purple)]" onClick={next}>{i === SPOT.length - 1 ? 'Start over' : 'Next claim'} <ArrowRight size={18} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="se__dots [display:flex] [gap:0.8rem] [margin-top:4rem] [&_i]:[width:3.2rem] [&_i]:[height:0.4rem] [&_i]:[border-radius:1rem] [&_i]:[transition:background_0.4s,_width_0.4s] [&_i]:[background:#e3def5]" aria-hidden>{SPOT.map((_, k) => <i key={k} className={`${k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)]! [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)]! [.ct-needs_button&]:[background:var(--grad)]! [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)]! [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)]! [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)]! [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)]! [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} ${score[k] === true ? String.raw`is-ok [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[background:#f6f3ff] [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[border-color:#ddd3ff] [.ecg\_\_rows_em&]:[color:var(--purple)] [.ecg\_\_rows_em&]:[background:#ebe5ff] [.se\_\_dots_i&]:[background:#b7a3ff]` : ''}`} />)}</div>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* Editorial guide: the long-read fold (also the page's main SEO copy) */
/* ================================================================== */
const BREAKS: [string, string, string][] = [
  ['Modifiers', '25 · 59 · XU · 26 · TC', 'The same CPT code pays, gets cut, or gets denied depending on one two-character modifier, and every specialty leans on different ones.'],
  ['Bundling edits', 'NCCI PTP · MUE', 'Payers bundle services that are often done together. Unbundling them correctly needs documentation that proves the work was separate.'],
  ['Global periods', '0 · 10 · 90 days', 'Visits after a procedure are usually included in its fee. Bill one inside the window without the right modifier and it’s denied.'],
  ['Prior authorization', 'Imaging · infusions · surgery', 'Each payer keeps its own list. A study done without an approval on file is one of the hardest denials to overturn.'],
  ['Drugs and supplies', 'J-codes · NDC · units', 'Infusion, oncology and injection-heavy practices get underpaid when billed units don’t match the vial size and the dose given.'],
  ['Time and place', 'POS 02/10 · anesthesia units', 'Telehealth place-of-service codes, psychotherapy minutes and anesthesia base and time units all follow their own math.'],
];
const ASK = [
  'Which of your coders work our specialty every day, and what are their credentials?',
  'What are the top three denial reasons you see for practices like ours?',
  'How do you handle our high-dollar codes, and which ones do you review before they go out?',
  'How fast do you turn a CPT or payer policy change into a claim-scrubber rule?',
  'Can you show our denial rate and days in A/R against the specialty benchmark every month?',
];
const TOC = [['why', 'Why specialty billing is its own job'], ['breaks', 'Where specialty claims break'], ['ask', 'What to ask a billing company'], ['vs', 'Generalist vs specialty billing']];

function Guide() {
  const [on, setOn] = useState('why');
  useEffect(() => {
    const els = TOC.map(([id]) => document.getElementById(`sg-${id}`)).filter(Boolean) as HTMLElement[];
    const o = new IntersectionObserver((es) => { es.forEach((e) => { if (e.isIntersecting) setOn(e.target.id.slice(3)); }); }, { rootMargin: '-35% 0px -55% 0px' });
    els.forEach((e) => o.observe(e)); return () => o.disconnect();
  }, []);
  const jump = (id: string) => document.getElementById(`sg-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return (
    <section className="sg container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [display:grid] [grid-template-columns:30rem_minmax(0,_1fr)] [gap:8rem] [align-items:start] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:3.2rem] [@media(max-width:_1279px)]:[padding-top:10rem] [@media(max-width:_767px)]:[padding-top:8rem]" aria-labelledby="sg-title">
      <aside className="sg__toc [position:sticky] [top:12rem] [display:flex] [flex-direction:column] [gap:1.2rem] [&_ol]:[list-style:none] [&_ol]:[padding:0] [&_ol]:[margin:1.2rem_0_0] [&_ol]:[display:flex] [&_ol]:[flex-direction:column] [&_ol]:[border-left:1px_solid_#ebe6fb] [&_button]:[display:flex] [&_button]:[gap:1rem] [&_button]:[align-items:baseline] [&_button]:[width:100%] [&_button]:[padding:1rem_0_1rem_1.6rem] [&_button]:[margin-left:-1px] [&_button]:[border:0] [&_button]:[border-left:2px_solid_transparent]! [&_button]:[background:none] [&_button]:[text-align:left] [&_button]:[font:500_1.5rem/1.4_var(--f-jak)] [&_button]:[color:#7b7f92] [&_button]:[cursor:pointer] [&_button]:[transition:color_0.3s,_border-color_0.3s] [&_button_small]:[font-family:var(--f-mono)] [&_button_small]:[font-size:1.2rem] [&_button_small]:[color:#b0b3c2] [&_button:hover]:[color:var(--purple)] [@media(max-width:_1279px)]:[position:static]">
        <Eyebrow>/ The guide</Eyebrow>
        <p className="sg__toc-t [font-family:var(--f-jak)] [font-weight:500] [font-size:2.2rem] [line-height:1.25] [color:var(--ink-2)]">Specialty billing, explained</p>
        <ol>{TOC.map(([id, t], i) => <li key={id}><button type="button" className={on === id ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => jump(id)}><small>{String(i + 1).padStart(2, '0')}</small>{t}</button></li>)}</ol>
        <p className="sg__read [display:inline-flex] [align-items:center] [gap:0.8rem] [margin-top:1.2rem] [font-family:var(--f-mono)] [font-size:1.3rem] [color:#8a8ea0]"><BookOpen size={16} /> 5 min read</p>
      </aside>
      <article className="sg__body [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [max-width:82rem] [min-width:0] [&_h2]:[margin-bottom:2.4rem] [&_h3]:[scroll-margin-top:12rem] [&_h3]:[margin:5.6rem_0_1.6rem] [&_h3]:[font-family:var(--f-jak)] [&_h3]:[font-weight:500] [&_h3]:[font-size:3rem] [&_h3]:[line-height:1.25] [&_h3]:[letter-spacing:-0.06rem] [&_h3]:[color:var(--ink-2)] [&>p]:[margin-top:1.6rem] [&>p]:[font-size:1.8rem] [&>p]:[line-height:1.7] [&>p]:[color:#4a4f63] [@media(max-width:_767px)]:[&_h3]:[font-size:2.4rem] [@media(max-width:_767px)]:[&_h3]:[margin-top:4.8rem] [@media(max-width:_767px)]:[&>p]:[font-size:1.7rem]">
        <h2 id="sg-title" className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]">Why the same claim pays in one specialty and fails in another.</h2>
        <p className="sg__lede [@media(max-width:_1279px)]:[font-size:16px]! [font-size:2.2rem] [line-height:1.55] [color:var(--ink-2)] [@media(max-width:_767px)]:[font-size:1.9rem]">Medical billing looks like one job from the outside: code the visit, send the claim, collect the money. Inside, every specialty plays by its own rulebook, and most lost revenue hides in the gaps between them.</p>

        <h3 id="sg-why">Why specialty billing is its own job</h3>
        <p>A family practice bills a high volume of office visits, vaccines and preventive care. An orthopedic group bills surgeries with 90-day global periods, injections and imaging. A behavioral health practice bills by the minute. The codes, modifiers, payer policies and documentation each one needs barely overlap.</p>
        <p>A generalist biller can submit all of those claims. What they usually can’t do is spot the specialty-specific mistake before the payer does: the missing modifier, the unit count that doesn’t match the dose, the authorization that expired a week before the procedure. Those small misses add up to the 5–10% of revenue many practices never see.</p>
        <blockquote className="sg__quote [margin:4rem_0_0] [padding:3.2rem_3.6rem] [border-radius:2.4rem] [background:linear-gradient(150deg,_#7a55ff,_var(--purple)_50%,_#5430e6)] [color:#fff] [font-family:var(--f-jak)] [font-weight:500] [font-size:2.6rem] [line-height:1.35] [letter-spacing:-0.04rem] [@media(max-width:_767px)]:[padding:2.4rem] [@media(max-width:_767px)]:[font-size:2.1rem]">Every denial has a cause. In specialty billing, the cause is almost always a rule the biller didn’t know applied.</blockquote>

        <h3 id="sg-breaks">Where specialty claims break</h3>
        <p>Across the 23 specialties we bill, the same six pressure points cause most denials and underpayments:</p>
        <ul className="sg__breaks [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.6rem] [&_li]:[padding:2.4rem] [&_li]:[border-radius:2rem] [&_li]:[background:#f8f6ff] [&_li]:[border:1px_solid_#eee9ff] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [&_code]:[display:inline-block] [&_code]:[margin-top:0.8rem] [&_code]:[padding:0.3rem_0.8rem] [&_code]:[border-radius:0.6rem] [&_code]:[background:#fff] [&_code]:[border:1px_solid_#e6dfff] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.2rem] [&_code]:[color:var(--purple)] [&_p]:[margin-top:1.2rem] [&_p]:[font-size:1.5rem] [&_p]:[line-height:1.6] [&_p]:[color:#5b5f72] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [.pg\_\_sec_&]:[margin-top:2rem] [@media(max-width:_1279px)]:[&_p]:[font-size:16px]!">
          {BREAKS.map(([t, codes, body]) => <li key={t}><b>{t}</b><code>{codes}</code><p>{body}</p></li>)}
        </ul>

        <h3 id="sg-ask">What to ask a billing company about your specialty</h3>
        <p>Before you hand over your billing, ask questions that only a team with real specialty experience can answer well:</p>
        <ol className="sg__ask [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [list-style:none] [padding:0] [margin:2.4rem_0_0] [display:flex] [flex-direction:column] [gap:1rem] [&_li]:[display:flex] [&_li]:[gap:1.2rem] [&_li]:[align-items:flex-start] [&_li]:[padding:1.6rem_2rem] [&_li]:[border-radius:1.6rem] [&_li]:[border:1px_solid_#ece8fa] [&_li]:[font-size:1.7rem] [&_li]:[line-height:1.5] [&_li]:[color:var(--ink-2)] [&_svg]:[flex:none] [&_svg]:[margin-top:0.3rem] [&_svg]:[color:var(--purple)] [.pg\_\_sec_&]:[margin-top:2rem]">{ASK.map((q) => <li key={q}><CheckCircle2 size={18} />{q}</li>)}</ol>

        <h3 id="sg-vs">Generalist vs specialty billing</h3>
        <div className="sg__table [margin-top:2.4rem] [border-radius:2rem] [border:1px_solid_#ece8fa] [overflow:hidden] [.pg\_\_sec_&]:[margin-top:2rem]" role="table" aria-label="Generalist vs specialty billing">
          <div role="row" className="sg__tr sg__th [display:grid] [grid-template-columns:14rem_minmax(0,_1fr)_minmax(0,_1fr)] [gap:2rem] [padding:1.8rem_2.4rem] [line-height:1.5] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [border-top:0] [background:#f8f6ff] [font-family:var(--f-mono)] [font-size:1.3rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [&_span:last-child]:[color:var(--purple)] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[gap:0.6rem] [@media(max-width:_767px)]:[padding:1.6rem_1.8rem] [@media(max-width:_767px)]:[display:none] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[content:'Generalist:_'] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[content:'Specialty:_'] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[font-weight:400] [.pg\_\_codes_&]:[grid-template-columns:22rem_minmax(0,_1fr)_minmax(0,_1fr)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_767px)]:[.pg\_\_codes_&]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(2)::before]:[content:'What_trips_it:_'] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(3)::before]:[content:'How_we_catch_it:_']"><span role="columnheader" /><span role="columnheader">Generalist billing</span><span role="columnheader">Specialty billing</span></div>
          {[
            ['Coding', 'Codes what’s on the superbill', 'Checks the note supports the code and modifier'],
            ['Denials', 'Resubmits and hopes', 'Fixes the root cause so it stops recurring'],
            ['Payer rules', 'General payer guidelines', 'Specialty LCDs, auth lists and bundling edits'],
            ['Reporting', 'Collections total', 'Denial rate and A/R vs your specialty’s benchmark'],
          ].map(([k, a, b]) => <div role="row" className="sg__tr [display:grid] [grid-template-columns:14rem_minmax(0,_1fr)_minmax(0,_1fr)] [gap:2rem] [padding:1.8rem_2.4rem] [border-top:1px_solid_#f0edf9] [font-size:1.6rem] [line-height:1.5] [color:#5b5f72] [&_b]:[font-weight:500] [&_b]:[color:var(--ink-2)] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[gap:0.6rem] [@media(max-width:_767px)]:[padding:1.6rem_1.8rem] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[content:'Generalist:_'] [@media(max-width:_767px)]:[&_span:nth-child(2)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[content:'Specialty:_'] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[color:#8a8ea0] [@media(max-width:_767px)]:[&_span:nth-child(3)::before]:[font-weight:400] [.pg\_\_codes_&]:[grid-template-columns:22rem_minmax(0,_1fr)_minmax(0,_1fr)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_767px)]:[.pg\_\_codes_&]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(2)::before]:[content:'What_trips_it:_'] [@media(max-width:_767px)]:[.pg\_\_codes_&_span:nth-child(3)::before]:[content:'How_we_catch_it:_']" key={k}><b role="rowheader">{k}</b><span role="cell">{a}</span><span role="cell" className="is-us [.sg\_\_tr_&]:[color:var(--purple)] [.sg\_\_tr_&]:[font-weight:500] [.sg\_\_th_&]:[color:var(--purple)]">{b}</span></div>)}
        </div>
        <p className="sg__end [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-wrap:wrap] [gap:1rem] [align-items:center] [margin-top:4rem]!">Not sure where your specialty stands? <Link to="/contact" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">Get a free specialty billing review <ArrowRight size={16} /></Link></p>
      </article>
    </section>
  );
}

const FAQS = [
  ['What if my specialty isn’t listed?', 'We likely bill for it. Tell us on a free call and we’ll say plainly whether we’re a good fit.'],
  ['Do you work with multi-specialty groups?', 'Yes. Each specialty’s claims are coded by people who know its rules, under one point of contact and one monthly report.'],
  ['Are your coders certified?', `Yes, our coders hold AAPC or AHIMA credentials. ${CONFIRM}`],
  ['Do you bill for ASCs and hospital-based physicians?', 'Yes. ASC facility claims and professional claims for anesthesia, radiology and pathology each follow their own rules, and we bill both.'],
  ['How do you keep up with coding changes?', 'CPT codes update every January and ICD-10 every October, and payers change policies all year. We turn each change into a claim-scrubber rule before it costs you.'],
];

export function SpecialtiesHub() {
  useEffect(() => {
    document.title = 'Medical Billing by Specialty · Affinity Core';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Specialty-specific medical billing and coding for 23 specialties, from cardiology and anesthesia to mental health and wound care.');
  }, []);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <Hero />
      <Index />
      <Guide />
      <Proof />
      <Assessment />
      <FAQ items={FAQS} eyebrow="/ Specialty FAQs" lines={['What practices ask', 'about specialty billing.']} />
      <CTA eyebrow="/ Your specialty, your numbers" lines={['See how your specialty', 'is really getting paid.']} />
    </main>
  );
}

