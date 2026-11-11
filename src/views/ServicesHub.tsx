'use client';
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
    <section className="sh-hero sh-hero--x [display:grid] [padding:14rem_var(--gutter)_8rem] [@media(max-width:_1279px)]:[padding-top:12rem] [@media(max-width:_1279px)]:[min-height:0] [grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.2fr)] [gap:4rem] [padding-bottom:6rem]! [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [align-items:center]">
      <div className="sh-hero__copy [display:flex] [flex-direction:column] [gap:2.8rem]">
        <motion.p className="eyebrow [font-family:var(--f-mono)] [font-size:1.6rem] [line-height:1.4] [text-transform:uppercase] [color:var(--ink)] [letter-spacing:0.02em] [.hero\_\_copy_&]:[margin-bottom:1.2rem] [.stmac\_\_intro_&]:[grid-column:1_/_-1]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Medical billing services</motion.p>
        <SplitWords as="h1" className="page-title [font-weight:500] [font-size:6.12rem] [line-height:1.06] [letter-spacing:-0.18rem] [color:var(--ink-3)] [@media(max-width:_1279px)]:[font-size:4.32rem]" animateNow delay={0.3} stagger={0.05}
          lines={['Ten services.', 'One claim, followed', 'from visit to cash.']} bold={['cash.']} />
        <motion.p className="page-sub [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:56rem] [.ab-hero\_\_copy_&]:[max-width:64rem]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
          Every box on a claim form is somebody’s job. Point at any box to see which of our ten services owns it, or scroll to follow one claim from visit to cash.
        </motion.p>
        <motion.div className="sh-hero__cta [display:flex] [align-items:center] [gap:3.2rem] [flex-wrap:wrap]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
          <Button>Get a free revenue assessment</Button>
          <Link to="#journey" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">Follow the claim <ArrowRight size={18} /></Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 1.4 }}>
          <XrayReadout {...xs} className="cx-read--desk [@media(max-width:_1279px)]:[display:none]" />
        </motion.div>
      </div>
      <motion.div className="sh-hero__stage sh-hero__stage--x [position:relative] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:2rem] [height:auto] [min-height:0] [@media(min-width:_768px)_and_(max-width:_1279px)]:[width:100%] [@media(min-width:_768px)_and_(max-width:_1279px)]:[max-width:72rem] [@media(min-width:_768px)_and_(max-width:_1279px)]:[justify-self:center]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <ClaimXray onChange={setXs} />
        <XrayReadout {...xs} className="cx-read--mob [display:none] [@media(max-width:_1279px)]:[display:block] [@media(max-width:_1279px)]:[max-width:none]" />
      </motion.div>
    </section>
  );
}

