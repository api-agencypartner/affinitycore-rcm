import { go, goAnchor } from '../router';
import logoSvg from '../assets/logo.svg?raw';
import { Fragment, useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { motion, useInView, animate, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import { ease, dur, fadeUp, vp } from '../motion';

/* ---------- Arrow ---------- */
export const Arrow = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M3.5 10h13m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ---------- Pill button + arrow circle (Figma "Button Text Wrap" + "Arrow Right Icon") ----------
 * Hover: the arrow eases a few px away and a liquid neck (SVG "goo" filter) keeps it joined to the
 * pill, with a droplet that runs across. On leave the neck pinches and splits as the arrow springs back.
 * The goo layer sits under the solid pill + circle, so only the neck between them is ever visible. */
export function Button({ children, className = '', wide, onClick, type = 'button', to = '#assessment', outline }: {
  children: ReactNode; className?: string; wide?: boolean; onClick?: () => void; type?: 'button' | 'submit'; to?: string; outline?: boolean;
}) {
  // Default action: route ("/services") or anchor ("#assessment", works from any page).
  const act = onClick ?? (type === 'button' ? () => (to.startsWith('/') ? go(to) : goAnchor(to.slice(1))) : undefined);
  // Perf: the SVG goo filter is only switched on while the hover/split animation can be seen,
  // so idle buttons never pay for a filter pass on scroll.
  const [goo, setGoo] = useState(false);
  const gooT = useRef(0);
  return (
    <motion.button type={type} onClick={act} className={`btn ${wide ? 'btn--wide' : ''} ${outline ? 'btn--outline' : ''} ${goo ? 'is-goo' : ''} ${className}`}
      initial="rest" whileHover="hover" whileTap="tap" animate="rest"
      onHoverStart={() => { window.clearTimeout(gooT.current); setGoo(true); }}
      onHoverEnd={() => { window.clearTimeout(gooT.current); gooT.current = window.setTimeout(() => setGoo(false), 900); }}>
      <span className="btn__goo" aria-hidden>
        <motion.span className="btn__goo-in" variants={{ rest: { opacity: 0, transition: { delay: 0.35, duration: 0.2 } }, hover: { opacity: 1, transition: { duration: 0.12 } } }}>
          <i className="btn__goo-pill" />
          <motion.i className="btn__goo-dot" variants={{ rest: { x: 0 }, hover: { x: GAP } }} transition={liquid} />
          <motion.i className="btn__goo-neck" variants={{ rest: { scaleX: 0.2, scaleY: 0.2 }, hover: { scaleX: 1, scaleY: 1 } }}
            transition={{ type: 'spring', stiffness: 260, damping: 14, mass: 0.7 }} />
          <motion.i className="btn__goo-drop" variants={{
            rest: { x: '-1.6rem', scale: 0.4, transition: { duration: 0.2 } },
            hover: { x: ['-1.6rem', '1.2rem', '2.4rem'], scale: [0.4, 1, 0.5], transition: { duration: 0.7, ease: [0.45, 0, 0.2, 1], times: [0, 0.55, 1] } },
          }} />
        </motion.span>
      </span>
      <motion.span className="btn__label" variants={{ rest: { x: 0 }, hover: { x: 0 }, tap: { scale: 0.98 } }}
        transition={spring}>{children}</motion.span>
      <motion.span className="btn__icon" variants={{ rest: { x: 0, rotate: 0 }, hover: { x: GAP, rotate: -45 }, tap: { scale: 0.92 } }}
        transition={liquid}>
        <Arrow />
      </motion.span>
    </motion.button>
  );
}
const GAP = 6; // px the arrow eases away on hover (was 8 px apart before)
const liquid = { type: 'spring', stiffness: 320, damping: 15, mass: 0.8 } as const;

/** One shared SVG filter for every button's liquid neck. Render once near the app root. */
export function GooDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
      <defs>
        <filter id="btn-goo" x="-20%" y="-50%" width="140%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
        </filter>
      </defs>
    </svg>
  );
}
const spring = { type: 'spring', stiffness: 400, damping: 24 } as const;

