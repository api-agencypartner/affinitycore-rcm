/**
 * Service content. One entry per service page (Framer: CMS collection "Services").
 * Every page shares one template; hero, stat, calculator, document story, work order,
 * FAQs and closing CTA all come from here.
 *
 * Stats are cited to public sources. Calculators are labelled estimates.
 * Anything marked [Confirm with Affinity Core] needs the client's sign-off.
 */

export type Station = 1 | 2 | 3 | 4 | 5;

export const STATIONS: { n: Station; name: string; short: string; status: string }[] = [
  { n: 1, name: 'Before the visit', short: 'Prepare', status: 'Provider enrolled · eligibility verified' },
  { n: 2, name: 'After the visit', short: 'Capture', status: 'Charges entered · codes assigned' },
  { n: 3, name: 'Submission', short: 'Submit', status: 'Claim scrubbed · sent to payer' },
  { n: 4, name: 'Payer response', short: 'Get paid', status: 'Remittance received · payment posted' },
  { n: 5, name: 'Follow-up', short: 'Recover', status: 'Denials worked · A/R collected' },
];

export type ServiceLite = { slug: string; name: string; line: string; station: Station | 0 };

export const SERVICES: ServiceLite[] = [
  { slug: 'credentialing', name: 'Credentialing & Enrollment', line: 'Get your providers in-network with every payer you bill.', station: 1 },
  { slug: 'charge-entry', name: 'Charge Entry', line: 'Every billable service on the superbill becomes a claim line.', station: 2 },
  { slug: 'medical-coding', name: 'Medical Coding', line: 'Certified coders assign codes that match the documentation.', station: 2 },
  { slug: 'medical-billing', name: 'Medical Billing', line: 'Claims scrubbed against payer rules, then submitted the same day.', station: 3 },
  { slug: 'payment-posting', name: 'Payment Posting', line: 'Remittances matched line by line, underpayments flagged.', station: 4 },
  { slug: 'denial-management', name: 'Denial Management', line: 'Every denial worked back to paid, and its cause fixed upstream.', station: 5 },
  { slug: 'ar-recovery', name: 'A/R Recovery', line: 'Aged and forgotten claims chased until they pay or close.', station: 5 },
  { slug: 'revenue-cycle-management', name: 'Revenue Cycle Management', line: 'One accountable team running all of it, end to end.', station: 0 },
  { slug: 'medical-billing-audits', name: 'Medical Billing Audits', line: 'An outside look at where your revenue is leaking today.', station: 0 },
  { slug: 'peer-to-peer-review', name: 'Peer-to-Peer Review', line: 'Medical-necessity denials prepped for the physician call, then appealed if upheld.', station: 5 },
];

/* ---------- types ---------- */
export type Fmt = 'n' | '$' | '%' | 'd';
export type CalcField = { id: string; label: string; min: number; max: number; step: number; value: number; fmt: Fmt };
export type CalcOut = { label: string; value: number; fmt: Fmt; accent?: boolean };
export type Calc = { kicker: string; fields: CalcField[]; compute: (v: Record<string, number>) => CalcOut[]; note: string };
export type DocRow = { code: string; desc: string; a: string; b: string; flag: string; flagNote: string; tone?: 'ok' | 'neutral' };
export type Doc = { org: string; title: string; meta: string[]; cols: [string, string, string, string, string]; rows: DocRow[] };
export type Step = { title: string; body: string; line: number; note: string; stamp?: string; fix?: { row: number; b: string } };
export type QueueRow = { code: string; label: string; done: string; value: number };
export type Queue = { title: string; unit: '$' | '#'; totalLabel: string; pending: string; rows: QueueRow[] };
export type Photo = 'h1' | 'h2' | 'h3' | 'doc';

export type ServiceFull = ServiceLite & {
  seoTitle: string;
  seoDescription: string;
  photo: Photo;
  heroTitle: [string, string];
  heroAccent: string;
  heroSub: string;
  cta: string;
  chip: [string, string];
  queue: Queue;
  stat: { value: number; decimals?: number; prefix?: string; suffix?: string; label: string; source: string; href: string };
  calc: Calc;
  how: { eyebrow: string; lines: [string, string] };
  doc: Doc;
  steps: Step[];
  ticket: { intro: string; code: string; scope: string[]; reporting: string; owner: string; turnaround: string };
  faqLines: [string, string];
  faqs: string[][];
  closing: { eyebrow: string; lines: [string, string] };
};

const CONFIRM = '[Confirm with Affinity Core]';
const PREMIER = { source: 'Premier, 2024 claims survey', href: 'https://premierinc.com/newsroom/blog/trend-alert-private-payers-retain-profits-by-refusing-or-delaying-legitimate-medical-claims' };
const ACCESS_FAQ = ['Will you need access to our systems?', 'Yes, read and work access to your practice management system, EHR (read-only where possible) and clearinghouse. We sign a business associate agreement before any access is set up.'];

/* ================================================================== */
const DENIAL: ServiceFull = {
  ...SERVICES[5],
  seoTitle: 'Denial Management Services for Medical Practices',
  seoDescription: 'Denial specialists who work every denied claim back to paid, appeal when it’s worth it, and fix the root cause so it doesn’t come back.',
  photo: 'h3',
  heroTitle: ['Denied isn’t done.', 'We work it back to paid.'],
  heroAccent: 'paid.',
  heroSub: 'Denial specialists who decode every payer reason, fix and resubmit the claim, appeal when it’s worth it, and close the gap that caused it so the same denial doesn’t come back next month.',
  cta: 'Get a free denial review',
  chip: ['Denied isn’t final.', 'Most denials can be corrected or appealed.'],
  queue: {
    title: 'Denial queue', unit: '$', totalLabel: 'recovered', pending: 'Denied',
    rows: [
      { code: '78452', label: 'CO-197 · No prior auth', done: 'Appealed', value: 1240 },
      { code: '93000', label: 'CO-97 · Bundled', done: 'Corrected', value: 74 },
      { code: '99214', label: 'CO-16 · Missing info', done: 'Resubmitted', value: 186 },
      { code: '20610', label: 'CO-4 · Modifier', done: 'Corrected', value: 312 },
    ],
  },
  stat: {
    value: 41, suffix: '%',
    label: 'of providers now see claim denial rates of 10% or higher, the third straight year of increases.',
    source: 'Experian Health, State of Claims 2025',
    href: 'https://www.managedhealthcareexecutive.com/view/claim-denial-rates-increase-for-third-consecutive-year-survey-shows',
  },
  calc: {
    kicker: 'What denials cost your practice',
    fields: [
      { id: 'claims', label: 'Claims per month', min: 200, max: 6000, step: 100, value: 1200, fmt: 'n' },
      { id: 'avg', label: 'Average claim value', min: 60, max: 900, step: 10, value: 180, fmt: '$' },
      { id: 'rate', label: 'Denial rate', min: 3, max: 30, step: 1, value: 12, fmt: '%' },
    ],
    compute: ({ claims, avg, rate }) => {
      const denied = claims * (rate / 100);
      return [
        { label: 'Denied each month', value: denied * avg, fmt: '$' },
        { label: 'Never reworked (about half)', value: denied * avg * 0.5, fmt: '$', accent: true },
        { label: 'Cost to rework the rest (~$25 each)', value: (denied / 2) * 25, fmt: '$' },
      ];
    },
    note: 'Estimate. “About half never reworked” and “~$25 per rework” are MGMA figures cited by AAFP. Your assessment uses your real claim data.',
  },
  how: { eyebrow: '/ How we work a denial', lines: ['One denial letter,', 'worked line by line.'] },
  doc: {
    org: 'Sample Health Plan', title: 'Explanation of Benefits · Claim adjustment',
    meta: ['Claim CLM-24-118 406', 'J. Rivera · ID ••• 2291', 'DOS 09/12/2026'],
    cols: ['Code', 'Description', 'Billed', 'Paid', 'Reason'],
    rows: [
      { code: '99214', desc: 'Office visit, est. patient, moderate', a: '$186.00', b: '$0.00', flag: 'CO-16', flagNote: 'Missing info' },
      { code: '93000', desc: 'Electrocardiogram, complete', a: '$74.00', b: '$0.00', flag: 'CO-97', flagNote: 'Bundled' },
      { code: '78452', desc: 'Myocardial perfusion imaging', a: '$1,240.00', b: '$0.00', flag: 'CO-197', flagNote: 'No prior auth' },
    ],
  },
  steps: [
    { title: 'Triage by value and deadline', body: 'Every denial lands in one queue, sorted by dollars at stake and the payer’s filing limit, so nothing expensive ages out while a $20 claim gets attention.', line: 2, note: 'Highest value · 23 days to appeal limit' },
    { title: 'Read the reason, not just the code', body: 'CARC and RARC codes say what the payer rejected. We trace each one back to its cause: a missing modifier, a bundling edit, an authorization that was never on file.', line: 1, note: 'CO-97: bundled with 99214 → needs modifier 25' },
    { title: 'Fix, resubmit or appeal', body: 'Simple fixes become corrected claims the same week. Medical-necessity and authorization denials get a written appeal with the clinical notes attached.', line: 2, note: 'Retro-auth requested + appeal letter drafted' },
    { title: 'Track it to paid', body: 'We follow each claim through the payer until the money posts, and escalate when a payer goes quiet.', line: 2, note: 'Appeal accepted · paid in 18 days', stamp: 'PAID', fix: { row: 2, b: '$1,104.30' } },
    { title: 'Stop it happening again', body: 'Each root cause turns into a rule for the front desk, coders or scrubber, and shows up on your monthly report so you can see repeat denials fall.', line: 1, note: 'New scrubber rule: 93000 + E/M → check mod 25', stamp: 'RULE ADDED' },
  ],
  ticket: {
    intro: 'No add-on fees for appeals or follow-up. If it’s a denial, it’s in scope.', code: 'WO-DM-0001',
    scope: ['Denial queue worked daily', 'Corrected claims and resubmissions', 'Written appeals with clinical support', 'Payer follow-up to resolution', 'Root-cause fixes fed upstream', 'Monthly denial trend report'],
    reporting: 'Monthly · denial rate, top reasons, dollars recovered', owner: 'Dedicated denial specialist', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'before handing us denials.'],
  faqs: [
    ['Which denials do you work?', 'All of them, from simple missing-information rejections to medical-necessity and authorization denials that need a written appeal. We prioritise by dollars at stake and filing deadlines.'],
    ['Do you only fix denials, or prevent them too?', 'Both. Every denial gets a root cause, and recurring causes become rules for your front desk, coders or claim scrubber. Your monthly report shows whether repeat denials are falling.'],
    ['Can we hand you an existing backlog?', 'Yes. We start with the oldest, highest-value claims that are still inside the payer’s filing limit, then move to the daily queue.'],
    ACCESS_FAQ,
    ['How do we see what you recovered?', 'A monthly report shows denials received, worked, overturned and paid, the dollars recovered and the top reasons, by payer.'],
  ],
  closing: { eyebrow: '/ Free denial review', lines: ['Send us 90 days of denials.', 'We’ll show you what’s recoverable.'] },
};

