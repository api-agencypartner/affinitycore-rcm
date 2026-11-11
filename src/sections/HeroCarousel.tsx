import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, animate, useMotionValue, useTransform, useInView, type MotionValue, type AnimationPlaybackControls, type Variants } from 'motion/react';
import { HandHeart, Stethoscope, BadgeCheck, Check, ShieldCheck, RotateCcw, PhoneCall } from 'lucide-react';
import { CountUp } from '../components/ui';
import { HERO, ease } from '../motion';
import img1 from '../assets/hero-1.jpg';
import img3 from '../assets/hero-3.jpg';
import img4 from '../assets/hero-4.jpg';
import img5 from '../assets/hero-5.jpg';

/* Figma: Component 369 — 3 variants (526:2372 / 526:2371 / 526:2370) */
type Slide = {
  img: string; alt: string;
  chip: { icon: ReactNode; title: string; sub: string; pos: { left: string; top: string } };
  widget: () => JSX.Element; widgetPos: { left: string; top: string };
};

// Four slides, one service story each: revenue (RCM), denials, prior auth / peer-to-peer, audits.
// Photos 2 and 3 from Envato Elements, licensed to "Affinity Core Website".
const SLIDES: Slide[] = [
  {
    img: img1, alt: 'Physician reviewing revenue on a tablet',
    chip: { icon: <HandHeart />, title: 'Care comes first.', sub: 'We take care of the cycle.', pos: { left: '58.6rem', top: '2.4rem' } },
    widget: RevenueCard, widgetPos: { left: '2.4rem', top: '38.9rem' },
  },
  {
    img: img4, alt: 'Smiling physician holding a tablet in a bright clinic office',
    chip: { icon: <RotateCcw />, title: 'Denied isn’t done.', sub: 'Every denial worked back to paid.', pos: { left: '2.4rem', top: '2.4rem' } },
    widget: DenialCard, widgetPos: { left: '42.4rem', top: '50.4rem' },
  },
  {
    img: img5, alt: 'Smiling physician working on a laptop in her office',
    chip: { icon: <PhoneCall />, title: 'Peer-to-peer, prepped.', sub: 'Case packet ready before the call.', pos: { left: '2.4rem', top: '2.4rem' } },
    widget: AuthCard, widgetPos: { left: '2.4rem', top: '54.4rem' },
  },
  {
    img: img3, alt: 'Physician signing an audited report',
    chip: { icon: <ShieldCheck />, title: 'Audit-ready accuracy', sub: 'Every claim checked before it’s sent.', pos: { left: '55rem', top: '47.6rem' } },
    widget: AuditCard, widgetPos: { left: '2.4rem', top: '2.4rem' },
  },
];

