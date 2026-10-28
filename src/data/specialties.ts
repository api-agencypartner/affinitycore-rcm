/**
 * Specialty content (Framer: CMS collection "Specialties").
 *
 * Every specialty in the nav has "lite" data used on the Specialties overview:
 * group, two signature codes, a "watch for" note and the billing rules that hit it.
 * Specialties with a full page (`page`) also carry the template content.
 *
 * Codes and rules are public CPT / HCPCS / CMS conventions. Anything that describes
 * Affinity Core's own scope or team is marked [Confirm with Affinity Core].
 */
import type { LucideIcon } from 'lucide-react';
import {
  Scissors, Flower2, Ribbon, Brain, Salad, Radiation, Droplets, Bandage, BrainCircuit, Microscope, Pill, Footprints,
  HeartPulse, Eye, Siren, Droplet, Stethoscope, Activity, Venus, Baby, Syringe, Bone, ScanFace,
} from 'lucide-react';
import type { ServiceFull } from './services';

const CONFIRM = '[Confirm with Affinity Core]';

export type RuleId = 'auth' | 'time' | 'global' | 'mod25' | 'split' | 'drugs';

export const RULES: { id: RuleId; label: string; chip: string; short: string; why: string }[] = [
  { id: 'auth', label: 'Prior authorization', chip: 'Prior auth', short: 'Prior auth', why: 'No approval on file, no payment. Imaging, infusions and elective procedures are where it bites hardest.' },
  { id: 'time', label: 'Time-based codes', chip: 'Time-based codes', short: 'Time', why: 'The code depends on minutes documented. A few minutes either side changes the code, and the payment.' },
  { id: 'global', label: 'Global surgical periods', chip: 'Global periods', short: 'Global period', why: 'Follow-up care is already paid inside the procedure for 0, 10 or 90 days. Billing it again gets denied.' },
  { id: 'mod25', label: 'Same-day visit + procedure', chip: 'Same-day visit + procedure', short: 'Modifier 25', why: 'A visit on the same day as a procedure is paid only when it is separately documented and flagged with modifier 25.' },
  { id: 'split', label: 'Professional / technical split', chip: 'Pro / tech split', short: '26 / TC', why: 'When one party reads the study and another owns the equipment, each bills only its own component.' },
  { id: 'drugs', label: 'Drug and supply units', chip: 'Drug units', short: 'Drug units', why: 'Drugs are billed in HCPCS units with NDCs and waste modifiers. Units that don’t match the vial are underpaid or denied.' },
];

export const GROUPS = ['Primary & urgent', 'Medical specialties', 'Surgical & procedural', 'Behavioral health', 'Hospital-based & diagnostic'] as const;
export type Group = (typeof GROUPS)[number];

export type SpecialtyLite = {
  slug: string;
  name: string;
  group: Group;
  icon: LucideIcon;
  codes: [string, string][];
  watch: string;
  rules: Partial<Record<RuleId, string>>;
  page?: boolean;
};