/* ================================================================== */
const CREDENTIALING: ServiceFull = {
  ...SERVICES[0],
  seoTitle: 'Provider Credentialing & Payer Enrollment Services',
  seoDescription: 'We enroll your providers with every payer you bill, keep CAQH current and track each application to a confirmed effective date.',
  photo: 'h1',
  heroTitle: ['Not enrolled means', 'not paid. Yet.'],
  heroAccent: 'paid.',
  heroSub: 'We enroll your providers with every payer you bill, keep CAQH current and track each application until the effective date is confirmed, so no one sees patients before the payer will pay for the visit.',
  cta: 'Start enrollment',
  chip: ['In-network, on schedule.', 'Every application tracked to an effective date.'],
  queue: {
    title: 'Enrollment tracker', unit: '#', totalLabel: 'payers live', pending: 'Pending',
    rows: [
      { code: 'MCR', label: 'Medicare · PECOS', done: 'Approved', value: 1 },
      { code: 'AET', label: 'Aetna · Commercial', done: 'Approved', value: 1 },
      { code: 'BCBS', label: 'BCBS of Texas', done: 'Approved', value: 1 },
      { code: 'UHC', label: 'UnitedHealthcare', done: 'Approved', value: 1 },
    ],
  },
  stat: {
    value: 54, suffix: '%',
    label: 'of practices told MGMA their credentialing-related denials had increased that year.',
    source: 'MGMA Stat poll, August 2021',
    href: 'https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021',
  },
  calc: {
    kicker: 'What an enrollment delay costs',
    fields: [
      { id: 'visits', label: 'Visits per day (new provider)', min: 4, max: 40, step: 1, value: 18, fmt: 'n' },
      { id: 'avg', label: 'Average reimbursement per visit', min: 60, max: 400, step: 10, value: 140, fmt: '$' },
      { id: 'days', label: 'Days waiting on enrollment', min: 15, max: 180, step: 5, value: 90, fmt: 'd' },
    ],
    compute: ({ visits, avg, days }) => {
      const clinicDays = Math.round(days * (5 / 7));
      return [
        { label: 'Visits at risk', value: visits * clinicDays, fmt: 'n' },
        { label: 'Revenue at risk', value: visits * clinicDays * avg, fmt: '$', accent: true },
        { label: 'Per week of delay', value: visits * 5 * avg, fmt: '$' },
      ];
    },
    note: 'Estimate. Assumes five clinic days a week and that visits before a payer’s effective date can’t be billed to that payer.',
  },
  how: { eyebrow: '/ How we enroll a provider', lines: ['One enrollment file,', 'followed to an effective date.'] },
  doc: {
    org: 'Enrollment file', title: 'Dr. A. Patel · Cardiology',
    meta: ['NPI ••• 4417', 'CAQH ID ••• 0921', 'Start date 11/03/2026'],
    cols: ['Payer', 'Product', 'Submitted', 'Status', 'Flag'],
    rows: [
      { code: 'MCR', desc: 'Medicare Part B (PECOS)', a: '09/02', b: 'In review', flag: '855I', flagNote: 'Filed', tone: 'neutral' },
      { code: 'AET', desc: 'Aetna Commercial PPO', a: '09/04', b: 'On hold', flag: 'CAQH', flagNote: 'Attestation expired' },
      { code: 'BCBS', desc: 'BCBS of Texas', a: '09/04', b: 'Pending', flag: 'PANEL', flagNote: 'Panel closed' },
    ],
  },
  steps: [
    { title: 'Build one clean profile', body: 'License, DEA, board certification, malpractice and work history are gathered once, verified and loaded into CAQH, so every payer pulls the same current file.', line: 1, note: 'CAQH re-attested · 6 documents refreshed', fix: { row: 1, b: 'In review' } },
    { title: 'Map every payer you bill', body: 'We list each payer and product your practice actually sees, from Medicare and Medicaid to the commercial plans on your schedule, and file with all of them.', line: 0, note: 'Medicare via PECOS · 855I + 855R filed' },
    { title: 'Submit and chase', body: 'Applications go in the same week. We follow up on a fixed schedule and answer payer requests before they stall the file.', line: 2, note: 'Closed panel → network exception requested' },
    { title: 'Confirm the effective date', body: 'An approval isn’t finished until the effective date and provider ID are loaded in your billing system. We confirm both before the first claim goes out.', line: 0, note: 'Effective 11/01 · PTAN loaded in PM', stamp: 'APPROVED', fix: { row: 0, b: 'Approved' } },
    { title: 'Keep it current', body: 'Revalidations, re-attestations and expiring documents sit on a calendar, so a lapsed credential never turns into a denial.', line: 1, note: 'Next CAQH attestation in 120 days', stamp: 'ON CALENDAR', fix: { row: 1, b: 'Approved' } },
  ],
  ticket: {
    intro: 'From the first application to every revalidation after it.', code: 'WO-CR-0001',
    scope: ['CAQH profile built and maintained', 'Medicare, Medicaid and commercial enrollment', 'Application follow-up until approval', 'Effective dates loaded in your billing system', 'Revalidation and expiry calendar', 'Status report for every provider'],
    reporting: 'Every two weeks · status by provider and payer', owner: 'Dedicated credentialing specialist', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'before a new provider starts.'],
  faqs: [
    ['How long does enrollment take?', 'It depends on the payer. Some approve in a few weeks, others take several months. We file everything in the first week, follow up on a schedule and tell you the expected effective date for each payer so you can plan the provider’s schedule.'],
    ['Can you take over enrollments we already started?', 'Yes. We pick up open applications, confirm what each payer has on file and finish them, instead of starting over.'],
    ['Do you handle revalidation and re-credentialing?', 'Yes. Revalidation deadlines, CAQH re-attestations and expiring licenses or insurance are tracked on a calendar and handled before they lapse.'],
    ['What do you need from the provider?', 'A one-time document set: licenses, DEA, board certification, malpractice certificate, CV and work history. After that we only ask when a payer requests something new.'],
    ['What if a payer’s panel is closed?', 'We ask for a network exception where the practice has a case, such as a specialty gap or patient access, and tell you plainly when a panel won’t open.'],
  ],
  closing: { eyebrow: '/ Hiring a provider?', lines: ['Tell us the start date.', 'We’ll work back from it.'] },
};

