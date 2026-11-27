/**
 * Cardiology page, variation B (unlisted): the folds that differ from the standard specialty template.
 * Specialized services, our solution, the EHR wall and related services. Codes are current CPT/HCPCS
 * as of 2026; descriptions are short on purpose so each card answers one question (SEO/AEO).
 */
import { motion } from 'motion/react';
import { Activity, ArrowRight, Atom, Gauge, HeartPulse, MonitorSmartphone, Stethoscope, Waypoints, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { Eyebrow, SplitWords } from './ui';
import { Link } from '../router';
import { ease, vp } from '../motion';
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

const SEC = 'container [padding-inline:var(--gutter)] [@media(max-width:_1099px)]:[padding-inline:2rem] [padding-top:12rem] [@media(max-width:_1099px)]:[padding-top:8rem]';
const H2 = 'h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1099px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.2rem]';
const LEAD = '[font-size:max(1.8rem,16px)] [line-height:1.6] [color:#4a4f63] [max-width:56rem]';
const HEAD = '[display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:4rem] [align-items:end] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:2rem]';
const CHIP = '[font-family:var(--f-mono)] [font-size:max(1.2rem,12px)] [padding:0.4rem_0.9rem] [border-radius:99rem] [background:#f3f0ff] [color:var(--purple-deep,_#4f2ad8)] [white-space:nowrap]';
const rise = (i = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: vp, transition: { duration: 0.7, ease: ease.out, delay: Math.min(i, 5) * 0.06 } });

/* 1. Specialized cardiology billing services -------------------------------- */
const SERVICES: { icon: ReactNode; t: string; d: string; codes: string[] }[] = [
  { icon: <Stethoscope />, t: 'Office visits and consults', d: 'E/M levels supported by the note, and modifier 25 only when a visit is truly separate from the test done the same day.', codes: ['99202–99215', 'Mod 25'] },
  { icon: <Activity />, t: 'Echocardiography', d: 'Complete, limited and stress echo billed to the study that was actually performed, with the Doppler and contrast add-ons that apply.', codes: ['93306', '93308', '93350', '93351'] },
  { icon: <Atom />, t: 'Nuclear cardiology', d: 'SPECT and PET perfusion studies billed with the stress test and the radiopharmaceutical, so no part of the study goes unpaid.', codes: ['78452', '78492', 'A9500', '93015'] },
  { icon: <Gauge />, t: 'Stress testing', d: 'Supervision, interpretation and tracing split correctly between the physician and the facility.', codes: ['93015', '93016', '93017', '93018'] },
  { icon: <HeartPulse />, t: 'Cardiac cath and PCI', d: 'Diagnostic caths, stents and same-day diagnostic-to-PCI cases coded against NCCI bundling edits and the cath report.', codes: ['93458', '93459', '92928', '92920'] },
  { icon: <Zap />, t: 'Electrophysiology and devices', d: 'Pacemaker and ICD implants, device checks and remote monitoring periods billed on the right dates.', codes: ['33208', '33249', '93279', '93296'] },
  { icon: <Activity />, t: 'ECG and rhythm monitoring', d: 'Office ECGs, Holters and extended patch monitors billed for the component you performed: global, read-only or tracing.', codes: ['93000', '93010', '93224', '93241'] },
  { icon: <Waypoints />, t: 'Vascular and peripheral', d: 'Carotid and arterial duplex studies and peripheral interventions linked to the diagnosis each payer’s LCD requires.', codes: ['93880', '93922', '37224', '37226'] },
  { icon: <MonitorSmartphone />, t: 'Telehealth and remote monitoring', d: 'Video visits with the right place of service, and RPM device and management time tracked month by month.', codes: ['POS 10', '99454', '99457', '99458'] },
];