export const SPECIALTIES: SpecialtyLite[] = [
  /* ---- Primary & urgent ---- */
  { slug: 'internal-medicine', name: 'Internal Medicine', group: 'Primary & urgent', icon: Stethoscope,
    codes: [['99214', 'Office visit, established, moderate'], ['G2211', 'Visit complexity add-on']],
    watch: 'G2211 is for ongoing, longitudinal care. The note has to show that relationship, or the add-on is denied.',
    rules: { mod25: 'Sick visit and annual wellness visit on the same day', drugs: 'Vaccines billed with their own admin codes' } },
  { slug: 'pediatrics', name: 'Pediatrics', group: 'Primary & urgent', icon: Baby,
    codes: [['99392', 'Well-child visit, age 1–4'], ['90460', 'Vaccine admin with counseling']],
    watch: 'Vaccines for Children stock is free, so only the administration is billed, not the vaccine.',
    rules: { mod25: 'Sick concern handled during a well-child visit', drugs: 'VFC vaccines billed admin-only' } },
  { slug: 'urgent-care', name: 'Urgent Care', group: 'Primary & urgent', icon: Siren,
    codes: [['99204', 'New patient visit, moderate'], ['S9083', 'Urgent care global fee']],
    watch: 'Some payers want a global S9083 claim with place of service 20, others want every service itemized.',
    rules: { mod25: 'Visit plus laceration repair or splinting', drugs: 'In-clinic injections billed by HCPCS unit' } },

  /* ---- Medical specialties ---- */
  { slug: 'cardiology', name: 'Cardiology', group: 'Medical specialties', icon: HeartPulse, page: true,
    codes: [['93306', 'Echo, complete, with Doppler'], ['78452', 'Nuclear stress imaging (SPECT)']],
    watch: 'Reading a study done on hospital equipment? Bill only the professional component, with modifier 26.',
    rules: { auth: 'Nuclear stress, echo and cath through imaging benefit managers', split: '-26 for hospital reads, global for in-office studies', mod25: 'Visit plus same-day ECG or procedure', global: 'Pacemaker insertion (33208) carries a 90-day global', drugs: 'Radiopharmaceuticals (A9500) billed with nuclear studies' } },
  { slug: 'gastroenterology', name: 'Gastroenterology', group: 'Medical specialties', icon: Salad,
    codes: [['45378', 'Colonoscopy, diagnostic'], ['45385', 'Colonoscopy with snare polypectomy']],
    watch: 'A screening colonoscopy that turns into polyp removal needs modifier PT for Medicare (33 for most commercial plans).',
    rules: { auth: 'Some plans require approval for non-screening endoscopy', global: 'Endoscopies carry a 0-day global', drugs: 'Anesthesia and sedation billed separately, with their own rules' } },
  { slug: 'nephrology', name: 'Nephrology', group: 'Medical specialties', icon: Droplet,
    codes: [['90960', 'ESRD services, monthly, 4+ visits'], ['36901', 'Dialysis circuit angiography']],
    watch: 'Monthly ESRD codes are tiered by face-to-face visits (1, 2–3 or 4+) and patient age. Count the visits.',
    rules: { drugs: 'ESAs and IV iron billed by unit', split: 'Access imaging split by component' } },
  { slug: 'neurology', name: 'Neurology', group: 'Medical specialties', icon: Brain,
    codes: [['95816', 'EEG, awake and drowsy'], ['95886', 'Needle EMG, per extremity, with NCS']],
    watch: 'Botulinum toxin is billed per unit, and any discarded drug needs modifier JW on its own line.',
    rules: { split: 'EEG and EMG billed as professional and technical components', auth: 'Botox for chronic migraine usually needs approval', drugs: 'J0585 per unit, with JW or JZ for waste' } },
  { slug: 'oncology', name: 'Oncology', group: 'Medical specialties', icon: Ribbon,
    codes: [['96413', 'Chemo infusion, first hour'], ['J9271', 'Pembrolizumab, 1 mg']],
    watch: 'Every drug line needs the right units, the NDC, and JW or JZ to report waste.',
    rules: { auth: 'Regimens approved per drug, often per cycle', drugs: 'Units, NDC and waste modifiers on every drug line', time: 'Infusion codes billed by the hour, then add-on hours' } },
  { slug: 'allergy-and-immunology', name: 'Allergy & Immunology', group: 'Medical specialties', icon: Flower2,
    codes: [['95004', 'Percutaneous allergy tests, per test'], ['95165', 'Antigen preparation, per dose']],
    watch: '95165 is billed per dose prepared, so units have to match the vials actually mixed.',
    rules: { mod25: 'Visit on the same day as testing or shots', drugs: 'Antigen billed per dose' } },
  { slug: 'obstetrics-and-gynecology', name: 'Obstetrics & Gynecology', group: 'Medical specialties', icon: Venus,
    codes: [['59400', 'Global OB care, vaginal delivery'], ['76805', 'OB ultrasound, after first trimester']],
    watch: 'The global OB package covers prenatal, delivery and postpartum care. If the patient transfers, the package has to be split.',
    rules: { global: 'Global obstetric package, split when care transfers', split: 'Ultrasound read and equipment billed separately', mod25: 'Problem visit on the same day as a procedure' } },

  /* ---- Surgical & procedural ---- */
  { slug: 'ambulatory-surgery-centers', name: 'Ambulatory Surgery Centers', group: 'Surgical & procedural', icon: Scissors,
    codes: [['66984', 'Cataract surgery with lens'], ['29881', 'Knee arthroscopy, meniscectomy']],
    watch: 'Facility and surgeon bill separately for the same case, and secondary procedures are paid at a reduced rate.',
    rules: { auth: 'Elective cases scheduled only once approval is on file', drugs: 'Separately payable drugs and implants listed by HCPCS' } },
  { slug: 'orthopedics', name: 'Orthopedics', group: 'Surgical & procedural', icon: Bone,
    codes: [['20610', 'Large joint injection'], ['27447', 'Total knee replacement']],
    watch: 'A visit and an injection on the same day: the visit is paid only with modifier 25 and its own documentation.',
    rules: { mod25: 'Visit plus joint injection', global: 'Total knee carries a 90-day global; injections 0-day', auth: 'MRI and joint replacement need approval', drugs: 'Viscosupplements (J7325) billed per mg' } },
  { slug: 'dermatology', name: 'Dermatology', group: 'Surgical & procedural', icon: ScanFace,
    codes: [['11102', 'Tangential skin biopsy, first lesion'], ['17000', 'Destruction of premalignant lesion']],
    watch: 'Destructions like 17000 carry a 10-day global, so a follow-up visit in that window isn’t billable.',
    rules: { mod25: 'Visit and biopsy on the same day', global: '10-day global on destructions and many excisions', drugs: 'Biologic injections tracked by NDC' } },
  { slug: 'ophthalmology', name: 'Ophthalmology', group: 'Surgical & procedural', icon: Eye,
    codes: [['66984', 'Cataract surgery with lens'], ['92134', 'OCT imaging, retina']],
    watch: 'Eye modifiers (RT, LT) and bilateral rules change the payment on almost every line.',
    rules: { global: 'Cataract surgery carries a 90-day global', split: 'OCT and imaging billed by component', drugs: 'Anti-VEGF injections (J0178) billed per mg' } },
  { slug: 'pain-management', name: 'Pain Management', group: 'Surgical & procedural', icon: Activity,
    codes: [['64483', 'Transforaminal epidural, lumbar'], ['64493', 'Facet joint injection, lumbar']],
    watch: 'Payers want proof of conservative care before they approve injections. The note has to show it.',
    rules: { auth: 'Epidurals and facet injections need approval', mod25: 'Visit plus same-day injection', global: 'Most injections carry a 0-day global' } },
  { slug: 'podiatry', name: 'Podiatry', group: 'Surgical & procedural', icon: Footprints,
    codes: [['11721', 'Nail debridement, 6 or more'], ['11055', 'Paring of corn or callus']],
    watch: 'Routine foot care is covered by Medicare only with class findings, reported with modifiers Q7, Q8 or Q9.',
    rules: { mod25: 'Visit plus nail or callus care', global: 'Nail avulsions and minor procedures carry short globals' } },
  { slug: 'urology', name: 'Urology', group: 'Surgical & procedural', icon: Droplets,
    codes: [['52000', 'Cystoscopy'], ['51741', 'Uroflowmetry, complex']],
    watch: 'Hormone injections like leuprolide are billed in fixed units (J9217 per 7.5 mg). Units must match the dose.',
    rules: { split: 'Urodynamics billed as professional and technical', global: 'Cystoscopy carries a 0-day global', drugs: 'Leuprolide (J9217) per 7.5 mg' } },
  { slug: 'wound-care', name: 'Wound Care', group: 'Surgical & procedural', icon: Bandage,
    codes: [['97597', 'Selective debridement, first 20 sq cm'], ['15271', 'Skin substitute, first 25 sq cm']],
    watch: 'Debridement and grafts are billed by wound surface area. No measurements in the note, no payment.',
    rules: { drugs: 'Skin substitutes billed per sq cm', auth: 'Skin substitutes often need approval' } },

  /* ---- Behavioral health ---- */
  { slug: 'mental-health', name: 'Mental Health', group: 'Behavioral health', icon: BrainCircuit,
    codes: [['90834', 'Psychotherapy, 45 minutes'], ['90837', 'Psychotherapy, 60 minutes']],
    watch: 'Telehealth sessions need the right place-of-service code (02 or 10) and the modifier that payer expects.',
    rules: { time: '90832 / 90834 / 90837 by minutes: 16–37, 38–52, 53+', auth: 'Some plans approve sessions in blocks' } },
  { slug: 'psychiatry', name: 'Psychiatry', group: 'Behavioral health', icon: Pill,
    codes: [['90792', 'Psychiatric evaluation, with medical'], ['90833', 'Psychotherapy add-on, 30 min']],
    watch: 'Psychotherapy added to a med-management visit needs its own documented minutes, separate from the visit.',
    rules: { time: 'Psychotherapy add-ons (90833 / 90836 / 90838) by minutes', drugs: 'Long-acting injectables billed per unit' } },

  /* ---- Hospital-based & diagnostic ---- */
  { slug: 'anesthesia', name: 'Anesthesia', group: 'Hospital-based & diagnostic', icon: Syringe,
    codes: [['00790', 'Anesthesia, upper abdominal laparoscopy'], ['01402', 'Anesthesia, total knee']],
    watch: 'Payment is base units plus time units. Start and stop times have to be in the record, to the minute.',
    rules: { time: 'Base units + 15-minute time units', auth: 'Follows the surgeon’s authorization' } },
  { slug: 'radiology', name: 'Radiology', group: 'Hospital-based & diagnostic', icon: Radiation,
    codes: [['70553', 'MRI brain, with and without contrast'], ['74177', 'CT abdomen and pelvis, with contrast']],
    watch: 'If the ordered study and the performed study differ, the authorization may not cover what was done.',
    rules: { auth: 'MRI, CT and PET almost always need approval', split: '-26 for reads, TC for the equipment owner', drugs: 'Contrast billed separately in office settings' } },
  { slug: 'pathology', name: 'Pathology', group: 'Hospital-based & diagnostic', icon: Microscope,
    codes: [['88305', 'Surgical pathology, gross and micro'], ['88342', 'Immunohistochemistry, first stain']],
    watch: '88305 is billed per specimen. Units have to match the specimens listed on the report.',
    rules: { split: '-26 for the read, TC for the lab' } },
];

