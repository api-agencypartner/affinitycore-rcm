import { IntroBlock, serviceIntro } from '../components/IntroBlock';
import { PageGuide, serviceGuide } from '../components/PageGuide';
import { HeroCapture } from '../components/HeroCapture';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { Button, CountUp, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { CTA, FAQ } from '../sections/Closing';
import { Proof } from './ServicesHub';
import { Assessment } from '../sections/Assessment';
import { EhrStrip, TrustRow, MidCta, Switching, SpecialtyChips } from '../components/ChildFolds';
import { searchFaqs, pageJsonLd, setJsonLd } from '../data/seo';
import { setEstimate } from '../data/estimate';
import { Link } from '../router';
import { SERVICES, STATIONS, getService, type ServiceFull, type Fmt } from '../data/services';
import { ease, vp } from '../motion';
import h1 from '../assets/hero-1.jpg';
import h2 from '../assets/hero-2.jpg';
import h3 from '../assets/hero-3.jpg';
import docPhoto from '../assets/form-doctor.jpg';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';
import { ClaimFocus } from '../components/ClaimFocus';

const PHOTOS = { h1, h2, h3, doc: docPhoto };
const fmt = (v: number, f: Fmt) => f === '$' ? `$${Math.round(v).toLocaleString('en-US')}` : f === '%' ? `${v}%` : f === 'd' ? `${v} days` : Math.round(v).toLocaleString('en-US');

/* ================= Hero ================= */
function WorkQueue({ s }: { s: ServiceFull }) {
  const q = s.queue;
  const [n, setN] = useState(0); // how many rows resolved
  useEffect(() => { const id = setInterval(() => setN((v) => (v + 1) % (q.rows.length + 2)), 1300); return () => clearInterval(id); }, [q.rows.length]);
  const resolved = Math.min(n, q.rows.length);
  const total = q.rows.slice(0, resolved).reduce((acc, r) => acc + r.value, 0);
  const show = (v: number) => (q.unit === '$' ? `$${v.toLocaleString('en-US')}` : v.toLocaleString('en-US'));
  return (
    <div className="dq w-card w-glass">
      <div className="dq__head"><span>{q.title}</span><b>{show(total)}<small> {q.totalLabel}</small></b></div>
      <ul>
        {q.rows.map((r, i) => {
          const done = i < resolved;
          return (
            <li key={r.code + r.label}>
              <code>{r.code}</code>
              <span>{r.label}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.em key={done ? 'y' : 'n'} className={done ? 'ok' : 'wait'} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }}>
                  {done ? <><Check size={13} strokeWidth={3} /> {r.done}</> : q.pending}
                </motion.em>
              </AnimatePresence>
              <b>{q.unit === '$' ? (r.value ? show(r.value) : '—') : r.value.toLocaleString('en-US')}</b>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Hero({ s }: { s: ServiceFull }) {
  return (
    <section className="sp-hero">
      <div className="sp-hero__copy">
        <motion.nav className="crumbs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="/services"><ChevronLeft size={16} /> Services</Link><span>/</span><span>{s.name}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={s.heroTitle} bold={[s.heroAccent]} />
        <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>{s.heroSub}</motion.p>
        <motion.div className="sh-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
          <HeroCapture source={`service:${s.slug}`} />
        </motion.div>
        <TrustRow />
      </div>
      <motion.div className="sp-hero__stage sp-hero__stage--x" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.2 }}>
        <div className="sp-board__bg" aria-hidden><img src={fluted} alt="" /></div>
        <ClaimFocus slug={s.slug} />
        <motion.div className="hero-chip sp-hero__chip" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1.1 }}>
          <span><strong>{s.chip[0]}</strong><small>{s.chip[1]}</small></span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================= The problem, in numbers ================= */
export function Problem({ s, withCalc = true }: { s: Pick<ServiceFull, 'slug' | 'calc' | 'stat'>; withCalc?: boolean }) {
  const { calc, stat } = s;
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(calc.fields.map((f) => [f.id, f.value])));
  const outs = calc.compute(vals);
  const head = outs.find((o) => o.accent) ?? outs[outs.length - 1];
  useEffect(() => { if (withCalc) setEstimate(`${fmt(head.value, head.fmt)} · ${head.label.toLowerCase()} (${calc.kicker.toLowerCase()})`); }, [withCalc, head.value, head.fmt, head.label, calc.kicker]);
  const big = `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`;
  return (
    <section className={`prob container ${withCalc ? '' : 'prob--solo'}`}>
      <div className="prob__stat">
        <Eyebrow>/ The problem, in numbers</Eyebrow>
        <p className={`prob__big ${big.length > 4 ? 'is-long' : ''} ${big.length > 6 ? 'is-xlong' : ''}`}>
          <CountUp value={stat.value} decimals={stat.decimals ?? 0} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} duration={1.6} />
        </p>
        <Reveal as="p" className="prob__label">{stat.label}</Reveal>
        <a className="prob__src" href={stat.href} target="_blank" rel="noopener noreferrer">Source: {stat.source}</a>
      </div>
      {withCalc && <motion.div className="calc" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <p className="calc__kicker">{calc.kicker}</p>
        {calc.fields.map((f) => {
          const v = vals[f.id];
          const id = `calc-${s.slug}-${f.id}`;
          return (
            <div className="calc__field" key={f.id}>
              <div className="calc__row"><label htmlFor={id}>{f.label}</label><output htmlFor={id}>{fmt(v, f.fmt)}</output></div>
              <input id={id} type="range" min={f.min} max={f.max} step={f.step} value={v}
                onChange={(e) => setVals((o) => ({ ...o, [f.id]: Number(e.target.value) }))}
                style={{ ['--p' as string]: `${((v - f.min) / (f.max - f.min)) * 100}%` }} />
            </div>
          );
        })}
        <div className="calc__out">
          {outs.map((o) => <div key={o.label}><small>{o.label}</small><b className={o.accent ? 'accent' : ''}>{fmt(o.value, o.fmt)}</b></div>)}
        </div>
        <p className="calc__how">{calc.note}</p>
      </motion.div>}
    </section>
  );
}

/* ================= How we work it: step switcher + live document ================= */
function Document({ s, active }: { s: Pick<ServiceFull, 'doc' | 'steps'>; active: number }) {
  const step = s.steps[active];
  const stamps = s.steps.slice(0, active + 1).filter((x) => x.stamp).map((x) => x.stamp!);
  const stamp = stamps[stamps.length - 1];
  const fixes = new Map<number, string>();
  s.steps.slice(0, active + 1).forEach((x) => { if (x.fix) fixes.set(x.fix.row, x.fix.b); });
  const d = s.doc;
  return (
    <div className="doc">
      <div className="doc__head">
        <div><b>{d.org}</b><small>{d.title}</small></div>
        <div className="doc__meta">{d.meta.map((m) => <span key={m}>{m}</span>)}</div>
      </div>
      <div className="doc__table">
        <div className="doc__tr doc__th"><span>{d.cols[0]}</span><span>{d.cols[1]}</span><span className="doc__num">{d.cols[2]}</span><span className="doc__num">{d.cols[3]}</span><span>{d.cols[4]}</span></div>
        {d.rows.map((l, i) => {
          const hot = step.line === i;
          const fixed = fixes.get(i);
          return (
            <div key={l.code + i} className={`doc__tr ${hot ? 'is-hot' : ''}`}>
              {hot && <motion.span layoutId="doc-hl" className="doc__hl" transition={{ type: 'spring', stiffness: 260, damping: 30 }} />}
              <code>{l.code}</code><span>{l.desc}</span><span className="doc__num doc__a">{l.a}</span>
              <span className={`doc__num doc__b ${fixed ? 'ok' : ''}`}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={fixed ?? l.b} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }}>{fixed ?? l.b}</motion.span>
                </AnimatePresence>
              </span>
              <span className={`doc__reason ${fixed ? 'is-resolved' : ''} ${l.tone ? `is-${l.tone}` : ''}`}><b>{l.flag}</b><small>{l.flagNote}</small></span>
            </div>
          );
        })}
      </div>
      <div className="doc__notes">
        <AnimatePresence mode="wait">
          <motion.div key={active} className="doc__note" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.45, ease: ease.out }}>
            <svg viewBox="0 0 200 12" className="doc__scribble" aria-hidden>
              <motion.path d="M2 8 C 40 2, 80 12, 120 6 S 180 4, 198 7" fill="none" stroke="#6a41f9" strokeWidth="2.4" strokeLinecap="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: ease.out, delay: 0.1 }} />
            </svg>
            <p>{step.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {stamp && (
          <motion.div key={stamp} className={`doc__stamp ${['PAID', 'APPROVED', 'RECOVERED', 'ACCEPTED', 'ON TARGET'].includes(stamp) ? 'is-paid' : ''}`}
            initial={{ scale: 2.2, opacity: 0, rotate: -24 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}>{stamp}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const STEP_MS = 5200;
/**
 * No pinned scroll. Desktop: steps as a list on the left (active one opens with a progress line), document on the right.
 * Mobile: the document first, then numbered step tabs with prev/next under it, so the whole fold is about one screen.
 * Steps advance on their own while the fold is on screen; any click or tap takes over and stops the auto-advance.
 */
export function HowWeWork({ s }: { s: Pick<ServiceFull, 'doc' | 'steps' | 'how'> }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const secRef = useRef<HTMLElement>(null);
  const seen = useInView(secRef, { amount: 0.35 });
  const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const n = s.steps.length;
  const run = auto && seen && !reduce;
  useEffect(() => {
    if (!run) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), STEP_MS);
    return () => window.clearTimeout(t);
  }, [run, active, n]);
  const choose = (i: number) => { setAuto(false); setActive((i + n) % n); };
  const st = s.steps[active];
  return (
    <section className="hw hw2" id="how" ref={secRef}>
      <div className="container hw__head">
        <Eyebrow>{s.how.eyebrow}</Eyebrow>
        <SplitWords className="h-64" lines={s.how.lines} stagger={0.04} />
      </div>
      <div className="container hw2__grid">
        <ol className="hw2__list" role="tablist" aria-label="Steps">
          {s.steps.map((x, i) => (
            <li key={x.title}>
              <button type="button" role="tab" aria-selected={active === i} className={`hw2__item ${active === i ? 'is-on' : ''}`} onClick={() => choose(i)}>
                <span className="hw2__n">0{i + 1}</span>
                <span className="hw2__t">{x.title}</span>
                <AnimatePresence initial={false}>
                  {active === i && (
                    <motion.span className="hw2__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                      <span>{x.body}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
                {active === i && <motion.i key={`${active}-${run}`} className="hw2__bar" initial={{ scaleX: 0 }} animate={{ scaleX: run ? 1 : 0 }} transition={{ duration: run ? STEP_MS / 1000 : 0, ease: 'linear' }} aria-hidden />}
              </button>
            </li>
          ))}
        </ol>
        <div className="hw2__doc"><Document s={s} active={active} /></div>
        <div className="hw2__mob">
          <div className="hw2__tabs" role="tablist" aria-label="Steps">
            {s.steps.map((x, i) => (
              <button key={x.title} type="button" role="tab" aria-selected={active === i} aria-label={x.title} className={active === i ? 'is-on' : ''} onClick={() => choose(i)}>0{i + 1}</button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={active} className="hw2__card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease: ease.out }}>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
            </motion.div>
          </AnimatePresence>
          <div className="hw2__nav">
            <button type="button" onClick={() => choose(active - 1)} aria-label="Previous step"><ChevronLeft size={18} /></button>
            <span>Step {active + 1} of {n}</span>
            <button type="button" onClick={() => choose(active + 1)} aria-label="Next step"><ArrowRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Problem → what we do: one connected, centred fold =================
   Breaks the left-copy / right-visual rhythm of the folds around it. The stat sits centred in a soft
   lavender panel, a line drops from it to a "what we do about it" node, and the work order opens
   underneath as a wide ticket with the scope as chips (any count wraps cleanly). */
function ProblemWork({ s }: { s: ServiceFull }) {
  const { stat, ticket } = s;
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.35 });
  const big = `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`;
  return (
    <section className="pw container" id="what-we-do">
      <div className="pw__panel">
        <div className="pw__stat">
          <Eyebrow>/ The problem, in numbers</Eyebrow>
          <p className={`prob__big pw__big ${big.length > 4 ? 'is-long' : ''} ${big.length > 6 ? 'is-xlong' : ''}`}>
            <CountUp value={stat.value} decimals={stat.decimals ?? 0} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} duration={1.6} />
          </p>
          <Reveal as="p" className="pw__label">{stat.label}</Reveal>
          <a className="prob__src" href={stat.href} target="_blank" rel="noopener noreferrer">Source: {stat.source}</a>
        </div>

        <div className="pw__link" aria-hidden>
          <motion.i className="pw__line" initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={vp} transition={{ duration: 0.9, ease: ease.inOut }} />
          <motion.span className="pw__node" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={vp} transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.7 }}><ArrowRight /></motion.span>
        </div>

        <div className="pw__head">
          <Eyebrow>/ What we do</Eyebrow>
          <SplitWords className="h-56" lines={['Everything on the work order.']} stagger={0.04} />
          <Reveal as="p" className="body-18">{ticket.intro}</Reveal>
        </div>

        <motion.div ref={ref} className="pw__ticket" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
          <div className="tk__perf" aria-hidden />
          <div className="pw__top"><span>Work order · {s.name}</span><code>{ticket.code}</code></div>
          <ul className="pw__scope">
            {ticket.scope.map((t, i) => (
              <li key={t}>
                <motion.span className="tk__box" initial={false} animate={on ? { background: '#6a41f9', borderColor: '#6a41f9' } : {}} transition={{ delay: 0.3 + i * 0.1 }}>
                  <motion.svg viewBox="0 0 16 16" width="14" height="14"><motion.path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                    initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ delay: 0.35 + i * 0.1, duration: 0.3 }} /></motion.svg>
                </motion.span>{t}
              </li>
            ))}
          </ul>
          <dl className="pw__meta">
            <div><dt>Owner</dt><dd>{ticket.owner}</dd></div>
            <div><dt>Reporting</dt><dd>{ticket.reporting}</dd></div>
            <div><dt>Turnaround</dt><dd>{ticket.turnaround}</dd></div>
          </dl>
        </motion.div>
      </div>
    </section>
  );
}

/* ================= What's included: work ticket ================= */
function Ticket({ s }: { s: ServiceFull }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  return (
    <section className="tk container">
      <div className="tk__head">
        <Eyebrow>/ What we do</Eyebrow>
        <SplitWords className="h-64" lines={['Everything on', 'the work order.']} />
        <Reveal as="p" className="body-18">{s.ticket.intro}</Reveal>
      </div>
      <motion.div ref={ref} className="tk__card" initial={{ opacity: 0, y: 50, rotate: 1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <div className="tk__top"><span>Work order</span><code>{s.ticket.code}</code></div>
        <h3>{s.name}</h3>
        <ul className="tk__scope">
          {s.ticket.scope.map((t, i) => (
            <li key={t}>
              <motion.span className="tk__box" initial={false} animate={on ? { background: '#6a41f9', borderColor: '#6a41f9' } : {}} transition={{ delay: 0.3 + i * 0.12 }}>
                <motion.svg viewBox="0 0 16 16" width="14" height="14"><motion.path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={on ? { pathLength: 1 } : {}} transition={{ delay: 0.35 + i * 0.12, duration: 0.3 }} /></motion.svg>
              </motion.span>{t}
            </li>
          ))}
        </ul>
        <dl className="tk__meta">
          <div><dt>Owner</dt><dd>{s.ticket.owner}</dd></div>
          <div><dt>Reporting</dt><dd>{s.ticket.reporting}</dd></div>
          <div><dt>Turnaround</dt><dd>{s.ticket.turnaround}</dd></div>
        </dl>
        <div className="tk__perf" aria-hidden />
      </motion.div>
    </section>
  );
}

/* ================= Journey rail: the hub's claim route, with this service's stop lit ================= */
const R_PATH = 'M0 70 C 140 70 170 24 300 24 S 460 116 600 116 S 760 24 900 24 S 1060 116 1200 116 S 1360 70 1500 70';
const R_STOPS = [0.1, 0.3, 0.5, 0.7, 0.9];
function Rail({ s }: { s: ServiceFull }) {
  const ref = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  useEffect(() => {
    const el = path.current; if (!el) return; const L = el.getTotalLength();
    setPts(R_STOPS.map((t) => { const q = el.getPointAtLength(L * t); return { x: q.x, y: q.y }; }));
  }, []);
  const here = s.station; // 0 = spans every stop (RCM, audits)
  const fill = here ? R_STOPS[here - 1] : 1;
  const idx = SERVICES.findIndex((x) => x.slug === s.slug);
  const prev = SERVICES[(idx + SERVICES.length - 1) % SERVICES.length];
  const next = SERVICES[(idx + 1) % SERVICES.length];
  return (
    <section className="rail container" ref={ref}>
      <div className="rail__board">
        <div className="rail__head">
          <Eyebrow>/ Where this sits in the claim’s journey</Eyebrow>
          <p className="rail__where">{here ? <>Stop 0{here} of 05 · <b>{STATIONS[here - 1].name}</b></> : <>Covers <b>all five stops</b>, visit to cash</>}</p>
        </div>
        <div className="rail__route">
          <svg viewBox="0 0 1500 140" aria-hidden>
            <defs><linearGradient id="rl-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1500" y2="0"><stop offset="0" stopColor="#b7a3ff" /><stop offset="1" stopColor="#6a41f9" /></linearGradient></defs>
            <path ref={path} d={R_PATH} fill="none" stroke="#e2dafc" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
            <motion.path d={R_PATH} fill="none" stroke="url(#rl-g)" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: on ? fill : 0 }} transition={{ duration: 1.8, ease: ease.inOut }} />
          </svg>
          {pts.map((pt, i) => {
            const n = i + 1; const isHere = here === n || here === 0;
            return (
              <span key={i} className={`rail__node ${isHere ? 'is-here' : ''} ${here && n < here ? 'is-past' : ''}`} style={{ left: `${(pt.x / 1500) * 100}%`, top: `${(pt.y / 140) * 100}%` }}>
                <motion.i initial={{ scale: 0 }} animate={on ? { scale: 1 } : {}} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 + i * 0.15 }} />
                <span className={`rail__lab ${pt.y < 70 ? 'is-up' : ''}`}><b>{STATIONS[i].short}</b><small>{SERVICES.filter((x) => x.station === n).map((x) => x.name).join(' · ')}</small></span>
              </span>
            );
          })}
        </div>
        <div className="rail__nav">
          <Link to={`/services/${prev.slug}`} className="rail__link"><small>Before this</small><b><ChevronLeft size={18} /> {prev.name}</b></Link>
          <Link to={`/services/${next.slug}`} className="rail__link rail__link--next"><small>After this</small><b>{next.name} <ArrowRight size={18} /></b></Link>
        </div>
      </div>
    </section>
  );
}