export function HeroCarousel({ play }: { play: boolean }) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const progress = useMotionValue(0);
  const ctrl = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    const on = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, []);

  // Timer: one linear tween per slide; completing it advances the carousel.
  useEffect(() => {
    if (!play) return;
    progress.set(0);
    ctrl.current = animate(progress, 1, {
      duration: HERO.slideDuration, ease: 'linear', delay: index === 0 ? 1.6 : 0,
      onComplete: () => setIndex((i) => (i + 1) % SLIDES.length),
    });
    return () => ctrl.current?.stop();
  }, [index, play, progress]);

  const paused = hover || !inView || tabHidden;
  useEffect(() => { if (paused) ctrl.current?.pause(); else ctrl.current?.play(); }, [paused, index]);

  // Scale the 892×892 widget layer to the carousel's actual size (keeps Figma proportions on any screen)
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(() => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      el.style.setProperty('--s', String(el.clientWidth / (89.2 * rem)));
    });
    ro.observe(el); return () => ro.disconnect();
  }, []);

  const go = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);
  const s = SLIDES[index];
  const Widget = s.widget;

  return (
    <div className="carousel [position:relative] [width:100%] [height:100%] [border-radius:2.4rem] [overflow:hidden] [background:#ddd] [isolation:isolate]" ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-roledescription="carousel" aria-label="Affinity Core highlights">
      {/* Images: incoming slide wipes in from the right over the outgoing one */}
      <AnimatePresence initial={false}>
        <motion.div key={index} className="carousel__img [position:absolute] [inset:0] [overflow:hidden] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:cover]"
          initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }}
          exit={{ zIndex: 1, opacity: 0.999, transition: { duration: 1.15, zIndex: { duration: 0 } } }} style={{ zIndex: 2 }}
          transition={{ duration: 1.1, ease: ease.curtain }}>
          <motion.img src={s.img} alt={s.alt} initial={{ scale: 1.14, x: '4%' }} animate={{ scale: 1, x: '0%' }}
            transition={{ duration: 1.6, ease: ease.out }} draggable={false} />
        </motion.div>
      </AnimatePresence>
      <div className="carousel__shade [position:absolute] [left:0] [right:0] [bottom:0] [height:41.6rem] [background:linear-gradient(0deg,_rgba(0,_0,_0,_0.45),_rgba(0,_0,_0,_0))] [z-index:2] [pointer-events:none]" />

      {/* Swipe layer */}
      <motion.div className="carousel__drag [position:absolute] [inset:0] [z-index:3] [cursor:grab] [&:active]:[cursor:grabbing]" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12}
        onDragEnd={(_, info) => { if (info.offset.x < -60) go(index + 1); else if (info.offset.x > 60) go(index - 1); }} />

      {/* Widgets: outgoing leave first, then incoming enter */}
      <AnimatePresence mode="wait">
        {play && (
          <motion.div key={index} className="carousel__layer [position:absolute] [left:0] [top:0] [width:89.2rem] [height:89.2rem] [transform:scale(var(--s,_1))] [transform-origin:0_0] [z-index:4] [pointer-events:none]" initial="hidden" animate="show" exit="exit"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: index === 0 ? 1.2 : 0.35 } }, exit: { transition: { staggerChildren: 0.06 } } }}>
            <motion.div className="hero-chip [position:absolute] [display:flex] [align-items:center] [gap:1.2rem] [padding:2.4rem] [border-radius:1.4rem] [background:rgba(248,_246,_255,_0.8)] [backdrop-filter:blur(1.2rem)] [color:var(--navy)] [white-space:nowrap] [z-index:4] [&_strong]:[display:block] [&_strong]:[font-weight:500] [&_strong]:[font-size:2.4rem] [&_strong]:[line-height:2.2rem] [&_strong]:[margin-bottom:0.8rem] [&_small]:[display:block] [&_small]:[font-size:1.4rem] [&_small]:[line-height:1.8rem]" style={s.chip.pos} variants={chipV}>
              <span className="hero-chip__icon [color:var(--purple)] [display:grid] [&_svg]:[width:3.6rem] [&_svg]:[height:3.6rem] [&_svg]:[stroke-width:1.6]">{s.chip.icon}</span>
              <span><strong>{s.chip.title}</strong><small>{s.chip.sub}</small></span>
            </motion.div>
            <motion.div className="hero-widget [position:absolute] [width:44.4rem] [z-index:4]" style={s.widgetPos} variants={widgetV}><Widget /></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bars (Figma 526:2292) */}
      <div className="carousel__bars [position:absolute] [z-index:5] [left:2.4rem] [right:2.4rem] [bottom:2.4rem] [display:flex] [gap:2rem]" role="tablist">
        {SLIDES.map((_, i) => (
          <button key={i} role="tab" aria-selected={i === index} aria-label={`Slide ${i + 1}`} className="carousel__bar [flex:1] [height:1rem] [border-radius:5.6rem] [background:rgba(153,_153,_153,_0.25)] [border:1px_solid_rgba(255,_255,_255,_0.25)] [overflow:hidden] [backdrop-filter:blur(6px)] [padding:0]" onClick={() => go(i)}>
            {i === index ? <Fill progress={progress} /> : <motion.span className="carousel__fill [display:block] [width:100%] [height:100%] [border-radius:2.4rem] [background:var(--purple)] [transform-origin:left]" animate={{ scaleX: i < index ? 1 : 0 }} transition={{ duration: 0.4, ease: ease.out }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Fill({ progress }: { progress: MotionValue<number> }) {
  return <motion.span className="carousel__fill [display:block] [width:100%] [height:100%] [border-radius:2.4rem] [background:var(--purple)] [transform-origin:left]" style={{ scaleX: progress }} />;
}

const chipV: Variants = {
  hidden: { opacity: 0, y: -18, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: ease.out } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } },
};
const widgetV: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: ease.out } },
  exit: { opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.4, ease: [0.4, 0, 1, 1] } },
};

