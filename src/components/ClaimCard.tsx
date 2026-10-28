import { motion, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { STATIONS } from '../data/services';
import { ease } from '../motion';

/**
 * The claim that travels through the services. `step` 0–4 = station, 5 = paid.
 * Used in the Services hub hero (auto-cycling) and the pinned journey (scroll-driven).
 */
const STATUS = ['Scheduled', 'Coded', 'Submitted', 'Remittance in', 'Denied → appealed', 'Paid'];
const TONE = ['#6b6f7c', '#6a41f9', '#2b6fe3', '#c77c00', '#d1435b', '#12a150'];

export function ClaimCard({ step, className = '' }: { step: number; className?: string }) {
  const s = Math.max(0, Math.min(5, step));
  return (
    <div className={`claim ${className}`}>
      <div className="claim__head">
        <div>
          <small>Claim</small>
          <b>CLM-24-118 406</b>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={s} className="claim__chip" style={{ color: TONE[s], background: `${TONE[s]}14`, borderColor: `${TONE[s]}33` }}
            initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.45, ease: ease.out }}>
            {s === 5 && <Check size={14} strokeWidth={3} />}{STATUS[s]}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="claim__meta"><span>J. Rivera · Cardiology</span><span>DOS 09/12/2026</span></div>
      <ul className="claim__lines">
        {[['99214', 'Office visit, moderate', 186], ['93000', 'Electrocardiogram', 74], ['78452', 'Perfusion imaging', 1240]].map(([c, d, v], i) => (
          <li key={c as string}>
            <code>{c}</code><span>{d}</span>
            <motion.b animate={{ color: s === 5 ? '#12a150' : s === 4 && i === 2 ? '#d1435b' : '#111645' }} transition={{ duration: 0.5 }}>
              ${(v as number).toLocaleString('en-US')}
            </motion.b>
          </li>
        ))}
      </ul>
      <div className="claim__total"><span>Total</span><b>$1,500.00</b></div>
      <div className="claim__track" aria-hidden>
        <div className="claim__rail"><motion.i animate={{ scaleX: s / 5 }} transition={{ duration: 0.7, ease: ease.out }} /></div>
        {STATIONS.map((st, i) => (
          <span key={st.n} className={`claim__dot ${i <= s - 0 && i < s ? 'is-done' : ''} ${i === s ? 'is-now' : ''}`}>
            <motion.i animate={{ scale: i === s ? 1.25 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} />
            <small>{st.short}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
