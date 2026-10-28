import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useInView } from 'motion/react';
import { ChevronDown, ChevronLeft, Check, ShieldCheck, Clock, BadgeCheck } from 'lucide-react';
import { Arrow, Eyebrow, SplitWords } from '../components/ui';
import { ease } from '../motion';
import { SPECIALTIES } from '../data/specialties';
import { useCarriedEstimate, setEstimate } from '../data/estimate';
import { useLead, saveStep1 } from '../data/lead';
import type { Calc, Fmt } from '../data/services';

/* ------------------------------------------------------------------
   Revenue leak estimator
   Two transparent, labelled estimates (shown to the visitor in plain words):
   1. Denied revenue never recovered / year =
        monthly collections × 12 × (denial rate − 5% benchmark) × 50% never reworked
   2. Cash tied up in slow A/R (one-time) =
        daily collections × (days in A/R − 30-day target)
   ------------------------------------------------------------------ */
const BENCH_DENIAL = 5;
const NEVER_REWORKED = 0.5;
const TARGET_AR = 30;

const money = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : `$${Math.round(n / 1000).toLocaleString('en-US')}k`);

function Rolling({ value, className }: { value: number; className?: string }) {
  const sp = useSpring(0, { stiffness: 70, damping: 20, mass: 0.6 });
  const txt = useTransform(sp, (v) => money(Math.max(0, v)));
  useEffect(() => { sp.set(value); }, [value, sp]);
  return <motion.span className={className}>{txt}</motion.span>;
}

function Slider({ id, label, value, min, max, step, fmt, onChange }: {
  id: string; label: string; value: number; min: number; max: number; step: number; fmt: (v: number) => string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const fill = useSpring(pct, { stiffness: 260, damping: 32 });
  useEffect(() => { fill.set(pct); }, [pct, fill]);
  const width = useTransform(fill, (v) => `${v}%`);
  return (
    <div className="est__field">
      <div className="est__row"><label htmlFor={id}>{label}</label><output htmlFor={id}>{fmt(value)}</output></div>
      <div className="est__range">
        <motion.span className="est__fill" style={{ width }} />
        <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </div>
    </div>
  );
}

function Estimator({ onUse, start = 250000 }: { onUse: (summary: string) => void; start?: number }) {
  const [monthly, setMonthly] = useState(start);
  const [denial, setDenial] = useState(12);
  const [ar, setAr] = useState(45);

  const denied = monthly * 12 * (Math.max(0, denial - BENCH_DENIAL) / 100) * NEVER_REWORKED;
  const stuck = (monthly / 30) * Math.max(0, ar - TARGET_AR);
  const total = denied + stuck;
  const share = total > 0 ? denied / total : 0.5;
  const segA = useSpring(share, { stiffness: 120, damping: 24 });
  useEffect(() => { segA.set(share); }, [share, segA]);
  const wA = useTransform(segA, (v) => `${v * 100}%`);
  const wB = useTransform(segA, (v) => `${(1 - v) * 100}%`);

  return (
    <div className="est">
      <div className="est__head">
        <p className="est__kicker">Revenue leak estimator</p>
        <h3>How much is your practice leaving unpaid?</h3>
        <p className="est__lede">Move the sliders to match your last month. It takes about 20 seconds.</p>
      </div>

      <div className="est__fields">
        <Slider id="est-monthly" label="Monthly collections" value={monthly} min={50000} max={2000000} step={10000} fmt={(v) => money(v)} onChange={setMonthly} />
        <Slider id="est-denial" label="Claim denial rate" value={denial} min={2} max={25} step={0.5} fmt={(v) => `${v}%`} onChange={setDenial} />
        <Slider id="est-ar" label="Average days in A/R" value={ar} min={20} max={90} step={1} fmt={(v) => `${v} days`} onChange={setAr} />
      </div>

      <div className="est__result">
        <div className="est__totals">
          <div>
            <small>Denied revenue never recovered</small>
            <Rolling className="est__big" value={denied} /><em>per year</em>
          </div>
          <div>
            <small>Cash tied up in slow A/R</small>
            <Rolling className="est__big" value={stuck} /><em>right now</em>
          </div>
        </div>
        <div className="est__bar" aria-hidden>
          <motion.i style={{ width: wA }} className="est__bar-a" />
          <motion.i style={{ width: wB }} className="est__bar-b" />
        </div>
        <p className="est__how">
          Estimate only. Assumes a {BENCH_DENIAL}% benchmark denial rate, that half of denials above it are never reworked, and a {TARGET_AR}-day A/R target.
          Your assessment replaces these assumptions with your real claim data.
        </p>
        <motion.button className="est__cta" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => onUse(`${money(denied)}/yr in unrecovered denials · ${money(stuck)} tied up in A/R`)}>
          Get my exact numbers <Arrow />
        </motion.button>
      </div>
    </div>
  );
}

const fmtV = (v: number, f: Fmt) => f === '$' ? `$${Math.round(v).toLocaleString('en-US')}` : f === '%' ? `${v}%` : f === 'd' ? `${v} days` : Math.round(v).toLocaleString('en-US');

