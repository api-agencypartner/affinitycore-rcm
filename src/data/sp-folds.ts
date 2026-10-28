/**
 * Specialty-only folds: "Where a month leaks" (LeakFall) and "Same visit, two claims" (TwoClaims).
 * Every dollar figure here is ILLUSTRATIVE (typical ranges, not client data) and the pages say so.
 * Strapi: specialty.leak and specialty.claim.
 */
import type { LeakFold, ClaimFold, ClaimSide } from './specialties';

const NOTE = 'Illustrative month. Expected revenue and leak rates are typical ranges, not a client’s numbers. Your free assessment measures your own.';
const SRC = { label: 'For context: about 15% of claims to private payers are denied on first submission (Premier, 2024)', href: 'https://premierinc.com/newsroom/blog/trend-alert-private-payers-retain-profits-by-refusing-or-delaying-legitimate-medical-claims' };
const UNWORKED: L = ['Denials never worked', 'Denied lines left to age past the filing limit.', 1.7, 'Every denial worked by reason code and appealed before the deadline.'];

type L = [label: string, cause: string, pct: number, fix: string];
const leak = (name: string, intro: string, perProvider: number, unit: [string, string], sizes: [number, number, number], leaks: L[]): LeakFold => ({
  eyebrow: '/ Where the money goes', lines: [`A ${name} month,`, 'leak by leak.'], intro, perProvider, unit, sizes,
  leaks: leaks.map(([label, cause, pct, fix]) => ({ label, cause, pct, fix })), note: NOTE, source: SRC,
});

type S = [code: string, tag: string, amt: number | null];
const bad = ([code, tag, amt]: S, tone: ClaimSide['tone'] = amt === 0 ? 'bad' : 'ok'): ClaimSide => ({ code, tag, amt, tone });
const good = ([code, tag, amt]: S): ClaimSide => ({ code, tag, amt, tone: 'good' });
type R = [label: string, before: S, after: S, why: string, beforeTone?: ClaimSide['tone']];
const HOW = 'Hover down the claim to see how each line changes.';
const claim = (lines: [string, string], intro: string, visit: [string, string, string], rows: R[]): ClaimFold => ({
  eyebrow: '/ Same visit, two claims', lines, intro: `${intro} ${HOW}`, visit,
  rows: rows.map(([label, b, g, why, t]) => ({ label, bad: bad(b, t), good: good(g), why })), note: 'Illustrative claim and amounts.',
});

