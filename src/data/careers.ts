/**
 * Careers content (Strapi: collection "Job openings"). Roles are representative RCM positions for the
 * prototype; titles, locations and requirements to be confirmed by Affinity Core before launch.
 */
export type Team = 'Billing' | 'Coding' | 'A/R & Denials' | 'Credentialing' | 'Client Success';
export const TEAMS: ('All' | Team)[] = ['All', 'Billing', 'Coding', 'A/R & Denials', 'Credentialing', 'Client Success'];

export type Role = {
  slug: string; title: string; team: Team; location: string; type: string; level: string;
  summary: string; do: string[]; bring: string[]; plus: string[];
};

export const ROLES: Role[] = [
  { slug: 'medical-billing-specialist', title: 'Medical Billing Specialist', team: 'Billing', location: 'Plano, TX · Hybrid', type: 'Full-time', level: '2+ years',
    summary: 'Own claim submission for a set of practices, from charge review to a clean, accepted claim.',
    do: ['Review charges and scrub claims before they go out', 'Work clearinghouse rejections the same day', 'Keep payer-specific rules current for your practices'],
    bring: ['2+ years of professional medical billing', 'Working knowledge of CPT, ICD-10 and modifiers', 'Experience with at least one major PM system'],
    plus: ['Specialty billing experience (cardiology, orthopedics, behavioral health)'] },
  { slug: 'certified-medical-coder', title: 'Certified Medical Coder (CPC)', team: 'Coding', location: 'Remote · US', type: 'Full-time', level: 'CPC required',
    summary: 'Code office visits and procedures from the note, so every claim reflects the work the provider did.',
    do: ['Code E/M, procedures and add-ons from documentation', 'Query providers when the note doesn’t support the code', 'Hit accuracy targets on internal audits'],
    bring: ['Active CPC, CCS-P or equivalent', '2+ years of outpatient coding', 'Solid E/M leveling (MDM and time)'],
    plus: ['A second specialty credential', 'Risk adjustment (HCC) experience'] },
  { slug: 'coding-auditor', title: 'Coding Auditor', team: 'Coding', location: 'Remote · US', type: 'Full-time', level: '5+ years',
    summary: 'Audit coding across our clients, find patterns before payers do, and teach the fix.',
    do: ['Run pre-bill and retrospective audits', 'Write clear findings with dollar impact', 'Coach coders and providers on documentation'],
    bring: ['CPC plus CPMA or CCS', '5+ years coding, 2+ auditing', 'Comfort presenting findings to physicians'],
    plus: ['Experience with payer or OIG audit responses'] },
  { slug: 'ar-specialist', title: 'Accounts Receivable Specialist', team: 'A/R & Denials', location: 'Plano, TX · Hybrid', type: 'Full-time', level: '1+ years',
    summary: 'Work aged claims to payment: call payers, correct and resubmit, and keep the 90+ bucket small.',
    do: ['Work A/R by aging bucket and dollar value', 'Call payers and document every follow-up', 'Correct and resubmit claims within filing limits'],
    bring: ['1+ year in medical A/R or collections', 'Comfort on payer calls and portals', 'Organized, deadline-driven follow-up'],
    plus: ['Medicare Advantage and Medicaid managed care experience'] },
  { slug: 'denial-management-analyst', title: 'Denial Management Analyst', team: 'A/R & Denials', location: 'Remote · US', type: 'Full-time', level: '3+ years',
    summary: 'Decode denials, win appeals, and trace each one back to the root cause so it doesn’t come back.',
    do: ['Work denials by reason code and priority', 'Write appeals and peer-to-peer packets', 'Report root causes to billing, coding and front desk'],
    bring: ['3+ years working denials and appeals', 'Fluent in CARC/RARC codes', 'Clear, persuasive writing'],
    plus: ['Prior authorization or utilization review background'] },
  { slug: 'payment-posting-specialist', title: 'Payment Posting Specialist', team: 'Billing', location: 'Plano, TX · Hybrid', type: 'Full-time', level: '1+ years',
    summary: 'Post ERAs and EOBs daily, balance deposits, and catch the underpayments hiding in the remit.',
    do: ['Post payments and adjustments daily', 'Reconcile deposits to remits', 'Flag underpayments and zero-pays for follow-up'],
    bring: ['1+ year of payment posting', 'Accuracy with numbers and reconciliation', 'Understanding of contractual adjustments'],
    plus: ['Experience reading payer contracts'] },
  { slug: 'prior-authorization-coordinator', title: 'Prior Authorization Coordinator', team: 'Billing', location: 'Remote · US', type: 'Full-time', level: '1+ years',
    summary: 'Get approvals on file before the patient is scheduled, and track every request against its deadline.',
    do: ['Submit and track prior auth requests', 'Work with payers and imaging benefit managers', 'Escalate requests that pass decision deadlines'],
    bring: ['1+ year of prior authorization work', 'Familiarity with payer portals', 'Calm, persistent follow-up'],
    plus: ['Imaging, oncology or surgical authorization experience'] },
  { slug: 'credentialing-specialist', title: 'Credentialing Specialist', team: 'Credentialing', location: 'Plano, TX · Hybrid', type: 'Full-time', level: '2+ years',
    summary: 'Enroll providers with every payer, keep CAQH current, and make sure nobody sees patients out of network.',
    do: ['Run payer enrollments start to finish', 'Maintain CAQH and revalidation calendars', 'Track every application to an effective date'],
    bring: ['2+ years of payer credentialing', 'Experience with CAQH and PECOS', 'Meticulous tracking'],
    plus: ['Hospital privileging experience'] },
  { slug: 'client-success-manager', title: 'Client Success Manager, RCM', team: 'Client Success', location: 'Plano, TX', type: 'Full-time', level: '4+ years',
    summary: 'Be the practice’s single point of contact: monthly results, priorities, and the fixes that move them.',
    do: ['Run monthly performance reviews with practices', 'Turn KPIs into a clear action list', 'Coordinate billing, coding and A/R teams'],
    bring: ['4+ years in revenue cycle, 2+ client-facing', 'Comfort with KPIs (denial rate, days in A/R, NCR)', 'Excellent communication'],
    plus: ['Experience onboarding new practices'] },
];

