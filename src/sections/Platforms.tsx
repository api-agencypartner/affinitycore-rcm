import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { Button, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { ease, vp } from '../motion';
import oracle from '../assets/logo-oracle.png';
import meditech from '../assets/logo-meditech.png';
import athena from '../assets/logo-athena.png';
import epic from '../assets/logo-epic.png';
import ecw from '../assets/logo-ecw.png';
import nextgen from '../assets/logo-nextgen.png';
import greenway from '../assets/logo-greenway.png';
import modmed from '../assets/logo-modmed.png';

/* x, y, w, h from Figma frame 511:1974 (1920 × 760); img = inner logo size */
const LOGOS = [
  { src: oracle, alt: 'Oracle Health', x: 120, y: 126, w: 170, h: 101, iw: 110, depth: 1.2 },
  { src: epic, alt: 'Epic', x: 325, y: 248, w: 170, h: 109, iw: 110, depth: 0.6 },
  { src: athena, alt: 'athenahealth', x: 116, y: 371, w: 141, h: 146, iw: 78, depth: 1 },
  { src: meditech, alt: 'MEDITECH', x: 311, y: 485, w: 170, h: 84, iw: 110, depth: 1.4 },
  { src: modmed, alt: 'Modernizing Medicine', x: 1614, y: 103, w: 212, h: 120, iw: 156, depth: 1.1 },
  { src: nextgen, alt: 'NextGen Healthcare', x: 1442, y: 189, w: 170, h: 112, iw: 110, depth: 0.7 },
  { src: greenway, alt: 'Greenway Health', x: 1653, y: 347, w: 170, h: 99, iw: 110, depth: 1.3 },
  { src: ecw, alt: 'eClinicalWorks', x: 1423, y: 454, w: 232, h: 92, iw: 179, depth: 0.8 },
];

function Pill({ l, i, p }: { l: (typeof LOGOS)[number]; i: number; p: MotionValue<number> }) {
  const y = useTransform(p, [0, 1], [`${8 * l.depth}rem`, `${-8 * l.depth}rem`]);
  const fromLeft = l.x < 960;
  return (
    <motion.div className="plat__pill-wrap" style={{ left: `${l.x / 10}rem`, top: `${l.y / 10}rem`, width: `${l.w / 10}rem`, height: `${l.h / 10}rem`, y }}>
      <motion.div className="plat__pill"
        initial={{ opacity: 0, scale: 0.4, x: fromLeft ? '-8rem' : '8rem' }} whileInView={{ opacity: 1, scale: 1, x: 0 }} viewport={vp}
        transition={{ type: 'spring', stiffness: 160, damping: 16, delay: 0.2 + i * 0.07 }}
        whileHover={{ scale: 1.08, boxShadow: '0 1.6rem 4rem rgba(106,65,249,0.22)' }}>
        <motion.img src={l.src} alt={l.alt} style={{ width: `${l.iw / 10}rem` }}
          animate={{ y: [0, -6, 0] }} transition={{ duration: 3 + (i % 3) * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }} />
      </motion.div>
    </motion.div>
  );
}

/** `copy` / `lines` let child pages reuse the homepage fold with their own wording. */
export function Platforms({ lines = ['Works inside the', 'systems you already use.'], copy, cta = 'Check your platform' }: { lines?: string[]; copy?: string; cta?: string } = {}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scrollYProgress = useSpring(raw, { stiffness: 80, damping: 24, mass: 0.6 });
  const arcs = [801, 1001, 919, 1119]; // ellipse centres → edges at x≈181, 381 (left) and 1539, 1739 (right)
  return (
    <section className="plat" ref={ref}>
      <div className="plat__frame">
      <svg className="plat__arcs" viewBox="0 0 1920 760" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="arcfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.08" stopColor="#6a41f9" stopOpacity="0" /><stop offset="0.45" stopColor="#6a41f9" stopOpacity="0.55" />
            <stop offset="0.85" stopColor="#6a41f9" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* visible halves of Figma Ellipses 805–808 (left arcs mirror the right ones) */}
        {arcs.map((cx, i) => {
          const right = i >= 2;
          return (
            <motion.path key={cx} d={`M ${cx} ${380 - 692} A 620 692 0 0 ${right ? 1 : 0} ${cx} ${380 + 692}`}
              fill="none" stroke="url(#arcfade)" strokeWidth="1.4"
              initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={vp}
              transition={{ duration: 2, ease: ease.inOut, delay: i * 0.12 }} />
          );
        })}
      </svg>
      {LOGOS.map((l, i) => <Pill key={l.alt} l={l} i={i} p={scrollYProgress} />)}
      </div>

      <div className="plat__center">
        <Eyebrow>/ Platforms we work with</Eyebrow>
        <SplitWords className="h-64" lines={lines} stagger={0.06} />
        <Reveal as="p" className="body-18 plat__copy" delay={0.3}>{copy ?? 'No new software for your staff to learn. We work directly in your EHR and practice management system, and map access and workflow with you before anything changes.'}</Reveal>
        <ul className="plat__mob" aria-label="EHR and practice management systems">
          {LOGOS.map((l) => <li key={l.alt}><img src={l.src} alt={l.alt} loading="lazy" /></li>)}
        </ul>
        <Reveal delay={0.45}><Button>{cta}</Button></Reveal>
      </div>
    </section>
  );
}
