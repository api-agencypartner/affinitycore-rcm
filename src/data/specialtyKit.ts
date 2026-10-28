/**
 * Shared building blocks for the specialty pages: verified sources, calculator presets and the
 * prior-auth clock copy. Every statistic links to its source; calculator notes say what is assumed.
 */
import type { Calc } from './services';
import type { AuthReq } from './specialties';

export const CONFIRM = '[Confirm with Affinity Core]';
export const ACCESS_FAQ: [string, string] = ['Will you need access to our systems?', 'Yes: your practice management system, EHR (read-only where possible) and clearinghouse. We sign a business associate agreement before any access is set up.'];

/* ---------------- Verified sources ---------------- */
type Stat = { value: number; decimals?: number; prefix?: string; suffix?: string; label: string; source: string; href: string };
const AMA = { source: 'AMA 2024 Prior Authorization Physician Survey', href: 'https://www.ama-assn.org/practice-management/prior-authorization/fixing-prior-auth-nearly-40-prior-authorizations-week-way' };
const KFF = { source: 'KFF analysis of 2023 Medicare Advantage data', href: 'https://www.aha.org/news/headline/2025-01-29-kff-ma-insurers-made-nearly-50-million-prior-authorization-determinations-2023' };
const PREMIER = { source: 'Premier, 2024 claims survey', href: 'https://premierinc.com/newsroom/blog/trend-alert-private-payers-retain-profits-by-refusing-or-delaying-legitimate-medical-claims' };
const CERT = { source: 'CMS, FY2024 Improper Payments Fact Sheet', href: 'https://www.cms.gov/newsroom/fact-sheets/fiscal-year-2024-improper-payments-fact-sheet' };

export const STAT = {
  amaWeekly: { value: 39, label: 'prior authorizations a physician’s practice handles every week, about 13 hours of physician and staff time.', ...AMA } as Stat,
  amaStaff: { value: 40, suffix: '%', label: 'of physicians have staff who work only on prior authorizations.', ...AMA } as Stat,
  amaHospital: { value: 23, suffix: '%', label: 'of physicians report a patient was hospitalized because of a prior authorization delay.', ...AMA } as Stat,
  kffOverturned: { value: 81.7, decimals: 1, suffix: '%', label: 'of Medicare Advantage prior auth denials that were appealed were overturned, fully or in part.', ...KFF } as Stat,
  kffAppealed: { value: 11.7, decimals: 1, suffix: '%', label: 'of Medicare Advantage prior auth denials were ever appealed, even though most appeals win.', ...KFF } as Stat,
  kffDenied: { value: 3.2, decimals: 1, suffix: 'M', label: 'prior authorization requests were denied, fully or in part, by Medicare Advantage plans in a single year.', ...KFF } as Stat,
  premierFirst: { value: 15, prefix: '~', suffix: '%', label: 'of claims sent to private payers are denied on first submission.', ...PREMIER } as Stat,
  premierCost: { value: 43.84, decimals: 2, prefix: '$', label: 'is what providers spend, on average, fighting a single denied claim.', ...PREMIER } as Stat,
  premierPaid: { value: 54.3, decimals: 1, suffix: '%', label: 'of initially denied claims are eventually paid, but only after someone works the denial.', ...PREMIER } as Stat,
  premierSpend: { value: 19.7, decimals: 1, prefix: '$', suffix: 'B', label: 'a year is what providers spend fighting claim denials, much of it on claims that are eventually paid.', ...PREMIER } as Stat,
  cert: { value: 7.66, decimals: 2, suffix: '%', label: 'of Medicare fee-for-service payments in 2024 were improper, most often because the documentation didn’t support what was billed.', ...CERT } as Stat,
  experian: { value: 41, suffix: '%', label: 'of providers now see claim denial rates of 10% or higher, the third straight year of increases.', source: 'Experian Health, State of Claims 2025', href: 'https://www.managedhealthcareexecutive.com/view/claim-denial-rates-increase-for-third-consecutive-year-survey-shows' } as Stat,
  hfma: { value: 1, prefix: 'Up to ', suffix: '%', label: 'of net charges can be lost to charge leakage before a claim is ever sent.', source: 'HFMA, Charge Capture', href: 'https://www.hfma.org/revenue-cycle/charge-capture/55358/' } as Stat,
  mgmaCred: { value: 54, suffix: '%', label: 'of practices told MGMA their credentialing-related denials had increased that year.', source: 'MGMA Stat poll, August 2021', href: 'https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021' } as Stat,
  oig: { value: 13, suffix: '%', label: 'of prior auth requests Medicare Advantage plans denied in OIG’s sample actually met Medicare coverage rules. Imaging was among the most common.', source: 'HHS OIG, OEI-09-18-00260 (2022)', href: 'https://oig.hhs.gov/oei/reports/OEI-09-18-00260.asp' } as Stat,
};

/* ---------------- Calculator presets ---------------- */
const WEEKS = 50;