export type Rung = { title: string; note: string; owns: string[]; badge: string };
export const LADDER: { track: string; steps: Rung[] }[] = [
  { track: 'Billing', steps: [
    { title: 'Billing Specialist', note: 'Clean claims out the door', owns: ['Charge review and claim scrubbing', 'Same-day clearinghouse rejections', 'Payer rules for your practices'], badge: 'Training on our playbooks' },
    { title: 'Senior Billing Specialist', note: 'Own complex payers and specialties', owns: ['Surgical, imaging and drug-heavy claims', 'Payer escalations and edits', 'Coaching new specialists'], badge: 'Specialty billing' },
    { title: 'Billing Team Lead', note: 'Run a pod of specialists', owns: ['Daily queues and turnaround', 'Quality checks on the pod’s claims', 'Weekly results with Client Success'], badge: 'Team lead track' },
    { title: 'Billing Manager', note: 'Own results across clients', owns: ['Clean claim rate across every client', 'Hiring and training plans', 'Process changes that stick'], badge: 'Management' },
  ] },
  { track: 'Coding', steps: [
    { title: 'Medical Coder', note: 'Code from the note', owns: ['E/M, procedures and add-ons', 'Provider queries when the note is thin', 'Accuracy targets on audits'], badge: 'CPC or CCS-P' },
    { title: 'Certified Coder, 2 specialties', note: 'Broaden your credentials', owns: ['A second specialty’s rules', 'Complex and surgical cases', 'Peer reviews for new coders'], badge: 'Second credential, supported' },
    { title: 'Coding Auditor', note: 'Find patterns, teach fixes', owns: ['Pre-bill and retrospective audits', 'Findings with dollar impact', 'Provider documentation sessions'], badge: 'CPMA' },
    { title: 'Coding Manager', note: 'Lead accuracy across the team', owns: ['Accuracy across every client', 'Audit calendar and policy updates', 'Coder hiring and growth'], badge: 'Management' },
  ] },
  { track: 'A/R & Denials', steps: [
    { title: 'A/R Specialist', note: 'Work claims to paid', owns: ['Aging buckets by dollar value', 'Payer calls and portals', 'Corrections inside filing limits'], badge: 'Payer call training' },
    { title: 'Denial Analyst', note: 'Win appeals, find root causes', owns: ['Denials by CARC/RARC and priority', 'Appeals and peer-to-peer packets', 'Root-cause reports to billing'], badge: 'Appeals writing' },
    { title: 'A/R Team Lead', note: 'Run the follow-up engine', owns: ['Team queues and daily targets', 'Escalations on stuck claims', 'Days in A/R by client'], badge: 'Team lead track' },
    { title: 'Revenue Cycle Manager', note: 'Own the whole cycle', owns: ['Front-end to payment, end to end', 'Monthly KPIs with practices', 'Fixes across teams'], badge: 'Management' },
  ] },
  { track: 'Credentialing', steps: [
    { title: 'Credentialing Coordinator', note: 'Keep files moving', owns: ['Provider files and documents', 'CAQH attestations on time', 'Application status tracking'], badge: 'CAQH and PECOS training' },
    { title: 'Credentialing Specialist', note: 'Own enrollments end to end', owns: ['Payer enrollments to an effective date', 'Revalidation calendars', 'Practice updates on every file'], badge: 'Payer enrollment' },
    { title: 'Senior Specialist', note: 'Groups and hospital privileging', owns: ['Group and facility enrollments', 'Hospital privileging packets', 'Complex payer follow-up'], badge: 'Privileging' },
    { title: 'Credentialing Manager', note: 'Lead the program', owns: ['Every client’s credentialing calendar', 'Process and tooling', 'Team hiring and training'], badge: 'Management' },
  ] },
];

