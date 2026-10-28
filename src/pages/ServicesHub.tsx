import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useScroll, useTransform, useSpring, useMotionValueEvent, useInView } from 'motion/react';
import { ArrowRight, Check, Minus, ChevronLeft } from 'lucide-react';
import { Button, CountUp, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { ClaimCard } from '../components/ClaimCard';
import { ClaimXray, XrayReadout, type XrayState } from '../components/ClaimXray';
import { CTA, FAQ } from '../sections/Closing';
import { Link, go, goAnchor } from '../router';
import { SERVICES, STATIONS } from '../data/services';
import { ease, vp } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';
import { CASES as CASE_DATA } from '../data/insights';
import { CaseCard } from './CaseStudies';
import { Assessment } from '../sections/Assessment';
import { MidCta } from '../components/ChildFolds';

const byStation = (n: number) => SERVICES.filter((s) => s.station === n);

/* ================= 1. Hero ================= */
function Hero() {
  const [xs, setXs] = useState<XrayState>({ active: '33', stop: 0, hover: false });
  return (
    <section className="sh-hero sh-hero--x">
      <div className="sh-hero__copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Medical billing services</motion.p>
        <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05}
          lines={['Ten services.', 'One claim, followed', 'from visit to cash.']} bold={['cash.']} />
        <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
          Every box on a claim form is somebody’s job. Point at any box to see which of our ten services owns it, or scroll to follow one claim from visit to cash.
        </motion.p>
        <motion.div className="sh-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
          <Button>Get a free revenue assessment</Button>
          <Link to="#journey" className="text-link">Follow the claim <ArrowRight size={18} /></Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1.4 }}>
          <XrayReadout {...xs} className="cx-read--desk" />
        </motion.div>
      </div>
      <motion.div className="sh-hero__stage sh-hero__stage--x" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <ClaimXray onChange={setXs} />
        <XrayReadout {...xs} className="cx-read--mob" />
      </motion.div>
    </section>
  );
}

/* ================= 2. Pinned claim journey ================= */
function Enrollment({ on }: { on: boolean }) {
  const rows = [['Medicare', 'Enrolled'], ['Aetna', 'Enrolled'], ['BCBS of Texas', 'In review'], ['UnitedHealthcare', 'Enrolled']];
  return (
    <ul className="mw mw--list">
      {rows.map(([p, st], i) => (
        <motion.li key={p} initial={false} animate={on ? { opacity: 1, x: 0 } : { opacity: 0.35, x: 0 }} transition={{ delay: on ? i * 0.12 : 0, duration: 0.5 }}>
          <span>{p}</span><em className={st === 'Enrolled' ? 'ok' : 'wait'}>{st}</em>
        </motion.li>
      ))}
    </ul>
  );
}
function Capture({ on }: { on: boolean }) {
  const rows = [['Office visit, est. patient', '99214'], ['Electrocardiogram', '93000'], ['Perfusion imaging', '78452']];
  return (
    <ul className="mw mw--list">
      {rows.map(([d, c], i) => (
        <li key={c}><span>{d}</span>
          <motion.code initial={false} animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }} transition={{ delay: on ? 0.2 + i * 0.18 : 0, type: 'spring', stiffness: 300, damping: 18 }}>{c}</motion.code>
        </li>
      ))}
    </ul>
  );
}
function Scrub({ on }: { on: boolean }) {
  const rows = ['Patient demographics', 'Payer ID & eligibility', 'Code / modifier pairs', 'Authorization on file'];
  return (
    <div className="mw">
      <ul className="mw--checks">
        {rows.map((r, i) => (
          <motion.li key={r} initial={false} animate={on ? { opacity: 1 } : { opacity: 0.35 }} transition={{ delay: on ? i * 0.15 : 0 }}>
            <motion.span className="tick" initial={false} animate={on ? { scale: 1, background: '#12a150' } : { scale: 0.7, background: '#d9d6e6' }} transition={{ delay: on ? 0.1 + i * 0.15 : 0 }}><Check size={12} strokeWidth={3} /></motion.span>{r}
          </motion.li>
        ))}
      </ul>
      <motion.p className="mw__foot" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }} transition={{ delay: on ? 0.8 : 0 }}>Clean · sent to clearinghouse 2:14 PM</motion.p>
    </div>
  );
}
function Remit({ on }: { on: boolean }) {
  const rows = [['99214', '$186.00', '$128.40', 'ok'], ['93000', '$74.00', '$0.00', 'flag'], ['78452', '$1,240.00', '$0.00', 'flag']];
  return (
    <ul className="mw mw--list mw--remit">
      {rows.map(([c, b, p, t], i) => (
        <motion.li key={c} initial={false} animate={on ? { opacity: 1 } : { opacity: 0.35 }} transition={{ delay: on ? i * 0.15 : 0 }}>
          <code>{c}</code><span>{b}</span><em className={t === 'ok' ? 'ok' : 'bad'}>{p}</em>
        </motion.li>
      ))}
    </ul>
  );
}
function Recover({ on }: { on: boolean }) {
  return (
    <div className="mw">
      <div className="mw__row">
        <code>78452</code><span>CO-197 · no prior auth</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.em key={on ? 'paid' : 'denied'} className={on ? 'ok' : 'bad'} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ delay: on ? 0.6 : 0 }}>
            {on ? 'Appealed · paid' : 'Denied'}
          </motion.em>
        </AnimatePresence>
      </div>
      <div className="mw__aging">
        {[['0–30', 0.82], ['31–60', 0.46], ['61–90', 0.24], ['90+', 0.12]].map(([l, h], i) => (
          <div key={l as string}><motion.i initial={false} animate={{ scaleY: on ? (h as number) : 0.9 - i * 0.12 }} transition={{ duration: 1, ease: ease.out, delay: on ? 0.3 + i * 0.1 : 0 }} /><small>{l}</small></div>
        ))}
      </div>
    </div>
  );
}
const WIDGETS = [Enrollment, Capture, Scrub, Remit, Recover];

