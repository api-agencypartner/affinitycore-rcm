/**
 * Homepage fold: peer-to-peer review support.
 * Copy on the left with three sourced numbers; on the right a call card whose case packet ticks itself
 * ready, then the decision flips from Denied to Approved (once, when the fold comes into view).
 * Sources: AMA prior authorization physician survey (2024); KFF, Medicare Advantage prior authorization in 2023.
 */
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { ArrowRight, Check, Clock, PhoneCall } from 'lucide-react';
import { Button, Eyebrow, Reveal, SplitWords } from '../components/ui';
import { Link } from '../router';
import { ease, vp } from '../motion';

const PACKET = ['Denial criteria mapped to the chart', 'Failed conservative care documented', 'Specialty guideline attached', 'One-page brief sent to the physician'];
const STATS: [string, string, string, string][] = [
  ['61%', 'of physicians are at least sometimes pushed into a peer-to-peer to get care approved', 'AMA, 2024', 'https://www.ama-assn.org/practice-management/prior-authorization/just-15-doctors-say-prior-auth-peers-deserve-title'],
  ['16%', 'say the plan’s “peer” often or always has the right qualifications', 'AMA, 2024', 'https://www.ama-assn.org/practice-management/prior-authorization/fixing-prior-auth-give-doctors-true-peer-talk-stat'],
  ['81.7%', 'of appealed Medicare Advantage prior-auth denials were overturned in 2023', 'KFF, 2025', 'https://www.aha.org/news/headline/2025-01-29-kff-ma-insurers-made-nearly-50-million-prior-authorization-determinations-2023'],
];

function CallCard() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.45 });
  const [n, setN] = useState(0); // packet items ready
  useEffect(() => {
    if (!on) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(PACKET.length + 1); return; }
    let k = 0;
    const t = window.setInterval(() => { k += 1; setN(k); if (k > PACKET.length) window.clearInterval(t); }, 650);
    return () => window.clearInterval(t);
  }, [on]);
  const approved = n > PACKET.length;
  return (
    <motion.div ref={ref} className="pp__card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
      <div className="pp__top">
        <span className="pp__live"><PhoneCall size={16} /> Peer-to-peer · booked</span>
        <span className="pp__when"><Clock size={14} /> Tue 2:15 PM · 10 min</span>
      </div>
      <div className="pp__case">
        <code>78452</code>
        <div><b>SPECT perfusion, rest + stress</b><small>Denied as not medically necessary · Sample Health Plan</small></div>
      </div>
      <div className="pp__who">
        <div><small>Your physician</small><b>Ordering cardiologist</b></div>
        <span className="pp__line" aria-hidden><i /></span>
        <div><small>Plan reviewer</small><b>Same specialty requested</b></div>
      </div>
      <p className="pp__k">Case packet</p>
      <ul className="pp__list">
        {PACKET.map((t, i) => (
          <li key={t} className={n > i ? 'is-done' : ''}>
            <span className="pp__tick">{n > i && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 20 }}><Check size={13} strokeWidth={3} /></motion.span>}</span>
            {t}
          </li>
        ))}
      </ul>
      <div className={`pp__result ${approved ? 'is-ok' : ''}`} aria-live="polite">
        <span>Decision</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.b key={approved ? 'ok' : 'no'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {approved ? 'Approved on the call · auth on file' : 'Denied · call pending'}
          </motion.b>
        </AnimatePresence>
      </div>
      <p className="pp__note">Sample case</p>
    </motion.div>
  );
}

export function PeerReview() {
  return (
    <section className="pp container" id="peer-to-peer">
      <div className="pp__panel">
        <div className="pp__copy">
          <Eyebrow>/ Peer-to-peer review</Eyebrow>
          <SplitWords className="h-56" lines={['A denial isn’t final', 'until the call is over.']} stagger={0.04} />
          <Reveal as="p" className="pp__p">
            When a payer says a test or procedure isn’t medically necessary, your physician often gets one short call with the plan’s reviewer. We book it inside the payer’s window, build the case, brief your physician in five minutes, and file the appeal if the call doesn’t turn it around.
          </Reveal>
          <ul className="pp__stats">
            {STATS.map(([v, l, src, href]) => (
              <li key={v}><b>{v}</b><span>{l}</span><a href={href} target="_blank" rel="noopener noreferrer">{src}</a></li>
            ))}
          </ul>
          <div className="pp__cta">
            <Button to="/services/peer-to-peer-review">See how we prep the call</Button>
            <Link to="/contact" className="text-link">Send us a denial <ArrowRight size={18} /></Link>
          </div>
        </div>
        <CallCard />
      </div>
    </section>
  );
}