/** Service pages: the page's own calculator lives here, in the estimate card next to the form. */
function ServiceEstimator({ calc, onUse }: { calc: Calc; onUse: (summary: string) => void }) {
  const [vals, setVals] = useState<Record<string, number>>(() => Object.fromEntries(calc.fields.map((f) => [f.id, f.value])));
  const outs = calc.compute(vals);
  const head = outs.find((o) => o.accent) ?? outs[outs.length - 1];
  const rest = outs.filter((o) => o !== head);
  const summary = `${fmtV(head.value, head.fmt)} · ${head.label.toLowerCase()} (${calc.kicker.toLowerCase()})`;
  useEffect(() => { setEstimate(summary); }, [summary]);
  return (
    <div className="est est--svc">
      <div className="est__head">
        <p className="est__kicker">{calc.kicker}</p>
        <h3>What is it costing your practice?</h3>
        <p className="est__lede">Move the sliders to match your last month. Your number goes straight into the form.</p>
      </div>
      <div className="est__fields">
        {calc.fields.map((f) => (
          <Slider key={f.id} id={`est-${f.id}`} label={f.label} value={vals[f.id]} min={f.min} max={f.max} step={f.step}
            fmt={(v) => fmtV(v, f.fmt)} onChange={(v) => setVals((o) => ({ ...o, [f.id]: v }))} />
        ))}
      </div>
      <div className="est__result">
        <div className="est__head-out">
          <small>{head.label}</small>
          <b className="est__big">{fmtV(head.value, head.fmt)}</b>
        </div>
        {rest.length > 0 && (
          <div className="est__minor">
            {rest.map((o) => <div key={o.label}><small>{o.label}</small><b>{fmtV(o.value, o.fmt)}</b></div>)}
          </div>
        )}
        <p className="est__how">{calc.note}</p>
        <motion.button className="est__cta" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onUse(summary)}>
          Get my exact numbers <Arrow />
        </motion.button>
      </div>
    </div>
  );
}

const field = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: ease.out } },
};

/** Service pages: the number from the page's calculator, carried down instead of a second calculator. */
function Carried({ value }: { value: string }) {
  const [amt, ...rest] = value.split(' · ');
  return (
    <div className="est est--carried">
      <div className="est__head">
        <p className="est__kicker">{value ? 'Your estimate from above' : 'Your free assessment'}</p>
        <h3>{value ? 'This is the number we’d start with.' : 'Real numbers from your own claims.'}</h3>
      </div>
      {value ? (
        <div className="est__carried">
          <b className="est__big">{amt}</b>
          <small>{rest.join(' · ')}</small>
          <a className="text-link" href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.calc')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>Adjust the numbers</a>
        </div>
      ) : null}
      <ul className="est__gets">
        {INCLUDED.map((t) => <li key={t}><Check size={16} strokeWidth={3} />{t}</li>)}
      </ul>
      <p className="est__how">Estimate only. The assessment replaces it with what your claims, denials and A/R aging actually show.</p>
    </div>
  );
}

const INCLUDED = ['Denial root-cause review', 'A/R aging breakdown', 'Coding and charge capture gaps', 'Payer underpayment check'];

/**
 * The free-assessment fold. Shared by every page, tuned per page:
 * - `monthly`: the estimator starts at a practice-sized number (specialty pages pass their typical monthly collections)
 * - `specialty`: pre-selects the specialty in the form
 * - `formFirst` (service pages): no second calculator; the form carries the number from the page's own calculator
 * - `calc`: service pages pass their calculator, which then lives in the estimate card (no calculator higher up)
 * - `source`: sent with the form so sales knows which page the lead came from
 */
