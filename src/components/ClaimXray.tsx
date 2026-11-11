import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useInView, motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, ScanSearch } from 'lucide-react';
import { Link, go } from '../router';
import { SERVICES } from '../data/services';
import { ease } from '../motion';

/**
 * "X-ray of a claim" (Services hero).
 * A CMS-1500 claim form, the form every practice files. A lens shows which of the 9 services
 * owns each box. Idle: tilted in 3D, the lens tours 9 boxes (one per service). Hover: the form
 * lies flat and the lens follows the cursor. Click a box to open its service.
 * Two copies of the form are stacked: paper (base) + x-ray (clipped to a circle at the lens).
 */

export type Info = { title: string; slug: string; line: string };
export const BOX: Record<string, Info> = {
  '1': { title: 'Type of coverage', slug: 'medical-billing', line: 'Which payer, which plan. Confirmed before the claim is built.' },
  '1a': { title: 'Insured’s ID number', slug: 'medical-billing', line: 'Member ID verified against the payer’s eligibility response.' },
  '2': { title: 'Patient’s name', slug: 'medical-billing', line: 'Registration has to match the payer’s file exactly, or the claim bounces.' },
  '3': { title: 'Birth date and sex', slug: 'medical-billing', line: 'One wrong digit here is one of the most common rejections.' },
  '4': { title: 'Insured’s name', slug: 'medical-billing', line: 'Subscriber details checked against eligibility.' },
  '5': { title: 'Patient’s address', slug: 'medical-billing', line: 'Registration has to match the payer’s file exactly, or the claim bounces.' },
  '6': { title: 'Relationship to insured', slug: 'medical-billing', line: 'Self, spouse or child: it decides whose coverage pays.' },
  '7': { title: 'Insured’s address', slug: 'medical-billing', line: 'Subscriber details checked against eligibility.' },
  '11': { title: 'Insured’s policy group', slug: 'medical-billing', line: 'Plan and group numbers confirmed before submission.' },
  '14': { title: 'Date of current illness', slug: 'medical-coding', line: 'Onset date taken from the visit note.' },
  '17': { title: 'Referring provider', slug: 'medical-billing', line: 'Some payers deny specialist claims without a referring NPI.' },
  '21': { title: 'Diagnosis codes (ICD-10)', slug: 'medical-coding', line: 'I25.10, R07.9, I10: coded to the specificity the note supports.' },
  '22': { title: 'Resubmission code', slug: 'denial-management', line: 'Code 7 replaces a denied claim once it’s fixed. Then it’s tracked to paid.' },
  '23': { title: 'Prior authorization number', slug: 'medical-billing', line: 'Matched to the date and CPT codes before the claim goes out.' },
  '24A': { title: 'Dates of service', slug: 'charge-entry', line: 'Every service gets the date it actually happened.' },
  '24B': { title: 'Place of service', slug: 'medical-billing', line: 'POS 11 means office. The wrong place of service changes what Medicare pays.' },
  '24D': { title: 'Procedures and modifiers', slug: 'medical-coding', line: '99214-25, 93000, 78452, 93015: CPT codes and modifiers matched to the note.' },
  '24E': { title: 'Diagnosis pointer', slug: 'medical-billing-audits', line: 'Every line has to point to a diagnosis that supports it. Audits check each one.' },
  '24F': { title: 'Charges', slug: 'charge-entry', line: 'Every service on the superbill becomes a charged line. Nothing captured, nothing billed.' },
  '24G': { title: 'Days or units', slug: 'charge-entry', line: 'Units have to match what was actually done.' },
  '24J': { title: 'Rendering provider NPI', slug: 'credentialing', line: 'The provider who did the work has to be enrolled with this payer.' },
  '25': { title: 'Federal tax ID', slug: 'credentialing', line: 'Tax ID and NPI have to match the payer’s enrollment file.' },
  '26': { title: 'Patient’s account no.', slug: 'ar-recovery', line: 'Every open account is worked until it pays or closes, oldest and largest first.' },
  '27': { title: 'Accept assignment', slug: 'medical-billing', line: 'Yes: the payer pays the practice directly.' },
  '28': { title: 'Total charge', slug: 'charge-entry', line: '$1,710.00, with every line accounted for.' },
  '29': { title: 'Amount paid', slug: 'payment-posting', line: 'When the remittance lands, each line is posted and checked against the contract.' },
  '31': { title: 'Signature of physician', slug: 'medical-billing-audits', line: 'Signature on file, and documentation that backs every line.' },
  '32': { title: 'Service facility', slug: 'credentialing', line: 'The location has to be on the payer’s file too.' },
  '33': { title: 'Billing provider and NPI', slug: 'credentialing', line: 'If this NPI isn’t enrolled with the payer, nothing on this form gets paid.' },
  '*': { title: 'All 33 boxes', slug: 'revenue-cycle-management', line: 'One accountable team owns every box on the form, start to finish.' },
};
/** One stop per service, in the order a claim lives through them. */
const TOUR = ['33', '23', '24F', '24D', '24E', '22', '29', '26', '*'];
const svcName = (slug: string) => SERVICES.find((s) => s.slug === slug)?.name ?? '';
const SHORT: Record<string, string> = {
  'medical-billing': 'Billing', 'medical-coding': 'Coding', 'charge-entry': 'Charge entry', credentialing: 'Credentialing',
  'denial-management': 'Denials', 'payment-posting': 'Posting', 'ar-recovery': 'A/R', 'medical-billing-audits': 'Audits', 'revenue-cycle-management': 'RCM',
};