export function SpecializedServices() {
  return (
    <section className={`cv-svc ${SEC}`} id="cardiology-services">
      <div className={`cv-svc__head ${HEAD}`}>
        <div>
          <Eyebrow>/ Specialized cardiology billing services</Eyebrow>
          <SplitWords className={H2} lines={['Specialized cardiology', 'billing services.']} stagger={0.04} />
        </div>
        <p className={LEAD}>Cardiology billing is the coding and claim work for every study and procedure a heart practice performs. Each one has its own codes, component rules and prior auth needs. Here is what our coders bill every day.</p>
      </div>
      <ul className="cv-svc__grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2rem] [margin-top:4.8rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_1099px)]:[margin-top:3.2rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_640px)]:[gap:1.2rem]">
        {SERVICES.map((x, i) => (
          <motion.li key={x.t} {...rise(i % 3)} className="cv-svc__card [display:flex] [flex-direction:column] [gap:1.2rem] [padding:3.2rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.3s,_box-shadow_0.3s] [&:hover]:[border-color:#d9d0fb] [&:hover]:[box-shadow:0_2rem_5rem_rgba(40,_20,_120,_0.07)] [@media(max-width:_1099px)]:[padding:2.4rem_2rem] [@media(max-width:_1099px)]:[border-radius:2rem]">
            <span aria-hidden className="[display:grid] [place-items:center] [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [background:#f3f0ff] [color:var(--purple)] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[stroke-width:1.8] [@media(max-width:_1099px)]:[width:44px] [@media(max-width:_1099px)]:[height:44px]">{x.icon}</span>
            <h3 className="[font-size:max(2.2rem,18px)] [font-weight:500] [line-height:1.25] [color:var(--ink-2)]">{x.t}</h3>
            <p className="[font-size:max(1.6rem,16px)] [line-height:1.6] [color:#4a4f63]">{x.d}</p>
            <p className="[display:flex] [flex-wrap:wrap] [gap:0.6rem] [margin-top:auto] [padding-top:0.8rem]"><span className="sr-only">Common codes: </span>{x.codes.map((c) => <code key={c} className={CHIP}>{c}</code>)}</p>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/* 2. Our solution ------------------------------------------------------------ */
const STEPS: [string, string][] = [
  ['Verify and authorize', 'Eligibility checked before every visit. Prior auths for echo, nuclear, cath and device work requested before the study is scheduled and tracked to the payer’s deadline.'],
  ['Capture every charge', 'Charges built from the cath, echo and device reports, so add-ons, contrast and radiopharmaceuticals are not left off.'],
  ['Code to the component', 'Certified cardiology coders apply modifier 26 or TC by site of service, check NCCI edits and link each code to an LCD-approved diagnosis.'],
  ['Scrub and submit same day', 'Every claim is checked against the payer’s rules and sent the day it is ready.'],
  ['Work denials and A/R', 'Imaging and device denials appealed with the records the payer asks for; aged claims chased until they pay or close.'],
  ['Report every month', 'Denial rate, days in A/R and collections by study type, reviewed with you on a call.'],
];
const FIXES: [string, string][] = [
  ['Global billed when only the read was done', 'Modifier 26 or TC set by place of service before the claim goes out.'],
  ['Nuclear and echo denied for no prior auth', 'Auth requested at scheduling and the number checked on the claim.'],
  ['Diagnostic cath and PCI on the same day', 'Coded to the CMS rules for when the diagnostic cath is separately payable.'],
  ['Device checks billed in the wrong period', 'Remote monitoring periods tracked so in-office checks are not denied as duplicates.'],
  ['Medical necessity denials on imaging', 'ICD-10 codes matched to the payer’s LCD before submission.'],
];

export function OurSolution() {
  return (
    <section className={`cv-sol ${SEC}`} id="our-solution">
      <div className={`cv-sol__head ${HEAD}`}>
        <div>
          <Eyebrow>/ Our solution</Eyebrow>
          <SplitWords className={H2} lines={['Our cardiology billing', 'and coding solution.']} stagger={0.04} />
        </div>
        <p className={LEAD}>One US-based team runs the whole cycle inside your EHR, from the first eligibility check to the monthly report.</p>
      </div>
      <div className="cv-sol__grid [display:grid] [grid-template-columns:minmax(0,_1.1fr)_minmax(0,_1fr)] [gap:2.4rem] [margin-top:4.8rem] [align-items:start] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[margin-top:3.2rem] [@media(max-width:_1099px)]:[gap:1.6rem]">
        <ol className="cv-sol__steps [display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:1.6rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_640px)]:[gap:1.2rem]">
          {STEPS.map(([t, d], i) => (
            <motion.li key={t} {...rise(i)} className="[display:flex] [flex-direction:column] [gap:0.8rem] [padding:2.8rem] [border-radius:2.4rem] [background:#f8f6ff] [border:1px_solid_#eee9ff] [@media(max-width:_1099px)]:[padding:2.2rem_2rem] [@media(max-width:_1099px)]:[border-radius:2rem]">
              <span aria-hidden className="[font-family:var(--f-mono)] [font-size:max(1.3rem,13px)] [letter-spacing:0.08em] [color:var(--purple)]">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="[font-size:max(2rem,18px)] [font-weight:500] [color:var(--ink-2)]">{t}</h3>
              <p className="[font-size:max(1.6rem,16px)] [line-height:1.6] [color:#4a4f63]">{d}</p>
            </motion.li>
          ))}
        </ol>
        <motion.div {...rise(1)} className="cv-sol__fix [padding:3.6rem] [border-radius:3.2rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_2.4rem_6rem_rgba(40,_20,_120,_0.07)] [@media(max-width:_1099px)]:[padding:2.4rem_2rem] [@media(max-width:_1099px)]:[border-radius:2.4rem]">
          <h3 className="[font-family:var(--f-mono)] [font-size:max(1.3rem,13px)] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)] [font-weight:400]">Common cardiology billing problems, and the fix</h3>
          <table className="cv-sol__table [width:100%] [margin-top:2rem] [border-collapse:collapse] [&_th]:[text-align:left] [&_th]:[font-weight:500] [&_td]:[vertical-align:top] [&_tr]:[border-bottom:1px_solid_#ebe6fb] [&_tr:last-child]:[border-bottom:0] [&_th]:[padding:1.6rem_2rem_1.6rem_0] [&_td]:[padding:1.6rem_0] [&_th]:[font-size:max(1.7rem,16px)] [&_th]:[color:var(--ink-2)] [&_th]:[width:46%] [&_td]:[font-size:max(1.6rem,16px)] [&_td]:[line-height:1.6] [&_td]:[color:#4a4f63] [@media(max-width:_640px)]:[&_tr]:[display:block] [@media(max-width:_640px)]:[&_tr]:[padding:1.4rem_0] [@media(max-width:_640px)]:[&_th]:[display:block] [@media(max-width:_640px)]:[&_th]:[width:auto] [@media(max-width:_640px)]:[&_th]:[padding:0_0_0.4rem] [@media(max-width:_640px)]:[&_td]:[display:block] [@media(max-width:_640px)]:[&_td]:[padding:0]">
            <thead className="sr-only"><tr><th scope="col">Problem</th><th scope="col">How we fix it</th></tr></thead>
            <tbody>{FIXES.map(([p, f]) => <tr key={p}><th scope="row">{p}</th><td>{f}</td></tr>)}</tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

/* 3. EHR / EMR wall ------------------------------------------------------------ */
const EHRS: [Img, string, number][] = [
  [epic, 'Epic', 44], [oracle, 'Oracle Health', 52], [athena, 'athenahealth', 78], [ecw, 'eClinicalWorks', 78], [nextgen, 'NextGen Healthcare', 56],
  [greenway, 'Greenway Health', 56], [modmed, 'ModMed', 62], [meditech, 'MEDITECH', 66], [advancedmd, 'AdvancedMD', 74], [curemd, 'CureMD', 58],
  [practicefusion, 'Practice Fusion', 82], [tebra, 'Tebra', 52], [veradigm, 'Veradigm', 68], [drchrono, 'DrChrono', 56], [gehc, 'GE HealthCare', 78],
];

export function EhrWall() {
  return (
    <section className={`cv-ehr ${SEC}`} id="ehr">
      <div className="cv-ehr__box [padding:6.4rem] [border-radius:4rem] [background:linear-gradient(180deg,_#faf9ff,_#f4f1ff)] [border:1px_solid_#ece8fa] [@media(max-width:_1099px)]:[padding:4rem_2.4rem] [@media(max-width:_1099px)]:[border-radius:2.8rem] [@media(max-width:_640px)]:[padding:3.2rem_1.6rem]">
        <div className="[display:flex] [flex-direction:column] [align-items:center] [gap:1.6rem] [text-align:center]">
          <Eyebrow>/ EHR and EMR systems</Eyebrow>
          <SplitWords className={H2} lines={['Works inside the EHR', 'your cardiologists use.']} stagger={0.04} />
          <p className={`${LEAD} [margin-inline:auto]`}>No new software for your staff. We bill from your EHR and practice management system, including cardiology modules for echo, cath and device reporting, and map access with you before anything changes.</p>
        </div>
        <ul className="cv-ehr__grid [display:grid] [grid-template-columns:repeat(5,_minmax(0,_1fr))] [gap:1.2rem] [margin-top:4.8rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(3,_minmax(0,_1fr))] [@media(max-width:_1099px)]:[margin-top:3.2rem] [@media(max-width:_640px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_640px)]:[gap:0.8rem]" aria-label="EHR and practice management systems we work in">
          {EHRS.map(([img, name, w], i) => (
            <motion.li key={name} {...rise(i % 5)} className="[display:grid] [place-items:center] [height:10.4rem] [padding:1.6rem] [border-radius:2rem] [background:#fff] [border:1px_solid_#ece8fa] [@media(max-width:_1099px)]:[height:88px] [@media(max-width:_640px)]:[height:76px] [@media(max-width:_640px)]:[border-radius:1.6rem]">
              <img src={src(img)} alt={name} loading="lazy" decoding="async" style={{ width: `${w}%` }} className="[height:auto] [max-height:5.2rem] [object-fit:contain] [@media(max-width:_1099px)]:[max-height:44px] [@media(max-width:_640px)]:[max-height:38px]" />
            </motion.li>
          ))}
        </ul>
        <p className="[margin-top:2.4rem] [text-align:center] [font-size:max(1.6rem,16px)] [color:#4a4f63]">Don’t see yours? We work in most EHR and PM systems, plus payer portals and clearinghouses. <Link to="/contact" className="[color:var(--purple)] [text-decoration:underline] [text-underline-offset:0.3rem]">Ask about your system</Link>.</p>
      </div>
    </section>
  );
}

/* 4. Related medical billing services --------------------------------------------- */
const RELATED: [string, string, string][] = [
  ['Medical Coding', '/services/medical-coding', 'Certified coders for echo, nuclear, cath and EP studies.'],
  ['Denial Management', '/services/denial-management', 'Imaging and device denials worked by reason code and appealed.'],
  ['Credentialing & Enrollment', '/services/credentialing', 'New cardiologists enrolled with Medicare and commercial payers before day one.'],
  ['A/R Recovery', '/services/ar-recovery', 'Aged cardiology claims chased until they pay or close.'],
  ['Medical Billing Audits', '/services/medical-billing-audits', 'A review of your cardiology claims to find where revenue leaks.'],
  ['Revenue Cycle Management', '/services/revenue-cycle-management', 'The whole cycle run by one accountable team.'],
];

export function RelatedServices() {
  return (
    <section className={`cv-rel ${SEC}`} id="related-services">
      <div className={`cv-rel__head ${HEAD}`}>
        <div>
          <Eyebrow>/ Related medical billing services</Eyebrow>
          <SplitWords className={H2} lines={['Related medical billing', 'services for cardiology.']} stagger={0.04} />
        </div>
        <p className={LEAD}>Use the full cycle or just the part you need. Each service runs on the same cardiology rules and the same team.</p>
      </div>
      <ul className="cv-rel__grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1.6rem] [margin-top:4.8rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_1099px)]:[margin-top:3.2rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_640px)]:[gap:1.2rem]">
        {RELATED.map(([name, to, d], i) => (
          <motion.li key={name} {...rise(i % 3)}>
            <Link to={to} className="cv-rel__card [display:flex] [flex-direction:column] [gap:1.2rem] [height:100%] [padding:2.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.3s,_box-shadow_0.3s] [&:hover]:[border-color:#d9d0fb] [&:hover]:[box-shadow:0_2rem_5rem_rgba(40,_20,_120,_0.07)] [&:hover_.cv-rel__go_svg]:[transform:translateX(0.4rem)] [@media(max-width:_1099px)]:[padding:2.2rem_2rem] [@media(max-width:_1099px)]:[border-radius:2rem]">
              <span aria-hidden className="[display:grid] [place-items:center] [width:4.4rem] [height:4.4rem] [border-radius:1.2rem] [background:#f1edff] [color:var(--purple)] [&_svg]:[width:2.2rem] [&_svg]:[height:2.2rem] [&_svg]:[stroke-width:1.7]">{serviceIcon(name)}</span>
              <h3 className="[font-size:max(2rem,18px)] [font-weight:500] [color:var(--ink-2)]">{name}</h3>
              <p className="[font-size:max(1.6rem,16px)] [line-height:1.6] [color:#4a4f63]">{d}</p>
              <span className="cv-rel__go [margin-top:auto] [display:inline-flex] [align-items:center] [gap:0.6rem] [font-weight:500] [font-size:max(1.6rem,16px)] [color:var(--purple)] [&_svg]:[width:1.6rem] [&_svg]:[height:1.6rem] [&_svg]:[transition:transform_0.3s]">View service <ArrowRight aria-hidden /></span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

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
