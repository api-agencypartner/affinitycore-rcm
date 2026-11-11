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
    <motion.div className="plat__pill-wrap [position:absolute] [z-index:1] [@media(max-width:_1279px)]:[display:none] [will-change:transform]" style={{ left: `${l.x / 10}rem`, top: `${l.y / 10}rem`, width: `${l.w / 10}rem`, height: `${l.h / 10}rem`, y }}>
      <motion.div className="plat__pill [width:100%] [height:100%] [display:grid] [place-items:center] [border-radius:10rem] [background:#fff] [border:1px_solid_#f1eefb] [box-shadow:0_1rem_3rem_rgba(25,_37,_51,_0.06)]"
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
    <section className="plat [position:relative] [height:76rem] [margin-top:9rem] [overflow:hidden] [@media(max-width:_1279px)]:[max-width:100vw] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[padding:8rem_2rem]" ref={ref}>
      <div className="plat__frame [position:absolute] [left:50%] [top:0] [width:192rem] [height:76rem] [margin-left:-96rem] [transform:scale(0.875)] [transform-origin:50%_50%] [@media(max-width:_1279px)]:[display:none]">
      <svg className="plat__arcs [position:absolute] [inset:0] [width:100%] [height:100%] [@media(max-width:_1279px)]:[display:none]" viewBox="0 0 1920 760" preserveAspectRatio="none" aria-hidden>
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

      <div className="plat__center [position:absolute] [left:50%] [top:17rem] [translate:-50%_0] [width:86rem] [display:flex] [flex-direction:column] [align-items:center] [text-align:center] [gap:1.2rem] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[left:auto] [@media(max-width:_1279px)]:[top:auto] [@media(max-width:_1279px)]:[translate:none] [@media(max-width:_1279px)]:[width:100%]">
        <Eyebrow>/ Platforms we work with</Eyebrow>
        <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={lines} stagger={0.06} />
        <Reveal as="p" className="body-18 plat__copy [font-size:1.8rem] [line-height:1.6] [color:var(--navy)] [margin-top:0.8rem] [margin-bottom:2.8rem] [.testi\_\_intro_&]:[margin-top:0.8rem] [.faq\_\_intro_&]:[margin-top:0.8rem] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6] [@media(max-width:_1279px)]:[margin-bottom:0] [.tk\_\_head_&]:[margin-top:0.8rem] [.tk\_\_head_&]:[max-width:52rem] [.pw\_\_head_&]:[max-width:60rem] [.pw\_\_head_&]:[color:#4a4f63] [.ac\_\_copy_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[margin-top:0.8rem] [.mdef\_\_head_&]:[max-width:48rem] [.nl\_\_copy_&]:[margin-top:0.8rem]" delay={0.3}>{copy ?? 'No new software for your staff to learn. We work directly in your EHR and practice management system, and map access and workflow with you before anything changes.'}</Reveal>
        <ul className="plat__mob [display:none] [@media(max-width:_1279px)]:[display:grid] [@media(max-width:_1279px)]:[grid-template-columns:repeat(4,_minmax(0,_1fr))] [@media(max-width:_1279px)]:[gap:1.2rem] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[margin:1.2rem_0_3.2rem] [@media(max-width:_1279px)]:[&_li]:[display:grid] [@media(max-width:_1279px)]:[&_li]:[place-items:center] [@media(max-width:_1279px)]:[&_li]:[height:8.4rem] [@media(max-width:_1279px)]:[&_li]:[padding:1.4rem] [@media(max-width:_1279px)]:[&_li]:[border-radius:10rem] [@media(max-width:_1279px)]:[&_li]:[background:#fff] [@media(max-width:_1279px)]:[&_li]:[border:1px_solid_#f1eefb] [@media(max-width:_1279px)]:[&_li]:[box-shadow:0_1rem_3rem_rgba(25,_37,_51,_0.06)] [@media(max-width:_1279px)]:[&_img]:[max-width:100%] [@media(max-width:_1279px)]:[&_img]:[max-height:4.4rem] [@media(max-width:_1279px)]:[&_img]:[object-fit:contain] [@media(max-width:_640px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[&_li]:[height:7.2rem]" aria-label="EHR and practice management systems">
          {LOGOS.map((l) => <li key={l.alt}><img src={l.src} alt={l.alt} loading="lazy" /></li>)}
        </ul>
        <Reveal delay={0.45}><Button>{cta}</Button></Reveal>
      </div>
    </section>
  );
}