/** Other names people type for a specialty. */
export const ALIASES: Record<string, string> = {
  'obstetrics-and-gynecology': 'ob gyn obgyn obstetrician gynecologist womens health maternity prenatal',
  gastroenterology: 'gi gastro endoscopy colonoscopy', 'ambulatory-surgery-centers': 'asc surgery center surgical',
  'mental-health': 'behavioral therapy counseling psychology', psychiatry: 'psych behavioral',
  'allergy-and-immunology': 'allergist immunologist', 'internal-medicine': 'primary care pcp family medicine',
  'pain-management': 'pain interventional spine', 'wound-care': 'wound hyperbaric', orthopedics: 'ortho orthopaedic sports medicine',
  oncology: 'cancer hematology infusion chemo', nephrology: 'kidney dialysis esrd', neurology: 'neuro eeg emg',
  cardiology: 'heart cardiac cardio', ophthalmology: 'eye retina optometry', dermatology: 'derm skin', podiatry: 'foot ankle',
  pediatrics: 'peds children child kids', 'urgent-care': 'walk in clinic', radiology: 'imaging mri ct xray', anesthesia: 'anesthesiology crna',
};
export const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const haystack = (s: SpecialtyLite) => ` ${norm(`${s.name} ${ALIASES[s.slug] ?? ''} ${s.codes.map(([c]) => c).join(' ')}`)} `;
export const matches = (s: SpecialtyLite, q: string) => { const n = norm(q); if (!n) return true; const h = haystack(s); return n.split(' ').every((w) => h.includes(` ${w}`)); };


