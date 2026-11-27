'use client';
/**
 * Cardiology page, variation B (unlisted): the folds that differ from the standard specialty template.
 *  1. StudySelector    – pick a study, watch its claim get worked line by line (tabs, auto-advance).
 *  2. SolutionJourney  – sticky headline + a scroll-filled rail; each step drops the artifact it produces,
 *                        then problem → fix rows that strike through and resolve as they enter.
 *  3. EhrFlow          – copy and how access works beside a hairline grid of EHR logos.
 *  4. ServiceBuilder   – related specialties as link cards.
 * Every fold has a static end state for reduced motion and the site's Pause animations control.
 */
import { motion, useInView, useScroll, useSpring, useTransform } from 'motion/react';
import { Activity, ArrowRight, Atom, Check, Droplets, Gauge, HeartPulse, MonitorSmartphone, Plus, ScanLine, Stethoscope, Waypoints, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button, Eyebrow, SplitWords } from './ui';
import { Link } from '../router';
import { ease } from '../motion';
import { useMotionOff } from '../motionPref';
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


/* 1. Specialized cardiology billing services: study selector ------------------------------ */
type Study = { icon: ReactNode; t: string; d: string; checks: [string, string][]; lines: [string, string, string][]; risk: string; cta: string };
const STUDIES: Study[] = [
  { icon: <Stethoscope />, t: 'Office visits and consults', d: 'E/M levels supported by the note, and modifier 25 only when a visit is truly separate from the test done the same day.',
    checks: [['Eligibility', 'Active'], ['Visit level', 'Set by MDM'], ['Same-day test', 'Separate'], ['Modifier 25', 'Supported']],
    lines: [['99214', 'Established visit, moderate MDM', 'MDM supports level'], ['93000', '12-lead ECG, same day', 'Separate service'], ['-25', 'Modifier on the visit', 'Note supports it']], risk: 'Modifier 25 added by habit, then recouped on audit.', cta: 'Check my visit coding' },
  { icon: <Activity />, t: 'Echocardiography', d: 'Complete, limited and stress echo billed to the study actually performed, with the Doppler and contrast add-ons that apply.',
    checks: [['Prior auth', 'On file'], ['Study', 'Complete TTE'], ['Component', 'Global'], ['Diagnosis', 'Meets LCD']],
    lines: [['93306', 'TTE complete with Doppler', 'Auth on file'], ['Q9957', 'Contrast agent, per mL', 'Add-on captured'], ['I50.32', 'Chronic diastolic heart failure', 'Meets LCD']], risk: 'Echo denied for no auth, or billed complete when it was limited.', cta: 'Check my echo claims' },
  { icon: <Atom />, t: 'Nuclear cardiology', d: 'SPECT and PET perfusion studies billed with the stress test and the radiopharmaceutical, so no part of the study goes unpaid.',
    checks: [['Prior auth', 'On file'], ['Stress test', 'Billed'], ['Isotope', 'Billed'], ['Component', 'Global']],
    lines: [['78452', 'SPECT MPI, rest and stress', 'Auth on file'], ['93015', 'Stress test, global', 'Bundled check passed'], ['A9500', 'Tc-99m sestamibi, per dose', 'Add-on captured']], risk: 'The isotope or the stress test left off the claim.', cta: 'Check my nuclear claims' },
  { icon: <Gauge />, t: 'Stress testing', d: 'Supervision, interpretation and tracing split correctly between the physician and the facility.',
    checks: [['Site', 'Hospital'], ['Component', '26 only'], ['Global 93015', 'Not billed'], ['Diagnosis', 'Meets LCD']],
    lines: [['93016', 'Supervision only', 'Hospital site'], ['93018', 'Interpretation and report', 'Physician read'], ['R07.89', 'Other chest pain', 'Meets LCD']], risk: 'Global 93015 billed when the hospital owns the treadmill.', cta: 'Check my stress tests' },
  { icon: <HeartPulse />, t: 'Cardiac cath and PCI', d: 'Diagnostic caths, stents and same-day diagnostic-to-PCI cases coded against NCCI bundling edits and the cath report.',
    checks: [['Prior auth', 'On file'], ['NCCI edits', 'Checked'], ['Same-day PCI', 'Billed apart'], ['Vessel', 'LD']],
    lines: [['93458', 'Left heart cath, angiography', 'Report matched'], ['92928', 'Stent, single major vessel', 'LD applied'], ['-XU', 'Diagnostic cath, separate', 'No prior study']], risk: 'Diagnostic cath bundled into the PCI and lost.', cta: 'Check my cath lab claims' },
  { icon: <Zap />, t: 'Electrophysiology and devices', d: 'Pacemaker and ICD implants, device checks and remote monitoring periods billed on the right dates.',
    checks: [['Prior auth', 'On file'], ['Remote period', 'Day 34 of 90'], ['Office check', 'Not billed'], ['Device', 'ICD']],
    lines: [['33249', 'ICD insertion, transvenous', 'Auth on file'], ['93295', 'ICD remote review, 90 days', 'Period tracked'], ['93296', 'Remote technical service', 'Not duplicated']], risk: 'In-office check billed inside an open remote period.', cta: 'Check my device billing' },
  { icon: <Activity />, t: 'ECG and rhythm monitoring', d: 'Office ECGs, Holters and extended patch monitors billed for the component you performed: global, read-only or tracing.',
    checks: [['Equipment', 'Hospital'], ['Component', '26 only'], ['Monitor days', '6 of 7'], ['Diagnosis', 'Meets LCD']],
    lines: [['93010', 'ECG interpretation only', 'Pro component'], ['93224', 'Holter, up to 48 hours', 'Global'], ['93241', 'Patch monitor, 48h–7d', 'Days matched']], risk: 'Global ECG billed for a hospital tracing you only read.', cta: 'Check my ECG billing' },
  { icon: <Waypoints />, t: 'Vascular and peripheral', d: 'Carotid and arterial duplex studies and peripheral interventions linked to the diagnosis each payer’s LCD requires.',
    checks: [['Diagnosis', 'Meets LCD'], ['Frequency', 'Within limit'], ['Prior auth', 'On file'], ['Laterality', 'Bilateral']],
    lines: [['93880', 'Carotid duplex, bilateral', 'Meets LCD'], ['93922', 'ABI, limited bilateral', 'Frequency OK'], ['37226', 'Fem-pop stent', 'Auth on file']], risk: 'Duplex denied as not medically necessary.', cta: 'Check my vascular claims' },
  { icon: <MonitorSmartphone />, t: 'Telehealth and remote monitoring', d: 'Video visits with the right place of service, and RPM device and management time tracked month by month.',
    checks: [['Place of service', 'POS 10'], ['Modifier', '95'], ['Device days', '16 of 30'], ['Mgmt time', '20 min']],
    lines: [['99213', 'Video visit, POS 10', 'Modifier 95'], ['99454', 'RPM device supply', '16 days logged'], ['99457', 'RPM management, 20 min', 'Time logged']], risk: 'RPM billed in a month without enough device days.', cta: 'Check my telehealth billing' },
];

