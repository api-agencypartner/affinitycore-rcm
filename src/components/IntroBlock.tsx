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

type Intro = { kicker: string; lead: string; body: string; facts: [string, string][] };
const clean = (t: string) => t.replace(/\s*\[Confirm with Affinity Core\]/g, '').trim();

export function IntroBlock({ d }: { d: Intro }) {
  return (
    <section className="ib container" aria-label={d.kicker.replace(/^\/\s*/, '')}>
      <motion.div className="ib__grid" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out }}>
        <div className="ib__lead">
          <p className="eyebrow">{d.kicker}</p>
          <h2>{d.lead}</h2>
        </div>
        <div className="ib__copy">
          <p>{d.body}</p>
        </div>
      </motion.div>
    </section>
  );
}

export const serviceIntro = (s: ServiceFull): Intro => {
  const st = STATIONS.find((x) => x.n === s.station);
  return {
    kicker: `/ About ${s.name.toLowerCase()}`,
    lead: `${s.name} for US medical practices, run by one accountable team.`,
    body: `${clean(s.seoDescription)} ${clean(s.ticket.intro)}`,
    facts: [
      ['Where it sits', st ? `${st.name}: ${st.short.toLowerCase()}` : 'The whole revenue cycle'],
      ['Who owns it', clean(s.ticket.owner)],
      ['How you see results', clean(s.ticket.reporting)],
    ],
  };
};

export const specialtyIntro = (s: SpecialtyFull): Intro => {
  const low = s.short && /^[A-Z/]+$/.test(s.short) ? s.short : s.name.toLowerCase();
  const codes = s.ledger.rows.slice(0, 3).map((r) => r.code).join(' · ');
  return {
    kicker: `/ About ${s.name.toLowerCase()} billing`,
    lead: `${s.name} billing and coding, by coders who work ${low} claims every day.`,
    body: `${clean(s.seoDescription)} ${clean(s.ledger.intro)}`,
    facts: [
      ['Codes we see most', codes],
      ['Prior authorization', s.auth ? 'Requested before scheduling, tracked to the 72-hour / 7-day clock' : 'Checked for every service that needs one'],
      ['Who does the work', `Certified coders who bill ${low} every day`],
    ],
  };
};

export const stateIntro = (s: StatePage): Intro => ({
  kicker: `/ Billing in ${s.name}`,
  lead: `Medical billing for ${s.name} practices, built around ${s.name} payers and rules.`,
  body: `${clean(s.seoDescription)} ${clean(s.local)}`,
  facts: s.chips.map(([k, v]) => [k, v] as [string, string]),
});