export const getSpecialtyLite = (slug: string) => SPECIALTIES.find((s) => s.slug === slug);

/* ================================================================== */
/* Spot the error (overview page)                                     */
/* ================================================================== */
export const ERROR_TYPES = ['Code doesn’t match the note', 'Modifier missing', 'Billed the wrong component'] as const;
export const SPOT: { specialty: string; code: string; desc: string; note: string; answer: 0 | 1 | 2; fix: string; why: string }[] = [
  { specialty: 'Mental Health', code: '90837', desc: 'Psychotherapy, 60 minutes', note: 'Session 10:02–10:46 · 44 min face to face', answer: 0,
    fix: 'Bill 90834', why: '44 minutes falls in the 38–52 minute range for 90834. 90837 needs 53 minutes or more.' },
  { specialty: 'Orthopedics', code: '99213 + 20610', desc: 'Visit + knee injection, same day', note: 'New knee complaint examined, then injected', answer: 1,
    fix: 'Add modifier 25 to 99213', why: 'Without modifier 25 the visit is bundled into the injection. With a separately documented complaint, it’s payable.' },
  { specialty: 'Cardiology', code: '93000', desc: 'ECG, tracing + interpretation', note: 'ECG done on hospital equipment; cardiologist read it', answer: 2,
    fix: 'Bill 93010', why: 'The hospital billed the tracing. The cardiologist bills the interpretation only, as 93010.' },
  { specialty: 'Gastroenterology', code: '45385', desc: 'Colonoscopy with polyp removal', note: 'Medicare patient · scheduled as a screening', answer: 1,
    fix: 'Add modifier PT', why: 'PT tells Medicare the procedure began as a screening, so the patient’s deductible is waived.' },
];

