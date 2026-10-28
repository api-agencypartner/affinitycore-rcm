import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Check } from 'lucide-react';
import { Eyebrow, SplitWords } from '../components/ui';
import { ease } from '../motion';

const STEPS = [
  { n: '01', title: 'Before the visit', head: 'Catch problems before they start.', items: ['Insurance eligibility verified', 'Prior authorizations secured', 'Provider credentials current'] },
  { n: '02', title: 'From care to claim', head: 'Code it right the first time.', items: ['Documentation reviewed', 'Specialty-certified coding', 'Claim scrubbed before submission'] },
  { n: '03', title: 'Claim to cash', head: 'Get every dollar you earned.', items: ['Payments posted and reconciled', 'Denials appealed and fixed', 'Aged A/R followed up'] },
];
const STEP_DELAY = 0.45; // each step lights up after the one before it

const CYCLE_MS = 2800;

/**
 * How it works: one normal-height fold inside a rounded purple panel (no pinned scroll).
 * The panel has a soft light that follows the cursor and two slow drifting glows.
 * Steps are joined by connectors (horizontal on desktop, vertical on phones) with a pulse travelling along them.
 * While the fold is on screen the highlight walks 01 → 02 → 03 on a timer; hover or focus takes over.
 */
export function Process() {
  const [hot, setHot] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const seen = useInView(panel, { amount: 0.35 });
  useEffect(() => {
    if (!seen || hot !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setAuto((a) => (a + 1) % STEPS.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, [seen, hot]);
  const active = hot ?? auto;
  const onMove = (e: React.MouseEvent) => {
    const el = panel.current; if (!el) return; const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section className="process" id="process">
      <div className="process__panel" ref={panel} onMouseMove={onMove}>
        <span className="process__glow process__glow--a" aria-hidden />
        <span className="process__glow process__glow--b" aria-hidden />
        <span className="process__spot" aria-hidden />
        <div className="process__head">
          <Eyebrow className="eyebrow--light">/ How it works</Eyebrow>
          <SplitWords className="h-64 process__title" lines={['Care moves forward.', 'Your revenue should too.']} stagger={0.04} />
        </div>

        <div className="prail" aria-hidden style={{ ['--p' as string]: active / (STEPS.length - 1) }}>
          <span className="prail__track"><i className="prail__fill" /></span>
          {STEPS.map((s, i) => (
            <span key={s.n} className={`prail__node ${active >= i ? 'is-on' : ''} ${active === i ? 'is-now' : ''}`}>
              <b>{s.n}</b><i className="prail__stem" />
            </span>
          ))}
        </div>
        <motion.ol className="process__steps" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
          {STEPS.map((s, i) => (
            <Fragment key={s.n}>
            <motion.li className={`pstep ${active === i ? 'is-hot' : ''}`} tabIndex={0}
              onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.out, delay: 0.1 + i * 0.12 } } }}>
              <div className="pstep__top">
                <motion.span className="pstep__num"
                  variants={{ hidden: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#ffffff' }, show: { backgroundColor: '#ffffff', color: '#6a41f9', transition: { duration: 0.4, delay: 0.2 + i * STEP_DELAY } } }}>
                  {s.n}
                </motion.span>
                <span className="pstep__title">{s.title}</span>
              </div>
              <h3 className="pstep__head">{s.head}</h3>
              <ul className="pstep__list">
                {s.items.map((it, k) => (
                  <li key={it}>
                    <motion.span className="pstep__tick" aria-hidden
                      variants={{ hidden: { scale: 0.4, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 420, damping: 22, delay: 0.45 + i * STEP_DELAY + k * 0.1 } } }}>
                      <Check strokeWidth={3} />
                    </motion.span>
                    {it}
                  </li>
                ))}
              </ul>
            </motion.li>
            </Fragment>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