export function ServicePage({ slug }: { slug: string }) {
  const s = getService(slug);
  const faqs = useMemo(() => searchFaqs({ name: s.name, kind: 'service', faqs: s.faqs }), [s]);
  useEffect(() => {
    document.title = `${s.seoTitle} · Affinity Core`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', s.seoDescription);
    setJsonLd(pageJsonLd({ name: s.name, description: s.seoDescription, path: `/services/${s.slug}`, crumb: ['Services', '/services'], faqs }));
    return () => setJsonLd(null);
  }, [s, faqs]);
  return (
    <main className="page">
      <Hero s={s} />
      <IntroBlock d={serviceIntro(s)} />
      <ProblemWork s={s} />
      <HowWeWork s={s} />
      <EhrStrip what={s.name.toLowerCase()} />
      <SpecialtyChips service={s.name} />
      <MidCta title={`See what better ${s.name.toLowerCase()} is worth to you.`} body="We’ll review a month of your claims and show you the dollars, line by line. Free, no contract." />
      <Rail s={s} />
      <Proof service={s.slug} />
      <PageGuide g={serviceGuide(s)} />
      <Assessment formFirst calc={s.calc} source={`service:${s.slug}`} />
      <FAQ items={faqs} eyebrow={`/ ${s.name} FAQs`} lines={s.faqLines} />
      <CTA eyebrow={s.closing.eyebrow} lines={s.closing.lines} />
    </main>
  );
}