/* ---------------- Slide 1 — Revenue overview ---------------- */
const CURVE = 'M2 92 C 26 74, 44 52, 70 54 S 110 74, 132 64 S 172 28, 200 24 S 236 42, 262 30 S 300 6, 322 10 S 350 12, 360 2';
export function RevenueCard() {
  return (
    <div className="w-card w-revenue [border-radius:2.6rem] [background:rgba(248,_246,_255,_0.8)] [backdrop-filter:blur(1.6rem)] [color:var(--navy)] [padding:3.2rem]">
      <p className="w-revenue__label [font-size:1.8rem] [line-height:2.8rem]">Revenue overview</p>
      <CountUp className="w-revenue__value [display:block] [margin-top:2.6rem] [font-weight:500] [font-size:4.8rem] [line-height:5.6rem] [letter-spacing:-0.235rem]" prefix="$" value={428560} duration={1.8} start delay={0.5} />
      <p className="w-revenue__sub [color:#677b91] [font-size:1.6rem] [line-height:2.4rem] [margin-top:0.4rem] [margin-bottom:1.3rem]">Collections this month</p>
      <svg className="w-revenue__chart [width:100%] [height:11.7rem] [overflow:visible] [padding-inline:0.9rem]" viewBox="0 0 362 101" fill="none" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rev-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a6bff" stopOpacity="0.55" /><stop offset="1" stopColor="#8a6bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path d={`${CURVE} L 360 101 L 2 101 Z`} fill="url(#rev-area)"
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.4, ease: ease.inOut, delay: 0.6 }} />
        <motion.path d={CURVE} stroke="#6a41f9" strokeWidth="3" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: ease.inOut, delay: 0.6 }} />
      </svg>
      <div className="w-revenue__foot [display:flex] [align-items:center] [justify-content:space-between] [margin-top:1.3rem] [padding-top:2rem] [border-top:1.3px_solid_rgba(255,_255,_255,_0.5)] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[min-width:9.2rem] [&_span:not(.w-revenue\_\_kpi)]:[font-size:1.6rem] [&_span:not(.w-revenue\_\_kpi)]:[color:#242425]">
        <div><CountUp className="w-revenue__kpi [font-weight:500] [font-size:2.8rem] [line-height:4.25rem] [letter-spacing:-0.096rem]" value={98.4} decimals={1} suffix="%" start delay={0.8} /><span>Clean claims</span></div>
        <div><CountUp className="w-revenue__kpi [font-weight:500] [font-size:2.8rem] [line-height:4.25rem] [letter-spacing:-0.096rem]" value={27} suffix=" days" start delay={0.9} /><span>Days in A/R</span></div>
        <motion.span className="w-revenue__check [width:3.66rem] [height:3.66rem] [border-radius:50%] [background:#daf5ee] [color:#12745f] [display:grid] [place-items:center] [font-size:1.57rem]" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 1.6 }}>✓</motion.span>
      </div>
    </div>
  );
}

/* ---------------- Slide 2 — Denials worked back to paid ---------------- */
function DenialCard() {
  const rows: [string, string, number][] = [['78452', 'CO-197 · No auth', 1240], ['93000', 'CO-97 · Bundled', 74], ['99214', 'CO-16 · Missing info', 186]];
  return (
    <div className="w-card w-glass w-den [border-radius:2.17rem] [border:1.5px_solid_rgba(255,_255,_255,_0.7)] [background:linear-gradient(168deg,_rgba(255,_255,_255,_0.85)_8%,_rgba(242,_240,_255,_0.74)_92%)] [box-shadow:0_1.55rem_4.66rem_rgba(128,_70,_251,_0.35),_inset_0_1.5px_0_rgba(255,_255,_255,_0.9)] [backdrop-filter:blur(2.5rem)] [font-family:var(--f-man)] [color:#0d0c15] [padding:2.48rem] [width:44.4rem]">
      <div className="w-den__head [display:flex] [justify-content:space-between] [align-items:flex-start] [&_small]:[display:block] [&_small]:[font-weight:600] [&_small]:[font-size:1.4rem] [&_small]:[letter-spacing:0.12rem] [&_small]:[text-transform:uppercase] [&_small]:[color:#575568]">
        <span><small>Denials recovered</small><CountUp className="w-den__total [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:3.6rem] [line-height:1] [letter-spacing:-0.08rem] [color:var(--navy)] [font-variant-numeric:tabular-nums]" prefix="$" value={1500} start delay={0.9} duration={1.6} /></span>
        <span className="w-den__pill [padding:0.6rem_1.2rem] [border-radius:2rem] [background:rgba(229,_223,_255,_0.8)] [font-weight:600] [font-size:1.3rem] [color:var(--purple)]">This week</span>
      </div>
      <motion.ul className="w-den__rows [display:flex] [flex-direction:column] [gap:0.9rem] [margin-top:2rem] [&_li]:[display:grid] [&_li]:[grid-template-columns:6.6rem_minmax(0,_1fr)_10rem] [&_li]:[align-items:center] [&_li]:[gap:1rem] [&_li]:[padding:1rem_1.2rem] [&_li]:[border-radius:1.1rem] [&_li]:[background:rgba(255,_255,_255,_0.75)] [&_li]:[font-size:1.35rem] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.3rem] [&_code]:[color:var(--purple)]" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22, delayChildren: 0.5 } } }}>
        {rows.map(([code, why, amt]) => (
          <motion.li key={code} variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.out } } }}>
            <code>{code}</code><span className="w-den__why [color:#575568] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis]">{why}</span>
            <span className="w-den__st [position:relative] [height:2.6rem] [&_em]:[position:absolute] [&_em]:[inset:0] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[justify-content:center] [&_em]:[gap:0.4rem] [&_em]:[border-radius:2rem] [&_em]:[font-style:normal] [&_em]:[font-weight:600] [&_em]:[font-size:1.25rem] [&_svg]:[width:1.3rem] [&_svg]:[height:1.3rem]">
              <motion.em className="no [.w-den\_\_st_&]:[background:#f1edff] [.w-den\_\_st_&]:[color:#8a8ea0]" variants={{ hidden: { opacity: 1 }, show: { opacity: 0, transition: { delay: 0.9, duration: 0.3 } } }}>Denied</motion.em>
              <motion.em className="ok [.w-den\_\_st_&]:[background:var(--purple)] [.w-den\_\_st_&]:[color:#fff] [color:#12a150] [.mw_em&]:[background:#dcf5ea] [.mw\_\_row_em&]:[background:#dcf5ea] [.dq_li_em&]:[background:#dcf5ea] [.lf\_\_dg_small&]:[color:#18a058]" variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { delay: 1.1, type: 'spring', stiffness: 420, damping: 18 } } }}><Check /> ${amt.toLocaleString('en-US')}</motion.em>
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

