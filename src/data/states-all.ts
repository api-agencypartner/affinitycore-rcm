/**
 * The other 47 state landing pages, generated from one table so every page names its own
 * Medicare contractor (CMS MAC jurisdiction), Medicaid program, cities and time zone.
 *
 * Prompt pay: each state sets its own clean-claim deadline and interest rules. These pages describe the law in
 * general terms on purpose. Before running ads to a state, add its verified deadline (days electronic / paper,
 * interest) to `pp` below, the way Texas, Florida and California carry theirs in states.ts.
 */
import type { StatePage } from './states';
import { US_STATES } from './usMap';

type Mac = { name: string; j: string };
export const MACS: Record<string, Mac> = {
  JE: { name: 'Noridian Healthcare Solutions', j: 'JE' },
  JF: { name: 'Noridian Healthcare Solutions', j: 'JF' },
  JH: { name: 'Novitas Solutions', j: 'JH' },
  JL: { name: 'Novitas Solutions', j: 'JL' },
  JJ: { name: 'Palmetto GBA', j: 'JJ' },
  JM: { name: 'Palmetto GBA', j: 'JM' },
  JN: { name: 'First Coast Service Options', j: 'JN' },
  J5: { name: 'Wisconsin Physicians Service (WPS)', j: 'J5' },
  J8: { name: 'Wisconsin Physicians Service (WPS)', j: 'J8' },
  J6: { name: 'National Government Services (NGS)', j: 'J6' },
  JK: { name: 'National Government Services (NGS)', j: 'JK' },
  J15: { name: 'CGS Administrators', j: 'J15' },
};
const shortMac = (m: Mac) => `${(m.name.match(/\((\w+)\)/)?.[1]) ?? m.name.replace(' Healthcare Solutions', '').replace(' Solutions', '').replace(' Service Options', '').replace(' Administrators', '')} · ${m.j}`;

const TZ = {
  E: ['America/New_York', 'Eastern Time'], C: ['America/Chicago', 'Central Time'], M: ['America/Denver', 'Mountain Time'],
  AZ: ['America/Phoenix', 'Mountain Time (Arizona)'], P: ['America/Los_Angeles', 'Pacific Time'],
  AK: ['America/Anchorage', 'Alaska Time'], HI: ['Pacific/Honolulu', 'Hawaii Time'],
} as const;