/* ---------- Eyebrow: "/ LABEL" with a quick text scramble when it scrolls in ---------- */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ/0123456789';
export function Eyebrow({ children, className = '', style }: { children: string; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 1 });
  const reduce = useReducedMotion();
  const [text, setText] = useState(children);
  useEffect(() => {
    if (!inView || reduce) return;
    const target = children.toUpperCase();
    const ctrl = animate(0, 1, {
      duration: 0.7, ease: 'linear',
      onUpdate: (p) => {
        const revealed = Math.floor(p * target.length);
        setText(target.split('').map((c, i) => (i < revealed || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''));
      },
      onComplete: () => setText(target),
    });
    return () => ctrl.stop();
  }, [inView, children, reduce]);
  return (
    <motion.p ref={ref} className={`eyebrow ${className}`} style={style}
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.3 }}>
      {text}
    </motion.p>
  );
}

/* ---------- Reveal: generic fade-up when in view ---------- */
export function Reveal({ children, className = '', delay = 0, y = 32, as = 'div', amount = 0.3, style }: {
  children: ReactNode; className?: string; delay?: number; y?: number; as?: 'div' | 'p' | 'li' | 'span'; amount?: number; style?: CSSProperties;
}) {
  const M = motion[as] as typeof motion.div;
  return (
    <M className={className} style={style} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }} transition={{ duration: dur.md, ease: ease.out, delay }}>
      {children}
    </M>
  );
}

/* ---------- SplitWords: masked word-by-word rise. Pass lines as array for hard breaks. ---------- */
export function SplitWords({ lines, className = '', delay = 0, stagger = 0.05, animateNow, as = 'h2', bold }: {
  lines: (string | { text: string; bold?: boolean })[][] | string[]; className?: string; delay?: number; stagger?: number;
  /** if provided, controls play instead of in-view */ animateNow?: boolean; as?: 'h1' | 'h2' | 'h3' | 'p'; bold?: string[];
}) {
  const M = motion[as] as typeof motion.h2;
  const norm = (lines as unknown[]).map((l) => (typeof l === 'string' ? (l as string).split(' ') : (l as string[])));
  let i = 0;
  const trigger = animateNow === undefined ? { whileInView: 'show', viewport: vp } : { animate: animateNow ? 'show' : 'hidden' };
  return (
    <M className={className} initial="hidden" {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}>
      {norm.map((words, li) => (
        <span className="split-line" key={li}>
          {words.map((w) => {
            const k = i++;
            return (
              <Fragment key={k}>
                <span className="split-mask">
                  <motion.span className={`split-word ${bold?.includes(w) ? 'is-bold' : ''}`}
                    variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: ease.out } } }}>
                    {w}
                  </motion.span>
                </span>{' '}
              </Fragment>
            );
          })}
        </span>
      ))}
    </M>
  );
}




/* ---------- CountUp ---------- */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '', duration = 1.6, start, className, sep = true, delay = 0 }: {
  value: number; decimals?: number; prefix?: string; suffix?: string; duration?: number; start?: boolean; className?: string; sep?: boolean; delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const go = start ?? inView;
  const mv = useMotionValue(0);
  const fmt = (n: number) => {
    const s = n.toFixed(decimals);
    return sep ? Number(s).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : s;
  };
  const txt = useTransform(mv, (v) => `${prefix}${fmt(v)}${suffix}`);
  useEffect(() => {
    if (!go) return;
    const c = animate(mv, value, { duration, ease: ease.out, delay });
    return () => c.stop();
  }, [go, value, duration, mv, delay]);
  return <motion.span ref={ref} className={className}>{txt}</motion.span>;
}

/* ---------- Logo (official Affinity Core wordmark SVG; letters use currentColor so it works on dark) ---------- */
export function Logo({ light, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''} ${className}`} role="img" aria-label="Affinity Core"
      dangerouslySetInnerHTML={{ __html: logoSvg }} />
  );
}

export { fadeUp };

/** US flag (public-domain design), drawn inline so it stays sharp at any size. */
export function UsFlag({ className = '', title }: { className?: string; title?: string }) {
  return (
    <svg className={`us-flag ${className}`} viewBox="0 0 7410 3900" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect width="7410" height="3900" fill="#b22234" />
      <path d="M0,450H7410m0,600H0m0,600H7410m0,600H0m0,600H7410m0,600H0" stroke="#fff" strokeWidth="300" />
      <rect width="2964" height="2100" fill="#3c3b6e" />
      <g fill="#fff">
        {Array.from({ length: 9 }).flatMap((_, r) =>
          Array.from({ length: r % 2 ? 5 : 6 }).map((__, c) => (
            <circle key={`${r}-${c}`} cx={247 + c * 494 + (r % 2 ? 247 : 0)} cy={210 + r * 210} r="72" />
          )))}
      </g>
    </svg>
  );
}