/* ================================================================== */
/* Full specialty pages                                               */
/* ================================================================== */
export type LedgerRow = { code: string; name: string; trip: string; catch: string };
export type AuthReq = { study: string; code: string; payer: string; kind: 'Urgent' | 'Standard'; limitH: number; decideAt: number | null; outcome: string };
export type Beat = { code: string; label: string; status: string };

/** "Where a month leaks" waterfall: each leak is a share of the month's expected revenue. Illustrative until real client data. */
export type Leak = { label: string; cause: string; pct: number; fix: string };
export type LeakFold = {
  eyebrow: string; lines: [string, string]; intro: string;
  /** expected monthly revenue per provider, illustrative */
  perProvider: number; unit: [string, string]; sizes: [number, number, number];
  leaks: Leak[]; note: string; source?: { label: string; href: string };
};
/** "Same visit, two claims" comparison slider */
export type ClaimSide = { code: string; tag: string; amt: number | null; tone: 'bad' | 'ok' | 'good' };
export type ClaimFold = {
  eyebrow: string; lines: [string, string]; intro: string;
  visit: [string, string, string];
  rows: { label: string; bad: ClaimSide; good: ClaimSide; why: string }[];
  note: string;
};

/** Hero/ledger trace motif: every specialty gets its own "rhythm" */
export type Wave = 'ecg' | 'eeg' | 'flow' | 'steps' | 'scan' | 'pulse';
export type SpPhoto = 'h1' | 'h2' | 'h3' | 'doc' | 'imaging' | 'billing' | 'coder' | 'scrubs';

export type SpecialtyFull = Pick<ServiceFull, 'calc' | 'stat' | 'how' | 'doc' | 'steps' | 'faqs' | 'faqLines' | 'closing' | 'seoTitle' | 'seoDescription'> & {
  slug: string;
  name: string;
  /** short label for "Today's … claims" */
  short?: string;
  wave: Wave;
  photo: SpPhoto;
  photoAlt: string;
  heroTitle: [string, string];
  heroAccent: string;
  heroSub: string;
  chip: [string, string];
  beats: Beat[];
  ledger: { eyebrow: string; lines: [string, string]; intro: string; rows: LedgerRow[] };
  /** prior-auth clock fold; omitted for specialties where auth isn't the pain point */
  auth?: { eyebrow: string; lines: [string, string]; body: string; source: string; href: string; reqs: AuthReq[] };
  related: string[];
  /** specialty-only folds; pages without them fall back to the shared Problem / HowWeWork folds */
  leak?: LeakFold;
  claim?: ClaimFold;
};