function useMedia(q: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => { const mq = window.matchMedia(q); const on = () => setM(mq.matches); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); }, [q]);
  return m;
}

const DAYS = ['7 days before the visit', 'Visit day', 'Day 1', 'Day 14', 'Day 30'];
const WLABEL = ['Payer enrollment', 'Charges captured', 'Pre-submission scrub', '835 remittance', 'Denial + A/R aging'];
const STOPS = [0.1, 0.3, 0.5, 0.7, 0.9];
const ROUTE = 'M0 70 C 140 70 170 24 300 24 S 460 116 600 116 S 760 24 900 24 S 1060 116 1200 116 S 1360 70 1500 70';

function Journey() {
  const mobile = useMedia('(max-width: 1279px)');
  return mobile ? <JourneyList /> : <JourneyPinned />;
}

function SvcRows({ n }: { n: number }) {
  return (
    <ul className="jy__svc">
      {byStation(n).map((s) => (
        <li key={s.slug}>
          <Link to={`/services/${s.slug}`}>
            <span className="jy__svc-t"><b>{s.name}</b><small>{s.line}</small></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function JourneyPinned() {
  const ref = useRef<HTMLElement>(null);
  const route = useRef<SVGPathElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  const toF = (v: number) => 0.04 + Math.min(1, Math.max(0, (v - 0.03) / 0.92)) * 0.9;
  const f = useTransform(p, toF);
  const [geo, setGeo] = useState<{ L: number; pts: { x: number; y: number }[]; lut: [number, number][] }>({ L: 0, pts: [], lut: [] });
  useEffect(() => {
    const el = route.current; if (!el) return;
    const L = el.getTotalLength();
    // Perf: sample the path once; the traveler reads this table instead of measuring the SVG every frame
    const lut = Array.from({ length: 401 }, (_, k) => { const q = el.getPointAtLength((L * k) / 400); return [q.x, q.y] as [number, number]; });
    setGeo({ L, pts: STOPS.map((s) => { const q = el.getPointAtLength(L * s); return { x: q.x, y: q.y }; }), lut });
  }, []);
  // Route box size, so the traveler can move with transforms (no layout per frame)
  const routeBox = useRef<HTMLDivElement>(null);
  const [rb, setRb] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = routeBox.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setRb({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  const at = (v: number) => { const t = geo.lut; if (!t.length) return [0, 70]; const k = Math.max(0, Math.min(400, v * 400)); const i = Math.floor(k), j = Math.min(400, i + 1), u = k - i; return [t[i][0] + (t[j][0] - t[i][0]) * u, t[i][1] + (t[j][1] - t[i][1]) * u]; };
  const tx = useTransform(f, (v) => (at(v)[0] / 1500) * rb.w);
  const ty = useTransform(f, (v) => (at(v)[1] / 140) * rb.h);
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const fv = toF(v); let a = 0;
    STOPS.forEach((s, i) => { if (fv >= s - 0.07) a = i; });
    setActive(v > 0.965 ? 5 : a);
  });
  const st = Math.min(active, 4);
  const W = WIDGETS[st];

  return (
    <section className="jy" id="journey" ref={ref}>
      <div className="jy__sticky">
        <div className="jy__board">
          <div className="jy__bg" aria-hidden><img src={fluted} alt="" /></div>
          <div className="jy__top">
            <div className="jy__head">
              <Eyebrow>/ Follow the claim</Eyebrow>
              <h2 className="h-56">One claim, five stops.<br /><span className="jy__muted">Ten services keep it moving.</span></h2>
            </div>
            <div className="jy__count" aria-hidden>
              <span className="jy__count-n">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b key={st} initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.6, ease: ease.out }}>0{st + 1}</motion.b>
                </AnimatePresence>
              </span>
              <span>/ 05</span>
            </div>
          </div>

          <div className="jy__main">
            <div className="jy__copy">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={st} className="jy__scene"
                  initial="in" animate="show" exit="out"
                  variants={{ in: {}, show: { transition: { staggerChildren: 0.07 } }, out: { transition: { staggerChildren: 0.03 } } }}>
                  {[
                    <p key="d" className="jy__day"><i />{DAYS[st]}</p>,
                    <h3 key="h">{STATIONS[st].name}</h3>,
                    <p key="s" className="jy__status">{STATIONS[st].status}</p>,
                    <SvcRows key="r" n={st + 1} />,
                  ].map((el, i) => (
                    <motion.div key={i} variants={{ in: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } }, out: { opacity: 0, y: -14, transition: { duration: 0.25 } } }}>{el}</motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="jy__visual">
              <AnimatePresence initial={false}>
                <motion.span key={st} className="jy__ghost" aria-hidden initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.8, ease: ease.out }}>0{st + 1}</motion.span>
              </AnimatePresence>
              <div className="jy__claim"><ClaimCard step={active} /></div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={st} className="jy__widget" initial={{ opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 2 }} exit={{ opacity: 0, y: -20, rotate: 0 }} transition={{ duration: 0.6, ease: ease.out }}>
                  <p className="jy__wlabel"><span />{WLABEL[st]}</p>
                  <W on />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="jy__route" ref={routeBox}>
            <svg viewBox="0 0 1500 140" aria-hidden>
              <defs>
                <linearGradient id="jy-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1500" y2="0"><stop offset="0" stopColor="#b7a3ff" /><stop offset="1" stopColor="#6a41f9" /></linearGradient>
              </defs>
              <path ref={route} d={ROUTE} fill="none" stroke="#e2dafc" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
              <motion.path d={ROUTE} fill="none" stroke="url(#jy-g)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: f }} />
            </svg>
            {geo.pts.map((pt, i) => (
              <span key={i} className={`jy__node ${i < active ? 'is-done' : ''} ${i === st && active < 5 ? 'is-now' : ''}`} style={{ left: `${(pt.x / 1500) * 100}%`, top: `${(pt.y / 140) * 100}%` }}>
                <i />
                <small className={pt.y < 70 ? 'is-up' : ''}>{STATIONS[i].short}</small>
              </span>
            ))}
            <motion.span className="jy__traveler" style={{ x: tx, y: ty }} aria-hidden><i /></motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Phones and tablets: one stop at a time (tabs + prev/next) instead of five stacked cards. */
function JourneyList() {
  const [i, setI] = useState(0);
  const n = STATIONS.length;
  const st = STATIONS[i];
  const W = WIDGETS[i];
  return (
    <section className="jy jy--list jy--tabs" id="journey">
      <div className="jy__head">
        <Eyebrow>/ Follow the claim</Eyebrow>
        <h2 className="h-56">One claim, five stops.<br /><span className="jy__muted">Ten services keep it moving.</span></h2>
      </div>
      <div className="jyt__tabs" role="tablist" aria-label="Stops">
        {STATIONS.map((x, k) => (
          <button key={x.n} type="button" role="tab" aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => setI(k)}>
            <span>0{k + 1}</span><small>{x.short}</small>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={i} className="jy__card" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3, ease: ease.out }}>
          <p className="jy__day"><i />0{i + 1} · {DAYS[i]}</p>
          <h3>{st.name}</h3>
          <p className="jy__status">{st.status}</p>
          <div className="jy__widget jy__widget--flat"><p className="jy__wlabel"><span />{WLABEL[i]}</p><W on /></div>
          <SvcRows n={i + 1} />
        </motion.div>
      </AnimatePresence>
      <div className="jyt__nav">
        <button type="button" onClick={() => setI((i - 1 + n) % n)} aria-label="Previous stop"><ChevronLeft size={18} /></button>
        <span>Stop {i + 1} of {n}</span>
        <button type="button" onClick={() => setI((i + 1) % n)} aria-label="Next stop"><ArrowRight size={18} /></button>
      </div>
    </section>
  );
}

/* ================= 3. Leak map: a Sankey of $100 ================= */
const LEAKS = [
  { amt: 3, label: 'Before the visit', fact: 'A provider who isn’t enrolled with a payer can’t be paid by it. Every visit before enrollment completes is at risk.', src: '', slug: 'credentialing', fix: 'Credentialing & Enrollment' },
  { amt: 4, label: 'Capture', fact: 'A service that never makes it onto the claim is never billed and never shows up as a denial. It simply disappears.', src: '', slug: 'charge-entry', fix: 'Charge Entry & Coding' },
  { amt: 6, label: 'Submission', fact: '41% of providers now report claim denial rates of 10% or more.', src: 'Experian Health, 2025', slug: 'medical-billing', fix: 'Medical Billing' },
  { amt: 3, label: 'Payer response', fact: 'Underpayments hide inside remittances. If nobody reconciles each line against the contract, nobody notices.', src: '', slug: 'payment-posting', fix: 'Payment Posting' },
  { amt: 5, label: 'Follow-up', fact: 'More than half of denied claims are never reworked, and each rework costs about $25.', src: 'MGMA, via AAFP', slug: 'denial-management', fix: 'Denial Management' },
];
const SK = { W: 1600, H: 410, TOP: 20, K: 2.0, XS: [250, 520, 790, 1060, 1330], BOT: 340 }; // compact so the whole fold fits one desktop screen

function flow(sealed: Set<number>) {
  let r = 100; const ys: [number, number][] = [];
  LEAKS.forEach((l, i) => { const b = SK.TOP + r * SK.K; if (!sealed.has(i)) r -= l.amt; ys.push([b, SK.TOP + r * SK.K]); });
  let d = `M0 ${SK.TOP} H${SK.W} V${SK.TOP + r * SK.K}`;
  for (let i = LEAKS.length - 1; i >= 0; i--) {
    const [b, a] = ys[i]; const x = SK.XS[i];
    d += ` L${x + 70} ${a} C${x + 20} ${a} ${x - 20} ${b} ${x - 70} ${b}`;
  }
  d += ` L0 ${SK.TOP + 100 * SK.K} Z`;
  return { d, ys, r };
}

function LeakMap() {
  const [sel, setSel] = useState(2);
  const [sealed, setSealed] = useState<Set<number>>(new Set());
  const { d, ys, r } = flow(sealed);
  const toggle = (i: number) => setSealed((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const cur = LEAKS[sel];
  const isSealed = sealed.has(sel);
  // Reveal is triggered by the whole section (not the masked chart itself), with a fallback,
  // so the chart can never stay hidden if the in-view check doesn't fire.
  const secRef = useRef<HTMLElement>(null);
  const seen = useInView(secRef, { once: true, amount: 0.15 });
  const [shown, setShown] = useState(false);
  useEffect(() => { if (seen) setShown(true); }, [seen]);
  useEffect(() => { const t = setTimeout(() => setShown(true), 2500); return () => clearTimeout(t); }, []);
  return (
    <section className="lk container" ref={secRef}>
      <div className="lk__panel">
      <div className="lk__head">
        <div>
          <Eyebrow>/ Where revenue leaks</Eyebrow>
          <SplitWords className="h-56" lines={['Money doesn’t vanish.', 'It leaks, one stop at a time.']} stagger={0.04} />
        </div>
        <div className="lk__total">
          <small>Lost from every $100 billed</small>
          <b>$<CountUp value={100 - r} duration={0.8} /></b>
          <span className="lk__hint">{r === 100 ? 'Every leak sealed. That’s the job.' : 'Tap a leak below to seal it.'}</span>
        </div>
      </div>

      {/* Phones: the flow chart becomes a list you can read top to bottom; tap a stop to seal it */}
      <ol className="lk__mob">
        {LEAKS.map((l, i) => (
          <li key={l.label} className={sealed.has(i) ? 'is-ok' : ''}>
            <button type="button" onClick={() => toggle(i)} aria-pressed={sealed.has(i)}>
              <span className="lk__mn">0{i + 1}</span>
              <span className="lk__mt"><b>{l.label}</b><small>{l.fact}{l.src && ` ${l.src}`}</small></span>
              <span className="lk__ma">{sealed.has(i) ? <><Check size={14} strokeWidth={3} /> Sealed</> : `−$${l.amt}`}</span>
            </button>
            <Link to={`/services/${l.slug}`} className="lk__mfix">{l.fix} <ArrowRight size={14} /></Link>
          </li>
        ))}
      </ol>

      <div className="lk__scroll">
        <motion.div className="lk__stage" initial={{ clipPath: 'inset(-20% 105% -60% -5%)' }} animate={{ clipPath: shown ? 'inset(-20% -5% -60% -5%)' : 'inset(-20% 105% -60% -5%)' }} transition={{ duration: 1.8, ease: ease.inOut }}>
          <svg viewBox={`0 0 ${SK.W} ${SK.H}`} aria-hidden>
            <defs>
              <linearGradient id="lk-flow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={SK.W} y2="0"><stop offset="0" stopColor="#a48bff" /><stop offset="1" stopColor="#5a32ec" /></linearGradient>
              {LEAKS.map((_, i) => (
                <linearGradient key={i} id={`lk-b${i}`} gradientUnits="userSpaceOnUse" x1="0" y1={ys[i][1]} x2="0" y2={SK.BOT}><stop offset="0" stopColor={i === sel ? '#8a6bff' : '#c4b5ff'} /><stop offset="1" stopColor={i === sel ? '#8a6bff' : '#c4b5ff'} stopOpacity="0" /></linearGradient>
              ))}
            </defs>
            {LEAKS.map((l, i) => {
              const x = SK.XS[i]; const [b] = ys[i]; const w = l.amt * SK.K; const c = b - w / 2;
              return (
                <motion.path key={i} fill="none" stroke={`url(#lk-b${i})`}
                  d={`M${x - 70} ${c} C${x + 10} ${c} ${x + 36} ${c + 24} ${x + 36} ${Math.min(c + 90, SK.BOT - 20)} L${x + 36} ${SK.BOT}`}
                  animate={{ strokeWidth: sealed.has(i) ? 0 : w, opacity: sealed.has(i) ? 0 : 1 }} transition={{ duration: 0.8, ease: ease.out }} />
              );
            })}
            <clipPath id="lk-round"><rect x="0" y={SK.TOP} width={SK.W} height={100 * SK.K} rx="28" /></clipPath>
            <pattern id="lk-lines" width="80" height="11" patternUnits="userSpaceOnUse">
              <rect x="0" y="5" width="46" height="1.2" rx="0.6" fill="#fff" opacity="0.22" />
              <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="80 0" dur="2.4s" repeatCount="indefinite" />
            </pattern>
            <g clipPath="url(#lk-round)">
              <motion.path d={d} fill="url(#lk-flow)" initial={false} animate={{ d }} transition={{ duration: 0.9, ease: ease.out }} />
              <motion.path d={d} fill="url(#lk-lines)" initial={false} animate={{ d }} transition={{ duration: 0.9, ease: ease.out }} />
            </g>
            {LEAKS.map((_, i) => !sealed.has(i) && <circle key={i} className="leak__drip" cx={SK.XS[i] + 36} cy={SK.BOT - 6} r={4} fill="#8a6bff" style={{ animationDelay: `${i * 0.3}s` }} />)}
          </svg>
          <p className="lk__in">Billed<b>$100</b></p>
          <p className="lk__out" style={{ top: `${((SK.TOP + (r * SK.K) / 2) / SK.H) * 100}%` }}>Collected<b>$<CountUp value={r} duration={0.8} /></b></p>
          {LEAKS.map((l, i) => (
            <button key={l.label} className={`lk__leak ${sel === i ? 'is-sel' : ''} ${sealed.has(i) ? 'is-ok' : ''}`}
              style={{ left: `${((SK.XS[i] + 36) / SK.W) * 100}%` }}
              onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => { setSel(i); toggle(i); }}
              aria-pressed={sealed.has(i)} aria-label={`${l.label}: ${sealed.has(i) ? 'sealed' : `leaking $${l.amt} of every $100`}`}>
              <small>{l.label}</small>
              <b>{sealed.has(i) ? <><Check strokeWidth={2.5} /> Sealed</> : `−$${l.amt}`}</b>
            </button>
          ))}
        </motion.div>
      </div>

      <div className="lk__detail" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={sel} className="lk__fact" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: ease.out }}>
            <span className="lk__tag">0{sel + 1} · {cur.label}</span>
            <p>{cur.fact}{cur.src && <small> {cur.src}</small>}</p>
          </motion.div>
        </AnimatePresence>
        <div className="lk__actions">
          <button className={`lk__seal ${isSealed ? 'is-ok' : ''}`} onClick={() => toggle(sel)}>
            <span>{isSealed ? <Check size={18} strokeWidth={2.5} /> : null}</span>{isSealed ? 'Sealed' : 'Seal this leak'}
          </button>
          <Link to={`/services/${cur.slug}`} className="text-link">{cur.fix} <ArrowRight size={18} /></Link>
        </div>
      </div>
      <p className="lk__note">Illustrative split of $100 in billed charges. Real leakage varies by practice; your free assessment measures yours.</p>
      </div>
    </section>
  );
}

/* ================= 4. Need picker ================= */
const NEEDS: { label: string; why: string; slugs: string[] }[] = [
  { label: 'All services', why: 'Every service we run, in one place. Pick one or combine a few.', slugs: [] },
  { label: 'Too many denials', why: 'Fix what’s already denied, then stop it at the source.', slugs: ['denial-management', 'medical-coding', 'medical-billing'] },
  { label: 'Payments are slow', why: 'Clean claims out faster, and every open claim chased.', slugs: ['medical-billing', 'ar-recovery', 'payment-posting'] },
  { label: 'Credentialing is stuck', why: 'Get providers enrolled so their visits can actually be billed.', slugs: ['credentialing', 'medical-billing'] },
  { label: 'Worried about coding risk', why: 'Find gaps before an auditor does, then code it right going forward.', slugs: ['medical-billing-audits', 'medical-coding'] },
  { label: 'My team is stretched thin', why: 'Hand over the whole cycle to one accountable team.', slugs: ['revenue-cycle-management'] },
];
const ALL = 0;
function NeedPicker() {
  const [i, setI] = useState(0);
  const need = NEEDS[i];
  const recs = i === ALL ? SERVICES : need.slugs.map((sl) => SERVICES.find((s) => s.slug === sl)!);
  return (
    <section className="need container" id="need">
      <div className="need__head">
        <Eyebrow>/ Start where it hurts</Eyebrow>
        <SplitWords className="h-64" lines={['What’s costing', 'you the most?']} />
      </div>
      <LayoutGroup>
        <div className="need__chips" role="tablist">
          {NEEDS.map((n, k) => (
            <button key={n.label} role="tab" aria-selected={k === i} className={`need__chip ${k === i ? 'is-on' : ''} ${k === ALL ? 'need__chip--all' : ''}`} onClick={() => setI(k)}>
              {k === i && <motion.span layoutId="need-pill" className="need__pill" transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }} />}
              <span>{n.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={need.why} className="need__why" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>{need.why}</motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className={`need__grid ${i === ALL ? 'need__grid--all' : ''}`}
            initial="in" animate="show" exit="out"
            variants={{ in: {}, show: { transition: { staggerChildren: 0.07 } }, out: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } }}>
            {recs.map((s, k) => (
              <motion.div key={s.slug} className={`need__card ${k === 0 && i !== ALL ? 'is-lead' : ''}`}
                variants={{
                  in: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
                  out: { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } },
                }}>
                <Link to={`/services/${s.slug}`}>
                  <small>{i === ALL ? `Service ${String(k + 1).padStart(2, '0')}` : k === 0 ? 'Start here' : 'Then'}</small>
                  <b>{s.name}</b>
                  <span>{s.line}</span>
                  <em>View service <ArrowRight size={16} /></em>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}

/* ================= 5. Engagement models ================= */
const ROWS: [string, boolean, boolean][] = [
  ['One accountable team and point of contact', true, true],
  ['Works inside your existing EHR / PM system', true, true],
  ['Monthly performance report', true, true],
  ['Credentialing through A/R in one workflow', true, false],
  ['Root causes fixed across every stage', true, false],
  ['Start in one area, expand any time', false, true],
  ['Priced to the scope you choose', false, true],
];
function Engagement() {
  const [col, setCol] = useState<0 | 1>(0);
  return (
    <section className="eng">
      <div className="container eng__in">
        <div className="eng__head">
          <Eyebrow>/ Two ways to work with us</Eyebrow>
          <SplitWords className="h-64" lines={['Hand us the whole cycle,', 'or just the part that hurts.']} stagger={0.04} />
        </div>
        <div className="eng__table" role="table">
          <div className="eng__row eng__row--head" role="row">
            <span role="columnheader" />
            {(['Full RCM', 'Individual services'] as const).map((h, k) => (
              <button key={h} role="columnheader" className={`eng__col ${col === k ? 'is-on' : ''}`} onClick={() => setCol(k as 0 | 1)} onMouseEnter={() => setCol(k as 0 | 1)}>
                {col === k && <motion.span layoutId="eng-col" className="eng__colbg" transition={{ type: 'spring', stiffness: 300, damping: 32 }} />}
                <b>{h}</b><small>{k === 0 ? 'For practices that want billing off their plate' : 'For teams that want help in one area'}</small>
              </button>
            ))}
          </div>
          {ROWS.map(([label, a, b], r) => (
            <motion.div key={label} className="eng__row" role="row" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ delay: r * 0.05, duration: 0.6, ease: ease.out }}>
              <span role="cell">{label}</span>
              {[a, b].map((v, k) => (
                <span key={k} role="cell" className={`eng__cell ${col === k ? 'is-on' : ''}`}>{v ? <Check size={20} /> : <Minus size={20} />}</span>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= 6. Case studies (shared pop-out cards) ================= */
/** Three case studies; when a service or specialty is given, the most relevant cases come first. */
export function Proof({ service, specialty, region }: { service?: string; specialty?: string; region?: string } = {}) {
  const inRegion = (c: (typeof CASE_DATA)[number]) => !!region && c.profile.some(([k, v]) => k === 'Location' && new RegExp(region, 'i').test(v));
  const score = (c: (typeof CASE_DATA)[number]) => (specialty && c.specialty === specialty ? 2 : 0) + (service && c.services.includes(service) ? 1 : 0) + (inRegion(c) ? 3 : 0);
  const pick = [...CASE_DATA].sort((a, b) => score(b) - score(a)).slice(0, 3);
  return (
    <section className="cs container">
      <div className="cs__head">
        <div>
          <Eyebrow>/ Case studies</Eyebrow>
          <SplitWords className="h-56" lines={['Results in practices’', 'own numbers.']} stagger={0.04} />
        </div>
        <Link to="/case-studies" className="text-link">All case studies <ArrowRight size={18} /></Link>
      </div>
      <div className="cs__grid cs__grid--3">{pick.map((c, k) => <CaseCard key={c.slug} c={c} k={k} />)}</div>
    </section>
  );
}

export const HUB_FAQS = [
  ['Can we start with just one service?', 'Yes. Many practices start with the stop that leaks the most, often denials or aged A/R, and add services once they see results in their own numbers.'],
  ['What’s the difference between full RCM and individual services?', 'Full RCM puts one team on every stop, from credentialing to collections, so root causes get fixed upstream. Individual services cover one area and plug into the team you already have.'],
  ['Will we need to change our EHR or practice management system?', 'No. We work inside the systems you already use, with access set up under a business associate agreement.'],
  ['How quickly can you start?', 'After a discovery call and system access, work is handed over in phases so your staff keep working while we ramp up. [Confirm with Affinity Core]'],
  ['How is pricing set?', 'Pricing follows the scope you choose: full RCM or individual services. The free assessment shows where the money is before you commit to anything.'],
];

export function ServicesHub() {
  return (
    <main className="page">
      <Hero />
      <Journey />
      <LeakMap />
      <NeedPicker />
      <Engagement />
      <MidCta title="Not sure which way fits? We’ll tell you." body="We’ll review a month of your claims and show you whether full RCM or one service makes more sense. Free, no contract." />
      <Proof />
      <Assessment />
      <FAQ items={HUB_FAQS} eyebrow="/ Services FAQs" lines={['What practices ask', 'before choosing a service.']} />
      <CTA eyebrow="/ Not sure where to start?" lines={['We’ll find your leaks.', 'Free, in your own numbers.']} />
    </main>
  );
}
