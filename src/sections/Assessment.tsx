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
      <div className="est__row [display:flex] [justify-content:space-between] [align-items:baseline] [font-size:1.6rem] [&_output]:[font-weight:600] [&_output]:[font-size:1.9rem] [&_output]:[font-variant-numeric:tabular-nums]"><label htmlFor={id}>{label}</label><output htmlFor={id}>{fmt(value)}</output></div>
      <div className="est__range [position:relative] [height:2.6rem] [margin-top:0.6rem] [display:flex] [align-items:center] [&::before]:[content:''] [&::before]:[position:absolute] [&::before]:[left:0] [&::before]:[right:0] [&::before]:[height:0.6rem] [&::before]:[border-radius:1rem] [&::before]:[background:rgba(255,_255,_255,_0.22)] [&_input]:[position:relative] [&_input]:[width:100%] [&_input]:[margin:0] [&_input]:[appearance:none] [&_input]:[-webkit-appearance:none] [&_input]:[background:transparent] [&_input]:[height:2.8rem] [&_input]:[cursor:pointer] [&_input::-webkit-slider-thumb]:[-webkit-appearance:none] [&_input::-webkit-slider-thumb]:[width:2.8rem] [&_input::-webkit-slider-thumb]:[height:2.8rem] [&_input::-webkit-slider-thumb]:[border-radius:50%] [&_input::-webkit-slider-thumb]:[background:#fff] [&_input::-webkit-slider-thumb]:[border:0.5rem_solid_#d7ccff] [&_input::-webkit-slider-thumb]:[box-shadow:0_0.6rem_1.6rem_rgba(20,_0,_90,_0.35)] [&_input::-webkit-slider-thumb]:[transition:transform_0.25s_cubic-bezier(.16,1,.3,1)] [&_input:active::-webkit-slider-thumb]:[transform:scale(1.18)] [&_input::-moz-range-thumb]:[width:2.8rem] [&_input::-moz-range-thumb]:[height:2.8rem] [&_input::-moz-range-thumb]:[border-radius:50%] [&_input::-moz-range-thumb]:[background:#fff] [&_input::-moz-range-thumb]:[border:0.5rem_solid_#d7ccff] [&_input:focus-visible]:[outline:2px_solid_#fff] [&_input:focus-visible]:[outline-offset:4px]! [&_input:focus-visible]:[border-radius:1rem]">
        <motion.span className="est__fill [position:absolute] [left:0] [height:0.6rem] [border-radius:1rem] [background:#fff]" style={{ width }} />
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
    <div className="est [padding:4rem] [display:flex] [flex-direction:column] [gap:2.8rem] [@media(max-width:_1279px)]:[padding:3.2rem_2.4rem]">
      <div className="est__head [&_h3]:[margin-top:1rem] [&_h3]:[font-weight:500] [&_h3]:[font-size:3.2rem] [&_h3]:[line-height:1.1] [&_h3]:[letter-spacing:-0.08rem] [&_h3]:[text-wrap:balance]">
        <p className="est__kicker [font-family:var(--f-mono)] [font-size:1.4rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:rgba(255,_255,_255,_0.75)]">Revenue leak estimator</p>
        <h3>How much is your practice leaving unpaid?</h3>
        <p className="est__lede [margin-top:0.8rem] [font-size:1.6rem] [color:rgba(255,_255,_255,_0.82)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]">Move the sliders to match your last month. It takes about 20 seconds.</p>
      </div>

      <div className="est__fields [display:flex] [flex-direction:column] [gap:2rem]">
        <Slider id="est-monthly" label="Monthly collections" value={monthly} min={50000} max={2000000} step={10000} fmt={(v) => money(v)} onChange={setMonthly} />
        <Slider id="est-denial" label="Claim denial rate" value={denial} min={2} max={25} step={0.5} fmt={(v) => `${v}%`} onChange={setDenial} />
        <Slider id="est-ar" label="Average days in A/R" value={ar} min={20} max={90} step={1} fmt={(v) => `${v} days`} onChange={setAr} />
      </div>

      <div className="est__result [border-radius:2.4rem] [background:rgba(255,_255,_255,_0.1)] [border:1px_solid_rgba(255,_255,_255,_0.22)] [padding:2.4rem] [display:flex] [flex-direction:column] [gap:1.4rem]">
        <div className="est__totals [display:grid] [grid-template-columns:1fr_1fr] [gap:2.4rem] [&_small]:[display:block] [&_small]:[font-size:1.5rem] [&_small]:[color:rgba(255,_255,_255,_0.8)] [&_em]:[font-style:normal] [&_em]:[font-size:1.4rem] [&_em]:[color:rgba(255,_255,_255,_0.7)]">
          <div>
            <small>Denied revenue never recovered</small>
            <Rolling className="est__big [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:4.2rem] [line-height:1] [letter-spacing:-0.12rem] [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[font-size:3.6rem] [.est\_\_head-out_&]:[font-size:5.2rem] [@media(max-width:_640px)]:[.est\_\_head-out_&]:[font-size:4rem]" value={denied} /><em>per year</em>
          </div>
          <div>
            <small>Cash tied up in slow A/R</small>
            <Rolling className="est__big [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:4.2rem] [line-height:1] [letter-spacing:-0.12rem] [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[font-size:3.6rem] [.est\_\_head-out_&]:[font-size:5.2rem] [@media(max-width:_640px)]:[.est\_\_head-out_&]:[font-size:4rem]" value={stuck} /><em>right now</em>
          </div>
        </div>
        <div className="est__bar [display:flex] [gap:0.4rem] [height:1rem] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[border-radius:1rem]" aria-hidden>
          <motion.i style={{ width: wA }} className="est__bar-a [background:#fff]" />
          <motion.i style={{ width: wB }} className="est__bar-b [background:#c9b8ff]" />
        </div>
        <p className="est__how [font-size:1.3rem] [line-height:1.55] [color:rgba(255,_255,_255,_0.72)] [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55]">
          Estimate only. Assumes a {BENCH_DENIAL}% benchmark denial rate, that half of denials above it are never reworked, and a {TARGET_AR}-day A/R target.
          Your assessment replaces these assumptions with your real claim data.
        </p>
        <motion.button className="est__cta [align-self:flex-start] [display:inline-flex] [align-items:center] [gap:1.2rem] [height:4.8rem] [padding-inline:2.8rem] [border-radius:6rem] [background:#fff] [color:var(--purple)] [font-weight:600] [font-size:1.9rem] [&_svg]:[width:2rem] [&_svg]:[height:2rem] [@media(max-width:_640px)]:[align-self:stretch] [@media(max-width:_640px)]:[justify-content:center] [@media(max-width:_640px)]:[height:5.2rem] [@media(max-width:_640px)]:[padding-inline:2rem] [@media(max-width:_640px)]:[font-size:1.7rem] [@media(max-width:_640px)]:[white-space:nowrap]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
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
    <div className="est est--svc [padding:4rem] [display:flex] [flex-direction:column] [gap:2.8rem] [@media(max-width:_1279px)]:[padding:3.2rem_2.4rem]">
      <div className="est__head [&_h3]:[margin-top:1rem] [&_h3]:[font-weight:500] [&_h3]:[font-size:3.2rem] [&_h3]:[line-height:1.1] [&_h3]:[letter-spacing:-0.08rem] [&_h3]:[text-wrap:balance]">
        <p className="est__kicker [font-family:var(--f-mono)] [font-size:1.4rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:rgba(255,_255,_255,_0.75)]">{calc.kicker}</p>
        <h3>What is it costing your practice?</h3>
        <p className="est__lede [margin-top:0.8rem] [font-size:1.6rem] [color:rgba(255,_255,_255,_0.82)] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]">Move the sliders to match your last month. Your number goes straight into the form.</p>
      </div>
      <div className="est__fields [display:flex] [flex-direction:column] [gap:2rem]">
        {calc.fields.map((f) => (
          <Slider key={f.id} id={`est-${f.id}`} label={f.label} value={vals[f.id]} min={f.min} max={f.max} step={f.step}
            fmt={(v) => fmtV(v, f.fmt)} onChange={(v) => setVals((o) => ({ ...o, [f.id]: v }))} />
        ))}
      </div>
      <div className="est__result [border-radius:2.4rem] [background:rgba(255,_255,_255,_0.1)] [border:1px_solid_rgba(255,_255,_255,_0.22)] [padding:2.4rem] [display:flex] [flex-direction:column] [gap:1.4rem]">
        <div className="est__head-out [&_small]:[display:block] [&_small]:[font-size:1.5rem] [&_small]:[color:rgba(255,_255,_255,_0.8)]">
          <small>{head.label}</small>
          <b className="est__big [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:4.2rem] [line-height:1] [letter-spacing:-0.12rem] [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[font-size:3.6rem] [.est\_\_head-out_&]:[font-size:5.2rem] [@media(max-width:_640px)]:[.est\_\_head-out_&]:[font-size:4rem]">{fmtV(head.value, head.fmt)}</b>
        </div>
        {rest.length > 0 && (
          <div className="est__minor [&_small]:[display:block] [&_small]:[font-size:1.5rem] [&_small]:[color:rgba(255,_255,_255,_0.8)] [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:2rem] [padding-top:1.4rem] [border-top:1px_solid_rgba(255,_255,_255,_0.2)] [&_b]:[display:block] [&_b]:[margin-top:0.4rem] [&_b]:[font-weight:600] [&_b]:[font-size:2.4rem] [&_b]:[font-variant-numeric:tabular-nums] [&_b]:[letter-spacing:-0.04rem] [@media(max-width:_640px)]:[&_b]:[font-size:2rem]">
            {rest.map((o) => <div key={o.label}><small>{o.label}</small><b>{fmtV(o.value, o.fmt)}</b></div>)}
          </div>
        )}
        <p className="est__how [font-size:1.3rem] [line-height:1.55] [color:rgba(255,_255,_255,_0.72)] [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55]">{calc.note}</p>
        <motion.button className="est__cta [align-self:flex-start] [display:inline-flex] [align-items:center] [gap:1.2rem] [height:4.8rem] [padding-inline:2.8rem] [border-radius:6rem] [background:#fff] [color:var(--purple)] [font-weight:600] [font-size:1.9rem] [&_svg]:[width:2rem] [&_svg]:[height:2rem] [@media(max-width:_640px)]:[align-self:stretch] [@media(max-width:_640px)]:[justify-content:center] [@media(max-width:_640px)]:[height:5.2rem] [@media(max-width:_640px)]:[padding-inline:2rem] [@media(max-width:_640px)]:[font-size:1.7rem] [@media(max-width:_640px)]:[white-space:nowrap]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onUse(summary)}>
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
    <div className="est est--carried [padding:4rem] [@media(max-width:_1279px)]:[padding:3.2rem_2.4rem] [display:flex] [flex-direction:column] [gap:2.4rem]">
      <div className="est__head [&_h3]:[margin-top:1rem] [&_h3]:[font-weight:500] [&_h3]:[font-size:3.2rem] [&_h3]:[line-height:1.1] [&_h3]:[letter-spacing:-0.08rem] [&_h3]:[text-wrap:balance]">
        <p className="est__kicker [font-family:var(--f-mono)] [font-size:1.4rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:rgba(255,_255,_255,_0.75)]">{value ? 'Your estimate from above' : 'Your free assessment'}</p>
        <h3>{value ? 'This is the number we’d start with.' : 'Real numbers from your own claims.'}</h3>
      </div>
      {value ? (
        <div className="est__carried [display:flex] [flex-direction:column] [gap:0.6rem] [&_small]:[font-size:1.5rem] [&_small]:[opacity:0.8]">
          <b className="est__big [display:block] [margin-top:0.4rem] [font-weight:600] [font-size:4.2rem] [line-height:1] [letter-spacing:-0.12rem] [font-variant-numeric:tabular-nums] [@media(max-width:_1279px)]:[font-size:3.6rem] [.est\_\_head-out_&]:[font-size:5.2rem] [@media(max-width:_640px)]:[.est\_\_head-out_&]:[font-size:4rem]">{amt}</b>
          <small>{rest.join(' · ')}</small>
          <a className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]" href="#" onClick={(e) => { e.preventDefault(); document.querySelector('.calc')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>Adjust the numbers</a>
        </div>
      ) : null}
      <ul className="est__gets [list-style:none] [display:flex] [flex-direction:column] [gap:1.2rem] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:1rem] [&_li]:[font-size:1.6rem]">
        {INCLUDED.map((t) => <li key={t}><Check size={16} strokeWidth={3} />{t}</li>)}
      </ul>
      <p className="est__how [font-size:1.3rem] [line-height:1.55] [color:rgba(255,_255,_255,_0.72)] [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55]">Estimate only. The assessment replaces it with what your claims, denials and A/R aging actually show.</p>
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
  const src = source ?? (typeof window !== 'undefined' ? window.location.pathname : '');
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
    <section className="assess container [padding-inline:var(--gutter)] [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:4.8rem] [padding-top:16rem] [align-items:stretch] [@media(max-width:_1279px)]:[padding-inline:2rem] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[padding-top:8rem] [@media(min-width:_1024px)_and_(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)]! [@media(min-width:_1024px)_and_(max-width:_1279px)]:[gap:3.2rem]" id="assessment">
      <div ref={left} className="assess__left [position:relative]">
        <motion.div className="assess__est [position:sticky] [top:13rem] [border-radius:3.2rem] [background:radial-gradient(120%_80%_at_100%_0%,_#8a6bff_0%,_var(--purple)_45%,_#4b23d6_100%)] [color:#fff] [box-shadow:0_3rem_8rem_rgba(106,_65,_249,_0.3)] [@media(max-width:_1279px)]:[position:relative] [@media(max-width:_1279px)]:[top:0]" initial={{ clipPath: 'inset(12% 12% 12% 12% round 3.2rem)', opacity: 0 }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0% round 3.2rem)', opacity: 1 } : {}} transition={{ duration: 1.4, ease: ease.out }}>
          {calc ? <ServiceEstimator calc={calc} onUse={useEstimate} /> : formFirst ? <Carried value={carried} /> : <Estimator onUse={useEstimate} start={monthly} />}
        </motion.div>
      </div>

      <div className="assess__side [display:flex] [flex-direction:column] [gap:1.2rem] [min-width:0]">
        <Eyebrow>/ Free revenue assessment</Eyebrow>
        <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['See exactly where your', 'revenue is leaking.']} stagger={0.04} />
        <motion.ul className="assess__incl [display:grid] [grid-template-columns:1fr_1fr] [gap:1rem_2.4rem] [margin-top:1.6rem] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:1rem] [&_li]:[font-size:1.6rem] [&_li]:[color:var(--navy)] [&_li_span]:[width:2.6rem] [&_li_span]:[height:2.6rem] [&_li_span]:[border-radius:50%] [&_li_span]:[background:#dcf5ea] [&_li_span]:[color:#12a150] [&_li_span]:[display:grid] [&_li_span]:[place-items:center] [&_li_span]:[flex-shrink:0] [&_svg]:[width:1.6rem] [&_svg]:[height:1.6rem] [@media(max-width:_1279px)]:[grid-template-columns:1fr]" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
          {INCLUDED.map((t) => (
            <motion.li key={t} variants={field}><span><Check /></span>{t}</motion.li>
          ))}
        </motion.ul>

        <motion.form ref={formRef} className="assess__form [margin-top:2rem] [padding:3.2rem] [border-radius:2.4rem] [background:var(--panel)] [display:flex] [flex-direction:column] [gap:2rem] [@media(max-width:_1279px)]:[padding:2.4rem]" onSubmit={submit}
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: ease.out, staggerChildren: 0.06, delayChildren: 0.2 } } }}>
          <motion.div variants={field}>
            <div className="assess__steps [display:flex] [align-items:center] [gap:1.2rem] [margin-bottom:1.6rem] [font-size:1.4rem] [color:#8a8ea0] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.8rem] [&_span]:[white-space:nowrap] [&_span]:[transition:color_0.3s] [&_b]:[display:grid] [&_b]:[place-items:center] [&_b]:[width:2.4rem] [&_b]:[height:2.4rem] [&_b]:[border-radius:50%] [&_b]:[border:1px_solid_#d9d4ee] [&_b]:[background:#fff] [&_b]:[font-size:1.2rem] [&_b]:[font-weight:600] [&_b]:[color:#8a8ea0] [&_b]:[transition:all_0.3s] [&_i]:[flex:1] [&_i]:[height:2px] [&_i]:[border-radius:2px] [&_i]:[background:#e4e0f2] [&_i]:[position:relative] [&_i]:[overflow:hidden] [&_i::after]:[content:''] [&_i::after]:[position:absolute] [&_i::after]:[inset:0] [&_i::after]:[background:var(--purple)] [&_i::after]:[transform:scaleX(0)] [&_i::after]:[transform-origin:left] [&_i::after]:[transition:transform_0.5s_cubic-bezier(.16,1,.3,1)] [@media(max-width:_1279px)]:[font-size:13px]" aria-label={`Step ${step} of 2`}>
              <span className={step >= 1 ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}><b>{step > 1 ? <Check size={12} strokeWidth={3} /> : 1}</b>Your details</span>
              <i className={step > 1 ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} />
              <span className={step >= 2 ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''}><b>2</b>Your practice</span>
            </div>
            <h3 className="assess__title [font-weight:500] [font-size:2.4rem] [color:var(--navy)]">{step === 1 ? 'Request your free assessment' : `Thanks${first ? `, ${first}` : ''}. Two quick questions.`}</h3>
            <p className="assess__fine [margin-top:0.6rem] [font-size:1.5rem] [color:#5b5f72] [@media(max-width:_1279px)]:[font-size:13.5px]! [@media(max-width:_1279px)]:[line-height:1.55]">{step === 1 ? 'Where should a billing specialist reach you? Takes 20 seconds.' : 'This helps us bring the right specialist and real numbers to the call.'}</p>
          </motion.div>
          <AnimatePresence>
            {estimate && (
              <motion.p className="assess__estimate [overflow:hidden] [padding:1.4rem_1.8rem] [border-radius:1.2rem] [background:#ece6ff] [color:var(--navy)] [font-size:1.6rem] [&_b]:[color:var(--purple)] [&_b]:[font-weight:600] [@media(max-width:_1279px)]:[font-size:16px]! [@media(max-width:_1279px)]:[line-height:1.6]" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.6, ease: ease.out }}>
                Your estimate: <b>{estimate}</b>
              </motion.p>
            )}
          </AnimatePresence>
          <input type="hidden" name="estimate" value={estimate} />
          <input type="hidden" name="source" value={src} />
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div key="s1" className="assess__grid [display:grid] [grid-template-columns:1fr_1fr] [gap:1.4rem_1.6rem] [&_label]:[display:flex] [&_label]:[flex-direction:column] [&_label]:[gap:0.6rem] [&_label]:[font-size:1.5rem] [&_label]:[color:var(--navy)] [&_input]:[width:100%] [&_input]:[height:4.6rem] [&_input]:[padding-inline:1.4rem] [&_input]:[border-radius:0.8rem] [&_input]:[border:1px_solid_#e8e5f3] [&_input]:[background:#fff] [&_input]:[font-family:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-style:inherit] [&_input]:[line-height:inherit] [&_input]:[font-size:1.5rem] [&_input]:[color:var(--navy)] [&_input]:[outline:none] [&_input]:[transition:border-color_0.3s,_box-shadow_0.3s] [&_input]:[appearance:none] [&_select]:[width:100%] [&_select]:[height:4.6rem] [&_select]:[padding-inline:1.4rem] [&_select]:[border-radius:0.8rem] [&_select]:[border:1px_solid_#e8e5f3] [&_select]:[background:#fff] [&_select]:[font-family:inherit] [&_select]:[font-weight:inherit] [&_select]:[font-style:inherit] [&_select]:[line-height:inherit] [&_select]:[font-size:1.5rem] [&_select]:[color:var(--navy)] [&_select]:[outline:none] [&_select]:[transition:border-color_0.3s,_box-shadow_0.3s] [&_select]:[appearance:none] [&_input::placeholder]:[color:#a8a6b6] [&_input:focus]:[border-color:var(--purple)] [&_input:focus]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [&_select:focus]:[border-color:var(--purple)] [&_select:focus]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [@media(max-width:_1279px)]:[grid-template-columns:1fr] [@media(max-width:_1279px)]:[&_input]:[font-size:16px] [@media(max-width:_1279px)]:[&_input]:[height:5rem] [@media(max-width:_1279px)]:[&_select]:[font-size:16px] [@media(max-width:_1279px)]:[&_select]:[height:5rem] [@media(max-width:_1279px)]:[&_label]:[font-size:14px] [&_input:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#fff_inset,_0_0_0_0.4rem_rgba(106,_65,_249,_0.12)]!" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4, ease: ease.out }}>
                <label className="span-2 [.assess\_\_grid_&]:[grid-column:span_2] [@media(max-width:_1279px)]:[.assess\_\_grid_&]:[grid-column:auto]">Full name<input id="f-name" name="name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Jane Smith" autoComplete="name" required /></label>
                <label>Phone<input id="f-phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(214) 555-0123" autoComplete="tel" required /></label>
                <label>Work email<input id="f-email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@yourpractice.com" autoComplete="email" required /></label>
              </motion.div>
            ) : (
              <motion.div key="s2" className="assess__grid [display:grid] [grid-template-columns:1fr_1fr] [gap:1.4rem_1.6rem] [&_label]:[display:flex] [&_label]:[flex-direction:column] [&_label]:[gap:0.6rem] [&_label]:[font-size:1.5rem] [&_label]:[color:var(--navy)] [&_input]:[width:100%] [&_input]:[height:4.6rem] [&_input]:[padding-inline:1.4rem] [&_input]:[border-radius:0.8rem] [&_input]:[border:1px_solid_#e8e5f3] [&_input]:[background:#fff] [&_input]:[font-family:inherit] [&_input]:[font-weight:inherit] [&_input]:[font-style:inherit] [&_input]:[line-height:inherit] [&_input]:[font-size:1.5rem] [&_input]:[color:var(--navy)] [&_input]:[outline:none] [&_input]:[transition:border-color_0.3s,_box-shadow_0.3s] [&_input]:[appearance:none] [&_select]:[width:100%] [&_select]:[height:4.6rem] [&_select]:[padding-inline:1.4rem] [&_select]:[border-radius:0.8rem] [&_select]:[border:1px_solid_#e8e5f3] [&_select]:[background:#fff] [&_select]:[font-family:inherit] [&_select]:[font-weight:inherit] [&_select]:[font-style:inherit] [&_select]:[line-height:inherit] [&_select]:[font-size:1.5rem] [&_select]:[color:var(--navy)] [&_select]:[outline:none] [&_select]:[transition:border-color_0.3s,_box-shadow_0.3s] [&_select]:[appearance:none] [&_input::placeholder]:[color:#a8a6b6] [&_input:focus]:[border-color:var(--purple)] [&_input:focus]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [&_select:focus]:[border-color:var(--purple)] [&_select:focus]:[box-shadow:0_0_0_0.4rem_rgba(106,_65,_249,_0.12)] [@media(max-width:_1279px)]:[grid-template-columns:1fr] [@media(max-width:_1279px)]:[&_input]:[font-size:16px] [@media(max-width:_1279px)]:[&_input]:[height:5rem] [@media(max-width:_1279px)]:[&_select]:[font-size:16px] [@media(max-width:_1279px)]:[&_select]:[height:5rem] [@media(max-width:_1279px)]:[&_label]:[font-size:14px] [&_input:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#fff_inset,_0_0_0_0.4rem_rgba(106,_65,_249,_0.12)]!" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.4, ease: ease.out }}>
                <label>Practice name<input id="f-org" name="practice" placeholder="Smith Family Medicine" autoFocus /></label>
                <label>Specialty
                  <span className="select [position:relative] [display:block] [&_select]:[color:#a8a6b6] [&_select:valid]:[color:var(--navy)] [&_svg]:[position:absolute] [&_svg]:[top:50%] [&_svg]:[translate:0_-50%] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[color:var(--purple)] [&_svg]:[pointer-events:none] [&_svg]:[right:2rem]"><select id="f-spec" name="specialty" key={specialty ?? ''} defaultValue={specialty ?? ''}><option value="" disabled>Select specialty</option>{SPECIALTIES.map((x) => <option key={x.slug}>{x.name}</option>)}<option>Multi-specialty group</option><option>Other</option></select><ChevronDown /></span>
                </label>
                <label>Number of providers
                  <span className="select [position:relative] [display:block] [&_select]:[color:#a8a6b6] [&_select:valid]:[color:var(--navy)] [&_svg]:[position:absolute] [&_svg]:[top:50%] [&_svg]:[translate:0_-50%] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[color:var(--purple)] [&_svg]:[pointer-events:none] [&_svg]:[right:2rem]"><select id="f-size" name="providers" defaultValue=""><option value="" disabled>Select one</option><option>Solo (1)</option><option>2–5</option><option>6–20</option><option>21–50</option><option>50+</option></select><ChevronDown /></span>
                </label>
                <label>Monthly collections
                  <span className="select [position:relative] [display:block] [&_select]:[color:#a8a6b6] [&_select:valid]:[color:var(--navy)] [&_svg]:[position:absolute] [&_svg]:[top:50%] [&_svg]:[translate:0_-50%] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[color:var(--purple)] [&_svg]:[pointer-events:none] [&_svg]:[right:2rem]"><select id="f-coll" name="collections" defaultValue=""><option value="" disabled>Select one</option><option>Under $50k</option><option>$50k–$250k</option><option>$250k–$1M</option><option>Over $1M</option></select><ChevronDown /></span>
                </label>
                <label className="span-2 [.assess\_\_grid_&]:[grid-column:span_2] [@media(max-width:_1279px)]:[.assess\_\_grid_&]:[grid-column:auto]">Biggest billing headache
                  <span className="select [position:relative] [display:block] [&_select]:[color:#a8a6b6] [&_select:valid]:[color:var(--navy)] [&_svg]:[position:absolute] [&_svg]:[top:50%] [&_svg]:[translate:0_-50%] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[color:var(--purple)] [&_svg]:[pointer-events:none] [&_svg]:[right:2rem]"><select id="f-prio" name="headache" defaultValue=""><option value="" disabled>Select one</option><option>Too many denials</option><option>Slow payments / high A/R</option><option>Coding accuracy</option><option>Staff stretched thin</option><option>Credentialing delays</option></select><ChevronDown /></span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div variants={field} className="assess__actions [display:flex] [align-items:center] [gap:1.2rem]">
            {step === 2 && !sent && (
              <button type="button" className="assess__back [display:inline-flex] [align-items:center] [gap:0.4rem] [height:5.6rem] [padding-inline:1.6rem_2rem] [border-radius:6rem] [border:1px_solid_#e4e0f2] [background:#fff] [font-size:1.6rem] [font-weight:500] [color:var(--navy)] [transition:border-color_0.3s] [&:hover]:[border-color:var(--purple)]" onClick={() => setStep(1)}><ChevronLeft size={18} />Back</button>
            )}
            <motion.button type="submit" className="btn btn--block [position:relative] [display:inline-flex] [align-items:center] [isolation:isolate] [width:100%] [@media(max-width:_640px)]:[max-width:100%] [.assess\_\_actions_&]:[flex:1] [.eng\_\_cta_&]:[max-width:100%] [@media(max-width:_1279px)]:[.eng\_\_cta_&]:[width:100%] [@media(max-width:_1279px)]:[.eng\_\_cta_&]:[justify-content:center] [.stp-sv\_\_head_&]:[margin-top:0.8rem] [@media(max-width:_640px)]:[.mc\_\_act_&]:[width:100%]" whileHover="hover" whileTap={{ scale: 0.99 }} initial="rest" animate={sent ? 'sent' : 'rest'}>
              <span className="btn__label [position:relative] [z-index:1] [display:inline-flex] [align-items:center] [justify-content:center] [height:5.6rem] [padding-inline:3.2rem] [border-radius:11.7rem] [background:var(--purple)] [color:#fff] [font-weight:500] [font-size:2rem] [line-height:1.4] [white-space:nowrap] [.btn--outline_&]:[background:transparent] [.btn--outline_&]:[color:var(--purple)] [.btn--outline_&]:[box-shadow:inset_0_0_0_1.5px_var(--purple)] [.btn--outline_&]:[transition:background_0.35s,_color_0.35s] [.btn--outline:hover_&]:[background:var(--purple)] [.btn--outline:hover_&]:[color:#fff] [.btn--outline_&]:[height:4.8rem] [.btn--outline_&]:[padding-inline:2.4rem] [.btn--outline_&]:[font-size:1.7rem] [.btn--block_&]:[flex:1] [.btn--block_&]:[overflow:hidden] [@media(max-width:_1279px)]:[.nav_&]:[display:none] [.nav_&]:[height:4.8rem] [.nav_&]:[padding-inline:2.6rem] [.nav_&]:[font-size:1.8rem] [@media(max-width:_640px)]:[height:5.2rem] [@media(max-width:_640px)]:[padding-inline:2.4rem] [@media(max-width:_640px)]:[font-size:1.7rem] [@media(max-width:_640px)]:[min-width:0] [.stp-sv\_\_head_&]:[background:#fff] [.stp-sv\_\_head_&]:[color:var(--purple)] [.mc\_\_act_&]:[background:#fff] [.mc\_\_act_&]:[color:var(--purple)] [@media(max-width:_640px)]:[.mc\_\_act_&]:[flex:1] [@media(max-width:_640px)]:[.mc\_\_act_&]:[min-width:0] [@media(max-width:_640px)]:[.mc\_\_act_&]:[padding-inline:1.8rem] [@media(max-width:_640px)]:[.mc\_\_act_&]:[font-size:1.6rem] [.ar\_\_toc-cta_&]:[height:4.8rem] [.ar\_\_toc-cta_&]:[padding-inline:2rem] [.ar\_\_toc-cta_&]:[font-size:1.6rem]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={sent ? 's' : `n${step}`} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }} transition={{ duration: 0.35, ease: ease.out }}>
                    {sent ? 'Request received. We’ll be in touch.' : step === 1 ? 'Continue' : 'Get my free assessment'}
                  </motion.span>
                </AnimatePresence>
              </span>
              <motion.span className="btn__icon [position:relative] [z-index:1] [display:inline-grid] [place-items:center] [width:5.6rem] [height:5.6rem] [border-radius:50%] [background:var(--purple)] [color:#fff] [&_svg]:[width:2rem] [&_svg]:[height:2rem] [.btn--outline_&]:[background:transparent] [.btn--outline_&]:[color:var(--purple)] [.btn--outline_&]:[box-shadow:inset_0_0_0_1.5px_var(--purple)] [.btn--outline_&]:[transition:background_0.35s,_color_0.35s] [.btn--outline:hover_&]:[background:var(--purple)] [.btn--outline:hover_&]:[color:#fff] [.btn--outline_&]:[width:4.8rem] [.btn--outline_&]:[height:4.8rem] [.nav_&]:[width:4.8rem] [.nav_&]:[height:4.8rem] [@media(max-width:_640px)]:[width:5.2rem] [@media(max-width:_640px)]:[height:5.2rem] [@media(max-width:_480px)]:[.nav_&]:[width:4.2rem]! [@media(max-width:_480px)]:[.nav_&]:[height:4.2rem]! [.stp-sv\_\_head_&]:[background:#fff] [.stp-sv\_\_head_&]:[color:var(--purple)] [.mc\_\_act_&]:[background:#fff] [.mc\_\_act_&]:[color:var(--purple)] [.ar\_\_toc-cta_&]:[width:4.8rem] [.ar\_\_toc-cta_&]:[height:4.8rem]" variants={{ rest: { x: 0, rotate: 0 }, hover: { x: 4, rotate: -45 }, sent: { rotate: 0, backgroundColor: '#12b886' } }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}>
                {sent ? <Check size={20} /> : <Arrow />}
              </motion.span>
            </motion.button>
          </motion.div>
          <motion.div className="assess__trust [display:flex] [flex-wrap:wrap] [gap:1rem_2.8rem] [font-size:1.4rem] [color:#5b5f72] [&_span]:[display:inline-flex] [&_span]:[align-items:center] [&_span]:[gap:0.8rem] [&_svg]:[width:1.8rem] [&_svg]:[height:1.8rem] [&_svg]:[color:var(--purple)]" variants={field}>
            <span><BadgeCheck />Free, no obligation</span>
            <span><ShieldCheck />HIPAA-compliant</span>
            <span><Clock />Takes 2 minutes</span>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
