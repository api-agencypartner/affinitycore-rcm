/**
 * Insights content: case studies + blog (Framer: CMS collections "Case studies", "Articles").
 *
 * CASE STUDIES ARE ILLUSTRATIVE. rcm.affinitycore.co has no published case studies yet, so every
 * figure below is a realistic placeholder and the pages say so. Replace with approved client results.
 * Blog facts are cited to their sources in each article.
 */
// Envato, licensed to project "Affinity Core Website"
import imaging from '../assets/case-imaging-desk.jpg';
import urgentDesk from '../assets/case-urgent-desk.jpg';
import coder from '../assets/case-coder-desk.jpg';
import orthoDesk from '../assets/case-ortho-desk.jpg';

export type MetricKey = 'denial' | 'ar' | 'clean' | 'net';
export const METRICS: { key: MetricKey; label: string; unit: string; better: 'down' | 'up'; short: string }[] = [
  { key: 'denial', label: 'Denial rate', unit: '%', better: 'down', short: 'Denials' },
  { key: 'ar', label: 'Days in A/R', unit: '', better: 'down', short: 'Days in A/R' },
  { key: 'clean', label: 'Clean claim rate', unit: '%', better: 'up', short: 'Clean claims' },
  { key: 'net', label: 'Net collection rate', unit: '%', better: 'up', short: 'Net collections' },
];

export type Case = {
  slug: string; tag: string; specialty: string; title: string; photo: string;
  /** documentary cover photo: alt text and optional focal point */
  alt: string; pos?: string;
  profile: [string, string][];
  services: string[];
  before: Record<MetricKey, number>; after: Record<MetricKey, number>;
  headline: MetricKey;
  challenge: string[];
  did: { title: string; body: string }[];
  timeline: { day: number; label: string; body: string }[];
};

