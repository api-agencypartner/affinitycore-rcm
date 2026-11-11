/**
 * Short content block right after a child-page hero (services, specialties, states, case studies).
 * A one-line lead + one paragraph + three quick facts. Plain HTML, so it is indexable and quotable.
 * Copy is built from each page's own data; swap in hand-written `intro` copy per page later (Strapi: page.intro).
 */
import { motion } from 'motion/react';
import { ease, vp } from '../motion';
import { STATIONS, SERVICES, type ServiceFull } from '../data/services';
import { SPECIALTIES, type SpecialtyFull } from '../data/specialties';
import { STATES } from '../data/states';
import { Link } from '../router';
import type { ReactNode } from 'react';
import type { StatePage } from '../data/states';
import { METRICS, type Case } from '../data/insights';

type Intro = { kicker: string; lead: string; body: string; more: string; self: string };
/* ---- In-copy links: each target is linked once per block, never to the current page ---- */
type Target = { re: RegExp; to: string };
const esc = (t: string) => t.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
let _t: Target[] | null = null;
const targets = (): Target[] => (_t ??= [
  ...SERVICES.map((x) => ({ to: `/services/${x.slug}`, re: new RegExp(`\\b(${[x.name, ...(SERVICE_ALIASES[x.slug] ?? [])].map(esc).join('|')})\\b`, 'i') })),
  ...SPECIALTIES.map((x) => ({ to: `/specialties/${x.slug}`, re: new RegExp(`\\b(${[x.name].map(esc).join('|')})(?= billing| practices| claims|\\b)`, 'i') })),
  ...STATES.map((x) => ({ to: `/states/${x.slug}`, re: new RegExp(`\\b(${esc(x.name)})(?= practices)`, 'i') })),
  { to: '#assessment', re: /\b(free review of one month of your claims|free revenue assessment)\b/i },
]);
function linkify(paras: string[], self: string): ReactNode[] {
  const used = new Set<string>([self]);
  return paras.map((text) => {
    const out: ReactNode[] = []; let rest = text; let k = 0;
    for (;;) {
      let best: { i: number; len: number; t: Target } | null = null;
      for (const t of targets()) {
        if (used.has(t.to)) continue;
        const m = t.re.exec(rest);
        if (m && (best === null || m.index < best.i)) best = { i: m.index, len: m[0].length, t };
      }
      if (!best) { out.push(rest); break; }
      out.push(rest.slice(0, best.i));
      // case-study pages have no assessment form on the page, so that link goes to Contact
      const to = best.t.to === '#assessment' && self.startsWith('/case-studies') ? '/contact' : best.t.to;
      out.push(<Link key={k++} to={to} className="ib__a">{rest.slice(best.i, best.i + best.len)}</Link>);
      used.add(best.t.to); rest = rest.slice(best.i + best.len);
    }
    return out;
  });
}

const clean = (t: string) => t.replace(/\s*\[Confirm with Affinity Core\]/g, '').trim();

export function IntroBlock({ d }: { d: Intro }) {
  return (
    <section className="ib container" aria-label={d.kicker.replace(/^\/\s*/, '')}>
      <motion.div className="ib__grid" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out }}>
        <p className="eyebrow ib__kick">{d.kicker}</p>
        <h2 className="ib__h">{d.lead}</h2>
        <div className="ib__copy">
          {linkify([d.body, d.more], d.self).map((p, k) => <p key={k}>{p}</p>)}
        </div>
      </motion.div>
    </section>
  );
}

const SERVICE_ALIASES: Record<string, string[]> = {
  'medical-coding': ['certified coders'], 'denial-management': ['denials appealed', 'denial rate', 'denied claim'],
  'credentialing': ['credentialing'], 'ar-recovery': ['days in A/R', 'A/R'], 'payment-posting': ['payment posting', 'underpayments'],
  'peer-to-peer-review': ['prior authorizations', 'prior auths', 'prior authorization'], 'medical-billing-audits': ['audit'],
  'revenue-cycle-management': ['whole cycle', 'revenue cycle management'], 'medical-billing': ['medical billing'], 'charge-entry': ['charge entry'],
};
const WHEN: Record<number, string> = { 1: 'before the visit', 2: 'right after the visit', 3: 'at claim submission', 4: 'when the payer responds', 5: 'during follow-up' };
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const lc = (t: string) => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

export const serviceIntro = (s: ServiceFull): Intro => {
  const st = STATIONS.find((x) => x.n === s.station);
  const scope = s.ticket.scope.map((x) => lc(clean(x)).replace(/\.$/, '')).slice(0, 4);
  return {
    self: `/services/${s.slug}`,
    kicker: `/ About ${s.name.toLowerCase()}`,
    lead: `${s.name} for US medical practices, run by one accountable team.`,
    body: `${clean(s.seoDescription)} ${clean(s.ticket.intro)}`,
    more: `${st ? `In the revenue cycle, ${s.name.toLowerCase()} happens ${WHEN[st.n]}, so every miss here shows up later as a denial or a late payment.` : 'It covers the whole revenue cycle, from eligibility to the last dollar collected.'} The work includes ${list(scope)}. A ${lc(clean(s.ticket.owner))} owns your account, and reporting comes ${lc(clean(s.ticket.reporting)).replace(' · ', ', covering ')}. You can hand us just this piece or the whole cycle, and it starts with a free review of one month of your claims.`,
  };
};

