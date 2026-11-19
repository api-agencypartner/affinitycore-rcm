/**
 * Content tests: copies of live pages with rewritten copy, served at unlisted URLs.
 * They are NOT linked from the nav, footer, search, sitemap or any page, and are noindex.
 * The live pages and their data are untouched; each test builds on a copy of the live entry.
 */
import { getService, type ServiceFull } from './services';
import { searchFaqs } from './seo';
import type { ServicePageCopy } from '../views/ServicePage';

/* ------------------------------------------------------------------
 * Medical billing, copy test (source: "Medical-Billing-Page-Copy.docx", Nov 2026).
 * Item numbers in comments match the document.
 * ------------------------------------------------------------------ */
const live = getService('medical-billing');

// Steps: only the body text changes (items 40, 42, 44, 48); titles and step 4 stay. Also feeds Guide ch.2.
const STEP_BODY: Record<number, string> = {
  0: 'Insurance eligibility is re-verified before submission; a plan that changed last month is the cheapest denial to stop.',
  1: 'Claim scrubbing runs each claim through payer edits: NCCI pairs, coverage rules, frequency limits, required fields.',
  2: 'Scrubber edits are fixed by a biller, not just flagged. Coding questions reach a coder same day.',
  4: 'Claim status follow-up starts before claims age, and rejections are fixed and re-sent within a day.',
};

const s: ServiceFull = {
  ...live,
  seoTitle: 'Medical Billing Services for US Practices', // full <title> is set in copy.title (item 1)
  seoDescription: 'Outsourced medical billing services for US practices: claims scrubbed against payer rules and filed same day. Get a free review of one month of claims.', // 2
  heroTitle: ['Medical billing', 'that gets paid.'], // 4
  heroAccent: 'paid.',
  heroSub: 'Outsource medical billing to US-based billers and coders who scrub every claim against payer rules, file it same day and track it to payment, so fewer are denied and cash comes in.', // 5
  chip: ['Claim scrubbing, up front.', live.chip[1]], // 14
  how: { ...live.how, lines: ['How our medical billing', 'process runs'] }, // 38
  steps: live.steps.map((st, i) => (STEP_BODY[i] ? { ...st, body: STEP_BODY[i] } : st)),
  ticket: {
    ...live.ticket,
    scope: [
      'Insurance eligibility check before submission', // 28 (also Guide ch.3)
      live.ticket.scope[1], live.ticket.scope[2], live.ticket.scope[3], live.ticket.scope[4],
      'Monthly clean claim and first-pass report', // 33 (also Guide ch.3)
    ],
    reporting: 'Monthly · clean claim rate, first-pass yield, rejections', // 35
    turnaround: 'Same day the claim is ready', // 36 (confirm before publishing)
  },
};

// FAQ: same 8 questions in the same order as the live page; rewrites by position (items 105–119).
const liveFaqs = searchFaqs({ name: live.name, kind: 'service', faqs: live.faqs });
const FAQ_SWAP: Record<number, [string | null, string | null]> = {
  0: [null, 'Most practices pay a percentage of monthly collections, so we’re paid when you are. The rate depends on your volume, payer mix and the services you hand over. Your quote follows the free review.'], // A1
  2: ['Which EHRs and PM systems do you use?', 'We work inside your existing EHR, practice management system and clearinghouse, so nothing changes for your front desk or team.'], // Q3, A3
  3: [null, 'Our goal is same-day claim submission once charges and coding are done. We report lag so you can hold us to it.'], // A4
  5: [null, 'Patient billing, statements and balance follow-up can be added. Tell us how you do it today and we’ll match it.'], // A6
  7: [null, 'Yes. Many practices keep their front desk or a biller and hand us what slips: coding review, denial management and aged A/R. We work from the same queues and report to both each month.'], // A8
};
const faqs = liveFaqs.map(([q, a], i) => [FAQ_SWAP[i]?.[0] ?? q, FAQ_SWAP[i]?.[1] ?? a]);

const copy: ServicePageCopy = {
  title: 'Medical Billing Services for US Practices | Affinity Core', // 1
  intro: {
    lead: 'Medical billing services for US practices, run by one accountable team', // 17
    body: 'Hand us claim submission and we own it end to end: eligibility re-checks, payer-specific scrubbing, same-day filing and follow-up, all reported monthly in plain terms.', // 18
    more: 'Medical billing is the point in the revenue cycle where a claim is built and sent, so every miss here comes back later as a denial or a late payment. Our medical billing services cover insurance eligibility verification, payer-specific claim scrubbing, same-day electronic submission and clearinghouse rejection fixes. A dedicated billing specialist owns your account and reports your clean claim rate, first-pass yield and rejections each month. Outsource one stage or the whole cycle; it starts with a free review of one month of your claims.', // 19
  },
  staticStat: true, // 21: always shows ~15%, never the count-up's starting ~0%
  workTitle: 'Medical billing, from A to Z.', // 25
  platforms: {
    lines: ['Medical billing inside', 'your existing EHR.'], // 50
    copy: 'No new software for your staff to learn. Our billers work directly in your EHR, practice management system, clearinghouse and payer portals, and we map access with you before anything changes in your practice.', // 51
  },
  specialties: {
    eyebrow: '/ Billing for your specialty', // 53
    heading: 'Medical billing services, from billers who know your specialty.', // 54
  },
  midBody: 'We’ll audit a month of your claims and show you lost dollars, line by line. Free, no contract.', // 57
  guide: {
    answer: 'Medical billing is the process of turning a patient’s visit into a paid insurance claim: verifying coverage, building the claim from coded charges, checking it against payer rules, submitting it and following up until it is paid. Done well, it is the step that decides whether a claim is paid in full the first time, paid late after rework, or not paid at all.', // 72
    whatP1: 'Practices run it in-house or outsource medical billing to a specialist team. Either way, the test is the same: how many claims pay on first submission and how fast the rest follow.', // 73
    whatP2: 'Fewer denials, faster payment, every month.', // 74
    incIntro: 'Whoever runs it, in-house or a billing company, these are the parts to expect. If one is missing, that is where the money leaks.', // 77
    whyTail: 'That revenue gap is rarely one failure. It is small, repeatable misses: a field left blank, a payer rule that changed, a follow-up never made.', // 79
    whyP2: 'Because the misses repeat, fixing the cause is worth more than fixing the claim. That’s why our monthly report shows the pattern behind your clean claim rate and first-pass yield, not just the totals.', // 80
    whenIntro: 'Outsourcing medical billing makes sense when claims fall behind, when one person holds all the know-how, or when the numbers drift and no one has time to find out why. Common signs:', // 81
    whenClose: 'The benefits of outsourcing medical billing show in the numbers. Hand over one part, keep the rest in-house; start with our free review.', // 86
  },
  included: ['Denial management review', 'A/R aging breakdown', 'Coding and charge capture gaps', 'Payer underpayment check'], // 94
  faqs,
  source: 'content-test:medical-billing',
  jsonLd: false,
};

export const MEDICAL_BILLING_TEST = { s, copy };
