/**
 * Signature hero widgets: one per specialty, each showing the thing that specialty is actually paid by
 * (minutes, units, levels, lesions, visits, eyes, specimens…). They share the glass card shell of the
 * cardiology beat strip, loop slowly while on screen, and pause off screen.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Check } from 'lucide-react';

/** Step counter that only runs while the widget is on screen. */
function useTick(n: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { amount: 0.2 });
  const [k, setK] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setK((v) => (v + 1) % n), ms);
    return () => clearInterval(id);
  }, [on, n, ms]);
  return { ref, k };
}

function Shell({ wref, label, value, unit, children, lines }: {
  wref: React.RefObject<HTMLDivElement>; label: string; value: ReactNode; unit?: string; children: ReactNode;
  lines: [string, string, boolean][];
}) {
  return (
    <div className="ecg w-card w-glass sw" ref={wref}>
      <div className="ecg__head"><span><i />{label}</span><b>{value}{unit && <small> {unit}</small>}</b></div>
      <div className="sw__viz">{children}</div>
      <ul className="ecg__rows">
        {lines.map(([code, what, on]) => (
          <li key={code + what}>
            <code>{code}</code><span>{what}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.em key={on ? 'y' : 'n'} className={on ? 'is-ok' : ''} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.25 }}>
                {on ? <><Check size={13} strokeWidth={3} /> Coded</> : 'In review'}
              </motion.em>
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Mental health: the session clock picks the code ---------- */
function Session() {
  const { ref, k } = useTick(62, 140); // minutes 0..61
  const m = k;
  const code = m >= 53 ? '90837' : m >= 38 ? '90834' : m >= 16 ? '90832' : '—';
  const R = 52, C = 2 * Math.PI * R;
  return (
    <Shell wref={ref} label="Telehealth session, live" value={m} unit="min" lines={[['90832', '16–37 min', m >= 16 && m < 38], ['90834', '38–52 min', m >= 38 && m < 53], ['90837', '53+ min', m >= 53]]}>
      <div className="sw-clock">
        <svg viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={R} className="sw-track" />
          {[16, 38, 53].map((t) => { const a = (t / 60) * 2 * Math.PI - Math.PI / 2; return <line key={t} x1={65 + Math.cos(a) * 44} y1={65 + Math.sin(a) * 44} x2={65 + Math.cos(a) * 60} y2={65 + Math.sin(a) * 60} className="sw-mark" />; })}
          <circle cx="65" cy="65" r={R} className="sw-arc" strokeDasharray={C} strokeDashoffset={C * (1 - Math.min(m, 60) / 60)} transform="rotate(-90 65 65)" />
        </svg>
        <div className="sw-clock__code"><small>Bills as</small><b>{code}</b><em>POS 10 · 95</em></div>
      </div>
    </Shell>
  );
}

/* ---------- Psychiatry: med management + therapy minutes, side by side ---------- */
function SplitVisit() {
  const { ref, k } = useTick(48, 160); // therapy minutes 0..47
  const add = k >= 38 ? '90836' : k >= 16 ? '90833' : '—';
  return (
    <Shell wref={ref} label="Med visit + therapy" value={k} unit="therapy min" lines={[['99214', 'Med management, MDM', true], ['90833', 'Therapy add-on, 16–37', k >= 16 && k < 38], ['90836', 'Therapy add-on, 38–52', k >= 38]]}>
      <div className="sw-split">
        <div className="sw-split__a"><small>E/M · on MDM</small></div>
        <motion.div className="sw-split__b" animate={{ width: `${(k / 52) * 62}%` }} transition={{ duration: 0.15, ease: 'linear' }}><small>Therapy</small></motion.div>
        <span className="sw-split__line" style={{ left: `${38 + (16 / 52) * 62}%` }}>16</span>
        <span className="sw-split__line" style={{ left: `${38 + (38 / 52) * 62}%` }}>38</span>
      </div>
      <p className="sw-note">Add-on: <b>{add}</b></p>
    </Shell>
  );
}

/* ---------- Anesthesia: base units + 15-minute time units ---------- */
function AnesRecord() {
  const { ref, k } = useTick(10, 900); // quarter hours
  const mins = k * 15 + 8;
  const tu = Math.ceil(mins / 15 * 10) / 10;
  return (
    <Shell wref={ref} label="Anesthesia record · TKA" value={(7 + tu).toFixed(1)} unit="units" lines={[['01402', 'Base 7 units', true], ['QK / QX', 'Care team, 1:3', k > 2], ['P3', 'Physical status', k > 4]]}>
      <div className="sw-anes">
        <div className="sw-anes__bar">
          {Array.from({ length: 9 }, (_, i) => <i key={i} className={i < k ? 'is-on' : ''} />)}
          <span className="sw-anes__start">Start 7:42</span>
          <span className="sw-anes__now" style={{ left: `${(k / 9) * 100}%` }}>{mins} min</span>
        </div>
        <p className="sw-note">Base 7 + time {tu.toFixed(1)} units</p>
      </div>
    </Shell>
  );
}

/* ---------- Radiology: ordered vs performed vs authorized ---------- */
function ScanMatch() {
  const { ref, k } = useTick(4, 1500);
  const st = ['Ordered 70551', 'Contrast added', 'Auth → 70553', 'Matched'][k];
  return (
    <Shell wref={ref} label="MRI brain · study vs auth" value={k >= 3 ? 'Match' : 'Check'} lines={[['70553', 'MRI brain, w/ + w/o', k >= 1], ['A9579', 'Gadolinium, 15 ml', k >= 1], ['AUTH', 'Updated to 70553', k >= 2]]}>
      <div className="sw-scan">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} className={`sw-scan__slice ${k >= 1 && i >= 3 ? 'is-contrast' : ''}`}><i style={{ scale: `${0.55 + (i % 3) * 0.15}` }} /></span>
        ))}
        <p className="sw-scan__st">{st}</p>
      </div>
    </Shell>
  );
}