function StudyItem({ x, i }: { x: Study; i: number }) {
  const off = useMotionOff();
  return (
    <motion.li initial={off ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: ease.out }}
      className="cvs__item group [display:flex] [flex-direction:column] [gap:1.2rem] [padding-top:2.4rem] [border-top:1px_solid_#e6e1f7]">
      <div className="[display:flex] [align-items:center] [justify-content:space-between]">
        <span aria-hidden className="[display:grid] [place-items:center] [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [background:#f1edff] [color:var(--purple)] [transition:background_0.35s,_color_0.35s] group-hover:[background:var(--purple)] group-hover:[color:#fff] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[stroke-width:1.7]">{x.icon}</span>
        <span aria-hidden className="[font-family:var(--f-mono)] [font-size:max(1.3rem,12px)] [color:#a3a0b5]">{String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="[margin-top:0.8rem] [font-size:max(2.2rem,18px)] [font-weight:500] [letter-spacing:-0.03rem] [color:var(--ink-2)] [line-height:1.25]">{x.t}</h3>
      <p className="[font-size:max(1.6rem,15px)] [line-height:1.6] [color:#4a4f63]">{x.d}</p>
    </motion.li>
  );
}

export function StudySelector() {
  const cols = [0, 1, 2].map((c) => STUDIES.map((x, i) => ({ x, i })).filter(({ i }) => i % 3 === c));
  return (
    <section className={`cvs ${SEC}`} id="cardiology-services">
      <div className="cvs__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:4rem] [align-items:end] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:1.6rem]">
        <div className="[display:flex] [flex-direction:column] [gap:1.6rem]">
          <Eyebrow>/ Specialized cardiology billing services</Eyebrow>
          <SplitWords className={H2} lines={['Every cardiology study,', 'billed the way it pays.']} stagger={0.04} />
        </div>
        <div className="[justify-self:end] [max-width:52rem] [display:flex] [flex-direction:column] [gap:2.4rem] [align-items:flex-start] [@media(max-width:_1099px)]:[justify-self:start]">
          <p className={LEAD}>Cardiology billing is the coding and claim work for every study a heart practice performs. Each study has its own codes, component rules and prior auth needs, and we bill all nine.</p>
          <Button>Get a free claim review</Button>
        </div>
      </div>
      <div className="cvs__cols [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:4.8rem] [margin-top:7.2rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_1099px)]:[gap:3.2rem] [@media(max-width:_1099px)]:[margin-top:4.8rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
        {/* desktop: three stepped columns; tablet and phone: one flowing list */}
        {cols.map((col, c) => (
          <ul key={c} className={`[display:flex] [flex-direction:column] [gap:5.6rem] [@media(max-width:_1099px)]:[display:none] ${c === 1 ? '[margin-top:8rem]' : c === 2 ? '[margin-top:16rem]' : ''}`}>
            {col.map(({ x, i }) => <StudyItem key={x.t} x={x} i={i} />)}
          </ul>
        ))}
        <ul className="[display:contents] [@media(min-width:_1100px)]:[display:none]">
          {STUDIES.map((x, i) => <StudyItem key={x.t} x={x} i={i} />)}
        </ul>
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
const FIXES: [string, string, string][] = [
  ['26 / TC', 'Global billed when only the read was done', 'Modifier 26 or TC set by place of service before the claim goes out.'],
  ['Prior auth', 'Nuclear and echo denied for no prior auth', 'Auth requested at scheduling and the number checked on the claim.'],
  ['NCCI', 'Diagnostic cath lost inside a same-day PCI', 'Billed separately when the note shows no prior study or a changed condition.'],
  ['Remote period', 'Device checks billed in an open remote period', 'Each patient’s 90-day period tracked so checks aren’t denied as duplicates.'],
  ['LCD', 'Imaging denied as not medically necessary', 'ICD-10 codes matched to the payer’s LCD before submission.'],
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

function FixCard({ tag, p, f, i }: { tag: string; p: string; f: string; i: number }) {
  const off = useMotionOff();
  return (
    <motion.li initial={off ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: ease.out, delay: (i % 3) * 0.08 }}
      className="cvf__card [display:flex] [flex-direction:column] [padding:2.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2rem_5rem_-3.2rem_rgba(57,_28,_160,_0.3)] [@media(max-width:_1099px)]:[padding:2.2rem]">
      <div className="[display:flex] [justify-content:space-between] [align-items:center] [gap:1.2rem]">
        <span className={`${MONO} [padding:0.6rem_1.1rem] [border-radius:99rem] [background:#f1edff] [color:var(--purple)]`}>{tag}</span>
        <span className={`${MONO} [color:#a3a0b5]`} aria-hidden>{String(i + 1).padStart(2, '0')}</span>
      </div>
      <p className="[margin-top:2.4rem] [display:flex] [gap:1rem] [align-items:flex-start] [font-size:max(1.6rem,15px)] [line-height:1.5] [color:#9b1c33]">
        <X size={16} strokeWidth={2.6} aria-hidden className="[flex:none] [margin-top:0.3rem]" /><span><span className="sr-only">Problem: </span>{p}</span>
      </p>
      <div aria-hidden className="[position:relative] [margin:2.6rem_0_2.4rem] [border-top:1px_dashed_#e3dcf8]">
        <span className="[position:absolute] [left:0] [top:-1.3rem] [display:grid] [place-items:center] [width:2.6rem] [height:2.6rem] [border-radius:50%] [background:#fff] [border:1px_solid_#e3dcf8] [color:var(--purple)]"><ArrowRight size={13} className="[rotate:90deg]" /></span>
      </div>
      <p className="[display:flex] [gap:1rem] [align-items:flex-start] [font-size:max(1.9rem,17px)] [line-height:1.45] [font-weight:500] [color:var(--ink-2)]">
        <span aria-hidden className="[flex:none] [display:grid] [place-items:center] [width:2.4rem] [height:2.4rem] [margin-top:0.1rem] [border-radius:50%] [background:#13a35f] [color:#fff]"><Check size={13} strokeWidth={3} /></span>
        <span><span className="sr-only">How we fix it: </span>{f}</span>
      </p>
    </motion.li>
  );
}

export function SolutionJourney() {
  const ref = useRef<HTMLOListElement>(null);
  const off = useMotionOff();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const h = useTransform(fill, (v) => `${Math.round(v * 1000) / 10}%`);
  return (
    <div className="cvj-band [margin-top:14rem] [padding-bottom:14rem] [background:linear-gradient(180deg,_#f6f3ff_0%,_#fbfaff_100%)] [border-block:1px_solid_#eee9ff] [@media(max-width:_1099px)]:[margin-top:8rem] [@media(max-width:_1099px)]:[padding-bottom:8rem]">
    <section className={`cvj ${SEC} [padding-top:12rem]! [@media(max-width:_1099px)]:[padding-top:7.2rem]!`} id="our-solution">
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
      <ul className="cvf [margin-top:12rem] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1.6rem] [@media(max-width:_1099px)]:[margin-top:7.2rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
        <li className="[display:flex] [flex-direction:column] [gap:12px] [padding:0.8rem_2.4rem_2.4rem_0] [@media(max-width:_640px)]:[padding:0]">
          <div>
            <p className={`${MONO} [color:#646776]`}>Problem <span aria-hidden>→</span> Fix</p>
            <h3 className="[margin-top:1.6rem] [font-size:max(3.4rem,26px)] [font-weight:500] [line-height:1.15] [letter-spacing:-0.06rem] [color:var(--ink-2)] [text-wrap:balance]">Common cardiology billing problems, and how we fix each one.</h3>
          </div>
          <p className="[font-size:max(1.6rem,15px)] [line-height:1.6] [color:#4a4f63]">Five places cardiology claims go wrong most often. Each one is checked before the claim leaves.</p>
        </li>
        {FIXES.map(([tag, p, f], i) => <FixCard key={p} tag={tag} p={p} f={f} i={i} />)}
      </ul>
    </section>
    </div>
  );
}

/* 3. EHR / EMR: copy + how access works beside a hairline logo grid ------------------------------------ */
const EHRS: [Img, string, number][] = [
  [epic, 'Epic', 7.2], [oracle, 'Oracle Health', 9.6], [athena, 'athenahealth', 15], [ecw, 'eClinicalWorks', 15], [nextgen, 'NextGen Healthcare', 10],
  [greenway, 'Greenway Health', 11], [modmed, 'ModMed', 12], [meditech, 'MEDITECH', 13], [advancedmd, 'AdvancedMD', 15], [curemd, 'CureMD', 11.5],
  [practicefusion, 'Practice Fusion', 16], [tebra, 'Tebra', 10], [veradigm, 'Veradigm', 13], [drchrono, 'DrChrono', 11], [gehc, 'GE HealthCare', 15],
];
const ACCESS: [string, string][] = [
  ['BAA signed first', 'A business associate agreement is in place before anyone logs in.'],
  ['Your logins, your rules', 'Role-based accounts in your EHR and PM system, which you can switch off at any time.'],
  ['Out through your clearinghouse', 'Claims, auths and appeals go out on the rails you already pay for.'],
];

export function EhrFlow() {
  const off = useMotionOff();
  return (
    <section className={`cve ${SEC}`} id="ehr">
      <div className="cve__grid [display:grid] [grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.2fr)] [gap:7.2rem] [align-items:center] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:4rem]">
        <div className="[display:flex] [flex-direction:column] [gap:1.6rem]">
          <Eyebrow>/ EHR and EMR systems</Eyebrow>
          <SplitWords className={H2} lines={['Works inside the EHR', 'your cardiologists use.']} stagger={0.04} />
          <p className={`${LEAD} [max-width:50rem]`}>No new software for your staff. We bill from your EHR and practice management system, including the cardiology modules for echo, cath and device reporting.</p>
          <ol className="[margin-top:1.6rem] [border-top:1px_solid_#ece8fa]">
            {ACCESS.map(([t, d], i) => (
              <li key={t} className="[display:grid] [grid-template-columns:4rem_minmax(0,_1fr)] [gap:1.2rem] [padding:2rem_0] [border-bottom:1px_solid_#ece8fa]">
                <span className="[font-family:var(--f-mono)] [font-size:max(1.4rem,13px)] [color:var(--purple)] [padding-top:0.3rem]">{String(i + 1).padStart(2, '0')}</span>
                <div><b className="[display:block] [font-weight:500] [font-size:max(1.9rem,17px)] [color:var(--ink-2)]">{t}</b><span className="[display:block] [margin-top:0.4rem] [font-size:max(1.6rem,15px)] [line-height:1.55] [color:#4a4f63]">{d}</span></div>
              </li>
            ))}
          </ol>
        </div>
        <ul className="cve__wall [display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [&>li]:[border-right:1px_solid_#e6e1f7] [&>li]:[border-bottom:1px_solid_#e6e1f7] [&>li:nth-child(4n)]:[border-right:0] [&>li:nth-last-child(-n+4)]:[border-bottom:0] [@media(max-width:_640px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[&>li:nth-child(odd)]:[border-right:1px_solid_#e6e1f7]! [@media(max-width:_640px)]:[&>li:nth-child(even)]:[border-right:0]! [@media(max-width:_640px)]:[&>li]:[border-bottom:1px_solid_#e6e1f7]! [@media(max-width:_640px)]:[&>li:nth-last-child(-n+2)]:[border-bottom:0]!" aria-label="EHR and practice management systems we work in">
          {EHRS.map(([img, name, w], i) => (
            <motion.li key={name} initial={off ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: (i % 4) * 0.06 + Math.floor(i / 4) * 0.08 }}
              className="[display:grid] [place-items:center] [aspect-ratio:16/10] [padding:2rem] [@media(max-width:_640px)]:[padding:14px]">
              <img src={src(img)} alt={name} loading="lazy" decoding="async" style={{ width: `${Math.min(w * 1.05, 15)}rem` }} className="[max-width:84%] [max-height:5.2rem] [object-fit:contain] [@media(max-width:_1099px)]:[max-height:34px]" />
            </motion.li>
          ))}
          <li>
            <Link to="/contact" className="[display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [gap:0.6rem] [height:100%] [aspect-ratio:16/10] [padding:2rem] [text-align:center] [color:var(--purple)] [&:hover_.cve-plus]:[background:var(--purple)] [&:hover_.cve-plus]:[color:#fff] [@media(max-width:_640px)]:[padding:14px]">
              <span className="cve-plus [display:grid] [place-items:center] [width:3.6rem] [height:3.6rem] [border-radius:50%] [border:1px_solid_#d9d0fb] [transition:background_0.3s,_color_0.3s]"><Plus size={18} aria-hidden /></span>
              <span className="[font-size:max(1.5rem,14px)] [font-weight:500] [line-height:1.3]">Using another system?<br />Ask us</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

/* 4. Related specialties: build-your-group ---------------------------------------------------------- */
const RELATED: { name: string; to: string; icon: ReactNode; d: string }[] = [
  { name: 'Internal Medicine', to: '/specialties/internal-medicine', icon: <Stethoscope />, d: 'The primary care side of a heart group: chronic care, annual wellness and the referrals that feed the cath lab.' },
  { name: 'Radiology', to: '/specialties/radiology', icon: <ScanLine />, d: 'Cardiac CT, CTA and MRI read in-house, with the professional and technical split set by site.' },
  { name: 'Nephrology', to: '/specialties/nephrology', icon: <Droplets />, d: 'Shared heart and kidney patients, ESRD monthly capitation and vascular access work.' },
];

export function ServiceBuilder() {
  return (
    <section className={`cvb ${SEC}`} id="related-specialties">
      <div className="cvb__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:4rem] [align-items:end] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:1.6rem]">
        <div className="[display:flex] [flex-direction:column] [gap:1.6rem]">
          <Eyebrow>/ Related specialties</Eyebrow>
          <SplitWords className={H2} lines={['Related specialties we bill', 'alongside cardiology.']} stagger={0.04} />
        </div>
        <p className={`${LEAD} [max-width:52rem] [justify-self:end] [@media(max-width:_1099px)]:[justify-self:start]`}>Most heart groups bill more than cardiology. One team can bill every specialty your group runs, with one report across all of them.</p>
      </div>
      <ul className="cvb__list [margin-top:4rem] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1.6rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_1099px)]:[margin-top:3.2rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
        {RELATED.map((r) => (
          <li key={r.name}>
            <Link to={r.to} className="group [position:relative] [display:flex] [flex-direction:column] [gap:1.2rem] [height:100%] [padding:2.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.3s,_box-shadow_0.3s,_transform_0.3s] [&:hover]:[border-color:var(--purple)] [&:hover]:[transform:translateY(-0.4rem)] [&:hover]:[box-shadow:0_2rem_5rem_-2.4rem_rgba(106,65,249,0.45)] [@media(max-width:_1099px)]:[padding:2.2rem]">
              <span aria-hidden className="[display:grid] [place-items:center] [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [background:#f1edff] [color:var(--purple)] [transition:background_0.3s,_color_0.3s] group-hover:[background:var(--purple)] group-hover:[color:#fff] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[stroke-width:1.7]">{r.icon}</span>
              <h3 className="[margin-top:0.4rem] [font-size:max(2.2rem,18px)] [font-weight:500] [color:var(--ink-2)] [line-height:1.25]">{r.name}</h3>
              <p className="[font-size:max(1.6rem,15px)] [line-height:1.55] [color:#4a4f63]">{r.d}</p>
              <span className="[margin-top:auto] [padding-top:0.8rem] [display:inline-flex] [align-items:center] [gap:0.6rem] [font-size:max(1.5rem,14px)] [font-weight:500] [color:var(--purple)]">{r.name} billing <ArrowRight size={16} aria-hidden className="[transition:transform_0.3s] group-hover:[transform:translateX(0.4rem)]" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* page wiring keeps the original names */
export { StudySelector as SpecializedServices, SolutionJourney as OurSolution, EhrFlow as EhrWall, ServiceBuilder as RelatedServices, ServiceBuilder as RelatedSpecialties };

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
  ['What should you ask a cardiology billing company before you switch?', 'Ask how many cardiology practices they bill for and who codes them, the top cardiology denial reasons they see and what they change to stop them, how echo, nuclear and cath lab claims are reviewed before they go out, and whether they report denial rate and days in A/R against cardiology benchmarks every month.'],
];