/* ================================================================== */
const CHARGE: ServiceFull = {
  ...SERVICES[1],
  seoTitle: 'Charge Entry Services for Medical Practices',
  seoDescription: 'Same-day charge entry with encounter reconciliation, unit and modifier checks, so every billable service makes it onto the claim.',
  photo: 'h2',
  heroTitle: ['Every service you provide,', 'on the claim.'],
  heroAccent: 'claim.',
  heroSub: 'Charge entry specialists turn superbills and encounter notes into complete claim lines the same day, with every procedure, unit and modifier the visit supports.',
  cta: 'Get a free charge audit',
  chip: ['Nothing left off the claim.', 'Encounters reconciled against charges daily.'],
  queue: {
    title: 'Today’s encounters', unit: '$', totalLabel: 'entered', pending: 'Open',
    rows: [
      { code: '10/13', label: 'J. Rivera · 3 lines', done: 'Entered', value: 1500 },
      { code: '10/13', label: 'M. Chen · 2 lines', done: 'Entered', value: 412 },
      { code: '10/13', label: 'A. Okafor · 4 lines', done: 'Entered', value: 968 },
      { code: '10/13', label: 'L. Brooks · 1 line', done: 'Entered', value: 186 },
    ],
  },
  stat: {
    value: 1, prefix: 'Up to ', suffix: '%',
    label: 'of net charges can be lost to charge leakage before a claim is ever sent, according to HFMA.',
    source: 'HFMA, Charge Capture',
    href: 'https://www.hfma.org/revenue-cycle/charge-capture/55358/',
  },
  calc: {
    kicker: 'What missed charges cost',
    fields: [
      { id: 'charges', label: 'Charges per month', min: 20000, max: 2000000, step: 10000, value: 400000, fmt: '$' },
      { id: 'leak', label: 'Charge leakage', min: 0.5, max: 5, step: 0.5, value: 1, fmt: '%' },
    ],
    compute: ({ charges, leak }) => [
      { label: 'Never billed each month', value: charges * (leak / 100), fmt: '$' },
      { label: 'Per year', value: charges * (leak / 100) * 12, fmt: '$', accent: true },
      { label: 'Over three years', value: charges * (leak / 100) * 36, fmt: '$' },
    ],
    note: 'Estimate. 1% is HFMA’s industry estimate for charge leakage. A charge audit measures your real rate.',
  },
  how: { eyebrow: '/ How we enter a day of charges', lines: ['One superbill,', 'matched to the claim.'] },
  doc: {
    org: 'Superbill vs. claim', title: 'Encounter reconciliation',
    meta: ['Patient J. Rivera', 'Provider Dr. A. Patel', 'DOS 10/13/2026'],
    cols: ['Code', 'Service', 'Superbill', 'On claim', 'Check'],
    rows: [
      { code: '99214', desc: 'Office visit, est. patient, moderate', a: '1', b: '1', flag: 'OK', flagNote: 'Matched', tone: 'ok' },
      { code: '93000', desc: 'Electrocardiogram, complete', a: '1', b: '—', flag: 'GAP', flagNote: 'Not entered' },
      { code: 'J1885', desc: 'Ketorolac injection, per 15 mg', a: '2 units', b: '1 unit', flag: 'UNITS', flagNote: 'Units short' },
    ],
  },
  steps: [
    { title: 'Pull in every encounter', body: 'Superbills, EHR encounters and procedure logs land in one daily queue, so no visit waits on someone remembering to send it.', line: 0, note: '42 encounters in · 0 missing from the schedule' },
    { title: 'Match the superbill to the claim', body: 'Each service on the superbill is matched to a claim line. Anything documented but not charged is flagged before the claim is built.', line: 1, note: '93000 documented, not charged → added', fix: { row: 1, b: '1' } },
    { title: 'Check units and modifiers', body: 'Drug units, time-based codes and modifiers are checked against the note, so the claim carries the full value of the visit.', line: 2, note: 'Ketorolac 30 mg = 2 units of J1885', fix: { row: 2, b: '2 units' } },
    { title: 'Release the same day', body: 'Complete charges go to coding review and submission on the day they’re entered.', line: 0, note: 'Batch released 5:40 PM', stamp: 'RELEASED' },
    { title: 'Reconcile and report lag', body: 'A daily check compares scheduled visits with charges entered, and charge lag is reported by provider.', line: 1, note: 'Charge lag 0.6 days · target under 1', stamp: 'RECONCILED' },
  ],
  ticket: {
    intro: 'Every encounter entered and reconciled the same day.', code: 'WO-CE-0001',
    scope: ['Daily charge entry from superbills and EHR', 'Encounter-to-charge reconciliation', 'Units, modifiers and NDC checks', 'Missing-charge follow-up with providers', 'Same-day release to billing', 'Charge lag report by provider'],
    reporting: 'Weekly · charge lag and missing charges found', owner: 'Dedicated charge entry team', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'about charge entry.'],
  faqs: [
    ['Do you enter charges from paper superbills?', 'Yes. Scanned or photographed superbills, EHR encounters and procedure logs all go into the same daily queue.'],
    ['How do you catch charges that were never entered?', 'Every day we compare the appointment schedule and the documented encounters with the charges entered. Any visit or service without a charge is flagged and followed up.'],
    ['What about injectables and supplies?', 'Drug codes are entered with the correct billing units and NDC numbers where the payer requires them, which is where a lot of quiet underbilling happens.'],
    ['Will this slow our claims down?', 'No. The goal is same-day entry and release, and we report charge lag by provider so you can see it.'],
    ACCESS_FAQ,
  ],
  closing: { eyebrow: '/ Free charge audit', lines: ['Send us one week of superbills.', 'We’ll show you what never got billed.'] },
};

