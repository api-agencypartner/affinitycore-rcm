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
    <div className="carousel" ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      aria-roledescription="carousel" aria-label="Affinity Core highlights">
      {/* Images: incoming slide wipes in from the right over the outgoing one */}
      <AnimatePresence initial={false}>
        <motion.div key={index} className="carousel__img"
          initial={{ clipPath: 'inset(0 0 0 100%)' }} animate={{ clipPath: 'inset(0 0 0 0%)' }}
          exit={{ zIndex: 1, opacity: 0.999, transition: { duration: 1.15, zIndex: { duration: 0 } } }} style={{ zIndex: 2 }}
          transition={{ duration: 1.1, ease: ease.curtain }}>
          <motion.img src={s.img} alt={s.alt} initial={{ scale: 1.14, x: '4%' }} animate={{ scale: 1, x: '0%' }}
            transition={{ duration: 1.6, ease: ease.out }} draggable={false} />
        </motion.div>
      </AnimatePresence>
      <div className="carousel__shade" />

      {/* Swipe layer */}
      <motion.div className="carousel__drag" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12}
        onDragEnd={(_, info) => { if (info.offset.x < -60) go(index + 1); else if (info.offset.x > 60) go(index - 1); }} />

      {/* Widgets: outgoing leave first, then incoming enter */}
      <AnimatePresence mode="wait">
        {play && (
          <motion.div key={index} className="carousel__layer" initial="hidden" animate="show" exit="exit"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: index === 0 ? 1.2 : 0.35 } }, exit: { transition: { staggerChildren: 0.06 } } }}>
            <motion.div className="hero-chip" style={s.chip.pos} variants={chipV}>
              <span className="hero-chip__icon">{s.chip.icon}</span>
              <span><strong>{s.chip.title}</strong><small>{s.chip.sub}</small></span>
            </motion.div>
            <motion.div className="hero-widget" style={s.widgetPos} variants={widgetV}><Widget /></motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bars (Figma 526:2292) */}
      <div className="carousel__bars" role="tablist">
        {SLIDES.map((_, i) => (
          <button key={i} role="tab" aria-selected={i === index} aria-label={`Slide ${i + 1}`} className="carousel__bar" onClick={() => go(i)}>
            {i === index ? <Fill progress={progress} /> : <motion.span className="carousel__fill" animate={{ scaleX: i < index ? 1 : 0 }} transition={{ duration: 0.4, ease: ease.out }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

function Fill({ progress }: { progress: MotionValue<number> }) {
  return <motion.span className="carousel__fill" style={{ scaleX: progress }} />;
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
    <div className="w-card w-revenue">
      <p className="w-revenue__label">Revenue overview</p>
      <CountUp className="w-revenue__value" prefix="$" value={428560} duration={1.8} start delay={0.5} />
      <p className="w-revenue__sub">Collections this month</p>
      <svg className="w-revenue__chart" viewBox="0 0 362 101" fill="none" preserveAspectRatio="none">
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
      <div className="w-revenue__foot">
        <div><CountUp className="w-revenue__kpi" value={98.4} decimals={1} suffix="%" start delay={0.8} /><span>Clean claims</span></div>
        <div><CountUp className="w-revenue__kpi" value={27} suffix=" days" start delay={0.9} /><span>Days in A/R</span></div>
        <motion.span className="w-revenue__check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 1.6 }}>✓</motion.span>
      </div>
    </div>
  );
}

/* ---------------- Slide 2 — Denials worked back to paid ---------------- */
function DenialCard() {
  const rows: [string, string, number][] = [['78452', 'CO-197 · No auth', 1240], ['93000', 'CO-97 · Bundled', 74], ['99214', 'CO-16 · Missing info', 186]];
  return (
    <div className="w-card w-glass w-den">
      <div className="w-den__head">
        <span><small>Denials recovered</small><CountUp className="w-den__total" prefix="$" value={1500} start delay={0.9} duration={1.6} /></span>
        <span className="w-den__pill">This week</span>
      </div>
      <motion.ul className="w-den__rows" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.22, delayChildren: 0.5 } } }}>
        {rows.map(([code, why, amt]) => (
          <motion.li key={code} variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.out } } }}>
            <code>{code}</code><span className="w-den__why">{why}</span>
            <span className="w-den__st">
              <motion.em className="no" variants={{ hidden: { opacity: 1 }, show: { opacity: 0, transition: { delay: 0.9, duration: 0.3 } } }}>Denied</motion.em>
              <motion.em className="ok" variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { delay: 1.1, type: 'spring', stiffness: 420, damping: 18 } } }}><Check /> ${amt.toLocaleString('en-US')}</motion.em>
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
    <div className="w-card w-glass w-auth">
      <div className="w-provider__head">
        <span className="w-provider__avatar"><Stethoscope /></span>
        <span><strong>MRI lumbar · 72148</strong><small>Prior authorization</small></span>
        <motion.span className="w-provider__verified" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 2.1 }}><BadgeCheck /></motion.span>
      </div>
      <div className="w-auth__track">
        <motion.i className="w-auth__fill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: ease.inOut, delay: 0.5 }} />
        {steps.map((t, i) => (
          <motion.span key={t} className="w-auth__step" style={{ left: `${i * 50}%` }}
            initial={{ background: '#e5dfff', color: '#6a41f9' }} animate={{ background: '#6a41f9', color: '#ffffff' }} transition={{ delay: 0.5 + i * 0.75, duration: 0.3 }}>
            <Check />
          </motion.span>
        ))}
      </div>
      <div className="w-auth__labels">{steps.map((t) => <span key={t}>{t}</span>)}</div>
      <motion.p className="w-auth__note" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2, duration: 0.5 }}>
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
    <div className="w-card w-glass w-audit">
      <div className="w-audit__ring">
        <svg viewBox="0 0 150 150"><circle cx="75" cy="75" r="68" className="w-audit__track" />
          <motion.circle cx="75" cy="75" r="68" className="w-audit__arc" style={{ pathLength: dash }} /></svg>
        <div className="w-audit__core"><motion.strong>{scoreTxt}</motion.strong><small>Audit score</small></div>
      </div>
      <motion.ul className="w-audit__rows" initial="hidden" animate="show"
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