/* ---------------- Slide 3 — Prior auth, through the peer-to-peer ---------------- */
function AuthCard() {
  const steps = ['Requested', 'Peer-to-peer', 'Approved'];
  return (
    <div className="w-card w-glass w-auth [border-radius:2.17rem] [border:1.5px_solid_rgba(255,_255,_255,_0.7)] [background:linear-gradient(168deg,_rgba(255,_255,_255,_0.85)_8%,_rgba(242,_240,_255,_0.74)_92%)] [box-shadow:0_1.55rem_4.66rem_rgba(128,_70,_251,_0.35),_inset_0_1.5px_0_rgba(255,_255,_255,_0.9)] [backdrop-filter:blur(2.5rem)] [font-family:var(--f-man)] [color:#0d0c15] [padding:2.48rem] [width:44.4rem]">
      <div className="w-provider__head [display:flex] [align-items:center] [gap:1.86rem] [&_strong]:[display:block] [&_strong]:[font-weight:600] [&_strong]:[font-size:2.17rem] [&_strong]:[line-height:3.1rem] [&_small]:[display:block] [&_small]:[font-weight:600] [&_small]:[font-size:1.55rem] [&_small]:[letter-spacing:0.124rem] [&_small]:[text-transform:uppercase] [&_small]:[color:#575568]">
        <span className="w-provider__avatar [width:6.2rem] [height:6.2rem] [border-radius:50%] [background:#e5dfff] [display:grid] [place-items:center] [color:var(--purple)] [&_svg]:[width:3.1rem] [&_svg]:[height:3.1rem]"><Stethoscope /></span>
        <span><strong>MRI lumbar · 72148</strong><small>Prior authorization</small></span>
        <motion.span className="w-provider__verified [margin-left:auto] [color:#12a150] [display:grid] [&_svg]:[width:3.1rem] [&_svg]:[height:3.1rem]" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 2.1 }}><BadgeCheck /></motion.span>
      </div>
      <div className="w-auth__track [position:relative] [height:3.2rem] [margin:3.2rem_1.6rem_0] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[left:0] [&::before]:[right:0] [&::before]:[top:50%] [&::before]:[height:0.4rem] [&::before]:[margin-top:-0.2rem] [&::before]:[border-radius:1rem] [&::before]:[background:#e5dfff]">
        <motion.i className="w-auth__fill [position:absolute] [left:0] [right:0] [top:50%] [height:0.4rem] [margin-top:-0.2rem] [border-radius:1rem] [background:var(--purple)] [transform-origin:left_center]" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: ease.inOut, delay: 0.5 }} />
        {steps.map((t, i) => (
          <motion.span key={t} className="w-auth__step [position:absolute] [top:0] [width:3.2rem] [height:3.2rem] [margin-left:-1.6rem] [border-radius:50%] [display:grid] [place-items:center] [box-shadow:0_0_0_0.5rem_rgba(255,_255,_255,_0.8)] [&_svg]:[width:1.6rem] [&_svg]:[height:1.6rem]" style={{ left: `${i * 50}%` }}
            initial={{ background: '#e5dfff', color: '#6a41f9' }} animate={{ background: '#6a41f9', color: '#ffffff' }} transition={{ delay: 0.5 + i * 0.75, duration: 0.3 }}>
            <Check />
          </motion.span>
        ))}
      </div>
      <div className="w-auth__labels [display:flex] [justify-content:space-between] [margin-top:1rem] [font-weight:500] [font-size:1.3rem] [color:#575568]">{steps.map((t) => <span key={t}>{t}</span>)}</div>
      <motion.p className="w-auth__note [margin-top:2rem] [padding:1.1rem_1.4rem] [border-radius:1.1rem] [background:rgba(229,_223,_255,_0.7)] [font-size:1.4rem] [color:var(--navy)] [&_b]:[font-weight:600] [&_b]:[color:var(--purple)]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 0.5 }}>
        Approved in <b>26 hours</b> · inside the 72-hour window
      </motion.p>
    </div>
  );
}