/* ================================================================== */
const CODING: ServiceFull = {
  ...SERVICES[2],
  seoTitle: 'Medical Coding Services · Certified CPT & ICD-10 Coders',
  seoDescription: 'Certified coders assign CPT, ICD-10 and HCPCS codes the documentation supports, so claims pay on the first pass and hold up in an audit.',
  photo: 'doc',
  heroTitle: ['Codes that match', 'the chart. Every time.'],
  heroAccent: 'time.',
  heroSub: 'Certified coders assign CPT, ICD-10 and HCPCS codes the documentation supports, no more and no less, so claims get paid on the first pass and hold up if they’re ever audited.',
  cta: 'Get a free coding review',
  chip: ['Coded to the note.', 'Certified, specialty-trained coders.'],
  queue: {
    title: 'Coding queue', unit: '$', totalLabel: 'coded', pending: 'In review',
    rows: [
      { code: '99214', label: 'E/M · MDM moderate', done: 'Coded', value: 186 },
      { code: '93000', label: 'ECG · interpreted', done: 'Coded', value: 74 },
      { code: '78452', label: 'SPECT · with stress', done: 'Coded', value: 1240 },
      { code: 'G2211', label: 'Visit complexity add-on', done: 'Coded', value: 16 },
    ],
  },
  stat: {
    value: 43.84, decimals: 2, prefix: '$',
    label: 'is what providers spend, on average, fighting a single denied claim. Getting the code right the first time costs far less.',
    ...PREMIER,
  },
  calc: {
    kicker: 'What coding rework costs',
    fields: [
      { id: 'claims', label: 'Claims per month', min: 200, max: 6000, step: 100, value: 1200, fmt: 'n' },
      { id: 'rate', label: 'Denials caused by coding', min: 1, max: 15, step: 1, value: 5, fmt: '%' },
      { id: 'cost', label: 'Cost to fight each one', min: 20, max: 120, step: 1, value: 44, fmt: '$' },
    ],
    compute: ({ claims, rate, cost }) => {
      const n = claims * (rate / 100);
      return [
        { label: 'Coding denials a month', value: n, fmt: 'n' },
        { label: 'Spent fighting them', value: n * cost, fmt: '$', accent: true },
        { label: 'Per year', value: n * cost * 12, fmt: '$' },
      ];
    },
    note: 'Estimate. $43.84 is Premier’s average cost per denied claim. A coding review shows your real denial causes.',
  },
  how: { eyebrow: '/ How we code a visit', lines: ['One chart,', 'coded to what it supports.'] },
  doc: {
    org: 'Chart → code', title: 'Coding review · cardiology follow-up',
    meta: ['Patient J. Rivera', 'Provider Dr. A. Patel', 'DOS 10/13/2026'],
    cols: ['Code', 'Description', 'Draft', 'Final', 'Check'],
    rows: [
      { code: 'E/M', desc: 'Office visit, established patient', a: '99215', b: '—', flag: 'MDM', flagNote: 'Note supports moderate' },
      { code: 'ECG', desc: 'Electrocardiogram with interpretation', a: '93000', b: '—', flag: 'NCCI', flagNote: 'Needs 25 on E/M' },
      { code: 'Dx', desc: 'Coronary artery disease', a: 'I25.10', b: '—', flag: 'SPEC', flagNote: 'Angina documented' },
    ],
  },
  steps: [
    { title: 'Read the whole note', body: 'Coders read the visit note, orders and results before choosing a code, not just the level circled on the superbill.', line: 0, note: 'MDM: 2 chronic problems + Rx management' },
    { title: 'Level the visit to the documentation', body: 'E/M levels follow the medical decision-making rules. If the note supports a lower level, we code the lower level and tell the provider why.', line: 0, note: '99215 → 99214 · documented MDM is moderate', fix: { row: 0, b: '99214' } },
    { title: 'Pair procedures correctly', body: 'Modifiers and NCCI bundling edits are checked so a separately documented service isn’t denied as part of the visit.', line: 1, note: 'Modifier 25 on the E/M with same-day ECG', fix: { row: 1, b: '93000 + 25' } },
    { title: 'Code the diagnosis to full specificity', body: 'ICD-10 codes are carried to the specificity the note supports, which is what payers check for medical necessity.', line: 2, note: 'I25.110 · CAD with unstable angina', stamp: 'CODED', fix: { row: 2, b: 'I25.110' } },
    { title: 'Feed it back to providers', body: 'Patterns become short, specific feedback for each provider, so the next note can be coded without a query.', line: 0, note: 'Tip sent: document MDM elements or total time', stamp: 'AUDIT-READY' },
  ],
  ticket: {
    intro: 'Certified coding, checked before it costs you.', code: 'WO-MC-0001',
    scope: ['CPT, ICD-10-CM and HCPCS coding', 'E/M leveling to current MDM guidelines', 'NCCI edit and modifier checks', 'Provider queries when notes are unclear', 'Specialty-trained coders', 'Monthly coding accuracy report'],
    reporting: 'Monthly · accuracy, denials by code, provider feedback', owner: 'Certified coder (CPC or CCS)', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'about outsourced coding.'],
  faqs: [
    ['Are your coders certified?', 'Yes, our coders hold AAPC or AHIMA credentials and are matched to your specialty. ' + CONFIRM],
    ['Will you ever code higher than the provider chose?', 'We code what the documentation supports. Sometimes that’s higher than the superbill, sometimes lower. Every change comes with the reason, so providers can see it.'],
    ['How do you handle unclear notes?', 'We send the provider a short, specific query instead of guessing, and track how long queries stay open.'],
    ['Do you code procedures and surgery, not just E/M?', 'Yes, including modifiers, global periods and bundling edits for procedural specialties.'],
    ACCESS_FAQ,
  ],
  closing: { eyebrow: '/ Free coding review', lines: ['Send us 20 charts.', 'We’ll show you what the codes should be.'] },
};

/* ================================================================== */
const BILLING: ServiceFull = {
  ...SERVICES[3],
  seoTitle: 'Medical Billing Services · Clean Claims, Submitted Same Day',
  seoDescription: 'Every claim scrubbed against payer rules, submitted the day it’s ready and tracked until it’s accepted, so fewer come back.',
  photo: 'h1',
  heroTitle: ['Clean claims out,', 'the same day.'],
  heroAccent: 'day.',
  heroSub: 'Every claim is scrubbed against payer rules before it leaves, submitted the day it’s ready and tracked until the payer accepts it, so fewer come back and the rest come back faster.',
  cta: 'Get a free claim review',
  chip: ['Scrubbed before it’s sent.', 'Payer rules checked on every claim.'],
  queue: {
    title: 'Claim scrubber', unit: '$', totalLabel: 'submitted', pending: 'Checking',
    rows: [
      { code: 'CLM-406', label: 'Rivera · Cardiology', done: 'Clean', value: 1500 },
      { code: 'CLM-407', label: 'Chen · Primary care', done: 'Clean', value: 412 },
      { code: 'CLM-408', label: 'Okafor · Orthopedics', done: 'Fixed', value: 968 },
      { code: 'CLM-409', label: 'Brooks · Primary care', done: 'Clean', value: 186 },
    ],
  },
  stat: {
    value: 15, prefix: '~', suffix: '%',
    label: 'of claims sent to private payers are denied on first submission.',
    ...PREMIER,
  },
  calc: {
    kicker: 'What first-pass denials cost',
    fields: [
      { id: 'claims', label: 'Claims per month', min: 200, max: 6000, step: 100, value: 1200, fmt: 'n' },
      { id: 'avg', label: 'Average claim value', min: 60, max: 900, step: 10, value: 180, fmt: '$' },
      { id: 'rate', label: 'First-pass denial rate', min: 3, max: 25, step: 1, value: 15, fmt: '%' },
    ],
    compute: ({ claims, avg, rate }) => {
      const n = claims * (rate / 100);
      return [
        { label: 'Claims bounced a month', value: n, fmt: 'n' },
        { label: 'Revenue delayed', value: n * avg, fmt: '$', accent: true },
        { label: 'Cost to fight them (~$44 each)', value: n * 43.84, fmt: '$' },
      ];
    },
    note: 'Estimate. Premier found nearly 15% of private-payer claims are initially denied, at $43.84 on average to fight each one.',
  },
  how: { eyebrow: '/ How we send a claim', lines: ['One claim,', 'checked before it leaves.'] },
  doc: {
    org: 'Claim scrubber', title: 'CMS-1500 · pre-submission check',
    meta: ['Claim CLM-24-118 406', 'Payer: Sample Health Plan', 'DOS 09/12/2026'],
    cols: ['Box', 'Check', 'Value', 'Result', 'Rule'],
    rows: [
      { code: '1a', desc: 'Insured ID and plan', a: '••• 2291', b: 'Fail', flag: 'ELIG', flagNote: 'Plan changed 09/01' },
      { code: '24E', desc: 'Diagnosis pointer for 78452', a: 'A', b: 'Fail', flag: 'LCD', flagNote: 'Dx doesn’t support' },
      { code: '24D', desc: 'Procedure + modifier', a: '99214', b: 'Warn', flag: 'NCCI', flagNote: 'Needs 25 with 93000' },
    ],
  },
  steps: [
    { title: 'Re-verify eligibility', body: 'Coverage is checked again before submission, because a plan that changed last month is the cheapest denial to prevent.', line: 0, note: 'New plan ID loaded from 271 response', fix: { row: 0, b: 'Pass' } },
    { title: 'Scrub against payer rules', body: 'Every claim runs through payer-specific edits: NCCI pairs, coverage policies, frequency limits and required fields.', line: 2, note: 'Modifier 25 appended to 99214', fix: { row: 2, b: 'Pass' } },
    { title: 'Fix it before it’s sent', body: 'Edits are resolved by a biller, not just flagged. Coding questions go to the coder the same day.', line: 1, note: 'Pointer moved to the supporting diagnosis', fix: { row: 1, b: 'Pass' } },
    { title: 'Submit the same day', body: 'Clean claims go out electronically the day they’re ready, and clearinghouse acknowledgments are checked every morning.', line: 0, note: '999 and 277CA accepted at 6:12 AM', stamp: 'SUBMITTED' },
    { title: 'Track to adjudication', body: 'Claims with no response are followed up before they age, and rejections are corrected within a day.', line: 2, note: 'Day 14 · adjudicated, remit expected', stamp: 'ACCEPTED' },
  ],
  ticket: {
    intro: 'Scrubbed, submitted and tracked, every day.', code: 'WO-MB-0001',
    scope: ['Eligibility re-verification before submission', 'Payer-specific claim scrubbing', 'Same-day electronic submission', 'Clearinghouse rejection fixes', 'Claim status follow-up', 'Monthly clean-claim and first-pass report'],
    reporting: 'Monthly · clean-claim rate, first-pass yield, rejections', owner: 'Dedicated billing specialist', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'before switching billers.'],
  faqs: [
    ['Which billing systems do you work in?', 'We work inside your existing practice management system and clearinghouse, so nothing changes for your front desk or providers. ' + CONFIRM],
    ['How fast do claims go out?', 'The goal is the same day the charge and coding are complete. We report submission lag so you can hold us to it.'],
    ['What happens to rejected claims?', 'Clearinghouse and payer rejections are corrected and resent within a day, and recurring causes become scrubber rules.'],
    ['Do you bill patients too?', 'Patient statements and balance follow-up can be included. Tell us how you handle them today and we’ll match it.'],
    ACCESS_FAQ,
  ],
  closing: { eyebrow: '/ Free claim review', lines: ['Send us last month’s rejections.', 'We’ll show you which were preventable.'] },
};