/* ================= 2. Pinned claim journey ================= */
function Enrollment({ on }: { on: boolean }) {
  const rows = [['Medicare', 'Enrolled'], ['Aetna', 'Enrolled'], ['BCBS of Texas', 'In review'], ['UnitedHealthcare', 'Enrolled']];
  return (
    <ul className="mw mw--list [border-radius:1.6rem] [background:#fff] [color:var(--navy)] [padding:1.6rem_1.8rem] [font-family:var(--f-man)] [font-size:1.4rem] [box-shadow:0_1.6rem_4rem_rgba(20,_0,_80,_0.25)] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[justify-content:space-between] [&_li]:[gap:1.2rem] [&_li]:[padding:0.9rem_0] [&_li]:[border-bottom:1px_solid_#f0edf8] [&_li:last-child]:[border-bottom:0] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.25rem] [&_code]:[color:var(--purple)] [&_code]:[background:#f1edff] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em]:[font-size:1.25rem] [&_em]:[padding:0.3rem_0.9rem] [&_em]:[border-radius:3rem] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.4rem] [.jy\_\_widget_&]:[box-shadow:none]">
      {rows.map(([p, st], i) => (
        <motion.li key={p} initial={false} animate={on ? { opacity: 1, x: 0 } : { opacity: 0.35, x: 0 }} transition={{ delay: on ? i * 0.12 : 0, duration: 0.5 }}>
          <span>{p}</span><em className={st === 'Enrolled' ? String.raw`ok [.w-den\_\_st_&]:[background:var(--purple)] [.w-den\_\_st_&]:[color:#fff]! [color:#12a150] [.mw_em&]:[background:#dcf5ea] [.mw\_\_row_em&]:[background:#dcf5ea] [.dq_li_em&]:[background:#dcf5ea]! [.lf\_\_dg_small&]:[color:#18a058]!` : String.raw`wait [color:#c77c00]! [.mw_em&]:[background:#fff1d6]! [.dq_li_em&]:[background:#f1edff]! [.dq_li_em&]:[color:var(--purple)]!`}>{st}</em>
        </motion.li>
      ))}
    </ul>
  );
}
function Capture({ on }: { on: boolean }) {
  const rows = [['Office visit, est. patient', '99214'], ['Electrocardiogram', '93000'], ['Perfusion imaging', '78452']];
  return (
    <ul className="mw mw--list [border-radius:1.6rem] [background:#fff] [color:var(--navy)] [padding:1.6rem_1.8rem] [font-family:var(--f-man)] [font-size:1.4rem] [box-shadow:0_1.6rem_4rem_rgba(20,_0,_80,_0.25)] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[justify-content:space-between] [&_li]:[gap:1.2rem] [&_li]:[padding:0.9rem_0] [&_li]:[border-bottom:1px_solid_#f0edf8] [&_li:last-child]:[border-bottom:0] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.25rem] [&_code]:[color:var(--purple)] [&_code]:[background:#f1edff] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em]:[font-size:1.25rem] [&_em]:[padding:0.3rem_0.9rem] [&_em]:[border-radius:3rem] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.4rem] [.jy\_\_widget_&]:[box-shadow:none]">
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
    <div className="mw [border-radius:1.6rem] [background:#fff] [color:var(--navy)] [padding:1.6rem_1.8rem] [font-family:var(--f-man)] [font-size:1.4rem] [box-shadow:0_1.6rem_4rem_rgba(20,_0,_80,_0.25)] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.25rem] [&_code]:[color:var(--purple)] [&_code]:[background:#f1edff] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em]:[font-size:1.25rem] [&_em]:[padding:0.3rem_0.9rem] [&_em]:[border-radius:3rem] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.4rem] [.jy\_\_widget_&]:[box-shadow:none]">
      <ul className="mw--checks [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:1rem] [&_li]:[padding:0.7rem_0]">
        {rows.map((r, i) => (
          <motion.li key={r} initial={false} animate={on ? { opacity: 1 } : { opacity: 0.35 }} transition={{ delay: on ? i * 0.15 : 0 }}>
            <motion.span className="tick [.mw--checks_&]:[width:2rem] [.mw--checks_&]:[height:2rem] [.mw--checks_&]:[border-radius:50%] [.mw--checks_&]:[display:grid] [.mw--checks_&]:[place-items:center] [.mw--checks_&]:[color:#fff]" initial={false} animate={on ? { scale: 1, background: '#12a150' } : { scale: 0.7, background: '#d9d6e6' }} transition={{ delay: on ? 0.1 + i * 0.15 : 0 }}><Check size={12} strokeWidth={3} /></motion.span>{r}
          </motion.li>
        ))}
      </ul>
      <motion.p className="mw__foot [margin-top:1rem] [padding-top:1rem] [border-top:1px_dashed_#e2def0] [font-weight:600] [color:#12a150]" initial={false} animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }} transition={{ delay: on ? 0.8 : 0 }}>Clean · sent to clearinghouse 2:14 PM</motion.p>
    </div>
  );
}
function Remit({ on }: { on: boolean }) {
  const rows = [['99214', '$186.00', '$128.40', 'ok'], ['93000', '$74.00', '$0.00', 'flag'], ['78452', '$1,240.00', '$0.00', 'flag']];
  return (
    <ul className="mw mw--list mw--remit [border-radius:1.6rem] [background:#fff] [color:var(--navy)] [padding:1.6rem_1.8rem] [font-family:var(--f-man)] [font-size:1.4rem] [box-shadow:0_1.6rem_4rem_rgba(20,_0,_80,_0.25)] [&_li]:[align-items:center] [&_li]:[justify-content:space-between] [&_li]:[gap:1.2rem] [&_li]:[padding:0.9rem_0] [&_li]:[border-bottom:1px_solid_#f0edf8] [&_li:last-child]:[border-bottom:0] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.25rem] [&_code]:[color:var(--purple)] [&_code]:[background:#f1edff] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em]:[font-size:1.25rem] [&_em]:[padding:0.3rem_0.9rem] [&_em]:[border-radius:3rem] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.4rem] [&_li]:[display:grid] [&_li]:[grid-template-columns:6.4rem_1fr_auto] [.jy\_\_widget_&]:[box-shadow:none]">
      {rows.map(([c, b, p, t], i) => (
        <motion.li key={c} initial={false} animate={on ? { opacity: 1 } : { opacity: 0.35 }} transition={{ delay: on ? i * 0.15 : 0 }}>
          <code>{c}</code><span>{b}</span><em className={t === 'ok' ? String.raw`ok [.w-den\_\_st_&]:[background:var(--purple)] [.w-den\_\_st_&]:[color:#fff]! [color:#12a150] [.mw_em&]:[background:#dcf5ea] [.mw\_\_row_em&]:[background:#dcf5ea] [.dq_li_em&]:[background:#dcf5ea]! [.lf\_\_dg_small&]:[color:#18a058]!` : String.raw`bad [color:#d1435b]! [.mw_em&]:[background:#fde7eb]! [.mw\_\_row_em&]:[background:#fde7eb]! [.dq_li_em&]:[background:#fde7eb]! [.calc\_\_out_b&]:[color:var(--purple)]!`}>{p}</em>
        </motion.li>
      ))}
    </ul>
  );
}
function Recover({ on }: { on: boolean }) {
  return (
    <div className="mw [border-radius:1.6rem] [background:#fff] [color:var(--navy)] [padding:1.6rem_1.8rem] [font-family:var(--f-man)] [font-size:1.4rem] [box-shadow:0_1.6rem_4rem_rgba(20,_0,_80,_0.25)] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.25rem] [&_code]:[color:var(--purple)] [&_code]:[background:#f1edff] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em]:[font-size:1.25rem] [&_em]:[padding:0.3rem_0.9rem] [&_em]:[border-radius:3rem] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.4rem] [.jy\_\_widget_&]:[box-shadow:none]">
      <div className="mw__row [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.25rem] [&_code]:[color:var(--purple)] [&_code]:[background:#f1edff] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_em]:[font-style:normal] [&_em]:[font-weight:700] [&_em]:[font-size:1.25rem] [&_em]:[padding:0.3rem_0.9rem] [&_em]:[border-radius:3rem] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.4rem] [display:grid] [grid-template-columns:auto_1fr_auto] [gap:1.2rem] [align-items:center]">
        <code>78452</code><span>CO-197 · no prior auth</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.em key={on ? 'paid' : 'denied'} className={on ? String.raw`ok [.w-den\_\_st_&]:[background:var(--purple)] [.w-den\_\_st_&]:[color:#fff]! [color:#12a150] [.mw_em&]:[background:#dcf5ea] [.mw\_\_row_em&]:[background:#dcf5ea] [.dq_li_em&]:[background:#dcf5ea]! [.lf\_\_dg_small&]:[color:#18a058]!` : String.raw`bad [color:#d1435b]! [.mw_em&]:[background:#fde7eb]! [.mw\_\_row_em&]:[background:#fde7eb]! [.dq_li_em&]:[background:#fde7eb]! [.calc\_\_out_b&]:[color:var(--purple)]!`} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ delay: on ? 0.6 : 0 }}>
            {on ? 'Appealed · paid' : 'Denied'}
          </motion.em>
        </AnimatePresence>
      </div>
      <div className="mw__aging [display:grid] [grid-template-columns:repeat(4,_1fr)] [gap:1rem] [height:9rem] [margin-top:1.6rem] [align-items:end] [&_div]:[height:100%] [&_div]:[display:flex] [&_div]:[flex-direction:column] [&_div]:[justify-content:flex-end] [&_div]:[gap:0.6rem] [&_div]:[text-align:center] [&_i]:[display:block] [&_i]:[flex:1] [&_i]:[border-radius:0.6rem] [&_i]:[background:linear-gradient(180deg,_#8a6bff,_#6a41f9)] [&_i]:[transform-origin:bottom] [&_small]:[font-size:1.15rem] [&_small]:[color:#6b6f7c]">
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
    <ul className="jy__svc [margin-top:1.6rem] [border-top:1px_solid_#e7e2f7] [&_a]:[position:relative] [&_a]:[display:flex] [&_a]:[align-items:center] [&_a]:[justify-content:space-between] [&_a]:[gap:2.4rem] [&_a]:[padding:2rem_0] [&_a]:[border-bottom:1px_solid_#e7e2f7] [&_a]:[color:var(--ink-2)] [&_b]:[font-weight:500] [&_b]:[font-size:2.2rem] [&_b]:[letter-spacing:-0.03rem] [&_b]:[transition:color_0.3s] [&_small]:[font-size:1.55rem] [&_small]:[color:#6b6f7c] [&_i]:[width:4.4rem] [&_i]:[height:4.4rem] [&_i]:[flex:0_0_4.4rem] [&_i]:[border-radius:50%] [&_i]:[display:grid] [&_i]:[place-items:center] [&_i]:[background:#fff] [&_i]:[border:1px_solid_var(--lav-border)] [&_i]:[color:var(--purple)] [&_i]:[transition:background_0.35s,_color_0.35s,_transform_0.5s_cubic-bezier(.16,1,.3,1)] [&_a:hover_b]:[color:var(--purple)] [&_a:hover_i]:[background:var(--purple)] [&_a:hover_i]:[color:#fff] [&_a:hover_i]:[transform:translateX(0.4rem)_rotate(-45deg)] [@media(max-width:_1279px)]:[&_b]:[font-size:2rem]">
      {byStation(n).map((s) => (
        <li key={s.slug}>
          <Link to={`/services/${s.slug}`}>
            <span className="jy__svc-t [display:flex] [flex-direction:column] [gap:0.4rem]"><b>{s.name}</b><small>{s.line}</small></span>
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
    <section className="jy [position:relative] [height:520vh] [padding:0_var(--gutter)]" id="journey" ref={ref}>
      <div className="jy__sticky [position:sticky] [top:0] [height:100vh] [min-height:72rem] [padding:11.6rem_0_2.4rem] [display:flex]">
        <div className="jy__board [position:relative] [flex:1] [display:flex] [flex-direction:column] [border-radius:4rem] [border:1px_solid_var(--lav-border)] [padding:4.8rem_5.6rem_3.2rem] [overflow:hidden] [&::after]:[content:''] [&::after]:[position:absolute] [&::after]:[inset:auto_-10%_-40%_40%] [&::after]:[height:70%] [&::after]:[background:radial-gradient(closest-side,_rgba(138,_107,_255,_0.18),_transparent)] [&::after]:[pointer-events:none] [isolation:isolate] [background-color:#fff] [border-color:rgba(106,_65,_249,_0.14)]! [box-shadow:0_4rem_10rem_-4rem_rgba(80,_40,_220,_0.25)] [&::after]:[display:none] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[z-index:1] [&::before]:[pointer-events:none] [&::before]:[background:rgba(255,_255,_255,_0.75)] [&>*:not(.jy\_\_bg)]:[position:relative] [&>*:not(.jy\_\_bg)]:[z-index:2]">
          <div className="jy__bg [position:absolute] [inset:0] [z-index:0] [overflow:hidden] [pointer-events:none] [&_img]:[position:absolute] [&_img]:[inset:-4%] [&_img]:[width:108%] [&_img]:[height:108%] [&_img]:[object-fit:cover] [&_img]:[object-position:70%_50%] [&_img]:[max-width:none] [&_img]:[animation:jy-drift_26s_ease-in-out_infinite_alternate] [@media(prefers-reduced-motion:_reduce)]:[&_img]:[animation:none]" aria-hidden><img src={fluted} alt="" /></div>
          <div className="jy__top [display:flex] [justify-content:space-between] [align-items:flex-start] [gap:4rem]">
            <div className="jy__head [display:flex] [flex-direction:column] [gap:1.2rem]">
              <Eyebrow>/ Follow the claim</Eyebrow>
              <h2 className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]">One claim, five stops.<br /><span className="jy__muted [color:#a29cbc]">Ten services keep it moving.</span></h2>
            </div>
            <div className="jy__count [display:flex] [align-items:baseline] [gap:1rem] [font-family:var(--f-mono)] [color:#a29cbc] [font-size:1.6rem]" aria-hidden>
              <span className="jy__count-n [position:relative] [display:inline-block] [height:7.2rem] [overflow:hidden] [&_b]:[display:block] [&_b]:[font-family:var(--f-sans)] [&_b]:[font-weight:500] [&_b]:[font-size:7.2rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.2rem] [&_b]:[color:var(--purple)]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.b key={st} initial={{ y: '100%' }} animate={{ y: '0%' }} exit={{ y: '-100%' }} transition={{ duration: 0.6, ease: ease.out }}>0{st + 1}</motion.b>
                </AnimatePresence>
              </span>
              <span>/ 05</span>
            </div>
          </div>

          <div className="jy__main [position:relative] [z-index:1] [flex:1] [min-height:0] [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:6rem] [align-items:center]">
            <div className="jy__copy">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={st} className="jy__scene [display:flex] [flex-direction:column] [gap:1.4rem] [&_h3]:[font-weight:500] [&_h3]:[font-size:5.2rem] [&_h3]:[line-height:1.04] [&_h3]:[letter-spacing:-0.14rem] [&_h3]:[color:var(--ink-2)]"
                  initial="in" animate="show" exit="out"
                  variants={{ in: {}, show: { transition: { staggerChildren: 0.07 } }, out: { transition: { staggerChildren: 0.03 } } }}>
                  {[
                    <p key="d" className="jy__day [display:inline-flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:var(--purple)] [&_i]:[width:0.8rem] [&_i]:[height:0.8rem] [&_i]:[border-radius:50%] [&_i]:[background:var(--purple)] [&_i]:[box-shadow:0_0_0_0.5rem_rgba(106,_65,_249,_0.15)]"><i />{DAYS[st]}</p>,
                    <h3 key="h">{STATIONS[st].name}</h3>,
                    <p key="s" className="jy__status [font-size:1.9rem] [color:#5b5f72]">{STATIONS[st].status}</p>,
                    <SvcRows key="r" n={st + 1} />,
                  ].map((el, i) => (
                    <motion.div key={i} variants={{ in: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.out } }, out: { opacity: 0, y: -14, transition: { duration: 0.25 } } }}>{el}</motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="jy__visual [position:relative] [height:100%] [min-height:40rem] [display:grid] [place-items:center]">
              <AnimatePresence initial={false}>
                <motion.span key={st} className="jy__ghost [position:absolute] [right:-2rem] [top:50%] [translate:0_-55%] [font-weight:600] [font-size:34rem] [line-height:1] [letter-spacing:-1.4rem] [color:transparent] [-webkit-text-stroke:1.5px_rgba(106,_65,_249,_0.16)] [pointer-events:none] [user-select:none]" aria-hidden initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -60 }} transition={{ duration: 0.8, ease: ease.out }}>0{st + 1}</motion.span>
              </AnimatePresence>
              <div className="jy__claim [position:relative] [width:44rem] [transform:rotate(-3deg)_translate(-12rem,_-3rem)]"><ClaimCard step={active} /></div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={st} className="jy__widget [position:absolute] [right:0] [bottom:2%] [width:36rem] [padding:1.2rem] [border-radius:2.2rem] [backdrop-filter:blur(18px)_saturate(1.4)] [-webkit-backdrop-filter:blur(18px)_saturate(1.4)] [border:1px_solid_rgba(255,_255,_255,_0.8)] [box-shadow:0_2.4rem_6rem_rgba(57,_28,_160,_0.18)] [background:rgba(255,_255,_255,_0.55)] [border-color:rgba(255,_255,_255,_0.9)]!" initial={{ opacity: 0, y: 40, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: 2 }} exit={{ opacity: 0, y: -20, rotate: 0 }} transition={{ duration: 0.6, ease: ease.out }}>
                  <p className="jy__wlabel [display:flex] [align-items:center] [gap:0.8rem] [padding:0.4rem_0.6rem_1rem] [font-family:var(--f-mono)] [font-size:1.2rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:#6b6f7c] [&_span]:[width:0.7rem] [&_span]:[height:0.7rem] [&_span]:[border-radius:50%] [&_span]:[background:#2bc48a] [&_span]:[box-shadow:0_0_0_0.4rem_rgba(43,_196,_138,_0.16)] [&_span]:[animation:jy-pulse_1.8s_ease-in-out_infinite]"><span />{WLABEL[st]}</p>
                  <W on />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="jy__route [position:relative] [z-index:1] [margin:1.6rem_0_2rem] [&_svg]:[display:block] [&_svg]:[width:100%] [&_svg]:[height:auto] [&_svg]:[overflow:visible]" ref={routeBox}>
            <svg viewBox="0 0 1500 140" aria-hidden>
              <defs>
                <linearGradient id="jy-g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1500" y2="0"><stop offset="0" stopColor="#b7a3ff" /><stop offset="1" stopColor="#6a41f9" /></linearGradient>
              </defs>
              <path ref={route} d={ROUTE} fill="none" stroke="#e2dafc" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" />
              <motion.path d={ROUTE} fill="none" stroke="url(#jy-g)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: f }} />
            </svg>
            {geo.pts.map((pt, i) => (
              <span key={i} className={String.raw`jy__node [position:absolute] [translate:-50%_-50%] [display:grid] [place-items:center] [&_i]:[width:1.6rem] [&_i]:[height:1.6rem] [&_i]:[border-radius:50%] [&_i]:[background:#fff] [&_i]:[border:2px_solid_#d6cdf7] [&_i]:[transition:border-color_0.4s,_background_0.4s,_transform_0.5s_cubic-bezier(.16,1,.3,1)] [&.is-done_i]:[background:var(--purple)] [&.is-done_i]:[border-color:var(--purple)] [&.is-now_i]:[border-color:var(--purple)] [&.is-now_i]:[transform:scale(1.5)] [&.is-now_i]:[box-shadow:0_0_0_0.6rem_rgba(106,_65,_249,_0.12)] [&_small]:[position:absolute] [&_small]:[top:2.6rem] [&_small]:[white-space:nowrap] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.25rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#a29cbc] [&_small]:[transition:color_0.4s] [&.is-now_small]:[color:var(--ink-2)] [&.is-done_small]:[color:var(--ink-2)] [&_small]:[padding:0.3rem_0.8rem] [&_small]:[border-radius:2rem] [&_small]:[background:rgba(255,_255,_255,_0.82)] [&_small]:[backdrop-filter:blur(6px)] [&_small]:[-webkit-backdrop-filter:blur(6px)] ${i < active ? String.raw`is-done [.pp\_\_list_li&]:[color:var(--ink-2)] [.pa-art\_\_steps_li&]:[color:#6a41f9]` : ''} ${i === st && active < 5 ? String.raw`is-now [.sc-stat\_\_bars_i&]:[background:var(--grad)]` : ''}`} style={{ left: `${(pt.x / 1500) * 100}%`, top: `${(pt.y / 140) * 100}%` }}>
                <i />
                <small className={pt.y < 70 ? String.raw`is-up [.jy\_\_node_small&]:[top:auto] [.jy\_\_node_small&]:[bottom:2.6rem]` : ''}>{STATIONS[i].short}</small>
              </span>
            ))}
            <motion.span className="jy__traveler [will-change:transform] [position:absolute] [left:0] [top:0] [margin:-1.6rem_0_0_-1.6rem] [width:3.2rem] [height:3.2rem] [border-radius:50%] [display:grid] [place-items:center] [pointer-events:none] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[inset:0] [&::before]:[border-radius:50%] [&::before]:[background:rgba(106,_65,_249,_0.18)] [&::before]:[animation:jy-ring_1.6s_ease-out_infinite] [&_i]:[width:1.4rem] [&_i]:[height:1.4rem] [&_i]:[border-radius:50%] [&_i]:[background:var(--purple)] [&_i]:[box-shadow:0_0_0_0.4rem_#fff,_0_0.6rem_1.6rem_rgba(106,_65,_249,_0.5)]" style={{ x: tx, y: ty }} aria-hidden><i /></motion.span>
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
    <section className="jy jy--list jy--tabs [position:relative] [height:520vh] [padding:0_var(--gutter)] [@media(max-width:_1279px)]:[height:auto] [@media(max-width:_1279px)]:[padding:10rem_var(--gutter)_0] [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:3.2rem]" id="journey">
      <div className="jy__head [display:flex] [flex-direction:column] [gap:1.2rem]">
        <Eyebrow>/ Follow the claim</Eyebrow>
        <h2 className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]">One claim, five stops.<br /><span className="jy__muted [color:#a29cbc]">Ten services keep it moving.</span></h2>
      </div>
      <div className="jyt__tabs [display:none] [@media(max-width:_1279px)]:[.jy--tabs_&]:[display:grid] [@media(max-width:_1279px)]:[.jy--tabs_&]:[grid-template-columns:repeat(5,_minmax(0,_1fr))] [@media(max-width:_1279px)]:[.jy--tabs_&]:[gap:0.6rem] [@media(max-width:_1279px)]:[.jy--tabs_&]:[margin-top:3.2rem] [@media(max-width:_1279px)]:[.jy--tabs_&]:[padding:0.5rem] [@media(max-width:_1279px)]:[.jy--tabs_&]:[border-radius:1.8rem] [@media(max-width:_1279px)]:[.jy--tabs_&]:[background:#f6f3ff] [@media(max-width:_1279px)]:[&_button]:[display:flex] [@media(max-width:_1279px)]:[&_button]:[flex-direction:column] [@media(max-width:_1279px)]:[&_button]:[align-items:center] [@media(max-width:_1279px)]:[&_button]:[gap:0.2rem] [@media(max-width:_1279px)]:[&_button]:[padding:1rem_0.4rem] [@media(max-width:_1279px)]:[&_button]:[border-radius:1.4rem] [@media(max-width:_1279px)]:[&_button]:[color:#8a8ea0] [@media(max-width:_1279px)]:[&_button]:[transition:background_0.3s,_color_0.3s] [@media(max-width:_1279px)]:[&_button_span]:[font-family:var(--f-mono)] [@media(max-width:_1279px)]:[&_button_span]:[font-size:1.4rem] [@media(max-width:_1279px)]:[&_button_small]:[font-size:1.15rem] [@media(max-width:_1279px)]:[&_button_small]:[white-space:nowrap] [@media(max-width:_1279px)]:[&_button_small]:[overflow:hidden] [@media(max-width:_1279px)]:[&_button_small]:[text-overflow:ellipsis] [@media(max-width:_1279px)]:[&_button_small]:[max-width:100%]" role="tablist" aria-label="Stops">
        {STATIONS.map((x, k) => (
          <button key={x.n} type="button" role="tab" aria-selected={k === i} className={k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} onClick={() => setI(k)}>
            <span>0{k + 1}</span><small>{x.short}</small>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={i} className="jy__card [&_h3]:[font-weight:500] [&_h3]:[font-size:5.2rem] [&_h3]:[line-height:1.04] [&_h3]:[letter-spacing:-0.14rem] [&_h3]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[display:flex] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[gap:1.2rem] [@media(max-width:_1279px)]:[padding:2.8rem_2.4rem] [@media(max-width:_1279px)]:[border-radius:2.8rem] [@media(max-width:_1279px)]:[background:var(--panel)] [@media(max-width:_1279px)]:[border:1px_solid_var(--lav-border)] [@media(max-width:_1279px)]:[&_h3]:[font-size:3.6rem] [@media(max-width:_1279px)]:[.jy--tabs_&]:[margin-top:1.6rem]" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3, ease: ease.out }}>
          <p className="jy__day [display:inline-flex] [align-items:center] [gap:1rem] [font-family:var(--f-mono)] [font-size:1.4rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:var(--purple)] [&_i]:[width:0.8rem] [&_i]:[height:0.8rem] [&_i]:[border-radius:50%] [&_i]:[background:var(--purple)] [&_i]:[box-shadow:0_0_0_0.5rem_rgba(106,_65,_249,_0.15)]"><i />0{i + 1} · {DAYS[i]}</p>
          <h3>{st.name}</h3>
          <p className="jy__status [font-size:1.9rem] [color:#5b5f72]">{st.status}</p>
          <div className="jy__widget jy__widget--flat [position:absolute] [right:0] [bottom:2%] [width:36rem] [padding:1.2rem] [border-radius:2.2rem] [backdrop-filter:blur(18px)_saturate(1.4)] [-webkit-backdrop-filter:blur(18px)_saturate(1.4)] [border:1px_solid_rgba(255,_255,_255,_0.8)] [box-shadow:0_2.4rem_6rem_rgba(57,_28,_160,_0.18)] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[inset:auto] [@media(max-width:_1279px)]:[width:auto] [@media(max-width:_1279px)]:[margin-top:1rem] [background:rgba(255,_255,_255,_0.55)] [border-color:rgba(255,_255,_255,_0.9)]!"><p className="jy__wlabel [display:flex] [align-items:center] [gap:0.8rem] [padding:0.4rem_0.6rem_1rem] [font-family:var(--f-mono)] [font-size:1.2rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:#6b6f7c] [&_span]:[width:0.7rem] [&_span]:[height:0.7rem] [&_span]:[border-radius:50%] [&_span]:[background:#2bc48a] [&_span]:[box-shadow:0_0_0_0.4rem_rgba(43,_196,_138,_0.16)] [&_span]:[animation:jy-pulse_1.8s_ease-in-out_infinite]"><span />{WLABEL[i]}</p><W on /></div>
          <SvcRows n={i + 1} />
        </motion.div>
      </AnimatePresence>
      <div className="jyt__nav [display:none] [@media(max-width:_1279px)]:[.jy--tabs_&]:[display:flex] [@media(max-width:_1279px)]:[.jy--tabs_&]:[align-items:center] [@media(max-width:_1279px)]:[.jy--tabs_&]:[justify-content:space-between] [@media(max-width:_1279px)]:[.jy--tabs_&]:[margin-top:1.6rem] [@media(max-width:_1279px)]:[&_span]:[font-family:var(--f-mono)] [@media(max-width:_1279px)]:[&_span]:[font-size:1.3rem] [@media(max-width:_1279px)]:[&_span]:[color:#8a8ea0] [@media(max-width:_1279px)]:[&_button]:[width:4.4rem] [@media(max-width:_1279px)]:[&_button]:[height:4.4rem] [@media(max-width:_1279px)]:[&_button]:[border-radius:50%] [@media(max-width:_1279px)]:[&_button]:[display:grid] [@media(max-width:_1279px)]:[&_button]:[place-items:center] [@media(max-width:_1279px)]:[&_button]:[border:1px_solid_#e2dbf8] [@media(max-width:_1279px)]:[&_button]:[color:var(--purple)] [@media(max-width:_1279px)]:[&_button]:[background:#fff]">
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
    <section className="lk container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]" ref={secRef}>
      <div className="lk__panel [border-radius:4rem] [border:1px_solid_var(--lav-border)] [background:linear-gradient(180deg,_#fbfaff_0%,_#fff_60%)] [@media(max-width:_1279px)]:[border-radius:2.8rem] [padding:4rem_4.8rem_3.6rem] [@media(max-width:_640px)]:[padding-inline:1.6rem]!">
      <div className="lk__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:4rem] [&>div:first-child]:[display:flex] [&>div:first-child]:[flex-direction:column] [&>div:first-child]:[gap:1.2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
        <div>
          <Eyebrow>/ Where revenue leaks</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Money doesn’t vanish.', 'It leaks, one stop at a time.']} stagger={0.04} />
        </div>
        <div className="lk__total [display:flex] [flex-direction:column] [align-items:flex-end] [min-width:30rem] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_b]:[font-weight:500] [&_b]:[line-height:1] [&_b]:[color:var(--purple)] [&_b]:[font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[align-items:flex-start] [&_b]:[font-size:6.4rem] [&_b]:[letter-spacing:-0.2rem] [gap:0.4rem]">
          <small>Lost from every $100 billed</small>
          <b>$<CountUp value={100 - r} duration={0.8} /></b>
          <span className="lk__hint [font-size:1.6rem] [color:#6b6f7c]">{r === 100 ? 'Every leak sealed. That’s the job.' : 'Tap a leak below to seal it.'}</span>
        </div>
      </div>

      {/* Phones: the flow chart becomes a list you can read top to bottom; tap a stop to seal it */}
      <ol className="lk__mob [display:none] [@media(max-width:_767px)]:[display:flex] [@media(max-width:_767px)]:[flex-direction:column] [@media(max-width:_767px)]:[gap:1rem] [@media(max-width:_767px)]:[margin-top:2.4rem] [@media(max-width:_767px)]:[&_li]:[border-radius:1.8rem] [@media(max-width:_767px)]:[&_li]:[background:#fff] [@media(max-width:_767px)]:[&_li]:[border:1px_solid_#ece8fa] [@media(max-width:_767px)]:[&_li]:[overflow:hidden] [@media(max-width:_767px)]:[&_li]:[transition:border-color_0.3s,_background_0.3s] [@media(max-width:_767px)]:[&_button]:[width:100%] [@media(max-width:_767px)]:[&_button]:[display:grid] [@media(max-width:_767px)]:[&_button]:[grid-template-columns:3.2rem_minmax(0,_1fr)_auto] [@media(max-width:_767px)]:[&_button]:[gap:1.2rem] [@media(max-width:_767px)]:[&_button]:[align-items:start] [@media(max-width:_767px)]:[&_button]:[padding:1.6rem_1.6rem_1rem] [@media(max-width:_767px)]:[&_button]:[text-align:left]">
        {LEAKS.map((l, i) => (
          <li key={l.label} className={sealed.has(i) ? String.raw`is-ok [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[background:#f6f3ff] [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[border-color:#ddd3ff] [.ecg\_\_rows_em&]:[color:var(--purple)] [.ecg\_\_rows_em&]:[background:#ebe5ff] [.se\_\_dots_i&]:[background:#b7a3ff]` : ''}>
            <button type="button" onClick={() => toggle(i)} aria-pressed={sealed.has(i)}>
              <span className="lk__mn [@media(max-width:_767px)]:[font-family:var(--f-mono)] [@media(max-width:_767px)]:[font-size:1.3rem] [@media(max-width:_767px)]:[color:var(--purple)] [@media(max-width:_767px)]:[padding-top:0.2rem]">0{i + 1}</span>
              <span className="lk__mt [@media(max-width:_767px)]:[&_b]:[display:block] [@media(max-width:_767px)]:[&_b]:[font-weight:600] [@media(max-width:_767px)]:[&_b]:[font-size:1.7rem] [@media(max-width:_767px)]:[&_b]:[color:var(--ink-2)] [@media(max-width:_767px)]:[&_small]:[display:block] [@media(max-width:_767px)]:[&_small]:[margin-top:0.4rem] [@media(max-width:_767px)]:[&_small]:[font-size:1.45rem] [@media(max-width:_767px)]:[&_small]:[line-height:1.5] [@media(max-width:_767px)]:[&_small]:[color:#5b5f72]"><b>{l.label}</b><small>{l.fact}{l.src && ` ${l.src}`}</small></span>
              <span className="lk__ma [@media(max-width:_767px)]:[display:inline-flex] [@media(max-width:_767px)]:[align-items:center] [@media(max-width:_767px)]:[gap:0.4rem] [@media(max-width:_767px)]:[padding:0.4rem_1rem] [@media(max-width:_767px)]:[border-radius:2rem] [@media(max-width:_767px)]:[background:#f1edff] [@media(max-width:_767px)]:[color:var(--purple)] [@media(max-width:_767px)]:[font-weight:600] [@media(max-width:_767px)]:[font-size:1.5rem] [@media(max-width:_767px)]:[white-space:nowrap] [@media(max-width:_767px)]:[.lk\_\_mob_li.is-ok_&]:[background:var(--purple)] [@media(max-width:_767px)]:[.lk\_\_mob_li.is-ok_&]:[color:#fff]">{sealed.has(i) ? <><Check size={14} strokeWidth={3} /> Sealed</> : `−$${l.amt}`}</span>
            </button>
            <Link to={`/services/${l.slug}`} className="lk__mfix [@media(max-width:_767px)]:[display:inline-flex] [@media(max-width:_767px)]:[align-items:center] [@media(max-width:_767px)]:[gap:0.4rem] [@media(max-width:_767px)]:[margin:0_1.6rem_1.4rem_6rem] [@media(max-width:_767px)]:[font-size:1.4rem] [@media(max-width:_767px)]:[font-weight:500] [@media(max-width:_767px)]:[color:var(--purple)]">{l.fix} <ArrowRight size={14} /></Link>
          </li>
        ))}
      </ol>

      <div className="lk__scroll [@media(max-width:_1279px)]:[overflow-x:auto] [@media(max-width:_1279px)]:[margin:4rem_calc(var(--gutter)_*_-1)_0] [@media(max-width:_1279px)]:[margin-top:3.2rem]! [@media(max-width:_1279px)]:[padding:0_var(--gutter)_2rem] [@media(max-width:_1279px)]:[scrollbar-width:none] [@media(max-width:_1279px)]:[margin-inline:-2rem]! [@media(max-width:_1279px)]:[padding-inline:2rem]! [margin-top:3.2rem]! [@media(max-width:_767px)]:[display:none]">
        <motion.div className="lk__stage [position:relative] [&_svg]:[display:block] [&_svg]:[width:100%] [&_svg]:[height:auto] [&_svg]:[overflow:visible] [@media(max-width:_1279px)]:[width:110rem]" initial={{ clipPath: 'inset(-20% 105% -60% -5%)' }} animate={{ clipPath: shown ? 'inset(-20% -5% -60% -5%)' : 'inset(-20% 105% -60% -5%)' }} transition={{ duration: 1.8, ease: ease.inOut }}>
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
            {LEAKS.map((_, i) => !sealed.has(i) && <circle key={i} className="leak__drip [transform-box:fill-box] [animation:leak-drip_1.4s_cubic-bezier(.55,0,1,.45)_infinite] [@media(prefers-reduced-motion:_reduce)]:[animation:none] [@media(prefers-reduced-motion:_reduce)]:[opacity:0]" cx={SK.XS[i] + 36} cy={SK.BOT - 6} r={4} fill="#8a6bff" style={{ animationDelay: `${i * 0.3}s` }} />)}
          </svg>
          <p className="lk__in [position:absolute] [display:flex] [flex-direction:column] [gap:0.2rem] [color:#fff] [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.06em] [text-transform:uppercase] [pointer-events:none] [left:3.2rem] [top:14%] [&_b]:[font-family:var(--f-sans)] [&_b]:[font-weight:500] [&_b]:[letter-spacing:-0.12rem] [&_b]:[text-transform:none] [&_b]:[line-height:1.05] [&_b]:[font-variant-numeric:tabular-nums] [&_b]:[font-size:4rem]">Billed<b>$100</b></p>
          <p className="lk__out [position:absolute] [display:flex] [flex-direction:column] [gap:0.2rem] [color:#fff] [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.06em] [text-transform:uppercase] [pointer-events:none] [right:3.2rem] [text-align:right] [translate:0_-50%] [transition:top_0.9s_cubic-bezier(.16,1,.3,1)] [&_b]:[font-family:var(--f-sans)] [&_b]:[font-weight:500] [&_b]:[letter-spacing:-0.12rem] [&_b]:[text-transform:none] [&_b]:[line-height:1.05] [&_b]:[font-variant-numeric:tabular-nums] [&_b]:[font-size:4rem]" style={{ top: `${((SK.TOP + (r * SK.K) / 2) / SK.H) * 100}%` }}>Collected<b>$<CountUp value={r} duration={0.8} /></b></p>
          {LEAKS.map((l, i) => (
            <button key={l.label} className={String.raw`lk__leak [position:absolute] [translate:-50%_0] [display:flex] [flex-direction:column] [align-items:center] [gap:0.6rem] [border-radius:1.6rem] [border:1px_solid_transparent] [transition:background_0.35s,_border-color_0.35s] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.06em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_small]:[white-space:nowrap] [&_b]:[display:inline-flex] [&_b]:[align-items:center] [&_b]:[gap:0.5rem] [&_b]:[font-weight:500] [&_b]:[letter-spacing:-0.06rem] [&_b]:[color:var(--ink-2)] [&_b]:[font-variant-numeric:tabular-nums] [&:hover]:[background:#fff] [&:hover]:[border-color:var(--lav-border)] [&:hover]:[box-shadow:0_1.2rem_3rem_rgba(106,_65,_249,_0.1)] [&.is-sel]:[background:#fff] [&.is-sel]:[border-color:var(--lav-border)] [&.is-sel]:[box-shadow:0_1.2rem_3rem_rgba(106,_65,_249,_0.1)] [&.is-ok_b]:[color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [&_b_svg]:[width:2rem] [&_b_svg]:[height:2rem] [&_b_svg]:[flex:0_0_2rem] [&.is-ok_b]:[font-size:2rem] [top:83%] [padding:0.8rem_1.4rem] [&_b]:[font-size:2.6rem] [&_b]:[min-height:3.2rem] ${sel === i ? 'is-sel' : ''} ${sealed.has(i) ? String.raw`is-ok [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[background:#f6f3ff] [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[border-color:#ddd3ff] [.ecg\_\_rows_em&]:[color:var(--purple)] [.ecg\_\_rows_em&]:[background:#ebe5ff] [.se\_\_dots_i&]:[background:#b7a3ff]` : ''}`}
              style={{ left: `${((SK.XS[i] + 36) / SK.W) * 100}%` }}
              onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} onClick={() => { setSel(i); toggle(i); }}
              aria-pressed={sealed.has(i)} aria-label={`${l.label}: ${sealed.has(i) ? 'sealed' : `leaking $${l.amt} of every $100`}`}>
              <small>{l.label}</small>
              <b>{sealed.has(i) ? <><Check strokeWidth={2.5} /> Sealed</> : `−$${l.amt}`}</b>
            </button>
          ))}
        </motion.div>
      </div>

      <div className="lk__detail [display:grid] [grid-template-columns:minmax(0,_1fr)_auto] [align-items:end] [border-top:1px_solid_#ece8f7] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [padding:3.2rem_0_0] [margin-top:4.4rem] [padding-top:2.4rem]! [min-height:0] [gap:4rem] [@media(max-width:_767px)]:[display:none]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={sel} className="lk__fact [&_p]:[max-width:96rem] [&_p]:[font-weight:500] [&_p]:[letter-spacing:-0.06rem] [&_p]:[color:var(--ink-2)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[font-weight:400] [&_small]:[letter-spacing:0] [&_small]:[color:#8a8ea0] [&_p]:[margin-top:0.8rem] [&_p]:[font-size:2.4rem] [&_p]:[line-height:1.3] [&_p]:[min-height:6.2rem]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease: ease.out }}>
            <span className="lk__tag [font-family:var(--f-mono)] [font-size:1.3rem] [letter-spacing:0.06em] [text-transform:uppercase] [color:var(--purple)]">0{sel + 1} · {cur.label}</span>
            <p>{cur.fact}{cur.src && <small> {cur.src}</small>}</p>
          </motion.div>
        </AnimatePresence>
        <div className="lk__actions [display:flex] [align-items:center] [gap:3.2rem] [@media(max-width:_1279px)]:[flex-wrap:wrap] [@media(max-width:_1279px)]:[gap:2rem]">
          <button className={String.raw`lk__seal [display:inline-flex] [align-items:center] [gap:1rem] [padding:1.4rem_2.6rem_1.4rem_1.4rem] [border-radius:6rem] [color:#fff] [font-weight:500] [font-size:1.8rem] [transition:background_0.3s,_color_0.3s] [&_span]:[width:2.8rem] [&_span]:[height:2.8rem] [&_span]:[border-radius:50%] [&_span]:[display:grid] [&_span]:[place-items:center] [&_span]:[border:1.5px_dashed_rgba(255,_255,_255,_0.7)] [&.is-ok]:[background:#f1edff] [&.is-ok]:[color:var(--purple)] [&.is-ok_span]:[border:0] [&.is-ok_span]:[background:var(--purple)] [&.is-ok_span]:[color:#fff] [background:var(--grad)] ${isSealed ? String.raw`is-ok [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[background:#f6f3ff] [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[border-color:#ddd3ff] [.ecg\_\_rows_em&]:[color:var(--purple)] [.ecg\_\_rows_em&]:[background:#ebe5ff] [.se\_\_dots_i&]:[background:#b7a3ff]` : ''}`} onClick={() => toggle(sel)}>
            <span>{isSealed ? <Check size={18} strokeWidth={2.5} /> : null}</span>{isSealed ? 'Sealed' : 'Seal this leak'}
          </button>
          <Link to={`/services/${cur.slug}`} className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">{cur.fix} <ArrowRight size={18} /></Link>
        </div>
      </div>
      <p className="lk__note [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55] [font-family:var(--f-mono)] [font-size:1.25rem] [color:#a29cbc] [margin-top:1.6rem]">Illustrative split of $100 in billed charges. Real leakage varies by practice; your free assessment measures yours.</p>
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
    <section className="need container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem]" id="need">
      <div className="need__head [display:flex] [flex-direction:column] [gap:1.2rem]">
        <Eyebrow>/ Start where it hurts</Eyebrow>
        <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['What’s costing', 'you the most?']} />
      </div>
      <LayoutGroup>
        <div className="need__chips [display:flex] [flex-wrap:wrap] [gap:1.2rem] [margin-top:4rem]" role="tablist">
          {NEEDS.map((n, k) => (
            <button key={n.label} role="tab" aria-selected={k === i} className={String.raw`need__chip [position:relative] [padding:1.4rem_2.4rem] [border-radius:6rem] [border:1px_solid_#e3def5] [font-size:1.8rem] [color:var(--ink-2)] [isolation:isolate] [transition:color_0.35s_0.08s,_border-color_0.35s] [&>span:not(.need\_\_pill)]:[position:relative] [&>span:not(.need\_\_pill)]:[z-index:1] [&.is-on]:[color:#fff] [&.is-on]:[border-color:var(--purple)] [&:focus-visible]:[outline:2px_solid_var(--purple)] [&:focus-visible]:[outline-offset:3px]! [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[flex:0_0_auto] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[white-space:nowrap] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[font-size:1.6rem] [@media(max-width:_1279px)]:[.xi\_\_chips_&]:[padding:1.2rem_2rem] ${k === i ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} ${k === ALL ? String.raw`need__chip--all [&:not(.is-on)]:[border-style:dashed] [&:not(.is-on)]:[border-color:#cfc6f3] [&:not(.is-on)]:[color:var(--purple)]` : ''}`} onClick={() => setI(k)}>
              {k === i && <motion.span layoutId="need-pill" className="need__pill [position:absolute] [inset:-1px] [border-radius:6rem] [z-index:0] [background:var(--grad)]" transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }} />}
              <span>{n.label}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={need.why} className="need__why [min-height:3.4rem] [margin-top:3.2rem] [font-size:2.4rem] [color:var(--ink-2)] [max-width:80rem]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>{need.why}</motion.p>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={i} className={String.raw`need__grid [display:grid] [grid-template-columns:1.4fr_1fr_1fr] [gap:2.4rem] [margin-top:3.2rem] [min-height:24rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] ${i === ALL ? String.raw`need__grid--all [grid-template-columns:repeat(3,_minmax(0,_1fr))]! [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)]! [@media(max-width:_767px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))]! [@media(max-width:_767px)]:[gap:1rem] [@media(max-width:_767px)]:[min-height:0]` : ''}`}
            initial="in" animate="show" exit="out"
            variants={{ in: {}, show: { transition: { staggerChildren: 0.07 } }, out: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } }}>
            {recs.map((s, k) => (
              <motion.div key={s.slug} className={String.raw`need__card [&_a]:[height:100%] [&_a]:[display:flex] [&_a]:[flex-direction:column] [&_a]:[gap:1rem] [&_a]:[padding:3.2rem] [&_a]:[border-radius:2.4rem] [&_a]:[background:var(--panel)] [&_a]:[border:1px_solid_#efebfb] [&_a]:[color:var(--ink-2)] [&_a]:[transition:transform_0.5s_cubic-bezier(.16,1,.3,1),_box-shadow_0.5s] [&_a:hover]:[transform:translateY(-0.6rem)] [&_a:hover]:[box-shadow:0_2rem_5rem_rgba(106,_65,_249,_0.12)] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.3rem] [&_small]:[letter-spacing:0.08em] [&_small]:[text-transform:uppercase] [&_small]:[color:var(--purple)] [&_b]:[font-weight:500] [&_b]:[font-size:3.2rem] [&_b]:[line-height:1.1] [&_b]:[letter-spacing:-0.06rem] [&_span]:[font-size:1.7rem] [&_span]:[color:#5b5f72] [&_em]:[margin-top:auto] [&_em]:[padding-top:2.4rem] [&_em]:[font-style:normal] [&_em]:[font-weight:600] [&_em]:[font-size:1.6rem] [&_em]:[color:var(--purple)] [&_em]:[display:inline-flex] [&_em]:[align-items:center] [&_em]:[gap:0.6rem] [&.is-lead_a]:[color:#fff] [&.is-lead_small]:[color:rgba(255,_255,_255,_0.85)] [&.is-lead_span]:[color:rgba(255,_255,_255,_0.85)] [&.is-lead_em]:[color:rgba(255,_255,_255,_0.85)] [.need\_\_grid--all_&_a]:[padding:2.8rem] [.need\_\_grid--all_&_b]:[font-size:2.6rem] [.need\_\_grid--all_&_em]:[padding-top:1.6rem] [@media(max-width:_767px)]:[.need\_\_grid--all_&_a]:[padding:1.8rem_1.6rem] [@media(max-width:_767px)]:[.need\_\_grid--all_&_a]:[gap:0.6rem] [@media(max-width:_767px)]:[.need\_\_grid--all_&_a]:[border-radius:1.8rem] [@media(max-width:_767px)]:[.need\_\_grid--all_&_b]:[font-size:1.8rem] [@media(max-width:_767px)]:[.need\_\_grid--all_&_b]:[line-height:1.2] [@media(max-width:_767px)]:[.need\_\_grid--all_&_span]:[display:none] [@media(max-width:_767px)]:[.need\_\_grid--all_&_em]:[display:none] [&.is-lead_a]:[background:var(--grad)] [&.is-lead_a]:[border-color:transparent] ${k === 0 && i !== ALL ? 'is-lead' : ''}`}
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
    <section className="eng [margin-top:4rem] [padding:12rem_0_4rem]">
      <div className="container eng__in [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [column-gap:2.4rem] [row-gap:5rem]">
        <div className="eng__head [grid-column:1_/_span_4] [display:flex] [flex-direction:column] [gap:1.2rem]">
          <Eyebrow>/ Two ways to work with us</Eyebrow>
          <SplitWords className="h-64 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [.svc\_\_head_&]:[margin-top:1.2rem] [.plat\_\_center_&]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_1279px)]:[overflow-wrap:anywhere] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Hand us the whole cycle,', 'or just the part that hurts.']} stagger={0.04} />
        </div>
        <div className="eng__table [grid-column:1_/_span_4]" role="table">
          <div className="eng__row eng__row--head [display:grid] [grid-template-columns:2fr_1fr_1fr] [&>span:first-child]:[padding:2rem_0] [&>span:first-child]:[font-size:1.9rem] [&>span:first-child]:[color:var(--ink-2)] [border-bottom:0] [align-items:stretch] [@media(max-width:_1279px)]:[grid-template-columns:1.4fr_1fr_1fr] [@media(max-width:_1279px)]:[&>span:first-child]:[font-size:1.5rem]" role="row">
            <span role="columnheader" />
            {(['Full RCM', 'Individual services'] as const).map((h, k) => (
              <button key={h} role="columnheader" className={String.raw`eng__col [position:relative] [display:flex] [flex-direction:column] [gap:0.6rem] [text-align:left] [padding:2.4rem] [border-radius:2rem_2rem_0_0] [isolation:isolate] [color:var(--ink-2)] [transition:color_0.3s] [&_b]:[position:relative] [&_b]:[z-index:1] [&_small]:[position:relative] [&_small]:[z-index:1] [&_b]:[font-weight:500] [&_b]:[font-size:2.6rem] [&_small]:[font-size:1.5rem] [&_small]:[color:#6b6f7c] [&_small]:[transition:color_0.3s] [&.is-on]:[color:#fff] [&.is-on_small]:[color:rgba(255,_255,_255,_0.8)] [@media(max-width:_1279px)]:[padding:1.4rem] [@media(max-width:_1279px)]:[&_b]:[font-size:1.8rem] [@media(max-width:_1279px)]:[&_small]:[display:none] ${col === k ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`} onClick={() => setCol(k as 0 | 1)} onMouseEnter={() => setCol(k as 0 | 1)}>
                {col === k && <motion.span layoutId="eng-col" className="eng__colbg [position:absolute] [inset:0] [border-radius:2rem_2rem_0_0] [z-index:0] [background:var(--grad)] [border-color:transparent]" transition={{ type: 'spring', stiffness: 300, damping: 32 }} />}
                <b>{h}</b><small>{k === 0 ? 'For practices that want billing off their plate' : 'For teams that want help in one area'}</small>
              </button>
            ))}
          </div>
          {ROWS.map(([label, a, b], r) => (
            <motion.div key={label} className="eng__row [display:grid] [grid-template-columns:2fr_1fr_1fr] [align-items:center] [border-bottom:1px_solid_#e6e1f6] [&>span:first-child]:[padding:2rem_0] [&>span:first-child]:[font-size:1.9rem] [&>span:first-child]:[color:var(--ink-2)] [@media(max-width:_1279px)]:[grid-template-columns:1.4fr_1fr_1fr] [@media(max-width:_1279px)]:[&>span:first-child]:[font-size:1.5rem]" role="row" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ delay: r * 0.05, duration: 0.6, ease: ease.out }}>
              <span role="cell">{label}</span>
              {[a, b].map((v, k) => (
                <span key={k} role="cell" className={String.raw`eng__cell [display:grid] [place-items:center_start] [padding-left:2.4rem] [color:#b6b1c9] [transition:color_0.3s,_background_0.3s] [height:100%] [&.is-on]:[color:var(--purple)] [&.is-on]:[background:rgba(106,_65,_249,_0.06)] [@media(max-width:_1279px)]:[padding-left:1.4rem] [.eng\_\_row:last-child_&.is-on]:[border-radius:0_0_2rem_2rem] ${col === k ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}`}>{v ? <Check size={20} /> : <Minus size={20} />}</span>
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
    <section className="cs container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]">
      <div className="cs__head [display:flex] [justify-content:space-between] [align-items:flex-end] [gap:2rem] [&>div]:[display:flex] [&>div]:[flex-direction:column] [&>div]:[gap:1.2rem] [@media(max-width:_1279px)]:[flex-direction:column] [@media(max-width:_1279px)]:[align-items:flex-start]">
        <div>
          <Eyebrow>/ Case studies</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['Results in practices’', 'own numbers.']} stagger={0.04} />
        </div>
        <Link to="/case-studies" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">All case studies <ArrowRight size={18} /></Link>
      </div>
      <div className="cs__grid cs__grid--3 [display:grid] [margin-top:4rem] [.csl_&]:[margin-top:3.2rem] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2rem] [@media(max-width:_1279px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">{pick.map((c, k) => <CaseCard key={c.slug} c={c} k={k} />)}</div>
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
    <main className="page [overflow-x:clip] [@media(max-width:_640px)]:[&:has(.mbar)]:[padding-bottom:7.2rem]">
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
