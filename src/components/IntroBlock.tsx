/**
 * Short content block right after a child-page hero (services, specialties, states).
 * A one-line lead + one paragraph + three quick facts. Plain HTML, so it is indexable and quotable.
 * Copy is built from each page's own data; swap in hand-written `intro` copy per page later (Strapi: page.intro).
 */
import { motion } from 'motion/react';
import { ease, vp } from '../motion';
import { STATIONS, type ServiceFull } from '../data/services';
import type { SpecialtyFull } from '../data/specialties';
import type { StatePage } from '../data/states';

type Intro = { kicker: string; lead: string; body: string; more: string };
const clean = (t: string) => t.replace(/\s*\[Confirm with Affinity Core\]/g, '').trim();

export function IntroBlock({ d }: { d: Intro }) {
  return (
    <section className="ib container" aria-label={d.kicker.replace(/^\/\s*/, '')}>
      <motion.div className="ib__grid" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out }}>
        <p className="eyebrow ib__kick">{d.kicker}</p>
        <h2 className="ib__h">{d.lead}</h2>
        <div className="ib__copy">
          <p>{d.body}</p>
          <p>{d.more}</p>
        </div>
      </motion.div>
    </section>
  );
}

const WHEN: Record<number, string> = { 1: 'before the visit', 2: 'right after the visit', 3: 'at claim submission', 4: 'when the payer responds', 5: 'during follow-up' };
const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const lc = (t: string) => (/^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t);

export const serviceIntro = (s: ServiceFull): Intro => {
  const st = STATIONS.find((x) => x.n === s.station);
  const scope = s.ticket.scope.map((x) => lc(clean(x)).replace(/\.$/, '')).slice(0, 4);
  return {
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
    kicker: `/ About ${s.name.toLowerCase()} billing`,
    lead: `${s.name} billing and coding, by coders who work ${low} claims every day.`,
    body: `${clean(s.seoDescription)} ${clean(s.ledger.intro)}`,
    more: `The codes we see most on ${low} claims are ${list(rows.map((r) => `${r.code} (${lc(r.name.split(',')[0])})`))}, and each one is checked against the documentation before it goes out. ${s.auth ? 'Prior authorizations are requested before the patient is scheduled and tracked against the 72-hour urgent / 7-day standard CMS clock.' : 'Any service that needs a prior authorization is checked before the visit.'} ${leaks.length ? `The biggest leaks we close for ${low} practices: ${list(leaks)}.` : ''} Every claim is coded by certified coders who bill ${low} every day, with a monthly report on denial rate, days in A/R and collections.`.replace(/\s+/g, ' ').trim(),
  };
};

export const stateIntro = (s: StatePage): Intro => {
  const f = (k: string) => s.facts.find((x) => x.k === k);
  const med = f('Medicare'), mcd = f('Medicaid'), pp = f('Prompt pay');
  return {
    kicker: `/ Billing in ${s.name}`,
    lead: `Medical billing for ${s.name} practices, built around ${s.name} payers and rules.`,
    body: `${clean(s.seoDescription)}`,
    more: `In ${s.name}, Medicare Part B claims go to ${med ? med.title : 'the state’s Medicare contractor'}${mcd ? `, Medicaid runs through ${mcd.title}` : ''}${pp ? `, and state-regulated plans must pay clean claims within ${pp.title.toLowerCase().replace(/^(\d)/, '$1')}` : ''}. We work those rules on every claim and hold payers to the deadline when they are late. We bill for practices across ${list(s.cities)}, on ${s.tzName}.`,
  };
};