/* ================================================================== */
const POSTING: ServiceFull = {
  ...SERVICES[4],
  seoTitle: 'Payment Posting Services · ERA, EOB & Underpayment Checks',
  seoDescription: 'Payments posted line by line, balanced to the deposit and checked against your contracts, so underpayments and hidden denials surface the day they arrive.',
  photo: 'h2',
  heroTitle: ['Every dollar posted.', 'Every short pay caught.'],
  heroAccent: 'caught.',
  heroSub: 'Payments are posted from ERAs and EOBs line by line, matched to the deposit and checked against your contracted rates, so underpayments and hidden denials surface the day they arrive.',
  cta: 'Check my underpayments',
  chip: ['Posted to the penny.', 'Remits matched to deposits daily.'],
  queue: {
    title: 'Remittance batch', unit: '$', totalLabel: 'posted', pending: 'Unposted',
    rows: [
      { code: 'ERA', label: 'Aetna · 14 claims', done: 'Posted', value: 4210 },
      { code: 'ERA', label: 'UnitedHealthcare · 9 claims', done: 'Posted', value: 2876 },
      { code: 'EOB', label: 'Medicare · 6 claims', done: 'Posted', value: 1190 },
      { code: 'LBX', label: 'Patient payments', done: 'Posted', value: 640 },
    ],
  },
  stat: {
    value: 54.3, decimals: 1, suffix: '%',
    label: 'of initially denied claims are eventually paid, but only after someone spots the denial on the remittance and works it.',
    ...PREMIER,
  },
  calc: {
    kicker: 'What unchecked short pays cost',
    fields: [
      { id: 'coll', label: 'Insurance payments per month', min: 50000, max: 2000000, step: 10000, value: 300000, fmt: '$' },
      { id: 'share', label: 'Lines paid below contract', min: 1, max: 10, step: 0.5, value: 4, fmt: '%' },
      { id: 'short', label: 'Average shortfall on those lines', min: 5, max: 40, step: 1, value: 15, fmt: '%' },
    ],
    compute: ({ coll, share, short }) => {
      const m = coll * (share / 100) * (short / 100);
      return [
        { label: 'Short-paid each month', value: m, fmt: '$' },
        { label: 'Per year', value: m * 12, fmt: '$', accent: true },
        { label: 'Over three years', value: m * 36, fmt: '$' },
      ];
    },
    note: 'Illustrative. Underpayment rates vary widely by payer and contract. Your assessment compares remits with your actual fee schedules.',
  },
  how: { eyebrow: '/ How we post a remit', lines: ['One remittance,', 'checked line by line.'] },
  doc: {
    org: '835 Remittance', title: 'Sample Health Plan · ERA 8812',
    meta: ['EFT ••• 4471', 'Deposited 10/14/2026', '14 claims'],
    cols: ['Code', 'Service', 'Expected', 'Paid', 'Variance'],
    rows: [
      { code: '99214', desc: 'Office visit, est. patient, moderate', a: '$128.40', b: '$128.40', flag: 'OK', flagNote: 'Matches contract', tone: 'ok' },
      { code: '93000', desc: 'Electrocardiogram, complete', a: '$22.10', b: '$0.00', flag: 'CO-97', flagNote: 'Hidden denial' },
      { code: '78452', desc: 'Myocardial perfusion imaging', a: '$412.00', b: '$356.80', flag: '−$55.20', flagNote: 'Below contract' },
    ],
  },
  steps: [
    { title: 'Post every line', body: 'ERAs are auto-posted and every exception is posted by hand, line by line, never as a lump sum on the account.', line: 0, note: '14 claims · 31 lines posted' },
    { title: 'Balance to the bank', body: 'Each remit is matched to the deposit it belongs to, so missing EFTs and stray checks are caught the same day.', line: 0, note: 'EFT ••• 4471 matched to ERA 8812', stamp: 'BALANCED' },
    { title: 'Compare to your contract', body: 'Allowed amounts are checked against your fee schedules. Anything short is flagged as an underpayment, not written off.', line: 2, note: 'Paid at last year’s rate → reprocessing requested' },
    { title: 'Route the zero-pays', body: 'Denials hidden inside payments go straight to denial management with the reason code attached.', line: 1, note: 'CO-97 → denial management queue' },
    { title: 'Recover the difference', body: 'Underpayments are appealed or reprocessed, and each payer’s pattern is reported so you can raise it at contract renewal.', line: 2, note: 'Reprocessed · +$55.20 posted', stamp: 'RECOVERED', fix: { row: 2, b: '$412.00' } },
  ],
  ticket: {
    intro: 'Posted, balanced and checked against your contracts.', code: 'WO-PP-0001',
    scope: ['ERA auto-posting with exception handling', 'Manual EOB and lockbox posting', 'Daily deposit reconciliation', 'Contract variance (underpayment) checks', 'Denials routed with reason codes', 'Patient payment and refund posting'],
    reporting: 'Weekly · posted vs deposited, underpayments by payer', owner: 'Dedicated payment poster', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'about payment posting.'],
  faqs: [
    ['Do you post paper EOBs and patient payments?', 'Yes. ERAs, paper EOBs, lockbox files, card payments and refunds are all posted, so every account balance is accurate.'],
    ['How do you know a payment is short?', 'We load your fee schedules and compare every allowed amount with the contracted rate. Anything below it is flagged, not adjusted off.'],
    ['What happens to zero-pay lines?', 'They go straight to denial management with the reason code, so a denial hidden in a payment doesn’t get written off by mistake.'],
    ['Will our deposits match our reports?', 'Yes. Every remit is balanced to a deposit daily, and unmatched deposits or remits are chased the same week.'],
    ACCESS_FAQ,
  ],
  closing: { eyebrow: '/ Free underpayment check', lines: ['Send us one month of remits.', 'We’ll find what was paid short.'] },
};

