'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Phone, FileSignature, BarChart3 } from 'lucide-react';
import { Link } from '../router';
import { ease } from '../motion';
import '../styles/pages.css';
import { useMotionOff } from '../motionPref';

/** The forms store the first name here before routing to /thank-you. */
export const TY_KEY = 'ac_ty_name';
export const rememberName = (full: string) => {
  const first = full.trim().replace(/^dr\.?\s+/i, '').split(/\s+/)[0] ?? '';
  try { sessionStorage.setItem(TY_KEY, first); } catch { /* private mode */ }
};

const STEPS = [
  { ico: Phone, t: 'We reach out', d: 'A US-based billing specialist calls in your time zone to set up your call.' },
  { ico: FileSignature, t: 'BAA, then one month of claims', d: 'We sign a BAA before we touch a record, then review your claims.' },
  { ico: BarChart3, t: 'Your report and a 30-minute call', d: 'Where revenue is leaking, priced in dollars, and what we’d fix first.' },
];

function Confetti({ go }: { go: boolean }) {
  const bits = useMemo(() => Array.from({ length: 34 }, (_, i) => {
    const a = (i / 34) * Math.PI * 2 + Math.random() * 0.4, r = 160 + Math.random() * 190;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.75 - 40, rot: Math.random() * 540 - 270, w: 6 + Math.random() * 8, c: ['#6a41f9', '#8a6bff', '#c9bcff', '#4ade80', '#ffffff'][i % 5], d: Math.random() * 0.15 };
  }), []);
  return (
    <div className="ty-confetti" aria-hidden>
      {bits.map((b, i) => (
        <motion.i key={i} style={{ width: b.w, height: b.w * 0.45, background: b.c }}
          initial={{ x: 0, y: 0, opacity: 0, rotate: 0, scale: 0.4 }}
          animate={go ? { x: b.x, y: [0, b.y, b.y + 140], opacity: [0, 1, 0], rotate: b.rot, scale: 1 } : {}}
          transition={{ duration: 1.9, delay: b.d, ease: [0.2, 0.8, 0.3, 1], times: [0, 0.45, 1] }} />
      ))}
    </div>
  );
}

export function ThankYouPage() {
  const reduce = useMotionOff();
  const [name, setName] = useState('');
  const [stamped, setStamped] = useState(false);
  useEffect(() => { try { setName(sessionStorage.getItem(TY_KEY) ?? ''); } catch { /* noop */ } }, []);
  useEffect(() => { const t = setTimeout(() => setStamped(true), reduce ? 0 : 1500); return () => clearTimeout(t); }, [reduce]);

  return (
    <main className="ty page">

      <section className="ty-hero container">
        <div className="ty-stage">
          <Confetti go={stamped && !reduce} />
          <motion.div className="ty-card" initial={{ y: 80, opacity: 0, rotate: -4 }} animate={stamped ? { y: 0, opacity: 1, rotate: [-1.5, 1, 0], x: [0, -6, 5, -2, 0] } : { y: 0, opacity: 1, rotate: -1.5 }}
            transition={stamped ? { duration: 0.45, ease: 'easeOut' } : { duration: 1, ease: ease.out, delay: 0.1 }}>
            <div className="ty-card__top"><span>Free revenue assessment</span><span className="ty-card__status"><i aria-hidden /> In review</span></div>
            <div className="ty-card__rows">
              {['Practice details', 'Monthly volume', 'Specialty', 'Contact'].map((r, i) => (
                <div key={r} className="ty-card__row">
                  <small>{r}</small>
                  <motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.5 + i * 0.15 }} />
                  <motion.b initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.75 + i * 0.15 }}>✓</motion.b>
                </div>
              ))}
            </div>
            <svg className="ty-ring" viewBox="0 0 120 120" aria-hidden>
              <defs><linearGradient id="tyg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8a6bff" /><stop offset="1" stopColor="#6a41f9" /></linearGradient></defs>
              <motion.circle cx="60" cy="60" r="52" fill="none" stroke="url(#tyg)" strokeWidth="7" strokeLinecap="round" initial={{ pathLength: 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: ease.out, delay: 0.4 }} style={{ originX: '50%', originY: '50%' }} />
              <motion.path d="M38 62l15 15 30-34" fill="none" stroke="url(#tyg)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: ease.out, delay: 1.2 }} />
            </svg>
            <motion.div className="ty-stamp" initial={{ scale: 2.6, opacity: 0, rotate: -24 }} animate={stamped ? { scale: 1, opacity: 1, rotate: -12 } : {}} transition={{ type: 'spring', stiffness: 520, damping: 22 }}>
              <span>Received</span><small>Affinity Core · Plano, TX</small>
            </motion.div>
          </motion.div>
        </div>

        <div className="ty-copy">
          <motion.p className="ty-eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>/ Request received</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: ease.out, delay: 0.3 }}>
            Thanks{name ? `, ${name}` : ''}. <em>Your assessment is underway.</em>
          </motion.h1>
          <motion.p className="ty-lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.5 }}>
            We’ve got your details. Here’s what happens next, so you know exactly what to expect.
          </motion.p>

          <ol className="ty-steps">
            <motion.span className="ty-steps__line" aria-hidden initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1.4, ease: ease.out, delay: 0.9 }} />
            {STEPS.map((s, i) => (
              <motion.li key={s.t} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 1 + i * 0.25 }}>
                <span className={`ty-steps__ico${i === 0 ? ' is-now' : ''}`}><s.ico size={18} /></span>
                <div><b>{s.t}</b><p>{s.d}</p></div>
              </motion.li>
            ))}
          </ol>

          <motion.div className="ty-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 1.8 }}>
            <a href="tel:+12148512698" className="ty-btn ty-btn--solid"><Phone size={17} /> Can’t wait? Call 214-851-2698</a>
            <Link to="/case-studies" className="ty-btn">See client results <ArrowRight size={17} /></Link>
          </motion.div>
          <p className="ty-fine">Please don’t send patient information by email. We’ll set up a secure way to share claims after the BAA is signed.</p>
        </div>
      </section>
    </main>
  );
}
