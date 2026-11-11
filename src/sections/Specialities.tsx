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
    <div className="sfind [position:relative] [width:min(68rem,_100%)] [display:flex] [flex-direction:column] [align-items:center] [gap:1.6rem]" ref={wrap}>
      <div className={String.raw`sfind__bar [width:100%] [height:6.8rem] [display:flex] [align-items:center] [gap:1.2rem] [padding:0_0.8rem_0_2.4rem] [border-radius:4rem] [background:#fff] [border:1px_solid_var(--lav-border)] [box-shadow:0_1.2rem_3.2rem_rgba(106,_65,_249,_0.08)] [transition:border-color_0.3s,_box-shadow_0.3s] [&:focus-within]:[border-color:var(--purple)] [&:focus-within]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.1),_0_1.2rem_3.2rem_rgba(106,_65,_249,_0.12)] [@media(max-width:_640px)]:[height:5.6rem] [@media(max-width:_640px)]:[padding-left:1.8rem] ${show ? 'is-open' : ''}`}>
        <Search className="sfind__icon [flex:none] [width:2.2rem] [height:2.2rem] [color:var(--purple)]" aria-hidden />
        <input ref={input} className="sfind__input [flex:1] [min-width:0] [height:100%] [border:0] [outline:0] [background:none] [font-family:inherit] [font-weight:inherit] [font-style:inherit] [line-height:inherit] [font-size:1.8rem] [color:var(--ink-2)] [&::placeholder]:[color:#a29cbc] [&::-webkit-search-cancel-button]:[display:none] [@media(max-width:_640px)]:[font-size:1.6rem]" type="search" value={q} id="home-specialty-search"
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
        {q && <button type="button" className="sfind__clear [flex:none] [width:3.2rem] [height:3.2rem] [border-radius:50%] [display:grid] [place-items:center] [color:#6b6f7c] [background:#f4f0ff] [&_svg]:[width:1.6rem] [&_svg]:[height:1.6rem]" aria-label="Clear search" onClick={() => { setQ(''); input.current?.focus(); }}><X /></button>}
        <button type="button" className="sfind__all [flex:none] [height:5.2rem] [display:inline-flex] [align-items:center] [gap:0.8rem] [padding:0_2.2rem] [border-radius:3rem] [background:var(--grad-x)] [color:#fff] [font-family:var(--f-jak)] [font-weight:600] [font-size:1.6rem] [transition:box-shadow_0.3s] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover]:[box-shadow:0_0.8rem_2.4rem_rgba(106,_65,_249,_0.3)] [&:hover_svg]:[transform:translateX(0.3rem)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:2px]! [@media(max-width:_640px)]:[height:4.4rem] [@media(max-width:_640px)]:[padding:0_1.4rem] [@media(max-width:_640px)]:[font-size:1.4rem]" onClick={() => go('/specialties')}>
          All {SPECIALTIES.length} <ArrowRight />
        </button>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div className="sfind__pop [position:absolute] [top:7.6rem] [left:0] [right:0] [z-index:20] [padding:0.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_var(--lav-border)] [box-shadow:0_2.4rem_6rem_rgba(17,_22,_69,_0.14)] [display:flex] [flex-direction:column] [gap:0.2rem] [@media(max-width:_640px)]:[top:6.4rem]" id={listId} role="listbox"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: ease.out }}>
            {results.length ? results.map((s, i) => {
              const Icon = s.icon;
              const code = matchedCode(s, q) ?? s.codes[0];
              return (
                <button type="button" key={s.slug} role="option" aria-selected={hi === i}
                  className={String.raw`sfind__row [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:2px]! [display:grid] [grid-template-columns:4.4rem_minmax(0,_1fr)_auto_2rem] [align-items:center] [gap:1.4rem] [padding:1rem_1.4rem_1rem_1rem] [border-radius:1.6rem] [text-align:left] [transition:background_0.2s] [&.is-hi]:[background:#f7f5ff] [@media(max-width:_640px)]:[grid-template-columns:4rem_minmax(0,_1fr)_1.8rem] ${hi === i ? 'is-hi' : ''}`}
                  onMouseEnter={() => setHi(i)} onClick={() => pick(s)}>
                  <span className="sfind__ic [width:4.4rem] [height:4.4rem] [border-radius:1.2rem] [display:grid] [place-items:center] [background:#f1edff] [color:var(--purple)] [transition:background_0.2s,_color_0.2s] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [&_svg]:[stroke-width:1.6] [.sfind\_\_row.is-hi_&]:[background:var(--purple)] [.sfind\_\_row.is-hi_&]:[color:#fff]"><Icon /></span>
                  <span className="sfind__name [display:flex] [flex-direction:column] [font-family:var(--f-jak)] [font-weight:600] [font-size:1.7rem] [color:var(--ink-2)] [min-width:0] [&_small]:[font-family:var(--f-sans)] [&_small]:[font-weight:400] [&_small]:[font-size:1.3rem] [&_small]:[color:#8a8ea0]">{s.name}<small>{s.group}</small></span>
                  <span className="sfind__code [display:inline-flex] [align-items:center] [gap:0.8rem] [font-size:1.3rem] [color:#6b6f7c] [max-width:26rem] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis] [&_b]:[flex:none] [&_b]:[padding:0.2rem_0.8rem] [&_b]:[border-radius:1rem] [&_b]:[background:#f4f0ff] [&_b]:[font-family:var(--f-mono)] [&_b]:[font-weight:500] [&_b]:[color:var(--purple)] [@media(max-width:_640px)]:[display:none]"><b>{code[0]}</b>{code[1]}</span>
                  <ArrowRight className="sfind__go [width:1.8rem] [height:1.8rem] [color:var(--purple)] [opacity:0] [transform:translateX(-0.4rem)] [transition:opacity_0.2s,_transform_0.3s] [.sfind\_\_row.is-hi_&]:[opacity:1] [.sfind\_\_row.is-hi_&]:[transform:none]" aria-hidden />
                </button>
              );
            }) : (
              <div className="sfind__empty [display:flex] [flex-direction:column] [align-items:flex-start] [gap:0.6rem] [padding:1.6rem_1.8rem] [font-size:1.6rem] [line-height:2.4rem] [color:#5b5f6e] [&_b]:[font-family:var(--f-jak)] [&_b]:[font-weight:600] [&_b]:[color:var(--ink-2)] [&_button]:[margin-top:0.6rem] [&_button]:[display:inline-flex] [&_button]:[align-items:center] [&_button]:[gap:0.6rem] [&_button]:[font-weight:600] [&_button]:[color:var(--purple)] [&_button_svg]:[width:1.6rem] [&_button_svg]:[height:1.6rem]">
                <b>No page for “{q.trim()}” yet.</b>
                <span>We likely bill for it. Tell us your specialty and we’ll show you what we’d fix.</span>
                <button type="button" onClick={() => { setOpen(false); goAnchor('assessment'); }}>Get a free assessment <ArrowRight /></button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sfind__pop-list [&_button:focus-visible]:[outline:2px_solid_var(--purple)] [&_button:focus-visible]:[outline-offset:2px]! [display:flex] [flex-wrap:wrap] [justify-content:center] [align-items:center] [gap:0.8rem] [font-size:1.5rem] [color:#8a8ea0] [&_button]:[padding:0.6rem_1.4rem] [&_button]:[border-radius:2rem] [&_button]:[border:1px_solid_var(--lav-border)] [&_button]:[background:#fff] [&_button]:[color:var(--ink-2)] [&_button]:[font-size:1.5rem] [&_button]:[transition:border-color_0.3s,_color_0.3s] [&_button:hover]:[border-color:var(--purple)] [&_button:hover]:[color:var(--purple)]" aria-label="Popular specialties">
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
    <section className="spec [padding:16rem_var(--gutter)_0] [display:flex] [flex-direction:column] [align-items:center] [@media(max-width:_1279px)]:[max-width:100vw] [@media(max-width:_1279px)]:[padding:10rem_2rem_0]" id="specialties">
      <div className="spec__head [display:flex] [flex-direction:column] [align-items:center] [gap:1.2rem] [text-align:center]">
        <Eyebrow>/ Specialties we serve</Eyebrow>
        <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Billing built around', 'your specialty’s codes.']} />
      </div>
      <div className="spec__stage [position:relative] [width:157rem] [height:81.2rem] [margin-top:3.6rem] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:center]"
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - 0.5); my.set((e.clientY - r.top) / r.height - 0.5); }}
        onMouseLeave={() => { mx.set(0); my.set(0); }}>
        {/* Center: circle grows, clinicians rise out of it. Circle + photo move together, and the
            photo is clipped by the circle's own bottom arc so the two always line up. */}
        <motion.div className="spec__center [position:absolute] [left:49.2rem] [top:0] [width:58.6rem] [height:73rem] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[left:auto] [@media(max-width:_1279px)]:[width:min(58.6rem,_90vw)] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[aspect-ratio:58.6_/_73] [@media(max-width:_1279px)]:[scale:1]" style={{ x: photoX, y: photoY }} initial="hidden" whileInView="show" viewport={vp}>
          <motion.div className="spec__circle [position:absolute] [left:0] [top:14.4rem] [width:58.6rem] [height:58.6rem] [border-radius:50%] [background:var(--purple)] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[aspect-ratio:1] [@media(max-width:_1279px)]:[top:20%]" variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { duration: 1.3, ease: ease.out } } }} />
          <div className="spec__clip [position:absolute] [inset:0] [border-radius:0_0_29.3rem_29.3rem] [overflow:hidden]">
            <motion.img className="spec__people [position:absolute] [left:0] [top:2.3rem] [width:58.6rem] [height:70.7rem] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[top:0]" src={people} alt="Two smiling clinicians in purple scrubs"
              variants={{ hidden: { y: '30%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 1.4, ease: ease.out, delay: 0.3 } } }} />
          </div>
        </motion.div>

        <motion.div className="spec__cards [position:absolute] [inset:0] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[inset:auto] [@media(max-width:_1279px)]:[display:grid] [@media(max-width:_1279px)]:[grid-template-columns:1fr] [@media(max-width:_1279px)]:[gap:1.6rem] [@media(max-width:_1279px)]:[width:100%] [@media(max-width:_1279px)]:[transform:none]! [@media(max-width:_1279px)]:[margin-top:3rem] [@media(min-width:_768px)_and_(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]!" style={{ x: cardX, y: cardY }} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } } }}>
          {CARDS.map((c, i) => {
            const s = getSpecialtyLite(c.slug)!;
            const Icon = s.icon;
            const to = `/specialties/${c.slug}`;
            return (
              <motion.article key={c.slug} className={String.raw`spec-card [position:absolute] [width:43.4rem] [display:flex] [gap:1.9rem] [padding:3.2rem_3.2rem_3.2rem_2.4rem] [border-radius:3.2rem] [border:1px_solid_var(--lav-border)] [background:#fff] [isolation:isolate] [overflow:hidden] [outline:none] [transition:color_0.35s,_box-shadow_0.5s,_border-color_0.5s] [&.is-active]:[border-color:var(--purple)] [&.is-active]:[box-shadow:0_1.6rem_4rem_rgba(106,_65,_249,_0.22)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [&_h3]:[font-family:var(--f-jak)] [&_h3]:[font-weight:600] [&_h3]:[font-size:2.2rem] [&_h3]:[line-height:2.31rem] [&_h3]:[letter-spacing:-0.0945rem] [&_h3]:[color:var(--ink-2)] [&_h3]:[transition:color_0.35s] [&_p]:[font-size:1.8rem] [&_p]:[line-height:3rem] [&_p]:[color:#000] [&_p]:[transition:color_0.35s] [&.is-active_h3]:[color:#fff] [&.is-active_p]:[color:#fff] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[left:auto]! [@media(max-width:_1279px)]:[top:auto]! [@media(max-width:_1279px)]:[width:100%] [cursor:pointer] [&_p]:[margin-top:1.2rem] [&>div]:[min-width:0] ${active === i ? 'is-active' : ''}`}
                style={{ left: `${c.left}rem`, top: `${c.top}rem` }}
                onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} tabIndex={0} role="link" aria-label={`${s.name} billing`}
                onClick={() => go(to)} onKeyDown={(e) => { if (e.key === 'Enter') go(to); }}
                variants={{
                  hidden: { opacity: 0, x: `${-c.side * 20}rem`, scale: 0.85 },
                  show: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.2, ease: ease.out } },
                }}>
                {/* Fill wipes in inside the card only (clipped by the card's radius) */}
                <motion.span className="spec-card__bg [position:absolute] [inset:0] [background:var(--purple)] [z-index:-1] [transform-origin:var(--ox,_0%)_50%]" aria-hidden initial={false}
                  animate={{ clipPath: active === i ? 'inset(0% 0% 0% 0%)' : (c.side < 0 ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 100%)') }}
                  transition={{ duration: 0.6, ease: ease.out }} />
                <span className="spec-card__icon [width:7.2rem] [height:7.2rem] [flex-shrink:0] [display:grid] [place-items:center] [color:var(--purple)] [transition:color_0.35s] [&_svg]:[width:5.6rem] [&_svg]:[height:5.6rem] [&_svg]:[stroke-width:1.3] [.spec-card.is-active_&]:[color:#fff]"><Icon /></span>
                <div>
                  <h3>{s.name}</h3>
                  <p>{c.body}</p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
      <motion.div className="spec__cta [margin-top:-1.6rem] [position:relative] [@media(max-width:_1279px)]:[margin-top:3rem] [&.spec\_\_cta]:[margin-top:3.2rem] [display:flex] [flex-direction:column] [align-items:center] [gap:1.6rem] [width:100%] [z-index:5]" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out, delay: 0.4 }}>
        <p className="spec__ask [font-size:1.8rem] [line-height:2.8rem] [color:#5b5f6e] [text-align:center]">Don’t see yours? Search all {SPECIALTIES.length} specialties we bill for.</p>
        <SpecialtyFinder />
      </motion.div>
    </section>
  );
}