export const PERKS: [string, string][] = [
  ['Certification support', 'Study time and exam support for CPC, CCS and specialty credentials. [Confirm with Affinity Core]'],
  ['Real growth paths', 'Clear steps from specialist to lead to manager, reviewed with you twice a year. [Confirm with Affinity Core]'],
  ['Hybrid and remote roles', 'Plano office plus US-remote positions, depending on the role.'],
  ['Small team, real ownership', 'A 30+ person team where your work shows up in a practice’s monthly results.'],
  ['Training from day one', 'Payer rules, specialty playbooks and shadowing before you own your first practice.'],
  ['Health and time off', 'Benefits and paid time off for full-time roles. [Confirm with Affinity Core]'],
];

export const HIRING: [string, string][] = [
  ['Apply', 'Send your resume and the role you want. A real person reads every application.'],
  ['20-minute call', 'A quick conversation about your experience and what you’re looking for.'],
  ['Skills check', 'A short, practical exercise: a few sample claims, a coding case or a denial to work.'],
  ['Team interview and offer', 'Meet the lead you’d work with, then a decision within a week. [Confirm with Affinity Core]'],
];

export const CAREER_FAQS: string[][] = [
  ['Are your roles remote?', 'Some are. Each posting says whether it’s in our Plano office, hybrid or remote within the US.'],
  ['Do I need a coding certification?', 'For coding and auditing roles, yes (CPC, CCS or equivalent). For billing, A/R and credentialing, relevant experience matters more.'],
  ['Do you hire people new to medical billing?', 'Occasionally, for entry-level billing and A/R roles. If you’re early in your career, apply to the closest role and tell us.'],
  ['What tools will I use?', 'Our clients’ practice management systems and EHRs, clearinghouses and payer portals. We train on the specific systems.'],
];