/* ================================================================== */
const AR: ServiceFull = {
  ...SERVICES[6],
  seoTitle: 'A/R Recovery Services · Aged Claims Follow-Up',
  seoDescription: 'Aged and forgotten claims worked oldest-and-largest first, inside each payer’s filing limits, until they pay or close with a documented reason.',
  photo: 'h3',
  heroTitle: ['Old claims', 'still have money in them.'],
  heroAccent: 'money',
  heroSub: 'A/R specialists work aged and forgotten claims, oldest and largest first, inside each payer’s filing limits, until they pay or are closed with a documented reason.',
  cta: 'Get a free A/R review',
  chip: ['Worked before the deadline.', 'Every claim followed to paid or closed.'],
  queue: {
    title: 'Aged A/R · 90+ days', unit: '$', totalLabel: 'collected', pending: 'Open',
    rows: [
      { code: 'CLM-118', label: 'Aetna · 97 days', done: 'Paid', value: 1240 },
      { code: 'CLM-102', label: 'UnitedHealthcare · 121 days', done: 'Paid', value: 612 },
      { code: 'CLM-087', label: 'BCBS · 143 days', done: 'Paid', value: 388 },
      { code: 'CLM-064', label: 'Medicare · 166 days', done: 'Closed', value: 0 },
    ],
  },
  stat: {
    value: 49, suffix: '%',
    label: 'of practices told MGMA their days in A/R went up over a single year.',
    source: 'MGMA Stat poll, November 2021',
    href: 'https://www.mgma.com/mgma-stats/not-so-graceful-aging-half-of-practices-saw-days-in-a-r-increase-in-2021',
  },
  calc: {
    kicker: 'What aged A/R is worth',
    fields: [
      { id: 'ar', label: 'Total insurance A/R', min: 50000, max: 3000000, step: 10000, value: 600000, fmt: '$' },
      { id: 'old', label: 'Share older than 90 days', min: 5, max: 60, step: 1, value: 25, fmt: '%' },
      { id: 'rec', label: 'Share still collectible', min: 20, max: 90, step: 5, value: 60, fmt: '%' },
    ],
    compute: ({ ar, old, rec }) => {
      const aged = ar * (old / 100);
      return [
        { label: 'Over 90 days', value: aged, fmt: '$' },
        { label: 'Still collectible', value: aged * (rec / 100), fmt: '$', accent: true },
        { label: 'Lost if left alone', value: aged * (1 - rec / 100), fmt: '$' },
      ];
    },
    note: 'Illustrative. Recovery depends on payer, claim age and filing limits. We price a backlog after reviewing it.',
  },
  how: { eyebrow: '/ How we work a backlog', lines: ['One aging report,', 'worked to zero.'] },
  doc: {
    org: 'A/R aging report', title: 'Payer follow-up worklist',
    meta: ['As of 10/14/2026', 'Cardiology group', 'Over 90 days: $184,220'],
    cols: ['Claim', 'Payer · status', 'Age', 'Balance', 'Deadline'],
    rows: [
      { code: '118', desc: 'Aetna · no response', a: '97 d', b: '$1,240', flag: '23 days', flagNote: 'Appeal limit' },
      { code: '102', desc: 'UHC · records requested', a: '121 d', b: '$612', flag: '59 days', flagNote: 'Filing limit' },
      { code: '064', desc: 'Medicare · CO-18 duplicate', a: '166 d', b: '$214', flag: 'CHECK', flagNote: 'Original paid?' },
    ],
  },
  steps: [
    { title: 'Sort by value and deadline', body: 'The backlog is ranked by balance and by days left to file or appeal, so expensive claims don’t age out while small ones get worked.', line: 0, note: 'Top 40 claims hold 61% of the aged balance' },
    { title: 'Call, check the portal, resubmit', body: 'Each claim gets a status check through the payer portal or a call, and the next action is logged with a follow-up date.', line: 1, note: 'Records sent via portal · ref #77341' },
    { title: 'Fix what’s fixable', body: 'Missing information, wrong payer and coordination-of-benefits problems are corrected and resubmitted.', line: 0, note: 'Corrected claim sent on day 98', stamp: 'PAID', fix: { row: 0, b: '$0 · paid' } },
    { title: 'Close what isn’t', body: 'Duplicates, contractual adjustments and truly uncollectable balances are closed with a reason, so your A/R reflects reality.', line: 2, note: 'Duplicate of a paid claim → adjusted off', fix: { row: 2, b: '$0 · closed' } },
    { title: 'Stop the backlog coming back', body: 'Aging reasons are reported by payer and cause, and fed back to billing and denial management.', line: 1, note: '90+ balance down week over week', stamp: 'ON TRACK', fix: { row: 1, b: '$0 · paid' } },
  ],
  ticket: {
    intro: 'Aged claims worked until they pay or close.', code: 'WO-AR-0001',
    scope: ['Backlog review and prioritization', 'Payer calls, portals and resubmissions', 'Appeals inside filing limits', 'Coordination-of-benefits fixes', 'Write-off recommendations with reasons', 'Weekly aging and recovery report'],
    reporting: 'Weekly · aging buckets, collected, closed', owner: 'Dedicated A/R specialist', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'about old A/R.'],
  faqs: [
    ['How old is too old?', 'It depends on each payer’s timely filing and appeal limits. We check every claim against its deadline first, so nothing collectible is missed.'],
    ['Can you work A/R from a previous billing company?', 'Yes. We start from an aging report and the claim history in your system, and rebuild missing context with the payer where needed.'],
    ['Will you write off our balances?', 'Only with your approval and a documented reason for each one. We never adjust off a collectible balance to make a report look better.'],
    ['Do you charge differently for a backlog?', 'A one-time backlog project can be priced separately from ongoing A/R follow-up. We quote it after reviewing the aging report. ' + CONFIRM],
    ACCESS_FAQ,
  ],
  closing: { eyebrow: '/ Free A/R review', lines: ['Send us your aging report.', 'We’ll tell you what’s still collectible.'] },
};

/* ================================================================== */
const RCM: ServiceFull = {
  ...SERVICES[7],
  seoTitle: 'Revenue Cycle Management Services for Medical Practices',
  seoDescription: 'Credentialing, coding, billing, posting, denials and A/R run by one accountable team inside your systems, with one monthly report.',
  photo: 'h1',
  heroTitle: ['One team for the', 'whole revenue cycle.'],
  heroAccent: 'whole',
  heroSub: 'Credentialing, coding, billing, posting, denials and A/R, run by one accountable team inside your systems, with one monthly report that shows where every dollar is.',
  cta: 'Get a free revenue assessment',
  chip: ['One team. One report.', 'From eligibility to final payment.'],
  queue: {
    title: 'This week', unit: '#', totalLabel: 'tasks closed', pending: 'Open',
    rows: [
      { code: 'ELIG', label: 'Eligibility checks', done: 'Done', value: 212 },
      { code: 'CODE', label: 'Charts coded', done: 'Done', value: 198 },
      { code: 'CLM', label: 'Claims submitted', done: 'Done', value: 204 },
      { code: 'DEN', label: 'Denials worked', done: 'Done', value: 17 },
    ],
  },
  stat: {
    value: 19.7, decimals: 1, prefix: '$', suffix: 'B',
    label: 'a year is what providers spend fighting claim denials, much of it on claims that are eventually paid anyway.',
    ...PREMIER,
  },
  calc: {
    kicker: 'What a leaky cycle costs',
    fields: [
      { id: 'exp', label: 'Expected collections per month', min: 50000, max: 3000000, step: 10000, value: 400000, fmt: '$' },
      { id: 'ncr', label: 'Your net collection rate', min: 80, max: 99, step: 1, value: 92, fmt: '%' },
    ],
    compute: ({ exp, ncr }) => [
      { label: 'Uncollected each month', value: exp * (1 - ncr / 100), fmt: '$' },
      { label: 'Per year', value: exp * (1 - ncr / 100) * 12, fmt: '$', accent: true },
      { label: 'Gained a year at 96%', value: Math.max(0, exp * (0.96 - ncr / 100) * 12), fmt: '$' },
    ],
    note: 'Illustrative. Many practices aim for a net collection rate of 95% or more. Your assessment calculates yours from real data.',
  },
  how: { eyebrow: '/ How we run the cycle', lines: ['One report,', 'every number owned.'] },
  doc: {
    org: 'Monthly RCM report', title: 'Sample · cardiology group',
    meta: ['6 providers', '1,204 claims', 'Sample figures'],
    cols: ['KPI', 'Measure', 'Baseline', 'Now', 'Target'],
    rows: [
      { code: 'DAR', desc: 'Days in A/R', a: '52', b: '52', flag: '< 40', flagNote: 'Target', tone: 'neutral' },
      { code: 'FPY', desc: 'First-pass claim yield', a: '84%', b: '84%', flag: '> 95%', flagNote: 'Target', tone: 'neutral' },
      { code: 'NCR', desc: 'Net collection rate', a: '91%', b: '91%', flag: '> 96%', flagNote: 'Target', tone: 'neutral' },
    ],
  },
  steps: [
    { title: 'Start with a baseline', body: 'We measure where you are from your own data: denial rate, days in A/R, first-pass yield and net collections.', line: 0, note: 'Baseline set from 12 months of claims' },
    { title: 'Fix the front end first', body: 'Eligibility, enrollment and charge capture are tightened first, because most downstream problems start there.', line: 1, note: 'Eligibility checks moved to 48 h before visits' },
    { title: 'Run the middle every day', body: 'Coding, scrubbing and submission happen daily, with the same team watching rejections and denials.', line: 1, note: 'Scrubber rules added for the top 3 payers', fix: { row: 1, b: '93%' } },
    { title: 'Work the back end down', body: 'Payments are posted and reconciled, denials are worked and aged A/R is chased until it pays or closes.', line: 0, note: 'Aged A/R worked down weekly', fix: { row: 0, b: '41' } },
    { title: 'One number per problem', body: 'A monthly report shows each KPI against target, what moved it and what we’re doing next, reviewed with you on a call.', line: 2, note: 'Sample figures · your report uses your data', stamp: 'ON TARGET', fix: { row: 2, b: '95%' } },
  ],
  ticket: {
    intro: 'Everything from eligibility to the last payment.', code: 'WO-RCM-0001',
    scope: ['Eligibility and benefits verification', 'Credentialing and enrollment', 'Charge entry and certified coding', 'Claim scrubbing and submission', 'Payment posting and reconciliation', 'Denial management and A/R follow-up', 'Monthly KPI report and review call'],
    reporting: 'Monthly · KPIs vs target, actions taken', owner: 'Account manager + specialist team', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'before handing over billing.'],
  faqs: [
    ['Do we have to change our EHR or PM system?', 'No. We work inside the systems you already use, so your providers and front desk keep their workflow.'],
    ['How long does the switch take?', 'Most transitions take a few weeks: access, a baseline report, and running alongside your current process before taking over. ' + CONFIRM],
    ['What happens to our existing A/R?', 'We take over the open A/R from day one and work the aged backlog as a separate priority, so nothing falls between the old process and the new one.'],
    ['How do we know it’s working?', 'Every month you get the same KPIs against the same targets: days in A/R, first-pass yield, denial rate and net collection rate, plus what we’re doing about each.'],
    ACCESS_FAQ,
  ],
  closing: { eyebrow: '/ Free revenue assessment', lines: ['Hand us one month of data.', 'We’ll show you the whole cycle.'] },
};

