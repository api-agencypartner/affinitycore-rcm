/**
 * State pages (Strapi later: collection "States"). Built for local SEO and PPC landing traffic:
 * every page names the state's own Medicare contractor, Medicaid program and prompt-pay law.
 * Regulatory facts are sourced (links below); anything about Affinity Core's own coverage is marked [Confirm].
 */
export type StateFact = { k: string; title: string; body: string; src?: { label: string; href: string } };
export type StatePage = {
  slug: string; id: string; name: string; abbr: string;
  seoTitle: string; seoDescription: string;
  heroTitle: [string, string]; heroAccent: string; heroSub: string;
  chips: [string, string][];          // short facts on the hero map card
  facts: StateFact[];                 // "rules we bill by"
  cities: string[];
  specialties: string[];              // featured specialty slugs
  faqs: string[][];
  closing: { eyebrow: string; lines: [string, string] };
  tz: string; tzName: string;          // IANA zone for the live clock, and its display name
  local: string;                       // one line on how we cover the state
};

const CONFIRM = '[Confirm with Affinity Core]';
/** States work is on hold until Ali reviews it: false hides the fold, menu, footer column, search entries and routes. */
export const SHOW_STATES = true;

export const STATES: StatePage[] = [
  {
    slug: 'texas', id: '48', name: 'Texas', abbr: 'TX',
    seoTitle: 'Medical Billing Services in Texas | Texas RCM Company',
    seoDescription: 'Medical billing and revenue cycle management for Texas practices: Novitas (JH) Medicare, Texas Medicaid and STAR plans, and prompt-pay deadlines enforced. Based in Plano, TX.',
    heroTitle: ['Medical billing for', 'Texas practices.'], heroAccent: 'Texas',
    heroSub: 'A Plano-based billing team that works Novitas Medicare, Texas Medicaid and STAR managed care, and holds commercial payers to the Texas prompt-pay clock. Same time zone, same payers, same rules.',
    chips: [['Medicare', 'Novitas · JH'], ['Medicaid', 'TMHP + STAR plans'], ['Prompt pay', '30 days electronic']],
    facts: [
      { k: 'Medicare', title: 'Novitas Solutions, Jurisdiction H', body: 'Every Texas Medicare Part B claim goes to Novitas. We work its edits, LCDs and portal daily, so claims match what JH actually pays for.', src: { label: 'CMS, MACs by state', href: 'https://www.cms.gov/files/document/macs-state-pdf' } },
      { k: 'Medicaid', title: 'Texas Medicaid and STAR managed care', body: 'Fee-for-service runs through TMHP; most patients are in STAR, STAR+PLUS or STAR Kids plans, each with its own eligibility checks and prior-auth rules. We verify the right plan before the visit.' },
      { k: 'Prompt pay', title: '30 days electronic, 45 days paper', body: 'State-regulated plans must pay clean claims on time or owe penalties that start at 50% of billed charges minus the contracted rate. We track the clock and claim the penalty when a payer is late.', src: { label: 'Texas prompt-pay rules (BCBSTX)', href: 'https://u.bcbstx.com/provider/pdf/hmo-sec-f-b-prompt-pay.pdf' } },
      { k: 'Prior auth', title: 'Gold-card exemptions', body: 'Texas lets physicians with a strong approval record skip prior auth for some services with state-regulated plans. We keep your approval history clean so you qualify, and tell you where you already do.' },
    ],
    cities: ['Dallas–Fort Worth', 'Houston', 'Austin', 'San Antonio', 'Plano', 'El Paso'],
    specialties: ['cardiology', 'internal-medicine', 'orthopedics', 'urgent-care', 'mental-health', 'gastroenterology', 'radiology', 'pediatrics'],
    faqs: [
      ['Are you based in Texas?', 'Yes. Our office is at 5830 Granite Pkwy in Plano, and our team works Central Time, so the person who answers knows Texas payers.'],
      ['Do you bill Texas Medicaid and STAR plans?', 'Yes. We check which STAR, STAR+PLUS or STAR Kids plan the patient is in before the visit, follow that plan’s authorization rules and bill fee-for-service claims through TMHP.'],
      ['What happens when a Texas payer pays late?', 'For state-regulated plans, clean claims are due in 30 days electronic or 45 days paper. We track every claim against that clock and request the prompt-pay penalty when it’s owed.'],
      ['Which Medicare contractor do you work with in Texas?', 'Novitas Solutions, Jurisdiction H. We follow its local coverage determinations and use its portal for claim status and appeals.'],
      ['Can you help us qualify for a Texas gold card?', `We keep your prior-auth approvals clean and documented, which is what the exemption is based on, and report where you stand by payer. ${CONFIRM}`],
    ],
    tz: 'America/Chicago', tzName: 'Central Time',
    local: 'Our office is in Plano, so your billing team works Texas hours, knows Texas payers and can be on site when it matters.',
    closing: { eyebrow: '/ Free Texas revenue review', lines: ['Texas payers, Texas rules.', 'See what you’re leaving unpaid.'] },
  },
  {
    slug: 'florida', id: '12', name: 'Florida', abbr: 'FL',
    seoTitle: 'Medical Billing Services in Florida | Florida RCM Company',
    seoDescription: 'Medical billing for Florida practices: First Coast (JN) Medicare, Statewide Medicaid Managed Care plans and Florida’s 20-day prompt-pay rule tracked on every claim.',
    heroTitle: ['Medical billing for', 'Florida practices.'], heroAccent: 'Florida',
    heroSub: 'Medicare Advantage-heavy payer mix, Statewide Medicaid Managed Care plans and a 20-day prompt-pay rule. We bill Florida practices with all three built into the workflow, US-based and on Eastern Time.',
    chips: [['Medicare', 'First Coast · JN'], ['Medicaid', 'SMMC plans'], ['Prompt pay', '20 days electronic']],
    facts: [
      { k: 'Medicare', title: 'First Coast Service Options, Jurisdiction N', body: 'Florida Medicare Part B claims go to First Coast. We follow its edits and local coverage determinations, and work denials through its portal.', src: { label: 'CMS, MACs by state', href: 'https://www.cms.gov/files/document/macs-state-pdf' } },
      { k: 'Medicaid', title: 'Statewide Medicaid Managed Care', body: 'Most Florida Medicaid patients are enrolled in an SMMC health plan, each with its own portal, authorization list and timely-filing limit. We check the plan before the visit.' },
      { k: 'Prompt pay', title: '20 days electronic, 40 days paper', body: 'State-regulated insurers must pay, deny or contest within 20 days for electronic claims and 40 for paper, and overdue claims accrue 12% simple interest a year. We hold payers to it.', src: { label: 'Fla. Stat. 627.6131', href: 'https://m.flsenate.gov/Statutes/627.6131' } },
      { k: 'Medicare Advantage', title: 'Prior auth on the busiest plans', body: 'Florida has one of the largest Medicare Advantage populations in the country, which means more prior auths and more medical-necessity denials. We prep the peer-to-peer and file the appeal.' },
    ],
    cities: ['Miami', 'Tampa', 'Orlando', 'Jacksonville', 'Fort Lauderdale', 'Naples'],
    specialties: ['cardiology', 'dermatology', 'ophthalmology', 'orthopedics', 'internal-medicine', 'oncology', 'podiatry', 'urology'],
    faqs: [
      ['Do you work with Florida practices remotely?', 'Yes. We’re a US-based team that works inside your EHR and payer portals, on Eastern Time for Florida clients, with a dedicated contact. ' + CONFIRM],
      ['Do you bill Florida Medicaid managed care plans?', 'Yes. We verify which SMMC plan each patient is in before the visit and follow that plan’s authorization and timely-filing rules.'],
      ['How fast do Florida payers have to pay?', 'State-regulated insurers have 20 days for electronic claims and 40 days for paper to pay, deny or contest, and must pay or deny within 90 or 120 days. Late claims accrue 12% simple interest a year.'],
      ['Which Medicare contractor handles Florida?', 'First Coast Service Options, Jurisdiction N. We follow its local coverage determinations and work denials through its portal.'],
      ['Can you help with Medicare Advantage denials?', 'Yes. Medical-necessity denials get a prepared peer-to-peer review and, if upheld, a written appeal with the clinical case attached.'],
    ],
    tz: 'America/New_York', tzName: 'Eastern Time',
    local: 'Your Florida account is covered on Eastern Time by a named US-based specialist who works inside your EHR and payer portals. ' + CONFIRM,
    closing: { eyebrow: '/ Free Florida revenue review', lines: ['Florida payers, Florida rules.', 'See what you’re leaving unpaid.'] },
  },
  {
    slug: 'california', id: '06', name: 'California', abbr: 'CA',
    seoTitle: 'Medical Billing Services in California | California RCM Company',
    seoDescription: 'Medical billing for California practices: Noridian (JE) Medicare, Medi-Cal managed care and the 2026 30-calendar-day claim payment rule tracked on every claim.',
    heroTitle: ['Medical billing for', 'California practices.'], heroAccent: 'California',
    heroSub: 'Noridian Medicare, Medi-Cal managed care and a claim-payment clock that tightened in 2026. We bill California practices with each payer’s rules built in, US-based and available on Pacific Time.',
    chips: [['Medicare', 'Noridian · JE'], ['Medicaid', 'Medi-Cal plans'], ['Prompt pay', '30 calendar days']],
    facts: [
      { k: 'Medicare', title: 'Noridian Healthcare Solutions, Jurisdiction E', body: 'California Medicare Part B claims go to Noridian. We follow its edits and local coverage determinations and use its portal for status and appeals.', src: { label: 'CMS, MACs by state', href: 'https://www.cms.gov/files/document/macs-state-pdf' } },
      { k: 'Medicaid', title: 'Medi-Cal managed care', body: 'Most Medi-Cal members are in a managed care plan that varies by county, each with its own authorization rules. We confirm the plan before the visit and bill fee-for-service claims to Medi-Cal directly.' },
      { k: 'Prompt pay', title: '30 calendar days, since January 2026', body: 'AB 3275 replaced the old 30- and 45-working-day timelines with one 30-calendar-day deadline for plans and insurers, Medi-Cal managed care included. We track every claim against it.', src: { label: 'Davis Wright Tremaine on AB 3275', href: 'https://www.dwt.com/insights/2025/09/california-ab-3275-claim-payment-deadlines-2026' } },
      { k: 'Delegated groups', title: 'IPAs and medical groups', body: 'Many California HMO patients are managed through an IPA or medical group, not the plan itself. We send each claim to the entity that actually pays it, so it isn’t bounced for the wrong payer.' },
    ],
    cities: ['Los Angeles', 'San Diego', 'San Francisco Bay Area', 'Sacramento', 'Orange County', 'Fresno'],
    specialties: ['internal-medicine', 'mental-health', 'dermatology', 'pediatrics', 'cardiology', 'ophthalmology', 'psychiatry', 'urgent-care'],
    faqs: [
      ['Do you work with California practices?', 'Yes. We’re a US-based team that works inside your EHR and payer portals, with a contact available on Pacific Time. ' + CONFIRM],
      ['Do you bill Medi-Cal managed care?', 'Yes. We confirm which Medi-Cal plan, and which IPA or medical group if delegated, is responsible before the visit, then bill and follow up with that entity.'],
      ['What changed in California claim payment in 2026?', 'AB 3275 set one 30-calendar-day deadline for health plans and insurers to pay, contest or deny claims, replacing the older 30- and 45-working-day timelines.'],
      ['Which Medicare contractor handles California?', 'Noridian Healthcare Solutions, Jurisdiction E.'],
      ['Can you bill IPAs and medical groups?', 'Yes. Delegated HMO claims go to the IPA or medical group responsible, and we track their payment timelines the same way we track the plans’.'],
    ],
    tz: 'America/Los_Angeles', tzName: 'Pacific Time',
    local: 'Your California account is covered on Pacific Time by a named US-based specialist who works inside your EHR, payer and IPA portals. ' + CONFIRM,
    closing: { eyebrow: '/ Free California revenue review', lines: ['California payers, California rules.', 'See what you’re leaving unpaid.'] },
  },
];

export const getState = (slug: string) => STATES.find((s) => s.slug === slug);
export const FEATURED_IDS = new Set(STATES.map((s) => s.id));