type B = { id: string; label: string; value: ReactNode; span: number };
const ROWS: B[][] = [
  [{ id: '1', label: 'Medicare · Medicaid · Tricare · Group health', value: '■ Medicare', span: 7 }, { id: '1a', label: 'Insured’s ID number', value: '1EG4-TE5-MK72', span: 5 }],
  [{ id: '2', label: 'Patient’s name', value: 'Rivera, Jamie', span: 5 }, { id: '3', label: 'Birth date · sex', value: '04 12 1958 · F', span: 3 }, { id: '4', label: 'Insured’s name', value: 'Same', span: 4 }],
  [{ id: '5', label: 'Patient’s address', value: '1200 Legacy Dr, Plano TX', span: 5 }, { id: '6', label: 'Relationship to insured', value: '■ Self', span: 3 }, { id: '7', label: 'Insured’s address', value: 'Same', span: 4 }],
  [{ id: '11', label: 'Insured’s policy group', value: 'None', span: 5 }, { id: '14', label: 'Date of current illness', value: '09 12 26', span: 3 }, { id: '17', label: 'Referring provider', value: '—', span: 4 }],
  [{ id: '21', label: 'Diagnosis or nature of illness · ICD Ind. 0', value: <>A. I25.10&nbsp;&nbsp; B. R07.9&nbsp;&nbsp; C. I10</>, span: 6 }, { id: '22', label: 'Resubmission code', value: '—', span: 3 }, { id: '23', label: 'Prior authorization no.', value: 'A-55190', span: 3 }],
];
const COLS: [string, string][] = [['24A', 'Date of service'], ['24B', 'POS'], ['24D', 'CPT / HCPCS · modifier'], ['24E', 'Dx ptr'], ['24F', '$ Charges'], ['24G', 'Units'], ['24J', 'Rendering NPI']];
const LINES = [
  ['09 12 26', '11', '99214  25', 'AB', '186 00', '1', '1234567893'],
  ['09 12 26', '11', '93000', 'A', '74 00', '1', '1234567893'],
  ['09 12 26', '11', '78452', 'A', '1240 00', '1', '1234567893'],
  ['09 12 26', '11', '93015', 'A', '210 00', '1', '1234567893'],
];
const FOOT: B[] = [
  { id: '25', label: 'Federal tax ID', value: '75-•••8213', span: 3 }, { id: '26', label: 'Patient’s account no.', value: 'CLM-24-118406', span: 3 },
  { id: '27', label: 'Accept assignment', value: '■ Yes', span: 2 }, { id: '28', label: 'Total charge', value: '$1,710.00', span: 2 }, { id: '29', label: 'Amount paid', value: '$0.00', span: 2 },
];
const SIGN: B[] = [
  { id: '31', label: 'Signature of physician', value: 'Signature on file', span: 3 }, { id: '32', label: 'Service facility location', value: 'Sample Heart Clinic · Plano TX', span: 4 },
  { id: '33', label: 'Billing provider info · NPI', value: 'Sample Cardiology Group · 1234567893', span: 5 },
];