export const FOLDS: Record<string, { leak: LeakFold; claim: ClaimFold }> = {
  'internal-medicine': {
    leak: leak('internal medicine', 'Primary care is paid in small amounts, many times a day. It rarely loses money to one big denial; it loses it to visits coded a level low and work that never gets a code.', 45000, ['physician', 'physicians'], [1, 5, 15], [
      ['Visits coded low', '99213 billed out of habit when the note supports moderate decision-making.', 2.4, 'Every visit leveled from MDM or total time.'],
      ['G2211 missed', 'The complexity add-on left off ongoing-care visits.', 1.3, 'G2211 added wherever the longitudinal relationship is documented.'],
      ['Care management unbilled', 'Chronic care minutes worked but never consented or logged.', 1.6, 'Consent on file and minutes tracked, so 99490 goes out every month.'],
      ['Wellness visits too early', 'Annual wellness visits billed before 12 months, then denied.', 0.8, 'The last AWV date checked before the visit is scheduled.'],
      UNWORKED,
    ]),
    claim: claim(['One internal medicine visit,', 'billed two ways.'], 'A Medicare follow-up for diabetes with labs drawn in the office.', ['Follow-up, Medicare', 'Patient R. Delgado', 'DOS 10/09/2026'], [
      ['Office visit', ['99213', 'Coded low', 92], ['99214', 'MDM: moderate', 131], 'A chronic illness with a change in treatment and labs ordered is moderate decision-making: 99214.'],
      ['Complexity add-on', ['—', 'Not billed', null], ['G2211', 'Ongoing care', 16], 'Your physician is the continuing focal point for this patient’s diabetes, so G2211 applies.'],
      ['Venipuncture', ['—', 'Given away', null], ['36415', 'Draw billed', 3], 'The labs went out, but the draw happened here. That’s billable.'],
      ['Diagnosis', ['E11.9', 'Unspecified', null], ['E11.65', 'Hyperglycemia noted', null], 'The note documents hyperglycemia, so the diagnosis says so. It supports the higher level.'],
    ]),
  },
  pediatrics: {
    leak: leak('pediatric', 'Pediatric revenue is built from many small lines on every well visit: each vaccine component, each screen, the fluoride. Miss a few per visit and it adds up fast.', 40000, ['pediatrician', 'pediatricians'], [1, 5, 15], [
      ['Vaccine components unpaid', '90461 left off combination vaccines, so components go unpaid.', 2.2, 'Admin billed per vaccine and per component, matched to the VIS given.'],
      ['Screens not billed', 'Developmental and behavioral screens done but never coded.', 1.5, '96110 and 96127 billed whenever a scored instrument is in the chart.'],
      ['Sick care inside well visits', 'A problem addressed at a well visit, with no separate E/M billed.', 1.2, 'A separate problem visit with modifier 25 when the note supports it.'],
      ['Supplies given away', 'Fluoride varnish and supplies applied but never charged.', 0.6, 'Charge capture checks every visit for 99188 and supplies.'],
      UNWORKED,
    ]),
    claim: claim(['One pediatric well visit,', 'billed two ways.'], 'An 18-month well visit with three vaccines, a developmental screen and fluoride.', ['Well visit, age 18 months', 'Patient A. Brooks', 'DOS 10/06/2026'], [
      ['Preventive visit', ['99392', 'Billed', 120], ['99392', 'Age band right', 120], 'Age 1–4 preventive visit. This line was already right.', 'ok'],
      ['Vaccine admin', ['90460 × 1', 'Billed per visit', 25], ['90460 × 3, 90461 × 4', 'Per component', 115], 'Admin is billed per vaccine, plus 90461 for each extra component in a combination vaccine.'],
      ['Developmental screen', ['—', 'Not billed', null], ['96110', 'ASQ-3 scored', 10], 'The scored ASQ-3 is in the chart, so the screen is billable.'],
      ['Fluoride varnish', ['—', 'Given away', null], ['99188', 'Applied', 25], 'Varnish was applied at the visit. It’s a separate line.'],
    ]),
  },
  'urgent-care': {
    leak: leak('urgent care', 'Urgent care runs on volume, so small rules repeat hundreds of times a month: which payers pay a global fee, who counts as new, how lacerations are measured.', 120000, ['location', 'locations'], [1, 4, 10], [
      ['Global vs itemized', 'Claims built the wrong way for the payer’s contract.', 2.0, 'Each payer mapped to S9083 or itemized billing, per contract.'],
      ['Patients billed as new', 'Seen at a sister location within 3 years, so “new” is denied.', 0.9, 'Patient history checked across every location before the visit is coded.'],
      ['Lacerations split', 'Each laceration coded alone instead of summing lengths.', 0.8, 'Repairs of the same type and site summed into one code.'],
      ['Waived tests unpaid', 'Rapid tests sent to Medicare without modifier QW.', 0.7, 'CLIA-waived tests carry QW automatically.'],
      UNWORKED,
    ]),
    claim: claim(['One urgent care visit,', 'billed two ways.'], 'A walk-in with two cuts on the forearm and a sore throat, seen last year at another of your locations.', ['Walk-in visit', 'Patient T. Nguyen', 'DOS 10/11/2026'], [
      ['Office visit', ['99204', 'Denied · not new', 0], ['99214', 'Established', 131], 'The patient was seen at a sister location within 3 years, so they’re established.'],
      ['Laceration repair', ['12001 × 2', 'Denied · split', 0], ['12002', 'Lengths summed', 145], 'Two simple repairs on the same site, 2.0 and 3.5 cm, are summed to 5.5 cm: 12002.'],
      ['Rapid strep', ['87880', 'Denied · no QW', 0], ['87880-QW', 'CLIA waived', 16], 'Medicare needs QW on a waived test.'],
    ]),
  },
  'allergy-and-immunology': {
    leak: leak('allergy', 'Allergy billing is all about counting: tests per allergen, doses per vial, milligrams per biologic. Count wrong and the claim pays a fraction of the work.', 60000, ['allergist', 'allergists'], [1, 3, 8], [
      ['Tests billed as one', 'A full panel billed as a single unit of 95004.', 2.4, 'One unit per allergen tested, matched to the panel sheet.'],
      ['Extract doses miscounted', 'Antigen billed per vial, or doses that don’t match the vial.', 1.5, '95165 units counted from the mixing record.'],
      ['Wrong injection code', '95115 used when two or more shots were given.', 0.9, 'Injection codes picked from the shot log.'],
      ['Biologic units off', 'Omalizumab units off the 5 mg increment, or no approval.', 1.6, 'Units calculated from the dose; approval checked before each fill.'],
      UNWORKED,
    ]),
    claim: claim(['One allergy visit,', 'billed two ways.'], 'A new patient evaluated and skin tested the same day.', ['New patient, skin testing', 'Patient L. Moreno', 'DOS 10/08/2026'], [
      ['Office visit', ['99204', 'Denied · bundled', 0], ['99204-25', 'Separate history', 165], 'The history and exam stand apart from the testing, so the visit carries modifier 25.'],
      ['Prick tests', ['95004 × 1', 'One unit', 7], ['95004 × 40', 'One per allergen', 280], 'Forty allergens were tested. 95004 is billed per test.'],
      ['Intradermal tests', ['95024 × 10', 'Denied · not screened', 0], ['95024 × 6', 'Screened first', 54], 'Only allergens that screened negative on prick testing go on to intradermal.'],
    ]),
  },
  'obstetrics-and-gynecology': {
    leak: leak('OB/GYN', 'Obstetric care is paid as packages, so the money is won or lost in picking the right package when care doesn’t follow the textbook nine months.', 55000, ['OB/GYN', 'OB/GYNs'], [1, 5, 12], [
      ['Global billed after a transfer', 'Full global OB billed when the patient joined or left mid-pregnancy.', 2.0, 'Antepartum, delivery and postpartum split by who did what.'],
      ['Wrong delivery package', 'Planned vaginal billed after a cesarean, or the reverse.', 1.0, 'Package matched to the delivery note and any VBAC attempt.'],
      ['Ultrasound component', 'OB ultrasounds billed globally on hospital equipment.', 1.1, 'Professional component (26) when the hospital owns the machine.'],
      ['Devices left off', 'IUDs and implants inserted without the device billed.', 0.8, 'Device J-codes and NDCs checked on every insertion.'],
      UNWORKED,
    ]),
    claim: claim(['One delivery,', 'billed two ways.'], 'A patient who transferred into your practice at 22 weeks and delivered vaginally.', ['Transfer-in, vaginal delivery', 'Patient K. Ellis', 'Delivered 10/02/2026'], [
      ['Prenatal care', ['59400', 'Denied · transferred in', 0], ['59426', '7+ visits', 980], 'You saw her for 8 prenatal visits, not the whole pregnancy, so it’s antepartum care only.'],
      ['Delivery + postpartum', ['—', 'Assumed in the global', null], ['59410', 'Delivery + PP', 1150], 'Delivery and postpartum care are billed together, apart from the antepartum visits.'],
      ['OB ultrasound', ['76805', 'Denied · hospital owns', 0], ['76805-26', 'Read only', 65], 'The scan ran on hospital equipment; your physician bills the interpretation.'],
    ]),
  },
  gastroenterology: {
    leak: leak('GI', 'GI revenue turns on one question asked on every scope: did this start as a screening? Get that wrong and either the payer or your patient refuses the bill.', 110000, ['gastroenterologist', 'gastroenterologists'], [1, 5, 15], [
      ['Screenings turned diagnostic', 'Polyps found, PT or 33 left off, and the patient is billed.', 2.3, 'Screening intent carried through to the claim with PT or 33.'],
      ['Biopsy and snare, same lesion', 'Both billed for one lesion, and the biopsy is denied.', 1.0, 'Biopsy billed only for a separate lesion, with XS.'],
      ['Capsule without approval', 'Capsule studies done before the plan approved them.', 1.2, 'Approval checked when the study is ordered.'],
      ['Medical necessity', 'Diagnosis doesn’t meet the payer’s EGD policy.', 1.5, 'Diagnoses coded to the payer’s covered list from the note.'],
      UNWORKED,
    ]),
    claim: claim(['One colonoscopy,', 'billed two ways.'], 'A Medicare screening colonoscopy where a polyp was snared and a separate lesion biopsied.', ['Screening colonoscopy', 'Patient D. Harris', 'DOS 10/07/2026'], [
      ['Colonoscopy', ['45385', 'No PT: patient billed', 210], ['45385-PT', 'Screening noted', 290], 'It started as a screening, so PT waives the deductible and the patient isn’t billed.', 'bad'],
      ['Biopsy', ['45380', 'Denied · same lesion', 0], ['45380-XS', 'Separate lesion', 95], 'The biopsy was taken from a different lesion than the one snared.'],
      ['Diagnosis', ['Z12.11', 'Screening only', null], ['Z12.11, K63.5', 'Polyp added', null], 'Screening first, then the finding. That order keeps the screening benefit.'],
    ]),
  },
  nephrology: {
    leak: leak('nephrology', 'Nephrology is paid by the month and by the visit count. A missing fourth visit or a hospital stay mid-month quietly changes what the whole month is worth.', 70000, ['nephrologist', 'nephrologists'], [1, 4, 12], [
      ['Monthly tier dropped', 'A fourth visit happened but wasn’t documented.', 2.3, 'Face-to-face visits logged per patient, per month.'],
      ['Home vs in-center', 'Home dialysis patients billed with in-center codes.', 0.9, 'Modality checked before the monthly code is picked.'],
      ['Partial months', 'Full month billed for a patient hospitalized or transferred.', 1.0, 'Partial months billed per day with 90970.'],
      ['Same-day dialysis visits', 'Single evaluations billed on top of the monthly code.', 0.6, 'Included services left off, so the monthly claim pays clean.'],
      UNWORKED,
    ]),
    claim: claim(['One dialysis month,', 'billed two ways.'], 'An in-center hemodialysis patient seen four times this month, with an access angioplasty.', ['ESRD monthly, in-center', 'Patient M. Carter', 'Service month 09/2026'], [
      ['ESRD monthly', ['90961', '3 visits documented', 220], ['90960', '4 visits documented', 310], 'The fourth face-to-face visit was in the rounding notes. Documented, the month moves up a tier.'],
      ['Dialysis evaluation', ['90935', 'Denied · same month', 0], ['—', 'Included in 90960', null], 'Evaluations during the month are part of the monthly code, so the line is removed, not appealed.'],
      ['Access angioplasty', ['36902 + 36901', 'Denied · bundled', 0], ['36902', 'Imaging included', 410], '36902 already includes the circuit imaging.'],
    ]),
  },
  neurology: {
    leak: leak('neurology', 'Neurology mixes long diagnostic studies with expensive drugs. Most leaks are counting errors: studies, hours, units, and the vial left over.', 55000, ['neurologist', 'neurologists'], [1, 4, 10], [
      ['Botox without approval', 'Chronic migraine injections done before the plan approved them.', 1.8, 'Criteria and approval checked before every injection cycle.'],
      ['Nerve studies miscounted', 'Nerve conduction counted per nerve instead of per study.', 1.6, 'Studies counted the way the code defines them.'],
      ['Drug waste unbilled', 'Leftover Botox never reported with JW.', 1.4, 'Used units and discarded units billed on separate lines.'],
      ['EEG coded to the wrong study', 'Awake-only EEG billed when sleep was recorded.', 1.0, 'EEG codes picked from the recording, not the order.'],
      UNWORKED,
    ]),
    claim: claim(['One neurology visit,', 'billed two ways.'], 'A chronic migraine patient’s quarterly Botox injections, 155 units from a 200-unit vial.', ['Chronic migraine, Botox', 'Patient S. Patel', 'DOS 10/10/2026'], [
      ['Chemodenervation', ['64615', 'Denied · no approval', 0], ['64615', 'Approval A-77120', 180], 'The approval was renewed before the visit, with the headache diary on file.'],
      ['Botox used', ['J0585 × 155', 'Denied · no approval', 0], ['J0585 × 155', 'Units injected', 1080], 'Once the procedure is approved, the drug pays too.'],
      ['Botox discarded', ['—', 'Not reported', null], ['J0585-JW × 45', 'Waste reported', 315], 'The rest of the single-use vial is billable as waste with JW.'],
    ]),
  },
  oncology: {
    leak: leak('oncology', 'In oncology the drug is most of the claim, so a wrong unit count or a missing approval costs more than a whole day of visits.', 250000, ['oncologist', 'oncologists'], [1, 5, 15], [
      ['Drug units mismatch', 'Units that don’t match the dose, or no JW/JZ.', 2.6, 'Units calculated from the dose and the HCPCS increment, with JW or JZ.'],
      ['Regimen without approval', 'A cycle given before the plan approved the regimen.', 2.4, 'Every regimen and cycle checked against its approval.'],
      ['Infusion order wrong', 'Hydration billed as the initial service instead of chemo.', 1.8, 'The initial code goes to the primary reason for the visit.'],
      ['Extra hours miscounted', 'Additional hours billed under 30 minutes.', 0.9, 'Infusion times taken from start and stop in the MAR.'],
      UNWORKED,
    ]),
    claim: claim(['One infusion day,', 'billed two ways.'], 'A 200 mg pembrolizumab infusion with hydration first.', ['Immunotherapy infusion', 'Patient E. Walsh', 'DOS 10/09/2026'], [
      ['Initial service', ['96360', 'Hydration first', 70], ['96413', 'Chemo first', 140], 'The reason for the visit is the immunotherapy, so it takes the initial code.'],
      ['Pembrolizumab', ['J9271 × 2', 'Billed per vial', 110], ['J9271 × 200, JZ', 'Units match dose', 11400], 'J9271 is per 1 mg. A 200 mg dose is 200 units, with JZ since nothing was discarded.', 'bad'],
      ['Diagnosis', ['C34.90', 'Unspecified', null], ['C34.12', 'Site documented', null], 'The note names the upper lobe of the left lung. Payers check it against the drug’s indication.'],
    ]),
  },
  'ambulatory-surgery-centers': {
    leak: leak('surgery center', 'An ASC bills the facility side of every case, under rules that differ from the surgeon’s. Leaks hide in bundling, sides, devices and approvals.', 300000, ['OR', 'ORs'], [1, 3, 6], [
      ['Device not on the claim', 'Device-intensive cases billed without the device code.', 2.4, 'Implant logs matched to every device-intensive case.'],
      ['No approval before the case', 'Cases performed without an approval that matches the CPT.', 2.0, 'Approvals checked against the scheduled CPT before the day of surgery.'],
      ['Bundled pairs billed', 'Procedures that bundle billed together, then denied.', 1.2, 'NCCI edits run on every case before it goes out.'],
      ['No side or eye', 'RT, LT or 50 left off, so the payer can’t pay it.', 1.0, 'Laterality pulled from the op note.'],
      UNWORKED,
    ]),
    claim: claim(['One ASC case,', 'billed two ways.'], 'A right knee arthroscopy with a partial meniscectomy and chondroplasty in the same compartment.', ['Knee arthroscopy, facility claim', 'Patient G. Romero', 'DOS 10/05/2026'], [
      ['Meniscectomy', ['29881', 'Denied · no side', 0], ['29881-RT', 'Side noted', 1250], 'The op note says right knee, so the claim does too.'],
      ['Chondroplasty', ['29877', 'Denied · bundled', 0], ['—', 'Bundled, not billed', null], 'Chondroplasty in the same compartment is included in 29881, so the line comes off.'],
      ['Diagnosis', ['M23.9', 'Unspecified', null], ['M23.221', 'Tear documented', null], 'The note describes the tear and the knee, so the diagnosis does too.'],
    ]),
  },
  orthopedics: {
    leak: leak('orthopedic', 'Orthopedic money moves through injections, imaging and surgery, each with its own trap: same-day visits, units per milligram, and approvals that have to come first.', 120000, ['surgeon', 'surgeons'], [1, 6, 20], [
      ['Imaging before approval', 'MRIs done before the approval was granted.', 1.8, 'Approval confirmed before the scan is scheduled.'],
      ['Injection visits bundled', 'Same-day visits denied without modifier 25.', 1.4, 'Modifier 25 when the note shows a separate evaluation.'],
      ['Hyaluronan units', 'Billed per syringe instead of per mg.', 1.2, 'Units calculated per mg from the product given.'],
      ['Visits inside the global', 'Post-op follow-ups billed inside 90 days.', 0.9, 'Global periods tracked per patient.'],
      UNWORKED,
    ]),
    claim: claim(['One orthopedic visit,', 'billed two ways.'], 'A knee evaluation with an ultrasound-guided Synvisc-One injection.', ['Knee OA follow-up', 'Patient F. Lewis', 'DOS 10/12/2026'], [
      ['Office visit', ['99214', 'Denied · no 25', 0], ['99214-25', 'Separate exam', 131], 'The exam and the decision to inject are separate from the injection itself.'],
      ['Injection', ['20610 + 76942', 'Guidance denied', 60], ['20611', 'Ultrasound included', 95], 'A large-joint injection with ultrasound has its own code. Guidance isn’t billed again.', 'bad'],
      ['Hyaluronan', ['J7325 × 1', 'Per syringe', 5], ['J7325 × 48', 'Per mg', 280], 'J7325 is per mg. Synvisc-One is 48 mg.', 'bad'],
    ]),
  },
  dermatology: {
    leak: leak('dermatology', 'A single skin check can carry biopsies, destructions and excisions. Each has its own counting rule, and most leaks come from counting them like visits.', 70000, ['dermatologist', 'dermatologists'], [1, 4, 12], [
      ['Biopsies billed as first', 'Every biopsy billed as a first lesion.', 1.6, 'One first-lesion code, then add-ons for the rest.'],
      ['Repairs not billed', 'Intermediate closures after excisions never coded.', 1.6, 'Repairs billed separately, summed by type and site.'],
      ['Excisions sized small', 'Sized by the lesion alone, without the margins.', 1.4, 'Excised diameter, lesion plus margins, taken from the note.'],
      ['AK destruction miscoded', '15 or more AKs billed as 17000 + 17003.', 1.0, '17004 when 15 or more lesions are treated.'],
      UNWORKED,
    ]),
    claim: claim(['One dermatology visit,', 'billed two ways.'], 'A skin check with three biopsies, 18 actinic keratoses treated and an earlier excision closed in layers.', ['Skin check + procedures', 'Patient J. Kim', 'DOS 10/08/2026'], [
      ['Biopsies', ['11102 × 3', 'Two denied', 95], ['11102, 11103 × 2', 'First + adds', 175], 'One first-lesion code and an add-on for each additional biopsy.', 'bad'],
      ['AK destruction', ['17000, 17003 × 14', 'Denied · use 17004', 0], ['17004', '15+ lesions', 180], 'Eighteen lesions treated: one code, 17004.'],
      ['Repair', ['—', 'Not billed', null], ['12032', 'Layered closure', 310], 'A layered closure is separately billable after an excision.'],
    ]),
  },
  ophthalmology: {
    leak: leak('ophthalmology', 'Ophthalmology pays by the eye and by the milligram. Missing sides and per-vial drug billing are where most of the money slips.', 110000, ['ophthalmologist', 'ophthalmologists'], [1, 4, 12], [
      ['Drug units per vial', 'Anti-VEGF drugs billed as one unit per vial.', 2.6, 'Units calculated per mg, with JW or JZ.'],
      ['No eye modifier', 'Injections and tests with no RT, LT or 50.', 1.0, 'Laterality from the procedure note on every line.'],
      ['Post-ops inside the global', 'Visits billed during the 90 days after cataract surgery.', 0.9, 'Global periods tracked per eye.'],
      ['Exam and E/M together', 'An eye exam and an E/M billed for one visit.', 0.8, 'One visit code, picked for what was done.'],
      UNWORKED,
    ]),
    claim: claim(['One retina visit,', 'billed two ways.'], 'An aflibercept injection in the right eye with OCT of both eyes.', ['Retina injection visit', 'Patient H. Ross', 'DOS 10/06/2026'], [
      ['Injection', ['67028', 'Denied · no eye', 0], ['67028-RT', 'Eye noted', 105], 'The payer needs to know which eye was injected.'],
      ['Aflibercept', ['J0178 × 1', 'Billed per vial', 870], ['J0178 × 2, JZ', 'Per mg', 1740], 'J0178 is per mg. A 2 mg dose is 2 units.', 'bad'],
      ['OCT', ['92134 × 2', 'Second denied', 40], ['92134', 'Both eyes, once', 40], 'Retinal OCT covers both eyes in one unit. Billing it twice only creates a denial to work.', 'bad'],
    ]),
  },
  'pain-management': {
    leak: leak('pain management', 'Interventional pain is paid level by level and approval by approval. Payers check relief scores, frequency and imaging on every claim.', 80000, ['physician', 'physicians'], [1, 4, 10], [
      ['Ablation without two blocks', 'RFA done without two diagnostic blocks showing 80% relief.', 2.0, 'Relief scores recorded and checked before RFA is scheduled.'],
      ['Frequency limits', 'Epidurals given more often than the payer allows.', 1.2, 'Injection history checked against each payer’s limit.'],
      ['Levels miscounted', 'Additional levels billed alone, or counted wrong.', 1.0, 'Levels and sides coded from the procedure note.'],
      ['Imaging billed separately', 'Fluoroscopy billed on codes that include it.', 0.8, 'Guidance left off codes that already include it.'],
      UNWORKED,
    ]),
    claim: claim(['One pain procedure,', 'billed two ways.'], 'A two-level lumbar transforaminal epidural under fluoroscopy.', ['Lumbar TFESI, L4–L5 and L5–S1', 'Patient C. Young', 'DOS 10/09/2026'], [
      ['First level', ['64483 + 77003', 'Fluoro denied', 210], ['64483', 'Imaging included', 210], 'Fluoroscopy is part of 64483. Billing it again only creates a denial.', 'bad'],
      ['Second level', ['64483 × 2', 'Denied · duplicate', 0], ['64484', 'Add-on level', 95], 'Each additional level goes on the add-on code.'],
      ['Diagnosis', ['M54.5', 'Deleted code', null], ['M54.16', 'Radiculopathy noted', null], 'M54.5 was retired. The note documents lumbar radiculopathy, which is what the epidural is for.', 'bad'],
    ]),
  },
  podiatry: {
    leak: leak('podiatry', 'Routine foot care is covered only for qualifying patients, and Medicare wants the proof on the claim. Most podiatry denials are missing modifiers, not missing work.', 40000, ['podiatrist', 'podiatrists'], [1, 4, 10], [
      ['Q modifiers missing', 'Routine foot care billed without class findings.', 2.0, 'Q7, Q8 or Q9 picked from the documented findings.'],
      ['Frequency limits', 'Routine care billed sooner than every 61 days.', 1.0, 'Last service date checked before the visit.'],
      ['Codes stacked', 'Nail codes billed together for the same session.', 0.8, 'One debridement code per session, by nail count.'],
      ['No toe modifier', 'Nail procedures with no TA–T9 modifier.', 0.7, 'Toe modifiers on every nail procedure.'],
      UNWORKED,
    ]),
    claim: claim(['One podiatry visit,', 'billed two ways.'], 'Routine foot care for a Medicare patient with diabetic neuropathy: six nails and three calluses.', ['Routine foot care, Medicare', 'Patient W. Grant', 'DOS 10/07/2026'], [
      ['Nail debridement', ['11721', 'Denied · no Q', 0], ['11721-Q8', 'Class findings', 55], 'The exam documents two class B findings, so Q8 shows the care is covered.'],
      ['Callus paring', ['11055 × 3', 'Denied · units', 0], ['11056', '2–4 lesions', 45], 'Three lesions are one unit of 11056.'],
      ['Diagnosis', ['B35.1', 'Nail fungus only', null], ['B35.1, E11.42', 'Neuropathy added', null], 'The systemic condition is what makes routine care covered.'],
    ]),
  },
  urology: {
    leak: leak('urology', 'Urology mixes office procedures with high-cost hormone drugs. Unit counts on the drugs and bundling on the procedures are where it leaks.', 90000, ['urologist', 'urologists'], [1, 5, 15], [
      ['Drug units', 'Leuprolide billed as one unit per injection.', 2.2, 'Units per 7.5 mg from the dose given.'],
      ['Component billing', 'Urodynamics billed globally on another facility’s equipment.', 1.0, 'Professional component when the equipment isn’t yours.'],
      ['Same-day visits bundled', 'Visits billed with cystoscopy without separate work.', 0.9, 'Modifier 25 only when the note shows a separate service.'],
      ['Guidance billed again', 'Ultrasound or a visit billed with a biopsy that includes it.', 0.8, 'Included services left off the claim.'],
      UNWORKED,
    ]),
    claim: claim(['One urology visit,', 'billed two ways.'], 'A prostate cancer follow-up with a 22.5 mg leuprolide injection and a bladder scan.', ['Prostate cancer follow-up', 'Patient B. Allen', 'DOS 10/10/2026'], [
      ['Leuprolide', ['J9217 × 1', '22.5 mg as one unit', 240], ['J9217 × 3', 'Per 7.5 mg', 720], 'J9217 is per 7.5 mg, so a 22.5 mg dose is 3 units.', 'bad'],
      ['Injection', ['—', 'Not billed', null], ['96402', 'Hormonal injection', 30], 'Giving the injection is a separate line from the drug.'],
      ['Bladder scan', ['51798 + 76857', 'Denied · same scan', 25], ['51798', 'One scan', 25], 'A post-void residual is one code. The second only creates a denial.', 'bad'],
    ]),
  },
  'wound-care': {
    leak: leak('wound care', 'Wound care is paid by depth and by area, and skin substitutes by the square centimetre. Most leaks are measurement and waste.', 50000, ['provider', 'providers'], [1, 4, 10], [
      ['Skin substitute waste', 'The whole sheet billed with no waste reported, then denied.', 2.0, 'Units applied and units discarded (JW) billed separately.'],
      ['Wounds billed separately', 'Wounds at the same depth billed one by one.', 1.6, 'Areas at the same depth summed, then coded.'],
      ['Wrong depth', 'Selective debridement billed for tissue below the dermis.', 1.4, 'Depth taken from what was removed, in the note.'],
      ['Area rounded up', 'Areas rounded past the next 20 cm² band.', 0.8, 'Measured area, not rounded, decides the add-ons.'],
      UNWORKED,
    ]),
    claim: claim(['One wound care visit,', 'billed two ways.'], 'Two leg wounds debrided to subcutaneous tissue, and a skin substitute on a foot ulcer.', ['Wound clinic visit', 'Patient N. Brown', 'DOS 10/08/2026'], [
      ['Debridement', ['11042 × 2', 'Second denied', 140], ['11042, 11045', 'Areas summed', 190], 'Two wounds at the same depth, 18 and 12 cm², are summed to 30 cm²: first 20, then one add-on.', 'bad'],
      ['Skin substitute', ['Q4101 × 25', 'Denied · no waste', 0], ['Q4101 × 16, JW × 9', 'Used + discarded', 1100], 'Sixteen cm² applied, nine discarded, each on its own line.'],
      ['Application', ['15271', 'Denied · leg code', 0], ['15275', 'Foot wound', 160], 'Foot wounds have their own application codes.'],
    ]),
  },
  'mental-health': {
    leak: leak('mental health', 'Therapy is paid by the minute and by the session limit. Small timing and authorization gaps repeat on every client, every week.', 15000, ['clinician', 'clinicians'], [1, 14, 40], [
      ['Sessions coded short', '53+ minute sessions billed as 90834.', 2.6, 'Start and stop times decide the code.'],
      ['Visit limits and approvals', 'Sessions past the authorized count.', 1.8, 'Authorized visits tracked per client, renewed before they run out.'],
      ['Interactive complexity skipped', 'Interpreter or third-party sessions without 90785.', 0.8, '90785 when the note shows the complicating factor.'],
      ['Family sessions billed wrong', 'Billed under the family member instead of the patient.', 0.8, 'Family therapy billed under the identified patient.'],
      UNWORKED,
    ]),
    claim: claim(['One therapy session,', 'billed two ways.'], 'A 55-minute individual session held with an interpreter.', ['Individual psychotherapy', 'Client M. Fischer', 'DOS 10/09/2026'], [
      ['Psychotherapy', ['90834', '55 min, coded 45', 98], ['90837', '55 min documented', 145], 'Fifty-three minutes or more is 90837. The note shows 55.'],
      ['Interactive complexity', ['—', 'Not billed', null], ['90785', 'Interpreter present', 15], 'An interpreter changed how the session was delivered, so the add-on applies.'],
      ['Diagnosis', ['F32.9', 'Unspecified', null], ['F33.1', 'Recurrent, moderate', null], 'The note documents recurrent moderate depression. Payers check it against the treatment plan.'],
    ]),
  },
  psychiatry: {
    leak: leak('psychiatry', 'Psychiatry visits often hold three services at once: medication management, therapy and an injection. Each one left off is money left on the table.', 40000, ['psychiatrist', 'psychiatrists'], [1, 5, 15], [
      ['LAI units', 'Long-acting injectables billed as one unit per injection.', 2.2, 'Units per mg from the dose given.'],
      ['Therapy add-on missing', 'Therapy done with an E/M but never billed.', 1.8, 'Therapy minutes, separate from the E/M, billed with 90833–90838.'],
      ['Injection not billed', 'The administration left off when an LAI is given.', 0.9, '96372 on every injection visit.'],
      ['Add-on minutes off', 'Add-on codes picked from total visit time.', 0.8, 'Add-ons picked from therapy minutes alone.'],
      UNWORKED,
    ]),
    claim: claim(['One psychiatry visit,', 'billed two ways.'], 'Medication management with 20 minutes of therapy and a 234 mg paliperidone injection.', ['Med management + LAI', 'Patient V. Hughes', 'DOS 10/07/2026'], [
      ['Office visit', ['99214', 'Billed', 131], ['99214', 'MDM: moderate', 131], 'Medication management at a moderate level. Already right.', 'ok'],
      ['Therapy add-on', ['—', 'Not billed', null], ['90833', '20 min, separate', 75], 'Twenty minutes of therapy, documented apart from the E/M.'],
      ['Paliperidone', ['J2426 × 1', 'Per injection', 9], ['J2426 × 234', 'Per mg', 1950], 'J2426 is per 1 mg. A 234 mg dose is 234 units.', 'bad'],
      ['Injection', ['—', 'Not billed', null], ['96372', 'IM injection', 25], 'Giving the injection is its own line.'],
    ]),
  },
  anesthesia: {
    leak: leak('anesthesia', 'Anesthesia is paid in base units plus time, so every minute and every modifier counts. Most leaks are time and the extras nobody remembers to add.', 70000, ['provider', 'providers'], [1, 10, 30], [
      ['Time rounded or borrowed', 'Minutes rounded, or taken from the surgeon’s times.', 1.4, 'Start and stop times taken from the anesthesia record.'],
      ['Wrong crosswalk', 'Anesthesia code that doesn’t match the surgery done.', 1.0, 'Crosswalk checked against the final op note.'],
      ['Blocks billed wrong', 'Post-op blocks billed when they were the main anesthetic, or missed when requested.', 0.9, 'Blocks billed only when the surgeon’s request is documented.'],
      ['Qualifying circumstances missed', 'Age, hypothermia or emergency add-ons left off.', 0.6, '99100–99140 checked on every case.'],
      UNWORKED,
    ]),
    claim: claim(['One anesthesia case,', 'billed two ways.'], 'A total knee under general anesthesia with a femoral block for post-op pain, patient aged 74.', ['Total knee arthroplasty', 'Patient P. Morgan', 'DOS 10/06/2026'], [
      ['Anesthesia', ['01402 · 120 min', 'Surgeon’s times', 520], ['01402 · 138 min', 'Record times', 590], 'Anesthesia time runs from the start of care to handoff, taken from the anesthesia record.'],
      ['Extreme age', ['—', 'Not billed', null], ['99100', 'Age over 70', 25], 'Patients over 70 qualify for the extreme-age add-on.'],
      ['Nerve block', ['64447', 'Denied · no request', 0], ['64447-59', 'Surgeon requested', 95], 'The surgeon’s request for post-op pain control is documented, so the block is separate.'],
    ]),
  },
  radiology: {
    leak: leak('radiology', 'Radiology runs on approvals that name an exact code. Change the study, and the approval stops covering it.', 100000, ['radiologist', 'radiologists'], [1, 8, 25], [
      ['Study outran the approval', 'Contrast added after the approval was for without.', 1.6, 'Approval updated the same day the protocol changes.'],
      ['Component billing', 'Global billed when the hospital owns the scanner.', 1.1, 'Professional component (26) by site of service.'],
      ['Add-ons missed', 'Tomosynthesis done but 77063 left off.', 1.0, 'Add-ons checked against the technologist’s record.'],
      ['Combined studies split', 'Abdomen and pelvis billed as two CTs.', 0.9, 'Combined codes when both areas are scanned together.'],
      UNWORKED,
    ]),
    claim: claim(['One imaging day,', 'billed two ways.'], 'Three outpatient studies from one patient’s afternoon.', ['Outpatient imaging', 'Patient I. Scott', 'DOS 10/08/2026'], [
      ['MRI brain', ['70553', 'Denied · approval for 70551', 0], ['70553', 'Approval updated', 360], 'The radiologist added contrast. The approval was updated the same day to match.'],
      ['Mammogram', ['77067', '3D left off', 130], ['77067, 77063', '3D included', 180], 'Tomosynthesis was done, so its add-on goes on the claim.'],
      ['CT abdomen/pelvis', ['74160, 72193', 'Denied · use combined', 0], ['74177', 'Combined code', 340], 'Abdomen and pelvis scanned together have one combined code.'],
    ]),
  },
  pathology: {
    leak: leak('pathology', 'Pathology is paid per specimen, per stain and per antibody. Count by the case instead and most of the work goes unpaid.', 80000, ['pathologist', 'pathologists'], [1, 5, 12], [
      ['Specimens billed as one', 'Separately labeled specimens billed as one unit.', 2.0, 'One unit per separately identified specimen.'],
      ['IHC per slide', 'Antibodies billed per slide, or 88342 repeated.', 1.2, 'First antibody, then 88341 for each additional one, per specimen.'],
      ['Level from the history', 'Level picked from the clinical history, not the specimen.', 0.8, 'Level picked from the specimen type and what was examined.'],
      ['Special stains', 'Stains billed without a documented reason.', 0.7, 'Stains billed when the report says why they were needed.'],
      UNWORKED,
    ]),
    claim: claim(['One pathology case,', 'billed two ways.'], 'Three separately labeled GI biopsies, two antibodies on one, and an H. pylori stain.', ['GI biopsies, 3 jars', 'Case S26-04412', 'Received 10/07/2026'], [
      ['Surgical pathology', ['88305 × 1', 'One unit, 3 jars', 70], ['88305 × 3', 'One per specimen', 210], 'Three jars, separately labeled, are three specimens.', 'bad'],
      ['Immunohistochemistry', ['88342 × 2', 'Second denied', 95], ['88342, 88341', 'First + additional', 175], 'The second antibody on the same specimen is an add-on.', 'bad'],
      ['Special stain', ['88312', 'Denied · no reason', 0], ['88312', 'H. pylori, indicated', 75], 'The report says why the stain was needed: chronic active gastritis.'],
    ]),
  },
};
