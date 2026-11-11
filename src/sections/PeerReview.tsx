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
    <motion.div ref={ref} className="pp__card [position:relative] [padding:3.2rem] [border-radius:2.8rem] [background:#fff] [border:1px_solid_#ece8fa] [box-shadow:0_3rem_8rem_-2rem_rgba(57,_28,_160,_0.18)] [@media(max-width:_640px)]:[padding:2.2rem_1.8rem]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={vp} transition={{ duration: 1, ease: ease.out }}>
      <div className="pp__top [display:flex] [justify-content:space-between] [align-items:center] [gap:1.2rem] [flex-wrap:wrap]">
        <span className="pp__live [display:inline-flex] [align-items:center] [gap:0.8rem] [padding:0.6rem_1.2rem] [border-radius:2rem] [background:#f1edff] [color:var(--purple)] [font-weight:500] [font-size:1.4rem]"><PhoneCall size={16} /> Peer-to-peer · booked</span>
        <span className="pp__when [display:inline-flex] [align-items:center] [gap:0.6rem] [font-family:var(--f-mono)] [font-size:1.25rem] [color:#6b6f7c]"><Clock size={14} /> Tue 2:15 PM · 10 min</span>
      </div>
      <div className="pp__case [display:flex] [gap:1.4rem] [align-items:flex-start] [margin-top:2.4rem] [padding-bottom:2rem] [border-bottom:1px_solid_#f0edf8] [&_code]:[flex:none] [&_code]:[padding:0.4rem_1rem] [&_code]:[border-radius:0.8rem] [&_code]:[background:#f4f0ff] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.4rem] [&_code]:[color:var(--purple)] [&_b]:[display:block] [&_b]:[font-weight:500] [&_b]:[font-size:1.8rem] [&_b]:[color:var(--ink-2)] [&_small]:[display:block] [&_small]:[margin-top:0.3rem] [&_small]:[font-size:1.4rem] [&_small]:[color:#6b6f7c]">
        <code>78452</code>
        <div><b>SPECT perfusion, rest + stress</b><small>Denied as not medically necessary · Sample Health Plan</small></div>
      </div>
      <div className="pp__who [display:grid] [grid-template-columns:minmax(0,_1fr)_6rem_minmax(0,_1fr)] [align-items:center] [gap:1.2rem] [margin-top:2rem] [&_small]:[display:block] [&_small]:[font-family:var(--f-mono)] [&_small]:[font-size:1.1rem] [&_small]:[letter-spacing:0.05em] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_b]:[display:block] [&_b]:[margin-top:0.4rem] [&_b]:[font-weight:500] [&_b]:[font-size:1.6rem] [&_b]:[color:var(--ink-2)] [&>div:last-child]:[text-align:right] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)_3rem_minmax(0,_1fr)]">
        <div><small>Your physician</small><b>Ordering cardiologist</b></div>
        <span className="pp__line [position:relative] [height:1px] [background:repeating-linear-gradient(90deg,_#cfc6f3_0_6px,_transparent_6px_11px)] [&_i]:[position:absolute] [&_i]:[left:50%] [&_i]:[top:50%] [&_i]:[width:1rem] [&_i]:[height:1rem] [&_i]:[margin:-0.5rem_0_0_-0.5rem] [&_i]:[border-radius:50%] [&_i]:[background:var(--purple)] [&_i]:[box-shadow:0_0_0_0.5rem_rgba(106,_65,_249,_0.14)]" aria-hidden><i /></span>
        <div><small>Plan reviewer</small><b>Same specialty requested</b></div>
      </div>
      <p className="pp__k [margin-top:2.4rem] [font-family:var(--f-mono)] [font-size:1.2rem] [letter-spacing:0.08em] [text-transform:uppercase] [color:var(--purple)]">Case packet</p>
      <ul className="pp__list [display:flex] [flex-direction:column] [gap:1rem] [margin-top:1.2rem] [&_li]:[display:flex] [&_li]:[align-items:center] [&_li]:[gap:1.2rem] [&_li]:[font-size:1.6rem] [&_li]:[color:#8a8ea0] [&_li]:[transition:color_0.4s]">
        {PACKET.map((t, i) => (
          <li key={t} className={n > i ? String.raw`is-done [.pp\_\_list_li&]:[color:var(--ink-2)] [.pa-art\_\_steps_li&]:[color:#6a41f9]` : ''}>
            <span className="pp__tick [flex:none] [width:2.2rem] [height:2.2rem] [border-radius:50%] [display:grid] [place-items:center] [border:1.5px_solid_#d9d1fb] [color:#fff] [transition:background_0.3s,_border-color_0.3s] [.pp\_\_list_li.is-done_&]:[background:var(--purple)] [.pp\_\_list_li.is-done_&]:[border-color:var(--purple)]">{n > i && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 20 }}><Check size={13} strokeWidth={3} /></motion.span>}</span>
            {t}
          </li>
        ))}
      </ul>
      <div className={String.raw`pp__result [display:flex] [justify-content:space-between] [align-items:center] [gap:1.2rem] [margin-top:2.4rem] [padding:1.4rem_1.8rem] [border-radius:1.6rem] [background:#f6f3ff] [transition:background_0.4s] [&_span]:[font-family:var(--f-mono)] [&_span]:[font-size:1.15rem] [&_span]:[letter-spacing:0.06em] [&_span]:[text-transform:uppercase] [&_span]:[color:#8a8ea0] [&_b]:[font-weight:600] [&_b]:[font-size:1.6rem] [&_b]:[color:#6b6f7c] [&_b]:[text-align:right] [&.is-ok]:[background:var(--grad-x)] [&.is-ok_span]:[color:rgba(255,_255,_255,_0.8)] [&.is-ok_b]:[color:#fff] [@media(max-width:_640px)]:[flex-direction:column] [@media(max-width:_640px)]:[align-items:flex-start] [@media(max-width:_640px)]:[&_b]:[text-align:left] ${approved ? String.raw`is-ok [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[background:#f6f3ff] [@media(max-width:_767px)]:[.lk\_\_mob_li&]:[border-color:#ddd3ff] [.ecg\_\_rows_em&]:[color:var(--purple)] [.ecg\_\_rows_em&]:[background:#ebe5ff] [.se\_\_dots_i&]:[background:#b7a3ff]` : ''}`} aria-live="polite">
        <span>Decision</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.b key={approved ? 'ok' : 'no'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            {approved ? 'Approved on the call · auth on file' : 'Denied · call pending'}
          </motion.b>
        </AnimatePresence>
      </div>
      <p className="pp__note [position:absolute] [right:3.2rem] [bottom:-2.8rem] [font-family:var(--f-mono)] [font-size:1.1rem] [color:#a29cbc]">Sample case</p>
    </motion.div>
  );
}

export function PeerReview() {
  return (
    <section className="pp container [padding-inline:var(--gutter)] [@media(max-width:_1279px)]:[padding-inline:2rem] [padding-top:14rem] [@media(max-width:_1279px)]:[padding-top:10rem]" id="peer-to-peer">
      <div className="pp__panel [display:grid] [grid-template-columns:minmax(0,_1.05fr)_minmax(0,_0.95fr)] [gap:6.4rem] [align-items:center] [padding:7.2rem] [border-radius:4rem] [background:linear-gradient(160deg,_#f6f2ff_0%,_#fbfaff_60%,_#f1ecff_100%)] [border:1px_solid_#eee9ff] [@media(max-width:_1279px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_1279px)]:[gap:4.8rem] [@media(max-width:_1279px)]:[padding:4.8rem_3.2rem_5.6rem] [@media(max-width:_1279px)]:[border-radius:3.2rem] [@media(max-width:_640px)]:[padding:3.2rem_1.8rem_4.8rem]">
        <div className="pp__copy [display:flex] [flex-direction:column] [gap:1.6rem] [min-width:0]">
          <Eyebrow>/ Peer-to-peer review</Eyebrow>
          <SplitWords className="h-56 [font-weight:500] [font-size:5.6rem] [line-height:1.08] [letter-spacing:-0.12rem] [color:var(--ink-2)] [text-wrap:balance] [@media(max-width:_1279px)]:[font-size:3.8rem] [@media(max-width:_640px)]:[font-size:3.4rem]" lines={['A denial isn’t final', 'until the call is over.']} stagger={0.04} />
          <Reveal as="p" className="pp__p [font-size:1.8rem] [line-height:1.6] [color:#4a4f63] [max-width:60rem]">
            When a payer says a test or procedure isn’t medically necessary, your physician often gets one short call with the plan’s reviewer. We book it inside the payer’s window, build the case, brief your physician in five minutes, and file the appeal if the call doesn’t turn it around.
          </Reveal>
          <ul className="pp__stats [display:grid] [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:2.4rem] [margin-top:1.6rem] [padding-top:2.4rem] [border-top:1px_solid_#e6dfff] [&_li]:[display:flex] [&_li]:[flex-direction:column] [&_li]:[gap:0.6rem] [&_li]:[min-width:0] [&_b]:[font-weight:600] [&_b]:[font-size:4rem] [&_b]:[line-height:1] [&_b]:[letter-spacing:-0.1rem] [&_b]:[color:var(--purple)] [&_b]:[font-variant-numeric:tabular-nums] [&_span]:[font-size:1.5rem] [&_span]:[line-height:1.45] [&_span]:[color:#4a4f63] [&_a]:[font-family:var(--f-mono)] [&_a]:[font-size:1.15rem] [&_a]:[letter-spacing:0.04em] [&_a]:[color:#8a8ea0] [&_a]:[text-decoration:underline] [&_a]:[text-underline-offset:0.3em] [@media(max-width:_640px)]:[grid-template-columns:minmax(0,_1fr)] [@media(max-width:_640px)]:[gap:1.6rem] [@media(max-width:_640px)]:[&_li]:[display:grid] [@media(max-width:_640px)]:[&_li]:[grid-template-columns:11.5rem_minmax(0,_1fr)] [@media(max-width:_640px)]:[&_li]:[column-gap:1.2rem] [@media(max-width:_640px)]:[&_b]:[grid-row:span_2] [@media(max-width:_640px)]:[&_b]:[font-size:3.2rem]">
            {STATS.map(([v, l, src, href]) => (
              <li key={v}><b>{v}</b><span>{l}</span><a href={href} target="_blank" rel="noopener noreferrer">{src}</a></li>
            ))}
          </ul>
          <div className="pp__cta [display:flex] [align-items:center] [flex-wrap:wrap] [gap:2.4rem] [margin-top:2.4rem]">
            <Button to="/services/peer-to-peer-review">See how we prep the call</Button>
            <Link to="/contact" className="text-link [display:inline-flex] [align-items:center] [gap:0.8rem] [font-weight:500] [font-size:1.8rem] [color:var(--purple)] [&_svg]:[transition:transform_0.4s_cubic-bezier(.16,1,.3,1)] [&:hover_svg]:[transform:translateX(0.5rem)] [.est\_\_carried_&]:[margin-top:0.6rem] [.est\_\_carried_&]:[font-size:1.5rem] [.est\_\_carried_&]:[color:#fff] [.est\_\_carried_&]:[text-decoration:underline] [.est\_\_carried_&]:[text-underline-offset:0.3em] [.est\_\_carried_&]:[opacity:0.85]">Send us a denial <ArrowRight size={18} /></Link>
          </div>
        </div>
        <CallCard />
      </div>
    </section>
  );
}
