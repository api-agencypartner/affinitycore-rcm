/**
 * Homepage fold: where we bill. A US map (all states served, three with their own page) beside short copy,
 * the three state links with each state's Medicare contractor, and a line for everyone else.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Eyebrow, Reveal, SplitWords } from '../components/ui';
import { USMap } from '../components/USMap';
import { STATES } from '../data/states';
import { Link } from '../router';
import { ease, vp } from '../motion';

export function StatesFold() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="stf container" id="states">
      <div className="stf__panel">
        <div className="stf__copy">
          <Eyebrow>/ States we serve</Eyebrow>
          <SplitWords className="h-56" lines={['Billing in all 50 states,', 'by people who know each one.']} stagger={0.04} />
          <Reveal as="p" className="stf__p">
            Every state has its own Medicare contractor, Medicaid plans and prompt-pay deadline. We bill practices across the US from our Plano, Texas office, in your time zone, with each state’s rules built into the work.
          </Reveal>
          <ul className="stf__list">
            {STATES.map((s, i) => (
              <motion.li key={s.slug} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.6, ease: ease.out, delay: 0.1 + i * 0.08 }}>
                <Link to={`/states/${s.slug}`} className={`stf__st ${active === s.id ? 'is-on' : ''}`}
                  onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(s.id)} onBlur={() => setActive(null)}>
                  <span className="stf__abbr">{s.abbr}</span>
                  <span className="stf__t"><b>{s.name}</b><small>{s.chips.map(([, v]) => v).join(' · ')}</small></span>
                  <ArrowRight className="stf__go" size={18} />
                </Link>
              </motion.li>
            ))}
          </ul>
          <p className="stf__more"><MapPin size={16} /> Practice in another state? We bill there too. <Link to="/contact" className="text-link">Talk to us <ArrowRight size={16} /></Link></p>
        </div>
        <motion.div className="stf__map" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
          <USMap active={active} onActive={setActive} />
          <div className="stf__legend">
            <span><i className="is-page" /> State page</span>
            <span><i /> We bill here</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
