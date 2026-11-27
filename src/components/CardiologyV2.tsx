'use client';
/**
 * Specialty page template folds (used by every specialty page):
 *  1. StudySelector    – the specialty's services as icon, heading and description in a simple grid.
 *  2. SolutionJourney  – sticky headline + a scroll-filled rail; each of the six steps drops an illustrative output chip.
 *  3. EhrFlow          – copy and how access works beside a hairline grid of EHR logos.
 *  4. ServiceBuilder   – three related specialties as link cards.
 * Content comes from data/sp-template*. Every fold has a static end state for reduced motion and the Pause animations control.
 */
import { motion, useInView, useScroll, useSpring, useTransform } from 'motion/react';
import { icons, ArrowRight, Check, Plus, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { STEP_TITLES, type SpecialtyTemplate } from '../data/sp-template';
import { getSpecialtyLite } from '../data/specialties';
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


/* 1. Specialized services grid ------------------------------------------------------------- */

const ICON = (name: string): LucideIcon => (icons as Record<string, LucideIcon>)[name] ?? icons.Stethoscope;
const lower = (name: string) => name.replace(/^[A-Z][a-z]/, (m) => m.toLowerCase()).replace(/ ([A-Z][a-z])/g, (m) => m.toLowerCase());
type Props = { name: string; t: SpecialtyTemplate };

function StudyItem({ x, i }: { x: { icon: string; t: string; d: string }; i: number }) {
  const Icon = ICON(x.icon);
  const off = useMotionOff();
  return (
    <motion.li initial={off ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, ease: ease.out, delay: (i % 3) * 0.07 }}
      className="cvs__item group [display:flex] [flex-direction:column] [gap:1.2rem] [padding:2.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.35s,_box-shadow_0.35s,_transform_0.35s] [&:hover]:[border-color:#cbbdfd] [&:hover]:[transform:translateY(-0.4rem)] [&:hover]:[box-shadow:0_2.4rem_5rem_-2.8rem_rgba(106,65,249,0.45)] [@media(max-width:_1099px)]:[padding:2.2rem]">
      <div className="[display:flex] [align-items:center] [justify-content:space-between]">
        <span aria-hidden className="[display:grid] [place-items:center] [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [background:#f1edff] [color:var(--purple)] [transition:background_0.35s,_color_0.35s] group-hover:[background:var(--purple)] group-hover:[color:#fff] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[stroke-width:1.7]"><Icon /></span>
        <span aria-hidden className="[font-family:var(--f-mono)] [font-size:max(1.3rem,12px)] [color:#a3a0b5]">{String(i + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="[margin-top:0.8rem] [font-size:max(2.2rem,18px)] [font-weight:500] [letter-spacing:-0.03rem] [color:var(--ink-2)] [line-height:1.25]">{x.t}</h3>
      <p className="[font-size:max(1.6rem,15px)] [line-height:1.6] [color:#4a4f63]">{x.d}</p>
    </motion.li>
  );
}

export function StudySelector({ name, t }: Props) {
  return (
    <section className={`cvs ${SEC}`} id="services">
      <div className="cvs__head [display:flex] [flex-direction:column] [gap:1.6rem] [max-width:72rem]">
        <Eyebrow>{`/ Specialized ${lower(name)} billing services`}</Eyebrow>
        <SplitWords className={H2} lines={t.lines} stagger={0.04} />
        <p className={`${LEAD} [max-width:60rem]`}>{t.intro}</p>
      </div>
      <ul className="cvs__grid [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1.6rem] [margin-top:4.8rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_1099px)]:[margin-top:3.2rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
        {t.services.map(([icon, title, d], i) => <StudyItem key={title} x={{ icon, t: title, d }} i={i} />)}
      </ul>
      <div className="[display:flex] [align-items:center] [gap:2rem] [flex-wrap:wrap] [margin-top:4rem]">
        <Button>Get a free claim review</Button>
        <span className="[font-size:max(1.5rem,14px)] [color:#646776]">Free review of one month of claims.</span>
      </div>
    </section>
  );
}

/* 2. Our process: scroll-filled journey ------------------------------------------------------ */

function Step({ s, i }: { s: { t: string; d: string; art: string[] }; i: number }) {
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


export function SolutionJourney({ name, t }: Props) {
  const steps = t.steps.map(([d, art, title], i) => ({ t: title ?? STEP_TITLES[i], d, art }));
  const ref = useRef<HTMLOListElement>(null);
  const off = useMotionOff();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const h = useTransform(fill, (v) => `${Math.round(v * 1000) / 10}%`);
  return (
    <div className="cvj-band [margin-top:14rem] [padding-bottom:14rem] [background:linear-gradient(180deg,_#f6f3ff_0%,_#fbfaff_100%)] [border-block:1px_solid_#eee9ff] [@media(max-width:_1099px)]:[margin-top:8rem] [@media(max-width:_1099px)]:[padding-bottom:8rem]">
    <section className={`cvj ${SEC} [padding-top:12rem]! [@media(max-width:_1099px)]:[padding-top:7.2rem]!`} id="our-process">
      <div className="cvj__grid [display:grid] [grid-template-columns:minmax(0,_0.9fr)_minmax(0,_1.1fr)] [gap:8rem] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:4rem]">
        <div className="cvj__side [align-self:start] [@media(min-width:_1100px)]:[position:sticky] [@media(min-width:_1100px)]:[top:14rem] [display:flex] [flex-direction:column] [gap:2rem]">
          <Eyebrow>/ Our process</Eyebrow>
          <SplitWords className={H2} lines={[`Our ${lower(name)} billing`, 'and coding process.']} stagger={0.04} />
          <p className={`${LEAD} [max-width:46rem]`}>One US-based team runs the whole cycle inside your EHR. Scroll the path one {lower(name)} claim takes, from the eligibility check to the monthly report.</p>
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
          {steps.map((s, i) => <Step key={s.t} s={s} i={i} />)}
        </ol>
      </div>
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

export function EhrFlow({ t }: { t: SpecialtyTemplate }) {
  const off = useMotionOff();
  return (
    <section className={`cve ${SEC}`} id="ehr">
      <div className="cve__grid [display:grid] [grid-template-columns:minmax(0,_0.8fr)_minmax(0,_1.2fr)] [gap:7.2rem] [align-items:center] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:4rem]">
        <div className="[display:flex] [flex-direction:column] [gap:1.6rem]">
          <Eyebrow>/ EHR and EMR systems</Eyebrow>
          <SplitWords className={H2} lines={['Works inside the EHR', 'your team already uses.']} stagger={0.04} />
          <p className={`${LEAD} [max-width:50rem]`}>No new software for your staff. We bill from your EHR and practice management system, {t.ehr}.</p>
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

/* 4. Related specialties ----------------------------------------------------------------------- */

export function ServiceBuilder({ name, t, related }: Props & { related: string[] }) {
  const list = (t.related ?? related.map((slug) => [slug, ''] as [string, string])).slice(0, 3).map(([slug, d]) => {
    const r = getSpecialtyLite(slug);
    return r ? { name: r.name, to: `/specialties/${r.slug}`, Icon: r.icon, d: d || r.watch } : null;
  }).filter((x) => !!x);
  return (
    <section className={`cvb ${SEC}`} id="related-specialties">
      <div className="cvb__head [display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:4rem] [align-items:end] [@media(max-width:_1099px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1099px)]:[gap:1.6rem]">
        <div className="[display:flex] [flex-direction:column] [gap:1.6rem]">
          <Eyebrow>/ Related specialties</Eyebrow>
          <SplitWords className={H2} lines={['Related specialties we bill', `alongside ${lower(name)}.`]} stagger={0.04} />
        </div>
        <p className={`${LEAD} [max-width:52rem] [justify-self:end] [@media(max-width:_1099px)]:[justify-self:start]`}>Many groups bill more than one specialty. One team can bill every specialty your group runs, with one report across all of them.</p>
      </div>
      <ul className="cvb__list [margin-top:4rem] [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:1.6rem] [@media(max-width:_1099px)]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] [@media(max-width:_1099px)]:[margin-top:3.2rem] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)]">
        {list.map((r) => (
          <li key={r.name}>
            <Link to={r.to} className="group [position:relative] [display:flex] [flex-direction:column] [gap:1.2rem] [height:100%] [padding:2.8rem] [border-radius:2.4rem] [background:#fff] [border:1px_solid_#ece8fa] [transition:border-color_0.3s,_box-shadow_0.3s,_transform_0.3s] [&:hover]:[border-color:var(--purple)] [&:hover]:[transform:translateY(-0.4rem)] [&:hover]:[box-shadow:0_2rem_5rem_-2.4rem_rgba(106,65,249,0.45)] [@media(max-width:_1099px)]:[padding:2.2rem]">
              <span aria-hidden className="[display:grid] [place-items:center] [width:4.8rem] [height:4.8rem] [border-radius:1.4rem] [background:#f1edff] [color:var(--purple)] [transition:background_0.3s,_color_0.3s] group-hover:[background:var(--purple)] group-hover:[color:#fff] [&_svg]:[width:2.4rem] [&_svg]:[height:2.4rem] [&_svg]:[stroke-width:1.7]"><r.Icon /></span>
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
