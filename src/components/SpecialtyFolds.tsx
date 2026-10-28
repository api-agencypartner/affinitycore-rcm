import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValueEvent, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { Check, Wand2, X } from 'lucide-react';
import { CountUp, Eyebrow, Reveal, SplitWords } from './ui';
import { ease, vp } from '../motion';
import type { SpecialtyFull, ClaimSide } from '../data/specialties';

/* ================================================================== */
/* 1. Where a month leaks: waterfall                                  */
/* ================================================================== */
const AXIS_MIN = 85; // broken axis: bars start at 85% so the leaks are readable

export function LeakFall({ s }: { s: SpecialtyFull }) {
  const L = s.leak!;
  const [size, setSize] = useState(L.sizes[1]);
  // open on the biggest specialty-specific leak (the last one is the shared "denials never worked")
  const [pick, setPick] = useState(() => L.leaks.slice(0, -1).reduce((b, l, i, a) => (l.pct > a[b].pct ? i : b), 0));
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });

  const expected = L.perProvider * size;
  const lost = L.leaks.reduce((t, l) => t + l.pct, 0);
  const h = (pct: number) => (pct / (100 - AXIS_MIN)) * 100; // % of chart height
  let level = 100;
  const cols = L.leaks.map((l) => { const top = level; level -= l.pct; return { ...l, top, bottom: level }; });
  const collectedPct = 100 - lost;
  const money = (pct: number) => (expected * pct) / 100;
  const sel = L.leaks[pick];
  const t0 = 0.35, step = 0.32;

  return (
    <section className="lf container" ref={ref}>
      <div className="lf__head">
        <div>
          <Eyebrow>{L.eyebrow}</Eyebrow>
          <SplitWords className="h-56" lines={L.lines} stagger={0.04} />
        </div>
        <Reveal as="p" className="lf__intro">{L.intro}</Reveal>
      </div>

      <motion.div className="lf__card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <div className="lf__bar">
          <div className="lf__total">
            <p className="lf__kicker">One month, expected vs collected</p>
            <div><b><CountUp value={money(lost)} prefix="$" start={seen} duration={1.4} delay={0.4} /></b>
              <span>leaks out every month for {size} {size === 1 ? L.unit[0] : L.unit[1]}</span></div>
          </div>
          <div className="lf__seg" role="radiogroup" aria-label="Practice size">
            {L.sizes.map((n) => (
              <button key={n} role="radio" aria-checked={size === n} className={size === n ? 'is-on' : ''} onClick={() => setSize(n)}>
                {size === n && <motion.span layoutId={`lf-seg-${s.slug}`} className="lf__segbg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{n === 1 ? 'Solo' : <>{n}<em className="lf__unit"> {L.unit[1]}</em></>}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lf__chart" style={{ ['--n' as string]: L.leaks.length + 2 }}>
          <div className="lf__grid" aria-hidden>{[100, 95, 90, 85].map((g) => <span key={g} style={{ bottom: `${h(g - AXIS_MIN)}%` }}><i>{g}%</i></span>)}</div>

          {/* expected */}
          <div className="lf__col">
            <div className="lf__plot">
              <motion.span className="lf__b lf__b--exp" style={{ height: '100%' }} initial={{ scaleY: 0 }} animate={seen ? { scaleY: 1 } : {}} transition={{ duration: 0.9, ease: ease.out, delay: 0.1 }} />
            </div>
            <div className="lf__lab"><b><CountUp value={expected} prefix="$" start={seen} duration={1} /></b><small>Expected</small></div>
          </div>

          {cols.map((c, i) => (
            <button key={c.label} className={`lf__col lf__col--leak ${pick === i ? 'is-on' : ''}`} onClick={() => setPick(i)} onMouseEnter={() => setPick(i)} aria-pressed={pick === i}>
              <div className="lf__plot">
                <motion.span className="lf__lvl" style={{ bottom: `${h(c.top - AXIS_MIN)}%` }} initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : {}} transition={{ duration: 0.35, ease: ease.out, delay: t0 + i * step }} aria-hidden />
                <motion.span className="lf__b lf__b--leak" style={{ bottom: `${h(c.bottom - AXIS_MIN)}%`, height: `${h(c.pct)}%` }}
                  initial={{ scaleY: 0 }} animate={seen ? { scaleY: 1 } : {}} transition={{ duration: 0.55, ease: ease.out, delay: t0 + i * step + 0.15 }} />
                <motion.em className="lf__pct" style={{ top: `${100 - h(c.bottom - AXIS_MIN)}%` }} initial={{ opacity: 0, y: -6 }} animate={seen ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: t0 + i * step + 0.5 }}>−{c.pct}%</motion.em>
              </div>
              <div className="lf__lab"><b className="neg"><CountUp value={money(c.pct)} prefix="−$" start={seen} duration={1} delay={t0 + i * step} /></b><small>{c.label}</small></div>
            </button>
          ))}

          {/* collected */}
          <div className="lf__col">
            <div className="lf__plot">
              <motion.span className="lf__lvl" style={{ bottom: `${h(collectedPct - AXIS_MIN)}%` }} initial={{ scaleX: 0 }} animate={seen ? { scaleX: 1 } : {}} transition={{ duration: 0.35, delay: t0 + cols.length * step }} aria-hidden />
              <motion.span className="lf__b lf__b--got" style={{ height: `${h(collectedPct - AXIS_MIN)}%` }} initial={{ scaleY: 0 }} animate={seen ? { scaleY: 1 } : {}} transition={{ duration: 0.8, ease: ease.out, delay: t0 + cols.length * step + 0.1 }} />
            </div>
            <div className="lf__lab"><b><CountUp value={money(collectedPct)} prefix="$" start={seen} duration={1.2} delay={t0 + cols.length * step} /></b><small>Collected</small></div>
          </div>
          <span className="lf__break" aria-hidden />
        </div>
        <p className="lf__mob"><span>Expected <b>${expected.toLocaleString('en-US')}</b></span><span>Collected <b>${money(collectedPct).toLocaleString('en-US')}</b></span></p>

        <div className="lf__detail" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={pick} className="lf__dg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease: ease.out }}>
              <div><small><X size={14} strokeWidth={3} /> Where it leaks · −${money(sel.pct).toLocaleString('en-US')} a month</small><p><b>{sel.label}.</b> {sel.cause}</p></div>
              <div><small className="ok"><Check size={14} strokeWidth={3} /> How we stop it</small><p>{sel.fix}</p></div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="lf__note">{L.note}{L.source && <> <a href={L.source.href} target="_blank" rel="noopener noreferrer">{L.source.label}</a>.</>}</p>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* 2. Same visit, two claims: a fix line scans down the claim         */
/* ================================================================== */
function Cell({ c }: { c: ClaimSide }) {
  return (
    <>
      <code>{c.code}</code>
      <span className={`tc__tag tc__tag--${c.tone}`}>{c.tone === 'bad' ? <X size={12} strokeWidth={3} /> : c.tone === 'good' ? <Check size={12} strokeWidth={3} /> : null}{c.tag}</span>
      <b className={c.amt === 0 ? 'zero' : ''}>{c.amt == null ? '—' : `$${c.amt.toLocaleString('en-US')}`}</b>
    </>
  );
}

function Side({ s, side, rowsRef }: { s: SpecialtyFull; side: 'bad' | 'good'; rowsRef?: React.RefObject<HTMLDivElement> }) {
  const C = s.claim!;
  const total = C.rows.reduce((t, r) => t + (r[side].amt ?? 0), 0);
  return (
    <div className={`tc__side tc__side--${side}`} aria-hidden={side === 'good' ? true : undefined}>
      <div className="tc__th"><span>#</span><span>Line</span><span>Code</span><span>Status</span><span>Paid</span></div>
      <div ref={rowsRef}>
        {C.rows.map((r, i) => (
          <div className="tc__row" key={r.label}><span className="tc__n">{i + 1}</span><span className="tc__l">{r.label}</span><Cell c={r[side]} /></div>
        ))}
      </div>
      <div className="tc__sum"><span>Paid on this claim</span><b>${total.toLocaleString('en-US')}</b></div>
    </div>
  );
}

export function TwoClaims({ s }: { s: SpecialtyFull }) {
  const C = s.claim!;
  const n = C.rows.length;
  const card = useRef<HTMLDivElement>(null);
  const rows = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // row boundaries as % of card height, measured so the fix line lands exactly on row edges
  const [edges, setEdges] = useState<number[]>(() => Array.from({ length: n + 2 }, (_, i) => (i / (n + 1)) * 100));
  useLayoutEffect(() => {
    const measure = () => {
      const c = card.current, r = rows.current; if (!c || !r) return;
      const H = c.offsetHeight; const top = r.offsetTop + (r.offsetParent === c ? 0 : (r.offsetParent as HTMLElement).offsetTop);
      const kids = [...r.children] as HTMLElement[];
      setEdges([top / H * 100, ...kids.map((k) => (top + k.offsetTop + k.offsetHeight) / H * 100), 100]);
    };
    measure();
    const ro = new ResizeObserver(measure); if (card.current) ro.observe(card.current);
    return () => ro.disconnect();
  }, [n]);

  // the fix line follows the pointer over the claim (tap toggles on touch); it stays where you leave it
  const target = useMotionValue(edges[0]);
  const touched = useRef(false);
  useEffect(() => { if (!touched.current) target.jump(edges[0]); }, [edges, target]);
  const line = useSpring(target, { stiffness: 320, damping: 36, mass: 0.6 });
  const [hint, setHint] = useState(true);
  const follow = (clientY: number) => {
    const r = card.current!.getBoundingClientRect();
    const p = ((clientY - r.top) / r.height) * 100;
    target.set(Math.min(100, Math.max(edges[0], p)));
  };
  const onMove = (e: React.PointerEvent) => { if (e.pointerType !== 'mouse') return; touched.current = true; setHint(false); follow(e.clientY); };
  const onTap = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    touched.current = true; setHint(false);
    target.set(target.get() > 60 ? edges[0] : 100);
  };
  const clip = useTransform(line, (p) => `inset(0 0 ${100 - (reduce ? 100 : p)}% 0)`);
  const top = useTransform(line, (p) => `${p}%`);
  const [fixed, setFixed] = useState(0);
  useMotionValueEvent(line, 'change', (p) => {
    const k = edges.slice(1, n + 1).filter((e) => p >= e - 0.5).length;
    if (k !== fixed) setFixed(k);
  });
  const shown = reduce ? n : fixed;
  const running = C.rows.reduce((t, r, i) => t + ((i < shown ? r.good.amt : r.bad.amt) ?? 0), 0);
  const bad = C.rows.reduce((t, r) => t + (r.bad.amt ?? 0), 0);
  const status = shown === 0 ? 'As it usually goes out' : shown >= n ? 'As we send it' : `Fixing line ${shown + 1} of ${n}`;

  return (
    <section className="tc container">
      <div className="tc__head">
        <div>
          <Eyebrow>{C.eyebrow}</Eyebrow>
          <SplitWords className="h-56" lines={C.lines} stagger={0.04} />
        </div>
        <Reveal as="p" className="tc__intro">{C.intro}</Reveal>
      </div>

      <div className="tc__wrap">
        <div className="tc__bar">
          <div className="tc__delta">
            <span><small>Usually</small><b className="was">${bad.toLocaleString('en-US')}</b></span>
            <span className="tc__arrow" aria-hidden>→</span>
            <span><small>With us</small><b className="accent"><CountUp value={running} prefix="$" start duration={0.6} /></b></span>
          </div>
          <div className="tc__right">
          <span className="tc__meta">{C.visit.map((v) => <span key={v}>{v}</span>)}</span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={status} className={`tc__badge ${shown >= n ? 'is-done' : shown === 0 ? 'is-raw' : ''}`}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>{status}</motion.span>
          </AnimatePresence>
          </div>
        </div>
        <motion.div className="tc__card" ref={card} onPointerMove={onMove} onPointerDown={onTap} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
          <Side s={s} side="bad" rowsRef={rows} />
          <motion.div className="tc__over" style={{ clipPath: clip }}><Side s={s} side="good" /></motion.div>
          {!reduce && (
            <motion.div className="tc__scan" style={{ top }} aria-hidden>
              <span className="tc__knob"><Wand2 size={16} /></span>
              <AnimatePresence>{hint && <motion.span className="tc__hint" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.6 }}>{typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches ? 'Tap the claim to fix it' : 'Hover the claim to fix it'}</motion.span>}</AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>

      <ol className="tc__why">
        {C.rows.map((r, i) => (
          <li key={r.label} className={i < shown ? 'is-on' : ''}>
            <span className="tc__n">{i < shown ? <Check size={13} strokeWidth={3} /> : i + 1}</span>
            <div><b>{r.label}: {r.bad.code} → {r.good.code}</b><p>{r.why}</p></div>
          </li>
        ))}
      </ol>
      <p className="tc__note">{C.note}</p>
    </section>
  );
}
