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
const SP_IMG: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/sp/*.webp', { eager: true, import: 'default' }) as Record<string, string>)
    .map(([k, v]) => [k.split('/').pop()!.replace('.webp', ''), v]),
);
/** Focal point per photo so the subject clears the widget (bottom-left) and the chip (top). */
const SP_POS: Record<string, string> = {
  'allergy-and-immunology': '68% 30%', 'gastroenterology': '30% 55%', 'internal-medicine': '45% 30%', 'nephrology': '50% 40%',
  'neurology': '55% 20%', 'psychiatry': '72% 40%', 'urology': '38% 35%', 'radiology': '55% 40%', 'pain-management': '50% 35%',
  'podiatry': '40% 50%', 'wound-care': '45% 40%', 'pediatrics': '55% 35%', 'ambulatory-surgery-centers': '45% 35%',
  'dermatology': '62% 40%', 'oncology': '55% 55%', 'ophthalmology': '62% 30%', 'anesthesia': '60% 30%',
};
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';

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
    <div className="ecg w-card w-glass">
      <div className="ecg__head"><span><i />Today’s {(s.short ?? s.name).toLowerCase()} claims</span><b>{done}<small> / {n} coded</small></b></div>
      <div className="ecg__trace">
        <svg viewBox={`0 0 ${W} 80`} preserveAspectRatio="none" aria-hidden>
          <path d={d} fill="none" stroke="#e3dcff" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <motion.path d={d} fill="none" stroke="#6a41f9" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }} animate={{ pathLength: done / n }} transition={{ duration: done === 0 ? 0 : 1.2, ease: 'linear' }} />
        </svg>
        <div className="ecg__ticks">
          {s.beats.map((b, i) => (
            <span key={b.code + i} className={i < done ? 'is-on' : ''} style={{ left: `${((i * BEAT_W + 60) / W) * 100}%` }}>
              <AnimatePresence>{i < done && <motion.code initial={{ opacity: 0, y: 8, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 22 }}>{b.code}</motion.code>}</AnimatePresence>
            </span>
          ))}
        </div>
      </div>
      <ul className="ecg__rows">
        {s.beats.map((b, i) => {
          const on = i < done;
          return (
            <li key={b.code + b.label}>
              <code>{b.code}</code>
              <span>{b.label}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.em key={on ? 'y' : 'n'} className={on ? 'is-ok' : ''} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}>
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
    <section className="sp-hero">
      <div className="sp-hero__copy">
        <motion.nav className="crumbs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="/specialties"><ChevronLeft size={16} /> Specialties</Link><span>/</span><span>{s.name}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={s.heroTitle} bold={[s.heroAccent]} />
        <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>{s.heroSub}</motion.p>
        <motion.div className="sh-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
          <HeroCapture source={`specialty:${s.slug}`} />
        </motion.div>
        <TrustRow />
      </div>
      <div className="sp-hero__stage">
        <motion.div className="sp-hero__photo" initial={{ clipPath: 'inset(10% 10% 10% 10% round 2.4rem)', opacity: 0 }} animate={{ clipPath: 'inset(0% 0% 0% 0% round 2.4rem)', opacity: 1 }}
          transition={{ duration: 1.4, ease: ease.curtain, delay: 0.2 }}>
          <img src={SP_IMG[s.slug] ?? PHOTOS[s.photo]} alt={s.photoAlt} style={SP_POS[s.slug] ? { objectPosition: SP_POS[s.slug] } : undefined} />
        </motion.div>
        <motion.div className="sp-hero__widget xp-hero__widget" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.8 }}>
          {SIGNATURE[s.slug] ? (() => { const Sig = SIGNATURE[s.slug]; return <Sig />; })() : <BeatStrip s={s} />}
        </motion.div>
        <motion.div className="hero-chip sp-hero__chip" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1.1 }}>
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
    <section className="ld container" id="codes">
      <div className="ld__list">
        <Eyebrow>{s.ledger.eyebrow}</Eyebrow>
        <SplitWords className="h-56" lines={s.ledger.lines} stagger={0.04} />
        <Reveal as="p" className="body-18 ld__intro">{s.ledger.intro}</Reveal>
        <motion.ul className="ld__rows" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}>
          {s.ledger.rows.map((row, k) => (
            <motion.li key={row.code} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } } }}>
              <button className={`ld__row ${k === i ? 'is-on' : ''}`} onMouseEnter={() => setI(k)} onFocus={() => setI(k)} onClick={() => setI(k)} aria-expanded={k === i}>
                {k === i && <motion.span layoutId="ld-hl" className="ld__hl" transition={{ type: 'spring', stiffness: 300, damping: 32 }} />}
                <code>{row.code}</code><span>{row.name}</span><ArrowRight size={18} />
              </button>
              {/* inline detail for small screens */}
              <AnimatePresence initial={false}>
                {k === i && (
                  <motion.div className="ld__inline" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                    <p><small>What trips it</small>{row.trip}</p>
                    <p><small>How we catch it</small>{row.catch}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </motion.ul>
      </div>
      <div className="ld__side">
        <motion.div className="ld__paper" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: ease.out }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={r.code} className="ld__card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: ease.out, delay: 0.1 } }} exit={{ opacity: 0, transition: { duration: 0.1 } }}>
              <span className="ld__n">0{i + 1} / 0{s.ledger.rows.length}</span>
              <code className="ld__code">{r.code}</code>
              <p className="ld__name">{r.name}</p>
              <div className="ld__pair">
                <div><small>What trips it</small><p>{r.trip}</p></div>
                <div className="is-fix"><small>How we catch it</small><p>{r.catch}</p></div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* the specialty's own drawing; the marker moves to where the selected code applies */}
          {ART[s.slug] ? <LedgerArt slug={s.slug} i={i} code={r.code} /> : (
            <svg className="ld__trace" viewBox="0 0 480 80" preserveAspectRatio="none" aria-hidden>
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
    <li className={`ac-row ${decided ? 'is-ok' : ''} ${over ? 'is-over' : ''}`}>
      <div className="ac-row__what"><b>{r.study}</b><small><code>{r.code}</code> · {r.payer}</small></div>
      <span className={`ac-row__kind ${r.kind === 'Urgent' ? 'is-urgent' : ''}`}>{r.kind} · {r.limitH <= 72 ? '72 h' : '7 days'}</span>
      <div className="ac-row__bar">
        <div className="ac-row__track"><motion.i style={{ transform: sx }} /></div>
        <small>{decided ? `Decided ${fmtElapsed(decidedH!, r.limitH).toLowerCase()}` : fmtElapsed(el, r.limitH)}</small>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.em key={status} className="ac-row__status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
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
    <section className="ac container">
      <div className="ac__board" ref={ref}>
        <div className="ac__bg" aria-hidden><img src={fluted} alt="" /></div>
        <div className="ac__copy">
          <Eyebrow>{s.auth!.eyebrow}</Eyebrow>
          <SplitWords className="h-56" lines={s.auth!.lines} stagger={0.04} />
          <Reveal as="p" className="body-18">{s.auth!.body}</Reveal>
          <a className="prob__src ac__src" href={s.auth!.href} target="_blank" rel="noopener noreferrer">Source: {s.auth!.source} <ExternalLink size={12} /></a>
        </div>
        <div className="ac__panel">
          <div className="ac__clock">
            <span><i />Auth queue · simulated week</span>
            <b>Day {Math.min(day, 8)} <small>{String(hour).padStart(2, '0')}:00</small></b>
          </div>
          <ul>{s.auth!.reqs.map((r) => <AuthRow key={r.code} r={r} h={h} hv={hv} />)}</ul>
          <p className="ac__legend">Escalation: peer-to-peer requested and the plan notified the moment a decision is late.</p>
        </div>
      </div>
    </section>
  );
}

/* ================= Related specialties ================= */
function Related({ s }: { s: SpecialtyFull }) {
  const rel = s.related.map(getSpecialtyLite).filter(Boolean);
  return (
    <section className="rel container">
      <div className="rel__head">
        <Eyebrow>{`/ Often billed alongside ${s.name.toLowerCase()}`}</Eyebrow>
        <Link to="/specialties" className="text-link">All specialties <ArrowRight size={18} /></Link>
      </div>
      <div className="rel__grid">
        {rel.map((r) => {
          const Icon = r!.icon;
          return (
            <Reveal key={r!.slug}>
              <Link to={r!.page ? `/specialties/${r!.slug}` : `/specialties?focus=${r!.slug}`} className="rel__card">
                <span className="xt__icon"><Icon /></span>
                <b>{r!.name}</b>
                <p>{r!.watch}</p>
                <span className="rel__codes">{r!.codes.map(([c]) => <code key={c}>{c}</code>)}</span>
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
    <main className="page">
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