/* ---------- Pathology: one unit per jar ---------- */
function Jars() {
  const { ref, k } = useTick(5, 1100);
  const jars = [['A', 'Antrum'], ['B', 'Body'], ['C', 'Duodenum']];
  return (
    <Shell wref={ref} label="Case SP-04471 · GI biopsies" value={Math.min(k, 3)} unit="× 88305" lines={[['88305', 'Per specimen', k >= 3], ['88342', 'IHC, first antibody', k >= 4], ['88341', 'Added antibody, same jar', k >= 4]]}>
      <div className="sw-jars">
        {jars.map(([l, n], i) => (
          <div key={l} className={`sw-jar ${k > i ? 'is-on' : ''}`}><span className="sw-jar__lid" /><b>{l}</b><small>{n}</small>{k > i && <em><Check size={11} strokeWidth={3} /></em>}</div>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- Dermatology: lesions counted on a body map ---------- */
const LESIONS = [[50, 22], [44, 30], [57, 31], [40, 42], [61, 44], [47, 50], [54, 54], [38, 60], [62, 62], [50, 68], [45, 76], [56, 80]];
function BodyMap() {
  const { ref, k } = useTick(LESIONS.length + 3, 450);
  const n = Math.min(k, LESIONS.length);
  return (
    <Shell wref={ref} label="Skin check · AKs treated" value={n} unit="lesions" lines={[['17000', 'First lesion', n >= 1], ['17003', `Lesions 2–14 × ${Math.max(0, Math.min(n, 14) - 1)}`, n >= 2], ['17004', '15 or more instead', false]]}>
      <div className="sw-body">
        <svg viewBox="26 2 48 96" aria-hidden>
          <path className="sw-body__fig" d="M50 6 a8 8 0 1 1 0.01 0 M38 24 Q50 18 62 24 L68 52 L62 54 L60 36 L60 94 L53 94 L51 62 L49 62 L47 94 L40 94 L40 36 L38 54 L32 52 Z" />
          {LESIONS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i < n ? 2.2 : 1.4} className={i < n ? 'is-on' : ''} />)}
        </svg>
      </div>
    </Shell>
  );
}

/* ---------- Ophthalmology: which eye ---------- */
function Eyes() {
  const { ref, k } = useTick(4, 1300);
  const side = k % 2 === 0 ? 'RT' : 'LT';
  return (
    <Shell wref={ref} label="Retina clinic · injection day" value={side} lines={[['92134', 'OCT, both eyes · 1 unit', true], ['67028', `Injection, ${side}`, true], ['J0178', 'Aflibercept 2 mg · JZ', k >= 1]]}>
      <div className="sw-eyes">
        {['OD', 'OS'].map((e, i) => (
          <div key={e} className={`sw-eye ${(i === 0) === (side === 'RT') ? 'is-on' : ''}`}><span><i /></span><small>{e} · {i === 0 ? 'RT' : 'LT'}</small></div>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- Pain: spinal levels ---------- */
function Spine() {
  const { ref, k } = useTick(5, 1100);
  const lv = ['L1', 'L2', 'L3', 'L4', 'L5', 'S1'];
  const lit = k >= 1 ? (k >= 2 ? [3, 4] : [3]) : [];
  return (
    <Shell wref={ref} label="TFESI · lumbar" value={lit.length} unit={lit.length === 1 ? 'level' : 'levels'} lines={[['64483', 'First level, bilateral (50)', k >= 1], ['64484', 'Each added level', k >= 2], ['77003', 'Fluoro: included', k >= 3]]}>
      <div className="sw-spine">
        {lv.map((l, i) => (
          <div key={l} className={`sw-vert ${lit.includes(i) ? 'is-on' : ''}`}>
            <i className="sw-vert__l" /><span>{l}</span><i className="sw-vert__r" />
          </div>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- Podiatry: toes and their modifiers ---------- */
function Foot() {
  const { ref, k } = useTick(7, 700);
  const toes = [['T5', 22], ['T6', 18], ['T7', 15], ['T8', 13], ['T9', 11]];
  return (
    <Shell wref={ref} label="Routine foot care · right foot" value={Math.min(k, 5)} unit="nails" lines={[['11721', 'Nails 6+, both feet', k >= 5], ['Q8', 'Two class B findings', k >= 6], ['11056', 'Calluses 2–4, Q8', k >= 6]]}>
      <div className="sw-foot">
        {toes.map(([t, s], i) => (
          <div key={t} className={`sw-toe ${k > i ? 'is-on' : ''}`} style={{ width: `${(s as number) / 4.4}rem`, height: `${(s as number) / 4.4}rem` }}><small>{t}</small></div>
        ))}
        <div className="sw-foot__sole" />
      </div>
    </Shell>
  );
}

/* ---------- Urology: units of a fixed-dose drug ---------- */
function Vial() {
  const { ref, k } = useTick(5, 900);
  const u = Math.min(k, 3);
  return (
    <Shell wref={ref} label="Leuprolide · 3-month dose" value={u} unit="× J9217" lines={[['J9217', '7.5 mg per unit', u >= 3], ['JZ', 'Nothing discarded', k >= 4], ['96402', 'Hormonal injection', k >= 4]]}>
      <div className="sw-vial">
        <div className="sw-vial__body">{[0, 1, 2].map((i) => <i key={i} className={i < u ? 'is-on' : ''}><small>7.5 mg</small></i>)}</div>
        <p className="sw-note">22.5 mg = <b>{u} units</b></p>
      </div>
    </Shell>
  );
}

/* ---------- Wound care: measured area ---------- */
function Wound() {
  const { ref, k } = useTick(6, 900);
  const L = Math.min(k, 4), W = Math.min(Math.max(k - 1, 0), 3);
  const area = L * W;
  return (
    <Shell wref={ref} label="Plantar ulcer · measured" value={area} unit="cm²" lines={[['15275', 'Skin sub, foot, first 25 cm²', k >= 4], ['Q41xx', `Applied ${area} cm²`, k >= 4], ['JW', 'Wasted cm² reported', k >= 5]]}>
      <div className="sw-wound">
        <div className="sw-wound__grid">{Array.from({ length: 30 }, (_, i) => <i key={i} className={(i % 6) < L && Math.floor(i / 6) < W ? 'is-on' : ''} />)}</div>
        <p className="sw-note">{L} cm × {W} cm</p>
      </div>
    </Shell>
  );
}

/* ---------- Nephrology: visits in the month set the tier ---------- */
function Month() {
  const { ref, k } = useTick(6, 900);
  const visits = [3, 10, 17, 24].slice(0, Math.min(k, 4));
  const code = visits.length >= 4 ? '90960' : visits.length >= 2 ? '90961' : visits.length === 1 ? '90962' : '—';
  return (
    <Shell wref={ref} label="ESRD month · in-center" value={code} lines={[['90962', '1 visit', visits.length === 1], ['90961', '2–3 visits', visits.length >= 2 && visits.length < 4], ['90960', '4+ visits', visits.length >= 4]]}>
      <div className="sw-cal">{Array.from({ length: 28 }, (_, i) => <i key={i} className={visits.includes(i + 1) ? 'is-on' : ''}>{i + 1}</i>)}</div>
    </Shell>
  );
}

/* ---------- Neurology: EEG channels + Botox vial ---------- */
function Neuro() {
  const { ref, k } = useTick(4, 1200);
  return (
    <Shell wref={ref} label="Botox for migraine · 200 u vial" value={k >= 2 ? 155 : 0} unit="u injected" lines={[['64615', 'Chemodenervation', k >= 1], ['J0585', '155 units injected', k >= 2], ['J0585-JW', '45 units discarded', k >= 3]]}>
      <div className="sw-neuro">
        <svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden>
          {[10, 25, 40, 55].map((y, i) => <path key={i} className="sw-eeg" style={{ animationDelay: `${i * 0.3}s` }} d={`M0 ${y} ` + Array.from({ length: 15 }, (_, j) => `Q ${j * 20 + 5} ${y + ((j + i) % 2 ? -6 : 6)} ${j * 20 + 10} ${y} T ${j * 20 + 20} ${y}`).join(' ')} />)}
        </svg>
        <div className="sw-neuro__vial"><i style={{ width: k >= 2 ? '77.5%' : '0%' }} /><em style={{ width: k >= 3 ? '22.5%' : '0%' }} /></div>
        <p className="sw-note">Used 155 · wasted 45 (JW)</p>
      </div>
    </Shell>
  );
}

/* ---------- Oncology: infusion hierarchy ---------- */
function Infusion() {
  const { ref, k } = useTick(5, 1000);
  const bags = [['Chemo', 'Pembrolizumab · 35 min', '96413', 1], ['Push', 'Premed, sequential', '96375', 2], ['Hydration', 'Concurrent', '—', 3]];
  return (
    <Shell wref={ref} label="Infusion chair 4 · today" value={k >= 3 ? 'Ranked' : 'Ranking'} lines={[['96413', 'Chemo first, by rule', k >= 1], ['J9271', '200 units, JZ', k >= 3], ['96375', 'Sequential push', k >= 2]]}>
      <div className="sw-inf">
        {bags.map(([t, d, c, r], i) => (
          <div key={t as string} className={`sw-inf__row ${k > i ? 'is-on' : ''}`}><b>{r}</b><span><strong>{t}</strong><small>{d}</small></span><code>{c}</code></div>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- GI: screening turns therapeutic ---------- */
function Colon() {
  const { ref, k } = useTick(5, 1000);
  return (
    <Shell wref={ref} label="Screening colonoscopy · Medicare" value={k >= 2 ? 'PT' : 'Screen'} lines={[['45385', 'Snare, sigmoid · PT', k >= 2], ['45380', 'Biopsy, other lesion · PT XS', k >= 3], ['Z12.11', 'Screening dx first', k >= 4]]}>
      <div className="sw-colon">
        <svg viewBox="0 0 300 90" aria-hidden>
          <path className="sw-colon__path" d="M20 80 L20 20 Q20 10 30 10 L270 10 Q280 10 280 20 L280 60 Q280 80 260 80 L180 80" />
          <motion.circle r="5" className="sw-colon__scope" animate={{ offsetDistance: `${Math.min(k, 4) * 25}%` }} style={{ offsetPath: 'path("M20 80 L20 20 Q20 10 30 10 L270 10 Q280 10 280 20 L280 60 Q280 80 260 80 L180 80")' }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
          {[[150, 10], [280, 48]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={k >= i + 2 ? 7 : 4} className={`sw-colon__polyp ${k >= i + 2 ? 'is-on' : ''}`} />)}
        </svg>
      </div>
    </Shell>
  );
}

/* ---------- Allergy: prick test wells become units ---------- */
function Wells() {
  const { ref, k } = useTick(10, 350);
  const n = Math.min(40, k * 5);
  return (
    <Shell wref={ref} label="Percutaneous panel · new patient" value={n} unit="units" lines={[['95004', `Tests × ${n}`, n >= 40], ['95024', 'Intradermal × 10', n >= 40], ['99204-25', 'New patient visit', n >= 40]]}>
      <div className="sw-wells">{Array.from({ length: 40 }, (_, i) => <i key={i} className={i < n ? (i % 7 === 2 || i % 11 === 5 ? 'is-pos' : 'is-on') : ''} />)}</div>
    </Shell>
  );
}

/* ---------- OB/GYN: 40 weeks, visits, a transfer ---------- */
function Weeks() {
  const { ref, k } = useTick(10, 600);
  const visits = [8, 12, 16, 20, 24, 26, 28, 30].slice(0, Math.min(k, 8));
  return (
    <Shell wref={ref} label="Prenatal record · transfer at 30 wks" value={visits.length} unit="visits" lines={[['59425', '4–6 visits', visits.length >= 4 && visits.length < 7], ['59426', '7+ visits', visits.length >= 7], ['59400', 'Global (we didn’t deliver)', false]]}>
      <div className="sw-weeks">
        <div className="sw-weeks__bar"><i style={{ width: `${(Math.max(...visits, 0) / 40) * 100}%` }} /></div>
        {visits.map((w) => <span key={w} className="sw-weeks__dot" style={{ left: `${(w / 40) * 100}%` }} />)}
        <span className="sw-weeks__xfer" style={{ left: '75%' }}>Transfer</span>
        <div className="sw-weeks__ticks"><small>0</small><small>13</small><small>27</small><small>40 wks</small></div>
      </div>
    </Shell>
  );
}

/* ---------- ASC: the day's board, every case approved ---------- */
function Board() {
  const { ref, k } = useTick(6, 800);
  const cases = [['7:30', '29881', 'Knee scope'], ['9:00', '66984', 'Cataract, LT'], ['10:30', '64483', 'Epidural'], ['12:00', '63650', 'Neurostim trial']];
  return (
    <Shell wref={ref} label="OR board · today" value={Math.min(k, 4)} unit="/ 4 approved" lines={[['29881-RT', 'Auth matched', k >= 1], ['G0289', 'Other compartment', k >= 2], ['C1778', 'Device listed', k >= 4]]}>
      <div className="sw-board">
        {cases.map(([t, c, d], i) => (
          <div key={c} className={`sw-board__row ${k > i ? 'is-on' : ''}`}><small>{t}</small><code>{c}</code><span>{d}</span><em>{k > i ? 'Approved' : 'Pending'}</em></div>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- Orthopedics: the 90-day global ---------- */
function Global() {
  const { ref, k } = useTick(10, 600);
  const d = Math.min(90, k * 10);
  return (
    <Shell wref={ref} label="Total knee · global period" value={d} unit="/ 90 days" lines={[['27447', 'TKA, auth on file', true], ['99024', 'Post-op, no charge', d >= 14], ['99214-24', 'Unrelated problem, billable', d >= 60]]}>
      <div className="sw-global">
        <div className="sw-global__bar"><i style={{ width: `${(d / 90) * 100}%` }} /></div>
        {[14, 42, 84].map((v) => <span key={v} className={`sw-global__visit ${d >= v ? 'is-on' : ''}`} style={{ left: `${(v / 90) * 100}%` }}>99024</span>)}
        <span className={`sw-global__unrel ${d >= 60 ? 'is-on' : ''}`} style={{ left: `${(60 / 90) * 100}%` }}>-24</span>
      </div>
    </Shell>
  );
}

/* ---------- Internal medicine: one visit, every add-on ---------- */
function AddOns() {
  const { ref, k } = useTick(5, 1000);
  const chips: [string, string][] = [['G0439', 'AWV'], ['99214-25', 'Problem visit'], ['G2211', 'Complexity'], ['99497-33', 'ACP, no copay']];
  return (
    <Shell wref={ref} label="Wellness + problem visit" value={Math.min(k, 4)} unit="lines" lines={[['G0439', '12 months since last', k >= 1], ['99214-25', 'Separate work', k >= 2], ['G2211', 'Allowed with AWV pair', k >= 3]]}>
      <div className="sw-chips">
        {chips.map(([c, d], i) => (
          <motion.span key={c} className={`sw-chip ${k > i ? 'is-on' : ''}`} animate={{ y: k > i ? 0 : 8, opacity: k > i ? 1 : 0.35 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}><code>{c}</code><small>{d}</small></motion.span>
        ))}
      </div>
    </Shell>
  );
}

/* ---------- Pediatrics: vaccines and their components ---------- */
function Shots() {
  const { ref, k } = useTick(10, 450);
  const vac: [string, number][] = [['DTaP-IPV-Hib-HepB', 4], ['MMR', 3], ['Varicella', 1], ['Hep A', 1]];
  let left = k;
  return (
    <Shell wref={ref} label="Age-2 checkup · vaccines" value={Math.min(k, 9)} unit="components" lines={[['90460', 'Per vaccine × 4', k >= 4], ['90461', 'Added components × 5', k >= 9], ['VFC · SL', 'Admin only', k >= 9]]}>
      <div className="sw-shots">
        {vac.map(([n, c]) => {
          const on = Math.max(0, Math.min(c, left)); left -= c;
          return <div key={n} className="sw-shot"><span>{n}</span><div>{Array.from({ length: c }, (_, i) => <i key={i} className={i < on ? 'is-on' : ''} />)}</div></div>;
        })}
      </div>
    </Shell>
  );
}

/* ---------- Urgent care: door to claim ---------- */
function DoorToClaim() {
  const { ref, k } = useTick(6, 900);
  const st = [['Check-in', '6:02 pm'], ['Triage', '6:09'], ['Provider', '6:21'], ['Discharged', '6:58'], ['Claim out', '7:14']];
  return (
    <Shell wref={ref} label="Door to claim · Room 3" value={k >= 5 ? '72' : '—'} unit="min" lines={[['99213-25', 'Wrist workup, separate', k >= 3], ['12002', 'Repairs summed, 3.5 cm', k >= 3], ['POS 20', 'Itemized per contract', k >= 5]]}>
      <div className="sw-flow">
        {st.map(([s, t], i) => (
          <div key={s} className={`sw-flow__st ${k > i ? 'is-on' : ''}`}><i /><b>{s}</b><small>{t}</small></div>
        ))}
      </div>
    </Shell>
  );
}

export const SIGNATURE: Record<string, () => JSX.Element> = {
  'mental-health': Session, psychiatry: SplitVisit, anesthesia: AnesRecord, radiology: ScanMatch, pathology: Jars,
  dermatology: BodyMap, ophthalmology: Eyes, 'pain-management': Spine, podiatry: Foot, urology: Vial, 'wound-care': Wound,
  nephrology: Month, neurology: Neuro, oncology: Infusion, gastroenterology: Colon, 'allergy-and-immunology': Wells,
  'obstetrics-and-gynecology': Weeks, 'ambulatory-surgery-centers': Board, orthopedics: Global, 'internal-medicine': AddOns,
  pediatrics: Shots, 'urgent-care': DoorToClaim,
};
