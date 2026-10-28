import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup, useInView, animate, useMotionValue, useTransform } from 'motion/react';
import { ArrowRight, ChevronLeft, Check } from 'lucide-react';
import { Button, CountUp, Eyebrow, Logo, Reveal, SplitWords } from '../components/ui';
import { CTA } from '../sections/Closing';
import { Link, go } from '../router';
import { CASES, METRICS, getCase, type Case, type MetricKey } from '../data/insights';
import { SERVICES } from '../data/services';
import { ease, vp } from '../motion';
// Perf: pre-blurred copy of fluted-purple.jpg replaces a live backdrop-filter blur on these panels
import fluted from '../assets/fluted-frost.jpg';

const svc = (slug: string) => SERVICES.find((s) => s.slug === slug);
const fmtM = (k: MetricKey, v: number) => `${Math.round(v)}${METRICS.find((m) => m.key === k)!.unit}`;
const setMeta = (title: string, desc: string) => {
  document.title = `${title} · Affinity Core`;
  let m = document.querySelector('meta[name="description"]');
  if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
  m.setAttribute('content', desc);
};

/* ================= Overview hero: slope chart, before → day 90 ================= */
/** label spacing in chart units: phones show the chart at about half size, so labels get bigger and need more room */
const GAP = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches ? 34 : 22;
function Slope() {
  const [k, setK] = useState<MetricKey>('denial');
  const [hot, setHot] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.3 });
  const m = METRICS.find((x) => x.key === k)!;
  const vals = CASES.flatMap((c) => [c.before[k], c.after[k]]);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.18 || 1;
  const Y = (v: number) => 40 + (1 - (v - (lo - pad)) / (hi - lo + 2 * pad)) * 300;
  // Dodge labels so equal values don't print on top of each other
  const dodge = (ys: number[]) => {
    const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y); const out = [...ys];
    order.forEach((o, j) => { const prev = j ? out[order[j - 1].i] : -Infinity; out[o.i] = Math.max(o.y, prev + GAP); });
    return out;
  };
  const L1 = dodge(CASES.map((c) => Y(c.before[k]))), L2 = dodge(CASES.map((c) => Y(c.after[k])));
  return (
    <div className="sl" ref={ref}>
      <div className="sl__bg" aria-hidden><img src={fluted} alt="" /></div>
      <LayoutGroup>
        <div className="sl__tabs" role="tablist" aria-label="Metric">
          {METRICS.map((x) => (
            <button key={x.key} role="tab" aria-selected={k === x.key} className={k === x.key ? 'is-on' : ''} onClick={() => setK(x.key)}>
              {k === x.key && <motion.span layoutId="sl-pill" className="sl__pill" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span>{x.short}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <div className="sl__chart">
        <svg viewBox="0 0 600 380" aria-label={`${m.label} before and after 90 days for each case study`}>
          <line x1="90" x2="90" y1="20" y2="360" className="sl__axis" />
          <line x1="400" x2="400" y1="20" y2="360" className="sl__axis" />
          <text x="90" y="14" className="sl__ax">Before</text>
          <text x="400" y="14" className="sl__ax">Day 90</text>
          {CASES.map((c, i) => {
            const y1 = Y(c.before[k]), y2 = Y(c.after[k]);
            const dim = hot && hot !== c.slug;
            return (
              <g key={c.slug} className={`sl__line ${dim ? 'is-dim' : ''} ${hot === c.slug ? 'is-hot' : ''}`} onMouseEnter={() => setHot(c.slug)} onMouseLeave={() => setHot(null)} onClick={() => go(`/case-studies/${c.slug}`)}>
                <motion.line x1="90" x2="400" initial={false} animate={{ y1, y2: on ? y2 : y1 }} transition={{ duration: 1.1, ease: ease.out, delay: on ? i * 0.08 : 0 }} />
                <motion.circle cx="90" r="7" className="was" initial={false} animate={{ cy: y1 }} transition={{ duration: 0.8, ease: ease.out }} />
                <motion.circle cx="400" r="8" className="now" initial={false} animate={{ cy: on ? y2 : y1 }} transition={{ duration: 1.1, ease: ease.out, delay: on ? i * 0.08 : 0 }} />
                <motion.text x="74" textAnchor="end" className="sl__v" initial={false} animate={{ y: L1[i] + 5 }}>{fmtM(k, c.before[k])}</motion.text>
                <motion.text x="418" className="sl__v sl__v--now" initial={false} animate={{ y: (on ? L2[i] : L1[i]) + 5 }} transition={{ duration: 1.1, ease: ease.out, delay: on ? i * 0.08 : 0 }}>{fmtM(k, c.after[k])} <tspan className="sl__sp">{c.specialty}</tspan></motion.text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="sl__foot">{m.better === 'down' ? 'Lower is better.' : 'Higher is better.'} Hover a line to pick out one practice; click to read it.</p>
    </div>
  );
}

const loc = (c: Case) => c.profile.find(([k]) => k === 'Location')?.[1];
/** Labels shown on a card: specialty, size, location. */
const labels = (c: Case) => [...c.tag.split(' · '), loc(c)].filter(Boolean) as string[];
const headline = (c: Case) => {
  const m = METRICS.find((x) => x.key === c.headline)!;
  const a = c.before[c.headline], b = c.after[c.headline];
  const delta = m.better === 'down' ? `−${Math.round((1 - b / a) * 100)}%` : `+${b - a} pts`;
  return { m, a, b, delta };
};

/** Kept for the case detail page (plain photo next to the practice profile). */
export function CaseCover({ c, big }: { c: Case; big?: boolean }) {
  return (
    <div className={`cx__photo ${big ? 'cx__photo--big' : ''}`}>
      <img src={c.photo} alt={c.alt} loading="lazy" style={c.pos ? { objectPosition: c.pos } : undefined} />
    </div>
  );
}

/** Compact case card: photo with one result widget, labels, one title. `still`: no own entrance (inside a grid that crossfades as a whole). */
export function CaseCard({ c, k = 0, still }: { c: Case; k?: number; still?: boolean }) {
  const enter = still ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: vp, transition: { duration: 0.8, ease: ease.out, delay: (k % 4) * 0.08 } };
  const { m, a, b, delta } = headline(c);
  const to = `/case-studies/${c.slug}`;
  return (
    <motion.article className="cc" onClick={() => go(to)} {...enter}
      role="link" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') go(to); }}>
      <div className="cc__photo">
        <img src={c.photo} alt={c.alt} loading="lazy" style={c.pos ? { objectPosition: c.pos } : undefined} />
        {/* Affinity Core layer: purple grade, fluted-glass band (the brand texture) and the logo's gradient mark */}
        <span className="cc__grade" aria-hidden />
        <span className="cc__flute" aria-hidden />
        <span className="cc__mark" aria-hidden><Logo light /></span>
        <span className="cc__chip">
          <small>{m.label} · 90 days</small>
          <span><s>{a}{m.unit}</s><b>{b}{m.unit}</b><em>{delta}</em></span>
        </span>
      </div>
      <div className="cc__body">
        <ul className="cc__labels">{labels(c).map((l) => <li key={l}>{l}</li>)}</ul>
        <h3>{c.title}</h3>
        <span className="cc__more">Read case study <ArrowRight size={16} /></span>
      </div>
    </motion.article>
  );
}

const DEFS: [string, string, string][] = [
  ['Denial rate', 'Denied claims ÷ claims submitted', 'How often payers say no the first time.'],
  ['Days in A/R', 'Total A/R ÷ average daily charges', 'How long, on average, it takes to get paid.'],
  ['Clean claim rate', 'Claims accepted on first submission ÷ claims submitted', 'How often a claim goes through without edits or rejections.'],
  ['Net collection rate', 'Payments ÷ (charges − contractual adjustments)', 'How much of what you’re owed you actually collect.'],
];

export function CaseStudiesHub() {
  const [f, setF] = useState('All');
  const specs = ['All', ...CASES.map((c) => c.specialty)];
  const list = CASES.filter((c) => f === 'All' || c.specialty === f);
  useEffect(() => setMeta('Medical Billing Case Studies', 'Before-and-after results from practices that handed their billing to Affinity Core: denial rate, days in A/R, clean claims and net collections.'), []);
  return (
    <main className="page">
      <section className="xh csh">
        <div className="xh__copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ Case studies</motion.p>
          <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={['Results, measured', 'in practices’ own', 'numbers.']} bold={['numbers.']} />
          <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
            Every engagement starts with a baseline and ends with a 90-day readout on the same four numbers. Here’s where four practices started, and where they landed.
          </motion.p>
          <motion.div className="sh-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
            <Button>Get a free revenue assessment</Button>
            <Link to="#cases" className="text-link">Browse case studies <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
        <motion.div className="xh__stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: ease.out, delay: 0.4 }}>
          <Slope />
        </motion.div>
      </section>

      <section className="cs container csl" id="cases">
        <div className="cs__head">
          <div>
            <Eyebrow>/ All case studies</Eyebrow>
            <SplitWords className="h-56" lines={['Pick a practice like yours.']} stagger={0.04} />
          </div>
        </div>
        <LayoutGroup>
          <div className="need__chips csl__chips" role="tablist">
            {specs.map((s) => (
              <button key={s} role="tab" aria-selected={f === s} className={`need__chip ${f === s ? 'is-on' : ''}`} onClick={() => setF(s)}>
                {f === s && <motion.span layoutId="csl-pill" className="need__pill" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />}
                <span>{s}</span>
              </button>
            ))}
          </div>
          {/* filter change: the whole grid crossfades once (no per-card reflow jumps) */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={f} className="cs__grid cs__grid--4" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } }} exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: 'easeIn' } }}>
              {list.map((c, k) => <CaseCard key={c.slug} c={c} k={k} still={f !== 'All' || undefined} />)}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </section>

      <section className="mdef container">
        <div className="mdef__head">
          <Eyebrow>/ How we measure</Eyebrow>
          <SplitWords className="h-56" lines={['Four numbers,', 'so you can check us.']} stagger={0.04} />
          <Reveal as="p" className="body-18">The same four metrics appear in every monthly report, calculated the same way, from your own system.</Reveal>
        </div>
        <div className="mdef__grid">
          {DEFS.map(([t, f2, d], i) => (
            <Reveal key={t} className="mdef__card" delay={i * 0.08}>
              <span className="mdef__n">0{i + 1}</span>
              <b>{t}</b>
              <code>{f2}</code>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CTA eyebrow="/ Your practice next" lines={['Get your own baseline,', 'free, in your own numbers.']} />
    </main>
  );
}

/* ================= Case study template ================= */
function Board({ c }: { c: Case }) {
  return (
    <div className="cb">
      <div className="sl__bg" aria-hidden><img src={fluted} alt="" /></div>
      <p className="cb__label"><span />Before → Day 90</p>
      <div className="cb__grid">
        {[...METRICS].sort((x, y) => Number(y.key === c.headline) - Number(x.key === c.headline)).map((m, i) => {
          const a = c.before[m.key], b = c.after[m.key];
          const lead = m.key === c.headline;
          return (
            <motion.div key={m.key} className={`cb__tile ${lead ? 'is-lead' : ''}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.6 + i * 0.1 }}>
              <small>{m.label}</small>
              <div className="cb__nums"><s>{a}{m.unit}</s><ArrowRight size={lead ? 22 : 16} /><b><CountUp value={b} suffix={m.unit} start delay={0.9 + i * 0.1} /></b></div>
              <span className="cb__bar"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: Math.min(a, b) / Math.max(a, b) }} transition={{ duration: 1.2, ease: ease.out, delay: 1 + i * 0.1 }} /></span>
              <em>{m.better === 'down' ? `${Math.round((1 - b / a) * 100)}% lower` : `+${b - a} pts`}</em>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function NinetyDays({ c }: { c: Case }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  const [day, setDay] = useState(0);
  const mv = useMotionValue(0);
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!on || touched) return;
    const ctl = animate(mv, 90, { duration: 5, ease: 'easeInOut', onUpdate: (v) => { const r = Math.round(v); setDay((d) => (d === r ? d : r)); } });
    return () => ctl.stop();
  }, [on, touched, mv]);
  const fill = useTransform(mv, (v) => v / 90);
  const thumbX = useTransform(mv, (v) => `${(v / 90) * 100}%`);
  const t = day / 90; const e = 1 - Math.pow(1 - t, 2);
  const val = (k: MetricKey) => c.before[k] + (c.after[k] - c.before[k]) * e;
  return (
    <section className="nd container" ref={ref}>
      <div className="nd__head">
        <Eyebrow>/ The first 90 days</Eyebrow>
        <SplitWords className="h-56" lines={['Drag through', 'the first 90 days.']} stagger={0.04} />
      </div>
      <div className="nd__panel">
        <div className="nd__day"><small>Day</small><b>{day}</b></div>
        {/* Custom track (fill, thumb, milestones on the line) driven by a motion value; the native range
            input sits on top, invisible, for drag + keyboard. No per-frame React renders for the visuals. */}
        <div className="nd__slider">
          <div className="nd__rail" aria-hidden>
            <motion.i className="nd__fill" style={{ scaleX: fill }} />
            {c.timeline.map((m) => (
              <span key={m.day} className={`nd__dot ${day >= m.day ? 'is-done' : ''}`} style={{ left: `${(m.day / 90) * 100}%` }}>
                {day >= m.day && <Check size={11} strokeWidth={3.2} />}
              </span>
            ))}
            <motion.b className="nd__thumb" style={{ left: thumbX }} />
          </div>
          <input type="range" min={0} max={90} value={day} aria-label="Day of engagement"
            onChange={(ev) => { const v = Number(ev.target.value); setTouched(true); mv.set(v); setDay(v); }} />
          <div className="nd__marks">
            {c.timeline.map((m) => (
              <button key={m.day} className={`nd__mark ${day >= m.day ? 'is-done' : ''}`} style={{ left: `${(m.day / 90) * 100}%` }} onClick={() => { setTouched(true); mv.set(m.day); setDay(m.day); }}>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="nd__cols">
          <div className="nd__metrics">
            {METRICS.map((m) => {
              const v = val(m.key);
              return (
                <div key={m.key} className="nd__m">
                  <small>{m.label}</small>
                  <b>{fmtM(m.key, v)}</b>
                  <span className="nd__track"><i style={{ transform: `scaleX(${v / Math.max(c.before[m.key], c.after[m.key])})` }} /></span>
                </div>
              );
            })}
          </div>
          <div className="nd__log">
            <AnimatePresence mode="popLayout" initial={false}>
              {[...c.timeline].filter((m) => day >= m.day).reverse().slice(0, 3).map((m) => (
                <motion.div key={m.day} className="nd__entry" layout initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: ease.out }}>
                  <small>Day {m.day} · {m.label}</small><p>{m.body}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CaseStudyPage({ slug }: { slug: string }) {
  const c = getCase(slug)!;
  const others = CASES.filter((x) => x.slug !== slug).slice(0, 3);
  useEffect(() => setMeta(`${c.specialty} Case Study: ${c.title}`, `${c.tag}. ${c.challenge[0]}`), [c]);
  return (
    <main className="page">
      <section className="sp-hero csd-hero">
        <div className="sp-hero__copy">
          <motion.nav className="crumbs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
            <Link to="/case-studies"><ChevronLeft size={16} /> Case studies</Link><span>/</span><span>{c.specialty}</span>
          </motion.nav>
          <motion.p className="cs__tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>{c.tag}</motion.p>
          <SplitWords as="h1" className="page-title csd-title" animateNow delay={0.3} stagger={0.05} lines={[c.title]} />
          <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.75 }}>{c.challenge[0]}</motion.p>
          <motion.div className="csd-svcs" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.9 }}>
            <small>Services used</small>
            {c.services.map((s) => <Link key={s} to={`/services/${s}`} className="csd-chip">{svc(s)?.name} <ArrowRight size={14} /></Link>)}
          </motion.div>
        </div>
        <motion.div className="csd-stage" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.3 }}>
          <Board c={c} />
        </motion.div>
      </section>

      <section className="csp container">
        <Reveal className="csp__photo csp__photo--cx"><CaseCover c={c} big /></Reveal>
        <div className="csp__info">
          <Eyebrow>/ The practice</Eyebrow>
          <dl>{c.profile.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        </div>
      </section>

      <section className="ff container">
        <div className="ff__head">
          <Eyebrow>/ What we found, what we fixed</Eyebrow>
          <SplitWords className="h-56" lines={['Three problems.', 'Three fixes at the source.']} stagger={0.04} />
        </div>
        <ol className="ff__rows">
          {c.challenge.map((p, i) => (
            <motion.li key={i} className="ff__row" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: i * 0.08 }}>
              <span className="ff__n">0{i + 1}</span>
              <div className="ff__found"><small>Found</small><p>{p}</p></div>
              <motion.span className="ff__arrow" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.3 + i * 0.08 }} aria-hidden />
              <div className="ff__fixed"><small>Fixed</small><b>{c.did[i].title}</b><p>{c.did[i].body}</p></div>
            </motion.li>
          ))}
        </ol>
      </section>

      <NinetyDays c={c} />

      <section className="cs container">
        <div className="cs__head">
          <div><Eyebrow>/ More case studies</Eyebrow><SplitWords className="h-56" lines={['Other practices,', 'same four numbers.']} stagger={0.04} /></div>
          <Link to="/case-studies" className="text-link">All case studies <ArrowRight size={18} /></Link>
        </div>
        <div className="cs__grid cs__grid--3">{others.map((o, k) => <CaseCard key={o.slug} c={o} k={k} />)}</div>
      </section>

      <CTA eyebrow="/ Your practice next" lines={['Want numbers like these?', 'Start with a free baseline.']} />
    </main>
  );
}
