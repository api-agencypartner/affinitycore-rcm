import { motion } from 'motion/react';
import { RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { Button, CountUp, Eyebrow, SplitWords } from '../components/ui';
import { ease, vp } from '../motion';
import { go, goAnchor } from '../router';

/** Whole card opens its service page; inner CTA links keep their own target. */
const cardLink = (slug: string) => ({
  role: 'link', tabIndex: 0, style: { cursor: 'pointer' },
  onClick: (e: { target: EventTarget }) => { if (!(e.target as Element).closest('a,button')) go(`/services/${slug}`); },
  onKeyDown: (e: { key: string }) => { if (e.key === 'Enter') go(`/services/${slug}`); },
});

const card = {
  hidden: { opacity: 0, y: 70, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: ease.out } },
};
/** child of a card: plays once the card is in view */
const inner = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.out, delay: 0.35 + delay } },
});

/** Text + arrow link at the foot of each bento card */
function Link({ children, to = '#assessment' }: { children: string; to?: string }) {
  return (
    <div className="svc__link">
      <button type="button" className="svc__go" onClick={() => (to.startsWith('/') ? go(to) : goAnchor(to.replace(/^#/, '')))}>
        <span>{children}</span><ArrowRight size={18} strokeWidth={2} />
      </button>
    </div>
  );
}

/* RCM — Visit → Claim → Paid orbit */
function Orbit() {
  return (
    <motion.div className="orbit" variants={inner()}>
      <div className="orbit__ring" />
      <div className="orbit__dash" />
      <motion.div className="orbit__core" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}><RefreshCw /></motion.div>
      <motion.div className="orbit__spin" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>
        {[['Visit', -128], ['Claim', -8], ['Paid', 108]].map(([l, a]) => (
          <span key={l} className="orbit__tag" style={{ transform: `rotate(${a}deg) translateX(10.4rem) rotate(${-(a as number)}deg)` }}>
            <motion.span animate={{ rotate: -360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}>{l}</motion.span>
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* Billing — claims processed bars */
const BARS = [21, 29, 25, 37, 34, 46, 44, 54, 51, 61];
function Billing() {
  return (
    <motion.div className="mini mini--billing" variants={inner()}>
      <div className="mini__row">
        <div><p className="mini__label">Claims processed</p><CountUp className="mini__big" prefix="$" value={428.5} decimals={1} suffix="k" /></div>
        <span className="mini__pill"><i className="dot" />+12.4%</span>
      </div>
      <div className="mini__bars">
        {BARS.map((h, i) => (
          <motion.i key={i} style={{ height: `${h / 10}rem` }} variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.7, ease: ease.out, delay: 0.5 + i * 0.06 } } }} />
        ))}
      </div>
    </motion.div>
  );
}

/* Coding — CPT rows tick from Reviewing → Ready */
function Coding() {
  const rows = [['99214', 'Ready', 98], ['93000', 'Reviewed', 96], ['36415', 'Ready', 99]] as const;
  return (
    <motion.div className="mini mini--coding" variants={inner()}>
      {rows.map(([code, st, pct], i) => (
        <motion.div key={code} className="mini__cpt" variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { delay: 0.5 + i * 0.15, duration: 0.6, ease: ease.out } } }}>
          <span className="mini__doc"><FileText /></span><b>{code}</b>
          <motion.small variants={{ hidden: { opacity: 0 }, show: { opacity: [0, 1, 0.3, 1], transition: { delay: 1 + i * 0.25, duration: 0.6 } } }}>{st}</motion.small>
          <CountUp className="mini__pct" value={pct} suffix="%" delay={0.7 + i * 0.15} />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* Peer-to-peer: a denied case, its packet ticking ready, then approved on the call */
function P2P() {
  const steps = ['Criteria mapped', 'Chart evidence', 'Physician brief'];
  return (
    <motion.div className="mini mini--ar mini--p2p" variants={inner()}>
      <div className="mini__row"><p className="mini__label">Peer-to-peer · 78452</p>
        <span className="mini__pill"><motion.i className="dot" animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />Booked</span></div>
      <div className="mini__p2p">
        {steps.map((t, i) => (
          <motion.div key={t} className="mini__p2pr" variants={{ hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { delay: 0.6 + i * 0.18, duration: 0.45 } } }}>
            <span className="mini__ck"><motion.svg viewBox="0 0 16 16" width="10" height="10"><motion.path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.75 + i * 0.18, duration: 0.3 } } }} /></motion.svg></span>{t}
          </motion.div>
        ))}
      </div>
      <motion.div className="mini__p2pok" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { delay: 1.4, duration: 0.5 } } }}>
        <span>Denied</span><b>Approved on the call</b>
      </motion.div>
    </motion.div>
  );
}