/** Staff time spent on prior auth (AMA averages). */
export const authCalc = (kicker: string, who: string, docs: number, auths: number, mins = 20): Calc => ({
  kicker,
  fields: [
    { id: 'docs', label: who, min: 1, max: 30, step: 1, value: docs, fmt: 'n' },
    { id: 'auths', label: 'Prior auths per provider, per week', min: 2, max: 80, step: 1, value: auths, fmt: 'n' },
    { id: 'mins', label: 'Minutes of staff time per auth', min: 5, max: 60, step: 1, value: mins, fmt: 'n' },
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
  note: 'Estimate. The AMA’s 2024 survey puts the average at 39 auths per physician a week, about 13 hours. Your free assessment uses your own volume.',
});

/** Denials: written-off revenue plus the cost of reworking them (Premier: $43.84 per denial). */
export const denialCalc = (kicker: string, claims: number, avg: number, rate: number): Calc => ({
  kicker,
  fields: [
    { id: 'claims', label: 'Claims sent per month', min: 100, max: 10000, step: 50, value: claims, fmt: 'n' },
    { id: 'avg', label: 'Average paid per claim', min: 40, max: 3000, step: 10, value: avg, fmt: '$' },
    { id: 'rate', label: 'Denial rate', min: 2, max: 30, step: 0.5, value: rate, fmt: '%' },
    { id: 'lost', label: 'Share of denials never recovered', min: 5, max: 80, step: 1, value: 35, fmt: '%' },
  ],
  compute: ({ claims, avg, rate, lost }) => {
    const den = claims * (rate / 100);
    return [
      { label: 'Denials each month', value: den, fmt: 'n' },
      { label: 'Cost to rework them, yearly', value: den * 12 * 43.84, fmt: '$' },
      { label: 'Revenue written off, yearly', value: den * 12 * avg * (lost / 100), fmt: '$', accent: true },
    ];
  },
  note: 'Estimate. Rework is priced at $43.84 per denial (Premier, 2024). The share never recovered is your own figure; your free assessment measures it from your remits.',
});

/** Visits documented at a higher level than billed (time-based or E/M undercoding). */
export const undercodeCalc = (kicker: string, unit: string, perWeek: number, pct: number, diff: number): Calc => ({
  kicker,
  fields: [
    { id: 'n', label: unit, min: 10, max: 1500, step: 5, value: perWeek, fmt: 'n' },
    { id: 'pct', label: 'Share billed one level lower than documented', min: 1, max: 40, step: 1, value: pct, fmt: '%' },
    { id: 'diff', label: 'Payment difference per visit', min: 5, max: 120, step: 1, value: diff, fmt: '$' },
  ],
  compute: ({ n, pct, diff }) => {
    const wk = n * (pct / 100) * diff;
    return [
      { label: 'Visits under-billed each week', value: n * (pct / 100), fmt: 'n' },
      { label: 'Lost each week', value: wk, fmt: '$' },
      { label: 'Lost each year', value: wk * WEEKS, fmt: '$', accent: true },
    ];
  },
  note: 'Estimate over a 50-week year. The payment gap between levels depends on your payer mix; we price it from your own fee schedules in the free assessment.',
});

/** Charges that never make it onto a claim. */
export const leakCalc = (kicker: string, monthly: number, pct = 1): Calc => ({
  kicker,
  fields: [
    { id: 'm', label: 'Gross charges per month', min: 20000, max: 3000000, step: 10000, value: monthly, fmt: '$' },
    { id: 'pct', label: 'Charges missed or under-coded', min: 0.5, max: 8, step: 0.5, value: pct, fmt: '%' },
  ],
  compute: ({ m, pct }) => [
    { label: 'Missed each month', value: m * (pct / 100), fmt: '$' },
    { label: 'Missed each year', value: m * 12 * (pct / 100), fmt: '$', accent: true },
  ],
  note: 'Estimate. HFMA puts charge leakage at up to 1% of net charges; specialty-specific gaps (units, add-ons, visit counts) are often higher. We measure yours in the free assessment.',
});

/* ---------------- Prior auth clock ---------------- */
export const authBlock = (lines: [string, string], reqs: AuthReq[], eyebrow = '/ Prior auth, on the clock') => ({
  eyebrow,
  lines,
  body: 'Since January 1, 2026, Medicare Advantage, Medicaid and CHIP plans have to decide urgent prior auth requests within 72 hours and standard ones within 7 calendar days. We log every request against that clock and escalate the moment a plan runs over.',
  source: 'CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F)',
  href: 'https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-and-prior-authorization-final-rule-cms-0057-f',
  reqs,
});
export const req = (study: string, code: string, payer: string, kind: 'Urgent' | 'Standard', decideAt: number | null, outcome = decideAt === null ? 'Escalated' : 'Approved'): AuthReq =>
  ({ study, code, payer, kind, limitH: kind === 'Urgent' ? 72 : 168, decideAt, outcome });