export const specialtyIntro = (s: SpecialtyFull): Intro => {
  const low = s.short && /^[A-Z/]+$/.test(s.short) ? s.short : s.name.toLowerCase();
  const rows = s.ledger.rows.slice(0, 3);
  const leaks = (s.leak?.leaks ?? []).slice(0, 3).map((l) => lc(l.label.replace(/\.$/, '')));
  return {
    self: `/specialties/${s.slug}`,
    kicker: `/ About ${s.name.toLowerCase()} billing`,
    lead: `${s.name} billing and coding, by coders who work ${low} claims every day.`,
    body: `${clean(s.seoDescription)} ${clean(s.ledger.intro)}`,
    more: `The codes we see most on ${low} claims are ${list(rows.map((r) => `${r.code} (${lc(r.name.split(',')[0])})`))}, and each one is checked against the documentation before it goes out. ${s.auth ? 'Prior authorizations are requested before the patient is scheduled and tracked against the 72-hour urgent / 7-day standard CMS clock.' : 'Any service that needs a prior authorization is checked before the visit.'} ${leaks.length ? `The biggest leaks we close for ${low} practices: ${list(leaks)}.` : ''} Every claim is coded by certified coders who bill ${low} every day, with a monthly report on denial rate, days in A/R and collections.`.replace(/\s+/g, ' ').trim(),
  };
};

export const stateIntro = (s: StatePage): Intro => {
  const f = (k: string) => s.facts.find((x) => x.k === k);
  const med = f('Medicare'), mcd = f('Medicaid'), pp0 = f('Prompt pay'), pp = pp0 && /\d/.test(pp0.title) ? pp0 : undefined;
  return {
    self: `/states/${s.slug}`,
    kicker: `/ Billing in ${s.name}`,
    lead: `Medical billing for ${s.name} practices, built around ${s.name} payers and rules.`,
    body: `${clean(s.seoDescription)}`,
    more: `In ${s.name}, Medicare Part B claims go to ${med ? med.title : 'the state’s Medicare contractor'}${mcd ? `, Medicaid runs through ${mcd.title}` : ''}${pp ? `, and state-regulated plans must pay clean claims within ${pp.title.toLowerCase()}` : `, and state-regulated commercial plans must pay clean claims within the deadline set by ${s.name} law`}. We work those rules on every claim and hold payers to the deadline when they are late. We bill for practices across ${list(s.cities)}, on ${s.tzName}, in specialties such as ${list(s.specialties.slice(0, 3).map((x) => SPECIALTIES.find((y) => y.slug === x)?.name).filter(Boolean) as string[])}.`,
  };
};

export const caseIntro = (c: Case): Intro => {
  const prof = (k: string) => c.profile.find(([x]) => x === k)?.[1];
  const where = (prof('Location') ?? 'Texas').split(',')[0];
  const fmt = (k: string, v: number) => (METRICS.find((m) => m.key === k)?.unit === '%' ? `${v}%` : `${v}`);
  const low1 = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
  const moved = METRICS.map((m, k) => `${k === 0 ? 'the ' : ''}${low1(m.label)}${k === 0 ? ' went' : ''} from ${fmt(m.key, c.before[m.key])} to ${fmt(m.key, c.after[m.key])}`);
  const sp = c.specialty.toLowerCase();
  const h = METRICS.find((m) => m.key === c.headline)!;
  const days = c.timeline[c.timeline.length - 1]?.day ?? 90;
  const svcs = c.services.map((x) => SERVICES.find((y) => y.slug === x)?.name).filter(Boolean) as string[];
  const sys = prof('Systems');
  return {
    self: `/case-studies/${c.slug}`,
    kicker: `/ About this case study`,
    lead: `How ${/^[aeiou]/.test(sp) ? 'an' : 'a'} ${sp} practice in ${where} moved its ${low1(h.label)} from ${fmt(h.key, c.before[h.key])} to ${fmt(h.key, c.after[h.key])}.`,
    body: `${c.tag}. When the practice came to us, three things were costing it money. ${c.challenge.join(' ')}`,
    more: `We took on ${list(svcs)}. The work came down to three moves: ${list(c.did.map((d) => lc(d.title)))}. Within ${days} days, ${list(moved)}. ${sys && /^existing/i.test(sys) ? `The practice kept its ${sys.replace(/,\s*unchanged$/i, '').replace(/^Existing/, 'existing')}, so nothing changed for the team.` : ''} Every engagement starts the same way, with a free review of one month of your claims.`.replace(/\s+/g, ' ').trim(),
  };
};