export const CASES: Case[] = [
  {
    slug: 'cardiology-group-denials', tag: 'Cardiology · 6 providers', specialty: 'Cardiology', title: 'Denials cut by more than half in 90 days.', photo: imaging, alt: 'Physician reviewing imaging results at a workstation', pos: '50% 30%',
    profile: [['Specialty', 'Non-invasive and interventional cardiology'], ['Providers', '6 physicians, 2 NPs'], ['Location', 'North Texas'], ['Systems', 'Existing EHR and clearinghouse, unchanged'], ['Scope', 'Denials, A/R, coding review']],
    services: ['denial-management', 'ar-recovery', 'medical-coding'],
    before: { denial: 14, ar: 52, clean: 89, net: 92 }, after: { denial: 6, ar: 31, clean: 98, net: 97 }, headline: 'denial',
    challenge: ['Nuclear and echo studies were going out without prior auth on file, and those denials were piling up past appeal limits.', 'Hospital reads were billed globally, so payers rejected them as duplicates of the hospital’s own claim.', 'Nobody owned follow-up, so $310k sat in A/R over 90 days.'],
    did: [
      { title: 'Worked the backlog by value and deadline', body: 'Every open denial was sorted by dollars at stake and filing limit; the expensive ones near their limit went first.' },
      { title: 'Fixed the hospital-read problem at the source', body: 'Studies read on hospital equipment now go out with modifier 26 only, and the scrubber blocks global billing for those locations.' },
      { title: 'Moved auth checks before scheduling', body: 'Imaging can no longer be scheduled until the authorization number is on file and matches the CPT code.' },
    ],
    timeline: [
      { day: 0, label: 'Kickoff', body: 'Baseline pulled: denial rate, A/R aging, clean claim rate.' },
      { day: 7, label: 'Access + mapping', body: 'EHR and clearinghouse access; denial queue imported.' },
      { day: 21, label: 'Backlog triage', body: 'Highest-value denials appealed before their limits.' },
      { day: 45, label: 'Root causes fixed', body: 'Modifier 26 rule and pre-scheduling auth check live.' },
      { day: 90, label: 'Day 90 readout', body: 'Denials down to 6%, days in A/R down to 31.' },
    ],
  },
  {
    slug: 'urgent-care-ar', tag: 'Urgent care · 4 locations', specialty: 'Urgent Care', title: 'Aged A/R cleared while volume kept growing.', photo: urgentDesk, alt: 'Urgent care front desk staff member on a call with a patient', pos: '62% 30%',
    profile: [['Specialty', 'Urgent care'], ['Volume', '~4,200 visits a month'], ['Location', 'Dallas–Fort Worth'], ['Systems', 'Existing PM system, unchanged'], ['Scope', 'A/R recovery, billing, payment posting']],
    services: ['ar-recovery', 'medical-billing', 'payment-posting'],
    before: { denial: 11, ar: 48, clean: 82, net: 91 }, after: { denial: 7, ar: 29, clean: 96, net: 97 }, headline: 'ar',
    challenge: ['31% of A/R was older than 90 days after a staffing gap.', 'Some payers expected a global urgent-care code, others itemized claims; the front desk was guessing.', 'Payments were posted in batches, so underpayments went unnoticed.'],
    did: [
      { title: 'Payer-by-payer billing rules', body: 'Each payer’s urgent-care billing method was documented and built into the scrubber, so the right format goes out the first time.' },
      { title: 'A/R worked oldest and largest first', body: 'A dedicated specialist worked the 90+ bucket daily until each claim paid or closed.' },
      { title: 'Daily line-level posting', body: 'Remittances posted line by line against expected amounts, with underpayments flagged the same day.' },
    ],
    timeline: [
      { day: 0, label: 'Kickoff', body: 'A/R aging and payer mix reviewed.' },
      { day: 10, label: 'Payer rules mapped', body: 'Global vs itemized rules set per payer.' },
      { day: 30, label: '90+ bucket halved', body: 'Oldest, largest claims resolved first.' },
      { day: 60, label: 'Posting daily', body: 'Underpayment flags live for top 5 payers.' },
      { day: 90, label: 'Day 90 readout', body: 'A/R over 90 days down from 31% to 12%.' },
    ],
  },
  {
    slug: 'behavioral-health-coding', tag: 'Behavioral health · 14 clinicians', specialty: 'Mental Health', title: 'Time-based codes finally matched the notes.', photo: coder, alt: 'Clinician documenting a session at her desk', pos: '55% 30%',
    profile: [['Specialty', 'Outpatient therapy and psychiatry'], ['Providers', '11 therapists, 3 psychiatric NPs'], ['Location', 'Texas, in person + telehealth'], ['Systems', 'Existing EHR, unchanged'], ['Scope', 'Coding, billing, credentialing']],
    services: ['medical-coding', 'medical-billing', 'credentialing'],
    before: { denial: 12, ar: 41, clean: 86, net: 93 }, after: { denial: 5, ar: 27, clean: 97, net: 98 }, headline: 'clean',
    challenge: ['Session lengths in the notes didn’t match the psychotherapy codes billed.', 'Telehealth visits went out with the wrong place-of-service code for several payers.', 'Two new clinicians were seeing patients before their enrollments were complete.'],
    did: [
      { title: 'Minutes-to-code checks', body: 'Every session is coded from documented minutes (90832 / 90834 / 90837), and mismatches are sent back before billing.' },
      { title: 'Telehealth rules per payer', body: 'POS 02 vs 10 and modifiers set for each payer’s current policy.' },
      { title: 'Enrollment before scheduling', body: 'New clinicians are only scheduled with payers they’re enrolled with.' },
    ],
    timeline: [
      { day: 0, label: 'Kickoff', body: 'Coding sample audited against notes.' },
      { day: 14, label: 'Telehealth fixed', body: 'POS and modifiers corrected per payer.' },
      { day: 30, label: 'Enrollments done', body: 'Both new clinicians enrolled with top payers.' },
      { day: 60, label: 'Minutes checks live', body: 'Mismatches caught before submission.' },
      { day: 90, label: 'Day 90 readout', body: 'Clean claim rate up from 86% to 97%.' },
    ],
  },
  {
    slug: 'orthopedic-asc-auth', tag: 'Orthopedics + ASC', specialty: 'Orthopedics', title: 'No more surgeries done without an approval.', photo: orthoDesk, alt: 'Orthopedic surgeon in scrubs checking an authorization on his laptop', pos: '60% 30%',
    profile: [['Specialty', 'Orthopedic practice with an ASC'], ['Providers', '5 surgeons, 3 PAs'], ['Location', 'Central Texas'], ['Systems', 'Existing EHR and ASC system'], ['Scope', 'Full revenue cycle management']],
    services: ['revenue-cycle-management', 'medical-billing', 'denial-management'],
    before: { denial: 13, ar: 55, clean: 87, net: 90 }, after: { denial: 6, ar: 34, clean: 97, net: 96 }, headline: 'net',
    challenge: ['Cases were reaching the OR before authorization was approved.', 'Post-op visits inside the 90-day global period were being billed and denied.', 'Same-day visit + injection claims went out without modifier 25.'],
    did: [
      { title: 'Auth gate on the surgery schedule', body: 'No case is booked without an approval that matches the planned CPT codes.' },
      { title: 'Global period tracking', body: 'Visits inside a global period are flagged as no-charge follow-ups automatically.' },
      { title: 'Modifier 25 with documentation', body: 'Same-day visits get modifier 25 only when the note supports a separate service.' },
    ],
    timeline: [
      { day: 0, label: 'Kickoff', body: 'Full revenue cycle baseline.' },
      { day: 14, label: 'Auth gate live', body: 'Surgery schedule tied to approvals.' },
      { day: 30, label: 'Global tracking', body: 'Post-op visits no longer billed in error.' },
      { day: 60, label: 'Denials reworked', body: 'Backlog appealed or corrected.' },
      { day: 90, label: 'Day 90 readout', body: 'Net collection rate up from 90% to 96%.' },
    ],
  },
];
export const getCase = (slug: string) => CASES.find((c) => c.slug === slug);

