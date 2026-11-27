'use client';
/**
 * Cardiology page, variation B (unlisted): the folds that differ from the standard specialty template.
 *  1. StudySelector    – pick a study, watch its claim get worked line by line (tabs, auto-advance).
 *  2. SolutionJourney  – sticky headline + a scroll-filled rail; each step drops the artifact it produces,
 *                        then problem → fix rows that strike through and resolve as they enter.
 *  3. EhrFlow          – two drifting logo rows and a live EHR → coders → payer pipe.
 *  4. ServiceBuilder   – toggle the services you need, a receipt builds itself, one CTA to price it.
 * Every fold has a static end state for reduced motion and the site's Pause animations control.
 */
import { AnimatePresence, motion, useInView, useScroll, useSpring, useTransform } from 'motion/react';
import { Activity, ArrowRight, Atom, Check, Gauge, HeartPulse, MonitorSmartphone, Plus, Stethoscope, Waypoints, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button, Eyebrow, SplitWords } from './ui';
import { Link, goAnchor } from '../router';
import { ease } from '../motion';
import { useMotionOff } from '../motionPref';
import { serviceIcon } from '../sections/Nav';
import epic from '../assets/ehr-epic.svg';
import oracle from '../assets/ehr-oracle.png';
import athena from '../assets/ehr-athena.svg';
import ecw from '../assets/ehr-ecw.svg';
import nextgen from '../assets/ehr-nextgen-vector.svg';
import greenway from '../assets/ehr-greenway.png';
import modmed from '../assets/ehr-modmed.svg';
import meditech from '../assets/ehr-meditech.svg';
import advancedmd from '../assets/ehr-advancedmd.svg';
import curemd from '../assets/ehr-curemd.svg';
import practicefusion from '../assets/ehr-practicefusion.svg';
import tebra from '../assets/ehr-tebra.svg';
import veradigm from '../assets/ehr-veradigm.svg';
import drchrono from '../assets/ehr-drchrono.svg';
import gehc from '../assets/ehr-gehealthcare.svg';

type Img = string | { src: string };
const src = (i: Img) => (typeof i === 'string' ? i : i.src);

const SEC = 'container [padding-inline:var(--gutter)] [@media(max-width:_1099px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1099px)]:[padding-top:8rem]';
const H2 = 'h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.06] [letter-spacing:-0.14rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1099px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.2rem]';
const LEAD = '[font-size:max(1.8rem,16px)] [line-height:1.6] [color:#4a4f63]';
const MONO = '[font-family:var(--f-mono)] [font-size:max(1.2rem,12px)] [letter-spacing:0.06em] [text-transform:uppercase]';

/* small ECG-like trace, different rhythm per study */
function tracePath(seed: number, n = 6) {
  let d = 'M0 40', x = 0;
  for (let i = 0; i < n; i++) {
    const a = 14 + ((seed * 7 + i * 13) % 18), w = 60;
    d += ` L${x + 18} 40 L${x + 24} ${40 - a * 0.35} L${x + 28} 40 L${x + 32} ${40 + a * 0.5} L${x + 36} ${40 - a} L${x + 40} ${40 + a * 0.6} L${x + 44} 40 L${x + w} 40`;
    x += w;
  }
  return { d, w: x };
}

/* 1. Specialized cardiology billing services: study selector ------------------------------ */
type Study = { icon: ReactNode; t: string; d: string; lines: [string, string, string][]; risk: string; cta: string };
const STUDIES: Study[] = [
  { icon: <Stethoscope />, t: 'Office visits and consults', d: 'E/M levels supported by the note, and modifier 25 only when a visit is truly separate from the test done the same day.',
    lines: [['99214', 'Established visit, moderate MDM', 'MDM supports level'], ['93000', '12-lead ECG, same day', 'Separate service'], ['-25', 'Modifier on the visit', 'Note supports it']], risk: 'Modifier 25 added by habit, then recouped on audit.', cta: 'Check my visit coding' },
  { icon: <Activity />, t: 'Echocardiography', d: 'Complete, limited and stress echo billed to the study actually performed, with the Doppler and contrast add-ons that apply.',
    lines: [['93306', 'TTE complete with Doppler', 'Auth on file'], ['Q9957', 'Contrast agent, per mL', 'Add-on captured'], ['I50.32', 'Chronic diastolic heart failure', 'Meets LCD']], risk: 'Echo denied for no auth, or billed complete when it was limited.', cta: 'Check my echo claims' },
  { icon: <Atom />, t: 'Nuclear cardiology', d: 'SPECT and PET perfusion studies billed with the stress test and the radiopharmaceutical, so no part of the study goes unpaid.',
    lines: [['78452', 'SPECT MPI, rest and stress', 'Auth on file'], ['93015', 'Stress test, global', 'Bundled check passed'], ['A9500', 'Tc-99m sestamibi, per dose', 'Add-on captured']], risk: 'The isotope or the stress test left off the claim.', cta: 'Check my nuclear claims' },
  { icon: <Gauge />, t: 'Stress testing', d: 'Supervision, interpretation and tracing split correctly between the physician and the facility.',
    lines: [['93016', 'Supervision only', 'Hospital site'], ['93018', 'Interpretation and report', 'Physician read'], ['R07.89', 'Other chest pain', 'Meets LCD']], risk: 'Global 93015 billed when the hospital owns the treadmill.', cta: 'Check my stress tests' },
  { icon: <HeartPulse />, t: 'Cardiac cath and PCI', d: 'Diagnostic caths, stents and same-day diagnostic-to-PCI cases coded against NCCI bundling edits and the cath report.',
    lines: [['93458', 'Left heart cath, angiography', 'Report matched'], ['92928', 'Stent, single major vessel', 'LD applied'], ['-XU', 'Diagnostic cath, separate', 'No prior study']], risk: 'Diagnostic cath bundled into the PCI and lost.', cta: 'Check my cath lab claims' },
  { icon: <Zap />, t: 'Electrophysiology and devices', d: 'Pacemaker and ICD implants, device checks and remote monitoring periods billed on the right dates.',
    lines: [['33249', 'ICD insertion, transvenous', 'Auth on file'], ['93295', 'ICD remote review, 90 days', 'Period tracked'], ['93296', 'Remote technical service', 'Not duplicated']], risk: 'In-office check billed inside an open remote period.', cta: 'Check my device billing' },
  { icon: <Activity />, t: 'ECG and rhythm monitoring', d: 'Office ECGs, Holters and extended patch monitors billed for the component you performed: global, read-only or tracing.',
    lines: [['93010', 'ECG interpretation only', 'Pro component'], ['93224', 'Holter, up to 48 hours', 'Global'], ['93241', 'Patch monitor, 48h–7d', 'Days matched']], risk: 'Global ECG billed for a hospital tracing you only read.', cta: 'Check my ECG billing' },
  { icon: <Waypoints />, t: 'Vascular and peripheral', d: 'Carotid and arterial duplex studies and peripheral interventions linked to the diagnosis each payer’s LCD requires.',
    lines: [['93880', 'Carotid duplex, bilateral', 'Meets LCD'], ['93922', 'ABI, limited bilateral', 'Frequency OK'], ['37226', 'Fem-pop stent', 'Auth on file']], risk: 'Duplex denied as not medically necessary.', cta: 'Check my vascular claims' },
  { icon: <MonitorSmartphone />, t: 'Telehealth and remote monitoring', d: 'Video visits with the right place of service, and RPM device and management time tracked month by month.',
    lines: [['99213', 'Video visit, POS 10', 'Modifier 95'], ['99454', 'RPM device supply', '16 days logged'], ['99457', 'RPM management, 20 min', 'Time logged']], risk: 'RPM billed in a month without enough device days.', cta: 'Check my telehealth billing' },
];

