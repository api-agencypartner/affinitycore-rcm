'use client';
/**
 * /states: parent page for all 50 state landing pages.
 * Hero → interactive map + filterable state grid (map and cards highlight each other) →
 * "by Medicare contractor" content fold (SEO/AEO, internal links) → form → FAQ → CTA.
 */
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Search, X, MapPin } from 'lucide-react';
import { Eyebrow, SplitWords, Reveal } from '../components/ui';
import { HeroCapture } from '../components/HeroCapture';
import { USMap } from '../components/USMap';
import { CTA, FAQ } from '../sections/Closing';
import { Assessment } from '../sections/Assessment';
import { Link } from '../router';
import { STATES } from '../data/states';
import { MACS, MAC_OF, REGION_OF } from '../data/states-all';
import { ease, vp } from '../motion';

/** Cards shown per step on small screens (0 = no limit on desktop). */
function useStep() {
  const get = () => (typeof window === 'undefined' ? 0 : window.innerWidth <= 767 ? 8 : window.innerWidth <= 1279 ? 12 : 0);
  const [n, setN] = useState(get);
  useEffect(() => { const f = () => setN(get()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return n;
}

const REGIONS = ['All', 'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West'] as const;
type Region = (typeof REGIONS)[number];

function Hero() {
  return (
    <section className="sth">
      <div className="sth__copy">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}>/ States we serve</motion.p>
        <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={['Medical billing', 'in all 50 states.']} bold={['50']} />
        <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.8 }}>
          Every state has its own Medicare contractor, Medicaid program and prompt-pay deadline. Pick yours to see the rules we bill by there, or start with a free review of your claims.
        </motion.p>
        <motion.div className="sh-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.95 }}>
          <HeroCapture source="states" />
        </motion.div>
      </div>
      <motion.dl className="sth__stats" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: ease.out, delay: 0.6 }}>
        <div><dt>50</dt><dd>states with their own billing page</dd></div>
        <div><dt>12</dt><dd>Medicare jurisdictions we work every day</dd></div>
        <div><dt>1</dt><dd>US-based team, in your time zone</dd></div>
      </motion.dl>
    </section>
  );
}