const CARDIOLOGY: SpecialtyFull = {
  slug: 'cardiology',
  name: 'Cardiology',
  wave: 'ecg',
  photo: 'h2',
  photoAlt: 'Cardiologist reviewing results on a tablet',
  seoTitle: 'Cardiology Billing Services | Cardiology Medical Billing & Coding',
  seoDescription: 'Cardiology billing and coding for echo, nuclear, stress testing, device checks and the cath lab. Prior auths tracked, components split right, denials appealed.',
  heroTitle: ['Cardiology billing,', 'coded beat by beat.'],
  heroAccent: 'beat.',
  heroSub: 'From the office ECG to the cath lab, we code each study to the component you performed, chase the prior auth before the patient is scheduled, and appeal the imaging denials that usually get written off.',
  chip: ['Prior auth tracked', 'Before the study is scheduled.'],
  beats: [
    { code: '93000', label: 'ECG, 12-lead', status: 'Coded' },
    { code: '93306', label: 'Echo, complete', status: 'Auth on file' },
    { code: '78452', label: 'SPECT, rest + stress', status: '+ 93015, A9500' },
    { code: '93010', label: 'Hospital ECG, read only', status: 'Pro component' },
    { code: '92928', label: 'Stent, LAD', status: 'LD applied' },
  ],
  stat: {
    value: 39,
    label: 'prior authorizations a physician’s practice handles every week, about 13 hours of physician and staff time.',
    source: 'AMA 2024 Prior Authorization Physician Survey',
    href: 'https://www.ama-assn.org/practice-management/prior-authorization/fixing-prior-auth-nearly-40-prior-authorizations-week-way',
  },
  calc: {
    kicker: 'What prior auth costs your practice',
    fields: [
      { id: 'docs', label: 'Cardiologists', min: 1, max: 30, step: 1, value: 6, fmt: 'n' },
      { id: 'auths', label: 'Prior auths per cardiologist, per week', min: 5, max: 80, step: 1, value: 39, fmt: 'n' },
      { id: 'mins', label: 'Minutes of staff time per auth', min: 5, max: 60, step: 1, value: 20, fmt: 'n' },
      { id: 'rate', label: 'Staff cost per hour', min: 18, max: 60, step: 1, value: 28, fmt: '$' },
    ],
    compute: ({ docs, auths, mins, rate }) => {
      const hrs = (docs * auths * mins) / 60;
      return [
        { label: 'Staff hours each week', value: hrs, fmt: 'n' },
        { label: 'Hours each year', value: hrs * 52, fmt: 'n' },
        { label: 'Cost each year', value: hrs * 52 * rate, fmt: '$', accent: true },
      ];
    },
    note: 'Estimate. 39 auths a week and about 20 minutes each (13 hours) come from the AMA’s 2024 survey of 1,000 physicians. Your free assessment uses your own volume.',
  },
  ledger: {
    eyebrow: '/ Codes we see every day',
    lines: ['Eight cardiology codes,', 'and what trips each one.'],
    intro: 'Most cardiology denials come from a handful of codes billed a little wrong: the wrong component, a missing modifier, a study that outran its authorization.',
    rows: [
      { code: '93000', name: 'ECG, 12-lead, with interpretation', trip: 'Billed in full when your cardiologist only read it.', catch: 'Read only → 93010. Tracing only → 93005.' },
      { code: '93306', name: 'Echo (TTE), complete, with Doppler', trip: 'The report doesn’t document every element of a complete study.', catch: 'Coded to what the report supports: 93306, 93307 or limited 93308.' },
      { code: '78452', name: 'SPECT perfusion, multiple studies', trip: 'No prior auth, and the stress test and isotope are left off.', catch: 'Auth checked before scheduling. 93015–93018 and A9500 added.' },
      { code: '93015', name: 'Cardiovascular stress test, global', trip: 'Global billed when the hospital owns the equipment.', catch: 'Split to 93016 and 93018 for the parts your physician did.' },
      { code: '93458', name: 'Left heart cath, coronary angiography', trip: 'Billed with a same-day stent, with no reason it stands alone.', catch: 'Modifier 59 or XU only when the note shows no prior study or a change.' },
      { code: '92928', name: 'Coronary stent, single vessel', trip: 'No vessel modifier, or a second stent in the same vessel billed again.', catch: 'One code per major vessel, with LD, LC, RC, LM or RI.' },
      { code: '93224', name: 'Holter monitor, up to 48 hours', trip: 'A 7-day wear billed as a Holter.', catch: 'Wear over 48 hours moved to extended monitoring, 93241–93248.' },
      { code: '93294', name: 'Remote pacemaker check, 90 days', trip: 'Billed more than once in the same 90-day window.', catch: 'Remote checks tracked on a 90-day clock per patient.' },
    ],
  },
  how: { eyebrow: '/ How we code a cath lab case', lines: ['One cath lab case,', 'coded line by line.'] },
  doc: {
    org: 'Cardiac cath lab', title: 'Procedure note → claim · Charge review',
    meta: ['Case CATH-26-0912', 'M. Okafor · ID ••• 7740', 'DOS 09/18/2026'],
    cols: ['Code', 'Description', 'Units', 'Modifier', 'Status'],
    rows: [
      { code: '93458', desc: 'Left heart cath, coronary angiography, LV gram', a: '1', b: '—', flag: 'Bundled?', flagNote: 'Same session as stent' },
      { code: '92928', desc: 'Stent, single major coronary artery', a: '1', b: '—', flag: 'No vessel', flagNote: 'Modifier missing' },
      { code: '92978', desc: 'Intravascular ultrasound, first vessel', a: '1', b: '—', flag: 'Add-on', flagNote: 'Needs its parent', tone: 'neutral' },
    ],
  },
  steps: [
    { title: 'Read the procedure note first', body: 'We code from the cath report, not the charge sheet: which vessels were treated, what was done to each, and what the diagnostic study found.', line: 1, note: 'Stent in proximal LAD → vessel is LD' },
    { title: 'Give every intervention its vessel', body: 'Coronary intervention codes carry a vessel modifier: LD, LC, RC, LM or RI. Without one the payer can’t tell which artery was treated, and the line is denied.', line: 1, note: '92928 + LD', fix: { row: 1, b: 'LD' } },
    { title: 'Decide if the diagnostic cath stands alone', body: 'A diagnostic cath on the same day as a stent is billable only if there was no prior study, the prior study wasn’t adequate, or the patient’s condition changed. When one applies, it’s documented and gets modifier 59 or XU.', line: 0, note: 'No prior cath on file → 93458-59', fix: { row: 0, b: '59' } },
    { title: 'Attach add-ons to their parent', body: 'Add-on codes like intravascular ultrasound pay only alongside the primary procedure, and only for the vessel that was imaged.', line: 2, note: '92978-LD, billed with 92928 on the same claim', fix: { row: 2, b: 'LD' } },
    { title: 'Match the auth, then send', body: 'Elective cases go out only when the authorization matches the date and codes on the claim. For urgent cases, we request the authorization after the fact the same day.', line: 1, note: 'Auth A-55190 matches date and CPT', stamp: 'ACCEPTED' },
  ],
  auth: {
    eyebrow: '/ Prior auth, on the clock',
    lines: ['Every authorization,', 'timed against the payer.'],
    body: 'Since January 1, 2026, Medicare Advantage, Medicaid and CHIP plans have to decide urgent prior auth requests within 72 hours and standard ones within 7 calendar days. We log every request against that clock, and escalate the moment a plan runs over.',
    source: 'CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F)',
    href: 'https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-and-prior-authorization-final-rule-cms-0057-f',
    reqs: [
      { study: 'SPECT perfusion', code: '78452', payer: 'Medicare Advantage', kind: 'Standard', limitH: 168, decideAt: 0.52, outcome: 'Approved' },
      { study: 'Left heart cath', code: '93458', payer: 'Medicaid managed care', kind: 'Urgent', limitH: 72, decideAt: 0.34, outcome: 'Approved' },
      { study: 'Echo, complete', code: '93306', payer: 'CHIP managed care', kind: 'Standard', limitH: 168, decideAt: 0.81, outcome: 'Approved' },
      { study: 'Cardiac PET', code: '78492', payer: 'Medicare Advantage', kind: 'Standard', limitH: 168, decideAt: null, outcome: 'Escalated' },
    ],
  },
  faqLines: ['What cardiology groups', 'ask before switching.'],
  faqs: [
    ['Do you bill interventional and non-invasive cardiology?', `Yes: office visits, ECGs, echo, nuclear, stress testing, device checks and cath lab procedures. ${CONFIRM}`],
    ['Can you bill for studies our physicians read at the hospital?', 'Yes. When your cardiologists read studies done on hospital equipment, we bill only the professional component (modifier 26), so the claim doesn’t overlap with the hospital’s.'],
    ['Do you handle prior authorizations?', `Yes. We check requirements before the study is scheduled, submit to the payer or its imaging benefit manager, and track each request until there’s a decision. ${CONFIRM}`],
    ['How do you handle remote monitoring and device clinics?', 'Remote interrogations are tracked on their 90-day clock per patient, separate from in-person checks, so nothing is billed twice or missed.'],
    ['Will you need access to our systems?', 'Yes: your practice management system, EHR (read-only where possible) and clearinghouse. We sign a business associate agreement before any access is set up.'],
  ],
  closing: { eyebrow: '/ Free cardiology claim review', lines: ['Send us a month', 'of cardiology claims.'] },
  related: ['radiology', 'nephrology', 'internal-medicine'],
  leak: {
    eyebrow: '/ Where the money goes',
    lines: ['A cardiology month,', 'leak by leak.'],
    intro: 'Most of the money a cardiology group loses never shows up as one big denial. It drains out in small, repeatable places: studies done before the approval, the wrong component, visits coded a level low.',
    perProvider: 95000, unit: ['cardiologist', 'cardiologists'], sizes: [1, 6, 20],
    leaks: [
      { label: 'No auth on file', cause: 'Echo, nuclear and cath done before the approval came back.', pct: 2.6, fix: 'Auth checked against the planned CPT before the study is scheduled.' },
      { label: 'Wrong component', cause: 'Global billed when the hospital owns the equipment.', pct: 1.4, fix: 'Read-only studies split to the professional component (26, 93010, 93016/93018).' },
      { label: 'Visit coded low', cause: 'Notes support a higher E/M level than the one billed.', pct: 1.8, fix: 'E/M leveled from MDM or total time on every visit.' },
      { label: 'Add-ons dropped', cause: 'Stress test, isotope or IVUS left off the claim.', pct: 1.2, fix: 'Every study checked for its add-ons and supplies before it goes out.' },
      { label: 'Denials never worked', cause: 'Denied lines left to age past the filing limit.', pct: 2.0, fix: 'Every denial worked by reason code, appealed before the deadline.' },
    ],
    note: 'Illustrative month. Expected revenue and leak rates are typical ranges, not a client’s numbers. Your free assessment measures your own.',
    source: { label: 'For context: about 15% of claims to private payers are denied on first submission (Premier, 2024)', href: 'https://premierinc.com/newsroom/blog/trend-alert-private-payers-retain-profits-by-refusing-or-delaying-legitimate-medical-claims' },
  },
  claim: {
    eyebrow: '/ Same visit, two claims',
    lines: ['One cardiology visit,', 'billed two ways.'],
    intro: 'A follow-up with an echo, and an ECG your cardiologist read at the hospital. Move your cursor down the claim to watch each line most practices send turn into the one we send.',
    visit: ['Follow-up, established patient', 'Patient J. Rivera', 'DOS 10/13/2026'],
    rows: [
      { label: 'Office visit', bad: { code: '99213', tag: 'Coded low', amt: 92, tone: 'ok' }, good: { code: '99214', tag: 'MDM: moderate', amt: 131, tone: 'good' },
        why: 'The note shows moderate decision-making: a chronic illness with a new symptom and a test ordered. That’s a 99214.' },
      { label: 'Echo, complete', bad: { code: '93306', tag: 'Denied · no auth', amt: 0, tone: 'bad' }, good: { code: '93306', tag: 'Auth A-55190', amt: 210, tone: 'good' },
        why: 'The approval was requested before the echo was scheduled, and its date and code match the claim.' },
      { label: 'ECG, hospital', bad: { code: '93000', tag: 'Denied · duplicate', amt: 0, tone: 'bad' }, good: { code: '93010', tag: 'Read only', amt: 9, tone: 'good' },
        why: 'The hospital billed the tracing. Your cardiologist bills the interpretation only, as 93010.' },
      { label: 'Diagnosis', bad: { code: 'I25.10', tag: 'Unspecified', amt: null, tone: 'ok' }, good: { code: 'I25.119', tag: 'Angina documented', amt: null, tone: 'good' },
        why: 'The note documents angina, so the diagnosis is coded to it. That specificity is what supports the echo.' },
    ],
    note: 'Illustrative claim and amounts.',
  },
};

import { PRIMARY_PAGES } from './sp-primary';
import { MEDICAL_PAGES } from './sp-medical';
import { SURGICAL_PAGES } from './sp-surgical';
import { BEHAVIORAL_HOSPITAL_PAGES } from './sp-behavioral-hospital';
import { FOLDS } from './sp-folds';

export const SPECIALTY_PAGES: Record<string, SpecialtyFull> = Object.fromEntries(
  [CARDIOLOGY, ...PRIMARY_PAGES, ...MEDICAL_PAGES, ...SURGICAL_PAGES, ...BEHAVIORAL_HOSPITAL_PAGES].map((p) => [p.slug, p]),
);
// specialty-only folds (leak waterfall + two claims)
Object.entries(FOLDS).forEach(([k, v]) => { const p = SPECIALTY_PAGES[k]; if (p) { p.leak ??= v.leak; p.claim ??= v.claim; } });
// every specialty with written content gets its own page
SPECIALTIES.forEach((s) => { s.page = !!SPECIALTY_PAGES[s.slug]; });
export const getSpecialty = (slug: string) => SPECIALTY_PAGES[slug];
