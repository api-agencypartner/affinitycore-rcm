/**
 * Specialty page, straight-to-the-point version (v75).
 * Scan path: hero → what we handle → where the money leaks → proof → ask.
 * Everything that matters is readable without hovering or tapping; the only interaction kept is the
 * practice-size toggle on the leak list (and the FAQ).
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Phone, X } from 'lucide-react';
import { CountUp, Eyebrow, Reveal, SplitWords } from './ui';
import { Link, goAnchor } from '../router';
import { ease, vp } from '../motion';
import { getSpecialtyLite, type SpecialtyFull } from '../data/specialties';

const plain = (s: SpecialtyFull) => (s.short && /^[A-Z/]+$/.test(s.short) ? s.short : s.name.toLowerCase());

/* ================================================================== */
/* 1. What we handle: what we bill + what we run, no clicks needed     */
/* ================================================================== */
export function Handle({ s }: { s: SpecialtyFull }) {
  const p = plain(s);
  const run: [string, string, string][] = [
    ['Eligibility and benefits', 'Checked before every visit.', '/services/revenue-cycle-management'],
    ['Prior authorizations', s.auth ? 'Requested before scheduling, tracked against the 72-hour / 7-day CMS clock.' : 'Checked for every service that needs one.', '/services/revenue-cycle-management'],
    ['Certified coding', `Coders who bill ${p} every day.`, '/services/medical-coding'],
    ['Same-day claim submission', 'Scrubbed against each payer’s rules first.', '/services/medical-billing'],
    ['Denials and appeals', 'Worked by reason code, appealed before the deadline.', '/services/denial-management'],
    ['A/R follow-up', 'Aged claims chased until they pay or close.', '/services/ar-recovery'],
    ['Credentialing', 'New providers enrolled before their first visit.', '/services/credentialing'],
    ['Monthly report', 'Denial rate, days in A/R and collections, reviewed with you.', '/services/revenue-cycle-management'],
  ];
  return (
    <section className="hd container" id="handle">
      <div className="hd__head">
        <Eyebrow>/ What we handle</Eyebrow>
        <SplitWords className="h-56" lines={[`Everything ${p} billing needs,`, 'handled by one team.']} stagger={0.04} />
      </div>
      <div className="hd__grid">
        <motion.div className="hd__col" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out }}>
          <p className="hd__kicker">What we bill for {p}</p>
          <ul className="hd__bill">
            {s.ledger.rows.map((r) => <li key={r.code}><code>{r.code}</code><span>{r.name}</span></li>)}
          </ul>
        </motion.div>
        <motion.div className="hd__col hd__col--run" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 0.8, ease: ease.out, delay: 0.1 }}>
          <p className="hd__kicker">What we run for you</p>
          <ul className="hd__run">
            {run.map(([t, d, to]) => (
              <li key={t}><span className="hd__tick"><Check strokeWidth={3} /></span><Link to={to}><b>{t}</b><small>{d}</small></Link></li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. Where the money leaks: readable rows + practice-size toggle      */
/* ================================================================== */
export function LeakList({ s }: { s: SpecialtyFull }) {
  const L = s.leak!;
  const [size, setSize] = useState(L.sizes[1]);
  const expected = L.perProvider * size;
  const lost = L.leaks.reduce((t, l) => t + l.pct, 0);
  const max = Math.max(...L.leaks.map((l) => l.pct));
  const money = (pct: number) => Math.round((expected * pct) / 100);
  const usd = (n: number) => `$${n.toLocaleString('en-US')}`;
  return (
    <section className="ll container">
      <div className="ll__head">
        <div>
          <Eyebrow>{L.eyebrow}</Eyebrow>
          <SplitWords className="h-56" lines={L.lines} stagger={0.04} />
        </div>
        <Reveal as="p" className="ll__intro">{L.intro}</Reveal>
      </div>

      <motion.div className="ll__card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
        <div className="ll__top">
          <div className="ll__total">
            <b><CountUp value={money(lost)} prefix="$" duration={1.2} /></b>
            <span>leaks out every month for {size === 1 ? `a solo ${L.unit[0]}` : `${size} ${L.unit[1]}`}, about <strong>{usd(money(lost) * 12)}</strong> a year</span>
          </div>
          <div className="lf__seg" role="radiogroup" aria-label="Practice size">
            {L.sizes.map((n) => (
              <button key={n} role="radio" aria-checked={size === n} className={size === n ? 'is-on' : ''} onClick={() => setSize(n)}>
                {size === n && <motion.span layoutId={`ll-seg-${s.slug}`} className="lf__segbg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{n === 1 ? 'Solo' : <>{n}<em className="lf__unit"> {L.unit[1]}</em></>}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="ll__cols" aria-hidden><span>Where it leaks</span><span>How we stop it</span><span>Per month</span></div>
        <ol className="ll__rows">
          {L.leaks.map((l, i) => (
            <motion.li key={l.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, ease: ease.out, delay: i * 0.06 }}>
              <div className="ll__leak"><X className="ll__x" strokeWidth={3} aria-hidden /><p><b>{l.label}.</b> {l.cause}</p></div>
              <div className="ll__fix"><Check className="ll__ok" strokeWidth={3} aria-hidden /><p>{l.fix}</p></div>
              <div className="ll__amt">
                <b>−{usd(money(l.pct))}</b>
                <span className="ll__meter"><motion.i initial={{ scaleX: 0 }} whileInView={{ scaleX: l.pct / max }} viewport={{ once: true }} transition={{ duration: 0.8, ease: ease.out, delay: 0.2 + i * 0.06 }} /></span>
              </div>
            </motion.li>
          ))}
        </ol>
        <p className="lf__note">{L.note}{L.source && <> <a href={L.source.href} target="_blank" rel="noopener noreferrer">{L.source.label}</a>.</>}</p>
      </motion.div>
    </section>
  );
}

/* ================================================================== */
/* 3. "Often billed alongside": one line of links under the FAQ        */
/* ================================================================== */
export function AlsoBilled({ s }: { s: SpecialtyFull }) {
  const rel = s.related.map(getSpecialtyLite).filter(Boolean);
  if (!rel.length) return null;
  return (
    <nav className="ab container" aria-label="Related specialties">
      <span>Often billed alongside {s.name.toLowerCase()}:</span>
      {rel.map((r) => <Link key={r!.slug} to={`/specialties/${r!.slug}`}>{r!.name}</Link>)}
      <Link to="/specialties" className="ab__all">All specialties <ArrowRight size={16} /></Link>
    </nav>
  );
}

/* ================================================================== */
/* 4. Sticky mobile bar: call or start the assessment from anywhere    */
/* ================================================================== */
export function MobileBar() {
  return (
    <div className="mbar" role="region" aria-label="Quick contact">
      <a className="mbar__call" href="tel:+12148512698"><Phone size={18} /> Call</a>
      <button type="button" className="mbar__go" onClick={() => goAnchor('assessment')}>Free revenue assessment <ArrowRight size={18} /></button>
    </div>
  );
}
