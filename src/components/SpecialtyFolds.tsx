import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValueEvent, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Check, Wand2, X } from 'lucide-react';
import { CountUp, Eyebrow, Reveal, SplitWords } from './ui';
import { ease, vp } from '../motion';
import type { SpecialtyFull, ClaimSide } from '../data/specialties';

/* ================================================================== */
/* 1. Where a month leaks: waterfall                                  */
/* ================================================================== */
const AXIS_MIN = 85; // broken axis: bars start at 85% so the leaks are readable

export function LeakFall({ s }: { s: SpecialtyFull }) {
  const L = s.leak!;
  const [size, setSize] = useState(L.sizes[1]);
  // open on the biggest specialty-specific leak (the last one is the shared "denials never worked")
  const [pick, setPick] = useState(() => L.leaks.slice(0, -1).reduce((b, l, i, a) => (l.pct > a[b].pct ? i : b), 0));
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });

  const expected = L.perProvider * size;
  const lost = L.leaks.reduce((t, l) => t + l.pct, 0);
  const h = (pct: number) => (pct / (100 - AXIS_MIN)) * 100; // % of chart height
  let level = 100;
  const cols = L.leaks.map((l) => { const top = level; level -= l.pct; return { ...l, top, bottom: level }; });
  const collectedPct = 100 - lost;
  const money = (pct: number) => (expected * pct) / 100;
  const sel = L.leaks[pick];
  const t0 = 0.35, step = 0.32;

  return (
    <section className="lf container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]" ref={ref}>
      <div className="lf__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:end] [&>div:first-child]:[display:flex] [&>div:first-child]:[flex-direction:column] [&>div:first-child]:[gap:1.6rem] [@media(max-width:_1024px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1024px)]:[gap:2.4rem]">
        <div>
          <Eyebrow>{L.eyebrow}</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={L.lines} stagger={0.04} />
        </div>
        <Reveal as="p" className="lf__intro [margin-bottom:-0.4rem] [font-size:1.8rem] [line-height:1.6] [color:#5b5f72] [max-width:56rem]">{L.intro}</Reveal>
      </div>

      <motion.div className="lf__card [margin-top:5.6rem] [padding:4rem_4rem_3.2rem] [border-radius:3.2rem] [background:linear-gradient(165deg,_#f4f0ff_0%,_#fbfaff_55%,_#fff_100%)] [border:1px_solid_var(--lav-border)] [box-shadow:0_3rem_8rem_-3rem_rgba(80,_40,_220,_0.18)] [@media(max-width:_640px)]:[padding:2.4rem_1.6rem_2rem]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <div className="lf__bar [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:2rem] [flex-wrap:wrap]">
          <div className="lf__total [display:flex] [flex-direction:column] [gap:1.2rem] [&>div]:[display:flex] [&>div]:[align-items:baseline] [&>div]:[gap:1.6rem] [&>div]:[flex-wrap:wrap] [&_b]:[font-weight:500] [&_b]:[font-size:5.6rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.2rem] [&_b]:[color:#e0475f] [&_b]:[font-variant-numeric:tabular-nums] [&>div>span]:[font-size:1.6rem] [&>div>span]:[color:#5b5f72]">
            <p className="lf__kicker [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)]">One month, expected vs collected</p>
            <div><b><CountUp value={money(lost)} prefix="$" start={seen} duration={1.4} delay={0.4} /></b>
              <span>leaks out every month for {size} {size === 1 ? L.unit[0] : L.unit[1]}</span></div>
          </div>
          <div className="lf__seg [display:inline-flex] [padding:0.4rem] [border-radius:99rem] [background:#fff] [border:1px_solid_var(--lav-border)] [&_button]:[position:relative] [&_button]:[padding:0.9rem_1.8rem] [&_button]:[border-radius:99rem] [&_button]:[font-size:1.4rem] [&_button]:[color:#5b5f72] [&_button]:[transition:color_0.25s] [&_button>span:last-child]:[position:relative] [&_button]:[white-space:nowrap] [@media(max-width:_640px)]:[&_button]:[padding:0.8rem_1.6rem]" role="radiogroup" aria-label="Practice size">
            {L.sizes.map((n) => (
              <button key={n} role="radio" aria-checked={size === n} className={size === n ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => setSize(n)}>
                {size === n && <motion.span layoutId={`lf-seg-${s.slug}`} className="lf__segbg [position:absolute] [inset:0] [border-radius:inherit] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{n === 1 ? 'Solo' : <>{n}<em className="lf__unit [font-style:normal] [@media(max-width:_640px)]:[display:none]"> {L.unit[1]}</em></>}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lf__chart [position:relative] [display:grid] [grid-template-columns:repeat(var(--n),_minmax(0,_1fr))] [gap:1.6rem] [margin-top:4rem] [padding-left:4.8rem] [@media(max-width:_1024px)]:[gap:0.8rem] [@media(max-width:_1024px)]:[padding-left:3.6rem] [@media(max-width:_640px)]:[padding-left:3.2rem] [@media(max-width:_640px)]:[gap:0.4rem] [@media(max-width:_640px)]:[margin-top:2.4rem]" style={{ ['--n' as string]: L.leaks.length + 2 }}>
          <div className="lf__grid [position:absolute] [left:0] [right:0] [top:0] [height:32rem] [pointer-events:none] [&_span]:[position:absolute] [&_span]:[left:0] [&_span]:[right:0] [&_span]:[border-top:1px_dashed_#e3dcfb] [&_i]:[position:absolute] [&_i]:[left:0] [&_i]:[top:-0.9rem] [&_i]:[font-style:normal] [&_i]:[font-family:var(--f-mono)] [&_i]:[font-size:1.1rem] [&_i]:[color:#a3a6b8] [@media(max-width:_640px)]:[height:24rem]" aria-hidden>{[100, 95, 90, 85].map((g) => <span key={g} style={{ bottom: `${h(g - AXIS_MIN)}%` }}><i>{g}%</i></span>)}</div>

          {/* expected */}
          <div className="lf__col [display:flex] [flex-direction:column] [gap:1.6rem] [text-align:left] [min-width:0]">
            <div className="lf__plot [position:relative] [height:32rem] [@media(max-width:_640px)]:[height:24rem]">
              <motion.span className="lf__b lf__b--exp [position:absolute] [left:10%] [right:10%] [bottom:0] [border-radius:1rem] [transform-origin:bottom] [background:var(--grad)]" style={{ height: '100%' }} initial={{ scaleY: 0 }} animate={seen ? { scaleY: 1 } : {}} transition={{ duration: 0.9, ease: ease.out, delay: 0.1 }} />
            </div>
            <div className="lf__lab [display:flex] [flex-direction:column] [gap:0.4rem] [min-height:6.4rem] [padding-top:1.2rem] [border-top:1px_solid_#e6e0fb] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-variant-numeric:tabular-nums] [&_small]:[font-size:1.4rem] [&_small]:[line-height:1.35] [&_small]:[color:#5b5f72] [.lf\_\_col--leak.is-on_&_small]:[color:var(--ink-2)] [.lf\_\_col--leak.is-on_&_small]:[font-weight:500] [@media(max-width:_1024px)]:[&_small]:[font-size:1.2rem] [@media(max-width:_1024px)]:[&_b]:[font-size:1.5rem] [@media(max-width:_640px)]:[display:none]"><b><CountUp value={expected} prefix="$" start={seen} duration={1} /></b><small>Expected</small></div>
          </div>

          {cols.map((c, i) => (
            <button key={c.label} className={String.raw`lf__col lf__col--leak [display:flex] [flex-direction:column] [gap:1.6rem] [text-align:left] [min-width:0] [cursor:pointer] [border-radius:1.2rem] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:0.6rem]! ${pick === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => setPick(i)} onMouseEnter={() => setPick(i)} aria-pressed={pick === i}>
              <div className="lf__plot [position:relative] [height:32rem] [@media(max-width:_640px)]:[height:24rem]">
                <motion.span className="lf__lvl [position:absolute] [left:-1.6rem] [right:10%] [height:0] [border-top:2px_dotted_#b9a5ff] [transform-origin:left]" style={{ bottom: `${h(c.top - AXIS_MIN)}%` }} initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : {}} transition={{ duration: 0.35, ease: ease.out, delay: t0 + i * step }} aria-hidden />
                <motion.span className="lf__b lf__b--leak [position:absolute] [left:10%] [right:10%] [bottom:0] [transform-origin:top] [border-radius:0.6rem] [background:repeating-linear-gradient(135deg,_#ff8c9c_0_0.6rem,_#f46a80_0.6rem_1.2rem)] [transition:filter_0.25s,_box-shadow_0.25s] [.lf\_\_col--leak.is-on_&]:[box-shadow:0_0_0_3px_#fff,_0_0_0_5px_#f46a80]" style={{ bottom: `${h(c.bottom - AXIS_MIN)}%`, height: `${h(c.pct)}%` }}
                  initial={{ scaleY: 0 }} animate={seen ? { scaleY: 1 } : {}} transition={{ duration: 0.55, ease: ease.out, delay: t0 + i * step + 0.15 }} />
                <motion.em className="lf__pct [position:absolute] [left:0] [right:0] [padding-top:0.6rem] [text-align:center] [font-style:normal] [font-family:var(--f-mono)] [font-size:1.2rem] [color:#e0475f] [@media(max-width:_640px)]:[font-size:1rem]" style={{ top: `${100 - h(c.bottom - AXIS_MIN)}%` }} initial={{ opacity: 0, y: -6 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: t0 + i * step + 0.5 }}>−{c.pct}%</motion.em>
              </div>
              <div className="lf__lab [display:flex] [flex-direction:column] [gap:0.4rem] [min-height:6.4rem] [padding-top:1.2rem] [border-top:1px_solid_#e6e0fb] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-variant-numeric:tabular-nums] [&_small]:[font-size:1.4rem] [&_small]:[line-height:1.35] [&_small]:[color:#5b5f72] [.lf\_\_col--leak.is-on_&_small]:[color:var(--ink-2)] [.lf\_\_col--leak.is-on_&_small]:[font-weight:500] [@media(max-width:_1024px)]:[&_small]:[font-size:1.2rem] [@media(max-width:_1024px)]:[&_b]:[font-size:1.5rem] [@media(max-width:_640px)]:[display:none]"><b className="neg [.lf\_\_lab_b&]:[color:#e0475f]"><CountUp value={money(c.pct)} prefix="−$" start={seen} duration={1} delay={t0 + i * step} /></b><small>{c.label}</small></div>
            </button>
          ))}

          {/* collected */}
          <div className="lf__col [display:flex] [flex-direction:column] [gap:1.6rem] [text-align:left] [min-width:0]">
            <div className="lf__plot [position:relative] [height:32rem] [@media(max-width:_640px)]:[height:24rem]">
              <motion.span className="lf__lvl [position:absolute] [left:-1.6rem] [right:10%] [height:0] [border-top:2px_dotted_#b9a5ff] [transform-origin:left]" style={{ bottom: `${h(collectedPct - AXIS_MIN)}%` }} initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : {}} transition={{ duration: 0.35, delay: t0 + cols.length * step }} aria-hidden />
              <motion.span className="lf__b lf__b--got [position:absolute] [left:10%] [right:10%] [bottom:0] [border-radius:1rem] [transform-origin:bottom] [background:var(--grad)] [box-shadow:0_1.6rem_3rem_-1rem_rgba(106,_65,_249,_0.45)]" style={{ height: `${h(collectedPct - AXIS_MIN)}%` }} initial={{ scaleY: 0 }} animate={seen ? { scaleY: 1 } : {}} transition={{ duration: 0.8, ease: ease.out, delay: t0 + cols.length * step + 0.1 }} />
            </div>
            <div className="lf__lab [display:flex] [flex-direction:column] [gap:0.4rem] [min-height:6.4rem] [padding-top:1.2rem] [border-top:1px_solid_#e6e0fb] [&_b]:[font-weight:500] [&_b]:[font-size:2rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-variant-numeric:tabular-nums] [&_small]:[font-size:1.4rem] [&_small]:[line-height:1.35] [&_small]:[color:#5b5f72] [.lf\_\_col--leak.is-on_&_small]:[color:var(--ink-2)] [.lf\_\_col--leak.is-on_&_small]:[font-weight:500] [@media(max-width:_1024px)]:[&_small]:[font-size:1.2rem] [@media(max-width:_1024px)]:[&_b]:[font-size:1.5rem] [@media(max-width:_640px)]:[display:none]"><b><CountUp value={money(collectedPct)} prefix="$" start={seen} duration={1.2} delay={t0 + cols.length * step} /></b><small>Collected</small></div>
          </div>
          <span className="lf__break [position:absolute] [left:4.8rem] [right:0] [top:32rem] [height:1rem] [transform:translateY(-50%)] [background:radial-gradient(circle_at_0.5rem_0.5rem,_transparent_0.35rem,_#fbfaff_0.4rem)_0_0_/_1rem_1rem_repeat-x] [opacity:0.9] [pointer-events:none] [@media(max-width:_640px)]:[top:24rem] [@media(max-width:_640px)]:[left:3.2rem]" aria-hidden />
        </div>
        <p className="lf__mob [display:none] [@media(max-width:_640px)]:[display:flex] [@media(max-width:_640px)]:[justify-content:space-between] [@media(max-width:_640px)]:[margin-top:1.6rem] [@media(max-width:_640px)]:[padding-top:1.2rem] [@media(max-width:_640px)]:[border-top:1px_solid_#e6e0fb] [@media(max-width:_640px)]:[font-size:1.4rem] [@media(max-width:_640px)]:[color:#5b5f72] [@media(max-width:_640px)]:[&_b]:[color:var(--ink-2)] [@media(max-width:_640px)]:[&_b]:[font-weight:500]"><span>Expected <b>${expected.toLocaleString('en-US')}</b></span><span>Collected <b>${money(collectedPct).toLocaleString('en-US')}</b></span></p>

        <div className="lf__detail [margin-top:3.2rem] [padding:2.4rem_2.8rem] [border-radius:2rem] [background:#fff] [border:1px_solid_var(--lav-border)] [min-height:11rem] [overflow:hidden]" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={pick} className="lf__dg [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:4rem] [&_small]:[display:inline-flex] [&_small]:[align-items:center] [&_small]:[gap:0.6rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#e0475f] [&_p]:[margin-top:0.8rem] [&_p]:[font-size:1.7rem] [&_p]:[line-height:1.55] [&_p]:[color:#4a4f63] [&_p_b]:[font-weight:600] [&_p_b]:[color:var(--ink-2)] [@media(max-width:_1024px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1024px)]:[gap:2rem] [@media(max-width:_640px)]:[gap:1.6rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: ease.out }}>
              <div><small><X size={14} strokeWidth={3} /> Where it leaks · −${money(sel.pct).toLocaleString('en-US')} a month</small><p><b>{sel.label}.</b> {sel.cause}</p></div>
              <div><small className="ok [.w-den\_\_st_&]:[background:var(--purple)] [.w-den\_\_st_&]:[color:#fff] [color:#12a150] [.mw_em&]:[background:#dcf5ea] [.mw\_\_row_em&]:[background:#dcf5ea] [.dq_li_em&]:[background:#dcf5ea] [.lf\_\_dg_small&]:[color:#18a058]"><Check size={14} strokeWidth={3} /> How we stop it</small><p>{sel.fix}</p></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="lf__note [@media(max-width:_1279px)]:[font-size:13.5px]! [margin-top:2rem] [font-size:1.3rem] [line-height:1.5] [color:#8a8ea0] [&_a]:[color:#8a8ea0] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:0.25em]">{L.note}{L.source && <> <a href={L.source.href} target="_blank" rel="noopener noreferrer">{L.source.label}</a>.</>}</p>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* 2. Same visit, two claims: a fix line scans down the claim         */
/* ================================================================== */
function Cell({ c }: { c: ClaimSide }) {
  return (
    <>
      <code>{c.code}</code>
      <span className={String.raw`tc__tag [display:inline-flex] [align-items:center] [gap:0.5rem] [justify-self:start] [padding:0.5rem_1rem] [border-radius:0.8rem] [font-size:1.3rem] [@media(max-width:_1024px)]:[.tc\_\_row_&]:[display:none] tc__tag--${c.tone}`}>{c.tone === 'bad' ? <X size={12} strokeWidth={3} /> : c.tone === 'good' ? <Check size={12} strokeWidth={3} /> : null}{c.tag}</span>
      <b className={c.amt === 0 ? String.raw`zero [.tc\_\_row_b&]:[color:#c8364d]` : ''}>{c.amt == null ? '—' : `$${c.amt.toLocaleString('en-US')}`}</b>
    </>
  );
}

function Side({ s, side, rowsRef }: { s: SpecialtyFull; side: 'bad' | 'good'; rowsRef?: React.RefObject<HTMLDivElement | null> }) {
  const C = s.claim!;
  const total = C.rows.reduce((t, r) => t + (r[side].amt ?? 0), 0);
  return (
    <div className={String.raw`tc__side [padding:3.2rem_4rem_3.6rem] [.tc\_\_over_&]:[height:100%] [@media(max-width:_640px)]:[padding:2rem_1.6rem_2.4rem] tc__side--${side}`} aria-hidden={side === 'good' ? true : undefined}>
      <div className="tc__th [display:grid] [grid-template-columns:4rem_minmax(0,_1.2fr)_minmax(0,_0.9fr)_minmax(0,_1.4fr)_8rem] [align-items:center] [gap:1.6rem] [padding-bottom:1.2rem] [border-bottom:2px_solid_#ddd3fc] [font-family:var(--f-mono)] [font-size:1.1rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0] [&_span:last-child]:[text-align:right] [@media(max-width:_1024px)]:[grid-template-columns:3rem_minmax(0,_1fr)_minmax(0,_1fr)_6rem] [@media(max-width:_1024px)]:[&_span:nth-child(4)]:[display:none] [@media(max-width:_640px)]:[grid-template-columns:2.6rem_minmax(0,_1fr)_minmax(0,_1fr)_5.6rem] [@media(max-width:_640px)]:[gap:1rem]"><span>#</span><span>Line</span><span>Code</span><span>Status</span><span>Paid</span></div>
      <div ref={rowsRef}>
        {C.rows.map((r, i) => (
          <div className="tc__row [display:grid] [grid-template-columns:4rem_minmax(0,_1.2fr)_minmax(0,_0.9fr)_minmax(0,_1.4fr)_8rem] [align-items:center] [gap:1.6rem] [padding:2rem_0] [border-bottom:1px_solid_#ece8f8] [font-size:1.7rem] [color:var(--ink-2)] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.6rem] [.tc\_\_side--bad_&_code]:[color:#6b6f7c] [.tc\_\_side--good_&_code]:[color:var(--purple)] [.tc\_\_side--good_&_code]:[font-weight:500] [&_b]:[justify-self:end] [&_b]:[font-weight:500] [&_b]:[font-variant-numeric:tabular-nums] [@media(max-width:_1024px)]:[grid-template-columns:3rem_minmax(0,_1fr)_minmax(0,_1fr)_6rem] [@media(max-width:_640px)]:[grid-template-columns:2.6rem_minmax(0,_1fr)_minmax(0,_1fr)_5.6rem] [@media(max-width:_640px)]:[gap:1rem] [@media(max-width:_640px)]:[font-size:1.5rem] [@media(max-width:_640px)]:[&_code]:[font-size:1.3rem]" key={r.label}><span className="tc__n [width:2.6rem] [height:2.6rem] [border-radius:50%] [display:grid] [place-items:center] [font-family:var(--f-mono)] [font-size:1.2rem] [background:#fff] [border:1px_solid_#d9d0fb] [color:var(--purple)] [.tc\_\_why_li.is-on_&]:[background:var(--purple)] [.tc\_\_why_li.is-on_&]:[border-color:var(--purple)] [.tc\_\_why_li.is-on_&]:[color:#fff] [.tc\_\_why_&]:[flex:none] [.tc\_\_why_&]:[transition:background_0.3s,_color_0.3s]">{i + 1}</span><span className="tc__l">{r.label}</span><Cell c={r[side]} /></div>
        ))}
      </div>
      <div className="tc__sum [display:flex] [justify-content:space-between] [align-items:baseline] [padding-top:2rem] [font-size:1.6rem] [color:#5b5f72] [&_b]:[font-weight:500] [&_b]:[font-size:3.2rem] [&_b]:[color:var(--ink-2)] [.tc\_\_side--bad_&_b]:[color:#a3a6b8] [.tc\_\_side--good_&_b]:[color:var(--purple)]"><span>Paid on this claim</span><b>${total.toLocaleString('en-US')}</b></div>
    </div>
  );
}

export function TwoClaims({ s }: { s: SpecialtyFull }) {
  const C = s.claim!;
  const n = C.rows.length;
  const card = useRef<HTMLDivElement>(null);
  const rows = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // row boundaries as % of card height, measured so the fix line lands exactly on row edges
  const [edges, setEdges] = useState<number[]>(() => Array.from({ length: n + 2 }, (_, i) => (i / (n + 1)) * 100));
  useLayoutEffect(() => {
    const measure = () => {
      const c = card.current, r = rows.current; if (!c || !r) return;
      const H = c.offsetHeight; const top = r.offsetTop + (r.offsetParent === c ? 0 : (r.offsetParent as HTMLElement).offsetTop);
      const kids = [...r.children] as HTMLElement[];
      setEdges([top / H * 100, ...kids.map((k) => (top + k.offsetTop + k.offsetHeight) / H * 100), 100]);
    };
    measure();
    const ro = new ResizeObserver(measure); if (card.current) ro.observe(card.current);
    return () => ro.disconnect();
  }, [n]);

  // the fix line follows the pointer over the claim (tap toggles on touch); it stays where you leave it
  const target = useMotionValue(edges[0]);
  const touched = useRef(false);
  useEffect(() => { if (!touched.current) target.jump(edges[0]); }, [edges, target]);
  const line = useSpring(target, { stiffness: 320, damping: 36, mass: 0.6 });
  const [hint, setHint] = useState(true);
  const follow = (clientY: number) => {
    const r = card.current!.getBoundingClientRect();
    const p = ((clientY - r.top) / r.height) * 100;
    target.set(Math.min(100, Math.max(edges[0], p)));
  };
  const onMove = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; touched.current = true; setHint(false); follow(e.clientY); };
  const onTap = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    touched.current = true; setHint(false);
    target.set(target.get() > 60 ? edges[0] : 100);
  };
  const clip = useTransform(line, (p) => `inset(0 0 ${100 - (reduce ? 100 : p)}% 0)`);
  const top = useTransform(line, (p) => `${p}%`);
  const [fixed, setFixed] = useState(0);
  useMotionValueEvent(line, 'change', (p) => {
    const k = edges.slice(1, n + 1).filter((e) => p >= e - 0.5).length;
    if (k !== fixed) setFixed(k);
  });
  const shown = reduce ? n : fixed;
  const running = C.rows.reduce((t, r, i) => t + ((i < shown ? r.good.amt : r.bad.amt) ?? 0), 0);
  const bad = C.rows.reduce((t, r) => t + (r.bad.amt ?? 0), 0);
  const status = shown === 0 ? 'As it usually goes out' : shown >= n ? 'As we send it' : `Fixing line ${shown + 1} of ${n}`;

  return (
    <section className="tc container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]">
      <div className="tc__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:end] [&>div:first-child]:[display:flex] [&>div:first-child]:[flex-direction:column] [&>div:first-child]:[gap:1.6rem] [@media(max-width:_1024px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1024px)]:[gap:2.4rem]">
        <div>
          <Eyebrow>{C.eyebrow}</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={C.lines} stagger={0.04} />
        </div>
        <Reveal as="p" className="tc__intro [margin-bottom:-0.4rem] [font-size:1.8rem] [line-height:1.6] [color:#5b5f72] [max-width:56rem]">{C.intro}</Reveal>
      </div>

      <div className="tc__wrap [margin-top:5.6rem]">
        <div className="tc__bar [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:2rem] [margin-bottom:2rem] [padding:0_0.4rem] [@media(max-width:_640px)]:[flex-wrap:wrap]">
          <div className="tc__delta [display:flex] [align-items:center] [gap:2rem] [&>span]:[display:flex] [&>span]:[flex-direction:column] [&>span]:[gap:0.4rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_b]:[font-weight:500] [&_b]:[font-size:4rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.1rem] [&_b]:[font-variant-numeric:tabular-nums] [@media(max-width:_640px)]:[&_b]:[font-size:3.2rem]">
            <span><small>Usually</small><b className="was [.proof\_\_pair_i&]:[background:#ddd8ee] [.cs\_\_track_i&]:[background:#cfc6f3] [.tc\_\_delta_b&]:[color:#a3a6b8] [.tc\_\_delta_b&]:[text-decoration:line-through] [.tc\_\_delta_b&]:[text-decoration-thickness:2px]! [.sl\_\_line_&]:[fill:#fff] [.sl\_\_line_&]:[stroke:#b7a3ff] [.sl\_\_line_&]:[stroke-width:3]">${bad.toLocaleString('en-US')}</b></span>
            <span className="tc__arrow [.tc\_\_delta_&]:[font-size:3.2rem] [.tc\_\_delta_&]:[color:#b9a5ff]" aria-hidden>→</span>
            <span><small>With us</small><b className="accent [.tc\_\_delta_b&]:[color:var(--purple)] [.tc\_\_delta_b&]:[min-width:4ch] [.calc\_\_out_b&]:[color:var(--purple)]"><CountUp value={running} prefix="$" start duration={0.6} /></b></span>
          </div>
          <div className="tc__right [display:flex] [flex-direction:column] [align-items:flex-end] [gap:1.2rem]">
          <span className="tc__meta [display:flex] [gap:2rem] [font-family:var(--f-mono)] [font-size:1.2rem] [color:#8a8ea0] [@media(max-width:_1024px)]:[&_span:not(:last-child)]:[display:none] [@media(max-width:_640px)]:[display:none]">{C.visit.map((v) => <span key={v}>{v}</span>)}</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={status} className={String.raw`tc__badge [padding:0.8rem_1.4rem] [border-radius:99rem] [font-family:var(--f-mono)] [font-size:1.2rem] [letter-spacing:0.06em] [text-transform:uppercase] [background:#efeaff] [color:var(--purple)] [&.is-raw]:[background:#ffe9ec] [&.is-raw]:[color:#c8364d] [&.is-done]:[background:var(--grad)] [&.is-done]:[color:#fff] ${shown >= n ? String.raw`is-done [.pp\_\_list_li&]:[color:var(--ink-2)] [.pa-art\_\_steps_li&]:[color:#6a41f9]` : shown === 0 ? 'is-raw' : ''}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>{status}</motion.span>
          </AnimatePresence>
          </div>
        </div>
        <motion.div className="tc__card [position:relative] [cursor:ns-resize] [border-radius:3.2rem] [overflow:hidden] [border:1px_solid_var(--lav-border)] [box-shadow:0_3rem_8rem_-3rem_rgba(80,_40,_220,_0.2)] [@media(hover:_none)]:[cursor:pointer]" ref={card} onPointerMove={onMove} onPointerDown={onTap} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
          <Side s={s} side="bad" rowsRef={rows} />
          <motion.div className="tc__over [position:absolute] [inset:0]" style={{ clipPath: clip }}><Side s={s} side="good" /></motion.div>
          {!reduce && (
            <motion.div className="tc__scan [position:absolute] [left:0] [right:0] [height:0] [pointer-events:none] [will-change:top] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[left:0] [&::before]:[right:0] [&::before]:[top:-1px] [&::before]:[height:2px] [&::before]:[background:var(--grad-x)] [&::before]:[box-shadow:0_0_1.6rem_rgba(106,_65,_249,_0.55)] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[left:0] [&::after]:[right:0] [&::after]:[bottom:0] [&::after]:[height:4rem] [&::after]:[background:linear-gradient(0deg,_rgba(138,_107,_255,_0.12),_transparent)]" style={{ top }} aria-hidden>
              <span className="tc__knob [position:absolute] [right:2.4rem] [top:0] [width:3.6rem] [height:3.6rem] [margin-top:-1.8rem] [border-radius:50%] [display:grid] [place-items:center] [background:var(--grad)] [color:#fff] [box-shadow:0_0_0_0.5rem_rgba(255,_255,_255,_0.9),_0_0.8rem_2rem_rgba(80,_40,_220,_0.4)] [z-index:1] [@media(max-width:_640px)]:[right:1.2rem]"><Wand2 size={16} /></span>
              <AnimatePresence>{hint && <motion.span className="tc__hint [position:absolute] [right:7.2rem] [top:0] [transform:translateY(-130%)] [padding:0.6rem_1.2rem] [border-radius:99rem] [background:var(--ink-2)] [color:#fff] [font-size:1.3rem] [white-space:nowrap] [@media(max-width:_640px)]:[right:5.6rem]" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>{typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches ? 'Tap the claim to fix it' : 'Hover the claim to fix it'}</motion.span>}</AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      <ol className="tc__why [list-style:none] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:3.2rem] [margin-top:4.8rem] [&_li]:[display:flex] [&_li]:[gap:1.4rem] [&_li]:[align-items:flex-start] [&_li]:[opacity:0.45] [&_li]:[transition:opacity_0.4s] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:1.5rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-family:var(--f-mono)] [&_p]:[margin-top:0.6rem] [&_p]:[font-size:1.5rem] [&_p]:[line-height:1.55] [&_p]:[color:#5b5f72] [@media(max-width:_1024px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_640px)]:[gap:2rem]">
        {C.rows.map((r, i) => (
          <li key={r.label} className={i < shown ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}>
            <span className="tc__n [width:2.6rem] [height:2.6rem] [border-radius:50%] [display:grid] [place-items:center] [font-family:var(--f-mono)] [font-size:1.2rem] [background:#fff] [border:1px_solid_#d9d0fb] [color:var(--purple)] [.tc\_\_why_li.is-on_&]:[background:var(--purple)] [.tc\_\_why_li.is-on_&]:[border-color:var(--purple)] [.tc\_\_why_li.is-on_&]:[color:#fff] [.tc\_\_why_&]:[flex:none] [.tc\_\_why_&]:[transition:background_0.3s,_color_0.3s]">{i < shown ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
            <div><b>{r.label}: {r.bad.code} → {r.good.code}</b><p>{r.why}</p></div>
          </li>
        ))}
      </ol>
      <p className="tc__note [margin-top:2.4rem] [font-size:1.3rem] [color:#8a8ea0]">{C.note}</p>
    </section>
  );
}