export function Form({ xray, active, typed }: { xray?: boolean; active: string; typed: boolean }) {
  let k = 0;
  const val = (v: ReactNode) => {
    const i = k++;
    if (xray) return <span className="cx-v [display:block] [margin-top:0.6rem] [font-size:1.55rem] [line-height:1.2] [text-transform:uppercase] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis] [.cx-tr_&]:[margin-top:0] [.cx-form--x_.cx-tr_&]:[flex-shrink:1] [.cx-form--x_.cx-tr_&]:[min-width:0] [.cx-form--x_.cx-box.is-on_&]:[color:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[font-weight:600]">{v}</span>;
    return (
      <motion.span className="cx-v [display:block] [margin-top:0.6rem] [font-size:1.55rem] [line-height:1.2] [text-transform:uppercase] [white-space:nowrap] [overflow:hidden] [text-overflow:ellipsis] [.cx-tr_&]:[margin-top:0] [.cx-form--x_.cx-tr_&]:[flex-shrink:1] [.cx-form--x_.cx-tr_&]:[min-width:0] [.cx-form--x_.cx-box.is-on_&]:[color:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[font-weight:600]" initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={typed ? { opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}}
        transition={{ duration: 0.35, ease: 'linear', delay: 0.9 + i * 0.035 }}>{v}</motion.span>
    );
  };
  const on = (id: string) => (active === id || active === '*' ? 'is-on' : '');
  const box = (b: B) => (
    <div key={b.id} className={String.raw`cx-box [position:relative] [min-width:0] [min-height:6.2rem] [padding:0.8rem_1rem_0.9rem] [border-left:1px_solid_var(--ln)] [transition:background_0.3s] [.cx-row>&:first-child]:[border-left:0] [.cx-tr>&:first-child]:[border-left:0] [&_small]:[display:block] [&_small]:[font-family:var(--f-sans)] [&_small]:[font-size:1.05rem] [&_small]:[line-height:1.25] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.04em] [&_small]:[color:#8a6bff] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_small_b]:[font-weight:700] [&_small_b]:[color:var(--purple)] [.cx-tr_&]:[min-height:4.4rem] [.cx-tr_&]:[padding-block:0.7rem] [.cx-tr.cx-th_&]:[min-height:3.6rem] [.cx-tr.cx-th_&]:[background:rgba(106,_65,_249,_0.05)] [&.is-on]:[background:rgba(106,_65,_249,_0.07)] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[display:flex] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[align-items:center] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[gap:1.2rem] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[display:flex] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[align-items:center] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[gap:1.2rem] [.cx-form--x_&_small_b]:[color:var(--purple)] [.cx-form--x_&_small]:[color:#8a6bff] [.cx-form--x_.cx-tr.cx-th_&]:[background:rgba(106,_65,_249,_0.06)] [.cx-form--x_&.is-on]:[background:rgba(106,_65,_249,_0.14)] ${on(b.id)}`} data-box={b.id} style={{ gridColumn: `span ${b.span}` }}>
      <small><b>{b.id}.</b> {b.label}</small>
      {xray && <em className="cx-tag [position:absolute] [right:0.6rem] [top:0.6rem] [padding:0.2rem_0.8rem] [border-radius:2rem] [background:rgba(138,_107,_255,_0.22)] [color:#e5dcff] [font-family:var(--f-sans)] [font-style:normal] [font-weight:600] [font-size:1.05rem] [white-space:nowrap] [.cx-th_&]:[position:static] [.cx-th_&]:[display:inline-block] [.cx-th_&]:[margin-top:0.4rem] [.cx-form--x_&]:[background:rgba(106,_65,_249,_0.12)] [.cx-form--x_&]:[color:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[background:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[color:#fff] [@media(max-width:_640px)]:[.cx-ring_&]:[display:none] [@media(max-width:_640px)]:[.cx-form--x_&]:[display:none]">{SHORT[BOX[b.id].slug]}</em>}
      {val(b.value)}
    </div>
  );
  return (
    <div className={String.raw`cx-form [--ln:rgba(106,_65,_249,_0.42)] [position:relative] [padding:2.4rem_2.8rem_2.8rem] [background:radial-gradient(rgba(106,_65,_249,_0.05)_1px,_transparent_1px)_#fffdfa] [background-size:0.6rem_0.6rem]! [color:#23243a] [font-family:var(--f-mono)] [user-select:none] ${xray ? String.raw`cx-form--x [height:100%] [--ln:rgba(106,_65,_249,_0.3)]! [background:radial-gradient(rgba(106,_65,_249,_0.09)_1px,_transparent_1px)_#f4f0ff]! [color:#23243a]` : ''}`} aria-hidden={xray}>
      <div className="cx-top [display:flex] [align-items:center] [gap:2rem] [padding-bottom:1.6rem] [border-bottom:2px_solid_var(--purple)] [&_b]:[display:block] [&_b]:[font-family:var(--f-sans)] [&_b]:[font-weight:600] [&_b]:[font-size:2rem] [&_b]:[text-transform:uppercase] [&_b]:[letter-spacing:0.04em] [&_b]:[color:var(--purple)] [&_small]:[font-size:1rem] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.04em] [&_small]:[color:#8a6bff] [.cx-form--x_&]:[border-color:var(--purple)] [.cx-form--x_&_b]:[color:var(--purple)] [.cx-form--x_&_small]:[color:#8a6bff]">
        <span className="cx-1500 [font-family:var(--f-sans)] [font-weight:600] [font-size:4.4rem] [line-height:1] [letter-spacing:-0.1rem] [color:transparent] [-webkit-text-stroke:1.5px_var(--purple)] [.cx-form--x_&]:[-webkit-text-stroke-color:var(--purple)]">1500</span>
        <div><b>Health insurance claim form</b><small>Approved by National Uniform Claim Committee (NUCC) 02/12</small></div>
        <span className="cx-carrier [margin-left:auto] [font-size:1.1rem] [text-transform:uppercase] [letter-spacing:0.08em] [color:#8a6bff] [.cx-form--x_&]:[color:#8a6bff]">Carrier ▸</span>
      </div>
      {ROWS.map((r, i) => <div key={i} className="cx-row [display:grid] [grid-template-columns:repeat(12,_minmax(0,_1fr))] [border-bottom:1px_solid_var(--ln)]">{r.map(box)}</div>)}
      <div className="cx-t [border-bottom:1px_solid_var(--ln)]">
        <div className="cx-tr cx-th [display:grid] [grid-template-columns:11rem_5.6rem_minmax(0,_1fr)_7rem_11rem_6rem_14rem] [border-bottom:1px_dashed_rgba(106,_65,_249,_0.25)] [&:last-child]:[border-bottom:0]">{COLS.map(([id, l]) => <div key={id} className={String.raw`cx-box [position:relative] [min-width:0] [min-height:6.2rem] [padding:0.8rem_1rem_0.9rem] [border-left:1px_solid_var(--ln)] [transition:background_0.3s] [.cx-row>&:first-child]:[border-left:0] [.cx-tr>&:first-child]:[border-left:0] [&_small]:[display:block] [&_small]:[font-family:var(--f-sans)] [&_small]:[font-size:1.05rem] [&_small]:[line-height:1.25] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.04em] [&_small]:[color:#8a6bff] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_small_b]:[font-weight:700] [&_small_b]:[color:var(--purple)] [.cx-tr_&]:[min-height:4.4rem] [.cx-tr_&]:[padding-block:0.7rem] [.cx-tr.cx-th_&]:[min-height:3.6rem] [.cx-tr.cx-th_&]:[background:rgba(106,_65,_249,_0.05)] [&.is-on]:[background:rgba(106,_65,_249,_0.07)] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[display:flex] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[align-items:center] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[gap:1.2rem] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[display:flex] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[align-items:center] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[gap:1.2rem] [.cx-form--x_&_small_b]:[color:var(--purple)] [.cx-form--x_&_small]:[color:#8a6bff] [.cx-form--x_.cx-tr.cx-th_&]:[background:rgba(106,_65,_249,_0.06)] [.cx-form--x_&.is-on]:[background:rgba(106,_65,_249,_0.14)] ${on(id)}`} data-box={id}><small><b>{id}.</b> {l}</small>{xray && <em className="cx-tag [position:absolute] [right:0.6rem] [top:0.6rem] [padding:0.2rem_0.8rem] [border-radius:2rem] [background:rgba(138,_107,_255,_0.22)] [color:#e5dcff] [font-family:var(--f-sans)] [font-style:normal] [font-weight:600] [font-size:1.05rem] [white-space:nowrap] [.cx-th_&]:[position:static] [.cx-th_&]:[display:inline-block] [.cx-th_&]:[margin-top:0.4rem] [.cx-form--x_&]:[background:rgba(106,_65,_249,_0.12)] [.cx-form--x_&]:[color:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[background:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[color:#fff] [@media(max-width:_640px)]:[.cx-ring_&]:[display:none] [@media(max-width:_640px)]:[.cx-form--x_&]:[display:none]">{SHORT[BOX[id].slug]}</em>}</div>)}</div>
        {LINES.map((ln, r) => (
          <div key={r} className="cx-tr [display:grid] [grid-template-columns:11rem_5.6rem_minmax(0,_1fr)_7rem_11rem_6rem_14rem] [border-bottom:1px_dashed_rgba(106,_65,_249,_0.25)] [&:last-child]:[border-bottom:0]">
            {ln.map((v, c) => (
              <div key={c} className={String.raw`cx-box [position:relative] [min-width:0] [min-height:6.2rem] [padding:0.8rem_1rem_0.9rem] [border-left:1px_solid_var(--ln)] [transition:background_0.3s] [.cx-row>&:first-child]:[border-left:0] [.cx-tr>&:first-child]:[border-left:0] [&_small]:[display:block] [&_small]:[font-family:var(--f-sans)] [&_small]:[font-size:1.05rem] [&_small]:[line-height:1.25] [&_small]:[text-transform:uppercase] [&_small]:[letter-spacing:0.04em] [&_small]:[color:#8a6bff] [&_small]:[white-space:nowrap] [&_small]:[overflow:hidden] [&_small]:[text-overflow:ellipsis] [&_small_b]:[font-weight:700] [&_small_b]:[color:var(--purple)] [.cx-tr_&]:[min-height:4.4rem] [.cx-tr_&]:[padding-block:0.7rem] [.cx-tr.cx-th_&]:[min-height:3.6rem] [.cx-tr.cx-th_&]:[background:rgba(106,_65,_249,_0.05)] [&.is-on]:[background:rgba(106,_65,_249,_0.07)] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[display:flex] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[align-items:center] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24D"]]:[gap:1.2rem] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[display:flex] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[align-items:center] [.cx-form--x_.cx-tr:not(.cx-th)_&[data-box="24J"]]:[gap:1.2rem] [.cx-form--x_&_small_b]:[color:var(--purple)] [.cx-form--x_&_small]:[color:#8a6bff] [.cx-form--x_.cx-tr.cx-th_&]:[background:rgba(106,_65,_249,_0.06)] [.cx-form--x_&.is-on]:[background:rgba(106,_65,_249,_0.14)] ${on(COLS[c][0])}`} data-box={COLS[c][0]}>
                {val(v)}
                {xray && (COLS[c][0] === '24D' || COLS[c][0] === '24J') && <em className="cx-tag cx-tag--mid [right:0.6rem] [padding:0.2rem_0.8rem] [border-radius:2rem] [background:rgba(138,_107,_255,_0.22)] [color:#e5dcff] [font-family:var(--f-sans)] [font-style:normal] [font-weight:600] [font-size:1.05rem] [white-space:nowrap] [.cx-th_&]:[position:static] [.cx-th_&]:[display:inline-block] [.cx-th_&]:[margin-top:0.4rem] [top:50%] [position:static] [translate:none] [flex-shrink:0] [.cx-form--x_&]:[background:rgba(106,_65,_249,_0.12)] [.cx-form--x_&]:[color:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[background:var(--purple)] [.cx-form--x_.cx-box.is-on_&]:[color:#fff] [@media(max-width:_640px)]:[.cx-ring_&]:[display:none] [@media(max-width:_640px)]:[.cx-form--x_&]:[display:none]">{SHORT[BOX[COLS[c][0]].slug]}</em>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="cx-row [display:grid] [grid-template-columns:repeat(12,_minmax(0,_1fr))] [border-bottom:1px_solid_var(--ln)]">{FOOT.map(box)}</div>
      <div className="cx-row [display:grid] [grid-template-columns:repeat(12,_minmax(0,_1fr))] [border-bottom:1px_solid_var(--ln)]">{SIGN.map(box)}</div>
    </div>
  );
}

function useNarrow() {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1279px)').matches);
  useEffect(() => { const q = window.matchMedia('(max-width: 1279px)'); const f = () => setM(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, []);
  return m;
}

export type XrayState = { active: string; stop: number; hover: boolean };

export function ClaimXray({ onChange }: { onChange?: (s: XrayState) => void }) {
  const formRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const narrow = useNarrow();
  const [scale, setScale] = useState(1);
  const [formH, setFormH] = useState(900);
  const [typed, setTyped] = useState(false);
  const [hover, setHover] = useState(false);
  const [stop, setStop] = useState(0);
  const [active, setActive] = useState(TOUR[0]);
  // Perf: the idle tour only runs while the hero is on screen
  const inView = useInView(wrapRef, { amount: 0.15 });

  // Lens position / radius (form-local px), springy
  const lx = useMotionValue(560), ly = useMotionValue(380), lr = useMotionValue(0);
  const sx = useSpring(lx, { stiffness: 170, damping: 24, mass: 0.6 });
  const sy = useSpring(ly, { stiffness: 170, damping: 24, mass: 0.6 });
  const sr = useSpring(lr, { stiffness: 120, damping: 20 });
  const clip = useTransform([sx, sy, sr], ([x, y, r]: number[]) => `circle(${r}px at ${x}px ${y}px)`);
  const ringX = useTransform(sx, (v) => v), ringY = useTransform(sy, (v) => v);
  const ringS = useTransform(sr, (r) => r * 2);

  // Fit the form to the stage on small screens
  useLayoutEffect(() => {
    const fit = () => {
      const w = wrapRef.current?.offsetWidth ?? 0; const f = formRef.current?.offsetWidth ?? 1;
      setScale(narrow ? Math.min(1, w / f) : 1);
      setFormH(formRef.current?.offsetHeight ?? 900);
    };
    fit(); window.addEventListener('resize', fit); return () => window.removeEventListener('resize', fit);
  }, [narrow]);

  useEffect(() => { const t = setTimeout(() => setTyped(true), 500); return () => clearTimeout(t); }, []);

  const center = useCallback((id: string) => {
    const f = formRef.current; if (!f) return null;
    if (id === '*') return { x: f.offsetWidth / 2, y: f.offsetHeight / 2, r: Math.hypot(f.offsetWidth, f.offsetHeight) / 2 + 20 };
    const el = f.querySelector<HTMLElement>(`[data-box="${id}"]`); if (!el) return null;
    let x = el.offsetWidth / 2, y = el.offsetHeight / 2, n: HTMLElement | null = el;
    while (n && n !== f) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
    return { x, y, r: Math.max(78, Math.min(130, el.offsetWidth * 0.75)) };
  }, []);

  // Idle tour: one stop per service
  useEffect(() => {
    if (hover || !typed || !inView) return;
    const goTo = (i: number) => {
      const id = TOUR[i]; const c = center(id); if (!c) return;
      lx.set(c.x); ly.set(c.y); lr.set(c.r); setActive(id); setStop(i);
    };
    let i = stop;
    const first = setTimeout(() => goTo(i), 2200);
    const id = setInterval(() => { i = (i + 1) % TOUR.length; goTo(i); }, 2800);
    return () => { clearTimeout(first); clearInterval(id); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, typed, center, inView]);

  // While hovering, re-read the pointer every frame: the form is still flattening out of its tilt,
  // so the lens and the box under the cursor have to follow the moving paper.
  const ptr = useRef<{ x: number; y: number } | null>(null);
  const dirty = useRef(true);
  useEffect(() => {
    if (!hover || narrow) return;
    let raf = 0;
    // Perf: layout reads + hit-testing only while the paper is still flattening (first ~1.3s)
    // or after the pointer / page actually moved — not on every idle frame.
    const settleUntil = performance.now() + 1300;
    const onScroll = () => { dirty.current = true; };
    window.addEventListener('scroll', onScroll, { passive: true });
    const tick = () => {
      const f = formRef.current; const p = ptr.current;
      if (f && p && (dirty.current || performance.now() < settleUntil)) {
        dirty.current = false;
        const rect = f.getBoundingClientRect(); const k = rect.width / f.offsetWidth;
        lx.set((p.x - rect.left) / k); ly.set((p.y - rect.top) / k); lr.set(96);
        const hit = (document.elementFromPoint(p.x, p.y) as Element | null)?.closest('[data-box]')?.getAttribute('data-box');
        if (hit) setActive((a) => (a === hit ? a : hit));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); };
  }, [hover, narrow, lx, ly, lr]);
  const onMove = (e: React.PointerEvent) => { if (e.pointerType !== 'touch') { ptr.current = { x: e.clientX, y: e.clientY }; dirty.current = true; } };
  const onTap = (e: React.MouseEvent) => {
    const hit = (e.target as Element).closest('[data-box]')?.getAttribute('data-box');
    if (!hit) return;
    if (narrow) { const c = center(hit); if (c) { lx.set(c.x); ly.set(c.y); lr.set(c.r); setActive(hit); setHover(true); } return; }
    go(`/services/${BOX[hit].slug}`);
  };

  useEffect(() => { onChange?.({ active, stop, hover: hover && !narrow }); }, [active, stop, hover, narrow, onChange]);
  const tilt = hover && !narrow ? { rotateY: 0, rotateX: 0, rotateZ: 0, x: 0 } : narrow ? { rotateY: 0, rotateX: 0, rotateZ: 0, x: 0 } : { rotateY: -18, rotateX: 9, rotateZ: 2.5, x: 30 };

  return (
    <div className="cx [position:relative]" ref={wrapRef}>
      <div className="cx-stage [position:relative] [height:80rem] [perspective:220rem] [perspective-origin:30%_40%] [@media(max-width:_1279px)]:[perspective:none]" style={narrow ? { height: formH * scale } : undefined}>
        <motion.div className="cx-tilt [position:absolute] [left:0] [top:2rem] [transform-style:preserve-3d] [will-change:transform] [cursor:crosshair] [@media(max-width:_1279px)]:[top:0] [@media(max-width:_1279px)]:[cursor:pointer]" style={{ scale, transformOrigin: narrow ? '0 0' : '40% 50%' }}
          initial={{ opacity: 0, y: 60, rotateY: -30, rotateX: 20 }} animate={{ opacity: 1, y: 0, ...tilt }}
          transition={{ type: 'spring', stiffness: 70, damping: 18, mass: 1, opacity: { duration: 0.8 } }}
          onPointerEnter={(e) => { if (e.pointerType !== 'touch') setHover(true); }} onPointerLeave={() => { if (!narrow) setHover(false); }}
          onPointerMove={onMove} onClick={onTap}>
          <div className="cx-paper [position:relative] [width:92rem] [border-radius:1.6rem] [overflow:hidden] [box-shadow:0_5rem_12rem_-2rem_rgba(57,_28,_160,_0.28),_0_0.6rem_1.6rem_rgba(57,_28,_160,_0.08)] [.cf_&]:[box-shadow:0_4rem_10rem_-2rem_rgba(57,_28,_160,_0.3)]" ref={formRef}>
            <Form active={active} typed={typed} />
            <motion.div className="cx-xwrap [position:absolute] [inset:0] [pointer-events:none] [will-change:clip-path]" style={{ clipPath: clip, WebkitClipPath: clip }} aria-hidden><Form xray active={active} typed /></motion.div>
            <motion.span className="cx-ring [position:absolute] [left:0] [top:0] [translate:-50%_-50%] [border-radius:50%] [border:2px_solid_rgba(255,_255,_255,_0.9)] [pointer-events:none] [@media(prefers-reduced-motion:_reduce)]:[display:none] [border-color:var(--purple)]! [box-shadow:0_0_0_4px_rgba(255,_255,_255,_0.85),_0_1.2rem_4rem_rgba(106,_65,_249,_0.3),_inset_0_0_2rem_rgba(106,_65,_249,_0.12)]" style={{ x: ringX, y: ringY, width: ringS, height: ringS }} aria-hidden />
          </div>
        </motion.div>
      </div>

    </div>
  );
}


/** The x-ray readout: which box the lens is on and which service owns it. */
export function XrayReadout({ active, stop, hover, className = '', steps = TOUR, label, override }: XrayState & { className?: string; steps?: string[]; label?: string; override?: Info }) {
  const info = override ?? BOX[active];
  return (
    <div className={String.raw`cx-read w-glass [border-radius:2.17rem] [border:1.5px_solid_rgba(255,_255,_255,_0.7)] [background:linear-gradient(168deg,_rgba(255,_255,_255,_0.85)_8%,_rgba(242,_240,_255,_0.74)_92%)] [box-shadow:0_1.55rem_4.66rem_rgba(128,_70,_251,_0.35),_inset_0_1.5px_0_rgba(255,_255,_255,_0.9)] [backdrop-filter:blur(2.5rem)] [font-family:var(--f-man)] [z-index:5] [padding:2.4rem_2.6rem] [color:#0d0c15] [&_p]:[margin-top:0.8rem] [&_p]:[font-family:var(--f-sans)] [&_p]:[font-size:1.6rem] [&_p]:[line-height:1.5] [&_p]:[color:#4a4f63] [&_p]:[min-height:4.8rem] [position:relative] [left:auto] [bottom:auto] [width:100%] [max-width:52rem] [margin-top:1.2rem] ${className}`} aria-live="polite">
      <div className="cx-read__top [display:flex] [justify-content:space-between] [align-items:center] [gap:1.6rem] [margin-bottom:1.4rem] [font-family:var(--f-mono)] [font-size:1.15rem] [text-transform:uppercase] [letter-spacing:0.06em] [color:#6b6f7c] [&>span:first-child]:[display:inline-flex] [&>span:first-child]:[align-items:center] [&>span:first-child]:[gap:0.6rem] [@media(max-width:_640px)]:[flex-direction:column] [@media(max-width:_640px)]:[align-items:flex-start] [@media(max-width:_640px)]:[gap:0.8rem] [@media(max-width:_640px)]:[&>span:first-child]:[white-space:nowrap]">
        <span><ScanSearch size={15} /> {hover ? 'X-ray · following your cursor' : label ?? 'X-ray · one stop per service'}</span>
        <span className="cx-read__n [display:flex] [gap:0.4rem] [&_i]:[width:1.2rem] [&_i]:[height:0.4rem] [&_i]:[border-radius:1rem] [&_i]:[background:rgba(106,_65,_249,_0.18)] [&_i]:[transition:background_0.3s,_width_0.3s]">{steps.length > 1 && steps.map((id, i) => <i key={id} className={!hover && i === stop ? String.raw`is-on [.assess\_\_steps_span&]:[color:var(--navy)] [.assess\_\_steps_span&_b]:[background:var(--purple)] [.assess\_\_steps_span&_b]:[border-color:var(--purple)] [.assess\_\_steps_span&_b]:[color:#fff] [.assess\_\_steps_i&::after]:[transform:scaleX(1)] [.cx-read\_\_n_i&]:[width:2.4rem] [.cx-read\_\_n_i&]:[background:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.hw2\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[background:#fff] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[color:var(--purple)] [@media(max-width:_1279px)]:[.jyt\_\_tabs_button&]:[box-shadow:0_0.4rem_1.2rem_rgba(106,_65,_249,_0.14)] [.sg\_\_toc_button&]:[color:var(--purple)] [.sg\_\_toc_button&]:[border-left-color:var(--purple)] [.pg\_\_toc_button&]:[color:#fff] [.pg\_\_toc_button&_small]:[color:rgba(255,_255,_255,_0.7)] [.pg\_\_dots_i&]:[width:2.4rem] [.pg\_\_dots_i&]:[background:var(--purple)] [.stfd\_\_tabs_button&]:[color:#fff] [.se\_\_dots_i&]:[width:6.4rem] [.sw-anes\_\_bar_i&]:[background:var(--grad)] [.sw-body_circle&]:[fill:var(--purple)] [.sw-vial\_\_body_i&]:[background:var(--grad)] [.sw-vial\_\_body_i&_small]:[color:#fff] [.sw-wound\_\_grid_i&]:[background:#c9b8ff] [.sw-wound\_\_grid_i&]:[border-color:transparent] [.sw-cal_i&]:[background:var(--purple)] [.sw-cal_i&]:[color:#fff] [.sw-wells_i&]:[background:#e2d9ff] [.sw-wells_i&]:[border-color:#c9b8ff] [.sw-shot_i&]:[background:var(--purple)] [.sw-shot_i&]:[border-color:var(--purple)] [.lf\_\_seg_button&]:[color:#fff] [.tc\_\_why_li&]:[opacity:1] [.sl\_\_tabs_button&]:[color:#fff] [.ar\_\_toc_a&]:[color:var(--ink-2)] [.ct-needs_button&]:[color:#fff] [.wa\_\_zones_li&]:[background:var(--grad)] [.wa\_\_zones_li&]:[border-color:transparent] [.wa\_\_zones_li&_small]:[color:#fff] [.wa\_\_zones_li&_b]:[color:#fff] [.wa\_\_zones_li&_em]:[color:#fff] [.se\_\_dots_i&]:[background:var(--purple)] [.ct-needs_button&]:[background:var(--grad)] [.ct-needs_button&]:[border-color:transparent] [.sc-cal_i&]:[background:var(--purple)] [.sc-cal_i&]:[color:#fff] [.ccp_button&]:[background:var(--purple)] [.ccp_button&]:[color:#fff] [.pa-art\_\_seg_button&]:[background:var(--grad)] [.pa-art\_\_seg_button&]:[color:#fff] [.pa-art\_\_steps_li&]:[background:var(--purple)] [.pa-art\_\_steps_li&]:[border-color:var(--purple)] [.pa-art\_\_steps_li&]:[color:#fff] [.ab-orbit\_\_rings_line&]:[stroke:var(--purple)] [.ab-orbit\_\_rings_line&]:[stroke-width:2]` : ''} />)}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3, ease: ease.out }}>
          <small className="cx-read__box [display:block] [font-family:var(--f-mono)] [font-size:1.25rem] [text-transform:uppercase] [letter-spacing:0.04em] [color:var(--purple)]">{active === '*' ? 'Every box' : `Box ${active}`} · {info.title}</small>
          <b className="cx-read__svc [display:block] [margin-top:0.6rem] [font-weight:500] [font-size:3rem] [line-height:1.1] [letter-spacing:-0.06rem] [color:var(--ink-2)] [@media(max-width:_640px)]:[font-size:2.6rem]">{svcName(info.slug)}</b>
          <p>{info.line}</p>
          <Link to={`/services/${info.slug}`} className="cx-read__go [display:inline-flex] [align-items:center] [gap:0.6rem] [margin-top:1.2rem] [font-weight:500] [font-size:1.6rem] [color:var(--purple)]">View service <ArrowRight size={16} /></Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
