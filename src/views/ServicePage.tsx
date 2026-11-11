'use client';
import { IntroBlock, serviceIntro } from '../components/IntroBlock';
import { PageGuide, serviceGuide } from '../components/PageGuide';
import { HeroCapture } from '../components/HeroCapture';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { Button, CountUp, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { CTA, FAQ } from '../sections/Closing';
import { Proof } from './ServicesHub';
import { Assessment } from '../sections/Assessment';
import { EhrStrip, TrustRow, MidCta, Switching, SpecialtyChips } from '../components/ChildFolds';
import { searchFaqs, pageJsonLd, setJsonLd } from '../data/seo';
import { setEstimate } from '../data/estimate';
import { Link } from '../router';
import { SERVICES, STATIONS, getService, type ServiceFull, type Fmt } from '../data/services';
import { ease, vp } from '../motion';
import h1 from '../assets/hero-1.jpg';
import h2 from '../assets/hero-2.jpg';
import h3 from '../assets/hero-3.jpg';
import docPhoto from '../assets/form-doctor.jpg';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';
import { ClaimFocus } from '../components/ClaimFocus';

const PHOTOS = { h1, h2, h3, doc: docPhoto };
const fmt = (v: number, f: Fmt) => f === '$' ? `$${Math.round(v).toLocaleString('en-US')}` : f === '%' ? `${v}%` : f === 'd' ? `${v} days` : Math.round(v).toLocaleString('en-US');

/* ================= Hero ================= */
function WorkQueue({ s }: { s: ServiceFull }) {
  const q = s.queue;
  const [n, setN] = useState(0); // how many rows resolved
  useEffect(() => { const id = setInterval(() => setN((v) => (v + 1) % (q.rows.length + 2)), 1300); return () => clearInterval(id); }, [q.rows.length]);
  const resolved = Math.min(n, q.rows.length);
  const total = q.rows.slice(0, resolved).reduce((acc, r) => acc + r.value, 0);
  const show = (v: number) => (q.unit === '$' ? `$${v.toLocaleString('en-US')}` : v.toLocaleString('en-US'));
  return (
    <div className="dq w-card w-glass [border-radius:2.17rem] [border:1.5px_solid_rgba(255,_255,_255,_0.7)] [background:linear-gradient(168deg,_rgba(255,_255,_255,_0.85)_8%,_rgba(242,_240,_255,_0.74)_92%)] [box-shadow:0_1.55rem_4.66rem_rgba(128,_70,_251,_0.35),_inset_0_1.5px_0_rgba(255,_255,_255,_0.9)] [backdrop-filter:blur(2.5rem)] [font-family:var(--f-man)] [color:#0d0c15] [padding:2.4rem] [&_li]:[display:grid] [&_li]:[gap:1.2rem] [&_li]:[align-items:center] [&_li]:[padding:1.1rem_0] [&_li]:[border-top:1px_solid_rgba(212,_209,_230,_0.7)] [&_li]:[font-size:1.35rem] [&_li_code]:[font-family:var(--f-mono)] [&_li_code]:[color:var(--purple)] [&_li_code]:[background:rgba(229,_223,_255,_0.8)] [&_li_code]:[border-radius:0.6rem] [&_li_code]:[padding:0.3rem_0.6rem] [&_li_code]:[text-align:center] [&_li_span]:[color:#575568] [&_li_em]:[font-style:normal] [&_li_em]:[font-weight:700] [&_li_em]:[font-size:1.2rem] [&_li_em]:[padding:0.3rem_0.9rem] [&_li_em]:[border-radius:3rem] [&_li_em]:[display:inline-flex] [&_li_em]:[align-items:center] [&_li_em]:[gap:0.3rem] [&_li_em]:[white-space:nowrap] [&_li_b]:[text-align:right] [&_li_b]:[font-variant-numeric:tabular-nums] [&_li_code]:[white-space:nowrap] [&_li_code]:[font-size:1.15rem] [&_li]:[grid-template-columns:7.4rem_1fr_auto_7.4rem]">
      <div className="dq__head [display:flex] [justify-content:space-between] [align-items:baseline] [margin-bottom:1.2rem] [font-size:1.5rem] [color:#575568] [&_b]:[font-weight:700] [&_b]:[font-size:2.6rem] [&_b]:[color:#0d0c15] [&_b]:[font-variant-numeric:tabular-nums] [&_b_small]:[font-weight:500] [&_b_small]:[font-size:1.3rem] [&_b_small]:[color:#575568]"><span>{q.title}</span><b>{show(total)}<small> {q.totalLabel}</small></b></div>
      <ul>
        {q.rows.map((r, i) => {
          const done = i < resolved;
          return (
            <li key={r.code + r.label}>
              <code>{r.code}</code>
              <span>{r.label}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.em key={done ? 'y' : 'n'} className={done ? String.raw`ok [.w-den\_\_st_&]:[background:var(--purple)] [.w-den\_\_st_&]:[color:#fff]! [color:#12a150] [.mw_em&]:[background:#dcf5ea] [.mw\_\_row_em&]:[background:#dcf5ea] [.dq_li_em&]:[background:#dcf5ea]! [.lf\_\_dg_small&]:[color:#18a058]!` : String.raw`wait [color:#c77c00]! [.mw_em&]:[background:#fff1d6]! [.dq_li_em&]:[background:#f1edff]! [.dq_li_em&]:[color:var(--purple)]!`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}>
                  {done ? <><Check size={13} strokeWidth={3} /> {r.done}</> : q.pending}
                </motion.em>
              </AnimatePresence>
              <b>{q.unit === '$' ? (r.value ? show(r.value) : '—') : r.value.toLocaleString('en-US')}</b>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Hero({ s }: { s: ServiceFull }) {
  return (
    <section className="sp-hero [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:center] [padding:16.4rem_var(--gutter)_6rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[min-height:0]">
      <div className="sp-hero__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
        <motion.nav className="crumbs [display:flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.4rem] [&_a]:[color:var(--purple)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="/services"><ChevronLeft size={16} /> Services</Link><span>/</span><span>{s.name}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={s.heroTitle} bold={[s.heroAccent]} />
        <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>{s.heroSub}</motion.p>
        <motion.div className="sh-hero__cta [display:flex] [align-items:center] [gap:3.2rem] [flex-wrap:wrap]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
          <HeroCapture source={`service:${s.slug}`} />
        </motion.div>
        <TrustRow />
      </div>
      <motion.div className="sp-hero__stage sp-hero__stage--x [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:2rem] [position:relative] [height:min(70rem,_calc(100svh_-_20rem))] [min-height:58rem] [border-radius:3.2rem] [overflow:hidden] [isolation:isolate] [border:1px_solid_rgba(106,_65,_249,_0.14)] [box-shadow:0_4rem_10rem_-4rem_rgba(80,_40,_220,_0.25)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background:rgba(255,_255,_255,_0.55)] [@media(max-width:_1279px)]:[height:62rem] [@media(max-width:_1279px)]:[min-height:0] [@media(max-width:_1279px)]:[aspect-ratio:auto] [@media(min-width:_768px)_and_(max-width:_1279px)]:[width:100%] [@media(min-width:_768px)_and_(max-width:_1279px)]:[max-width:72rem] [@media(min-width:_768px)_and_(max-width:_1279px)]:[justify-self:center] [@media(max-width:_640px)]:[height:46rem] [@media(max-width:_640px)]:[min-height:0]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.2 }}>
        <div className="sp-board__bg [position:absolute] [inset:0] [z-index:-2] [overflow:hidden] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[max-width:none] [&_img]:[object-fit:cover] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate]" aria-hidden><img src={fluted} alt="" /></div>
        <ClaimFocus slug={s.slug} />
        <motion.div className="hero-chip sp-hero__chip [position:absolute] [display:flex] [align-items:center] [gap:1.2rem] [padding:2.4rem] [border-radius:1.4rem] [background:rgba(248,_246,_255,_0.8)] [backdrop-filter:blur(1.2rem)] [color:var(--navy)] [white-space:nowrap] [z-index:4] [&_strong]:[display:block] [&_strong]:[font-weight:500] [&_strong]:[font-size:2.4rem] [&_strong]:[line-height:2.2rem] [&_strong]:[margin-bottom:0.8rem] [&_small]:[display:block] [&_small]:[font-size:1.4rem] [&_small]:[line-height:1.8rem] [right:2.4rem] [top:2.4rem] [@media(max-width:_1279px)]:[display:none] [.sp-hero\_\_stage--x_&]:[z-index:3]" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1.1 }}>
          <span><strong>{s.chip[0]}</strong><small>{s.chip[1]}</small></span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================= The problem, in numbers ================= */
export function Problem({ s, withCalc = true }: { s: Pick<ServiceFull, 'slug' | 'calc' | 'stat'>; withCalc?: boolean }) {
  const { calc, stat } = s;
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(calc.fields.map((f) => [f.id, f.value])));
  const outs = calc.compute(vals);
  const head = outs.find((o) => o.accent) ?? outs[outs.length - 1];
  useEffect(() => { if (withCalc) setEstimate(`${fmt(head.value, head.fmt)} · ${head.label.toLowerCase()} (${calc.kicker.toLowerCase()})`); }, [withCalc, head.value, head.fmt, head.label, calc.kicker]);
  const big = `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`;
  return (
    <section className={String.raw`prob container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [column-gap:2.4rem] [padding-top:12rem] [align-items:center] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[row-gap:3.2rem] ${withCalc ? '' : 'prob--solo'}`}>
      <div className="prob__stat [grid-column:1_/_span_2] [padding-right:6rem] [display:flex] [flex-direction:column] [gap:1.6rem] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[padding-right:0] [.prob--solo_&]:[grid-column:1_/_-1] [.prob--solo_&]:[padding-right:0] [.prob--solo_&]:[display:grid] [.prob--solo_&]:[grid-template-columns:auto_minmax(0,_1fr)] [.prob--solo_&]:[column-gap:8rem] [.prob--solo_&]:[row-gap:1.6rem] [.prob--solo_&]:[align-items:end] [.prob--solo_&>:first-child]:[grid-column:1_/_-1] [@media(max-width:_1279px)]:[.prob--solo_&]:[grid-template-columns:minmax(0,_1fr)]">
        <Eyebrow>/ The problem, in numbers</Eyebrow>
        <p className={String.raw`prob__big [font-weight:500] [font-size:22rem] [line-height:0.9] [letter-spacing:-0.8rem] [color:var(--purple)] [@media(max-width:_1279px)]:[font-size:14rem] [&.is-long]:[font-size:17rem] [&.is-long]:[letter-spacing:-0.6rem] [&.is-xlong]:[font-size:14rem] [&.is-xlong]:[letter-spacing:-0.5rem] [@media(max-width:_1279px)]:[&.is-long]:[font-size:11rem] [@media(max-width:_1279px)]:[&.is-xlong]:[font-size:9rem] [.prob--solo_&]:[grid-row:2_/_span_2] [@media(max-width:_1279px)]:[.prob--solo_&]:[grid-row:auto] [.prob--solo_&]:[padding-bottom:1.2rem] ${big.length > 4 ? 'is-long' : ''} ${big.length > 6 ? 'is-xlong' : ''}`}>
          <CountUp value={stat.value} decimals={stat.decimals ?? 0} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} duration={1.6} />
        </p>
        <Reveal as="p" className="prob__label [font-weight:500] [font-size:3rem] [line-height:1.25] [color:var(--ink-2)] [letter-spacing:-0.04rem] [.prob--solo_&]:[grid-column:2] [.prob--solo_&]:[max-width:64rem] [@media(max-width:_1279px)]:[.prob--solo_&]:[grid-column:1]">{stat.label}</Reveal>
        <a className="prob__src [font-family:var(--f-mono)] [font-size:1.3rem] [color:#8a8ea0] [text-decoration:underline] [text-underline-offset:0.3em] [.prob--solo_&]:[grid-column:2] [.prob--solo_&]:[justify-self:start] [.prob--solo_&]:[padding-bottom:1.6rem] [@media(max-width:_1279px)]:[.prob--solo_&]:[grid-column:1]" href={stat.href} target="_blank" rel="noopener noreferrer">Source: {stat.source}</a>
      </div>
      {withCalc && <motion.div className="calc [grid-column:3_/_span_2] [padding:4rem] [border-radius:3.2rem] [display:flex] [flex-direction:column] [gap:2.4rem] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[padding-right:0] [&>*]:[min-width:0] [&>*]:[max-width:100%] [@media(max-width:_1279px)]:[padding:3.2rem_2.4rem]! [background:linear-gradient(165deg,_#f4f0ff_0%,_#fbfaff_55%,_#fff_100%)] [color:var(--ink-2)] [border:1px_solid_var(--lav-border)] [box-shadow:0_3rem_8rem_-3rem_rgba(80,_40,_220,_0.18)]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <p className="calc__kicker [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)]">{calc.kicker}</p>
        {calc.fields.map((f) => {
          const v = vals[f.id];
          const id = `calc-${s.slug}-${f.id}`;
          return (
            <div className="calc__field [&_input]:[width:100%] [&_input]:[appearance:none] [&_input]:[-webkit-appearance:none] [&_input]:[height:0.6rem] [&_input]:[border-radius:1rem] [&_input]:[cursor:pointer] [&_input::-webkit-slider-thumb]:[-webkit-appearance:none] [&_input::-webkit-slider-thumb]:[width:2.4rem] [&_input::-webkit-slider-thumb]:[height:2.4rem] [&_input::-webkit-slider-thumb]:[border-radius:50%] [&_input::-webkit-slider-thumb]:[background:#fff] [&_input::-webkit-slider-thumb]:[border:0.5rem_solid_#8a6bff] [&_input::-webkit-slider-thumb]:[transition:transform_0.25s] [&_input:active::-webkit-slider-thumb]:[transform:scale(1.18)] [&_input::-moz-range-thumb]:[width:2.4rem] [&_input::-moz-range-thumb]:[height:2.4rem] [&_input::-moz-range-thumb]:[border-radius:50%] [&_input::-moz-range-thumb]:[background:#fff] [&_input::-moz-range-thumb]:[border:0.5rem_solid_#8a6bff] [&_input:focus-visible]:[outline:2px_solid_#fff] [&_input:focus-visible]:[outline-offset:6px]! [&_input]:[display:block] [&_input]:[min-width:0] [&_input]:[background:linear-gradient(90deg,_var(--purple)_var(--p),_#e6e0fb_var(--p))] [&_input::-webkit-slider-thumb]:[border-color:var(--purple)]! [&_input::-webkit-slider-thumb]:[box-shadow:0_0.4rem_1rem_rgba(106,_65,_249,_0.3)] [&_input::-moz-range-thumb]:[border-color:var(--purple)]! [&_input:focus-visible]:[outline-color:var(--purple)]!" key={f.id}>
              <div className="calc__row [display:flex] [justify-content:space-between] [font-size:1.6rem] [margin-bottom:1rem] [&_output]:[font-weight:600] [&_output]:[font-variant-numeric:tabular-nums] [color:#4a4f63] [&_output]:[color:var(--ink-2)]"><label htmlFor={id}>{f.label}</label><output htmlFor={id}>{fmt(v, f.fmt)}</output></div>
              <input id={id} type="range" min={f.min} max={f.max} step={f.step} value={v}
                onChange={(e) => setVals((o) => ({ ...o, [f.id]: Number(e.target.value) }))}
                style={{ ['--p' as string]: `${((v - f.min) / (f.max - f.min)) * 100}%` }} />
            </div>
          );
        })}
        <div className="calc__out [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:1.6rem] [padding-top:2.4rem] [border-top:1px_solid_rgba(255,_255,_255,_0.12)] [&_small]:[display:block] [&_small]:[font-size:1.35rem] [&_small]:[min-height:3.8rem] [&_b]:[display:block] [&_b]:[margin-top:0.6rem] [&_b]:[font-weight:600] [&_b]:[font-size:3rem] [&_b]:[font-variant-numeric:tabular-nums] [&_b]:[letter-spacing:-0.06rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [border-top-color:#e6e0fb]! [&_small]:[color:#6b6f7c] [&_b]:[color:var(--ink-2)]">
          {outs.map((o) => <div key={o.label}><small>{o.label}</small><b className={o.accent ? String.raw`accent [.tc\_\_delta_b&]:[color:var(--purple)] [.tc\_\_delta_b&]:[min-width:4ch] [.calc\_\_out_b&]:[color:var(--purple)]` : ''}>{fmt(o.value, o.fmt)}</b></div>)}
        </div>
        <p className="calc__how [font-size:1.3rem] [line-height:1.5] [color:#8a8ea0]">{calc.note}</p>
      </motion.div>}
    </section>
  );
}

/* ================= How we work it: step switcher + live document ================= */
function Document({ s, active }: { s: Pick<ServiceFull, 'doc' | 'steps'>; active: number }) {
  const step = s.steps[active];
  const stamps = s.steps.slice(0, active + 1).filter((x) => x.stamp).map((x) => x.stamp!);
  const stamp = stamps[stamps.length - 1];
  const fixes = new Map<number, string>();
  s.steps.slice(0, active + 1).forEach((x) => { if (x.fix) fixes.set(x.fix.row, x.fix.b); });
  const d = s.doc;
  return (
    <div className="doc [position:relative] [padding:3.6rem] [border-radius:1.6rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_rgba(40,_20,_120,_0.1),_0_0.2rem_0_#ece8fa] [font-family:var(--f-man)] [color:#23243a] [background-image:linear-gradient(180deg,_#fff_0,_#fff_100%)]! [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0.8rem] [&::before]:[border-radius:1rem] [&::before]:[border:1px_dashed_#f0edf8] [&::before]:[pointer-events:none] [@media(max-width:_1279px)]:[padding:2rem] [@media(max-width:_1279px)]:[transform:scale(1)] [@media(max-width:_1279px)]:[.hw2_&]:[padding:2rem]">
      <div className="doc__head [display:flex] [justify-content:space-between] [gap:2rem] [padding-bottom:2rem] [border-bottom:2px_solid_#23243a] [&_b]:[display:block] [&_b]:[font-weight:800] [&_b]:[font-size:2rem] [&_b]:[letter-spacing:-0.02rem] [&_small]:[font-size:1.3rem] [&_small]:[color:#6b6f7c] [@media(max-width:_1279px)]:[.hw2_&]:[flex-direction:column] [@media(max-width:_1279px)]:[.hw2_&]:[gap:0.8rem] [@media(max-width:_1279px)]:[.hw2_&]:[padding-bottom:1.4rem]">
        <div><b>{d.org}</b><small>{d.title}</small></div>
        <div className="doc__meta [display:flex] [flex-direction:column] [align-items:flex-end] [font-family:var(--f-mono)] [font-size:1.2rem] [color:#6b6f7c] [gap:0.3rem] [@media(max-width:_1279px)]:[.hw2_&]:[flex-direction:row] [@media(max-width:_1279px)]:[.hw2_&]:[flex-wrap:wrap] [@media(max-width:_1279px)]:[.hw2_&]:[align-items:center] [@media(max-width:_1279px)]:[.hw2_&]:[gap:0.4rem_1.2rem]">{d.meta.map((m) => <span key={m}>{m}</span>)}</div>
      </div>
      <div className="doc__table [margin-top:1.6rem]">
        <div className="doc__tr doc__th [position:relative] [display:grid] [grid-template-columns:6.4rem_1fr_8rem_8rem_11rem] [gap:1.2rem] [align-items:center] [padding:1.4rem_1rem] [border-bottom:1px_solid_#f0edf8] [isolation:isolate] [font-family:var(--f-mono)] [font-size:1.1rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:#8a8ea0] [padding-top:0.6rem]! [padding-bottom:0.6rem]! [&_code]:[font-family:var(--f-mono)] [&_code]:[color:var(--purple)] [@media(max-width:_1279px)]:[grid-template-columns:5.4rem_1fr_7rem] [@media(max-width:_1279px)]:[.hw2_&]:[display:none] [@media(max-width:_1279px)]:[.hw2_&]:[grid-template-columns:5rem_minmax(0,_1fr)_auto] [@media(max-width:_1279px)]:[.hw2_&]:[row-gap:0.4rem] [@media(max-width:_1279px)]:[.hw2_&]:[padding:1.2rem_0.6rem]!"><span>{d.cols[0]}</span><span>{d.cols[1]}</span><span className="doc__num [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[display:none] [&.ok]:[color:#12a150] [&.ok]:[font-weight:600]">{d.cols[2]}</span><span className="doc__num [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[display:none] [&.ok]:[color:#12a150] [&.ok]:[font-weight:600]">{d.cols[3]}</span><span>{d.cols[4]}</span></div>
        {d.rows.map((l, i) => {
          const hot = step.line === i;
          const fixed = fixes.get(i);
          return (
            <div key={l.code + i} className={String.raw`doc__tr [position:relative] [display:grid] [grid-template-columns:6.4rem_1fr_8rem_8rem_11rem] [gap:1.2rem] [align-items:center] [padding:1.4rem_1rem] [font-size:1.35rem] [border-bottom:1px_solid_#f0edf8] [isolation:isolate] [&_code]:[font-family:var(--f-mono)] [&_code]:[color:var(--purple)] [@media(max-width:_1279px)]:[grid-template-columns:5.4rem_1fr_7rem] [@media(max-width:_1279px)]:[.hw2_&]:[grid-template-columns:5rem_minmax(0,_1fr)_auto] [@media(max-width:_1279px)]:[.hw2_&]:[row-gap:0.4rem] [@media(max-width:_1279px)]:[.hw2_&]:[padding:1.2rem_0.6rem] ${hot ? 'is-hot' : ''}`}>
              {hot && <motion.span layoutId="doc-hl" className="doc__hl [position:absolute] [inset:0.2rem_-0.4rem] [border-radius:0.8rem] [background:rgba(255,_214,_0,_0.32)] [z-index:-1]" transition={{ type: 'spring', stiffness: 260, damping: 30 }} />}
              <code>{l.code}</code><span>{l.desc}</span><span className="doc__num doc__a [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[display:none] [&.ok]:[color:#12a150] [&.ok]:[font-weight:600] [@media(max-width:_1279px)]:[.hw2_.doc\_\_tr>&]:[display:none]">{l.a}</span>
              <span className={String.raw`doc__num doc__b [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[display:none] [&.ok]:[color:#12a150] [&.ok]:[font-weight:600] [@media(max-width:_1279px)]:[.hw2_.doc\_\_tr>&]:[display:block] [@media(max-width:_1279px)]:[.hw2_.doc\_\_tr>&]:[font-weight:600] ${fixed ? String.raw`ok [.w-den\_\_st_&]:[background:var(--purple)] [.w-den\_\_st_&]:[color:#fff] [color:#12a150] [.mw_em&]:[background:#dcf5ea] [.mw\_\_row_em&]:[background:#dcf5ea] [.dq_li_em&]:[background:#dcf5ea] [.lf\_\_dg_small&]:[color:#18a058]` : ''}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={fixed ?? l.b} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>{fixed ?? l.b}</motion.span>
                </AnimatePresence>
              </span>
              <span className={String.raw`doc__reason [&_b]:[display:block] [&_b]:[font-family:var(--f-mono)] [&_b]:[font-size:1.3rem] [&_b]:[color:#d1435b] [&_small]:[font-size:1.15rem] [&_small]:[color:#8a8ea0] [&_b]:[transition:color_0.4s,_opacity_0.4s] [&.is-resolved_b]:[color:#12a150] [&.is-resolved_small]:[opacity:0.6] [&.is-ok_b]:[color:#12a150] [&.is-neutral_b]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2_.doc\_\_tr>&]:[grid-column:2_/_-1] [@media(max-width:_1279px)]:[.hw2_.doc\_\_tr>&]:[display:flex] [@media(max-width:_1279px)]:[.hw2_.doc\_\_tr>&]:[gap:0.8rem] [@media(max-width:_1279px)]:[.hw2_.doc\_\_tr>&]:[align-items:baseline] ${fixed ? 'is-resolved' : ''} ${l.tone ? `is-${l.tone}` : ''}`}><b>{l.flag}</b><small>{l.flagNote}</small></span>
            </div>
          );
        })}
      </div>
      <div className="doc__notes [min-height:9rem] [margin-top:2.4rem] [@media(max-width:_1279px)]:[padding-right:11rem] [@media(max-width:_1279px)]:[.hw2_&]:[min-height:7rem] [@media(max-width:_1279px)]:[.hw2_&]:[margin-top:1.6rem] [@media(max-width:_1279px)]:[.hw2_&]:[padding-right:10rem]">
        <AnimatePresence mode="wait">
          <motion.div key={active} className="doc__note [display:inline-flex] [flex-direction:column] [gap:0.4rem] [transform:rotate(-1deg)] [&_p]:[font-family:'Caveat',_'Segoe_Script',_'Bradley_Hand',_cursive] [&_p]:[font-size:2.6rem] [&_p]:[line-height:1.2] [&_p]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2_&_p]:[font-size:2.2rem]" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.45, ease: ease.out }}>
            <svg viewBox="0 0 200 12" className="doc__scribble [width:22rem] [height:1.4rem] [overflow:visible]" aria-hidden>
              <motion.path d="M2 8 C 40 2, 80 12, 120 6 S 180 4, 198 7" fill="none" stroke="#6a41f9" strokeWidth="2.4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.1 }} />
            </svg>
            <p>{step.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {stamp && (
          <motion.div key={stamp} className={String.raw`doc__stamp [position:absolute] [right:3.6rem] [bottom:3.2rem] [padding:0.8rem_2rem] [border:0.4rem_solid_var(--purple)] [border-radius:1rem] [font-family:var(--f-mono)] [font-weight:700] [font-size:2.6rem] [letter-spacing:0.2em] [color:var(--purple)] [mix-blend-mode:multiply] [&.is-paid]:[border-color:#12a150] [&.is-paid]:[color:#12a150] [@media(max-width:_1279px)]:[right:1.2rem] [@media(max-width:_1279px)]:[bottom:1.2rem] [@media(max-width:_1279px)]:[font-size:1.8rem] [@media(max-width:_1279px)]:[padding:0.6rem_1.2rem] ${['PAID', 'APPROVED', 'RECOVERED', 'ACCEPTED', 'ON TARGET'].includes(stamp) ? 'is-paid' : ''}`}
            initial={{ scale: 2.2, opacity: 0, rotate: -24 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}>{stamp}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const STEP_MS = 5200;
/**
 * No pinned scroll. Desktop: steps as a list on the left (active one opens with a progress line), document on the right.
 * Mobile: the document first, then numbered step tabs with prev/next under it, so the whole fold is about one screen.
 * Steps advance on their own while the fold is on screen; any click or tap takes over and stops the auto-advance.
 */
export function HowWeWork({ s }: { s: Pick<ServiceFull, 'doc' | 'steps' | 'how'> }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const secRef = useRef<HTMLElement>(null);
  const seen = useInView(secRef, { amount: 0.35 });
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const n = s.steps.length;
  const run = auto && seen && !reduce;
  useEffect(() => {
    if (!run) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), STEP_MS);
    return () => window.clearTimeout(t);
  }, [run, active, n]);
  const choose = (i: number) => { setAuto(false); setActive((i + n) % n); };
  const st = s.steps[active];
  return (
    <section className="hw hw2 [padding-top:14rem]" id="how" ref={secRef}>
      <div className="container hw__head [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:flex] [flex-direction:column] [gap:1.2rem]">
        <Eyebrow>{s.how.eyebrow}</Eyebrow>
        <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={s.how.lines} stagger={0.04} />
      </div>
      <div className="container hw2__grid [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:6.4rem] [margin-top:4.8rem] [align-items:start] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:2rem] [@media(max-width:_1279px)]:[margin-top:3.2rem]">
        <ol className="hw2__list [list-style:none] [display:flex] [flex-direction:column] [border-top:1px_solid_#ece8fa] [&_li]:[border-bottom:1px_solid_#ece8fa] [@media(max-width:_1279px)]:[display:none]" role="tablist" aria-label="Steps">
          {s.steps.map((x, i) => (
            <li key={x.title}>
              <button type="button" role="tab" aria-selected={active === i} className={String.raw`hw2__item [position:relative] [width:100%] [display:grid] [grid-template-columns:4.8rem_minmax(0,_1fr)] [column-gap:1.6rem] [align-items:baseline] [padding:2.4rem_0] [text-align:left] [color:var(--ink-2)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:4px]! [&:focus-visible]:[border-radius:0.8rem] ${active === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => choose(i)}>
                <span className="hw2__n [font-family:var(--f-mono)] [font-size:1.4rem] [color:#b6b1c9] [transition:color_0.4s] [.hw2\_\_item.is-on_&]:[color:var(--purple)]">0{i + 1}</span>
                <span className="hw2__t [font-weight:500] [font-size:2.6rem] [line-height:1.2] [letter-spacing:-0.04rem] [color:#9c97b3] [transition:color_0.4s] [.hw2\_\_item:hover_&]:[color:#5b5f72] [.hw2\_\_item.is-on_&]:[color:var(--ink-2)]">{x.title}</span>
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.span className="hw2__body [grid-column:2] [overflow:hidden] [display:block] [&_span]:[display:block] [&_span]:[padding-top:1.2rem] [&_span]:[font-size:1.7rem] [&_span]:[line-height:1.6] [&_span]:[color:#4a4f63] [&_span]:[max-width:56rem]" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                      <span>{x.body}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
                {active === i && <motion.i key={`${active}-${run}`} className="hw2__bar [position:absolute] [left:0] [right:0] [bottom:-1px] [height:2px] [background:var(--purple)] [transform-origin:left_center]" initial={{ scaleX: 0 }} animate={{ scaleX: run ? 1 : 0 }} transition={{ duration: run ? STEP_MS / 1000 : 0, ease: 'linear' }} aria-hidden />}
              </button>
            </li>
          ))}
        </ol>
        <div className="hw2__doc [position:relative]"><Document s={s} active={active} /></div>
        <div className="hw2__mob [display:none] [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:1.6rem]">
          <div className="hw2__tabs [@media(max-width:_1279px)]:[display:grid] [@media(max-width:_1279px)]:[grid-template-columns:repeat(5,_minmax(0,_1fr))] [@media(max-width:_1279px)]:[gap:0.6rem] [@media(max-width:_1279px)]:[padding:0.5rem] [@media(max-width:_1279px)]:[border-radius:1.6rem] [@media(max-width:_1279px)]:[background:#f6f3ff] [@media(max-width:_1279px)]:[&_button]:[height:4.4rem] [@media(max-width:_1279px)]:[&_button]:[border-radius:1.2rem] [@media(max-width:_1279px)]:[&_button]:[font-family:var(--f-mono)] [@media(max-width:_1279px)]:[&_button]:[font-size:1.4rem] [@media(max-width:_1279px)]:[&_button]:[color:#8a8ea0] [@media(max-width:_1279px)]:[&_button]:[transition:background_0.3s,_color_0.3s]" role="tablist" aria-label="Steps">
            {s.steps.map((x, i) => (
              <button key={x.title} type="button" role="tab" aria-selected={active === i} aria-label={x.title} className={active === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => choose(i)}>0{i + 1}</button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} className="hw2__card [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [@media(max-width:_1279px)]:[min-height:15rem] [@media(max-width:_1279px)]:[&_h3]:[font-weight:500] [@media(max-width:_1279px)]:[&_h3]:[font-size:2.4rem] [@media(max-width:_1279px)]:[&_h3]:[line-height:1.2] [@media(max-width:_1279px)]:[&_h3]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[&_p]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[&_p]:[font-size:1.6rem] [@media(max-width:_1279px)]:[&_p]:[line-height:1.6] [@media(max-width:_1279px)]:[&_p]:[color:#4a4f63]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: ease.out }}>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </motion.div>
          </AnimatePresence>
          <div className="hw2__nav [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[align-items:center] [@media(max-width:_1279px)]:[justify-content:space-between] [@media(max-width:_1279px)]:[&_span]:[font-family:var(--f-mono)] [@media(max-width:_1279px)]:[&_span]:[font-size:1.3rem] [@media(max-width:_1279px)]:[&_span]:[color:#8a8ea0] [@media(max-width:_1279px)]:[&_button]:[width:4.4rem] [@media(max-width:_1279px)]:[&_button]:[height:4.4rem] [@media(max-width:_1279px)]:[&_button]:[border-radius:50%] [@media(max-width:_1279px)]:[&_button]:[display:grid] [@media(max-width:_1279px)]:[&_button]:[place-items:center] [@media(max-width:_1279px)]:[&_button]:[border:1px_solid_#e2dbf8] [@media(max-width:_1279px)]:[&_button]:[color:var(--purple)]">
            <button type="button" onClick={() => choose(active - 1)} aria-label="Previous step"><ChevronLeft size={18} /></button>
            <span>Step {active + 1} of {n}</span>
            <button type="button" onClick={() => choose(active + 1)} aria-label="Next step"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Problem → what we do: one connected, centred fold =================
   Breaks the left-copy / right-visual rhythm of the folds around it. The stat sits centred in a soft
   lavender panel, a line drops from it to a "what we do about it" node, and the work order opens
   underneath as a wide ticket with the scope as chips (any count wraps cleanly). */
function ProblemWork({ s }: { s: ServiceFull }) {
  const { stat, ticket } = s;
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.35 });
  const big = `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`;
  return (
    <section className="pw container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1279px)]:[padding-top:8rem]" id="what-we-do">
      <div className="pw__panel [position:relative] [display:flex] [flex-direction:column] [align-items:center] [text-align:center] [padding:8.8rem_8rem_8rem] [border-radius:4rem] [background:linear-gradient(180deg,_#f7f4ff_0%,_#fbfaff_55%,_#f4f0ff_100%)] [border:1px_solid_#eee9ff] [@media(max-width:_1279px)]:[padding:5.6rem_2rem_2rem] [@media(max-width:_1279px)]:[border-radius:3.2rem]">
        <div className="pw__stat [display:flex] [flex-direction:column] [align-items:center] [gap:1.6rem]">
          <Eyebrow>/ The problem, in numbers</Eyebrow>
          <p className={String.raw`prob__big pw__big [font-weight:500] [font-size:22rem] [line-height:0.9] [letter-spacing:-0.8rem] [color:var(--purple)] [@media(max-width:_1279px)]:[font-size:14rem] [&.is-long]:[font-size:17rem] [&.is-long]:[letter-spacing:-0.6rem] [&.is-xlong]:[font-size:14rem] [&.is-xlong]:[letter-spacing:-0.5rem] [@media(max-width:_1279px)]:[&.is-long]:[font-size:11rem] [@media(max-width:_1279px)]:[&.is-xlong]:[font-size:9rem] [.prob--solo_&]:[grid-row:2_/_span_2] [@media(max-width:_1279px)]:[.prob--solo_&]:[grid-row:auto] [.prob--solo_&]:[padding-bottom:1.2rem] [padding-bottom:0.8rem] ${big.length > 4 ? 'is-long' : ''} ${big.length > 6 ? 'is-xlong' : ''}`}>
            <CountUp value={stat.value} decimals={stat.decimals ?? 0} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} duration={1.6} />
          </p>
          <Reveal as="p" className="pw__label [max-width:72rem] [font-weight:500] [font-size:2.8rem] [line-height:1.3] [letter-spacing:-0.04rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:2.2rem]">{stat.label}</Reveal>
          <a className="prob__src [font-family:var(--f-mono)] [font-size:1.3rem] [color:#8a8ea0] [text-decoration:underline] [text-underline-offset:0.3em] [.prob--solo_&]:[grid-column:2] [.prob--solo_&]:[justify-self:start] [.prob--solo_&]:[padding-bottom:1.6rem] [@media(max-width:_1279px)]:[.prob--solo_&]:[grid-column:1]" href={stat.href} target="_blank" rel="noopener noreferrer">Source: {stat.source}</a>
        </div>

        <div className="pw__link [position:relative] [display:flex] [flex-direction:column] [align-items:center] [height:14rem] [margin-top:3.2rem] [@media(max-width:_1279px)]:[height:9rem] [@media(max-width:_1279px)]:[margin-top:2.4rem]" aria-hidden>
          <motion.i className="pw__line [display:block] [width:1px] [flex:1] [background:linear-gradient(180deg,_rgba(106,_65,_249,_0),_var(--purple))] [transform-origin:top_center]" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={vp} transition={{ duration: 0.9, ease: ease.inOut }} />
          <motion.span className="pw__node [width:4.8rem] [height:4.8rem] [border-radius:50%] [display:grid] [place-items:center] [background:var(--purple)] [color:#fff] [box-shadow:0_0_0_0.8rem_rgba(106,_65,_249,_0.1)] [&_svg]:[width:2rem] [&_svg]:[height:2rem] [&_svg]:[rotate:90deg]" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={vp} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.7 }}><ArrowRight /></motion.span>
        </div>

        <div className="pw__head [display:flex] [flex-direction:column] [align-items:center] [gap:1.2rem] [margin-top:3.2rem]">
          <Eyebrow>/ What we do</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Everything on the work order.']} stagger={0.04} />
          <Reveal as="p" className="body-18 [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]">{ticket.intro}</Reveal>
        </div>

        <motion.div ref={ref} className="pw__ticket [position:relative] [width:100%] [max-width:112rem] [margin-top:4.8rem] [padding:3.6rem_4rem_3.2rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_rgba(40,_20,_120,_0.08)] [text-align:left] [@media(max-width:_1279px)]:[padding:2.8rem_2rem_2.4rem] [@media(max-width:_1279px)]:[margin-top:3.2rem]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
          <div className="tk__perf [position:absolute] [left:2.4rem] [right:2.4rem] [top:-0.6rem] [height:1.2rem] [background:radial-gradient(circle_at_0.6rem_0.6rem,_#fff_0.45rem,_transparent_0.5rem)_0_0_/_2rem_1.2rem_repeat-x]" aria-hidden />
          <div className="pw__top [display:flex] [justify-content:space-between] [gap:2rem] [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:0.4rem]"><span>Work order · {s.name}</span><code>{ticket.code}</code></div>
          <ul className="pw__scope [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [display:flex] [flex-wrap:wrap] [justify-content:center] [gap:1.2rem] [margin-top:2.8rem] [padding-bottom:2.8rem] [border-bottom:1px_dashed_#e2def0] [&_li]:[display:inline-flex] [&_li]:[align-items:center] [&_li]:[gap:1rem] [&_li]:[padding:1rem_1.6rem_1rem_1.2rem] [&_li]:[border-radius:1.4rem] [&_li]:[background:#f8f6ff] [&_li]:[border:1px_solid_#eee9ff] [&_li]:[font-size:1.6rem] [&_li]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[justify-content:flex-start] [@media(max-width:_1279px)]:[&_li]:[width:100%]">
            {ticket.scope.map((t, i) => (
              <li key={t}>
                <motion.span className="tk__box [width:2.4rem] [height:2.4rem] [flex-shrink:0] [border-radius:0.6rem] [border:2px_solid_#d9d4ee] [display:grid] [place-items:center]" initial={false} animate={on ? { background: '#6a41f9', borderColor: '#6a41f9' } : {}} transition={{ delay: 0.3 + i * 0.1 }}>
                  <motion.svg viewBox="0 0 16 16" width="14" height="14"><motion.path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ delay: 0.35 + i * 0.1, duration: 0.3 }} /></motion.svg>
                </motion.span>{t}
              </li>
            ))}
          </ul>
          <dl className="pw__meta [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2rem] [margin-top:2.4rem] [&>div+div]:[padding-left:2rem] [&>div+div]:[border-left:1px_solid_#f0edf8] [&_dt]:[font-family:var(--f-mono)] [&_dt]:[font-size:1.2rem] [&_dt]:[letter-spacing:0.06em] [&_dt]:[text-transform:uppercase] [&_dt]:[color:#8a8ea0] [&_dd]:[margin-top:0.6rem] [&_dd]:[font-size:1.6rem] [&_dd]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_1279px)]:[&>div+div]:[padding-left:0] [@media(max-width:_1279px)]:[&>div+div]:[border-left:0] [@media(max-width:_1279px)]:[&>div+div]:[padding-top:1.6rem] [@media(max-width:_1279px)]:[&>div+div]:[border-top:1px_solid_#f0edf8]">
            <div><dt>Owner</dt><dd>{ticket.owner}</dd></div>
            <div><dt>Reporting</dt><dd>{ticket.reporting}</dd></div>
            <div><dt>Turnaround</dt><dd>{ticket.turnaround}</dd></div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= What's included: work ticket ================= */
function Ticket({ s }: { s: ServiceFull }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="tk container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [column-gap:2.4rem] [padding-top:14rem] [align-items:center] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[row-gap:3.2rem]">
      <div className="tk__head [grid-column:1_/_span_2] [display:flex] [flex-direction:column] [gap:1.2rem] [padding-right:6rem] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[padding-right:0]">
        <Eyebrow>/ What we do</Eyebrow>
        <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Everything on', 'the work order.']} />
        <Reveal as="p" className="body-18 [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]">{s.ticket.intro}</Reveal>
      </div>
      <motion.div ref={ref} className="tk__card [grid-column:3_/_span_2] [position:relative] [padding:4rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_rgba(40,_20,_120,_0.1)] [&_h3]:[margin-top:1.2rem] [&_h3]:[font-weight:500] [&_h3]:[font-size:3.2rem] [&_h3]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[padding-right:0]" initial={{ opacity: 0, y: 50, rotate: 1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <div className="tk__top [display:flex] [justify-content:space-between] [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:#8a8ea0]"><span>Work order</span><code>{s.ticket.code}</code></div>
        <h3>{s.name}</h3>
        <ul className="tk__scope [display:grid] [grid-template-columns:1fr_1fr] [gap:1.4rem_2.4rem] [margin-top:2.8rem] [padding-bottom:2.8rem] [border-bottom:1px_dashed_#e2def0] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:1.2rem] [&_li]:[font-size:1.7rem] [&_li]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
          {s.ticket.scope.map((t, i) => (
            <li key={t}>
              <motion.span className="tk__box [width:2.4rem] [height:2.4rem] [flex-shrink:0] [border-radius:0.6rem] [border:2px_solid_#d9d4ee] [display:grid] [place-items:center]" initial={false} animate={on ? { background: '#6a41f9', borderColor: '#6a41f9' } : {}} transition={{ delay: 0.3 + i * 0.12 }}>
                <motion.svg viewBox="0 0 16 16" width="14" height="14"><motion.path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ delay: 0.35 + i * 0.12, duration: 0.3 }} /></motion.svg>
              </motion.span>{t}
            </li>
          ))}
        </ul>
        <dl className="tk__meta [display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:2rem] [margin-top:2.4rem] [&_dt]:[font-family:var(--f-mono)] [&_dt]:[font-size:1.2rem] [&_dt]:[letter-spacing:0.06em] [&_dt]:[text-transform:uppercase] [&_dt]:[color:#8a8ea0] [&_dd]:[margin-top:0.6rem] [&_dd]:[font-size:1.6rem] [&_dd]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
          <div><dt>Owner</dt><dd>{s.ticket.owner}</dd></div>
          <div><dt>Reporting</dt><dd>{s.ticket.reporting}</dd></div>
          <div><dt>Turnaround</dt><dd>{s.ticket.turnaround}</dd></div>
        </dl>
        <div className="tk__perf [position:absolute] [left:2.4rem] [right:2.4rem] [top:-0.6rem] [height:1.2rem] [background:radial-gradient(circle_at_0.6rem_0.6rem,_#fff_0.45rem,_transparent_0.5rem)_0_0_/_2rem_1.2rem_repeat-x]" aria-hidden />
      </motion.div>
    </section>
  );
}

/* ================= Journey rail: the hub's claim route, with this service's stop lit ================= */
const R_PATH = 'M0 70 C 140 70 170 24 300 24 S 460 116 600 116 S 760 24 900 24 S 1060 116 1200 116 S 1360 70 1500 70';
const R_STOPS = [0.1, 0.3, 0.5, 0.7, 0.9];
function Rail({ s }: { s: ServiceFull }) {
  const ref = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const el = path.current; if (!el) return; const L = el.getTotalLength();
    setPts(R_STOPS.map((t) => { const q = el.getPointAtLength(L * t); return { x: q.x, y: q.y }; }));
  }, []);
  const here = s.station; // 0 = spans every stop (RCM, audits)
  const fill = here ? R_STOPS[here - 1] : 1;
  const idx = SERVICES.findIndex((x) => x.slug === s.slug);
  const prev = SERVICES[(idx + SERVICES.length - 1) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];
  return (
    <section className="rail container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]" ref={ref}>
      <div className="rail__board [padding:5.6rem] [border-radius:4rem] [border:1px_solid_var(--lav-border)] [background:linear-gradient(180deg,_#fbfaff,_#fff_70%)] [@media(max-width:_1279px)]:[padding:3.2rem_2rem] [@media(max-width:_1279px)]:[border-radius:2.8rem]">
        <div className="rail__head [display:flex] [justify-content:space-between] [align-items:baseline] [gap:2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:1rem]">
          <Eyebrow>/ Where this sits in the claim’s journey</Eyebrow>
          <p className="rail__where [font-size:2rem] [color:#5b5f72] [&_b]:[font-weight:500] [&_b]:[color:var(--purple)]">{here ? <>Stop 0{here} of 05 · <b>{STATIONS[here - 1].name}</b></> : <>Covers <b>all five stops</b>, visit to cash</>}</p>
        </div>
        <div className="rail__route [position:relative] [margin:7rem_2rem_8rem] [&_svg]:[display:block] [&_svg]:[width:100%] [&_svg]:[height:auto] [&_svg]:[overflow:visible] [@media(max-width:_1279px)]:[margin:5rem_0_6rem]">
          <svg viewBox="0 0 1500 140" aria-hidden>
            <defs><linearGradient id="rl-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1500" y2="0"><stop offset="0" stopColor="#b7a3ff" /><stop offset="1" stopColor="#6a41f9" /></linearGradient></defs>
            <path ref={path} d={R_PATH} fill="none" stroke="#e2dafc" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
            <motion.path d={R_PATH} fill="none" stroke="url(#rl-g)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: on ? fill : 0 }} transition={{ duration: 1.8, ease: ease.inOut }} />
          </svg>
          {pts.map((pt, i) => {
            const n = i + 1; const isHere = here === n || here === 0;
            return (
              <span key={i} className={String.raw`rail__node [will-change:transform] [position:absolute] [translate:-50%_-50%] [display:grid] [place-items:center] [&>i]:[width:1.8rem] [&>i]:[height:1.8rem] [&>i]:[border-radius:50%] [&>i]:[background:#fff] [&>i]:[border:2px_solid_#d6cdf7] [&.is-past>i]:[background:#b7a3ff] [&.is-past>i]:[border-color:#b7a3ff] [&.is-here>i]:[background:var(--purple)] [&.is-here>i]:[border-color:var(--purple)] [&.is-here>i]:[box-shadow:0_0_0_0.8rem_rgba(106,_65,_249,_0.14)] [&.is-here>i]:[animation:rl-pulse_2s_ease-in-out_infinite] ${isHere ? 'is-here' : ''} ${here && n < here ? 'is-past' : ''}`} style={{ left: `${(pt.x / 1500) * 100}%`, top: `${(pt.y / 140) * 100}%` }}>
                <motion.i initial={{ scale: 0 }} animate={on ? { scale: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 + i * 0.15 }} />
                <span className={String.raw`rail__lab [position:absolute] [top:3rem] [display:flex] [flex-direction:column] [align-items:center] [gap:0.4rem] [text-align:center] [width:22rem] [&.is-up]:[top:auto] [&.is-up]:[bottom:3rem] [&_b]:[font-family:var(--f-mono)] [&_b]:[font-weight:400] [&_b]:[font-size:1.3rem] [&_b]:[letter-spacing:0.06em] [&_b]:[text-transform:uppercase] [&_b]:[color:#a29cbc] [&_small]:[font-size:1.4rem] [&_small]:[color:#8a8ea0] [.rail\_\_node.is-here_&_b]:[color:var(--purple)] [.rail\_\_node.is-here_&_small]:[color:var(--ink-2)] [.rail\_\_node.is-here_&_small]:[font-weight:500] [@media(max-width:_1279px)]:[width:9rem] [@media(max-width:_1279px)]:[&_small]:[display:none] [@media(max-width:_640px)]:[&_small]:[display:none] [@media(max-width:_640px)]:[.rail\_\_node:not(.is-here)_&_b]:[font-size:1rem] [@media(max-width:_640px)]:[width:9rem] [@media(max-width:_640px)]:[.rail\_\_node:not(.is-here)_&]:[display:none] ${pt.y < 70 ? String.raw`is-up [.jy\_\_node_small&]:[top:auto] [.jy\_\_node_small&]:[bottom:2.6rem]` : ''}`}><b>{STATIONS[i].short}</b><small>{SERVICES.filter((x) => x.station === n).map((x) => x.name).join(' · ')}</small></span>
              </span>
            );
          })}
        </div>
        <div className="rail__nav [display:flex] [justify-content:space-between] [gap:2.4rem] [margin-top:4.8rem] [@media(max-width:_1279px)]:[flex-direction:column] [.rail\_\_board_&]:[margin-top:0]">
          <Link to={`/services/${prev.slug}`} className="rail__link [flex:1] [display:flex] [flex-direction:column] [gap:0.6rem] [padding:2.4rem_2.8rem] [border-radius:2rem] [border:1px_solid_#ece8fa] [transition:background_0.3s,_border-color_0.3s] [&:hover]:[background:var(--panel)] [&:hover]:[border-color:#d9d1fb] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_b]:[display:inline-flex] [&_b]:[align-items:center] [&_b]:[gap:0.6rem] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[color:var(--ink-2)]"><small>Before this</small><b><ChevronLeft size={18} /> {prev.name}</b></Link>
          <Link to={`/services/${next.slug}`} className="rail__link rail__link--next [flex:1] [display:flex] [flex-direction:column] [gap:0.6rem] [padding:2.4rem_2.8rem] [border-radius:2rem] [border:1px_solid_#ece8fa] [transition:background_0.3s,_border-color_0.3s] [&:hover]:[background:var(--panel)] [&:hover]:[border-color:#d9d1fb] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_b]:[display:inline-flex] [&_b]:[align-items:center] [&_b]:[gap:0.6rem] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[color:var(--ink-2)] [align-items:flex-end] [text-align:right] [@media(max-width:_1279px)]:[align-items:flex-start] [@media(max-width:_1279px)]:[text-align:left]"><small>After this</small><b>{next.name} <ArrowRight size={18} /></b></Link>
        </div>
      </div>
    </section>
  );
}

export function ServicePage({ slug }: { slug: string }) {
  const s = getService(slug);
  const faqs = useMemo(() => searchFaqs({ name: s.name, kind: 'service', faqs: s.faqs }), [s]);
  useEffect(() => {
    document.title = `${s.seoTitle} · Affinity Core`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', s.seoDescription);
    setJsonLd(pageJsonLd({ name: s.name, description: s.seoDescription, path: `/services/${s.slug}`, crumb: ['Services', '/services'], faqs }));
    return () => setJsonLd(null);
  }, [s, faqs]);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <Hero s={s} />
      <IntroBlock d={serviceIntro(s)} />
      <ProblemWork s={s} />
      <HowWeWork s={s} />
      <EhrStrip what={s.name.toLowerCase()} />
      <SpecialtyChips service={s.name} />
      <MidCta title={`See what better ${s.name.toLowerCase()} is worth to you.`} body="We’ll review a month of your claims and show you the dollars, line by line. Free, no contract." />
      <Rail s={s} />
      <Proof service={s.slug} />
      <PageGuide g={serviceGuide(s)} />
      <Assessment formFirst calc={s.calc} source={`service:${s.slug}`} />
      <FAQ items={faqs} eyebrow={`/ ${s.name} FAQs`} lines={s.faqLines} />
      <CTA eyebrow={s.closing.eyebrow} lines={s.closing.lines} />
    </main>
  );
}
