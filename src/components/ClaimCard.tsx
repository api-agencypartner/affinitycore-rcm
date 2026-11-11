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
    <div className={String.raw`claim [width:46rem] [padding:2.8rem] [border-radius:2.4rem] [background:rgba(255,_255,_255,_0.94)] [backdrop-filter:blur(2rem)] [border:1px_solid_rgba(255,_255,_255,_0.8)] [box-shadow:0_3rem_8rem_rgba(40,_20,_120,_0.22)] [color:var(--navy)] [font-family:var(--f-man)] [.jr\_\_claim_&]:[box-shadow:0_3rem_8rem_rgba(20,_0,_80,_0.4)] [@media(max-width:_1279px)]:[width:100%] [.jy\_\_claim_&]:[box-shadow:0_3rem_8rem_rgba(57,_28,_160,_0.16),_0_0.4rem_1.2rem_rgba(57,_28,_160,_0.06)] ${className}`}>
      <div className="claim__head [display:flex] [justify-content:space-between] [align-items:center] [&_small]:[display:block] [&_small]:[font-size:1.2rem] [&_small]:[letter-spacing:0.1rem] [&_small]:[text-transform:uppercase] [&_small]:[color:#8a8ea0] [&_b]:[font-weight:700] [&_b]:[font-size:2rem] [&_b]:[letter-spacing:-0.02rem]">
        <div>
          <small>Claim</small>
          <b>CLM-24-118 406</b>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={s} className="claim__chip [display:inline-flex] [align-items:center] [gap:0.5rem] [padding:0.6rem_1.2rem] [border-radius:4rem] [border:1px_solid] [font-weight:600] [font-size:1.3rem] [white-space:nowrap]" style={{ color: TONE[s], background: `${TONE[s]}14`, borderColor: `${TONE[s]}33` }}
            initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} transition={{ duration: 0.45, ease: ease.out }}>
            {s === 5 && <Check size={14} strokeWidth={3} />}{STATUS[s]}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="claim__meta [display:flex] [justify-content:space-between] [margin-top:1rem] [font-size:1.3rem] [color:#6b6f7c]"><span>J. Rivera · Cardiology</span><span>DOS 09/12/2026</span></div>
      <ul className="claim__lines [margin-top:1.8rem] [border-top:1px_dashed_#e2def0] [&_li]:[display:grid] [&_li]:[grid-template-columns:6.4rem_1fr_auto] [&_li]:[gap:1.2rem] [&_li]:[align-items:center] [&_li]:[padding:1.1rem_0] [&_li]:[border-bottom:1px_dashed_#e2def0] [&_li]:[font-size:1.4rem] [&_code]:[font-family:var(--f-mono)] [&_code]:[font-size:1.3rem] [&_code]:[color:var(--purple)] [&_code]:[background:#f1edff] [&_code]:[border-radius:0.6rem] [&_code]:[padding:0.3rem_0.6rem] [&_code]:[text-align:center] [&_b]:[font-weight:700] [&_b]:[font-variant-numeric:tabular-nums]">
        {[['99214', 'Office visit, moderate', 186], ['93000', 'Electrocardiogram', 74], ['78452', 'Perfusion imaging', 1240]].map(([c, d, v], i) => (
          <li key={c as string}>
            <code>{c}</code><span>{d}</span>
            <motion.b animate={{ color: s === 5 ? '#12a150' : s === 4 && i === 2 ? '#d1435b' : '#111645' }} transition={{ duration: 0.5 }}>
              ${(v as number).toLocaleString('en-US')}
            </motion.b>
          </li>
        ))}
      </ul>
      <div className="claim__total [display:flex] [justify-content:space-between] [margin-top:1.2rem] [font-size:1.5rem] [&_b]:[font-weight:800] [&_b]:[font-size:1.8rem]"><span>Total</span><b>$1,500.00</b></div>
      <div className="claim__track [position:relative] [display:grid] [grid-template-columns:repeat(5,_1fr)] [margin-top:2.4rem]" aria-hidden>
        <div className="claim__rail [position:absolute] [left:10%] [right:10%] [top:0.6rem] [height:0.3rem] [border-radius:1rem] [background:#ece8fb] [overflow:hidden] [&_i]:[display:block] [&_i]:[height:100%] [&_i]:[transform-origin:left] [&_i]:[background:var(--grad-x)]"><motion.i animate={{ scaleX: s / 5 }} transition={{ duration: 0.7, ease: ease.out }} /></div>
        {STATIONS.map((st, i) => (
          <span key={st.n} className={String.raw`claim__dot [position:relative] [display:flex] [flex-direction:column] [align-items:center] [gap:0.8rem] [&_i]:[width:1.5rem] [&_i]:[height:1.5rem] [&_i]:[border-radius:50%] [&_i]:[background:#fff] [&_i]:[border:0.3rem_solid_#ddd7f3] [&_i]:[transition:background_0.4s,_border-color_0.4s] [&.is-done_i]:[background:var(--purple)] [&.is-done_i]:[border-color:var(--purple)] [&.is-now_i]:[background:var(--purple)] [&.is-now_i]:[border-color:var(--purple)] [&.is-now_i]:[box-shadow:0_0_0_0.6rem_rgba(106,_65,_249,_0.18)] [&_small]:[font-size:1.15rem] [&_small]:[color:#8a8ea0] [&_small]:[white-space:nowrap] [&.is-now_small]:[color:var(--purple)] [&.is-now_small]:[font-weight:700] ${i <= s - 0 && i < s ? String.raw`is-done [.pp\_\_list_li&]:[color:var(--ink-2)] [.pa-art\_\_steps_li&]:[color:#6a41f9]` : ''} ${i === s ? String.raw`is-now [.sc-stat\_\_bars_i&]:[background:var(--grad)]` : ''}`}>
            <motion.i animate={{ scale: i === s ? 1.25 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} />
            <small>{st.short}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