/* Denials — queue bars */
function Denials() {
  const rows = [['Eligibility', 24, 0.72], ['Coding', 15, 0.46], ['Authorization', 9, 0.28]] as const;
  return (
    <motion.div className="mini mini--denial" variants={inner()}>
      <div className="mini__row"><p className="mini__label">Denial queue</p>
        <span className="mini__pill"><motion.i className="dot" animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />On track</span></div>
      {rows.map(([l, n, w], i) => (
        <div key={l} className="mini__queue">
          <small>{l}</small>
          <span className="mini__track mini__track--thin"><motion.i variants={{ hidden: { scaleX: 0 }, show: { scaleX: w, transition: { duration: 1.1, ease: ease.out, delay: 0.6 + i * 0.15 } } }} /></span>
          <CountUp className="mini__n" value={n} delay={0.6 + i * 0.15} />
        </div>
      ))}
      {/* fills the lower half: what the queue turned into this month */}
      <motion.div className="mini__dfoot" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { delay: 1.1, duration: 0.5 } } }}>
        <div><small>Recovered this month</small><CountUp className="mini__dbig" prefix="$" value={48.2} decimals={1} suffix="k" delay={1.2} /></div>
        <div><small>Overturned</small><CountUp className="mini__dbig mini__dbig--p" value={86} suffix="%" delay={1.25} /></div>
        <svg className="mini__spark" viewBox="0 0 120 36" aria-hidden>
          <motion.path d="M2 30 L20 26 L38 28 L56 19 L74 21 L92 11 L118 5" fill="none" stroke="#6a41f9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 1.3, duration: 1.1, ease: ease.out } } }} />
          <motion.circle cx="118" cy="5" r="3.2" fill="#6a41f9" variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { delay: 2.3 } } }} />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section className="svc container" id="services">
      <div className="svc__head">
        <div>
          <Eyebrow>/ Services</Eyebrow>
          <SplitWords className="h-64" lines={['Every step of the', 'revenue cycle, covered.']} />
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.3 }}>
          <Button to="/services">View All</Button>
        </motion.div>
      </div>

      <motion.div className="svc__grid" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}>
        <motion.article className="svc-card svc-card--tall" {...cardLink('revenue-cycle-management')} variants={card} whileHover={{ y: -6 }}>
          <Orbit />
          <motion.div variants={inner(0.15)}><h3>Revenue Cycle Management</h3><p>One accountable team from patient registration to final payment, with fewer handoffs and fewer leaks.</p></motion.div>
          <Link>Get a free revenue assessment</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--billing" {...cardLink('medical-billing')} variants={card} whileHover={{ y: -6 }}>
          <Billing />
          <motion.div variants={inner(0.15)}><h3>Medical Billing</h3><p>Clean claims sent on time and payments posted daily, set up around your payers.</p></motion.div>
          <Link to="/services/medical-billing">Explore medical billing</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--coding" {...cardLink('medical-coding')} variants={card} whileHover={{ y: -6 }}>
          <Coding />
          <motion.div variants={inner(0.15)}><h3>Medical Coding</h3><p>Certified coders who capture the full value of every visit without adding audit risk.</p></motion.div>
          <Link to="/services/medical-coding">Explore medical coding</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--tall svc-card--ar" {...cardLink('peer-to-peer-review')} variants={card} whileHover={{ y: -6 }}>
          <P2P />
          <motion.div variants={inner(0.15)}><h3>Peer-to-Peer Review</h3><p>We book the call inside the payer’s window, build the case and brief your physician, so medical-necessity denials get turned around.</p></motion.div>
          <Link to="/services/peer-to-peer-review">See how we prep the call</Link>
        </motion.article>

        <motion.article className="svc-card svc-card--wide" {...cardLink('denial-management')} variants={card} whileHover={{ y: -6 }}>
          <div className="svc-card__copy">
            <motion.div variants={inner(0.1)}><h3>Denial Management</h3><p>We fix denied claims, find out why they were denied, and stop the same denials from coming back.</p></motion.div>
            <Link>Book a consultation call</Link>
          </div>
          <Denials />
        </motion.article>
      </motion.div>
    </section>
  );
}