export function Assessment({ monthly, specialty, formFirst, source, calc }: { monthly?: number; specialty?: string; formFirst?: boolean; source?: string; calc?: Calc } = {}) {
  const carried = useCarriedEstimate();
  const [sent, setSent] = useState(false);
  const [picked, setPicked] = useState('');
  const estimate = picked || (formFirst ? carried : '');
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const inView = useInView(left, { once: true, amount: 0.3 });

  const lead = useLead();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(lead.name ?? '');
  const [phone, setPhone] = useState(lead.phone ?? '');
  const [email, setEmail] = useState(lead.email ?? '');
  // A contact typed in the page hero lands here
  useEffect(() => { if (lead.phone && !phone) setPhone(lead.phone); if (lead.email && !email) setEmail(lead.email); }, [lead.phone, lead.email]); // eslint-disable-line react-hooks/exhaustive-deps
  const src = source ?? (typeof window !== 'undefined' ? window.location.hash : '');
  const first = name.trim().replace(/^dr\.?\s+/i, '').split(/\s+/)[0] ?? '';
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { saveStep1({ name, phone, email, source: src }); setStep(2); return; }
    setSent(true);
  };

  const useEstimate = (s: string) => {
    setPicked(s);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 700);
  };

  return (
    <section className="assess container" id="assessment">
      <div ref={left} className="assess__left">
        <motion.div className="assess__est" initial={{ clipPath: 'inset(12% 12% 12% 12% round 3.2rem)', opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0% round 3.2rem)', opacity: 1 } : {}} transition={{ duration: 1.4, ease: ease.out }}>
          {calc ? <ServiceEstimator calc={calc} onUse={useEstimate} /> : formFirst ? <Carried value={carried} /> : <Estimator onUse={useEstimate} start={monthly} />}
        </motion.div>
      </div>

      <div className="assess__side">
        <Eyebrow>/ Free revenue assessment</Eyebrow>
        <SplitWords className="h-56" lines={['See exactly where your', 'revenue is leaking.']} stagger={0.04} />
        <motion.ul className="assess__incl" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
          {INCLUDED.map((t) => (
            <motion.li key={t} variants={field}><span><Check /></span>{t}</motion.li>
          ))}
        </motion.ul>

        <motion.form ref={formRef} className="assess__form" onSubmit={submit}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: ease.out, staggerChildren: 0.06, delayChildren: 0.2 } } }}>
          <motion.div variants={field}>
            <div className="assess__steps" aria-label={`Step ${step} of 2`}>
              <span className={step >= 1 ? 'is-on' : ''}><b>{step > 1 ? <Check size={12} strokeWidth={3} /> : 1}</b>Your details</span>
              <i className={step > 1 ? 'is-on' : ''} />
              <span className={step >= 2 ? 'is-on' : ''}><b>2</b>Your practice</span>
            </div>
            <h3 className="assess__title">{step === 1 ? 'Request your free assessment' : `Thanks${first ? `, ${first}` : ''}. Two quick questions.`}</h3>
            <p className="assess__fine">{step === 1 ? 'Where should a billing specialist reach you? Takes 20 seconds.' : 'This helps us bring the right specialist and real numbers to the call.'}</p>
          </motion.div>
          <AnimatePresence>
            {estimate && (
              <motion.p className="assess__estimate" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: ease.out }}>
                Your estimate: <b>{estimate}</b>
              </motion.p>
            )}
          </AnimatePresence>
          <input type="hidden" name="estimate" value={estimate} />
          <input type="hidden" name="source" value={src} />
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div key="s1" className="assess__grid" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: ease.out }}>
                <label className="span-2">Full name<input id="f-name" name="name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Smith" autoComplete="name" required /></label>
                <label>Phone<input id="f-phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(214) 555-0123" autoComplete="tel" required /></label>
                <label>Work email<input id="f-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@yourpractice.com" autoComplete="email" required /></label>
              </motion.div>
            ) : (
              <motion.div key="s2" className="assess__grid" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.4, ease: ease.out }}>
                <label>Practice name<input id="f-org" name="practice" placeholder="Smith Family Medicine" autoFocus /></label>
                <label>Specialty
                  <span className="select"><select id="f-spec" name="specialty" key={specialty ?? ''} defaultValue={specialty ?? ''}><option value="" disabled>Select specialty</option>{SPECIALTIES.map((x) => <option key={x.slug}>{x.name}</option>)}<option>Multi-specialty group</option><option>Other</option></select><ChevronDown /></span>
                </label>
                <label>Number of providers
                  <span className="select"><select id="f-size" name="providers" defaultValue=""><option value="" disabled>Select one</option><option>Solo (1)</option><option>2–5</option><option>6–20</option><option>21–50</option><option>50+</option></select><ChevronDown /></span>
                </label>
                <label>Monthly collections
                  <span className="select"><select id="f-coll" name="collections" defaultValue=""><option value="" disabled>Select one</option><option>Under $50k</option><option>$50k–$250k</option><option>$250k–$1M</option><option>Over $1M</option></select><ChevronDown /></span>
                </label>
                <label className="span-2">Biggest billing headache
                  <span className="select"><select id="f-prio" name="headache" defaultValue=""><option value="" disabled>Select one</option><option>Too many denials</option><option>Slow payments / high A/R</option><option>Coding accuracy</option><option>Staff stretched thin</option><option>Credentialing delays</option></select><ChevronDown /></span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div variants={field} className="assess__actions">
            {step === 2 && !sent && (
              <button type="button" className="assess__back" onClick={() => setStep(1)}><ChevronLeft size={18} />Back</button>
            )}
            <motion.button type="submit" className="btn btn--block" whileHover="hover" whileTap={{ scale: 0.99 }} initial="rest" animate={sent ? 'sent' : 'rest'}>
              <span className="btn__label">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={sent ? 's' : `n${step}`} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.35, ease: ease.out }}>
                    {sent ? 'Request received. We’ll be in touch.' : step === 1 ? 'Continue' : 'Get my free assessment'}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.span className="btn__icon" variants={{ rest: { x: 0, rotate: 0 }, hover: { x: 4, rotate: -45 }, sent: { rotate: 0, backgroundColor: '#12b886' } }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                {sent ? <Check size={20} /> : <Arrow />}
              </motion.span>
            </motion.button>
          </motion.div>
          <motion.div className="assess__trust" variants={field}>
            <span><BadgeCheck />Free, no obligation</span>
            <span><ShieldCheck />HIPAA-compliant</span>
            <span><Clock />Takes 2 minutes</span>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