function Finder() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState<Region>('All');
  const [hot, setHot] = useState<string | null>(null);
  // Phones/tablets: show a short list first; search and region tabs narrow it, "Show more" reveals the rest
  const step = useStep();
  const [limit, setLimit] = useState<number | null>(null);
  useEffect(() => { setLimit(null); }, [q, region]);
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return STATES.filter((s) => (region === 'All' || REGION_OF[s.abbr] === region) &&
      (!t || s.name.toLowerCase().includes(t) || s.abbr.toLowerCase() === t || s.cities.some((c) => c.toLowerCase().includes(t))));
  }, [q, region]);
  return (
    <section className="stfd container" id="all-states">
      <div className="stfd__head">
        <div>
          <Eyebrow>/ Find your state</Eyebrow>
          <SplitWords className="h-56" lines={['Hover a state,', 'click to open its page.']} stagger={0.04} />
        </div>
        <div className="stfd__tools">
          <label className="stfd__search">
            <Search size={18} aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a state or city" aria-label="Search a state or city" />
            {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search"><X size={16} /></button>}
          </label>
          <div className="stfd__tabs" role="tablist" aria-label="Filter by region">
            {REGIONS.map((r) => (
              <button key={r} type="button" role="tab" aria-selected={region === r} className={region === r ? 'is-on' : ''} onClick={() => setRegion(r)}>
                {region === r && <motion.i layoutId="stfd-tab" className="stfd__tab-hl" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                <span>{r}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.div className="stfd__map" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <USMap active={hot} onActive={setHot} />
      </motion.div>

      <motion.ul className="stfd__grid" layout>
        <AnimatePresence initial={false}>
          {shown.slice(0, step ? (limit ?? step) : undefined).map((s) => (
            <motion.li key={s.slug} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, ease: ease.out }}>
              <Link to={`/states/${s.slug}`} className={`stfd__card ${hot === s.id ? 'is-on' : ''}`}
                onMouseEnter={() => setHot(s.id)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(s.id)} onBlur={() => setHot(null)}>
                <span className="stfd__abbr">{s.abbr}</span>
                <span className="stfd__t"><b>{s.name}</b><small>Medicare {s.chips[0][1]} · {s.chips[1][1]}</small></span>
                <ArrowRight className="stfd__go" size={16} />
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {step > 0 && shown.length > (limit ?? step) && (
        <div className="stfd__more">
          <p>Showing {limit ?? step} of {shown.length} states</p>
          <div>
            <button type="button" className="stfd__more-btn" onClick={() => setLimit((limit ?? step) + step)}>Show {Math.min(step, shown.length - (limit ?? step))} more</button>
            <button type="button" className="stfd__all-btn" onClick={() => setLimit(shown.length)}>Show all</button>
          </div>
        </div>
      )}
      {shown.length === 0 && <p className="stfd__empty"><MapPin size={16} /> No state matches “{q}”. We bill in all 50, so <Link to="#assessment" className="text-link">tell us where you are <ArrowRight size={14} /></Link></p>}
    </section>
  );
}

/** SEO/AEO: states grouped by Medicare Administrative Contractor, every state linked. */
function ByContractor() {
  const groups = useMemo(() => {
    const m = new Map<string, typeof STATES>();
    STATES.forEach((s) => { const k = MAC_OF[s.slug]; if (!m.has(k)) m.set(k, []); m.get(k)!.push(s); });
    return [...m.entries()].sort((a, b) => MACS[a[0]].name.localeCompare(MACS[b[0]].name) || a[0].localeCompare(b[0]));
  }, []);
  return (
    <section className="stmac container" aria-labelledby="stmac-t">
      <div className="stmac__intro">
        <Eyebrow>/ By Medicare contractor</Eyebrow>
        <h2 id="stmac-t" className="h-56">Who processes Medicare claims in your state?</h2>
        <Reveal as="p" className="stmac__p">
          Medicare Part B claims are processed by a Medicare Administrative Contractor (MAC) assigned to each state. Each MAC publishes its own local coverage determinations, edits and portal, so the same claim can pass in one state and deny in another. These are the jurisdictions we work, and the states in each.
        </Reveal>
      </div>
      <div className="stmac__grid">
        {groups.map(([k, list]) => (
          <div key={k} className="stmac__card">
            <p className="stmac__j">Jurisdiction {MACS[k].j.replace(/^J/, '')}</p>
            <h3>{MACS[k].name}</h3>
            <p className="stmac__states">{list.map((s, i) => <span key={s.slug}>{i > 0 && ', '}<Link to={`/states/${s.slug}`}>{s.name}</Link></span>)}</p>
          </div>
        ))}
      </div>
      <p className="stmac__src">Source: <a href="https://www.cms.gov/files/document/macs-state-pdf" target="_blank" rel="noopener noreferrer">CMS, Medicare Administrative Contractors by state</a>.</p>
    </section>
  );
}

const FAQS = [
  ['Do you really bill in all 50 states?', 'Yes. Billing and coding run inside your EHR and payer portals, so we can work any state. What changes by state is the payer rulebook: the Medicare contractor, the Medicaid program and the prompt-pay law, and each state page covers those.'],
  ['Why does the state matter for medical billing?', 'Medicare Part B claims go to a regional contractor with its own coverage rules, Medicaid is run by each state with its own plans and authorization lists, and commercial payment deadlines are set by state law. Billing that ignores those differences gets more denials and slower payments.'],
  ['Do you work in my time zone?', 'Yes. Your account is handled on your local time, from Eastern to Hawaii time, so questions get answered the same business day.'],
  ['Where is Affinity Core based?', 'Our office is in Plano, Texas. Our billers and coders are US-based and work remotely inside your systems wherever your practice is.'],
  ['Can you bill for a group with locations in several states?', 'Yes. Each location’s claims go out under the rules of its own state and Medicare jurisdiction, and you get one report across all of them.'],
];

export function StatesHub() {
  useEffect(() => {
    document.title = 'Medical Billing Services in All 50 States · Affinity Core';
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', 'Medical billing and revenue cycle management in all 50 states. Find your state’s Medicare contractor, Medicaid program and prompt-pay rules, and get a free revenue review.');
  }, []);
  return (
    <main className="page">
      <Hero />
      <Finder />
      <ByContractor />
      <Assessment source="states-hub" />
      <FAQ items={FAQS} eyebrow="/ State billing FAQs" lines={['What practices ask', 'about billing by state.']} />
      <CTA eyebrow="/ Free revenue review" lines={['Your state’s rules,', 'your numbers.']} />
    </main>
  );
}