/* ======================== Blog ======================== */
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h2'; id: string; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'callout'; title: string; text: string }
  | { t: 'stat'; value: string; text: string; source: string }
  | { t: 'timeline'; items: [string, string][] }
  | { t: 'table'; head: string[]; rows: string[][] };

import type { Cover } from '../components/BlogCover';
export type Article = {
  /** scene thumbnail (components/BlogCover) */
  cover?: Cover;
  /** text-on-image cover: a short hook (accent words in the 2nd item) — also the OG / featured image text */
  hook?: [string, string];
  slug: string; topic: string; title: string; dek: string; date: string; read: string; author: string;
  body?: Block[]; sources?: [string, string][];
};

export const TOPICS = ['All', 'Prior auth', 'Coding', 'Denials', 'Credentialing', 'A/R'] as const;

export const ARTICLES: Article[] = [
  {
    slug: 'cms-prior-authorization-rule-2026', hook: ['Prior auth now has a', '72‑hour clock.'], cover: { k: 'clock', n: 72, of: 72, unit: 'hours', label: 'Urgent prior auth decision' }, topic: 'Prior auth', date: 'Oct 2026', read: '6 min read', author: 'Affinity Core billing team',
    title: 'The 2026 prior authorization rule: what changed, and what your practice should do now',
    dek: 'Medicare Advantage, Medicaid and CHIP plans now have deadlines for prior auth decisions. Here’s what that means at the front desk.',
    body: [
      { t: 'p', text: 'Prior authorization is one of the biggest time sinks in a practice. In the AMA’s 2024 survey of 1,000 physicians, practices handled an average of 39 prior authorization requests per physician per week, costing about 13 hours of physician and staff time.' },
      { t: 'stat', value: '39', text: 'prior authorizations per physician, per week, about 13 hours of physician and staff time.', source: 'AMA 2024 Prior Authorization Physician Survey' },
      { t: 'p', text: 'CMS’s Interoperability and Prior Authorization Final Rule (CMS-0057-F) doesn’t remove prior auth, but it puts the first federal clocks on how long certain payers can take, and requires them to say why they said no.' },
      { t: 'h2', id: 'who', text: 'Which payers it covers' },
      { t: 'list', items: ['Medicare Advantage organizations', 'Medicaid and CHIP fee-for-service programs', 'Medicaid managed care plans and CHIP managed care entities', 'Qualified Health Plan issuers on the Federally-Facilitated Exchanges (for some requirements; see below)'] },
      { t: 'callout', title: 'Not covered', text: 'Traditional commercial and employer plans aren’t “impacted payers” under this rule. Their timelines still come from your contracts and state law.' },
      { t: 'h2', id: 'changed', text: 'What changed on January 1, 2026' },
      { t: 'table', head: ['Requirement', 'What it means'], rows: [
        ['72-hour urgent decisions', 'Expedited (urgent) requests must get a decision within 72 hours.'],
        ['7-day standard decisions', 'Standard requests must get a decision within 7 calendar days.'],
        ['A specific denial reason', 'Every denied prior auth must come with a specific reason, however it was submitted.'],
      ] },
      { t: 'p', text: 'The decision deadlines don’t apply to QHP issuers on the Federally-Facilitated Exchanges. Drug prior authorizations are excluded from the rule.' },
      { t: 'h2', id: 'dates', text: 'The dates to know' },
      { t: 'timeline', items: [
        ['Jan 1, 2026', '72-hour and 7-day decision timeframes; specific denial reasons required.'],
        ['Mar 31, 2026', 'First public reports of each payer’s prior auth metrics due on their websites.'],
        ['Jan 1, 2027', 'Prior Authorization API, Provider Access API and Payer-to-Payer API must be live.'],
        ['CY 2027', 'New “Electronic Prior Authorization” measure begins for MIPS clinicians and hospitals.'],
      ] },
      { t: 'h2', id: 'do', text: 'What your practice should do now' },
      { t: 'list', items: [
        'Log every request with its submission time and whether it’s urgent or standard, so you know when a payer is late.',
        'Escalate the moment a covered plan misses 72 hours or 7 days: peer-to-peer, then a complaint if needed.',
        'Use the specific denial reason. It tells you whether to fix and resubmit or appeal with clinical notes.',
        'Check each payer’s published prior auth metrics. High denial rates for a service tell you where to document more up front.',
        'Ask your EHR vendor about electronic prior authorization before the 2027 APIs arrive.',
      ] },
      { t: 'callout', title: 'How we handle it', text: 'We check prior auth requirements before a visit is scheduled, submit through the payer or its benefit manager, and track every request against these deadlines so nothing waits silently.' },
    ],
    sources: [
      ['CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F) fact sheet', 'https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-and-prior-authorization-final-rule-cms-0057-f'],
      ['AMA: Fixing prior auth, nearly 40 prior authorizations a week is way too many', 'https://www.ama-assn.org/practice-management/prior-authorization/fixing-prior-auth-nearly-40-prior-authorizations-week-way'],
    ],
  },
  {
    slug: 'modifier-25-same-day-visits', hook: ['Modifier 25:', 'get both paid.'], cover: { k: 'claim', code: '99213', mod: '25', box: 'Box 24D', label: 'Visit + injection, same day' }, topic: 'Coding', date: 'Sep 2026', read: '5 min read', author: 'Affinity Core coding team',
    title: 'Modifier 25: when a same-day visit actually gets paid',
    dek: 'A visit and a minor procedure on the same day can both be paid, but only when the note shows two separate pieces of work.',
    body: [
      { t: 'p', text: 'Modifier 25 is appended to an evaluation and management (E/M) code to say the visit was a significant, separately identifiable service, performed by the same provider on the same day as a procedure or other service.' },
      { t: 'p', text: 'Without it, payers treat the visit as part of the procedure, because the decision to do a minor procedure and the routine check before it are already included in the procedure’s payment.' },
      { t: 'h2', id: 'when', text: 'When modifier 25 is appropriate' },
      { t: 'list', items: [
        'The patient came in for one problem and you also treated a different one (e.g., a knee injection plus a new, unrelated complaint worked up).',
        'The visit went well beyond the usual pre-procedure check, and the note shows it: history, exam and medical decision-making for that separate problem.',
        'A sick concern handled during a preventive visit (the problem-oriented E/M gets modifier 25).',
      ] },
      { t: 'h2', id: 'not', text: 'When it isn’t' },
      { t: 'list', items: [
        'The visit only confirmed the procedure was needed and got consent.',
        'The visit is within a global period for a procedure already billed (that’s a different set of modifiers, if any).',
        'The note doesn’t separate the two services. If an auditor can’t see two pieces of work, neither can a payer.',
      ] },
      { t: 'table', head: ['Scenario', 'Bill'], rows: [
        ['Knee injection for known osteoarthritis, brief check only', '20610 only'],
        ['Knee injection + new shoulder complaint examined and treated', '99213-25 + 20610'],
        ['Annual wellness visit + new rash evaluated and treated', 'Preventive code + problem E/M with -25'],
      ] },
      { t: 'callout', title: 'Documentation tip', text: 'Write the separate problem as its own section of the note, with its own assessment and plan. That is what makes modifier 25 defensible.' },
      { t: 'h2', id: 'how', text: 'How we handle it' },
      { t: 'p', text: 'Our coders read the note before applying modifier 25, not after a denial. When the note doesn’t support a separate service, we bill the procedure alone and tell the provider what was missing, so the next one is documented right.' },
    ],
    sources: [['AMA CPT® code set: modifier 25 descriptor (AMA, CPT Professional)', 'https://www.ama-assn.org/practice-management/cpt']],
  },
  { slug: 'top-denial-codes', hook: ['The denial codes', 'we see most.'], cover: { k: 'eob', code: '93000', desc: 'ECG, complete', amt: '$0.00', reason: 'CO-97', stamp: 'Fixable' }, topic: 'Denials', date: 'Coming soon', read: '7 min read', author: 'Affinity Core', title: 'The denial codes we see most, and how each one gets fixed', dek: 'CO-16, CO-97, CO-197 and the rest: what the payer is really saying, and the fastest path back to paid.' },
  { slug: 'credentialing-timeline', hook: ['Credential before', 'day one.'], cover: { k: 'sticky', note: 'Dr. Patel starts Monday.', sub: 'Enrolled with Aetna yet?' }, topic: 'Credentialing', date: 'Coming soon', read: '5 min read', author: 'Affinity Core', title: 'Hiring a new provider? Start credentialing before their first day', dek: 'Why enrollment takes months, and how to keep a new hire from seeing patients you can’t bill for.' },
  { slug: 'ar-aging-buckets', hook: ['Read your A/R report', 'in 5 minutes.'], cover: { k: 'stat', from: '52', to: '31', label: 'Days in A/R', bars: [52, 49, 44, 40, 36, 31] }, topic: 'A/R', date: 'Coming soon', read: '4 min read', author: 'Affinity Core', title: 'Reading your A/R aging report in five minutes', dek: 'Which bucket matters most, what “good” looks like, and when to worry.' },
  { slug: 'timely-filing-limits', hook: ['Day 89 of 90?', 'Here’s what to do.'], cover: { k: 'clock', n: 87, of: 90, unit: 'days', label: 'Timely filing window' }, topic: 'A/R', date: 'Coming soon', read: '6 min read', author: 'Affinity Core', title: 'Timely filing limits by payer, and what to do on day 89', dek: 'Medicare, Medicaid and the big commercial plans side by side, plus the proof that saves a late claim.' },
  { slug: 'peer-to-peer-script', hook: ['What to say on a', 'peer-to-peer call.'], cover: { k: 'hold', payer: 'Payer UM line', time: '00:47:12', label: 'Peer-to-peer, still on hold' }, topic: 'Prior auth', date: 'Coming soon', read: '5 min read', author: 'Affinity Core', title: 'What to say on a peer-to-peer call (and what to have open)', dek: 'A one-page script for physicians when a prior auth is denied, built from the calls that turned it around.' },
  { slug: 'co-197-denial', hook: ['CO-197:', 'no auth, no pay.'], cover: { k: 'eob', code: '78452', desc: 'SPECT, multiple', amt: '$0.00', reason: 'CO-197', stamp: 'Appeal' }, topic: 'Denials', date: 'Coming soon', read: '5 min read', author: 'Affinity Core', title: 'CO-197: the study was done, the auth wasn’t. Now what?', dek: 'When a retro-authorization works, when an appeal does, and how to stop it happening twice.' },
  { slug: 'clean-claim-rate', hook: ['From 82% to', '96% clean claims.'], cover: { k: 'stat', from: '82%', to: '96%', label: 'Clean claim rate', bars: [82, 85, 88, 91, 94, 96] }, topic: 'A/R', date: 'Coming soon', read: '4 min read', author: 'Affinity Core', title: 'Your clean claim rate is the number to watch first', dek: 'How to measure it honestly, what good looks like, and the three fixes that move it fastest.' },
  { slug: 'telehealth-pos-codes', hook: ['Telehealth codes', 'payers accept.'], cover: { k: 'claim', code: '90837', mod: '95', box: 'POS 10', label: 'Patient at home, on video' }, topic: 'Coding', date: 'Coming soon', read: '4 min read', author: 'Affinity Core', title: 'Telehealth place-of-service codes: 02 vs 10', dek: 'Where the patient is decides the code, and some payers still want something different.' },
];
export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);
