'use client';
import { IntroBlock, specialtyIntro } from '../components/IntroBlock';
import { PageGuide, specialtyGuide } from '../components/PageGuide';
import { HeroCapture } from '../components/HeroCapture';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, Check, ChevronLeft, ExternalLink } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { CTA, FAQ } from '../sections/Closing';
import { SIGNATURE } from '../components/SpecialtyWidgets';
import { ART, LedgerArt } from '../components/SpecialtyArt';
import { Assessment } from '../sections/Assessment';
import { Problem, HowWeWork } from './ServicePage';
import { Handle, LeakList, AlsoBilled } from '../components/SpecialtySimple';
import { LeakFall, TwoClaims } from '../components/SpecialtyFolds';
import { Included, EhrStrip, SpecialtyReads, TrustRow, MidCta, Switching } from '../components/ChildFolds';
import { Proof } from './ServicesHub';
import { searchFaqs, pageJsonLd, setJsonLd } from '../data/seo';
import { Link } from '../router';
import { getSpecialty, getSpecialtyLite, type SpecialtyFull, type AuthReq, type Wave, type SpPhoto } from '../data/specialties';
import { ease } from '../motion';
import h1 from '../assets/hero-1.jpg';
import h2 from '../assets/hero-2.jpg';
import h3 from '../assets/hero-3.jpg';
import docPhoto from '../assets/form-doctor.jpg';
import imaging from '../assets/case-imaging-desk.jpg';
import billing from '../assets/case-billing-desk.jpg';
import coder from '../assets/case-coder-desk.jpg';
import scrubs from '../assets/case-scrubs-desk.jpg';
const PHOTOS: Record<SpPhoto, string> = { h1, h2, h3, doc: docPhoto, imaging, billing, coder, scrubs };
/** Licensed Envato photos, one per specialty (Strapi: specialty.heroImage). Falls back to the shared set. */
const SP_IMG: Record<string, string> = { 'allergy-and-immunology': sp_0, 'ambulatory-surgery-centers': sp_1, 'anesthesia': sp_2, 'case-ortho': sp_3, 'contact': sp_4, 'dermatology': sp_5, 'gastroenterology': sp_6, 'internal-medicine': sp_7, 'mental-health': sp_8, 'nephrology': sp_9, 'neurology': sp_10, 'obstetrics-and-gynecology': sp_11, 'oncology': sp_12, 'ophthalmology': sp_13, 'orthopedics': sp_14, 'pain-management': sp_15, 'pathology': sp_16, 'pediatrics': sp_17, 'podiatry': sp_18, 'psychiatry': sp_19, 'radiology': sp_20, 'urgent-care': sp_21, 'urology': sp_22, 'wound-care': sp_23 };
/** Focal point per photo so the subject clears the widget (bottom-left) and the chip (top). */
const SP_POS: Record<string, string> = {
  'allergy-and-immunology': '68% 30%', 'gastroenterology': '30% 55%', 'internal-medicine': '45% 30%', 'nephrology': '50% 40%',
  'neurology': '55% 20%', 'psychiatry': '72% 40%', 'urology': '38% 35%', 'radiology': '55% 40%', 'pain-management': '50% 35%',
  'podiatry': '40% 50%', 'wound-care': '45% 40%', 'pediatrics': '55% 35%', 'ambulatory-surgery-centers': '45% 35%',
  'dermatology': '62% 40%', 'oncology': '55% 55%', 'ophthalmology': '62% 30%', 'anesthesia': '60% 30%',
};
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';
import sp_0 from '../assets/sp/allergy-and-immunology.webp';
import sp_1 from '../assets/sp/ambulatory-surgery-centers.webp';
import sp_2 from '../assets/sp/anesthesia.webp';
import sp_3 from '../assets/sp/case-ortho.webp';
import sp_4 from '../assets/sp/contact.webp';
import sp_5 from '../assets/sp/dermatology.webp';
import sp_6 from '../assets/sp/gastroenterology.webp';
import sp_7 from '../assets/sp/internal-medicine.webp';
import sp_8 from '../assets/sp/mental-health.webp';
import sp_9 from '../assets/sp/nephrology.webp';
import sp_10 from '../assets/sp/neurology.webp';
import sp_11 from '../assets/sp/obstetrics-and-gynecology.webp';
import sp_12 from '../assets/sp/oncology.webp';
import sp_13 from '../assets/sp/ophthalmology.webp';
import sp_14 from '../assets/sp/orthopedics.webp';
import sp_15 from '../assets/sp/pain-management.webp';
import sp_16 from '../assets/sp/pathology.webp';
import sp_17 from '../assets/sp/pediatrics.webp';
import sp_18 from '../assets/sp/podiatry.webp';
import sp_19 from '../assets/sp/psychiatry.webp';
import sp_20 from '../assets/sp/radiology.webp';
import sp_21 from '../assets/sp/urgent-care.webp';
import sp_22 from '../assets/sp/urology.webp';
import sp_23 from '../assets/sp/wound-care.webp';