/* ================================================================== */
const AUDITS: ServiceFull = {
  ...SERVICES[8],
  seoTitle: 'Medical Billing & Coding Audits for Practices',
  seoDescription: 'An independent review of coding, documentation, claims and payments, with every finding priced in dollars and a fix list your team can act on.',
  photo: 'doc',
  heroTitle: ['Find the leaks', 'before a payer does.'],
  heroAccent: 'payer',
  heroSub: 'An independent review of your coding, documentation, claims and payments, with every finding priced in dollars and a fix list your team can act on, whether or not you outsource anything to us.',
  cta: 'Book a sample audit',
  chip: ['Findings in dollars.', 'With a fix list for each one.'],
  queue: {
    title: 'Audit findings', unit: '$', totalLabel: 'identified', pending: 'Reviewing',
    rows: [
      { code: 'E/M', label: 'Undercoded visits · 9', done: 'Found', value: 2140 },
      { code: 'MOD', label: 'Missing modifier 25 · 6', done: 'Found', value: 1380 },
      { code: 'PAY', label: 'Underpaid lines · 11', done: 'Found', value: 960 },
      { code: 'DOC', label: 'Notes missing MDM · 4', done: 'Flagged', value: 0 },
    ],
  },
  stat: {
    value: 7.66, decimals: 2, suffix: '%',
    label: 'of Medicare fee-for-service payments in 2024 were improper, $31.7 billion, most often because of insufficient documentation.',
    source: 'CMS, FY2024 Improper Payments Fact Sheet',
    href: 'https://www.cms.gov/newsroom/fact-sheets/fiscal-year-2024-improper-payments-fact-sheet',
  },
  calc: {
    kicker: 'What an audit sample can reveal',
    fields: [
      { id: 'claims', label: 'Claims per month', min: 200, max: 6000, step: 100, value: 1200, fmt: 'n' },
      { id: 'err', label: 'Error rate found in the sample', min: 2, max: 20, step: 1, value: 8, fmt: '%' },
      { id: 'val', label: 'Average value at stake per error', min: 20, max: 400, step: 10, value: 90, fmt: '$' },
    ],
    compute: ({ claims, err, val }) => {
      const n = claims * (err / 100);
      return [
        { label: 'Claims with errors a month', value: n, fmt: 'n' },
        { label: 'Value at stake a month', value: n * val, fmt: '$', accent: true },
        { label: 'Per year', value: n * val * 12, fmt: '$' },
      ];
    },
    note: 'Illustrative. A sample audit measures your actual error rate before any number is projected.',
  },
  how: { eyebrow: '/ How we run an audit', lines: ['One sample of claims,', 'every finding priced.'] },
  doc: {
    org: 'Audit worksheet', title: 'Sample of 50 claims · Q3',
    meta: ['Cardiology group', 'Reviewer: certified coder', 'July–September 2026'],
    cols: ['Claim', 'Finding', 'Billed', 'Should be', 'Impact'],
    rows: [
      { code: '1142', desc: 'E/M level vs. documented MDM', a: '99213', b: '—', flag: '+$46', flagNote: 'Undercoded', tone: 'neutral' },
      { code: '1157', desc: 'ECG billed with E/M', a: '93000', b: '—', flag: '+$22', flagNote: 'Missing 25', tone: 'neutral' },
      { code: '1163', desc: 'High-level visit, thin note', a: '99215', b: '—', flag: 'RISK', flagNote: 'Documentation' },
    ],
  },
  steps: [
    { title: 'Pull a fair sample', body: 'Claims are sampled across providers, payers and visit types, so the findings reflect how your practice actually bills.', line: 0, note: '50 claims · 6 providers · 9 payers' },
    { title: 'Re-code from the chart', body: 'Each claim is coded again from the documentation and compared line by line with what was billed.', line: 0, note: 'MDM supports 99214 → undercoded', fix: { row: 0, b: '99214' } },
    { title: 'Check what the payer did', body: 'Remits are compared with contracts and denials with their causes, so payment problems show up next to coding ones.', line: 1, note: 'Denied as bundled → modifier 25 missing', fix: { row: 1, b: '93000 + 25' } },
    { title: 'Flag the compliance risk', body: 'Overcoding and thin documentation are reported too, because the cheapest refund is the one you never owe.', line: 2, note: 'Document MDM or total time for 99215', stamp: 'FLAGGED', fix: { row: 2, b: 'Query' } },
    { title: 'Price it, hand over a fix list', body: 'Every finding is projected in dollars and paired with a specific fix and an owner, presented in a readout with your team.', line: 0, note: 'Readout · biggest three fixes first', stamp: 'REPORTED' },
  ],
  ticket: {
    intro: 'An outside look, priced in dollars.', code: 'WO-AU-0001',
    scope: ['Claim sample across providers and payers', 'Coding and documentation review', 'Denial and underpayment review', 'Compliance risk flags', 'Findings projected in dollars', 'Readout call and prioritized fix list'],
    reporting: 'One-time · written report and readout call', owner: 'Senior certified coder', turnaround: CONFIRM,
  },
  faqLines: ['What practices ask', 'before an audit.'],
  faqs: [
    ['Do we have to outsource billing to get an audit?', 'No. The audit stands on its own, and the fix list is written so your team, or your current billing company, can act on it.'],
    ['How many claims do you review?', 'Usually a sample of 50 to 100 claims across providers, payers and visit types, sized to your volume. ' + CONFIRM],
    ['Will you report overcoding too?', 'Yes. Compliance risk is part of every audit, because repaying an overpayment later costs more than fixing it now.'],
    ['What do we get at the end?', 'A written report with each finding, its dollar impact and a specific fix, plus a readout call with your team.'],
    ACCESS_FAQ,
  ],
  closing: { eyebrow: '/ Free sample audit', lines: ['Book a sample audit.', 'Get findings in dollars, not jargon.'] },
};


/* ================================================================== */
/* Peer-to-peer review support. Sources: AMA prior authorization physician survey (2024, 1,000 physicians);
   KFF analysis of Medicare Advantage prior authorization, 2023 data (Jan 2025). */
