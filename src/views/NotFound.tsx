'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { Link, go } from '../router';
import { ease } from '../motion';
import '../styles/pages.css';
import { useMotionOff } from '../motionPref';

const LINKS: [string, string, string][] = [
  ['Services', '/services', 'Ten services, one claim followed to paid'],
  ['Specialties', '/specialties', 'Billed by the rules of your specialty'],
  ['States', '/states', 'Every state’s payers and deadlines'],
  ['Free assessment', '/contact', 'See what your practice is leaving unpaid'],
];

/** 404 as a denied claim: CARC CO-404, "service not found at this address". The 0 is a magnifier that hunts for the page. */
export function NotFoundPage() {
  const reduce = useMotionOff();
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 14 }), sy = useSpring(my, { stiffness: 90, damping: 14 });
  const tilt = useTransform(sx, [-26, 26], [-12, 12]);
  const [hunting, setHunting] = useState(true);
  const [stamp, setStamp] = useState<'denied' | 'appeal'>('denied');

  // Idle: the lens sweeps left and right looking for the page. Pointer: it follows the cursor.
  useEffect(() => {
    if (reduce || !hunting) return;
    const a = animate(mx, [0, -22, 18, -10, 0], { duration: 4.2, repeat: Infinity, ease: 'easeInOut' });
    const b = animate(my, [0, -10, 8, 12, 0], { duration: 4.2, repeat: Infinity, ease: 'easeInOut' });
    return () => { a.stop(); b.stop(); };
  }, [reduce, hunting, mx, my]);
  useEffect(() => { const t = setTimeout(() => setStamp('appeal'), reduce ? 0 : 3200); return () => clearTimeout(t); }, [reduce]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = wrap.current?.getBoundingClientRect(); if (!r) return;
    setHunting(false);
    mx.set(Math.max(-26, Math.min(26, (e.clientX - (r.left + r.width / 2)) / 12)));
    my.set(Math.max(-30, Math.min(30, (e.clientY - (r.top + r.height / 2)) / 8)));
  };

  return (
    <main className="nf page" onPointerMove={onMove} onPointerLeave={() => setHunting(true)}>
      <div className="nf-grid" aria-hidden />
      <section className="nf-hero container">
        <motion.p className="nf-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>/ Claim status · page not found</motion.p>

        <div className="nf-num" ref={wrap} aria-label="404">
          <motion.span className="nf-four" initial={{ y: 120, opacity: 0, rotate: -8 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ duration: 1, ease: ease.out }}>4</motion.span>
          <motion.span className="nf-lens" style={{ x: sx, y: sy, rotate: tilt }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.25 }}>
            <svg viewBox="0 0 200 240" aria-hidden>
              <defs>
                <linearGradient id="nfg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8a6bff" /><stop offset="1" stopColor="#4a24d8" /></linearGradient>
                <radialGradient id="nfglass" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#ffffff" stopOpacity="0.95" /><stop offset="1" stopColor="#efeaff" stopOpacity="0.55" /></radialGradient>
              </defs>
              <circle cx="100" cy="92" r="72" fill="url(#nfglass)" />
              <circle cx="100" cy="92" r="72" fill="none" stroke="url(#nfg)" strokeWidth="22" />
              <path d="M62 64a50 50 0 0 1 34-20" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" opacity="0.9" />
              <rect x="88" y="168" width="24" height="64" rx="12" fill="url(#nfg)" />
            </svg>
            <motion.em className="nf-lens__q" animate={reduce ? {} : { opacity: [0.35, 1, 0.35] }} transition={{ duration: 1.6, repeat: Infinity }}>?</motion.em>
          </motion.span>
          <motion.span className="nf-four" initial={{ y: 120, opacity: 0, rotate: 8 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ duration: 1, ease: ease.out, delay: 0.12 }}>4</motion.span>
        </div>

        <motion.div className="nf-era" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.5 }}>
          <div className="nf-era__head"><span>Remittance advice</span><span>Line 1 of 1</span></div>
          <div className="nf-era__row">
            <div><small>CARC</small><b>CO-404</b></div>
            <div className="nf-era__desc"><small>Reason</small><b>Service not found at this address.</b></div>
            <div><small>Allowed</small><b>$0.00</b></div>
          </div>
          <motion.div key={stamp} className={`nf-stamp nf-stamp--${stamp}`} initial={{ scale: 2.4, opacity: 0, rotate: stamp === 'denied' ? -26 : 20 }} animate={{ scale: 1, opacity: 1, rotate: stamp === 'denied' ? -10 : 8 }} transition={{ type: 'spring', stiffness: 520, damping: 20, delay: stamp === 'denied' ? 1.1 : 0 }}>
            {stamp === 'denied' ? 'Denied' : 'Appeal it'}
          </motion.div>
        </motion.div>

        <motion.h1 className="nf-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.7 }}>
          This page got denied. <em>We don’t accept that either.</em>
        </motion.h1>
        <motion.p className="nf-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.85 }}>
          The link may be old or mistyped. We work every denial until it’s paid, so let’s get you where you meant to go.
        </motion.p>
        <motion.div className="nf-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 1 }}>
          <Link to="/" className="ty-btn ty-btn--solid"><ArrowLeft size={17} /> Appeal to the homepage</Link>
          <button type="button" className="ty-btn" onClick={() => (typeof window !== 'undefined' && window.history.length > 1 ? window.history.back() : go('/'))}>Go back a page</button>
          <button type="button" className="ty-btn" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, metaKey: true }))}><Search size={16} /> Search the site</button>
        </motion.div>

        <motion.ul className="nf-links" initial="h" animate="s" variants={{ h: {}, s: { transition: { staggerChildren: 0.08, delayChildren: 1.15 } } }}>
          {LINKS.map(([t, to, d]) => (
            <motion.li key={to} variants={{ h: { opacity: 0, y: 18 }, s: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out } } }}>
              <Link to={to}><b>{t}</b><span>{d}</span><ArrowRight size={18} /></Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </main>
  );
}