/* ================= Hero: claims coded on the beat ================= */
const BEAT_W = 120;
/** One "beat" per claim, drawn in the specialty's own rhythm (80px tall, 120px per beat). */
function wavePath(w: Wave, n: number) {
  if (w === 'ecg') return ecgPath(n);
  let d = 'M0 52';
  for (let i = 0; i < n; i++) {
    const x = i * BEAT_W;
    if (w === 'eeg') d += ` C${x + 10} 30 ${x + 20} 70 ${x + 30} 46 C${x + 38} 28 ${x + 46} 62 ${x + 56} 40 C${x + 64} 22 ${x + 74} 66 ${x + 84} 50 C${x + 94} 36 ${x + 106} 58 ${x + BEAT_W} 52`;
    else if (w === 'flow') d += ` C${x + 30} 52 ${x + 30} 14 ${x + 60} 14 C${x + 90} 14 ${x + 90} 52 ${x + BEAT_W} 52`;
    else if (w === 'steps') d += ` L${x + 24} 52 L${x + 24} 30 L${x + 52} 30 L${x + 52} 12 L${x + 78} 12 L${x + 78} 40 L${x + 98} 40 L${x + 98} 52 L${x + BEAT_W} 52`;
    else if (w === 'scan') d += ` L${x + 20} 52 L${x + 30} 18 L${x + 36} 52 L${x + 52} 52 L${x + 60} 28 L${x + 66} 52 L${x + 80} 52 L${x + 86} 38 L${x + 92} 52 L${x + BEAT_W} 52`;
    else d += ` L${x + 36} 52 C${x + 44} 52 ${x + 48} 20 ${x + 60} 20 C${x + 72} 20 ${x + 76} 52 ${x + 84} 52 L${x + BEAT_W} 52`;
  }
  return d;
}
function ecgPath(n: number) {
  let d = 'M0 52';
  for (let i = 0; i < n; i++) {
    const x = i * BEAT_W;
    d += ` L${x + 18} 52 C${x + 22} 52 ${x + 24} 44 ${x + 30} 44 C${x + 36} 44 ${x + 38} 52 ${x + 42} 52`
      + ` L${x + 50} 52 L${x + 54} 60 L${x + 60} 8 L${x + 66} 70 L${x + 70} 52`
      + ` L${x + 80} 52 C${x + 86} 52 ${x + 88} 38 ${x + 96} 38 C${x + 104} 38 ${x + 106} 52 ${x + 112} 52 L${x + BEAT_W} 52`;
  }
  return d;
}

