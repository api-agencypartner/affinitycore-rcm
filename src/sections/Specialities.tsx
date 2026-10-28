import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Search, X } from 'lucide-react';
import { go, goAnchor } from '../router';
import { Eyebrow, SplitWords } from '../components/ui';
import { ease, vp } from '../motion';
import { SPECIALTIES, getSpecialtyLite, matches, type SpecialtyLite } from '../data/specialties';
import people from '../assets/specialists.png';

/* Positions straight from Figma frame 402:2182 (1570 × 812) in rem (1rem = 10px @1920).
   Six real specialties around the clinicians; the rest are one search away. */
const CARDS: { slug: string; side: -1 | 1; left: number; top: number; body: string }[] = [
  { slug: 'internal-medicine', side: -1, left: 7.8, top: 6.1, body: 'Visits, wellness exams and G2211 add-ons coded to the note, so primary care gets paid in full.' },
  { slug: 'cardiology', side: -1, left: 3.4, top: 32.2, body: 'Echo, stress tests and cath-lab claims with prior auth and vessel modifiers checked first.' },
  { slug: 'orthopedics', side: -1, left: 7.8, top: 58.3, body: 'Joint injections and surgery billed around the 90-day global, with modifiers that stick.' },
  { slug: 'mental-health', side: 1, left: 105.8, top: 6.1, body: 'Therapy and telehealth claims with time-based codes matched to session length.' },
  { slug: 'urgent-care', side: 1, left: 110.3, top: 32.2, body: 'Busy walk-in days billed fast, with eligibility checked at the front desk.' },
  { slug: 'radiology', side: 1, left: 105.8, top: 58.3, body: 'MRI and CT claims split into professional and technical parts, auth on file.' },
];
const ON_HOME = new Set(CARDS.map((c) => c.slug));
const POPULAR = ['gastroenterology', 'obstetrics-and-gynecology', 'pediatrics', 'dermatology'];

/** The code a query matched, if it was a code search ("93306" → that code's row). */
const matchedCode = (s: SpecialtyLite, q: string) => {
  const n = q.trim().toLowerCase();
  return n.length >= 2 ? s.codes.find(([c]) => c.toLowerCase().startsWith(n)) : undefined;
};

function SpecialtyFinder() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();

  // Specialties not shown above come first, so the search surfaces what the cards don't.
  const results = useMemo(() => {
    if (!q.trim()) return [];
    const hits = SPECIALTIES.filter((s) => matches(s, q));
    return [...hits.filter((s) => !ON_HOME.has(s.slug)), ...hits.filter((s) => ON_HOME.has(s.slug))].slice(0, 6);
  }, [q]);
  useEffect(() => setHi(0), [q]);
  useEffect(() => {
    const off = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, []);

  const pick = (s: SpecialtyLite) => { setOpen(false); go(`/specialties/${s.slug}`); };
  const show = open && q.trim().length > 0;

  return (
    <div className="sfind" ref={wrap}>
      <div className={`sfind__bar ${show ? 'is-open' : ''}`}>
        <Search className="sfind__icon" aria-hidden />
        <input ref={input} className="sfind__input" type="search" value={q} id="home-specialty-search"
          placeholder={`Search ${SPECIALTIES.length} specialties or a CPT code`}
          role="combobox" aria-expanded={show} aria-controls={listId} aria-autocomplete="list"
          aria-label="Search specialties"
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, Math.max(results.length - 1, 0))); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
            else if (e.key === 'Enter') { if (results[hi]) pick(results[hi]); else if (q.trim()) go('/specialties'); }
            else if (e.key === 'Escape') { setOpen(false); }
          }} />
        {q && <button type="button" className="sfind__clear" aria-label="Clear search" onClick={() => { setQ(''); input.current?.focus(); }}><X /></button>}
        <button type="button" className="sfind__all" onClick={() => go('/specialties')}>
          All {SPECIALTIES.length} <ArrowRight />
        </button>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div className="sfind__pop" id={listId} role="listbox"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: ease.out }}>
            {results.length ? results.map((s, i) => {
              const Icon = s.icon;
              const code = matchedCode(s, q) ?? s.codes[0];
              return (
                <button type="button" key={s.slug} role="option" aria-selected={hi === i}
                  className={`sfind__row ${hi === i ? 'is-hi' : ''}`}
                  onMouseEnter={() => setHi(i)} onClick={() => pick(s)}>
                  <span className="sfind__ic"><Icon /></span>
                  <span className="sfind__name">{s.name}<small>{s.group}</small></span>
                  <span className="sfind__code"><b>{code[0]}</b>{code[1]}</span>
                  <ArrowRight className="sfind__go" aria-hidden />
                </button>
              );
            }) : (
              <div className="sfind__empty">
                <b>No page for “{q.trim()}” yet.</b>
                <span>We likely bill for it. Tell us your specialty and we’ll show you what we’d fix.</span>
                <button type="button" onClick={() => { setOpen(false); goAnchor('assessment'); }}>Get a free assessment <ArrowRight /></button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sfind__pop-list" aria-label="Popular specialties">
        <span>Popular:</span>
        {POPULAR.map((slug) => {
          const s = getSpecialtyLite(slug)!;
          return <button type="button" key={slug} onClick={() => go(`/specialties/${slug}`)}>{s.name}</button>;
        })}
      </div>
    </div>
  );
}

