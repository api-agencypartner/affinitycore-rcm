/**
 * State landing page (/states/<slug>). Built to convert from local search and PPC:
 * hero with the ask and the phone, the state's own billing rules, specialties, services, local coverage,
 * proof, testimonials, what switching takes, then form, FAQ, CTA. Every section is readable without interaction.
 */
import { PageGuide, stateGuide } from '../components/PageGuide';
import { HeroCapture } from '../components/HeroCapture';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Building2, ChevronLeft, Clock, ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { TrustRow, MidCta, Switching } from '../components/ChildFolds';
import { Testimonials } from '../sections/Testimonials';
import { StateShape } from '../components/USMap';
import { Assessment } from '../sections/Assessment';
import { CTA, FAQ } from '../sections/Closing';
import { Proof } from './ServicesHub';
import { Link } from '../router';
import { ease, vp } from '../motion';
import { getState, STATES, type StatePage as State } from '../data/states';
import { getSpecialtyLite } from '../data/specialties';
import { SERVICES } from '../data/services';
import { setJsonLd, pageJsonLd } from '../data/seo';

const REGION: Record<string, string> = { texas: 'Texas|Dallas|Houston|Austin', florida: 'Florida|Miami|Tampa|Orlando', california: 'California|Los Angeles|San Diego' };

function Hero({ s }: { s: State }) {
  return (
    <section className="sp-hero stp-hero">
      <div className="sp-hero__copy">
        <motion.nav className="crumbs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} aria-label="Breadcrumb">
          <Link to="#states"><ChevronLeft size={16} /> States</Link><span>/</span><span>{s.name}</span>
        </motion.nav>
        <SplitWords as="h1" className="page-title" animateNow delay={0.3} stagger={0.05} lines={s.heroTitle} bold={[s.heroAccent]} />
        <motion.p className="page-sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.7 }}>{s.heroSub}</motion.p>
        <motion.div className="sh-hero__cta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.85 }}>
          <HeroCapture source={`state:${s.slug}`} />
        </motion.div>
        <TrustRow />
      </div>
      <motion.div className="stp-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: ease.out, delay: 0.25 }}>
        <div className="stp-card__map"><StateShape id={s.id} className="stp-shape" /></div>
        <p className="stp-card__k"><MapPin size={14} /> {s.name} billing, at a glance</p>
        <ul className="stp-card__chips">
          {s.chips.map(([k, v]) => <li key={k}><small>{k}</small><b>{v}</b></li>)}
        </ul>
        <p className="stp-card__cities">{s.cities.join(' · ')}</p>
      </motion.div>
    </section>
  );
}