const AMA_P2P = 'https://www.ama-assn.org/practice-management/prior-authorization/fixing-prior-auth-give-doctors-true-peer-talk-stat';
const P2P: ServiceFull = {
  ...SERVICES[9],
  seoTitle: 'Peer-to-Peer Review Support for Medical Practices',
  seoDescription: 'We schedule peer-to-peer reviews inside the payer’s window, build the clinical case, brief your physician in five minutes and file the appeal if the denial is upheld.',
  photo: 'doc',
  heroTitle: ['Peer-to-peer reviews,', 'prepped to win.'],
  heroAccent: 'win.',
  heroSub: 'When a payer denies care as not medically necessary, your physician often gets one short call with the plan’s medical director. We book it inside the payer’s window, build the clinical case, brief your physician in five minutes and file the written appeal if the call doesn’t turn it around.',
  cta: 'Get a free denial review',
  chip: ['Requested the same business day.', 'Packet and brief within one business day.'],
  queue: {
    title: 'Peer-to-peer queue', unit: '$', totalLabel: 'approved after review', pending: 'Denied',
    rows: [
      { code: '78452', label: 'SPECT · medical necessity', done: 'Overturned', value: 1240 },
      { code: '27447', label: 'Knee replacement · conservative care', done: 'Approved', value: 1680 },
      { code: '70553', label: 'MRI brain · criteria not met', done: 'Overturned', value: 620 },
      { code: '96413', label: 'Infusion · off-pathway drug', done: 'Appeal filed', value: 2950 },
    ],
  },
  stat: {
    value: 16, suffix: '%',
    label: 'of physicians say the health plan’s “peer” often or always has the right qualifications for the case under review.',
    source: 'AMA prior authorization physician survey, 2024',
    href: AMA_P2P,
  },
  calc: {
    kicker: 'What lost peer-to-peers cost',
    fields: [
      { id: 'n', label: 'Medical-necessity denials per month', min: 1, max: 80, step: 1, value: 12, fmt: 'n' },
      { id: 'val', label: 'Average value of each case', min: 200, max: 20000, step: 100, value: 2500, fmt: '$' },
      { id: 'win', label: 'Share you get approved today', min: 0, max: 95, step: 5, value: 35, fmt: '%' },
    ],
    compute: ({ n, val, win }) => [
      { label: 'At stake each month', value: n * val, fmt: '$' },
      { label: 'Lost each year at today’s rate', value: n * val * (1 - win / 100) * 12, fmt: '$', accent: true },
      { label: 'Each extra case won a month, per year', value: val * 12, fmt: '$' },
    ],
    note: 'Estimate from your own numbers; we don’t assume a win rate. For context: KFF found Medicare Advantage plans fully or partly overturned 81.7% of the prior-authorization denials that were appealed in 2023, yet only 11.7% of denials were appealed.',
  },
  how: { eyebrow: '/ How we run a peer-to-peer', lines: ['One denial,', 'one prepared call.'] },
  doc: {
    org: 'Peer-to-peer case packet', title: 'Sample · SPECT perfusion, denied as not medically necessary',
    meta: ['Payer: Sample Health Plan', 'Physician: ordering cardiologist', 'Sample case'],
    cols: ['Item', 'What the reviewer needs', 'Chart', 'Packet', 'Criteria'],
    rows: [
      { code: 'DEN', desc: 'Denial letter and the guideline it cites', a: 'Received', b: 'Open', flag: 'Plan policy', flagNote: 'Criteria cited', tone: 'neutral' },
      { code: 'HX', desc: 'Symptoms and the care already tried', a: 'In notes', b: 'Missing', flag: 'Not met', flagNote: 'Not in summary' },
      { code: 'GL', desc: 'Specialty guideline that supports the order', a: '—', b: 'Missing', flag: 'To attach', flagNote: 'Society criteria' },
    ],
  },
  steps: [
    { title: 'Catch it the day it lands', body: 'Adverse determinations and pend letters are logged the day they arrive, with the payer’s peer-to-peer deadline on the clock. Miss the window and the only road left is a slower written appeal.', line: 0, note: 'Deadline logged · call requested on day 1' },
    { title: 'Read the criteria they used', body: 'The letter names the guideline behind the denial, often MCG, InterQual or the plan’s own policy. We map each criterion to what is, and isn’t, in the chart.', line: 0, note: '3 criteria cited · 2 met in the chart', fix: { row: 0, b: 'Mapped' } },
    { title: 'Build the case packet', body: 'A short clinical summary, the chart lines that meet each criterion and the specialty society guideline that supports the order, sent to the reviewer before the call where the plan allows it.', line: 1, note: 'Six weeks of failed medication added', fix: { row: 1, b: 'Added' } },
    { title: 'Brief your physician in five minutes', body: 'One page: what was denied, why, and the three points to make. We ask for a reviewer in the same specialty, and keep the call to about ten minutes of your physician’s day.', line: 2, note: 'Ask for a cardiologist reviewer', fix: { row: 2, b: 'Attached' } },
    { title: 'Close the loop', body: 'We log the outcome. If the denial is upheld, the written or expedited appeal goes out before its deadline, and the gap that caused it becomes a line on your prior-auth checklist.', line: 1, note: 'Approved on the call · auth number posted', stamp: 'APPROVED' },
  ],
  ticket: {
    intro: 'Your physician makes the call. We do everything around it.', code: 'WO-P2P-0001',
    scope: ['Denial and pend letters logged the same day', 'Peer-to-peer booked inside the payer’s window', 'Case packet: summary, chart evidence, guideline', 'One-page physician brief', 'Same-specialty reviewer requested', 'Written or expedited appeal if upheld', 'Outcomes tracked by payer and service'],
    reporting: 'Monthly · requests, approvals, upheld, appealed, dollars', owner: 'Prior auth and appeals specialist', turnaround: 'Call requested same business day · packet and brief within 1 business day (urgent cases within 4 hours)',
  },
  faqLines: ['What practices ask', 'about peer-to-peer reviews.'],
  faqs: [
    ['What is a peer-to-peer review?', 'A phone call between the treating physician and a physician working for the health plan, usually its medical director or a contracted reviewer, to discuss a prior-authorization or medical-necessity decision. It often turns a denial around faster than a written appeal.'],
    ['Who has to be on the call?', 'Plans expect the ordering physician, or another clinician they accept, to speak. We handle everything around the call: requesting it, scheduling it, the case packet, the brief and the follow-up, so it takes about ten minutes of your physician’s time.'],
    ['What if the plan’s reviewer isn’t in our specialty?', 'Ask for one who is. In an AMA survey, only 16% of physicians said the plan’s “peer” often or always had the right qualifications. We request a same-specialty reviewer every time, and about half of states have laws on peer-to-peer appeals.'],
    ['How quickly do we have to ask?', 'Each plan sets its own window, and it can be short, so we log the deadline the day the letter arrives. If the window has closed, we move straight to the written appeal.'],
    ['What happens if the denial is upheld?', 'The written appeal, or an expedited appeal when care is urgent, goes out with the same case packet before its deadline. Appeals often work: KFF found 81.7% of appealed Medicare Advantage prior-auth denials were fully or partly overturned in 2023.'],
    ['How long does each step take?', 'We request the peer-to-peer the same business day the letter arrives. The case packet and physician brief are ready within one business day, or within four hours when care is urgent. If the denial is upheld, the appeal goes out well before its deadline, usually within three business days.'],
    ['How is it priced, and what access do you need?', `It’s included when we run your prior authorizations or denials, and available on its own, priced per case, for practices that keep billing in-house. Setup takes about a week: a BAA, access to your EHR (read-only), payer portals and denial letters, and a short call with your physicians. ${CONFIRM}`],
  ],
  closing: { eyebrow: '/ Free denial review', lines: ['Send us last month’s denials.', 'We’ll flag every one worth a call.'] },
};

export const SERVICE_PAGES: Record<string, ServiceFull> = {
  'credentialing': CREDENTIALING,
  'charge-entry': CHARGE,
  'medical-coding': CODING,
  'medical-billing': BILLING,
  'payment-posting': POSTING,
  'denial-management': DENIAL,
  'ar-recovery': AR,
  'revenue-cycle-management': RCM,
  'medical-billing-audits': AUDITS,
  'peer-to-peer-review': P2P,
};

export function getService(slug: string): ServiceFull {
  return SERVICE_PAGES[slug] ?? DENIAL;
}