/* ---------------- Slide 3 — Audit score ---------------- */
function AuditCard() {
  const rows: [string, number, number][] = [['Accuracy', 98, 0], ['Compliance', 96, 0], ['Leakage', 2.1, 1]];
  const score = useMotionValue(0);
  const dash = useTransform(score, [0, 100], [0, 1]);
  useEffect(() => { const c = animate(score, 94, { duration: 1.6, ease: ease.out, delay: 0.5 }); return () => c.stop(); }, [score]);
  const scoreTxt = useTransform(score, (v) => Math.round(v).toString());
  return (
    <div className="w-card w-glass w-audit [border-radius:2.17rem] [border:1.5px_solid_rgba(255,_255,_255,_0.7)] [background:linear-gradient(168deg,_rgba(255,_255,_255,_0.85)_8%,_rgba(242,_240,_255,_0.74)_92%)] [box-shadow:0_1.55rem_4.66rem_rgba(128,_70,_251,_0.35),_inset_0_1.5px_0_rgba(255,_255,_255,_0.9)] [backdrop-filter:blur(2.5rem)] [font-family:var(--f-man)] [color:#0d0c15] [display:flex] [align-items:center] [gap:3.1rem] [height:24.8rem] [padding:2.48rem]">
      <div className="w-audit__ring [position:relative] [width:14.9rem] [height:14.9rem] [flex-shrink:0] [&_svg]:[width:100%] [&_svg]:[height:100%] [&_svg]:[rotate:-90deg]">
        <svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="68" className="w-audit__track [fill:none] [stroke:rgba(106,_65,_249,_0.12)] [stroke-width:6]" />
          <motion.circle cx="75" cy="75" r="68" className="w-audit__arc [fill:none] [stroke:var(--purple)] [stroke-width:6] [stroke-linecap:round]" style={{ pathLength: dash }} /></svg>
        <div className="w-audit__core [position:absolute] [inset:1.86rem] [border-radius:50%] [background:rgba(247,_245,_255,_0.9)] [display:grid] [place-content:center] [text-align:center] [&_strong]:[font-weight:600] [&_strong]:[font-size:3.1rem] [&_strong]:[line-height:4.35rem] [&_small]:[font-size:1.24rem] [&_small]:[text-transform:uppercase] [&_small]:[color:#575568]"><motion.strong>{scoreTxt}</motion.strong><small>Audit score</small></div>
      </div>
      <motion.ul className="w-audit__rows [flex:1] [display:flex] [flex-direction:column] [gap:1.86rem] [&_li]:[position:relative] [&_li]:[display:flex] [&_li]:[justify-content:space-between] [&_li]:[padding-bottom:1.24rem] [&_li]:[font-size:1.55rem] [&_li]:[line-height:2.33rem] [&_li]:[color:#575568] [&_li>span:last-of-type]:[font-weight:700] [&_li>span:last-of-type]:[color:#0d0c15] [&_li_i]:[position:absolute] [&_li_i]:[left:0] [&_li_i]:[right:0] [&_li_i]:[bottom:0] [&_li_i]:[height:1.5px] [&_li_i]:[background:rgba(212,_209,_230,_0.72)] [&_li_i]:[transform-origin:left]" initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}>
        {rows.map(([l, v, dec]) => (
          <motion.li key={l} variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.out } } }}>
            <span>{l}</span><CountUp value={v} decimals={dec} suffix="%" start delay={0.8} duration={1.2} />
            <motion.i variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: ease.out } } }} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