function BeatStrip({ s }: { s: SpecialtyFull }) {
  const n = s.beats.length;
  const [k, setK] = useState(0); // beats coded so far
  useEffect(() => { const id = setInterval(() => setK((v) => (v + 1) % (n + 2)), 1400); return () => clearInterval(id); }, [n]);
  const done = Math.min(k, n);
  const W = n * BEAT_W;
  const d = wavePath(s.wave, n);
  return (
    <div className="ecg w-card w-glass [border-radius:2.17rem] [border:1.5px_solid_rgba(255,_255,_255,_0.7)] [background:linear-gradient(168deg,_rgba(255,_255,_255,_0.85)_8%,_rgba(242,_240,_255,_0.74)_92%)] [box-shadow:0_1.55rem_4.66rem_rgba(128,_70,_251,_0.35),_inset_0_1.5px_0_rgba(255,_255,_255,_0.9)] [backdrop-filter:blur(2.5rem)] [font-family:var(--f-man)] [color:#0d0c15] [padding:2.4rem]">
      <div className="ecg__head [display:flex] [justify-content:space-between] [align-items:baseline] [font-size:1.5rem] [color:#575568] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.8rem] [&_span_i]:[width:0.7rem] [&_span_i]:[height:0.7rem] [&_span_i]:[border-radius:50%] [&_span_i]:[background:var(--purple)] [&_span_i]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.16)] [&_span_i]:[animation:jy-pulse-p_1.4s_ease-in-out_infinite] [&_b]:[font-weight:700] [&_b]:[font-size:2.6rem] [&_b]:[color:#0d0c15] [&_b]:[font-variant-numeric:tabular-nums] [&_b_small]:[font-weight:500] [&_b_small]:[font-size:1.3rem] [&_b_small]:[color:#575568]"><span><i />Today’s {(s.short ?? s.name).toLowerCase()} claims</span><b>{done}<small> / {n} coded</small></b></div>
      <div className="ecg__trace [position:relative] [height:9.6rem] [margin:1.6rem_-0.4rem_0.8rem] [border-radius:1.2rem] [background-color:rgba(255,_255,_255,_0.6)] [background-image:linear-gradient(rgba(106,_65,_249,_0.08)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(106,_65,_249,_0.08)_1px,_transparent_1px)] [background-size:1.2rem_1.2rem] [&_svg]:[position:absolute] [&_svg]:[inset:0.8rem_0_2.4rem] [&_svg]:[width:100%] [&_svg]:[height:calc(100%_-_3.2rem)] [&_svg]:[overflow:visible]">
        <svg viewBox={`0 0 ${W} 80`} preserveAspectRatio="none" aria-hidden>
          <path d={d} fill="none" stroke="#e3dcff" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <motion.path d={d} fill="none" stroke="#6a41f9" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }} animate={{ pathLength: done / n }} transition={{ duration: done === 0 ? 0 : 1.2, ease: 'linear' }} />
        </svg>
        <div className="ecg__ticks [position:absolute] [inset:0] [&_span]:[position:absolute] [&_span]:[bottom:0.4rem] [&_span]:[translate:-50%_0] [&_code]:[display:block] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.1rem] [&_code]:[color:var(--purple)] [&_code]:[background:#fff] [&_code]:[border-radius:0.5rem] [&_code]:[padding:0.1rem_0.5rem] [&_code]:[box-shadow:0_0.4rem_1rem_rgba(106,_65,_249,_0.15)]">
          {s.beats.map((b, i) => (
            <span key={b.code + i} className={i < done ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} style={{ left: `${((i * BEAT_W + 60) / W) * 100}%` }}>
              <AnimatePresence>{i < done && <motion.code initial={{ opacity: 0, y: 8, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>{b.code}</motion.code>}</AnimatePresence>
            </span>
          ))}
        </div>
      </div>
      <ul className="ecg__rows [&_li]:[display:grid] [&_li]:[grid-template-columns:6.4rem_1fr_auto] [&_li]:[gap:1.2rem] [&_li]:[align-items:center] [&_li]:[padding:1rem_0] [&_li]:[border-top:1px_solid_rgba(212,_209,_230,_0.7)] [&_li]:[font-size:1.35rem] [&_code]:[font-family:var(--f-mono)] [&_code]:[color:var(--purple)] [&_code]:[background:rgba(229,_223,_255,_0.8)] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_code]:[text-align:center] [&_span]:[color:#575568] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em]:[font-size:1.2rem] [&_em]:[padding:0.3rem_0.9rem] [&_em]:[border-radius:3rem] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.3rem] [&_em]:[white-space:nowrap] [&_em]:[color:#8a83a8] [&_em]:[background:rgba(255,_255,_255,_0.7)]">
        {s.beats.map((b, i) => {
          const on = i < done;
          return (
            <li key={b.code + b.label}>
              <code>{b.code}</code>
              <span>{b.label}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.em key={on ? 'y' : 'n'} className={on ? String.raw`is-ok [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[background:#f6f3ff] [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[border-color:#ddd3ff] [.ecg\_\_rows_em&]:[color:var(--purple)] [.ecg\_\_rows_em&]:[background:#ebe5ff] [.se\_\_dots_i&]:[background:#b7a3ff]` : ''} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}>
                  {on ? <><Check size={13} strokeWidth={3} /> {b.status}</> : 'In review'}
                </motion.em>
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Hero({ s }: { s: SpecialtyFull }) {
  return (
    <section className="sp-hero [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:6rem] [align-items:center] [padding:16.4rem_var(--gutter)_6rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[min-height:0]">
      <div className="sp-hero__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
        <motion.nav className="crumbs [display:flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:#8a8ea0] [&_a]:[display:inline-flex] [&_a]:[align-items:center] [&_a]:[gap:0.4rem] [&_a]:[color:var(--purple)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="/specialties"><ChevronLeft size={16} /> Specialties</Link><span>/</span><span>{s.name}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05} lines={s.heroTitle} bold={[s.heroAccent]} />
        <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>{s.heroSub}</motion.p>
        <motion.div className="sh-hero__cta [display:flex] [align-items:center] [gap:3.2rem] [flex-wrap:wrap]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
          <HeroCapture source={`specialty:${s.slug}`} />
        </motion.div>
        <TrustRow />
      </div>
      <div className="sp-hero__stage [position:relative] [height:72rem] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:2rem] [@media(min-width:_768px)_and_(max-width:_1279px)]:[width:100%] [@media(min-width:_768px)_and_(max-width:_1279px)]:[max-width:72rem] [@media(min-width:_768px)_and_(max-width:_1279px)]:[justify-self:center]">
        <motion.div className="sp-hero__photo [position:absolute] [inset:0_0_0_12rem] [border-radius:2.4rem] [overflow:hidden] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover] [&_img]:[object-position:60%_30%] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[inset:auto] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[aspect-ratio:4_/_3]" initial={{ clipPath: 'inset(10% 10% 10% 10% round 2.4rem)', opacity: 0 }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 2.4rem)', opacity: 1 }}
          transition={{ duration: 1.4, ease: ease.curtain, delay: 0.2 }}>
          <img src={SP_IMG[s.slug] ?? PHOTOS[s.photo]} alt={s.photoAlt} style={SP_POS[s.slug] ? { objectPosition: SP_POS[s.slug] } : undefined} />
        </motion.div>
        <motion.div className="sp-hero__widget xp-hero__widget [position:absolute] [left:0] [bottom:5rem] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[left:auto] [@media(max-width:_1279px)]:[bottom:auto] [@media(max-width:_1279px)]:[margin-top:-10rem] [width:52rem] [@media(max-width:_1279px)]:[width:100%]" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.8 }}>
          {SIGNATURE[s.slug] ? (() => { const Sig = SIGNATURE[s.slug]; return <Sig />; })() : <BeatStrip s={s} />}
        </motion.div>
        <motion.div className="hero-chip sp-hero__chip [position:absolute] [display:flex] [align-items:center] [gap:1.2rem] [padding:2.4rem] [border-radius:1.4rem] [background:rgba(248,_246,_255,_0.8)] [backdrop-filter:blur(1.2rem)] [color:var(--navy)] [white-space:nowrap] [z-index:4] [&_strong]:[display:block] [&_strong]:[font-weight:500] [&_strong]:[font-size:2.4rem] [&_strong]:[line-height:2.2rem] [&_strong]:[margin-bottom:0.8rem] [&_small]:[display:block] [&_small]:[font-size:1.4rem] [&_small]:[line-height:1.8rem] [right:2.4rem] [top:2.4rem] [@media(max-width:_1279px)]:[display:none] [.sp-hero\_\_stage--x_&]:[z-index:3]" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1.1 }}>
          <span><strong>{s.chip[0]}</strong><small>{s.chip[1]}</small></span>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= Code ledger ================= */
function Ledger({ s }: { s: SpecialtyFull }) {
  const [i, setI] = useState(0);
  const r = s.ledger.rows[i];
  return (
    <section className="ld container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [column-gap:2.4rem] [padding-top:14rem] [align-items:start] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:10rem]" id="codes">
      <div className="ld__list [grid-column:1_/_span_2] [display:flex] [flex-direction:column] [gap:1.2rem] [padding-right:4rem] [@media(max-width:_1279px)]:[grid-column:auto] [@media(max-width:_1279px)]:[padding-right:0]">
        <Eyebrow>{s.ledger.eyebrow}</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={s.ledger.lines} stagger={0.04} />
        <Reveal as="p" className="body-18 ld__intro [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [margin-top:0.8rem] [max-width:60rem] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]">{s.ledger.intro}</Reveal>
        <motion.ul className="ld__rows [margin-top:3.2rem] [border-top:1px_solid_#ece8f7] [&_li]:[border-bottom:1px_solid_#ece8f7]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
          {s.ledger.rows.map((row, k) => (
            <motion.li key={row.code} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } } }}>
              <button className={String.raw`ld__row [position:relative] [width:100%] [display:grid] [grid-template-columns:9rem_1fr_auto] [gap:2rem] [align-items:center] [padding:2rem_1.6rem] [text-align:left] [isolation:isolate] [color:var(--ink-2)] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.8rem] [&_code]:[color:var(--purple)] [&_span]:[font-size:1.9rem] [&_svg]:[color:#c9c2e4] [&_svg]:[transition:color_0.3s,_transform_0.4s_cubic-bezier(.16,1,.3,1)] [&.is-on_svg]:[color:var(--purple)] [&.is-on_svg]:[transform:translateX(0.4rem)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:-2px]! [&:focus-visible]:[border-radius:1.2rem] [@media(max-width:_1279px)]:[grid-template-columns:7.4rem_1fr_auto] [@media(max-width:_1279px)]:[padding:1.8rem_1.2rem] [@media(max-width:_1279px)]:[&_span]:[font-size:1.7rem] ${k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} aria-expanded={k === i}>
                {k === i && <motion.span layoutId="ld-hl" className="ld__hl [position:absolute] [inset:0.4rem_0] [border-radius:1.4rem] [background:#f6f3ff] [z-index:-1]" transition={{ type: 'spring', stiffness: 300, damping: 32 }} />}
                <code>{row.code}</code><span>{row.name}</span><ArrowRight size={18} />
              </button>
              {/* inline detail for small screens */}
              <AnimatePresence initial={false}>
                {k === i && (
                  <motion.div className="ld__inline [display:none] [&_small]:[display:block] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0] [&_small]:[margin-bottom:0.8rem] [@media(max-width:_1279px)]:[display:block] [@media(max-width:_1279px)]:[overflow:hidden] [@media(max-width:_1279px)]:[&_p]:[padding:0_1.2rem_1.6rem] [@media(max-width:_1279px)]:[&_p]:[font-size:1.6rem] [@media(max-width:_1279px)]:[&_p]:[line-height:1.5] [@media(max-width:_1279px)]:[&_p]:[color:var(--ink-2)]" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                    <p><small>What trips it</small>{row.trip}</p>
                    <p><small>How we catch it</small>{row.catch}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <div className="ld__side [grid-column:3_/_span_2] [position:sticky] [top:max(12rem,_calc(50vh_-_28rem))] [@media(max-width:_1279px)]:[display:none]">
        <motion.div className="ld__paper [position:relative] [min-height:56rem] [padding:4.8rem] [border-radius:3.2rem] [overflow:hidden] [border:1px_solid_var(--lav-border)] [background-color:#fbfaff] [background-image:linear-gradient(rgba(106,_65,_249,_0.1)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(106,_65,_249,_0.1)_1px,_transparent_1px),_linear-gradient(rgba(106,_65,_249,_0.04)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(106,_65,_249,_0.04)_1px,_transparent_1px)] [background-size:6rem_6rem,_6rem_6rem,_1.2rem_1.2rem,_1.2rem_1.2rem] [&:has(.ld\_\_art)]:[display:flex] [&:has(.ld\_\_art)]:[flex-direction:column]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: ease.out }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={r.code} className="ld__card [position:relative] [display:flex] [flex-direction:column] [gap:1.6rem]" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out, delay: 0.1 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <span className="ld__n [font-family:var(--f-mono)] [font-size:1.3rem] [color:#a29cbc]">0{i + 1} / 0{s.ledger.rows.length}</span>
              <code className="ld__code [font-family:var(--f-mono)] [font-size:11rem] [line-height:0.95] [letter-spacing:-0.4rem] [color:var(--purple)]">{r.code}</code>
              <p className="ld__name [font-weight:500] [font-size:2.8rem] [line-height:1.2] [letter-spacing:-0.04rem] [color:var(--ink-2)] [max-width:50rem]">{r.name}</p>
              <div className="ld__pair [display:grid] [grid-template-columns:1fr_1fr] [gap:1.6rem] [margin-top:2rem] [&>div]:[padding:2.4rem] [&>div]:[border-radius:2rem] [&>div]:[background:rgba(255,_255,_255,_0.92)] [&>div]:[border:1px_solid_var(--lav-border)] [&_small]:[display:block] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.06em] [&_small]:[color:#8a8ea0] [&_small]:[margin-bottom:0.8rem] [&_p]:[font-size:1.7rem] [&_p]:[line-height:1.5]">
                <div><small>What trips it</small><p>{r.trip}</p></div>
                <div className="is-fix [.ld\_\_pair>div&]:[color:#fff] [.ld\_\_pair_&_small]:[color:#d9ceff] [.ld\_\_pair>div&]:[background:var(--grad)] [.ld\_\_pair>div&]:[border-color:transparent]"><small>How we catch it</small><p>{r.catch}</p></div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* the specialty's own drawing; the marker moves to where the selected code applies */}
          {ART[s.slug] ? <LedgerArt slug={s.slug} i={i} code={r.code} /> : (
            <svg className="ld__trace [position:absolute] [left:0] [right:0] [bottom:5rem] [width:100%] [height:10rem] [overflow:visible]" viewBox="0 0 480 80" preserveAspectRatio="none" aria-hidden>
              <motion.path key={r.code} d={wavePath(s.wave, 4)} fill="none" stroke="#6a41f9" strokeWidth="2" vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0.2 }} animate={{ pathLength: 1, opacity: 0.55 }} transition={{ duration: 1.1, ease: ease.out }} />
            </svg>
          )}
        </motion.div>
      </div>
    </section>
  );
}

/* ================= Authorization clock ================= */
const LOOP_H = 190; // simulated hours per loop (a little past the 7-day limit)
function fmtElapsed(h: number, limit: number) {
  return limit <= 72 ? `Hour ${Math.floor(h)} of ${limit}` : `Day ${Math.min(7, Math.floor(h / 24) + 1)} of 7`;
}
function AuthRow({ r, h, hv }: { r: AuthReq; h: number; hv: MotionValue<number> }) {
  const decidedH = r.decideAt !== null ? r.decideAt * r.limitH : null;
  const decided = decidedH !== null && h >= decidedH;
  const over = r.decideAt === null && h >= r.limitH;
  const el = Math.min(decided ? decidedH! : h, r.limitH);
  // bar is driven straight from the clock motion value (no React render per frame)
  const sx = useTransform(hv, (v) => `scaleX(${Math.min(decidedH ?? Infinity, v, r.limitH) / r.limitH})`);
  const status = decided ? r.outcome : over ? 'Over limit · escalated' : 'Waiting on payer';
  return (
    <li className={String.raw`ac-row [display:grid] [grid-template-columns:minmax(0,_1.3fr)_auto_minmax(0,_1.2fr)_16rem] [gap:1.6rem] [align-items:center] [padding:1.8rem_0.4rem] [border-bottom:1px_solid_#f0edf8] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)_auto] [@media(max-width:_1279px)]:[row-gap:1rem] ${decided ? String.raw`is-ok [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[background:#f6f3ff] [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[border-color:#ddd3ff] [.ecg\_\_rows_em&]:[color:var(--purple)] [.ecg\_\_rows_em&]:[background:#ebe5ff] [.se\_\_dots_i&]:[background:#b7a3ff]` : ''} ${over ? 'is-over' : ''}`}>
      <div className="ac-row__what [&_b]:[display:block] [&_b]:[font-weight:700] [&_b]:[font-size:1.6rem] [&_small]:[font-size:1.25rem] [&_small]:[color:#6b6f7c] [&_code]:[font-family:var(--f-mono)] [&_code]:[color:var(--purple)]"><b>{r.study}</b><small><code>{r.code}</code> · {r.payer}</small></div>
      <span className={String.raw`ac-row__kind [padding:0.4rem_1rem] [border-radius:3rem] [border:1px_solid_var(--lav-border)] [font-size:1.2rem] [font-weight:600] [color:#6b6f7c] [white-space:nowrap] [&.is-urgent]:[color:#fff] [&.is-urgent]:[background:var(--grad)] [&.is-urgent]:[border-color:transparent] ${r.kind === 'Urgent' ? 'is-urgent' : ''}`}>{r.kind} · {r.limitH <= 72 ? '72 h' : '7 days'}</span>
      <div className="ac-row__bar [display:flex] [flex-direction:column] [gap:0.6rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.15rem] [&_small]:[color:#8a8ea0] [&_small]:[font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[grid-column:1_/_-1]">
        <div className="ac-row__track [height:0.8rem] [border-radius:1rem] [background:#efebfb] [overflow:hidden] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[border-radius:1rem] [&_i]:[background:linear-gradient(90deg,_#b7a3ff,_#6a41f9)] [&_i]:[transform-origin:left] [.ac-row.is-over_&_i]:[background:repeating-linear-gradient(-45deg,_#3a1fa8_0_0.6rem,_#6a41f9_0.6rem_1.2rem)]"><motion.i style={{ transform: sx }} /></div>
        <small>{decided ? `Decided ${fmtElapsed(decidedH!, r.limitH).toLowerCase()}` : fmtElapsed(el, r.limitH)}</small>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.em key={status} className="ac-row__status [justify-self:end] [display:inline-flex] [align-items:center] [gap:0.4rem] [font-style:normal] [font-weight:700] [font-size:1.25rem] [padding:0.5rem_1.1rem] [border-radius:3rem] [background:#f6f3ff] [color:#8a83a8] [white-space:nowrap] [.ac-row.is-ok_&]:[background:#ebe5ff] [.ac-row.is-ok_&]:[color:var(--purple)] [.ac-row.is-over_&]:[background:#23243a] [.ac-row.is-over_&]:[color:#fff] [@media(max-width:_1279px)]:[grid-column:1_/_-1] [@media(max-width:_1279px)]:[justify-self:start]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
          {decided && <Check size={14} strokeWidth={3} />}{status}
        </motion.em>
      </AnimatePresence>
    </li>
  );
}

function AuthClock({ s }: { s: SpecialtyFull }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  // Perf: the clock runs on a motion value; React only re-renders when the shown hour changes.
  const hv = useMotionValue(0);
  const [h, setH] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; let last = performance.now(); let hold = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      let v = hv.get();
      if (v >= LOOP_H) { hold += dt; if (hold > 2.2) { hold = 0; v = 0; } }
      else v = Math.min(LOOP_H, v + dt * 19); // ~10 s per loop
      hv.set(v);
      const hr = Math.floor(v);
      setH((p) => (p === hr ? p : hr));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, hv]);
  const day = Math.floor(h / 24) + 1;
  const hour = Math.floor(h % 24);
  return (
    <section className="ac container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
      <div className="ac__board [position:relative] [display:grid] [grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] [gap:6rem] [align-items:center] [padding:6.4rem] [border-radius:4rem] [overflow:hidden] [isolation:isolate] [border:1px_solid_rgba(106,_65,_249,_0.14)] [box-shadow:0_4rem_10rem_-4rem_rgba(80,_40,_220,_0.25)] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:-1] [&::before]:[background:rgba(255,_255,_255,_0.75)] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding:4rem_2rem] [@media(max-width:_1279px)]:[gap:3.2rem] [@media(max-width:_1279px)]:[border-radius:2.8rem]" ref={ref}>
        <div className="ac__bg [position:absolute] [inset:0] [z-index:-2] [overflow:hidden] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[max-width:none] [&_img]:[object-fit:cover] [&_img]:[object-position:70%_50%] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate] [@media(prefers-reduced-motion:_reduce)]:[&_img]:[animation:none]" aria-hidden><img src={fluted} alt="" /></div>
        <div className="ac__copy [display:flex] [flex-direction:column] [gap:1.6rem]">
          <Eyebrow>{s.auth!.eyebrow}</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={s.auth!.lines} stagger={0.04} />
          <Reveal as="p" className="body-18 [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]">{s.auth!.body}</Reveal>
          <a className="prob__src ac__src [font-family:var(--f-mono)] [font-size:1.3rem] [color:#8a8ea0] [text-decoration:underline] [text-underline-offset:0.3em] [.prob--solo_&]:[grid-column:2] [.prob--solo_&]:[justify-self:start] [.prob--solo_&]:[padding-bottom:1.6rem] [@media(max-width:_1279px)]:[.prob--solo_&]:[grid-column:1] [display:inline-flex] [align-items:center] [gap:0.6rem]" href={s.auth!.href} target="_blank" rel="noopener noreferrer">Source: {s.auth!.source} <ExternalLink size={12} /></a>
        </div>
        <div className="ac__panel [padding:2.8rem] [border-radius:2.8rem] [background:rgba(255,_255,_255,_0.86)] [border:1px_solid_#fff] [box-shadow:0_3rem_8rem_rgba(57,_28,_160,_0.14)] [font-family:var(--f-man)] [color:var(--ink-2)] [@media(max-width:_1279px)]:[padding:2rem_1.6rem]">
          <div className="ac__clock [display:flex] [justify-content:space-between] [align-items:baseline] [padding:0_0.4rem_1.6rem] [border-bottom:2px_solid_#23243a] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.8rem] [&_span]:[font-family:var(--f-mono)] [&_span]:[font-size:1.25rem] [&_span]:[text-transform:uppercase] [&_span]:[letter-spacing:0.06em] [&_span]:[color:#6b6f7c] [&_span_i]:[width:0.7rem] [&_span_i]:[height:0.7rem] [&_span_i]:[border-radius:50%] [&_span_i]:[background:var(--purple)] [&_span_i]:[animation:jy-pulse-p_1.4s_ease-in-out_infinite] [&_b]:[font-weight:700] [&_b]:[font-size:2.8rem] [&_b]:[font-variant-numeric:tabular-nums] [&_b_small]:[font-family:var(--f-mono)] [&_b_small]:[font-weight:400] [&_b_small]:[font-size:1.6rem] [&_b_small]:[color:#8a8ea0]">
            <span><i />Auth queue · simulated week</span>
            <b>Day {Math.min(day, 8)} <small>{String(hour).padStart(2, '0')}:00</small></b>
          </div>
          <ul>{s.auth!.reqs.map((r) => <AuthRow key={r.code} r={r} h={h} hv={hv} />)}</ul>
          <p className="ac__legend [margin-top:1.6rem] [font-size:1.3rem] [color:#6b6f7c]">Escalation: peer-to-peer requested and the plan notified the moment a decision is late.</p>
        </div>
      </div>
    </section>
  );
}

/* ================= Related specialties ================= */
function Related({ s }: { s: SpecialtyFull }) {
  const rel = s.related.map(getSpecialtyLite).filter(Boolean);
  return (
    <section className="rel container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
      <div className="rel__head [display:flex] [justify-content:space-between] [align-items:center] [gap:2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
        <Eyebrow>{`/ Often billed alongside ${s.name.toLowerCase()}`}</Eyebrow>
        <Link to="/specialties" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">All specialties <ArrowRight size={18} /></Link>
      </div>
      <div className="rel__grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:3.2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]">
        {rel.map((r) => {
          const Icon = r!.icon;
          return (
            <Reveal key={r!.slug}>
              <Link to={r!.page ? `/specialties/${r!.slug}` : `/specialties?focus=${r!.slug}`} className="rel__card [height:100%] [display:flex] [flex-direction:column] [gap:1.4rem] [padding:3.2rem] [border-radius:2.4rem] [background:var(--panel)] [border:1px_solid_#efebfb] [color:var(--ink-2)] [transition:transform_0.5s_cubic-bezier(.16,1,.3,1),_box-shadow_0.5s,_background_0.4s] [&:hover]:[transform:translateY(-0.6rem)] [&:hover]:[background:#fff] [&:hover]:[box-shadow:0_2rem_5rem_rgba(106,_65,_249,_0.12)] [&_b]:[font-weight:500] [&_b]:[font-size:2.8rem] [&_b]:[letter-spacing:-0.05rem] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.5] [&_p]:[color:#5b5f72]">
                <span className="xt__icon [flex:0_0_5.2rem] [display:grid] [place-items:center] [background:#f1edff] [color:var(--purple)] [&_svg]:[stroke-width:1.6] [width:4.4rem] [height:4.4rem] [flex-basis:4.4rem]! [border-radius:1.2rem] [transition:background_0.4s,_color_0.4s] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [.xt.is-hit_&]:[color:#fff] [@media(max-width:_767px)]:[width:3.6rem] [@media(max-width:_767px)]:[height:3.6rem] [@media(max-width:_767px)]:[flex-basis:3.6rem]! [.xt.is-hit_&]:[background:var(--grad)] [.xt.is-hit_&]:[border-color:transparent]"><Icon /></span>
                <b>{r!.name}</b>
                <p>{r!.watch}</p>
                <span className="rel__codes [display:flex] [gap:0.6rem] [margin-top:auto] [padding-top:1rem] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.3rem] [&_code]:[color:var(--purple)] [&_code]:[background:#fff] [&_code]:[border:1px_solid_var(--lav-border)] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.7rem]">{r!.codes.map(([c]) => <code key={c}>{c}</code>)}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export function SpecialtyPage({ slug }: { slug: string }) {
  const s = getSpecialty(slug)!;
  const plain = s.short && /^[A-Z/]+$/.test(s.short) ? s.short : s.name.toLowerCase();
  const monthly = s.leak ? Math.min(2000000, Math.max(50000, Math.round((s.leak.perProvider * s.leak.sizes[1]) / 10000) * 10000)) : undefined;
  const faqs = useMemo(() => searchFaqs({ name: s.name, kind: 'specialty', faqs: s.faqs, detail: s.leak?.leaks[0].label.toLowerCase() }), [s]);
  useEffect(() => {
    document.title = `${s.seoTitle} · Affinity Core`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', s.seoDescription);
    setJsonLd(pageJsonLd({ name: `${s.name} Billing Services`, description: s.seoDescription, path: `/specialties/${s.slug}`, crumb: ['Specialties', '/specialties'], faqs }));
    return () => setJsonLd(null);
  }, [s, faqs]);
  return (
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
      <Hero s={s} />
      <IntroBlock d={specialtyIntro(s)} />
      <Handle s={s} />
      <EhrStrip what={plain} />
      {s.leak ? <LeakList s={s} /> : <Problem s={s} />}
      <Proof specialty={s.name} />
      <MidCta title="Want this on your own claims?" body={`Send us a month of ${plain} claims. We’ll show you every line we’d change and what it’s worth, free. Switching takes about 30 days, with no gap in billing.`} />
      <PageGuide g={specialtyGuide(s)} />
      <AlsoBilled s={s} />
      <Assessment monthly={monthly} specialty={s.name} source={`specialty:${s.slug}`} />
      <FAQ items={faqs} eyebrow={`/ ${s.name} billing FAQs`} lines={s.faqLines} />
      <CTA eyebrow={s.closing.eyebrow} lines={s.closing.lines} />
    </main>
  );
}
