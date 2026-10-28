import { motion } from 'motion/react';
import { Phone, Check } from 'lucide-react';

/**
 * Blog covers as tiny scenes from a practice's day, the things doctors and office managers
 * actually stare at: an EOB with a denial, a claim box missing its modifier, a timely-filing
 * countdown, a payer hold screen, a sticky note on the front desk, a KPI moving the right way.
 * Pure CSS/SVG in the purple palette, so every cover is on-brand and costs no stock photo.
 */
export type Cover =
  | { k: 'eob'; code: string; desc: string; amt: string; reason: string; stamp: string }
  | { k: 'claim'; code: string; mod: string; box: string; label: string }
  | { k: 'clock'; n: number; of: number; unit: string; label: string }
  | { k: 'hold'; payer: string; time: string; label: string }
  | { k: 'sticky'; note: string; sub: string }
  | { k: 'stat'; from: string; to: string; label: string; bars: number[] };

const lift = { rest: { y: 0, rotate: -2 }, hover: { y: -6, rotate: -1, transition: { type: 'spring', stiffness: 260, damping: 18 } } } as const;

function EOB({ c }: { c: Extract<Cover, { k: 'eob' }> }) {
  return (
    <motion.div className="sc sc--paper" variants={lift}>
      <p className="sc__k">Explanation of benefits</p>
      <div className="sc-eob__row sc-eob__head"><span>Code</span><span>Service</span><span>Paid</span><span>Reason</span></div>
      <div className="sc-eob__row"><code>{c.code}</code><span>{c.desc}</span><b>{c.amt}</b>
        <em>{c.reason}<svg viewBox="0 0 80 34" aria-hidden><path d="M8 18 C 6 4, 70 2, 74 16 S 30 34, 12 26" /></svg></em>
      </div>
      <div className="sc-eob__row sc-eob__ghost"><i /><i /><i /><i /></div>
      <motion.span className="sc__stamp" variants={{ rest: { scale: 1, rotate: -12 }, hover: { scale: 1.08, rotate: -8 } }}>{c.stamp}</motion.span>
    </motion.div>
  );
}

function Claim({ c }: { c: Extract<Cover, { k: 'claim' }> }) {
  return (
    <motion.div className="sc sc--paper sc-claim" variants={lift}>
      <p className="sc__k">CMS-1500 · {c.box}</p>
      <div className="sc-claim__grid">
        <div><small>CPT/HCPCS</small><b>{c.code}</b></div>
        <div className="is-mod"><small>Modifier</small>
          <b><motion.span variants={{ rest: { opacity: 1 }, hover: { opacity: 1 } }}>{c.mod}</motion.span><i className="sc-claim__caret" /></b>
        </div>
      </div>
      <p className="sc-claim__note"><svg viewBox="0 0 120 12" aria-hidden><path d="M2 8 C 30 2, 60 12, 90 6 S 112 4, 118 7" /></svg>{c.label}</p>
    </motion.div>
  );
}

function Clock({ c }: { c: Extract<Cover, { k: 'clock' }> }) {
  const R = 46, C = 2 * Math.PI * R, p = Math.min(1, c.n / c.of);
  return (
    <motion.div className="sc sc--paper sc-clock" variants={lift}>
      <svg viewBox="0 0 120 120" aria-hidden>
        <circle cx="60" cy="60" r={R} className="sc-clock__track" />
        <motion.circle cx="60" cy="60" r={R} className="sc-clock__arc" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - p) }} viewport={{ once: true }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="sc-clock__n"><b>{c.n}</b><small>of {c.of} {c.unit}</small></div>
      <p className="sc-clock__label">{c.label}</p>
    </motion.div>
  );
}

function Hold({ c }: { c: Extract<Cover, { k: 'hold' }> }) {
  return (
    <motion.div className="sc sc-hold" variants={lift}>
      <span className="sc-hold__icon"><Phone size={18} /></span>
      <p className="sc-hold__payer">{c.payer}</p>
      <p className="sc-hold__time">{c.time}</p>
      <div className="sc-hold__wave" aria-hidden>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 6) * 0.12}s`, height: `${30 + ((i * 37) % 60)}%` }} />)}</div>
      <p className="sc-hold__label">{c.label}</p>
    </motion.div>
  );
}

function Sticky({ c }: { c: Extract<Cover, { k: 'sticky' }> }) {
  return (
    <div className="sc-sticky-wrap">
      <div className="sc sc--paper sc-cal" aria-hidden>
        {Array.from({ length: 21 }, (_, i) => <i key={i} className={i === 15 ? 'is-on' : ''}>{i + 1}</i>)}
      </div>
      <motion.div className="sc-sticky" variants={{ rest: { rotate: 4, y: 0 }, hover: { rotate: 1, y: -6 } }}>
        <p>{c.note}</p><small>{c.sub}</small>
      </motion.div>
    </div>
  );
}

function Stat({ c }: { c: Extract<Cover, { k: 'stat' }> }) {
  const max = Math.max(...c.bars);
  return (
    <motion.div className="sc sc--paper sc-stat" variants={lift}>
      <p className="sc__k">{c.label}</p>
      <p className="sc-stat__n"><s>{c.from}</s><span>→</span><b>{c.to}</b></p>
      <div className="sc-stat__bars" aria-hidden>
        {c.bars.map((v, i) => <motion.i key={i} initial={{ scaleY: 0 }} whileInView={{ scaleY: v / max }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} className={i === c.bars.length - 1 ? 'is-now' : ''} />)}
      </div>
      <span className="sc-stat__ok"><Check size={12} strokeWidth={3} /></span>
    </motion.div>
  );
}

export function SceneCover({ c }: { c: Cover }) {
  return (
    <div className={`scene scene--${c.k}`} aria-hidden>
      {c.k === 'eob' && <EOB c={c} />}
      {c.k === 'claim' && <Claim c={c} />}
      {c.k === 'clock' && <Clock c={c} />}
      {c.k === 'hold' && <Hold c={c} />}
      {c.k === 'sticky' && <Sticky c={c} />}
      {c.k === 'stat' && <Stat c={c} />}
    </div>
  );
}