// name, abbr, MAC, Medicaid program (title), Medicaid chip, tz, cities
type Row = [string, string, keyof typeof MACS, string, string, keyof typeof TZ, string[]];
const ROWS: Row[] = [
  ['Alabama', 'AL', 'JJ', 'Alabama Medicaid', 'Alabama Medicaid', 'C', ['Birmingham', 'Huntsville', 'Montgomery', 'Mobile', 'Tuscaloosa']],
  ['Alaska', 'AK', 'JF', 'Alaska Medicaid (DenaliCare)', 'DenaliCare', 'AK', ['Anchorage', 'Fairbanks', 'Juneau', 'Wasilla', 'Kenai']],
  ['Arizona', 'AZ', 'JF', 'AHCCCS (Arizona Medicaid)', 'AHCCCS plans', 'AZ', ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Flagstaff']],
  ['Arkansas', 'AR', 'JH', 'Arkansas Medicaid and ARHOME', 'ARHOME + PASSE', 'C', ['Little Rock', 'Fayetteville', 'Fort Smith', 'Jonesboro', 'Conway']],
  ['Colorado', 'CO', 'JH', 'Health First Colorado', 'Health First CO', 'M', ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder']],
  ['Connecticut', 'CT', 'JK', 'HUSKY Health', 'HUSKY Health', 'E', ['Hartford', 'New Haven', 'Stamford', 'Bridgeport', 'Waterbury']],
  ['Delaware', 'DE', 'JL', 'Diamond State Health Plan', 'DSHP plans', 'E', ['Wilmington', 'Dover', 'Newark', 'Lewes', 'Middletown']],
  ['Georgia', 'GA', 'JJ', 'Georgia Medicaid and Georgia Families', 'Georgia Families', 'E', ['Atlanta', 'Savannah', 'Augusta', 'Columbus', 'Macon']],
  ['Hawaii', 'HI', 'JE', 'Med-QUEST (QUEST Integration)', 'QUEST Integration', 'HI', ['Honolulu', 'Hilo', 'Kailua', 'Kahului', 'Kapolei']],
  ['Idaho', 'ID', 'JF', 'Idaho Medicaid', 'Idaho Medicaid', 'M', ['Boise', 'Meridian', 'Nampa', 'Idaho Falls', 'Coeur d’Alene']],
  ['Illinois', 'IL', 'J6', 'Illinois Medicaid and HealthChoice Illinois', 'HealthChoice IL', 'C', ['Chicago', 'Naperville', 'Rockford', 'Springfield', 'Peoria']],
  ['Indiana', 'IN', 'J8', 'Indiana Medicaid (HIP and Hoosier plans)', 'HIP + Hoosier plans', 'E', ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel']],
  ['Iowa', 'IA', 'J5', 'IA Health Link', 'IA Health Link', 'C', ['Des Moines', 'Cedar Rapids', 'Davenport', 'Iowa City', 'Sioux City']],
  ['Kansas', 'KS', 'J5', 'KanCare', 'KanCare', 'C', ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Lawrence']],
  ['Kentucky', 'KY', 'J15', 'Kentucky Medicaid managed care', 'KY Medicaid MCOs', 'E', ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington']],
  ['Louisiana', 'LA', 'JH', 'Healthy Louisiana', 'Healthy Louisiana', 'C', ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles']],
  ['Maine', 'ME', 'JK', 'MaineCare', 'MaineCare', 'E', ['Portland', 'Bangor', 'Lewiston', 'Augusta', 'Biddeford']],
  ['Maryland', 'MD', 'JL', 'Maryland Medicaid HealthChoice', 'HealthChoice', 'E', ['Baltimore', 'Bethesda', 'Columbia', 'Frederick', 'Annapolis']],
  ['Massachusetts', 'MA', 'JK', 'MassHealth', 'MassHealth', 'E', ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell']],
  ['Michigan', 'MI', 'J8', 'Michigan Medicaid and the Healthy Michigan Plan', 'Healthy Michigan', 'E', ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Lansing', 'Troy']],
  ['Minnesota', 'MN', 'J6', 'Minnesota Medical Assistance', 'Medical Assistance', 'C', ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington']],
  ['Mississippi', 'MS', 'JH', 'Mississippi Medicaid and MississippiCAN', 'MississippiCAN', 'C', ['Jackson', 'Gulfport', 'Hattiesburg', 'Southaven', 'Tupelo']],
  ['Missouri', 'MO', 'J5', 'MO HealthNet', 'MO HealthNet', 'C', ['Kansas City', 'St. Louis', 'Springfield', 'Columbia', 'Independence']],
  ['Montana', 'MT', 'JF', 'Montana Medicaid', 'Montana Medicaid', 'M', ['Billings', 'Missoula', 'Bozeman', 'Great Falls', 'Helena']],
  ['Nebraska', 'NE', 'J5', 'Nebraska Medicaid Heritage Health', 'Heritage Health', 'C', ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney']],
  ['Nevada', 'NV', 'JE', 'Nevada Medicaid', 'Nevada Medicaid', 'P', ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Carson City']],
  ['New Hampshire', 'NH', 'JK', 'New Hampshire Medicaid managed care', 'NH Medicaid MCOs', 'E', ['Manchester', 'Nashua', 'Concord', 'Portsmouth', 'Dover']],
  ['New Jersey', 'NJ', 'JL', 'NJ FamilyCare', 'NJ FamilyCare', 'E', ['Newark', 'Jersey City', 'Paterson', 'Trenton', 'Hackensack']],
  ['New Mexico', 'NM', 'JH', 'Turquoise Care (New Mexico Medicaid)', 'Turquoise Care', 'M', ['Albuquerque', 'Las Cruces', 'Santa Fe', 'Rio Rancho', 'Roswell']],
  ['New York', 'NY', 'JK', 'New York Medicaid managed care', 'NY Medicaid', 'E', ['New York City', 'Long Island', 'Buffalo', 'Rochester', 'Albany']],
  ['North Carolina', 'NC', 'JM', 'NC Medicaid Managed Care', 'NC Medicaid plans', 'E', ['Charlotte', 'Raleigh', 'Durham', 'Greensboro', 'Wilmington']],
  ['North Dakota', 'ND', 'JF', 'North Dakota Medicaid', 'ND Medicaid', 'C', ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo']],
  ['Ohio', 'OH', 'J15', 'Ohio Medicaid managed care', 'Ohio Medicaid MCOs', 'E', ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron']],
  ['Oklahoma', 'OK', 'JH', 'SoonerCare (Oklahoma Medicaid)', 'SoonerCare', 'C', ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Edmond']],
  ['Oregon', 'OR', 'JF', 'Oregon Health Plan', 'Oregon Health Plan', 'P', ['Portland', 'Salem', 'Eugene', 'Bend', 'Medford']],
  ['Pennsylvania', 'PA', 'JL', 'Pennsylvania Medical Assistance (HealthChoices)', 'HealthChoices', 'E', ['Philadelphia', 'Pittsburgh', 'Allentown', 'Harrisburg', 'Erie']],
  ['Rhode Island', 'RI', 'JK', 'Rhode Island Medicaid (RIte Care)', 'RIte Care', 'E', ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'Newport']],
  ['South Carolina', 'SC', 'JM', 'Healthy Connections (SC Medicaid)', 'Healthy Connections', 'E', ['Charleston', 'Columbia', 'Greenville', 'Myrtle Beach', 'Spartanburg']],
  ['South Dakota', 'SD', 'JF', 'South Dakota Medicaid', 'SD Medicaid', 'C', ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown']],
  ['Tennessee', 'TN', 'JJ', 'TennCare', 'TennCare', 'C', ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Franklin']],
  ['Utah', 'UT', 'JF', 'Utah Medicaid', 'Utah Medicaid', 'M', ['Salt Lake City', 'Provo', 'Ogden', 'St. George', 'Sandy']],
  ['Vermont', 'VT', 'JK', 'Green Mountain Care (Vermont Medicaid)', 'Green Mountain Care', 'E', ['Burlington', 'South Burlington', 'Rutland', 'Montpelier', 'Brattleboro']],
  ['Virginia', 'VA', 'JM', 'Cardinal Care (Virginia Medicaid)', 'Cardinal Care', 'E', ['Northern Virginia', 'Richmond', 'Virginia Beach', 'Norfolk', 'Roanoke']],
  ['Washington', 'WA', 'JF', 'Apple Health (Washington Medicaid)', 'Apple Health', 'P', ['Seattle', 'Spokane', 'Tacoma', 'Bellevue', 'Vancouver']],
  ['West Virginia', 'WV', 'JM', 'West Virginia Medicaid (Mountain Health Trust)', 'Mountain Health Trust', 'E', ['Charleston', 'Huntington', 'Morgantown', 'Parkersburg', 'Wheeling']],
  ['Wisconsin', 'WI', 'J6', 'Wisconsin Medicaid and BadgerCare Plus', 'BadgerCare Plus', 'C', ['Milwaukee', 'Madison', 'Green Bay', 'Appleton', 'Kenosha']],
  ['Wyoming', 'WY', 'JF', 'Wyoming Medicaid', 'Wyoming Medicaid', 'M', ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs']],
];

const SPECIALTY_SETS = [
  ['internal-medicine', 'cardiology', 'orthopedics', 'mental-health', 'pediatrics', 'urgent-care', 'dermatology', 'gastroenterology'],
  ['cardiology', 'internal-medicine', 'urgent-care', 'orthopedics', 'radiology', 'pediatrics', 'oncology', 'mental-health'],
  ['internal-medicine', 'mental-health', 'cardiology', 'dermatology', 'ophthalmology', 'orthopedics', 'pediatrics', 'urology'],
];
const MAC_SRC = { label: 'CMS, MACs by state', href: 'https://www.cms.gov/files/document/macs-state-pdf' };
const list = (xs: string[]) => `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`;

export const MORE_STATES: StatePage[] = ROWS.map(([name, abbr, macKey, mcd, mcdChip, tzKey, cities], i) => {
  const mac = MACS[macKey];
  const [tz, tzName] = TZ[tzKey];
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const id = US_STATES.find((s) => s.name === name)?.id ?? '';
  const macFull = `${mac.name}, Jurisdiction ${mac.j.replace(/^J/, '')}`;
  return {
    slug, id, name, abbr,
    seoTitle: `Medical Billing Services in ${name} | ${name} RCM Company`,
    seoDescription: `Medical billing and revenue cycle management for ${name} practices: ${mac.name.replace(/ \(.*\)/, '')} (${mac.j}) Medicare, ${mcd} and ${name} prompt-pay deadlines tracked on every claim.`,
    heroTitle: ['Medical billing for', `${name} practices.`], heroAccent: name,
    heroSub: `A US-based billing team that works ${mac.name.replace(/ \(.*\)/, '')} Medicare, ${mcd} and ${name}’s commercial payers, on ${tzName}. Every claim goes out built around the rules the payer actually applies in ${name}.`,
    chips: [['Medicare', shortMac(mac)], ['Medicaid', mcdChip], ['Prompt pay', 'State clock tracked']],
    facts: [
      { k: 'Medicare', title: macFull, body: `Every ${name} Medicare Part B claim goes to ${mac.name.replace(/ \(.*\)/, '')}. We work its edits, local coverage determinations and portal daily, so claims match what ${mac.j} actually pays for.`, src: MAC_SRC },
      { k: 'Medicaid', title: mcd, body: `${mcd} has its own eligibility checks, prior-auth list and timely-filing limits, and managed care plans, where they apply, add rules of their own. We verify coverage and the responsible plan before the visit.` },
      { k: 'Prompt pay', title: `${name} prompt-pay law`, body: `State-regulated commercial plans must pay or contest clean claims within the deadline set by ${name} law, and late payment can carry interest. We track every claim against that clock and follow up the day a payer goes past due.` },
      { k: 'Prior auth', title: 'Federal decision clock', body: 'Under CMS-0057-F, Medicare Advantage, Medicaid and CHIP plans must decide urgent prior-auth requests within 72 hours and standard ones within 7 calendar days. We request before scheduling and track each one against it.' },
    ],
    cities,
    specialties: SPECIALTY_SETS[i % SPECIALTY_SETS.length],
    faqs: [
      [`Do you work with ${name} practices?`, `Yes. We’re a US-based team that works inside your EHR and payer portals on ${tzName}, with a dedicated contact for your account.`],
      [`Which Medicare contractor handles ${name}?`, `${macFull}. We follow its local coverage determinations and use its portal for claim status, reopenings and appeals.`],
      [`Do you bill ${mcd}?`, `Yes. We confirm eligibility and the responsible plan before the visit, follow that plan’s authorization and timely-filing rules, and work every Medicaid denial.`],
      [`What happens when a ${name} payer pays late?`, `We track every claim against ${name}’s prompt-pay deadline for state-regulated plans and follow up the day it passes, requesting interest where the law allows it.`],
      [`Which ${name} cities do you serve?`, `Practices statewide, including ${list(cities)}. Everything runs remotely inside your systems, so location inside ${name} doesn’t change the service.`],
    ],
    tz, tzName,
    local: `Your ${name} account is handled on ${tzName} by US-based billers and coders who work ${mac.j} Medicare and ${mcdChip} every day.`,
    closing: { eyebrow: `/ Free ${name} revenue review`, lines: [`${name} payers, ${name} rules.`, 'See what you’re leaving unpaid.'] },
  } satisfies StatePage;
});

/** MAC jurisdiction per state slug, for grouping on the states hub. */
export const MAC_OF: Record<string, keyof typeof MACS> = {
  ...Object.fromEntries(ROWS.map((r) => [r[0].toLowerCase().replace(/\s+/g, '-'), r[2]])),
  texas: 'JH', florida: 'JN', california: 'JE',
};
export const REGION_OF: Record<string, 'Northeast' | 'Southeast' | 'Midwest' | 'Southwest' | 'West'> = Object.fromEntries(
  ([
    ['Northeast', 'CT DE ME MD MA NH NJ NY PA RI VT'],
    ['Southeast', 'AL AR FL GA KY LA MS NC SC TN VA WV'],
    ['Midwest', 'IL IN IA KS MI MN MO NE ND OH SD WI'],
    ['Southwest', 'AZ NM OK TX'],
    ['West', 'AK CA CO HI ID MT NV OR UT WA WY'],
  ] as const).flatMap(([r, ab]) => ab.split(' ').map((a) => [a, r])),
) as never;