function StudyCard({ x, i, play }: { x: Study; i: number; play: boolean }) {
  const off = useMotionOff();
  const { d, w } = tracePath(i + 3);
  const [step, setStep] = useState(off ? 3 : 0);
  useEffect(() => {
    if (off || !play) { setStep(3); return; }
    setStep(0);
    const t = [0, 1, 2].map((k) => setTimeout(() => setStep(k + 1), 700 + k * 650));
    return () => t.forEach(clearTimeout);
  }, [x, play, off]);
  return (
    <div className="cvs-card [position:relative] [padding:3.2rem] [border-radius:3.2rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_-2rem_rgba(57,_28,_160,_0.22)] [@media(max-width:_1099px)]:[padding:2.4rem_2rem] [@media(max-width:_1099px)]:[border-radius:2.4rem]">
      <div className="[display:flex] [align-items:center] [justify-content:space-between] [gap:1.2rem]">
        <span className={`${MONO} [color:#646776]`}>Claim · {x.t}</span>
        <span className={`${MONO} [display:inline-flex] [align-items:center] [gap:0.6rem] [padding:0.5rem_1rem] [border-radius:99rem] [transition:background_0.4s,_color_0.4s] ${step >= 3 ? '[background:#e7f6ee] [color:#13734a]' : '[background:#f3f0ff] [color:var(--purple)]'}`}>
          {step >= 3 ? <><Check size={13} strokeWidth={3} aria-hidden /> Ready to submit</> : 'Checking'}
        </span>
      </div>
      <div className="[position:relative] [height:8rem] [margin:2rem_-0.4rem_1.2rem] [border-radius:1.6rem] [background-color:#faf9ff] [background-image:linear-gradient(#efebfd_1px,_transparent_1px),linear-gradient(90deg,_#efebfd_1px,_transparent_1px)] [background-size:2rem_2rem] [overflow:hidden]" aria-hidden>
        <svg viewBox={`0 0 ${w} 80`} preserveAspectRatio="none" className="[position:absolute] [inset:0] [width:100%] [height:100%]">
          <path d={d} fill="none" stroke="#e3dcff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <motion.svg key={x.t + String(play)} viewBox={`0 0 ${w} 80`} preserveAspectRatio="none" className="[position:absolute] [inset:0] [width:100%] [height:100%]"
          initial={{ clipPath: off ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: off ? 0 : 2.2, ease: 'linear' }}>
          <path d={d} fill="none" stroke="#6a41f9" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </motion.svg>
      </div>
      <ul className="[display:flex] [flex-direction:column]">
        {x.lines.map(([code, label, ok], k) => {
          const on = step > k;
          return (
            <li key={code} className="[display:grid] [grid-template-columns:7.2rem_minmax(0,_1fr)_auto] [gap:1.2rem] [align-items:center] [padding:1.4rem_0] [border-bottom:1px_solid_#f0ecfb] [&:last-child]:[border-bottom:0] [@media(max-width:_640px)]:[grid-template-columns:6.4rem_minmax(0,_1fr)] [@media(max-width:_640px)]:[row-gap:0.6rem]">
              <code className="[font-family:var(--f-mono)] [font-size:max(1.5rem,14px)] [color:var(--ink-2)] [font-weight:500]">{code}</code>
              <span className="[font-size:max(1.6rem,15px)] [color:#4a4f63] [min-width:0]">{label}</span>
              <span className={`${MONO} [justify-self:end] [display:inline-flex] [align-items:center] [gap:0.5rem] [white-space:nowrap] [transition:color_0.35s,_opacity_0.35s] [@media(max-width:_640px)]:[grid-column:2] [@media(max-width:_640px)]:[justify-self:start] ${on ? '[color:#13734a]' : '[color:#a3a0b5]'}`}>
                {on ? <Check size={13} strokeWidth={3} aria-hidden /> : <span aria-hidden className="[width:0.7rem] [height:0.7rem] [border-radius:50%] [background:currentColor] animate-pulse" />}{on ? ok : 'In review'}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="[display:flex] [align-items:flex-start] [gap:1rem] [margin-top:2rem] [padding:1.4rem_1.6rem] [border-radius:1.6rem] [background:#fff6f7] [color:#9b1c33] [font-size:max(1.5rem,14px)] [line-height:1.5]">
        <X size={16} strokeWidth={2.6} aria-hidden className="[flex:none] [margin-top:0.3rem]" /><span><b className="[font-weight:500]">The denial we prevent: </b>{x.risk}</span>
      </div>
    </div>
  );
}

export function StudySelector() {
  const off = useMotionOff();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [k, setK] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (off || hold || !inView) return;
    const id = setTimeout(() => setK((v) => (v + 1) % STUDIES.length), 6500);
    return () => clearTimeout(id);
  }, [k, off, hold, inView]);
  const pick = (i: number) => { setK(i); setHold(true); };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!n) return;
    e.preventDefault();
    const j = (i + n + STUDIES.length) % STUDIES.length;
    pick(j);
    document.getElementById(`cvs-tab-${j}`)?.focus();
  };
  return (
    <section ref={ref} className={`cvs ${SEC}`} id="cardiology-services" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocusCapture={() => setHold(true)}>
      <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:1.6rem] [text-align:center]">
        <Eyebrow>/ Specialized cardiology billing services</Eyebrow>
        <SplitWords className={H2} lines={['Every cardiology study,', 'billed the way it pays.']} stagger={0.04} />
        <p className={`${LEAD} [max-width:64rem]`}>Cardiology billing is the coding and claim work for every study a heart practice performs. Each study has its own codes, component rules and prior auth needs. Pick one and watch how we work the claim.</p>
      </div>
      <div className="cvs__grid [display:grid] [grid-template-columns:minmax(0,_0.85fr)_minmax(0,_1.15fr)] [gap:4.8rem] [margin-top:5.6rem] [align-items:start] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:2.4rem] [@media(max-width:_1099px)]:[margin-top:3.2rem]">
        <div role="tablist" aria-label="Cardiology services" aria-orientation="vertical" className="cvs__tabs [display:flex] [flex-direction:column] [@media(max-width:_1099px)]:[flex-direction:row] [@media(max-width:_1099px)]:[overflow-x:auto] [@media(max-width:_1099px)]:[gap:0.8rem] [@media(max-width:_1099px)]:[margin-inline:-2rem] [@media(max-width:_1099px)]:[padding:0.4rem_2rem] [@media(max-width:_1099px)]:[scrollbar-width:none] [@media(max-width:_1099px)]:[&::-webkit-scrollbar]:[display:none]">
          {STUDIES.map((x, i) => {
            const on = i === k;
            return (
              <button key={x.t} id={`cvs-tab-${i}`} role="tab" type="button" aria-selected={on} aria-controls={`cvs-panel-${i}`} tabIndex={on ? 0 : -1}
                onClick={() => pick(i)} onKeyDown={(e) => onKey(e, i)}
                className={`cvs__tab [position:relative] [display:flex] [align-items:center] [gap:1.6rem] [width:100%] [padding:1.6rem_0] [border-bottom:1px_solid_#ece8fa] [text-align:left] [transition:color_0.3s] [&:hover]:[color:var(--ink-2)] [@media(max-width:_1099px)]:[width:auto] [@media(max-width:_1099px)]:[flex:none] [@media(max-width:_1099px)]:[padding:1rem_1.6rem] [@media(max-width:_1099px)]:[border:1px_solid_#e4e0f2] [@media(max-width:_1099px)]:[border-radius:99rem] [@media(max-width:_1099px)]:[gap:0.8rem] ${on ? '[color:var(--ink-2)] [@media(max-width:_1099px)]:[background:var(--purple)] [@media(max-width:_1099px)]:[color:#fff] [@media(max-width:_1099px)]:[border-color:var(--purple)]' : '[color:#646776] [@media(max-width:_1099px)]:[background:#fff] [@media(max-width:_1099px)]:[color:var(--ink-2)]'}`}>
                <span aria-hidden className={`[flex:none] [display:grid] [place-items:center] [width:4.4rem] [height:4.4rem] [border-radius:1.2rem] [transition:background_0.35s,_color_0.35s] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [&_svg]:[stroke-width:1.8] ${on ? '[background:var(--purple)] [color:#fff]' : '[background:#f3f0ff] [color:var(--purple)]'} [@media(max-width:_1099px)]:[display:none]`}>{x.icon}</span>
                <span className="[font-size:max(2rem,16px)] [font-weight:500] [@media(max-width:_1099px)]:[font-size:15px] [@media(max-width:_1099px)]:[white-space:nowrap]">{x.t}</span>
                <span aria-hidden className="[margin-left:auto] [@media(max-width:_1099px)]:[display:none]"><ArrowRight size={18} className={`[transition:transform_0.3s,_opacity_0.3s] ${on ? '[opacity:1] [color:var(--purple)]' : '[opacity:0] [transform:translateX(-0.6rem)]'}`} /></span>
                {on && !off && !hold && <motion.span key={k} aria-hidden className="[position:absolute] [left:0] [bottom:-1px] [height:2px] [background:var(--purple)] [@media(max-width:_1099px)]:[display:none]" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 6.5, ease: 'linear' }} />}
              </button>
            );
          })}
        </div>
        <div className="cvs__stage [position:relative] [@media(min-width:_1100px)]:[position:sticky] [@media(min-width:_1100px)]:[top:12rem]">
          {STUDIES.map((x, i) => (
            <div key={x.t} id={`cvs-panel-${i}`} role="tabpanel" aria-labelledby={`cvs-tab-${i}`} hidden={i !== k} tabIndex={0}>
              {i === k && (
                <motion.div initial={off ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: ease.out }}>
                  <h3 className="[font-size:max(2.8rem,22px)] [font-weight:500] [letter-spacing:-0.05rem] [color:var(--ink-2)]">{x.t} billing</h3>
                  <p className={`${LEAD} [margin-top:0.8rem] [margin-bottom:2.4rem]`}>{x.d}</p>
                  <StudyCard x={x} i={i} play={inView} />
                  <div className="[display:flex] [align-items:center] [gap:2rem] [flex-wrap:wrap] [margin-top:2.4rem]">
                    <Button>{x.cta}</Button>
                    <span className="[font-size:max(1.5rem,14px)] [color:#646776]">Free review of one month of claims.</span>
                  </div>
                </motion.div>
              )}
              {i !== k && <><h3>{x.t} billing</h3><p>{x.d}</p></>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 2. Our solution: scroll-filled journey + problem → fix ------------------------------------ */
const STEPS: { t: string; d: string; art: string[] }[] = [
  { t: 'Verify and authorize', d: 'Eligibility checked before every visit. Prior auths for echo, nuclear, cath and device work requested when the study is scheduled and tracked to the payer’s deadline.', art: ['Eligibility · active', 'Auth A-55821 · approved'] },
  { t: 'Capture every charge', d: 'Charges built from the cath, echo and device reports, so add-ons, contrast and radiopharmaceuticals are never left off.', art: ['+ Q9957 contrast', '+ A9500 isotope'] },
  { t: 'Code to the component', d: 'Certified cardiology coders set modifier 26 or TC by site of service, check NCCI edits and link each code to an LCD-approved diagnosis.', art: ['93306-26', 'NCCI · passed', 'I50.32 · meets LCD'] },
  { t: 'Scrub and submit same day', d: 'Every claim is checked against the payer’s rules and sent the day it is ready.', art: ['0 scrubber errors', 'Sent 4:12 PM'] },
  { t: 'Work denials and A/R', d: 'Imaging and device denials appealed with the records the payer asks for; aged claims chased until they pay or close.', art: ['CO-197 · appealed', 'Paid in 21 days'] },
  { t: 'Report every month', d: 'Denial rate, days in A/R and collections by study type, reviewed with you on a call.', art: ['Denials 4.1%', 'A/R 32 days'] },
];
const FIXES: [string, string][] = [
  ['Global billed when only the read was done', 'Modifier 26 or TC set by place of service before the claim goes out.'],
  ['Nuclear and echo denied for no prior auth', 'Auth requested at scheduling and the number checked on the claim.'],
  ['Diagnostic cath lost inside a same-day PCI', 'Billed separately when the note shows no prior study or a changed condition.'],
  ['Device checks billed in an open remote period', 'Each patient’s 90-day period tracked so checks aren’t denied as duplicates.'],
  ['Imaging denied as not medically necessary', 'ICD-10 codes matched to the payer’s LCD before submission.'],
];

function Step({ s, i }: { s: (typeof STEPS)[number]; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const on = useInView(ref, { margin: '0px 0px -45% 0px' });
  const off = useMotionOff();
  const lit = on || off;
  return (
    <li ref={ref} className="cvj__step [position:relative] [display:grid] [grid-template-columns:5.6rem_minmax(0,_1fr)] [gap:2.4rem] [padding-bottom:5.6rem] [&:last-child]:[padding-bottom:0] [@media(max-width:_640px)]:[grid-template-columns:4.4rem_minmax(0,_1fr)] [@media(max-width:_640px)]:[gap:1.6rem] [@media(max-width:_640px)]:[padding-bottom:4rem]">
      <span aria-hidden className={`[position:relative] [z-index:1] [display:grid] [place-items:center] [width:5.6rem] [height:5.6rem] [border-radius:50%] [font-family:var(--f-mono)] [font-size:max(1.5rem,14px)] [transition:background_0.5s,_color_0.5s,_box-shadow_0.5s,_border-color_0.5s] [border:1.5px_solid] [@media(max-width:_640px)]:[width:4.4rem] [@media(max-width:_640px)]:[height:4.4rem] ${lit ? '[background:var(--purple)] [color:#fff] [border-color:var(--purple)] [box-shadow:0_0_0_0.8rem_rgba(106,65,249,0.12)]' : '[background:#fff] [color:#8b88a0] [border-color:#e0dbf3]'}`}>{String(i + 1).padStart(2, '0')}</span>
      <div className="[padding-top:0.8rem]">
        <h3 className={`[font-size:max(2.6rem,20px)] [font-weight:500] [letter-spacing:-0.04rem] [transition:color_0.5s] ${lit ? '[color:var(--ink-2)]' : '[color:#9a97ad]'}`}>{s.t}</h3>
        <p className="[margin-top:0.8rem] [font-size:max(1.7rem,16px)] [line-height:1.6] [color:#4a4f63] [max-width:52rem]">{s.d}</p>
        <ul className="[display:flex] [flex-wrap:wrap] [gap:0.8rem] [margin-top:1.6rem]" aria-label={`Example output: ${s.t}`}>
          {s.art.map((a, k) => (
            <motion.li key={a} initial={off ? false : { opacity: 0, y: 10, scale: 0.94 }} animate={lit ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 10, scale: 0.94 }} transition={{ duration: 0.45, ease: ease.out, delay: 0.15 + k * 0.12 }}
              className={`${MONO} [display:inline-flex] [align-items:center] [gap:0.6rem] [padding:0.8rem_1.2rem] [border-radius:1rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_1rem_2.4rem_-1rem_rgba(57,_28,_160,_0.25)] [color:var(--ink-2)] [text-transform:none]! [letter-spacing:0]!`}>
              <Check size={13} strokeWidth={3} className="[color:#13a35f]" aria-hidden />{a}
            </motion.li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function FixRow({ p, f, i }: { p: string; f: string; i: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  const off = useMotionOff();
  const done = seen || off;
  return (
    <li ref={ref} className="cvf__row [display:grid] [grid-template-columns:minmax(0,_1fr)_6.4rem_minmax(0,_1fr)] [align-items:center] [gap:1.6rem] [padding:2.4rem_0] [border-top:1px_solid_#ebe6fb] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[gap:1rem] [@media(max-width:_767px)]:[padding:2rem_0]">
      <p className="[display:flex] [gap:1.2rem] [align-items:flex-start] [font-size:max(1.8rem,16px)] [line-height:1.5] [color:#9b1c33]">
        <X size={18} strokeWidth={2.6} aria-hidden className="[flex:none] [margin-top:0.3rem]" />
        <span><motion.span className="[background-image:linear-gradient(#e8a3ae,#e8a3ae)] [box-decoration-break:slice] [background-repeat:no-repeat] [background-position:0_58%]" initial={off ? false : { backgroundSize: '0% 2px' }} animate={{ backgroundSize: done ? '100% 2px' : '0% 2px' }} transition={{ duration: 0.7, ease: ease.out, delay: 0.1 + i * 0.05 }}><span className="sr-only">Problem: </span>{p}</motion.span></span>
      </p>
      <svg viewBox="0 0 64 12" aria-hidden className="[width:6.4rem] [height:1.2rem] [@media(max-width:_767px)]:[display:none]">
        <motion.path d="M2 6 H58 M52 1 L58 6 L52 11" fill="none" stroke="#6a41f9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" initial={off ? false : { pathLength: 0 }} animate={{ pathLength: done ? 1 : 0 }} transition={{ duration: 0.5, delay: 0.5 }} />
      </svg>
      <motion.p className="[display:flex] [gap:1.2rem] [align-items:flex-start] [font-size:max(1.8rem,16px)] [line-height:1.5] [color:var(--ink-2)]" initial={off ? false : { opacity: 0, x: -12 }} animate={done ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }} transition={{ duration: 0.55, ease: ease.out, delay: 0.75 }}>
        <span aria-hidden className="[flex:none] [display:grid] [place-items:center] [width:2.4rem] [height:2.4rem] [margin-top:0.1rem] [border-radius:50%] [background:#13a35f] [color:#fff]"><Check size={13} strokeWidth={3} /></span>
        <span><span className="sr-only">How we fix it: </span>{f}</span>
      </motion.p>
    </li>
  );
}

export function SolutionJourney() {
  const ref = useRef<HTMLOListElement>(null);
  const off = useMotionOff();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const h = useTransform(fill, (v) => `${Math.round(v * 1000) / 10}%`);
  return (
    <section className={`cvj ${SEC}`} id="our-solution">
      <div className="cvj__grid [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:8rem] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:4rem]">
        <div className="cvj__side [align-self:start] [@media(min-width:_1100px)]:[position:sticky] [@media(min-width:_1100px)]:[top:14rem] [display:flex] [flex-direction:column] [gap:2rem]">
          <Eyebrow>/ Our solution</Eyebrow>
          <SplitWords className={H2} lines={['Our cardiology billing', 'and coding solution.']} stagger={0.04} />
          <p className={`${LEAD} [max-width:46rem]`}>One US-based team runs the whole cycle inside your EHR. Scroll the path one cardiology claim takes, from the eligibility check to the monthly report.</p>
          <p className={`${MONO} [color:#8b88a0]`}>Chips show an illustrative claim</p>
          <dl className="[display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:1.6rem] [padding-top:2.4rem] [border-top:1px_solid_#ebe6fb] [&_dt]:[font-size:max(1.4rem,14px)] [&_dt]:[color:#646776] [&_dt]:[line-height:1.4] [&_dd]:[font-size:3.6rem] [&_dd]:[font-weight:500] [&_dd]:[letter-spacing:-0.08rem] [&_dd]:[color:var(--ink-2)] [&_dd]:[line-height:1.1] [&_dd]:[margin-bottom:0.6rem] [@media(max-width:_640px)]:[&_dd]:[font-size:2.8rem] [&_div]:[display:flex] [&_div]:[flex-direction:column-reverse]">
            <div><dt>Claims sent the day they’re ready</dt><dd>Same day</dd></div>
            <div><dt>CMS prior auth clock, urgent requests</dt><dd>72 hr</dd></div>
            <div><dt>Accountable team for the whole cycle</dt><dd>1 team</dd></div>
          </dl>
          <div className="[margin-top:0.8rem]"><Button>Get a free revenue assessment</Button></div>
        </div>
        <ol ref={ref} className="cvj__rail [position:relative]">
          <span aria-hidden className="[position:absolute] [left:2.8rem] [top:2.8rem] [bottom:2.8rem] [width:2px] [translate:-50%_0] [background:#ece8fa] [@media(max-width:_640px)]:[left:2.2rem]">
            <motion.span className="[position:absolute] [inset:0_0_auto_0] [background:linear-gradient(180deg,_#8060ff,_#6a41f9)] [border-radius:2px]" style={{ height: off ? '100%' : h }} />
          </span>
          {STEPS.map((s, i) => <Step key={s.t} s={s} i={i} />)}
        </ol>
      </div>
      <div className="cvf [margin-top:12rem] [@media(max-width:_1099px)]:[margin-top:7.2rem]">
        <div className="[display:flex] [justify-content:space-between] [align-items:end] [gap:2.4rem] [flex-wrap:wrap] [margin-bottom:2.4rem]">
          <h3 className="[font-size:max(3.2rem,24px)] [font-weight:500] [letter-spacing:-0.06rem] [color:var(--ink-2)] [max-width:60rem] [text-wrap:balance]">Common cardiology billing problems, and how we fix each one.</h3>
          <p className={`${MONO} [color:#646776]`}>Problem <span aria-hidden>→</span> Fix</p>
        </div>
        <ul>{FIXES.map(([p, f], i) => <FixRow key={p} p={p} f={f} i={i} />)}</ul>
      </div>
    </section>
  );
}

/* 3. EHR / EMR: drifting logo rows + a live pipe ----------------------------------------------- */
const EHRS: [Img, string, number][] = [
  [epic, 'Epic', 7.2], [oracle, 'Oracle Health', 9.6], [athena, 'athenahealth', 15], [ecw, 'eClinicalWorks', 15], [nextgen, 'NextGen Healthcare', 10],
  [greenway, 'Greenway Health', 11], [modmed, 'ModMed', 12], [meditech, 'MEDITECH', 13], [advancedmd, 'AdvancedMD', 15], [curemd, 'CureMD', 11.5],
  [practicefusion, 'Practice Fusion', 16], [tebra, 'Tebra', 10], [veradigm, 'Veradigm', 13], [drchrono, 'DrChrono', 11], [gehc, 'GE HealthCare', 15],
];

function LogoRow({ items, dir, still }: { items: typeof EHRS; dir: 1 | -1; still: boolean }) {
  const pill = (img: Img, name: string, w: number, hide?: boolean) => (
    <li key={name + (hide ? '-b' : '')} aria-hidden={hide || undefined} className="[flex:none] [display:grid] [place-items:center] [height:8.8rem] [padding:0_3.2rem] [border-radius:99rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_1.2rem_3rem_-1.6rem_rgba(57,_28,_160,_0.25)] [@media(max-width:_1099px)]:[height:68px] [@media(max-width:_1099px)]:[padding:0_22px]">
      <img src={src(img)} alt={hide ? '' : name} loading="lazy" decoding="async" style={{ width: `${w}rem` }} className="[max-height:4rem] [object-fit:contain] [@media(max-width:_1099px)]:[max-height:30px]" />
    </li>
  );
  if (still) return <ul className="[display:flex] [flex-wrap:wrap] [justify-content:center] [gap:1.2rem]">{items.map(([i, n, w]) => pill(i, n, w))}</ul>;
  return (
    <div className="[overflow:hidden] [mask-image:linear-gradient(90deg,_transparent,_#000_10%,_#000_90%,_transparent)]">
      <ul className={`cve__row [display:flex] [gap:1.6rem] [width:max-content] [padding-block:1.6rem] [animation:${dir > 0 ? 'cveL' : 'cveR'}_48s_linear_infinite] [&:hover]:[animation-play-state:paused]`}>
        {items.map(([i, n, w]) => pill(i, n, w))}
        {items.map(([i, n, w]) => pill(i, n, w, true))}
      </ul>
    </div>
  );
}

export function EhrFlow() {
  const off = useMotionOff();
  const a = EHRS.slice(0, 8), b = EHRS.slice(8);
  const node = (k: string, t: string, d: string, main?: boolean) => (
    <div className={`[position:relative] [z-index:1] [display:flex] [flex-direction:column] [gap:0.4rem] [padding:2rem_2.4rem] [border-radius:2rem] [text-align:left] ${main ? '[background:linear-gradient(180deg,_#8060ff,_#6a41f9)] [color:#fff] [box-shadow:0_2rem_5rem_-1.6rem_rgba(106,65,249,0.55)]' : '[background:#fff] [border:1px_solid_#ece8fa] [color:var(--ink-2)]'}`}>
      <span className={`${MONO} ${main ? '[color:#e7e0ff]' : '[color:var(--purple)]'}`}>{k}</span>
      <b className="[font-weight:500] [font-size:max(2rem,17px)]">{t}</b>
      <span className={`[font-size:max(1.5rem,14px)] [line-height:1.45] ${main ? '[color:#efeaff]' : '[color:#4a4f63]'}`}>{d}</span>
    </div>
  );
  const pipe = (
    <div aria-hidden className="[position:relative] [height:2px] [background:repeating-linear-gradient(90deg,_#cfc5f7_0_6px,_transparent_6px_12px)] [@media(max-width:_767px)]:[height:3.2rem] [@media(max-width:_767px)]:[width:2px] [@media(max-width:_767px)]:[justify-self:center] [@media(max-width:_767px)]:[background:repeating-linear-gradient(180deg,_#cfc5f7_0_6px,_transparent_6px_12px)]">
      {!off && <span className="[position:absolute] [top:50%] [left:0] [width:1rem] [height:1rem] [margin-top:-0.5rem] [border-radius:50%] [background:var(--purple)] [box-shadow:0_0_0_0.5rem_rgba(106,65,249,0.18)] [animation:cvePulse_2.4s_ease-in-out_infinite] [@media(max-width:_767px)]:[left:50%] [@media(max-width:_767px)]:[margin-left:-0.5rem] [@media(max-width:_767px)]:[animation-name:cvePulseV]" />}
    </div>
  );
  return (
    <section className={`cve [padding-top:14rem] [@media(max-width:_1099px)]:[padding-top:8rem] [overflow:hidden]`} id="ehr">
      <style>{`@keyframes cveL{to{transform:translateX(calc(-50% - 0.8rem))}}@keyframes cveR{from{transform:translateX(calc(-50% - 0.8rem))}to{transform:translateX(0)}}@keyframes cvePulse{0%{left:0;opacity:0}15%{opacity:1}85%{opacity:1}100%{left:100%;opacity:0}}@keyframes cvePulseV{0%{top:0;opacity:0}15%{opacity:1}85%{opacity:1}100%{top:100%;opacity:0}}`}</style>
      <div className="container [padding-inline:var(--gutter)] [@media(max-width:_1099px)]:[padding-inline:2rem] [display:flex] [flex-direction:column] [align-items:center] [gap:1.6rem] [text-align:center]">
        <Eyebrow>/ EHR and EMR systems</Eyebrow>
        <SplitWords className={H2} lines={['Works inside the EHR', 'your cardiologists use.']} stagger={0.04} />
        <p className={`${LEAD} [max-width:62rem]`}>No new software for your staff. We bill from your EHR and practice management system, including the cardiology modules for echo, cath and device reporting, and map access with you before anything changes.</p>
      </div>
      <div className="cve__logos [margin-top:4.8rem] [display:flex] [flex-direction:column] [@media(max-width:_1099px)]:[margin-top:3.2rem]" role="group" aria-label="EHR and practice management systems we work in">
        {off ? <div className="container [padding-inline:var(--gutter)] [@media(max-width:_1099px)]:[padding-inline:2rem]"><LogoRow items={EHRS} dir={1} still /></div> : <><LogoRow items={a} dir={1} still={false} /><LogoRow items={b} dir={-1} still={false} /></>}
      </div>
      <div className="container [padding-inline:var(--gutter)] [@media(max-width:_1099px)]:[padding-inline:2rem]">
        <div className="cve__pipe [display:grid] [grid-template-columns:minmax(0,_1fr)_8rem_minmax(0,_1.1fr)_8rem_minmax(0,_1fr)] [align-items:center] [margin-top:4.8rem] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)_4rem_minmax(0,_1.1fr)_4rem_minmax(0,_1fr)] [@media(max-width:_767px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_767px)]:[margin-top:3.2rem]">
          {node('Your system', 'Your EHR and PM', 'Charts, reports and schedules stay where they are.')}
          {pipe}
          {node('Affinity Core', 'Cardiology coders and billers', 'Work in your system with role-based access and a signed BAA.', true)}
          {pipe}
          {node('Out to payers', 'Clearinghouse and portals', 'Claims, auths and appeals sent and tracked to paid.')}
        </div>
        <p className="[margin-top:3.2rem] [text-align:center] [font-size:max(1.6rem,16px)] [color:#4a4f63]">Don’t see your system? We work in most EHR and PM systems. <Link to="/contact" className="[color:var(--purple)] [font-weight:500] [text-decoration:underline] [text-underline-offset:0.3rem]">Ask about yours</Link></p>
      </div>
    </section>
  );
}

/* 4. Related medical billing services: build-your-team --------------------------------------------- */
const RELATED: { name: string; to: string; d: string; adds: string }[] = [
  { name: 'Medical Coding', to: '/services/medical-coding', d: 'Certified coders for echo, nuclear, cath and EP studies.', adds: 'Coding to the component, NCCI and LCD checks' },
  { name: 'Denial Management', to: '/services/denial-management', d: 'Imaging and device denials worked by reason code and appealed.', adds: 'Appeals with records, root-cause fixes' },
  { name: 'Credentialing & Enrollment', to: '/services/credentialing', d: 'New cardiologists enrolled with Medicare and commercial payers before day one.', adds: 'Payer enrollment, CAQH, revalidation' },
  { name: 'A/R Recovery', to: '/services/ar-recovery', d: 'Aged cardiology claims chased until they pay or close.', adds: 'Aged-claim follow-up, timely-filing watch' },
  { name: 'Medical Billing Audits', to: '/services/medical-billing-audits', d: 'A review of your cardiology claims to find where revenue leaks.', adds: 'Coding and modifier audit with a findings report' },
  { name: 'Revenue Cycle Management', to: '/services/revenue-cycle-management', d: 'The whole cycle run by one accountable team.', adds: 'Eligibility to monthly report, end to end' },
];

export function ServiceBuilder() {
  const off = useMotionOff();
  const [sel, setSel] = useState<string[]>(['Medical Coding', 'Denial Management']);
  const toggle = (n: string) => setSel((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));
  const go = () => {
    try { sessionStorage.setItem('ac_services', JSON.stringify(sel)); } catch { /* storage may be off */ }
    goAnchor('assessment');
  };
  const picked = RELATED.filter((r) => sel.includes(r.name));
  return (
    <section className={`cvb ${SEC}`} id="related-services">
      <div className="cvb__grid [display:grid] [grid-template-columns:minmax(0,_1.15fr)_minmax(0,_0.85fr)] [gap:4.8rem] [align-items:start] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:3.2rem]">
        <div>
          <Eyebrow>/ Related medical billing services</Eyebrow>
          <SplitWords className={`${H2} [margin-top:1.6rem]`} lines={['Related medical billing', 'services for cardiology.']} stagger={0.04} />
          <p className={`${LEAD} [margin-top:1.6rem] [max-width:56rem]`}>Use the full cycle or only the part you need. Pick the services your practice wants help with and we’ll price exactly that.</p>
          <ul className="cvb__list [margin-top:3.2rem] [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.2rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
            {RELATED.map((r) => {
              const on = sel.includes(r.name);
              return (
                <li key={r.name} className={`[position:relative] [display:flex] [flex-direction:column] [gap:1rem] [padding:2.4rem] [border-radius:2.4rem] [transition:border-color_0.3s,_background_0.3s,_box-shadow_0.3s] ${on ? '[border:1.5px_solid_var(--purple)] [background:#faf8ff] [box-shadow:0_1.6rem_4rem_-2rem_rgba(106,65,249,0.45)]' : '[border:1.5px_solid_#ece8fa] [background:#fff] [&:hover]:[border-color:#d9d0fb]'} [@media(max-width:_1099px)]:[padding:2rem]`}>
                  <div className="[display:flex] [align-items:center] [gap:1.2rem]">
                    <span aria-hidden className="[flex:none] [display:grid] [place-items:center] [width:4.4rem] [height:4.4rem] [border-radius:1.2rem] [background:#f1edff] [color:var(--purple)] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [&_svg]:[stroke-width:1.7]">{serviceIcon(r.name)}</span>
                    <h3 className="[font-size:max(1.9rem,17px)] [font-weight:500] [color:var(--ink-2)] [line-height:1.25]">{r.name}</h3>
                  </div>
                  <p className="[font-size:max(1.6rem,15px)] [line-height:1.55] [color:#4a4f63]">{r.d}</p>
                  <div className="[display:flex] [align-items:center] [justify-content:space-between] [gap:1.2rem] [margin-top:auto] [padding-top:0.4rem]">
                    <Link to={r.to} className="[font-size:max(1.5rem,14px)] [font-weight:500] [color:var(--purple)] [text-decoration:underline] [text-underline-offset:0.3rem] [min-height:24px] [display:inline-flex] [align-items:center]">Learn more<span className="sr-only"> about {r.name}</span></Link>
                    <button type="button" aria-pressed={on} onClick={() => toggle(r.name)} className={`[display:inline-flex] [align-items:center] [gap:0.6rem] [min-height:40px] [padding:0_1.6rem] [border-radius:99rem] [font-size:max(1.5rem,14px)] [font-weight:500] [transition:background_0.3s,_color_0.3s] ${on ? '[background:var(--purple)] [color:#fff]' : '[background:#f3f0ff] [color:var(--purple)] [&:hover]:[background:#e9e3ff]'}`}>
                      {on ? <><Check size={15} strokeWidth={3} aria-hidden /> Added</> : <><Plus size={15} strokeWidth={2.6} aria-hidden /> Add</>}<span className="sr-only"> {r.name}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <aside className="cvb__receipt [@media(min-width:_1100px)]:[position:sticky] [@media(min-width:_1100px)]:[top:12rem] [padding:3.2rem] [border-radius:3.2rem] [background:linear-gradient(180deg,_#ffffff,_#faf8ff)] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_-2.4rem_rgba(57,_28,_160,_0.28)] [@media(max-width:_1099px)]:[padding:2.4rem_2rem] [@media(max-width:_1099px)]:[border-radius:2.4rem]" aria-labelledby="cvb-plan">
          <div className="[display:flex] [justify-content:space-between] [align-items:baseline] [gap:1.2rem] [padding-bottom:1.6rem] [border-bottom:1px_dashed_#ddd5f8]">
            <h3 id="cvb-plan" className="[font-size:max(2.2rem,18px)] [font-weight:500] [color:var(--ink-2)]">Your cardiology billing plan</h3>
            <span className={`${MONO} [color:var(--purple)]`} aria-live="polite">{sel.length} {sel.length === 1 ? 'service' : 'services'}</span>
          </div>
          <ul className="[display:flex] [flex-direction:column] [min-height:12rem] [padding-block:0.8rem]">
            <AnimatePresence initial={false}>
              {picked.map((r) => (
                <motion.li key={r.name} layout={!off} initial={off ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={off ? undefined : { opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: ease.out }} className="[overflow:hidden]">
                  <div className="[display:flex] [gap:1.2rem] [padding:1.2rem_0] [border-bottom:1px_solid_#f0ecfb]">
                    <Check size={16} strokeWidth={3} aria-hidden className="[flex:none] [margin-top:0.3rem] [color:#13a35f]" />
                    <div><b className="[display:block] [font-weight:500] [font-size:max(1.7rem,16px)] [color:var(--ink-2)]">{r.name}</b><span className="[font-size:max(1.4rem,14px)] [color:#646776]">{r.adds}</span></div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            {picked.length === 0 && <li className="[padding:2.4rem_0] [font-size:max(1.6rem,15px)] [color:#646776]">Add a service to build your plan.</li>}
          </ul>
          <ul className="[display:flex] [flex-direction:column] [gap:0.6rem] [margin-top:1.6rem] [font-size:max(1.5rem,14px)] [color:#4a4f63] [&_li]:[display:flex] [&_li]:[gap:0.8rem] [&_li]:[align-items:center]">
            <li><Check size={14} strokeWidth={3} aria-hidden className="[color:var(--purple)]" />Cardiology rules built into every service</li>
            <li><Check size={14} strokeWidth={3} aria-hidden className="[color:var(--purple)]" />BAA signed, works inside your EHR</li>
            <li><Check size={14} strokeWidth={3} aria-hidden className="[color:var(--purple)]" />No setup fees, priced on what we collect</li>
          </ul>
          <button type="button" onClick={go} disabled={!sel.length} className="[margin-top:2.4rem] [width:100%] [min-height:5.6rem] [display:inline-flex] [align-items:center] [justify-content:center] [gap:1rem] [border-radius:99rem] [background:linear-gradient(180deg,_#8060ff,_#6a41f9)] [color:#fff] [font-weight:500] [font-size:max(1.7rem,16px)] [transition:filter_0.3s,_opacity_0.3s] [&:hover]:[filter:brightness(1.08)] [&:disabled]:[opacity:0.5] [&:disabled]:[cursor:not-allowed] [&:hover_svg]:[transform:translateX(0.4rem)] [&_svg]:[transition:transform_0.3s]">
            Get pricing for {sel.length > 1 ? 'these services' : 'this service'} <ArrowRight size={18} aria-hidden />
          </button>
          <p className="[margin-top:1.2rem] [text-align:center] [font-size:max(1.4rem,14px)] [color:#646776]">Free, takes 20 seconds. HIPAA-compliant.</p>
        </aside>
      </div>
    </section>
  );
}

/* page wiring keeps the original names */
export { StudySelector as SpecializedServices, SolutionJourney as OurSolution, EhrFlow as EhrWall, ServiceBuilder as RelatedServices };

/* FAQs: cardiology billing only ------------------------------------------------------- */
export const CARDIOLOGY_V2_FAQS: [string, string][] = [
  ['What CPT codes are most common in cardiology billing?', 'The codes we see most are office visits (99202–99215), the 12-lead ECG (93000), complete echo (93306), stress testing (93015–93018), SPECT myocardial perfusion imaging (78452), diagnostic cath with coronary angiography (93458) and coronary stents (92928). Each has component, bundling and prior auth rules that decide whether it pays.'],
  ['How do you bill the professional and technical components?', 'When a cardiologist reads a study done on hospital equipment, we bill only the professional component with modifier 26. When your practice owns the equipment but another physician reads it, we bill the technical component with modifier TC. When you own the equipment and read the study, we bill it globally, with no modifier.'],
  ['Which cardiology services need prior authorization?', 'Most commercial and Medicare Advantage plans require prior auth for nuclear stress tests, stress and transesophageal echo, cardiac CT and MRI, elective caths and device implants. We request it when the study is scheduled and check the auth number on the claim before it goes out.'],
  ['How is a diagnostic cath billed when it leads to a stent the same day?', 'A diagnostic cath before a PCI is separately payable only when there was no prior study, the patient’s condition changed, or the prior study was inadequate, and the note must say which. We code it with modifier 59 or XU when those conditions are documented, and bundle it when they are not.'],
  ['How is remote monitoring of pacemakers and ICDs billed?', 'Remote interrogation is billed once per 90-day period for pacemakers and ICDs, with separate codes for the physician review and the technical service. We track each patient’s period so an in-office check in the same window isn’t billed as a duplicate.'],
  ['Can you bill an office visit on the same day as an echo or stress test?', 'Yes, when the visit addresses something beyond the decision to order the test, such as a medication change or a new problem. We add modifier 25 to the visit only when the note supports a separate service, which is one of the most audited cardiology billing patterns.'],
  ['How much do cardiology billing services cost?', 'Most practices pay a percentage of what we collect, so our fee depends on your volume and payer mix. Send us a month of claims and we’ll give you an exact quote with no setup fees.'],
  ['How long does it take to switch to Affinity Core?', 'Usually 30 to 45 days. We sign a BAA, get access to your EHR, review your cardiology payer rules and open A/R, then take over new claims while your current biller finishes the old ones, so cash flow doesn’t pause.'],
];