function Rules({ s }: { s: State }) {
  return (
    <section className="stp-rules container">
      <div className="stp-head">
        <Eyebrow>{`/ ${s.name} rules we bill by`}</Eyebrow>
        <SplitWords className="h-56" lines={[`Your payers are in ${s.name}.`, 'So are their rules.']} stagger={0.04} />
      </div>
      <div className="stp-rules__grid">
        {s.facts.map((f, i) => (
          <motion.article key={f.k} className="stp-rule" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.7, ease: ease.out, delay: i * 0.08 }}>
            <span className="stp-rule__k">{f.k}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
            {f.src && <a href={f.src.href} target="_blank" rel="noopener noreferrer" className="stp-rule__src">{f.src.label} <ExternalLink size={12} /></a>}
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Specialties({ s }: { s: State }) {
  const sp = s.specialties.map(getSpecialtyLite).filter((x): x is NonNullable<typeof x> => !!x);
  return (
    <section className="stp-sp container">
      <div className="stp-head stp-head--row">
        <div>
          <Eyebrow>{`/ Specialties we bill in ${s.name}`}</Eyebrow>
          <SplitWords className="h-56" lines={[`What ${s.name} practices`, 'hand us most.']} stagger={0.04} />
        </div>
        <Link to="/specialties" className="text-link">All 23 specialties <ArrowRight size={18} /></Link>
      </div>
      <div className="stp-sp__grid">
        {sp.map((x, i) => {
          const Icon = x.icon;
          return (
            <motion.div key={x.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.6, ease: ease.out, delay: (i % 4) * 0.06 }}>
              <Link to={`/specialties/${x.slug}`} className="stp-sp__card">
                <span className="stp-sp__ic"><Icon size={22} /></span>
                <b>{x.name}</b>
                <p>{x.watch}</p>
                <span className="stp-sp__go">See {x.name.toLowerCase()} billing <ArrowUpRight size={16} /></span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Services({ s }: { s: State }) {
  return (
    <section className="stp-sv container">
      <div className="stp-sv__panel">
        <div className="stp-sv__head">
          <Eyebrow className="eyebrow--light">/ Services</Eyebrow>
          <h2 className="h-56">One team for the whole cycle, or just the part you need.</h2>
          <p>{`Most ${s.name} practices start with full revenue cycle management. Others hand us one stubborn piece, like denials, aged A/R or credentialing, and add more later.`}</p>
          <Button>Get a free revenue assessment</Button>
        </div>
        <ol className="stp-sv__list">
          {SERVICES.map((x, i) => (
            <li key={x.slug}>
              <Link to={`/services/${x.slug}`}>
                <small>{String(i + 1).padStart(2, '0')}</small>
                <span><b>{x.name}</b><em>{x.line}</em></span>
                <ArrowUpRight size={18} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Local coverage: who answers, when, and where. Live clock in the state's own time zone. */
function Coverage({ s }: { s: State }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(t); }, []);
  const time = new Intl.DateTimeFormat('en-US', { timeZone: s.tz, hour: 'numeric', minute: '2-digit' }).format(now);
  const day = new Intl.DateTimeFormat('en-US', { timeZone: s.tz, weekday: 'short' }).format(now);
  const hour = +new Intl.DateTimeFormat('en-US', { timeZone: s.tz, hour: 'numeric', hourCycle: 'h23' }).format(now);
  const open = !['Sat', 'Sun'].includes(day) && hour >= 8 && hour < 18;
  return (
    <section className="stp-cov container">
      <div className="stp-cov__copy">
        <Eyebrow>{`/ Local to ${s.name}`}</Eyebrow>
        <SplitWords className="h-56" lines={['A billing team that', 'keeps your hours.']} stagger={0.04} />
        <Reveal as="p" className="stp-cov__p">{s.local}</Reveal>
        <div className="stp-cov__cities">
          <small>{`Practices we serve across ${s.name}`}</small>
          <ul>{s.cities.map((c) => <li key={c}><MapPin size={14} />{c}</li>)}</ul>
        </div>
      </div>
      <motion.div className="stp-cov__card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.9, ease: ease.out }}>
        <div className="stp-cov__clock">
          <small>{`Right now in ${s.name}`}</small>
          <b>{time}</b>
          <span className={`stp-cov__status ${open ? 'is-open' : ''}`}><i />{open ? 'Our team is online' : 'We reply first thing next business day'}</span>
        </div>
        <dl className="stp-cov__dl">
          <div><dt><Clock size={16} /> Hours</dt><dd>{`Mon–Fri, 8 am – 6 pm ${s.tzName}`}</dd></div>
          <div><dt><Phone size={16} /> Call</dt><dd><a href="tel:+12148512698">214-851-2698</a></dd></div>
          <div><dt><Mail size={16} /> Email</dt><dd><a href="mailto:info@affinitycore.co">info@affinitycore.co</a></dd></div>
          <div><dt><Building2 size={16} /> Office</dt><dd>5830 Granite Pkwy, STE 100-219, Plano, TX 75024</dd></div>
        </dl>
        <p className="stp-cov__fine">Hours shown for illustration. [Confirm with Affinity Core]</p>
      </motion.div>
    </section>
  );
}

function OtherStates({ s }: { s: State }) {
  const others = STATES.filter((x) => x.slug !== s.slug);
  return (
    <nav className="ab container" aria-label="Other states">
      <span>Other states:</span>
      {others.map((x) => <Link key={x.slug} to={`/states/${x.slug}`}>{x.name}</Link>)}
      <Link to="#states" className="ab__all">All 50 states <ArrowRight size={16} /></Link>
    </nav>
  );
}

export function StatePage({ slug }: { slug: string }) {
  const s = getState(slug)!;
  const faqs = useMemo(() => s.faqs, [s]);
  useEffect(() => {
    document.title = `${s.seoTitle} · Affinity Core`;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    m.setAttribute('content', s.seoDescription);
    setJsonLd(pageJsonLd({ name: `Medical Billing Services in ${s.name}`, description: s.seoDescription, path: `/states/${s.slug}`, crumb: ['States', '/#states'], faqs }));
    return () => setJsonLd(null);
  }, [s, faqs]);
  return (
    <main className="page">
      <Hero s={s} />
      <Rules s={s} />
      <Specialties s={s} />
      <Services s={s} />
      <Coverage s={s} />
      <MidCta title={`Billing for a ${s.name} practice? Let’s look at your numbers.`} body={`We’ll review a month of your claims against ${s.name} payer rules and show you the dollars, line by line. Free, no contract.`} />
      <Proof region={REGION[s.slug]} />
      <Testimonials />
      <Switching what={`a ${s.name} practice’s billing`} />
      <OtherStates s={s} />
      <PageGuide g={stateGuide(s)} />
      <Assessment source={`state:${s.slug}`} />
      <FAQ items={faqs} eyebrow={`/ ${s.name} billing FAQs`} lines={[`What ${s.name} practices ask`, 'before switching billers.']} />
      <CTA eyebrow={s.closing.eyebrow} lines={s.closing.lines} />
    </main>
  );
}