export function Specialities() {
  const [active, setActive] = useState(0);
  // Mouse parallax (soft springs so it glides)
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18, mass: 0.8 }), sy = useSpring(my, { stiffness: 50, damping: 18, mass: 0.8 });
  const photoX = useTransform(sx, (v) => v * -14), photoY = useTransform(sy, (v) => v * -10);
  const cardX = useTransform(sx, (v) => v * 10), cardY = useTransform(sy, (v) => v * 8);

  return (
    <section className="spec" id="specialties">
      <div className="spec__head">
        <Eyebrow>/ Specialties we serve</Eyebrow>
        <SplitWords className="h-64" lines={['Billing built around', 'your specialty’s codes.']} />
      </div>
      <div className="spec__stage"
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
        onMouseLeave={() => { mx.set(0); my.set(0); }}>
        {/* Center: circle grows, clinicians rise out of it. Circle + photo move together, and the
            photo is clipped by the circle's own bottom arc so the two always line up. */}
        <motion.div className="spec__center" style={{ x: photoX, y: photoY }} initial="hidden" whileInView="show" viewport={vp}>
          <motion.div className="spec__circle" variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { duration: 1.3, ease: ease.out } } }} />
          <div className="spec__clip">
            <motion.img className="spec__people" src={people} alt="Two smiling clinicians in purple scrubs"
              variants={{ hidden: { y: '30%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 1.4, ease: ease.out, delay: 0.3 } } }} />
          </div>
        </motion.div>

        <motion.div className="spec__cards" style={{ x: cardX, y: cardY }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } } }}>
          {CARDS.map((c, i) => {
            const s = getSpecialtyLite(c.slug)!;
            const Icon = s.icon;
            const to = `/specialties/${c.slug}`;
            return (
              <motion.article key={c.slug} className={`spec-card ${active === i ? 'is-active' : ''}`}
                style={{ left: `${c.left}rem`, top: `${c.top}rem` }}
                onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0} role="link" aria-label={`${s.name} billing`}
                onClick={() => go(to)} onKeyDown={(e) => { if (e.key === 'Enter') go(to); }}
                variants={{
                  hidden: { opacity: 0, x: `${-c.side * 20}rem`, scale: 0.85 },
                  show: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.2, ease: ease.out } },
                }}>
                {/* Fill wipes in inside the card only (clipped by the card's radius) */}
                <motion.span className="spec-card__bg" aria-hidden initial={false}
                  animate={{ clipPath: active === i ? 'inset(0% 0% 0% 0%)' : (c.side < 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)') }}
                  transition={{ duration: 0.6, ease: ease.out }} />
                <span className="spec-card__icon"><Icon /></span>
                <div>
                  <h3>{s.name}</h3>
                  <p>{c.body}</p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
      <motion.div className="spec__cta" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out, delay: 0.4 }}>
        <p className="spec__ask">Don’t see yours? Search all {SPECIALTIES.length} specialties we bill for.</p>
        <SpecialtyFinder />
      </motion.div>
    </section>
  );
}
